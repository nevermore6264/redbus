# -*- coding: utf-8 -*-
import re
from pathlib import Path

TEST = Path(__file__).resolve().parents[1] / "src" / "test" / "java"
MAIN = Path(__file__).resolve().parents[1] / "src" / "main" / "java"

TYPE_SAMPLES = {
    "long": "1L", "Long": "1L", "Integer": "1", "int": "1", "String": '"x"',
    "Boolean": "true", "boolean": "true", "BigDecimal": "java.math.BigDecimal.ONE",
    "LocalDateTime": "java.time.LocalDateTime.now()", "LocalDate": "java.time.LocalDate.now()",
    "ChuyenXe": "com.redbus.mohinh.ChuyenXe.builder().ma(1L).build()",
}


def first_field(src):
    m = re.search(r"private\s+([\w.<>\[\]]+)\s+(\w+)\s*;", src)
    return (m.group(1), m.group(2)) if m else (None, None)


def sample(ftype):
    base = ftype.replace("[]", "")
    if base in TYPE_SAMPLES:
        return TYPE_SAMPLES[base]
    if "ChuyenXe" in ftype:
        return TYPE_SAMPLES["ChuyenXe"]
    if "List" in ftype:
        return "java.util.List.of()"
    return "null"


def rewrite_test(main_path: Path, test_path: Path):
    src = main_path.read_text(encoding="utf-8")
    cls = main_path.stem
    pkg = ".".join(main_path.relative_to(MAIN).parts[:-1])
    ftype, fname = first_field(src)
    if not fname:
        return False
    val = sample(ftype)
    cap = fname[0].upper() + fname[1:]
    has_builder = "@Builder" in src
    has_no_args = "@NoArgsConstructor" in src or "@Data" in src

    parts = []
    if has_builder:
        parts.append(f"""    @Test
    @DisplayName("builder gán trường {fname}")
    void builder_{fname}() {{
        {cls} o = {cls}.builder().{fname}({val}).build();
        assertEquals({val}, o.get{cap}());
    }}""")
    if has_no_args and "@Builder" not in src or has_no_args:
        if "@Builder" not in src or "@NoArgsConstructor" in src:
            parts.append(f"""    @Test
    @DisplayName("setter cập nhật trường {fname}")
    void setter_{fname}() {{
        {cls} o = new {cls}();
        o.set{cap}({val});
        assertEquals({val}, o.get{cap}());
    }}""")

    if cls == "DonViHanhChinh":
        content = f"""package {pkg};

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

@DisplayName("{cls}")
class {cls}Test {{

    @Test
    @DisplayName("getter/setter name và code")
    void setter_nameVaCode() {{
        {cls} o = new {cls}();
        o.setName("HN");
        o.setCode(1);
        assertEquals("HN", o.getName());
        assertEquals(1, o.getCode());
    }}
}}
"""
    else:
        imps = []
        if "BigDecimal" in val:
            imps.append("import java.math.BigDecimal;")
        if "LocalDateTime" in val:
            imps.append("import java.time.LocalDateTime;")
        if "ChuyenXe" in val:
            imps.append("import com.redbus.mohinh.ChuyenXe;")
        imp_block = "\n".join(imps) + ("\n" if imps else "")
        content = f"""package {pkg};

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
{imp_block}
import static org.junit.jupiter.api.Assertions.*;

@DisplayName("{cls}")
class {cls}Test {{
{chr(10).join(parts)}
}}
"""
    test_path.write_text(content, encoding="utf-8", newline="\n")
    return True


def main():
    n = 0
    for main_path in MAIN.rglob("*.java"):
        pkg = ".".join(main_path.relative_to(MAIN).parts[:-1])
        if not (pkg.startswith("com.redbus.mohinh") or pkg.startswith("com.redbus.truyen")):
            continue
        if main_path.stem == "PhanHoiChung":
            continue
        test_path = TEST / pkg.replace(".", "/") / f"{main_path.stem}Test.java"
        if test_path.exists() and rewrite_test(main_path, test_path):
            n += 1
    print("fixed", n)


if __name__ == "__main__":
    main()
