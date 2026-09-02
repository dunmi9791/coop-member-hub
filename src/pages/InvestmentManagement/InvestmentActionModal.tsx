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

  const handleSubmit = async () => {
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
        onClose();
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
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Manage Investment</DialogTitle>
          <DialogDescription>
            Choose an action for your investment: {investment?.reference}
          </DialogDescription>
        </DialogHeader>
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
          </RadioGroup>

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
        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={loading}>
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Confirm
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default InvestmentActionModal;
