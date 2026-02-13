

import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AppSidebar } from "@/components/AppSidebar";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Savings from "./pages/Savings";
import NotFound from "./pages/NotFound";
import Loans from "./pages/LoanManagement/Loans";
import Investments from "./pages/InvestmentManagement/Investments";
import Statements from "./pages/Statements/Statements";
import LoanApplication from "./pages/LoanManagement/LoanApplication";
import LPPDetails from "./pages/LoanManagement/LPPDetails";
import LoanResult from "./pages/LoanManagement/LoanResult";

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
import Withdrawal from "./pages/Withdrawal/Withdrawal";
import WithdrawalIndex from "./pages/Withdrawal/WithdrawalIndex";

import LoanRequests from "./pages/LoanManagement/LoanRequests";
import InitiateWithdrawal from "./pages/Withdrawal/InitiateWithdrawal";
import RescheduleSavings from "./pages/RescheduleSavings";
import RealEstateInvestment from "./pages/RealEstateInvestment/RealEstateInvestment";
import AvailableInvestments from "./pages/RealEstateInvestment/AvailableInvestments";
import MyInvestments from "./pages/RealEstateInvestment/MyInvestments";
import InvestmentDetails from "./pages/RealEstateInvestment/InvestmentDetails";



const queryClient = new QueryClient();

// ✅ Layout component
const AppLayout = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();
  const isLoginPage = location.pathname === "/";

  if (isLoginPage) return <>{children}</>;

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <div className="flex-1 flex flex-col">
          <header className="h-12 flex items-center border-b bg-background px-4">
            <SidebarTrigger />
            <h1 className="ml-4 font-semibold">NLNG Cooperative Portal</h1>
          </header>
          <main className="flex-1 overflow-auto">{children}</main>
        </div>
      </div>
    </SidebarProvider>
  );
};

// Route protection
const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const user = sessionStorage.getItem("user");
  return user ? children : <Navigate to="/" replace />;
};

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const user = sessionStorage.getItem("user");
    setIsAuthenticated(!!user);
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <BrowserRouter>
          <AppLayout>
            <Routes>
              {/* Login Route */}
              <Route
                path="/"
                element={<Login/>}
              />

              {/* Protected Routes */}
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <Index />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/dashboard/savings"
                element={
                  <ProtectedRoute>
                    <Savings />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/dashboard/savings/reschedule-savings"
                element={
                  <ProtectedRoute>
                    <RescheduleSavings />
                  </ProtectedRoute>
                }
              />

                <Route path="/dashboard/loans" element={<Loans />}>
             <Route index element={<LPPDetails/>}/>
             <Route path='apply' element={<LoanApplication/>}/>
             <Route path='loan-requests' element={<LoanRequests/>}/>
             <Route path='result' element={<LoanResult/>}/>
             </Route>
             <Route path="/dashboard/investments" element={<Investments />} >
             <Route path="/dashboard/investments" element={<SharesPortfolio/>}>
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
             <Route path='/dashboard/withdrawal' element={<WithdrawalIndex/>}>
             <Route index element={<Withdrawal/>}/>
             <Route path="initiate-withdrawal" element={<InitiateWithdrawal/>}/>
             </Route>
             <Route path="/dashboard/statements" element={<Statements />} >
             <Route index element={<SavingStatement/>}/>
             <Route path="loan-statement" element={<LoanStatement/>}/>
             </Route>
             
             <Route path="/dashboard/real-estate" element={<RealEstateInvestment />}>
               <Route index element={<AvailableInvestments />} />
               <Route path="my-investments" element={<MyInvestments />} />
               <Route path=":id" element={<InvestmentDetails />} />
             </Route>
             <Route path="/dashboard/profile" element={<MemberProfile/>}/>
             <Route path="/dashboard/settings" element={<Settings/>}/>
             <Route path="/dashboard/help" element={<Help/>}>
             <Route index element={<ContactUs/>}/>
             <Route path="faqs" element={<Faqs/>}/>
           </Route>
              <Route path="*" element={<NotFound />} />
            </Routes>
          </AppLayout>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
