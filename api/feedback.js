// Vercel serverless function: anonymous feedback collection + password-gated read.
//
// Data store: Upstash Redis / Vercel KV over its REST API. In the Vercel project,
// add a Redis (Upstash) store from the Storage tab (which injects the URL + token),
// and set the dashboard password. Env vars used (either naming works):
//   KV_REST_API_URL   or  UPSTASH_REDIS_REST_URL
//   KV_REST_API_TOKEN or  UPSTASH_REDIS_REST_TOKEN
//   DASHBOARD_PASSWORD  -> the password for the in-app feedback dashboard
//
// Stored per rating: { rating (1-5), comment (<=300 chars), ts, context }.
// Never anything else — no map content, no identity.

const STORE_URL   = process.env.KV_REST_API_URL   || process.env.UPSTASH_REDIS_REST_URL   || '';
const STORE_TOKEN = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN || '';
const ADMIN_PW    = process.env.DASHBOARD_PASSWORD || '';
const KEY = 'myw_feedback';

async function redis(cmd) {
  const r = await fetch(STORE_URL, {
    method: 'POST',
    headers: { Authorization: 'Bearer ' + STORE_TOKEN, 'Content-Type': 'application/json' },
    body: JSON.stringify(cmd)
  });
  if (!r.ok) throw new Error('store ' + r.status);
  const j = await r.json();
  return j.result;
}

module.exports = async (req, res) => {
  try {
    if (!STORE_URL || !STORE_TOKEN) {
      res.status(500).json({ error: 'store_not_configured' });
      return;
    }

    if (req.method === 'POST') {
      let body = req.body;
      if (typeof body === 'string') { try { body = JSON.parse(body); } catch (e) { body = {}; } }
      body = body || {};
      const rating = parseInt(body.rating, 10);
      if (!(rating >= 1 && rating <= 5)) { res.status(400).json({ error: 'bad_rating' }); return; }
      const comment = (typeof body.comment === 'string') ? body.comment.trim().slice(0, 300) : '';
      const rec = { rating: rating, comment: comment, ts: new Date().toISOString(), context: 'web' };
      await redis(['LPUSH', KEY, JSON.stringify(rec)]);
      await redis(['LTRIM', KEY, 0, 9999]); // keep the most recent 10k
      res.status(200).json({ ok: true });
      return;
    }

    if (req.method === 'GET') {
      const key = req.headers['x-dash-key'] || (req.query && req.query.key) || '';
      if (!ADMIN_PW || key !== ADMIN_PW) { res.status(401).json({ error: 'unauthorized' }); return; }
      const items = (await redis(['LRANGE', KEY, 0, -1])) || [];
      const rows = items.map(function (s) { try { return JSON.parse(s); } catch (e) { return null; } }).filter(Boolean);
      res.status(200).json({ rows: rows });
      return;
    }

    res.status(405).json({ error: 'method_not_allowed' });
  } catch (e) {
    res.status(500).json({ error: 'server_error' });
  }
};
