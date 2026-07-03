import os
import markdown
from fpdf import FPDF
from PIL import Image
Image.MAX_IMAGE_PIXELS = None

class PDF(FPDF):
    def chapter_title(self, title):
        self.set_font("helvetica", 'B', 16)
        self.cell(0, 10, title, new_x="LMARGIN", new_y="NEXT", align='L')
        self.ln(4)

    def chapter_body(self, body):
        self.set_font("helvetica", '', 12)
        html = markdown.markdown(body)
        # Fix pagination bugs in fpdf2 HTML rendering by using simple tags
        html = html.replace('<h3>', '<br><br><b><font size="14">')
        html = html.replace('</h3>', '</font></b><br>')
        # Improve line spacing for the horizontal rule
        html = html.replace('<hr />', '<br><hr><br>')
        self.write_html(html)
        self.ln()

def add_image_page(pdf, image_path, title=None):
    if not os.path.exists(image_path):
        print(f"Skipping missing image: {image_path}")
        return
        
    with Image.open(image_path) as img:
        w, h = img.size
    
    orientation = 'L' if w > h else 'P'
    pdf.add_page(orientation=orientation)
    
    if title:
        pdf.set_font("helvetica", 'B', 14)
        pdf.cell(0, 10, title, new_x="LMARGIN", new_y="NEXT", align='C')
        pdf.ln(5)
    
    # Calculate dimensions to fit page
    page_w = pdf.w - 20 # 10 margins
    page_h = pdf.h - (30 if title else 20)
    
    ratio = min(page_w / w, page_h / h)
    new_w = w * ratio
    new_h = h * ratio
    
    x = (pdf.w - new_w) / 2
    y = pdf.get_y() if title else (pdf.h - new_h) / 2
    
    pdf.image(image_path, x=x, y=y, w=new_w, h=new_h)

def create_pdf():
    pdf = PDF()
    pdf.set_auto_page_break(auto=True, margin=15)
    
    # Cover Page
    pdf.add_page()
    pdf.set_y(40)
    pdf.set_text_color(0, 100, 50) # Dark Green for Martin-Luther-Universität
    pdf.set_font("helvetica", 'B', 16)
    pdf.cell(0, 10, "Martin-Luther-Universität Halle-Wittenberg", new_x="LMARGIN", new_y="NEXT", align='C')
    pdf.set_font("helvetica", '', 14)
    pdf.cell(0, 10, "Institut für Informatik / Wirtschaftsinformatik", new_x="LMARGIN", new_y="NEXT", align='C')
    
    pdf.ln(40)
    pdf.set_text_color(0, 0, 0)
    pdf.set_font("helvetica", 'B', 28)
    pdf.cell(0, 15, "Gästekarteprozess Optimierung", new_x="LMARGIN", new_y="NEXT", align='C')
    pdf.set_font("helvetica", 'I', 18)
    pdf.cell(0, 15, "Projektseminar Informationsmanagement · SS-26", new_x="LMARGIN", new_y="NEXT", align='C')
    
    pdf.ln(30)
    pdf.set_font("helvetica", '', 14)
    team = "Team: Doaa Al-Shoumi, Amy Müller, Jenna Peters, Sameer Rana, Jacy Richter"
    pdf.cell(0, 10, team, new_x="LMARGIN", new_y="NEXT", align='C')
    
    betreuer = "Betreuer: Sebastian Hirsekorn, Leonard Nake"
    pdf.cell(0, 10, betreuer, new_x="LMARGIN", new_y="NEXT", align='C')
    
    # 1. Ist Prozess - Text
    pdf.add_page()
    pdf.chapter_title("1. Ist-Prozess: Personas")
    
    personas_path = "../Artefakte/Final/1_Ist_Prozess/1_a_Personas/personas.md"
    if os.path.exists(personas_path):
        with open(personas_path, 'r', encoding='utf-8') as f:
            pdf.chapter_body(f.read())
            
    # UJM Images
    ujm_dir = "../Artefakte/Final/1_Ist_Prozess/1_b_User-Journey-Maps/"
    ujm_files = [
        "UJM_Internationaler-Gast.png",
        "UJM_Nationaler-Gast.png",
        "UJM_Host.png",
        "UJM_IO.png",
        "UJM_ITZ.png",
        "UJM_ULB.png"
    ]
    for ujm in ujm_files:
        add_image_page(pdf, os.path.join(ujm_dir, ujm), title=ujm.replace(".png", ""))
        
    # Ist Prozess BPMN
    add_image_page(pdf, "../Artefakte/Final/BPMN/Ist-Prozess.png", title="Ist-Prozess BPMN")
    
    # 2. Soll Prozess - Text
    pdf.add_page()
    pdf.chapter_title("2. Soll-Prozess: User Stories")
    
    stories_path = "../Artefakte/Final/2_Soll_Prozess/2_b_User-Stories/user-stories.md"
    if os.path.exists(stories_path):
        with open(stories_path, 'r', encoding='utf-8') as f:
            pdf.chapter_body(f.read())
            
    # Service Blueprint
    add_image_page(pdf, "../Artefakte/Final/2_Soll_Prozess/2_a_Service-Blueprint/service_blueprint.png", title="Service Blueprint")
    
    # Soll Prozess BPMN
    add_image_page(pdf, "../Artefakte/Final/BPMN/Soll-Prozess.png", title="Soll-Prozess BPMN")
    
    out_path = "../Artefakte/Final/Projekt_Artefakte_Export.pdf"
    pdf.output(out_path)
    print(f"Created: {out_path}")

if __name__ == "__main__":
    create_pdf()
