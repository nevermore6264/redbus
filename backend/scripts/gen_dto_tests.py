# -*- coding: utf-8 -*-
"""Generate 1-2 test methods for mohinh/truyen DTOs."""
import os
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
MAIN = ROOT / "src" / "main" / "java"
TEST = ROOT / "src" / "test" / "java"

SKIP_CLASSES = {"UngDungRedBus", "KhoiTaoDuLieuMau", "HoTroTestMvc", "PhanHoiChung"}
SKIP_PREFIX = "com.redbus.anhxa."
EXISTING_KEEP = {
    "PhanHoiChungTest", "XuLyLoiChungTest", "TienIchJwtTest",
    "DichVuNguoiDungHeThongTest", "DichVuKhuyenMaiTest", "DichVuDiemDungChanTest",
    "DichVuXeKhachTest", "DichVuHetHanVeTest", "DichVuGheNgoiTest", "DichVuTinTucTest",
    "DichVuTuyenDuongTest", "DieuKhienKhuyenMaiTest", "TienIchMaVeTest",
}
DTO_PACKAGES = ("com.redbus.mohinh.", "com.redbus.truyen.")


def pkg_and_class(path: Path):
    rel = path.relative_to(MAIN)
    pkg = ".".join(rel.parts[:-1])
    return pkg, path.stem


def first_field(src: str):
    m = re.search(r"private\s+([\w.<>\[\]]+)\s+(\w+)\s*;", src)
    return (m.group(1), m.group(2)) if m else (None, None)


def sample_value(ftype: str, fname: str, pkg: str):
    if ftype == "ChuyenXe" or "ChuyenXe" in ftype:
        return "com.redbus.mohinh.ChuyenXe.builder().ma(1L).build()"
    if ftype == "long":
        return "1L"
    if ftype == "Long":
        return "1L"
    if ftype == "Integer":
        return "1"
    if ftype == "int":
        return "1"
    if ftype == "String":
        return '"val"'
    if ftype == "Boolean" or ftype == "boolean":
        return "true"
    if "BigDecimal" in ftype:
        return "java.math.BigDecimal.ONE"
    if "LocalDateTime" in ftype:
        return "java.time.LocalDateTime.now()"
    if "LocalDate" in ftype:
        return "java.time.LocalDate.now()"
    if "List" in ftype:
        return "java.util.List.of()"
    return "null"


def has_annotation(src: str, name: str) -> bool:
    return name in src


def extra_imports(ftype: str, pkg: str, body: str):
    imps = set()
    if "BigDecimal" in ftype or "BigDecimal" in body:
        imps.add("import java.math.BigDecimal;")
    if "LocalDateTime" in ftype or "LocalDateTime" in body:
        imps.add("import java.time.LocalDateTime;")
    if "LocalDate" in ftype or "LocalDate" in body:
        imps.add("import java.time.LocalDate;")
    if "ChuyenXe" in ftype and pkg.startswith("com.redbus.truyen"):
        imps.add("import com.redbus.mohinh.ChuyenXe;")
    return sorted(imps)


def gen_test(pkg: str, cls: str, src: str):
    if "@Data" not in src and "@Getter" not in src:
        return None
    ftype, fname = first_field(src)
    if not fname:
        return None
    val = sample_value(ftype, fname, pkg)
    cap = fname[0].upper() + fname[1:]
    builder = has_annotation(src, "@Builder")
    no_args = has_annotation(src, "@NoArgsConstructor") or "record " in src

    tests = []
    if builder:
        tests.append(f"""
    @Test
    @DisplayName("builder gán trường {fname}")
    void builder_{fname}() {{
        {cls} o = {cls}.builder().{fname}({val}).build();
        assertEquals({val}, o.get{cap}());
    }}""")
    if no_args or not builder:
        tests.append(f"""
    @Test
    @DisplayName("setter cập nhật trường {fname}")
    void setter_{fname}() {{
        {cls} o = new {cls}();
        o.set{cap}({val});
        assertEquals({val}, o.get{cap}());
    }}""")
    if not tests:
        return None
    body = "".join(tests)
    imps = extra_imports(ftype, pkg, body)
    imp_block = "\n".join(imps) + ("\n" if imps else "")
    return f"""package {pkg};

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
{imp_block}
import static org.junit.jupiter.api.Assertions.*;

@DisplayName("{cls}")
class {cls}Test {{
{body}
}}
"""


def main():
    created = 0
    for path in sorted(MAIN.rglob("*.java")):
        pkg, cls = pkg_and_class(path)
        fq = pkg + "." + cls
        if cls in SKIP_CLASSES or fq.startswith(SKIP_PREFIX):
            continue
        if f"{cls}Test" in EXISTING_KEEP:
            continue
        if not any(fq.startswith(p) for p in DTO_PACKAGES):
            continue
        test_path = TEST / pkg.replace(".", os.sep) / f"{cls}Test.java"
        src = path.read_text(encoding="utf-8")
        content = gen_test(pkg, cls, src)
        if not content:
            continue
        test_path.parent.mkdir(parents=True, exist_ok=True)
        test_path.write_text(content, encoding="utf-8", newline="\n")
        created += 1
    print("regenerated", created)


if __name__ == "__main__":
    main()
