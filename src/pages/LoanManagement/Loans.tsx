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
      <div className='flex gap-5 items-center mb-5'>
        <Link to='' className={ pathname === '/loans' ? 'bg-gradient-primary active-selector' : 'inactive'}>
      Loan calculator</Link>
      <Link to='apply-for-loan' className={ pathname.includes('loans/apply-for-loan') ?
         'active-selector bg-gradient-primary' : 'inactive'}> Apply for loan</Link>
         </div>
      <Outlet/>
      </div>
  )
}

export default Loans