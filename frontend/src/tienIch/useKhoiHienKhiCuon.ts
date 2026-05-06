import { useEffect, useRef, type RefObject } from 'react'

/** Gắn ref vào container; các phần tử con có class `home-reveal` sẽ nhận `home-reveal--visible` khi vào viewport. */
export function useKhoiHienKhiCuon(deps: unknown[] = []) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const root = ref.current
    if (!root) return
    const nodes = root.querySelectorAll('.home-reveal')
    if (nodes.length === 0) return

    const io = new IntersectionObserver(
      (entries) => {
        for (const en of entries) {
          if (en.isIntersecting) {
            en.target.classList.add('home-reveal--visible')
            io.unobserve(en.target)
          }
        }
      },
      { threshold: 0.08, rootMargin: '0px 0px -6% 0px' },
    )

    nodes.forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, deps)

  return ref as RefObject<HTMLDivElement | null>
}
