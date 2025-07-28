# PDF Conversion Instructions

The automatic PDF conversion encountered system library issues on macOS. However, I've created a perfectly formatted HTML version at:

**`/Users/nataliebendinelli/Desktop/Multi-Credit Calculator PRD.html`**

## Easy Conversion Options:

### Option 1: Browser Print to PDF (Recommended)
1. Open `Multi-Credit Calculator PRD.html` in your browser
2. Press `Cmd+P` (Print)
3. Select "Save as PDF" as destination
4. Choose page settings and save

### Option 2: Online Converter
1. Visit: https://md-to-pdf.fly.dev/
2. Upload `Multi-Credit Calculator PRD.md`
3. Download the generated PDF

### Option 3: VS Code (If you have it)
1. Install "Markdown PDF" extension
2. Open the `.md` file in VS Code
3. Press `Cmd+Shift+P` → "Markdown PDF: Export (pdf)"

### Option 4: Install System Tools
```bash
# Install pandoc and wkhtmltopdf
brew install pandoc wkhtmltopdf

# Then convert
pandoc "Multi-Credit Calculator PRD.md" -o "Multi-Credit Calculator PRD.pdf" --pdf-engine=wkhtmltopdf
```

## What's Available:
- ✅ **Styled HTML version** ready for browser printing
- ✅ **Original Markdown** for any converter
- ✅ **Python conversion script** (for future use)

The HTML version has professional styling and will produce a high-quality PDF when printed from your browser.