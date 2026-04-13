import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { HashRouter, Route, Routes, useLocation, useNavigate } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Calculator, History } from "lucide-react";
import CalculatorPage from "./pages/CalculatorPage";
import HistoryPage from "./pages/HistoryPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

function BottomNav() {
  const location = useLocation();
  const navigate = useNavigate();
  const isCalc = location.pathname === "/" || location.pathname === "";
  const isHistory = location.pathname === "/history";

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-background border-t z-50">
      <div className="max-w-lg mx-auto flex">
        <button
          onClick={() => navigate("/")}
          className={`flex-1 flex flex-col items-center py-2 min-h-[56px] transition-colors ${isCalc ? "text-primary" : "text-muted-foreground"}`}
        >
          <Calculator className="h-5 w-5" />
          <span className="text-xs mt-0.5">Calculator</span>
        </button>
        <button
          onClick={() => navigate("/history")}
          className={`flex-1 flex flex-col items-center py-2 min-h-[56px] transition-colors ${isHistory ? "text-primary" : "text-muted-foreground"}`}
        >
          <History className="h-5 w-5" />
          <span className="text-xs mt-0.5">History</span>
        </button>
      </div>
    </nav>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <HashRouter>
        <Routes>
          <Route path="/" element={<CalculatorPage />} />
          <Route path="/history" element={<HistoryPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
        <BottomNav />
      </HashRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
