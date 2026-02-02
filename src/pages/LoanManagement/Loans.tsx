import Scroller from '@/components/ui/Scroller'
import React from 'react'
import { Outlet, Link, useLocation } from 'react-router-dom'
import { Card, CardContent } from '@/components/ui/card'
import { Wallet, TrendingUp, CreditCard, Calculator } from 'lucide-react'

const Loans = () => {
  const { pathname } = useLocation()

  // Demo LPP data - in real app, this would come from an API
  const lppData = {
    totalLPP: 2500000,
    usedLPP: 1200000,
    availableLPP: 1300000,
    lppPercentage: 48,
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
    }).format(amount)
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-5">
        <h1 className="text-3xl font-bold text-foreground">Loan Management</h1>
        <p className="text-muted-foreground">Manage your loans</p>
      </div>

      {/* LPP Mini Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total LPP</p>
                <p className="text-xl font-bold text-foreground">{formatCurrency(lppData.totalLPP)}</p>
              </div>
              <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center">
                <Wallet className="h-5 w-5 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-destructive/10 to-destructive/5 border-destructive/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Used LPP</p>
                <p className="text-xl font-bold text-foreground">{formatCurrency(lppData.usedLPP)}</p>
              </div>
              <div className="h-10 w-10 rounded-full bg-destructive/20 flex items-center justify-center">
                <CreditCard className="h-5 w-5 text-destructive" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-500/10 to-green-500/5 border-green-500/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Available LPP</p>
                <p className="text-xl font-bold text-foreground">{formatCurrency(lppData.availableLPP)}</p>
              </div>
              <div className="h-10 w-10 rounded-full bg-green-500/20 flex items-center justify-center">
                <TrendingUp className="h-5 w-5 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-amber-500/10 to-amber-500/5 border-amber-500/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">LPP Utilization</p>
                <p className="text-xl font-bold text-foreground">{lppData.lppPercentage}%</p>
              </div>
              <div className="h-10 w-10 rounded-full bg-amber-500/20 flex items-center justify-center">
                <Calculator className="h-5 w-5 text-amber-600" />
              </div>
            </div>
            <div className="mt-2 h-2 bg-muted rounded-full overflow-hidden">
              <div 
                className="h-full bg-amber-500 rounded-full transition-all duration-500"
                style={{ width: `${lppData.lppPercentage}%` }}
              />
            </div>
          </CardContent>
        </Card>
      </div>

      <Scroller>
        <div className='flex gap-5 items-center mb-5 border-b border-b-primary/20'>
          <Link to='' className={pathname === '/dashboard/loans' ? 'active-selector bg-gradient-primary' : 'inactive'}>
            Apply for loan
          </Link>
          <Link to='loan-requests' className={pathname.includes('loans/loan-requests') ? 'active-selector bg-gradient-primary' : 'inactive'}>
            Loan requests
          </Link>
          <Link to='view-loan-repayments' className={pathname.includes('loans/view-loan-repayments') ? 'active-selector bg-gradient-primary' : 'inactive'}>
            View loan repayment
          </Link>
          <Link to='loan-reschedule' className={pathname.includes('loans/loan-reschedule') ? 'active-selector bg-gradient-primary' : 'inactive'}>
            Loan reschedule
          </Link>
        </div>
      </Scroller>
      <Outlet />
    </div>
  )
}

export default Loans