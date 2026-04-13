import { useState, useCallback } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import {
  DollarSign, Plus, Trash2, ChevronDown, Save, RotateCcw, Share2, Sparkles,
  Package, Users, Car, FileText, Clock, CheckCircle, AlertTriangle, TrendingDown, XCircle
} from "lucide-react";
import { JobData, MaterialItem, EMPTY_JOB, DEMO_DATA, SavedJob } from "@/lib/types";
import {
  calcMaterialsCost, calcLaborCost, calcMileageCost, calcTotalCosts,
  calcNetProfit, calcMargin, calcEffectiveRate, getMarginColor, getMarginBgColor
} from "@/lib/calculations";
import { formatCurrency, formatPercent, formatRate } from "@/lib/format";
import { saveJob } from "@/lib/storage";
import { useToast } from "@/hooks/use-toast";

function numVal(v: string): number {
  const n = parseFloat(v);
  return isNaN(n) ? 0 : n;
}

export default function CalculatorPage() {
  const [job, setJob] = useState<JobData>({ ...EMPTY_JOB });
  const [saveDialogOpen, setSaveDialogOpen] = useState(false);
  const [isDemo, setIsDemo] = useState(false);
  const { toast } = useToast();

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

  const MarginIcon = () => {
    if (isNegative) return <XCircle className="h-5 w-5 text-destructive" />;
    if (margin >= 50) return <CheckCircle className="h-5 w-5 text-success" />;
    if (margin >= 20) return <AlertTriangle className="h-5 w-5 text-warning" />;
    return <TrendingDown className="h-5 w-5 text-destructive" />;
  };

  const marginLabel = () => {
    if (isNegative) return "You lost money on this job";
    if (margin >= 50) return "Great margin!";
    if (margin >= 20) return "Decent margin";
    return "Low margin — review your pricing";
  };

  return (
    <div className="max-w-lg mx-auto px-4 pb-24 pt-4 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-foreground">Profit Calculator</h1>
        <Button variant="outline" size="sm" onClick={handleDemo} className="min-h-[44px]">
          <Sparkles className="h-4 w-4 mr-1" /> Try Demo
        </Button>
      </div>

      {isDemo && (
        <div className="rounded-lg bg-primary/10 px-3 py-2 text-sm text-primary flex items-center justify-between">
          <span>Demo data loaded — see your results below</span>
          <Button variant="ghost" size="sm" onClick={handleClear} className="min-h-[36px] text-primary">Clear</Button>
        </div>
      )}

      {/* Revenue */}
      <Card>
        <CardContent className="pt-4 pb-4">
          <label className="text-sm font-medium text-muted-foreground mb-1 block">Amount Charged</label>
          <div className="relative">
            <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              type="number"
              inputMode="decimal"
              placeholder="0.00"
              value={job.revenue || ""}
              onChange={(e) => update("revenue", numVal(e.target.value))}
              className="pl-10 text-2xl font-bold h-14 min-h-[44px]"
            />
          </div>
        </CardContent>
      </Card>

      {/* Costs */}
      <CostSection icon={<Package className="h-4 w-4" />} title="Materials" subtitle={materialsCost > 0 ? formatCurrency(materialsCost) : undefined}>
        {job.materials.map((m) => (
          <div key={m.id} className="flex gap-2 items-center mb-2">
            <Input placeholder="Item name" value={m.name} onChange={(e) => updateMaterial(m.id, "name", e.target.value)} className="flex-1 min-h-[44px]" />
            <div className="relative w-28">
              <DollarSign className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input type="number" inputMode="decimal" placeholder="0" value={m.cost || ""} onChange={(e) => updateMaterial(m.id, "cost", numVal(e.target.value))} className="pl-7 min-h-[44px]" />
            </div>
            <Button variant="ghost" size="icon" onClick={() => removeMaterial(m.id)} className="min-h-[44px] min-w-[44px] text-muted-foreground">
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ))}
        <Button variant="outline" size="sm" onClick={addMaterial} className="min-h-[44px] w-full">
          <Plus className="h-4 w-4 mr-1" /> Add Material
        </Button>
      </CostSection>

      <CostSection icon={<Users className="h-4 w-4" />} title="Labor (Helpers)" subtitle={laborCost > 0 ? formatCurrency(laborCost) : undefined}>
        <div className="grid grid-cols-3 gap-2">
          <div>
            <label className="text-xs text-muted-foreground">Helpers</label>
            <Input type="number" inputMode="numeric" placeholder="0" value={job.laborHelpers || ""} onChange={(e) => update("laborHelpers", numVal(e.target.value))} className="min-h-[44px]" />
          </div>
          <div>
            <label className="text-xs text-muted-foreground">Hours each</label>
            <Input type="number" inputMode="decimal" placeholder="0" value={job.laborHoursEach || ""} onChange={(e) => update("laborHoursEach", numVal(e.target.value))} className="min-h-[44px]" />
          </div>
          <div>
            <label className="text-xs text-muted-foreground">$/hour</label>
            <Input type="number" inputMode="decimal" placeholder="0" value={job.laborRate || ""} onChange={(e) => update("laborRate", numVal(e.target.value))} className="min-h-[44px]" />
          </div>
        </div>
      </CostSection>

      <CostSection icon={<Car className="h-4 w-4" />} title="Mileage" subtitle={mileageCost > 0 ? formatCurrency(mileageCost) : undefined}>
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="text-xs text-muted-foreground">Miles (round-trip)</label>
            <Input type="number" inputMode="decimal" placeholder="0" value={job.mileage || ""} onChange={(e) => update("mileage", numVal(e.target.value))} className="min-h-[44px]" />
          </div>
          <div>
            <label className="text-xs text-muted-foreground">Rate/mile</label>
            <div className="relative">
              <DollarSign className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input type="number" inputMode="decimal" value={job.mileageRate} onChange={(e) => update("mileageRate", numVal(e.target.value))} className="pl-7 min-h-[44px]" step="0.01" />
            </div>
          </div>
        </div>
        <p className="text-xs text-muted-foreground mt-1">IRS standard rate: $0.70/mile (2025)</p>
      </CostSection>

      <CostSection icon={<FileText className="h-4 w-4" />} title="Other Expenses" subtitle={job.otherCost > 0 ? formatCurrency(job.otherCost) : undefined}>
        <div className="space-y-2">
          <div className="relative">
            <DollarSign className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input type="number" inputMode="decimal" placeholder="0" value={job.otherCost || ""} onChange={(e) => update("otherCost", numVal(e.target.value))} className="pl-7 min-h-[44px]" />
          </div>
          <Input placeholder="Note (e.g., parking, dump fee)" value={job.otherNote} onChange={(e) => update("otherNote", e.target.value)} className="min-h-[44px]" />
        </div>
      </CostSection>

      {/* Your Time */}
      <Card>
        <CardContent className="pt-4 pb-4">
          <div className="flex items-center gap-2 mb-2">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <label className="text-sm font-medium text-muted-foreground">Your Time (hours worked)</label>
          </div>
          <Input type="number" inputMode="decimal" placeholder="0" value={job.hoursWorked || ""} onChange={(e) => update("hoursWorked", numVal(e.target.value))} className="min-h-[44px]" />
        </CardContent>
      </Card>

      {/* Results Card */}
      <Card className="border-2">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Job Summary</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {/* Effective hourly rate - most prominent */}
          {effectiveRate !== null && (
            <div className="text-center py-3 rounded-lg bg-muted/50">
              <p className="text-xs uppercase tracking-wide text-muted-foreground mb-1">Your Effective Rate</p>
              <p className={`text-4xl font-extrabold ${getMarginColor(margin, isNegative)}`}>
                {formatRate(effectiveRate)}
              </p>
            </div>
          )}

          <div className="grid grid-cols-2 gap-3">
            <div>
              <p className="text-xs text-muted-foreground">Revenue</p>
              <p className="text-lg font-semibold text-foreground">{formatCurrency(job.revenue)}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Total Costs</p>
              <p className="text-lg font-semibold text-foreground">{formatCurrency(totalCosts)}</p>
            </div>
          </div>

          <div>
            <p className="text-xs text-muted-foreground">Net Profit</p>
            <p className={`text-2xl font-bold ${getMarginColor(margin, isNegative)}`}>
              {formatCurrency(netProfit)}
            </p>
          </div>

          {/* Margin bar */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-1">
                <p className="text-xs text-muted-foreground">Profit Margin</p>
                <MarginIcon />
              </div>
              <p className={`text-sm font-bold ${getMarginColor(margin, isNegative)}`}>
                {formatPercent(margin)}
              </p>
            </div>
            <div className="h-3 rounded-full bg-muted overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ease-out ${getMarginBgColor(margin, isNegative)}`}
                style={{ width: `${Math.min(Math.max(margin, 0), 100)}%` }}
              />
            </div>
            <p className={`text-xs mt-1 ${getMarginColor(margin, isNegative)}`}>{marginLabel()}</p>
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="grid grid-cols-3 gap-2">
        <Button onClick={() => setSaveDialogOpen(true)} className="min-h-[44px]">
          <Save className="h-4 w-4 mr-1" /> Save
        </Button>
        <Button variant="outline" onClick={handleClear} className="min-h-[44px]">
          <RotateCcw className="h-4 w-4 mr-1" /> Clear
        </Button>
        <Button variant="outline" onClick={handleShare} className="min-h-[44px]">
          <Share2 className="h-4 w-4 mr-1" /> Share
        </Button>
      </div>

      {/* Save Dialog */}
      <Dialog open={saveDialogOpen} onOpenChange={setSaveDialogOpen}>
        <DialogContent>
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

function CostSection({ icon, title, subtitle, children }: { icon: React.ReactNode; title: string; subtitle?: string; children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <Collapsible open={open} onOpenChange={setOpen}>
      <Card>
        <CollapsibleTrigger asChild>
          <button className="w-full flex items-center justify-between px-4 py-3 min-h-[44px]">
            <div className="flex items-center gap-2">
              {icon}
              <span className="text-sm font-medium text-foreground">{title}</span>
              {subtitle && <span className="text-xs text-muted-foreground ml-1">{subtitle}</span>}
            </div>
            <ChevronDown className={`h-4 w-4 text-muted-foreground transition-transform ${open ? "rotate-180" : ""}`} />
          </button>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <CardContent className="pt-0 pb-4">{children}</CardContent>
        </CollapsibleContent>
      </Card>
    </Collapsible>
  );
}
