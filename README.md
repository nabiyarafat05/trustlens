<div align="center">

# 🔍 TrustLens

**Pause. Scan. Know.**

An evidence-first multimodal AI safety assistant that helps users analyze suspicious digital content before they act.

</div>

---

## 🚨 Problem

Scam messages, phishing links, and fake documents are easy to make and hard to judge quickly. People often have to decide whether to click, reply, or pay with no reliable way to check first.

## 💡 Solution

TrustLens looks at suspicious content and reports **what is observable**, separating evidence from unverified claims and stating its uncertainty. It doesn't just return a verdict. It also suggests safer next steps and actions to avoid.

## ✨ Features

- 🧾 Analyze **text/messages**, **URLs**, **screenshots/images**, and **supported documents**
- ⚠️ **Risk signals** and ✅ **positive signals**
- 🔎 **Observable evidence** vs. **unverified claims**
- ❓ Explicit **uncertainty** reporting
- 🛡️ **Safer next steps** and **actions to avoid**
- 🤖 **AI analysis** via Google Gemini or OpenAI-compatible providers
- 🧠 **Built-in heuristic fallback** when no API key is configured
- 📊 Evidence-based result dashboard
- 🕘 Local browser history
- 📚 Tactics Library of common scam techniques

## ⚙️ How It Works

```
User Input
    ↓
AI + Heuristic Analysis
    ↓
Structured Result
    ↓
Evidence & Risk Signals
    ↓
Safer Next Steps
```

## 🧰 Tech Stack

- **Next.js 15** (API routes)
- **React 19**
- **TypeScript**
- **Tailwind CSS**
- **ESLint**
- **Google Gemini** and **OpenAI-compatible providers** (configurable via `AI_BASE_URL`)

## 🚀 Getting Started

**Prerequisites:** Node.js 18.18+ and npm

```bash
git clone https://github.com/nabiyarafat05/trustlens.git
cd trustlens
npm install
cp .env.example .env.local
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

**Environment variables** (all optional):

| Variable | Purpose |
|---|---|
| `GEMINI_API_KEY` | Google Gemini (multimodal analysis) |
| `OPENAI_API_KEY` | OpenAI or an OpenAI-compatible provider |
| `AI_BASE_URL` | Provider endpoint (default: OpenAI) |
| `AI_MODEL` | Model name (default: `gpt-4o`) |

> Without an API key, TrustLens falls back to its built-in heuristic analysis.
> 🔒 Never commit real keys. `.env.local` should stay in `.gitignore`.

Other scripts: `npm run build` · `npm start` · `npm run lint`

## 📁 Project Structure

```
trustlens/
├── app/            # Pages and API routes
├── components/     # UI components
├── lib/            # Analysis logic
├── .env.example    # Environment variable template
└── package.json
```

## ⚠️ Limitations

- Analysis quality depends on the AI provider and on the content submitted.
- Without an API key, only heuristic analysis is available, which is less flexible than AI analysis.
- Some input types may have limited support.
- Results are based on observable signals and cannot confirm whether content is genuinely safe or malicious.
- History is stored locally in the browser only.

## 🔭 Future Improvements

- Broader document and file-type support
- Multi-language analysis
- Exportable analysis reports
- Automated tests

## 🏆 Hackathon

Built for **Hack Devengers 2.0**.

## 📌 Disclaimer

TrustLens is a **safety-assistance tool**, not a definitive scam detector. Its output is informational and may be incomplete or wrong. Always verify through official channels before sharing personal information, clicking links, or sending money.

---

<div align="center">

**TrustLens — Pause. Scan. Know.**

</div>