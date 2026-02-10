import React, { useState, useEffect, useContext } from 'react';
import { UserContext } from '@/hooks/AuthContext';
import api from '@/hooks/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { NumericFormat } from 'react-number-format';

interface ThirdPartyDeduction {
  name: string;
  amount: number;
}

interface LPPData {
  bmt_income: number;
  min_take_home: number;
  current_take_home: number;
  total_deduction_loans: number;
  savings_contribution: number;
  total_third_party_deductions: number;
  third_party_deductions: ThirdPartyDeduction[];
}

const LPPDetails = () => {
  const { credentials } = useContext(UserContext);
  const [lppData, setLppData] = useState<LPPData | null>(null);
  const [loading, setLoading] = useState(true);

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
        const resp = await api.post('/api/portal/lpp_details', payload);
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
        // Fallback or demo data if no partner_id for now
        setLppData({
            bmt_income: 500000,
            min_take_home: 150000,
            current_take_home: 320000,
            total_deduction_loans: 100000,
            savings_contribution: 50000,
            total_third_party_deductions: 30000,
            third_party_deductions: [
                { name: 'Health Insurance', amount: 10000 },
                { name: 'Pension', amount: 20000 }
            ]
        });
        setLoading(false);
    }
  }, [credentials]);

  if (loading) {
    return <div className="p-5 text-center">Loading LPP details...</div>;
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
    }).format(amount);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <DetailCard title="BMT Income" value={lppData?.bmt_income} />
        <DetailCard title="Minimum Take Home" value={lppData?.min_take_home} />
        <DetailCard title="Current Take Home" value={lppData?.current_take_home} />
        <DetailCard title="Total Deduction Loans" value={lppData?.total_deduction_loans} />
        <DetailCard title="Savings Contribution" value={lppData?.savings_contribution} />
        <DetailCard title="Total Third Party Deductions" value={lppData?.total_third_party_deductions} />
      </div>

      <Card className="border-[#043d73]/20">
        <CardHeader className="bg-[#043d73] text-white rounded-t-lg py-3">
          <CardTitle className="text-lg font-medium">Third Party Deductions</CardTitle>
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
              {lppData?.third_party_deductions && lppData.third_party_deductions.length > 0 ? (
                lppData.third_party_deductions.map((deduction, index) => (
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
                    No third party deductions found.
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

const DetailCard = ({ title, value }: { title: string; value?: number }) => (
  <Card className="overflow-hidden border-l-4 border-l-[#043d73]">
    <CardContent className="p-4">
      <p className="text-sm font-medium text-muted-foreground mb-1">{title}</p>
      <p className="text-2xl font-bold text-[#043d73]">
        <NumericFormat
          value={value ?? 0}
          displayType={'text'}
          thousandSeparator={true}
          prefix={'₦'}
          decimalScale={2}
          fixedDecimalScale={true}
        />
      </p>
    </CardContent>
  </Card>
);

export default LPPDetails;
