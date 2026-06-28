import { useEffect, useState } from 'react'
import { RefreshCw } from 'lucide-react'
import { khachHttp, moKhoiDuLieu } from '../../nguon/apiClient'
import type { PhanHoi, VeHoanTien } from '../../nguon/kieu'
import { dungThongBao } from '../../dinhDanh/boiCanhThongBao'
import { TheChua, TieuDeThe } from '../../thanhPhan/theChua'
import { NutBam } from '../../thanhPhan/nutBam'
import { CuaSoXacNhanXoa } from '../../thanhPhan/cuaSoXacNhanXoa'
import { dinhDangNgayGio, dinhDangVnd } from '../../tienIch/dinhDang'

export function TrangHoanTien() {
  const { hienThi } = dungThongBao()
  const [ds, datDs] = useState<VeHoanTien[]>([])
  const [tai, datTai] = useState(true)
  const [chon, datChon] = useState<VeHoanTien | null>(null)
  const [dangXuLy, datDangXuLy] = useState(false)

  async function taiDS() {
    datTai(true)
    try {
      const rows = await moKhoiDuLieu(
        khachHttp.get<PhanHoi<VeHoanTien[]>>('/ve-xe/hoan-tien/cho-xu-ly'),
      )
      datDs(rows)
    } catch (e: unknown) {
      hienThi({ loai: 'loi', noiDung: e instanceof Error ? e.message : 'Lỗi tải danh sách' })
    } finally {
      datTai(false)
    }
  }

  useEffect(() => {
    void taiDS()
  }, [])

  async function xacNhan() {
    if (!chon) return
    datDangXuLy(true)
    try {
      await moKhoiDuLieu(
        khachHttp.post<PhanHoi<VeHoanTien>>(`/ve-xe/${chon.maVe}/xac-nhan-hoan`),
      )
      datChon(null)
      hienThi({ loai: 'thanhCong', noiDung: 'Đã xác nhận hoàn tiền cho khách.' })
      void taiDS()
    } catch (e: unknown) {
      hienThi({ loai: 'loi', noiDung: e instanceof Error ? e.message : 'Xác nhận thất bại' })
    } finally {
      datDangXuLy(false)
    }
  }

  return (
    <div className="admin-page">
      <header className="admin-page__head">
        <h1 className="admin-page__title">Hoàn tiền</h1>
        <p className="admin-page__sub">
          Xem thông tin chuyển khoản khách cung cấp và xác nhận sau khi đã chuyển tiền.
        </p>
      </header>

      <TheChua padding="none">
        <div className="table-wrap-pad">
          <TieuDeThe
            title="Yêu cầu chờ xử lý"
            subtitle={tai ? 'Đang tải…' : `${ds.length} yêu cầu`}
            action={
              <NutBam
                bien="vien"
                className="btn--sm"
                dangTai={tai}
                onClick={() => void taiDS()}
                con={
                  <>
                    <RefreshCw size={16} aria-hidden />
                    Làm mới
                  </>
                }
              />
            }
          />
        </div>
        <div className="table-scroll">
          <table className="data-table">
            <thead>
              <tr>
                <th>Vé</th>
                <th>Khách</th>
                <th>Số tiền</th>
                <th>Tài khoản nhận</th>
                <th>Chuyến</th>
                <th>Yêu cầu lúc</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {tai && ds.length === 0 ? (
                <tr>
                  <td colSpan={7} className="data-table__empty">
                    Đang tải…
                  </td>
                </tr>
              ) : null}
              {!tai && ds.length === 0 ? (
                <tr>
                  <td colSpan={7} className="data-table__empty">
                    Không có yêu cầu hoàn tiền nào.
                  </td>
                </tr>
              ) : null}
              {ds.map((r) => (
                <tr key={r.maVe}>
                  <td>
                    <strong>#{r.maVe}</strong>
                    {r.maVeHienThi ? <span className="muted"> · {r.maVeHienThi}</span> : null}
                  </td>
                  <td>
                    <div>{r.tenKhach ?? '—'}</div>
                    <div className="muted small">{r.soDienThoaiKhach ?? ''}</div>
                  </td>
                  <td>{r.soTienHoan != null ? dinhDangVnd(r.soTienHoan) : '—'}</td>
                  <td>
                    <div>
                      <strong>{r.tenNguoiNhanHoan}</strong>
                    </div>
                    <div className="muted small">
                      {r.tenNganHangHoan} · STK {r.stkHoan}
                    </div>
                    {r.phuongThucThanhToan ? (
                      <div className="muted small">Đã TT: {r.phuongThucThanhToan}</div>
                    ) : null}
                  </td>
                  <td>
                    #{r.maChuyen ?? '—'}
                    {r.thoiDiemKhoiHanh ? (
                      <div className="muted small">{dinhDangNgayGio(r.thoiDiemKhoiHanh)}</div>
                    ) : null}
                  </td>
                  <td>{r.thoiGianYeuCauHoan ? dinhDangNgayGio(r.thoiGianYeuCauHoan) : '—'}</td>
                  <td className="row-actions">
                    <NutBam bien="chinh" className="btn--sm" onClick={() => datChon(r)} con="Xác nhận hoàn" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </TheChua>

      <CuaSoXacNhanXoa
        open={chon !== null}
        title="Xác nhận đã chuyển hoàn tiền"
        nhanNutXoa="Đã chuyển khoản"
        nhanDangTai="Đang lưu…"
        dangXoa={dangXuLy}
        onClose={() => !dangXuLy && datChon(null)}
        onConfirm={() => void xacNhan()}
      >
        {chon ? (
          <div className="modal-confirm-text">
            <p>
              Xác nhận đã chuyển hoàn <strong>{chon.soTienHoan != null ? dinhDangVnd(chon.soTienHoan) : ''}</strong>{' '}
              cho vé <strong>#{chon.maVe}</strong>?
            </p>
            <p className="muted small">
              Người nhận: <strong>{chon.tenNguoiNhanHoan}</strong> · {chon.tenNganHangHoan} · STK{' '}
              {chon.stkHoan}
            </p>
            <p className="muted small">Doanh thu sẽ được trừ sau khi xác nhận. Khách sẽ nhận thông báo.</p>
          </div>
        ) : null}
      </CuaSoXacNhanXoa>
    </div>
  )
}
