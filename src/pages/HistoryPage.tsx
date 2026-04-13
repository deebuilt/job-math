import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trash2, ChevronRight, TrendingUp, DollarSign, Percent, Clock, AlertTriangle } from "lucide-react";
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
    <div className="max-w-lg mx-auto px-4 pb-24 pt-4 space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-foreground">Job History</h1>
        {jobs.length > 0 && (
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="outline" size="sm" className="min-h-[44px] text-destructive">
                Clear All
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
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
        <Card className="bg-primary/5 border-primary/20">
          <CardContent className="pt-4 pb-4">
            <div className="grid grid-cols-2 gap-3">
              <StatItem icon={<DollarSign className="h-4 w-4" />} label="Total Revenue" value={formatCurrency(totalRevenue)} />
              <StatItem icon={<TrendingUp className="h-4 w-4" />} label="Total Profit" value={formatCurrency(totalProfit)} />
              <StatItem icon={<Percent className="h-4 w-4" />} label="Avg Margin" value={formatPercent(avgMargin)} />
              <StatItem icon={<Clock className="h-4 w-4" />} label="Avg Rate" value={avgRate !== null ? formatRate(avgRate) : "—"} />
            </div>
            <p className="text-xs text-muted-foreground mt-2 text-center">{jobs.length} job{jobs.length !== 1 ? "s" : ""} saved</p>
          </CardContent>
        </Card>
      )}

      {/* Job List */}
      {jobs.length === 0 ? (
        <div className="text-center py-16">
          <AlertTriangle className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
          <p className="text-muted-foreground">No jobs saved yet</p>
          <p className="text-sm text-muted-foreground mt-1">Complete a job calculation and tap Save</p>
        </div>
      ) : (
        <div className="space-y-2">
          {jobs.map((job) => (
            <Card key={job.id} className="cursor-pointer active:bg-muted/50 transition-colors" onClick={() => navigate(`/?load=${job.id}`)}>
              <CardContent className="flex items-center justify-between py-3 px-4">
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm text-foreground truncate">{job.clientName}</p>
                  <p className="text-xs text-muted-foreground">{new Date(job.date).toLocaleDateString()}</p>
                </div>
                <div className="text-right mx-3">
                  <p className="text-sm font-semibold text-foreground">{formatCurrency(job.revenue)}</p>
                  <p className={`text-xs font-medium ${getMarginColor(job.margin, job.netProfit < 0)}`}>
                    {formatCurrency(job.netProfit)} ({formatPercent(job.margin)})
                  </p>
                </div>
                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="min-h-[44px] min-w-[44px] text-muted-foreground"
                    onClick={(e) => { e.stopPropagation(); handleDelete(job.id); }}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                  <ChevronRight className="h-4 w-4 text-muted-foreground" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

function StatItem({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-center gap-2">
      <div className="text-primary">{icon}</div>
      <div>
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="text-sm font-semibold text-foreground">{value}</p>
      </div>
    </div>
  );
}
