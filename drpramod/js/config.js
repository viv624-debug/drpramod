/*
 * Site configuration — edit these values, no build step needed.
 *
 * formEndpoint
 *   HTTPS URL of a secure form backend that accepts a POST of form fields
 *   and returns a 2xx status on success (e.g. a Formspree/Web3Forms form, or
 *   the clinic's own API). Leave empty until a backend is agreed: the form
 *   then stays in "preview" mode, tells the visitor nothing was sent, and
 *   never shows a success message. See README → "Appointment form backend".
 *
 * analytics
 *   Disabled until the privacy notice and consent arrangements are reviewed.
 *   When enabled, only event names and non-identifying labels are sent
 *   (never form contents, symptoms, names or phone numbers).
 *   provider: "gtag" (Google Analytics 4) or "plausible". The provider's own
 *   script tag must also be added to index.html.
 */
window.SITE_CONFIG = {
  formEndpoint: "",
  analytics: {
    enabled: false,
    provider: null
  }
};
