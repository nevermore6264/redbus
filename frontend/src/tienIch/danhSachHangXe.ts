export const DS_HANG_XE: readonly string[] = [
  'Phương Trang (Futa)',
  'Hoàng Long',
  'Mai Linh Express',
  'Thành Bưởi',
  'Kumho Samco',
  'Sao Việt',
  'Hà Linh',
  'An Anh',
  'Hạ Long Travel',
  'Gia Vượng',
  'Hải Âu',
  'Tân Phát',
  'Chín Nghĩa',
  'Hưng Long',
  'Mercedes-Benz',
  'Hyundai Universe',
  'Ford Transit',
  'Thaco Mobihome',
  'DCar Limousine',
]

export function hopNhatHangXe(tuDanhSach: (string | undefined | null)[]): string[] {
  const set = new Set<string>(DS_HANG_XE)
  for (const h of tuDanhSach) {
    const s = h?.trim()
    if (s) set.add(s)
  }
  return [...set].sort((a, b) => a.localeCompare(b, 'vi'))
}
