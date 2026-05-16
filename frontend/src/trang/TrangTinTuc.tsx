import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Newspaper } from 'lucide-react'
import { khachHttp, moKhoiDuLieu, urlTaiNguyen } from '../nguon/apiClient'
import type { PhanHoi, TinTuc } from '../nguon/kieu'
import { AnhCoFallback } from '../thanhPhan/AnhCoFallback'
import { NenTrangKhach } from '../thanhPhan/NenTrangKhach'
import { anhTinFallback } from '../tienIch/anhTrang'
import { dinhDangNgayGio } from '../tienIch/dinhDang'
import { dungThongBao } from '../dinhDanh/boiCanhThongBao'

const SK_THE = 6

export function TrangTinTuc() {
  const { hienThi } = dungThongBao()
  const [ds, datDs] = useState<TinTuc[]>([])
  const [tai, datTai] = useState(true)
  const [loi, datLoi] = useState(false)

  useEffect(() => {
    void (async () => {
      datTai(true)
      datLoi(false)
      try {
        const x = await moKhoiDuLieu(khachHttp.get<PhanHoi<TinTuc[]>>('/tin-tuc', { params: { gioiHan: 30 } }))
        datDs(x)
      } catch (e: unknown) {
        datLoi(true)
        datDs([])
        hienThi({ loai: 'loi', noiDung: e instanceof Error ? e.message : 'Không tải được tin tức' })
      } finally {
        datTai(false)
      }
    })()
  }, [])

  return (
    <NenTrangKhach
      Icon={Newspaper}
      tieuDe="Tin tức &amp; ưu đãi"
      moTa="Chính sách giá, tuyến mới và mẹo đặt vé — cập nhật từ RedBus."
    >
      <div className="cust-news-grid" aria-busy={tai}>
        {tai && ds.length === 0 && !loi
          ? Array.from({ length: SK_THE }).map((_, i) => (
              <div key={`sk-${i}`} className="cust-news-card cust-news-card--skel" aria-hidden>
                <span className="cust-skel-line cust-skel-line--lg" />
                <span className="cust-skel-line cust-skel-line--md" />
                <span className="cust-skel-line cust-skel-line--md" />
                <span className="cust-skel-line cust-skel-line--xs" />
              </div>
            ))
          : null}
        {!tai &&
          ds.map((t) => (
            <Link key={t.ma} to={`/tin-tuc/${t.ma}`} className="cust-news-card">
              <AnhCoFallback
                src={t.duongAnh ? urlTaiNguyen(t.duongAnh) : undefined}
                fallback={anhTinFallback(t.ma)}
                alt=""
                className="cust-news-card__cover"
              />
              <h2 className="cust-news-card__title">{t.tieuDe}</h2>
              {t.tomTat ? <p className="cust-news-card__sum muted">{t.tomTat}</p> : null}
              <span className="cust-news-card__date muted">{dinhDangNgayGio(t.ngayXuatBan)}</span>
              <span className="cust-news-card__link">
                Đọc tiếp <ArrowRight size={16} strokeWidth={2.25} aria-hidden />
              </span>
            </Link>
          ))}
      </div>

      {!tai && loi ? (
        <div className="cust-empty">
          <span className="cust-empty__ico" aria-hidden>
            <Newspaper size={34} strokeWidth={1.35} />
          </span>
          <p className="cust-empty__title">Không tải được danh sách</p>
          <p className="muted">Kiểm tra kết nối hoặc thử lại sau.</p>
        </div>
      ) : null}

      {!tai && !loi && ds.length === 0 ? (
        <div className="cust-empty">
          <span className="cust-empty__ico" aria-hidden>
            <Newspaper size={34} strokeWidth={1.35} />
          </span>
          <p className="cust-empty__title">Chưa có tin</p>
          <p className="muted">Quay lại sau — RedBus sẽ cập nhật nội dung mới tại đây.</p>
        </div>
      ) : null}
    </NenTrangKhach>
  )
}
