package com.redbus.anhxa;

import com.redbus.mohinh.VeXe;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface AnhXaVeXe {

    VeXe timTheoMa(@Param("ma") Long ma);

    List<VeXe> timTheoMaKhach(@Param("maKhach") Long maKhach);

    List<VeXe> timTheoMaChuyen(@Param("maChuyen") Long maChuyen);

    int them(VeXe veXe);

    int capNhatTrangThai(@Param("ma") Long ma, @Param("trangThai") String trangThai);

    int capNhatYeuCauHoanTien(
            @Param("ma") Long ma,
            @Param("trangThai") String trangThai,
            @Param("soTienHoan") java.math.BigDecimal soTienHoan,
            @Param("thoiGianYeuCauHoan") java.time.LocalDateTime thoiGianYeuCauHoan,
            @Param("stkHoan") String stkHoan,
            @Param("tenNganHangHoan") String tenNganHangHoan,
            @Param("tenNguoiNhanHoan") String tenNguoiNhanHoan);

    int capNhatXacNhanHoanTien(
            @Param("ma") Long ma, @Param("thoiGianHoan") java.time.LocalDateTime thoiGianHoan);

    List<VeXe> danhSachChoHoanTien();

    int capNhatThanhToan(VeXe veXe);

    int capNhatMaDonPayOs(@Param("ma") Long ma, @Param("maDonPayOs") String maDonPayOs);

    int capNhatTamPayOs(
            @Param("ma") Long ma,
            @Param("maDonPayOs") String maDonPayOs,
            @Param("maKhuyenMai") Long maKhuyenMai,
            @Param("soTien") java.math.BigDecimal soTien);

    VeXe timTheoMaDonPayOs(@Param("maDonPayOs") String maDonPayOs);

    List<VeXe> danhSachTheoMaDonPayOs(@Param("maDonPayOs") String maDonPayOs);

    int demTheoTrangThai(@Param("trangThai") String trangThai);

    int huyPendingQuaHanTheoKhach(@Param("maKhach") Long maKhach, @Param("phut") int phut);

    int huyPendingQuaHanTatCa(@Param("phut") int phut);

    VeXe timTheoMaVeHienThi(@Param("maVeHienThi") String maVeHienThi);

    int capNhatMaVeHienThi(@Param("ma") Long ma, @Param("maVeHienThi") String maVeHienThi);

    int capNhatDiemDonTra(
            @Param("ma") Long ma,
            @Param("maDiemLen") Long maDiemLen,
            @Param("maDiemXuong") Long maDiemXuong);

    int capNhatGhe(@Param("ma") Long ma, @Param("maGhe") Long maGhe);

    int capNhatChuyenVaGhe(
            @Param("ma") Long ma,
            @Param("maChuyen") Long maChuyen,
            @Param("maGhe") Long maGhe);

    int xoaVeInactiveTheoChuyenGhe(
            @Param("maChuyen") Long maChuyen,
            @Param("maGhe") Long maGhe,
            @Param("maLoaiTru") Long maLoaiTru);
}
