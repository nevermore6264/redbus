# -*- coding: utf-8 -*-
"""
Sinh Use Case Diagram UML (den trang) cho draw.io – he thong RedBus.

Tranh chồng chéo:
  - Tab 00: tong quan (6 UC nhom, ke thua Actor, it duong)
  - Tab 01–03: chi tiet theo nhom (Actor canh cum UC tuong ung)

Chay: python docs/gen_use_case_diagram.py
"""
import xml.etree.ElementTree as ET
from pathlib import Path

OUT = Path(__file__).resolve().parent / "so-do-use-case-redbus.drawio"

STYLES = {
    "title": "text;html=1;strokeColor=none;fillColor=none;align=center;fontStyle=1;fontSize=13;fontColor=#000000;",
    "caption": "text;html=1;strokeColor=none;fillColor=none;align=center;fontStyle=2;fontSize=9;fontColor=#000000;",
    "note": "text;html=1;strokeColor=none;fillColor=none;align=left;fontSize=9;fontColor=#000000;",
    "actor": "shape=umlActor;verticalLabelPosition=bottom;verticalAlign=top;html=1;outlineConnect=0;"
             "fillColor=#FFFFFF;strokeColor=#000000;fontColor=#000000;",
    "system": "rounded=0;whiteSpace=wrap;html=1;fillColor=none;strokeColor=#000000;"
              "strokeWidth=1;dashed=1;align=left;verticalAlign=top;spacingLeft=8;fontStyle=1;fontSize=11;",
    "uc": "ellipse;whiteSpace=wrap;html=1;fillColor=#FFFFFF;strokeColor=#000000;fontColor=#000000;fontSize=10;",
    "edge": "endArrow=none;html=1;strokeColor=#000000;edgeStyle=orthogonalEdgeStyle;rounded=1;",
    "gen": "endArrow=block;endFill=0;html=1;strokeColor=#000000;edgeStyle=orthogonalEdgeStyle;rounded=0;",
}

# exit/entry hints for cleaner routing
EDGE_L = STYLES["edge"] + "exitX=1;exitY=0.5;entryX=0;entryY=0.5;"
EDGE_R = STYLES["edge"] + "exitX=0;exitY=0.5;entryX=1;entryY=0.5;"
EDGE_B = STYLES["edge"] + "exitX=0.5;exitY=0;entryX=0.5;entryY=1;"


def geom(**kw):
    el = ET.Element("mxGeometry", {"as": "geometry"})
    for k, v in kw.items():
        el.set(k, str(v))
    return el


def cell(cid, parent, value="", style="", vertex=False, edge=False, source=None, target=None):
    att = {"id": cid, "parent": parent}
    if value:
        att["value"] = value
    if style:
        att["style"] = style
    if vertex:
        att["vertex"] = "1"
    if edge:
        att["edge"] = "1"
    if source:
        att["source"] = source
    if target:
        att["target"] = target
    return ET.Element("mxCell", att)


class Diagram:
    def __init__(self, did, name, pw=1100, ph=900):
        self.did = did
        self.name = name
        self.pw = pw
        self.ph = ph
        self.cells = []
        self._n = 0

    def uid(self, prefix="n"):
        self._n += 1
        return f"{self.did}_{prefix}{self._n}"

    def add(self, *args, **kwargs):
        c = cell(*args, **kwargs)
        self.cells.append(c)
        return c.get("id")

    def text(self, value, x, y, w, h, style="title"):
        cid = self.uid("t")
        c = cell(cid, "1", value, STYLES[style], vertex=True)
        c.append(geom(x=x, y=y, width=w, height=h))
        self.cells.append(c)
        return cid

    def actor(self, label, x, y):
        cid = self.uid("a")
        c = cell(cid, "1", label, STYLES["actor"], vertex=True)
        c.append(geom(x=x, y=y, width=40, height=80))
        self.cells.append(c)
        return cid

    def system(self, label, x, y, w, h):
        cid = self.uid("s")
        c = cell(cid, "1", label, STYLES["system"], vertex=True)
        c.append(geom(x=x, y=y, width=w, height=h))
        self.cells.append(c)
        return cid

    def uc(self, label, x, y, w=150, h=50):
        cid = self.uid("u")
        c = cell(cid, "1", label, STYLES["uc"], vertex=True)
        c.append(geom(x=x, y=y, width=w, height=h))
        self.cells.append(c)
        return cid

    def link(self, src, tgt, style=EDGE_L):
        cid = self.uid("e")
        c = cell(cid, "1", "", style, edge=True, source=src, target=tgt)
        c.append(geom(relative="1"))
        self.cells.append(c)
        return cid

    def generalize(self, child, parent):
        """child actor chuyen hoa tu parent actor."""
        cid = self.uid("g")
        c = cell(cid, "1", "", STYLES["gen"], edge=True, source=child, target=parent)
        c.append(geom(relative="1"))
        self.cells.append(c)
        return cid

    def grid_uc(self, items, x0, y0, cols=2, dx=220, dy=62, w=170, h=50):
        """items: list of (id_hint, label). Returns dict hint->cell_id."""
        out = {}
        for i, (hint, label) in enumerate(items):
            col = i % cols
            row = i // cols
            out[hint] = self.uc(label, x0 + col * dx, y0 + row * dy, w, h)
        return out

    def to_xml(self):
        diagram = ET.Element("diagram", {"id": self.did, "name": self.name})
        model = ET.SubElement(
            diagram, "mxGraphModel",
            {
                "dx": "1200", "dy": "800", "grid": "1", "gridSize": "10",
                "guides": "1", "tooltips": "1", "connect": "1", "arrows": "1",
                "fold": "1", "page": "1", "pageScale": "1",
                "pageWidth": str(self.pw), "pageHeight": str(self.ph),
            },
        )
        r = ET.SubElement(model, "root")
        ET.SubElement(r, "mxCell", {"id": "0"})
        ET.SubElement(r, "mxCell", {"id": "1", "parent": "0"})
        for c in self.cells:
            r.append(c)
        return diagram


def build_overview():
    """Tab 00 – 6 UC nhom, ke thua Actor, toi da ~12 duong."""
    d = Diagram("uc00", "00. Tong quan", 1000, 900)
    d.text("USE CASE DIAGRAM TỔNG QUAN – HỆ THỐNG REDBUS", 120, 8, 760, 28)
    d.system("Hệ thống RedBus", 240, 70, 520, 620)

    ucs = {
        "auth": d.uc("Xác thực tài khoản\n(UC01–02)", 420, 110, 160, 52),
        "admin": d.uc("Quản lý vận hành\n(UC03–13, UC22)", 420, 210, 180, 52),
        "report": d.uc("Báo cáo thống kê\n(UC14)", 420, 310, 160, 52),
        "book": d.uc("Đặt vé & thanh toán\n(UC15–17)", 420, 410, 170, 52),
        "ticket": d.uc("Quản lý vé & hồ sơ\n(UC18–21)", 420, 510, 170, 52),
        "info": d.uc("Thông báo & tin tức\n(UC23–25)", 420, 610, 170, 52),
    }

    nv = d.actor("Nhân viên", 80, 300)
    qt = d.actor("Quản trị viên", 80, 150)
    d.generalize(qt, nv)

    vl = d.actor("Khách vãng lai", 860, 400)
    kh = d.actor("Khách hàng", 860, 180)
    d.generalize(kh, vl)

    payos = d.actor("PayOS", 420, 780)
    hethong = d.actor("Hệ thống", 240, 780)

    # Nhan vien (quan tri ke thua -> khong can noi QT)
    for k in ("auth", "admin", "report", "info"):
        d.link(nv, ucs[k], EDGE_L)

    # Khach vang lai (khach hang ke thua)
    for k in ("auth", "book", "ticket", "info"):
        d.link(vl, ucs[k], EDGE_R)

    # Khach hang – chi them UC can dang nhap (book/ticket day du da ke thua tu VL;
    # trong tong quan khong can them duong)

    d.link(payos, ucs["book"], EDGE_B)
    d.link(hethong, ucs["info"], EDGE_B)

    d.text(
        "Ghi chú: Quản trị viên kế thừa Nhân viên; Khách hàng kế thừa Khách vãng lai "
        "(mũi tên tam giác rỗng). Chi tiết UC xem tab 01–03.",
        80, 720, 840, 36, "note",
    )
    d.text("Hình 2.12 – Use Case Diagram tổng quát", 300, 860, 400, 22, "caption")
    return d


def build_admin_detail():
    """Tab 01 – Quan tri: 2 cot UC, chi NV noi day du."""
    d = Diagram("uc01", "01. Quan tri", 900, 1050)
    d.text("USE CASE: QUẢN TRỊ VẬN HÀNH", 220, 8, 460, 28)
    d.system("Hệ thống RedBus", 200, 60, 500, 900)

    items = [
        ("uc03", "UC03\nDashboard"),
        ("uc04", "UC04\nQuản lý tuyến"),
        ("uc05", "UC05\nQuản lý loại xe"),
        ("uc06", "UC06\nQuản lý xe khách"),
        ("uc07", "UC07\nQuản lý ghế"),
        ("uc08", "UC08\nĐiểm dừng chân"),
        ("uc09", "UC09\nChuyến xe / Lịch"),
        ("uc10", "UC10\nKhách hàng"),
        ("uc11", "UC11\nKhuyến mãi"),
        ("uc12", "UC12\nTin tức"),
        ("uc13", "UC13\nFAQ"),
        ("uc14", "UC14\nBáo cáo CSV"),
        ("uc22", "UC22\nHỗ trợ / Chat"),
        ("uc01", "UC01\nĐăng nhập"),
    ]
    ucs = d.grid_uc(items, 260, 100, cols=2, dx=230, dy=58, w=155, h=48)

    nv = d.actor("Nhân viên", 60, 420)
    qt = d.actor("Quản trị viên", 60, 220)
    d.generalize(qt, nv)

    for uid in ucs.values():
        d.link(nv, uid, EDGE_L)

    d.text("Quản trị viên kế thừa toàn bộ UC của Nhân viên (+ quyền xóa danh mục).", 60, 980, 640, 22, "note")
    d.text("Hình 2.13 – Use Case quản trị vận hành", 260, 1010, 380, 22, "caption")
    return d


def build_customer_detail():
    """Tab 02 – Khach hang: 1 cot UC giua, actor ben phai."""
    d = Diagram("uc02", "02. Khach hang", 800, 800)
    d.text("USE CASE: DỊCH VỤ KHÁCH HÀNG", 180, 8, 440, 28)
    d.system("Hệ thống RedBus", 180, 60, 380, 620)

    items = [
        ("uc15", "UC15\nTìm kiếm chuyến"),
        ("uc16", "UC16\nĐặt vé"),
        ("uc17", "UC17\nThanh toán"),
        ("uc18", "UC18\nTra cứu / QR"),
        ("uc19", "UC19\nĐổi / Hủy vé"),
        ("uc20", "UC20\nHồ sơ / Lịch sử"),
        ("uc21", "UC21\nĐánh giá"),
        ("uc02", "UC02\nĐăng ký / Quên MK"),
        ("uc01", "UC01\nĐăng nhập"),
    ]
    ucs = d.grid_uc(items, 260, 90, cols=1, dx=0, dy=58, w=160, h=48)

    vl = d.actor("Khách vãng lai", 680, 360)
    kh = d.actor("Khách hàng", 680, 160)
    d.generalize(kh, vl)

    payos = d.actor("PayOS", 300, 720)

    # VL: cong khai
    for k in ("uc01", "uc02", "uc15", "uc18"):
        d.link(vl, ucs[k], EDGE_R)

    # KH: them UC can dang nhap
    for k in ("uc16", "uc17", "uc19", "uc20", "uc21"):
        d.link(kh, ucs[k], EDGE_R)

    d.link(payos, ucs["uc17"], EDGE_B)

    d.text("Khách vãng lai: UC01,02,15,18. Khách hàng thêm UC16–17,19–21.", 60, 700, 620, 22, "note")
    d.text("Hình 2.14 – Use Case dịch vụ khách hàng", 200, 750, 400, 22, "caption")
    return d


def build_support_detail():
    """Tab 03 – Ho tro & thong tin: it UC, 3 actor."""
    d = Diagram("uc03", "03. Ho tro & TT", 800, 650)
    d.text("USE CASE: HỖ TRỢ & THÔNG TIN", 200, 8, 400, 28)
    d.system("Hệ thống RedBus", 200, 70, 400, 380)

    ucs = {
        "uc23": d.uc("UC23\nThông báo SSE", 320, 120, 150, 48),
        "uc24": d.uc("UC24\nTin nhắn chat", 320, 220, 150, 48),
        "uc25": d.uc("UC25\nTin tức / FAQ CK", 320, 320, 160, 48),
    }

    nv = d.actor("Nhân viên", 60, 200)
    kh = d.actor("Khách hàng", 700, 200)
    vl = d.actor("Khách vãng lai", 700, 360)
    ht = d.actor("Hệ thống", 320, 500)

    for k in ucs:
        d.link(nv, ucs[k], EDGE_L)
        d.link(kh, ucs[k], EDGE_R)
    d.link(vl, ucs["uc25"], EDGE_R)
    d.link(ht, ucs["uc23"], EDGE_B)

    d.text("Hình 2.15 – Use Case hỗ trợ & thông tin", 220, 580, 360, 22, "caption")
    return d


def build():
    root = ET.Element("mxfile", {"host": "app.diagrams.net", "agent": "RedBus", "pages": "4"})
    for d in (build_overview(), build_admin_detail(), build_customer_detail(), build_support_detail()):
        root.append(d.to_xml())
    return root


def main():
    tree = build()
    ET.indent(tree, space="  ")
    xml = '<?xml version="1.0" encoding="UTF-8"?>\n' + ET.tostring(tree, encoding="unicode")
    OUT.write_text(xml, encoding="utf-8")
    print(f"Wrote {OUT} (4 tabs)")


if __name__ == "__main__":
    main()
