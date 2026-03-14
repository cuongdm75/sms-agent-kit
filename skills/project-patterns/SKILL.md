---
name: project-patterns
description: PA SMS Online project-specific code patterns. Real code templates for Backend (FastAPI + Prisma), Frontend (Next.js), and Mobile (React Native). Use when creating new modules, endpoints, pages, or screens to follow established conventions.
---

# Project Patterns — PA SMS Online

> **Purpose:** Give agents concrete, real code references to prevent hallucinated imports, wrong patterns, and inconsistent code.

## 🏗️ Architecture Overview

```
src/
├── server/                    # Backend — Python FastAPI
│   ├── main.py               # App entry, CORS, middleware
│   └── app/
│       ├── api/v1/endpoints/  # Route files (one per module)
│       ├── schemas/           # Pydantic request/response models
│       ├── services/          # Business logic
│       ├── core/              # Config, security, database, RBAC
│       └── utils/             # Helpers
├── web/                       # Frontend — Next.js 14 (App Router)
│   ├── app/                   # Pages (one folder per module)
│   ├── components/            # Shared components
│   ├── lib/                   # api-client, utils
│   └── contexts/              # AuthContext, LanguageContext
└── mobile/                    # Mobile — React Native (Expo)
    └── src/
        ├── screens/           # Screen components
        ├── hooks/             # useApi, custom hooks
        ├── context/           # Auth, Settings, Network, Language
        └── services/          # auth, offlineQueue
```

## 📋 Pattern References

Read these files BEFORE writing code:

| Layer | File | What it shows |
|-------|------|---------------|
| **Backend API** | `references/api-endpoint.py` | FastAPI router with auth deps, Prisma DB, error handling |
| **Backend Schema** | `references/pydantic-schema.py` | Pydantic models with camelCase aliases (`Field(alias=...)`) |
| **Frontend Page** | `references/nextjs-page.tsx` | Next.js page with fetchClient, tabs, badges, i18n |
| **Mobile Screen** | `references/mobile-screen.tsx` | React Native screen with useApi, RefreshControl, StyleSheet |

## 🔴 Critical Rules

### Backend
1. **ALWAYS** use `Depends(get_current_active_user)` for auth — defined in `app/api/deps.py`
2. **ALWAYS** use `db.modelname.find_many()` / `db.modelname.create()` — Prisma client at `app/core/database.py`
3. **Pydantic schemas** must use `Field(alias="camelCase")` + `populate_by_name = True`
4. **NEVER** use `traceback.print_exc()` — use `logger.exception()` instead
5. **ALWAYS** register new routes in `app/api/v1/api.py`

### Frontend (Next.js)
1. **ALWAYS** start with `"use client";` for interactive pages
2. **ALWAYS** import `fetchClient` from `@/lib/api-client` — NOT raw `fetch()`
3. **ALWAYS** use `useLanguage()` for text — `const { t } = useLanguage();`
4. **ALWAYS** use `useAuth()` for user info — `const { user } = useAuth();`
5. **Status badges** follow this pattern: `Record<string, { bg, text, label }>`

### Mobile (React Native)
1. **ALWAYS** use `useApi()` hook — NOT raw `fetch()`
2. **ALWAYS** pass `cacheKey` for GET requests (offline support)
3. **ALWAYS** use `useIsFocused()` to refetch on screen focus
4. **ALWAYS** add `RefreshControl` to ScrollView/FlatList
5. **ALWAYS** use `StyleSheet.create()` — NOT inline styles
6. **ALWAYS** use `useLanguage()` for text — `const { t } = useLanguage();`

## 🧩 Common Imports Cheatsheet

### Backend
```python
# Auth
from app.api.deps import get_current_active_user
# Database
from app.core.database import db
# Config
from app.core.config import settings
# Logger
import logging
logger = logging.getLogger(__name__)
```

### Frontend
```tsx
import { fetchClient } from '@/lib/api-client';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import Link from 'next/link';
import { useState, useEffect } from 'react';
```

### Mobile
```tsx
import { useApi } from '../hooks/useApi';
import { useLanguage } from '../context/LanguageContext';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, ActivityIndicator, RefreshControl } from 'react-native';
```
