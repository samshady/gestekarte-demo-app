# MLU Halle Gästekartenportal — Guest Card Portal

A bilingual (DE/EN) Next.js web application for managing guest cards at Martin Luther University Halle-Wittenberg. Guests can apply for a guest card, check their application status, and hosts/admins can approve, manage services, and view statistics.

---

## Table of Contents

1. [Tech Stack](#tech-stack)
2. [Getting Started](#getting-started)
3. [Project Structure](#project-structure)
4. [Routes & Pages](#routes--pages)
5. [API Routes](#api-routes)
6. [Data Model](#data-model)
7. [Business Logic & Status Flow](#business-logic--status-flow)
8. [Roles & Permissions](#roles--permissions)
9. [Numbering System](#numbering-system)
10. [Service Toggles & Provisioning](#service-toggles--provisioning)
11. [Application Flows](#application-flows)
12. [Language System](#language-system)
13. [Color Palette & Styling](#color-palette--styling)
14. [Image Assets](#image-assets)
15. [Database & Migrations](#database--migrations)
16. [Key Components](#key-components)
17. [Business Rules](#business-rules)

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16.2.6 (Turbopack) |
| UI Library | React 19.2.4 |
| Styling | Tailwind CSS v4 + shadcn/ui components |
| Database | SQLite via Prisma 7 + LibSQL adapter |
| Charting | Recharts 3.8 |
| PDF Export | jsPDF 4.2 |
| Carousel | Embla Carousel (via shadcn/ui) |
| Icons | Lucide React |
| Language | Custom React Context (DE/EN) |
| Role System | Custom React Context |

---

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Database setup

```bash
npx prisma db push          # Sync schema to SQLite
npx tsx prisma/seed.ts       # Seed sample data (12 entries)
```

---

## Project Structure

```
src/
  app/
    page.tsx                     # Landing page (carousels, CTAs)
    layout.tsx                   # Root layout (header, nav, footer, lang toggle, role selector)

    apply/
      page.tsx                   # Application page (new + extend toggle)
      ApplyForm.tsx              # New application form (salutation, nationality, services opt-in)
      ExtendForm.tsx             # Extend existing card by reference number
      actions.ts                 # submitApplication server action
      extendActions.ts           # lookupApplication + extendApplication actions
      success/page.tsx           # Success confirmation with application number
      [id]/
        page.tsx                 # Guest completes profile after invite
        actions.ts               # completeApplication server action
        success/page.tsx         # Guest confirmation page

    dashboard/
      page.tsx                   # Role-aware admin dashboard (stats, sections, table)
      StatsCards.tsx             # Icon-labeled stat cards
      DashboardHeading.tsx       # Page title + subtitle (shows host filter)
      ApplicationsTable.tsx      # Sortable table, hostView mode, export
      ExtendCardSection.tsx      # Form to extend card expiry by number
      GuestsCurrentlyHere.tsx    # Current guests + upcoming arrivals sections
      actions.ts                 # extendApplicationExpiry server action

    host-approval/[id]/
      page.tsx                   # Server component, passes hostView param
      ApprovalDetail.tsx         # Full guest data, services, status cards
      ApprovalForm.tsx           # Liability checkbox + digital signature + approve
      actions.ts                 # approveApplication, toggleService, deactivateCard, reactivateCard, rejectApplication

    invite/
      page.tsx                   # Host invitation form (guest email + host details)
      actions.ts                 # inviteGuest server action
      success/page.tsx           # Invitation confirmation

    admin/
      page.tsx                   # ITZ admin panel (provisioning dashboard)
      AdminDashboard.tsx         # WLAN + Library provision/revoke per guest
      actions.ts                 # provisionWlan, provisionLibrary, provisionAll, revokeWlan, revokeLibrary

    ulb-admin/
      page.tsx                   # ULB library management page
      UlbDashboard.tsx           # Library-only provision/revoke per guest
      actions.ts                 # ulbProvisionLibrary, ulbRevokeLibrary

    status/
      page.tsx                   # Guest-facing status lookup by number

    statistics/
      page.tsx                   # Admin stats dashboard (IO/ULB only)
      StatsCards.tsx             # Icon-labeled stat cards
      StatusChart.tsx            # Donut chart (Recharts PieChart)
      MonthlyChart.tsx           # Bar chart, last 12 months (Recharts BarChart)
      ApplicationTimeline.tsx    # Recent applications timeline

    contact/
      page.tsx                   # Contact info for ULB, IO, Georg-Forster-Haus, MLU

    api/
      applications/[id]/route.ts # GET single application by UUID
      applications/search/route.ts # GET search by applicationNumber or guestNumber

  components/
    NavLinks.tsx                 # Role-aware navigation (Guest/Admin sections)
    LanguageToggle.tsx           # DE / EN switch
    RoleSelector.tsx             # Role selector (Host/ITZ/IO/ULB)
    ImageCarousel.tsx            # Reusable image carousel (Embla)
    Footer.tsx
    ui/                          # shadcn components

  lib/
    language.tsx                 # React Context for DE/EN
    role.tsx                     # React Context for role (ROLE_HOST, ROLE_ITZ, ROLE_IO, ROLE_ULB)
    prisma.ts                    # Prisma client singleton
    exportPdf.ts                 # PDF generation utility (jsPDF)
```

---

## Routes & Pages

| Route | Access | Purpose |
|-------|--------|---------|
| `/` | Public | Landing page with city and university carousels, CTAs |
| `/apply` | Public | New application form or extend existing card |
| `/apply/success` | Public | Confirmation with application number |
| `/apply/[id]` | Public (link) | Guest completes profile after host invitation |
| `/apply/[id]/success` | Public | Guest completion confirmation |
| `/status` | Public | Lookup application status by number |
| `/contact` | Public | Contact information for ULB, IO, GFH, MLU |
| `/invite` | Host | Host invitation form |
| `/invite/success` | Host | Invitation sent confirmation |
| `/dashboard` | All admins | Role-aware dashboard (filtered for Host) |
| `/host-approval/[id]` | All admins | Guest detail, service toggles, approve/reject |
| `/admin` | ITZ | Provisioning dashboard (WLAN + library) |
| `/ulb-admin` | ULB | Library-only management |
| `/statistics` | IO, ULB | Charts and historical data |

---

## API Routes

### `GET /api/applications/[id]`

Returns full application data by UUID. Used by the dashboard export button.

### `GET /api/applications/search?ref=<number>`

Searches by `applicationNumber` (A-XXXX) or `guestNumber` (G-XXXX). Used by the guest status page.

---

## Data Model

**`GuestApplication`** (SQLite, Prisma ORM)

| Field | Type | Default | Description |
|-------|------|---------|-------------|
| `id` | String (UUID) | auto | Internal primary key |
| `guestName` | String | — | Full name |
| `guestSalutation` | String? | null | Anrede (Herr/Frau/Dr./Prof. Dr.) |
| `nationality` | String? | null | Staatsangehörigkeit |
| `guestEmail` | String | — | Email address |
| `dateOfBirth` | DateTime | — | Date of birth |
| `homeAddress` | String | — | Home address |
| `halleAddress` | String | — | Address in Halle |
| `arrivalDate` | DateTime | — | Stay start |
| `departureDate` | DateTime | — | Stay end |
| `photoUrl` | String | — | Passport photo path |
| `hostName` | String | — | Responsible host |
| `hostSalutation` | String? | null | Host salutation |
| `hostEmail` | String? | null | Host email |
| `hostFaculty` | String? | null | Fakultät / Institut |
| `hostPhone` | String? | null | Office phone |
| `costCenter` | String? | null | Kostenstelle |
| `status` | Status enum | PENDING_HOST | Current lifecycle state |
| `wlanAccess` | Boolean | false | Eduroam WLAN requested? |
| `libraryAccess` | Boolean | false | ULB library requested? |
| `mensaPayments` | Boolean | true | NFC mensa payments (auto) |
| `vpnAccess` | Boolean | false | External VPN (always excluded) |
| `databaseAccess` | Boolean | false | On-site database access (included with library) |
| `cardActive` | Boolean | true | Card is operational |
| `referenceNumber` | String? | null | Legacy field (unused) |
| `applicationNumber` | String? | null | Generated on submit: `A-NNNN` |
| `guestNumber` | String? | null | Generated on approval: `G-NNNN` |
| `invitedBy` | String? | null | Host who sent the invitation |
| `guestSignedAt` | DateTime? | null | Guest digital signature timestamp |
| `hostSignedAt` | DateTime? | null | Host digital signature timestamp |
| `hostSignature` | String? | null | Host typed signature (full name) |
| `wlanProvisioned` | Boolean | false | ITZ has provisioned WLAN |
| `libraryProvisioned` | Boolean | false | ITZ/ULB has provisioned library |
| `provisionedAt` | DateTime? | null | When ITZ processed |
| `createdAt` | DateTime | now() | Timestamp |
| `updatedAt` | DateTime | auto | Timestamp |

### Status Enum

| Value | Meaning | Can transition to |
|-------|---------|-------------------|
| `INVITED` | Host sent invitation, guest hasn't completed | `PENDING_HOST` |
| `PENDING_HOST` | Guest data complete, waiting for host approval | `APPROVED`, `REJECTED` |
| `APPROVED` | Host approved, card active, services can be provisioned | `DEACTIVATED`, `EXPIRED` |
| `DEACTIVATED` | Card manually deactivated, all services off | `APPROVED` (via reactivate) |
| `EXPIRED` | Stay ended, terminal state | — |
| `REJECTED` | Host rejected application, terminal state | — |

---

## Business Logic & Status Flow

```
                     ┌──────────────────────────┐
                     │  HOST INVITES GUEST       │
                     │  (/invite) → INVITED      │
                     └────────┬─────────────────┘
                              │ Guest receives link
                              ▼
                     ┌──────────────────────────┐
                     │  GUEST COMPLETES DETAILS │
                     │  (/apply/[id])           │
                     │  + signs digitally       │
                     └────────┬─────────────────┘
                              │ Status: PENDING_HOST
                              ▼
   ┌───────────────────────────────────────────────┐
   │                                               │
   ▼                                               ▼
┌──────────────┐                          ┌──────────────────┐
│ GUEST APPLIES│                          │                  │
│ DIRECTLY     │                          │                  │
│ (/apply)     │                          │                  │
│ → PENDING    │                          │                  │
└──────┬───────┘                          │                  │
       │                                  │                  │
       └──────────┬───────────────────────┘                  │
                  ▼                                          │
       ┌─────────────────────┐                               │
       │ HOST REVIEWS        │                               │
       │ Approves (signs) or │                               │
       │ Rejects             │                               │
       └──┬──────────────┬───┘                               │
          │              │                                   │
          ▼              ▼                                   │
   ┌──────────┐   ┌──────────┐                               │
   │ APPROVED │   │ REJECTED │ (terminal)                    │
   └────┬─────┘   └──────────┘                               │
        │                                                    │
        ├──────────────────────────────────────────┐         │
        │              │                            │         │
        ▼              ▼                            ▼         │
   ┌──────────┐  ┌──────────┐              ┌──────────┐      │
   │ ITZ      │  │ ULB      │              │ HOST     │      │
   │ provisions│  │ provisions│             │ manages  │      │
   │ WLAN     │  │ Library  │              │ services │      │
   └──────────┘  └──────────┘              └────┬─────┘      │
        │              │                        │            │
        └──────────────┘                        ▼            │
                                      ┌──────────────┐      │
                                      │ Deactivate    │      │
                                      │ → DEACTIVATED │      │
                                      │ Reactivate    │      │
                                      │ → APPROVED    │      │
                                      └──────────────┘      │
                                             │               │
                                             ▼               │
                                      ┌──────────────┐      │
                                      │ EXPIRED      │      │
                                      │ (terminal)   │      │
                                      └──────────────┘      │
                                                             │
                                                             │
   GUEST CAN CHECK STATUS AT ANY POINT VIA /status           │
   IO/ULB CAN VIEW DASHBOARD + STATISTICS                    │
   ITZ CAN PROVISION/REVOKE SERVICES IN /admin               │
```

### Key Rules

1. **INVITED**: Guest hasn't completed their profile yet. No services accessible.
2. **PENDING_HOST**: Guest has submitted. Host can approve (with liability checkbox + digital signature) or reject.
3. **APPROVED**: Guest number generated. Services can be toggled by Host. ITZ/ULB can provision WLAN/Library.
4. **DEACTIVATED**: All services disabled. Can be reactivated (returns to `APPROVED`, all services re-enabled).
5. **REJECTED**: Terminal. Cannot be approved or reactivated.
6. **EXPIRED**: Terminal. Services forced to inactive in UI.
7. Services card is hidden for PENDING_HOST, REJECTED, EXPIRED, and host read-only view.

---

## Roles & Permissions

| Role | Label | Dashboard view | Can invite? | Can approve? | Can manage services? | Can provision |
|------|-------|---------------|-------------|--------------|---------------------|---------------|
| **Guest** | (public) | — | No | No | No | No |
| **Host** | `ROLE_HOST` | Filtered to own guests (table + extend) | Yes | Yes (with signature) | Yes (toggle WLAN/Library) | No |
| **ITZ** | `ROLE_ITZ` | Full (stats + current/upcoming) | No | No | No | WLAN + Library |
| **IO** | `ROLE_IO` | Full + statistics | No | No | No | No |
| **ULB** | `ROLE_ULB` | Full + statistics | No | No | No | Library only |

### NavLink visibility

| Link | Host | ITZ | IO | ULB |
|------|------|-----|----|-----|
| Apply | ✓ | ✓ | ✓ | ✓ |
| Status | ✓ | ✓ | ✓ | ✓ |
| Contact | ✓ | ✓ | ✓ | ✓ |
| Dashboard | ✓ (filtered) | ✓ | ✓ | ✓ |
| Invite | ✓ | — | — | — |
| Admin | — | ✓ | — | — |
| Library | — | — | — | ✓ |
| Statistics | — | — | ✓ | ✓ |

---

## Numbering System

| Type | Format | Generated | When | Purpose |
|------|--------|-----------|------|---------|
| Application number | `A-NNNN` | On form submit | Guest applies or host invites | Used by applicants to check pending status |
| Guest number | `G-NNNN` | On host approval | Host approves | Permanent guest identifier for approved cards |

- The status lookup page (`/status`) accepts **both** formats via `OR` query
- The dashboard table shows `guestNumber ?? applicationNumber`
- The extension form accepts either number

---

## Service Toggles & Provisioning

### Service states

| Service | DB Field | Default | Guest can request? | Provisioned by | Requires terms? |
|---------|----------|---------|-------------------|----------------|-----------------|
| WLAN (eduroam) | `wlanAccess` | false | Yes (opt-in checkbox) | ITZ sets `wlanProvisioned` | Yes (ITZ terms PDF) |
| Library (ULB) | `libraryAccess` | false | Yes (opt-in checkbox) | ITZ or ULB sets `libraryProvisioned` | Yes (ULB terms PDF) |
| Mensa (NFC) | `mensaPayments` | true | Automatic (always on) | — | No |
| VPN | `vpnAccess` | false | Legally excluded for guests | — | — |
| Database/Research | `databaseAccess` | false | On-site only at ULB (included with library) | — | — |

### Provisioning flow

```
Guest requests WLAN → Host approves → ITZ sees in /admin → ITZ clicks "Provision"
Guest requests Library → Host approves → ITZ/ULB sees in /admin or /ulb-admin → Clicks "Provision"
```

- **ITZ Admin Panel** (`/admin`): Shows all APPROVED guests with individual WLAN and Library rows. Each row shows "Requested by guest" / "Not requested" + "Provisioned" / "Not provisioned" status. Buttons: Provision (blue) or Revoke (red).
- **ULB Admin Panel** (`/ulb-admin`): Shows only guests who requested library access. Can provision or revoke library only.
- **Guest detail page**: Shows "not yet provisioned by ITZ" hint below WLAN/Library if the guest applied but ITZ hasn't acted yet.

### Mensa display

Mensa is shown as a static green row with a checkmark and a fake balance of €42,00. Not toggleable.

---

## Application Flows

### Path A: Direct Application (Guest → Host → Approval)

1. Guest fills `/apply` with personal data, salutation, nationality, dates, host name, services opt-in with terms acceptance
2. Guest submits → status `PENDING_HOST`, application number `A-NNNN` generated
3. Success page shows application number with link to `/status`
4. Host sees application in dashboard, reviews at `/host-approval/[id]`
5. Host checks liability checkbox, types digital signature, approves → status `APPROVED`, guest number `G-NNNN`
6. ITZ provisions services in `/admin`

### Path B: Invitation Flow (Host → Guest → Host → Approval)

1. Host fills `/invite` with guest email, dates, and own contact details (salutation, email, faculty, phone, cost center)
2. Host submits → status `INVITED`, application number `A-NNNN`
3. Guest receives link to `/apply/[id]`, fills personal data, services opt-in, signs digitally
4. Guest submits → status `PENDING_HOST`, `guestSignedAt` set
5. Host approves → same as Path A step 5-6

### Post-Approval

- **Host**: Can toggle WLAN/Library on/off, deactivate card, reactivate card, extend stay, export PDF
- **ITZ**: Can provision/revoke WLAN and Library
- **ULB**: Can provision/revoke Library only
- **IO**: Read-only dashboard + statistics
- **Guest**: Can check status at `/status` with A-XXXX or G-XXXX

### Business constraints

- Applications must be submitted at least **14 days** before guest arrival
- Maximum stay duration is **one semester** (~6 months)
- These constraints are shown as info banners on all application forms

---

## Language System

Simple React Context (`src/lib/language.tsx`):

- `LanguageProvider` wraps the entire app in `layout.tsx`
- `useLanguage()` hook provides:
  - `lang`: `'de'` | `'en'`
  - `setLang(lang)`: toggle
  - `t(germanText, englishText)`: returns the active language string

All user-facing text is wrapped in `t()`. Default language is German.

---

## Color Palette & Styling

| Usage | Hex | Role |
|-------|-----|------|
| Background | `#FFFFFF` | Page background |
| Body text | `#1A1A1A` | Primary text |
| Header/footer chrome | `#252C27` | Dark elements |
| Primary accent | `#9FBF47` | Buttons, headers, active indicators |
| Surface / borders | `#E8EAE5` | Card backgrounds, dividers |
| Muted text | `#5A5A5A` | Secondary labels |
| Links | `#295A97` | Blue links, info badges |
| Disabled / placeholder | `#BBB5A9` | Inactive elements |
| Dark accent | `#6B5242` | REJECTED status |
| Icon containers | `#DADDD8` | Image placeholders |
| Light backgrounds | `#F7F8F5` | Welcome message cards |
| PENDING_HOST | `#f5a623` | Status badge (yellow) |
| APPROVED | `#27ae60` | Status badge (green) |
| DEACTIVATED | `#928781` | Status badge (gray) |
| REJECTED | `#6B5242` | Status badge (brown) |
| EXPIRED | `#e74c3c` | Status badge (red) |
| INVITED | `#295A97` | Status badge (blue) |

The app uses the **Helvetica** font family throughout. Cards use `border-0 shadow-sm` for a modern flat design.

---

## Image Assets

All images are in `public/site-assets/` organized by section:

| Folder | Content | Type |
|--------|---------|------|
| `Halle/` | Cityscapes, landmarks, culture | Carousel (20 images) |
| `MLU/` | University buildings, campus | Carousel (6 images) |
| `IO/` | International Office team photo | Single image |
| `Georg_Forster_Haus/` | Guest house rooms, facilities, events | Carousel (23 images) |
| `ULB/` | Library interiors, exteriors, collections | Carousel (29 images) |
| Root | `mlu-logo-name.jpg`, `uni_halle_logo.jpg` | Header logos |

Header uses `uni_halle_logo.jpg` (circular insignia, `unoptimized` for sharpness) and `mlu-logo-name.jpg` (university name).

The `ImageCarousel` component uses Embla (via shadcn/ui):
- **Multiple images**: Prev/next buttons with smooth slide animation (400ms), dot indicators, auto-advance (5s)
- **Single image**: Static display, no controls
- Small dots variant (`smallDots` prop) for facility cards

---

## Database & Migrations

```bash
# After schema changes:
npx prisma migrate dev --name <description>

# Reset and re-seed:
rm -f dev.db && npx prisma db push --accept-data-loss && npx tsx prisma/seed.ts

# Regenerate client:
npx prisma generate
```

The Prisma client is generated to `src/generated/prisma/` (custom output path configured in `schema.prisma`).

### Seed data

The seed file (`prisma/seed.ts`) creates 12 entries covering all statuses:
- 2 active (currently in Halle), 2 upcoming approved, 3 pending host, 2 invited, 1 expired, 1 deactivated, 1 rejected
- Uses relative dates (`daysFromNow()`) so entries stay current
- Signatures, provisioning status, and application/guest numbers populated

---

## Key Components

### ImageCarousel
- **Props**: `images: { src, alt }[]`, `height`, `smallDots`, `className`
- Uses Embla Carousel via shadcn's `ui/carousel.tsx`
- Smooth 400ms slide animation, auto-loop with 5s interval
- `sizes` prop set for responsive image optimization

### Dashboard ApplicationsTable
- Sortable by name, dates, status
- Status badges with traffic-light coloring per status
- Host view mode (`hostView=true`): shows only guest list + extend, no export/links
- Non-host view: includes Host column, export button, name links to detail page
- Link behavior: Host links go to `?hostView=true`, other roles go to standard view

### ApprovalDetail (host-approval page)
- **Props**: `id`, `hostView`, `application` (all data including signatures)
- **Guest Data card**: Always visible. Shows Export button for IO/ITZ/ULB when `!hostView && status !== 'APPROVED'`
- **Status banners**: Conditional based on status (deactivated red, rejected brown, expired red)
- **Services card**: Hidden for PENDING_HOST, REJECTED, EXPIRED, and hostView
- **Approval card** (PENDING_HOST + hostView): Liability checkbox + host signature input + approve/reject
- **Reject + export**: Available in host view for pending applications
- Export uses `generatePdf` passing signatures for PDF inclusion

### AdminDashboard (ITZ)
- Individual rows per guest for WLAN and Library
- Each row shows: icon, requested status, provisioned status, action buttons
- Actions: Provision (blue) or Revoke (red)
- Sorted by arrival date (stable ordering)

### UlbDashboard (ULB)
- Shows only guests who applied for library access
- Provision/Revoke for library only
- Sorted alphabetically by guest name

### Statistics page
- 7 stat cards with icons (Total, Pending, Active, Deactivated, Expired, Rejected, Invited)
- Donut chart for status distribution
- Bar chart for monthly applications (last 12 months, includes 0-value months)
- Recent applications timeline with color-coded status indicators

---

## Business Rules

- **WLAN and Library**: Opt-in checkboxes with mandatory terms acceptance (linked to ITZ/ULB PDFs)
- **Mensa**: Automatically enabled, shows fake balance, not toggleable
- **VPN**: Legally excluded for all guests, displayed as inactive info row
- **Database access**: Included with library card, not listed separately
- **Service toggles**: Only for APPROVED cards with cardActive=true. Host can toggle guest's application wish. ITZ/ULB provisioning is separate.
- **Export as PDF**: Available in guest data card (for non-APPROVED), services card (for APPROVED), and approval card (for host view)
- **PDF includes**: Guest/host signatures, provisioning status, all personal data
- **Card deactivation**: Sets all services to false, status to DEACTIVATED
- **Card reactivation**: Re-enables all services, status back to APPROVED
- **Extension**: By reference/guest number + new departure date. Looks up by `applicationNumber` or `guestNumber`.
- **Pending applications**: Cannot deactivate card. Only "Reject" option is available.
- **Host dashboard**: Filtered to own guests via `?host=` search param. Shows table + extend form. No stats/current guests/upcoming sections.
- **Host view** (`hostView=true`): Read-only guest details. Can approve/reject but cannot manage services or deactivate.
- **REJECTED and EXPIRED**: Terminal states. No reactivation possible.
- **INVITED status**: Host sent invite, guest hasn't completed profile. Shows email in dashboard as fallback name.
- **14-day advance**: Constraint displayed on all application forms
- **1-semester max**: Maximum stay duration enforced via info banner
