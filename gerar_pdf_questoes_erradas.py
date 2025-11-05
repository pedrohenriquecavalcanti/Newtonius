"""Ferramenta Tkinter para gerar um PDF com todas as páginas
que contêm questões marcadas como erradas no Newtonius.

Fluxo de uso:
1. Escolha o arquivo JSON exportado pelo site (botão Exportar).
2. Informe a pasta que contém os PDFs das provas (mesmos nomes do repositório).
3. Defina onde salvar o novo PDF (padrão: "Questoes_Erradas.pdf").

O script lê o export, identifica as questões erradas (estado 2) e,
utilizando os bancos locais (data.js, dataD1.js e data_naoclassificadas.js),
monta um PDF com todas as páginas relevantes para revisão.
"""
from __future__ import annotations

import json
import re
from collections import defaultdict
from dataclasses import dataclass
from pathlib import Path
from tkinter import Tk, messagebox
from tkinter import ttk
from tkinter.filedialog import askdirectory, askopenfilename, asksaveasfilename
from typing import Dict, Iterable, List, Mapping, Optional, Sequence, Set, Tuple
from urllib.parse import unquote

try:
    from PyPDF2 import PdfReader, PdfWriter
except ModuleNotFoundError as exc:  # pragma: no cover - feedback imediato
    raise SystemExit(
        "PyPDF2 não encontrado. Instale com 'pip install PyPDF2' e execute novamente."
    ) from exc


REPO_ROOT = Path(__file__).resolve().parent
DATA_JS = REPO_ROOT / "data.js"
DATA_D1_JS = REPO_ROOT / "dataD1.js"
DATA_UNCLASSIFIED_JS = REPO_ROOT / "data_naoclassificadas.js"


@dataclass(frozen=True)
class QuestionEntry:
    label: str
    pdf_name: str
    pages: Tuple[int, ...]


def _load_json_array_from_js(js_path: Path, assignment_regex: str) -> List[dict]:
    """Extrai o array JSON de um arquivo .js com atribuição simples."""
    text = js_path.read_text(encoding="utf-8")
    match = re.search(assignment_regex, text, re.DOTALL)
    if not match:
        raise ValueError(f"Não foi possível localizar os dados em {js_path}")
    array_text = match.group(1)
    return json.loads(array_text)


def _expand_unclassified_entries(raw_entries: Sequence[Mapping[str, object]]) -> List[dict]:
    def build_index(pages_map: Mapping[str, Iterable[int]]) -> Dict[int, List[int]]:
        index: Dict[int, List[int]] = {}
        for page_str, numbers in (pages_map or {}).items():
            try:
                page_num = int(page_str)
            except (TypeError, ValueError):
                continue
            for number in numbers or []:
                try:
                    qnum = int(number)
                except (TypeError, ValueError):
                    continue
                index.setdefault(qnum, [])
                if page_num not in index[qnum]:
                    index[qnum].append(page_num)
        for pages in index.values():
            pages.sort()
        return index

    expanded: List[dict] = []
    for entry in raw_entries:
        label_prefix = entry.get("labelPrefix")
        questoes_por_pagina = entry.get("questoesPorPagina") or {}
        question_pages = build_index(questoes_por_pagina)
        for question_number, pages in question_pages.items():
            expanded.append(
                {
                    "Disciplina": entry.get("disciplina"),
                    "Assunto": entry.get("Assunto", "__sem_assunto__"),
                    "label": f"{label_prefix}-Q-{question_number}",
                    "QPDFName": entry.get("provaPdf"),
                    "page": pages,
                }
            )
    return expanded


def load_question_bank() -> Dict[str, QuestionEntry]:
    """Carrega o banco de questões (label -> dados da questão)."""
    main_entries = _load_json_array_from_js(
        DATA_JS, r"listaQuestoes\s*=\s*(\[.*?\]);"
    )
    d1_entries = _load_json_array_from_js(
        DATA_D1_JS, r"listaQuestoesD1\s*=\s*(\[.*?\]);"
    )
    raw_unclassified = _load_json_array_from_js(
        DATA_UNCLASSIFIED_JS, r"rawEntries\s*=\s*(\[.*?\]);"
    )
    unclassified_entries = _expand_unclassified_entries(raw_unclassified)

    all_entries: List[Mapping[str, object]] = (
        list(main_entries) + list(d1_entries) + list(unclassified_entries)
    )

    mapping: Dict[str, QuestionEntry] = {}
    for entry in all_entries:
        label = entry.get("label")
        pdf_name = entry.get("QPDFName")
        pages = entry.get("page")
        if not label or not pdf_name or not pages:
            continue
        key = str(label)
        mapping[key] = QuestionEntry(
            label=key,
            pdf_name=str(pdf_name),
            pages=tuple(int(p) for p in pages),
        )
    return mapping


def parse_export(file_path: Path) -> Dict[str, object]:
    return json.loads(file_path.read_text(encoding="utf-8"))


def extract_wrong_question_labels(export_data: Mapping[str, object]) -> Set[str]:
    labels: Set[str] = set()
    for key, value in export_data.items():
        if not isinstance(value, (str, int)):
            continue
        try:
            normalized_value = int(value)
        except (TypeError, ValueError):
            continue
        if normalized_value != 2:
            continue
        if "_" not in key:
            continue
        try:
            disc_and_sub, encoded_label = key.rsplit("_", 1)
            disc, _sub = disc_and_sub.split("_", 1)
        except ValueError:
            continue
        if not disc:
            continue
        label = unquote(encoded_label)
        labels.add(label)
    return labels


def build_pdf(
    pdfs_dir: Path,
    entries: Mapping[str, QuestionEntry],
    labels: Iterable[str],
    output_path: Path,
) -> Tuple[int, int]:
    pages_by_pdf: Dict[str, Set[int]] = defaultdict(set)
    missing_labels: List[str] = []
    for label in labels:
        entry = entries.get(label)
        if not entry:
            missing_labels.append(label)
            continue
        pages_by_pdf[entry.pdf_name].update(entry.pages)

    if missing_labels:
        raise KeyError(
            "Não foi possível localizar as seguintes questões no banco local: "
            + ", ".join(sorted(missing_labels))
        )

    writer = PdfWriter()
    total_pages = 0

    for pdf_name, pages in sorted(pages_by_pdf.items()):
        pdf_path = pdfs_dir / pdf_name
        if not pdf_path.exists():
            raise FileNotFoundError(f"PDF não encontrado: {pdf_path}")
        reader = PdfReader(str(pdf_path))
        for page_index in sorted(pages):
            if page_index < 1 or page_index > len(reader.pages):
                raise IndexError(
                    f"Página {page_index} fora do intervalo para {pdf_name} (total {len(reader.pages)})"
                )
            writer.add_page(reader.pages[page_index - 1])
            total_pages += 1

    if total_pages == 0:
        raise ValueError("Nenhuma questão errada encontrada no export fornecido.")

    with output_path.open("wb") as fh:
        writer.write(fh)

    return total_pages, len(pages_by_pdf)


class App(Tk):
    def __init__(self) -> None:
        super().__init__()
        self.title("Gerar PDF de Questões Erradas - Newtonius")
        self.geometry("460x220")
        self.resizable(False, False)
        self.question_bank = load_question_bank()

        padding = {"padx": 16, "pady": 8}

        description = (
            "Esta ferramenta gera um PDF reunindo todas as páginas que contêm "
            "questões marcadas como erradas no Newtonius.\n\n"
            "Clique no botão abaixo e siga as etapas para selecionar o export "
            "(JSON) e a pasta com os PDFs."
        )

        ttk.Label(self, text=description, wraplength=420, justify="left").grid(
            row=0, column=0, **padding
        )

        ttk.Button(self, text="Selecionar arquivos e gerar PDF", command=self.run_flow).grid(
            row=1, column=0, **padding
        )

    def run_flow(self) -> None:
        try:
            export_path = self._ask_export_file()
            if not export_path:
                return
            pdf_dir = self._ask_pdf_directory()
            if not pdf_dir:
                return
            output_path = self._ask_output_path(export_path.parent)
            if not output_path:
                return
            export_data = parse_export(export_path)
            labels = extract_wrong_question_labels(export_data)
            total_pages, total_pdfs = build_pdf(
                pdf_dir, self.question_bank, labels, output_path
            )
            messagebox.showinfo(
                "PDF gerado",
                (
                    "PDF criado com sucesso!\n\n"
                    f"Arquivo: {output_path}\n"
                    f"Provas utilizadas: {total_pdfs}\n"
                    f"Páginas adicionadas: {total_pages}"
                ),
            )
        except Exception as exc:  # pylint: disable=broad-exception-caught
            messagebox.showerror("Erro", str(exc))

    def _ask_export_file(self) -> Optional[Path]:
        file_path = askopenfilename(
            title="Selecione o export JSON do Newtonius",
            filetypes=[("JSON", "*.json"), ("Todos os arquivos", "*.*")],
        )
        return Path(file_path) if file_path else None

    def _ask_pdf_directory(self) -> Optional[Path]:
        directory = askdirectory(title="Selecione a pasta com os PDFs das provas")
        return Path(directory) if directory else None

    def _ask_output_path(self, default_dir: Path) -> Optional[Path]:
        default_name = "Questoes_Erradas.pdf"
        file_path = asksaveasfilename(
            title="Salvar PDF de questões erradas",
            defaultextension=".pdf",
            initialdir=str(default_dir),
            initialfile=default_name,
            filetypes=[("PDF", "*.pdf"), ("Todos os arquivos", "*.*")],
        )
        return Path(file_path) if file_path else None


def main() -> None:
    app = App()
    app.mainloop()


if __name__ == "__main__":
    main()
