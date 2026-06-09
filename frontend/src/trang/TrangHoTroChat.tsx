import { useEffect, useState } from 'react'
import { MessageCircle } from 'lucide-react'
import { khachHttp, moKhoiDuLieu } from '../nguon/apiClient'
import type { LienHeHoTro, PhanHoi } from '../nguon/kieu'
import { dungThongBao } from '../dinhDanh/boiCanhThongBao'
import { NenTrangKhach } from '../thanhPhan/NenTrangKhach'
import { TheChua } from '../thanhPhan/theChua'
import { KhungChat } from '../thanhPhan/KhungChat'

export function TrangHoTroChat() {
  const { hienThi } = dungThongBao()
  const [hoTro, datHoTro] = useState<LienHeHoTro[]>([])
  const [chon, datChon] = useState<number | null>(null)
  const [tai, datTai] = useState(true)

  useEffect(() => {
    void (async () => {
      datTai(true)
      try {
        const ds = await moKhoiDuLieu(khachHttp.get<PhanHoi<LienHeHoTro[]>>('/chat/ho-tro'))
        datHoTro(ds)
        if (ds.length > 0) datChon(ds[0].ma)
      } catch (e: unknown) {
        hienThi({ loai: 'loi', noiDung: e instanceof Error ? e.message : 'Không tải danh sách hỗ trợ' })
      } finally {
        datTai(false)
      }
    })()
  }, [hienThi])

  const nv = hoTro.find((x) => x.ma === chon)

  return (
    <NenTrangKhach
      Icon={MessageCircle}
      tieuDe="Hỗ trợ trực tuyến"
      moTa="Trao đổi trực tiếp với nhân viên RedBus về đặt vé, thanh toán và các vấn đề khác."
    >
      <TheChua padding="lg" className="cust-panel">
        {tai ? <p className="muted">Đang kết nối…</p> : null}
        {!tai && hoTro.length === 0 ? (
          <p className="muted">Hiện chưa có nhân viên hỗ trợ trực tuyến. Vui lòng thử lại sau.</p>
        ) : null}
        {hoTro.length > 1 ? (
          <div className="chat-pick" style={{ marginBottom: '1rem' }}>
            <label className="field__label" htmlFor="chat-ho-tro">
              Chọn nhân viên hỗ trợ
            </label>
            <select
              id="chat-ho-tro"
              className="field__input"
              value={chon ?? ''}
              onChange={(e) => datChon(Number(e.target.value))}
            >
              {hoTro.map((h) => (
                <option key={h.ma} value={h.ma}>
                  {h.tenDangNhap} ({h.vaiTro})
                </option>
              ))}
            </select>
          </div>
        ) : null}
        {nv ? <KhungChat maDoiPhuong={nv.ma} tenDoiPhuong={nv.tenDangNhap} /> : null}
      </TheChua>
    </NenTrangKhach>
  )
}
