# DATABASE & ADMIN SAFETY GUIDELINES

This document serves as the **Master Protocol** for database connectivity, admin dashboard maintenance, and production debugging.
**ALL developers and AI assistants must follow these rules strictly to prevent data loss or downtime.**

---

## 1. Database Connection Rules

- **NO Hardcoding**: Never hardcode a database name (e.g., `db("my_db")`) in the codebase.
- **Respect Connection Strings**: Always prioritize the database name defined in the `MONGODB_URI` connection string.
- **Environment Variables**:
  - If `MONGODB_DB_NAME` is used, it **MUST** match the production database exactly.
  - If `MONGODB_DB_NAME` is missing/undefined, the code **MUST** fall back to `client.db()` (no arguments) to use the database from the URI.
- **Consistency**: Logic for selecting the database must be identical across strictly Local, Staging, and Production environments.

## 2. Production vs. Local Environments

- **Verification is Mandatory**: "It works on my machine" is **NOT** invalidation. Local success does NOT guarantee production correctness.
- **Verify Env Vars**: Always explicitly verify production environment variables (via logging/debugging) before attempting to debug UI symptoms.
- **Connection URI**: Be aware that production connection strings often target different clusters or databases than local `.env`.

## 3. Mandatory Debug Protocol (Non-Negotiable)

**Before applying ANY code fix for missing data:**

1.  **LOG** the connected database name (`db.databaseName`).
2.  **LOG** the target collection name being accessed.
3.  **LOG** the document count (`collection.countDocuments()`) returned by the query.
4.  **CONFIRM** via logs that the application is connected to the expected database containing the data.

**DO NOT apply fixes until logs confirm the root cause.**

## 4. Admin Dashboard Rules

- **Empty State checks**: An empty admin list is a symptom, not a diagnosis. **NEVER** assume "no data" means the data was deleted.
- **Connection First**: Always verify the database connection string and active database name first.
- **Data Integrity**: **NEVER** delete, reseed, or overwrite production data as a "fix" for data visibility issues.
- **Read-Only Debugging**: Use read-only operations (counts, finds) when debugging production issues.

## 5. AI Assistant & Developer Usage Rules

**AI/Developers MUST NOT:**

- Guess the database name.
- Change DB configuration logic without prior logging evidence.
- Apply trial-and-error fixes to production configurations.

**AI/Developers MUST ALWAYS:**

- Log diagnostic info first.
- Verify environment variables in the running environment.
- Confirm the root cause (e.g., wrong DB name vs. empty collection) before touching code.
- Document findings before applying changes.

---

## Pre-Deploy Checklist

Before deploying any changes related to database or admin logic:

- [ ] **Confirm DB Name**: Production logs show connection to the correct database (e.g., `pact_mediation`).
- [ ] **Check Counts**: Admin APIs return the correct document count matching the database state.
- [ ] **Logic Match**: Confirm local and production use identical database selection logic.
- [ ] **Visual Check**: Confirm admin pages display data correctly in a staging/preview environment if possible.

---

**Policy Status: ACTIVE**
**Last Updated: 2026-02-07**
