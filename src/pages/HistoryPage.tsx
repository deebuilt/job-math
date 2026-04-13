import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { SavedJob } from "@/lib/types";
import { loadJobs, deleteJob, clearAllJobs } from "@/lib/storage";
import { formatCurrency, formatPercent, formatRate } from "@/lib/format";
import { getMarginColor } from "@/lib/calculations";
import { useToast } from "@/hooks/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export default function HistoryPage() {
  const [jobs, setJobs] = useState<SavedJob[]>([]);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    setJobs(loadJobs());
  }, []);

  const handleDelete = (id: string) => {
    deleteJob(id);
    setJobs(loadJobs());
    toast({ title: "Job deleted" });
  };

  const handleClearAll = () => {
    clearAllJobs();
    setJobs([]);
    toast({ title: "All jobs cleared" });
  };

  const totalRevenue = jobs.reduce((s, j) => s + j.revenue, 0);
  const totalProfit = jobs.reduce((s, j) => s + j.netProfit, 0);
  const avgMargin = jobs.length ? jobs.reduce((s, j) => s + j.margin, 0) / jobs.length : 0;
  const jobsWithRate = jobs.filter((j) => j.effectiveRate !== null);
  const avgRate = jobsWithRate.length
    ? jobsWithRate.reduce((s, j) => s + (j.effectiveRate || 0), 0) / jobsWithRate.length
    : null;

  return (
    <div className="max-w-lg mx-auto px-4 pb-28 pt-6 space-y-4">
      <div className="flex items-center justify-between mb-2">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Job History</h1>
          <p className="text-sm text-muted-foreground mt-0.5">{jobs.length} job{jobs.length !== 1 ? "s" : ""} saved</p>
        </div>
        {jobs.length > 0 && (
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="outline" size="sm" className="min-h-[44px] text-destructive rounded-xl">
                Clear All
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent className="rounded-2xl">
              <AlertDialogHeader>
                <AlertDialogTitle>Clear all jobs?</AlertDialogTitle>
                <AlertDialogDescription>This will permanently delete all {jobs.length} saved jobs.</AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel className="min-h-[44px]">Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleClearAll} className="min-h-[44px] bg-destructive text-destructive-foreground">
                  Delete All
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        )}
      </div>

      {/* Summary Banner */}
      {jobs.length > 0 && (
        <Card className="shadow-results border-0 overflow-hidden">
          <div className="bg-gradient-to-br from-card to-accent/30 p-5">
            <div className="grid grid-cols-2 gap-3">
              <StatItem label="Total Revenue" value={formatCurrency(totalRevenue)} />
              <StatItem label="Total Profit" value={formatCurrency(totalProfit)} />
              <StatItem label="Avg Margin" value={formatPercent(avgMargin)} />
              <StatItem label="Avg Rate" value={avgRate !== null ? formatRate(avgRate) : "—"} />
            </div>
          </div>
        </Card>
      )}

      {/* Job List */}
      {jobs.length === 0 ? (
        <div className="text-center py-20">
          <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center mx-auto mb-4">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-muted-foreground">
              <rect x="3" y="3" width="18" height="18" rx="2" /><path d="M3 9h18" /><path d="M9 21V9" />
            </svg>
          </div>
          <p className="text-foreground font-semibold">No jobs saved yet</p>
          <p className="text-sm text-muted-foreground mt-1">Complete a job calculation and tap Save</p>
        </div>
      ) : (
        <div className="space-y-2">
          {jobs.map((job) => (
            <Card key={job.id} className="shadow-card cursor-pointer active:scale-[0.99] transition-all duration-150" onClick={() => navigate(`/?load=${job.id}`)}>
              <CardContent className="flex items-center justify-between py-3.5 px-4">
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm text-foreground truncate">{job.clientName}</p>
                  <p className="text-[11px] text-muted-foreground mt-0.5">{new Date(job.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</p>
                </div>
                <div className="text-right mx-3">
                  <p className="text-sm font-bold text-foreground">{formatCurrency(job.revenue)}</p>
                  <p className={`text-xs font-semibold ${getMarginColor(job.margin, job.netProfit < 0)}`}>
                    {formatCurrency(job.netProfit)} ({formatPercent(job.margin)})
                  </p>
                </div>
                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="min-h-[44px] min-w-[44px] text-muted-foreground hover:text-destructive"
                    onClick={(e) => { e.stopPropagation(); handleDelete(job.id); }}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M3 6h18" /><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" /><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                    </svg>
                  </Button>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-muted-foreground/50">
                    <polyline points="9 18 15 12 9 6" />
                  </svg>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

function StatItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-background/50 rounded-xl p-3">
      <p className="text-[11px] text-muted-foreground font-medium uppercase tracking-wide">{label}</p>
      <p className="text-lg font-bold text-foreground mt-0.5">{value}</p>
    </div>
  );
}
