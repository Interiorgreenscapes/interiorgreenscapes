# Interior Greenscapes — Site Edit Guide

Marketing site for Interior Greenscapes (interior plantscaping in Boise, ID). React + Vite + Tailwind, deployed to GitHub Pages via `npm run deploy`.

See [PRODUCT.md](PRODUCT.md) for brand voice, audience, and design principles. Defer to those when writing copy or making design choices.

## Run it

```bash
npm install         # first time only
npm run dev         # local dev server at http://localhost:5173
npm run build       # production build
npm run deploy      # build + push to gh-pages branch
```

Always preview changes in the browser before committing — type checking won't catch layout or copy bugs.

## Where things live

- `src/pages/` — top-level routes (Home, About, Services, Portfolio, Products, Contact)
- `src/components/` — section components used by pages (Hero, Services, Portfolio, Footer, etc.)
- `public/images/` — every image. Reference as `${import.meta.env.BASE_URL}images/filename.jpg`
- `tailwind.config.js` — color palette (`sage`, `forest`), fonts (`display`, `body`), custom animations
- `src/index.css` — global styles, scroll-reveal animation classes (`[data-reveal]`)

## Common edits — recipes

### Update phone number
Phone appears in three files. Search-and-replace both the display string and the `tel:` link:
- `src/components/Header.jsx`
- `src/components/Contact.jsx`
- `src/components/Footer.jsx`

### Update email address
Same three files. The current address is `info@interiorgreenscapes.com`. Update both display text and `mailto:` href.

### Edit a service (title, description, features)
- Home page short cards (3 shown): `src/components/Services.jsx` — `services` array
- Services page detailed sections: `src/pages/ServicesPage.jsx` — `servicesDetailed` array
- Both arrays must be kept in sync for fields they share (`title`, `description`, `image`)

### Add a portfolio category
Edit the `categories` array in `src/components/Portfolio.jsx`. Each entry needs:
- `id`, `name`, `title`, `description`
- `featureImage` — the card thumbnail
- `gallery` — array of full-size images

Drop the images in `public/images/` first, then reference them with `${BASE}images/yourfile.jpg`.

### Swap the hero image
`src/components/Hero.jsx` — change the `<img src=...>` near the top.

### Edit hero headline / subhead
`src/components/Hero.jsx` — the `<h1>` and `<p>` inside the content block.

### Change About copy
`src/components/About.jsx` for the home page section, `src/pages/AboutPage.jsx` for the full About page.

### Change footer links or layout
`src/components/Footer.jsx`. Footer was deliberately compacted recently — keep it tight.

## Design conventions (don't break these)

- **Colors**: stick to the `sage-*` and `forest-*` palette defined in `tailwind.config.js`. Don't introduce new accent colors without a reason.
- **Fonts**: `font-display` for headings, `font-body` for everything else.
- **Buttons**: use `.btn-primary` / `.btn-secondary` (defined in `src/index.css`) — don't restyle one-off.
- **Section pattern**: `<section className="py-24 ...">` with a max-w-7xl container. Section headers use `.section-heading` and `.section-subheading`.
- **Images**: always include `alt` text. Use `object-cover` for fill, `object-contain` to preserve aspect.
- **No emojis** in marketing copy.

## Deployment

`npm run deploy` builds and pushes to the `gh-pages` branch. The `homepage` field in `package.json` controls the base path — don't change it unless the GitHub Pages URL is moving.

## Design skills (optional)

If you want help with visual polish, this repo bundles the [impeccable](https://impeccable.style) design skill at `.claude/skills/impeccable/`. Once Claude Code picks it up, you can ask things like "polish the home page" or "audit the contact form" and it will apply the design heuristics from PRODUCT.md.
