#!/usr/bin/env python3
"""
Markdown to PDF Converter
Converts the Multi-Credit Calculator PRD from Markdown to PDF
"""

import subprocess
import sys
import os
from pathlib import Path

def install_requirements():
    """Install required packages"""
    try:
        import markdown
        import weasyprint
        print("✅ Required packages already installed")
        return True
    except ImportError:
        print("📦 Installing required packages...")
        try:
            subprocess.check_call([sys.executable, "-m", "pip", "install", "markdown", "weasyprint"])
            return True
        except subprocess.CalledProcessError:
            print("❌ Failed to install packages. Trying alternative method...")
            return False

def convert_md_to_html(md_file, html_file):
    """Convert markdown to HTML"""
    try:
        import markdown
        
        # Read markdown file
        with open(md_file, 'r', encoding='utf-8') as file:
            md_content = file.read()
        
        # Convert to HTML with extensions
        md = markdown.Markdown(extensions=['tables', 'codehilite', 'toc'])
        html_content = md.convert(md_content)
        
        # Add CSS styling for better PDF output
        html_template = f"""
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="utf-8">
            <title>Multi-Credit Calculator PRD</title>
            <style>
                body {{
                    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif;
                    line-height: 1.6;
                    margin: 40px;
                    color: #333;
                }}
                h1, h2, h3, h4 {{
                    color: #2c3e50;
                    margin-top: 30px;
                    margin-bottom: 15px;
                }}
                h1 {{
                    border-bottom: 3px solid #3498db;
                    padding-bottom: 10px;
                }}
                h2 {{
                    border-bottom: 2px solid #ecf0f1;
                    padding-bottom: 8px;
                }}
                table {{
                    border-collapse: collapse;
                    width: 100%;
                    margin: 20px 0;
                }}
                th, td {{
                    border: 1px solid #ddd;
                    padding: 12px;
                    text-align: left;
                }}
                th {{
                    background-color: #f8f9fa;
                    font-weight: 600;
                }}
                code {{
                    background-color: #f8f9fa;
                    padding: 2px 6px;
                    border-radius: 3px;
                    font-family: 'Monaco', 'Consolas', monospace;
                }}
                pre {{
                    background-color: #f8f9fa;
                    padding: 15px;
                    border-radius: 5px;
                    overflow-x: auto;
                }}
                blockquote {{
                    border-left: 4px solid #3498db;
                    padding-left: 20px;
                    margin-left: 0;
                    font-style: italic;
                }}
                .page-break {{
                    page-break-before: always;
                }}
                @media print {{
                    body {{ margin: 20px; }}
                    h1, h2, h3 {{ page-break-after: avoid; }}
                }}
            </style>
        </head>
        <body>
            {html_content}
        </body>
        </html>
        """
        
        # Write HTML file
        with open(html_file, 'w', encoding='utf-8') as file:
            file.write(html_template.strip())
        
        print(f"✅ HTML created: {html_file}")
        return True
        
    except Exception as e:
        print(f"❌ Error converting to HTML: {e}")
        return False

def convert_html_to_pdf(html_file, pdf_file):
    """Convert HTML to PDF using weasyprint"""
    try:
        from weasyprint import HTML, CSS
        from weasyprint.text.fonts import FontConfiguration
        
        # Create font configuration
        font_config = FontConfiguration()
        
        # Custom CSS for PDF
        css = CSS(string="""
            @page {
                size: A4;
                margin: 2cm;
            }
            body {
                font-size: 11pt;
                line-height: 1.4;
            }
            h1 { font-size: 18pt; }
            h2 { font-size: 16pt; }
            h3 { font-size: 14pt; }
            h4 { font-size: 12pt; }
        """, font_config=font_config)
        
        # Convert to PDF
        HTML(filename=html_file).write_pdf(
            pdf_file, 
            stylesheets=[css],
            font_config=font_config
        )
        
        print(f"✅ PDF created: {pdf_file}")
        return True
        
    except Exception as e:
        print(f"❌ Error converting to PDF: {e}")
        return False

def fallback_conversion(md_file, pdf_file):
    """Fallback conversion using system tools"""
    
    # Try using textutil (macOS)
    if sys.platform == 'darwin':
        try:
            # First convert to RTF, then to PDF
            rtf_file = pdf_file.replace('.pdf', '.rtf')
            subprocess.check_call([
                'textutil', '-convert', 'rtf', md_file, '-output', rtf_file
            ])
            subprocess.check_call([
                'textutil', '-convert', 'pdf', rtf_file, '-output', pdf_file
            ])
            os.remove(rtf_file)  # Clean up RTF file
            print(f"✅ PDF created using textutil: {pdf_file}")
            return True
        except (subprocess.CalledProcessError, FileNotFoundError):
            pass
    
    # Try using pandoc if available
    try:
        subprocess.check_call([
            'pandoc', md_file, '-o', pdf_file, 
            '--pdf-engine=wkhtmltopdf'
        ])
        print(f"✅ PDF created using pandoc: {pdf_file}")
        return True
    except (subprocess.CalledProcessError, FileNotFoundError):
        pass
    
    return False

def main():
    """Main conversion function"""
    # File paths
    base_dir = Path('/Users/nataliebendinelli/Desktop')
    md_file = base_dir / 'Multi-Credit Calculator PRD.md'
    html_file = base_dir / 'Multi-Credit Calculator PRD.html'
    pdf_file = base_dir / 'Multi-Credit Calculator PRD.pdf'
    
    print("🔄 Starting Markdown to PDF conversion...")
    
    # Check if markdown file exists
    if not md_file.exists():
        print(f"❌ Markdown file not found: {md_file}")
        return False
    
    # Try Python-based conversion first
    if install_requirements():
        print("📄 Converting using Python libraries...")
        if convert_md_to_html(md_file, html_file):
            if convert_html_to_pdf(html_file, pdf_file):
                # Clean up HTML file
                html_file.unlink()
                return True
    
    # Fallback to system tools
    print("📄 Trying system-based conversion...")
    if fallback_conversion(str(md_file), str(pdf_file)):
        return True
    
    # Manual instructions if all else fails
    print("\n❌ Automatic conversion failed. Manual options:")
    print("1. Use online converter: https://md-to-pdf.fly.dev/")
    print("2. Open in text editor and print to PDF")
    print("3. Use VS Code with Markdown PDF extension")
    print("4. Install pandoc: brew install pandoc wkhtmltopdf")
    
    return False

if __name__ == "__main__":
    success = main()
    sys.exit(0 if success else 1)