#!/usr/bin/env python3
"""Generate ERD drawio: orthogonal routing via empty corridors (no lines over tables)."""

TABLE_STYLE = (
    "swimlane;fontStyle=1;childLayout=stackLayout;horizontal=1;startSize=26;"
    "fillColor=#ffffff;strokeColor=#000000;fontColor=#000000;fontSize=10;"
)
COL_STYLE = "text;align=left;fontSize=9;fontColor=#000000;strokeColor=none;fillColor=none;"
EDGE_STYLE = (
    "edgeStyle=orthogonalEdgeStyle;rounded=0;orthogonalLoop=1;jettySize=auto;html=1;"
    "strokeWidth=1.5;strokeColor=#000000;"
)
EDGE_DASH = EDGE_STYLE + "dashed=1;"

# Routing lanes (empty horizontal bands — no tables placed here)
TOP_BUS = 20
BOT_BUS = 830

TABLES = {
    "tk": ("tai_khoan", 40, 60, 220, [
        "ma BIGINT PK AI", "ten_dang_nhap VARCHAR(64) UK", "email VARCHAR(128) UK",
        "mat_khau_bam VARCHAR(255)", "vai_tro VARCHAR(32)", "hoat_dong TINYINT(1)",
        "thoi_gian_tao TIMESTAMP",
    ]),
    "otp": ("ma_otp", 40, 260, 220, [
        "ma BIGINT PK AI", "email VARCHAR(128)", "ma_otp VARCHAR(8)", "loai VARCHAR(32)",
        "het_han_luc DATETIME", "da_dung TINYINT(1)",
    ]),
    "chat": ("tin_nhan_chat", 40, 460, 220, [
        "ma BIGINT PK AI", "ma_nguoi_gui BIGINT FK", "ma_nguoi_nhan BIGINT FK",
        "noi_dung TEXT", "da_doc_nhan TINYINT(1)",
    ]),
    "kh": ("khach_hang", 300, 60, 220, [
        "ma BIGINT PK AI", "ma_tai_khoan BIGINT FK UK", "ho_ten VARCHAR(128)",
        "so_dien_thoai VARCHAR(32)", "dia_chi VARCHAR(255)",
    ]),
    "tb": ("thong_bao", 300, 240, 220, [
        "ma BIGINT PK AI", "ma_nguoi_dung BIGINT FK", "tieu_de VARCHAR(255)",
        "noi_dung TEXT", "da_doc TINYINT(1)",
    ]),
    "hd": ("hoi_dap", 300, 420, 220, [
        "ma BIGINT PK AI", "ma_khach BIGINT FK", "tieu_de VARCHAR(255)",
        "noi_dung_hoi TEXT", "noi_dung_tra_loi TEXT", "ma_nguoi_tra_loi BIGINT FK",
        "trang_thai VARCHAR(32)",
    ]),
    "td": ("tuyen_duong", 580, 60, 230, [
        "ma BIGINT PK AI", "diem_di VARCHAR(128)", "diem_den VARCHAR(128)",
        "khoang_cach_km INT", "thoi_gian_uoc_tinh_phut INT", "hoat_dong TINYINT(1)",
    ]),
    "ddc": ("diem_dung_chan", 870, 60, 230, [
        "ma BIGINT PK AI", "ma_tuyen BIGINT FK", "ten_diem VARCHAR(128)", "thu_tu INT",
        "vi_do DOUBLE, kinh_do DOUBLE", "thoi_gian_dung_phut INT",
    ]),
    "lx": ("loai_xe", 580, 240, 230, [
        "ma BIGINT PK AI", "ten VARCHAR(128)", "mo_ta VARCHAR(512)",
        "tien_ich VARCHAR(255)", "hoat_dong TINYINT(1)",
    ]),
    "lxa": ("loai_xe_anh", 870, 240, 230, [
        "ma BIGINT PK AI", "ma_loai_xe BIGINT FK", "tep VARCHAR(512)", "thu_tu INT",
    ]),
    "xk": ("xe_khach", 580, 420, 230, [
        "ma BIGINT PK AI", "ma_loai_xe BIGINT FK", "bien_so VARCHAR(32) UK",
        "hang_xe VARCHAR(64)", "so_cho INT", "hoat_dong TINYINT(1)",
    ]),
    "gn": ("ghe_ngoi", 870, 420, 230, [
        "ma BIGINT PK AI", "ma_xe BIGINT FK", "ky_hieu_ghe VARCHAR(16)",
        "hang INT, cot INT, tang INT", "trang_thai VARCHAR(32)",
        "UK (ma_xe, ky_hieu_ghe)",
    ]),
    "cx": ("chuyen_xe", 620, 640, 260, [
        "ma BIGINT PK AI", "ma_tuyen BIGINT FK", "ma_xe BIGINT FK",
        "thoi_diem_khoi_hanh DATETIME", "thoi_diem_den DATETIME",
        "gia_ve DECIMAL(12,2)", "trang_thai VARCHAR(32)",
    ]),
    "vx": ("ve_xe", 1240, 260, 260, [
        "ma BIGINT PK AI", "ma_chuyen BIGINT FK", "ma_khach BIGINT FK",
        "ma_ghe_ngoi BIGINT FK", "trang_thai VARCHAR(32)", "ma_ve_hien_thi VARCHAR(16) UK",
        "ma_diem_len / ma_diem_xuong BIGINT", "ma_khuyen_mai BIGINT FK",
        "ma_hinh_thuc BIGINT FK", "so_tien_thanh_toan DECIMAL(12,2)",
        "ma_don_payos VARCHAR(128)", "thoi_gian_dat / thoi_gian_thanh_toan",
        "UK (ma_chuyen, ma_ghe_ngoi)",
    ]),
    "km": ("khuyen_mai", 1580, 60, 240, [
        "ma BIGINT PK AI", "ma_code VARCHAR(64) UK", "phan_tram_giam DECIMAL(5,2)",
        "so_tien_giam_toi_da DECIMAL(12,2)", "ngay_bat_dau / ngay_ket_thuc",
        "gioi_han_so_lan INT", "so_lan_da_dung INT", "hoat_dong TINYINT(1)",
    ]),
    "htt": ("hinh_thuc_thanh_toan", 1580, 260, 240, [
        "ma BIGINT PK AI", "ma_loai VARCHAR(32) UK", "ten VARCHAR(128)",
        "mo_ta VARCHAR(512)", "hoat_dong TINYINT(1)",
    ]),
    "dg": ("danh_gia_chuyen", 1580, 460, 260, [
        "ma BIGINT PK AI", "ma_chuyen BIGINT FK", "ma_khach BIGINT FK",
        "diem_so TINYINT", "nhan_xet TEXT", "UK (ma_chuyen, ma_khach)",
    ]),
    "tt": ("tin_tuc", 1580, 660, 260, [
        "ma BIGINT PK AI", "tieu_de VARCHAR(255)", "tom_tat VARCHAR(512)",
        "noi_dung TEXT", "duong_anh VARCHAR(512)", "ngay_xuat_ban DATETIME",
    ]),
}

ROW_H = 16
HEADER = 26


def table_height(cols: list[str]) -> int:
    return HEADER + len(cols) * ROW_H


def geom(tid: str) -> tuple[int, int, int, int]:
    _, x, y, w, cols = TABLES[tid]
    return x, y, w, table_height(cols)


def right(tid: str) -> int:
    x, _, w, _ = geom(tid)
    return x + w


def left(tid: str) -> int:
    return geom(tid)[0]


def bottom(tid: str) -> int:
    x, y, _, h = geom(tid)
    return y + h


def top(tid: str) -> int:
    return geom(tid)[1]


def cx_mid(tid: str) -> int:
    x, _, w, _ = geom(tid)
    return x + w // 2


def cy_mid(tid: str) -> int:
    x, y, w, h = geom(tid)
    return y + h // 2


# Vertical corridor between ops (x=810) and ve_xe (x=1240)
MID_CORRIDOR = 1160

# (source, target, start_arrow, end_arrow, dashed, waypoints, exitX, exitY, entryX, entryY)
EDGES = [
    # User domain — short local links
    ("tk", "kh", "ERzeroToMany", "ERone", False, None, 1, 0.5, 0, 0.5),
    ("tk", "tb", "ERone", "ERzeroToMany", False, None, 0.5, 1, 0.5, 0),
    ("tk", "chat", "ERone", "ERzeroToMany", False, None, 0, 0.75, 0, 0.25),
    ("kh", "hd", "ERone", "ERzeroToMany", False, None, 0.5, 1, 0.5, 0),
    # tk -> hd: route left margin, không đè bảng
    ("tk", "hd", "ERone", "ERzeroToOne", True, [(25, 0), (25, 0)], 0, 0.5, 0, 0.5),
    # Ops — horizontal / vertical trong cùng vùng
    ("td", "ddc", "ERone", "ERzeroToMany", False, None, 1, 0.5, 0, 0.5),
    ("lx", "lxa", "ERone", "ERzeroToMany", False, None, 1, 0.5, 0, 0.5),
    ("lx", "xk", "ERone", "ERzeroToMany", False, None, 0.5, 1, 0.5, 0),
    ("xk", "gn", "ERone", "ERzeroToMany", False, None, 1, 0.5, 0, 0.5),
    # td/xk -> cx: đi xuống cạnh trái cột ops
    ("td", "cx", "ERone", "ERzeroToMany", False, [(560, 0), (560, 0)], 0.5, 1, 0, 0.35),
    ("xk", "cx", "ERone", "ERzeroToMany", False, [(560, 0), (560, 0)], 0.5, 1, 0, 0.65),
    # gn -> vx: hành lang ngang giữa gn và vx (1100–1240)
    ("gn", "vx", "ERone", "ERzeroToMany", False, None, 1, 0.5, 0, 0.65),
    # km -> vx: ngang phía trên ve_xe (km nằm cao hơn)
    ("km", "vx", "ERzeroToOne", "ERzeroToMany", False, None, 0, 0.5, 1, 0.15),
]


def build_long_edges() -> list:
    """Edges that must use top/bottom bus to avoid crossing tables."""
    edges = []

    # kh -> vx: lên TOP_BUS, ngang, xuống vx
    kh_r, vx_l = right("kh"), left("vx")
    vx_y = cy_mid("vx")
    edges.append(
        ("kh", "vx", "ERone", "ERzeroToMany", False,
         [(kh_r + 10, TOP_BUS), (vx_l - 10, TOP_BUS), (vx_l - 10, vx_y)],
         1, 0.25, 0, 0.35)
    )

    # kh -> dg: TOP_BUS rồi xuống dg
    dg_l = left("dg")
    dg_y = cy_mid("dg")
    edges.append(
        ("kh", "dg", "ERone", "ERzeroToMany", False,
         [(kh_r + 10, TOP_BUS - 8), (dg_l - 10, TOP_BUS - 8), (dg_l - 10, dg_y)],
         1, 0.15, 0, 0.5)
    )

    # cx -> vx: xuống BOT_BUS, ngang qua hành lang, lên vx
    cx_r = right("cx")
    edges.append(
        ("cx", "vx", "ERone", "ERzeroToMany", False,
         [(cx_r + 10, BOT_BUS), (vx_l - 10, BOT_BUS), (vx_l - 10, bottom("vx") + 5)],
         1, 0.75, 0, 0.85)
    )

    # cx -> dg: BOT_BUS sang phải tới dg
    dg_x = cx_mid("dg")
    edges.append(
        ("cx", "dg", "ERone", "ERzeroToMany", False,
         [(cx_r + 10, BOT_BUS + 12), (dg_x, BOT_BUS + 12), (dg_x, bottom("dg") + 5)],
         1, 0.9, 0.5, 1)
    )

    # ddc -> vx (logic): TOP_BUS qua corridor
    ddc_r = right("ddc")
    edges.append(
        ("ddc", "vx", "ERzeroToOne", "ERzeroToMany", True,
         [(ddc_r + 10, TOP_BUS + 8), (vx_l - 10, TOP_BUS + 8), (vx_l - 10, top("vx") - 5)],
         1, 0.15, 0, 0.1)
    )

    # htt -> vx: lên mép trên, đi ngang, xuống — tránh cắt ve_xe
    htt_l = left("htt")
    edges.append(
        ("htt", "vx", "ERzeroToOne", "ERzeroToMany", False,
         [(htt_l - 10, TOP_BUS + 16), (right("vx") + 5, TOP_BUS + 16), (right("vx") + 5, cy_mid("vx"))],
         0, 0.25, 1, 0.5)
    )

    return edges


def resolve_waypoints(spec: list[tuple] | None, src: str, tgt: str) -> list[tuple[int, int]]:
    if not spec:
        return []
    resolved = []
    for px, py in spec:
        if px == 0:
            px = left(src) if py != 0 else left(tgt)
        if py == 0:
            py = top(src)
        # Magic markers
        if px == 560:
            px = 560
        if py == TOP_BUS or py == TOP_BUS - 8 or py == TOP_BUS + 8:
            pass
        elif py == BOT_BUS or py == BOT_BUS + 12:
            pass
        resolved.append((int(px), int(py)))
    return resolved


def emit_table(tid: str, name: str, x: int, y: int, w: int, cols: list[str]) -> list[str]:
    h = table_height(cols)
    lines = [
        f'        <mxCell id="{tid}" value="{name}" style="{TABLE_STYLE}" vertex="1" parent="1">',
        f'          <mxGeometry x="{x}" y="{y}" width="{w}" height="{h}" as="geometry"/>',
        "        </mxCell>",
    ]
    for i, col in enumerate(cols):
        cid = f"{tid}_{chr(97 + i)}"
        cy = HEADER + i * ROW_H
        lines.append(
            f'        <mxCell id="{cid}" value="{col}" style="{COL_STYLE}" vertex="1" parent="{tid}">'
            f'<mxGeometry y="{cy}" width="{w}" height="{ROW_H}" as="geometry"/></mxCell>'
        )
    return lines


def emit_edge(
    rid: str,
    src: str,
    tgt: str,
    sa: str,
    ea: str,
    dashed: bool,
    points: list[tuple[int, int]] | None,
    exit_x: float,
    exit_y: float,
    entry_x: float,
    entry_y: float,
) -> str:
    style = EDGE_DASH if dashed else EDGE_STYLE
    style += (
        f"startArrow={sa};startFill=0;endArrow={ea};endFill=0;"
        f"exitX={exit_x};exitY={exit_y};entryX={entry_x};entryY={entry_y};"
    )
    pts_xml = ""
    if points:
        pts = "\n".join(f'              <mxPoint x="{x}" y="{y}"/>' for x, y in points)
        pts_xml = f"\n            <Array as=\"points\">\n{pts}\n            </Array>"
    return (
        f'        <mxCell id="{rid}" value="" style="{style}" edge="1" parent="1" '
        f'source="{src}" target="{tgt}">\n'
        f'          <mxGeometry relative="1" as="geometry">{pts_xml}\n'
        f"          </mxGeometry>\n"
        f"        </mxCell>"
    )


def main() -> None:
    all_edges = list(EDGES) + build_long_edges()

    # Fix tk->hd left margin waypoints
    for i, e in enumerate(all_edges):
        if e[0] == "tk" and e[1] == "hd":
            all_edges[i] = (
                "tk", "hd", e[2], e[3], e[4],
                [(25, cy_mid("tk")), (25, cy_mid("hd"))],
                0, 0.5, 0, 0.5,
            )
        if e[0] == "td" and e[1] == "cx":
            all_edges[i] = (
                "td", "cx", e[2], e[3], e[4],
                [(560, bottom("td") + 20), (560, top("cx") - 10)],
                0.5, 1, 0, 0.35,
            )
        if e[0] == "xk" and e[1] == "cx":
            all_edges[i] = (
                "xk", "cx", e[2], e[3], e[4],
                [(560, bottom("xk") + 20), (560, top("cx") - 10)],
                0.5, 1, 0, 0.65,
            )

    out: list[str] = [
        '<?xml version="1.0" encoding="UTF-8"?>',
        '<mxfile host="app.diagrams.net" agent="RedBus" pages="1">',
        '  <diagram id="erd-hoan-chinh" name="ERD CSDL hoàn chỉnh">',
        '    <mxGraphModel dx="1800" dy="1200" grid="1" gridSize="10" guides="1" '
        'tooltips="1" connect="1" arrows="1" fold="1" page="1" pageWidth="2000" '
        'pageHeight="900" pageScale="1">',
        "      <root>",
        '        <mxCell id="0"/>',
        '        <mxCell id="1" parent="0"/>',
        "",
    ]
    for tid, (name, x, y, w, cols) in TABLES.items():
        out.extend(emit_table(tid, name, x, y, w, cols))
        out.append("")

    for i, (src, tgt, sa, ea, dashed, pts, ex, ey, enx, eny) in enumerate(all_edges, 1):
        out.append(emit_edge(f"r{i}", src, tgt, sa, ea, dashed, pts, ex, ey, enx, eny))

    out += [
        "      </root>",
        "    </mxGraphModel>",
        "  </diagram>",
        "</mxfile>",
        "",
    ]
    path = "documents/so-do-erd-hoan-chinh.drawio"
    with open(path, "w", encoding="utf-8", newline="\n") as f:
        f.write("\n".join(out))
    print(f"Wrote {path} ({len(all_edges)} edges)")


if __name__ == "__main__":
    main()
