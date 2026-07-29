# Product Photography Guide — Elite Brands

Consistent, editorial-quality imagery is the single biggest driver of perceived luxury and conversion on Elite Brands. This guide defines the standards every product photo must meet before it goes live.

---

## 1. Hero Image Standards

The hero image is the first image shown on category listings, search results, and the product page.

- **Framing:** Full garment centred, top of dupatta/neckline at ~10% from top, hem at ~5% from bottom.
- **Angle:** Straight-on, eye level, zero perspective distortion.
- **Model or flat-lay:** Flat-lay on white for unstitched; on-model front pose for pret and luxury pret.
- **Focus:** Sharp on fabric weave and embroidery; f/8–f/11 recommended.
- **Colour accuracy:** Shoot with a colour-checker; white balance calibrated to 5500K daylight.
- **Retouching:** Remove dust, wrinkles, and stray threads. Never smooth or reshape the garment.
- **Crop ratio:** 4:5 portrait (2000 × 2500 px minimum).

## 2. Gallery Image Standards

Minimum 4, ideal 6–8 images per product.

Required shots in order:
1. Hero (front, full garment)
2. Back view
3. Fabric close-up (embroidery / print detail at 1:1)
4. Dupatta or trouser detail
5. Styled / on-model lifestyle (if available)
6. Scale reference (folded, held, or on hanger)

All gallery images must match the hero in white balance, exposure, and crop ratio.

## 3. White Background Rules

- Background: pure white **#FFFFFF**, fully clipped — no grey gradients, no drop shadows behind the garment.
- Soft, natural contact shadow directly under the garment is allowed (max 15% opacity).
- No visible seams, creases in the backdrop, or reflections from studio lights.
- Edges must be clean; feather 1–2 px only to avoid a cut-out look.

## 4. Lifestyle Image Rules

- Location: neutral interiors, gardens, courtyards, or minimal architectural backdrops. No cluttered scenes.
- Wardrobe: only the featured garment is styled with subtle accessories that do not compete.
- Model direction: relaxed, editorial, never over-posed. Face optional but recommended for pret.
- Lighting: natural window light or soft diffused studio light. Avoid harsh midday sun.
- Post-processing: preserve skin texture and fabric colour; no heavy filters.

## 5. Image Dimensions

| Use Case | Dimensions | Ratio | Format |
| --- | --- | --- | --- |
| Hero / gallery master | 2000 × 2500 px | 4:5 | JPG, sRGB, ~85% quality |
| Zoom source | 3000 × 3750 px | 4:5 | JPG |
| Thumbnail | 600 × 750 px | 4:5 | JPG / WebP |
| Category tile | 1200 × 1500 px | 4:5 | JPG / WebP |
| Homepage banner | 2560 × 1200 px | ~2.13:1 | JPG / WebP |
| Mobile banner | 1080 × 1350 px | 4:5 | JPG / WebP |

File size targets: hero < 400 KB, thumbnails < 80 KB after WebP conversion.

## 6. Mobile Optimization

- Serve WebP with JPG fallback; use `srcset` at 480, 768, 1080, 1440 px widths.
- Lazy-load everything below the fold.
- Preload the hero image only.
- Compress with mozjpeg / squoosh; target Lighthouse LCP < 2.5s on 4G.
- Never upscale — always downsample from the master file.

## 7. Common Mistakes

- Mixed white balance across gallery images.
- Off-white / cream backgrounds masquerading as white.
- Over-sharpened embroidery producing halos.
- Portrait crops inconsistent between hero and gallery.
- Missing back view or fabric close-up.
- Watermarks, logos, or price stickers baked into the image.
- Uploading PNGs for photographic content (bloats page weight).
- Lifestyle shots where the garment is not clearly the subject.
