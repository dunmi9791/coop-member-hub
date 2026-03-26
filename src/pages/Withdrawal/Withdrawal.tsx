import { Card } from '@/components/ui/card';
import DataTable from '@/components/ui/data-table';
import React, { useState, useContext, useMemo, useEffect } from 'react'
import { Link } from 'react-router-dom';
import { UserContext } from '@/hooks/AuthContext';
import api from '@/hooks/api';
import { Loader2 } from 'lucide-react';

const Withdrawal = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const { credentials } = useContext(UserContext);

  const fetchWithdrawalHistory = async () => {
    if (!credentials?.partner_id) return;
    setLoading(true);
    try {
      const payload = {
        jsonrpc: '2.0',
        method: 'call',
        params: {
          partner_id: credentials.partner_id
        }
      }
      const resp = await api.post('/api/portal/withdrawal_history', payload);
      if (resp?.data?.result) {
        setData(resp.data.result);
      }
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
    { Header: "Date", accessor: "date", Cell:(({value})=>{
      return <span>{new Date(value).toLocaleDateString()} {new Date(value).toLocaleTimeString()}</span>
    }) },
    { Header: "Account name", accessor: "accountName" },
    { Header: "Amount", accessor: "accountBalance", Cell:(({value})=>{
      return <span>NGN {new Intl.NumberFormat('en-US', {minimumFractionDigits:2}).format(value)}</span>
    }) },
    { Header: "Payment mode", accessor: "paymentMode", Cell:(({value})=>{
      return <div className="d-flex justify-content-center">
       <div className={value ==='Cash' ? 'cash-mode' 
        : value === 'Member bank account'? 'member-mode': 'cheque-mode'}>
          <hr /> <span>{value}</span>
        </div>
        </div>
    }) },
    { Header: "Charges", accessor: "charges", Cell:(({value})=>{
      return <span>NGN {new Intl.NumberFormat('en-US', {minimumFractionDigits:2}).format(value)}</span>
    }) },
    { Header: "Status", accessor: "status", Cell:(({value})=>{
      return <div className={value ==='Pending' ? 'pending-status' 
      : value === 'Posted'? 'approved-status': 'rejected-status'}>
        <hr /> <span>{value === 'Posted' ? 'Approved': value}</span>
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
