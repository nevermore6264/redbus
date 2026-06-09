package com.redbus.dichvu;

import com.redbus.anhxa.AnhXaKhuyenMai;
import com.redbus.mohinh.KhuyenMai;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
@DisplayName("DichVuKhuyenMai")
class DichVuKhuyenMaiTest {

    @Mock
    private AnhXaKhuyenMai anhXaKhuyenMai;

    @InjectMocks
    private DichVuKhuyenMai dichVu;

    private KhuyenMai hopLe;

    @BeforeEach
    void setUp() {
        hopLe = KhuyenMai.builder()
                .ma(1L)
                .maCode("KM10")
                .tieuDe("Giảm 10%")
                .phanTramGiam(BigDecimal.TEN)
                .ngayBatDau(LocalDateTime.now().minusDays(1))
                .ngayKetThuc(LocalDateTime.now().plusDays(30))
                .hoatDong(true)
                .soLanDaDung(0)
                .build();
    }

    @Test
    @DisplayName("layTheoMa ném lỗi khi không tìm thấy khuyến mãi")
    void layTheoMa_khongCo_nemLoi() {
        when(anhXaKhuyenMai.timTheoMa(99L)).thenReturn(null);
        assertThrows(IllegalArgumentException.class, () -> dichVu.layTheoMa(99L));
    }

    @Test
    @DisplayName("them chuẩn hóa mã code và tiêu đề trước khi lưu")
    void them_chuanHoaMaCodeVaTieuDe() {
        KhuyenMai input = KhuyenMai.builder()
                .maCode("  km x  ")
                .tieuDe("  tieu de  ")
                .phanTramGiam(BigDecimal.valueOf(15))
                .ngayBatDau(LocalDateTime.now())
                .ngayKetThuc(LocalDateTime.now().plusDays(1))
                .build();
        when(anhXaKhuyenMai.timTheoMaCode(anyString(), isNull())).thenReturn(null);
        when(anhXaKhuyenMai.timTheoMa(any())).thenReturn(input);
        dichVu.them(input);
        assertEquals("KMX", input.getMaCode());
        assertEquals("tieu de", input.getTieuDe());
        assertTrue(input.getHoatDong());
        assertEquals(0, input.getSoLanDaDung());
        verify(anhXaKhuyenMai).them(input);
    }

    @Test
    @DisplayName("them từ chối phần trăm giảm bằng 0")
    void them_phanTramBangKhong_nemLoi() {
        KhuyenMai k = banSao(hopLe);
        k.setMaCode("KM0");
        k.setPhanTramGiam(BigDecimal.ZERO);
        assertThrows(IllegalArgumentException.class, () -> dichVu.them(k));
    }

    @Test
    @DisplayName("them từ chối phần trăm giảm lớn hơn 100")
    void them_phanTramVuot100_nemLoi() {
        KhuyenMai k = banSao(hopLe);
        k.setMaCode("KM101");
        k.setPhanTramGiam(BigDecimal.valueOf(101));
        assertThrows(IllegalArgumentException.class, () -> dichVu.them(k));
    }

    @Test
    @DisplayName("them từ chối ngày kết thúc trước ngày bắt đầu")
    void them_ngayKetThucTruocBatDau_nemLoi() {
        KhuyenMai k = banSao(hopLe);
        k.setMaCode("KMDATE");
        k.setNgayBatDau(LocalDateTime.now().plusDays(2));
        k.setNgayKetThuc(LocalDateTime.now());
        assertThrows(IllegalArgumentException.class, () -> dichVu.them(k));
    }

    @Test
    @DisplayName("them từ chối mã code trùng")
    void them_maCodeTrung_nemLoi() {
        when(anhXaKhuyenMai.timTheoMaCode(eq("KM10"), isNull())).thenReturn(hopLe);
        assertThrows(IllegalArgumentException.class, () -> dichVu.them(banSao(hopLe)));
    }

    @Test
    @DisplayName("capNhat yêu cầu có mã khuyến mãi")
    void capNhat_thieuMa_nemLoi() {
        KhuyenMai k = banSao(hopLe);
        k.setMa(null);
        assertThrows(IllegalArgumentException.class, () -> dichVu.capNhat(k));
    }

    @Test
    @DisplayName("dangHieuLuc chỉ trả khuyến mãi còn hạn và còn lượt dùng")
    void dangHieuLuc_locDungDieuKien() {
        KhuyenMai hetHan = banSao(hopLe);
        hetHan.setMa(2L);
        hetHan.setNgayKetThuc(LocalDateTime.now().minusDays(1));
        KhuyenMai hetLuot = banSao(hopLe);
        hetLuot.setMa(3L);
        hetLuot.setSoLanToiDa(5);
        hetLuot.setSoLanDaDung(5);
        when(anhXaKhuyenMai.tatCa()).thenReturn(List.of(hopLe, hetHan, hetLuot));
        var ds = dichVu.dangHieuLuc();
        assertEquals(1, ds.size());
        assertEquals(1L, ds.get(0).getMa());
    }

    @Test
    @DisplayName("them từ chối thiếu ngày hiệu lực")
    void them_thieuNgay_nemLoi() {
        KhuyenMai k = banSao(hopLe);
        k.setMaCode("KMDATE2");
        k.setNgayBatDau(null);
        k.setNgayKetThuc(null);
        assertThrows(IllegalArgumentException.class, () -> dichVu.them(k));
    }

    @Test
    @DisplayName("them từ chối số tiền giảm tối đa âm")
    void them_soTienGiamToiDaAm_nemLoi() {
        KhuyenMai k = banSao(hopLe);
        k.setMaCode("KMNEG");
        k.setSoTienGiamToiDa(BigDecimal.valueOf(-1));
        assertThrows(IllegalArgumentException.class, () -> dichVu.them(k));
    }

    @Test
    @DisplayName("layTheoMa trả khuyến mãi khi tồn tại")
    void layTheoMa_coDuLieu_traVe() {
        when(anhXaKhuyenMai.timTheoMa(1L)).thenReturn(hopLe);
        assertEquals("KM10", dichVu.layTheoMa(1L).getMaCode());
    }

    @Test
    @DisplayName("tatCa trả danh sách từ mapper")
    void tatCa_goiMapper() {
        when(anhXaKhuyenMai.tatCa()).thenReturn(List.of(hopLe));
        assertEquals(1, dichVu.tatCa().size());
    }

    @Test
    @DisplayName("xoa gọi mapper sau khi xác nhận tồn tại")
    void xoa_tonTai_goiMapper() {
        when(anhXaKhuyenMai.timTheoMa(1L)).thenReturn(hopLe);
        dichVu.xoa(1L);
        verify(anhXaKhuyenMai).xoa(1L);
    }

    private static KhuyenMai banSao(KhuyenMai goc) {
        KhuyenMai k = new KhuyenMai();
        k.setMa(goc.getMa());
        k.setMaCode(goc.getMaCode());
        k.setTieuDe(goc.getTieuDe());
        k.setPhanTramGiam(goc.getPhanTramGiam());
        k.setSoTienGiamToiDa(goc.getSoTienGiamToiDa());
        k.setNgayBatDau(goc.getNgayBatDau());
        k.setNgayKetThuc(goc.getNgayKetThuc());
        k.setSoLanToiDa(goc.getSoLanToiDa());
        k.setSoLanDaDung(goc.getSoLanDaDung());
        k.setHoatDong(goc.getHoatDong());
        return k;
    }
}
