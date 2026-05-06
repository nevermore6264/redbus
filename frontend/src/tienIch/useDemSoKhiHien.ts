import { useEffect, useRef, useState } from 'react'

/** Đếm từ 0 đến `mucTieu` trong ~1.4s khi phần tử vào viewport. */
export function useDemSoKhiHien(mucTieu: number) {
  const [giaTri, datGiaTri] = useState(0)
  const ref = useRef<HTMLDivElement>(null)
  const daChay = useRef(false)

  useEffect(() => {
    daChay.current = false
    datGiaTri(0)
  }, [mucTieu])

  useEffect(() => {
    const el = ref.current
    if (!el || mucTieu <= 0) return

    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting || daChay.current) return
        daChay.current = true
        const batDau = performance.now()
        const ms = 1400
        const tick = (now: number) => {
          const p = Math.min(1, (now - batDau) / ms)
          const eased = 1 - (1 - p) ** 3
          datGiaTri(Math.round(eased * mucTieu))
          if (p < 1) requestAnimationFrame(tick)
        }
        requestAnimationFrame(tick)
        io.disconnect()
      },
      { threshold: 0.15 },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [mucTieu])

  return { ref, giaTri }
}
