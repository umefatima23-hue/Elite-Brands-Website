# Admin Guide: Settings

## Overview

Administrative configuration options, if the application exposes any store-level settings beyond catalog/order data.

> This should match the project's implementation — the presence and scope of a settings area is unconfirmed.

## Possible Settings Areas

- Store contact/business information
- Admin user management (inviting/removing admins, if supported)
- Notification preferences (e.g., low-stock alert thresholds)
- Integration configuration (payment provider keys, if managed in-app rather than via environment variables)

## Access

Settings changes are expected to be restricted to admin users only, consistent with the access model in `../api/authentication.md` and `../api/admin.md`.

## Related Documentation

- `../api/admin.md`
- `../api/authentication.md`
- `dashboard.md`
