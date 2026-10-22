# Missing assets & information to confirm before launch

The redesign is complete as a preview, but it is **not production-ready** until the items marked 🔴 are resolved.

## 🔴 Blocking launch

| # | Item | Where it appears | Notes |
|---|---|---|---|
| 1 | **Secure form backend** | Appointment form | Form is in preview mode and sends nothing. See README → "Appointment form backend". |
| 2 | **Appointment phone number** | Contact section, JSON-LD | Shown as "To be confirmed". |
| 3 | **Appointment email** | Contact section, Privacy Notice | Shown as "To be confirmed". |
| 4 | **Consultation hours** | Contact section | Shown as "To be confirmed". |
| 5 | **Pune address** — exact address, department, schedule at Jupiter Hospital | Contact section | Hospital name shown; details pending. |
| 6 | **Mumbai clinic/hospital** — name and address | Contact section | Shown as "To be confirmed". |
| 7 | **Privacy Notice** — processor, storage, retention, contact for privacy requests | `privacy.html` | Draft with marked gaps; needs legal review (DPDP Act 2023). |
| 8 | **Credential verification**: 24+ years, 5,000+ surgeries, fellowship training in 5 countries | Hero stats, About, Expertise | Copy deck states these are "subject to verification before publication". |
| 9 | **Medical content sign-off** by Dr. Lokhande | Whole page | Required by the brief before publication. |
| 10 | **Advertising compliance check** (NMC professional conduct regulations) | Whole page | Includes the stats and any future awards. |

## 🟠 Assets to supply

| # | Item | Notes |
|---|---|---|
| 11 | **Second professional photo** (consulting / in theatre) | The single existing portrait is used in both the hero and About section. |
| 12 | **Portrait quality** | The existing portrait looks heavily retouched/upscaled (skin texture). A fresh professional photo is recommended. It was kept as-is — no AI-generated face was used. |
| 13 | **Media gallery photos** — Conference Faculty, Surgical Education, Training Workshops, International Collaborations | Gallery is omitted until verified photos are supplied. |
| 14 | **Professional recognition** — official award titles, organisations and dates | Omitted until verified. |
| 15 | **Patient education videos** (5 topics in copy deck) | Section hidden until approved video URLs are added. |
| 16 | **Surgery videos referenced by the old site** — `assets/videos/endoscopy-loop.mp4`, `assets/videos/surgery-detail.mp4` | These files were never committed, so the old hero video and "Watch a Surgery" player were broken. Not used in the redesign. |
| 17 | **Surgeon-training page or contact** | "Explore Surgeon Training" currently points to the Contact section. |
| 18 | **Approved surgical imagery** for the endoscopic section | A simple educational SVG illustration is used for now. |
| 19 | **Social sharing image** (1200×630) | `og:image` currently uses the portrait. |

## 🟡 To confirm

| # | Item | Notes |
|---|---|---|
| 20 | **Condition photo licences** | The 8 condition photos are marked in the old code as Unsplash (free licence). Confirm the source and keep a record. |
| 21 | **Gurukrupa Spine Clinic** relationship to Jupiter Hospital and Mumbai location | Clinic name is in the footer (per copy) but not in structured data until confirmed. |
| 22 | **Custom domain?** | If yes, update canonical/OG/JSON-LD URLs. |
| 23 | **WhatsApp** | The old site had a WhatsApp button that only linked to `#contact`. Removed. Re-add with a verified number if wanted. |
| 24 | **`Dr-Pramod-Lokhande-Website.pdf`** in the repo root | It is publicly downloadable from the live site and contains the old copy (including claims the brief prohibits). Recommend removing it after approval. |

## Content removed from the old site (non-compliant per brief)

* "one of the best endoscopic spine surgeons in India", "widely regarded among the best", "pioneer", "leading expert".
* "complication rates are negligible", "significantly lower complication rate" (unsupported comparison).
* "Most patients walk the same day and go home within 24 hours" / "day-care discharge for most patients" as a headline stat.
* Keyword-stuffed footer and `meta keywords`.
* Placeholder canonical `https://www.example.com/`.
* Form that displayed "Thank you" while discarding the enquiry.
