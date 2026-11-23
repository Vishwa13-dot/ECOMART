# EcoMart

A React + Vite + Tailwind CSS storefront for sustainable products, with a working cart, wishlist, checkout, reviews and admin dashboard. Data is stored in the browser (localStorage), so there is no backend to set up.

## Run it

```bash
npm install
npm run dev
```

Open the URL Vite prints (usually http://localhost:5173). `npm run build` creates a production build.

## Demo accounts

- Admin: `admin@ecomart.in` / `admin123` (opens /admin)
- Customer: `aarav@example.com` / `demo1234`

## Notes

- **Images** are managed in one place (`src/utils/images.js`). Change them from **Admin > Products** (full gallery: upload, replace, remove, reorder, preview), **Admin > Categories**, and **Admin > Site images** (hero and story photos). Or drop files into `src/assets/images/` (see the README there) with no code changes. Uploads are compressed in the browser and kept in IndexedDB, so they survive reloads and show immediately on every open tab. The illustrations from `src/utils/artwork.js` are now only a fallback.
- **Resetting demo data:** clear localStorage or change `V` in `src/context/StoreContext.jsx`.
- **Passwords** are stored unencrypted in localStorage for demo purposes only. Replace with a real backend before launching.
- **Eco information** on each product is template-based per category plus the material. Seller statements are labelled as unverified. Replace with seller-supplied details before launch.
- **Motion** is CSS-only and respects `prefers-reduced-motion`.

## Structure

```
src/
  components/  reusable UI (Navbar, ProductCard, FilterSidebar, EcoInfo, Admin*, ...)
  pages/       storefront pages; pages/admin for the dashboard
  layouts/     MainLayout, AdminLayout (with route guard)
  context/     StoreContext (state + localStorage persistence)
  data/        categories, 76-product catalogue, seed orders/users
  hooks/       useLocalStorage, useForm, useReveal
  utils/       formatting, validators, images.js (image system), mediaStore.js, imageFile.js
```
