"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { SiteSettingsData } from "@/types";
import QRCode from "qrcode";
import {
  User,
  Phone,
  Mail,
  MessageSquare,
  Share2,
  Download,
  QrCode,
  MapPin,
  Building,
  Globe,
  Linkedin,
  Github,
  Twitter,
  FileText,
  Check,
  Copy,
  X,
  Sparkles,
} from "lucide-react";

interface DigitalVisitingCardProps {
  settings: SiteSettingsData;
  className?: string;
}

export function DigitalVisitingCard({ settings, className }: DigitalVisitingCardProps) {
  const [copied, setCopied] = useState(false);
  const [qrOpen, setQrOpen] = useState(false);
  const [qrDataUrl, setQrDataUrl] = useState<string | null>(null);
  const [canonicalUrl, setCanonicalUrl] = useState<string>("");

  // Resolving fields with fallbacks
  const name = settings.cardName || settings.displayName || "Sirajum Munir";
  const title = settings.cardTitle || settings.roleTitle || settings.headline || "Systems Architect";
  const company = settings.cardCompany || "";
  const bio = settings.cardBio || settings.bio || "";
  const avatar = settings.cardAvatarUrl || settings.avatarUrl;
  const phone = settings.cardPhone || "";
  const whatsapp = settings.cardWhatsapp || phone;
  const email = settings.cardEmail || settings.primaryEmail;
  const location = settings.cardLocation || settings.location;
  const website = settings.cardWebsite || "";
  const linkedin = settings.cardLinkedin || settings.linkedinUrl;
  const github = settings.cardGithub || settings.githubUrl;
  const twitter = settings.cardTwitter || settings.twitterUrl;
  const resume = settings.cardResumeUrl || settings.resumeUrl;

  // Custom links if configured as JSON
  let customLinks: { label: string; url: string }[] = [];
  if (settings.cardCustomLinks) {
    try {
      const parsed = JSON.parse(settings.cardCustomLinks);
      if (Array.isArray(parsed)) {
        customLinks = parsed.filter((l) => l.label && l.url);
      }
    } catch {
      // ignore parse error
    }
  }

  // Format phone number for WhatsApp
  const cleanPhoneForWa = whatsapp.replace(/[^0-9]/g, "");

  useEffect(() => {
    const url = window.location.origin;
    setCanonicalUrl(url);

    QRCode.toDataURL(url, {
      width: 320,
      margin: 2,
      color: {
        dark: "#000000",
        light: "#ffffff",
      },
    })
      .then((dataUri) => setQrDataUrl(dataUri))
      .catch((err) => console.error("QR generation error:", err));
  }, []);

  const handleShare = async () => {
    const shareData = {
      title: `${name} - Digital Identity Card`,
      text: `${name} | ${title}${company ? ` at ${company}` : ""}`,
      url: canonicalUrl || window.location.origin,
    };

    if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
      try {
        await navigator.share(shareData);
        return;
      } catch (err) {
        // User cancelled or share failed, fallback to copy
      }
    }

    try {
      await navigator.clipboard.writeText(shareData.url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // clipboard fallback failed
    }
  };

  return (
    <div
      className={`min-h-screen min-h-[100dvh] w-full bg-[#07090e] text-slate-100 flex flex-col justify-center items-center px-3 sm:px-6 py-4 sm:py-8 selection:bg-accent selection:text-accent-foreground relative overflow-x-hidden ${
        className || ""
      }`}
    >
      {/* Ambient background glow accents */}
      <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[380px] h-[300px] bg-accent/15 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-[-10%] left-1/2 -translate-x-1/2 w-[300px] h-[250px] bg-blue-600/10 rounded-full blur-[90px] pointer-events-none" />

      {/* Main Premium Card Container */}
      <div className="w-full max-w-[390px] sm:max-w-[430px] my-auto relative z-10 flex flex-col rounded-3xl bg-slate-900/95 backdrop-blur-2xl border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.6)] overflow-hidden">
        
        {/* Card Top Decorative Header Banner */}
        <div className="h-20 sm:h-24 bg-gradient-to-r from-accent/25 via-emerald-500/20 to-teal-600/25 relative border-b border-white/5 shrink-0">
          <div className="absolute inset-0 bg-[radial-gradient(#ffffff0a_1px,transparent_1px)] [background-size:16px_16px]" />
          
          {/* Top Bar Actions: Share & QR */}
          <div className="absolute top-3 right-3 flex items-center gap-1.5 z-10">
            <button
              type="button"
              onClick={() => setQrOpen(true)}
              title="Show QR Code"
              className="w-8 h-8 rounded-full bg-slate-900/80 backdrop-blur-md border border-white/15 text-slate-300 hover:text-white hover:bg-slate-800 transition-all flex items-center justify-center shadow-sm"
              aria-label="Show QR Code"
            >
              <QrCode className="w-3.5 h-3.5" />
            </button>
            
            <button
              type="button"
              onClick={handleShare}
              title="Share Digital Card"
              className="w-8 h-8 rounded-full bg-slate-900/80 backdrop-blur-md border border-white/15 text-slate-300 hover:text-white hover:bg-slate-800 transition-all flex items-center justify-center shadow-sm relative"
              aria-label="Share card"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Share2 className="w-3.5 h-3.5" />}
              {copied && (
                <span className="absolute -bottom-7 right-0 bg-slate-950 border border-white/10 text-[9px] font-mono px-2 py-0.5 rounded shadow-lg text-emerald-400 whitespace-nowrap">
                  Link Copied!
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Card Body */}
        <div className="px-4 sm:px-6 pb-4 pt-0 relative flex-1 flex flex-col justify-between">
          
          {/* Top Info Section: Avatar, Status, Name, Bio */}
          <div>
            {/* Avatar & Availability Row */}
            <div className="relative -mt-10 sm:-mt-12 mb-2 flex items-end justify-between shrink-0 z-20">
              <div className="relative w-20 h-20 sm:w-22 sm:h-22 rounded-2xl overflow-hidden bg-slate-900 border-[3px] border-[#07090e] shadow-2xl shrink-0 ring-1 ring-white/20 group">
                {avatar ? (
                  <Image
                    src={avatar}
                    alt={name}
                    fill
                    sizes="(max-width: 640px) 80px, 96px"
                    className="object-cover object-top transition-transform duration-500 group-hover:scale-105"
                    unoptimized={typeof avatar === "string" && (avatar.startsWith("data:") || avatar.startsWith("blob:"))}
                    priority
                  />
                ) : (
                  <div className="w-full h-full bg-slate-800 flex items-center justify-center text-slate-400">
                    <User className="w-10 h-10" />
                  </div>
                )}
              </div>

              {/* Status Pill */}
              {settings.availableForWork && (
                <div className="mb-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center gap-1.5 shadow-sm">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-[10px] sm:text-[11px] font-medium text-emerald-400">Available</span>
                </div>
              )}
            </div>

            {/* Profile Identity & Title */}
            <div className="space-y-0.5 shrink-0">
              <div className="flex items-center gap-1.5 flex-wrap">
                <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight leading-tight">{name}</h1>
                <span title="Verified Identity" className="text-accent inline-flex">
                  <Sparkles className="w-4 h-4" />
                </span>
              </div>
              <p className="text-xs sm:text-sm font-semibold text-emerald-400 font-mono tracking-wide truncate">{title}</p>
              
              <div className="flex items-center flex-wrap gap-x-3 gap-y-0.5 text-[11px] sm:text-xs text-slate-400 pt-0.5">
                {company && (
                  <div className="flex items-center gap-1 truncate max-w-[170px] sm:max-w-none">
                    <Building className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="truncate">{company}</span>
                  </div>
                )}
                {location && (
                  <div className="flex items-center gap-1 truncate max-w-[170px] sm:max-w-none">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="truncate">{location}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Professional Bio */}
            {bio && (
              <p className="text-[11px] sm:text-xs text-slate-300 leading-relaxed bg-slate-950/50 p-2.5 rounded-xl border border-white/5 my-2">
                {bio}
              </p>
            )}
          </div>

          {/* Action Center: Save Contact & Direct Communication Grid */}
          <div className="space-y-2 pt-1 shrink-0">
            {/* 1-Tap Save Contact to Phone Button */}
            <a
              href="/api/card/vcf"
              download={`${name.replace(/[^a-zA-Z0-9_-]/g, "_")}.vcf`}
              className="w-full py-2.5 px-4 rounded-xl bg-accent text-accent-foreground font-semibold text-xs hover:bg-accent-hover transition-all flex items-center justify-center gap-2 shadow-glow active:scale-[0.99]"
            >
              <Download className="w-4 h-4" />
              <span>Save Contact to Phone (.vcf)</span>
            </a>

            {/* Direct Communication Grid: Call, WhatsApp, Email */}
            <div className="grid grid-cols-3 gap-1.5 sm:gap-2">
              {phone ? (
                <a
                  href={`tel:${phone}`}
                  className="py-2 sm:py-2.5 px-1 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 border border-white/10 text-white text-xs font-medium flex flex-col items-center justify-center gap-1 transition-all text-center min-w-0 truncate"
                  title={`Call ${phone}`}
                >
                  <Phone className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-400" />
                  <span className="text-[10px] sm:text-[11px] truncate">Call</span>
                </a>
              ) : (
                <div className="py-2 sm:py-2.5 px-1 rounded-xl bg-slate-800/30 border border-white/5 text-slate-500 text-xs flex flex-col items-center justify-center gap-1 opacity-50 cursor-not-allowed min-w-0">
                  <Phone className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  <span className="text-[10px] sm:text-[11px]">Call</span>
                </div>
              )}

              {whatsapp ? (
                <a
                  href={`https://wa.me/${cleanPhoneForWa}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="py-2 sm:py-2.5 px-1 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 border border-white/10 text-white text-xs font-medium flex flex-col items-center justify-center gap-1 transition-all text-center min-w-0 truncate"
                  title="Chat on WhatsApp"
                >
                  <MessageSquare className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-400" />
                  <span className="text-[10px] sm:text-[11px] truncate">WhatsApp</span>
                </a>
              ) : (
                <div className="py-2 sm:py-2.5 px-1 rounded-xl bg-slate-800/30 border border-white/5 text-slate-500 text-xs flex flex-col items-center justify-center gap-1 opacity-50 cursor-not-allowed min-w-0">
                  <MessageSquare className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  <span className="text-[10px] sm:text-[11px]">WhatsApp</span>
                </div>
              )}

              {email ? (
                <a
                  href={`mailto:${email}`}
                  className="py-2 sm:py-2.5 px-1 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 border border-white/10 text-white text-xs font-medium flex flex-col items-center justify-center gap-1 transition-all text-center min-w-0 truncate"
                  title={`Email ${email}`}
                >
                  <Mail className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-400" />
                  <span className="text-[10px] sm:text-[11px] truncate">Email</span>
                </a>
              ) : (
                <div className="py-2 sm:py-2.5 px-1 rounded-xl bg-slate-800/30 border border-white/5 text-slate-500 text-xs flex flex-col items-center justify-center gap-1 opacity-50 cursor-not-allowed min-w-0">
                  <Mail className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  <span className="text-[10px] sm:text-[11px]">Email</span>
                </div>
              )}
            </div>
          </div>

          {/* Social & Professional Connections - 2-Column Responsive Grid */}
          <div className="pt-2 border-t border-white/10 shrink-0">
            <div className="grid grid-cols-2 gap-1.5 sm:gap-2">
              {linkedin && (
                <a
                  href={linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 p-2 sm:p-2.5 px-2.5 rounded-xl bg-slate-950/60 hover:bg-slate-800/80 border border-white/10 text-slate-200 text-xs font-medium transition-all group min-w-0"
                >
                  <div className="w-5 h-5 rounded-md bg-[#0077b5]/20 text-[#0077b5] flex items-center justify-center shrink-0">
                    <Linkedin className="w-3.5 h-3.5" />
                  </div>
                  <span className="truncate">LinkedIn</span>
                </a>
              )}

              {github && (
                <a
                  href={github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 p-2 sm:p-2.5 px-2.5 rounded-xl bg-slate-950/60 hover:bg-slate-800/80 border border-white/10 text-slate-200 text-xs font-medium transition-all group min-w-0"
                >
                  <div className="w-5 h-5 rounded-md bg-white/10 text-white flex items-center justify-center shrink-0">
                    <Github className="w-3.5 h-3.5" />
                  </div>
                  <span className="truncate">GitHub</span>
                </a>
              )}

              {twitter && (
                <a
                  href={twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 p-2 sm:p-2.5 px-2.5 rounded-xl bg-slate-950/60 hover:bg-slate-800/80 border border-white/10 text-slate-200 text-xs font-medium transition-all group min-w-0"
                >
                  <div className="w-5 h-5 rounded-md bg-sky-500/10 text-sky-400 flex items-center justify-center shrink-0">
                    <Twitter className="w-3.5 h-3.5" />
                  </div>
                  <span className="truncate">Twitter / X</span>
                </a>
              )}

              {website && (
                <a
                  href={website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 p-2 sm:p-2.5 px-2.5 rounded-xl bg-slate-950/60 hover:bg-slate-800/80 border border-white/10 text-slate-200 text-xs font-medium transition-all group min-w-0"
                >
                  <div className="w-5 h-5 rounded-md bg-emerald-500/10 text-emerald-400 flex items-center justify-center shrink-0">
                    <Globe className="w-3.5 h-3.5" />
                  </div>
                  <span className="truncate">Website</span>
                </a>
              )}

              {resume && (
                <a
                  href={resume}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 p-2 sm:p-2.5 px-2.5 rounded-xl bg-slate-950/60 hover:bg-slate-800/80 border border-white/10 text-slate-200 text-xs font-medium transition-all group min-w-0 col-span-2 sm:col-span-1"
                >
                  <div className="w-5 h-5 rounded-md bg-amber-500/10 text-amber-400 flex items-center justify-center shrink-0">
                    <FileText className="w-3.5 h-3.5" />
                  </div>
                  <span className="truncate">Resume / CV</span>
                </a>
              )}

              {customLinks.slice(0, 2).map((item, idx) => (
                <a
                  key={idx}
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 p-2 sm:p-2.5 px-2.5 rounded-xl bg-slate-950/60 hover:bg-slate-800/80 border border-white/10 text-slate-200 text-xs font-medium transition-all group min-w-0"
                >
                  <div className="w-5 h-5 rounded-md bg-purple-500/10 text-purple-400 flex items-center justify-center shrink-0">
                    <Globe className="w-3.5 h-3.5" />
                  </div>
                  <span className="truncate">{item.label}</span>
                </a>
              ))}
            </div>
          </div>

          {/* Micro Footer inside Card */}
          <div className="pt-3 pb-1 text-center text-[10px] sm:text-[11px] text-slate-500 font-mono shrink-0">
            {name} &copy; {new Date().getFullYear()} &bull; Digital Identity Card
          </div>
        </div>
      </div>

      {/* QR Code Modal */}
      {qrOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200 overflow-y-auto">
          <div className="relative w-full max-w-xs max-h-[90vh] overflow-y-auto rounded-3xl bg-slate-900 border border-white/15 p-4 sm:p-5 shadow-2xl text-center space-y-3 my-auto">
            <button
              type="button"
              onClick={() => setQrOpen(false)}
              className="absolute top-3.5 right-3.5 w-7 h-7 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition-colors"
              aria-label="Close"
            >
              <X className="w-3.5 h-3.5" />
            </button>

            <div className="space-y-0.5">
              <h3 className="text-sm font-bold text-white">Scan Visiting Card</h3>
              <p className="text-[11px] text-slate-400">Scan to open card instantly</p>
            </div>

            {/* QR Render Area */}
            <div className="p-3 bg-white rounded-2xl flex items-center justify-center mx-auto w-48 h-48 shadow-inner">
              {qrDataUrl ? (
                <Image
                  src={qrDataUrl}
                  alt="QR Code"
                  width={180}
                  height={180}
                  className="rounded-lg"
                  unoptimized
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-slate-400">
                  <div className="w-6 h-6 border-2 border-slate-400 border-t-transparent rounded-full animate-spin" />
                </div>
              )}
            </div>

            <div className="text-[10px] font-mono text-slate-400 truncate max-w-[240px] mx-auto">
              {canonicalUrl}
            </div>

            <div className="flex items-center gap-2 pt-1">
              <button
                type="button"
                onClick={async () => {
                  if (canonicalUrl) {
                    await navigator.clipboard.writeText(canonicalUrl);
                    setCopied(true);
                    setTimeout(() => setCopied(false), 2000);
                  }
                }}
                className="flex-1 py-2 px-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-white/10 text-white text-xs font-medium flex items-center justify-center gap-1.5 transition-colors"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? "Copied!" : "Copy"}</span>
              </button>

              {qrDataUrl && (
                <a
                  href={qrDataUrl}
                  download="visiting-card-qr.png"
                  className="flex-1 py-2 px-2.5 rounded-xl bg-accent text-accent-foreground text-xs font-semibold flex items-center justify-center gap-1.5 hover:bg-accent-hover transition-colors"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Save QR</span>
                </a>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
