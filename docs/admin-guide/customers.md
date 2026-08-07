# Admin Guide: Customers

## Overview

How administrators view customer accounts and their associated order history.

> This should match the project's implementation for exact fields shown and whether customer editing (vs. read-only viewing) is supported.

## Viewing Customers

- Admins are expected to be able to view a list of registered customers, with basic profile info (name, email, registration date).
- Selecting a customer is expected to show their order history, cross-referencing `../api/orders.md`.

## Customer Data Privacy

- Only fields necessary for order fulfillment/support should be visible to admins; broader account security fields (password hashes, etc.) are managed entirely by Supabase Auth and are not directly editable through this admin surface.

## Related Documentation

- `../api/authentication.md`
- `orders.md`
- `../qa/security-tests.md`
