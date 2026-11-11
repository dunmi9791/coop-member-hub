import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Loader2 } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import api from "@/hooks/api";
import FundingFields, { formatNaira, useFunding } from "@/components/investment/FundingFields";

interface TopupQuote {
  switch: boolean;
  current_type: string;
  current_principal: number;
  topup_amount: number;
  new_principal: number;
  max_amount: number | false;
  maturity_date: string;
  accrued_interest?: number;
  target_type_id?: number;
  target_type?: string;
  target_rate?: number;
  target_payout_rules?: string;
}

const rpc = (params: Record<string, unknown>) => ({ jsonrpc: "2.0", method: "call", params, id: 1 });

interface InvestmentActionModalProps {
  isOpen: boolean;
  onClose: () => void;
  investment: any;
}

const InvestmentActionModal = ({
  isOpen,
  onClose,
  investment,
}: InvestmentActionModalProps) => {
  const [action, setAction] = useState<string>("liquidate");
  const [amount, setAmount] = useState<string>("");
  const [notes, setNotes] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const funding = useFunding();
  // Set when the top-up takes the investment over its type's limit: the member must confirm the switch
  const [switchQuote, setSwitchQuote] = useState<TopupQuote | null>(null);

  const reset = () => {
    setSwitchQuote(null);
    setAmount("");
    setNotes("");
  };

  const close = () => {
    reset();
    onClose();
  };

  const submitTopup = async (confirmedSwitch: TopupQuote | null) => {
    const topupAmount = Number(amount);
    if (!topupAmount || topupAmount <= 0) {
      toast({ title: "Validation Error", description: "Enter the amount to top up.", variant: "destructive" });
      return;
    }
    const fundingError = funding.validate(topupAmount);
    if (fundingError) {
      toast({ title: "Funding details needed", description: fundingError, variant: "destructive" });
      return;
    }
    setLoading(true);
    try {
      if (!confirmedSwitch) {
        // Check first whether the top-up stays within this investment type
        const q = await api.post("/api/portal/investment_topup_quote", rpc({
          subscription_id: investment?.id,
          amount: topupAmount,
        }));
        const qr = q.data.result;
        if (!qr?.success) {
          toast({ title: "Top-up not possible", description: qr?.error || "Please try again.", variant: "destructive" });
          return;
        }
        if (qr.data.switch) {
          setSwitchQuote(qr.data);
          return; // the member reviews and confirms the switch first
        }
      }
      const resp = await api.post("/api/portal/investment_topup_request", rpc({
        subscription_id: investment?.id,
        amount: topupAmount,
        notes: notes || undefined,
        ...(await funding.toPayload()),
        ...(confirmedSwitch
          ? { confirm_switch: true, switch_to_type_id: confirmedSwitch.target_type_id }
          : {}),
      }));
      const r = resp.data.result;
      if (r?.success) {
        toast({ title: "Top-up requested", description: r.message });
        close();
      } else if (r?.requires_switch_confirmation) {
        // The figures changed since the member confirmed (e.g. interest accrued): show them again
        setSwitchQuote(r.quote);
      } else {
        toast({ title: "Request Failed", description: r?.error || "Please try again.", variant: "destructive" });
      }
    } catch (error: any) {
      console.error("Error submitting top-up:", error);
      toast({ title: "Error", description: "Failed to submit the top-up. Please try again.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (action === "topup") {
      return submitTopup(null);
    }
    if (action === "partial_liquidate" && (!amount || isNaN(Number(amount)))) {
      toast({
        title: "Validation Error",
        description: "Please enter a valid amount for partial liquidation.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const payload = {
        jsonrpc: "2.0",
        method: "call",
        params: {
          subscription_id: investment?.id,
          request_type: action,
          amount: action === "partial_liquidate" ? Number(amount) : 0,
          notes: notes || `Requesting ${action.replace("_", " ")}`,
        },
        id: 1,
      };

      const resp = await api.post("/api/portal/member_subscription_request/", payload);
      
      if (resp.data.result?.success || resp.data.result?.status === 'success') {
        toast({
          title: "Success",
          description: resp.data.result?.message || `Request for ${action.replace("_", " ")} has been submitted successfully.`,
        });
        close();
      } else {
        toast({
          title: "Request Failed",
          description: resp.data.result?.message || resp.data.result?.error || "Failed to process request. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error: any) {
      console.error("Error submitting investment request:", error);
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to process request. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: investment?.currency || 'NGN',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <Dialog open={isOpen} onOpenChange={close}>
      <DialogContent className={`${action === "topup" ? "sm:max-w-[600px]" : "sm:max-w-[425px]"} max-h-[90vh] overflow-y-auto`}>
        <DialogHeader>
          <DialogTitle>Manage Investment</DialogTitle>
          <DialogDescription>
            Choose an action for your investment: {investment?.reference}
          </DialogDescription>
        </DialogHeader>
        {switchQuote ? (
          <div className="grid gap-3 py-2 text-sm">
            <div className="rounded-lg border border-amber-300 bg-amber-50 p-3">
              <div className="font-semibold mb-1">This top-up moves your investment to {switchQuote.target_type}</div>
              <p>
                With {formatNaira(switchQuote.topup_amount)} added, your investment goes above the{" "}
                {switchQuote.max_amount ? formatNaira(switchQuote.max_amount) : ""} limit for {switchQuote.current_type}.
                It will be moved to <strong>{switchQuote.target_type}</strong>.
              </p>
            </div>
            <table className="w-full">
              <tbody>
                <tr><td className="py-1 text-muted-foreground">Current principal</td><td className="text-right">{formatNaira(switchQuote.current_principal)}</td></tr>
                <tr><td className="py-1 text-muted-foreground">Interest earned so far</td><td className="text-right">{formatNaira(switchQuote.accrued_interest || 0)}</td></tr>
                <tr><td className="py-1 text-muted-foreground">Top-up</td><td className="text-right">{formatNaira(switchQuote.topup_amount)}</td></tr>
                <tr className="border-t font-semibold"><td className="py-1">New {switchQuote.target_type} investment</td><td className="text-right">{formatNaira(switchQuote.new_principal)}</td></tr>
                <tr><td className="py-1 text-muted-foreground">Interest rate</td><td className="text-right">{switchQuote.target_rate}% p.a.</td></tr>
                <tr><td className="py-1 text-muted-foreground">Maturity date (unchanged)</td><td className="text-right">{switchQuote.maturity_date}</td></tr>
              </tbody>
            </table>
            {switchQuote.target_payout_rules && (
              <p className="text-xs text-muted-foreground">Payouts: {switchQuote.target_payout_rules}</p>
            )}
            <p className="text-xs text-muted-foreground">
              Your current investment will be closed and the new one starts when the cooperative approves the top-up.
            </p>
          </div>
        ) : (
        <div className="grid gap-4 py-4">
          <RadioGroup value={action} onValueChange={setAction}>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="liquidate" id="liquidate" />
              <Label htmlFor="liquidate">Liquidate</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="partial_liquidate" id="partial_liquidate" />
              <Label htmlFor="partial_liquidate">Partially Liquidate</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="rollover" id="rollover" />
              <Label htmlFor="rollover">Roll Over</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="topup" id="topup" />
              <Label htmlFor="topup">Top Up</Label>
            </div>
          </RadioGroup>

          {action === "topup" && (
            <div className="grid gap-4 mt-2">
              <div className="grid gap-2">
                <Label htmlFor="topup_amount">Amount to add</Label>
                <Input
                  id="topup_amount"
                  type="number"
                  min={1}
                  placeholder="Enter amount"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                />
                <p className="text-xs text-muted-foreground">
                  Current principal: {formatCurrency(investment?.principal_outstanding ?? investment?.amount ?? 0)}
                </p>
              </div>
              <FundingFields funding={funding} amount={Number(amount)} purpose="this top-up" compact />
            </div>
          )}

          {action === "partial_liquidate" && (
            <div className="grid gap-2 mt-2">
              <Label htmlFor="amount">Amount to Liquidate</Label>
              <Input
                id="amount"
                type="number"
                placeholder="Enter amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
              <p className="text-xs text-muted-foreground">
                Current balance: {formatCurrency(investment?.amount || 0)}
              </p>
            </div>
          )}

          <div className="grid gap-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              placeholder="Enter any additional notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>
        </div>
        )}
        <DialogFooter>
          {switchQuote ? (
            <>
              <Button variant="outline" onClick={() => setSwitchQuote(null)} disabled={loading}>
                Back
              </Button>
              <Button onClick={() => submitTopup(switchQuote)} disabled={loading}>
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Confirm switch to {switchQuote.target_type}
              </Button>
            </>
          ) : (
            <>
              <Button variant="outline" onClick={close} disabled={loading}>
                Cancel
              </Button>
              <Button onClick={handleSubmit} disabled={loading}>
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {action === "topup" ? "Submit Top-up" : "Confirm"}
              </Button>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default InvestmentActionModal;
