// lib/rateLimit.js

const rateLimitStore = new Map();

export function rateLimit(identifier, maxAttempts = 5, windowMs = 60000) {
  const now = Date.now();
  const attempts = rateLimitStore.get(identifier) || [];
  const recentAttempts = attempts.filter((time) => now - time < windowMs);

  if (recentAttempts.length >= maxAttempts) {
    const oldestAttempt = recentAttempts[0];
    const retryAfter = Math.ceil((oldestAttempt + windowMs - now) / 1000);
    return { allowed: false, retryAfter };
  }

  recentAttempts.push(now);
  rateLimitStore.set(identifier, recentAttempts);

  // Cleanup old entries periodically
  if (Math.random() < 0.01) {
    // 1% chance
    cleanupOldEntries(windowMs);
  }

  return { allowed: true };
}

function cleanupOldEntries(windowMs) {
  const now = Date.now();
  for (const [key, attempts] of rateLimitStore.entries()) {
    const recentAttempts = attempts.filter((time) => now - time < windowMs);
    if (recentAttempts.length === 0) {
      rateLimitStore.delete(key);
    } else {
      rateLimitStore.set(key, recentAttempts);
    }
  }
}
