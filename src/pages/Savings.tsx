import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Wallet, Plus, ArrowUpRight, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "@/hooks/api";

interface Transaction {
  id?: number;
  date: string;
  description: string;
  amount: number;
}

interface Account {
  id: number;
  account_number: string;
  display_name: string;
  state: string;
  product: {
    id: number;
    name: string;
    code: string;
  };
  monthly_contribution: number;
  next_due_date: string;
  balance: number;
  recent_transactions: Transaction[];
}

interface SavingsOverview {
  member: {
    id: number;
    name: string;
  };
  currency: {
    id: number;
    name: string;
    symbol: string;
  };
  total_balance: number;
  accounts: Account[];
  recent_transactions: Transaction[];
}

const Savings = () => {
  const [data, setData] = useState<SavingsOverview | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSavingsOverview = async () => {
    setLoading(true);
    try {
      const payload = {
        jsonrpc: "2.0",
        method: "call",
        id: 1,
        params: {},
      };
      const response = await api.post("/api/portal/savings_overview", payload);
      if (response.data?.result) {
        setData(response.data.result);
      } else if (response.data?.error) {
        setError(response.data.error.message || "Failed to fetch savings data");
      }
    } catch (err) {
      console.error("Error fetching savings overview:", err);
      setError("An error occurred while fetching your savings overview.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSavingsOverview();
  }, []);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: data?.currency?.name || "NGN",
      currencyDisplay: "symbol",
    })
      .format(amount)
      .replace(/[A-Z]{3}/, data?.currency?.symbol || "₦");
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <p className="text-red-500 mb-4">{error}</p>
        <Button onClick={fetchSavingsOverview}>Retry</Button>
      </div>
    );
  }

  const mainAccount = data?.accounts?.[0];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Savings Account</h1>
          <p className="text-muted-foreground">Manage your savings and contributions</p>
        </div>
        <Link to="/dashboard/savings/reschedule-savings" className="apply-btn">
          Reschedule Savings
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="shadow-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Current Balance</CardTitle>
            <Wallet className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-success">
              {formatCurrency(data?.total_balance || 0)}
            </div>
            <p className="text-xs text-muted-foreground">Total across all accounts</p>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monthly Contribution</CardTitle>
            <ArrowUpRight className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(mainAccount?.monthly_contribution || 0)}
            </div>
            <p className="text-xs text-muted-foreground">Next due: {mainAccount?.next_due_date || "N/A"}</p>
          </CardContent>
        </Card>
      </div>

      <div className="mt-8">
        <h2 className="text-xl font-bold mb-4">Your Accounts</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {data?.accounts.map((account) => (
            <Card key={account.id} className="shadow-card border-l-4 border-l-primary">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-semibold truncate" title={account.display_name}>
                  {account.product.name}
                </CardTitle>
                <p className="text-xs text-muted-foreground">{account.account_number}</p>
              </CardHeader>
              <CardContent>
                <div className="text-xl font-bold text-primary">
                  {formatCurrency(account.balance)}
                </div>
                <div className="mt-2 text-xs flex justify-between">
                  <span className="text-muted-foreground">State:</span>
                  <span className="capitalize font-medium">{account.state}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <div className="mt-8">
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle>Recent Transactions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {data?.recent_transactions && data.recent_transactions.length > 0 ? (
                data.recent_transactions.map((transaction, index) => (
                  <div key={index} className="flex justify-between items-center py-2 border-b last:border-b-0">
                    <div>
                      <p className="font-medium">{transaction.description}</p>
                      <p className="text-sm text-muted-foreground">{transaction.date}</p>
                    </div>
                    <span className={`font-semibold ${transaction.amount >= 0 ? 'text-success' : 'text-destructive'}`}>
                      {transaction.amount >= 0 ? "+" : ""}{formatCurrency(transaction.amount)}
                    </span>
                  </div>
                ))
              ) : (
                <p className="text-center text-muted-foreground py-4">No recent transactions found</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Savings;