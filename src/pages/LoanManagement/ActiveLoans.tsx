import React, { useState, useEffect, useContext } from 'react';
import { UserContext } from '@/hooks/AuthContext';
import api from '@/hooks/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { NumericFormat } from 'react-number-format';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { toast } from "@/components/ui/use-toast"
import { Loader2 } from 'lucide-react'

interface ActiveLoan {
  id: number;
  loan_type_id: number;
  loan_type: string;
  loan_amount: number;
  balance_principal: number;
  balance_interest: number;
  balance_total: number;
  monthly_repayment: number;
  original_installment?: number;
  current_installment?: number;
  maturity_date?: string | null;
  can_vary_installment?: boolean;
  status: string;
}

interface InstallmentPreview {
  success: boolean;
  message?: string;
  can_vary: boolean;
  minimum_installment: number;
  current_installment: number;
  balance_principal: number;
  current_maturity_date: string | null;
  pending_request: { id: number; ref: string; new_installment: number } | null;
  new_installment?: number;
  installments_remaining_now?: number;
  installments_remaining_new?: number;
  new_maturity_date?: string;
  interest_saved?: number;
}

type AdjustmentType = 'topup' | 'restructure' | 'offset_savings' | 'installment';

const formatDate = (iso?: string | null) =>
  iso ? new Date(iso + 'T00:00:00').toLocaleDateString('en-NG', { day: 'numeric', month: 'short', year: 'numeric' }) : '—';

const fetchInstallmentPreview = async (loanId: number, newAmount?: number): Promise<InstallmentPreview | null> => {
  const resp = await api.post('/api/portal/loan_installment/preview', {
    jsonrpc: '2.0',
    method: 'call',
    params: { loan_id: loanId, ...(newAmount ? { new_installment_amount: newAmount } : {}) },
    id: 1,
  });
  return resp.data.result ?? null;
};

interface LoanType {
  id: number;
  name: string;
}

const ActiveLoans = () => {
  const { credentials } = useContext(UserContext);
  const [loans, setLoans] = useState<ActiveLoan[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Adjustment state
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedLoan, setSelectedLoan] = useState<ActiveLoan | null>(null);
  const [adjustmentType, setAdjustmentType] = useState<AdjustmentType>('topup');
  const [amount, setAmount] = useState<number>(0);
  const [newLoanType, setNewLoanType] = useState<string>('');
  const [newTenureMonths, setNewTenureMonths] = useState<number>(0);
  const [rateMode, setRateMode] = useState<'keep' | 'reprice'>('keep');
  const [newAprPercent, setNewAprPercent] = useState<number>(0);
  const [reason, setReason] = useState<string>('');
  const [loanTypes, setLoanTypes] = useState<LoanType[]>([]);
  const [savingsAccounts, setSavingsAccounts] = useState<any[]>([]);
  const [selectedSavingsAccountId, setSelectedSavingsAccountId] = useState<string>('');
  const [submitting, setSubmitting] = useState(false);

  // Installment variation state
  const [newInstallment, setNewInstallment] = useState<number>(0);
  const [installmentInfo, setInstallmentInfo] = useState<InstallmentPreview | null>(null);
  const [installmentPreview, setInstallmentPreview] = useState<InstallmentPreview | null>(null);
  const [previewLoading, setPreviewLoading] = useState(false);

  // Load the member's limits when they pick "Increase Installment"
  useEffect(() => {
    if (!isDialogOpen || adjustmentType !== 'installment' || !selectedLoan) return;
    let cancelled = false;
    setInstallmentInfo(null);
    fetchInstallmentPreview(selectedLoan.id)
      .then((info) => {
        if (cancelled || !info) return;
        setInstallmentInfo(info);
        setNewInstallment((prev) => prev || info.current_installment);
      })
      .catch((e) => console.error('Error loading installment info:', e));
    return () => { cancelled = true; };
  }, [isDialogOpen, adjustmentType, selectedLoan]);

  // Live preview of the new schedule (debounced)
  useEffect(() => {
    setInstallmentPreview(null);
    if (adjustmentType !== 'installment' || !selectedLoan || !installmentInfo?.can_vary) return;
    if (!newInstallment || newInstallment === installmentInfo.current_installment) return;
    if (newInstallment < installmentInfo.minimum_installment) return;
    let cancelled = false;
    setPreviewLoading(true);
    const t = setTimeout(() => {
      fetchInstallmentPreview(selectedLoan.id, newInstallment)
        .then((p) => { if (!cancelled) setInstallmentPreview(p); })
        .catch((e) => console.error('Error previewing installment:', e))
        .finally(() => { if (!cancelled) setPreviewLoading(false); });
    }, 400);
    return () => { cancelled = true; clearTimeout(t); setPreviewLoading(false); };
  }, [newInstallment, adjustmentType, selectedLoan, installmentInfo]);

  useEffect(() => {
    const fetchActiveLoans = async () => {
      try {
        const payload = {
          jsonrpc: '2.0',
          method: 'call',
          params: {
            partner_id: credentials?.partner_id,
          },
          id: 1,
        };
        const resp = await api.post('/api/portal/active_loans', payload);
        if (resp.data.result && resp.data.result.success) {
          setLoans(resp.data.result.loans);
        }
      } catch (error) {
        console.error('Error fetching active loans:', error);
      } finally {
        setLoading(false);
      }
    };

    const fetchLoanTypes = async () => {
      try {
        const payload = {
          jsonrpc: '2.0',
          method: 'call',
          id: 1,
          params: {}
        };
        const resp = await api.post('/api/portal/loan_types', payload);
        if (resp.data.result && resp.data.result.loan_types) {
          setLoanTypes(resp.data.result.loan_types);
        }
      } catch (error) {
        console.error('Error fetching loan types:', error);
      }
    };

    const fetchSavingsAccounts = async () => {
      try {
        const payload = {
          jsonrpc: '2.0',
          method: 'call',
          id: 1,
          params: {}
        };
        const resp = await api.post('/api/portal/savings_overview', payload);
        if (resp.data.result && resp.data.result.accounts) {
          setSavingsAccounts(resp.data.result.accounts);
        }
      } catch (error) {
        console.error('Error fetching savings accounts:', error);
      }
    };

    if (credentials?.partner_id) {
      fetchActiveLoans();
      fetchLoanTypes();
      fetchSavingsAccounts();
    } else {
        // Fallback or demo data
        setLoans([
            {
                id: 36,
                loan_type_id: 1,
                loan_type: "Target",
                loan_amount: 2000034.0,
                balance_principal: 2000034.0,
                balance_interest: 1691695.43,
                balance_total: 3691729.4299999997,
                monthly_repayment: 0.0,
                status: "disbursed"
            }
        ]);
        setLoading(false);
    }
  }, [credentials]);

  const handleOpenDialog = (loan: ActiveLoan) => {
    setSelectedLoan(loan);
    setAdjustmentType('topup');
    setAmount(0);
    setNewLoanType('');
    setNewTenureMonths(0); // This could be initialized to current loan tenure if available
    setRateMode('keep');
    setNewAprPercent(0); // This could be initialized to current loan APR if available
    setReason('');
    setSelectedSavingsAccountId('');
    setNewInstallment(0);
    setInstallmentInfo(null);
    setInstallmentPreview(null);
    setIsDialogOpen(true);
  };

  const handleSubmit = async () => {
    if (!selectedLoan || !credentials?.partner_id) return;
    
    setSubmitting(true);
    try {
      let response;
      if (adjustmentType === 'offset_savings') {
        const payload = {
          jsonrpc: '2.0',
          method: 'call',
          params: {
            loan_id: selectedLoan.id,
            member_id: credentials.partner_id,
            savings_account_id: Number(selectedSavingsAccountId),
            amount: amount,
          },
          id: 1,
        };
        response = await api.post('/api/portal/loan_offset_request', payload);
      } else {
        const payload = {
          jsonrpc: '2.0',
          method: 'call',
          params: {
            loan_id: selectedLoan.id,
            member_id: credentials.partner_id,
            adjustment_type: adjustmentType,
            topup_amount: adjustmentType === 'topup' ? amount : null,
            loan_type_id: adjustmentType === 'restructure' && newLoanType ? Number(newLoanType) : null,
            new_tenure_months: adjustmentType === 'restructure' && newTenureMonths > 0 ? newTenureMonths : null,
            new_installment_amount: adjustmentType === 'installment' ? newInstallment : null,
            rate_mode: adjustmentType === 'restructure' ? rateMode : 'keep',
            new_apr_percent: adjustmentType === 'restructure' && rateMode === 'keep' && newAprPercent > 0 ? newAprPercent : null,
            reason: reason || null,
          },
          id: 1,
        };
        response = await api.post('/api/portal/loan_adjustment/create', payload);
      }

      const result = response.data.result;

      if (result?.status === 'success' || result?.success) {
        toast({
          title: "Success",
          description: adjustmentType === 'installment'
            ? "Your installment change has been submitted for approval."
            : result?.message || "Loan request submitted successfully",
        });
        setIsDialogOpen(false);
      } else {
        toast({
          variant: "destructive",
          title: "Error",
          description: result?.message || "Failed to submit loan request",
        });
      }
    } catch (error) {
      console.error('Error submitting loan request:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "An unexpected error occurred while submitting the loan request",
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div className="p-5 text-center">Loading active loans...</div>;
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
    }).format(amount);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <Card className="border-[#043d73]/20">
        <CardHeader className="bg-[#043d73] text-white rounded-t-lg py-3">
          <CardTitle className="text-lg font-medium">Active Loans</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="pl-6">Loan Type</TableHead>
                <TableHead className="text-right">Loan Amount</TableHead>
                <TableHead className="text-right">Principal Balance</TableHead>
                <TableHead className="text-right">Interest Balance</TableHead>
                <TableHead className="text-right">Total Balance</TableHead>
                <TableHead className="text-right">Monthly Repayment</TableHead>
                <TableHead className="text-center">Status</TableHead>
                <TableHead className="text-center">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loans && loans.length > 0 ? (
                loans.map((loan) => (
                  <TableRow key={loan.id}>
                    <TableCell className="pl-6 font-medium">{loan.loan_type}</TableCell>
                    <TableCell className="text-right">
                      {formatCurrency(loan.loan_amount)}
                    </TableCell>
                    <TableCell className="text-right">
                      {formatCurrency(loan.balance_principal)}
                    </TableCell>
                    <TableCell className="text-right">
                      {formatCurrency(loan.balance_interest)}
                    </TableCell>
                    <TableCell className="text-right font-semibold">
                      {formatCurrency(loan.balance_total)}
                    </TableCell>
                    <TableCell className="text-right">
                      {formatCurrency(loan.monthly_repayment)}
                      {!!loan.current_installment && (
                        <div className="text-xs text-muted-foreground">
                          Principal {formatCurrency(loan.current_installment)}
                          {loan.maturity_date && <> · ends {formatDate(loan.maturity_date)}</>}
                        </div>
                      )}
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge variant="outline" className="bg-green-100 text-green-700 border-green-200">
                        {loan.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-center">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="text-[#043d73] border-[#043d73] hover:bg-[#043d73] hover:text-white"
                        onClick={() => handleOpenDialog(loan)}
                      >
                        Top up / Adjust
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-4 text-muted-foreground">
                    No active loans found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Adjust Loan</DialogTitle>
            <DialogDescription>
              Adjust your active loan: {selectedLoan?.loan_type}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="adjustment-type">Adjustment Type</Label>
              <Select 
                value={adjustmentType} 
                onValueChange={(value: AdjustmentType) => setAdjustmentType(value)}
              >
                <SelectTrigger id="adjustment-type">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="topup">Top Up</SelectItem>
                  <SelectItem value="restructure">Restructure</SelectItem>
                  <SelectItem value="offset_savings">Offset with Savings</SelectItem>
                  {selectedLoan?.can_vary_installment !== false && (
                    <SelectItem value="installment">Increase Installment</SelectItem>
                  )}
                </SelectContent>
              </Select>
            </div>

            {adjustmentType === 'installment' ? (
              !installmentInfo ? (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Loader2 className="h-4 w-4 animate-spin" /> Loading your installment details...
                </div>
              ) : installmentInfo.pending_request ? (
                <p className="rounded-md bg-amber-50 border border-amber-200 p-3 text-sm text-amber-800">
                  You already have a pending request ({installmentInfo.pending_request.ref}) to change this installment to{' '}
                  {formatCurrency(installmentInfo.pending_request.new_installment)}. Wait for it to be approved before making another.
                </p>
              ) : !installmentInfo.can_vary ? (
                <p className="text-sm text-muted-foreground">
                  {installmentInfo.message || "This loan's installment can't be changed."}
                </p>
              ) : (
                <>
                  <div className="grid grid-cols-2 gap-3 rounded-md bg-muted/50 p-3 text-sm">
                    <div>
                      <div className="text-muted-foreground">Current installment</div>
                      <div className="font-semibold">{formatCurrency(installmentInfo.current_installment)}</div>
                    </div>
                    <div>
                      <div className="text-muted-foreground">Minimum allowed</div>
                      <div className="font-semibold">{formatCurrency(installmentInfo.minimum_installment)}</div>
                    </div>
                    <div>
                      <div className="text-muted-foreground">Principal left</div>
                      <div className="font-semibold">{formatCurrency(installmentInfo.balance_principal)}</div>
                    </div>
                    <div>
                      <div className="text-muted-foreground">Ends on</div>
                      <div className="font-semibold">{formatDate(installmentInfo.current_maturity_date)}</div>
                    </div>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="new-installment">New Monthly Principal Installment</Label>
                    <NumericFormat
                      id="new-installment"
                      customInput={Input}
                      thousandSeparator={true}
                      prefix={'₦'}
                      decimalScale={2}
                      value={newInstallment || ''}
                      onValueChange={(values) => setNewInstallment(Number(values.value))}
                      placeholder="Enter amount"
                    />
                    <p className="text-xs text-muted-foreground">
                      Pay more each period to clear your loan sooner. It can't go below {formatCurrency(installmentInfo.minimum_installment)}.
                    </p>
                    {newInstallment > 0 && newInstallment < installmentInfo.minimum_installment && (
                      <p className="text-xs text-destructive">
                        Must be at least {formatCurrency(installmentInfo.minimum_installment)}.
                      </p>
                    )}
                  </div>
                  {previewLoading ? (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Loader2 className="h-4 w-4 animate-spin" /> Calculating...
                    </div>
                  ) : installmentPreview && !installmentPreview.success ? (
                    <p className="text-xs text-destructive">{installmentPreview.message}</p>
                  ) : installmentPreview?.new_maturity_date ? (
                    <div className="rounded-md border border-green-200 bg-green-50 p-3 text-sm text-green-900 space-y-1">
                      <div className="flex justify-between">
                        <span>Installments left</span>
                        <span className="font-semibold">
                          {installmentPreview.installments_remaining_now} → {installmentPreview.installments_remaining_new}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Loan ends</span>
                        <span className="font-semibold">{formatDate(installmentPreview.new_maturity_date)}</span>
                      </div>
                      {(installmentPreview.interest_saved ?? 0) !== 0 && (
                        <div className="flex justify-between">
                          <span>{(installmentPreview.interest_saved ?? 0) > 0 ? 'Projected interest saved' : 'Projected extra interest'}</span>
                          <span className="font-semibold">{formatCurrency(Math.abs(installmentPreview.interest_saved ?? 0))}</span>
                        </div>
                      )}
                    </div>
                  ) : null}
                </>
              )
            ) : adjustmentType === 'topup' ? (
              <div className="grid gap-2">
                <Label htmlFor="amount">Top Up Amount</Label>
                <NumericFormat
                  id="amount"
                  customInput={Input}
                  thousandSeparator={true}
                  prefix={'₦'}
                  value={amount}
                  onValueChange={(values) => setAmount(Number(values.value))}
                  placeholder="Enter amount"
                />
              </div>
            ) : adjustmentType === 'offset_savings' ? (
              <>
                <div className="grid gap-2">
                  <Label htmlFor="savings-account">Savings Account (Required)</Label>
                  <Select 
                    value={selectedSavingsAccountId} 
                    onValueChange={setSelectedSavingsAccountId}
                  >
                    <SelectTrigger id="savings-account">
                      <SelectValue placeholder="Select savings account" />
                    </SelectTrigger>
                    <SelectContent>
                      {savingsAccounts.map((account) => (
                        <SelectItem key={account.id} value={String(account.id)}>
                          {account.display_name} ({new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN' }).format(account.balance)})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="amount">Offset Amount (Required)</Label>
                  <NumericFormat
                    id="amount"
                    customInput={Input}
                    thousandSeparator={true}
                    prefix={'₦'}
                    value={amount}
                    onValueChange={(values) => setAmount(Number(values.value))}
                    placeholder="Enter amount"
                  />
                </div>
              </>
            ) : (
              <>
                <div className="grid gap-2">
                  <Label htmlFor="new-loan-type">New Loan Type (Required)</Label>
                  <Select 
                    value={newLoanType} 
                    onValueChange={setNewLoanType}
                  >
                    <SelectTrigger id="new-loan-type">
                      <SelectValue placeholder="Select new loan type" />
                    </SelectTrigger>
                    <SelectContent>
                      {loanTypes.map((type) => (
                        <SelectItem key={type.id} value={String(type.id)}>
                          {type.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="new-tenure">New Tenure (Months) (Optional)</Label>
                  <Input
                    id="new-tenure"
                    type="number"
                    value={newTenureMonths || ''}
                    onChange={(e) => setNewTenureMonths(Number(e.target.value))}
                    placeholder="Enter tenure in months"
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="rate-mode">Rate Mode (Optional)</Label>
                  <Select 
                    value={rateMode} 
                    onValueChange={(value: 'keep' | 'reprice') => setRateMode(value)}
                  >
                    <SelectTrigger id="rate-mode">
                      <SelectValue placeholder="Select rate mode" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="keep">Keep</SelectItem>
                      <SelectItem value="reprice">Reprice</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {rateMode === 'keep' && (
                  <div className="grid gap-2">
                    <Label htmlFor="new-apr">New APR Percent (Required for 'keep')</Label>
                    <Input
                      id="new-apr"
                      type="number"
                      step="0.01"
                      value={newAprPercent || ''}
                      onChange={(e) => setNewAprPercent(Number(e.target.value))}
                      placeholder="Enter new APR percent"
                    />
                  </div>
                )}
              </>
            )}

            <div className="grid gap-2">
              <Label htmlFor="reason">Reason (Optional)</Label>
              <Input
                id="reason"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Enter reason for adjustment"
              />
            </div>
          </div>
          <DialogFooter>
            <Button 
              type="submit" 
              onClick={handleSubmit} 
              disabled={submitting || (
                adjustmentType === 'installment' ? (
                  !installmentInfo?.can_vary ||
                  newInstallment < (installmentInfo?.minimum_installment ?? Infinity) ||
                  newInstallment === installmentInfo?.current_installment ||
                  previewLoading ||
                  installmentPreview?.success === false
                ) :
                adjustmentType === 'topup' ? amount <= 0 : 
                adjustmentType === 'offset_savings' ? (amount <= 0 || !selectedSavingsAccountId) :
                (!newLoanType || (rateMode === 'keep' && newAprPercent <= 0))
              )}
              className="bg-[#043d73] hover:bg-[#032d56]"
            >
              {submitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Submitting...
                </>
              ) : 'Submit'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ActiveLoans;
