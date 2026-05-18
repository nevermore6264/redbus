export function taoLinkTraCuuVe(goc: string, ma: string): string {
  const base = goc.replace(/\/$/, '')
  return `${base}/tra-cuu-ve?ma=${encodeURIComponent(ma.toUpperCase())}`
}

export function layNoiDungQr(apiQr: string, ma: string): string {
  if (typeof window === 'undefined') return apiQr
  const laLocalApi = /localhost|127\.0\.0\.1/i.test(apiQr)
  if (import.meta.env.DEV || laLocalApi) {
    return taoLinkTraCuuVe(window.location.origin, ma)
  }
  return apiQr
}

export function phanTichMaTuQr(noiDung: string): string | null {
  const s = noiDung.trim()
  if (!s) return null

  if (s.startsWith('REDBUS|')) {
    const ma = s.split('|')[1]?.trim()
    return ma ? ma.toUpperCase() : null
  }

  try {
    const url = new URL(s)
    const tuQuery = url.searchParams.get('ma')?.trim()
    if (tuQuery) return tuQuery.toUpperCase()
  } catch {
  }

  const thuong = s.toUpperCase().replace(/\s/g, '')
  if (/^RB[A-Z0-9]{6,14}$/.test(thuong)) return thuong
  return null
}
