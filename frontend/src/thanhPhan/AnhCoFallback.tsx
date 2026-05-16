import { useState } from 'react'

type Props = {
  src?: string | null
  fallback: string
  alt: string
  className?: string
  loading?: 'lazy' | 'eager'
  /** Bật skeleton khi đang tải */
  hienSkeleton?: boolean
}

export function AnhCoFallback({
  src,
  fallback,
  alt,
  className = '',
  loading = 'lazy',
  hienSkeleton = true,
}: Props) {
  const [loi, datLoi] = useState(false)
  const [daTai, datDaTai] = useState(false)
  const url = src && !loi ? src : fallback
  const dangTai = hienSkeleton && !daTai && !loi

  return (
    <div className={`anh-wrap ${dangTai ? 'anh-wrap--loading' : ''} ${className}`.trim()}>
      {dangTai ? <span className="anh-wrap__skel" aria-hidden /> : null}
      <img
        src={url}
        alt={alt}
        className="anh-wrap__img"
        loading={loading}
        decoding="async"
        onLoad={() => datDaTai(true)}
        onError={() => {
          datLoi(true)
          datDaTai(true)
        }}
      />
    </div>
  )
}
