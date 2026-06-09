# -*- coding: utf-8 -*-
import xml.etree.ElementTree as ET

activities = [
    {
        "id": "qt01", "name": "01. Quản lý danh mục",
        "title": "QUY TRÌNH 1: QUẢN LÝ DANH MỤC VẬN HÀNH",
        "activity": "Quản lý danh mục vận hành (tuyến, xe, loại xe, điểm dừng, ghế)",
        "input": "Thông tin tuyến đường, xe khách, loại xe, điểm dừng chân; cấu hình ghế; trạng thái chuyến",
        "output": "Danh sách tuyến/chuyến/ghế; trạng thái chuyến (SCHEDULED / CANCELLED)",
        "user": "Quản trị viên, Nhân viên",
        "steps": ["Khai báo tuyến", "Thêm xe, loại xe", "Cấu hình ghế", "Cập nhật điểm dừng", "Lưu CSDL"],
    },
    {
        "id": "qt02", "name": "02. Sinh lịch chuyến",
        "title": "QUY TRÌNH 2: SINH LỊCH CHUYẾN XE",
        "activity": "Sinh lịch chuyến xe theo khoảng ngày",
        "input": "Tuyến hoạt động; xe khách; ngày bắt đầu–kết thúc; giờ khởi hành; giá vé",
        "output": "Danh sách chuyến xe theo ngày; ghế sẵn sàng bán",
        "user": "Quản trị viên, Nhân viên",
        "steps": ["Chọn tuyến, xe", "Nhập khoảng ngày", "Đặt giờ khởi hành", "Sinh lịch tự động", "Kiểm tra lịch"],
    },
    {
        "id": "qt03", "name": "03. Tìm kiếm chuyến",
        "title": "QUY TRÌNH 3: TÌM KIẾM CHUYẾN VÀ GHẾ TRỐNG",
        "activity": "Tìm kiếm chuyến và kiểm tra ghế trống",
        "input": "Tuyến; ngày khởi hành; bộ lọc giá, loại xe, khung giờ",
        "output": "Danh sách chuyến phù hợp; số ghế còn trống; sơ đồ ghế",
        "user": "Khách hàng, Nhân viên",
        "steps": ["Chọn tuyến, ngày", "Áp dụng bộ lọc", "Hiển thị danh sách", "Xem ghế trống", "Chọn chuyến"],
    },
    {
        "id": "qt04", "name": "04. Đặt vé",
        "title": "QUY TRÌNH 4: ĐẶT VÉ (GIỮ GHẾ)",
        "activity": "Đặt vé và giữ ghế có thời hạn",
        "input": "Mã chuyến; danh sách ghế; thông tin khách hoặc tài khoản",
        "output": "Vé PENDING; mã vé hiển thị; ghế giữ 15 phút",
        "user": "Khách hàng, Nhân viên",
        "steps": ["Chọn ghế", "Xác nhận đặt", "Kiểm tra ghế", "Tạo vé PENDING", "Giữ ghế"],
    },
    {
        "id": "qt05", "name": "05. Thông báo",
        "title": "QUY TRÌNH 5: THÔNG BÁO VÀ EMAIL",
        "activity": "Thông báo và gửi thông tin vé cho khách",
        "input": "Sự kiện đặt vé, thanh toán; liên hệ khách; nội dung thông báo",
        "output": "Thông báo SSE trong app; email xác nhận vé",
        "user": "Hệ thống, Khách hàng",
        "steps": ["Phát sinh sự kiện", "Ghi thông báo", "Đẩy SSE", "Gửi email", "Khách nhận TB"],
    },
    {
        "id": "qt06", "name": "06. Hủy vé quá hạn",
        "title": "QUY TRÌNH 6: TỰ ĐỘNG HỦY VÉ QUÁ HẠN",
        "activity": "Tự động hủy vé quá hạn thanh toán",
        "input": "Vé PENDING; thời gian đặt; cấu hình phút chờ 15 phút",
        "output": "Vé EXPIRED; ghế được giải phóng",
        "user": "Hệ thống (Scheduled task)",
        "steps": ["Task mỗi phút", "Tìm vé quá hạn", "Cập nhật EXPIRED", "Giải phóng ghế", "Ghi log"],
    },
    {
        "id": "qt07", "name": "07. Thanh toán",
        "title": "QUY TRÌNH 7: GHI NHẬN THANH TOÁN",
        "activity": "Ghi nhận thanh toán tiền mặt hoặc PayOS",
        "input": "Vé PENDING; số tiền; mã khuyến mãi; phương thức thanh toán",
        "output": "Giao dịch SUCCESS; vé PAID; lịch sử thanh toán",
        "user": "Nhân viên, Khách hàng",
        "steps": ["Chọn PT thanh toán", "Áp dụng KM", "Tiền mặt/PayOS", "Webhook xác nhận", "Vé PAID"],
    },
    {
        "id": "qt08", "name": "08. Tra cứu vé",
        "title": "QUY TRÌNH 8: TRA CỨU VÉ VÀ VÉ ĐIỆN TỬ",
        "activity": "Tra cứu vé và xuất vé điện tử QR",
        "input": "Mã vé + SĐT công khai hoặc tài khoản đăng nhập",
        "output": "Thông tin vé; lộ trình; ghế; mã QR",
        "user": "Khách hàng, Nhân viên",
        "steps": ["Nhập mã vé", "Xác thực SĐT", "Lấy thông tin", "Tạo mã QR", "Hiển thị vé ĐT"],
    },
    {
        "id": "qt09", "name": "09. Đổi vé",
        "title": "QUY TRÌNH 9: ĐỔI GHẾ, ĐỔI CHUYẾN, HỦY VÉ",
        "activity": "Đổi ghế, đổi chuyến hoặc hủy vé",
        "input": "Vé PAID hoặc PENDING; ghế/chuyến mới; quy tắc cùng tuyến",
        "output": "Vé cập nhật; ghế cũ giải phóng; thông báo đổi vé",
        "user": "Khách hàng",
        "steps": ["Chọn vé", "Kiểm tra ĐK", "Chọn ghế/chuyến", "Cập nhật vé", "Thông báo SSE"],
    },
    {
        "id": "qt10", "name": "10. Đánh giá hỗ trợ",
        "title": "QUY TRÌNH 10: ĐÁNH GIÁ VÀ HỖ TRỢ KHÁCH",
        "activity": "Đánh giá chuyến đi và hỗ trợ khách",
        "input": "Vé đã sử dụng; điểm đánh giá; tin nhắn; câu hỏi hỗ trợ",
        "output": "Bản ghi đánh giá; hội thoại chat; phản hồi FAQ",
        "user": "Khách hàng, Nhân viên",
        "steps": ["Vé hoàn thành", "Gửi đánh giá", "Chat nội bộ", "Xem FAQ", "NV phản hồi"],
    },
    {
        "id": "qt11", "name": "11. Báo cáo",
        "title": "QUY TRÌNH 11: TỔNG HỢP BÁO CÁO",
        "activity": "Tổng hợp báo cáo doanh thu, vé, tuyến",
        "input": "Dữ liệu vé, giao dịch, chuyến xe, đánh giá",
        "output": "Dashboard; biểu đồ; báo cáo mở rộng; file CSV",
        "user": "Quản trị viên, Nhân viên",
        "steps": ["Truy vấn DL", "Tính doanh thu", "Vé theo TT", "Top tuyến", "Xuất CSV"],
    },
]


def geom(**kw):
    el = ET.Element("mxGeometry", {"as": "geometry"})
    for k, v in kw.items():
        el.set(k, str(v))
    return el


root = ET.Element("mxfile", {
    "host": "app.diagrams.net",
    "agent": "RedBus",
    "version": "22.1.0",
    "type": "device",
})

for i, act in enumerate(activities):
    diagram = ET.SubElement(root, "diagram", {"id": act["id"], "name": act["name"]})
    model = ET.SubElement(diagram, "mxGraphModel", {
        "dx": "1200", "dy": "800", "grid": "1", "gridSize": "10",
        "guides": "1", "tooltips": "1", "connect": "1", "arrows": "1",
        "fold": "1", "page": "1", "pageScale": "1",
        "pageWidth": "1169", "pageHeight": "827",
    })
    r = ET.SubElement(model, "root")
    ET.SubElement(r, "mxCell", {"id": "0"})
    ET.SubElement(r, "mxCell", {"id": "1", "parent": "0"})

    t = ET.SubElement(r, "mxCell", {
        "id": f"{act['id']}_title",
        "value": act["title"],
        "parent": "1", "vertex": "1",
        "style": "text;html=1;strokeColor=none;fillColor=none;align=center;fontStyle=1;fontSize=13;",
    })
    t.append(geom(x=200, y=15, width=760, height=30))

    x = 40
    prev = None
    for j, step in enumerate(act["steps"]):
        cid = f"{act['id']}_s{j}"
        style = "rounded=1;whiteSpace=wrap;html=1;fillColor=#dae8fc;strokeColor=#6c8ebf;"
        if j == 0:
            style = "rounded=1;whiteSpace=wrap;html=1;fillColor=#d5e8d4;strokeColor=#82b366;"
        if j == len(act["steps"]) - 1:
            style = "rounded=1;whiteSpace=wrap;html=1;fillColor=#fff2cc;strokeColor=#d6b656;"
        cell = ET.SubElement(r, "mxCell", {
            "id": cid, "value": step, "parent": "1", "vertex": "1", "style": style,
        })
        cell.append(geom(x=x, y=70, width=130, height=50))
        if prev:
            edge = ET.SubElement(r, "mxCell", {
                "id": f"{act['id']}_e{j}",
                "parent": "1", "edge": "1",
                "source": prev, "target": cid,
                "style": "edgeStyle=orthogonalEdgeStyle;rounded=0;endArrow=classic;html=1;",
            })
            edge.append(geom(relative="1"))
        prev = cid
        x += 155

    lbl = ET.SubElement(r, "mxCell", {
        "id": f"{act['id']}_lbl",
        "value": f"Bảng 2.{i + 1} – Mô tả Input / Output / End User",
        "parent": "1", "vertex": "1",
        "style": "text;html=1;strokeColor=none;fillColor=none;align=left;fontStyle=1;fontSize=11;",
    })
    lbl.append(geom(x=40, y=155, width=500, height=25))

    tbl = ET.SubElement(r, "mxCell", {
        "id": f"{act['id']}_tbl",
        "value": "",
        "parent": "1", "vertex": "1",
        "style": "shape=table;startSize=0;container=1;collapsible=0;childLayout=tableLayout;fixedRows=1;rowLines=1;columnLines=1;strokeColor=#666666;fontSize=10;",
    })
    tbl.append(geom(x=40, y=185, width=1080, height=130))

    headers = ["Hoạt động", "Input Data", "Output Data", "End User"]
    widths = [200, 300, 300, 280]
    hrow = ET.SubElement(r, "mxCell", {
        "id": f"{act['id']}_hr",
        "parent": f"{act['id']}_tbl", "vertex": "1",
        "style": "shape=tableRow;fillColor=#6c8ebf;fontColor=#ffffff;fontStyle=1",
    })
    hrow.append(geom(width=1080, height=35))
    for hi, (h, w) in enumerate(zip(headers, widths)):
        c = ET.SubElement(r, "mxCell", {
            "id": f"{act['id']}_h{hi}",
            "value": h,
            "parent": f"{act['id']}_hr", "vertex": "1",
            "style": "shape=tableCell;align=center;fillColor=#6c8ebf;fontColor=#ffffff;fontStyle=1",
        })
        c.append(geom(width=w, height=35))

    drow = ET.SubElement(r, "mxCell", {
        "id": f"{act['id']}_dr",
        "parent": f"{act['id']}_tbl", "vertex": "1",
        "style": "shape=tableRow;",
    })
    drow.append(geom(y=35, width=1080, height=95))
    for di, (val, w) in enumerate(zip(
        [act["activity"], act["input"], act["output"], act["user"]], widths
    )):
        c = ET.SubElement(r, "mxCell", {
            "id": f"{act['id']}_d{di}",
            "value": val,
            "parent": f"{act['id']}_dr", "vertex": "1",
            "style": "shape=tableCell;align=left;spacingLeft=6;whiteSpace=wrap;html=1;",
        })
        c.append(geom(width=w, height=95))

    cap = ET.SubElement(r, "mxCell", {
        "id": f"{act['id']}_cap",
        "value": f"Hình 2.{i + 1} – Sơ đồ quy trình kèm bảng mô tả (1 sơ đồ = 1 bảng)",
        "parent": "1", "vertex": "1",
        "style": "text;html=1;strokeColor=none;fillColor=none;align=center;fontStyle=2;fontSize=10;",
    })
    cap.append(geom(x=200, y=340, width=760, height=30))

out = r"d:\Freelancer\RedBus\docs\so-do-nghiep-vu-redbus.drawio"
tree = ET.ElementTree(root)
ET.indent(tree, space="  ")
with open(out, "wb") as f:
    f.write(b'<?xml version="1.0" encoding="UTF-8"?>\n')
    tree.write(f, encoding="utf-8", xml_declaration=False)
print(f"OK: {len(activities)} trang (moi trang = 1 so do + 1 bang)")
