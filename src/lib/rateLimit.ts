// Server-side in-memory login rate limiter & account lockout protection
interface RateLimitRecord {
  attempts: number;
  lockoutUntil: number;
  lastAttempt: number;
}

const loginAttempts = new Map<string, RateLimitRecord>();

export function checkLoginRateLimit(key: string): {
  allowed: boolean;
  waitMinutes?: number;
  attemptsRemaining?: number;
} {
  const now = Date.now();
  const record = loginAttempts.get(key);

  if (!record) {
    return { allowed: true, attemptsRemaining: 5 };
  }

  // Check if currently locked out
  if (record.lockoutUntil > now) {
    const waitMinutes = Math.ceil((record.lockoutUntil - now) / 60000);
    return { allowed: false, waitMinutes };
  }

  // Reset if last attempt was more than 30 minutes ago
  if (now - record.lastAttempt > 30 * 60 * 1000) {
    loginAttempts.delete(key);
    return { allowed: true, attemptsRemaining: 5 };
  }

  const remaining = Math.max(0, 5 - record.attempts);
  return { allowed: true, attemptsRemaining: remaining };
}

export function recordFailedLogin(key: string): {
  locked: boolean;
  waitMinutes?: number;
  attemptsRemaining: number;
} {
  const now = Date.now();
  const record = loginAttempts.get(key) || {
    attempts: 0,
    lockoutUntil: 0,
    lastAttempt: now,
  };

  record.attempts += 1;
  record.lastAttempt = now;

  if (record.attempts >= 5) {
    record.lockoutUntil = now + 15 * 60 * 1000; // 15-minute lockout
    loginAttempts.set(key, record);
    return { locked: true, waitMinutes: 15, attemptsRemaining: 0 };
  }

  loginAttempts.set(key, record);
  return {
    locked: false,
    attemptsRemaining: Math.max(0, 5 - record.attempts),
  };
}

export function resetLoginAttempts(key: string) {
  loginAttempts.delete(key);
}
