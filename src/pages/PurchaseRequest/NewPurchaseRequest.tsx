import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { UserContext } from '@/hooks/AuthContext';
import api from '@/hooks/api';
import { toast } from "@/components/ui/use-toast";
import { NumericFormat } from 'react-number-format';

const NewPurchaseRequest = () => {
  const { credentials } = useContext(UserContext);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    request_type: '',
    vendor: '',
    vendor_contact: '',
    description: '',
    estimated_amount: '',
    payment_option: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!credentials?.partner_id) {
      toast({
        title: "Error",
        description: "User session not found. Please log in again.",
        variant: "destructive",
      });
      return;
    }

    if (!formData.request_type || !formData.payment_option) {
        toast({
            title: "Validation Error",
            description: "Please fill all required fields.",
            variant: "destructive",
          });
          return;
    }

    setLoading(true);
    try {
      const payload = {
        jsonrpc: '2.0',
        method: 'call',
        params: {
          partner_id: credentials.partner_id,
          request_type: formData.request_type,
          vendor: formData.vendor,
          vendor_contact: formData.vendor_contact,
          description: formData.description,
          estimated_amount: parseFloat(formData.estimated_amount.replace(/,/g, '')),
          payment_option: formData.payment_option,
        },
        id: Math.floor(Math.random() * 1000),
      };

      const response = await api.post('/api/portal/purchase_request/create', payload);

      if (response.data.result && (response.data.result.success || response.data.result.id)) {
        toast({
          title: "Success",
          description: "Purchase request submitted successfully.",
        });
        
        const resultData = response.data.result;
        navigate('/dashboard/purchase-request/result', { 
          state: { 
            status: 'success', 
            details: {
              ...resultData,
              request_type: formData.request_type,
              estimated_amount: parseFloat(formData.estimated_amount.replace(/,/g, '')),
            } 
          } 
        });

        setFormData({
          request_type: '',
          vendor: '',
          vendor_contact: '',
          description: '',
          estimated_amount: '',
          payment_option: '',
        });
      } else {
        toast({
          title: "Error",
          description: response.data.result?.message || "Failed to submit purchase request.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error submitting purchase request:', error);
      toast({
        title: "Error",
        description: "An unexpected error occurred.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Create New Purchase Request</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="request_type">Request Type <span className="text-destructive">*</span></Label>
            <Select 
                onValueChange={(value) => handleSelectChange('request_type', value)}
                value={formData.request_type}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="car">Car</SelectItem>
                <SelectItem value="household_item">Household Item</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="vendor">Vendor</Label>
            <Input
              id="vendor"
              name="vendor"
              value={formData.vendor}
              onChange={handleChange}
              placeholder="Enter vendor name"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="vendor_contact">Vendor Contact</Label>
            <Input
              id="vendor_contact"
              name="vendor_contact"
              value={formData.vendor_contact}
              onChange={handleChange}
              placeholder="Enter vendor contact information"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="estimated_amount">Estimated Amount <span className="text-destructive">*</span></Label>
            <NumericFormat
              id="estimated_amount"
              customInput={Input}
              thousandSeparator={true}
              prefix={'₦'}
              value={formData.estimated_amount}
              onValueChange={(values) => {
                setFormData((prev) => ({ ...prev, estimated_amount: values.value }));
              }}
              placeholder="e.g. 50,000"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="payment_option">Payment Option <span className="text-destructive">*</span></Label>
            <Select 
                onValueChange={(value) => handleSelectChange('payment_option', value)}
                value={formData.payment_option}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select payment option" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="savings">Savings</SelectItem>
                <SelectItem value="loan">Loan</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Detailed Description <span className="text-destructive">*</span></Label>
            <Textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Provide a detailed description of the item"
              className="min-h-[120px]"
              required
            />
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Submitting...
              </>
            ) : (
              'Submit Request'
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default NewPurchaseRequest;
