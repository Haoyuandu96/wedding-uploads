# Worker change (disable passcode check)
Add an environment variable in your Worker Settings:
- Name: REQUIRE_PASSCODE
- Value: false  (string)

Then update your Worker code's passcode section to:
```js
const pass = form.get("passcode");
const requirePass = env.REQUIRE_PASSCODE === "true";
if (requirePass && pass !== env.UPLOAD_PASSCODE) {
  return json({ error: "Invalid passcode" }, 401, corsHeaders);
}
```
This way, if REQUIRE_PASSCODE is "false", uploads won't require a passcode.
