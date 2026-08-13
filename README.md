# Map Your Work With AI Tools

A self-contained, interactive mind-mapping tool for Southern New Hampshire University staff and faculty. Map your role, brainstorm additional tasks with an AI assistant, then rank each task to see where AI genuinely fits your work — and where it should stay human.

Based on the SNHU **AI in 20** series, *Week Five: Mindmapping Use Cases*.

## Flow
1. **Build your map** — Role -> Categories -> Actions -> Details.
2. **Brainstorm with AI** — copy the role-tailored prompt into your approved AI tool; paste ~20 suggested tasks back onto your map.
3. **Rank & prioritize** — tag each task (star = manual/repetitive, ? = no strong opinion, heart = fills your cup, X = keep off AI) to reveal your best first AI use cases.

Work autosaves to the browser; export via copy summary, print/PDF, or download/load a JSON map file.

## Deploy
This is a single static `index.html` with everything (styles, script, logo) inlined — no build step and no dependencies.

- **Vercel:** import this repo; framework preset **Other**, no build command, output directory = root. Vercel serves `index.html` automatically.
- **Local:** open `index.html` in any modern browser, or run `npx serve`.

## Embedding in SharePoint
Use the **Embed** web part with the deployed URL, or the File viewer web part.