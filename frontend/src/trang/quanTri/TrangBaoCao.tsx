import { useCallback, useEffect, useState } from 'react'
import {
  Banknote,
  Bus,
  Clock,
  CreditCard,
  Layers,
  MapPinned,
  Newspaper,
  RefreshCw,
  Star,
  Tag,
  Ticket,
  TrendingUp,
} from 'lucide-react'
import { gocUrlApi, khachHttp, moKhoiDuLieu } from '../../nguon/apiClient'
import type { PhanHoi, BaoCaoBieuDoPhanHoi, BaoCaoMoRong } from '../../nguon/kieu'
import { BieuDoBaoCao } from '../../thanhPhan/quanTri/BieuDoBaoCao'
import { dungThongBao } from '../../dinhDanh/boiCanhThongBao'
import { TheChua } from '../../thanhPhan/theChua'
import { NutBam } from '../../thanhPhan/nutBam'
import { dinhDangVnd } from '../../tienIch/dinhDang'

function dinhDangLuc(d: Date) {
  return d.toLocaleString('vi-VN', {
    weekday: 'short',
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export function TrangBaoCao() {
  const { hienThi } = dungThongBao()
  const [b, datB] = useState<BaoCaoMoRong | null>(null)
  const [bieuDo, datBieuDo] = useState<BaoCaoBieuDoPhanHoi | null>(null)
  const [tai, datTai] = useState(true)
  const [capNhatLuc, datCapNhatLuc] = useState<Date | null>(null)

  async function xuatCsv() {
    const token = localStorage.getItem('token')
    try {
      const res = await fetch(`${gocUrlApi}/bao-cao/xuat-csv`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      })
      if (!res.ok) throw new Error('Xuất file thất bại')
      const blob = await res.blob()
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = 'bao-cao-redbus.csv'
      a.click()
      URL.revokeObjectURL(url)
      hienThi({ loai: 'thanhCong', noiDung: 'Đã tải báo cáo CSV' })
    } catch (e: unknown) {
      hienThi({ loai: 'loi', noiDung: e instanceof Error ? e.message : 'Xuất CSV thất bại' })
    }
  }

  const taiLai = useCallback(async () => {
    datTai(true)
    try {
      const [x, bd] = await Promise.all([
        moKhoiDuLieu(khachHttp.get<PhanHoi<BaoCaoMoRong>>('/bao-cao/mo-rong')),
        moKhoiDuLieu(khachHttp.get<PhanHoi<BaoCaoBieuDoPhanHoi>>('/bao-cao/bieu-do')),
      ])
      datB(x)
      datBieuDo(bd)
      datCapNhatLuc(new Date())
    } catch (e: unknown) {
      hienThi({ loai: 'loi', noiDung: e instanceof Error ? e.message : 'Lỗi tải báo cáo' })
    } finally {
      datTai(false)
    }
  }, [hienThi])

  useEffect(() => {
    void taiLai()
  }, [taiLai])

  const daTt = b?.soVeDaThanhToan ?? 0
  const cho = b?.soVeChoXuLy ?? 0
  const tongVe = daTt + cho
  const pctDaTt = tongVe > 0 ? Math.round((100 * daTt) / tongVe) : 0
  const pctCho = tongVe > 0 ? 100 - pctDaTt : 0
  const diemTb = Number(b?.diemTrungBinhDanhGia ?? 0)

  return (
    <div className="admin-page admin-page--report">
      <div className="report-dash-hero">
        <div className="report-dash-hero__copy">
          <p className="report-dash-hero__kicker">
            <TrendingUp size={16} strokeWidth={2.25} aria-hidden />
            Báo cáo vận hành
          </p>
          <h1 className="report-dash-hero__title">Tổng quan doanh thu &amp; hiệu suất</h1>
          <p className="report-dash-hero__lead">
            Hợp nhất giao dịch, vé, chuyến và chất lượng phục vụ — dùng cho đối chiếu nhanh trong ngày.
          </p>
          <div className="report-dash-hero__toolbar">
            <NutBam bien="vien" className="report-dash-refresh" onClick={() => void taiLai()} dangTai={tai} con="Làm mới số liệu" />
            <NutBam
              bien="chinh"
              className="btn--sm"
              onClick={() => void xuatCsv()}
              con="Xuất CSV"
            />
            {capNhatLuc ? (
              <span className="report-dash-hero__meta">
                <RefreshCw size={14} aria-hidden /> Cập nhật: {dinhDangLuc(capNhatLuc)}
              </span>
            ) : null}
          </div>
        </div>
        <div className="report-dash-hero__stat" aria-live="polite">
          <span className="report-dash-hero__stat-label">Tổng doanh thu (ước tính)</span>
          <span className="report-dash-hero__stat-value">{b ? dinhDangVnd(b.tongDoanhThu) : tai ? '…' : '—'}</span>
          <span className="report-dash-hero__stat-hint">Theo các giao dịch thanh toán thành công trong hệ thống</span>
        </div>
      </div>

      <div className="stat-grid report-stat-grid">
        {tai && !b
          ? Array.from({ length: 8 }).map((_, i) => (
              <TheChua key={`sk-${i}`} padding="lg" className="stat-card admin-stat-card report-kpi-skel">
                <span className="report-kpi-skel__ico" />
                <p className="stat-card__label">&nbsp;</p>
                <p className="stat-card__value">
                  <span className="report-kpi-skel__line" />
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
              <p className="stat-card__value">{b?.soGiaoDichThanhToan ?? '—'}</p>
              <p className="report-kpi-foot">Số lần thanh toán ghi nhận</p>
            </TheChua>
            <TheChua padding="lg" className="stat-card admin-stat-card">
              <div className="stat-card__icon stat-card__icon--green">
                <Ticket size={22} aria-hidden />
              </div>
              <p className="stat-card__label">Vé đã thanh toán</p>
              <p className="stat-card__value">{b?.soVeDaThanhToan ?? '—'}</p>
              <p className="report-kpi-foot">Trạng thái đã thu tiền</p>
            </TheChua>
            <TheChua padding="lg" className="stat-card admin-stat-card">
              <div className="stat-card__icon stat-card__icon--amber">
                <Clock size={22} aria-hidden />
              </div>
              <p className="stat-card__label">Vé chờ xử lý</p>
              <p className="stat-card__value">{b?.soVeChoXuLy ?? '—'}</p>
              <p className="report-kpi-foot">Đang chờ thanh toán</p>
            </TheChua>
            <TheChua padding="lg" className="stat-card admin-stat-card">
              <div className="stat-card__icon stat-card__icon--rose">
                <Bus size={22} aria-hidden />
              </div>
              <p className="stat-card__label">Chuyến đã lên lịch</p>
              <p className="stat-card__value">{b?.soChuyenLichDinh ?? '—'}</p>
              <p className="report-kpi-foot">Trạng thái SCHEDULED</p>
            </TheChua>
            <TheChua padding="lg" className="stat-card admin-stat-card">
              <div className="stat-card__icon stat-card__icon--rose">
                <Star size={22} aria-hidden />
              </div>
              <p className="stat-card__label">Đánh giá · điểm TB</p>
              <p className="stat-card__value">
                {b != null ? `${b.soDanhGia ?? 0} lượt` : '—'}
              </p>
              <div className="report-rating-badge" aria-label={`Điểm trung bình ${diemTb.toFixed(1)} trên 5`}>
                <span className="report-rating-badge__score">{diemTb.toFixed(1)}</span>
                <span className="report-rating-badge__max">/ 5</span>
                <span className="report-rating-badge__stars" aria-hidden>
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star
                      key={s}
                      size={14}
                      className={s <= Math.round(diemTb) ? 'report-star--on' : 'report-star--off'}
                      fill={s <= Math.round(diemTb) ? 'currentColor' : 'none'}
                    />
                  ))}
                </span>
              </div>
            </TheChua>
            <TheChua padding="lg" className="stat-card admin-stat-card">
              <div className="stat-card__icon stat-card__icon--blue">
                <Newspaper size={22} aria-hidden />
              </div>
              <p className="stat-card__label">Tin đang hiển thị</p>
              <p className="stat-card__value">{b?.soTinTucHoatDong ?? '—'}</p>
              <p className="report-kpi-foot">Bài đăng hoạt động</p>
            </TheChua>
            <TheChua padding="lg" className="stat-card admin-stat-card">
              <div className="stat-card__icon stat-card__icon--amber">
                <Tag size={22} aria-hidden />
              </div>
              <p className="stat-card__label">Khuyến mãi hiệu lực</p>
              <p className="stat-card__value">{b?.soKhuyenMaiDangHieuLuc ?? '—'}</p>
              <p className="report-kpi-foot">Trong khung thời gian áp dụng</p>
            </TheChua>
            <TheChua padding="lg" className="stat-card admin-stat-card">
              <div className="stat-card__icon stat-card__icon--green">
                <MapPinned size={22} aria-hidden />
              </div>
              <p className="stat-card__label">Điểm dừng · Loại xe</p>
              <p className="stat-card__value stat-card__value--sm">
                {b != null ? `${b.soDiemDungChan ?? 0} điểm · ${b.soLoaiXe ?? 0} loại` : '—'}
              </p>
              <p className="report-kpi-foot">
                <Layers size={14} style={{ verticalAlign: '-0.15em' }} aria-hidden /> Danh mục vận hành
              </p>
            </TheChua>
          </>
        ) : !tai ? (
          <p className="muted" style={{ gridColumn: '1 / -1' }}>
            Không tải được báo cáo.
          </p>
        ) : null}
      </div>

      <div className="report-panels">
        <TheChua padding="lg" className="report-panel-card">
          <h2 className="report-panel-card__title">Phân bổ trạng thái vé</h2>
          <p className="report-panel-card__sub">
            Tỷ lệ vé đã thanh toán so với vé đang chờ — giúp ước lượng tải thanh toán.
          </p>
          {b && tongVe > 0 ? (
            <>
              <div className="report-stack-bar" role="img" aria-label={`Đã thanh toán ${pctDaTt} phần trăm, chờ ${pctCho} phần trăm`}>
                <div className="report-stack-bar__seg report-stack-bar__seg--paid" style={{ width: `${pctDaTt}%` }} />
                <div className="report-stack-bar__seg report-stack-bar__seg--pend" style={{ width: `${pctCho}%` }} />
              </div>
              <ul className="report-legend">
                <li>
                  <span className="report-legend__sw report-legend__sw--paid" /> Đã thanh toán · {daTt} ({pctDaTt}%)
                </li>
                <li>
                  <span className="report-legend__sw report-legend__sw--pend" /> Chờ xử lý · {cho} ({pctCho}%)
                </li>
              </ul>
            </>
          ) : (
            <p className="muted report-panel-empty">{b ? 'Chưa có vé nào trong hệ thống.' : tai ? 'Đang tải…' : '—'}</p>
          )}
        </TheChua>

        <TheChua padding="lg" className="report-panel-card">
          <h2 className="report-panel-card__title">Luồng tiền &amp; giao dịch</h2>
          <p className="report-panel-card__sub">Đối chiếu nhanh giữa doanh thu và số lần thanh toán.</p>
          <div className="report-split-pills">
            <div className="report-pill report-pill--money">
              <Banknote size={20} aria-hidden />
              <div>
                <span className="report-pill__lab">Doanh thu</span>
                <span className="report-pill__val">{b ? dinhDangVnd(b.tongDoanhThu) : '—'}</span>
              </div>
            </div>
            <div className="report-pill report-pill--tx">
              <CreditCard size={20} aria-hidden />
              <div>
                <span className="report-pill__lab">Số giao dịch</span>
                <span className="report-pill__val">{b?.soGiaoDichThanhToan ?? '—'}</span>
              </div>
            </div>
          </div>
          <p className="report-panel-note muted">
            Doanh thu là tổng số tiền các giao dịch có trạng thái thành công (theo dữ liệu vé đã thanh toán).
          </p>
        </TheChua>
      </div>

      <BieuDoBaoCao duLieu={bieuDo} dangTai={tai} />
    </div>
  )
}
