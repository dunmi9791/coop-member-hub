import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { AppSidebar } from "@/components/AppSidebar";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Savings from "./pages/Savings";
import NotFound from "./pages/NotFound";
import Loans from "./pages/LoanManagement/Loans";
import Investments from "./pages/InvestmentManagement/Investments";
import Statements from "./pages/Statements/Statements";
import LoanApplication from "./pages/LoanManagement/LoanApplication";
import LoanCalculator from "./pages/LoanManagement/LoanCalculator";
import SharesPortfolio from "./pages/InvestmentManagement/SharesPortfolio";
import SharesWithdrawalRequests from "./pages/InvestmentManagement/SharesWithdrawalRequests";
import SharesPurchaseRequests from "./pages/InvestmentManagement/SharesPurchaseRequests";
import ViewShare from "./pages/InvestmentManagement/ViewShare";
import SharesPurchase from "./pages/InvestmentManagement/SharesPurchase";
import BoughtShares from "./pages/InvestmentManagement/BoughtShares";
import BuyShares from "./pages/InvestmentManagement/BuyShares";
import InvestmentWithdrawals from "./pages/InvestmentManagement/InvestmentWithdrawals";
import WithdrawInvestment from "./pages/InvestmentManagement/WithdrawInvestment";
import SavingStatement from "./pages/Statements/SavingStatement";
import LoanStatement from "./pages/Statements/LoanStatement";
import MemberProfile from "./pages/Profile";
import Settings from "./pages/Settings";
import Help from "./pages/Help/Help";
import ContactUs from "./pages/Help/ContactUs";
import Faqs from "./pages/Help/Faqs";

const queryClient = new QueryClient();

const AppLayout = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();
  const isLoginPage = location.pathname === '/login';

  if (isLoginPage) {
    return <>{children}</>;
  }

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <div className="flex-1 flex flex-col">
          <header className="h-12 flex items-center border-b bg-background px-4">
            <SidebarTrigger />
            <h1 className="ml-4 font-semibold">NLNG Cooperative Portal</h1>
          </header>
          <main className="flex-1 overflow-auto">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AppLayout>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/savings" element={<Savings />} />
            <Route path="/loans" element={<Loans />}>
            <Route index element={<LoanCalculator/>}/>
            <Route path='apply-for-loan' element={<LoanApplication/>}/>
            </Route>
            <Route path="/investments" element={<Investments />} >
            <Route path="/investments" element={<SharesPortfolio/>}>
            <Route index element={<BoughtShares/>}/>
            <Route path="invest" element={<BuyShares/>}/>
            </Route>
            <Route path="investment-withdrawal" element={<InvestmentWithdrawals/>}>
            <Route index element={<SharesWithdrawalRequests/>}/>
            <Route path="withdraw-investment" element={<WithdrawInvestment/>}/>
            </Route>
            <Route path="investment-purchase" element={<SharesPurchase/>}>
            <Route index element={<SharesPurchaseRequests/>}/>
            <Route path="view-investment" element={<ViewShare/>}/>
            </Route>
            </Route>
            <Route path="/statements" element={<Statements />} >
            <Route index element={<SavingStatement/>}/>
            <Route path="loan-statement" element={<LoanStatement/>}/>
            </Route>
            <Route path="/profile" element={<MemberProfile/>}/>
            <Route path="/settings" element={<Settings/>}/>
            <Route path="/help" element={<Help/>}>
            <Route index element={<ContactUs/>}/>
            <Route path="faqs" element={<Faqs/>}/>
            </Route>
            <Route path="/login" element={<Login />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AppLayout>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;