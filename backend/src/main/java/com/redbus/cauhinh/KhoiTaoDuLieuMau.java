package com.redbus.cauhinh;

import com.redbus.anhxa.*;
import com.redbus.mohinh.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.ApplicationRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;

@Configuration
@RequiredArgsConstructor
@Slf4j
public class KhoiTaoDuLieuMau {

    private static final String MK_KHACH_DEMO = "Customer@123";

    private final AnhXaTaiKhoan anhXaTaiKhoan;
    private final PasswordEncoder boMaHoaMatKhau;
    private final AnhXaTuyenDuong anhXaTuyenDuong;
    private final AnhXaXeKhach anhXaXeKhach;
    private final AnhXaGheNgoi anhXaGheNgoi;
    private final AnhXaChuyenXe anhXaChuyenXe;
    private final AnhXaLoaiXe anhXaLoaiXe;
    private final AnhXaDiemDungChan anhXaDiemDungChan;
    private final AnhXaKhuyenMai anhXaKhuyenMai;
    private final AnhXaTinTuc anhXaTinTuc;
    private final AnhXaHinhThucThanhToan anhXaHinhThucThanhToan;
    private final AnhXaKhachHang anhXaKhachHang;
    private final AnhXaVeXe anhXaVeXe;
    private final AnhXaDanhGiaChuyen anhXaDanhGiaChuyen;
    private final AnhXaThongBao anhXaThongBao;

    @Bean
    public ApplicationRunner chayKhoiTaoMau() {
        return args -> {
            damBaoHinhThucThanhToan();
            damBaoTaiKhoanAdminStaff();
            List<KhachHang> khachDemo = layHoacTaoKhachDemo();

            var daCoTuyen = anhXaTuyenDuong.tatCa();
            if (!daCoTuyen.isEmpty()) {
                log.info(
                        "RedBus — bỏ qua nạp dữ liệu mẫu đầy đủ: đã có {} bản ghi trong `tuyen_duong`. "
                                + "Chỉ chèn bộ lớn khi bảng này còn trống (lần đầu hoặc sau khi xóa dữ liệu). "
                                + "Restart backend không xóa MySQL — cần truncate/xóa DB hoặc xóa tuyến nếu muốn seed lại.",
                        daCoTuyen.size());
                return;
            }

            log.info("RedBus — bắt đầu nạp dữ liệu mẫu đầy đủ (tuyến, xe, chuyến, tin, vé demo)...");

            HinhThucThanhToan tienMat = anhXaHinhThucThanhToan.timTheoMaLoai("TIEN_MAT");
            HinhThucThanhToan ck = anhXaHinhThucThanhToan.timTheoMaLoai("CHUYEN_KHOAN");
            Long maTienMat = tienMat != null ? tienMat.getMa() : null;
            Long maCk = ck != null ? ck.getMa() : maTienMat;

            List<LoaiXe> loai = taoLoaiXe();
            List<TuyenDuong> tuyen = taoTuyenVaDiemDung();
            List<XeKhach> xe = taoXeVaGhe(loai);

            List<ChuyenXe> tatCaChuyen =
                    taoLichChuyen(tuyen, xe, new int[] {150, 420, 360, 240, 300, 180}, new BigDecimal[] {
                        bd("250000"), bd("320000"), bd("280000"), bd("180000"), bd("220000"), bd("190000")
                    });

            List<KhuyenMai> km = taoKhuyenMai();
            Long maKmChinh = km.isEmpty() ? null : km.get(0).getMa();

            taoTinTuc();

            veVaTuongTacMau(tatCaChuyen, khachDemo, maTienMat, maCk, maKmChinh);

            log.info(
                    "RedBus — hoàn tất nạp dữ liệu mẫu: {} chuyến, khách demo {} người.",
                    tatCaChuyen.size(),
                    khachDemo.size());
        };
    }

    private static BigDecimal bd(String s) {
        return new BigDecimal(s);
    }

    private void damBaoHinhThucThanhToan() {
        if (anhXaHinhThucThanhToan.timTheoMaLoai("TIEN_MAT") == null) {
            anhXaHinhThucThanhToan.them(HinhThucThanhToan.builder()
                    .maLoai("TIEN_MAT")
                    .ten("Tiền mặt tại quầy")
                    .moTa("Thanh toán trực tiếp khi lên xe hoặc tại văn phòng")
                    .hoatDong(true)
                    .build());
        }
        if (anhXaHinhThucThanhToan.timTheoMaLoai("CHUYEN_KHOAN") == null) {
            anhXaHinhThucThanhToan.them(HinhThucThanhToan.builder()
                    .maLoai("CHUYEN_KHOAN")
                    .ten("Chuyển khoản ngân hàng")
                    .moTa("Demo: liên kết PayOS sau này")
                    .hoatDong(true)
                    .build());
        }
    }

    private void damBaoTaiKhoanAdminStaff() {
        if (anhXaTaiKhoan.timTheoTenDangNhap("admin") == null) {
            anhXaTaiKhoan.them(TaiKhoan.builder()
                    .tenDangNhap("admin")
                    .email("admin@redbus.local")
                    .matKhauMaHoa(boMaHoaMatKhau.encode("Admin@123"))
                    .vaiTro("ADMIN")
                    .hoatDong(true)
                    .build());
        }
        if (anhXaTaiKhoan.timTheoTenDangNhap("staff") == null) {
            anhXaTaiKhoan.them(TaiKhoan.builder()
                    .tenDangNhap("staff")
                    .email("staff@redbus.local")
                    .matKhauMaHoa(boMaHoaMatKhau.encode("Staff@123"))
                    .vaiTro("STAFF")
                    .hoatDong(true)
                    .build());
        }
    }

    /** 5 tai khoan khach + ho so — dung cho demo dat ve / danh gia */
    private List<KhachHang> layHoacTaoKhachDemo() {
        String[][] nhom = {
                {"khach1", "Nguyễn Văn An", "0909111001", "Đà Nẵng"},
                {"khach2", "Trần Thị Bình", "0909111002", "Huế"},
                {"khach3", "Lê Hoàng Nam", "0909111003", "TP. Hồ Chí Minh"},
                {"khach4", "Phạm Minh Châu", "0909111004", "Hà Nội"},
                {"khach5", "Võ Hải Đăng", "0909111005", "Nha Trang"},
        };
        List<KhachHang> ds = new ArrayList<>();
        for (String[] row : nhom) {
            TaiKhoan tk = anhXaTaiKhoan.timTheoTenDangNhap(row[0]);
            if (tk != null) {
                KhachHang co = anhXaKhachHang.timTheoMaTaiKhoan(tk.getMa());
                if (co != null) {
                    ds.add(co);
                }
                continue;
            }
            TaiKhoan moi = TaiKhoan.builder()
                    .tenDangNhap(row[0])
                    .email(row[0] + "@demo.redbus.local")
                    .matKhauMaHoa(boMaHoaMatKhau.encode(MK_KHACH_DEMO))
                    .vaiTro("CUSTOMER")
                    .hoatDong(true)
                    .build();
            anhXaTaiKhoan.them(moi);
            KhachHang kh = KhachHang.builder()
                    .maTaiKhoan(moi.getMa())
                    .hoTen(row[1])
                    .soDienThoai(row[2])
                    .diaChi(row[3])
                    .build();
            anhXaKhachHang.them(kh);
            ds.add(kh);
        }
        return ds;
    }

    private List<LoaiXe> taoLoaiXe() {
        List<LoaiXe> ds = new ArrayList<>();
        ds.add(themLoai("Giường nằm VIP", "Xe giường nằm đôi điều hòa độc lập", "WiFi, nước uống, chăn mền, ổ cắm USB"));
        ds.add(themLoai("Giường nằm tiêu chuẩn", "Giường nằm 44 inch", "WiFi, khăn lạnh"));
        ds.add(themLoai("Limousine 22 chỗ", "Ghế massage cao cấp", "WiFi, nước, màn hình cá nhân"));
        ds.add(themLoai("Xe khách Express", "Ghế ngồi cao cấp cho tuyến ngắn", "WiFi, nước"));
        return ds;
    }

    private LoaiXe themLoai(String ten, String moTa, String tienIch) {
        LoaiXe lx = LoaiXe.builder()
                .ten(ten)
                .moTa(moTa)
                .tienIch(tienIch)
                .hoatDong(true)
                .build();
        anhXaLoaiXe.them(lx);
        return lx;
    }

    private List<TuyenDuong> taoTuyenVaDiemDung() {
        String[][] tuyenRaw = {
                {"Đà Nẵng", "Huế", "100", "150"},
                {"TP. Hồ Chí Minh", "Đà Lạt", "308", "420"},
                {"Hà Nội", "Lào Cai", "296", "360"},
                {"Cần Thơ", "TP. Hồ Chí Minh", "169", "240"},
                {"Đà Nẵng", "Quy Nhơn", "230", "300"},
                {"Nha Trang", "Đà Lạt", "140", "180"},
        };
        String[][][] diem = {
                {{"Lăng Cô", "1", "10"}, {"Hải Vân", "2", "5"}},
                {{"Bảo Lộc", "1", "15"}, {"Di Linh", "2", "12"}},
                {{"Vĩnh Phúc", "1", "8"}, {"Yên Bái", "2", "10"}},
                {{"Vị Thanh", "1", "12"}, {"Mỹ Tho", "2", "10"}},
                {{"Tam Kỳ", "1", "10"}, {"Quảng Ngãi", "2", "8"}},
                {{"Cam Ranh", "1", "8"}, {"Phan Rang", "2", "10"}},
        };

        List<TuyenDuong> ds = new ArrayList<>();
        for (int i = 0; i < tuyenRaw.length; i++) {
            TuyenDuong t = TuyenDuong.builder()
                    .diemDi(tuyenRaw[i][0])
                    .diemDen(tuyenRaw[i][1])
                    .khoangCachKm(Integer.parseInt(tuyenRaw[i][2]))
                    .thoiGianUocTinhPhut(Integer.parseInt(tuyenRaw[i][3]))
                    .hoatDong(true)
                    .build();
            anhXaTuyenDuong.them(t);
            ds.add(t);
            for (String[] d : diem[i]) {
                anhXaDiemDungChan.them(DiemDungChan.builder()
                        .maTuyen(t.getMa())
                        .tenDiem(d[0])
                        .thuTu(Integer.parseInt(d[1]))
                        .thoiGianDungPhut(Integer.parseInt(d[2]))
                        .build());
            }
        }
        return ds;
    }

    private List<XeKhach> taoXeVaGhe(List<LoaiXe> loai) {
        /* bien, soCho, soCot — soCot = số ghế một hàng (lối đi giữa chia trái/phải) */
        Object[][] xeRaw = {
                {loai.get(0).getMa(), "43A-12345", "Mercedes-Benz", 34, 4},
                {loai.get(1).getMa(), "51B-77889", "Hyundai Universe", 40, 4},
                {loai.get(2).getMa(), "29H-55667", "Ford Transit Limousine", 22, 3},
                {loai.get(0).getMa(), "92K-11223", "Mercedes Tourismo", 34, 4},
                {loai.get(1).getMa(), "65F-99001", "Thaco Mobihome", 45, 5},
                {loai.get(2).getMa(), "37F-44556", "DCar Limousine", 29, 3},
        };
        List<XeKhach> ds = new ArrayList<>();
        for (Object[] row : xeRaw) {
            XeKhach x = XeKhach.builder()
                    .maLoaiXe((Long) row[0])
                    .bienSo((String) row[1])
                    .hangXe((String) row[2])
                    .soCho((Integer) row[3])
                    .hoatDong(true)
                    .build();
            anhXaXeKhach.them(x);
            ds.add(x);
            taoGheChoXe(x.getMa(), x.getSoCho(), (Integer) row[4]);
        }
        return ds;
    }

    /**
     * Chia đều ghế lên 2 tầng (tang 1 / 2). Trên mỗi tầng: hàng × cột có lối đi giữa (UI).
     */
    private void taoGheChoXe(Long maXe, int soCho, int soCot) {
        int half = (soCho + 1) / 2;
        for (int i = 1; i <= soCho; i++) {
            int tang = i <= half ? 1 : 2;
            int idxTrongTang = tang == 1 ? i - 1 : i - 1 - half;
            int hang = idxTrongTang / soCot + 1;
            int cot = idxTrongTang % soCot + 1;
            anhXaGheNgoi.them(GheNgoi.builder()
                    .maXe(maXe)
                    .maGhe(String.valueOf(i))
                    .tang(tang)
                    .hang(hang)
                    .cot(cot)
                    .trangThai("AVAILABLE")
                    .build());
        }
    }

    /** ~300 chuyen: 6 tuyen x 5 khung gio x 10 ngay */
    private List<ChuyenXe> taoLichChuyen(
            List<TuyenDuong> tuyen, List<XeKhach> xe, int[] phutUocTinh, BigDecimal[] giaVe) {
        int[] gio = {6, 9, 13, 17, 21};
        LocalDate homNay = LocalDate.now();
        List<ChuyenXe> tatCa = new ArrayList<>();
        for (int d = 0; d < 10; d++) {
            LocalDate ngay = homNay.plusDays(d);
            for (int r = 0; r < tuyen.size(); r++) {
                TuyenDuong t = tuyen.get(r);
                XeKhach x = xe.get(r % xe.size());
                int phut = phutUocTinh[r];
                BigDecimal gia = giaVe[r];
                for (int h : gio) {
                    LocalDateTime khoi = LocalDateTime.of(ngay, LocalTime.of(h, 0));
                    LocalDateTime den = khoi.plusMinutes(phut);
                    ChuyenXe cx = ChuyenXe.builder()
                            .maTuyen(t.getMa())
                            .maXe(x.getMa())
                            .thoiDiemKhoiHanh(khoi)
                            .thoiDiemDen(den)
                            .giaVe(gia)
                            .trangThai("SCHEDULED")
                            .build();
                    anhXaChuyenXe.them(cx);
                    tatCa.add(cx);
                }
            }
        }
        return tatCa;
    }

    private List<KhuyenMai> taoKhuyenMai() {
        List<KhuyenMai> ds = new ArrayList<>();
        KhuyenMai km1 = KhuyenMai.builder()
                .maCode("REDBUS10")
                .tieuDe("Giảm 10% tối đa 50.000đ")
                .phanTramGiam(bd("10"))
                .soTienGiamToiDa(bd("50000"))
                .ngayBatDau(LocalDateTime.now().minusDays(7))
                .ngayKetThuc(LocalDateTime.now().plusMonths(6))
                .soLanToiDa(5000)
                .soLanDaDung(12)
                .hoatDong(true)
                .build();
        anhXaKhuyenMai.them(km1);
        ds.add(km1);

        KhuyenMai km2 = KhuyenMai.builder()
                .maCode("CUOI_TUAN")
                .tieuDe("Thứ sáu — Chủ nhật giảm 15%")
                .phanTramGiam(bd("15"))
                .soTienGiamToiDa(bd("80000"))
                .ngayBatDau(LocalDateTime.now().minusDays(1))
                .ngayKetThuc(LocalDateTime.now().plusMonths(3))
                .soLanToiDa(2000)
                .soLanDaDung(3)
                .hoatDong(true)
                .build();
        anhXaKhuyenMai.them(km2);
        ds.add(km2);

        KhuyenMai km3 = KhuyenMai.builder()
                .maCode("TET2026")
                .tieuDe("Ưu đãi lễ Tết — giảm 12%")
                .phanTramGiam(bd("12"))
                .soTienGiamToiDa(bd("120000"))
                .ngayBatDau(LocalDateTime.now())
                .ngayKetThuc(LocalDateTime.now().plusMonths(12))
                .soLanToiDa(null)
                .soLanDaDung(0)
                .hoatDong(true)
                .build();
        anhXaKhuyenMai.them(km3);
        ds.add(km3);
        return ds;
    }

    private void taoTinTuc() {
        LocalDateTime luc = LocalDateTime.now();
        Object[][] bai = {
                {
                    "Mở bán thêm tuyến Cần Thơ — TP. Hồ Chí Minh giai đoạn 2026",
                    "Thêm 5 khung giờ mới và limousine 22 chỗ.",
                    "RedBus mở rộng mạng lưới miền Tây — đặt vé online, chọn ghế, điều chuyển realtime.",
                },
                {
                    "Cam kết an toàn: camera hành trình và tài xế 2 năm kinh nghiệm",
                    "Đội xe được kiểm định định kỳ.",
                    "Mỗi chuyến đều có hành trình GPS — khách hàng có thể tra cứu.",
                },
                {
                    "Hướng dẫn đổi vé và hoàn tiền trong 24 giờ",
                    "Áp dụng vé chưa thanh toán.",
                    "Liên hệ hotline hoặc quản lý trực tiếp trên ứng dụng.",
                },
                {
                    "Ưu đãi REDBUS10 — hơn 500 lượt sử dụng",
                    "Nhập mã khi thanh toán.",
                    "Áp dụng hàng loạt tuyến nội thành và liên tỉnh.",
                },
                {
                    "Top tuyến hot dịp lễ: Đà Lạt, Sa Pa, Huế",
                    "Gợi ý đặt sớm tránh hết chỗ.",
                    "Bảng giá cập nhật theo ngày — xem tại trang đặt vé.",
                },
        };
        int idx = 0;
        for (Object[] row : bai) {
            TinTuc tin = TinTuc.builder()
                    .tieuDe((String) row[0])
                    .tomTat((String) row[1])
                    .noiDung((String) row[2])
                    .hoatDong(true)
                    .ngayXuatBan(luc.minusHours(12L * idx))
                    .build();
            anhXaTinTuc.them(tin);
            idx++;
        }
    }

    private void veVaTuongTacMau(
            List<ChuyenXe> tatCaChuyen,
            List<KhachHang> khach,
            Long maTienMat,
            Long maCk,
            Long maKmChinh) {
        if (khach.isEmpty()) {
            return;
        }
        tatCaChuyen.sort(Comparator.comparing(ChuyenXe::getThoiDiemKhoiHanh));
        LocalDateTime luc = LocalDateTime.now();

        List<ChuyenXe> chuyenQuaKhu = tatCaChuyen.stream()
                .filter(c -> c.getThoiDiemKhoiHanh().isBefore(luc))
                .toList();
        List<ChuyenXe> chuyenTuongLai = tatCaChuyen.stream()
                .filter(c -> !c.getThoiDiemKhoiHanh().isBefore(luc))
                .toList();

        int iKhach = 0;
        /* Ve PAID + vai danh gia — chuyen da khoi hanh (hom qua / sang som) */
        int chiSoChuyen = 0;
        for (ChuyenXe cx : chuyenQuaKhu) {
            if (chiSoChuyen >= 35) {
                break;
            }
            List<GheNgoi> ghe = anhXaGheNgoi.timTheoMaXe(cx.getMaXe());
            int soVe = 2 + chiSoChuyen % 3;
            for (int s = 0; s < soVe && s < ghe.size(); s++) {
                KhachHang kh = khach.get(iKhach % khach.size());
                iKhach++;
                BigDecimal tien = cx.getGiaVe();
                if (maKmChinh != null && chiSoChuyen % 4 == 0) {
                    tien = cx.getGiaVe()
                            .multiply(bd("0.9"))
                            .setScale(0, RoundingMode.HALF_UP);
                }
                Long hinhThuc = chiSoChuyen % 5 == 0 ? maCk : maTienMat;
                Long km = chiSoChuyen % 4 == 0 ? maKmChinh : null;
                themVeDaThanhToan(cx, kh.getMa(), ghe.get(s).getMa(), hinhThuc, km, tien);
                if (chiSoChuyen % 2 == 0 && anhXaDanhGiaChuyen.timTheoMaChuyenVaMaKhach(cx.getMa(), kh.getMa()) == null) {
                    DanhGiaChuyen dg = DanhGiaChuyen.builder()
                            .maChuyen(cx.getMa())
                            .maKhach(kh.getMa())
                            .diemSo(4 + chiSoChuyen % 2)
                            .nhanXet("Chuyến ổn định, tài xế nhiệt tình — đánh giá demo.")
                            .build();
                    anhXaDanhGiaChuyen.them(dg);
                }
            }
            chiSoChuyen++;
        }

        /* Ve PENDING — sap khoi hanh */
        for (int i = 0; i < Math.min(28, chuyenTuongLai.size()); i++) {
            ChuyenXe cx = chuyenTuongLai.get(i);
            List<GheNgoi> ghe = anhXaGheNgoi.timTheoMaXe(cx.getMaXe());
            if (ghe.size() < 3) {
                continue;
            }
            KhachHang kh = khach.get(i % khach.size());
            themVeCho(cx.getMa(), kh.getMa(), ghe.get(i % ghe.size()).getMa(), "PENDING");
        }

        /* Ve da huy */
        for (int i = 0; i < Math.min(8, chuyenTuongLai.size()); i++) {
            ChuyenXe cx = chuyenTuongLai.get((i + 3) % chuyenTuongLai.size());
            List<GheNgoi> ghe = anhXaGheNgoi.timTheoMaXe(cx.getMaXe());
            KhachHang kh = khach.get((i + 1) % khach.size());
            VeXe ve = VeXe.builder()
                    .maChuyen(cx.getMa())
                    .maKhach(kh.getMa())
                    .maGhe(ghe.get((i + 5) % ghe.size()).getMa())
                    .trangThai("PENDING")
                    .build();
            anhXaVeXe.them(ve);
            anhXaVeXe.capNhatTrangThai(ve.getMa(), "CANCELLED");
        }

        /* Thong bao mau */
        int tb = 0;
        for (KhachHang k : khach) {
            Long maTk = k.getMaTaiKhoan();
            if (maTk == null) {
                continue;
            }
            anhXaThongBao.them(ThongBao.builder()
                    .maNguoiDung(maTk)
                    .tieuDe("Chào mừng đến RedBus")
                    .noiDung("Tài khoản demo có sẵn vé và khuyến mãi — đăng nhập để xem « Vé của tôi ».")
                    .daDoc(false)
                    .build());
            anhXaThongBao.them(ThongBao.builder()
                    .maNguoiDung(maTk)
                    .tieuDe("Nhắc lịch: kiểm tra giờ lên xe")
                    .noiDung("Truy cập trang đặt vé để xem chuyến sắp khởi hành trong 48 giờ.")
                    .daDoc(tb % 2 == 0)
                    .build());
            tb++;
        }
    }

    private void themVeCho(Long maChuyen, Long maKhach, Long maGhe, String trangThai) {
        VeXe ve = VeXe.builder()
                .maChuyen(maChuyen)
                .maKhach(maKhach)
                .maGhe(maGhe)
                .trangThai(trangThai)
                .build();
        anhXaVeXe.them(ve);
    }

    private void themVeDaThanhToan(
            ChuyenXe cx, Long maKhach, Long maGhe, Long maHinhThuc, Long maKhuyenMai, BigDecimal soTien) {
        VeXe ve = VeXe.builder()
                .maChuyen(cx.getMa())
                .maKhach(maKhach)
                .maGhe(maGhe)
                .trangThai("PENDING")
                .build();
        anhXaVeXe.them(ve);
        anhXaVeXe.capNhatThanhToan(VeXe.builder()
                .ma(ve.getMa())
                .maKhuyenMai(maKhuyenMai)
                .maHinhThuc(maHinhThuc)
                .soTienThanhToan(soTien)
                .maDonPayOs(null)
                .thoiGianThanhToan(cx.getThoiDiemKhoiHanh().minusHours(3))
                .trangThai("PAID")
                .build());
    }
}
