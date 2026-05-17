export function chuanHoaChuoi(s: string) {
  return s.trim().replace(/\s+/g, ' ')
}

export function soSanhKhongPhanBiet(a: string, b: string) {
  return chuanHoaChuoi(a).toLowerCase() === chuanHoaChuoi(b).toLowerCase()
}

export function chuanHoaBienSo(s: string) {
  return s.trim().replace(/\s+/g, '').toUpperCase()
}

export function chuanHoaMaCode(s: string) {
  return s.trim().replace(/\s+/g, '').toUpperCase()
}
