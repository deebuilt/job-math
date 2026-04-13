import { useState, useCallback } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { JobData, MaterialItem, EMPTY_JOB, DEMO_DATA, SavedJob } from "@/lib/types";
import {
  calcMaterialsCost, calcLaborCost, calcMileageCost, calcTotalCosts,
  calcNetProfit, calcMargin, calcEffectiveRate, getMarginColor, getMarginBgColor
} from "@/lib/calculations";
import { formatCurrency, formatPercent, formatRate } from "@/lib/format";
import { saveJob } from "@/lib/storage";
import { useToast } from "@/hooks/use-toast";
import { useTheme } from "@/hooks/use-theme";

function numVal(v: string): number {
  const n = parseFloat(v);
  return isNaN(n) ? 0 : n;
}

export default function CalculatorPage() {
  const [job, setJob] = useState<JobData>({ ...EMPTY_JOB });
  const [saveDialogOpen, setSaveDialogOpen] = useState(false);
  const [isDemo, setIsDemo] = useState(false);
  const { toast } = useToast();
  const { theme, toggle: toggleTheme } = useTheme();

  const update = useCallback(<K extends keyof JobData>(key: K, value: JobData[K]) => {
    setJob((prev) => ({ ...prev, [key]: value }));
  }, []);

  const totalCosts = calcTotalCosts(job);
  const netProfit = calcNetProfit(job.revenue, totalCosts);
  const margin = calcMargin(netProfit, job.revenue);
  const effectiveRate = calcEffectiveRate(netProfit, job.hoursWorked);
  const isNegative = netProfit < 0;
  const materialsCost = calcMaterialsCost(job.materials);
  const laborCost = calcLaborCost(job.laborHelpers, job.laborHoursEach, job.laborRate);
  const mileageCost = calcMileageCost(job.mileage, job.mileageRate);

  const addMaterial = () => {
    update("materials", [...job.materials, { id: crypto.randomUUID(), name: "", cost: 0 }]);
  };

  const updateMaterial = (id: string, field: keyof MaterialItem, value: string | number) => {
    update("materials", job.materials.map((m) => (m.id === id ? { ...m, [field]: value } : m)));
  };

  const removeMaterial = (id: string) => {
    update("materials", job.materials.filter((m) => m.id !== id));
  };

  const handleClear = () => {
    setJob({ ...EMPTY_JOB });
    setIsDemo(false);
  };

  const handleDemo = () => {
    setJob({ ...DEMO_DATA });
    setIsDemo(true);
  };

  const handleSave = () => {
    const saved: SavedJob = {
      id: crypto.randomUUID(),
      date: new Date().toISOString(),
      clientName: job.clientName || "Untitled Job",
      revenue: job.revenue,
      totalCosts,
      netProfit,
      margin,
      hoursWorked: job.hoursWorked,
      effectiveRate,
    };
    saveJob(saved);
    setSaveDialogOpen(false);
    toast({ title: "Job saved!", description: `${saved.clientName} — ${formatCurrency(netProfit)} profit` });
  };

  const handleShare = async () => {
    const rateStr = effectiveRate !== null ? ` | ${formatRate(effectiveRate)}` : "";
    const text = `Job: ${job.clientName || "Untitled"} | Charged: ${formatCurrency(job.revenue)} | Costs: ${formatCurrency(totalCosts)} | Profit: ${formatCurrency(netProfit)} (${formatPercent(margin)})${rateStr}`;
    try {
      await navigator.clipboard.writeText(text);
      toast({ title: "Copied!", description: "Summary copied to clipboard" });
    } catch {
      toast({ title: "Copy failed", description: "Could not copy to clipboard", variant: "destructive" });
    }
  };

  const marginLabel = () => {
    if (isNegative) return "You lost money on this job";
    if (margin >= 50) return "Great margin!";
    if (margin >= 20) return "Decent margin";
    return "Low margin — review your pricing";
  };

  const MarginBadge = () => {
    if (isNegative) return <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-destructive/10 text-destructive">Loss</span>;
    if (margin >= 50) return <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-success/10 text-success">✓ Great</span>;
    if (margin >= 20) return <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-warning/10 text-warning">Fair</span>;
    return <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-destructive/10 text-destructive">Low</span>;
  };

  return (
    <div className="max-w-lg mx-auto px-4 pb-28 pt-6 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Profit Calculator</h1>
          <p className="text-sm text-muted-foreground mt-0.5">Know your real numbers</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={toggleTheme}
            className="min-h-[44px] min-w-[44px] flex items-center justify-center rounded-xl border border-border bg-card shadow-card text-foreground transition-all active:scale-95"
            aria-label="Toggle dark mode"
          >
            {theme === "dark" ? (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="4" />
                <path d="M12 2v2" /><path d="M12 20v2" />
                <path d="m4.93 4.93 1.41 1.41" /><path d="m17.66 17.66 1.41 1.41" />
                <path d="M2 12h2" /><path d="M20 12h2" />
                <path d="m6.34 17.66-1.41 1.41" /><path d="m19.07 4.93-1.41 1.41" />
              </svg>
            ) : (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
              </svg>
            )}
          </button>
          <Button variant="outline" size="sm" onClick={handleDemo} className="min-h-[44px] rounded-xl">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1.5">
              <path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z" />
            </svg>
            Try Demo
          </Button>
        </div>
      </div>

      {isDemo && (
        <div className="rounded-xl bg-accent px-4 py-3 text-sm text-accent-foreground flex items-center justify-between shadow-card">
          <span className="font-medium">Demo data loaded</span>
          <Button variant="ghost" size="sm" onClick={handleClear} className="min-h-[36px] text-accent-foreground font-semibold">Clear</Button>
        </div>
      )}

      {/* Revenue */}
      <Card className="shadow-card-md">
        <CardContent className="pt-5 pb-5">
          <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2 block">Amount Charged</label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xl font-bold text-muted-foreground/50">$</span>
            <Input
              type="number"
              inputMode="decimal"
              placeholder="0.00"
              value={job.revenue || ""}
              onChange={(e) => update("revenue", numVal(e.target.value))}
              className="pl-10 text-2xl font-bold h-14 min-h-[44px] rounded-xl border-2 border-border focus-visible:border-primary"
            />
          </div>
        </CardContent>
      </Card>

      {/* Costs */}
      <div className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground px-1">Costs</p>

        <CostSection title="Materials" subtitle={materialsCost > 0 ? formatCurrency(materialsCost) : undefined}>
          {job.materials.map((m) => (
            <div key={m.id} className="flex gap-2 items-center mb-2">
              <Input placeholder="Item name" value={m.name} onChange={(e) => updateMaterial(m.id, "name", e.target.value)} className="flex-1 min-h-[44px]" />
              <div className="relative w-28">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground/50 font-medium">$</span>
                <Input type="number" inputMode="decimal" placeholder="0" value={m.cost || ""} onChange={(e) => updateMaterial(m.id, "cost", numVal(e.target.value))} className="pl-7 min-h-[44px]" />
              </div>
              <Button variant="ghost" size="icon" onClick={() => removeMaterial(m.id)} className="min-h-[44px] min-w-[44px] text-muted-foreground hover:text-destructive">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 6h18" /><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" /><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                </svg>
              </Button>
            </div>
          ))}
          <Button variant="outline" size="sm" onClick={addMaterial} className="min-h-[44px] w-full rounded-lg">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1.5">
              <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            Add Material
          </Button>
        </CostSection>

        <CostSection title="Labor (Helpers)" subtitle={laborCost > 0 ? formatCurrency(laborCost) : undefined}>
          <div className="grid grid-cols-3 gap-2">
            <div>
              <label className="text-[11px] font-medium text-muted-foreground mb-1 block">Helpers</label>
              <Input type="number" inputMode="numeric" placeholder="0" value={job.laborHelpers || ""} onChange={(e) => update("laborHelpers", numVal(e.target.value))} className="min-h-[44px]" />
            </div>
            <div>
              <label className="text-[11px] font-medium text-muted-foreground mb-1 block">Hours each</label>
              <Input type="number" inputMode="decimal" placeholder="0" value={job.laborHoursEach || ""} onChange={(e) => update("laborHoursEach", numVal(e.target.value))} className="min-h-[44px]" />
            </div>
            <div>
              <label className="text-[11px] font-medium text-muted-foreground mb-1 block">$/hour</label>
              <Input type="number" inputMode="decimal" placeholder="0" value={job.laborRate || ""} onChange={(e) => update("laborRate", numVal(e.target.value))} className="min-h-[44px]" />
            </div>
          </div>
        </CostSection>

        <CostSection title="Mileage" subtitle={mileageCost > 0 ? formatCurrency(mileageCost) : undefined}>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-[11px] font-medium text-muted-foreground mb-1 block">Miles (round-trip)</label>
              <Input type="number" inputMode="decimal" placeholder="0" value={job.mileage || ""} onChange={(e) => update("mileage", numVal(e.target.value))} className="min-h-[44px]" />
            </div>
            <div>
              <label className="text-[11px] font-medium text-muted-foreground mb-1 block">Rate / mile</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground/50 font-medium">$</span>
                <Input type="number" inputMode="decimal" value={job.mileageRate} onChange={(e) => update("mileageRate", numVal(e.target.value))} className="pl-7 min-h-[44px]" step="0.01" />
              </div>
            </div>
          </div>
          <p className="text-[11px] text-muted-foreground mt-2">IRS standard rate: $0.70/mile (2025)</p>
        </CostSection>

        <CostSection title="Other Expenses" subtitle={job.otherCost > 0 ? formatCurrency(job.otherCost) : undefined}>
          <div className="space-y-2">
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground/50 font-medium">$</span>
              <Input type="number" inputMode="decimal" placeholder="0" value={job.otherCost || ""} onChange={(e) => update("otherCost", numVal(e.target.value))} className="pl-7 min-h-[44px]" />
            </div>
            <Input placeholder="Note (e.g., parking, dump fee)" value={job.otherNote} onChange={(e) => update("otherNote", e.target.value)} className="min-h-[44px]" />
          </div>
        </CostSection>
      </div>

      {/* Your Time */}
      <Card className="shadow-card">
        <CardContent className="pt-5 pb-5">
          <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2 block">Your Time (hours)</label>
          <Input type="number" inputMode="decimal" placeholder="0" value={job.hoursWorked || ""} onChange={(e) => update("hoursWorked", numVal(e.target.value))} className="min-h-[44px]" />
        </CardContent>
      </Card>

      {/* Results Card */}
      <Card className="shadow-results border-0 overflow-hidden">
        <div className="bg-gradient-to-br from-card to-accent/30 p-5">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-4">Job Summary</p>

          {/* Effective hourly rate - hero metric */}
          {effectiveRate !== null && (
            <div className="text-center py-5 mb-4 rounded-2xl bg-background/60 backdrop-blur-sm shadow-card">
              <p className="text-[11px] uppercase tracking-widest text-muted-foreground mb-1.5 font-semibold">Your Effective Rate</p>
              <p className={`text-5xl font-black tracking-tight ${getMarginColor(margin, isNegative)}`}>
                {formatRate(effectiveRate)}
              </p>
              <p className="text-xs text-muted-foreground mt-1">per hour</p>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="bg-background/50 rounded-xl p-3">
              <p className="text-[11px] text-muted-foreground font-medium uppercase tracking-wide">Revenue</p>
              <p className="text-xl font-bold text-foreground mt-0.5">{formatCurrency(job.revenue)}</p>
            </div>
            <div className="bg-background/50 rounded-xl p-3">
              <p className="text-[11px] text-muted-foreground font-medium uppercase tracking-wide">Total Costs</p>
              <p className="text-xl font-bold text-foreground mt-0.5">{formatCurrency(totalCosts)}</p>
            </div>
          </div>

          <div className="bg-background/50 rounded-xl p-3 mb-4">
            <div className="flex items-center justify-between">
              <p className="text-[11px] text-muted-foreground font-medium uppercase tracking-wide">Net Profit</p>
              <MarginBadge />
            </div>
            <p className={`text-3xl font-black mt-1 ${getMarginColor(margin, isNegative)}`}>
              {formatCurrency(netProfit)}
            </p>
          </div>

          {/* Margin bar */}
          <div className="bg-background/50 rounded-xl p-3">
            <div className="flex items-center justify-between mb-2">
              <p className="text-[11px] text-muted-foreground font-medium uppercase tracking-wide">Profit Margin</p>
              <p className={`text-sm font-bold ${getMarginColor(margin, isNegative)}`}>
                {formatPercent(margin)}
              </p>
            </div>
            <div className="h-2.5 rounded-full bg-muted overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-700 ease-out ${getMarginBgColor(margin, isNegative)}`}
                style={{ width: `${Math.min(Math.max(margin, 0), 100)}%` }}
              />
            </div>
            <p className={`text-[11px] mt-1.5 font-medium ${getMarginColor(margin, isNegative)}`}>{marginLabel()}</p>
          </div>
        </div>
      </Card>

      {/* Action Buttons */}
      <div className="grid grid-cols-3 gap-2">
        <Button onClick={() => setSaveDialogOpen(true)} className="min-h-[48px] rounded-xl">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1">
            <path d="M15.2 3a2 2 0 0 1 1.4.6l3.8 3.8a2 2 0 0 1 .6 1.4V19a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z" /><path d="M17 21v-7a1 1 0 0 0-1-1H8a1 1 0 0 0-1 1v7" /><path d="M7 3v4a1 1 0 0 0 1 1h7" />
          </svg>
          Save
        </Button>
        <Button variant="outline" onClick={handleClear} className="min-h-[48px] rounded-xl">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1">
            <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" /><path d="M3 3v5h5" />
          </svg>
          Clear
        </Button>
        <Button variant="outline" onClick={handleShare} className="min-h-[48px] rounded-xl">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1">
            <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" /><polyline points="16 6 12 2 8 6" /><line x1="12" y1="2" x2="12" y2="15" />
          </svg>
          Share
        </Button>
      </div>

      {/* Save Dialog */}
      <Dialog open={saveDialogOpen} onOpenChange={setSaveDialogOpen}>
        <DialogContent className="rounded-2xl">
          <DialogHeader>
            <DialogTitle>Save Job</DialogTitle>
          </DialogHeader>
          <Input
            placeholder="Client name (optional)"
            value={job.clientName}
            onChange={(e) => update("clientName", e.target.value)}
            className="min-h-[44px]"
          />
          <DialogFooter>
            <Button variant="outline" onClick={() => setSaveDialogOpen(false)} className="min-h-[44px]">Cancel</Button>
            <Button onClick={handleSave} className="min-h-[44px]">Save Job</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function CostSection({ title, subtitle, children }: { title: string; subtitle?: string; children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <Collapsible open={open} onOpenChange={setOpen}>
      <Card className="shadow-card overflow-hidden">
        <CollapsibleTrigger asChild>
          <button className="w-full flex items-center justify-between px-5 py-3.5 min-h-[48px] hover:bg-accent/30 transition-colors">
            <div className="flex items-center gap-2.5">
              <span className="text-sm font-semibold text-foreground">{title}</span>
              {subtitle && (
                <span className="text-xs font-semibold text-primary bg-primary/10 px-2 py-0.5 rounded-full">{subtitle}</span>
              )}
            </div>
            <svg
              width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
              className={`text-muted-foreground transition-transform duration-200 ${open ? "rotate-180" : ""}`}
            >
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </button>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <div className="border-t" />
          <CardContent className="pt-4 pb-4">{children}</CardContent>
        </CollapsibleContent>
      </Card>
    </Collapsible>
  );
}
