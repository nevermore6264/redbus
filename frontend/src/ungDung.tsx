import { Navigate, Route, Routes } from 'react-router-dom'
import { KhungChinh } from './thanhPhan/khungChinh'
import { KhungQuanTri } from './thanhPhan/khungQuanTri'
import { CanVaiTro } from './thanhPhan/canVaiTro'
import { TrangChu } from './trang/TrangChu'
import { HuongDenModalXacThuc } from './thanhPhan/HuongDenModalXacThuc'
import { TrangDatVe } from './trang/TrangDatVe'
import { TrangVeCuaToi } from './trang/TrangVeCuaToi'
import { TrangHoSo } from './trang/TrangHoSo'
import { TrangThongBao } from './trang/TrangThongBao'
import { TrangLichSuThanhToan } from './trang/TrangLichSuThanhToan'
import { TrangKetQuaThanhToan } from './trang/TrangKetQuaThanhToan'
import { TrangTongQuan } from './trang/quanTri/TrangTongQuan'
import { TrangTuyenDuong } from './trang/quanTri/TrangTuyenDuong'
import { TrangXeKhach } from './trang/quanTri/TrangXeKhach'
import { TrangChuyenXe } from './trang/quanTri/TrangChuyenXe'
import { TrangKhachHang } from './trang/quanTri/TrangKhachHang'
import { TrangGheNgoi } from './trang/quanTri/TrangGheNgoi'
import { TrangBaoCao } from './trang/quanTri/TrangBaoCao'
import { TrangLoaiXe } from './trang/quanTri/TrangLoaiXe'
import { TrangDiemDungChan } from './trang/quanTri/TrangDiemDungChan'
import { TrangKhuyenMai } from './trang/quanTri/TrangKhuyenMai'
import { TrangTinTucQuanTri } from './trang/quanTri/TrangTinTucQuanTri'
import { TrangTinTuc } from './trang/TrangTinTuc'
import { TrangTinChiTiet } from './trang/TrangTinChiTiet'
import { TrangDanhGia } from './trang/TrangDanhGia'
import { TrangTraCuuVe } from './trang/TrangTraCuuVe'
import { TrangKhongTimThay } from './trang/TrangKhongTimThay'

export function UngDung() {
  return (
    <Routes>
      <Route path="/" element={<KhungChinh />}>
        <Route index element={<TrangChu />} />
        <Route path="dang-nhap" element={<HuongDenModalXacThuc cheDo="dang-nhap" />} />
        <Route path="dang-ky" element={<HuongDenModalXacThuc cheDo="dang-ky" />} />
        <Route path="dat-ve" element={<TrangDatVe />} />
        <Route path="tin-tuc/:ma" element={<TrangTinChiTiet />} />
        <Route path="tin-tuc" element={<TrangTinTuc />} />
        <Route path="tra-cuu-ve" element={<TrangTraCuuVe />} />
        <Route path="ve-cua-toi" element={<CanVaiTro vaiTro={['CUSTOMER']} con={<TrangVeCuaToi />} />} />
        <Route path="danh-gia" element={<CanVaiTro vaiTro={['CUSTOMER']} con={<TrangDanhGia />} />} />
        <Route path="ho-so" element={<CanVaiTro vaiTro={['CUSTOMER']} con={<TrangHoSo />} />} />
        <Route path="thong-bao" element={<CanVaiTro vaiTro={['CUSTOMER']} con={<TrangThongBao />} />} />
        <Route
          path="lich-su-thanh-toan"
          element={<CanVaiTro vaiTro={['CUSTOMER']} con={<TrangLichSuThanhToan />} />}
        />
        <Route
          path="thanh-toan/ket-qua"
          element={<CanVaiTro vaiTro={['CUSTOMER']} con={<TrangKetQuaThanhToan />} />}
        />
        <Route path="*" element={<TrangKhongTimThay />} />
      </Route>

      <Route
        path="/quan-tri"
        element={<CanVaiTro vaiTro={['ADMIN', 'STAFF']} con={<KhungQuanTri />} />}
      >
        <Route index element={<Navigate to="tong-quan" replace />} />
        <Route path="tong-quan" element={<TrangTongQuan />} />
        <Route path="tuyen-duong" element={<TrangTuyenDuong />} />
        <Route path="xe-khach" element={<TrangXeKhach />} />
        <Route path="chuyen-xe" element={<TrangChuyenXe />} />
        <Route path="khach-hang" element={<TrangKhachHang />} />
        <Route path="ghe-ngoi" element={<TrangGheNgoi />} />
        <Route path="bao-cao" element={<TrangBaoCao />} />
        <Route path="loai-xe" element={<TrangLoaiXe />} />
        <Route path="diem-dung" element={<TrangDiemDungChan />} />
        <Route path="khuyen-mai" element={<TrangKhuyenMai />} />
        <Route path="tin-tuc" element={<TrangTinTucQuanTri />} />
        <Route path="*" element={<Navigate to="tong-quan" replace />} />
      </Route>

    </Routes>
  )
}
