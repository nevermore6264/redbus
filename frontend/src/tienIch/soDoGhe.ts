import type { GheNgoi } from '../nguon/kieu'

export type HangGhe = (GheNgoi | null)[][]


function soThuTu(g: GheNgoi): number {
  const n = Number(g.maGhe)
  return Number.isFinite(n) ? n : 0
}


export function tinSoCotTrai(maxCot: number): number {
  if (maxCot <= 1) return 1
  return Math.floor(maxCot / 2)
}

export function xayDungLuoiGhe(ds: GheNgoi[]): {
  maxHang: number
  maxCot: number
  cotTrai: number
  hangGhe: HangGhe
} {
  if (!ds.length) {
    return { maxHang: 0, maxCot: 0, cotTrai: 0, hangGhe: [] }
  }

  const duHangCot = ds.every((s) => s.hang != null && s.cot != null)

  if (!duHangCot) {
    const sx = [...ds].sort((a, b) => soThuTu(a) - soThuTu(b))
    const uoc = Math.max(3, Math.ceil(Math.sqrt(sx.length)))
    const hangGhe: HangGhe = []
    let i = 0
    while (i < sx.length) {
      const hang: (GheNgoi | null)[] = []
      for (let c = 0; c < uoc && i < sx.length; c++) hang.push(sx[i++])
      while (hang.length < uoc) hang.push(null)
      hangGhe.push(hang)
    }
    const maxCot = uoc
    return {
      maxHang: hangGhe.length,
      maxCot,
      cotTrai: tinSoCotTrai(maxCot),
      hangGhe,
    }
  }

  const maxHang = Math.max(...ds.map((s) => s.hang!))
  const maxCot = Math.max(...ds.map((s) => s.cot!))
  const cotTrai = tinSoCotTrai(maxCot)

  const hangGhe: HangGhe = []
  for (let h = 1; h <= maxHang; h++) {
    const hang: (GheNgoi | null)[] = []
    for (let c = 1; c <= maxCot; c++) {
      hang.push(ds.find((s) => s.hang === h && s.cot === c) ?? null)
    }
    hangGhe.push(hang)
  }

  return { maxHang, maxCot, cotTrai, hangGhe }
}

export function nhomTheoTang(ds: GheNgoi[]): { tang: number; ghe: GheNgoi[] }[] {
  const m = new Map<number, GheNgoi[]>()
  for (const g of ds) {
    const t = g.tang ?? 1
    if (!m.has(t)) m.set(t, [])
    m.get(t)!.push(g)
  }
  return [...m.entries()]
    .sort((a, b) => a[0] - b[0])
    .map(([tang, ghe]) => ({ tang, ghe }))
}
