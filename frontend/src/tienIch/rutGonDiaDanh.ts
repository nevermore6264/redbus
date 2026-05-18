export function rutGonTenDiaDanh(ten: string, max = 36): string {
  const s = ten.trim()
  if (!s) return '—'
  if (s.length <= max) return s
  const truocPhay = s.split(',')[0].trim()
  if (truocPhay.length > 0 && truocPhay.length <= max) return truocPhay
  return s.slice(0, max - 1) + '…'
}
