# Technology Decisions

Implementation details below are verified from source and dependencies. The rationale explains how each choice fits this project; it does not claim undocumented historical motivations. The PERN stack, raw SQL, JWT/localStorage and separate Vercel/Render hosting are explicit project constraints.

| Technology / Decision | Why Chosen | Trade-offs / Risks | Mitigations Implemented |
| --- | --- | --- | --- |
| React + TypeScript + Vite | Component-based UI, typed data shapes and a fast development/build workflow. | Frontend state is untrusted; runtime API data is not made safe by types alone. | Backend validation/authorization, React's escaped rendering, focused runtime checks, build/type checks. |
| React Router | Client-side navigation and role-appropriate screens. | Route restrictions can be bypassed by direct HTTP requests. | Backend JWT, RBAC and SQL ownership checks; Vercel SPA rewrites support deep links. |
| Tailwind CSS | Responsive utilities preserve the existing design with little custom CSS. | Utility-heavy markup; theme combinations can have weak contrast. | Shared theme tokens, explicit dark-mode colors and contrast-adjusted text colors. Rendered accessibility requires manual review. |
| Node.js + Express | A small JSON API with explicit middleware and feature modules. | Security controls and deployment proxy settings must be configured deliberately. | Helmet, request/body limits, exact-origin CORS, production HTTPS checks and generic errors. |
| PostgreSQL + `pg` | Relational data, constraints, joins, aggregates and transactions suit accounts and warranties. | Connection privileges/TLS and database operations are deployment responsibilities. | Foreign keys/checks, parameterized values, owner index, transactions for account deletion and seeding. |
| Neon PostgreSQL hosting | Managed PostgreSQL with a Free plan fits the intended portfolio deployment and works with the existing `pg` driver and raw SQL. | Free-plan quotas, idle compute suspension and network latency affect availability and response time. | Documented pooled API URL, direct migration URL and verified TLS configuration; keep credentials in backend environment settings. Live connectivity and usage still require operator verification. |
| Raw SQL | Makes queries, ownership predicates and dashboard aggregation explicit. | More manual query/result maintenance and schema coordination than generated models. | Parameterized values, feature services and versioned SQL migrations. |
| node-pg-migrate | Applies the existing ordered SQL migrations and records their execution. | Migrations require deliberate deployment coordination; it is a development dependency. | Explicit `db:migrate` command and transaction/locking defaults. Run with development dependencies installed. |
| jsonwebtoken / JWT | Portable bearer authentication across independent frontend/API origins. | Bearer-token theft and stateless logout limitations; signing-key operations need care. | HS256 allow-list, required issuer/audience/subject/iat/exp, 30-minute maximum lifetime, secret validation and current-account lookup. |
| localStorage | Simple persistence across reloads without cross-site cookie configuration. | Successful XSS can read and steal tokens. | Escaped rendering, HTTPS receipt-link checks, CSP, same-origin scripts, short token expiry, 401 handling and local/cross-tab cleanup. These do not eliminate XSS token theft. |
| RBAC + ownership | Separates workspace administration from personal warranty management. | Stale or forged browser roles could mislead the UI. | Every protected API route authenticates; roles are fetched from PostgreSQL; SQL restricts ownership. Registration rejects role assignment. |
| bcryptjs | Password verification uses one-way, salted password hashes. | CPU cost; inputs beyond 72 UTF-8 bytes are truncated by bcrypt. Legacy hashes/passwords remain. | Cost 12 for new/seeded passwords, minimum/byte-length bounds, rate limits and a dummy comparison for unknown accounts. |
| Custom validation + HTML controls | Keeps this small API's validation explicit without adding a schema library. | Rules must stay aligned and require maintenance. | Field allow-lists, type/range/calendar checks, BIGINT bounds, URL parsing and form constraints. No dedicated validation library is used. |
| express-rate-limit | Bounds failed logins, registration and general API request volume. | Counters reset on restart and are not shared between instances. | Separate login/registration limits and a general API limit. A shared store is not implemented. |
| Explicit CORS middleware | Permits the exact independently hosted frontend origin. | CORS controls browser access, not authentication or non-browser clients. | Exact allow-list and preflight handling; JWT/RBAC remain mandatory. Requests omit cookie credentials. |
| Helmet + CSP | Reduces unsafe browser behavior and exposure from content injection. | CSP is defense in depth, and inline styles remain allowed. | Helmet on the API; Vercel framing/nosniff/referrer headers; generated frontend CSP with exact API origin and no production inline scripts/eval. |
| Vercel + Render | Frontend and API can build/deploy independently under their required hosting arrangement. | CORS/API URLs, proxy trust, database reachability and release compatibility need coordination. | Environment examples, validated HTTPS origins, SPA rewrites and manual Render configuration guidance. Live settings are not verified by source alone. |

## Important technical decisions

### JWT authentication

Login signs a short-lived identity token. The API verifies its signature and claims, then fetches the account's current role before permitting an operation. Looking up the account means a deleted account or demoted administrator cannot retain its old permissions merely through an old token. It also means protected requests require a database lookup; the API does not claim to be database-independent authentication.

Logout removes local state without revoking a copied token. There is no refresh-token flow, revocation list, account-recovery flow or password-reset endpoint. Signing-key rotation invalidates tokens signed by the previous key. See [the authentication flow](SYSTEM_ARCHITECTURE.md#authentication-flow) for the request sequence.

### localStorage instead of httpOnly cookies

This is intentional: independent Vercel/Render domains can send a bearer token without configuring credentialed cross-site cookies. Browser JavaScript can also read that token. React escaping, URL checks and CSP reduce injection opportunities; expiration limits token lifetime; session cleanup handles ordinary logout and invalid sessions. None of those controls protects a token from JavaScript after XSS succeeds. Passwords and signing keys are never stored in frontend storage or `VITE_*` variables.

### Raw SQL instead of an ORM

Direct SQL exposes the joins, aggregate calculations and authorization predicates being learned and maintained in this project. Values use PostgreSQL parameters such as `$1`; user input is not concatenated into query syntax. Application-owned query fragments are static. This prevents value-based SQL injection in the reviewed queries, while requiring developers to maintain migrations, output shapes and ownership conditions explicitly.

### RBAC

Users manage personal warranty data; admins additionally review workspace data and remove regular accounts. Frontend links reflect those permissions, while Express middleware and SQL enforce them independently. Administrator status does not grant arbitrary warranty editing: updates stay owner-only; administrators may delete any warranty. This matches the actual routes/services rather than a generic assumption that admins can do everything.

### Separate Vercel and Render deployment

`VITE_API_BASE_URL` is a public build-time API origin; `FRONTEND_ORIGIN` is the server's browser-origin allow-list. They have different purposes and must agree with the deployed domains. HTTPS protects transport, while CORS restricts which browser origins may read API responses. Neither replaces authentication. Changing the frontend API origin requires a rebuild because the bundle and exact-origin CSP are generated together.

Neon hosts the PostgreSQL database while Render continues to run the Express API. The API uses a pooled Neon URL; migrations use a direct URL because the migration tool uses session-level advisory locks. Both URLs target the same production branch/database and use `sslmode=verify-full`. The connection is configured through `DATABASE_URL`, preserving raw SQL, the current driver and JWT/localStorage authentication. Use a separate database branch for local development.

Operational gaps remain: rate limiting uses per-process memory, the proxy hop count must match the real deployment, and database privileges/TLS/backups are operator-managed. Environment examples document required values; live hosting settings still need verification. See [operational limits](SYSTEM_ARCHITECTURE.md#operational-limits).
