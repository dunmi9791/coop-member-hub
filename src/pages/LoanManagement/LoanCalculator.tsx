import React, { useState, useEffect, useContext } from 'react'
import { UserContext } from '@/hooks/AuthContext'
import api from '@/hooks/api'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Loader2, Calculator, Info, Calendar, Percent, Banknote, Receipt, TrendingUp } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import { NumericFormat } from 'react-number-format'

interface LoanProduct {
  id: number;
  name: string;
}

interface RepaymentScheduleItem {
  sequence: number;
  due_date: string;
  principal: number;
  interest: number;
  payment: number;
  balance: number;
}

interface CalculationSummary {
  amount: number;
  loan_type_id: number;
  loan_type_name: string;
  repayment_frequency: string;
  tenure_months: number;
  periods: number;
  apr_percent: number;
  periodic_rate: number;
  amortization_type: string;
  first_repayment_date: string;
  total_principal: number;
  total_interest: number;
  total_payment: number;
  payment_min: number;
  payment_max: number;
  payment_avg: number;
  monthly_amount_note: string;
}

const LoanCalculator = () => {
  const { credentials } = useContext(UserContext)
  const { toast } = useToast()
  
  const [products, setProducts] = useState<LoanProduct[]>([])
  const [loadingProducts, setLoadingProducts] = useState(true)
  const [calculating, setCalculating] = useState(false)
  
  const [formData, setFormData] = useState({
    loanAmount: '',
    loanTypeId: '',
    duration: '12'
  })
  
  const [summary, setSummary] = useState<CalculationSummary | null>(null)
  const [schedule, setSchedule] = useState<RepaymentScheduleItem[]>([])

  useEffect(() => {
    const fetchLoanTypes = async () => {
      try {
        const payload = {
          jsonrpc: '2.0',
          method: 'call',
          params: {},
          id: 1,
        }
        const resp = await api.post('/api/portal/loan_types', payload)
        if (resp.data.result && resp.data.result.loan_types) {
          setProducts(resp.data.result.loan_types)
        }
      } catch (error) {
        console.error('Error fetching loan types:', error)
      } finally {
        setLoadingProducts(false)
      }
    }

    fetchLoanTypes()
  }, [])

  const handleCalculate = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.loanAmount || !formData.loanTypeId) {
      toast({
        title: "Missing Information",
        description: "Please provide loan amount and select a loan type.",
        variant: "destructive"
      })
      return
    }

    setCalculating(true)
    try {
      const payload = {
        jsonrpc: '2.0',
        method: 'call',
        params: {
          amount: formData.loanAmount.toString(),
          tenure_months: formData.duration.toString(),
          loan_type_id: Number(formData.loanTypeId)
        },
        id: 1,
      }
      
      const resp = await api.post('/api/portal/loan_calculator', payload)
      const result = resp.data.result
      if (result && result.success) {
        setSummary(result.summary)
        setSchedule(result.schedule || [])
      } else {
        toast({
          title: "Calculation Failed",
          description: result?.message || "Could not calculate repayment schedule.",
          variant: "destructive"
        })
      }
    } catch (error) {
      console.error('Error calculating loan:', error)
      toast({
        title: "Error",
        description: "An error occurred while calculating the loan.",
        variant: "destructive"
      })
    } finally {
      setCalculating(false)
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
    }).format(amount)
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-10">
      <Card className="border-[#043d73]/20 shadow-sm">
        <CardHeader className="bg-[#043d73] text-white rounded-t-lg py-4">
          <CardTitle className="text-xl font-semibold flex items-center gap-2">
            <Calculator className="h-6 w-6" />
            Loan Calculator
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <form onSubmit={handleCalculate} className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
            <div className="space-y-2">
              <Label htmlFor="loanTypeId" className="text-sm font-semibold text-slate-700">Loan Type</Label>
              <Select 
                value={formData.loanTypeId} 
                onValueChange={(value) => setFormData({...formData, loanTypeId: value})}
              >
                <SelectTrigger id="loanTypeId" className="border-slate-200 focus:ring-[#043d73]">
                  <SelectValue placeholder={loadingProducts ? "Loading..." : "Select loan type"} />
                </SelectTrigger>
                <SelectContent>
                  {products.map((product) => (
                    <SelectItem key={product.id} value={product.id.toString()}>
                      {product.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="loanAmount" className="text-sm font-semibold text-slate-700">Loan Amount (NGN)</Label>
              <NumericFormat
                id="loanAmount"
                customInput={Input}
                thousandSeparator={true}
                placeholder="Enter amount"
                value={formData.loanAmount}
                onValueChange={(values) => setFormData({...formData, loanAmount: values.value})}
                className="border-slate-200 focus:ring-[#043d73]"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="duration" className="text-sm font-semibold text-slate-700">Duration (Months)</Label>
              <Input
                id="duration"
                type="number"
                placeholder="12"
                value={formData.duration}
                onChange={(e) => setFormData({...formData, duration: e.target.value})}
                className="border-slate-200 focus:ring-[#043d73]"
                required
              />
            </div>

            <div className="md:col-span-3 flex justify-end">
              <Button 
                type="submit" 
                className="bg-[#043d73] hover:bg-[#043d73]/90 px-8 py-2 h-auto text-base"
                disabled={calculating}
              >
                {calculating ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Calculating...
                  </>
                ) : (
                  'Calculate Schedule'
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {summary && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-1 border-slate-200 shadow-sm overflow-hidden h-fit">
            <CardHeader className="bg-slate-50 border-b border-slate-100 py-4">
              <CardTitle className="text-lg font-bold text-[#043d73] flex items-center gap-2">
                <Info className="h-5 w-5" />
                Loan Summary
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-slate-100">
                <div className="p-4 flex justify-between items-center">
                  <div className="flex items-center gap-2 text-slate-600">
                    <Banknote className="h-4 w-4" />
                    <span className="text-sm">Total Principal</span>
                  </div>
                  <span className="font-bold text-slate-900">{formatCurrency(summary.total_principal)}</span>
                </div>
                <div className="p-4 flex justify-between items-center">
                  <div className="flex items-center gap-2 text-slate-600">
                    <TrendingUp className="h-4 w-4" />
                    <span className="text-sm">Total Interest</span>
                  </div>
                  <span className="font-bold text-orange-600">{formatCurrency(summary.total_interest)}</span>
                </div>
                <div className="p-4 flex justify-between items-center bg-[#043d73]/5">
                  <div className="flex items-center gap-2 text-[#043d73] font-semibold">
                    <Receipt className="h-4 w-4" />
                    <span className="text-sm">Total Repayment</span>
                  </div>
                  <span className="font-extrabold text-[#043d73] text-lg">{formatCurrency(summary.total_payment)}</span>
                </div>
                <div className="p-4 space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500">APR</span>
                    <span className="font-medium flex items-center gap-1">
                      <Percent className="h-3 w-3" />
                      {summary.apr_percent}%
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500">Tenure</span>
                    <span className="font-medium flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {summary.tenure_months} Months
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500">Frequency</span>
                    <span className="font-medium capitalize">{summary.repayment_frequency}</span>
                  </div>
                </div>
                {summary.monthly_amount_note && (
                  <div className="p-4 bg-blue-50/50">
                    <p className="text-xs text-blue-700 italic">
                      {summary.monthly_amount_note}
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <Card className="lg:col-span-2 border-slate-200 shadow-sm overflow-hidden">
            <CardHeader className="bg-slate-50 border-b border-slate-100 py-4 flex flex-row items-center justify-between">
              <CardTitle className="text-lg font-bold text-[#043d73]">Repayment Schedule</CardTitle>
              <div className="text-xs bg-white px-2 py-1 rounded border border-slate-200 font-medium text-slate-500">
                {summary.periods} Periods
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader className="bg-slate-50/50">
                    <TableRow>
                      <TableHead className="w-[60px] text-center font-bold">#</TableHead>
                      <TableHead className="font-bold">Due Date</TableHead>
                      <TableHead className="text-right font-bold">Principal</TableHead>
                      <TableHead className="text-right font-bold">Interest</TableHead>
                      <TableHead className="text-right font-bold text-[#043d73]">Payment</TableHead>
                      <TableHead className="text-right font-bold">Balance</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {schedule.map((item) => (
                      <TableRow key={item.sequence} className="hover:bg-slate-50/50 transition-colors">
                        <TableCell className="text-center font-medium text-slate-500">{item.sequence}</TableCell>
                        <TableCell className="font-medium">{item.due_date}</TableCell>
                        <TableCell className="text-right">{formatCurrency(item.principal)}</TableCell>
                        <TableCell className="text-right">{formatCurrency(item.interest)}</TableCell>
                        <TableCell className="text-right font-bold text-[#043d73]">{formatCurrency(item.payment)}</TableCell>
                        <TableCell className="text-right text-slate-600">{formatCurrency(item.balance)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}

export default LoanCalculator
