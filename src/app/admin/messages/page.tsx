import { db } from "@/lib/db";
import { MessagesManagerClient } from "@/components/admin/MessagesManagerClient";

export default async function AdminMessagesPage() {
  const messages = await db.getContactMessages();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
          Client & Enterprise Inquiries Inbox
        </h1>
        <p className="text-xs sm:text-sm text-muted-foreground mt-1">
          Review inbound consulting requests, system architecture inquiries, and collaboration scopes.
        </p>
      </div>

      <MessagesManagerClient initialMessages={messages} />
    </div>
  );
}
