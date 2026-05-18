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
