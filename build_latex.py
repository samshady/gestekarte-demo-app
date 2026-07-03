import os
import subprocess
import re

def run_cmd(cmd):
    print(f"Running: {cmd}")
    subprocess.run(cmd, shell=True, check=True)

def fix_numbering_and_spacing(tex_file):
    with open(tex_file, "r", encoding="utf-8") as f:
        tex = f.read()

    # Convert \subsubsection to \subsection so LaTeX assigns 1.1 instead of 0.0.1
    tex = tex.replace(r"\subsubsection", r"\subsection")
    
    # Strip manual bullet number sequences from headers like "1. Der internationale Gast"
    tex = re.sub(r'\\subsection\{(\d+\.\s*)', r'\\subsection{', tex)

    # Add generous spacing around the horizontal rules between personas
    tex = tex.replace(r"\begin{center}\rule{0.5\linewidth}{0.5pt}\end{center}",
                      r"\vspace{1cm}\begin{center}\rule{0.5\linewidth}{0.5pt}\end{center}\vspace{1cm}")
    
    with open(tex_file, "w", encoding="utf-8") as f:
        f.write(tex)

def main():
    out_dir = "/home/sam/Development/workflow-optimisation/Projektseminar_Infomanagement/Artefakte/Final"
    os.chdir(out_dir)

    # 1. Convert Markdown to TeX snippets
    run_cmd("pandoc 1_Ist_Prozess/1_a_Personas/personas.md -o personas.tex")
    run_cmd("pandoc 2_Soll_Prozess/2_b_User-Stories/user-stories.md -o user-stories.tex")

    fix_numbering_and_spacing("personas.tex")
    fix_numbering_and_spacing("user-stories.tex")

    # 2. Compile LaTeX using the pre-existing, correct template (do not overwrite it)
    run_cmd("pdflatex -interaction=nonstopmode Projekt_Artefakte_Export.tex")
    run_cmd("pdflatex -interaction=nonstopmode Projekt_Artefakte_Export.tex") # Run twice to ensure TOC/numbering stability
    print("LaTeX build complete.")

if __name__ == "__main__":
    main()
