import { Card } from '@/components/ui/card';
import DataTable from '@/components/ui/data-table';
import React,{useState, useContext, useMemo, useEffect} from 'react'
import { Link } from 'react-router-dom';

const Withdrawal = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pageCount, setPageCount] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [pageNumber, setPageNumber] = useState(0)
  const fetchIdRef = React.useRef(0);

 
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

 const WithdrawalData = [
  { id: 1, date: "2025-08-01", shareType: "Ordinary",   unit: 10, amount: 500,  status: "Active" },
  { id: 2, date: "2025-08-05", shareType: "Preference", unit: 20, amount: 1200, status: "Pending" },
  { id: 3, date: "2025-08-10", shareType: "Ordinary",   unit: 5,  amount: 250,  status: "Active" },
  { id: 4, date: "2025-08-12", shareType: "Preference", unit: 15, amount: 900,  status: "Closed" },
  { id: 5, date: "2025-08-15", shareType: "Ordinary",   unit: 30, amount: 1500, status: "Approved" },
  { id: 6, date: "2025-08-18", shareType: "Preference", unit: 8,  amount: 400,  status: "Rejected" },
]
  return (
    <>
    <div className="flex justify-between items-center flex-wrap mb-4">
    <h3 className='header-title'>Withdrawal requests</h3>
    <Link to='initiate-withdrawal' className='apply-btn' style={{textDecoration:'none'}}>
    Initiate withdrawal</Link>
     </div>
       <Card className="p-5 rounded-xl">
            <DataTable shareData={WithdrawalData}/>
        </Card>
    </>
  )}
export default Withdrawal
