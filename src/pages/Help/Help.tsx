import React from 'react'
import { Link, Outlet, useLocation } from 'react-router-dom'

const Help = () => {
const {pathname} = useLocation()
  return (
    <div className="container mx-auto px-4 py-8">
          <div className="mb-5">
            <h1 className="text-3xl font-bold text-foreground">Help Center</h1>
          </div>
          <div className="flex gap-4 items-center">
          <Link to='' className={ pathname === '/help' ? 'bg-gradient-primary active-selector' : 'inactive'}>
          Contact us</Link>
          <Link to='faqs' className={ pathname === '/help/faqs' ? 'bg-gradient-primary active-selector'
             : 'inactive'}>FAQs</Link>
        </div>
        <Outlet/>
          </div>
  )
}

export default Help