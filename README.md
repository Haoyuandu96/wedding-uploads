# Wedding Uploads — Admin v4
Front-end changes:
- Admin mode toggle (asks for PIN once). Shows a Delete button on each item.
- Click-to-zoom lightbox for images and videos.

Back-end (Worker) required changes:
1) Add a **Secret**: `ADMIN_PIN` with your chosen PIN.
2) Add an endpoint to `worker.js`:

```js
// DELETE endpoint (admin only)
if (url.pathname === '/api/delete' && request.method === 'POST') {
  // Accept JSON or form-data
  let pin = ''; let key = '';
  try {
    const data = await request.json();
    pin = (data.pin || '').toString();
    key = (data.key || '').toString();
  } catch (e) {
    const fd = await request.formData();
    pin = (fd.get('pin') || '').toString();
    key = (fd.get('key') || '').toString();
  }
  if (pin !== env.ADMIN_PIN) return json({ error: 'Unauthorized' }, 401, corsHeaders);
  if (!key) return json({ error: 'Missing key' }, 400, corsHeaders);

  const exists = await env.BUCKET.head(key);
  if (!exists) return json({ error: 'Not found' }, 404, corsHeaders);

  await env.BUCKET.delete(key);
  return json({ ok: true }, 200, corsHeaders);
}
```

No other changes needed; your upload/list/media endpoints stay the same.
