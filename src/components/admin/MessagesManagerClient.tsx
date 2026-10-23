"use client";

import { useState } from "react";
import { ContactMessageItem } from "@/types";
import { updateMessageStatusAction, deleteMessageAction } from "@/app/actions/admin-actions";
import { Mail, Clock, Trash2, CheckCircle2, MessageSquare, Reply } from "lucide-react";

interface MessagesManagerClientProps {
  initialMessages: ContactMessageItem[];
}

export function MessagesManagerClient({ initialMessages }: MessagesManagerClientProps) {
  const [messages, setMessages] = useState<ContactMessageItem[]>(initialMessages);
  const [filter, setFilter] = useState<string>("ALL");
  const [selectedMessage, setSelectedMessage] = useState<ContactMessageItem | null>(
    initialMessages[0] || null
  );

  const filtered =
    filter === "ALL"
      ? messages
      : messages.filter((m) => m.status === filter);

  const handleStatusChange = async (
    id: string,
    status: ContactMessageItem["status"]
  ) => {
    const res = await updateMessageStatusAction(id, status);
    if (res.success) {
      setMessages(
        messages.map((m) => (m.id === id ? { ...m, status } : m))
      );
      if (selectedMessage?.id === id) {
        setSelectedMessage({ ...selectedMessage, status });
      }
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this message?")) return;
    const res = await deleteMessageAction(id);
    if (res.success) {
      const remaining = messages.filter((m) => m.id !== id);
      setMessages(remaining);
      if (selectedMessage?.id === id) {
        setSelectedMessage(remaining[0] || null);
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Filter Tabs */}
      <div className="flex items-center gap-1.5 sm:gap-2 p-1.5 rounded-xl bg-surface border border-surface-border w-full sm:w-fit overflow-x-auto">
        {["ALL", "UNREAD", "READ", "REPLIED"].map((status) => (
          <button
            key={status}
            type="button"
            onClick={() => setFilter(status)}
            className={`flex-1 sm:flex-initial text-center px-3 py-1.5 rounded-lg text-xs font-mono transition-all whitespace-nowrap ${
              filter === status
                ? "bg-accent text-accent-foreground font-semibold shadow-sm"
                : "text-muted-foreground hover:text-white"
            }`}
          >
            {status}
          </button>
        ))}
      </div>

      {/* Split Inbox Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Messages List (5 cols) */}
        <div className="lg:col-span-5 rounded-2xl bg-surface border border-surface-border p-3 sm:p-4 shadow-card space-y-2 max-h-[360px] lg:max-h-[750px] overflow-y-auto">
          {filtered.length === 0 ? (
            <div className="text-center py-12 text-xs text-muted-foreground">
              No inquiries found in this category.
            </div>
          ) : (
            filtered.map((msg) => {
              const isSelected = selectedMessage?.id === msg.id;
              return (
                <button
                  key={msg.id}
                  type="button"
                  onClick={() => {
                    setSelectedMessage(msg);
                    if (msg.status === "UNREAD") {
                      handleStatusChange(msg.id, "READ");
                    }
                  }}
                  className={`w-full text-left p-3.5 rounded-xl border transition-all space-y-1.5 ${
                    isSelected
                      ? "bg-surface-muted border-accent/60 shadow-glow"
                      : "bg-surface-muted/30 border-surface-border hover:border-white/20"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-xs text-white">
                      {msg.name}
                    </span>
                    <span className="text-[10px] font-mono text-muted-foreground">
                      {new Date(msg.createdAt).toLocaleDateString()}
                    </span>
                  </div>

                  <div className="text-xs text-white/90 font-medium truncate">
                    {msg.subject}
                  </div>

                  <p className="text-[11px] text-muted-foreground line-clamp-1">
                    {msg.message}
                  </p>

                  <div className="flex items-center gap-2 pt-1">
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-surface border border-surface-border text-muted-foreground">
                      {msg.category}
                    </span>
                    {msg.status === "UNREAD" && (
                      <span className="px-1.5 py-0.2 rounded text-[9px] font-mono bg-amber-400/10 text-amber-400 border border-amber-400/20">
                        NEW
                      </span>
                    )}
                  </div>
                </button>
              );
            })
          )}
        </div>

        {/* Selected Message Reader (7 cols) */}
        <div className="lg:col-span-7 rounded-2xl bg-surface border border-surface-border p-4 sm:p-8 shadow-card">
          {selectedMessage ? (
            <div className="space-y-6">
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-4 border-b border-surface-border">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono text-accent uppercase tracking-wider">
                      {selectedMessage.category}
                    </span>
                    <span className="text-muted-foreground">&bull;</span>
                    <span className="text-xs font-mono text-muted-foreground">
                      {new Date(selectedMessage.createdAt).toLocaleString()}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-white tracking-tight">
                    {selectedMessage.subject}
                  </h3>
                  <div className="text-xs text-muted-foreground">
                    From: <span className="text-white font-medium">{selectedMessage.name}</span> &lt;
                    <a
                      href={`mailto:${selectedMessage.email}`}
                      className="text-accent underline"
                    >
                      {selectedMessage.email}
                    </a>
                    &gt;
                  </div>
                </div>

                {/* Status & Delete Actions */}
                <div className="flex items-center gap-2 shrink-0">
                  <select
                    value={selectedMessage.status}
                    onChange={(e) =>
                      handleStatusChange(
                        selectedMessage.id,
                        e.target.value as ContactMessageItem["status"]
                      )
                    }
                    className="px-2.5 py-1 rounded-lg bg-surface-muted border border-surface-border text-xs text-white"
                  >
                    <option value="UNREAD">Mark Unread</option>
                    <option value="READ">Mark Read</option>
                    <option value="REPLIED">Mark Replied</option>
                    <option value="ARCHIVED">Archive</option>
                  </select>

                  <button
                    type="button"
                    onClick={() => handleDelete(selectedMessage.id)}
                    className="p-1.5 rounded-lg border border-surface-border text-rose-400 hover:text-rose-300 hover:bg-rose-500/10"
                    title="Delete Message"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Message Body */}
              <div className="p-4 rounded-xl bg-surface-muted/40 border border-surface-border text-sm text-white/90 whitespace-pre-wrap leading-relaxed">
                {selectedMessage.message}
              </div>

              {/* Quick Reply CTA */}
              <div className="pt-2 flex justify-end">
                <a
                  href={`mailto:${selectedMessage.email}?subject=Re: ${encodeURIComponent(selectedMessage.subject)}`}
                  className="px-4 py-2 rounded-xl bg-white text-black hover:bg-neutral-200 text-xs font-semibold flex items-center gap-2 transition-colors"
                >
                  <Reply className="w-3.5 h-3.5" />
                  <span>Reply via Email Client</span>
                </a>
              </div>
            </div>
          ) : (
            <div className="text-center py-16 text-muted-foreground text-xs">
              Select an inquiry on the left to read full contents.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
