import React, { useState, useEffect, useContext } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Loader2, AlertCircle } from 'lucide-react'
import { UserContext } from '@/hooks/AuthContext'
import api from '@/hooks/api'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

interface LoanRequest {
  id: number;
  loan_type_id: number;
  loan_type: string;
  loan_amount: number;
  status: string;
}

interface LoanResponse {
  jsonrpc: string;
  id: number;
  result: {
    success: boolean;
    count: number;
    loans: LoanRequest[];
  };
}

const LoanRequests = () => {
  const { credentials } = useContext(UserContext)
  const [loans, setLoans] = useState<LoanRequest[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchLoanRequests = async () => {
      try {
        const payload = {
          jsonrpc: '2.0',
          method: 'call',
          params: {
            partner_id: credentials?.partner_id,
          },
          id: 1,
        }
        const resp = await api.post('/api/portal/loans_by_status', payload)
        if (resp.data.result && resp.data.result.success) {
          setLoans(resp.data.result.loans)
        } else {
          setError('Failed to fetch loan requests')
        }
      } catch (err) {
        console.error('Error fetching loan requests:', err)
        setError('An error occurred while fetching loan requests')
      } finally {
        setLoading(false)
      }
    }

    if (credentials?.partner_id) {
      fetchLoanRequests()
    } else {
      setLoading(false)
    }
  }, [credentials])

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'submitted':
        return 'bg-blue-100 text-blue-800'
      case 'approved':
        return 'bg-green-100 text-green-800'
      case 'refused':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
    }).format(amount)
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-destructive">
        <AlertCircle className="h-10 w-10 mb-2" />
        <p>{error}</p>
      </div>
    )
  }

  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle className="text-xl font-bold">Loan Requests</CardTitle>
      </CardHeader>
      <CardContent>
        {loans.length === 0 ? (
          <div className="text-center py-10 text-muted-foreground">
            No loan requests found.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Loan ID</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loans.map((loan) => (
                  <TableRow key={loan.id}>
                    <TableCell className="font-medium">#{loan.id}</TableCell>
                    <TableCell>{loan.loan_type}</TableCell>
                    <TableCell>{formatCurrency(loan.loan_amount)}</TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(loan.status)} variant="outline">
                        {loan.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export default LoanRequests