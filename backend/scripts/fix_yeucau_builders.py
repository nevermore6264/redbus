# -*- coding: utf-8 -*-
import re
from pathlib import Path

TEST = Path(__file__).resolve().parents[1] / "src" / "test" / "java"

REPLACEMENTS = [
    (r'YeuCauDoiGhe\.builder\(\)\.maGheMoi\((\d+L?)\)\.build\(\)',
     r'yeuCauDoiGhe(\1)'),
    (r'YeuCauGuiChat\.builder\(\)\.maNguoiNhan\((\d+L?)\)\.noiDung\("([^"]*)"\)\.build\(\)',
     r'yeuCauGuiChat(\1, "\2")'),
    (r'YeuCauDanhGiaChuyen\.builder\(\)\.maChuyen\((\d+L?)\)\.diemSo\((\d+)\)\.build\(\)',
     r'yeuCauDanhGia(\1, \2)'),
    (r'YeuCauDatVe\.builder\(\)\.maChuyen\((\d+L?)\)\.build\(\)',
     r'yeuCauDatVe(\1)'),
    (r'YeuCauDatVe\.builder\(\)\.maChuyen\((\d+L?)\)\.dsMaGhe\(([^)]+)\)\.build\(\)',
     r'yeuCauDatVeDs(\1, \2)'),
    (r'YeuCauGenLich\.builder\(\)\.soNgay\((\d+)\)\.build\(\)',
     r'yeuCauGenLich(\1)'),
    (r'YeuCauHoiDap\.builder\(\)\.tieuDe\("([^"]*)"\)\.noiDungHoi\("([^"]*)"\)\.build\(\)',
     r'yeuCauHoiDap("\1", "\2")'),
    (r'YeuCauTraLoiHoiDap\.builder\(\)\.noiDungTraLoi\("([^"]*)"\)\.build\(\)',
     r'yeuCauTraLoi("\1")'),
    (r'YeuCauDoiMatKhau\.builder\(\)\.matKhauCu\("([^"]*)"\)\.matKhauMoi\("([^"]*)"\)\.build\(\)',
     r'yeuCauDoiMk("\1", "\2")'),
    (r'YeuCauCapNhatHoSo\.builder\(\)\.hoTen\("([^"]*)"\)\.soDienThoai\("([^"]*)"\)\.build\(\)',
     r'yeuCauCapNhatHoSo("\1", "\2")'),
    (r'YeuCauDatLaiMatKhau\.builder\(\)\s*\n\s*\.email\("([^"]*)"\)\.maOtp\("([^"]*)"\)\.matKhauMoi\("([^"]*)"\)\.build\(\)',
     r'yeuCauDatLaiMk("\1", "\2", "\3")'),
    (r'YeuCauDatLaiMatKhau\.builder\(\)\.email\("([^"]*)"\)\.maOtp\("([^"]*)"\)\.matKhauMoi\("([^"]*)"\)\.build\(\)',
     r'yeuCauDatLaiMk("\1", "\2", "\3")'),
]

HELPERS = '''
    private static YeuCauDoiGhe yeuCauDoiGhe(Long ma) {
        YeuCauDoiGhe y = new YeuCauDoiGhe();
        y.setMaGheMoi(ma);
        return y;
    }
    private static YeuCauGuiChat yeuCauGuiChat(Long ma, String nd) {
        YeuCauGuiChat y = new YeuCauGuiChat();
        y.setMaNguoiNhan(ma);
        y.setNoiDung(nd);
        return y;
    }
    private static YeuCauDanhGiaChuyen yeuCauDanhGia(Long maChuyen, int diem) {
        YeuCauDanhGiaChuyen y = new YeuCauDanhGiaChuyen();
        y.setMaChuyen(maChuyen);
        y.setDiemSo(diem);
        return y;
    }
    private static YeuCauDatVe yeuCauDatVe(Long maChuyen) {
        YeuCauDatVe y = new YeuCauDatVe();
        y.setMaChuyen(maChuyen);
        return y;
    }
    private static YeuCauDatVe yeuCauDatVeDs(Long maChuyen, java.util.List<Long> ds) {
        YeuCauDatVe y = new YeuCauDatVe();
        y.setMaChuyen(maChuyen);
        y.setDsMaGhe(ds);
        return y;
    }
    private static YeuCauGenLich yeuCauGenLich(int soNgay) {
        YeuCauGenLich y = new YeuCauGenLich();
        y.setSoNgay(soNgay);
        return y;
    }
    private static YeuCauHoiDap yeuCauHoiDap(String tieuDe, String nd) {
        YeuCauHoiDap y = new YeuCauHoiDap();
        y.setTieuDe(tieuDe);
        y.setNoiDungHoi(nd);
        return y;
    }
    private static YeuCauTraLoiHoiDap yeuCauTraLoi(String nd) {
        YeuCauTraLoiHoiDap y = new YeuCauTraLoiHoiDap();
        y.setNoiDungTraLoi(nd);
        return y;
    }
    private static YeuCauDoiMatKhau yeuCauDoiMk(String cu, String moi) {
        YeuCauDoiMatKhau y = new YeuCauDoiMatKhau();
        y.setMatKhauCu(cu);
        y.setMatKhauMoi(moi);
        return y;
    }
    private static YeuCauCapNhatHoSo yeuCauCapNhatHoSo(String hoTen, String sdt) {
        YeuCauCapNhatHoSo y = new YeuCauCapNhatHoSo();
        y.setHoTen(hoTen);
        y.setSoDienThoai(sdt);
        return y;
    }
    private static YeuCauDatLaiMatKhau yeuCauDatLaiMk(String email, String otp, String mk) {
        YeuCauDatLaiMatKhau y = new YeuCauDatLaiMatKhau();
        y.setEmail(email);
        y.setMaOtp(otp);
        y.setMatKhauMoi(mk);
        return y;
    }
    private static YeuCauDangKy yeuCauDangKy(String user, String email, String mk, String hoTen) {
        YeuCauDangKy y = new YeuCauDangKy();
        y.setTenDangNhap(user);
        y.setEmail(email);
        y.setMatKhau(mk);
        y.setHoTen(hoTen);
        return y;
    }
    private static YeuCauDangNhap yeuCauDangNhap(String user, String mk) {
        YeuCauDangNhap y = new YeuCauDangNhap();
        y.setTenDangNhap(user);
        y.setMatKhau(mk);
        return y;
    }
    private static YeuCauThemKhachQuanTri yeuCauThemKhach(String user, String email, String mk, String hoTen) {
        YeuCauThemKhachQuanTri y = new YeuCauThemKhachQuanTri();
        y.setTenDangNhap(user);
        y.setEmail(email);
        y.setMatKhau(mk);
        y.setHoTen(hoTen);
        return y;
    }
'''

# Simpler: direct inline replacements per file via StrReplace in agent
