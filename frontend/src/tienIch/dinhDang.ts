export function dinhDangVnd(gia: number | string | undefined): string {
  const x = Number(gia ?? 0)
  if (Number.isNaN(x)) return '—'
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(x)
}

export function dinhDangNgayGio(chuoiIso: string | undefined): string {
  if (!chuoiIso) return '—'
  return new Date(chuoiIso).toLocaleString('vi-VN', {
    weekday: 'short',
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}
