import { useNavigate } from "react-router-dom";
import { OpsetteFooterLogo } from "@/components/opsette-share";

export default function AboutPage() {
  const navigate = useNavigate();

  return (
    <div className="max-w-lg mx-auto px-4 py-6 space-y-4 text-sm text-muted-foreground leading-relaxed">
      <button
        onClick={() => navigate(-1)}
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-2"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="m12 19-7-7 7-7" /><path d="M19 12H5" />
        </svg>
        Back
      </button>

      <h2 className="text-2xl font-bold text-foreground">About Job Math</h2>

      <p className="text-xs text-muted-foreground/80">
        A business tool from Opsette Marketplace.
      </p>

      <p className="text-foreground font-medium text-base">
        Quick math for business needs.
      </p>

      <p>
        Job Math is a free, offline-first calculator suite built for people who work
        with their hands. Profit margins, deposit splits, late fees, time-to-money
        conversions, and discount breakdowns — all in one place.
      </p>

      <div className="space-y-3">
        <h3 className="text-foreground font-semibold">Calculators</h3>
        <ul className="list-disc list-inside space-y-1.5">
          <li><strong className="text-foreground">Profit</strong> — net profit, margin, and effective hourly rate</li>
          <li><strong className="text-foreground">Deposit</strong> — split a job total into deposit and balance</li>
          <li><strong className="text-foreground">Late Fee</strong> — calculate fees on overdue invoices</li>
          <li><strong className="text-foreground">Time to Money</strong> — convert hours worked to a dollar amount</li>
          <li><strong className="text-foreground">Discount</strong> — price breakdown with discounts and optional tax</li>
        </ul>
      </div>

      <div className="space-y-3">
        <h3 className="text-foreground font-semibold">Features</h3>
        <ul className="list-disc list-inside space-y-1.5">
          <li>Works offline — no internet needed after first visit</li>
          <li>Save profit calculations to track your history</li>
          <li>Copy summaries to clipboard from any calculator</li>
          <li>Dark mode support</li>
          <li>Installable as an app on your phone</li>
        </ul>
      </div>

      <div className="space-y-3">
        <h3 className="text-foreground font-semibold">Built For</h3>
        <p>
          Freelancers, contractors, cleaners, handymen, landscapers, and anyone who
          needs quick, reliable math for their service business.
        </p>
      </div>

      <OpsetteFooterLogo />
    </div>
  );
}
