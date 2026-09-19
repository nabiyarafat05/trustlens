import { TrustLensAnalysis } from '../ai/types';

export interface SampleScenario {
  id: string;
  category: 'sms' | 'email' | 'url' | 'job' | 'support' | 'legitimate';
  title: string;
  badge: string;
  description: string;
  inputType: 'text' | 'url' | 'image';
  previewText: string;
  targetContent: string;
  expectedRisk: 'low' | 'medium' | 'high' | 'critical';
  precomputedAnalysis: TrustLensAnalysis;
}

export const SAMPLE_SCENARIOS: SampleScenario[] = [
  {
    id: 'bank-freeze-sms',
    category: 'sms',
    title: 'Bank Account Suspension SMS',
    badge: 'Urgent Smishing',
    description: 'Text claiming your debit card has been locked due to suspicious activity with a quick-action link.',
    inputType: 'text',
    previewText: 'WELLS FARGO ALERT: Your online access has been temporarily suspended due to 3 unauthorized login attempts...',
    targetContent: `[WELLS FARGO ALERT]: Your debit card and mobile banking access have been temporarily locked due to 3 unauthorized transactions detected from IP 185.220.101.4. 

To restore your access and prevent permanent account cancellation, verify your identity immediately within the next 30 minutes at:
https://wellsfargo-account-protect.top/restore?id=89231

Failure to verify will result in complete account freeze and referral to recovery services.`,
    expectedRisk: 'critical',
    precomputedAnalysis: {
      overallRisk: 'critical',
      confidence: 96,
      headline: 'Urgent Account Freeze Alert with Severe Deception Signals',
      summary: 'The message impersonates Wells Fargo using severe artificial urgency (30-minute deadline) and directs the recipient to an unverified top-level domain (.top) designed to harvest banking credentials.',
      contentType: 'text',
      detectedEntities: ['Wells Fargo Bank', 'Claimed Security Team'],
      riskSignals: [
        {
          id: 'sig_urgency_1',
          type: 'urgency',
          severity: 'high',
          title: 'Extreme Artificial Urgency (30-Minute Threat)',
          description: 'Demands action within a tight time frame under threat of permanent account lock.',
          evidence: '"verify your identity immediately within the next 30 minutes"',
          whyItMatters: 'Artificial urgency is engineered to provoke panic, bypassing critical thinking and independent verification.',
          confidence: 95,
        },
        {
          id: 'sig_impersonation_1',
          type: 'impersonation',
          severity: 'high',
          title: 'Financial Institution Brand Impersonation',
          description: 'Adopts the name of Wells Fargo to establish artificial authority.',
          evidence: '"[WELLS FARGO ALERT]: Your debit card and mobile banking access..."',
          whyItMatters: 'Financial institutions rarely notify account locks through external third-party links in SMS.',
          confidence: 92,
        },
        {
          id: 'sig_suspicious_link_1',
          type: 'suspicious_link',
          severity: 'high',
          title: 'Spoofed Domain on High-Abuse TLD (.top)',
          description: 'The URL does not belong to wellsfargo.com; it uses a hyphenated brand name on a suspicious TLD.',
          evidence: 'https://wellsfargo-account-protect.top/restore?id=89231',
          whyItMatters: 'Legitimate banks host security verification exclusively on their registered apex domain (wellsfargo.com), never on third-party .top domains.',
          confidence: 98,
        },
        {
          id: 'sig_coercion_1',
          type: 'coercion',
          severity: 'medium',
          title: 'Punitive Consequences Threatened',
          description: 'Warns of account closure and debt recovery if prompt compliance is not granted.',
          evidence: '"Failure to verify will result in complete account freeze and referral to recovery services."',
          whyItMatters: 'Intimidation tactics are standard social engineering levers to pressure compliance.',
          confidence: 88,
        },
      ],
      positiveSignals: [
        {
          title: 'Format Consistency',
          description: 'Mimics the typical capitalization style of automated transactional alerts.',
          importance: 'low',
        },
      ],
      requestsDetected: {
        payment: false,
        otp: false,
        password: true,
        personalInformation: true,
        identityDocument: false,
        bankInformation: true,
        urgentAction: true,
        remoteAccess: false,
      },
      links: [
        {
          url: 'https://wellsfargo-account-protect.top/restore?id=89231',
          domain: 'wellsfargo-account-protect.top',
          isSuspicious: true,
          suspiciousSignals: [
            'High-risk .top top-level domain',
            'Brand name "wellsfargo" embedded into unauthorized domain name',
            'Direct tokenized credential lure query parameter (?id=89231)',
          ],
          isShortener: false,
        },
      ],
      recommendedActions: [
        'Open your official Wells Fargo mobile app or visit wellsfargo.com directly in your browser.',
        'Check your account status and recent transactions inside the authenticated portal.',
        'Report this text by forwarding it to 7726 (SPAM) on your mobile network.',
        'Call the official customer service number printed on the physical back of your debit card.',
      ],
      avoidActions: [
        'Do NOT tap or open the link provided in the text message.',
        'Do NOT enter your online banking username, password, card PIN, or SSN on the destination page.',
        'Do NOT reply to the sender phone number.',
      ],
      verificationSteps: [
        {
          step: 'Check Debit Card / Account Status',
          channel: 'Official Bank App',
          details: 'Log into your mobile banking app independently. Legitimate alerts will be prominently displayed in your secure Message Center.',
        },
        {
          step: 'Call Official Card Services',
          channel: 'Physical Card Reverse Phone',
          details: 'Call the 1-800 number printed on the back of your card to inquire if any hold is in effect.',
        },
      ],
      uncertainty: [
        'The originating SMS sender gateway routing could not be traced without carrier metadata.',
        'Whether the recipient actually possesses an account at this institution cannot be verified.',
      ],
      disclaimer: 'TrustLens provides probabilistic analysis based on observable digital signals. This is not a legal or banking guarantee.',
      timestamp: new Date().toISOString(),
    },
  },
  {
    id: 'usps-delivery-smishing',
    category: 'sms',
    title: 'USPS Missed Parcel Notification',
    badge: 'Delivery Smishing',
    description: 'SMS claiming an incomplete address prevented parcel delivery, requesting an address update and redelivery fee.',
    inputType: 'text',
    previewText: 'U.S. Postal Service: Your package USPS-9400-1118-9956 could not be delivered due to an incorrect street number...',
    targetContent: `[U.S. Postal Service]: We were unable to deliver your package #USPS-9400-1118-9956-2910 today due to an incomplete street number on the shipping label.

Please confirm your correct delivery details and schedule redelivery:
https://usps-redelivery-portal.info/tracking/update

Note: A re-delivery surcharge of $1.85 applies. If unconfirmed within 24 hours, the parcel will be returned to sender.`,
    expectedRisk: 'high',
    precomputedAnalysis: {
      overallRisk: 'high',
      confidence: 94,
      headline: 'Package Delivery Scam with Micro-Fee and Address Harvesting',
      summary: 'The message impersonates the US Postal Service, utilizing an untrusted domain (.info) to harvest credit card details under the guise of a small $1.85 redelivery charge.',
      contentType: 'text',
      detectedEntities: ['United States Postal Service (USPS)'],
      riskSignals: [
        {
          id: 'sig_usps_1',
          type: 'impersonation',
          severity: 'high',
          title: 'Postal Service Impersonation',
          description: 'Uses USPS branding and simulated tracking number format.',
          evidence: '"[U.S. Postal Service]: We were unable to deliver your package..."',
          whyItMatters: 'USPS does not send text messages about unattended parcels unless a customer explicitly subscribed to SMS alerts for that tracking number.',
          confidence: 90,
        },
        {
          id: 'sig_usps_2',
          type: 'financial_pressure',
          severity: 'high',
          title: 'Micro-Fee Payment Lure ($1.85)',
          description: 'Requests a small fee to disguise payment credential collection.',
          evidence: '"Note: A re-delivery surcharge of $1.85 applies."',
          whyItMatters: 'Scammers frequently request tiny amounts ($1.00-$3.00) so victims lower their guard, allowing attackers to harvest full credit card numbers and CVVs.',
          confidence: 93,
        },
        {
          id: 'sig_usps_3',
          type: 'suspicious_link',
          severity: 'high',
          title: 'Non-Official Tracking Domain (.info)',
          description: 'Directs to usps-redelivery-portal.info instead of the official usps.com domain.',
          evidence: 'https://usps-redelivery-portal.info/tracking/update',
          whyItMatters: 'All authentic USPS tracking services reside strictly on usps.com.',
          confidence: 96,
        },
      ],
      positiveSignals: [
        {
          title: 'Realistic Tracking Number Format',
          description: 'Follows standard 22-digit USPS tracking number convention.',
          importance: 'low',
        },
      ],
      requestsDetected: {
        payment: true,
        otp: false,
        password: false,
        personalInformation: true,
        identityDocument: false,
        bankInformation: true,
        urgentAction: true,
        remoteAccess: false,
      },
      links: [
        {
          url: 'https://usps-redelivery-portal.info/tracking/update',
          domain: 'usps-redelivery-portal.info',
          isSuspicious: true,
          suspiciousSignals: [
            'Non-official domain (.info)',
            'Domain was not registered by the United States Postal Service',
            'Subdomain or path attempts to emulate legitimate tracking portal',
          ],
          isShortener: false,
        },
      ],
      recommendedActions: [
        'Visit the official website at usps.com and paste the tracking number directly into their search tool.',
        'Delete the text message without clicking the link.',
        'Forward the SMS to 7726 (SPAM) to alert your mobile carrier.',
      ],
      avoidActions: [
        'Never submit credit card or address information on external .info websites.',
        'Do not click the provided tracking link.',
      ],
      verificationSteps: [
        {
          step: 'Check Tracking on Official USPS.com',
          channel: 'Official USPS Website',
          details: 'Go to https://tools.usps.com/go/TrackConfirmAction_input and search the tracking number.',
        },
      ],
      uncertainty: [
        'Whether the recipient is genuinely expecting a package delivery is unknown.',
      ],
      disclaimer: 'TrustLens provides probabilistic analysis based on observable digital signals.',
      timestamp: new Date().toISOString(),
    },
  },
  {
    id: 'crypto-job-whatsapp',
    category: 'job',
    title: 'Remote Job Offer with Crypto Deposit',
    badge: 'Advance Fee Fraud',
    description: 'WhatsApp message offering $300-$500/day for reviewing apps, requiring an initial crypto wallet deposit to activate tasks.',
    inputType: 'text',
    previewText: 'Hi! I am recruiter Sarah from Global Marketing Ltd. We have immediate remote vacancies for Product Review Specialists...',
    targetContent: `Hi! I am recruiter Sarah from Global Marketing Ltd. We reviewed your profile and are thrilled to offer you a flexible remote position as a Digital Product Optimization Specialist!

Work hours: 1-2 hours daily
Salary: $350 - $650 per day (paid directly to your USDT / crypto wallet)

Requirements:
1. Smartphone with internet access
2. Age 21+
3. Initial task activation collateral: You must fund a temporary $50 USDT deposit to your workbench account to unlock commission multiplier bonuses.

Click here to start training with our Telegram supervisor: https://t.me/WorkBenchRecruit2024_bot`,
    expectedRisk: 'critical',
    precomputedAnalysis: {
      overallRisk: 'critical',
      confidence: 98,
      headline: 'Task Scam / Advance-Fee Employment Fraud',
      summary: 'Classic task optimization scam where the victim is promised unrealistically high wages for minimal work, but must first pay an upfront deposit in cryptocurrency to unlock tasks.',
      contentType: 'text',
      detectedEntities: ['Global Marketing Ltd (Claimed)', 'Telegram Recruitment Bot'],
      riskSignals: [
        {
          id: 'sig_job_1',
          type: 'financial_pressure',
          severity: 'high',
          title: 'Advance Fee Requirement ("Activation Collateral")',
          description: 'Demands that the job applicant deposit $50 USDT in cryptocurrency before beginning work.',
          evidence: '"You must fund a temporary $50 USDT deposit to your workbench account to unlock commission multiplier bonuses."',
          whyItMatters: 'Legitimate employers never require candidates to pay money or cryptocurrency to start a job.',
          confidence: 99,
        },
        {
          id: 'sig_job_2',
          type: 'generic',
          severity: 'high',
          title: 'Unrealistic Compensation vs. Effort',
          description: 'Promises $350-$650/day for 1-2 hours of simple app reviewing.',
          evidence: '"Work hours: 1-2 hours daily / Salary: $350 - $650 per day"',
          whyItMatters: 'Extravagant compensation for non-skilled tasks is a hallmark lure of international task scams.',
          confidence: 95,
        },
        {
          id: 'sig_job_3',
          type: 'technical_anomaly',
          severity: 'medium',
          title: 'Communication Routed to Anonymous Messaging App',
          description: 'Redirects candidate from SMS/WhatsApp directly to a Telegram bot.',
          evidence: 'https://t.me/WorkBenchRecruit2024_bot',
          whyItMatters: 'Scammers migrate victims to Telegram to avoid carrier filtering and preserve anonymity.',
          confidence: 90,
        },
      ],
      positiveSignals: [
        {
          title: 'Polite Professional Tone',
          description: 'Uses polite recruitment phrasing and clear layout.',
          importance: 'low',
        },
      ],
      requestsDetected: {
        payment: true,
        otp: false,
        password: false,
        personalInformation: true,
        identityDocument: false,
        bankInformation: false,
        urgentAction: false,
        remoteAccess: false,
      },
      links: [
        {
          url: 'https://t.me/WorkBenchRecruit2024_bot',
          domain: 't.me',
          isSuspicious: true,
          suspiciousSignals: ['Anonymous Telegram bot recruitment pipeline'],
          isShortener: false,
        },
      ],
      recommendedActions: [
        'Block the sender immediately on WhatsApp or SMS.',
        'Report the conversation as spam/scam within the messaging app.',
        'Never send cryptocurrency to any entity promising employment or task rewards.',
      ],
      avoidActions: [
        'Do not send any USDT or cryptocurrency to the provided addresses.',
        'Do not share personal identity details or banking accounts.',
      ],
      verificationSteps: [
        {
          step: 'Search Registered Entity',
          channel: 'Official Corporate Registry',
          details: 'Search whether "Global Marketing Ltd" has an official corporate presence, verified physical headquarters, and verifiable HR staff on LinkedIn.',
        },
      ],
      uncertainty: [
        'The true geographical location and identity of the recruiter cannot be ascertained.',
      ],
      disclaimer: 'TrustLens provides probabilistic analysis based on observable digital signals.',
      timestamp: new Date().toISOString(),
    },
  },
  {
    id: 'paypal-geek-squad-invoice',
    category: 'email',
    title: 'PayPal Fake Antivirus Invoice ($649)',
    badge: 'Refund Trap',
    description: 'Email receipt claiming an automated $649 subscription renewal for computer protection, listing a toll-free cancellation number.',
    inputType: 'text',
    previewText: 'PayPal Billing Service: Thank you for your order. Your annual subscription for Ultra Defense Pro ($649.99) has been processed...',
    targetContent: `PayPal Billing Service
Invoice No: INV-2024-899124
Date: September 19, 2024

Dear Customer,

Thank you for your order with Geek Security Solutions! Your annual subscription for "Ultra Defense 360 & Firewall Protection" has been successfully auto-renewed.

Transaction Summary:
- Item: Ultra Defense 360 (5 Devices)
- Total Amount Charged: $649.99 USD
- Payment Method: Auto-Debit from Linked Checking Account
- Status: Completed

If you did not authorize this charge or wish to cancel and request an immediate full refund, please call our 24/7 Dispute Helpdesk immediately at:
+1 (888) 492-0192

Note: Disputing this charge through your bank without calling our helpdesk may delay your refund by up to 30 days.`,
    expectedRisk: 'high',
    precomputedAnalysis: {
      overallRisk: 'high',
      confidence: 93,
      headline: 'Refund Scam / Fake Invoice with Call-Back Trap',
      summary: 'The message presents a fabricated high-value invoice ($649.99) to frighten the victim into calling a fraudulent call center that will attempt remote computer takeover under the pretext of issuing a refund.',
      contentType: 'text',
      detectedEntities: ['PayPal (Claimed)', 'Geek Security Solutions (Impersonated)'],
      riskSignals: [
        {
          id: 'sig_inv_1',
          type: 'financial_pressure',
          severity: 'high',
          title: 'Phantom High-Value Charge ($649.99)',
          description: 'Claims that a large sum has already been debited from your checking account.',
          evidence: '"Total Amount Charged: $649.99 USD / Status: Completed"',
          whyItMatters: 'Fabricated charges provoke anxiety, driving victims to act quickly to recover their money.',
          confidence: 94,
        },
        {
          id: 'sig_inv_2',
          type: 'credential_harvesting',
          severity: 'high',
          title: 'Toll-Free Call-Center Lure',
          description: 'Directs the user to call a specific phone number for cancellations rather than using official portal buttons.',
          evidence: '"please call our 24/7 Dispute Helpdesk immediately at: +1 (888) 492-0192"',
          whyItMatters: 'Call-back phishing (BazaarCall) lures victims onto the phone where scammers guide them to install remote access tools (AnyDesk, TeamViewer) to drain bank accounts.',
          confidence: 96,
        },
        {
          id: 'sig_inv_3',
          type: 'coercion',
          severity: 'medium',
          title: 'Dissuasion from Contacting Bank Directly',
          description: 'Discourages the victim from contacting their own financial institution.',
          evidence: '"Note: Disputing this charge through your bank without calling our helpdesk may delay your refund..."',
          whyItMatters: 'Scammers actively discourage legitimate bank dispute processes to prevent their scheme from being uncovered.',
          confidence: 89,
        },
      ],
      positiveSignals: [
        {
          title: 'Formatted Receipt Appearance',
          description: 'Includes invoice number and line-item formatting.',
          importance: 'low',
        },
      ],
      requestsDetected: {
        payment: false,
        otp: false,
        password: false,
        personalInformation: false,
        identityDocument: false,
        bankInformation: false,
        urgentAction: true,
        remoteAccess: true,
      },
      links: [],
      recommendedActions: [
        'Log in to your genuine PayPal account at paypal.com to inspect your official Activity feed.',
        'Check your bank account online to see if any such charge actually occurred.',
        'Forward the suspicious email to spoof@paypal.com.',
      ],
      avoidActions: [
        'Do NOT call the phone number (+1-888-492-0192) listed in the message.',
        'Do NOT grant anyone remote desktop access (AnyDesk, UltraViewer, TeamViewer) to your computer.',
        'Do NOT buy gift cards or transfer cryptocurrency to "reverse" a payment.',
      ],
      verificationSteps: [
        {
          step: 'Inspect PayPal Activity Log',
          channel: 'Official PayPal App / Website',
          details: 'Navigate to paypal.com > Activity. If no corresponding $649 transaction exists, the email is an external fabrication.',
        },
      ],
      uncertainty: [
        'Header authentication (DKIM, SPF, DMARC) cannot be verified without raw MIME email headers.',
      ],
      disclaimer: 'TrustLens provides probabilistic analysis based on observable digital signals.',
      timestamp: new Date().toISOString(),
    },
  },
  {
    id: 'github-security-alert',
    category: 'legitimate',
    title: 'GitHub Security Login Alert (Legitimate)',
    badge: 'Legitimate Notice',
    description: 'Standard security notification from GitHub confirming a new login from Chrome on Windows.',
    inputType: 'text',
    previewText: 'GitHub [notifications@github.com]: We noticed a new sign-in to your GitHub account from Chrome on Windows...',
    targetContent: `From: GitHub <notifications@github.com>
Subject: [GitHub] A new sign-in to your account

Hi devuser,

We noticed a new sign-in to your GitHub account from Google Chrome on Windows in Chicago, IL, United States.

Sign-in details:
Device: Chrome on Windows
IP Address: 198.51.100.24
Date & Time: September 19, 2024 at 12:44 UTC

If this was you, you don't need to do anything.

If you don't recognize this activity, please review your active sessions and change your password in your account settings:
https://github.com/settings/sessions`,
    expectedRisk: 'low',
    precomputedAnalysis: {
      overallRisk: 'low',
      confidence: 95,
      headline: 'Standard Security Notification with Legitimate Domain',
      summary: 'This communication exhibits standard markers of an authentic transactional security alert. It directs users to the official github.com domain and contains no artificial urgency or payment demands.',
      contentType: 'text',
      detectedEntities: ['GitHub (Authentic Context)'],
      riskSignals: [],
      positiveSignals: [
        {
          title: 'Official Domain Navigation',
          description: 'The provided link leads directly to github.com/settings/sessions with no subdomain anomalies.',
          importance: 'high',
        },
        {
          title: 'Absence of Artificial Urgency',
          description: 'Explicitly reassures the recipient ("If this was you, you don\'t need to do anything").',
          importance: 'high',
        },
        {
          title: 'No Credential or Payment Requests',
          description: 'Does not ask for passwords, OTPs, or payment information within the message.',
          importance: 'high',
        },
        {
          title: 'Contextual Session Data Included',
          description: 'Provides specific technical details (IP, browser, approximate location, timestamp).',
          importance: 'medium',
        },
      ],
      requestsDetected: {
        payment: false,
        otp: false,
        password: false,
        personalInformation: false,
        identityDocument: false,
        bankInformation: false,
        urgentAction: false,
        remoteAccess: false,
      },
      links: [
        {
          url: 'https://github.com/settings/sessions',
          domain: 'github.com',
          isSuspicious: false,
          suspiciousSignals: [],
          isShortener: false,
        },
      ],
      recommendedActions: [
        'If you recently signed in from this browser and location, no action is necessary.',
        'If you did not initiate this sign-in, navigate directly to github.com and review your active sessions.',
      ],
      avoidActions: [
        'No emergency actions needed.',
      ],
      verificationSteps: [
        {
          step: 'Confirm Your Recent Activity',
          channel: 'GitHub Settings',
          details: 'Visit https://github.com/settings/sessions to confirm your current IP and active devices.',
        },
      ],
      uncertainty: [
        'Email transmission headers (SPF/DKIM/DMARC) should still be confirmed within your email client.',
      ],
      disclaimer: 'TrustLens provides probabilistic analysis based on observable digital signals.',
      timestamp: new Date().toISOString(),
    },
  },
  {
    id: 'suspicious-typo-url',
    category: 'url',
    title: 'Suspicious Typosquatting Bank URL',
    badge: 'Phishing Domain',
    description: 'Analysis of a fraudulent domain mimicking Chase Bank with hyphenation and an unusual TLD.',
    inputType: 'url',
    previewText: 'http://chase-security-verify-client.top/auth/login.php',
    targetContent: 'http://chase-security-verify-client.top/auth/login.php',
    expectedRisk: 'critical',
    precomputedAnalysis: {
      overallRisk: 'critical',
      confidence: 97,
      headline: 'Severe Typosquatting and Insecure Protocol Detected',
      summary: 'The target destination utilizes unencrypted HTTP and embeds the "chase" trademark into an unauthorized .top domain, a pattern overwhelmingly correlated with credential harvesting.',
      contentType: 'url',
      detectedEntities: ['Chase Bank (Impersonated Domain)'],
      riskSignals: [
        {
          id: 'sig_url_1',
          type: 'suspicious_link',
          severity: 'high',
          title: 'Brand Impersonation in Domain Name',
          description: 'The domain embeds "chase" into an unverified host name.',
          evidence: 'chase-security-verify-client.top',
          whyItMatters: 'Attackers register domain names containing authentic brand names to trick users who look only at the first word of a URL.',
          confidence: 98,
        },
        {
          id: 'sig_url_2',
          type: 'technical_anomaly',
          severity: 'high',
          title: 'Insecure HTTP Protocol for Authentication Path',
          description: 'Uses unencrypted HTTP for a path named "/auth/login.php".',
          evidence: 'http:// (non-SSL)',
          whyItMatters: 'Legitimate financial institutions NEVER permit unencrypted HTTP communication, particularly on login pages.',
          confidence: 99,
        },
        {
          id: 'sig_url_3',
          type: 'suspicious_link',
          severity: 'high',
          title: 'High-Abuse Top Level Domain (.top)',
          description: 'The .top registry is heavily abused for short-lived disposable phishing attacks.',
          evidence: '.top TLD',
          whyItMatters: 'Disposable top-level domains are favored by malicious actors due to cheap, unregulated registration.',
          confidence: 91,
        },
      ],
      positiveSignals: [],
      requestsDetected: {
        payment: false,
        otp: true,
        password: true,
        personalInformation: true,
        identityDocument: false,
        bankInformation: true,
        urgentAction: false,
        remoteAccess: false,
      },
      links: [
        {
          url: 'http://chase-security-verify-client.top/auth/login.php',
          domain: 'chase-security-verify-client.top',
          isSuspicious: true,
          suspiciousSignals: [
            'Unencrypted HTTP protocol',
            'Unauthorized brand trademark "chase" in hostname',
            'High-risk .top registry',
            'Direct login endpoint path /auth/login.php',
          ],
          isShortener: false,
        },
      ],
      recommendedActions: [
        'Close this browser tab immediately.',
        'Navigate strictly to chase.com if you intended to access your banking portal.',
        'Clear browser cookies if you loaded the destination page.',
      ],
      avoidActions: [
        'Do NOT enter your Chase username, password, or security questions on this site.',
        'Do NOT download any security certificates or files suggested by this domain.',
      ],
      verificationSteps: [
        {
          step: 'Verify Official Domain SSL',
          channel: 'Direct Navigation',
          details: 'Ensure the address bar shows https://www.chase.com with an authentic issued certificate.',
        },
      ],
      uncertainty: [
        'Specific hosting IP geolocation may change dynamically through Fast-Flux DNS.',
      ],
      disclaimer: 'TrustLens provides probabilistic analysis based on observable digital signals.',
      timestamp: new Date().toISOString(),
    },
  },
];
