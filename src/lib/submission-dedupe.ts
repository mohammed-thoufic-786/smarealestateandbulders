const TOKEN_TTL_MS = 5 * 60 * 1000;

declare global {
  var _smaSubmissionTokens: Map<string, number> | undefined;
}

const usedTokens = global._smaSubmissionTokens ?? new Map<string, number>();
global._smaSubmissionTokens = usedTokens;

function prune(): void {
  const now = Date.now();
  for (const [token, expiresAt] of usedTokens) {
    if (expiresAt <= now) usedTokens.delete(token);
  }
}

export function claimSubmissionToken(token: string): boolean {
  prune();
  if (!token || token.length < 10 || usedTokens.has(token)) return false;
  usedTokens.set(token, Date.now() + TOKEN_TTL_MS);
  return true;
}

export function releaseSubmissionToken(token: string): void {
  usedTokens.delete(token);
}
