import { useCallback, useEffect, useRef, useState } from 'react'
import { khachHttp, moKhoiDuLieu } from '../nguon/apiClient'
import type { PhanHoi, TinNhanChat } from '../nguon/kieu'
import { dungThongBao } from '../dinhDanh/boiCanhThongBao'
import { NutBam } from './nutBam'
import { dinhDangNgayGio } from '../tienIch/dinhDang'

type Props = {
  maDoiPhuong: number
  tenDoiPhuong: string
}

export function KhungChat({ maDoiPhuong, tenDoiPhuong }: Props) {
  const { hienThi } = dungThongBao()
  const [maToi, datMaToi] = useState<number | null>(null)
  const [tinNhan, datTinNhan] = useState<TinNhanChat[]>([])
  const [noiDung, datNoiDung] = useState('')
  const [tai, datTai] = useState(true)
  const [dangGui, datDangGui] = useState(false)
  const cuoiRef = useRef<HTMLDivElement>(null)

  const napHoiThoai = useCallback(async () => {
    try {
      const ds = await moKhoiDuLieu(
        khachHttp.get<PhanHoi<TinNhanChat[]>>('/chat/hoi-thoai', {
          params: { doiPhuong: maDoiPhuong },
        }),
      )
      datTinNhan(ds)
    } catch (e: unknown) {
      hienThi({ loai: 'loi', noiDung: e instanceof Error ? e.message : 'Không tải được hội thoại' })
    } finally {
      datTai(false)
    }
  }, [maDoiPhuong, hienThi])

  useEffect(() => {
    let huy = false
    void (async () => {
      try {
        const x = await moKhoiDuLieu(khachHttp.get<PhanHoi<{ maTaiKhoan: number }>>('/chat/toi'))
        if (!huy) datMaToi(x.maTaiKhoan)
      } catch {
      }
    })()
    return () => {
      huy = true
    }
  }, [])

  useEffect(() => {
    datTai(true)
    void napHoiThoai()
    const id = window.setInterval(() => void napHoiThoai(), 5000)
    return () => window.clearInterval(id)
  }, [napHoiThoai])

  useEffect(() => {
    cuoiRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [tinNhan])

  async function gui() {
    const text = noiDung.trim()
    if (!text) return
    datDangGui(true)
    try {
      await moKhoiDuLieu(
        khachHttp.post<PhanHoi<TinNhanChat>>('/chat/gui', {
          maNguoiNhan: maDoiPhuong,
          noiDung: text,
        }),
      )
      datNoiDung('')
      await napHoiThoai()
    } catch (e: unknown) {
      hienThi({ loai: 'loi', noiDung: e instanceof Error ? e.message : 'Gửi tin thất bại' })
    } finally {
      datDangGui(false)
    }
  }

  return (
    <div className="chat-box">
      <header className="chat-box__head">
        <div>
          <h2 className="chat-box__title">Hội thoại</h2>
          <p className="chat-box__sub">Đang chat với {tenDoiPhuong}</p>
        </div>
        <NutBam bien="vien" className="btn--sm" onClick={() => void napHoiThoai()} con="Làm mới" dangTai={tai} />
      </header>

      <div className="chat-box__body" aria-live="polite">
        {tai && tinNhan.length === 0 ? (
          <p className="muted chat-box__empty">Đang tải tin nhắn…</p>
        ) : null}
        {!tai && tinNhan.length === 0 ? (
          <p className="muted chat-box__empty">Chưa có tin nhắn. Gửi lời chào để bắt đầu.</p>
        ) : null}
        {tinNhan.map((t) => {
          const cuaToi = maToi != null && t.maNguoiGui === maToi
          return (
            <div
              key={t.ma}
              className={`chat-bubble ${cuaToi ? 'chat-bubble--me' : 'chat-bubble--them'}`}
            >
              <p className="chat-bubble__text">{t.noiDung}</p>
              <time className="chat-bubble__time">{dinhDangNgayGio(t.thoiGianTao)}</time>
            </div>
          )
        })}
        <div ref={cuoiRef} />
      </div>

      <form
        className="chat-box__foot"
        onSubmit={(e) => {
          e.preventDefault()
          void gui()
        }}
      >
        <input
          className="chat-box__input"
          type="text"
          placeholder="Nhập tin nhắn…"
          value={noiDung}
          onChange={(e) => datNoiDung(e.target.value)}
          maxLength={2000}
          autoComplete="off"
        />
        <NutBam bien="chinh" type="submit" dangTai={dangGui} con="Gửi" />
      </form>
    </div>
  )
}
