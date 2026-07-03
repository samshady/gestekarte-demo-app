# Soll-Prozess Implementation Plan

Based on the redesigned process where the host initiates the invitation and the process flows through multiple parties.

---

## Priority Order

1. **Schema** — Add new status `INVITED`, new fields for signatures, provisioning, roles
2. **Role system** — Simple context-based role switching for development/demo
3. **Host-initiated invite** — New `/invite` page
4. **Guest completes application** — Guest fills details via invite link
5. **Digital signatures** — Guest confirms, host signs on approval
6. **ITZ provisioning dashboard** — `/itz` page for processing services
7. **Dashboard sections** — Current guests, upcoming, extensions
8. **PDF export** — Include signatures
9. **Seed data** — Representative entries for each role

---

## Schema Changes

### New Status
- `INVITED` — host sent an invitation, guest hasn't completed yet

### New Fields on `GuestApplication`
| Field | Type | Default | Purpose |
|-------|------|---------|---------|
| `invitedBy` | String? | null | Host name/email who initiated |
| `guestSignedAt` | DateTime? | null | When guest confirmed their data |
| `hostSignedAt` | DateTime? | null | When host signed liability |
| `hostSignature` | String? | null | Typed name or signature data |
| `wlanProvisioned` | Boolean | false | ITZ created WLAN credentials |
| `libraryProvisioned` | Boolean | false | ITZ created library account |
| `provisionedAt` | DateTime? | null | When ITZ processed |

### Status Flow
```
INVITED → (guest fills + signs) → PENDING_HOST → (host approves + signs) → APPROVED → ...
                                                          │
                                                    DEACTIVATED / EXPIRED / REJECTED
```

---

## Role System

Simple cookie-based or context-based role switching for the prototype:

| Role | Description | Pages |
|------|-------------|-------|
| `ROLE_HOST` | Professor / Betreuer | `/host-approval/[id]`, `/dashboard` |
| `ROLE_ITZ` | IT Zentrum | `/itz` (provisioning dashboard) |
| `ROLE_IO` | International Office | `/dashboard`, `/statistics` |
| `ROLE_ULB` | Library admin | `/dashboard`, `/statistics` |

A role selector in the header allows switching between roles for demo purposes.

---

## Pages to Create

| Route | Purpose |
|-------|---------|
| `/invite` | Host fills form to invite a guest (name, email, dates, host name) |
| `/apply/[token]` | Guest fills their details after receiving invite (guest name, DOB, addresses, photo, signature) |
| `/itz` | ITZ dashboard showing applications ready for provisioning |

---

## Dashboard Sections

Split the existing single table into:

1. **Currently in Halle** — guests with `APPROVED` status and `arrivalDate <= today <= departureDate`
2. **Upcoming arrivals** — guests with `arrivalDate > today` (any status except expired/rejected)
3. **Pending host approval** — `PENDING_HOST` status
4. **Past / archived** — `EXPIRED`, `DEACTIVATED`, `REJECTED` statuses

---

## Implementation Order

### Phase 1: Foundation
1. Update Prisma schema with new status + fields
2. Run migration + regenerate client
3. Add role context provider
4. Add role selector in header
5. Update NavLinks to show role-appropriate links

### Phase 2: Invite Flow
6. Create `/invite` page for hosts
7. Create invite server action (creates application with `INVITED` status)
8. Create `/apply/[token]` page for guest to complete their details
9. Add guest signature checkbox + timestamp

### Phase 3: Host Signature + ITZ
10. Add host signature input to approval form
11. Create `/itz` provisioning page
12. Add ITZ server actions (provision WLAN, library)

### Phase 4: UX Improvements
13. Split dashboard into sections
14. Update PDF export with signatures
15. Update seed data
