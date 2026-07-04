# AI Company Research Assistant
https://github.com/bimla667/fifa/blob/main/Screenshot%202026-07-04%20160739.png
A production-quality AI-powered company research tool. Enter a company name or website URL and get an instant structured report including summary, products, services, pain points, and competitors — with auto PDF generation and Discord delivery.

## Features

- **Chat interface** — ChatGPT-like UI with real-time progress timeline
- **Dual input** — search by company name (via Serper) or direct URL
- **Web crawler** — automatically crawls homepage, /about, /products, /services, /contact, /pricing
- **AI analysis** — OpenRouter with model selector (GPT-4o, Claude, Gemini, Llama, Mistral)
- **PDF export** — Professional PDF generated with pdf-lib
- **Discord integration** — Auto-uploads PDF to your Discord channel

---
<img src="Screenshot%202026-07-04%20160739.png" width="700" alt="Dashboard">
<img src="Screenshot%202026-07-04%20160739.png" width="700" alt="Dashboard">
<img src="Screenshot%202026-07-04%20160739.png" width="700" alt="Dashboard">
## Stack

| Layer     | Tech                          |
|-----------|-------------------------------|
| Frontend  | React 18 + Vite + Tailwind CSS |
| Backend   | Node.js + Express 4           |
| Crawling  | Cheerio + Axios               |
| Search    | Serper.dev API                |
| AI        | OpenRouter API                |
| PDF       | pdf-lib                       |
| Discord   | Discord Bot API v10           |

---

## Quick Start

### 1. Clone & install

```bash
git clone <your-repo>
cd ai-research-assistant

# Backend
cd backend
npm install
cp .env.example .env     # Fill in your keys
npm run dev              # Runs on http://localhost:5000

# Frontend (new terminal)
cd ../frontend
npm install
npm run dev              # Runs on http://localhost:5173
```

### 2. Environment variables

Create `backend/.env`:

```env
PORT=5000
SERPER_API_KEY=your_serper_api_key
OPENROUTER_API_KEY=your_openrouter_api_key
FRONTEND_URL=http://localhost:5173
```

Get your keys:
- **Serper**: https://serper.dev — free tier available
- **OpenRouter**: https://openrouter.ai — pay-per-use, free credits on signup

---

## API Reference

### `POST /research`
Run company research.
```json
{ "companyName": "Stripe", "model": "openai/gpt-4o-mini" }
// or
{ "websiteUrl": "https://stripe.com", "model": "openai/gpt-4o-mini" }
```

### `POST /generate-pdf`
Generate PDF from research data.
```json
{ "research": { ...researchObject } }
```
Returns `{ pdf: "<base64 string>" }`

### `POST /discord/send`
Send research PDF to Discord channel.
```json
{
  "botToken": "Bot token",
  "channelId": "12345",
  "applicantName": "Jane Doe",
  "applicantEmail": "jane@example.com",
  "company": "Stripe",
  "website": "https://stripe.com",
  "pdfBase64": "<base64 pdf>"
}
```

### `GET /health`
Returns `{ status: "ok", timestamp: "..." }`

---

## Deploy to Render

### Backend

1. Create a new **Web Service** on Render
2. Connect your GitHub repo
3. Set **Root Directory** to `backend`
4. Build command: `npm install`
5. Start command: `node server.js`
6. Add environment variables in Render dashboard:
   - `SERPER_API_KEY`
   - `OPENROUTER_API_KEY`
   - `FRONTEND_URL` → your Render frontend URL

### Frontend

1. Create a new **Static Site** on Render
2. Connect your GitHub repo
3. Set **Root Directory** to `frontend`
4. Build command: `npm install && npm run build`
5. Publish directory: `dist`
6. Add environment variable:
   - `VITE_API_URL` → your Render backend URL (e.g. `https://your-api.onrender.com`)

---

## Project Structure

```
ai-research-assistant/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Sidebar.jsx
│   │   │   ├── ChatInput.jsx
│   │   │   ├── ResearchCard.jsx
│   │   │   ├── ProgressTimeline.jsx
│   │   │   ├── ModelSelector.jsx
│   │   │   └── TypingIndicator.jsx
│   │   ├── hooks/
│   │   │   └── useResearch.js
│   │   ├── pages/
│   │   │   ├── ChatPage.jsx
│   │   │   └── SettingsPage.jsx
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── index.html
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── package.json
│
├── backend/
│   ├── controllers/
│   │   ├── researchController.js
│   │   ├── pdfController.js
│   │   └── discordController.js
│   ├── services/
│   │   ├── serperService.js
│   │   ├── crawlerService.js
│   │   ├── openrouterService.js
│   │   └── discordService.js
│   ├── routes/
│   │   ├── research.js
│   │   ├── pdf.js
│   │   └── discord.js
│   ├── prompts/
│   │   └── researchPrompt.js
│   ├── pdf/
│   │   └── pdfGenerator.js
│   ├── crawler/   (see crawlerService.js)
│   ├── search/    (see serperService.js)
│   ├── utils/
│   │   └── helpers.js
│   ├── server.js
│   ├── .env.example
│   └── package.json
│
└── README.md
```

---

## Discord Bot Setup

1. Go to https://discord.com/developers/applications
2. Create a New Application → Bot → Add Bot
3. Copy the **Bot Token**
4. Under OAuth2 → URL Generator: select `bot` scope + `Send Messages` + `Attach Files` permissions
5. Use the generated URL to invite the bot to your server
6. Enable Developer Mode in Discord (Settings → Advanced)
7. Right-click your target channel → Copy Channel ID
8. Paste both into the **Settings** page in the app

---

## Notes

- The crawler respects robots.txt conventions and skips login, privacy, terms, blog, and careers pages
- OpenRouter free models (Llama, Mistral) work without credits but may be slower
- PDF size is typically 20–80 KB per report
- Discord file upload limit is 8 MB on free servers (reports are well within this)
