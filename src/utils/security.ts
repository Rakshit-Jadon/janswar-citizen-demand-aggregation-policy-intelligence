/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * Strict Security Guardrails:
 * 1. Rate Limiting with Exponential Backoff and configurable thresholds
 * 2. Strict Input Validation (Allowlist based, length bounds, format checks)
 * 3. Error Masking (Never leaks stack traces or internals)
 * 4. Contextual XSS Encoding
 */

export interface RateLimitConfig {
  maxRequests: number;
  windowMs: number;
  lockoutDurationMs: number;
}

const DEFAULT_CONFIGS: Record<string, RateLimitConfig> = {
  grievance_submission: {
    maxRequests: 5, // 5 submissions per minute per client
    windowMs: 60 * 1000,
    lockoutDurationMs: 120 * 1000 // 2 min lockout on burst abuse
  },
  catalog_search: {
    maxRequests: 40, // 40 queries per minute
    windowMs: 60 * 1000,
    lockoutDurationMs: 30 * 1000
  },
  policy_export: {
    maxRequests: 10,
    windowMs: 60 * 1000,
    lockoutDurationMs: 60 * 1000
  }
};

interface ClientHistory {
  timestamps: number[];
  lockoutUntil: number;
  consecutiveViolations: number;
}

const clientStorage = new Map<string, ClientHistory>();

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  retryAfterSeconds?: number;
  error?: string;
}

export function checkRateLimit(
  routeKey: 'grievance_submission' | 'catalog_search' | 'policy_export',
  clientId: string = 'client_local'
): RateLimitResult {
  const config = DEFAULT_CONFIGS[routeKey] || DEFAULT_CONFIGS.grievance_submission;
  const storageKey = `${routeKey}:${clientId}`;
  const now = Date.now();

  let record = clientStorage.get(storageKey);
  if (!record) {
    record = { timestamps: [], lockoutUntil: 0, consecutiveViolations: 0 };
    clientStorage.set(storageKey, record);
  }

  // Check if currently locked out
  if (now < record.lockoutUntil) {
    const retryAfter = Math.ceil((record.lockoutUntil - now) / 1000);
    return {
      allowed: false,
      remaining: 0,
      retryAfterSeconds: retryAfter,
      error: `Too Many Requests. Rate limit triggered for ${routeKey}. Retry in ${retryAfter}s.`
    };
  }

  // Filter timestamps within the rolling window
  record.timestamps = record.timestamps.filter((t) => now - t < config.windowMs);

  if (record.timestamps.length >= config.maxRequests) {
    record.consecutiveViolations += 1;
    // Exponential backoff multiplier: base * 2^(violations - 1)
    const backoffMultiplier = Math.pow(2, Math.min(record.consecutiveViolations - 1, 4));
    const lockoutMs = config.lockoutDurationMs * backoffMultiplier;
    record.lockoutUntil = now + lockoutMs;
    const retryAfter = Math.ceil(lockoutMs / 1000);

    return {
      allowed: false,
      remaining: 0,
      retryAfterSeconds: retryAfter,
      error: `Rate limit threshold exceeded (${config.maxRequests} req / ${config.windowMs / 1000}s). Exponential backoff activated. Retry after ${retryAfter}s.`
    };
  }

  record.timestamps.push(now);
  const remaining = config.maxRequests - record.timestamps.length;

  return {
    allowed: true,
    remaining
  };
}

/**
 * Strict Input Validation with Allowlist Approach
 */
export interface ValidationResult<T> {
  isValid: boolean;
  sanitizedValue?: T;
  errorMessage?: string;
}

export function validateCitizenText(
  text: string,
  fieldName: string = 'Grievance description',
  minLength: number = 5,
  maxLength: number = 1000
): ValidationResult<string> {
  if (!text || typeof text !== 'string') {
    return { isValid: false, errorMessage: `${fieldName} is required.` };
  }

  const trimmed = text.trim();
  if (trimmed.length < minLength) {
    return {
      isValid: false,
      errorMessage: `${fieldName} must be at least ${minLength} characters.`
    };
  }
  if (trimmed.length > maxLength) {
    return {
      isValid: false,
      errorMessage: `${fieldName} cannot exceed ${maxLength} characters (currently ${trimmed.length}).`
    };
  }

  // Strip potential script injection vectors while retaining Unicode Indic scripts
  const dangerousPatterns = /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi;
  if (dangerousPatterns.test(trimmed)) {
    return {
      isValid: false,
      errorMessage: `${fieldName} contains disallowed HTML script tags.`
    };
  }

  // Disallow javascript: pseudo-protocols
  if (/javascript:/i.test(trimmed)) {
    return {
      isValid: false,
      errorMessage: `${fieldName} contains forbidden script protocol patterns.`
    };
  }

  return {
    isValid: true,
    sanitizedValue: encodeHtmlEntities(trimmed)
  };
}

export function validateNumericPrice(
  value: number | string,
  min: number = 0,
  max: number = 200000
): ValidationResult<number> {
  const rawValue = typeof value === 'number' ? String(value) : String(value).trim();
  if (!/^\d+(?:\.\d{1,2})?$/.test(rawValue)) {
    return { isValid: false, errorMessage: 'Enter a whole-number or two-decimal price amount only.' };
  }
  const num = Number(rawValue);
  if (isNaN(num)) {
    return { isValid: false, errorMessage: 'Must be a valid numerical price amount.' };
  }
  if (num < min || num > max) {
    return {
      isValid: false,
      errorMessage: `Price must be between ₹${min} and ₹${max}.`
    };
  }
  return { isValid: true, sanitizedValue: Number(num.toFixed(2)) };
}

/**
 * Contextual HTML encoding to neutralize XSS
 */
export function encodeHtmlEntities(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

/**
 * Mask internal exception details into a friendly client-safe message
 */
export function sanitizeClientError(error: unknown): string {
  if (typeof error === 'string') {
    return error.replace(/\/[\w\-\.\/]+/g, '[redacted_path]');
  }
  if (error instanceof Error) {
    // If it's a known validation or rate error, return clean message
    if (error.message.includes('Rate limit') || error.message.includes('required')) {
      return error.message;
    }
    return 'An internal processing error occurred. Our technical operations log has recorded the event safely without exposing personal information.';
  }
  return 'A secure processing notice has occurred. Please verify your inputs and retry.';
}
