/** Kiểu dữ liệu trùng khớp JSON backend (tiếng Việt không dấu) */

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

export interface TuyenDuong {
  ma: number
  diemDi: string
  diemDen: string
  khoangCachKm?: number
  thoiGianUocTinhPhut?: number
  hoatDong?: boolean
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
  /** 1 tầng dưới · 2 tầng trên */
  tang?: number
  trangThai: string
}

export interface VeXe {
  ma: number
  maChuyen: number
  maKhach: number
  maGhe: number
  trangThai: string
  thoiGianDat?: string
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
  /** ví dụ tai-nguyen/loai-xe/3/uuid.jpg — dùng urlTaiNguyen() */
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

/** Đánh giá công khai trên trang chủ */
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
  /** Khóa/mở đăng nhập (đọc từ tài khoản) */
  hoatDong?: boolean
}
