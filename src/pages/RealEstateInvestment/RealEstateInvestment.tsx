import Scroller from '@/components/ui/Scroller'
import React, { useEffect, useState } from 'react'
import { Outlet, Link, useLocation } from 'react-router-dom'
import { Card, CardContent } from '@/components/ui/card'
import { BarChart3, Building2, TrendingUp, Wallet } from 'lucide-react'
import { fetchCashCalls, fetchMyInvestments, MyInvestmentsResult } from '@/services/realEstateApi'

const RealEstateInvestment = () => {
  const { pathname } = useLocation()
  const [pendingCashCalls, setPendingCashCalls] = useState(0)

  useEffect(() => {
    fetchCashCalls()
      .then((res) => setPendingCashCalls(res.pending_count))
      .catch(() => setPendingCashCalls(0))
  }, [pathname])

  const [summary, setSummary] = useState<MyInvestmentsResult['summary'] | null>(null)

  useEffect(() => {
    fetchMyInvestments()
      .then((res) => setSummary(res.summary))
      .catch(() => setSummary(null))
  }, [])

  const formatMoney = (amount: number) =>
    new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: summary?.currency?.name || 'NGN',
      minimumFractionDigits: 0,
    }).format(amount || 0)

  const cards = summary
    ? [
        { label: 'Total Committed', value: formatMoney(summary.total_committed), icon: Wallet, tone: 'primary' },
        { label: 'Total Paid', value: formatMoney(summary.total_paid), icon: TrendingUp, tone: 'green' },
        { label: 'Outstanding', value: formatMoney(summary.total_outstanding), icon: BarChart3, tone: 'amber' },
        { label: 'Active Investments', value: String(summary.active_count), icon: Building2, tone: 'blue' },
      ]
    : []

  const toneClasses: Record<string, { card: string; bubble: string; icon: string }> = {
    primary: { card: 'from-primary/10 to-primary/5 border-primary/20', bubble: 'bg-primary/20', icon: 'text-primary' },
    green: { card: 'from-green-500/10 to-green-500/5 border-green-500/20', bubble: 'bg-green-500/20', icon: 'text-green-600' },
    amber: { card: 'from-amber-500/10 to-amber-500/5 border-amber-500/20', bubble: 'bg-amber-500/20', icon: 'text-amber-600' },
    blue: { card: 'from-blue-500/10 to-blue-500/5 border-blue-500/20', bubble: 'bg-blue-500/20', icon: 'text-blue-600' },
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-5">
        <h1 className="text-3xl font-bold text-foreground">Real Estate Investment</h1>
        <p className="text-muted-foreground">Invest in premium real estate opportunities</p>
      </div>

      {summary && summary.active_count > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {cards.map(({ label, value, icon: Icon, tone }) => (
            <Card key={label} className={`bg-gradient-to-br ${toneClasses[tone].card}`}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">{label}</p>
                    <p className="text-xl font-bold text-foreground">{value}</p>
                  </div>
                  <div className={`h-10 w-10 rounded-full flex items-center justify-center ${toneClasses[tone].bubble}`}>
                    <Icon className={`h-5 w-5 ${toneClasses[tone].icon}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Scroller>
        <div className='flex gap-5 items-center mb-5 border-b border-b-primary/20'>
          <Link to='' className={pathname === '/dashboard/real-estate' ? 'active-selector bg-gradient-primary' : 'inactive'}>
            Available Investments
          </Link>
          <Link to='my-investments' className={pathname.includes('real-estate/my-investments') ? 'active-selector bg-gradient-primary' : 'inactive'}>
            My Investments
          </Link>
          <Link to='cash-calls' className={pathname.includes('real-estate/cash-calls') ? 'active-selector bg-gradient-primary' : 'inactive'}>
            Cash Calls
            {pendingCashCalls > 0 && (
              <span className='ml-2 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-destructive px-1.5 text-xs text-white'>
                {pendingCashCalls}
              </span>
            )}
          </Link>
        </div>
      </Scroller>
      <Outlet />
    </div>
  )
}

export default RealEstateInvestment
