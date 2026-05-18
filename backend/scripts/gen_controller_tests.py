# -*- coding: utf-8 -*-
"""Generate @WebMvcTest skeletons for dieukhien controllers."""
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
MAIN = ROOT / "src" / "main" / "java" / "com" / "redbus" / "dieukhien"
TEST = ROOT / "src" / "test" / "java" / "com" / "redbus" / "dieukhien"
SKIP = {"DieuKhienKhuyenMaiTest"}

CONTROLLERS = {
    "DieuKhienBaoCao": {
        "service": "DichVuBaoCao", "public_get": None,
        "secured_get": "/bao-cao/mo-rong", "role": "STAFF",
        "secured_stub": "when(dichVuBaoCao.baoCaoMoRong()).thenReturn(BaoCaoMoRong.builder().build());",
        "extra_imports": ["import com.redbus.truyen.BaoCaoMoRong;"],
    },
    "DieuKhienChat": {
        "service": "DichVuChat", "public_get": None,
        "secured_get": "/chat/hoi-thoai?maDoiPhuong=2", "role": "CUSTOMER",
        "secured_stub": "when(dichVuChat.hoiThoai(anyString(), eq(2L))).thenReturn(java.util.List.of());",
    },
    "DieuKhienChuyenXe": {
        "service": "DichVuChuyenXe", "public_get": "/chuyen-xe/tim-kiem?maTuyen=1",
        "secured_get": "/chuyen-xe/toan-bo", "role": "ADMIN",
        "public_stub": "when(dichVuChuyenXe.timTheoTuyen(any(), any())).thenReturn(java.util.List.of());",
        "secured_stub": "when(dichVuChuyenXe.tatCa()).thenReturn(java.util.List.of());",
    },
    "DieuKhienDanhGiaChuyen": {
        "service": "DichVuDanhGiaChuyen", "public_get": "/danh-gia/cong-khai",
        "secured_get": "/danh-gia/ve-cho-danh-gia", "role": "CUSTOMER",
        "public_stub": "when(dichVuDanhGiaChuyen.congKhai(anyInt())).thenReturn(java.util.List.of());",
        "secured_stub": "when(dichVuDanhGiaChuyen.veChoDanhGia(anyString())).thenReturn(java.util.List.of());",
    },
    "DieuKhienDiaDanh": {
        "service": "DichVuDiaDanh", "public_get": "/dia-danh/tinh",
        "secured_get": None,
        "public_stub": "when(dichVuDiaDanh.layDanhSachTinh()).thenReturn(java.util.List.of());",
    },
    "DieuKhienDiemDungChan": {
        "service": "DichVuDiemDungChan", "public_get": "/diem-dung/tuyen/1",
        "secured_get": "/diem-dung", "role": "ADMIN",
        "public_stub": "when(dichVuDiemDungChan.theoTuyen(1L)).thenReturn(java.util.List.of());",
        "secured_stub": "when(dichVuDiemDungChan.tatCa()).thenReturn(java.util.List.of());",
    },
    "DieuKhienGheNgoi": {
        "service": "DichVuGheNgoi", "public_get": "/ghe-ngoi/xe/1",
        "secured_get": None,
        "public_stub": "when(dichVuGheNgoi.theoMaXe(1L)).thenReturn(java.util.List.of());",
    },
    "DieuKhienHinhThucThanhToan": {
        "service": "DichVuThanhToan", "public_get": "/hinh-thuc-thanh-toan",
        "secured_get": None,
        "public_stub": "",
        "note": "uses AnhXa - skip, read file",
    },
    "DieuKhienHoiDap": {
        "service": "DichVuHoiDap", "public_get": "/hoi-dap/cong-khai",
        "secured_get": "/hoi-dap/quan-tri/tat-ca", "role": "ADMIN",
        "public_stub": "when(dichVuHoiDap.congKhai()).thenReturn(java.util.List.of());",
        "secured_stub": "when(dichVuHoiDap.tatCaChoQuanTri()).thenReturn(java.util.List.of());",
    },
    "DieuKhienHoSo": {
        "service": "DichVuHoSo", "public_get": None,
        "secured_get": "/ho-so/cua-toi", "role": "CUSTOMER",
        "secured_stub": "when(dichVuHoSo.xemHoSo(anyString())).thenReturn(ThongTinHoSoCaNhan.builder().tenDangNhap(\"u\").build());",
        "extra_imports": ["import com.redbus.truyen.ThongTinHoSoCaNhan;"],
    },
    "DieuKhienKhachHang": {
        "service": "DichVuQuanLyKhachHang", "public_get": None,
        "secured_get": "/khach-hang", "role": "ADMIN",
        "secured_stub": "when(dichVuQuanLyKhachHang.danhSachDayDu()).thenReturn(java.util.List.of());",
    },
    "DieuKhienLoaiXe": {
        "service": "DichVuLoaiXe", "public_get": "/loai-xe",
        "secured_get": None,
        "public_stub": "when(dichVuLoaiXe.tatCa()).thenReturn(java.util.List.of());",
    },
    "DieuKhienThanhToan": {
        "service": "DichVuThanhToan", "public_get": None,
        "secured_get": "/thanh-toan/lich-su", "role": "CUSTOMER",
        "secured_stub": "when(dichVuThanhToan.lichSuCuaKhach(anyString())).thenReturn(java.util.List.of());",
    },
    "DieuKhienThongBao": {
        "service": "DichVuThongBao", "public_get": None,
        "secured_get": "/thong-bao", "role": "CUSTOMER",
        "secured_stub": "when(dichVuThongBao.danhSachCuaNguoiDung(anyLong())).thenReturn(java.util.List.of());",
    },
    "DieuKhienTinTuc": {
        "service": "DichVuTinTuc", "public_get": "/tin-tuc",
        "secured_get": "/tin-tuc/quan-tri/tat-ca", "role": "ADMIN",
        "public_stub": "when(dichVuTinTuc.congKhai()).thenReturn(java.util.List.of());",
        "secured_stub": "when(dichVuTinTuc.tatCa()).thenReturn(java.util.List.of());",
    },
    "DieuKhienTuyenDuong": {
        "service": "DichVuTuyenDuong", "public_get": "/tuyen-duong",
        "secured_get": None,
        "public_stub": "when(dichVuTuyenDuong.tatCa()).thenReturn(java.util.List.of());",
    },
    "DieuKhienVeXe": {
        "service": "DichVuDatVe", "public_get": "/ve-xe/tra-cuu?maVeHienThi=RB1&soDienThoai=090",
        "secured_get": "/ve-xe/cua-toi", "role": "CUSTOMER",
        "public_service": "DichVuTraCuuVe",
        "public_stub": "when(dichVuTraCuuVe.traCuuCongKhai(anyString(), anyString())).thenReturn(VeDienTuPhanHoi.builder().ma(1L).build());",
        "secured_stub": "when(dichVuDatVe.veCuaTaiKhoan(anyString())).thenReturn(java.util.List.of());",
        "extra_imports": ["import com.redbus.truyen.VeDienTuPhanHoi;"],
        "extra_mocks": ["@MockBean\n    private DichVuTraCuuVe dichVuTraCuuVe;"],
    },
    "DieuKhienXacThuc": {
        "service": "DichVuXacThuc", "public_get": None,
        "post_public": "/xac-thuc/dang-nhap",
        "extra_mocks": ["@MockBean\n    private DichVuQuenMatKhau dichVuQuenMatKhau;"],
    },
    "DieuKhienXeKhach": {
        "service": "DichVuXeKhach", "public_get": "/xe-khach",
        "secured_get": None,
        "public_stub": "when(dichVuXeKhach.tatCa()).thenReturn(java.util.List.of());",
    },
}


def gen(cfg):
    cls = cfg["cls"]
    svc = cfg["service"]
    svc_var = svc[0].lower() + svc[1:]
    tests = []
    imports = cfg.get("extra_imports", [])
    mocks = [f"    @MockBean\n    private {svc} {svc_var};"]
    mocks.extend(cfg.get("extra_mocks", []))

    if cfg.get("public_get"):
        tests.append(f"""
    @Test
    @DisplayName("GET {cfg['public_get']} công khai trả 200")
    void congKhai_tra200() throws Exception {{
        {cfg.get('public_stub', '')}
        mockMvc.perform(get("{cfg['public_get']}"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.thanhCong").value(true));
    }}""")

    if cfg.get("post_public"):
        tests.append(f"""
    @Test
    @DisplayName("POST {cfg['post_public']} cho phép không đăng nhập")
    void dangNhap_tra200() throws Exception {{
        when({svc_var}.dangNhap(any())).thenReturn(PhanHoiDangNhap.builder().token("t").build());
        mockMvc.perform(post("{cfg['post_public']}")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{{\\"tenDangNhap\\":\\"u\\",\\"matKhau\\":\\"p\\"}}"))
                .andExpect(status().isOk());
    }}""")
        imports.append("import com.redbus.truyen.PhanHoiDangNhap;")
        imports.append("import org.springframework.http.MediaType;")
        imports.append("import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;")

    if cfg.get("secured_get"):
        role = cfg.get("role", "ADMIN")
        tests.append(f"""
    @Test
    @WithMockUser(roles = "{role}")
    @DisplayName("GET {cfg['secured_get']} yêu cầu đăng nhập")
    void baoVe_tra200() throws Exception {{
        {cfg.get('secured_stub', '')}
        mockMvc.perform(get("{cfg['secured_get']}"))
                .andExpect(status().isOk());
    }}""")

    imp = "\n".join(imports)
    mock_block = "\n".join(mocks)
    return f"""package com.redbus.dieukhien;

import com.redbus.dichvu.*;
import com.redbus.hotro.HoTroTestMvc;
{imp}
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;

import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest({cls}.class)
@HoTroTestMvc
@DisplayName("{cls}")
class {cls}Test {{

    @Autowired
    private MockMvc mockMvc;

{mock_block}
{"".join(tests)}
}}
"""


def main():
    # manual only for configured
    pass

if __name__ == "__main__":
    main()
