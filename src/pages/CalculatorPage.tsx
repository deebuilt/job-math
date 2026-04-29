import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ProfitTab from "./ProfitTab";
import DepositTab from "./DepositTab";
import LateFeeTab from "./LateFeeTab";
import TimeToMoneyTab from "./TimeToMoneyTab";
import DiscountTab from "./DiscountTab";

const TABS = [
  { value: "profit", label: "Profit" },
  { value: "deposit", label: "Deposit" },
  { value: "late-fee", label: "Late Fee" },
  { value: "time", label: "Time to Money" },
  { value: "discount", label: "Discount" },
] as const;

export default function CalculatorPage() {
  const [activeTab, setActiveTab] = useState("profit");

  return (
    <div className="max-w-lg mx-auto px-4 pb-28 pt-4 space-y-4">
      <p className="text-sm text-muted-foreground font-medium">Quick math for business needs</p>

      {/* Tab Bar */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <div className="-mx-4 px-4 overflow-x-auto scrollbar-none">
          <TabsList className="inline-flex w-auto min-w-full h-11 bg-muted/60 p-1 rounded-xl gap-1">
            {TABS.map((tab) => (
              <TabsTrigger
                key={tab.value}
                value={tab.value}
                className="flex-shrink-0 px-3.5 py-2 rounded-lg text-xs font-semibold whitespace-nowrap data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm transition-all"
              >
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </div>

        <TabsContent value="profit" className="mt-4">
          <ProfitTab />
        </TabsContent>
        <TabsContent value="deposit" className="mt-4">
          <DepositTab />
        </TabsContent>
        <TabsContent value="late-fee" className="mt-4">
          <LateFeeTab />
        </TabsContent>
        <TabsContent value="time" className="mt-4">
          <TimeToMoneyTab />
        </TabsContent>
        <TabsContent value="discount" className="mt-4">
          <DiscountTab />
        </TabsContent>
      </Tabs>

      {/* Footer links */}
      <FooterLinks />
    </div>
  );
}

function FooterLinks() {
  const navigate = useNavigate();
  return (
    <div className="flex justify-center gap-4 pt-2 text-xs text-muted-foreground">
      <button onClick={() => navigate("/about")} className="hover:text-foreground transition-colors">
        About
      </button>
      <span aria-hidden="true">·</span>
      <button onClick={() => navigate("/privacy")} className="hover:text-foreground transition-colors">
        Privacy
      </button>
      <span aria-hidden="true">·</span>
      <span>
        By{' '}
        <a href="https://opsette.io" target="_blank" rel="noopener noreferrer" className="underline hover:text-foreground transition-colors">
          Opsette
        </a>
      </span>
    </div>
  );
}
