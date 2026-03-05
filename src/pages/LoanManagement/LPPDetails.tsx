import React, { useState, useEffect, useContext } from 'react';
import { UserContext } from '@/hooks/AuthContext';
import api from '@/hooks/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { NumericFormat } from 'react-number-format';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';

interface Deduction {
  name: string;
  amount: number;
}

interface LPPData {
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
  other_deductions: Deduction[];
  contribution_deductions: Deduction[];
}

const LPPDetails = () => {
  const { credentials } = useContext(UserContext);
  const [lppData, setLppData] = useState<LPPData | null>(null);
  const [loading, setLoading] = useState(true);

  // Edit state and handlers for BMT
  const [isEditingBMT, setIsEditingBMT] = useState(false);
  const [editedBMT, setEditedBMT] = useState<string>('');
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const fetchLPPDetails = async () => {
      try {
        const payload = {
          jsonrpc: '2.0',
          method: 'call',
          params: {
            partner_id: credentials?.partner_id,
          },
          id: 1,
        };
        const resp = await api.post('/api/portal/loan_management', payload);
        if (resp.data.result) {
          setLppData(resp.data.result);
        }
      } catch (error) {
        console.error('Error fetching LPP details:', error);
      } finally {
        setLoading(false);
      }
    };

    if (credentials?.partner_id) {
      fetchLPPDetails();
    } else {
      setLoading(false);
    }
  }, [credentials]);

  if (loading) {
    return <div className="p-5 text-center">Loading LPP details...</div>;
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: lppData?.currency?.name || 'NGN',
    }).format(amount);
  };

  const startEditBMT = () => {
    setEditedBMT(String(lppData?.basic_meal_transport ?? 0));
    setIsEditingBMT(true);
  };

  const cancelEditBMT = () => {
    setIsEditingBMT(false);
    setEditedBMT('');
  };

  const saveBMT = async () => {
    const numericValue = Number(editedBMT);
    if (Number.isNaN(numericValue)) {
      toast({ title: 'Invalid value', description: 'Please enter a valid number for BMT.', variant: 'destructive' });
      return;
    }

    try {
      setSaving(true);
      const payload = {
        jsonrpc: '2.0',
        method: 'call',
        params: {
          partner_id: credentials?.partner_id,
          basic_meal_transport: numericValue,
        },
        id: 1,
      };
      const resp = await api.post('/api/portal/loan_management_update', payload);
      if (resp?.data?.result) {
        setLppData(prev => (prev ? { ...prev, basic_meal_transport: numericValue } : prev));
        setIsEditingBMT(false);
        toast({ title: 'BMT updated', description: 'Your Basic Meal Transport income was updated successfully.' });
      } else {
        throw new Error('Unexpected response');
      }
    } catch (error) {
      console.error('Error updating BMT:', error);
      toast({ title: 'Update failed', description: 'Could not update BMT. Please try again.', variant: 'destructive' });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card className="overflow-hidden border-l-4 border-l-[#043d73]">
          <CardContent className="p-4 space-y-2">
            <p className="text-sm font-medium text-muted-foreground mb-1">Basic Meal Transport (BMT) Income</p>
            {!isEditingBMT ? (
              <div className="flex items-center justify-between gap-3">
                <p className="text-2xl font-bold text-[#043d73]">
                  <NumericFormat
                    value={lppData?.basic_meal_transport ?? 0}
                    displayType={'text'}
                    thousandSeparator={true}
                    prefix={lppData?.currency?.symbol || '₦'}
                    decimalScale={2}
                    fixedDecimalScale={true}
                  />
                </p>
                <Button variant="outline" onClick={startEditBMT}>Update</Button>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground">{lppData?.currency?.symbol || '₦'}</span>
                  <Input
                    type="number"
                    step="0.01"
                    value={editedBMT}
                    onChange={(e) => setEditedBMT(e.target.value)}
                    className="max-w-[200px]"
                  />
                </div>
                <div className="flex gap-2">
                  <Button onClick={saveBMT} disabled={saving}>
                    {saving ? 'Saving...' : 'Save'}
                  </Button>
                  <Button variant="outline" onClick={cancelEditBMT} disabled={saving}>Cancel</Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
        <DetailCard title="Minimum Take Home" value={lppData?.minimum_take_home} currencySymbol={lppData?.currency?.symbol} />
        <DetailCard title="Current Take Home" value={lppData?.current_take_home} currencySymbol={lppData?.currency?.symbol} />
        <DetailCard title="Total Loan Deductions" value={lppData?.total_loan_deductions} currencySymbol={lppData?.currency?.symbol} />
        <DetailCard title="Savings Contribution" value={lppData?.saving_contribution} currencySymbol={lppData?.currency?.symbol} />
        <DetailCard title="Total Company Deductions" value={lppData?.total_company_deductions} currencySymbol={lppData?.currency?.symbol} />
      </div>

      <Card className="border-[#043d73]/20">
        <CardHeader className="bg-[#043d73] text-white rounded-t-lg py-3">
          <CardTitle className="text-lg font-medium">Other Deductions</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="pl-6">Deduction Name</TableHead>
                <TableHead className="text-right pr-6">Amount</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {lppData?.other_deductions && lppData.other_deductions.length > 0 ? (
                lppData.other_deductions.map((deduction, index) => (
                  <TableRow key={index}>
                    <TableCell className="pl-6 font-medium">{deduction.name}</TableCell>
                    <TableCell className="text-right pr-6">
                      {formatCurrency(deduction.amount)}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={2} className="text-center py-4 text-muted-foreground">
                    No other deductions found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

const DetailCard = ({ title, value, currencySymbol }: { title: string; value?: number; currencySymbol?: string }) => (
  <Card className="overflow-hidden border-l-4 border-l-[#043d73]">
    <CardContent className="p-4">
      <p className="text-sm font-medium text-muted-foreground mb-1">{title}</p>
      <p className="text-2xl font-bold text-[#043d73]">
        <NumericFormat
          value={value ?? 0}
          displayType={'text'}
          thousandSeparator={true}
          prefix={currencySymbol || '₦'}
          decimalScale={2}
          fixedDecimalScale={true}
        />
      </p>
    </CardContent>
  </Card>
);

export default LPPDetails;
