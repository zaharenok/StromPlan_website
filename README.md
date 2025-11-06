# StromPlan.at - Transparent Electricity Comparison

StromPlan.at is a SaaS landing page for comparing electricity providers in Austria. Upload your electricity bill, discover your real costs, and get transparent recommendations for better providers.

## Features

- 🌍 **Multi-language Support**: English, German (Deutsch), and Russian (Русский)
- 💡 **Smart Calculator**: Calculate your real electricity costs and potential savings
- 📊 **Transparent Comparison**: No hidden fees, completely honest pricing
- 🎨 **Modern Design**: Beautiful, responsive UI built with Next.js and Tailwind CSS
- ⚡ **Fast Performance**: Server-side rendering with Next.js 14

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Internationalization**: next-intl
- **Fonts**: Inter (Google Fonts)

## Getting Started

### Prerequisites

- Node.js 18+ installed
- npm or yarn package manager

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd StromPlan_website
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

### Building for Production

```bash
npm run build
npm start
```

## Project Structure

```
StromPlan_website/
├── app/
│   ├── [locale]/           # Localized routes
│   │   ├── layout.tsx      # Locale-specific layout
│   │   └── page.tsx        # Home page
│   ├── globals.css         # Global styles
│   └── layout.tsx          # Root layout
├── components/
│   ├── Hero.tsx            # Hero section
│   ├── Benefits.tsx        # Benefits/Features section
│   ├── HowItWorks.tsx      # How it works section
│   ├── Calculator.tsx      # Cost calculator
│   ├── CTA.tsx             # Call-to-action section
│   └── Footer.tsx          # Footer with language switcher
├── messages/
│   ├── en.json             # English translations
│   ├── de.json             # German translations
│   └── ru.json             # Russian translations
├── i18n.ts                 # i18n configuration
├── middleware.ts           # Next.js middleware for routing
└── package.json
```

## Internationalization

The site supports three languages:
- **English** (en): `/en` or default
- **German** (de): `/de` or `/` (default locale)
- **Russian** (ru): `/ru`

Translations are stored in JSON files in the `messages/` directory.

## Customization

### Adding New Languages

1. Create a new translation file in `messages/` (e.g., `fr.json`)
2. Add the locale to `i18n.ts` in the `locales` array
3. Update the language selector in `components/Footer.tsx`

### Modifying the Calculator

The calculator uses simplified calculations based on average Austrian electricity rates. To customize:

1. Edit `components/Calculator.tsx`
2. Modify the `avgMarketRate` and `avgMarketFee` constants
3. Adjust the calculation logic in `calculateSavings()`

### Styling

The project uses Tailwind CSS. To customize:

1. Edit `tailwind.config.js` for theme customization
2. Modify color schemes, fonts, and spacing
3. Component-specific styles are in each component file

## Deployment

This project is ready to deploy on Vercel, Netlify, or any platform that supports Next.js:

### Vercel (Recommended)

```bash
npm install -g vercel
vercel
```

### Other Platforms

Build the project and deploy the `.next` folder:

```bash
npm run build
```

## License

© 2024 StromPlan.at. All rights reserved.

## Support

For questions or support, please contact us through our website.
