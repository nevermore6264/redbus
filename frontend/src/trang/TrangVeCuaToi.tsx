import { useEffect, useState } from 'react'
import { Ticket } from 'lucide-react'
import { khachHttp, moKhoiDuLieu } from '../nguon/apiClient'
import type { PhanHoi, VeXe, ChuyenXe, TuyenDuong, GheNgoi } from '../nguon/kieu'
import { dungThongBao } from '../dinhDanh/boiCanhThongBao'
import { NenTrangKhach } from '../thanhPhan/NenTrangKhach'
import { TheChua, TieuDeThe } from '../thanhPhan/theChua'
import { NutBam, NutLienKet } from '../thanhPhan/nutBam'
import { TruongNhap } from '../thanhPhan/truongNhap'
import { NhanHieu } from '../thanhPhan/nhanHieu'
import { dinhDangNgayGio, dinhDangVnd } from '../tienIch/dinhDang'
import { trangThaiSangTiengViet } from '../tienIch/trangThai'

type BamPhu = { tuyen: string; gio: string; gia: string; maGhe: string }

export function TrangVeCuaToi() {
  const { hienThi } = dungThongBao()
  const [dsVe, datVe] = useState<VeXe[]>([])
  const [phu, datPhu] = useState<Record<number, BamPhu>>({})
  const [tai, datTai] = useState(true)
  const [maKhuyenMai, datMaKhuyenMai] = useState('')

  async function lamMoi() {
    datTai(true)
    try {
      const v = await moKhoiDuLieu(khachHttp.get<PhanHoi<VeXe[]>>('/ve-xe/cua-toi'))
      datVe(v)
      const phuMoi: Record<number, BamPhu> = {}
      for (const t of v) {
        const cx = await moKhoiDuLieu(
          khachHttp.get<PhanHoi<ChuyenXe>>(`/chuyen-xe/${t.maChuyen}`),
        )
        const r = await moKhoiDuLieu(
          khachHttp.get<PhanHoi<TuyenDuong>>(`/tuyen-duong/${cx.maTuyen}`),
        )
        const gheList = await moKhoiDuLieu(
          khachHttp.get<PhanHoi<GheNgoi[]>>(`/ghe-ngoi/xe/${cx.maXe}`),
        )
        const g = gheList.find((x) => x.ma === t.maGhe)
        phuMoi[t.ma] = {
          tuyen: `${r.diemDi} → ${r.diemDen}`,
          gio: dinhDangNgayGio(cx.thoiDiemKhoiHanh),
          gia: dinhDangVnd(cx.giaVe),
          maGhe: g?.maGhe ?? String(t.maGhe),
        }
      }
      datPhu(phuMoi)
    } catch (e: unknown) {
      hienThi({ loai: 'loi', noiDung: e instanceof Error ? e.message : 'Có lỗi tải dữ liệu' })
    } finally {
      datTai(false)
    }
  }

  useEffect(() => {
    void lamMoi()
  }, [])

  async function thanhToan(maVe: number) {
    try {
      const than = maKhuyenMai.trim() ? { maKhuyenMai: maKhuyenMai.trim() } : {}
      await moKhoiDuLieu(
        khachHttp.post<PhanHoi<unknown>>(`/thanh-toan/ve/${maVe}/tien-mat`, than),
      )
      hienThi({ loai: 'thanhCong', noiDung: 'Thanh toán thành công' })
      void lamMoi()
    } catch (e: unknown) {
      hienThi({ loai: 'loi', noiDung: e instanceof Error ? e.message : 'Có lỗi tải dữ liệu' })
    }
  }

  async function huyVe(ma: number) {
    if (!confirm('Bạn có chắc muốn hủy vé này?')) return
    try {
      await moKhoiDuLieu(khachHttp.post<PhanHoi<unknown>>(`/ve-xe/${ma}/huy`))
      hienThi({ loai: 'thanhCong', noiDung: 'Đã hủy vé' })
      void lamMoi()
    } catch (e: unknown) {
      hienThi({ loai: 'loi', noiDung: e instanceof Error ? e.message : 'Có lỗi tải dữ liệu' })
    }
  }

  return (
    <NenTrangKhach
      Icon={Ticket}
      tieuDe="Vé của tôi"
      moTa="Theo dõi trạng thái vé, thanh toán tiền mặt hoặc hủy khi còn ở trạng thái chờ."
    >
      <TheChua padding="none" className="cust-panel" aria-busy={tai}>
        <div className="table-wrap-pad cust-promo">
          <TieuDeThe
            title="Danh sách vé"
            subtitle="Mã khuyến mãi áp dụng khi thanh toán vé đang chờ."
            action={<NutBam bien="vien" onClick={lamMoi} dangTai={tai} con="Làm mới" />}
          />
          <div className="cust-promo__inner">
            <TruongNhap
              nhan="Mã khuyến mãi (tùy chọn)"
              goiY="Ví dụ: REDBUS10"
              placeholder="VD: REDBUS10"
              value={maKhuyenMai}
              onChange={(e) => datMaKhuyenMai(e.target.value)}
            />
          </div>
        </div>
        <div className="table-scroll cust-table-shell">
          <table className="data-table">
            <thead>
              <tr>
                <th>Mã</th>
                <th>Tuyến</th>
                <th>Khởi hành</th>
                <th>Ghế</th>
                <th>Giá</th>
                <th>Trạng thái</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {tai && dsVe.length === 0
                ? Array.from({ length: 5 }).map((_, i) => (
                    <tr key={`sk-${i}`} className="cust-row-skel" aria-hidden>
                      <td>
                        <span className="cust-skel-line cust-skel-line--sm" />
                      </td>
                      <td>
                        <span className="cust-skel-line cust-skel-line--lg" />
                      </td>
                      <td>
                        <span className="cust-skel-line cust-skel-line--md" />
                      </td>
                      <td>
                        <span className="cust-skel-line cust-skel-line--sm" />
                      </td>
                      <td>
                        <span className="cust-skel-line cust-skel-line--md" />
                      </td>
                      <td>
                        <span className="cust-skel-line cust-skel-line--xs" />
                      </td>
                      <td>
                        <span className="cust-skel-line cust-skel-line--sm" />
                      </td>
                    </tr>
                  ))
                : dsVe.map((t) => {
                const x = phu[t.ma]
                return (
                  <tr key={t.ma}>
                    <td className="mono">#{t.ma}</td>
                    <td>{x?.tuyen ?? '…'}</td>
                    <td>{x?.gio ?? '…'}</td>
                    <td>
                      <strong>{x?.maGhe ?? '…'}</strong>
                    </td>
                    <td>{x?.gia ?? '…'}</td>
                    <td>
                      <NhanHieu tone={t.trangThai}>{trangThaiSangTiengViet(t.trangThai)}</NhanHieu>
                    </td>
                    <td className="row-actions">
                      {t.trangThai === 'PENDING' && (
                        <>
                          <NutBam
                            bien="chinh"
                            className="btn--sm"
                            onClick={() => void thanhToan(t.ma)}
                            con="Thanh toán"
                          />
                          <NutBam
                            bien="huy"
                            className="btn--sm"
                            onClick={() => void huyVe(t.ma)}
                            con="Hủy"
                          />
                        </>
                      )}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
        {dsVe.length === 0 && !tai ? (
          <div className="cust-empty">
            <span className="cust-empty__ico" aria-hidden>
              <Ticket size={34} strokeWidth={1.35} />
            </span>
            <p className="cust-empty__title">Chưa có vé nào</p>
            <p className="muted">
              Đặt vé online và quản lý thanh toán ngay tại đây.
            </p>
            <div className="cust-empty__cta">
              <NutLienKet bien="chinh" className="btn--sm" to="/dat-ve" con="Đặt vé ngay" />
            </div>
          </div>
        ) : null}
      </TheChua>
    </NenTrangKhach>
  )
}
