import { MoveLeft, Loader2 } from 'lucide-react'
import React, { useState, useEffect, useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '@/hooks/api'
import { UserContext } from '@/hooks/AuthContext'
import { toast } from '@/components/ui/use-toast'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

const RescheduleSavings = () => {
  const navigate = useNavigate()
  const { credentials } = useContext(UserContext)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [oldAmount, setOldAmount] = useState<number>(0)
  const [newAmount, setNewAmount] = useState<string>('')
  const [currencySymbol, setCurrencySymbol] = useState<string>('₦')

  useEffect(() => {
    const fetchSavingsOverview = async () => {
      try {
        const payload = {
          jsonrpc: '2.0',
          method: 'call',
          id: 1,
          params: {},
        }
        const response = await api.post('/api/portal/savings_overview', payload)
        if (response.data?.result) {
          const result = response.data.result
          // Assuming the first account's monthly_contribution is what we need
          // as seen in Savings.tsx structure
          if (result.accounts && result.accounts.length > 0) {
            setOldAmount(result.accounts[0].monthly_contribution)
          }
          if (result.currency?.symbol) {
            setCurrencySymbol(result.currency.symbol)
          }
        }
      } catch (err) {
        console.error('Error fetching savings overview:', err)
        toast({
          title: 'Error',
          description: 'Failed to fetch current savings amount',
          variant: 'destructive',
        })
      } finally {
        setLoading(false)
      }
    }

    fetchSavingsOverview()
  }, [])

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newAmount || isNaN(Number(newAmount))) {
      toast({
        title: 'Validation Error',
        description: 'Please enter a valid new amount',
        variant: 'destructive',
      })
      return
    }

    setSubmitting(true)
    try {
      const payload = {
        jsonrpc: '2.0',
        method: 'call',
        params: {
          partner_id: credentials?.partner_id,
          amount: Number(newAmount),
        },
      }
      const resp = await api.post('/api/portal/update_contribution_amount', payload)
      if (resp.data.result?.success || resp.data.result?.status === 'success') {
        toast({
          title: 'Success',
          description: 'Savings amount updated successfully',
        })
        navigate(-1)
      } else {
        toast({
          title: 'Update Failed',
          description: resp.data.result?.message || 'Failed to update savings amount',
          variant: 'destructive',
        })
      }
    } catch (error: any) {
      console.error('Error updating savings amount:', error)
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'An error occurred while updating savings amount',
        variant: 'destructive',
      })
    } finally {
      setSubmitting(false)
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
    }).format(amount).replace('NGN', currencySymbol)
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-foreground">Savings</h1>
      <p className="text-muted-foreground">Reschedule Savings Amount</p>

      {loading ? (
        <div className="flex justify-center items-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : (
        <form onSubmit={onSubmit} className="my-8">
          <div className="mt-3 border rounded-[18px] border-[#043d73] bg-[#fff]">
            <div
              className="p-3 form-header bg-[#043d73] rounded-t-[18px]"
              style={{
                borderRadius: '15px 15px 0 0',
              }}
            >
              <div className="subtitle text-white flex gap-2 items-center">
                <MoveLeft onClick={() => navigate(-1)} className="cursor-pointer" /> Reschedule Savings Amount
              </div>
            </div>
            <div className="selected-items-container px-4 py-5 space-y-4">
              <div className="input-container">
                <label htmlFor="old_amount" className="block text-sm font-medium text-gray-700 mb-1">
                  Old amount
                </label>
                <Input
                  id="old_amount"
                  type="text"
                  value={formatCurrency(oldAmount)}
                  readOnly
                  className="bg-gray-50 cursor-not-allowed"
                />
              </div>
              <div className="input-container">
                <label htmlFor="new_amount" className="block text-sm font-medium text-gray-700 mb-1">
                  New amount
                </label>
                <Input
                  id="new_amount"
                  type="number"
                  placeholder="Enter new monthly contribution"
                  value={newAmount}
                  onChange={(e) => setNewAmount(e.target.value)}
                  required
                />
              </div>
            </div>
            <div className="flex justify-end gap-5 p-5 bg-[#1985B3] rounded-b-[18px] mt-5">
              <Button
                type="submit"
                className="bg-white text-[#1985B3] hover:bg-gray-100 font-bold px-8"
                disabled={submitting}
              >
                {submitting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                Proceed
              </Button>
              <Button
                type="button"
                onClick={() => navigate(-1)}
                className="bg-transparent border border-white text-white hover:bg-white/10"
              >
                Discard
              </Button>
            </div>
          </div>
        </form>
      )}
    </div>
  )
}

export default RescheduleSavings