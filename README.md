# Tax Credit Calculator

A comprehensive web-based calculator for estimating multiple stackable business tax credits including WOTC, R&D, Paid Leave, and State-specific credits.

## 🚀 Live Demo

- **Production**: [Deployed on Vercel] (will be available after deployment)
- **GitHub Pages**: https://nataliebendinelli.github.io/tax-calculator

## ✨ Features

- **Multi-Credit Calculations**: WOTC, R&D Payroll, Empowerment Zone, State Credits, Paid Leave, Childcare
- **Interactive 4-Step Wizard**: User-friendly flow with validation
- **Celebration Experience**: Confetti animation and dynamic results display  
- **Mobile Responsive**: Works on all devices
- **Zero Dependencies**: Pure HTML/CSS/JavaScript

## 🏗️ Architecture

- **Single-file deployment**: All assets embedded in `index.html`
- **Modular calculation engine**: Object-oriented credit calculators
- **Configuration-driven**: Centralized credit rules in `credit_configs.json`
- **Static hosting ready**: No server-side processing required

## 📦 Deployment

### Vercel (Recommended)

1. Connect your GitHub repository to Vercel
2. Vercel will automatically detect the configuration
3. Deploy with zero configuration needed

### Manual Deployment

```bash
# Clone the repository
git clone [your-repo-url]
cd tax-credit-calculator

# Serve locally (optional)
npm run dev
# or
python -m http.server 3000
```

## 🔧 Development

No build process required - pure static files.

```bash
# Install dependencies (optional, for development tools)
npm install

# Start local development server
npm run dev
```

## 📊 Credit Types

- **WOTC**: Work Opportunity Tax Credit for targeted hiring groups
- **R&D Payroll**: Research & development expense credits (up to $250K annually)
- **Empowerment Zone**: Credits for hiring in designated economic zones
- **State Credits**: CA, NY, TX specific hiring incentives
- **Paid Family Leave**: Credits for providing family/medical leave benefits
- **Childcare Support**: Credits for employee childcare assistance

## 🏢 Business Impact

- **Immediate Results**: Instant credit calculations
- **Professional Design**: Accrue-branded professional interface
- **Lead Capture**: Built-in contact form for business development
- **Mobile Optimized**: Perfect experience on all devices

## 📁 File Structure

```
├── index.html              # Main application (production ready)
├── credit_configs.json     # Credit calculation configuration
├── MultiCreditCalculator.js # Modular calculator classes
├── FINAL_CALCULATOR_LOGIC.js # Extracted calculation functions
├── vercel.json             # Vercel deployment configuration
├── package.json            # Project metadata
└── CLAUDE.md              # Development guidance
```

## 🌟 Key Features

- **Zero Build Process**: Ready to deploy as-is
- **Embedded Assets**: All CSS/JS included in HTML
- **Configuration-Driven**: Easy to update credit rates and rules
- **Responsive Design**: Mobile-first approach
- **Professional UI**: Modern design with animations

Built with ❤️ for Accrue