import { useEffect, useState } from 'react'
import { Sparkles, Star } from 'lucide-react'
import { khachHttp, moKhoiDuLieu } from '../nguon/apiClient'
import type { PhanHoi, VeChoDanhGia } from '../nguon/kieu'
import { dungThongBao } from '../dinhDanh/boiCanhThongBao'
import { NenTrangKhach } from '../thanhPhan/NenTrangKhach'
import { TheChua } from '../thanhPhan/theChua'
import { NutBam } from '../thanhPhan/nutBam'
import { TruongVanBan } from '../thanhPhan/truongNhap'
import { dinhDangNgayGio } from '../tienIch/dinhDang'

export function TrangDanhGia() {
  const { hienThi } = dungThongBao()
  const [dsVe, datDsVe] = useState<VeChoDanhGia[]>([])
  const [chon, datChon] = useState<VeChoDanhGia | null>(null)
  const [diemSo, datDiemSo] = useState(5)
  const [nhanXet, datNhanXet] = useState('')
  const [tai, datTai] = useState(false)

  useEffect(() => {
    void (async () => {
      try {
        const x = await moKhoiDuLieu(
          khachHttp.get<PhanHoi<VeChoDanhGia[]>>('/danh-gia/ve-cho-danh-gia'),
        )
        datDsVe(x)
        const chua = x.find((v) => !v.daDanhGia)
        if (chua) datChon(chua)
      } catch (e: unknown) {
        hienThi({ loai: 'loi', noiDung: e instanceof Error ? e.message : 'Không tải được vé' })
      }
    })()
  }, [])

  async function gui(e: React.FormEvent) {
    e.preventDefault()
    if (!chon) {
      hienThi({ loai: 'loi', noiDung: 'Chọn chuyến cần đánh giá' })
      return
    }
    datTai(true)
    try {
      await moKhoiDuLieu(
        khachHttp.post<PhanHoi<unknown>>('/danh-gia', {
          maChuyen: chon.maChuyen,
          diemSo,
          nhanXet,
        }),
      )
      hienThi({ loai: 'thanhCong', noiDung: 'Cảm ơn bạn đã đánh giá!' })
      datNhanXet('')
      const x = await moKhoiDuLieu(
        khachHttp.get<PhanHoi<VeChoDanhGia[]>>('/danh-gia/ve-cho-danh-gia'),
      )
      datDsVe(x)
      datChon(x.find((v) => !v.daDanhGia) ?? null)
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
      moTa="Chọn vé đã đi và đã thanh toán — mỗi chuyến chỉ đánh giá một lần."
    >
      <TheChua padding="lg" className="cust-panel">
        <div className="cust-form-card">
          <div className="cust-tip" role="note">
            <span className="cust-tip__ico" aria-hidden>
              <Sparkles size={20} strokeWidth={2} />
            </span>
            <span>Danh sách chỉ gồm chuyến đã khởi hành và vé đã thanh toán.</span>
          </div>

          {dsVe.length === 0 ? (
            <p className="muted">Chưa có chuyến nào đủ điều kiện đánh giá.</p>
          ) : (
            <ul className="rate-trip-list">
              {dsVe.map((v) => (
                <li key={v.maVe}>
                  <button
                    type="button"
                    className={`rate-trip-item${chon?.maVe === v.maVe ? ' rate-trip-item--on' : ''}${v.daDanhGia ? ' rate-trip-item--done' : ''}`}
                    disabled={v.daDanhGia}
                    onClick={() => datChon(v)}
                  >
                    <strong>{v.tuyen ?? `Chuyến #${v.maChuyen}`}</strong>
                    <span className="muted small">
                      {v.thoiDiemKhoiHanh ? dinhDangNgayGio(v.thoiDiemKhoiHanh) : ''}
                      {v.daDanhGia ? ' · Đã đánh giá' : ''}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          )}

          {chon && !chon.daDanhGia ? (
            <form className="form-stack" onSubmit={(e) => void gui(e)}>
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
                    >
                      <Star size={30} fill={diemSo >= s ? 'currentColor' : 'none'} aria-hidden />
                    </button>
                  ))}
                </div>
              </div>
              <TruongVanBan id="nx" nhan="Nhận xét" rows={4} value={nhanXet} onChange={(e) => datNhanXet(e.target.value)} />
              <NutBam bien="chinh" type="submit" dangTai={tai} con="Gửi đánh giá" />
            </form>
          ) : null}
        </div>
      </TheChua>
    </NenTrangKhach>
  )
}
