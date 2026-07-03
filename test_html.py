from fpdf import FPDF
import markdown

pdf = FPDF()
pdf.add_page()
pdf.set_font("helvetica", size=12)

md_text = """
## Hello World

- List item 1
- List **item** 2
"""
html = markdown.markdown(md_text)
pdf.write_html(html)
pdf.output("test.pdf")
print("Done")
