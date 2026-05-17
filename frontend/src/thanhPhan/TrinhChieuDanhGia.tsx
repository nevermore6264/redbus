import { useCallback, useEffect, useState } from 'react'
import { ChevronLeft, ChevronRight, Star } from 'lucide-react'
import { anhAvatar } from '../tienIch/anhTrang'
import { dinhDangNgayGio } from '../tienIch/dinhDang'

export type DanhGiaHienThi = {
  ma: number
  ten: string
  tuyen: string
  sao: number
  loi: string
  thoiGian?: string
}

type Props = {
  ds: DanhGiaHienThi[]
}

export function TrinhChieuDanhGia({ ds }: Props) {
  const [chiSo, datChiSo] = useState(0)
  const so = ds.length

  const sau = useCallback(() => {
    if (so < 2) return
    datChiSo((i) => (i + 1) % so)
  }, [so])

  const truoc = useCallback(() => {
    if (so < 2) return
    datChiSo((i) => (i - 1 + so) % so)
  }, [so])

  useEffect(() => {
    if (so < 2) return
    const id = window.setInterval(sau, 7000)
    return () => window.clearInterval(id)
  }, [so, sau])

  if (so === 0) return null

  if (so <= 6) {
    return (
      <div className="home-testimonials__grid">
        {ds.slice(0, 6).map((d) => (
          <TheDanhGia key={d.ma} d={d} />
        ))}
      </div>
    )
  }

  const d = ds[chiSo]

  return (
    <div className="review-carousel review-carousel--single" role="region" aria-label="Đánh giá hành khách">
      <div className="review-carousel__track">
        <TheDanhGia key={d.ma} d={d} />
      </div>
      <button type="button" className="review-carousel__nav review-carousel__nav--prev" onClick={truoc} aria-label="Đánh giá trước">
        <ChevronLeft size={20} />
      </button>
      <button type="button" className="review-carousel__nav review-carousel__nav--next" onClick={sau} aria-label="Đánh giá sau">
        <ChevronRight size={20} />
      </button>
      <div className="review-carousel__dots">
        {ds.map((item, i) => (
          <button
            key={item.ma}
            type="button"
            className={`review-carousel__dot${i === chiSo ? ' review-carousel__dot--on' : ''}`}
            aria-label={`Đánh giá ${i + 1}`}
            onClick={() => datChiSo(i)}
          />
        ))}
      </div>
    </div>
  )
}

function TheDanhGia({ d }: { d: DanhGiaHienThi }) {
  return (
    <blockquote className="home-quote review-card">
      <img className="home-quote__avatar" src={anhAvatar(d.ten)} alt="" />
      <div className="home-quote__stars" aria-label={`${d.sao} sao`}>
        {Array.from({ length: 5 }, (_, j) => (
          <Star key={j} size={16} className={j < d.sao ? 'home-quote__star--on' : ''} />
        ))}
      </div>
      <p className="home-quote__text">&ldquo;{d.loi}&rdquo;</p>
      <footer>
        <strong>{d.ten}</strong>
        <span className="muted small">{d.tuyen}</span>
        {d.thoiGian ? <time className="muted small review-card__time">{dinhDangNgayGio(d.thoiGian)}</time> : null}
      </footer>
    </blockquote>
  )
}
