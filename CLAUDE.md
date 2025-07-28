# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a tax credit calculator project focused on calculating multiple stackable business tax credits. The main deliverable is a fully functional web-based calculator that helps businesses estimate their potential tax credits.

**Live Application**: https://nataliebendinelli.github.io/tax-calculator (main implementation)
**Local Main File**: `/Users/nataliebendinelli/tax-calculator.html` (1,269 lines - single-file implementation)

## Architecture

### Core Components

1. **Single-File Implementation** (`tax-calculator.html`): Complete calculator with embedded HTML, CSS, and JavaScript
2. **Modular Calculator Logic** (`MultiCreditCalculator.js`): Object-oriented tax credit calculation engine
3. **Credit Configuration** (`credit_configs.json`): Centralized configuration for all tax credit types and rates
4. **Final Logic Reference** (`FINAL_CALCULATOR_LOGIC.js`): Extracted calculation functions from the working implementation

### Credit Types Supported

- **WOTC (Work Opportunity Tax Credit)**: Federal hiring credits for targeted groups
- **R&D Payroll Credit**: Research & development expense credits against payroll taxes  
- **Empowerment Zone Credit**: Credits for hiring in designated economic zones
- **State-Specific Credits**: CA, NY, TX state-level hiring incentives
- **Paid Family Leave Credit**: Credits for providing family/medical leave benefits
- **Childcare Support Credit**: Credits for employee childcare assistance

### Architecture Pattern

The calculator uses a tiered approach:
1. **Configuration Layer**: `credit_configs.json` defines all rates, caps, and qualification rules
2. **Calculation Engine**: Class-based calculators (`BaseCalculator`, `WOTCCalculator`, etc.)
3. **User Interface**: 4-step wizard flow with validation and visual feedback
4. **Results Display**: Dynamic header transformation, confetti animation, credit breakdowns

## Key Files

- `tax-calculator.html`: Main production file (complete implementation)
- `MultiCreditCalculator.js`: Modular calculation classes with ES6 imports
- `credit_configs.json`: Centralized configuration for all credit types
- `FINAL_CALCULATOR_LOGIC.js`: Extracted vanilla JavaScript functions
- `IMPLEMENTATION_SUMMARY.md`: Complete project documentation and status

## Development Commands

**No build system**: This project uses pure HTML/CSS/JavaScript with no dependencies.

**Testing**: Manual testing via browser - no automated test framework configured.

**PDF Generation**: Use `python convert_to_pdf.py` to convert documentation to PDF format.

## Credit Calculation Logic

### WOTC Categories
- Veterans: 20% qualification rate, $5,600 max credit
- SNAP Recipients: 30% qualification rate, $2,400 max credit  
- Long-term Unemployed: 15% qualification rate, $2,400 max credit
- Vocational Rehab: 10% qualification rate, $2,400 max credit
- Empowerment Zone: 15% qualification rate, $3,000 max credit

### R&D Payroll Tiers
- Small ($5K-$25K): 60% qualification × 20% credit rate
- Medium ($25K-$100K): 70% qualification × 20% credit rate
- Large ($100K+): 80% qualification × 20% credit rate
- Maximum: $250,000 annually

### State Credits
- California: 25% qualification × $5,000 max
- New York: 20% qualification × $3,000 max  
- Texas: 18% qualification × $2,500 max

## Important Implementation Notes

- **Credit Stacking Rules**: Defined in `credit_configs.json` - some credits can stack, others cannot
- **Qualification Rates**: Conservative estimates built into each credit type
- **Maximum Caps**: Annual and per-employee limits enforced per IRS/state rules
- **ZIP Code Logic**: Empowerment zones determined by specific ZIP code mapping
- **State Eligibility**: Paid leave credits only available in specific states

## File Structure

```
/Users/nataliebendinelli/Desktop/pdf/
├── tax-calculator.html (MAIN PRODUCTION FILE)
├── MultiCreditCalculator.js (Modular version)
├── FINAL_CALCULATOR_LOGIC.js (Extracted functions)
├── credit_configs.json (Configuration data)
├── IMPLEMENTATION_SUMMARY.md (Full documentation)
├── Multi-Credit Calculator PRD.* (Requirements docs)
├── calculator-styles.css (Standalone styles)
└── convert_to_pdf.py (PDF conversion utility)
```

## Deployment

The calculator is deployed as a single HTML file to GitHub Pages. No build process or server required - can be opened directly in any modern browser.