# Phase 1 - Discovery Report

**Project:** Genesis Tax Solutions LLC (public branding: Genesis Tax & Notary Solutions)  
**Date:** 2026-11-21  
**Status:** Discovery complete; public website foundation in progress

---

## 1. Requirements & Source-Reference Analysis

### Sources inspected

| Source | Role | Status |
|--------|------|--------|
| Client requirements email | Functional requirements (website, admin, Mailchimp, deploy) | Primary |
| Master Cursor prompt | Architecture, security, SEO, acceptance criteria | Primary technical |
| Homepage mockup image | Visual design target | Primary visual |
| `/images` branding assets | Logo motifs, portraits, service graphics, Jacksonville | Brand identity |
| Existing site `https://gtsnotarytax.com` | Services, contact facts, content reference | Reference only |

### Confirmed business facts (safe to publish)

- Legal entity: Genesis Tax Solutions LLC
- Public brand: Genesis Tax & Notary Solutions
- Owner / face of brand: Maxcieen Telford
- Office: 7052 103rd St, Suite E301, Jacksonville, FL 32210 (located inside U-Haul / adjacent to I-295 per branding)
- Mailing: P.O. Box 47013, Jacksonville, FL 32247
- Phone: (904) 930-8065
- Fax (existing site): (904) 664-8180
- Email (existing site + branding): gtsolutions@pm.me
- Social: Facebook, Instagram, Snapchat, TikTok, X (URLs provided)
- Services referenced on live site: Tax Preparation, IRS Support, Notary Public, IRS Audit Support, Penalty Abatement, Virtual & In-Person Support

### Conflicts / unverified claims (do not silently invent)

| Item | Conflict / risk | Recommendation |
|------|-----------------|----------------|
| Suite number | Brief/branding: **E301**; live site: **Suite 301** | Confirm with client; default to **E301** from brief until confirmed |
| Cell phone | Branding shows **(904) 423-7834**; brief does not | Confirm whether to publish on Contact |
| Email casing | Branding `GTSOLUTIONS@PM.ME` vs lowercase | Publish as `gtsolutions@pm.me`; confirm before launch |
| “Serving Clients Nationwide” | In mockup + marketing graphic; not in legal brief | Soften until verified (e.g. “Virtual & in-person options”) or confirm |
| NY & CT tax filing registration | Marketing graphic claims registration | Confirm before publishing as credential |
| Notary offerings (RON, Apostilles, Loan Signings) | On promotional graphic; not on live site | Confirm qualifications/availability before service page claims |
| “Pay nothing upfront” | Marketing flyer only | Treat as optional promo; do not hardcode on homepage |
| IRS representation / audit support | Live site claims representation | Confirm licensing/PTIN/Enrolled Agent status before strong claims |
| Hibiscus logo vs circular rose-gold logo | Multiple logo treatments in assets | Use circular GTS + hibiscus treatment matching mockup header |

### Reference priority applied

1. Client email (features & business details)  
2. Master prompt (security, stack, process)  
3. Mockup (visual system)  
4. Branding images  
5. Existing website (content/services)

---

## 2. Recommended Architecture

```
Next.js 16 (App Router) + TypeScript + Tailwind CSS 4
├── Public site (SSR/SSG pages, SEO, forms)
├── Admin app under /admin (secure, noindex)
├── Route Handlers / API for mutations
├── PostgreSQL + Prisma ORM
├── Zod validation on all inputs
├── Auth: server-side sessions (httpOnly cookies) + bcrypt password hashing
├── Mailchimp Marketing API (server-only) for email + SMS where enabled
└── Transactional email (Resend or SMTP) for booking/ops notifications
```

**Hosting recommendation:** Vercel (or similar Node host) + managed Postgres (Neon/Supabase/Railway). Keep current GoDaddy site live until cutover. Preserve MX/SPF/DKIM/DMARC.

**Security highlights**

- Setup code `0000` validated server-side only; invalidated after first admin password creation
- Rate-limited login + setup
- No secrets in client bundles
- CSRF-safe mutations; RBAC for admin actions
- Audit log for sensitive admin operations

---

## 3. Proposed Folder Structure

```
web/
├── docs/                      # Discovery, deployment, Mailchimp notes
├── prisma/                    # schema + migrations
├── public/
│   └── images/                # Brand assets
├── src/
│   ├── app/
│   │   ├── (public)/          # Marketing pages
│   │   ├── admin/             # Dashboard (later phases)
│   │   ├── api/               # Route handlers
│   │   ├── layout.tsx
│   │   └── robots.ts / sitemap.ts
│   ├── components/
│   │   ├── layout/            # Header, Footer, Announcement
│   │   ├── home/              # Homepage sections
│   │   ├── forms/             # Contact, booking, subscribe
│   │   ├── admin/             # Dashboard UI (later)
│   │   └── ui/                # Button, inputs, cards
│   ├── lib/
│   │   ├── auth/
│   │   ├── db/
│   │   ├── mailchimp/
│   │   ├── validations/
│   │   └── content/
│   └── styles/                # Optional shared CSS
└── tests/
```

---

## 4. Database Model Overview

Core models planned for Prisma:

- **AdminUser** - credentials, password hash, MFA fields, setupCompleted
- **Customer** - contact profile (not auto-subscriber)
- **CustomerNote**, **CommunicationLog**
- **Enquiry** - contact form submissions + status workflow
- **Service** - bookable/published services
- **Appointment** - status, slot, timezone America/New_York
- **AvailabilityRule**, **BlockedDate**
- **Subscriber** - email/SMS prefs + Mailchimp IDs
- **ConsentRecord** - consent type, versioned text, timestamp, source
- **MarketingCampaign** - email/SMS campaign metadata + Mailchimp IDs
- **MailchimpSyncEvent** - sync attempts / errors
- **WebsitePage**, **WebsiteContent**, **MediaAsset**
- **SiteSetting**, **AuditLog**

Indexes on email/phone, appointment datetime, enquiry status, subscriber status.

---

## 5. Mailchimp Email & SMS API Feasibility

### Email - fully supportable via Marketing API

- Audience member upsert / sync
- Tags / interests for preference segments
- Campaign create, content, schedule, send
- Report stats (opens, clicks) where plan allows
- Unsubscribe sync

### SMS - API exists, but account eligibility is the blocker

Official endpoints documented:

- `POST /3.0/sms-campaigns` - create
- `PUT /3.0/sms-campaigns/{id}/content` - set message body
- `POST /3.0/sms-campaigns/{id}/actions/send`
- `POST /3.0/sms-campaigns/{id}/actions/schedule`
- Member fields: `sms_phone_number`, `sms_subscription_status`

**Account prerequisites (must verify with client credentials):**

1. Essentials plan or higher + SMS Marketing add-on  
2. Approved US SMS program + sending number  
3. Owner/Admin/Manager permissions  
4. Contacts with valid SMS opt-in in registered country  

**Implementation policy**

- Build Mailchimp SMS service layer against official endpoints  
- On connect: probe SMS capability; surface honest status in admin  
- If account lacks SMS approval/plan: disable send/create controls, link to Mailchimp SMS setup - **do not fake success**  
- No Twilio / alternate SMS providers

---

## 6. Critical Details Requiring Confirmation

1. Suite **E301** vs **301**  
2. Publish cell **(904) 423-7834**?  
3. Confirm email **gtsolutions@pm.me** for public site  
4. Verify “nationwide / virtual” service claims  
5. Confirm NY & CT filing registration wording  
6. Confirm notary scope (RON, apostilles, loan signings)  
7. Confirm IRS representation / EA / PTIN credentials for copy  
8. Mailchimp: API key, Audience ID, SMS program status  
9. Preferred transactional email provider for booking confirmations  
10. GoDaddy hosting vs external deploy target for Next.js  
11. Legal review of SMS/email consent copy (TCPA / CAN-SPAM / FL)

---

## 7. Practical Implementation Plan

| Phase | Focus | Outcome |
|-------|-------|---------|
| **1** | Discovery + homepage foundation | This report + responsive homepage matching mockup |
| **2** | Remaining public pages + SEO shell | Service/About/Contact/legal pages |
| **3** | Postgres + Prisma + auth + admin CRUD | Real customers, enquiries, appointments, CMS |
| **4** | Mailchimp email + SMS (capability-gated) | Live sync + campaigns where allowed |
| **5** | QA (tests, a11y, build, security pass) | Acceptance checklist |
| **6** | Staging + GoDaddy DNS cutover docs | Deploy only with explicit approval |

**Immediate next build step:** design tokens, shared layout, homepage sections with real brand photography.
