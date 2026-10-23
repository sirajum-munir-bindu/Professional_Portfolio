import Link from "next/link";
import { Terminal, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background text-foreground flex items-center justify-center p-6">
      <div className="max-w-md w-full rounded-2xl bg-surface border border-surface-border p-8 shadow-card text-center space-y-6">
        <div className="w-12 h-12 rounded-xl bg-surface-muted border border-surface-border flex items-center justify-center text-accent mx-auto font-mono text-lg font-bold">
          <Terminal className="w-6 h-6" />
        </div>

        <div className="space-y-2">
          <span className="text-xs font-mono text-accent uppercase tracking-wider">
            HTTP 404 &bull; Routing Exception
          </span>
          <h1 className="text-2xl font-bold text-white tracking-tight">
            Node Not Found
          </h1>
          <p className="text-xs text-muted-foreground leading-relaxed">
            The requested architecture blueprint, resource endpoint, or path does not exist in the current topology.
          </p>
        </div>

        <div className="pt-2">
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-accent text-accent-foreground font-semibold text-xs hover:bg-accent-hover transition-colors shadow-glow"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to Portfolio</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
