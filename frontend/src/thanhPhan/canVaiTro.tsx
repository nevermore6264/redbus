import type { ReactNode } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { dungNguoiDung } from '../dinhDanh/boiCanhNguoiDung'

export function CanVaiTro({
  vaiTro,
  con,
}: {
  vaiTro: string[]
  con: ReactNode
}) {
  const { nguoiDung } = dungNguoiDung()
  const viTri = useLocation()

  if (!nguoiDung) {
    return (
      <Navigate
        to="/"
        replace
        state={{
          moDangNhap: true,
          redirectSau: `${viTri.pathname}${viTri.search}`,
        }}
      />
    )
  }
  if (!vaiTro.includes(nguoiDung.vaiTro)) {
    return <Navigate to="/" replace />
  }
  return con
}
