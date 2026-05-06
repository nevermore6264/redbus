import { Link } from 'react-router-dom'
import { ArrowLeft, Bus, Home, Search } from 'lucide-react'

export function TrangKhongTimThay() {
  return (
    <div className="not-found">
      <div className="not-found__noise" aria-hidden />
      <div className="not-found__inner container">
        <div className="not-found__visual" aria-hidden>
          <div className="not-found__orb not-found__orb--a" />
          <div className="not-found__orb not-found__orb--b" />
          <div className="not-found__bus">
            <Bus size={56} strokeWidth={1.5} />
          </div>
          <span className="not-found__badge">404</span>
        </div>
        <p className="not-found__eyebrow">
          <Search size={16} aria-hidden /> Không tìm thấy trang
        </p>
        <h1 className="not-found__title">Đường dẫn không tồn tại hoặc đã đổi</h1>
        <p className="not-found__lead">
          Kiểm tra lại URL hoặc quay về trang chủ để đặt vé, tra cứu tin tức và thông báo.
        </p>
        <div className="not-found__actions">
          <Link className="btn btn--primary btn--lg" to="/">
            <Home size={18} aria-hidden />
            Về trang chủ
          </Link>
          <Link className="btn btn--outline btn--lg" to="/dat-ve">
            Đặt vé ngay
          </Link>
          <button type="button" className="btn btn--ghost btn--lg" onClick={() => window.history.back()}>
            <ArrowLeft size={18} aria-hidden />
            Quay lại
          </button>
        </div>
      </div>
    </div>
  )
}
