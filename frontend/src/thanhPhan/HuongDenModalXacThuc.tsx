import { useEffect, useRef } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { dungModalXacThuc } from '../dinhDanh/boiCanhModalXacThuc'


export function HuongDenModalXacThuc({ cheDo }: { cheDo: 'dang-nhap' | 'dang-ky' }) {
  const navigate = useNavigate()
  const location = useLocation()
  const { moDangNhap, moDangKy } = dungModalXacThuc()
  const daXuLy = useRef(false)

  useEffect(() => {
    if (daXuLy.current) return
    daXuLy.current = true
    const tu = (location.state as { tu?: { pathname: string } } | null)?.tu?.pathname
    if (cheDo === 'dang-nhap') {
      moDangNhap(tu)
    } else {
      moDangKy(tu ?? '/dat-ve')
    }
    navigate('/', { replace: true })
  }, [cheDo, location.state, moDangKy, moDangNhap, navigate])

  return null
}
