import { useState } from 'react'
import { Sparkles, Star } from 'lucide-react'
import { khachHttp, moKhoiDuLieu } from '../nguon/apiClient'
import type { PhanHoi } from '../nguon/kieu'
import { dungThongBao } from '../dinhDanh/boiCanhThongBao'
import { NenTrangKhach } from '../thanhPhan/NenTrangKhach'
import { TheChua } from '../thanhPhan/theChua'
import { NutBam } from '../thanhPhan/nutBam'
import { TruongNhap, TruongVanBan } from '../thanhPhan/truongNhap'

export function TrangDanhGia() {
  const { hienThi } = dungThongBao()
  const [maChuyen, datMaChuyen] = useState('')
  const [diemSo, datDiemSo] = useState(5)
  const [nhanXet, datNhanXet] = useState('')
  const [tai, datTai] = useState(false)

  async function gui(e: React.FormEvent) {
    e.preventDefault()
    const m = Number(maChuyen)
    if (!m) {
      hienThi({ loai: 'loi', noiDung: 'Nhập mã chuyến hợp lệ' })
      return
    }
    datTai(true)
    try {
      await moKhoiDuLieu(khachHttp.post<PhanHoi<unknown>>('/danh-gia', { maChuyen: m, diemSo, nhanXet }))
      hienThi({ loai: 'thanhCong', noiDung: 'Cảm ơn bạn đã đánh giá!' })
      datNhanXet('')
    } catch (err: unknown) {
      hienThi({ loai: 'loi', noiDung: err instanceof Error ? err.message : 'Có lỗi xảy ra' })
    } finally {
      datTai(false)
    }
  }

  return (
    <NenTrangKhach
      hep
      Icon={Star}
      tieuDe="Đánh giá chuyến xe"
      moTa="Chỉ áp dụng khi bạn đã thanh toán vé cho chuyến đó. Mỗi chuyến chỉ đánh giá một lần."
    >
      <TheChua padding="lg" className="cust-panel">
        <div className="cust-form-card">
          <div className="cust-tip" role="note">
            <span className="cust-tip__ico" aria-hidden>
              <Sparkles size={20} strokeWidth={2} />
            </span>
            <span>
              <strong>Gợi ý:</strong> Mã chuyến là số ID trên vé hoặc trong « Vé của tôi ». Đánh giá sau khi đã thanh
              toán — hệ thống chỉ nhận một lần cho mỗi chuyến.
            </span>
          </div>
          <form className="form-stack" onSubmit={gui}>
            <TruongNhap
              nhan="Mã chuyến (ID)"
              type="number"
              value={maChuyen}
              onChange={(e) => datMaChuyen(e.target.value)}
              required
            />

            <div>
              <span className="field__label">Điểm đánh giá</span>
              <div className="cust-rating" role="radiogroup" aria-label="Chọn số sao từ 1 đến 5">
                {[1, 2, 3, 4, 5].map((s) => (
                  <button
                    key={s}
                    type="button"
                    className={`cust-rating__star ${diemSo >= s ? 'cust-rating__star--on' : ''}`}
                    onClick={() => datDiemSo(s)}
                    aria-label={`${s} sao`}
                    aria-pressed={diemSo === s}
                  >
                    <Star
                      size={30}
                      strokeWidth={1.6}
                      fill={diemSo >= s ? 'currentColor' : 'none'}
                      aria-hidden
                    />
                  </button>
                ))}
                <span className="muted small" style={{ marginLeft: '0.35rem' }}>
                  Đã chọn: <strong>{diemSo}</strong> / 5
                </span>
              </div>
            </div>

            <TruongVanBan
              id="nx"
              nhan="Nhận xét"
              rows={4}
              value={nhanXet}
              onChange={(e) => datNhanXet(e.target.value)}
            />
            <NutBam bien="chinh" type="submit" dangTai={tai} con="Gửi đánh giá" />
          </form>
        </div>
      </TheChua>
    </NenTrangKhach>
  )
}
