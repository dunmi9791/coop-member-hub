import api from "@/hooks/api";
import { UserContext } from "@/hooks/AuthContext";
import React, { useContext, useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Wallet, TrendingUp, CreditCard, Calculator, Edit2, Save, X, Building2, Plus, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Bank {
  id: number;
  name: string;
}

interface BankAccount {
  acc_number: string;
  bank_name: string;
  acc_holder_name: string;
}

const MemberProfile = () => {
  const { credentials } = useContext(UserContext);
  const [profile, setProfile] = useState(null);
  const [dashboardData, setDashboardData] = useState(null);
  const [bankAccounts, setBankAccounts] = useState<BankAccount[]>([]);
  const [banks, setBanks] = useState<Bank[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [isAddBankModalOpen, setIsAddBankModalOpen] = useState(false);
  const [isSubmittingBank, setIsSubmittingBank] = useState(false);
  const [newBankForm, setNewBankForm] = useState({
    bank_id: "",
    acc_number: "",
    acc_holder_name: ""
  });
  const [editForm, setEditForm] = useState({
    gender: "",
    date_of_birth: "",
    phone: "",
    mobile: "",
    address: "",
    state: ""
  });
  const { toast } = useToast();

  const fetchProfileDetails = async () => {
    if (!credentials?.partner_id) return;

    const payload = {
      jsonrpc: '2.0',
      method: 'call',
      params: {
        partner_id: credentials.partner_id
      }
    }
    try {
      const resp = await api.post('/api/portal/profile', payload);
      if (resp?.data?.result?.success) {
        const data = resp.data.result.data;
        setProfile(data);
        setEditForm({
          gender: data.gender || "",
          date_of_birth: data.date_of_birth || "",
          phone: data.phone || "",
          mobile: data.mobile || "",
          address: data.address || "",
          state: data.state || ""
        });
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
    }
  }

  const fetchDashboardDetails = async () => {
    if (!credentials?.partner_id) return;

    const payload = {
      jsonrpc: '2.0',
      method: 'call',
      params: {
        partner_id: credentials.partner_id
      }
    }
    try {
      const resp = await api.post('/api/portal/dashboard', payload);
      setDashboardData(resp?.data?.result);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    }
  }

  const fetchBankAccounts = async () => {
    if (!credentials?.partner_id) return;

    const payload = {
      jsonrpc: '2.0',
      method: 'call',
      params: {
        partner_id: credentials.partner_id
      }
    }
    try {
      const resp = await api.post('/api/portal/bank_accounts', payload);
      if (resp?.data?.result?.success) {
        setBankAccounts(resp.data.result.data || []);
      }
    } catch (error) {
      console.error("Error fetching bank accounts:", error);
    }
  }

  const fetchBanks = async () => {
    const payload = {
      jsonrpc: '2.0',
      method: 'call',
      params: {}
    }
    try {
      const resp = await api.post('/api/portal/banks', payload);
      if (resp?.data?.result?.success) {
        setBanks(resp.data.result.data || []);
      }
    } catch (error) {
      console.error("Error fetching banks:", error);
    }
  }

  useEffect(() => {
    if (credentials?.partner_id) {
      fetchProfileDetails();
      fetchDashboardDetails();
      fetchBankAccounts();
      fetchBanks();
    }
  }, [credentials])

  const handleEditToggle = () => {
    if (isEditing) {
      // Revert changes if cancelling
      setEditForm({
        gender: profile?.gender || "",
        date_of_birth: profile?.date_of_birth || "",
        phone: profile?.phone || "",
        mobile: profile?.mobile || "",
        address: profile?.address || "",
        state: profile?.state || ""
      });
    }
    setIsEditing(!isEditing);
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditForm(prev => ({ ...prev, [name]: value }));
  }

  const handleBankInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewBankForm(prev => ({ ...prev, [name]: value }));
  }

  const handleAddBank = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!credentials?.partner_id) return;

    if (!newBankForm.bank_id || !newBankForm.acc_number || !newBankForm.acc_holder_name) {
      toast({
        variant: "destructive",
        title: "Validation Error",
        description: "All fields are required.",
      });
      return;
    }

    setIsSubmittingBank(true);
    const payload = {
      jsonrpc: '2.0',
      method: 'call',
      id: 1,
      params: {
        bank_id: parseInt(newBankForm.bank_id),
        account_number: newBankForm.acc_number
      }
    }

    try {
      const resp = await api.post('/api/portal/create_bank_account', payload);
      if (resp?.data?.result?.success || resp?.data?.result?.status === "success") {
        toast({
          title: "Bank Account Added",
          description: "Your bank account has been successfully added.",
        });
        setIsAddBankModalOpen(false);
        setNewBankForm({
          bank_id: "",
          acc_number: "",
          acc_holder_name: ""
        });
        fetchBankAccounts();
      } else {
        toast({
          variant: "destructive",
          title: "Error",
          description: resp?.data?.result?.message || "There was an error adding your bank account.",
        });
      }
    } catch (error) {
      console.error("Error adding bank account:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "An unexpected error occurred. Please try again later.",
      });
    } finally {
      setIsSubmittingBank(false);
    }
  }

  const handleSave = async () => {
    if (!credentials?.partner_id) return;

    const payload = {
      jsonrpc: '2.0',
      method: 'call',
      params: {
        partner_id: credentials.partner_id,
        ...editForm
      }
    }
    try {
      const resp = await api.post('/api/portal/profile_update', payload);
      if (resp?.data?.result?.success) {
        toast({
          title: "Profile Updated",
          description: "Your bio data has been successfully updated.",
        });
        setIsEditing(false);
        fetchProfileDetails();
      } else {
        toast({
          variant: "destructive",
          title: "Update Failed",
          description: resp?.data?.result?.message || "There was an error updating your profile.",
        });
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      toast({
        variant: "destructive",
        title: "Update Failed",
        description: "An unexpected error occurred. Please try again later.",
      });
    }
  }

  const displayMember = {
    name: profile?.name || credentials?.name || "Member",
    username: credentials?.username || "",
    gender: profile?.gender || "Not Specified",
    dob: profile?.date_of_birth || "Not Specified",
    address: profile?.address?.trim() || "Not Specified",
    state: profile?.state || "Not Specified",
    membershipId: profile?.membership_id || "N/A",
    joinDate: profile?.join_date || "N/A",
    status: profile?.membership_status || "Unknown",
    phone: profile?.phone || "Not Specified",
    mobile: profile?.mobile || "Not Specified",
    profilePic: profile?.photo ? `data:image/jpeg;base64,${profile.photo}` : "https://i.pravatar.cc/150?img=12",
  };

  return (
    <div className="container mx-auto px-4 py-4">
       <div className="mb-5">
        <h1 className="text-3xl font-bold text-foreground">Profile</h1>
      </div>
      {/* Profile Header */}
      <div className="flex flex-col md:flex-row items-center gap-6 mb-8">
        <img
          src={displayMember.profilePic}
          alt={displayMember.name}
          className="w-32 h-32 rounded-full shadow-md object-cover"
        />
        <div>
          <h1 className="text-2xl font-bold text-foreground capitalize">
            {displayMember.name}
          </h1>
          <p className="text-muted-foreground ">{displayMember.username}</p>
        </div>
      </div>

      {/* Profile Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Biodata */}
        <div className="p-6 bg-white rounded-2xl shadow">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Biodata</h2>
            {!isEditing ? (
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={handleEditToggle}
                className="text-primary flex items-center gap-1"
              >
                <Edit2 className="h-4 w-4" /> Edit
              </Button>
            ) : (
              <div className="flex gap-2">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={handleEditToggle}
                  className="text-destructive flex items-center gap-1"
                >
                  <X className="h-4 w-4" /> Cancel
                </Button>
                <Button 
                  size="sm" 
                  onClick={handleSave}
                  className="flex items-center gap-1"
                >
                  <Save className="h-4 w-4" /> Save
                </Button>
              </div>
            )}
          </div>
          
          {!isEditing ? (
            <ul className="space-y-2">
              <li><span className="font-medium">Gender:</span> {displayMember.gender}</li>
              <li><span className="font-medium">Date of Birth:</span> {displayMember.dob}</li>
              <li><span className="font-medium">Phone:</span> {displayMember.phone}</li>
              <li><span className="font-medium">Mobile:</span> {displayMember.mobile}</li>
              <li><span className="font-medium">Address:</span> {displayMember.address}</li>
              <li><span className="font-medium">State:</span> {displayMember.state}</li>
            </ul>
          ) : (
            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium mb-1 block">Gender</label>
                <Input 
                  name="gender" 
                  value={editForm.gender} 
                  onChange={handleInputChange} 
                  placeholder="Gender"
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Date of Birth</label>
                <Input 
                  name="date_of_birth" 
                  type="date"
                  value={editForm.date_of_birth} 
                  onChange={handleInputChange} 
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Phone</label>
                <Input 
                  name="phone" 
                  value={editForm.phone} 
                  onChange={handleInputChange} 
                  placeholder="Phone"
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Mobile</label>
                <Input 
                  name="mobile" 
                  value={editForm.mobile} 
                  onChange={handleInputChange} 
                  placeholder="Mobile"
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Address</label>
                <Input 
                  name="address" 
                  value={editForm.address} 
                  onChange={handleInputChange} 
                  placeholder="Address"
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">State</label>
                <Input 
                  name="state" 
                  value={editForm.state} 
                  onChange={handleInputChange} 
                  placeholder="State"
                />
              </div>
            </div>
          )}
        </div>

        {/* Membership Info */}
        <div className="p-6 bg-white rounded-2xl shadow">
          <h2 className="text-lg font-semibold mb-4">Membership Info</h2>
          <ul className="space-y-2">
            <li><span className="font-medium">Membership ID:</span> {displayMember.membershipId}</li>
            <li><span className="font-medium">Join Date:</span> {displayMember.joinDate}</li>
            <li>
              <span className="font-medium">Status:</span>{" "}
              <span
                className={`px-2 py-1 rounded-full text-sm capitalize ${
                  displayMember.status === "active"
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-700"
                }`}
              >
                {displayMember.status}
              </span>
            </li>
          </ul>
        </div>

        {/* Financial Summary */}
        <div className="p-6 bg-white rounded-2xl shadow col-span-1 md:col-span-2">
          <h2 className="text-lg font-semibold mb-4">Financial Summary</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-4 bg-blue-50 rounded-xl">
              <p className="text-sm text-blue-600">Savings Balance</p>
              <h3 className="text-xl font-bold">{new Intl.NumberFormat('en-US', {minimumFractionDigits:2}).format(dashboardData?.savings?.total_balance || 0)}</h3>
            </div>
            <div className="p-4 bg-red-50 rounded-xl">
              <p className="text-sm text-red-600">Loan Balance</p>
              <h3 className="text-xl font-bold">{new Intl.NumberFormat('en-US', {minimumFractionDigits:2}).format(dashboardData?.loans?.outstanding_loans || 0)}</h3>
            </div>
          </div>
        </div>

        {/* LPP Summary */}
        <div className="p-6 bg-white rounded-2xl shadow col-span-1 md:col-span-2">
          <h2 className="text-lg font-semibold mb-4">Loan Processing Power (LPP)</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Total LPP</p>
                    <p className="text-xl font-bold text-foreground">{new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN', minimumFractionDigits: 0 }).format(dashboardData?.lpp?.total || 0)}</p>
                  </div>
                  <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center">
                    <Wallet className="h-5 w-5 text-primary" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-destructive/10 to-destructive/5 border-destructive/20">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Total Active Loans</p>
                    <p className="text-xl font-bold text-foreground">{new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN', minimumFractionDigits: 0 }).format(dashboardData?.lpp?.used || 0)}</p>
                  </div>
                  <div className="h-10 w-10 rounded-full bg-destructive/20 flex items-center justify-center">
                    <CreditCard className="h-5 w-5 text-destructive" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Bank Accounts */}
        <div className="p-6 bg-white rounded-2xl shadow col-span-1 md:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Building2 className="h-5 w-5 text-primary" />
              <h2 className="text-lg font-semibold">Bank Accounts</h2>
            </div>
            <Button 
              size="sm" 
              onClick={() => setIsAddBankModalOpen(true)}
              className="flex items-center gap-1"
            >
              <Plus className="h-4 w-4" /> Add Account
            </Button>
          </div>
          {bankAccounts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {bankAccounts.map((account, index) => (
                <Card key={index} className="border-primary/10">
                  <CardContent className="p-4">
                    <p className="text-sm font-medium text-foreground">{account.acc_holder_name}</p>
                    <p className="text-lg font-bold text-primary">{account.acc_number}</p>
                    <p className="text-sm text-muted-foreground">{account.bank_name}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground text-sm italic">No bank accounts found.</p>
          )}
        </div>

      <Dialog open={isAddBankModalOpen} onOpenChange={setIsAddBankModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add Bank Account</DialogTitle>
            <DialogDescription>
              Enter the details of your bank account below.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleAddBank} className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Account Holder Name</label>
              <Input
                name="acc_holder_name"
                value={newBankForm.acc_holder_name}
                onChange={handleBankInputChange}
                placeholder="Full Name"
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Bank Name</label>
              <Select
                value={newBankForm.bank_id}
                onValueChange={(value) => setNewBankForm(prev => ({ ...prev, bank_id: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a bank" />
                </SelectTrigger>
                <SelectContent>
                  {banks.map((bank) => (
                    <SelectItem key={bank.id} value={bank.id.toString()}>
                      {bank.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Account Number</label>
              <Input
                name="acc_number"
                value={newBankForm.acc_number}
                onChange={handleBankInputChange}
                placeholder="Account Number"
                required
              />
            </div>
            <DialogFooter className="pt-4">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setIsAddBankModalOpen(false)}
                disabled={isSubmittingBank}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmittingBank}>
                {isSubmittingBank ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Adding...
                  </>
                ) : (
                  "Add Account"
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
      </div>
    </div>
  );
};

export default MemberProfile;
