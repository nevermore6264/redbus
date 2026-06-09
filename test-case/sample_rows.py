# -*- coding: utf-8 -*-
import openpyxl
from pathlib import Path
p = Path(__file__).parent / "RedBus_TestCase.xlsx"
wb = openpyxl.load_workbook(p, read_only=True)
with open(Path(__file__).parent / "_sample.txt", "w", encoding="utf-8") as f:
    for sheet in ["XacThuc", "DatVe", "ThanhToan", "LuongE2E"]:
        ws = wb[sheet]
        f.write(f"\n=== {sheet} ===\n")
        for i, row in enumerate(ws.iter_rows(min_row=1, max_row=4, values_only=True), 1):
            f.write(f"{i}: {row[:4]}...\n")
