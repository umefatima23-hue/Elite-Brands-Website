# Production Test Plan

Scope: verification tests to run directly against the live production environment — before and after deployments, and periodically as smoke tests.

## Smoke Test (run after every deploy, target: under 10 minutes)
1. [ ] Load production URL — page renders, no blank screen or infinite spinner
2. [ ] Navigate to 2-3 key routes — confirm they resolve without 404s
3. [ ] Log in with a test account — session establishes correctly
4. [ ] Submit one representative form/action that writes to Supabase — confirm write succeeds
5. [ ] Log out — session clears correctly
6. [ ] Check browser console — no unexpected errors

## Extended Test Pass (run before major releases)
### Authentication & Access
- [ ] New user sign-up flow (if applicable)
- [ ] Password reset flow (if applicable)
- [ ] Unauthorized access correctly blocked (test that RLS actually prevents cross-account data access)

### Data Integrity
- [ ] Create, read, update, delete operations verified against Supabase for each core entity
- [ ] Concurrent edits (if relevant) don't silently overwrite data unexpectedly

### Performance Under Load
- [ ] Page load time acceptable from a representative network condition
- [ ] No obvious slowdown when data volume is realistic (not just empty test data)

### Failure Handling
- [ ] Network failure during a form submission shows a user-facing error, not a silent failure
- [ ] Supabase downtime (simulate by testing with invalid credentials in a non-prod environment) is handled gracefully by the UI

## Test Environments
| Environment | Purpose | Data |
|---|---|---|
| Production | Live users | Real data — test carefully, prefer dedicated test accounts |
| Preview (Vercel PR deploys) | Pre-merge verification | Should point to staging Supabase project if available |
| Local | Development | Local/staging Supabase project |

## Reporting
Log results of each Production Test Plan run with date, tester, pass/fail per section, and any follow-up items filed.
