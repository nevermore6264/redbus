import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { CuaSoXacThuc } from '../thanhPhan/CuaSoXacThuc'

export type CheDoModalXacThuc = null | 'dang-nhap' | 'dang-ky'

type GiaTriModal = {
  cheDo: CheDoModalXacThuc
  redirectSauThanhCong: string | undefined
  moDangNhap: (redirectSau?: string) => void
  moDangKy: (redirectSau?: string) => void
  dong: () => void
  doiSangDangKy: () => void
  doiSangDangNhap: () => void
}

const BoiCanhModalXacThuc = createContext<GiaTriModal | null>(null)

export function NhaCungCapModalXacThuc({ con }: { con: ReactNode }) {
  const [cheDo, setCheDo] = useState<CheDoModalXacThuc>(null)
  const [redirectSauThanhCong, setRedirect] = useState<string | undefined>()

  const moDangNhap = useCallback((redirectSau?: string) => {
    setRedirect(redirectSau)
    setCheDo('dang-nhap')
  }, [])

  const moDangKy = useCallback((redirectSau?: string) => {
    setRedirect(redirectSau)
    setCheDo('dang-ky')
  }, [])

  const dong = useCallback(() => {
    setCheDo(null)
    setRedirect(undefined)
  }, [])

  const doiSangDangKy = useCallback(() => {
    setCheDo('dang-ky')
  }, [])

  const doiSangDangNhap = useCallback(() => {
    setCheDo('dang-nhap')
  }, [])

  const giaTri = useMemo(
    () => ({
      cheDo,
      redirectSauThanhCong,
      moDangNhap,
      moDangKy,
      dong,
      doiSangDangKy,
      doiSangDangNhap,
    }),
    [
      cheDo,
      redirectSauThanhCong,
      moDangNhap,
      moDangKy,
      dong,
      doiSangDangKy,
      doiSangDangNhap,
    ],
  )

  return (
    <BoiCanhModalXacThuc.Provider value={giaTri}>
      {con}
      <CuaSoXacThuc />
    </BoiCanhModalXacThuc.Provider>
  )
}

export function dungModalXacThuc() {
  const x = useContext(BoiCanhModalXacThuc)
  if (!x) {
    throw new Error('dungModalXacThuc phai dung trong NhaCungCapModalXacThuc')
  }
  return x
}
