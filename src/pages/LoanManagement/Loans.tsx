import Scroller from '@/components/ui/Scroller'
import React, { useState, useEffect, useContext } from 'react'
import { Outlet, Link, useLocation } from 'react-router-dom'
import { Card, CardContent } from '@/components/ui/card'
import { Wallet, TrendingUp, CreditCard, Calculator, Loader2 } from 'lucide-react'
import { UserContext } from '@/hooks/AuthContext'
import api from '@/hooks/api'

interface LoanManagementData {
  member_id: number;
  currency: {
    id: number;
    name: string;
    symbol: string;
  };
  total_lpp: number;
  total_active_loans: number;
  basic_meal_transport: number;
  minimum_take_home: number;
  current_take_home: number;
  total_loan_deductions: number;
  saving_contribution: number;
  total_company_deductions: number;
  other_deductions: any[];
  contribution_deductions: any[];
}

const Loans = () => {
  const { pathname } = useLocation()
  const { credentials } = useContext(UserContext)
  const [data, setData] = useState<LoanManagementData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchLoanManagement = async () => {
      try {
        const payload = {
          jsonrpc: '2.0',
          method: 'call',
          params: {
            partner_id: credentials?.partner_id,
          },
          id: 1,
        }
        const resp = await api.post('/api/portal/loan_management', payload)
        if (resp.data.result) {
          setData(resp.data.result)
        }
      } catch (error) {
        console.error('Error fetching loan management data:', error)
      } finally {
        setLoading(false)
      }
    }

    if (credentials?.partner_id) {
      fetchLoanManagement()
    } else {
      setLoading(false)
    }
  }, [credentials])

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: data?.currency?.name || 'NGN',
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
      {loading ? (
        <div className="flex justify-center items-center py-10">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total LPP</p>
                  <p className="text-xl font-bold text-foreground">{formatCurrency(data?.total_lpp || 0)}</p>
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
                  <p className="text-sm text-muted-foreground">Total Active Loans</p>
                  <p className="text-xl font-bold text-foreground">{formatCurrency(data?.total_active_loans || 0)}</p>
                </div>
                <div className="h-10 w-10 rounded-full bg-destructive/20 flex items-center justify-center">
                  <CreditCard className="h-5 w-5 text-destructive" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      <Scroller>
        <div className='flex gap-5 items-center mb-5 border-b border-b-primary/20'>
          <Link to='' className={pathname === '/dashboard/loans' ? 'active-selector bg-gradient-primary' : 'inactive'}>
            LPP details
          </Link>
          <Link to='active-loans' className={pathname === '/dashboard/loans/active-loans' ? 'active-selector bg-gradient-primary' : 'inactive'}>
            Active loans
          </Link>
          <Link to='apply' className={pathname === '/dashboard/loans/apply' ? 'active-selector bg-gradient-primary' : 'inactive'}>
            Apply for loan
          </Link>
          <Link to='loan-requests' className={pathname.includes('loans/loan-requests') ? 'active-selector bg-gradient-primary' : 'inactive'}>
            Loan requests
          </Link>
          <Link to='loan-calculator' className={pathname === '/dashboard/loans/loan-calculator' ? 'active-selector bg-gradient-primary' : 'inactive'}>
            Loan calculator
          </Link>
        </div>
      </Scroller>
      <Outlet />
    </div>
  )
}

export default Loans