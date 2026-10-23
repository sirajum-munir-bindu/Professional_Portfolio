"use client";

import { useState } from "react";
import Image from "next/image";
import { Upload, Copy, Check, Trash2, AlertCircle, FileImage, ShieldCheck } from "lucide-react";

interface UploadedMediaItem {
  id: string;
  url: string;
  filename: string;
  size: number;
  mimeType: string;
  uploadedAt: string;
}

export function MediaManagerClient() {
  const [mediaList, setMediaList] = useState<UploadedMediaItem[]>([
    {
      id: "m-1",
      url: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1200&q=80",
      filename: "nexus-stream-topology.jpg",
      size: 342000,
      mimeType: "image/jpeg",
      uploadedAt: new Date().toLocaleDateString(),
    },
    {
      id: "m-2",
      url: "https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&w=1200&q=80",
      filename: "aurora-ledger-audit.jpg",
      size: 289000,
      mimeType: "image/jpeg",
      uploadedAt: new Date().toLocaleDateString(),
    },
    {
      id: "m-3",
      url: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80",
      filename: "chronos-job-matrix.jpg",
      size: 412000,
      mimeType: "image/jpeg",
      uploadedAt: new Date().toLocaleDateString(),
    },
  ]);

  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setUploadError(null);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/media/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Upload failed");
      }

      const newItem: UploadedMediaItem = {
        id: `m-${Date.now()}`,
        url: data.url,
        filename: data.filename,
        size: data.size,
        mimeType: data.mimeType,
        uploadedAt: new Date().toLocaleDateString(),
      };

      setMediaList([newItem, ...mediaList]);
    } catch (err) {
      setUploadError(err instanceof Error ? err.message : "File upload failed");
    } finally {
      setIsUploading(false);
      e.target.value = "";
    }
  };

  const handleCopy = (url: string, id: string) => {
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleDelete = (id: string) => {
    setMediaList(mediaList.filter((m) => m.id !== id));
  };

  return (
    <div className="space-y-8">
      {/* Upload Dropzone */}
      <div className="rounded-2xl bg-surface border-2 border-dashed border-surface-border hover:border-accent/50 p-8 text-center transition-colors shadow-card relative">
        <input
          type="file"
          accept="image/jpeg,image/png,image/webp,image/avif,image/svg+xml"
          onChange={handleFileUpload}
          disabled={isUploading}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
        />

        <div className="max-w-md mx-auto space-y-3 pointer-events-none">
          <div className="w-12 h-12 rounded-2xl bg-surface-muted border border-surface-border flex items-center justify-center text-accent mx-auto">
            {isUploading ? (
              <div className="w-5 h-5 border-2 border-accent border-t-transparent rounded-full animate-spin" />
            ) : (
              <Upload className="w-6 h-6" />
            )}
          </div>

          <div>
            <span className="font-semibold text-sm text-white block">
              {isUploading ? "Uploading & Validating Payload..." : "Click or Drag Media to Upload"}
            </span>
            <span className="text-xs text-muted-foreground mt-1 block">
              Supported formats: JPEG, PNG, WebP, AVIF, SVG (Max 4MB)
            </span>
          </div>

          <div className="flex items-center justify-center gap-1.5 text-[11px] font-mono text-muted-foreground pt-1">
            <ShieldCheck className="w-3.5 h-3.5 text-accent" />
            <span>MIME verification &bull; SHA-256 Key Sanitization &bull; Serverless Resilient</span>
          </div>
        </div>
      </div>

      {uploadError && (
        <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs flex items-center gap-2.5">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{uploadError}</span>
        </div>
      )}

      {/* Media Library Grid */}
      <div className="space-y-4">
        <h2 className="text-sm font-mono font-bold text-white uppercase tracking-wider">
          Managed Asset Repository ({mediaList.length})
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
          {mediaList.map((item) => (
            <div
              key={item.id}
              className="rounded-2xl bg-surface border border-surface-border overflow-hidden shadow-card group flex flex-col justify-between"
            >
              <div className="relative aspect-[16/10] w-full bg-surface-muted overflow-hidden">
                <Image
                  src={item.url}
                  alt={item.filename}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover group-hover:scale-[1.02] transition-transform"
                />
              </div>

              <div className="p-4 space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <div className="truncate flex-1">
                    <span className="font-semibold text-xs text-white truncate block">
                      {item.filename}
                    </span>
                    <span className="text-[10px] font-mono text-muted-foreground">
                      {(item.size / 1024).toFixed(1)} KB &bull; {item.mimeType}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleDelete(item.id)}
                    className="p-1 rounded text-rose-400 hover:text-rose-300 hover:bg-rose-500/10"
                    title="Remove from Library"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="pt-2 border-t border-surface-border flex items-center justify-between gap-2">
                  <span className="text-[10px] font-mono text-muted-foreground truncate max-w-[140px]">
                    {item.url.slice(0, 24)}...
                  </span>

                  <button
                    type="button"
                    onClick={() => handleCopy(item.url, item.id)}
                    className="px-2.5 py-1 rounded-lg bg-surface-muted border border-surface-border text-xs text-white hover:border-accent/40 flex items-center gap-1 transition-colors"
                  >
                    {copiedId === item.id ? (
                      <>
                        <Check className="w-3 h-3 text-accent" />
                        <span className="text-[11px] text-accent">Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3" />
                        <span className="text-[11px]">Copy URL</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
