import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import type { PhanHoiDangNhap } from '../nguon/kieu'

export type GiaTriBoiCanh = {
  nguoiDung: PhanHoiDangNhap | null
  ganPhien: (p: PhanHoiDangNhap | null) => void
  dangXuat: () => void
}

const BoiCanhNguoiDung = createContext<GiaTriBoiCanh | undefined>(undefined)

const KHOA_LUU = 'redbus_phien'

function docPhien(): PhanHoiDangNhap | null {
  try {
    const s = localStorage.getItem(KHOA_LUU)
    if (!s) return null
    const v = JSON.parse(s) as PhanHoiDangNhap
    if (v.token) localStorage.setItem('token', v.token)
    return v
  } catch {
    return null
  }
}

export function NhaCungCapNguoiDung({ con }: { con: ReactNode }) {
  const [nguoiDung, datNguoiDung] = useState<PhanHoiDangNhap | null>(() => docPhien())

  const ganPhien = useCallback((p: PhanHoiDangNhap | null) => {
    datNguoiDung(p)
    if (p) {
      localStorage.setItem(KHOA_LUU, JSON.stringify(p))
      localStorage.setItem('token', p.token)
    } else {
      localStorage.removeItem(KHOA_LUU)
      localStorage.removeItem('token')
    }
  }, [])

  const dangXuat = useCallback(() => {
    ganPhien(null)
  }, [ganPhien])

  const giaTri = useMemo(
    () => ({ nguoiDung, ganPhien, dangXuat }),
    [nguoiDung, ganPhien, dangXuat],
  )

  return <BoiCanhNguoiDung.Provider value={giaTri}>{con}</BoiCanhNguoiDung.Provider>
}

export function dungNguoiDung() {
  const v = useContext(BoiCanhNguoiDung)
  if (!v) throw new Error('dungNguoiDung: thieu NhaCungCapNguoiDung')
  return v
}
