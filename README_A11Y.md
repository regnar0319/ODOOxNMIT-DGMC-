Accessibility tests (Playwright + axe-core)

Prerequisites:
- Node 16+ and npm installed

Install dev dependencies:

```bash
npm install
# This will install Playwright and download browser binaries; it may take a minute.
```

Run the tests (serve the site locally first):

```bash
# From project root - serve files (example simple server)
python -m http.server 8000

# In another terminal
npm run test:a11y
```

What the tests do:
- Launch a headless Chromium via Playwright, navigate to the Sign In and Sign Up pages, inject axe-core, and report violations.
- The test command returns non-zero on detected violations.

Notes:
- If you prefer not to install browser binaries, run `npx playwright install --with-deps` or use Playwright's guidance.
- The pages must be reachable at the URLs used by the tests (http://localhost:8000/auth/signin.html and /auth/signup.html). Adjust tests if you serve at a different host/port.
