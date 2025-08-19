
# Wedding Uploads — Persistent "Your name"

This is a **drop‑in enhancement** that remembers the guest's name using `localStorage`, so they don't have to re‑enter it every time. It also supports an optional "Signed in as …" chip with a Change button.

## Files
- `persist-name.js` — the script to include.
- `snippet.html` — optional markup for a "Signed in as" chip (to show/hide the name input after first entry).

## How to use (GitHub Pages)
1. Copy `persist-name.js` into the root of your `wedding-uploads` site (same folder as `index.html`).
2. In `index.html`, add this **before** your uploader script (or at the end of `<body>`):
   ```html
   <script src="persist-name.js" defer></script>
   ```
3. Ensure your name input has **one** of the following so the script can find it:
   - `id="guestName"` (recommended), **or**
   - `placeholder="Your name"`, **or**
   - `name="guestName"`, **or**
   - `data-role="guest-name"`

4. (Optional) If you want the input to hide after the first entry and show a small identity chip:
   - Give the name input row an id `name-row` (or leave as is; the script will try to find the closest container).
   - Paste the content of `snippet.html` **right under** the name row markup.
   - That's it—the script handles show/hide and the Change button.

## Using the saved name in your uploader code
Replace any direct reads like:
```js
const name = document.getElementById('guestName').value.trim();
```
with:
```js
const name = window.getUploaderName();
if (!name) { alert('Please enter your name'); return; }
```
`window.getUploaderName()` pre-fills from localStorage and saves the typed value.

## Notes
- Persistence is **per device/per browser**.
- No backend changes required.
- If the page already has a name stored, the input can be hidden automatically when you include the optional chip.
