# Syswatch terminal monitor

This implementation turns the assessment scaffold into a responsive, keyboard-first
system task and sensor viewer. It is built with React, JavaScript, Tailwind CSS,
and Vite. The monitor data layer is intentionally isolated in
`src/api/systemMonitor.js`, so a
Node/OS adapter can replace the demo snapshot generator without changing the UI.

## Run locally

```bash
npm install
npm run dev
```

The app opens on a Firebase email/password sign-up screen. To enable real
authentication, create `.env.local` from the values below and enable
Email/Password in Firebase Authentication:

```bash
VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_AUTH_DOMAIN=...
VITE_FIREBASE_PROJECT_ID=...
VITE_FIREBASE_STORAGE_BUCKET=...
VITE_FIREBASE_MESSAGING_SENDER_ID=...
VITE_FIREBASE_APP_ID=...
```

Without Firebase values, the local preview button exposes the monitor UI for
assessment/demo purposes; no mock account is created. Firebase is the only
authentication provider.

## Keyboard controls

- `1` CPU/GPU, `2` memory, `3` network, `4` processes
- `Space` pauses or resumes the live stream
- `Esc` clears the terminal command input

`npm run build` runs the production Vite build.
