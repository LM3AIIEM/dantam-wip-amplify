import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import Index from "./pages/Index";
import DashboardPage from "./pages/DashboardPage";
import SchedulingPage from "./pages/SchedulingPage";
import ClinicalChartingPage from "./pages/ClinicalChartingPage";
import FinancialPage from "./pages/FinancialPage";
import CommunicationsPage from "./pages/CommunicationsPage";
import InventoryPage from "./pages/InventoryPage";
import LoginPage from "./pages/LoginPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
            <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
            <Route path="/patients" element={<ProtectedRoute><Index /></ProtectedRoute>} />
            <Route path="/scheduling" element={<ProtectedRoute><SchedulingPage /></ProtectedRoute>} />
            <Route path="/financial" element={<ProtectedRoute><FinancialPage /></ProtectedRoute>} />
            <Route path="/communications" element={<ProtectedRoute><CommunicationsPage /></ProtectedRoute>} />
            {/* /charts and /inventory routes hidden for CEO demo */}
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
