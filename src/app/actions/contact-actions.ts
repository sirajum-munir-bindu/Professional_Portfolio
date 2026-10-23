"use server";

import { contactFormSchema } from "@/lib/validations";
import { db } from "@/lib/db";
import { rateLimit } from "@/lib/rate-limit";
import { headers } from "next/headers";

export interface ContactActionResult {
  success: boolean;
  message?: string;
  error?: string;
  fieldErrors?: Record<string, string>;
}

export async function submitContactForm(
  prevState: ContactActionResult | null,
  formData: FormData
): Promise<ContactActionResult> {
  const headerList = await headers();
  const ip = headerList.get("x-forwarded-for") || headerList.get("x-real-ip") || "anonymous";

  // Rate limit: 3 submissions per 15 minutes per IP
  const rl = rateLimit(`contact-${ip}`, 3, 15 * 60 * 1000);
  if (!rl.success) {
    const minutes = Math.ceil(rl.resetMs / 60000);
    return {
      success: false,
      error: `Submission rate limit exceeded. Please wait ${minutes} minute(s) before sending another inquiry.`,
    };
  }

  const rawData = {
    name: formData.get("name")?.toString() || "",
    email: formData.get("email")?.toString() || "",
    subject: formData.get("subject")?.toString() || "",
    category: formData.get("category")?.toString() || "GENERAL",
    message: formData.get("message")?.toString() || "",
    honeyPot: formData.get("company_verification_field")?.toString() || "",
  };

  // Bot honeypot check
  if (rawData.honeyPot && rawData.honeyPot.length > 0) {
    // Silently return success to mislead spambots
    return {
      success: true,
      message: "Your message has been dispatched to Alexander's direct inbox. Expect a response within 24 business hours.",
    };
  }

  const result = contactFormSchema.safeParse(rawData);
  if (!result.success) {
    const fieldErrors: Record<string, string> = {};
    for (const err of result.error.errors) {
      if (err.path[0]) {
        fieldErrors[err.path[0].toString()] = err.message;
      }
    }
    return {
      success: false,
      error: "Please correct the highlighted errors before submitting.",
      fieldErrors,
    };
  }

  try {
    await db.createContactMessage({
      name: result.data.name,
      email: result.data.email,
      subject: result.data.subject,
      category: result.data.category,
      message: result.data.message,
    });

    return {
      success: true,
      message: "Inquiry successfully recorded. A confirmation email and direct response will follow shortly.",
    };
  } catch {
    return {
      success: false,
      error: "An internal database error occurred while recording your inquiry. Please try again shortly or reach out via LinkedIn.",
    };
  }
}
