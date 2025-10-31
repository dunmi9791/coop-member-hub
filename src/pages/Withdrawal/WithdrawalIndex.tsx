import React from 'react'
import { Outlet } from 'react-router-dom'

const WithdrawalIndex = () => {
  return (
    <>
     <div className="container mx-auto px-4 py-8">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Withdrawal Management</h1>
        <p className="text-muted-foreground">Manage your withdrawal</p>
      </div>
    <Outlet />
      </div>
    </>
  )
}

export default WithdrawalIndex