# API Tests — Multi tenant MCD Alchemy (GET Case)

Read-only API tests for the SEA middleware, scoped to the **GET Case Ticket**
endpoint from the Postman collection's *Multi tenant MCD Alchemy* folder.
No POST/PUT/PATCH endpoints are exercised.

## Layout
```
test/api/
├── config/api.config.js     # reads all settings from .env
├── utils/auth.js            # Azure AD client-credentials token (cached)
├── utils/client.js          # axios instance: Bearer + X-Tenant-ID
├── services/case.service.js # getCaseByNumber() -> GET /v1.1/servicenow/case/{no}
├── data/case.data.js        # case numbers (from .env)
├── specs/case.get.e2e.js    # the GET tests
└── .mocharc.json            # mocha config for the API suite
```

## Setup
Add these keys to your **`.env`** (gitignored). See `.env.example` for the list:
`AAD_TENANT_ID`, `AAD_CLIENT_ID`, `AAD_CLIENT_SECRET`, `AAD_SCOPE`,
`API_BASE_URL`, `API_TENANT_ID`, `API_CALLER_CLIENT`, `TEST_CASE_NUMBER`.

## Run
```bash
npm run api
```

## How it works
1. `auth.js` gets an Azure AD token (client-credentials) and caches it.
2. `client.js` attaches `Authorization: Bearer …` and `X-Tenant-ID`.
3. `case.service.js` calls `GET /v1.1/servicenow/case/{caseNumber}?callerClient=…`.
4. `specs/case.get.e2e.js` asserts status 200 + JSON body, and that a
   non-existent case does **not** return 200.

## Notes
- Secrets live only in `.env` (never in code or git).
- `validateStatus` is disabled on the client so tests assert on status codes
  rather than axios throwing.
