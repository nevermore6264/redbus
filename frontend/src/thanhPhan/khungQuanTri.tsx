import { NavLink, Outlet, Link } from 'react-router-dom'
import { NutVanBan } from './nutBam'
import {
  Bus,
  ChevronLeft,
  LayoutDashboard,
  MapPin,
  Route as BieuTuongTuyen,
  BarChart3,
  Users,
  Armchair,
  Tag,
  MapPinned,
  Newspaper,
  BusFront,
  MessageCircle,
  Banknote,
} from 'lucide-react'
import { dungNguoiDung } from '../dinhDanh/boiCanhNguoiDung'

const lopLk = ({ isActive }: { isActive: boolean }) =>
  `admin-nav__link ${isActive ? 'admin-nav__link--active' : ''}`.trim()

export function KhungQuanTri() {
  const { nguoiDung, dangXuat } = dungNguoiDung()

  return (
    <div className="admin-root">
      <aside className="admin-aside">
        <Link to="/" className="admin-brand">
          <span className="logo__mark admin-brand__icon">
            <Bus size={20} strokeWidth={2.25} />
          </span>
          <span>RedBus · Quản trị</span>
        </Link>

        <nav className="admin-nav" aria-label="Quản trị">
          <div className="admin-nav__group">
            <span className="admin-nav__label">Tổng quan</span>
            <NavLink className={lopLk} to="/quan-tri/tong-quan" end>
              <LayoutDashboard size={18} />
              Tổng quan
            </NavLink>
            <NavLink className={lopLk} to="/quan-tri/bao-cao">
              <BarChart3 size={18} />
              Báo cáo
            </NavLink>
          </div>

          <div className="admin-nav__group">
            <span className="admin-nav__label">Vận hành</span>
            <NavLink className={lopLk} to="/quan-tri/tuyen-duong">
              <BieuTuongTuyen size={18} />
              Tuyến đường
            </NavLink>
            <NavLink className={lopLk} to="/quan-tri/xe-khach">
              <MapPin size={18} />
              Xe khách
            </NavLink>
            <NavLink className={lopLk} to="/quan-tri/chuyen-xe">
              <Bus size={18} />
              Chuyến xe
            </NavLink>
            <NavLink className={lopLk} to="/quan-tri/ghe-ngoi">
              <Armchair size={18} />
              Ghế ngồi
            </NavLink>
          </div>

          <div className="admin-nav__group">
            <span className="admin-nav__label">Khách &amp; nội dung</span>
            <NavLink className={lopLk} to="/quan-tri/khach-hang">
              <Users size={18} />
              Khách hàng
            </NavLink>
            <NavLink className={lopLk} to="/quan-tri/hoan-tien">
              <Banknote size={18} />
              Hoàn tiền
            </NavLink>
            <NavLink className={lopLk} to="/quan-tri/ho-tro">
              <MessageCircle size={18} />
              Hỗ trợ / Chat
            </NavLink>
            <NavLink className={lopLk} to="/quan-tri/khuyen-mai">
              <Tag size={18} />
              Khuyến mãi
            </NavLink>
            <NavLink className={lopLk} to="/quan-tri/tin-tuc">
              <Newspaper size={18} />
              Tin tức
            </NavLink>
          </div>

          <div className="admin-nav__group">
            <span className="admin-nav__label">Danh mục</span>
            <NavLink className={lopLk} to="/quan-tri/loai-xe">
              <BusFront size={18} />
              Loại xe
            </NavLink>
            <NavLink className={lopLk} to="/quan-tri/diem-dung">
              <MapPinned size={18} />
              Điểm dừng
            </NavLink>
          </div>
        </nav>

        <div className="admin-aside__foot">
          <Link to="/dat-ve" className="admin-back">
            <ChevronLeft size={18} />
            Giao diện khách
          </Link>
          <div className="admin-user">
            <span>{nguoiDung?.tenDangNhap}</span>
            <NutVanBan onClick={dangXuat} con="Đăng xuất" />
          </div>
        </div>
      </aside>
      <div className="admin-content">
        <Outlet />
      </div>
    </div>
  )
}
