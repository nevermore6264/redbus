import { useEffect, useState } from 'react'
import { khachHttp, moKhoiDuLieu } from '../nguon/apiClient'
import type { DiemDungChan, PhanHoi, TuyenDuong } from '../nguon/kieu'
import { LoTrinhTuyen } from './LoTrinhTuyen'
import { NutBam, NutSuaQt, NutXoaQt } from './nutBam'
import { ChonDiaDanh } from './ChonDiaDanh'
import { TruongNhap } from './truongNhap'
import { CuaSo } from './cuaSo'
import { CuaSoXacNhanXoa } from './cuaSoXacNhanXoa'
import { chuanHoaChuoi, soSanhKhongPhanBiet } from '../tienIch/kiemTraQuanTri'
import { dungThongBao } from '../dinhDanh/boiCanhThongBao'
import { dungNguoiDung } from '../dinhDanh/boiCanhNguoiDung'

interface Props {
  maTuyen: number
  tuyen: Pick<TuyenDuong, 'diemDi' | 'diemDen'>
  onDsThayDoi?: (ds: DiemDungChan[]) => void
}

export function KhungQuanLyDiemDung({ maTuyen, tuyen, onDsThayDoi }: Props) {
  const { hienThi } = dungThongBao()
  const { nguoiDung } = dungNguoiDung()
  const laAdmin = nguoiDung?.vaiTro === 'ADMIN'
  const [ds, datDs] = useState<DiemDungChan[]>([])
  const [mo, datMo] = useState(false)
  const [sua, datSua] = useState<DiemDungChan | null>(null)
  const [xoaChon, datXoaChon] = useState<DiemDungChan | null>(null)
  const [dangXoa, datDangXoa] = useState(false)
  const [loiBieu, datLoiBieu] = useState<
    Partial<Record<'tenDiem' | 'thuTu' | 'thoiGianDungPhut' | 'chung', string>>
  >({})
  const [bieu, datBieu] = useState({ tenDiem: '', thuTu: 0, thoiGianDungPhut: 5 })

  function trungThuTu(thuTu: number, maLoaiTru?: number) {
    return ds.some((d) => {
      if (maLoaiTru != null && d.ma === maLoaiTru) return false
      return d.thuTu === thuTu
    })
  }

  function trungTenDiem(tenDiem: string, maLoaiTru?: number) {
    return ds.some((d) => {
      if (maLoaiTru != null && d.ma === maLoaiTru) return false
      return soSanhKhongPhanBiet(d.tenDiem, tenDiem)
    })
  }

  async function taiDiem() {
    try {
      const d = await moKhoiDuLieu(
        khachHttp.get<PhanHoi<DiemDungChan[]>>(`/diem-dung/tuyen/${maTuyen}`),
      )
      datDs(d)
      onDsThayDoi?.(d)
    } catch (e: unknown) {
      hienThi({ loai: 'loi', noiDung: e instanceof Error ? e.message : 'Lỗi tải điểm dừng' })
    }
  }

  useEffect(() => {
    void taiDiem()
  }, [maTuyen])

  function moThe() {
    datSua(null)
    datLoiBieu({})
    datBieu({ tenDiem: '', thuTu: ds.length, thoiGianDungPhut: 5 })
    datMo(true)
  }

  function moSua(d: DiemDungChan) {
    datSua(d)
    datLoiBieu({})
    datBieu({
      tenDiem: d.tenDiem,
      thuTu: d.thuTu ?? 0,
      thoiGianDungPhut: d.thoiGianDungPhut ?? 5,
    })
    datMo(true)
  }

  async function luu() {
    const tenDiem = chuanHoaChuoi(bieu.tenDiem)
    const loi: Partial<Record<'tenDiem' | 'thuTu' | 'thoiGianDungPhut' | 'chung', string>> = {}
    if (!tenDiem) loi.tenDiem = 'Chọn tỉnh và phường/xã cho điểm dừng'
    if (bieu.thuTu < 0) loi.thuTu = 'Thứ tự phải từ 0 trở lên'
    if (bieu.thoiGianDungPhut < 0) loi.thoiGianDungPhut = 'Thời gian dừng không hợp lệ'
    if (trungThuTu(bieu.thuTu, sua?.ma)) loi.thuTu = `Thứ tự ${bieu.thuTu} đã có trên tuyến này`
    if (tenDiem && trungTenDiem(tenDiem, sua?.ma)) loi.chung = `Điểm « ${tenDiem} » đã có trên tuyến này`
    datLoiBieu(loi)
    if (Object.keys(loi).length > 0) return

    try {
      const than = {
        tenDiem,
        thuTu: bieu.thuTu,
        thoiGianDungPhut: bieu.thoiGianDungPhut,
        maTuyen,
      }
      if (sua) {
        await moKhoiDuLieu(
          khachHttp.put<PhanHoi<DiemDungChan>>(`/diem-dung/${sua.ma}`, { ...than, ma: sua.ma }),
        )
      } else {
        await moKhoiDuLieu(khachHttp.post<PhanHoi<DiemDungChan>>('/diem-dung', than))
      }
      datMo(false)
      void taiDiem()
      hienThi({ loai: 'thanhCong', noiDung: 'Đã lưu điểm dừng.' })
    } catch (e: unknown) {
      hienThi({ loai: 'loi', noiDung: e instanceof Error ? e.message : 'Lỗi lưu' })
    }
  }

  async function xacNhanXoa() {
    if (!xoaChon) return
    datDangXoa(true)
    try {
      await moKhoiDuLieu(khachHttp.delete<PhanHoi<unknown>>(`/diem-dung/${xoaChon.ma}`))
      datXoaChon(null)
      void taiDiem()
      hienThi({ loai: 'thanhCong', noiDung: 'Đã xóa.' })
    } catch (e: unknown) {
      hienThi({ loai: 'loi', noiDung: e instanceof Error ? e.message : 'Lỗi xóa' })
    } finally {
      datDangXoa(false)
    }
  }

  return (
    <div className="khung-diem-dung">
      <LoTrinhTuyen tuyen={tuyen} diemDung={ds} kieu="timeline" />
      <p style={{ margin: '0.75rem 0' }}>
        <NutBam bien="chinh" className="btn--sm" onClick={moThe} con="Thêm điểm dừng" />
      </p>
      {ds.length > 0 ? (
        <div className="table-scroll khung-diem-dung__bang">
          <table className="data-table data-table--compact">
            <thead>
              <tr>
                <th>Thứ tự</th>
                <th>Tên điểm</th>
                <th>Phút dừng</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {ds.map((r) => (
                <tr key={r.ma}>
                  <td>{r.thuTu}</td>
                  <td>{r.tenDiem}</td>
                  <td>{r.thoiGianDungPhut}</td>
                  <td className="row-actions">
                    <NutSuaQt onClick={() => moSua(r)} />
                    {laAdmin ? <NutXoaQt onClick={() => datXoaChon(r)} /> : null}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="muted small">Chưa có điểm dừng trên tuyến này.</p>
      )}

      <CuaSo
        open={mo}
        size="lg"
        title={sua ? 'Sửa điểm dừng' : 'Thêm điểm dừng'}
        onClose={() => datMo(false)}
        footer={
          <>
            <NutBam bien="huy" onClick={() => datMo(false)} con="Hủy" />
            <NutBam bien="chinh" onClick={() => void luu()} con="Lưu" />
          </>
        }
      >
        <div className="form-stack">
          {loiBieu.chung ? <p className="form-alert form-alert--error">{loiBieu.chung}</p> : null}
          <ChonDiaDanh
            bien="dung"
            nhan="Vị trí điểm dừng"
            giaTri={bieu.tenDiem}
            onDoi={(chuoi) => datBieu({ ...bieu, tenDiem: chuoi })}
            loi={loiBieu.tenDiem}
            required
          />
          <TruongNhap
            type="number"
            nhan="Thứ tự"
            min={0}
            value={bieu.thuTu}
            onChange={(e) => datBieu({ ...bieu, thuTu: Number(e.target.value) })}
            loi={loiBieu.thuTu}
            required
          />
          <TruongNhap
            type="number"
            nhan="Phút dừng"
            min={0}
            value={bieu.thoiGianDungPhut}
            onChange={(e) => datBieu({ ...bieu, thoiGianDungPhut: Number(e.target.value) })}
            loi={loiBieu.thoiGianDungPhut}
          />
        </div>
      </CuaSo>

      <CuaSoXacNhanXoa
        open={xoaChon !== null}
        title="Xóa điểm dừng"
        nhanNutXoa="Xóa điểm"
        dangXoa={dangXoa}
        onClose={() => datXoaChon(null)}
        onConfirm={() => void xacNhanXoa()}
      >
        {xoaChon ? (
          <p className="modal-confirm-text">
            Bạn có chắc muốn xóa điểm <strong>{xoaChon.tenDiem}</strong>? Thao tác không thể hoàn tác.
          </p>
        ) : null}
      </CuaSoXacNhanXoa>
    </div>
  )
}
