# Authentication Testing Guide

## Overview

Test scenarios for sign-up, login, session management, and role-based access, per the pattern described in `../api/authentication.md`.

> This should match the project's implementation for exact form fields, error copy, and OAuth providers (if any).

## Test Scenarios

### Sign-Up

- [ ] New user can register with a valid email/password
- [ ] Duplicate email registration is rejected with a clear error
- [ ] Weak/invalid password is rejected per Supabase Auth password policy

### Login

- [ ] Valid credentials log the user in and establish a session
- [ ] Invalid credentials show an appropriate error without leaking whether the email exists
- [ ] Session persists across page reloads
- [ ] Logout clears the session and redirects appropriately

### Session Expiry

- [ ] Expired/invalid session on a protected route redirects to login
- [ ] Token refresh happens transparently before expiry during an active session (if implemented)

### Role-Based Access

- [ ] Regular customer cannot access `/admin` routes
- [ ] Admin user can access `/admin` routes
- [ ] Role changes (e.g., promoting a user to admin) take effect on next session/refresh as expected

### Password Reset (If Implemented)

- [ ] Password reset request sends a reset flow (email/link) — confirm actual mechanism
- [ ] Reset link/token is single-use and expires appropriately

## Related Documentation

- `../api/authentication.md`
- `../qa/security-tests.md`
- `admin-testing.md`
