import { useEffect, useState } from 'react'
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom'
import {
  Bell,
  Bus,
  ClipboardList,
  Home,
  LayoutDashboard,
  Mail,
  MapPin,
  Newspaper,
  Phone,
  Receipt,
  Star,
  UserCircle,
} from 'lucide-react'
import { dungNguoiDung } from '../dinhDanh/boiCanhNguoiDung'
import { dungModalXacThuc } from '../dinhDanh/boiCanhModalXacThuc'
import { NutBam, NutLienKet, NutVanBan } from './nutBam'

export function KhungChinh() {
  const { nguoiDung, dangXuat } = dungNguoiDung()
  const viTri = useLocation()
  const navigate = useNavigate()
  const { moDangNhap, moDangKy } = dungModalXacThuc()
  const [tyLeCuon, datTyLeCuon] = useState(0)

  useEffect(() => {
    const onScroll = () => {
      const el = document.documentElement
      const max = el.scrollHeight - el.clientHeight
      const t = max > 0 ? el.scrollTop / max : 0
      datTyLeCuon(Number.isFinite(t) ? Math.min(1, Math.max(0, t)) : 0)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [viTri.pathname])

  useEffect(() => {
    const s = viTri.state as { moDangNhap?: boolean; redirectSau?: string } | null
    if (s?.moDangNhap) {
      moDangNhap(s.redirectSau)
      navigate({ pathname: viTri.pathname, search: viTri.search, hash: viTri.hash }, { replace: true, state: {} })
    }
  }, [viTri.pathname, viTri.search, viTri.hash, viTri.state, moDangNhap, navigate])

  const lopLk = (duong: string, them?: string) =>
    `nav-link ${viTri.pathname === duong ? 'nav-link--active' : ''} ${them ?? ''}`.trim()

  const laKhach = nguoiDung?.vaiTro === 'CUSTOMER'
  const laQuanTri = nguoiDung?.vaiTro === 'ADMIN' || nguoiDung?.vaiTro === 'STAFF'

  return (
    <div className="shell">
      <div
        className="scroll-progress"
        style={{ transform: `scaleX(${tyLeCuon})` }}
        aria-hidden
        role="presentation"
      />
      <header className="header">
        <div className="header__inner">
          <Link to="/" className="logo">
            <span className="logo__mark">
              <Bus size={22} strokeWidth={2.25} />
            </span>
            <span className="logo__text">RedBus</span>
          </Link>

          <nav className="header__nav" aria-label="Chính">
            {!laKhach && !laQuanTri ? (
              <>
                <Link className={lopLk('/')} to="/">
                  <span className="nav-link__ico" aria-hidden>
                    <Home size={18} strokeWidth={2} />
                  </span>
                  <span className="nav-link__text">Trang chủ</span>
                </Link>
                <Link className={lopLk('/tin-tuc')} to="/tin-tuc">
                  <span className="nav-link__ico" aria-hidden>
                    <Newspaper size={18} strokeWidth={2} />
                  </span>
                  <span className="nav-link__text">Tin tức</span>
                </Link>
              </>
            ) : null}
            {laKhach ? (
              <>
                <Link className={lopLk('/ve-cua-toi')} to="/ve-cua-toi">
                  <span className="nav-link__ico" aria-hidden>
                    <ClipboardList size={18} strokeWidth={2} />
                  </span>
                  <span className="nav-link__text">Vé của tôi</span>
                </Link>
                <Link className={lopLk('/lich-su-thanh-toan')} to="/lich-su-thanh-toan">
                  <span className="nav-link__ico" aria-hidden>
                    <Receipt size={18} strokeWidth={2} />
                  </span>
                  <span className="nav-link__text">Lịch sử thanh toán</span>
                </Link>
                <Link className={lopLk('/ho-so')} to="/ho-so">
                  <span className="nav-link__ico" aria-hidden>
                    <UserCircle size={18} strokeWidth={2} />
                  </span>
                  <span className="nav-link__text">Hồ sơ</span>
                </Link>
                <Link className={lopLk('/thong-bao')} to="/thong-bao">
                  <span className="nav-link__ico" aria-hidden>
                    <Bell size={18} strokeWidth={2} />
                  </span>
                  <span className="nav-link__text">Thông báo</span>
                </Link>
                <Link className={lopLk('/tin-tuc')} to="/tin-tuc">
                  <span className="nav-link__ico" aria-hidden>
                    <Newspaper size={18} strokeWidth={2} />
                  </span>
                  <span className="nav-link__text">Tin tức</span>
                </Link>
                <Link className={lopLk('/danh-gia')} to="/danh-gia">
                  <span className="nav-link__ico" aria-hidden>
                    <Star size={18} strokeWidth={2} />
                  </span>
                  <span className="nav-link__text">Đánh giá</span>
                </Link>
              </>
            ) : null}
            {laQuanTri ? (
              <Link className={lopLk('/quan-tri/tong-quan')} to="/quan-tri/tong-quan">
                <span className="nav-link__ico" aria-hidden>
                  <LayoutDashboard size={18} strokeWidth={2} />
                </span>
                <span className="nav-link__text">Quản trị</span>
              </Link>
            ) : null}
          </nav>

          <div className="header__actions">
            {!laKhach && !laQuanTri ? (
              <>
                <NutLienKet bien="chinh" className="btn--sm header__cta-book" to="/dat-ve" con="Đặt vé" />
                <NutBam bien="mo" className="btn--sm" onClick={() => moDangNhap()} con="Đăng nhập" />
                <NutBam bien="chinh" className="btn--sm" onClick={() => moDangKy()} con="Đăng ký" />
              </>
            ) : laKhach ? (
              <>
                <NutLienKet bien="chinh" className="btn--sm header__cta-book" to="/dat-ve" con="Đặt vé" />
                <div className="user-menu">
                  <span className="user-menu__role">{nguoiDung.vaiTro}</span>
                  <span className="user-menu__name">{nguoiDung.tenDangNhap}</span>
                  <NutBam bien="mo" className="btn--sm" onClick={dangXuat} con="Đăng xuất" />
                </div>
              </>
            ) : nguoiDung ? (
              <div className="user-menu">
                <span className="user-menu__role">{nguoiDung.vaiTro}</span>
                <span className="user-menu__name">{nguoiDung.tenDangNhap}</span>
                <NutBam bien="mo" className="btn--sm" onClick={dangXuat} con="Đăng xuất" />
              </div>
            ) : null}
          </div>
        </div>
      </header>

      <main className="page">
        <div key={viTri.pathname + viTri.search} className="page-transition-shell">
          <Outlet />
        </div>
      </main>

      <footer className="footer">
        <div className="footer__upper">
          <div className="container footer__grid">
            <div className="footer__brand">
              <Link to="/" className="footer__logo">
                <span className="logo__mark footer__logo-mark">
                  <Bus size={22} strokeWidth={2.25} />
                </span>
                <span className="footer__logo-text">RedBus</span>
              </Link>
              <p className="footer__tagline">
                Đặt vé xe khách trực tuyến — chọn ghế theo thời gian thực, thanh toán minh bạch, nhận thông báo
                tức thì.
              </p>
              <p className="footer__badge">
                <span>Kết nối nhà xe &amp; hành khách</span>
              </p>
            </div>

            <nav className="footer__col" aria-label="Liên kết nhanh">
              <h3 className="footer__heading">Khám phá</h3>
              <ul className="footer__links">
                <li>
                  <Link to="/">Trang chủ</Link>
                </li>
                <li>
                  <Link to="/dat-ve">Đặt vé</Link>
                </li>
                <li>
                  <Link to="/tin-tuc">Tin tức &amp; ưu đãi</Link>
                </li>
              </ul>
            </nav>

            <nav className="footer__col" aria-label="Tài khoản khách hàng">
              <h3 className="footer__heading">Khách hàng</h3>
              <ul className="footer__links">
                {nguoiDung?.vaiTro === 'CUSTOMER' ? (
                  <>
                    <li>
                      <Link to="/ve-cua-toi">Vé của tôi</Link>
                    </li>
                    <li>
                      <Link to="/lich-su-thanh-toan">Lịch sử thanh toán</Link>
                    </li>
                    <li>
                      <Link to="/ho-so">Hồ sơ cá nhân</Link>
                    </li>
                    <li>
                      <Link to="/thong-bao">Thông báo</Link>
                    </li>
                    <li>
                      <Link to="/danh-gia">Đánh giá chuyến</Link>
                    </li>
                  </>
                ) : (
                  <>
                    <li>
                      <NutVanBan className="footer__link-btn" onClick={() => moDangNhap()} con="Đăng nhập" />
                    </li>
                    <li>
                      <NutVanBan className="footer__link-btn" onClick={() => moDangKy()} con="Đăng ký tài khoản" />
                    </li>
                  </>
                )}
                {(nguoiDung?.vaiTro === 'ADMIN' || nguoiDung?.vaiTro === 'STAFF') && (
                  <li>
                    <Link to="/quan-tri/tong-quan">Khu vực quản trị</Link>
                  </li>
                )}
              </ul>
            </nav>

            <div className="footer__col footer__col--contact">
              <h3 className="footer__heading">Liên hệ</h3>
              <ul className="footer__contact">
                <li>
                  <Phone size={16} aria-hidden />
                  <span>Hotline: 1900 xxx xxx (giờ hành chính)</span>
                </li>
                <li>
                  <Mail size={16} aria-hidden />
                  <a href="mailto:support@redbus.local">support@redbus.local</a>
                </li>
                <li>
                  <MapPin size={16} aria-hidden />
                  <span>Trụ sở: Việt Nam · Văn phòng đại diện RedBus</span>
                </li>
              </ul>
              <p className="footer__note">
                Phản hồi trong vòng 24–48 giờ làm việc. Khẩn cấp trên xe vui lòng liên hệ nhân viên phục vụ.
              </p>
            </div>
          </div>
        </div>

        <div className="footer__bar">
          <div className="container footer__bar-inner">
            <p className="footer__copy">
              © {new Date().getFullYear()} RedBus — nền tảng đặt vé xe khách trực tuyến. Mọi thông tin chỉ mang tính
              minh họa giao diện và quy trình nghiệp vụ.
            </p>
            <div className="footer__legal">
              <span>Chính sách bảo mật</span>
              <span aria-hidden className="footer__dot">
                ·
              </span>
              <span>Điều khoản sử dụng</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
