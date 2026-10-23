import { MediaManagerClient } from "@/components/admin/MediaManagerClient";

export default function AdminMediaPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
          Media Storage & Asset Manager
        </h1>
        <p className="text-xs sm:text-sm text-muted-foreground mt-1">
          Upload project screenshots, architecture diagrams, and media with strict type and payload verification.
        </p>
      </div>

      <MediaManagerClient />
    </div>
  );
}
