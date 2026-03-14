---
name: project-patterns
description: Lessons learned and proven patterns from SMS Online Platform development. Apply these rules when building enterprise safety management systems.
---

# Project Patterns — SMS Online Platform Experience

> Distilled from 8 Knowledge Items, 64+ development sessions, and real production deployment.

## 1. Vietnamese i18n — ALWAYS Bilingual

**Rule**: Never hardcode UI strings. Always use the `useLanguage()` hook.

```tsx
const { t, lang } = useLanguage();
// ✅ CORRECT
<span>{t('status', 'Trạng thái')}</span>

// ❌ WRONG
<span>Status</span>
```

**Common traps**:
- Select dropdowns options — MUST translate both labels AND values display
- Toast messages — both success and error messages
- Table column headers — often forgotten
- Placeholder text in inputs
- Date format: Vietnamese uses `dd/MM/yyyy`, not `MM/dd/yyyy`

## 2. Approval Workflow State Machine

**Pattern**: All safety modules follow 3-stage or 4-stage workflows.

### 3-Stage (MOC, Periodic Reports)
```
draft → pending_review → approved/rejected
```

### 4-Stage (Safety Walk, ePTW)
```
draft → pending_approval → conducting → archived
```

### Key Rules
- `pending_review → supplement_required` — Return for more info (needs `reviewNote`)
- `supplement_required → pending_review` — Resubmit after fix
- Always check **RBAC** before showing approve/reject buttons
- Transitions trigger **notifications** via `notify.py`
- When approved, **snapshot data as JSON** — never recalculate from live data

## 3. Table UI Standards

All data tables MUST follow this consistent aesthetic:

```tsx
// Header style
"text-xs font-bold text-slate-500 uppercase tracking-wider"

// Row hover
"hover:bg-slate-50/80 transition-colors"

// CTA Buttons
"bg-blue-600 hover:bg-blue-700 text-white rounded-lg px-4 py-2"

// Status badges
"px-3 py-1 rounded-full text-xs font-semibold"
// Green: bg-emerald-100 text-emerald-700
// Yellow: bg-amber-100 text-amber-700  
// Red: bg-red-100 text-red-700
// Blue: bg-blue-100 text-blue-700
```

## 4. API Architecture

### Pattern: Hierarchy-Aware Endpoints
```python
# Branch-level (filtered by user's branch)
GET /api/v1/{module}/?branch_id=xxx

# Corporate-level (aggregate all branches)
GET /api/v1/{module}/corporate/summary
```

### Key Rules
- All endpoints return `{"success": true/false, "data": ..., "message": ...}`
- Use structured `logger.exception()`, never `print()` or `traceback.print_exc()`
- Error responses must NEVER leak database details or stack traces
- JWT tokens expire in 24 hours (not 8 days!)

## 5. Security Checklist

Before any deployment:
- [ ] `SECRET_KEY` loaded from environment variable, not hardcoded
- [ ] CORS restricted to specific domains (no `["*"]`)
- [ ] JWT expiry ≤ 24 hours
- [ ] No `sys.stderr.write` or `traceback.print_exc()` in production code
- [ ] AD/LDAP integration: always fall back to local auth on connection failure
- [ ] Sensitive fields (password hashes, tokens) never returned in API responses

## 6. Mobile-First Field Operations

### Offline Queue Pattern
```tsx
// Always queue if offline, sync when back online
const { execute } = useApi();
await execute('/api/v1/safety-walk/results', {
  method: 'POST',
  body: data,
  offlineQueue: true, // Queue for later sync
});
```

### GPS/Media Storage
- GPS coordinates stored as JSON: `{"lat": 21.028, "lng": 105.854}`
- Photos stored as base64 in JSON field (max 3 images per record)
- Always compress images before upload (max 500KB each)

## 7. Report Builder Pattern

For complex configurable reports (Company Reports):
- Use **block-based architecture** with `@dnd-kit` for drag-and-drop
- Each block type: `table`, `chart`, `text`, `metric-card`
- Blocks stored as JSON array in database
- Render engine reads blocks and renders appropriate component
- Support both edit mode (drag/resize) and view mode (read-only)

## 8. Notification System

### notify.py Service Pattern
```python
from app.services.notify import send_notification

send_notification(
    title="New Safety Walk needs approval",
    content=f"Plan for {location} submitted by {user.name}",
    notification_type="safety_walk",
    target_branch_id=branch_id,
    target_role="manager",  # or target_user_id for specific user
    reference_id=record_id,
    reference_type="safety_walk",
)
```

### Rules
- Always include `reference_id` + `reference_type` for deep linking
- Approval notifications → target role (managers)
- Result notifications → target specific user (creator)
- Large content (base64 screenshots) → use Telegram document fallback

## 9. Module Toggle System

Enterprise features are controlled by toggle configuration:
```json
{
  "moc": true,
  "eptw": true,
  "safety_walk": true,
  "risk_assessment": false,
  "compliance_audit": true
}
```

- Toggles stored in `SystemConfig` table
- Sidebar dynamically filters based on active modules
- API endpoints check toggle before processing requests
- Mobile app respects toggles for screen visibility

## 10. Common Bugs & Gotchas

| Issue | Root Cause | Fix |
|-------|-----------|-----|
| Archive tab shows empty | Query only fetches `archived`, not `completed` | Fetch both: `status IN ('archived', 'completed')` |
| 404 on branch data | Old API path without version prefix | Use `/api/v1/branches` |
| Select shows raw values | No translation for dropdown options | Add `t()` for select options |
| Build fails on `[id]` page | TypeScript strict mode + async params | Use `React.use()` for params in Next.js 15 |
| Notification not clickable | Missing click handler on list item | Add `onClick` + cursor-pointer |
| SPI not updating | Recalculation trigger missing | Call `recalculate_spi()` after CRUD operations |
