import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { HashRouter, Route, Routes, useLocation, useNavigate } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
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
    <nav className="fixed bottom-0 left-0 right-0 bg-card/80 backdrop-blur-xl border-t z-50">
      <div className="max-w-lg mx-auto flex">
        <button
          onClick={() => navigate("/")}
          className={`flex-1 flex flex-col items-center py-2.5 min-h-[56px] transition-all duration-200 ${
            isCalc
              ? "text-primary"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="4" y="2" width="16" height="20" rx="2" />
            <line x1="8" y1="6" x2="16" y2="6" />
            <line x1="8" y1="10" x2="10" y2="10" />
            <line x1="14" y1="10" x2="16" y2="10" />
            <line x1="8" y1="14" x2="10" y2="14" />
            <line x1="14" y1="14" x2="16" y2="14" />
            <line x1="8" y1="18" x2="10" y2="18" />
            <line x1="14" y1="18" x2="16" y2="18" />
          </svg>
          <span className={`text-[11px] mt-0.5 font-medium ${isCalc ? "font-semibold" : ""}`}>Calculator</span>
          {isCalc && <div className="absolute top-0 left-1/4 right-1/4 h-0.5 bg-primary rounded-full" />}
        </button>
        <button
          onClick={() => navigate("/history")}
          className={`flex-1 flex flex-col items-center py-2.5 min-h-[56px] transition-all duration-200 relative ${
            isHistory
              ? "text-primary"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <polyline points="12 6 12 12 16 14" />
          </svg>
          <span className={`text-[11px] mt-0.5 font-medium ${isHistory ? "font-semibold" : ""}`}>History</span>
          {isHistory && <div className="absolute top-0 left-1/4 right-1/4 h-0.5 bg-primary rounded-full" />}
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
