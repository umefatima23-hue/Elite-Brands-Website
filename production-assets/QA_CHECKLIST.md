# QA Checklist

Run this against every preview deployment before merging to production, and re-run a lighter pass against production immediately after deploy.

## Build & Environment
- [ ] Build completes with no errors or unexpected warnings
- [ ] No console errors on initial page load
- [ ] Environment variables resolved correctly (no `undefined` values rendered)

## Core Functionality
- [ ] All primary navigation routes load correctly (TanStack Router)
- [ ] Authentication: sign up, log in, log out, session persistence across refresh
- [ ] Forms: submission succeeds, validation errors display correctly, data persists to Supabase
- [ ] Data displayed matches what's in Supabase (spot-check a few records)

## Responsive & Cross-Browser
- [ ] Desktop layout (Chrome, latest)
- [ ] Mobile layout (representative viewport width)
- [ ] Safari (known for stricter CSS/JS behavior differences)

## Performance
- [ ] Initial load time reasonable (no unexpected large bundle regressions)
- [ ] No obvious layout shift (CLS) on load

## Accessibility (baseline)
- [ ] Interactive elements reachable via keyboard
- [ ] Images have alt text where meaningful
- [ ] Sufficient color contrast on key text

## Regression Check
- [ ] Previously fixed bugs relevant to this release area re-verified as still fixed
- [ ] No unrelated area visibly broken by this change

## Sign-off
| Item | Status | Notes |
|---|---|---|
| QA pass completed by | | |
| Date | | |
| Preview URL tested | | |
| Approved for production | Yes / No | |
