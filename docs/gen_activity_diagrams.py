# -*- coding: utf-8 -*-
"""
Sinh Activity Diagram UML (den trang) cho draw.io.
Mau: start -> action -> fork -> nhanh song song -> join -> end
      decision thoi voi nhan [dieu kien] tren canh.
"""
import xml.etree.ElementTree as ET

CX = 400  # tam ngang

STYLES = {
    "start": "ellipse;fillColor=#000000;strokeColor=#000000;html=1;",
    "end": "ellipse;shape=endState;fillColor=#000000;strokeColor=#000000;html=1;",
    "action": "rounded=1;whiteSpace=wrap;html=1;fillColor=#FFFFFF;strokeColor=#000000;fontColor=#000000;",
    "decision": "rhombus;whiteSpace=wrap;html=1;fillColor=#FFFFFF;strokeColor=#000000;fontColor=#000000;",
    "fork": "line;html=1;strokeWidth=6;strokeColor=#000000;fillColor=#000000;",
    "merge": "rhombus;whiteSpace=wrap;html=1;fillColor=#FFFFFF;strokeColor=#000000;fontColor=#000000;",
}
SIZES = {
    "start": (24, 24),
    "end": (24, 24),
    "action": (200, 46),
    "decision": (36, 36),
    "fork": (180, 8),
    "merge": (36, 36),
}


def cx(w):
    return CX - w // 2


def geom(**kw):
    el = ET.Element("mxGeometry", {"as": "geometry"})
    for k, v in kw.items():
        el.set(k, str(v))
    return el


def node(kind, label, y, x=None, w=None, h=None):
    w = w or SIZES[kind][0]
    h = h or SIZES[kind][1]
    x = x if x is not None else cx(w)
    return {"kind": kind, "label": label, "x": x, "y": y, "w": w, "h": h}


# (id, tab, title, nodes list, edges list)
# edge: (from, to, label?)
DIAGRAMS = [
    ("ad01", "01. Quan ly danh muc",
     "ACTIVITY DIAGRAM: QUẢN LÝ DANH MỤC VẬN HÀNH",
     [
         node("start", "", 30),
         node("action", "Đăng nhập khu vực quản trị", 80),
         node("action", "Chọn loại danh mục cần quản lý", 150),
         node("fork", "", 220),
         node("action", "Quản lý tuyến đường", 270, x=180),
         node("action", "Quản lý xe & loại xe", 270, x=CX + 20),
         node("action", "Quản lý ghế & điểm dừng", 270, x=620),
         node("fork", "", 340),  # join bar
         node("action", "Lưu dữ liệu vào CSDL", 390),
         node("end", "", 460),
     ],
     [(0, 1), (1, 2), (2, 3), (3, 4), (3, 5), (3, 6),
      (4, 7), (5, 7), (6, 7), (7, 8), (8, 9)]),

    ("ad02", "02. Sinh lich chuyen",
     "ACTIVITY DIAGRAM: SINH LỊCH CHUYẾN XE",
     [
         node("start", "", 30),
         node("action", "Chọn tuyến và xe khách", 80),
         node("action", "Nhập khoảng ngày & giờ khởi hành", 150),
         node("decision", "", 220, w=36, h=36),
         node("action", "Sinh lịch chuyến tự động", 300),
         node("action", "Thông báo lỗi (quá 31 ngày)", 300, x=620),
         node("merge", "", 380, w=36, h=36),
         node("action", "Hiển thị danh sách chuyến", 440),
         node("end", "", 510),
     ],
     [(0, 1), (1, 2), (2, 3),
      (3, 4, "[≤ 31 ngày]"), (3, 5, "[> 31 ngày]"),
      (4, 6), (5, 2), (6, 7), (7, 8)]),

    ("ad03", "03. Tim kiem chuyen",
     "ACTIVITY DIAGRAM: TÌM KIẾM CHUYẾN & GHẾ TRỐNG",
     [
         node("start", "", 30),
         node("action", "Chọn tuyến và ngày khởi hành", 80),
         node("action", "Áp dụng bộ lọc (giá, loại xe, giờ)", 150),
         node("action", "Gửi yêu cầu tìm kiếm", 220),
         node("decision", "", 290, w=36, h=36),
         node("action", "Hiển thị danh sách chuyến", 370),
         node("action", "Hiển thị sơ đồ ghế trống", 440),
         node("action", "Thông báo không có chuyến", 370, x=620),
         node("end", "", 520),
     ],
     [(0, 1), (1, 2), (2, 3), (3, 4),
      (4, 5, "[có chuyến]"), (4, 7, "[không]"),
      (5, 6), (6, 8), (7, 8)]),

    ("ad04", "04. Dat ve",
     "ACTIVITY DIAGRAM: ĐẶT VÉ (GIỮ GHẾ)",
     [
         node("start", "", 30),
         node("action", "Chọn ghế trên sơ đồ xe", 80),
         node("action", "Xác nhận đặt vé", 150),
         node("decision", "", 220, w=36, h=36),
         node("action", "Tạo vé PENDING, giữ ghế 15 phút", 300),
         node("action", "Thông báo ghế đã bán", 300, x=620),
         node("fork", "", 370),
         node("action", "Gửi email xác nhận", 420, x=250),
         node("action", "Đẩy thông báo SSE", 420, x=530),
         node("fork", "", 490),  # join
         node("end", "", 540),
     ],
     [(0, 1), (1, 2), (2, 3),
      (3, 4, "[ghế trống]"), (3, 5, "[đã bán]"),
      (5, 1), (4, 6), (6, 7), (6, 8), (7, 9), (8, 9), (9, 10)]),

    ("ad05", "05. Thong bao",
     "ACTIVITY DIAGRAM: THÔNG BÁO & EMAIL",
     [
         node("start", "", 30),
         node("action", "Phát sinh sự kiện hệ thống", 80),
         node("action", "Ghi thông báo vào CSDL", 150),
         node("fork", "", 220),
         node("action", "Đẩy SSE tới trình duyệt", 270, x=250),
         node("decision", "", 270, x=560, w=36, h=36),
         node("action", "Gửi email cho khách", 340, x=530),
         node("fork", "", 410),  # join
         node("end", "", 460),
     ],
     [(0, 1), (1, 2), (2, 3),
      (3, 4), (3, 5),
      (5, 6, "[có mail]"), (5, 7, "[không]"),
      (4, 7), (6, 7), (7, 8)]),

    ("ad06", "06. Huy ve qua han",
     "ACTIVITY DIAGRAM: TỰ ĐỘNG HỦY VÉ QUÁ HẠN",
     [
         node("start", "", 30),
         node("action", "Scheduled task kích hoạt", 80),
         node("action", "Lấy danh sách vé PENDING", 150),
         node("decision", "", 220, w=36, h=36),
         node("action", "Cập nhật vé EXPIRED", 300),
         node("action", "Giải phóng ghế", 370),
         node("action", "Kết thúc lượt quét", 300, x=620),
         node("merge", "", 440, w=36, h=36),
         node("end", "", 500),
     ],
     [(0, 1), (1, 2), (2, 3),
      (3, 4, "[quá hạn]"), (3, 6, "[còn hạn]"),
      (4, 5), (5, 7), (6, 7), (7, 8)]),

    ("ad07", "07. Thanh toan",
     "ACTIVITY DIAGRAM: GHI NHẬN THANH TOÁN",
     [
         node("start", "", 30),
         node("action", "Chọn vé PENDING cần thanh toán", 80),
         node("decision", "", 150, w=36, h=36),
         node("action", "Thu tiền mặt tại quầy", 230, x=200),
         node("action", "Tạo link PayOS", 230, x=520),
         node("action", "Khách thanh toán online", 300, x=520),
         node("merge", "", 380, w=36, h=36),
         node("decision", "", 450, w=36, h=36),
         node("action", "Cập nhật vé PAID", 530),
         node("action", "Thông báo thanh toán thất bại", 530, x=620),
         node("merge", "", 610, w=36, h=36),
         node("end", "", 680),
     ],
     [(0, 1), (1, 2),
      (2, 3, "[tiền mặt]"), (2, 4, "[PayOS]"),
      (3, 6), (4, 5), (5, 6),
      (6, 7),
      (7, 8, "[thành công]"), (7, 9, "[thất bại]"),
      (8, 10), (9, 1), (10, 11)]),

    ("ad08", "08. Tra cuu ve",
     "ACTIVITY DIAGRAM: TRA CỨU VÉ & VÉ ĐIỆN TỬ",
     [
         node("start", "", 30),
         node("action", "Nhập mã vé và số điện thoại", 80),
         node("action", "Tra cứu trong CSDL", 150),
         node("decision", "", 220, w=36, h=36),
         node("action", "Tạo vé điện tử & mã QR", 300),
         node("action", "Hiển thị thông tin vé", 370),
         node("action", "Báo lỗi không tìm thấy", 300, x=620),
         node("end", "", 450),
     ],
     [(0, 1), (1, 2), (2, 3),
      (3, 4, "[SĐT khớp]"), (3, 6, "[không khớp]"),
      (4, 5), (5, 7), (6, 1)]),

    ("ad09", "09. Doi ve",
     "ACTIVITY DIAGRAM: ĐỔI GHẾ / ĐỔI CHUYẾN / HỦY VÉ",
     [
         node("start", "", 30),
         node("action", "Chọn vé trong Vé của tôi", 80),
         node("decision", "", 150, w=36, h=36),
         node("action", "Đổi ghế", 230, x=150),
         node("action", "Đổi chuyến cùng tuyến", 230, x=400),
         node("action", "Hủy vé PENDING", 230, x=650),
         node("merge", "", 310, w=36, h=36),
         node("action", "Cập nhật CSDL & thông báo SSE", 380),
         node("end", "", 450),
     ],
     [(0, 1), (1, 2),
      (2, 3, "[đổi ghế]"), (2, 4, "[đổi chuyến]"), (2, 5, "[hủy]"),
      (3, 6), (4, 6), (5, 6), (6, 7), (7, 8)]),

    ("ad10", "10. Danh gia ho tro",
     "ACTIVITY DIAGRAM: ĐÁNH GIÁ & HỖ TRỢ KHÁCH",
     [
         node("start", "", 30),
         node("decision", "", 80, w=36, h=36),
         node("action", "Gửi đánh giá chuyến đi", 160, x=150),
         node("action", "Trao đổi qua chat nội bộ", 160, x=400),
         node("action", "Xem FAQ / tin tức", 160, x=650),
         node("merge", "", 240, w=36, h=36),
         node("action", "Lưu phản hồi vào hệ thống", 310),
         node("end", "", 380),
     ],
     [(0, 1),
      (1, 2, "[đánh giá]"), (1, 3, "[chat]"), (1, 4, "[FAQ]"),
      (2, 5), (3, 5), (4, 5), (5, 6), (6, 7)]),

    ("ad11", "11. Bao cao",
     "ACTIVITY DIAGRAM: TỔNG HỢP BÁO CÁO",
     [
         node("start", "", 30),
         node("action", "Truy cập Dashboard / Báo cáo", 80),
         node("fork", "", 150),
         node("action", "Thống kê doanh thu", 200, x=200),
         node("action", "Thống kê trạng thái vé", 200, x=400),
         node("action", "Top tuyến & đánh giá", 200, x=600),
         node("fork", "", 270),  # join
         node("decision", "", 320, w=36, h=36),
         node("action", "Xuất file CSV", 400),
         node("action", "Hiển thị biểu đồ trên màn hình", 400, x=620),
         node("merge", "", 480, w=36, h=36),
         node("end", "", 540),
     ],
     [(0, 1), (1, 2),
      (2, 3), (2, 4), (2, 5),
      (3, 6), (4, 6), (5, 6),
      (6, 7),
      (7, 8, "[xuất CSV]"), (7, 9, "[chỉ xem]"),
      (8, 10), (9, 10), (10, 11)]),
]


def build_page(did, dname, title, nodes, edges):
    diagram = ET.Element("diagram", {"id": did, "name": dname})
    model = ET.SubElement(diagram, "mxGraphModel", {
        "dx": "1200", "dy": "800", "grid": "1", "gridSize": "10",
        "guides": "1", "tooltips": "1", "connect": "1", "arrows": "1",
        "fold": "1", "page": "1", "pageScale": "1",
        "pageWidth": "827", "pageHeight": "1169",  # portrait like thesis
    })
    r = ET.SubElement(model, "root")
    ET.SubElement(r, "mxCell", {"id": "0"})
    ET.SubElement(r, "mxCell", {"id": "1", "parent": "0"})

    t = ET.SubElement(r, "mxCell", {
        "id": f"{did}_title", "value": title,
        "parent": "1", "vertex": "1",
        "style": "text;html=1;strokeColor=none;fillColor=none;align=center;fontStyle=1;fontSize=12;fontColor=#000000;",
    })
    t.append(geom(x=80, y=8, width=660, height=28))

    nids = []
    for i, nd in enumerate(nodes):
        nid = f"{did}_n{i}"
        nids.append(nid)
        kind = nd["kind"]
        cell = ET.SubElement(r, "mxCell", {
            "id": nid,
            "value": nd["label"],
            "parent": "1", "vertex": "1",
            "style": STYLES[kind],
        })
        cell.append(geom(x=nd["x"], y=nd["y"], width=nd["w"], height=nd["h"]))

    for ei, e in enumerate(edges):
        lbl = e[2] if len(e) > 2 else ""
        edge = ET.SubElement(r, "mxCell", {
            "id": f"{did}_e{ei}",
            "parent": "1", "edge": "1",
            "source": nids[e[0]], "target": nids[e[1]],
            "value": lbl,
            "style": "edgeStyle=orthogonalEdgeStyle;rounded=0;endArrow=block;html=1;fontSize=9;fontColor=#000000;strokeColor=#000000;",
        })
        edge.append(geom(relative="1"))

    cap = ET.SubElement(r, "mxCell", {
        "id": f"{did}_cap",
        "value": f"Hình – Activity Diagram: {dname}",
        "parent": "1", "vertex": "1",
        "style": "text;html=1;strokeColor=none;fillColor=none;align=center;fontStyle=2;fontSize=9;fontColor=#000000;",
    })
    cap.append(geom(x=180, y=nodes[-1]["y"] + 70, width=460, height=22))

    return diagram


root = ET.Element("mxfile", {
    "host": "app.diagrams.net", "agent": "RedBus", "version": "22.1.0", "type": "device",
})
for did, dname, title, nodes, edges in DIAGRAMS:
    root.append(build_page(did, dname, title, nodes, edges))

out = r"d:\Freelancer\RedBus\docs\so-do-nghiep-vu-redbus.drawio"
tree = ET.ElementTree(root)
ET.indent(tree, space="  ")
with open(out, "wb") as f:
    f.write(b'<?xml version="1.0" encoding="UTF-8"?>\n')
    tree.write(f, encoding="utf-8", xml_declaration=False)
print(f"OK: {len(DIAGRAMS)} Activity Diagram (den trang) -> {out}")
