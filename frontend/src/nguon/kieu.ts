

export interface PhanHoi<T> {
  thanhCong: boolean
  thongDiep: string
  duLieu: T
}

export interface PhanHoiDangNhap {
  token: string
  loai: string
  tenDangNhap: string
  email: string
  vaiTro: string
}

export interface DonViHanhChinh {
  name: string
  code: number
  division_type?: string
  codename?: string
  province_code?: number
}

export interface TuyenDuong {
  ma: number
  diemDi: string
  diemDen: string
  khoangCachKm?: number
  thoiGianUocTinhPhut?: number
  hoatDong?: boolean
}

export interface PhanHoiLinkPayOs {
  checkoutUrl: string
  orderCode: number
  maVe: number
  soTien: number
}

export interface KetQuaThanhToanPayOs {
  orderCode: number
  maVe: number
  trangThaiVe: string
  daThanhToan: boolean
}

export interface KetQuaGenLich {
  soChuyenDaTao: number
  soNgayDaGen: number
  soNgayDaBoQua: number
  cacNgayDaGen: string[]
  cacNgayDaBoQua: string[]
}

export interface ChuyenXe {
  ma: number
  maTuyen: number
  maXe: number
  thoiDiemKhoiHanh: string
  thoiDiemDen?: string
  giaVe: number | string
  trangThai: string
}

export interface GheNgoi {
  ma: number
  maXe: number
  maGhe: string
  hang?: number
  cot?: number

  tang?: number
  trangThai: string
}

export interface VeXe {
  ma: number
  maChuyen: number
  maKhach: number
  maGhe: number
  trangThai: string
  maVeHienThi?: string
  thoiGianDat?: string
  maDiemLen?: number
  maDiemXuong?: number
}

export interface VeDienTu {
  ma: number
  maVeHienThi: string
  trangThai: string
  tenKhach?: string
  soDienThoai?: string
  diemDi?: string
  diemDen?: string
  diemLen?: string
  diemXuong?: string
  thoiDiemKhoiHanh?: string
  maGhe?: string
  soTienThanhToan?: number | string
  noiDungQr: string
}

export interface ChuyenXeLoc {
  chuyen: ChuyenXe
  tenLoaiXe?: string
  soGheTrong?: number
}

export interface VeChoDanhGia {
  maVe: number
  maChuyen: number
  tuyen?: string
  thoiDiemKhoiHanh?: string
  maGhe?: string
  daDanhGia: boolean
}

export interface XeKhach {
  ma: number
  maLoaiXe?: number
  bienSo: string
  hangXe?: string
  soCho: number
  hoatDong?: boolean
}

export interface LoaiXeAnhTomTat {
  ma: number

  duongAnh: string
}

export interface LoaiXe {
  ma: number
  ten: string
  moTa?: string
  tienIch?: string
  hoatDong?: boolean
  dsAnh?: LoaiXeAnhTomTat[]
}

export interface DiemDungChan {
  ma: number
  maTuyen: number
  tenDiem: string
  thuTu?: number
  thoiGianDungPhut?: number
  viDo?: number
  kinhDo?: number
}

export interface KhuyenMai {
  ma: number
  maCode: string
  tieuDe?: string
  phanTramGiam: number | string
  soTienGiamToiDa?: number | string
  ngayBatDau: string
  ngayKetThuc: string
  soLanToiDa?: number
  soLanDaDung?: number
  hoatDong?: boolean
}

export interface DanhGiaChuyen {
  ma: number
  maChuyen: number
  maKhach: number
  diemSo: number
  nhanXet?: string
  thoiGianTao?: string
}

export interface DanhGiaCongKhai {
  ma: number
  diemSo: number
  nhanXet?: string
  thoiGianTao?: string
  tenKhach: string
  diemDi: string
  diemDen: string
}

export interface TinTuc {
  ma: number
  tieuDe: string
  tomTat?: string
  noiDung: string
  duongAnh?: string
  ngayXuatBan?: string
  hoatDong?: boolean
}

export interface GiaoDichThanhToan {
  ma: number
  maVe: number
  maKhuyenMai?: number
  soTien: number | string
  phuongThuc: string
  trangThai: string
  maDonPayOs?: string
  thoiGianTao?: string
}

export interface BaoCaoMoRong {
  soGiaoDichThanhToan: number
  tongDoanhThu: number | string
  soVeDaThanhToan: number
  soVeChoXuLy: number
  soChuyenLichDinh: number
  soDanhGia?: number
  diemTrungBinhDanhGia?: number | string
  soTinTucHoatDong?: number
  soKhuyenMaiDangHieuLuc?: number
  soDiemDungChan?: number
  soLoaiXe?: number
}

export interface MucBieuDo {
  nhan: string
  soLuong?: number
  giaTri?: number | string
}

export interface BaoCaoBieuDoPhanHoi {
  doanhThuTheoNgay: MucBieuDo[]
  trangThaiVe: MucBieuDo[]
  phuongThucThanhToan: MucBieuDo[]
  topTuyenTheoVe: MucBieuDo[]
  phanBoDanhGia: MucBieuDo[]
}

export interface ThongTinHoSoCaNhan {
  maTaiKhoan: number
  tenDangNhap: string
  email: string
  maKhach: number
  hoTen: string
  soDienThoai?: string
  diaChi?: string
}

export interface ThongBao {
  ma: number
  maNguoiDung: number
  tieuDe?: string
  noiDung: string
  daDoc: boolean
  thoiGianTao?: string
}

export interface ThongTinKhachHang {
  maKhach: number
  maTaiKhoan: number
  hoTen: string
  soDienThoai?: string
  diaChi?: string
  tenDangNhap: string
  email: string

  hoatDong?: boolean
}
