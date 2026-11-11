import { Card } from '@/components/ui/card';
import DataTable from '@/components/ui/data-table';
import React, { useState, useContext, useMemo, useEffect } from 'react'
import { Link } from 'react-router-dom';
import { UserContext } from '@/hooks/AuthContext';
import api from '@/hooks/api';
import { Loader2 } from 'lucide-react';

const STATE_LABELS: Record<string, string> = {
  draft: 'Draft',
  submitted: 'Pending',
  approved: 'Approved',
  disbursed: 'Disbursed',
  rejected: 'Rejected',
  cancelled: 'Cancelled',
};

const Withdrawal = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const { credentials } = useContext(UserContext);

  const fetchWithdrawalHistory = async () => {
    if (!credentials) {
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      // The backend scopes the list to the logged-in member's session
      const payload = {
        jsonrpc: '2.0',
        method: 'call',
        params: {}
      }
      const resp = await api.post('/api/portal/withdrawal_requests', payload);
      const list = resp?.data?.result?.withdrawal_requests;
      setData(Array.isArray(list) ? list : []);
    } catch (error) {
      console.error("Error fetching withdrawal history:", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchWithdrawalHistory();
  }, [credentials]);

 
  const column = [
    { Header: "S/N", accessor: "", Cell:(({cell, state})=>{
      return <span>{cell.row.index+1 + state.pageIndex * state.pageSize}</span>
    }) },
    { Header: "Reference", accessor: "name" },
    { Header: "Date", accessor: "request_date", Cell:(({value})=>{
      if (!value) return <span>-</span>;
      // Odoo sends "YYYY-MM-DD HH:MM:SS" (UTC); make it ISO so every browser parses it
      const d = new Date(String(value).replace(' ', 'T') + 'Z');
      return <span>{d.toLocaleDateString()} {d.toLocaleTimeString()}</span>
    }) },
    { Header: "Account", accessor: "savings_account_name" },
    { Header: "Amount", accessor: "amount", Cell:(({value})=>{
      return <span>NGN {new Intl.NumberFormat('en-US', {minimumFractionDigits:2}).format(value || 0)}</span>
    }) },
    { Header: "Status", accessor: "state", Cell:(({value})=>{
      const label = STATE_LABELS[value] || value;
      const cls = ['approved', 'disbursed'].includes(value) ? 'approved-status'
        : ['rejected', 'cancelled'].includes(value) ? 'rejected-status' : 'pending-status';
      return <div className={cls}>
        <hr /> <span>{label}</span>
      </div>
    }) },
  ];

  const columns = useMemo(() => column, []);

  return (
    <>
      <h3 className='header-title mb-4'>Withdrawal requests</h3>
      <Card className="p-5 rounded-xl mb-6">
        {loading ? (
          <div className="flex justify-center p-10">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <DataTable shareData={data} columns={columns} />
        )}
      </Card>
      <div className="flex justify-start">
        <Link to='initiate-withdrawal' className='apply-btn' style={{ textDecoration: 'none' }}>
          Initiate withdrawal
        </Link>
      </div>
    </>
  )
}
export default Withdrawal
