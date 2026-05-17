

const GOC = '/images/xe-khach'

export const ANH_CO_DINH = {
  heroChinh: `${GOC}/xe-ngoai-1.jpg`,
  heroPhu: `${GOC}/xe-ngoai-2.jpg`,
  heroNen: `${GOC}/hero-nen.jpg`,
  ghe: `${GOC}/ghe-xe-khach.jpg`,
  thanhToan: `${GOC}/dat-ve-quay.jpg`,
  veDienTu: `${GOC}/ve-dien-tu.jpg`,
  khuyenMai: `${GOC}/xe-ngoai-2.jpg`,
  cta: `${GOC}/duong-cao-toc.jpg`,
  benXe: `${GOC}/ben-xe.jpg`,
  tinMacDinh: `${GOC}/ben-xe.jpg`,
} as const

export type SlideXeKhach = {
  src: string
  alt: string
  chu?: string
}

export const SLIDE_HERO: SlideXeKhach[] = [
  { src: `${GOC}/xe-ngoai-1.jpg`, alt: 'Xe khách liên tỉnh', chu: 'Đội xe đối tác' },
  { src: `${GOC}/xe-ngoai-2.jpg`, alt: 'Xe giường nằm cao cấp', chu: 'Ghế ngả thoải mái' },
  { src: `${GOC}/ghe-xe-khach.jpg`, alt: 'Nội thất xe khách', chu: 'Chọn ghế trực quan' },
  { src: `${GOC}/ben-xe.jpg`, alt: 'Bến xe khách', chu: 'Khởi hành đúng giờ' },
  { src: `${GOC}/duong-cao-toc.jpg`, alt: 'Hành trình trên cao tốc', chu: 'An toàn & tiện lợi' },
]

const ANH_TUYEN = [
  `${GOC}/xe-ngoai-1.jpg`,
  `${GOC}/xe-ngoai-2.jpg`,
  `${GOC}/ghe-xe-khach.jpg`,
  `${GOC}/ben-xe.jpg`,
  `${GOC}/duong-cao-toc.jpg`,
  `${GOC}/dat-ve-quay.jpg`,
] as const

export function anhChoTuyen(ma: number) {
  return ANH_TUYEN[ma % ANH_TUYEN.length]
}

export function anhAvatar(ten: string) {
  const seed = encodeURIComponent(ten.trim() || 'khach')
  return `https://api.dicebear.com/7.x/thumbs/svg?seed=${seed}&backgroundColor=e11d48,fecdd3`
}

export function anhTinFallback(ma: number) {
  const ds = [`${GOC}/ben-xe.jpg`, `${GOC}/xe-ngoai-1.jpg`, `${GOC}/duong-cao-toc.jpg`]
  return ds[ma % ds.length]
}
