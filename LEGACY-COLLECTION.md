# Legacy collection update

The storefront preview now uses the owner's Vision, Column and Runway tee images,
an AI-generated olive tee, and an AI-generated runway hoodie. The former blazer,
shirt, trouser and knit sample collection is no longer used by the preview.
Only colours represented by the supplied/generated artwork are listed; quantities
and prices are samples. Checkout remains disabled.

The owner's runway, olive fabric, monogram and column illustration are used in
the editorial sections. Other reference files are preserved unchanged.

## Publish the live catalogue

Live products and homepage settings come from Firestore, not the preview array.
After reviewing the new collection:

1. Build and deploy the website assets to Firebase Hosting so the new image URLs
   exist: `npm run build`, then `npx firebase deploy --only hosting --project muanoluxe`.
2. Run `node scripts/replace-sample-collection.mjs` to validate and prepare the
   migration. It writes a local backup under `artifacts/` and makes no database changes.
3. Run `node scripts/replace-sample-collection.mjs --apply` to atomically archive
   the four old sample products, create the five new sample products and update
   the homepage. It refuses to overwrite real products or existing new products,
   checks document versions, and keeps checkout disabled.
4. Push the frontend changes to the repository connected to Cloudflare to update
   its category filters and editorial layout as well.

The previous image files remain for older references. No customer orders or
administrator-created inventory are removed by this migration.

## Generated assets and prompts

Mode: built-in image generation, using owner images as style references.
All outputs were copied into `public/images/`; no generated asset relies on a
temporary or Codex-only path.

### public/images/olive-legacy-tee.png

Use case: product-mockup. Generate one premium ecommerce photograph for Muano Luxe, inspired by supplied references (reference only, not edit targets). A matching new oversized washed olive crewneck graphic T-shirt, front and back side by side fully visible with generous margins, on warm light grey background, square image. Front small ivory exact supplied monogram at left chest. Back intricate ivory engraved classical column artwork similar in spirit to reference, above artwork text exactly 'BUILT FROM VISION', below exactly 'MUANO LUXE'. Heavy cotton appearance, dropped shoulders, realistic seams and fabric. No other objects, no watermark. High end streetwear, not formal tailoring.

References: IMG-20260927-WA0028.jpg, IMG-20260927-WA0029.jpg, muanoluxe-logo.jpg.

### public/images/runway-hoodie.png

Use case: product-mockup. One square premium ecommerce photograph. New Muano Luxe oversized black pullover hoodie inspired by reference luxury graphic T-shirt, front and back side by side fully visible, light stone grey seamless background. Small ivory supplied monogram chest on front, back has finely drawn ivory airport runway perspective graphic with subtle muted gold runway lights, text above exactly 'BUILT FROM VISION', below exactly 'MUANO LUXE'. Thick structured fabric, dropped shoulders, rib cuffs, kangaroo pocket. Crisp readable garment shape, soft studio lighting. No model, no props, no watermark. Reference images guide brand and style only.

References: IMG-20260927-WA0029.jpg, muanoluxe-logo.jpg.

### public/images/legacy-campaign.png

Use case: ads-marketing. Generate a photorealistic landscape fashion campaign for Muano Luxe luxury South African graphic streetwear. Supplied images are style references. Two adult Black fashion models, woman wearing oversized ivory tee with engraved classical column back print, man wearing oversized black tee with refined small white monogram chest and black relaxed cargo trousers. Both in a tasteful concrete aviation hangar at twilight, softly blurred private aircraft far behind. Three quarter body framing, natural confident posture, clean cinematic light, charcoal black ivory subdued olive palette, highly visible garment details. Ivory model turned three-quarter away so column print visible; black model faces camera. No blazers, suits, knitted tops, no extra text or watermark. Editorial composition suitable for homepage hero.

References: IMG-20260927-WA0026.jpg, IMG-20260927-WA0028.jpg, IMG-20260927-WA0029.jpg.

## Validation

Production build, five browser tests and nine commerce/backend unit tests passed.
Published to Firebase Hosting and Firestore on 5 October 2026. The four original
sample records were retained but made inactive, and five Legacy products were
created. Checkout remains disabled. A pre-migration backup is stored locally at
`artifacts/collection-before-legacy.json`. Studio-edited records without a sample
label are accepted for retirement only when their name, image, description,
material and price still match the original sample fixture.
