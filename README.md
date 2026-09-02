# Satyesh's Portfolio Chatbot

A chat widget (styled after the Sumeru Infrastructures bot) that knows about
**you** — your projects, skills, experience, and contact info — with an
optional Gemini AI fallback, OTP email verification, and callback-request
capture. Built as **Vercel Serverless Functions**, so there's no server to
run or manage — it deploys alongside your static site.

## What's in here

```
api/
  chat.js              → answers questions (knowledge base + Gemini fallback)
  send-otp.js          → emails a 6-digit code, returns a signed token
  verify-otp.js        → verifies the code, notifies you of the new visitor
  callback-request.js  → emails you when a visitor leaves their number
  _lib/
    profile.js         → 🔧 EDIT THIS to update your facts
    knowledgeBase.js    → topics built from profile.js
    matcher.js          → keyword-matching logic
    mailer.js           → email templates
    otpToken.js         → stateless, signed OTP tokens (see note below)
    cors.js             → CORS handling for each function
widget/
  chatbot-widget.html  → the actual chat bubble/window to paste into your site
package.json
.env.example
```

## Why "stateless" OTP?

The original Sumeru bot stored OTPs in a plain JS object in server memory.
Serverless functions don't keep memory between requests reliably (each
invocation can run on a different instance), so instead the OTP + user
details get packed into a **signed token** (HMAC-SHA256) that's handed back
to the browser. The browser holds onto it and sends it back on verification
— no database needed, and it can't be forged without your `OTP_SECRET`.

---

## 0. Test it on localhost first (no Vercel account needed)

1. `npm install`
2. Copy `.env.example` → `.env` and fill in real values (see step 1 below for
   how to get each one — you need at least `ADMIN_EMAIL` and
   `EMAIL_PASSWORD` for OTP emails to actually send).
3. `npm run dev`
4. Open **http://localhost:3000** — you'll see a blank test page with the
   chat bubble in the corner, already wired up to talk to your local
   `/api` routes on the same port. Click it and test the whole flow: OTP
   email, verification, asking about your projects, etc.

This uses `dev-server.js`, a small zero-dependency server that maps
`/api/*` requests to the exact same handler files Vercel will use in
production — so if it works here, it'll work deployed. `dev-server.js` and
the `public/` demo page are dev-only; Vercel ignores both.

Once you're happy, move on to deploying for real:

## 1. Deploy the API to Vercel

1. Push this folder to a new GitHub repo (or use the Vercel CLI directly).
2. Go to [vercel.com/new](https://vercel.com/new) and import the repo.
3. Vercel auto-detects the `/api` folder — no build config needed.
4. Add these Environment Variables in the Vercel project settings (or copy `.env.example` → `.env` for local dev with `vercel dev`):

   | Variable | Value |
   |---|---|
   | `ADMIN_EMAIL` | Your Gmail address (sends AND receives notifications) |
   | `EMAIL_PASSWORD` | A Gmail **App Password** (not your normal password) — see below |
   | `GEMINI_API_KEY` | (optional) from [aistudio.google.com/apikey](https://aistudio.google.com/apikey) |
   | `GEMINI_MODEL` | `gemini-1.5-flash` (or a newer model once you check Google's current lineup) |
   | `OTP_SECRET` | Any long random string |
   | `ALLOWED_ORIGIN` | `https://satyeshsingh.site` (your real site, once tested) |

5. Deploy. You'll get a URL like `https://your-project.vercel.app`.

### Getting a Gmail App Password
Gmail blocks plain-password logins from apps. Instead:
1. Turn on 2-Step Verification: <https://myaccount.google.com/signinoptions/two-step-verification>
2. Generate an app password: <https://myaccount.google.com/apppasswords>
3. Use that 16-character password as `EMAIL_PASSWORD`.

---

## 2. Update your facts

Open `api/_lib/profile.js` and fill in the two `TODO` spots:
- Your real **LinkedIn URL**
- **QRIFY's live link** (and double check the Portfolio Website / ACM links are right)
- Optionally, a public URL to your **resume PDF** if you want the bot to link it directly

Everything else (skills, experience, education, awards, certifications) is
already filled in from your resume. Redeploy after editing (Vercel redeploys
automatically on git push, or run `vercel --prod`).

---

## 3. Embed the widget on your site

Open `widget/chatbot-widget.html` and change one line near the top of the `<script>`:

```js
const API_BASE = "https://YOUR-VERCEL-PROJECT.vercel.app"; // ← your real deployed URL
```

Then paste the **entire file's contents** (style + HTML + script) just
before the closing `</body>` tag of your site.

- **Plain HTML site**: paste directly into your `.html` file.
- **React / Vite / Create React App**: paste into `public/index.html`
  (it's plain HTML/CSS/JS, so it works regardless of React — it just floats
  on top of your app).
- **Next.js**: same idea — add it to your root layout via
  `dangerouslySetInnerHTML` in a client component, or drop it in
  `pages/_document.js` before `</body>`.

---

## 4. Test it

1. Visit your live site, click the chat bubble.
2. Fill in name/email/phone → you should receive an OTP email within seconds.
3. Enter the OTP → you should get a "new visitor" notification email.
4. Ask it something like "tell me about your projects" or "what are your skills".
5. Ask something unrelated (e.g. "what's the weather") — with `GEMINI_API_KEY`
   set it'll answer conversationally but stay on-topic; without it, it'll
   offer to take a callback request.

---

## Notes & things you might want to change

- **Colors/branding**: all CSS classes are prefixed `pfc-` (portfolio chatbot)
  so they won't collide with your site's existing styles. Colors are the
  same green/gold theme as the original — search-and-replace the hex codes
  in `chatbot-widget.html` if you'd rather match your site's palette.
- **Avatar**: currently shows your initials "SS" in a circle. Swap in an
  actual headshot or logo by replacing `.pfc-header-avatar` and
  `.pfc-reg-logo-wrap`'s contents with an `<img>` tag.
- **CORS**: `ALLOWED_ORIGIN=*` works everywhere but is looser than you need
  once things are working — set it to your real domain.
- **Rate limiting / abuse**: this template has no rate limiting on the
  email-sending endpoints. If you get spammed, consider adding a simple
  IP-based limiter or a CAPTCHA before `send-otp`.
