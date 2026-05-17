import { useCallback, useEffect, useRef, useState, type CSSProperties } from 'react'
import { ChevronLeft, ChevronRight, Quote, Star } from 'lucide-react'
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

function soTheMoiTrang() {
  const w = window.innerWidth
  if (w < 640) return 1
  if (w < 1024) return 2
  return 3
}

export function TrinhChieuDanhGia({ ds }: Props) {
  const so = ds.length
  const [chiSo, datChiSo] = useState(0)
  const [moiTrang, datMoiTrang] = useState(soTheMoiTrang)
  const [buocPx, datBuocPx] = useState(0)
  const [dangDung, datDangDung] = useState(false)
  const khungRef = useRef<HTMLDivElement>(null)

  const chiSoToiDa = Math.max(0, so - moiTrang)

  useEffect(() => {
    const capNhat = () => datMoiTrang(soTheMoiTrang())
    capNhat()
    window.addEventListener('resize', capNhat)
    return () => window.removeEventListener('resize', capNhat)
  }, [])

  useEffect(() => {
    if (chiSo > chiSoToiDa) datChiSo(chiSoToiDa)
  }, [chiSo, chiSoToiDa])

  useEffect(() => {
    datChiSo(0)
  }, [so, moiTrang])

  useEffect(() => {
    const el = khungRef.current
    if (!el || so === 0) return

    const doLuong = () => {
      const gap = parseFloat(getComputedStyle(el).gap) || 20
      const rong = el.clientWidth
      const rongThe = (rong - gap * (moiTrang - 1)) / moiTrang
      datBuocPx(rongThe + gap)
    }

    doLuong()
    const ro = new ResizeObserver(doLuong)
    ro.observe(el)
    return () => ro.disconnect()
  }, [moiTrang, so])

  const sau = useCallback(() => {
    if (so <= moiTrang) return
    datChiSo((i) => (i >= chiSoToiDa ? 0 : i + 1))
  }, [so, moiTrang, chiSoToiDa])

  const truoc = useCallback(() => {
    if (so <= moiTrang) return
    datChiSo((i) => (i <= 0 ? chiSoToiDa : i - 1))
  }, [so, moiTrang, chiSoToiDa])

  useEffect(() => {
    if (so <= moiTrang || dangDung) return
    const id = window.setInterval(sau, 6000)
    return () => window.clearInterval(id)
  }, [so, moiTrang, sau, dangDung])

  if (so === 0) return null

  const hienDieuHuong = so > moiTrang
  const bienTrang = { '--slides-per-page': String(moiTrang) } as CSSProperties

  return (
    <div
      className="review-slideshow"
      role="region"
      aria-label="Đánh giá hành khách"
      aria-roledescription="carousel"
      onMouseEnter={() => datDangDung(true)}
      onMouseLeave={() => datDangDung(false)}
      onFocus={() => datDangDung(true)}
      onBlur={() => datDangDung(false)}
    >
      {hienDieuHuong ? (
        <button
          type="button"
          className="review-slideshow__nav review-slideshow__nav--prev"
          onClick={truoc}
          aria-label="Đánh giá trước"
        >
          <ChevronLeft size={22} strokeWidth={2.25} />
        </button>
      ) : null}

      <div className="review-slideshow__viewport" style={bienTrang}>
        <div
          ref={khungRef}
          className="review-slideshow__track"
          style={{
            transform: buocPx > 0 ? `translate3d(-${chiSo * buocPx}px, 0, 0)` : undefined,
          }}
        >
          {ds.map((d) => (
            <TheDanhGia key={d.ma} d={d} />
          ))}
        </div>
      </div>

      {hienDieuHuong ? (
        <button
          type="button"
          className="review-slideshow__nav review-slideshow__nav--next"
          onClick={sau}
          aria-label="Đánh giá sau"
        >
          <ChevronRight size={22} strokeWidth={2.25} />
        </button>
      ) : null}

      {hienDieuHuong ? (
        <div className="review-slideshow__dots" role="tablist" aria-label="Chọn đánh giá">
          {Array.from({ length: chiSoToiDa + 1 }, (_, i) => (
            <button
              key={i}
              type="button"
              role="tab"
              aria-selected={i === chiSo}
              className={`review-slideshow__dot${i === chiSo ? ' review-slideshow__dot--on' : ''}`}
              aria-label={`Nhóm đánh giá ${i + 1}`}
              onClick={() => datChiSo(i)}
            />
          ))}
        </div>
      ) : null}
    </div>
  )
}

function TheDanhGia({ d }: { d: DanhGiaHienThi }) {
  return (
    <blockquote className="review-slide-card">
      <Quote className="review-slide-card__mark" size={28} aria-hidden />
      <p className="review-slide-card__text">&ldquo;{d.loi}&rdquo;</p>
      <footer className="review-slide-card__foot">
        <img className="review-slide-card__avatar" src={anhAvatar(d.ten)} alt="" />
        <div className="review-slide-card__meta">
          <div className="review-slide-card__who">
            <strong>{d.ten}</strong>
            <span className="review-slide-card__route">{d.tuyen}</span>
          </div>
          <div className="review-slide-card__stars" aria-label={`${d.sao} sao`}>
            {Array.from({ length: 5 }, (_, j) => (
              <Star key={j} size={15} className={j < d.sao ? 'review-slide-card__star--on' : ''} />
            ))}
          </div>
        </div>
        {d.thoiGian ? (
          <time className="review-slide-card__time">{dinhDangNgayGio(d.thoiGian)}</time>
        ) : null}
      </footer>
    </blockquote>
  )
}
