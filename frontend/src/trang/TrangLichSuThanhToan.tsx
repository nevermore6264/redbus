import { useEffect, useState } from 'react'
import { NutLienKet } from '../thanhPhan/nutBam'
import { Receipt } from 'lucide-react'
import { khachHttp, moKhoiDuLieu } from '../nguon/apiClient'
import type { PhanHoi, GiaoDichThanhToan } from '../nguon/kieu'
import { dungThongBao } from '../dinhDanh/boiCanhThongBao'
import { NenTrangKhach } from '../thanhPhan/NenTrangKhach'
import { TheChua } from '../thanhPhan/theChua'
import { NhanHieu } from '../thanhPhan/nhanHieu'
import { dinhDangVnd, dinhDangNgayGio } from '../tienIch/dinhDang'
import { trangThaiSangTiengViet } from '../tienIch/trangThai'
import { phuongThucSangTiengViet, phuongThucTone } from '../tienIch/phuongThuc'

const SK_HANG = 6

export function TrangLichSuThanhToan() {
  const { hienThi } = dungThongBao()
  const [ds, datDs] = useState<GiaoDichThanhToan[]>([])
  const [tai, datTai] = useState(true)

  useEffect(() => {
    void (async () => {
      datTai(true)
      try {
        const x = await moKhoiDuLieu(
          khachHttp.get<PhanHoi<GiaoDichThanhToan[]>>('/thanh-toan/lich-su'),
        )
        datDs(x)
      } catch (e: unknown) {
        hienThi({ loai: 'loi', noiDung: e instanceof Error ? e.message : 'Không tải được lịch sử' })
      } finally {
        datTai(false)
      }
    })()
  }, [])

  return (
    <NenTrangKhach
      Icon={Receipt}
      tieuDe="Lịch sử thanh toán"
      moTa="Các giao dịch đã hoàn tất — đối chiếu mã vé và thời điểm thanh toán."
    >
      <TheChua padding="none" className="cust-panel" aria-busy={tai}>
        <div className="table-scroll cust-table-shell">
          <table className="data-table">
            <thead>
              <tr>
                <th>Mã giao dịch</th>
                <th>Mã vé</th>
                <th>Số tiền</th>
                <th>Hình thức</th>
                <th>Trạng thái</th>
                <th>Thời gian</th>
              </tr>
            </thead>
            <tbody>
              {tai && ds.length === 0
                ? Array.from({ length: SK_HANG }).map((_, i) => (
                    <tr key={`sk-${i}`} className="cust-row-skel" aria-hidden>
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
                        <span className="cust-skel-line cust-skel-line--sm" />
                      </td>
                      <td>
                        <span className="cust-skel-line cust-skel-line--xs" />
                      </td>
                      <td>
                        <span className="cust-skel-line cust-skel-line--lg" />
                      </td>
                    </tr>
                  ))
                : ds.map((g) => (
                    <tr key={g.ma}>
                      <td className="mono">{g.ma}</td>
                      <td>{g.maVe}</td>
                      <td>{dinhDangVnd(g.soTien)}</td>
                      <td>
                        <NhanHieu tone={phuongThucTone(g.phuongThuc)}>
                          {phuongThucSangTiengViet(g.phuongThuc)}
                        </NhanHieu>
                      </td>
                      <td>
                        <NhanHieu tone={g.trangThai}>{trangThaiSangTiengViet(g.trangThai)}</NhanHieu>
                      </td>
                      <td>{dinhDangNgayGio(g.thoiGianTao)}</td>
                    </tr>
                  ))}
            </tbody>
          </table>
        </div>
        {!tai && ds.length === 0 ? (
          <div className="cust-empty">
            <span className="cust-empty__ico" aria-hidden>
              <Receipt size={34} strokeWidth={1.35} />
            </span>
            <p className="cust-empty__title">Chưa có giao dịch</p>
            <p className="muted">Sau khi thanh toán vé, lịch sử sẽ hiển thị tại đây.</p>
            <div className="cust-empty__cta">
              <NutLienKet bien="vien" className="btn--sm" to="/ve-cua-toi" con="Xem vé của tôi" />
            </div>
          </div>
        ) : null}
      </TheChua>
    </NenTrangKhach>
  )
}
