import { describe, it, expect, afterEach } from "vitest";
import {
  isCloudinaryConfigured,
  signUploadParams,
  createUploadSignature,
} from "@/lib/uploads";

const ORIGINAL = { ...process.env };
afterEach(() => {
  process.env = { ...ORIGINAL };
});

describe("signUploadParams", () => {
  it("matches the known Cloudinary vector (sorted params + secret)", () => {
    const sig = signUploadParams({ folder: "sma/properties", timestamp: 1234567890 }, "mysecret");
    expect(sig).toBe("8cc40bfae3db694a4ea5a68eaee6df16714a06f1");
  });

  it("includes public_id in the signature", () => {
    const a = signUploadParams({ folder: "x", timestamp: 1 }, "s");
    const b = signUploadParams({ folder: "x", timestamp: 1, publicId: "cover" }, "s");
    expect(a).not.toBe(b);
  });

  it("changes with the secret", () => {
    const a = signUploadParams({ timestamp: 1 }, "secret-a");
    const b = signUploadParams({ timestamp: 1 }, "secret-b");
    expect(a).not.toBe(b);
  });
});

describe("createUploadSignature", () => {
  it("returns null when unconfigured", () => {
    delete process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
    delete process.env.CLOUDINARY_API_KEY;
    delete process.env.CLOUDINARY_API_SECRET;
    expect(isCloudinaryConfigured()).toBe(false);
    expect(createUploadSignature()).toBeNull();
  });

  it("returns a complete signature when configured", () => {
    process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME = "demo";
    process.env.CLOUDINARY_API_KEY = "key";
    process.env.CLOUDINARY_API_SECRET = "secret";
    const sig = createUploadSignature({ timestamp: 1234567890 });
    expect(sig).not.toBeNull();
    expect(sig!.cloudName).toBe("demo");
    expect(sig!.apiKey).toBe("key");
    expect(sig!.uploadUrl).toBe("https://api.cloudinary.com/v1_1/demo/image/upload");
    expect(sig!.signature).toBe(
      signUploadParams({ folder: "sma/properties", timestamp: 1234567890 }, "secret"),
    );
  });
});
