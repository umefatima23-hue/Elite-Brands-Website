# Incident Response

## Severity Levels
| Level | Definition | Example | Response Time Target |
|---|---|---|---|
| SEV-1 | Site fully down or data loss/corruption | Production 500s, database unreachable | Immediate |
| SEV-2 | Major feature broken, no full outage | Auth broken, checkout/lead form failing | Within 1 hour |
| SEV-3 | Minor issue, workaround exists | Cosmetic bug, slow non-critical page | Within 1-2 business days |

## Immediate Response Steps (SEV-1 / SEV-2)
1. **Acknowledge**: confirm the alert/report and assign an owner.
2. **Assess scope**: is it code, data, infrastructure (Vercel/Supabase outage), or third-party?
3. **Check status pages**: Vercel status, Supabase status, before assuming it's application-level.
4. **Mitigate first, root-cause later**:
   - If caused by a recent deploy → rollback immediately (`DEPLOYMENT_GUIDE.md`)
   - If data corruption → do not write further; assess restore options (`BACKUP_RECOVERY.md`)
5. **Communicate**: notify relevant stakeholders/team with current status and ETA if known.
6. **Verify resolution**: confirm the fix against the original symptom, not just that logs look quiet.

## Post-Incident
- [ ] Write a brief incident summary: what happened, impact, timeline, root cause, fix applied
- [ ] Identify preventive action (monitoring gap, missing test, process gap)
- [ ] Update relevant runbooks/checklists in `production-assets/` if the incident revealed a gap
- [ ] Track preventive action items to completion, not just as a note

## Incident Log Template
```
Date:
Severity:
Detected via: (monitoring alert / user report / manual discovery)
Time to acknowledge:
Time to mitigate:
Time to full resolution:
Root cause:
Fix applied:
Preventive action items:
```

## Escalation Contacts
Maintain a current contact list (outside this file, in a secure location) for:
- Primary technical owner
- Vercel account admin
- Supabase account admin
- Domain/DNS registrar access holder
