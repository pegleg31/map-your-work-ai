# Map Your Work With AI Tools

A self-contained, interactive mind-mapping tool for Southern New Hampshire University staff and faculty. Map your role, brainstorm additional tasks with an AI assistant, then rank each task to see where AI genuinely fits your work — and where it should stay human.

Based on the SNHU **AI in 20** series, *Week Five: Mindmapping Use Cases*.

## Flow
1. **Build your map** — Role -> Categories -> Actions -> Details.
2. **Brainstorm with AI** — copy the role-tailored prompt into your approved AI tool; paste ~20 suggested tasks back onto your map.
3. **Rank & prioritize** — tag each task (star = manual/repetitive, ? = no strong opinion, heart = fills your cup, X = keep off AI) to reveal your best first AI use cases.

Work autosaves to the browser; export via copy summary, print/PDF, or download/load a JSON map file.

## Deploy
The app is a single static `index.html` (styles, script, and logo all inlined). The only server-side piece is the optional feedback backend below.

- **Vercel:** import this repo; framework preset **Other**, no build command. Vercel serves `index.html` and auto-detects the function in `api/`.
- **Local (app only):** open `index.html` in any browser.

## Feedback + dashboard (pilot)

The app shows an anonymous **1-5 star + optional comment** widget at the end of Step 3, and a **password-gated dashboard** (open it at `/#dashboard`, or press **Alt+Shift+D**, or click the footer credit line 5x). Both only appear on this web build — never on the Claude artifact copy.

It stores **only** `{ rating, comment, timestamp }` per response — never the map, role, or any identity.

### One-time setup in Vercel
1. **Add a data store:** Project -> **Storage** -> create a **Redis** (Upstash) database and connect it to the project. This injects `KV_REST_API_URL` and `KV_REST_API_TOKEN` (Upstash naming `UPSTASH_REDIS_REST_URL` / `UPSTASH_REDIS_REST_TOKEN` also works).
2. **Set the dashboard password:** Project -> **Settings** -> **Environment Variables** -> add `DASHBOARD_PASSWORD` = *your chosen password*.
3. **Redeploy** (Deployments -> redeploy, or push a commit) so the function picks up the env vars.

### How it works
- The widget `POST`s to `/api/feedback`, which appends the record to the Redis store.
- The dashboard sends the entered password to `/api/feedback` (GET, `x-dash-key` header); the **server** checks it against `DASHBOARD_PASSWORD` and returns the data only if it matches — the password is never stored in the page.

## Embedding in SharePoint
Use the **Embed** web part with the deployed URL.
