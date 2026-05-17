import { useCallback, useEffect, useState } from 'react'
import { ArrowRight, ChevronLeft, ChevronRight, Copy, Percent, Tag } from 'lucide-react'
import type { KhuyenMai } from '../nguon/kieu'

type Props = {
  ds: KhuyenMai[]
  onDatVe: () => void
}

export function TrinhChieuKhuyenMai({ ds, onDatVe }: Props) {
  const so = ds.length
  const [chiSo, datChiSo] = useState(0)
  const [daSao, datDaSao] = useState<string | null>(null)
  const [dangDung, datDangDung] = useState(false)

  const sau = useCallback(() => {
    if (so < 2) return
    datChiSo((i) => (i + 1) % so)
  }, [so])

  const truoc = useCallback(() => {
    if (so < 2) return
    datChiSo((i) => (i - 1 + so) % so)
  }, [so])

  useEffect(() => {
    if (so < 2 || dangDung) return
    const id = window.setInterval(sau, 5500)
    return () => window.clearInterval(id)
  }, [so, sau, dangDung])

  useEffect(() => {
    if (!daSao) return
    const id = window.setTimeout(() => datDaSao(null), 2000)
    return () => window.clearTimeout(id)
  }, [daSao])

  if (so === 0) return null

  const k = ds[chiSo]
  const phanTram = Number(k.phanTramGiam)

  async function saoMa(ma: string) {
    try {
      await navigator.clipboard.writeText(ma)
      datDaSao(ma)
    } catch {
      datDaSao(null)
    }
  }

  return (
    <div
      className="promo-showcase home-reveal"
      role="region"
      aria-label="Mã khuyến mãi"
      onMouseEnter={() => datDangDung(true)}
      onMouseLeave={() => datDangDung(false)}
    >
      <div className="promo-showcase__glow" aria-hidden />
      <div className="promo-showcase__inner">
        {so > 1 ? (
          <button
            type="button"
            className="promo-showcase__nav promo-showcase__nav--prev"
            onClick={truoc}
            aria-label="Mã trước"
          >
            <ChevronLeft size={22} />
          </button>
        ) : null}

        <article key={k.ma} className="promo-voucher" aria-live="polite">
          <div className="promo-voucher__stub">
            <Percent size={22} aria-hidden />
            <span className="promo-voucher__pct">−{phanTram}%</span>
            <span className="promo-voucher__lbl">giảm giá</span>
          </div>
          <div className="promo-voucher__body">
            <span className="promo-voucher__eyebrow">
              <Tag size={14} aria-hidden /> Mã ưu đãi
            </span>
            <p className="promo-voucher__code">{k.maCode}</p>
            {k.tieuDe ? <p className="promo-voucher__title">{k.tieuDe}</p> : null}
            <button
              type="button"
              className="promo-voucher__copy"
              onClick={() => void saoMa(k.maCode)}
            >
              <Copy size={15} aria-hidden />
              {daSao === k.maCode ? 'Đã sao chép' : 'Sao chép mã'}
            </button>
          </div>
        </article>

        {so > 1 ? (
          <button
            type="button"
            className="promo-showcase__nav promo-showcase__nav--next"
            onClick={sau}
            aria-label="Mã sau"
          >
            <ChevronRight size={22} />
          </button>
        ) : null}
      </div>

      {so > 1 ? (
        <div className="promo-showcase__dots">
          {ds.map((item, i) => (
            <button
              key={item.ma}
              type="button"
              className={`promo-showcase__dot${i === chiSo ? ' promo-showcase__dot--on' : ''}`}
              aria-label={`Mã ${i + 1}`}
              aria-current={i === chiSo}
              onClick={() => datChiSo(i)}
            />
          ))}
        </div>
      ) : null}

      <div className="promo-showcase__foot">
        <p className="promo-showcase__hint">Nhập mã khi thanh toán vé đang chờ thanh toán.</p>
        <button type="button" className="btn btn--primary promo-showcase__cta" onClick={onDatVe}>
          Đặt vé ngay
          <ArrowRight size={18} aria-hidden />
        </button>
      </div>
    </div>
  )
}
