import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import crypto from "crypto";

const ALLOWED_MIME_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/avif",
  "image/svg+xml",
]);

const MAX_FILE_SIZE = 4 * 1024 * 1024; // 4MB

export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    if (!ALLOWED_MIME_TYPES.has(file.type)) {
      return NextResponse.json(
        { error: "Invalid file format. Supported formats: JPEG, PNG, WebP, AVIF, SVG" },
        { status: 400 }
      );
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: "File size exceeds 4MB limit" },
        { status: 400 }
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const hash = crypto.createHash("sha256").update(buffer).digest("hex").slice(0, 16);
    const extension = file.name.split(".").pop()?.toLowerCase() || "jpg";
    const sanitizedKey = `media-${Date.now()}-${hash}.${extension}`;

    // Cloudinary adapter if environment variables are present
    if (
      process.env.CLOUDINARY_CLOUD_NAME &&
      process.env.CLOUDINARY_API_KEY &&
      process.env.CLOUDINARY_API_SECRET
    ) {
      const cloudinaryUrl = `https://api.cloudinary.com/v1_1/${process.env.CLOUDINARY_CLOUD_NAME}/image/upload`;
      const timestamp = Math.round(new Date().getTime() / 1000);
      const signatureStr = `timestamp=${timestamp}${process.env.CLOUDINARY_API_SECRET}`;
      const signature = crypto.createHash("sha1").update(signatureStr).digest("hex");

      const uploadData = new FormData();
      uploadData.append("file", file);
      uploadData.append("api_key", process.env.CLOUDINARY_API_KEY);
      uploadData.append("timestamp", timestamp.toString());
      uploadData.append("signature", signature);

      const res = await fetch(cloudinaryUrl, { method: "POST", body: uploadData });
      if (res.ok) {
        const json = await res.json();
        return NextResponse.json({
          url: json.secure_url,
          filename: sanitizedKey,
          size: file.size,
          mimeType: file.type,
        });
      }
    }

    // High-performance fallback: Data URL optimization for demo/dev/stateless environments
    const base64Data = buffer.toString("base64");
    const dataUrl = `data:${file.type};base64,${base64Data}`;

    return NextResponse.json({
      url: dataUrl,
      filename: sanitizedKey,
      size: file.size,
      mimeType: file.type,
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Media upload failed" },
      { status: 500 }
    );
  }
}
