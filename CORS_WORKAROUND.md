# CORS Workaround Guide

## Problem
The backend doesn't have CORS headers configured, causing this error:
```
Access to XMLHttpRequest at 'https://vmi2848672.contaboserver.net/cbt/api/v1/users/login' 
from origin 'http://localhost:3000' has been blocked by CORS policy
```

## Solution Options

### Option 1: Fix Backend (RECOMMENDED)
The backend needs to add CORS middleware. Contact the backend team to add:

```python
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://localhost:5173",
        # Add production domain
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

### Option 2: Use Proxy (TEMPORARY - Development Only)

**Already configured in `vite.config.ts`!**

To use the proxy:

1. Create `.env.local` file:
```bash
# Leave VITE_API_BASE_URL empty to use proxy
VITE_API_BASE_URL=
```

2. Restart dev server:
```bash
npm run dev
```

The proxy will forward `/api/*` requests to the backend server, bypassing CORS.

### Option 3: Browser Extension (NOT RECOMMENDED)
Install a CORS browser extension (only for testing, not for production).

## Current Setup

- **vite.config.ts**: Proxy configured to forward `/api` to backend
- **api.ts**: Uses `VITE_API_BASE_URL` or defaults to empty string (proxy mode)

## How to Switch

**Development with Proxy:**
```env
VITE_API_BASE_URL=
```

**Production or Direct API:**
```env
VITE_API_BASE_URL=https://vmi2848672.contaboserver.net/cbt
```

## Note
The proxy is ONLY for development. In production, the backend MUST have proper CORS headers.
