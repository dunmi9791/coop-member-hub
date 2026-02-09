import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Wallet, 
  CreditCard, 
  TrendingUp, 
  Plus, 
  Minus,
  DollarSign,
  ArrowUpRight,
  ArrowDownRight,
  FileText,
  Download,
  LogOut
} from "lucide-react";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { FinancialCard } from "@/components/dashboard/FinancialCard";
import { ActionButton } from "@/components/dashboard/ActionButton";
import { ActivityItem } from "@/components/dashboard/ActivityItem";
import { NotificationsPanel } from "@/components/dashboard/NotificationsPanel";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import api from "@/hooks/api";
import { UserContext } from "@/hooks/AuthContext";

export interface MemberDashboardResponse {
  member: {
    id: number;
    name: string;
    member_id: string;
    member_since: string; // ISO date string
  };
  savings: {
    total_balance: number;
    primary_account_number: string;
  };
  loans: {
    outstanding_loans: number;
    items: LoanItem[];
  };
  investments: {
    total_investment: number;
  };
    recent_activities: RecentActivity[];
}

export interface RecentActivity {
  type: "loan_disbursement" | "contribution" | string;
  date: string;
  amount: number;
  description: string;
  reference: string;
}

export interface LoanItem {
  loan_id: number;
  loan_name: string;
  loan_type: string;
  loan_balance: number;
  next_payment: {
    due_date: string; // ISO date string
    amount: number;
  };
}

const Index = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
const {details, setDetails} =useContext(UserContext)

  useEffect(() => {
    const demoUser = sessionStorage.getItem('user');
    if (!demoUser) {
      navigate('/');
      return;
    }
    setUser(JSON.parse(demoUser));
  }, [navigate]);

 
  const memberData = {
    name: user?.role === "Admin" ? "Admin User" : user?.role === "Loan Officer" ? "John Okafor" : "Sarah Adebayo",
    membershipId: user?.role === "Admin" ? "ADM-2020-0001" : user?.role === "Loan Officer" ? "OFF-2020-1002" : "MEM-2020-4521",
    savingsBalance: "₦1,250,000",
    loanBalance: "₦85,000",
    investments: [
      { name: "Agricultural Bond", amount: "₦300,000", growth: "+12%" },
      { name: "Cooperative Shares", amount: "₦150,000", growth: "+8%" }
    ]
  };

  const fetchMemberDetails= async()=>{
    const requestPayload = {
      "jsonrpc": "2.0",
      "method": "call",
      "id": 1,
      "params": {}
    };
    
    try {
      // Try to call the actual API endpoint first
      const response = await api.post('/api/portal/dashboard', requestPayload);
      const result = response?.data?.result;
      
      // Handle field mapping: API returns "investment" but we expect "total_investment"
      if (result?.investments && result.investments.investment !== undefined) {
        result.investments.total_investment = result.investments.investment;
      }
      
      setDetails(result);
    } catch (error) {
      console.error('API call failed:', error);
      // No fallback to mock data - display error state or empty data
      setDetails(null);
    }
  }

  useEffect(()=>{
fetchMemberDetails()
  }, [])

   if (!user) {
    return <div>Loading...</div>;
  }

const recentActivities =
  details?.recent_activities?.map((activity) => {
    let icon;
    let uiType: "contribution" | "withdrawal" | "loan_disbursement" | "investment";
    let title = "";
    let sign = "+";
    
    switch (activity.type) {
      case "loan_disbursement":
        icon = <ArrowUpRight className="h-4 w-4 text-green-600" />;
        uiType = "loan_disbursement";
        title = "Loan Disbursement";
        break;

      case "contribution":
        icon = <ArrowUpRight className="h-4 w-4 text-blue-600" />;
        uiType = "contribution";
        title = "Contribution";
        break;

      case "withdrawal":
        icon = <ArrowDownRight className="h-4 w-4 text-red-600" />;
        uiType = "withdrawal";
        title = "Withdrawal";
        sign = "-";
        break;

      default:
        icon = <TrendingUp className="h-4 w-4 text-gray-500" />;
        uiType = "investment";
        title = activity.type.replace(/_/g, " ");
    }

    const formattedDate = new Date(activity.date).toLocaleDateString("en-US", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });

    return {
      icon,
      title,
      description: activity.description,
      amount: `${sign}₦${new Intl.NumberFormat("en-US", {
        minimumFractionDigits: 2,
      }).format(activity.amount)}`,
      time: formattedDate,
      type: uiType, 
    };
  }) || [];

  return (
    <div className="min-h-screen bg-gradient-background">
      <div className="container mx-auto px-4 py-8">
        <DashboardHeader 
          memberName={details?.member?.name}
          membershipId={details?.member?.member_id}
        />
        
        {/* Financial Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <FinancialCard
            title="Your Savings"
            amount={details?.savings?.total_balance}
            count={undefined}
            subtitle="Available balance"
            icon={<Wallet className="h-5 w-5" />}
            variant="success"
            trend="up"
          />
          
          <FinancialCard
            title="Outstanding Loan"
            count={details?.loans?.outstanding_loans}
            amount={undefined}
            icon={<CreditCard className="h-5 w-5" />}
            variant="warning"
          >
             <div className="space-y-2 mt-2">
              <div className="flex justify-between">
                <span className="text-[14px]">Loan</span>
                <span className="text-[14px]">Balance</span>
              </div>
              <div  className="flex flex-col gap-2 text-sm">
              {details?.loans?.items?.map((investment: any, index) => (
                  <div className="flex items-center justify-between" key={index}>
                  <span className="text-[12px]">{investment.loan_name}</span>
                    <span className="text-[12px]">{new Intl.NumberFormat('en-US', {minimumFractionDigits:2}).format(investment.loan_balance)}</span>
               </div>
              ))}
            </div>
            </div>
          </FinancialCard>
          
          <FinancialCard
            title="Total Investments"
            amount={details?.investments?.total_investment}
            count={undefined}
            icon={<TrendingUp className="h-5 w-5" />}
            variant="accent"
            trend="up"
          />
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <ActionButton
            title="Apply for Loan"
            description="Quick and easy loan application process with competitive rates"
            icon={<Plus className="h-6 w-6" />}
            variant="primary"
            onClick={() => navigate('/dashboard/loans/apply-for-loan')}
          />
          
          <ActionButton
            title="Request Withdrawal"
            description="Withdraw from your savings account with flexible options"
            icon={<Minus className="h-6 w-6" />}
            variant="secondary"
            onClick={() => console.log("Navigate to withdrawal request")}
          />
          
          <ActionButton
            title="View Statements"
            description="Download or view your financial statements and transaction history"
            icon={<FileText className="h-6 w-6" />}
            variant="secondary"
            onClick={() => navigate('/dashboard/statements')}
          />
        </div>

        {/* Bottom Section: Recent Activity and Notifications */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Activity */}
          <Card className="bg-gradient-card shadow-card">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Recent Activity</CardTitle>
                <Button variant="ghost" size="sm" className="text-primary hover:bg-primary/10">
                  View All
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-2">
              {recentActivities.map((activity, index) => (
                <ActivityItem
                  key={index}
                  icon={activity.icon}
                  title={activity.title}
                  description={activity.description}
                  amount={activity.amount}
                  time={activity.time}
                  type={activity.type}
                />
              ))}
            </CardContent>
          </Card>

          {/* Notifications Panel */}
          <NotificationsPanel notifications={details?.notifications} />
        </div>
      </div>
    </div>
  );
};

export default Index;