import api from "@/hooks/api";
import { UserContext } from "@/hooks/AuthContext";
import React, { useContext, useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Wallet, TrendingUp, CreditCard, Calculator } from "lucide-react";
const MemberProfile = () => {
  const {credentials} = useContext(UserContext)
  const [details, setDetails]= useState(null)
  const member = {
    name: "Abdul Rahman",
    email: "abdulrahman@example.com",
    phone: "+2348012345678",
    gender: "Male",
    dob: "1995-06-21",
    address: "12, Alhaji Bello Street, Lagos",
    state: "Lagos",
    membershipId: "COOP-2025-001",
    joinDate: "2022-05-14",
    status: "Active",
    savingsBalance: 250000,
    loanBalance: 50000,
    profilePic: "https://i.pravatar.cc/150?img=12", // placeholder
  };

   const fetchMemberDetails= async()=>{
    const payload = {
      jsonrpc: '2.0',
      method: 'call',
      params: {}
    }
    await api.post('/api/portal/dashboard', payload).then(resp=>setDetails(resp?.data?.result))
  }

  useEffect(()=>{
fetchMemberDetails()
  }, [])

  return (
    <div className="container mx-auto px-4 py-4">
       <div className="mb-5">
        <h1 className="text-3xl font-bold text-foreground">Profile</h1>
      </div>
      {/* Profile Header */}
      <div className="flex flex-col md:flex-row items-center gap-6 mb-8">
        <img
          src={member.profilePic}
          alt={member.name}
          className="w-32 h-32 rounded-full shadow-md object-cover"
        />
        <div>
          <h1 className="text-2xl font-bold text-foreground capitalize">
            {credentials?.result?.name}
          </h1>
          <p className="text-muted-foreground ">{credentials?.result?.username}</p>
          <p className="text-muted-foreground">{member.phone}</p>
        </div>
      </div>

      {/* Profile Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Biodata */}
        <div className="p-6 bg-white rounded-2xl shadow">
          <h2 className="text-lg font-semibold mb-4">Biodata</h2>
          <ul className="space-y-2">
            <li><span className="font-medium">Gender:</span> {member.gender}</li>
            <li><span className="font-medium">Date of Birth:</span> {member.dob}</li>
            <li><span className="font-medium">Address:</span> {member.address}</li>
            <li><span className="font-medium">State:</span> {member.state}</li>
          </ul>
        </div>

        {/* Membership Info */}
        <div className="p-6 bg-white rounded-2xl shadow">
          <h2 className="text-lg font-semibold mb-4">Membership Info</h2>
          <ul className="space-y-2">
            <li><span className="font-medium">Membership ID:</span> {member.membershipId}</li>
            <li><span className="font-medium">Join Date:</span> {member.joinDate}</li>
            <li>
              <span className="font-medium">Status:</span>{" "}
              <span
                className={`px-2 py-1 rounded-full text-sm ${
                  member.status === "Active"
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-700"
                }`}
              >
                {member.status}
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
              <h3 className="text-xl font-bold">{new Intl.NumberFormat('en-US', {minimumFractionDigits:2}).format(details?.savings?.total_balance)}</h3>
            </div>
            <div className="p-4 bg-red-50 rounded-xl">
              <p className="text-sm text-red-600">Loan Balance</p>
              <h3 className="text-xl font-bold">{new Intl.NumberFormat('en-US', {minimumFractionDigits:2}).format(details?.loans?.outstanding_loans)}</h3>
            </div>
          </div>
        </div>

        {/* LPP Summary */}
        <div className="p-6 bg-white rounded-2xl shadow col-span-1 md:col-span-2">
          <h2 className="text-lg font-semibold mb-4">Loan Processing Power (LPP)</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Total LPP</p>
                    <p className="text-xl font-bold text-foreground">{new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN', minimumFractionDigits: 0 }).format(details?.lpp?.total || 0)}</p>
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
                    <p className="text-sm text-muted-foreground">Used LPP</p>
                    <p className="text-xl font-bold text-foreground">{new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN', minimumFractionDigits: 0 }).format(details?.lpp?.used || 0)}</p>
                  </div>
                  <div className="h-10 w-10 rounded-full bg-destructive/20 flex items-center justify-center">
                    <CreditCard className="h-5 w-5 text-destructive" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-green-500/10 to-green-500/5 border-green-500/20">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Available LPP</p>
                    <p className="text-xl font-bold text-foreground">{new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN', minimumFractionDigits: 0 }).format(details?.lpp?.available || 0)}</p>
                  </div>
                  <div className="h-10 w-10 rounded-full bg-green-500/20 flex items-center justify-center">
                    <TrendingUp className="h-5 w-5 text-green-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-amber-500/10 to-amber-500/5 border-amber-500/20">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">LPP Utilization</p>
                    <p className="text-xl font-bold text-foreground">{details?.lpp?.total ? Math.round((details?.lpp?.used / details?.lpp?.total) * 100) : 0}%</p>
                  </div>
                  <div className="h-10 w-10 rounded-full bg-amber-500/20 flex items-center justify-center">
                    <Calculator className="h-5 w-5 text-amber-600" />
                  </div>
                </div>
                <div className="mt-2 h-2 bg-muted rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-amber-500 rounded-full transition-all duration-500"
                    style={{ width: `${details?.lpp?.total ? Math.round((details?.lpp?.used / details?.lpp?.total) * 100) : 0}%` }}
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MemberProfile;
