import { useCallback, useEffect, useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { AnhCoFallback } from './AnhCoFallback'

export type SlideAnh = {
  src: string
  alt: string
  chu?: string
}

type Props = {
  dsSlide: readonly SlideAnh[]
  className?: string
  tuDongMs?: number

  variant?: 'hero' | 'compact'
}

export function TrinhChieuAnh({ dsSlide, className = '', tuDongMs = 5000, variant = 'hero' }: Props) {
  const [chiSo, datChiSo] = useState(0)
  const so = dsSlide.length

  const sau = useCallback(() => {
    if (so < 2) return
    datChiSo((i) => (i + 1) % so)
  }, [so])

  const truoc = useCallback(() => {
    if (so < 2) return
    datChiSo((i) => (i - 1 + so) % so)
  }, [so])

  useEffect(() => {
    if (so < 2 || tuDongMs <= 0) return
    const id = window.setInterval(sau, tuDongMs)
    return () => window.clearInterval(id)
  }, [so, tuDongMs, sau])

  if (so === 0) return null

  const slide = dsSlide[chiSo]

  return (
    <div
      className={`slideshow slideshow--${variant} ${className}`.trim()}
      role="region"
      aria-roledescription="carousel"
      aria-label="Trình chiếu ảnh"
    >
      <div className="slideshow__track">
        {dsSlide.map((s, i) => (
          <div
            key={s.src}
            className={`slideshow__slide${i === chiSo ? ' slideshow__slide--on' : ''}`}
            aria-hidden={i !== chiSo}
          >
            <AnhCoFallback
              src={s.src}
              fallback={s.src}
              alt={s.alt}
              className="slideshow__img-wrap"
              loading={i === 0 ? 'eager' : 'lazy'}
            />
          </div>
        ))}
      </div>

      {slide.chu ? <p className="slideshow__caption">{slide.chu}</p> : null}

      {so > 1 ? (
        <>
          <button type="button" className="slideshow__nav slideshow__nav--prev" onClick={truoc} aria-label="Ảnh trước">
            <ChevronLeft size={22} />
          </button>
          <button type="button" className="slideshow__nav slideshow__nav--next" onClick={sau} aria-label="Ảnh sau">
            <ChevronRight size={22} />
          </button>
          <div className="slideshow__dots" role="tablist" aria-label="Chọn ảnh">
            {dsSlide.map((s, i) => (
              <button
                key={s.src}
                type="button"
                role="tab"
                aria-selected={i === chiSo}
                aria-label={`Ảnh ${i + 1}: ${s.alt}`}
                className={`slideshow__dot${i === chiSo ? ' slideshow__dot--on' : ''}`}
                onClick={() => datChiSo(i)}
              />
            ))}
          </div>
        </>
      ) : null}
    </div>
  )
}
