import { useNavigate } from "react-router-dom";
import { OpsetteFooterLogo } from "@/components/opsette-share";

export default function PrivacyPage() {
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

      <h2 className="text-2xl font-bold text-foreground">Privacy Policy</h2>

      <p className="text-foreground font-medium text-base">Job Math respects your privacy.</p>

      <div className="space-y-3">
        <h3 className="text-foreground font-semibold">No Data Collection</h3>
        <p>
          Job Math runs entirely in your browser. We do not collect, store, or transmit any
          personal information. All calculations happen locally on your device.
        </p>
      </div>

      <div className="space-y-3">
        <h3 className="text-foreground font-semibold">Local Storage Only</h3>
        <p>
          Your saved jobs are stored in your browser's local storage. This data never leaves
          your device and is not accessible to us or any third party.
        </p>
      </div>

      <div className="space-y-3">
        <h3 className="text-foreground font-semibold">No Cookies or Tracking</h3>
        <p>
          We do not use cookies, analytics, or any third-party tracking services.
        </p>
      </div>

      <div className="space-y-3">
        <h3 className="text-foreground font-semibold">No Account Required</h3>
        <p>
          There is no sign-up, no login, and no data stored on any server.
          Your revenue, costs, and profit calculations are never shared with anyone.
        </p>
      </div>

      <div className="space-y-3">
        <h3 className="text-foreground font-semibold">Contact</h3>
        <p>
          If you have questions about this policy, you can reach us through the app's repository.
        </p>
      </div>

      <OpsetteFooterLogo />
    </div>
  );
}
