import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Award, Building2, Calendar, Loader2, MapPin } from 'lucide-react'
import { fetchMyInvestments, MyInvestment, MyInvestmentsResult } from '@/services/realEstateApi'

const formatMoney = (amount: number, currency = 'NGN') =>
  new Intl.NumberFormat('en-NG', { style: 'currency', currency, minimumFractionDigits: 0 }).format(amount || 0)

const formatDate = (value: string | null) => (value ? new Date(value).toLocaleDateString('en-GB') : '-')

const StatusBadge = ({ status }: { status: MyInvestment['status'] }) => {
  switch (status) {
    case 'allocated':
      return <Badge className="bg-green-500/20 text-green-700 hover:bg-green-500/30">Allocated</Badge>
    case 'confirmed':
      return <Badge className="bg-blue-500/20 text-blue-700 hover:bg-blue-500/30">Confirmed</Badge>
    case 'draft':
      return <Badge className="bg-amber-500/20 text-amber-700 hover:bg-amber-500/30">Awaiting confirmation</Badge>
    case 'cancelled':
      return <Badge variant="outline">Cancelled</Badge>
    default:
      return <Badge variant="outline">{status}</Badge>
  }
}

const MyInvestments = () => {
  const [data, setData] = useState<MyInvestmentsResult | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchMyInvestments()
      .then(setData)
      .catch((e: Error) => setError(e.message || 'Could not load your investments.'))
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="flex justify-center py-16">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    )
  }

  if (error) {
    return (
      <Card>
        <CardContent className="py-10 text-center text-sm text-destructive">{error}</CardContent>
      </Card>
    )
  }

  if (!data || data.investments.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center gap-3 py-16 text-center">
          <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
            <Building2 className="h-6 w-6 text-primary" />
          </div>
          <p className="font-medium text-foreground">You have no real estate investments yet</p>
          <p className="max-w-md text-sm text-muted-foreground">
            Subscribe to a unit from the <Link to="/dashboard/real-estate" className="text-primary underline">available projects</Link> and it will appear here.
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
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
                <TableHead>Unit(s)</TableHead>
                <TableHead>Total Price</TableHead>
                <TableHead>Paid</TableHead>
                <TableHead>Outstanding</TableHead>
                <TableHead>Next Payment</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.investments.map((inv) => {
                const cur = inv.currency?.name || 'NGN'
                const paidPct = inv.amount_total > 0 ? Math.min(100, (inv.amount_paid / inv.amount_total) * 100) : 0
                return (
                  <TableRow key={inv.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Building2 className="h-4 w-4 shrink-0 text-primary" />
                        <div>
                          <p className="font-medium">{inv.project.name}</p>
                          {inv.project.location && (
                            <p className="text-xs text-muted-foreground flex items-center gap-1">
                              <MapPin className="h-3 w-3" />
                              {inv.project.location}
                            </p>
                          )}
                          <p className="text-xs text-muted-foreground">
                            {inv.reference} · {formatDate(inv.subscribed_on)}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      {inv.units.length > 0
                        ? inv.units.map((u) => (
                            <div key={u.id}>
                              <span className="font-medium">{u.number}</span>
                              {u.house_type && <span className="text-xs text-muted-foreground"> · {u.house_type}</span>}
                            </div>
                          ))
                        : `${inv.unit_count} unit(s)`}
                    </TableCell>
                    <TableCell>{formatMoney(inv.amount_total, cur)}</TableCell>
                    <TableCell>
                      <p className="font-medium text-green-600">{formatMoney(inv.amount_paid, cur)}</p>
                      <div className="mt-1 h-1.5 w-24 rounded-full bg-muted">
                        <div className="h-1.5 rounded-full bg-green-500" style={{ width: `${paidPct}%` }} />
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">{formatMoney(inv.amount_outstanding, cur)}</TableCell>
                    <TableCell>
                      {inv.next_milestone ? (
                        <div>
                          <p className="font-medium">{inv.next_milestone.name}</p>
                          <p className="text-xs text-muted-foreground">{formatMoney(inv.next_milestone.remaining, cur)}</p>
                          {inv.next_milestone.due_date && (
                            <p className="text-xs text-muted-foreground flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              {formatDate(inv.next_milestone.due_date)}
                            </p>
                          )}
                        </div>
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={inv.status} />
                      {inv.certificate_number && (
                        <p className="mt-1 text-xs text-muted-foreground flex items-center gap-1">
                          <Award className="h-3 w-3" />
                          {inv.certificate_number}
                        </p>
                      )}
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}

export default MyInvestments
