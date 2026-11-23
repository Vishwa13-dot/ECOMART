# Images: how to change any picture on the site

Every image resolves in this order, so you never edit code to swap a picture:

1. **Admin panel** (`/admin`): upload, replace, remove, reorder. Shows instantly on the storefront. Stored in the browser.
2. **Files in this folder** (permanent, ships with the site): just drop a file in and rebuild/redeploy (in `npm run dev` it appears immediately).
3. **Built-in artwork**: the old illustrations, used only when neither of the above exists.

## File layout

```
src/assets/images/
  products/<product-id>/1.jpg, 2.jpg, 3.jpg ...   gallery, in this order. 1 = main image (cards, cart)
  categories/<category-id>.jpg                     e.g. categories/gardening.jpg
  site/hero.jpg                                    home page banner
  site/home-story.jpg                              home page "Sustainability" photo
  site/about-story.jpg                             About page photo
  site/auth.jpg                                    login / register side photo
```

- Accepted: `.jpg .jpeg .png .webp .avif`. Files sort by number (`2` before `10`).
- Product ids for the starter catalogue are in `PRODUCT-FOLDERS.md`. For products you add in Admin, the edit form shows the folder path.
- Suggested size: products 1200x1200 (square), categories 800x1000 (portrait), hero 1000x1250 (4:5), story photos about 1200x900.
- A product edited in Admin uses its Admin images. Open it and press **Restore default images** to switch back to the files here.
- To add a new site-wide slot, add one line to `SITE_SLOTS` in `src/utils/images.js`, then render `<SiteImage slot="your-key" />`.

Use photos you own or have a licence for (your own shots, a supplier's product photos, or licensed stock).
