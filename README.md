# Decorom - Premium Nameplate & Signage E-commerce

A modern React + Vite e-commerce platform for custom nameplates, banners, and decorative signage products.

![React](https://img.shields.io/badge/React-19.1-61DAFB?logo=react)
![Vite](https://img.shields.io/badge/Vite-7.1-646CFF?logo=vite)
![TailwindCSS](https://img.shields.io/badge/Tailwind-3.4-06B6D4?logo=tailwindcss)

## 🚀 Features

### Photo Editor (Nameplate Customizer)

- **Live Preview** - Real-time SVG rendering with background images
- **Text Zones** - Configurable family name & flat number inputs
- **Italic Hindi Fonts** - Tiro Devanagari Hindi support
- **Dynamic Sizing** - Adjustable dimensions (inches) with aspect ratio lock
- **Data-Driven** - All configurations stored in `nameplate.js`

### Product Gallery

- **Lazy Loading** - Images loaded on demand
- **Pagination** - Load 12 products at a time
- **Filtering** - By material (Acrylic/Wood/Steel) and shape
- **Responsive Grid** - 1-4 columns based on screen size

### Checkout Flow

- **Price Calculator** - Dynamic pricing based on size/material
- **Shipping Form** - Identity + address with validation
- **Mobile-First Modal** - Escape key, back button, internal scrolling

## 📁 Project Structure

```
src/
├── components/
│   ├── ProductDetailsModal.jsx   # Main product modal
│   ├── PriceCalculator.jsx       # Dynamic pricing
│   ├── ProductCard.jsx           # Gallery card
│   └── model/                    # Modal subcomponents
│       ├── Gallery.jsx
│       ├── ProductInfo.jsx
│       ├── ShippingForm.jsx
│       └── CheckoutButton.jsx
├── editor/
│   ├── NameplateEditor.jsx       # Main editor component
│   ├── components/NameplatePreview.jsx
│   ├── controls/                 # Input controls
│   ├── hooks/useNameplateEditor.js
│   └── renderers/SvgRenderer.jsx
├── data/
│   └── nameplate.js              # Product definitions + editorConfig
└── pages/
    └── HandleInquiry.jsx         # Product listing page
```

## 🛠️ Tech Stack

| Category      | Technology                      |
| ------------- | ------------------------------- |
| Framework     | React 19                        |
| Build Tool    | Vite 7                          |
| Styling       | TailwindCSS 3                   |
| Routing       | React Router 7                  |
| Icons         | Heroicons, React Icons          |
| Image Loading | react-lazy-load-image-component |
| Analytics     | Vercel Analytics                |

## 📦 Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## 🌐 Environment Variables

Create `.env` in project root:

```env
VITE_APP_URL=https://your-backend-api.com
```

## 🚀 Deployment

Configured for **Vercel** deployment:

```bash
# Deploy to Vercel
vercel deploy --prod

# Or use GitHub Pages
npm run deploy
```

## 📱 Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari 14+
- Mobile browsers (iOS Safari, Chrome for Android)

## 📄 License

Private project. All rights reserved.
