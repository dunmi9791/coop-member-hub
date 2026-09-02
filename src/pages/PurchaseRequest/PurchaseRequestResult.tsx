import React from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle2, XCircle, ArrowLeft, Info } from 'lucide-react';

const PurchaseRequestResult = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { status, message, details, error } = location.state || {};

  if (!location.state) {
    return (
      <div className="flex flex-col items-center justify-center p-10">
        <Info className="w-16 h-16 text-blue-500 mb-4" />
        <h2 className="text-2xl font-bold mb-2">No Request Data</h2>
        <p className="text-muted-foreground mb-6">We couldn't find any recent purchase request details.</p>
        <Button onClick={() => navigate('/dashboard/purchase-request')}>
          Go to Purchase Requests
        </Button>
      </div>
    );
  }

  const isSuccess = status === 'success' && !error;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
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
            {isSuccess ? 'Purchase Request Submitted' : 'Submission Failed'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="bg-muted p-4 rounded-lg mb-6">
            <p className="text-center font-medium">
              {message || (isSuccess ? 'Your purchase request has been submitted successfully.' : 'There was an issue submitting your purchase request.')}
            </p>
          </div>

          {details && (
            <div className="space-y-4">
              <h3 className="font-semibold border-b pb-2">Request Details</h3>
              <div className="grid grid-cols-2 gap-y-3 text-sm">
                <div className="text-muted-foreground">Reference:</div>
                <div className="font-medium">{details.name}</div>

                <div className="text-muted-foreground">Request Type:</div>
                <div className="font-medium capitalize">{details.request_type?.replace('_', ' ')}</div>

                {details.estimated_amount && (
                  <>
                    <div className="text-muted-foreground">Estimated Amount:</div>
                    <div className="font-medium">{formatCurrency(details.estimated_amount)}</div>
                  </>
                )}

                <div className="text-muted-foreground">Status:</div>
                <div className="font-medium capitalize">{details.state}</div>
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
            <Button variant="outline" onClick={() => navigate('/dashboard/purchase-request')} className="flex items-center gap-2">
              <ArrowLeft className="w-4 h-4" /> Back to Requests
            </Button>
            {isSuccess && (
              <Button onClick={() => {
                // Navigate to the list tab by setting a state or just navigating to the parent
                navigate('/dashboard/purchase-request', { state: { activeTab: 'list' } });
              }}>
                View My Requests
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PurchaseRequestResult;
