# agent-skills

A public marketplace for [Claude Code](https://claude.ai/claude-code) agent skills. Browse, submit, and install skills for your AI agent team.

## Features

- **Browse** skills by role (PM, Frontend Dev, Backend Dev, QA, DevOps, Designer)
- **Search** by name, description, or tags
- **Submit** skills for community review
- **i18n** — English and Chinese (中文) supported
- **Agent API** — Machine-readable REST API with token auth

## Tech Stack

- [Next.js 15](https://nextjs.org) (App Router)
- [TypeScript](https://typescriptlang.org) (strict)
- [Tailwind CSS v4](https://tailwindcss.com)
- [next-intl](https://next-intl-docs.vercel.app) for i18n
- [Firebase Firestore](https://firebase.google.com/docs/firestore) for data
- Deployed on [Vercel](https://vercel.com)

## Getting Started

```bash
# Install dependencies
pnpm install

# Copy env example
cp .env.local.example .env.local
# Fill in your Firebase credentials

# Run dev server
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) (redirects to `/en`).

## Environment Variables

See `.env.local.example` for all required variables:

| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_FIREBASE_*` | Firebase Client SDK config |
| `FIREBASE_ADMIN_PRIVATE_KEY` | Firebase Admin private key |
| `FIREBASE_ADMIN_CLIENT_EMAIL` | Firebase Admin client email |
| `FIREBASE_ADMIN_PROJECT_ID` | Firebase project ID |
| `ADMIN_SECRET_KEY` | Secret key for `/api/admin/review` |

## API

All endpoints return `application/json`. See `/.well-known/agent.json` for machine-readable API description.

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| `GET` | `/api/skills` | None | List skills. Query: `?role=&q=&page=` |
| `GET` | `/api/skills/:id` | None | Get skill detail |
| `POST` | `/api/skills` | None | Submit skill for review |
| `POST` | `/api/agent/token` | None | Issue permanent agent token |
| `POST` | `/api/admin/review` | `X-Admin-Key` header | Approve/reject pending skill |

### Agent Token

```bash
# Get a token
curl -X POST https://agent-skills.vercel.app/api/agent/token \
  -H "Content-Type: application/json" \
  -d '{"name": "my-agent"}'

# Use token
curl https://agent-skills.vercel.app/api/skills \
  -H "Authorization: Bearer sk-agent-..."
```

Rate limit: **100 requests/hour** per token.

## Firestore Collections

- `skills/` — published, approved skills
- `skills_pending/` — awaiting admin review
- `agent_tokens/` — issued API tokens

## License

MIT
