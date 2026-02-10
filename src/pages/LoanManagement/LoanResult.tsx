import React from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle2, XCircle, ArrowLeft, Info } from 'lucide-react';

const LoanResult = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { status, message, details, error } = location.state || {};

  if (!location.state) {
    return (
      <div className="flex flex-col items-center justify-center p-10">
        <Info className="w-16 h-16 text-blue-500 mb-4" />
        <h2 className="text-2xl font-bold mb-2">No Application Data</h2>
        <p className="text-muted-foreground mb-6">We couldn't find any recent loan application details.</p>
        <Button onClick={() => navigate('/dashboard/loans')}>
          Go to Loan Application
        </Button>
      </div>
    );
  }

  const isSuccess = status === 'success' || !error;

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
            {isSuccess ? 'Application Submitted Successfully' : 'Application Failed'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="bg-muted p-4 rounded-lg mb-6">
            <p className="text-center font-medium">
              {message || (isSuccess ? 'Your loan application has been received and is being processed.' : 'There was an issue processing your loan application.')}
            </p>
          </div>

          {details && (
            <div className="space-y-4">
              <h3 className="font-semibold border-b pb-2">Application Details</h3>
              <div className="grid grid-cols-2 gap-y-3 text-sm">
                <div className="text-muted-foreground">Loan Amount:</div>
                <div className="font-medium">
                  {new Intl.NumberFormat('en-NG', {
                    style: 'currency',
                    currency: 'NGN',
                  }).format(details.loanAmount)}
                </div>

                <div className="text-muted-foreground">Duration:</div>
                <div className="font-medium">{details.duration} Months</div>

                <div className="text-muted-foreground">Start Date:</div>
                <div className="font-medium">{details.start_date}</div>

                <div className="text-muted-foreground">First Repayment:</div>
                <div className="font-medium">{details.first_repayment_date}</div>
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
            <Button variant="outline" onClick={() => navigate('/dashboard/loans')} className="flex items-center gap-2">
              <ArrowLeft className="w-4 h-4" /> Back to Loans
            </Button>
            {isSuccess ? (
              <Button asChild>
                <Link to="/dashboard/loans/loan-requests">View Loan Requests</Link>
              </Button>
            ) : (
              <Button onClick={() => navigate('/dashboard/loans')}>
                Try Again
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LoanResult;
