import Scroller from '@/components/ui/Scroller'
import React from 'react'
import { Outlet, Link, useLocation } from 'react-router-dom'
import { Card, CardContent } from '@/components/ui/card'
import { Building2, TrendingUp, Wallet, BarChart3 } from 'lucide-react'

const RealEstateInvestment = () => {
  const { pathname } = useLocation()

  // Demo portfolio data
  const portfolioData = {
    totalInvested: 5000000,
    currentValue: 5750000,
    totalReturns: 750000,
    activeInvestments: 3,
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
        <h1 className="text-3xl font-bold text-foreground">Real Estate Investment</h1>
        <p className="text-muted-foreground">Invest in premium real estate opportunities</p>
      </div>

      {/* Portfolio Mini Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Invested</p>
                <p className="text-xl font-bold text-foreground">{formatCurrency(portfolioData.totalInvested)}</p>
              </div>
              <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center">
                <Wallet className="h-5 w-5 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-500/10 to-green-500/5 border-green-500/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Current Value</p>
                <p className="text-xl font-bold text-foreground">{formatCurrency(portfolioData.currentValue)}</p>
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
                <p className="text-sm text-muted-foreground">Total Returns</p>
                <p className="text-xl font-bold text-foreground">{formatCurrency(portfolioData.totalReturns)}</p>
              </div>
              <div className="h-10 w-10 rounded-full bg-amber-500/20 flex items-center justify-center">
                <BarChart3 className="h-5 w-5 text-amber-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-500/10 to-blue-500/5 border-blue-500/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Active Investments</p>
                <p className="text-xl font-bold text-foreground">{portfolioData.activeInvestments}</p>
              </div>
              <div className="h-10 w-10 rounded-full bg-blue-500/20 flex items-center justify-center">
                <Building2 className="h-5 w-5 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Scroller>
        <div className='flex gap-5 items-center mb-5 border-b border-b-primary/20'>
          <Link to='' className={pathname === '/dashboard/real-estate' ? 'active-selector bg-gradient-primary' : 'inactive'}>
            Available Investments
          </Link>
          <Link to='my-investments' className={pathname.includes('real-estate/my-investments') ? 'active-selector bg-gradient-primary' : 'inactive'}>
            My Investments
          </Link>
        </div>
      </Scroller>
      <Outlet />
    </div>
  )
}

export default RealEstateInvestment
