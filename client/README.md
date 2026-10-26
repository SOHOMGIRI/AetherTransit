<div align="center">
  <img src="public/assets/logo.png" width="80" height="80" alt="ÆtherTransit Logo" />
  <h2>ÆtherTransit — Client Frontend</h2>
  <p>Next.js 16 (React 19 + Tailwind CSS) Commuter &amp; Fleet Operations Interface</p>
</div>

---

### Tech Stack
- **Framework:** Next.js 16.4.3 (App Router)
- **UI Library:** React 19.2.8
- **Styling:** Tailwind CSS v4, Lucide Icons
- **Mapping:** MapLibre GL 6.10, React-Map-GL 8.1
- **Real-Time Telemetry:** WebSockets (Socket.io-client) &amp; Web Audio API
- **State & Sync:** Cross-Tab BroadcastChannel API

### Development
```bash
npm install
npm run dev
```

Runs on `http://localhost:3000`.
Proxy requests to backend on port 5000 via `next.config.mjs`.
