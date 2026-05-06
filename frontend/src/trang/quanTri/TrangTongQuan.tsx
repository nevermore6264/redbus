import { Link } from 'react-router-dom'
import { useCallback, useEffect, useState } from 'react'
import {
  BarChart3,
  Bus,
  BusFront,
  CalendarClock,
  ChevronRight,
  Clock,
  CreditCard,
  Layers,
  LayoutDashboard,
  MapPin,
  Newspaper,
  Sparkles,
  Star,
  Tag,
  Ticket,
  TrendingUp,
  Users,
} from 'lucide-react'
import { khachHttp, moKhoiDuLieu } from '../../nguon/apiClient'
import type { PhanHoi, BaoCaoMoRong } from '../../nguon/kieu'
import { dungThongBao } from '../../dinhDanh/boiCanhThongBao'
import { TheChua } from '../../thanhPhan/theChua'
import { NutBam } from '../../thanhPhan/nutBam'
import { dinhDangVnd } from '../../tienIch/dinhDang'

function dinhDangLuc(d: Date) {
  return d.toLocaleString('vi-VN', {
    weekday: 'long',
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

const LIEN_KET_NHANH: {
  to: string
  title: string
  hint: string
  icon: typeof MapPin
}[] = [
  { to: '/quan-tri/tuyen-duong', title: 'Tuyến đường', hint: 'Điểm đầu — điểm cuối, quãng đường', icon: MapPin },
  { to: '/quan-tri/chuyen-xe', title: 'Chuyến xe', hint: 'Lịch chạy, giá vé, trạng thái', icon: Bus },
  { to: '/quan-tri/xe-khach', title: 'Xe khách', hint: 'Biển số, loại xe, sơ đồ ghế', icon: BusFront },
  { to: '/quan-tri/ghe-ngoi', title: 'Ghế ngồi', hint: 'Trạng thái ghế theo xe', icon: Ticket },
  { to: '/quan-tri/khach-hang', title: 'Khách hàng', hint: 'Tài khoản & hồ sơ', icon: Users },
  { to: '/quan-tri/khuyen-mai', title: 'Khuyến mãi', hint: 'Mã giảm giá, thời hạn', icon: Tag },
  { to: '/quan-tri/tin-tuc', title: 'Tin tức', hint: 'Bài đăng & trạng thái', icon: Newspaper },
  { to: '/quan-tri/bao-cao', title: 'Báo cáo', hint: 'Biểu đồ & chỉ số chi tiết', icon: BarChart3 },
]

export function TrangTongQuan() {
  const { hienThi } = dungThongBao()
  const [b, datB] = useState<BaoCaoMoRong | null>(null)
  const [tai, datTai] = useState(true)
  const [capNhatLuc, datCapNhatLuc] = useState<Date | null>(null)

  const taiLai = useCallback(async () => {
    datTai(true)
    try {
      const x = await moKhoiDuLieu(khachHttp.get<PhanHoi<BaoCaoMoRong>>('/bao-cao/mo-rong'))
      datB(x)
      datCapNhatLuc(new Date())
    } catch (e: unknown) {
      hienThi({ loai: 'loi', noiDung: e instanceof Error ? e.message : 'Không tải được số liệu tổng quan' })
    } finally {
      datTai(false)
    }
  }, [hienThi])

  useEffect(() => {
    void taiLai()
  }, [taiLai])

  const diemTb = Number(b?.diemTrungBinhDanhGia ?? 0)
  const daTt = b?.soVeDaThanhToan ?? 0
  const cho = b?.soVeChoXuLy ?? 0
  const tongVe = daTt + cho
  const canhBaoCho = tongVe > 0 && cho / tongVe >= 0.35

  return (
    <div className="admin-page admin-page--overview">
      <section className="overview-hero" aria-labelledby="overview-title">
        <div className="overview-hero__bg" aria-hidden />
        <div className="overview-hero__inner">
          <div className="overview-hero__intro">
            <p className="overview-hero__kicker">
              <LayoutDashboard size={17} strokeWidth={2.25} aria-hidden />
              Khu vực điều hành
            </p>
            <h1 id="overview-title" className="overview-hero__title">
              Tổng quan hệ thống
            </h1>
            <p className="overview-hero__lead">
              Theo dõi doanh thu, vé và chuyến trong một màn hình — rồi chuyển nhanh tới module quản trị.
            </p>
            <div className="overview-hero__toolbar">
              <NutBam bien="chinh" className="overview-hero__btn" onClick={() => void taiLai()} dangTai={tai} con="Cập nhật số liệu" />
              {capNhatLuc ? (
                <span className="overview-hero__meta">
                  <Clock size={14} aria-hidden /> {dinhDangLuc(capNhatLuc)}
                </span>
              ) : null}
            </div>
          </div>
          <div className="overview-hero__spotlight">
            <div className="overview-spotlight">
              <span className="overview-spotlight__lab">
                <TrendingUp size={15} aria-hidden /> Doanh thu tích lũy
              </span>
              <span className="overview-spotlight__val">{b ? dinhDangVnd(b.tongDoanhThu) : tai ? '…' : '—'}</span>
              <span className="overview-spotlight__hint">Theo giao dịch thanh toán thành công</span>
            </div>
          </div>
        </div>
      </section>

      {canhBaoCho && b ? (
        <div className="overview-alert" role="status">
          <CalendarClock size={18} aria-hidden />
          <span>
            <strong>Lưu ý:</strong> Có tỷ lệ vé chờ thanh toán đáng kể ({cho}/{tongVe}). Kiểm tra « Chuyến xe » và nhắc khách hoàn tất thanh toán.
          </span>
        </div>
      ) : null}

      <div className={`stat-grid overview-kpi ${tai && !b ? 'overview-kpi--loading' : ''}`}>
        {tai && !b
          ? Array.from({ length: 6 }).map((_, i) => (
              <TheChua key={`sk-${i}`} padding="lg" className="stat-card admin-stat-card overview-kpi-skel">
                <span className="overview-kpi-skel__ico" />
                <p className="stat-card__label">&nbsp;</p>
                <p className="stat-card__value">
                  <span className="overview-kpi-skel__line" />
                </p>
              </TheChua>
            ))
          : null}

        {b ? (
          <>
            <TheChua padding="lg" className="stat-card admin-stat-card">
              <div className="stat-card__icon stat-card__icon--blue">
                <CreditCard size={22} aria-hidden />
              </div>
              <p className="stat-card__label">Giao dịch thanh toán</p>
              <p className="stat-card__value">{b.soGiaoDichThanhToan}</p>
              <p className="overview-kpi-hint">Số lần ghi nhận thanh toán</p>
            </TheChua>
            <TheChua padding="lg" className="stat-card admin-stat-card">
              <div className="stat-card__icon stat-card__icon--green">
                <Ticket size={22} aria-hidden />
              </div>
              <p className="stat-card__label">Vé đã thanh toán</p>
              <p className="stat-card__value">{b.soVeDaThanhToan}</p>
              <p className="overview-kpi-hint">Vé trạng thái đã thu tiền</p>
            </TheChua>
            <TheChua padding="lg" className="stat-card admin-stat-card">
              <div className="stat-card__icon stat-card__icon--amber">
                <CalendarClock size={22} aria-hidden />
              </div>
              <p className="stat-card__label">Vé chờ xử lý</p>
              <p className="stat-card__value">{b.soVeChoXuLy}</p>
              <p className="overview-kpi-hint">Chưa hoàn tất thanh toán</p>
            </TheChua>
            <TheChua padding="lg" className="stat-card admin-stat-card">
              <div className="stat-card__icon stat-card__icon--rose">
                <Bus size={22} aria-hidden />
              </div>
              <p className="stat-card__label">Chuyến đã lên lịch</p>
              <p className="stat-card__value">{b.soChuyenLichDinh}</p>
              <p className="overview-kpi-hint">Trạng thái SCHEDULED</p>
            </TheChua>
            <TheChua padding="lg" className="stat-card admin-stat-card overview-kpi--wide">
              <div className="stat-card__icon stat-card__icon--rose">
                <Star size={22} aria-hidden />
              </div>
              <p className="stat-card__label">Đánh giá khách hàng</p>
              <p className="stat-card__value">{b.soDanhGia ?? 0} lượt</p>
              <div className="overview-rating-row">
                <span className="overview-rating-row__score">{diemTb.toFixed(1)}</span>
                <span className="overview-rating-row__max">/ 5</span>
                <span className="overview-rating-row__stars" aria-hidden>
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star
                      key={s}
                      size={15}
                      className={s <= Math.round(diemTb) ? 'overview-star--on' : 'overview-star--off'}
                      fill={s <= Math.round(diemTb) ? 'currentColor' : 'none'}
                    />
                  ))}
                </span>
              </div>
            </TheChua>
            <TheChua padding="lg" className="stat-card admin-stat-card overview-kpi--wide overview-kpi--bento">
              <div className="overview-bento-head">
                <div className="stat-card__icon stat-card__icon--blue">
                  <Layers size={22} aria-hidden />
                </div>
                <div>
                  <p className="stat-card__label" style={{ margin: 0 }}>
                    Nội dung &amp; danh mục
                  </p>
                  <p className="overview-kpi-hint" style={{ margin: '0.15rem 0 0' }}>
                    Khuyến mãi, tin, điểm dừng, loại xe
                  </p>
                </div>
              </div>
              <div className="overview-bento-grid">
                <div className="overview-bento-cell">
                  <Tag size={16} aria-hidden />
                  <span className="overview-bento-cell__val">{b.soKhuyenMaiDangHieuLuc ?? 0}</span>
                  <span className="overview-bento-cell__lab">KM hiệu lực</span>
                </div>
                <div className="overview-bento-cell">
                  <Newspaper size={16} aria-hidden />
                  <span className="overview-bento-cell__val">{b.soTinTucHoatDong ?? 0}</span>
                  <span className="overview-bento-cell__lab">Tin hiển thị</span>
                </div>
                <div className="overview-bento-cell">
                  <MapPin size={16} aria-hidden />
                  <span className="overview-bento-cell__val">{b.soDiemDungChan ?? 0}</span>
                  <span className="overview-bento-cell__lab">Điểm dừng</span>
                </div>
                <div className="overview-bento-cell">
                  <Bus size={16} aria-hidden />
                  <span className="overview-bento-cell__val">{b.soLoaiXe ?? 0}</span>
                  <span className="overview-bento-cell__lab">Loại xe</span>
                </div>
              </div>
            </TheChua>
          </>
        ) : !tai && !b ? (
          <div className="overview-kpi-error">
            <TheChua padding="lg">
              <p className="muted" style={{ margin: 0 }}>
                Không tải được số liệu. Thử nhấn « Cập nhật số liệu » hoặc kiểm tra API.
              </p>
            </TheChua>
          </div>
        ) : null}
      </div>

      <section className="overview-quick" aria-labelledby="overview-quick-title">
        <div className="overview-quick__head">
          <h2 id="overview-quick-title" className="overview-quick__title">
            <Sparkles size={20} strokeWidth={2} aria-hidden />
            Truy cập nhanh
          </h2>
          <p className="overview-quick__sub">Chọn module để chỉnh sửa dữ liệu vận hành.</p>
        </div>
        <div className="overview-quick-grid">
          {LIEN_KET_NHANH.map((item) => (
            <Link key={item.to} to={item.to} className="overview-quick-card">
              <span className="overview-quick-card__ico">
                <item.icon size={22} strokeWidth={2} aria-hidden />
              </span>
              <span className="overview-quick-card__body">
                <span className="overview-quick-card__title">{item.title}</span>
                <span className="overview-quick-card__hint">{item.hint}</span>
              </span>
              <ChevronRight className="overview-quick-card__chev" size={18} aria-hidden />
            </Link>
          ))}
        </div>
      </section>
    </div>
  )
}
