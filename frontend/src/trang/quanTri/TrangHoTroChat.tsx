import { useEffect, useState } from 'react'
import { MessageCircle } from 'lucide-react'
import { khachHttp, moKhoiDuLieu } from '../../nguon/apiClient'
import type { PhanHoi, ThongTinKhachHang } from '../../nguon/kieu'
import { dungThongBao } from '../../dinhDanh/boiCanhThongBao'
import { TheChua } from '../../thanhPhan/theChua'
import { KhungChat } from '../../thanhPhan/KhungChat'

export function TrangHoTroChatQuanTri() {
  const { hienThi } = dungThongBao()
  const [khach, datKhach] = useState<ThongTinKhachHang[]>([])
  const [chon, datChon] = useState<ThongTinKhachHang | null>(null)
  const [tuKhoa, datTuKhoa] = useState('')
  const [tai, datTai] = useState(true)

  useEffect(() => {
    void (async () => {
      datTai(true)
      try {
        const ds = await moKhoiDuLieu(khachHttp.get<PhanHoi<ThongTinKhachHang[]>>('/khach-hang'))
        datKhach(ds)
      } catch (e: unknown) {
        hienThi({ loai: 'loi', noiDung: e instanceof Error ? e.message : 'Không tải khách hàng' })
      } finally {
        datTai(false)
      }
    })()
  }, [hienThi])

  const loc = khach.filter((k) => {
    const q = tuKhoa.trim().toLowerCase()
    if (!q) return true
    return (
      k.hoTen.toLowerCase().includes(q) ||
      k.tenDangNhap.toLowerCase().includes(q) ||
      (k.soDienThoai ?? '').includes(q)
    )
  })

  return (
    <div className="admin-page">
      <header className="admin-page__head">
        <h1 className="admin-page__title">Hỗ trợ / Chat</h1>
        <p className="admin-page__sub">Trả lời tin nhắn từ khách hàng — chọn khách để mở hội thoại.</p>
      </header>

      <div className="chat-admin-layout">
        <TheChua padding="none" className="chat-admin-list">
          <div className="chat-admin-list__head">
            <MessageCircle size={18} />
            <span>Khách hàng</span>
          </div>
          <div className="chat-admin-list__search">
            <input
              className="field__input"
              type="search"
              placeholder="Tìm tên, SĐT, tài khoản…"
              value={tuKhoa}
              onChange={(e) => datTuKhoa(e.target.value)}
            />
          </div>
          <ul className="chat-admin-list__items" aria-busy={tai}>
            {loc.map((k) => (
              <li key={k.maKhach}>
                <button
                  type="button"
                  className={`chat-admin-list__item${chon?.maKhach === k.maKhach ? ' chat-admin-list__item--active' : ''}`}
                  onClick={() => datChon(k)}
                >
                  <span className="chat-admin-list__name">{k.hoTen}</span>
                  <span className="chat-admin-list__meta mono">{k.tenDangNhap}</span>
                  {k.soDienThoai ? <span className="chat-admin-list__meta">{k.soDienThoai}</span> : null}
                </button>
              </li>
            ))}
            {!tai && loc.length === 0 ? (
              <li className="muted" style={{ padding: '1rem' }}>
                Không có khách phù hợp.
              </li>
            ) : null}
          </ul>
        </TheChua>

        <TheChua padding="lg" className="chat-admin-main">
          {chon ? (
            <KhungChat maDoiPhuong={chon.maTaiKhoan} tenDoiPhuong={`${chon.hoTen} (${chon.tenDangNhap})`} />
          ) : (
            <p className="muted" style={{ margin: 0 }}>
              Chọn một khách hàng bên trái để xem và trả lời tin nhắn.
            </p>
          )}
        </TheChua>
      </div>
    </div>
  )
}
