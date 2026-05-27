import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import DashboardLayout from "./components/DashboardLayout";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Login from "./components/ui/login";
import Upgrade from "./pages/upgrade";
import History from "./pages/history";
const queryClient = new QueryClient();
const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* LOGIN PAGE */}
          <Route path="/login" element={<Login />} />
          {/* DASHBOARD PAGE */}
          <Route
            path="/"
            element={
              <DashboardLayout>
                <Index />
              </DashboardLayout>
            }
          />
          {/* 404 */}

          <Route path="*" element={<NotFound />} />

          <Route path="/upgrade" element={<Upgrade />} />
          <Route path="/history" element={<History />} />
          <Route path="/" element={<Index />} />
          <Route path="/chat/:id" element={<Index />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);
            
export default App;
