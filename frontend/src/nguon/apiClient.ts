import axios from 'axios'
import type { PhanHoi } from './kieu'

export const gocUrlApi = import.meta.env.VITE_API_URL ?? 'http://localhost:8080/api'

export const khachHttp = axios.create({
  baseURL: gocUrlApi,
  headers: { 'Content-Type': 'application/json' },
})

export function urlTaiNguyen(duongTuongDoi: string): string {
  if (!duongTuongDoi) return ''
  if (duongTuongDoi.startsWith('http')) return duongTuongDoi
  const base = gocUrlApi.replace(/\/$/, '')
  const p = duongTuongDoi.replace(/^\//, '')
  return `${base}/${p}`
}

export async function guiMultipart<T>(path: string, formData: FormData): Promise<T> {
  const token = localStorage.getItem('token')
  const headers: HeadersInit = {}
  if (token) headers.Authorization = `Bearer ${token}`
  const res = await fetch(`${gocUrlApi}${path}`, { method: 'POST', body: formData, headers })
  const json = (await res.json()) as PhanHoi<T>
  if (!json.thanhCong) {
    throw new Error(json.thongDiep || 'Yeu cau that bai')
  }
  return json.duLieu
}

khachHttp.interceptors.request.use((cauHinh) => {
  const token = localStorage.getItem('token')
  if (token) {
    cauHinh.headers.Authorization = `Bearer ${token}`
  }
  return cauHinh
})

khachHttp.interceptors.response.use(
  (phanHoi) => phanHoi,
  (loi: unknown) => {
    if (typeof loi === 'object' && loi !== null && 'response' in loi) {
      const ax = loi as { response?: { data?: { thongDiep?: string } } }
      const msg = ax.response?.data?.thongDiep
      if (msg) return Promise.reject(new Error(msg))
    }
    if (loi instanceof Error) return Promise.reject(loi)
    return Promise.reject(new Error('Loi mang'))
  },
)

export async function moKhoiDuLieu<T>(promise: Promise<{ data: PhanHoi<T> }>): Promise<T> {
  const { data } = await promise
  if (!data.thanhCong) {
    throw new Error(data.thongDiep || 'Yeu cau that bai')
  }
  return data.duLieu
}
