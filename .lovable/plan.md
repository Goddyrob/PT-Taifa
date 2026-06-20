# Responsiveness Pass

Goal: make every section look polished from 320 px phones up to large desktops, fix overflow/cramping issues, and improve the mobile nav + floating WhatsApp button.

## Issues found

1. **Navbar** — "Start Project" CTA and Admin link are hidden below `sm` (640 px), and the mobile menu doesn't include them. Logo block can crowd the toggle on 360 px screens.
2. **Hero** — `min-h-screen + pt-32 pb-20` overflows on short phones; headline jumps 4xl → 6xl with nothing in between (looks small on 480–640 px); 3 CTAs wrap to 3 lines on narrow phones; stat chips text gets tight at 320 px.
3. **Portfolio** — Section padding (`py-24 sm:py-32`) too tall on phones; category filter row wraps messily; product card "Details / Order Now" buttons get cramped under 360 px; quick-view modal has conflicting `overflow-hidden` + `overflow-y-auto` and no safe max-height on tiny screens.
4. **Services / Testimonials / WhyUs** — single-column on mobile is fine, but section vertical padding is excessive on phones; WhyUs counter numbers (`text-3xl sm:text-4xl`) overflow the card on 320 px.
5. **Contact** — form OK, but phone/email inputs lose 16 px font-size which triggers iOS zoom-on-focus; section padding too tall on phones.
6. **Footer** — newsletter input + Subscribe button overflow at 320 px because `flex gap-2` keeps them side-by-side; columns collapse only at `md` so 640–767 px shows 1 column with lots of empty space.
7. **WhatsApp FAB** — overlaps the "Order Now" button on product cards on mobile (bottom-right). Needs to shrink to icon-only on phones and sit higher.
8. **OrderModal** — no max-height; on short phones the Confirm button can be pushed off-screen.
9. **Global** — no `text-size-adjust`, container has no max-width cap so 4K monitors stretch typography.

## Plan

### 1. Tailwind / global (`src/styles.css`)
- Add `html { -webkit-text-size-adjust: 100%; }`.
- Cap container reading width via a utility (use existing `container` + `max-w-7xl` on wrappers where needed).
- Add `:where(input, textarea, select) { font-size: 16px; }` on `< sm` to stop iOS zoom (or bump existing `text-sm` inputs to `text-base sm:text-sm`).

### 2. `Navbar.tsx`
- Always show "Start Project" CTA (smaller on mobile: `px-3 py-2 text-xs sm:px-5 sm:py-2.5 sm:text-sm`).
- Move Admin link into the mobile dropdown.
- Tighten logo: hide the "DIGITAL HUB" tagline below `sm`.
- Add `Start Project` and `Admin` entries to the mobile menu list.

### 3. `Hero.tsx`
- Replace `min-h-screen pt-32 pb-20` with `min-h-[100svh] pt-28 pb-16 sm:pt-32 sm:pb-20`.
- Headline: `text-3xl xs:text-4xl sm:text-5xl lg:text-7xl`.
- CTA row: stack full-width on `< sm` (`w-full sm:w-auto` and `flex-col sm:flex-row`).
- Stat chips: `text-lg sm:text-2xl`, padding `p-3 sm:p-4`.

### 4. `Portfolio.tsx`
- Section padding: `py-16 sm:py-24 lg:py-32`.
- Filter row: wrap in horizontal scroll on phones (`overflow-x-auto flex-nowrap snap-x` with `whitespace-nowrap` pills).
- Card action buttons: stack to one column under 360 px (`grid-cols-1 xs:grid-cols-2`) and shrink label.
- Modal: change wrapper to `overflow-y-auto` only; set `max-h-[90svh]`; image `max-h-[40svh] object-cover`.

### 5. `Services.tsx`, `WhyUs.tsx`, `Testimonials.tsx`, `Contact.tsx`
- Standardize section padding to `py-16 sm:py-24 lg:py-32`.
- WhyUs counter: `text-2xl sm:text-3xl lg:text-4xl`, card padding `p-4 sm:p-6`.
- Contact inputs/textarea: `text-base sm:text-sm` to prevent iOS zoom.

### 6. `Footer.tsx`
- Newsletter form: `flex-col sm:flex-row` so input + button stack on phones.
- Grid: `grid-cols-1 sm:grid-cols-2 md:grid-cols-4` so tablets get 2 columns instead of 1.

### 7. `WhatsAppFab.tsx`
- Mobile: icon-only circular button (`w-12 h-12 p-0`), keep label `hidden sm:inline`.
- Position: `bottom-4 right-4 sm:bottom-6 sm:right-6` and add `safe-area-inset` padding via `pb-[env(safe-area-inset-bottom)]` on body wrapper if needed.

### 8. `OrderModal.tsx`
- Form wrapper: add `max-h-[90svh] overflow-y-auto`.

## Out of scope
No color/branding/animation/feature changes. Pure layout, spacing, and breakpoint tuning.
