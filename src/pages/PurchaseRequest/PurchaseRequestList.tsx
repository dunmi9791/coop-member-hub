import React, { useState, useEffect, useContext } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Loader2, AlertCircle, CheckCircle2 } from 'lucide-react';
import { UserContext } from '@/hooks/AuthContext';
import api from '@/hooks/api';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast } from "@/components/ui/use-toast";

interface PurchaseRequest {
  id: number;
  name: string;
  request_type: string;
  amount: number;
  state: string;
  delivery_confirmed: boolean;
}

const PurchaseRequestList = () => {
  const { credentials } = useContext(UserContext);
  const [requests, setRequests] = useState<PurchaseRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [confirmingId, setConfirmingId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchRequests = async () => {
    if (!credentials?.partner_id) return;
    
    setLoading(true);
    try {
      const payload = {
        jsonrpc: '2.0',
        method: 'call',
        params: {
          partner_id: credentials.partner_id,
        },
        id: Math.floor(Math.random() * 1000),
      };
      const response = await api.post('/api/portal/purchase_request/list', payload);
      if (response.data.result && Array.isArray(response.data.result)) {
        setRequests(response.data.result);
      } else {
        setError(response.data.result?.message || 'Failed to fetch purchase requests');
      }
    } catch (err) {
      console.error('Error fetching purchase requests:', err);
      setError('An error occurred while fetching purchase requests');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, [credentials]);

  const handleConfirmDelivery = async (requestId: number) => {
    setConfirmingId(requestId);
    try {
      const payload = {
        jsonrpc: '2.0',
        method: 'call',
        params: {
          request_id: requestId,
        },
        id: Math.floor(Math.random() * 1000),
      };
      const response = await api.post('/api/portal/purchase_request/confirm_delivery', payload);
      
      if (response.data.result && response.data.result.success) {
        toast({
          title: "Success",
          description: "Delivery confirmed successfully.",
        });
        // Refresh the list
        fetchRequests();
      } else {
        toast({
          title: "Error",
          description: response.data.result?.message || "Failed to confirm delivery.",
          variant: "destructive",
        });
      }
    } catch (err) {
      console.error('Error confirming delivery:', err);
      toast({
        title: "Error",
        description: "An unexpected error occurred.",
        variant: "destructive",
      });
    } finally {
      setConfirmingId(null);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'draft':
        return <Badge className="bg-gray-100 text-gray-800" variant="outline">Draft</Badge>;
      case 'submitted':
        return <Badge className="bg-blue-100 text-blue-800" variant="outline">Submitted</Badge>;
      case 'approved':
      case 'validated':
        return <Badge className="bg-green-100 text-green-800" variant="outline">Validated</Badge>;
      case 'delivered':
        return <Badge className="bg-purple-100 text-purple-800" variant="outline">Delivered</Badge>;
      case 'cancelled':
        return <Badge className="bg-red-100 text-red-800" variant="outline">Cancelled</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800" variant="outline">{status || 'Unknown'}</Badge>;
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  if (loading && requests.length === 0) {
    return (
      <div className="flex justify-center items-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-destructive">
        <AlertCircle className="h-10 w-10 mb-2" />
        <p>{error}</p>
        <Button variant="outline" className="mt-4" onClick={fetchRequests}>Retry</Button>
      </div>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>My Purchase Requests</CardTitle>
      </CardHeader>
      <CardContent>
        {requests.length === 0 ? (
          <div className="text-center py-10 text-muted-foreground">
            No purchase requests found.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Reference</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {requests.map((request) => (
                  <TableRow key={request.id}>
                    <TableCell className="font-medium">{request.name}</TableCell>
                    <TableCell className="capitalize">{request.request_type?.replace('_', ' ')}</TableCell>
                    <TableCell>{formatCurrency(request.amount)}</TableCell>
                    <TableCell>{getStatusBadge(request.state)}</TableCell>
                    <TableCell className="text-right">
                      {!request.delivery_confirmed && (request.state?.toLowerCase() === 'approved' || request.state?.toLowerCase() === 'validated') ? (
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="flex items-center gap-1"
                          onClick={() => handleConfirmDelivery(request.id)}
                          disabled={confirmingId === request.id}
                        >
                          {confirmingId === request.id ? (
                            <Loader2 className="h-3 w-3 animate-spin" />
                          ) : (
                            <CheckCircle2 className="h-3 w-3" />
                          )}
                          Confirm Delivery
                        </Button>
                      ) : request.delivery_confirmed ? (
                        <Badge variant="secondary" className="bg-green-50 text-green-700 hover:bg-green-50">
                          <CheckCircle2 className="h-3 w-3 mr-1" /> Delivered
                        </Badge>
                      ) : null}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PurchaseRequestList;
