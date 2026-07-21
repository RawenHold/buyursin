# Security

- No API keys, access tokens, or credentials are required by the client application.
- Export to PDF and PPTX runs locally in the browser.
- Files selected as client logos are stored only in the browser's local storage for the current user.
- Deployment credentials must be stored as encrypted GitHub Actions secrets or in Vercel project settings.
- Never prefix a secret with `NEXT_PUBLIC_`; those values are included in the browser bundle.
- `npm run check:secrets` scans source and deployment configuration for common credential patterns.
