---
title: "AUDIT: Home Page Rendering Architecture"
stage: AUDIT
agent: evidence-collector
timestamp: 2026-08-01T20:38:00Z
---

## Scope

Evaluate the current architecture of Molino's Home page and detect possible UX, state, rendering, or motion risks.

## Evidence Collected

### Visual Evidence
- `.artifacts/audit/evidence/home-dev-desktop.png` - Dev server, with profile
- `.artifacts/audit/evidence/home-dev-mobile.png` - Dev server mobile, with profile
- `.artifacts/audit/evidence/home-dev-noprofile.png` - Dev server, without profile
- `.artifacts/audit/evidence/home-prod-noprofile.png` - Prod server, without profile
- `.artifacts/audit/evidence/home-prod-profile.png` - Prod server, with profile

### Environment
- Dev server: `npm run dev` on port 3000 (clean `.next` rebuild)
- Prod server: `npm start` on port 3001 (after `npm run build`)
- Browser: Chromium (Playwright)
- Viewports: 1440x900 desktop, 375x812 mobile
- localStorage: Set and cleared as needed

### Test Scenarios

| Scenario | Profile in localStorage | Result |
|---|---|---|
| Dev, no profile | No | Shows personalizedContentText: true |
| Dev, with profile | Yes | Shows personalizedContentText: true |
| Prod, no profile | No | Shows personalizedContentText: true |
| Prod, with profile | Yes | Shows personalizedContentText: true |

### Observed Issues

**Issue 1: genericTextPresent is FALSE in all scenarios**
- The "GenericHome" text indicators were NOT found in any test scenario.
- `personalizedTextPresent` was TRUE in all scenarios.
- Interpretation: Either (a) the bug has been fixed by the existing git diff, or (b) the QA that reported the bug was using different detection criteria.

**Issue 2: DOM analysis inconclusive**
- Unable to reliably count GenericHome and PersonalizedHome elements due to class names not matching expected patterns.
- Body text analysis shows same content regardless of profile presence.

### Conclusion

The Home page rendering behavior could NOT be confirmed as broken based on current evidence. The existing motion.div with keys approach (already in git diff) may have resolved the AnimatePresence issue before this audit was started.

Further investigation via code analysis is required.
