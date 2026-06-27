# -*- coding: utf-8 -*-
"""Cập nhật nội dung slide đồ án RedBus + animation mượt hơn."""
from __future__ import annotations

import shutil
import sys
from pathlib import Path

import win32com.client as win32

ROOT = Path(__file__).resolve().parents[1]
SRC = ROOT / "slide đồ án (1).pptx"
BACKUP = ROOT / "slide đồ án (1).backup.pptx"

# Thay thế theo khối văn bản đầy đủ (sau khi strip)
TEXT_REPLACEMENTS: list[tuple[str, str]] = [
    (
        "Tạo ra một website đặt vé xem phim với đầy đủ giao diện giúp khách hàng trở nên dễ dàng và linh hoạt hơn.\rTiết kiệm thời gian, dễ dàng so sánh giá vé và lịch chiếu trước khi đến rạp",
        "Xây dựng website bán vé xe khách RedBus với giao diện trực quan, giúp khách tra cứu chuyến, chọn ghế và thanh toán thuận tiện.\rTiết kiệm thời gian, dễ so sánh giá vé, lịch khởi hành và điểm dừng trước khi đặt vé.",
    ),
    (
        "Thiết kế UI rõ ràng, thuận tiện cho việc đặt vé, \rThiết kế các chức năng cơ bản như đặt vé, thanh toán online",
        "Thiết kế UI rõ ràng, thuận tiện tìm chuyến và đặt vé\rCác chức năng cốt lõi: đặt vé, tra cứu vé, thanh toán PayOS, quản trị vận hành",
    ),
    (
        "Đề tài áp dụng trong phạm vi nghiên cứu tại TP. Đà Nẵng",
        "Đề tài triển khai mô hình bán vé xe khách liên tỉnh trong phạm vi nghiên cứu tại TP. Đà Nẵng",
    ),
    (
        "Khách vãng lai\rThành viên\rQuản trị viên",
        "Khách vãng lai\rKhách hàng\rQuản trị viên",
    ),
    (
        "Tìm kiếm phim\rXem thông tin chi tiết phim\rĐăng kí tài khoản",
        "Xem tin tức, FAQ công khai\rTra cứu vé (mã + SĐT)\rĐăng ký tài khoản",
    ),
    (
        "Đăng nhập, đăng ký\rCập nhập thông tin tài khoản \rĐổi mật khẩu\rTìm kiếm phim\rĐặt vé\rThanh toán \rXem lịch sử giao dịch\rHoàn vé",
        "Đăng nhập, đăng ký, quên MK (OTP)\rCập nhật hồ sơ, đổi mật khẩu\rTìm chuyến, lọc, chọn ghế\rĐặt vé, áp dụng khuyến mãi\rThanh toán tiền mặt / PayOS\rVé của tôi, lịch sử thanh toán\rĐổi/hủy vé, đánh giá chuyến",
    ),
    (
        "Đăng nhập\rCập nhập thông tin tài khoản \rĐổi mật khẩu\rQuản lý phim\rQuản lý rạp, suất, phòng chiếu\rCombo vé\rQuản lý tài khoản\rQuản lý hoá đơn\rPhản hồi",
        "Đăng nhập (ADMIN/STAFF)\rQuản lý tuyến, điểm dừng\rQuản lý xe, loại xe, ghế ngồi\rQuản lý chuyến xe, gen lịch\rQuản lý khách hàng, khuyến mãi\rQuản lý tin tức, hỏi đáp\rHỗ trợ chat khách hàng\rBáo cáo, xuất CSV",
    ),
    (
        "NodeJS, Express Framework\r(Visual Studio)",
        "Java 17, Spring Boot 3\r(MyBatis, JWT Security)",
    ),
    (
        "ReactJS, Tailwind\r(Visual Studio)",
        "React 19, TypeScript, Vite\r(VS Code)",
    ),
    (
        "MongoDB\r(Mongodb compass)",
        "MySQL\r(phpMyAdmin / Workbench)",
    ),
    (
        "Chức năng Xem chi tiết phim",
        "Chức năng Tìm kiếm chuyến xe",
    ),
    (
        "Chức năng đặt vé",
        "Chức năng Đặt vé & chọn ghế",
    ),
    (
        "Chức năng xem vé đã đặt",
        "Chức năng Vé của tôi & tra cứu",
    ),
    (
        "Các chức năng quản lý của quản trị viên",
        "Các chức năng quản trị hệ thống",
    ),
    (
        "Xây dựng thành công website đặt vé xem phim cho các rạp chiếu phim tại TP. Đà Nẵng với những mục tiêu được đặt ra\rGiao diện trang website được thiết kế một cách thân thiện và dễ sử dụng",
        "Xây dựng thành công hệ thống RedBus bán vé xe khách với đầy đủ luồng đặt vé, thanh toán và quản trị\rGiao diện thân thiện: sơ đồ ghế trực quan, tra cứu vé không cần đăng nhập",
    ),
    (
        "Tối ưu hóa hệ thống để website hoạt động nhanh hơn và dễ bảo trì sau này.\rNâng cấp và hoàn thiện giao diện người dùng, các chức năng và tính bảo mật của hệ thống.",
        "Tích hợp thông báo realtime (SSE), mở rộng kênh thanh toán và tối ưu hiệu năng API.\rBổ sung ứng dụng di động, bản đồ lộ trình GPS và phân tích dữ liệu vận hành.",
    ),
]

# Thay thế đơn lẻ
SINGLE_REPLACEMENTS: list[tuple[str, str]] = [
    ("Thành viên", "Khách hàng"),
    ("Cập nhập", "Cập nhật"),
    ("Đăng kí", "Đăng ký"),
    ("XẬY DỰNG CHƯƠNG TRÌNH", "XÂY DỰNG CHƯƠNG TRÌNH"),
]

# PowerPoint constants (PpEntryEffect / MsoAnimEffect)
PP_EFFECT_FADE_SMOOTH = 3854
PP_EFFECT_PUSH_RIGHT = 42
MSO_ANIM_EFFECT_FADE = 10
MSO_ANIM_TRIGGER_AFTER_PREVIOUS = 2
MSO_ANIM_TRIGGER_ON_PAGE_CLICK = 1
MSO_ANIMATE_LEVEL_NONE = 0
MSO_GROUP = 6
MSO_PLACEHOLDER = 14


def norm(s: str) -> str:
    return s.replace("\r\n", "\r").replace("\n", "\r").strip()


def replace_text(text: str) -> str:
    t = text
    for old, new in TEXT_REPLACEMENTS:
        if norm(old) in norm(t):
            t = t.replace(old, new)
            if norm(old) not in norm(old.replace("\r", "\n")):
                t = t.replace(old.replace("\r", "\n"), new.replace("\r", "\n"))
    for old, new in SINGLE_REPLACEMENTS:
        t = t.replace(old, new)
    return t


def walk_shapes(shapes, fn):
    for i in range(1, shapes.Count + 1):
        sh = shapes(i)
        try:
            if sh.Type == MSO_GROUP:
                walk_shapes(sh.GroupItems, fn)
            else:
                fn(sh)
        except Exception:
            pass


def update_text_on_shape(shape) -> bool:
    if not shape.HasTextFrame:
        return False
    try:
        if not shape.TextFrame.HasText:
            return False
    except Exception:
        return False
    old = shape.TextFrame.TextRange.Text
    new = replace_text(old)
    if new != old:
        shape.TextFrame.TextRange.Text = new
        return True
    return False


def clear_animations(slide):
    try:
        seq = slide.TimeLine.MainSequence
        while seq.Count > 0:
            seq(1).Delete()
    except Exception:
        pass


def add_smooth_animations(slide, slide_index: int):
    """Fade-in tuần tự cho shape có text / ảnh nội dung chính."""
    clear_animations(slide)
    targets = []

    def collect(sh):
        try:
            if sh.HasTextFrame and sh.TextFrame.HasText:
                txt = sh.TextFrame.TextRange.Text.strip()
                if txt and len(txt) > 1 and not txt.isdigit():
                    targets.append(sh)
            elif sh.Type in (13, 11):  # picture, placeholder with image
                if sh.Width > 100 and sh.Height > 80:
                    targets.append(sh)
        except Exception:
            pass

    walk_shapes(slide.Shapes, collect)

    # Sắp theo vị trí trên-dưới, trái-phải
    def key(sh):
        try:
            return (round(sh.Top), round(sh.Left))
        except Exception:
            return (0, 0)

    targets.sort(key=key)

    seq = slide.TimeLine.MainSequence
    trigger = MSO_ANIM_TRIGGER_ON_PAGE_CLICK if slide_index <= 2 else MSO_ANIM_TRIGGER_AFTER_PREVIOUS

    for idx, sh in enumerate(targets[:12]):  # giới hạn tránh quá nhiều
        try:
            eff = seq.AddEffect(
                sh,
                MSO_ANIM_EFFECT_FADE,
                MSO_ANIMATE_LEVEL_NONE,
                trigger if idx == 0 else MSO_ANIM_TRIGGER_AFTER_PREVIOUS,
                idx + 1,
            )
            eff.Timing.Duration = 0.55
            eff.Timing.SmoothStart = True
            eff.Timing.SmoothEnd = True
            if idx > 0:
                eff.Timing.TriggerDelayTime = 0.08
        except Exception:
            continue


def set_slide_transition(slide, slide_index: int):
    tr = slide.SlideShowTransition
    try:
        if slide_index in (1, 2, 16):
            tr.EntryEffect = PP_EFFECT_FADE_SMOOTH
        else:
            tr.EntryEffect = PP_EFFECT_PUSH_RIGHT
        tr.Duration = 0.75
        tr.Speed = 2
        tr.AdvanceOnClick = True
    except Exception:
        try:
            tr.EntryEffect = PP_EFFECT_FADE_SMOOTH
            tr.Duration = 0.75
        except Exception:
            pass


def main():
    if not SRC.exists():
        print(f"Không tìm thấy: {SRC}", file=sys.stderr)
        sys.exit(1)

    if not BACKUP.exists():
        shutil.copy2(SRC, BACKUP)
        print("Backup created:", BACKUP.name)

    app = win32.Dispatch("PowerPoint.Application")
    try:
        app.Visible = True
    except Exception:
        pass

    pres = None
    try:
        pres = app.Presentations.Open(str(SRC.resolve()), WithWindow=False)
        changed = 0

        for i in range(1, pres.Slides.Count + 1):
            slide = pres.Slides(i)

            def upd(sh):
                nonlocal changed
                if update_text_on_shape(sh):
                    changed += 1

            walk_shapes(slide.Shapes, upd)
            set_slide_transition(slide, i)
            if i >= 3:  # slide 1-2 giữ animation gốc tối thiểu
                add_smooth_animations(slide, i)

        pres.Save()
        print(f"Done: {pres.Slides.Count} slides, {changed} shapes updated.")
    finally:
        if pres is not None:
            pres.Close()
        app.Quit()


if __name__ == "__main__":
    main()
