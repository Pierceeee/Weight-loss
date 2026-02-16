# Required Images for PCOS Reset Method Web App
  
This document lists all images required for the PCOS Reset Method web application. All images should be placed in the `/public/images/` directory.

---

## Quiz Flow Images

### Interstitial / Motivational Screens

| Filename | Format | Dimensions | Description |
|----------|--------|------------|-------------|
| `motivation-1.jpg` | JPG | 800x600px (recommended) | Motivational image for Step 6 interstitial. Should show a happy, healthy woman or lifestyle imagery representing wellness and PCOS management. Theme: "We're Here to Help You Take Control" |
| `motivation-2.jpg` | JPG | 800x600px (recommended) | Motivational image for Step 13 interstitial. Should represent healthy lifestyle, fitness, or nutrition. Theme: "Keep It Healthy" - targeted at women in their 20s maintaining healthy habits |

### Body Type Selection (Step 8)

| Filename | Format | Dimensions | Description |
|----------|--------|------------|-------------|
| `body-type-regular.svg` | SVG | 120x200px | Simple female body silhouette representing a "Regular" body type. Clean, minimal illustration showing average/healthy body proportions |
| `body-type-plump.svg` | SVG | 120x200px | Simple female body silhouette representing a "Plump" body type. Clean, minimal illustration showing slightly curvier body proportions |
| `body-type-extra.svg` | SVG | 120x200px | Simple female body silhouette representing an "Extra" body type. Clean, minimal illustration showing fuller body proportions |

> **Note:** If SVG body type images are not provided, the app will fall back to programmatically generated silhouettes.

### Trust & Authority (Step 19)

| Filename | Format | Dimensions | Description |
|----------|--------|------------|-------------|
| `science-logos.png` | PNG | 800x200px (recommended) | Composite image showing logos of trusted health/medical organizations that back the science. Examples: WHO, PubMed, WebMD, medical institutions, research organizations. Should be presented in a clean, professional layout with logos in grayscale or muted colors |

---

## Image Guidelines

### General Requirements
- All images should be optimized for web (compressed)
- Use modern formats where possible (WebP for photos with JPG fallback)
- Maintain consistent visual style across all images
- Ensure images are inclusive and representative

### Color Palette Reference
Images should complement the app's color scheme:
- **Primary**: Coral/Terracotta (`hsl(16, 85%, 55%)`)
- **Accent**: Teal (`hsl(160, 45%, 45%)`)
- **Background**: Warm off-white (`hsl(30, 25%, 97%)`)

### Accessibility
- Avoid text embedded in images
- Ensure sufficient contrast
- All images have appropriate alt text in the codebase

---

## Directory Structure

```
public/
└── images/
    ├── motivation-1.jpg
    ├── motivation-2.jpg
    ├── body-type-regular.svg
    ├── body-type-plump.svg
    ├── body-type-extra.svg
    └── science-logos.png
```

---

## Optional / Future Images

These images are not currently required but may be useful for future enhancements:

| Filename | Description |
|----------|-------------|
| `logo.svg` | Brand logo for header and favicon |
| `og-image.jpg` | Open Graph image for social sharing (1200x630px) |
| `hero-illustration.svg` | Optional hero illustration for landing page |
| `meal-placeholder.jpg` | Placeholder image for meal plan items |
| `success-story-*.jpg` | Testimonial/success story photos |

---

## Image Sources Recommendations

For high-quality, royalty-free images that match the app's tone:
- [Unsplash](https://unsplash.com) - Search: "healthy woman", "wellness", "nutrition"
- [Pexels](https://pexels.com) - Search: "lifestyle", "healthy eating"
- [Undraw](https://undraw.co) - For SVG illustrations
- [Humaaans](https://humaaans.com) - For diverse human illustrations

For the body type SVGs, consider:
- Custom illustration from a designer
- [Figma Community](https://figma.com/community) - Body shape templates
- Simple geometric representations maintaining body positivity
