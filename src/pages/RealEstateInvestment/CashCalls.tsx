import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle,
} from '@/components/ui/dialog'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { toast } from '@/components/ui/use-toast'
import { BellRing, Calendar, Loader2 } from 'lucide-react'
import {
  CashCall, CashCallMethod, CashCallProof, CashCallsResult, fetchCashCalls, respondToCashCall,
} from '@/services/realEstateApi'

const METHOD_LABELS: Record<CashCallMethod, string> = {
  cash: 'Cash / bank transfer',
  savings: 'From my savings',
  loan: 'With a loan',
}

const formatMoney = (amount: number, call?: CashCall) =>
  new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: call?.currency?.name || 'NGN',
    minimumFractionDigits: 2,
  }).format(amount || 0)

const formatDate = (value: string | null) => (value ? new Date(value).toLocaleDateString('en-GB') : '-')

const StatusBadge = ({ status }: { status: CashCall['status'] }) => {
  switch (status) {
    case 'pending':
      return <Badge className="bg-amber-500/20 text-amber-700 hover:bg-amber-500/30">Awaiting your response</Badge>
    case 'responded':
      return <Badge className="bg-blue-500/20 text-blue-700 hover:bg-blue-500/30">Being verified</Badge>
    case 'paid':
      return <Badge className="bg-green-500/20 text-green-700 hover:bg-green-500/30">Paid</Badge>
    default:
      return <Badge variant="outline">Cancelled</Badge>
  }
}

const readFile = (file: File) =>
  new Promise<CashCallProof>((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve({ name: file.name, mimetype: file.type, data: String(reader.result) })
    reader.onerror = () => reject(reader.error)
    reader.readAsDataURL(file)
  })

const RespondDialog = ({
  call, savingsBalance, onClose, onDone,
}: {
  call: CashCall
  savingsBalance: number | null
  onClose: () => void
  onDone: () => void
}) => {
  const initial = useMemo(() => {
    const values: Record<CashCallMethod, string> = { cash: '', savings: '', loan: '' }
    if (call.response?.splits?.length) {
      call.response.splits.forEach((s) => { values[s.method] = String(s.amount) })
    } else {
      values.cash = String(call.amount_outstanding)
    }
    return values
  }, [call])
  const [amounts, setAmounts] = useState(initial)
  const [note, setNote] = useState(call.response?.note || '')
  const [files, setFiles] = useState<File[]>([])
  const [submitting, setSubmitting] = useState(false)

  const methods: CashCallMethod[] = call.loan_available ? ['cash', 'savings', 'loan'] : ['cash', 'savings']
  const total = methods.reduce((sum, m) => sum + (parseFloat(amounts[m]) || 0), 0)
  const difference = Math.round((call.amount_outstanding - total) * 100) / 100

  const submit = async () => {
    setSubmitting(true)
    try {
      const proofs = await Promise.all(files.map(readFile))
      const splits = methods
        .map((m) => ({ method: m, amount: parseFloat(amounts[m]) || 0 }))
        .filter((s) => s.amount > 0)
      const res = await respondToCashCall(call.id, splits, note, proofs)
      if (res.success) {
        toast({ title: 'Response recorded', description: res.message })
        onDone()
      } else {
        toast({ title: 'Could not submit', description: res.message, variant: 'destructive' })
      }
    } catch (e) {
      toast({ title: 'Could not submit', description: e instanceof Error ? e.message : String(e), variant: 'destructive' })
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Dialog open onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>How will you pay?</DialogTitle>
          <DialogDescription>
            {call.milestone} - {call.project.name}. Split {formatMoney(call.amount_outstanding, call)} across
            one or more options.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          {methods.map((m) => (
            <div key={m} className="space-y-1">
              <Label htmlFor={`cc-${m}`}>{METHOD_LABELS[m]}</Label>
              <Input
                id={`cc-${m}`}
                type="number"
                min={0}
                step="0.01"
                value={amounts[m]}
                onChange={(e) => setAmounts({ ...amounts, [m]: e.target.value })}
              />
              {m === 'savings' && savingsBalance !== null && (
                <p className="text-xs text-muted-foreground">Available balance: {formatMoney(savingsBalance, call)}</p>
              )}
              {m === 'loan' && (
                <p className="text-xs text-muted-foreground">A loan application will be raised for this amount.</p>
              )}
            </div>
          ))}
          <div className={`text-sm ${difference === 0 ? 'text-green-600' : 'text-destructive'}`}>
            Total {formatMoney(total, call)}
            {difference !== 0 && ` (${difference > 0 ? 'short by' : 'over by'} ${formatMoney(Math.abs(difference), call)})`}
          </div>
          <div className="space-y-1">
            <Label htmlFor="cc-proofs">Proof of payment (optional)</Label>
            <Input
              id="cc-proofs"
              type="file"
              multiple
              accept="image/*,application/pdf"
              onChange={(e) => setFiles(Array.from(e.target.files || []))}
            />
          </div>
          <div className="space-y-1">
            <Label htmlFor="cc-note">Note</Label>
            <Textarea id="cc-note" rows={2} value={note} onChange={(e) => setNote(e.target.value)} />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={submitting}>Cancel</Button>
          <Button onClick={submit} disabled={submitting || difference !== 0}>
            {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Submit response
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

const CashCalls = () => {
  const [data, setData] = useState<CashCallsResult | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [responding, setResponding] = useState<CashCall | null>(null)

  const load = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      setData(await fetchCashCalls())
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e))
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { load() }, [load])

  if (loading) {
    return <div className="flex justify-center py-12"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div>
  }
  if (error) {
    return (
      <Card><CardContent className="p-6 text-center space-y-3">
        <p className="text-destructive">Could not load cash calls: {error}</p>
        <Button variant="outline" onClick={load}>Try again</Button>
      </CardContent></Card>
    )
  }
  if (!data?.cash_calls.length) {
    return (
      <Card><CardContent className="p-8 text-center text-muted-foreground">
        <BellRing className="mx-auto mb-3 h-8 w-8" />
        You have no cash calls.
      </CardContent></Card>
    )
  }

  return (
    <div className="space-y-4">
      {data.cash_calls.map((call) => (
        <Card key={call.id}>
          <CardHeader className="pb-2">
            <div className="flex flex-wrap items-start justify-between gap-2">
              <div>
                <p className="text-xs text-muted-foreground">Cash call {call.reference}</p>
                <CardTitle className="text-lg">{call.milestone} - {call.project.name}</CardTitle>
              </div>
              <StatusBadge status={call.status} />
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex flex-wrap gap-6 text-sm">
              <div>
                <p className="text-muted-foreground">Amount due</p>
                <p className="text-lg font-bold">{formatMoney(call.amount_outstanding, call)}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Due date</p>
                <p className="flex items-center gap-1 font-medium">
                  <Calendar className="h-4 w-4" />{formatDate(call.due_date)}
                </p>
              </div>
              {call.amount_paid > 0 && (
                <div>
                  <p className="text-muted-foreground">Paid</p>
                  <p className="font-medium text-green-600">{formatMoney(call.amount_paid, call)}</p>
                </div>
              )}
            </div>
            {call.message && (
              <div className="rounded-md bg-muted/50 p-3 text-sm" dangerouslySetInnerHTML={{ __html: call.message }} />
            )}
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Unit</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                    <TableHead className="text-right">Outstanding</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {call.items.map((item) => (
                    <TableRow key={item.milestone_id}>
                      <TableCell>{item.unit}</TableCell>
                      <TableCell className="text-right">{formatMoney(item.amount, call)}</TableCell>
                      <TableCell className="text-right">{formatMoney(item.remaining, call)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            {call.response && (
              <div className="text-sm">
                <p className="font-medium">Your response</p>
                <ul className="list-disc pl-5">
                  {call.response.splits.map((s) => (
                    <li key={s.method}>{METHOD_LABELS[s.method]}: {formatMoney(s.amount, call)}</li>
                  ))}
                </ul>
              </div>
            )}
            {call.can_respond && call.status !== 'paid' && (
              <Button onClick={() => setResponding(call)}>
                {call.response ? 'Change response' : 'Respond'}
              </Button>
            )}
          </CardContent>
        </Card>
      ))}
      {responding && (
        <RespondDialog
          call={responding}
          savingsBalance={data.savings_balance}
          onClose={() => setResponding(null)}
          onDone={() => { setResponding(null); load() }}
        />
      )}
    </div>
  )
}

export default CashCalls
