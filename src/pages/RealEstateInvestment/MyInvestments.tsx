import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Building2, MapPin, TrendingUp, Calendar, CircleDollarSign } from 'lucide-react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'

interface MemberInvestment {
  id: number
  name: string
  location: string
  type: string
  investedAmount: number
  currentValue: number
  expectedReturn: number
  maturityDate: string
  units: number
  status: 'active' | 'matured' | 'pending'
  investedDate: string
}

const MyInvestments = () => {
  const myInvestments: MemberInvestment[] = [
    {
      id: 1,
      name: 'Lekki Gardens Phase 2',
      location: 'Lekki, Lagos',
      type: 'Residential',
      investedAmount: 2000000,
      currentValue: 2300000,
      expectedReturn: 25,
      maturityDate: '2025-06-15',
      units: 4,
      status: 'active',
      investedDate: '2023-06-15',
    },
    {
      id: 2,
      name: 'Victoria Island Office Complex',
      location: 'Victoria Island, Lagos',
      type: 'Commercial',
      investedAmount: 3000000,
      currentValue: 3450000,
      expectedReturn: 30,
      maturityDate: '2025-12-01',
      units: 3,
      status: 'active',
      investedDate: '2023-12-01',
    },
    {
      id: 3,
      name: 'Ikeja Shopping Mall',
      location: 'Ikeja, Lagos',
      type: 'Commercial',
      investedAmount: 1500000,
      currentValue: 1875000,
      expectedReturn: 28,
      maturityDate: '2024-03-20',
      units: 2,
      status: 'matured',
      investedDate: '2022-03-20',
    },
  ]

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
    }).format(amount)
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-500/20 text-green-700 hover:bg-green-500/30">Active</Badge>
      case 'matured':
        return <Badge className="bg-blue-500/20 text-blue-700 hover:bg-blue-500/30">Matured</Badge>
      case 'pending':
        return <Badge className="bg-amber-500/20 text-amber-700 hover:bg-amber-500/30">Pending</Badge>
      default:
        return null
    }
  }

  const calculateGain = (invested: number, current: number) => {
    const gain = current - invested
    const percentage = ((gain / invested) * 100).toFixed(1)
    return { gain, percentage }
  }

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center">
                <CircleDollarSign className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Invested</p>
                <p className="text-xl font-bold">
                  {formatCurrency(myInvestments.reduce((sum, inv) => sum + inv.investedAmount, 0))}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-green-500/20 flex items-center justify-center">
                <TrendingUp className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Current Value</p>
                <p className="text-xl font-bold text-green-600">
                  {formatCurrency(myInvestments.reduce((sum, inv) => sum + inv.currentValue, 0))}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-amber-500/20 flex items-center justify-center">
                <Building2 className="h-5 w-5 text-amber-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Investments</p>
                <p className="text-xl font-bold">{myInvestments.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Investments Table */}
      <Card>
        <CardHeader>
          <CardTitle>My Real Estate Investments</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Property</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Units</TableHead>
                  <TableHead>Invested Amount</TableHead>
                  <TableHead>Current Value</TableHead>
                  <TableHead>Gain/Loss</TableHead>
                  <TableHead>Maturity Date</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {myInvestments.map((investment) => {
                  const { gain, percentage } = calculateGain(investment.investedAmount, investment.currentValue)
                  return (
                    <TableRow key={investment.id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Building2 className="h-4 w-4 text-primary" />
                          <div>
                            <p className="font-medium">{investment.name}</p>
                            <p className="text-xs text-muted-foreground flex items-center gap-1">
                              <MapPin className="h-3 w-3" />
                              {investment.location}
                            </p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{investment.type}</Badge>
                      </TableCell>
                      <TableCell>{investment.units}</TableCell>
                      <TableCell>{formatCurrency(investment.investedAmount)}</TableCell>
                      <TableCell className="font-medium">{formatCurrency(investment.currentValue)}</TableCell>
                      <TableCell>
                        <div className="text-green-600">
                          <p className="font-medium">+{formatCurrency(gain)}</p>
                          <p className="text-xs">+{percentage}%</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          {new Date(investment.maturityDate).toLocaleDateString('en-GB')}
                        </div>
                      </TableCell>
                      <TableCell>{getStatusBadge(investment.status)}</TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default MyInvestments
