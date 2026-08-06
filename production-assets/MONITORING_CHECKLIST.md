# Monitoring Checklist

## Uptime Monitoring
- [ ] External uptime monitor configured against the production URL (e.g. checks every 1-5 minutes)
- [ ] Alert channel configured (email/SMS/Slack/WhatsApp) for downtime detection
- [ ] Historical uptime tracked to spot recurring patterns (e.g. deploy-time blips)

## Error Tracking
- [ ] Frontend error tracking in place to catch unhandled JS exceptions in production
- [ ] Errors tagged with release/deployment version for correlation
- [ ] Alert threshold set so error spikes trigger notification, not just silent logging

## Performance Monitoring
- [ ] Core Web Vitals tracked (LCP, CLS, INP) for the production site
- [ ] Vercel Analytics (or equivalent) reviewed periodically for regressions
- [ ] Slow Supabase queries identified via Supabase dashboard query performance insights

## Supabase-Specific Monitoring
- [ ] Database connection/usage limits monitored against plan quota
- [ ] Storage bucket usage monitored against quota
- [ ] Auth failure rate monitored (spike may indicate credential stuffing or outage)

## Dashboards
- [ ] Central dashboard (or bookmarked set of dashboards) reviewed on a regular cadence — not just when something breaks
- [ ] Key metrics defined: uptime %, error rate, average response time, active users

## Alert Routing
| Alert Type | Severity | Notify Via |
|---|---|---|
| Site fully down | Critical | Immediate (call/SMS/WhatsApp) |
| Error rate spike | High | Immediate (Slack/WhatsApp) |
| Performance degradation | Medium | Daily digest |
| Quota approaching limit | Medium | Weekly review |

## Review Cadence
- [ ] Weekly: review error and performance trends
- [ ] Monthly: review uptime history and quota usage against Supabase/Vercel plan limits
