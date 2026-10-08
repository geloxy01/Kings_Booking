Kings Resort and Cove — Reservation Form
=======================================

Deliverables
------------
- index.html — premium resort booking form (Vanilla HTML/CSS/JS)
- styles.css — luxury resort styling, responsive layout, accessible defaults
- app.js — client-side validation, date logic, AJAX submission (mock endpoint), modal confirmation

How to open
-----------
1. Open index.html in a browser (double-click or use a local dev server).
2. The form works without a backend, but the submit uses a mock endpoint: `/api/booking`. Replace with your real endpoint (see Integration below).

Design & UX notes
------------------
- Premium resort branding: dark coastal blue, warm gold accents, and elevated card-based layout.
- Layout: single-column on small screens; two-column luxury booking panel on desktop using CSS grid.
- Touch-friendly controls: large inputs, generous spacing, and elegant resort styling.
- Form fields included: Full Name, Email, Phone, Check-in, Check-out, Room Type, Adults, Children, Special Requests.
- Buttons: "Check Availability" and "Book Now" both follow the same validation and submission flow.
- Validation: browser-required checks plus custom rules for date logic and past-date prevention.
- Accessibility: labeled fields, semantic form structure, aria-live status messaging, and accessible modal behavior.

Form validation logic
---------------------
- Required: Full Name, Email, Phone, Check-in, Check-out, Room Type.
- Email: browser email validation (`type="email"`).
- Phone: `type="tel"` with optional server-side validation recommended.
- Dates: check-in must be today or later; check-out must be later than check-in.

Integration options
-------------------
1) Simple direct POST (server-side form POST)
   - Add action and method to the form, for example:
     `<form id="booking-form" action="/booking/submit" method="post">`
   - The current JavaScript prevents default submission and posts JSON to `/api/booking`. If switching to server POST, remove or adapt the script accordingly.

2) AJAX (recommended)
   - Keep the current JS and update the endpoint in `app.js` (`const endpoint = '/api/booking'`) to your server endpoint.
   - Server should return HTTP 200 on success and 4xx/5xx on failure.
   - Example cURL:
     curl -X POST https://example.com/api/booking \
       -H "Content-Type: application/json" \
       -d '{"fullName":"Jane Doe","email":"jane@example.com","phone":"+63...","checkIn":"2026-10-10","checkOut":"2026-10-12","roomType":"Deluxe Suite","adults":2,"children":0}'

3) Embedding into an existing website
   - Add a CTA link in navigation: `<a href="/booking#booking-section">Book Now</a>`
   - Or embed the entire booking section directly into the resort website page.
   - Modal popup: call `window.openBookingModal()` after loading the script to show a modal-based prompt.

Security & server-side notes
----------------------------
- Validate on the server: required fields, email format, phone format, and date ranges.
- Sanitize any user-provided text (special requests) before storing or rendering.
- Use HTTPS for all submissions.

Customization
-------------
- Colors: edit CSS variables in `styles.css` such as `--brand`, `--accent`, and `--bg`.
- Room list: update the options in `index.html`.
- If you prefer a plain form POST without JS, remove the `fetch` logic in `app.js` and set `action` + `method` on the form.

Testing
-------
- Manual: open `index.html` and test these flows:
  - Missing required fields -> browser validation appears.
  - Check-in today and check-out before/in the past -> validation message appears.
  - Valid submission -> confirmation modal appears.

Next steps (recommended)
------------------------
- Add a real `/api/booking` endpoint to accept JSON and return structured success/error responses.
- Add server-side validation and persistence (database, email notifications, booking engine integration).
- Add CAPTCHA or reCAPTCHA to prevent spam.

This page was created as a premium vanilla HTML/CSS/JS booking experience for Kings Resort and Cove. If you want, it can next be adapted to a React app, CMS integration, or a full booking backend.
