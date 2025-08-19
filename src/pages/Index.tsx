import { useEffect, useState } from "react";
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

const Index = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    // Check if user is logged in via demo credentials
    const demoUser = localStorage.getItem('demoUser');
    if (!demoUser) {
      navigate('/login');
      return;
    }
    setUser(JSON.parse(demoUser));
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('demoUser');
    navigate('/login');
  };

  if (!user) {
    return <div>Loading...</div>;
  }
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

  const recentActivities = [
    {
      type: "deposit" as const,
      title: "Monthly Savings Deposit",
      description: "Automatic savings contribution",
      amount: "+₦50,000",
      time: "2 days ago",
      icon: <ArrowUpRight className="h-4 w-4" />
    },
    {
      type: "loan" as const,
      title: "Loan Payment Made",
      description: "Monthly loan installment",
      amount: "-₦15,000",
      time: "5 days ago",
      icon: <ArrowDownRight className="h-4 w-4" />
    },
    {
      type: "investment" as const,
      title: "Investment Return",
      description: "Agricultural bond quarterly return",
      amount: "+₦9,000",
      time: "1 week ago",
      icon: <TrendingUp className="h-4 w-4" />
    },
    {
      type: "withdrawal" as const,
      title: "Emergency Withdrawal",
      description: "Partial savings withdrawal",
      amount: "-₦25,000",
      time: "2 weeks ago",
      icon: <ArrowDownRight className="h-4 w-4" />
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-background">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <DashboardHeader 
            memberName={memberData.name}
            membershipId={memberData.membershipId}
          />
          <Button 
            variant="outline" 
            size="sm"
            onClick={handleLogout}
            className="flex items-center gap-2"
          >
            <LogOut className="h-4 w-4" />
            Logout
          </Button>
        </div>
        
        {/* Financial Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <FinancialCard
            title="Your Savings"
            amount={memberData.savingsBalance}
            subtitle="Available balance"
            icon={<Wallet className="h-5 w-5" />}
            variant="success"
            trend="up"
          />
          
          <FinancialCard
            title="Outstanding Loan"
            amount={memberData.loanBalance}
            subtitle="Next payment: ₦15,000 due Dec 15"
            icon={<CreditCard className="h-5 w-5" />}
            variant="warning"
          />
          
          <FinancialCard
            title="Total Investments"
            amount="₦450,000"
            subtitle="Current portfolio value"
            icon={<TrendingUp className="h-5 w-5" />}
            variant="accent"
            trend="up"
          >
            <div className="space-y-2 mt-4">
              {memberData.investments.map((investment, index) => (
                <div key={index} className="flex justify-between items-center text-sm">
                  <span className="opacity-75">{investment.name}</span>
                  <div className="flex items-center gap-2">
                    <span>{investment.amount}</span>
                    <span className="text-xs bg-white/20 px-2 py-1 rounded">
                      {investment.growth}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </FinancialCard>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <ActionButton
            title="Apply for Loan"
            description="Quick and easy loan application process with competitive rates"
            icon={<Plus className="h-6 w-6" />}
            variant="primary"
            onClick={() => console.log("Navigate to loan application")}
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
            onClick={() => console.log("Navigate to statements")}
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
          <NotificationsPanel />
        </div>

        {/* Quick Stats Footer */}
        <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-gradient-card shadow-card rounded-xl p-6 text-center">
            <DollarSign className="h-8 w-8 text-success mx-auto mb-2" />
            <p className="text-2xl font-bold text-success">₦1.7M</p>
            <p className="text-sm text-muted-foreground">Total Contributed</p>
          </div>
          <div className="bg-gradient-card shadow-card rounded-xl p-6 text-center">
            <TrendingUp className="h-8 w-8 text-primary mx-auto mb-2" />
            <p className="text-2xl font-bold text-primary">10.2%</p>
            <p className="text-sm text-muted-foreground">Average Return</p>
          </div>
          <div className="bg-gradient-card shadow-card rounded-xl p-6 text-center">
            <CreditCard className="h-8 w-8 text-accent mx-auto mb-2" />
            <p className="text-2xl font-bold text-accent">2</p>
            <p className="text-sm text-muted-foreground">Active Loans</p>
          </div>
          <div className="bg-gradient-card shadow-card rounded-xl p-6 text-center">
            <Wallet className="h-8 w-8 text-success mx-auto mb-2" />
            <p className="text-2xl font-bold text-success">3 years</p>
            <p className="text-sm text-muted-foreground">Membership</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;