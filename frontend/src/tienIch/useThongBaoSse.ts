import { useEffect } from 'react'
import { gocUrlApi } from '../nguon/apiClient'
import { dungNguoiDung } from '../dinhDanh/boiCanhNguoiDung'
import { dungThongBao } from '../dinhDanh/boiCanhThongBao'

export function useThongBaoSse() {
  const { nguoiDung } = dungNguoiDung()
  const { hienThi } = dungThongBao()

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token || !nguoiDung) return

    const url = `${gocUrlApi}/thong-bao/stream?token=${encodeURIComponent(token)}`
    const es = new EventSource(url)

    es.addEventListener('thong-bao', (ev) => {
      try {
        const data = JSON.parse(ev.data as string) as { tieuDe?: string; noiDung?: string }
        hienThi({
          loai: 'thongTin',
          noiDung: data.tieuDe ? `${data.tieuDe}: ${data.noiDung ?? ''}` : (data.noiDung ?? 'Có thông báo mới'),
        })
      } catch {
        hienThi({ loai: 'thongTin', noiDung: 'Có thông báo mới' })
      }
    })

    es.onerror = () => {
      es.close()
    }

    return () => es.close()
  }, [nguoiDung?.tenDangNhap])
}
