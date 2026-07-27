# Bindawasub — MTN ₦300 Download Page

A mobile-first landing page built to drive Android app installs from Facebook Ads,
promoting the MTN 1GB for ₦300 offer on the Bindawasub app.

## Structure

```
.
├── index.html          Page markup + meta/SEO tags
├── style.css            Design system + all styling/animation
├── script.js             Particles, canvas network animation, ripple, scroll-reveal
├── firebase.json      Firebase Hosting config (cache headers, clean URLs)
├── robots.txt
├── sitemap.xml
└── assets/
    ├── logo.png                Full-resolution source logo
    ├── logo-nav.png            Compressed logo used in nav/hero/footer
    ├── screenshot-confirm.jpg  "Confirm Transaction" screen (real app screenshot)
    ├── screenshot-success.jpg  "Transaction Successful" screen (real app screenshot)
    ├── favicon.ico, favicon-16.png, favicon-32.png
    ├── apple-touch-icon.png
    └── icon-192.png, icon-512.png (used in Open Graph / social previews)
```

## Deploying to Firebase Hosting

1. Install the Firebase CLI if you don't have it: `npm install -g firebase-tools`
2. From this folder, run `firebase login`
3. Run `firebase init hosting` **only if you don't already have a Firebase project** —
   otherwise skip straight to deploying against your existing project with
   `firebase deploy --only hosting --project YOUR_PROJECT_ID`
4. That's it — `firebase.json` is already configured to serve this folder as-is,
   with long-cache headers on images and a shorter cache on CSS/JS so you can push
   copy tweaks without users being stuck on a stale version.

## Editing the offer

- **Price / plan**: edit the `.price-pulse` text in the hero and the `.promo-card`
  block in `index.html` — both currently read MTN / 1GB / ₦300 / 30 days.
- **Play Store link**: both download buttons point to
  `https://play.google.com/store/apps/details?id=com.ioapp.bindawasub`.
- **WhatsApp number**: set in the floating button and footer as `2347047146454`.

## Setting up tracking

The page ships with Google Analytics (GA4) and the Meta/Facebook Pixel wired in,
but pointed at placeholder IDs — you need to swap in your own before it collects data.

**Google Analytics:**
1. Go to [analytics.google.com](https://analytics.google.com) → Admin → create a
   GA4 property (or open your existing one) → Data Streams → your web stream.
2. Copy the **Measurement ID** (looks like `G-ABC123XYZ`).
3. In `index.html`, replace all three instances of `G-XXXXXXXXXX` with that ID.

**Facebook Pixel:**
1. Go to [Meta Events Manager](https://business.facebook.com/events_manager) →
   Data Sources → your pixel (or create one) → Settings.
2. Copy the **Pixel ID** (a long number).
3. In `index.html`, replace both instances of `YOUR_PIXEL_ID` with that number.
4. Since this campaign runs on Facebook Ads, go back to Ads Manager and set your
   ad's conversion event to **Lead** — that's the event this page fires whenever
   someone taps a Download button (see `initConversionTracking()` in `script.js`).

**What gets tracked automatically:**
- Every page load → `PageView` (Pixel) and a standard pageview (GA4)
- Every tap on a "Download Now" or "Claim this price" button → a `Lead` event
  (Pixel) and a `download_click` event (GA4), tagged with which section the
  button was in (hero, promo, or final) so you can see which CTA performs best

Note: neither tool can see what happens *inside* the Play Store or after
install — for actual install/purchase tracking inside the app itself, you'd
need the Meta SDK or Firebase/Google Analytics for Firebase added to the
Android app project, which is separate from this landing page.

## Notes for future promos

- The hero and final-CTA phone mockups use `assets/screenshot-confirm.jpg`.
  Swap in a new screenshot at the same crop (700×1565) to update the promo shown.
- Reduced-motion is respected throughout — anyone with that OS setting gets a static,
  non-animated version of the page automatically.
- Lighthouse: images are pre-compressed and served at display size; fonts are
  preconnected; no render-blocking scripts. Re-run Lighthouse after any asset swaps
  to confirm you're still in the 95+ range.
