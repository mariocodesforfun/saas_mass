# Python Backend Guide

Use `apps/api` when a product needs:

- AI or ML pipelines
- document parsing
- scraping or ingestion
- long-running jobs
- scheduled syncs
- Python-only libraries
- complex integrations

## Endpoint Pattern

1. Accept `Authorization: Bearer <supabase access token>`.
2. Use `require_user`.
3. Require `organization_id` for tenant-scoped operations.
4. Check membership with `get_membership`.
5. Keep job execution idempotent where possible.

## Railway

Deploy `apps/api` as a Railway service with:

```bash
uvicorn app.main:app --host 0.0.0.0 --port $PORT
```

Workers can reuse the same package with a different command.
