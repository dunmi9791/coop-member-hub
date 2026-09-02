import React from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle2, XCircle, ArrowLeft, Info } from 'lucide-react';

const InvestmentResult = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { success, message, data, error } = location.state || {};

  if (!location.state) {
    return (
      <div className="flex flex-col items-center justify-center p-10">
        <Info className="w-16 h-16 text-blue-500 mb-4" />
        <h2 className="text-2xl font-bold mb-2">No Investment Data</h2>
        <p className="text-muted-foreground mb-6">We couldn't find any recent investment details.</p>
        <Button onClick={() => navigate('/dashboard/investments')}>
          Go to Investment Portfolio
        </Button>
      </div>
    );
  }

  const isSuccess = success === true && !error;

  const formatCurrency = (amount: number, currency: string = 'NGN') => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: currency,
    }).format(amount);
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <Card className={`border-t-4 ${isSuccess ? 'border-t-green-500' : 'border-t-red-500'}`}>
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            {isSuccess ? (
              <CheckCircle2 className="w-20 h-20 text-green-500" />
            ) : (
              <XCircle className="w-20 h-20 text-red-500" />
            )}
          </div>
          <CardTitle className="text-2xl">
            {isSuccess ? 'Investment Successful' : 'Investment Failed'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="bg-muted p-4 rounded-lg mb-6 text-center">
            <p className="font-medium">
              {message || (isSuccess ? 'Your investment has been created and confirmed successfully.' : 'There was an issue processing your investment.')}
            </p>
          </div>

          {data && (
            <div className="space-y-4">
              <h3 className="font-semibold border-b pb-2">Investment Details</h3>
              <div className="grid grid-cols-2 gap-y-3 text-sm">
                <div className="text-muted-foreground">Reference:</div>
                <div className="font-medium">{data.reference}</div>

                <div className="text-muted-foreground">Certificate Number:</div>
                <div className="font-medium">{data.certificate_number}</div>

                <div className="text-muted-foreground">Investment Type:</div>
                <div className="font-medium">{data.investment_type}</div>

                <div className="text-muted-foreground">Amount:</div>
                <div className="font-medium">{formatCurrency(data.amount, data.currency)}</div>

                <div className="text-muted-foreground">Start Date:</div>
                <div className="font-medium">{data.start_date}</div>

                <div className="text-muted-foreground">Maturity Date:</div>
                <div className="font-medium">{data.maturity_date}</div>

                <div className="text-muted-foreground">Interest Option:</div>
                <div className="font-medium capitalize">{data.interest_option}</div>

                <div className="text-muted-foreground">Interest Rate:</div>
                <div className="font-medium">{data.applied_interest_rate}%</div>

                <div className="text-muted-foreground">Tenor:</div>
                <div className="font-medium">{data.tenor_name} ({data.tenor_days} days)</div>
              </div>
            </div>
          )}

          {error && (
            <div className="mt-4 p-4 bg-red-50 text-red-700 rounded-lg border border-red-100">
              <p className="text-sm font-semibold mb-1">Error details:</p>
              <p className="text-sm">{error}</p>
            </div>
          )}

          <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="outline" onClick={() => navigate('/dashboard/investments')} className="flex items-center gap-2">
              <ArrowLeft className="w-4 h-4" /> Back to Investments
            </Button>
            {isSuccess ? (
              <Button asChild>
                <Link to="/dashboard/investments">View Portfolio</Link>
              </Button>
            ) : (
              <Button onClick={() => navigate('/dashboard/investments/invest')}>
                Try Again
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default InvestmentResult;
