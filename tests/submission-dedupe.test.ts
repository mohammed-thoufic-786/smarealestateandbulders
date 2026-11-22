import { describe, it, expect } from "vitest";
import { claimSubmissionToken, releaseSubmissionToken } from "@/lib/submission-dedupe";

describe("submission dedupe", () => {
  it("allows a token once and rejects a repeat", () => {
    const token = `test-${Date.now()}-dedupe`;
    expect(claimSubmissionToken(token)).toBe(true);
    expect(claimSubmissionToken(token)).toBe(false);
    releaseSubmissionToken(token);
    expect(claimSubmissionToken(token)).toBe(true);
    releaseSubmissionToken(token);
  });

  it("rejects missing or short tokens", () => {
    expect(claimSubmissionToken("")).toBe(false);
    expect(claimSubmissionToken("short")).toBe(false);
  });
});
