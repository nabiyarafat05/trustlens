export interface UrlInspectionResult {
  url: string;
  domain: string;
  protocol: string;
  isSuspicious: boolean;
  isShortener: boolean;
  suspiciousSignals: string[];
  riskScore: number; // 0-100
  details: {
    hasPunycode: boolean;
    hasIpHost: boolean;
    isHttpOnly: boolean;
    suspiciousTld: boolean;
    subdomainCount: number;
    hasAtSymbol: boolean;
    matchedBrandKeywords: string[];
  };
}

const SUSPICIOUS_TLDS = new Set([
  'top', 'xyz', 'click', 'link', 'country', 'stream', 'gdn', 'mom', 'loan', 'win',
  'club', 'work', 'date', 'racing', 'download', 'review', 'accountant', 'science',
  'party', 'trade', 'bid', 'webcam', 'cricket', 'faith', 'zip', 'mov'
]);

const KNOWN_SHORTENERS = new Set([
  'bit.ly', 'tinyurl.com', 't.co', 'goo.gl', 'ow.ly', 'is.gd', 'buff.ly',
  'adf.ly', 'bit.do', 'cutt.ly', 'rb.gy', 'shorte.st', 'trib.al'
]);

const HIGH_PROFILE_BRANDS = [
  'paypal', 'apple', 'chase', 'wellsfargo', 'bankofamerica', 'citibank',
  'amazon', 'netflix', 'microsoft', 'google', 'facebook', 'instagram',
  'usps', 'fedex', 'dhl', 'ups', 'irs', 'gov', 'whatsapp', 'binance',
  'coinbase', 'metamask', 'ledger', 'trezor'
];

export function inspectUrl(rawUrl: string): UrlInspectionResult {
  let urlStr = rawUrl.trim();
  if (!/^https?:\/\//i.test(urlStr)) {
    urlStr = 'https://' + urlStr;
  }

  const signals: string[] = [];
  let riskScore = 0;

  let parsed: URL;
  try {
    parsed = new URL(urlStr);
  } catch {
    return {
      url: rawUrl,
      domain: 'invalid-domain',
      protocol: 'unknown',
      isSuspicious: true,
      isShortener: false,
      suspiciousSignals: ['Malformed or invalid URL syntax'],
      riskScore: 60,
      details: {
        hasPunycode: false,
        hasIpHost: false,
        isHttpOnly: false,
        suspiciousTld: false,
        subdomainCount: 0,
        hasAtSymbol: false,
        matchedBrandKeywords: [],
      },
    };
  }

  const hostname = parsed.hostname.toLowerCase();
  const isHttpOnly = parsed.protocol === 'http:';
  const hasAtSymbol = parsed.username !== '' || rawUrl.includes('@');
  const hasPunycode = hostname.startsWith('xn--') || hostname.includes('.xn--');
  const hasIpHost = /^(\d{1,3}\.){3}\d{1,3}$/.test(hostname) || hostname.startsWith('[') || hostname.endsWith(']');
  
  const hostParts = hostname.split('.');
  const tld = hostParts.length > 1 ? hostParts[hostParts.length - 1] : '';
  const suspiciousTld = SUSPICIOUS_TLDS.has(tld);
  const isShortener = KNOWN_SHORTENERS.has(hostname);
  const subdomainCount = Math.max(0, hostParts.length - 2);

  const matchedBrandKeywords: string[] = [];
  for (const brand of HIGH_PROFILE_BRANDS) {
    if (hostname.includes(brand)) {
      matchedBrandKeywords.push(brand);
    }
  }

  // 1. IP address in place of domain
  if (hasIpHost) {
    signals.push('Host is a bare IP address rather than an established domain name');
    riskScore += 40;
  }

  // 2. Punycode / IDN homograph attack
  if (hasPunycode) {
    signals.push('Internationalized domain name (Punycode xn--) detected; often used for visual spoofing');
    riskScore += 45;
  }

  // 3. User info / @ trick in URL
  if (hasAtSymbol) {
    signals.push('URL contains an "@" symbol; browsers may disregard the prefix to direct you to an unexpected host');
    riskScore += 50;
  }

  // 4. Insecure HTTP
  if (isHttpOnly) {
    signals.push('Connection uses unencrypted HTTP instead of modern HTTPS');
    riskScore += 20;
  }

  // 5. Suspicious TLD
  if (suspiciousTld) {
    signals.push(`Domain utilizes a high-abuse top-level domain (.${tld})`);
    riskScore += 25;
  }

  // 6. Excessive subdomains (subdomain stacking)
  if (subdomainCount >= 3) {
    signals.push(`Excessive subdomains (${subdomainCount}) detected; commonly used to impersonate brands`);
    riskScore += 25;
  }

  // 7. Brand keyword in untrusted domain (e.g. chase.com-security-verify.top)
  if (matchedBrandKeywords.length > 0) {
    const isAuthentic = matchedBrandKeywords.some(brand => {
      return hostname === `${brand}.com` || hostname.endsWith(`.${brand}.com`);
    });

    if (!isAuthentic) {
      signals.push(
        `Brand name (${matchedBrandKeywords.join(', ')}) appears in an unverified or secondary domain structure`
      );
      riskScore += 45;
    }
  }

  // 8. URL Shortener
  if (isShortener) {
    signals.push('URL is shortened, hiding the true destination until clicked');
    riskScore += 15;
  }

  const finalRiskScore = Math.min(100, riskScore);

  return {
    url: urlStr,
    domain: hostname,
    protocol: parsed.protocol,
    isSuspicious: finalRiskScore >= 35,
    isShortener,
    suspiciousSignals: signals,
    riskScore: finalRiskScore,
    details: {
      hasPunycode,
      hasIpHost,
      isHttpOnly,
      suspiciousTld,
      subdomainCount,
      hasAtSymbol,
      matchedBrandKeywords,
    },
  };
}
