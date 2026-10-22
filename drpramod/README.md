# Dr. Pramod V. Lokhande — Website

One-page, mobile-first medical landing page for Dr. Pramod V. Lokhande, full endoscopic & minimally invasive spine surgeon (Pune & Mumbai).

Live (GitHub Pages): https://viv624-debug.github.io/drpramod/

Plain HTML, CSS and JavaScript — no framework, no build step.

## Structure

```
index.html            Landing page (all 15 sections)
privacy.html          Privacy Notice — DRAFT, must be completed before launch
css/styles.css        Design tokens + reusable components (buttons, cards, grids,
                      process, timeline, comparison table, accordion, form, alerts)
js/config.js          Form endpoint + analytics switches (edit here)
js/main.js            Navigation, FAQ/reveal behaviour, form validation & submit,
                      privacy-safe analytics hooks, video-card visibility
assets/img/           Portrait, clinic logos, condition photos
assets/img/conditions/800/   Resized copies (800px) used on the page; originals kept
MISSING-INFO.md       Everything that must be supplied or verified before launch
```

All asset paths are relative, so the site works under the `/drpramod/` sub-path on GitHub Pages and at a custom domain root without changes.

## Run locally

From the repository folder:

```bash
python3 -m http.server 8000
```

Then open http://localhost:8000/. Any static server works.

## Deploy (GitHub Pages)

The repository is published by GitHub Pages from the `main` branch, root folder (Settings → Pages → *Deploy from a branch*). Nothing to build:

1. Review changes on the `claude/changes` branch.
2. Open a pull request into `main` and merge once approved.
3. Pages republishes automatically within a minute or two.

If a custom domain is added later, update the `canonical`, `og:url`, `og:image` and JSON-LD `url`/`image` values in `index.html` and `privacy.html`.

## Appointment form backend

GitHub Pages cannot receive form submissions, so the form needs an external HTTPS endpoint.

* Until `formEndpoint` is set in `js/config.js`, the form runs in **preview mode**: it validates input, shows a visible "not connected yet" notice, and on submit tells the visitor that **nothing was sent**. It never shows a success message and never stores data.
* Once set, the form `POST`s `multipart/form-data` to the endpoint with `Accept: application/json`. The confirmation message is shown **only on a 2xx response**; any failure shows an error and keeps the visitor's details in the form.

Fields sent: `name`, `mobile` (normalised to 10 digits), `email`, `city`, `location`, `concern`, `mri`, `duration`, `info`, `consent`, `_subject`.

Requirements for the chosen backend:

* HTTPS only; data delivered to an appointment inbox/CRM the practice controls.
* A data-processing agreement suitable for health-related enquiries; storage location documented in the Privacy Notice.
* Server-side spam filtering (the page already has a honeypot field and a minimum fill-time check).
* No file uploads — the form deliberately does not accept MRI images or records.
* Defined retention period and a way to delete enquiries on request.

Options: Formspree, Web3Forms, Basin, or a small serverless function (e.g. Cloudflare Workers) that emails/forwards to the clinic CRM.

## Analytics

Prepared but **disabled** (`analytics.enabled: false`). Events wired:

| Event | When | Parameters |
|---|---|---|
| `cta_click` | Any consultation button | `label` (fixed id such as `hero_book`) |
| `form_start` | First focus in the form | `label: appointment` |
| `form_submit_success` | Backend returned 2xx | `label: appointment` |
| `contact_click` | `tel:` / `mailto:` / WhatsApp links | `method` |
| `video_open` | Education video card clicked | `video_id` |

`js/main.js` whitelists these parameters; form contents, symptoms and personal details are never passed. To enable after privacy review: add the provider script to `index.html`, set `enabled: true` and `provider: "gtag"` or `"plausible"`, and update the Privacy Notice.

## Adding content later

* **Education videos:** fill `data-video-url` on each card in the `#videos` section. The section stays hidden until at least one approved HTTPS URL exists; cards without a URL stay hidden.
* **Media gallery / professional recognition:** see the commented markup in the `#expertise` section. Add verified photos and awards only.
* **Contact details:** replace the `.pending` text in `#contact` and add `telephone`/`address` to the JSON-LD once verified.

## CTA labels

Per the implementation brief, consultation buttons use a consistent set of labels — *Book a Spine Consultation*, *Discuss Your Symptoms*, *Explore Treatment Options*, *Request Appointment* — instead of the many variants in the copy deck. The one exception is *Explore Surgeon Training*, which is aimed at surgeons rather than patients.

## Compliance

Before publishing, the content must be approved by Dr. Lokhande, and checked against the NMC (Registered Medical Practitioner Professional Conduct) Regulations on advertising, and the Digital Personal Data Protection Act, 2023. See `MISSING-INFO.md`.
