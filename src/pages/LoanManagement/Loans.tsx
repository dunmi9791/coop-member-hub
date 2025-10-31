import Scroller from '@/components/ui/Scroller'
import React from 'react'
import { Outlet, Link, useLocation } from 'react-router-dom'

const Loans = () => {
  const {pathname}= useLocation()
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-5">
        <h1 className="text-3xl font-bold text-foreground">Loan Management</h1>
        <p className="text-muted-foreground">Manage your loans</p>
      </div>
      <Scroller>
      <div className='flex gap-5 items-center mb-5 border-b border-b-primary/20'>
        <Link to='' className={ pathname === '/dashboard/loans' ? 'bg-gradient-primary active-selector' : 'inactive'}>
      Loan calculator</Link>
      <Link to='apply-for-loan' className={ pathname.includes('loans/apply-for-loan') ?
         'active-selector bg-gradient-primary' : 'inactive'}> Apply for loan</Link>
         <Link to='loan-requests' className={ pathname.includes('loans/loan-requests') ?
         'active-selector bg-gradient-primary' : 'inactive'}> Loan requests</Link>
         <Link to='view-loan-repayments' className={ pathname.includes('loans/view-loan-repayments') ?
         'active-selector bg-gradient-primary' : 'inactive'}> View loan repayment</Link>
         <Link to='loan-reschedule' className={ pathname.includes('loans/loan-reschedule') ?
         'active-selector bg-gradient-primary' : 'inactive'}> Loan reschedule</Link>
         </div>
         </Scroller>
      <Outlet/>
      </div>
  )
}

export default Loans