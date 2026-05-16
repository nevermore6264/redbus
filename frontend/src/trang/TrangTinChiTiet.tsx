import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { khachHttp, moKhoiDuLieu, urlTaiNguyen } from '../nguon/apiClient'
import type { PhanHoi, TinTuc } from '../nguon/kieu'
import { AnhCoFallback } from '../thanhPhan/AnhCoFallback'
import { TheChua } from '../thanhPhan/theChua'
import { anhTinFallback } from '../tienIch/anhTrang'
import { dinhDangNgayGio } from '../tienIch/dinhDang'

export function TrangTinChiTiet() {
  const { ma } = useParams<{ ma: string }>()
  const [t, datT] = useState<TinTuc | null>(null)

  useEffect(() => {
    if (!ma) return
    void (async () => {
      const x = await moKhoiDuLieu(khachHttp.get<PhanHoi<TinTuc>>(`/tin-tuc/${ma}`))
      datT(x)
    })()
  }, [ma])

  if (!t) {
    return (
      <div className="container">
        <p className="muted">Đang tải…</p>
      </div>
    )
  }

  return (
    <div className="container narrow">
      <p className="muted small">
        <Link to="/tin-tuc">Tin tức</Link>
      </p>
      <TheChua padding="lg" className="article-card">
        {t.duongAnh || t.ma ? (
          <AnhCoFallback
            src={t.duongAnh ? urlTaiNguyen(t.duongAnh) : undefined}
            fallback={anhTinFallback(t.ma)}
            alt=""
            className="article-card__cover"
          />
        ) : null}
        <p className="muted small">{dinhDangNgayGio(t.ngayXuatBan)}</p>
        <h1 className="page-title" style={{ marginTop: '0.5rem' }}>
          {t.tieuDe}
        </h1>
        {t.tomTat ? <p className="lead">{t.tomTat}</p> : null}
        <div className="article-body" style={{ marginTop: '1.25rem', whiteSpace: 'pre-wrap' }}>
          {t.noiDung}
        </div>
      </TheChua>
    </div>
  )
}
