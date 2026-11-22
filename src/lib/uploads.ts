import { createHash } from "crypto";

/**
 * Cloudinary signed-upload helper (server-only).
 *
 * The browser asks `POST /api/uploads/sign` for a short-lived signature, then
 * uploads the file directly to Cloudinary. The API secret never leaves the
 * server. When Cloudinary is not configured the route reports `configured:false`
 * and the UI falls back to adding image URLs manually.
 */

export interface CloudinarySignParams {
  folder?: string;
  timestamp?: number;
  publicId?: string;
}

export interface CloudinarySignature {
  signature: string;
  timestamp: number;
  folder: string;
  publicId?: string;
  cloudName: string;
  apiKey: string;
  uploadUrl: string;
}

export function isCloudinaryConfigured(): boolean {
  return Boolean(
    process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME &&
      process.env.CLOUDINARY_API_KEY &&
      process.env.CLOUDINARY_API_SECRET,
  );
}

/** Deterministic Cloudinary signature: sha1 of alphabetically-sorted params + secret. */
export function signUploadParams(params: CloudinarySignParams, secret: string): string {
  const toSign: Record<string, string> = {};
  if (params.folder) toSign.folder = params.folder;
  if (params.publicId) toSign.public_id = params.publicId;
  if (params.timestamp) toSign.timestamp = String(params.timestamp);

  const payload = Object.keys(toSign)
    .sort()
    .map((k) => `${k}=${toSign[k]}`)
    .join("&");

  return createHash("sha1").update(payload + secret).digest("hex");
}

export function createUploadSignature(params: CloudinarySignParams = {}): CloudinarySignature | null {
  if (!isCloudinaryConfigured()) return null;

  const timestamp = params.timestamp ?? Math.floor(Date.now() / 1000);
  const folder = params.folder ?? "sma/properties";
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME as string;

  return {
    signature: signUploadParams({ folder, timestamp, publicId: params.publicId }, process.env.CLOUDINARY_API_SECRET as string),
    timestamp,
    folder,
    publicId: params.publicId,
    cloudName,
    apiKey: process.env.CLOUDINARY_API_KEY as string,
    uploadUrl: `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
  };
}
