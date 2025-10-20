import React from 'react'
import { Outlet, Link, useLocation } from 'react-router-dom'

const Investments = () => {
  const {pathname} = useLocation()
  return (
   <div className="container mx-auto px-4 py-8 border-0">
         <div className="mb-5">
           <h1 className="text-3xl font-bold text-foreground">Investment Management</h1>
           <p className="text-muted-foreground">Manage your investments</p>
         </div>
         <div className='flex gap-5 items-center mb-5'>
           <Link to='' className={ pathname === '/dashboard/investments' ||
             pathname === '/dashboard/investments/invest' ? 'bg-gradient-primary active-selector' : 'inactive'}>
         Investment portfolio
         </Link>
         <Link to='investment-purchase' className={ pathname.includes('investments/investment-purchase') ?
            'active-selector bg-gradient-primary' : 'inactive'}>Investement purchase requests</Link>
            <Link to='investment-withdrawal' className={ pathname.includes('investments/investment-withdrawal') ?
            'active-selector bg-gradient-primary' : 'inactive'}>Investement withdrawal</Link>
            </div>
         <Outlet/>
         </div>
  )
}

export default Investments