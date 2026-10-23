"use server";

import { loginSchema } from "@/lib/validations";
import { verifyAdminCredentials, createSessionToken, setSessionCookie, clearSessionCookie } from "@/lib/auth";
import { rateLimit } from "@/lib/rate-limit";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export interface AuthActionResult {
  success: boolean;
  error?: string;
}

export async function loginAction(
  prevState: AuthActionResult | null,
  formData: FormData
): Promise<AuthActionResult> {
  const headerList = await headers();
  const ip = headerList.get("x-forwarded-for") || headerList.get("x-real-ip") || "anonymous";

  // Rate limit: 5 login attempts per 10 minutes per IP
  const rl = rateLimit(`login-${ip}`, 5, 10 * 60 * 1000);
  if (!rl.success) {
    const minutes = Math.ceil(rl.resetMs / 60000);
    return {
      success: false,
      error: `Too many login attempts. Please wait ${minutes} minute(s) before trying again.`,
    };
  }

  const rawEmail = formData.get("email");
  const rawPassword = formData.get("password");

  const parsed = loginSchema.safeParse({
    email: rawEmail,
    password: rawPassword,
  });

  if (!parsed.success) {
    return {
      success: false,
      error: parsed.error.errors[0]?.message || "Invalid input parameters.",
    };
  }

  const user = await verifyAdminCredentials(parsed.data.email, parsed.data.password);
  if (!user) {
    return {
      success: false,
      error: "Invalid email or password. Access is restricted to authorized administrators.",
    };
  }

  const token = await createSessionToken(user);
  await setSessionCookie(token);

  redirect("/admin/dashboard");
}

export async function logoutAction(): Promise<void> {
  await clearSessionCookie();
  redirect("/admin/login");
}
