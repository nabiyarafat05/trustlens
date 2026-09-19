export interface RedactionResult {
  redactedText: string;
  redactedItemsCount: number;
  typesFound: string[];
}

export function redactSensitiveData(text: string): RedactionResult {
  let redacted = text;
  let count = 0;
  const typesFound = new Set<string>();

  // 1. Credit card numbers (13-19 digits, with spaces or hyphens)
  const ccRegex = /\b(?:\d{4}[ -]?){3}\d{4}\b|\b\d{15,16}\b/g;
  redacted = redacted.replace(ccRegex, () => {
    count++;
    typesFound.add('Credit Card Number');
    return '[REDACTED_CARD]';
  });

  // 2. Social Security Numbers (SSN: XXX-XX-XXXX)
  const ssnRegex = /\b\d{3}-\d{2}-\d{4}\b/g;
  redacted = redacted.replace(ssnRegex, () => {
    count++;
    typesFound.add('Government ID / SSN');
    return '[REDACTED_SSN]';
  });

  // 3. Email addresses
  const emailRegex = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,7}\b/g;
  redacted = redacted.replace(emailRegex, () => {
    count++;
    typesFound.add('Email Address');
    return '[REDACTED_EMAIL]';
  });

  // 4. Phone numbers (e.g. +1 (555) 123-4567, 555-123-4567)
  const phoneRegex = /(?:\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}\b/g;
  redacted = redacted.replace(phoneRegex, (match) => {
    // Avoid redacting common 4-digit years like 2024
    if (match.length < 7) return match;
    count++;
    typesFound.add('Phone Number');
    return '[REDACTED_PHONE]';
  });

  return {
    redactedText: redacted,
    redactedItemsCount: count,
    typesFound: Array.from(typesFound),
  };
}
