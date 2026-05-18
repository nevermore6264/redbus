package com.redbus.dichvu;

import com.redbus.anhxa.AnhXaKhuyenMai;
import com.redbus.hotro.NguonCase;
import com.redbus.mohinh.KhuyenMai;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.MethodSource;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.mockito.junit.jupiter.MockitoSettings;
import org.mockito.quality.Strictness;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
@MockitoSettings(strictness = Strictness.LENIENT)
@DisplayName("DichVuKhuyenMai — CRUD và kiểm tra nghiệp vụ khuyến mãi")
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
    @DisplayName("layTheoMa không tồn tại → IllegalArgumentException")
    void layTheoMa_khongCo_nemLoi() {
        when(anhXaKhuyenMai.timTheoMa(99L)).thenReturn(null);
        assertThrows(IllegalArgumentException.class, () -> dichVu.layTheoMa(99L));
    }

    @Test
    @DisplayName("them chuẩn hóa maCode uppercase và trim khoảng trắng")
    void them_chuanHoaMaCode() {
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
        verify(anhXaKhuyenMai).them(input);
    }

    @Test
    @DisplayName("phanTramGiam = 0 → lỗi validation")
    void them_phanTramKhongHopLe() {
        KhuyenMai k = banSao(hopLe);
        k.setPhanTramGiam(BigDecimal.ZERO);
        assertThrows(IllegalArgumentException.class, () -> dichVu.them(k));
    }

    @ParameterizedTest(name = "case {0}: phần trăm giảm = {0}% (hợp lệ 1..100)")
    @MethodSource("phanTramHopLe")
    @DisplayName("1000 case: phần trăm giảm biên hợp lệ")
    void them1000PhanTramHopLe(int phanTram) {
        KhuyenMai k = banSao(hopLe);
        k.setMa(null);
        k.setMaCode("KM" + phanTram);
        k.setPhanTramGiam(BigDecimal.valueOf(phanTram));
        when(anhXaKhuyenMai.timTheoMaCode(anyString(), isNull())).thenReturn(null);
        when(anhXaKhuyenMai.timTheoMa(any())).thenReturn(k);
        assertDoesNotThrow(() -> dichVu.them(k));
    }

    static java.util.stream.Stream<Integer> phanTramHopLe() {
        return java.util.stream.IntStream.rangeClosed(1, NguonCase.SO_CASE_TOI_THIEU)
                .map(i -> (i % 100) + 1)
                .boxed();
    }

    @ParameterizedTest(name = "case {0}: phần trăm = {0} (không hợp lệ)")
    @MethodSource("phanTramKhongHopLe")
    @DisplayName("1000 case: phần trăm giảm không hợp lệ")
    void them1000PhanTramKhongHopLe(int phanTram) {
        KhuyenMai k = banSao(hopLe);
        k.setMaCode("X" + phanTram);
        k.setPhanTramGiam(BigDecimal.valueOf(phanTram));
        assertThrows(IllegalArgumentException.class, () -> dichVu.them(k));
    }

    static java.util.stream.Stream<Integer> phanTramKhongHopLe() {
        return java.util.stream.IntStream.rangeClosed(1, NguonCase.SO_CASE_TOI_THIEU)
                .map(i -> i <= 500 ? 0 : 101 + (i % 50))
                .boxed();
    }

    @Test
    @DisplayName("dangHieuLuc lọc theo hoạt động, ngày và số lần dùng")
    void dangHieuLuc_locDung() {
        KhuyenMai hetHan = banSao(hopLe);
        hetHan.setMa(2L);
        hetHan.setNgayKetThuc(LocalDateTime.now().minusDays(1));
        KhuyenMai conLuot = banSao(hopLe);
        conLuot.setMa(3L);
        conLuot.setSoLanToiDa(5);
        conLuot.setSoLanDaDung(5);
        when(anhXaKhuyenMai.tatCa()).thenReturn(List.of(hopLe, hetHan, conLuot));
        var ds = dichVu.dangHieuLuc();
        assertEquals(1, ds.size());
        assertEquals(1L, ds.get(0).getMa());
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
