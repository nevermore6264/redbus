import { useEffect, useState } from 'react'
import { khachHttp, moKhoiDuLieu } from '../../nguon/apiClient'
import type { DiemDungChan, PhanHoi, TuyenDuong } from '../../nguon/kieu'
import { dungNguoiDung } from '../../dinhDanh/boiCanhNguoiDung'
import { dungThongBao } from '../../dinhDanh/boiCanhThongBao'
import { TheChua, TieuDeThe } from '../../thanhPhan/theChua'
import { NutBam, NutSuaQt, NutXoaQt } from '../../thanhPhan/nutBam'
import { TruongNhap, TruongChon } from '../../thanhPhan/truongNhap'
import { CuaSo } from '../../thanhPhan/cuaSo'
import { CuaSoXacNhanXoa } from '../../thanhPhan/cuaSoXacNhanXoa'
import { chuanHoaChuoi, soSanhKhongPhanBiet } from '../../tienIch/kiemTraQuanTri'

export function TrangDiemDungChan() {
  const { nguoiDung } = dungNguoiDung()
  const { hienThi } = dungThongBao()
  const laAdmin = nguoiDung?.vaiTro === 'ADMIN'
  const [dsTuyen, datTuyen] = useState<TuyenDuong[]>([])
  const [maTuyen, datMaTuyen] = useState<number | ''>('')
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

  async function taiTuyen() {
    try {
      const t = await moKhoiDuLieu(khachHttp.get<PhanHoi<TuyenDuong[]>>('/tuyen-duong'))
      datTuyen(t)
      if (t.length && maTuyen === '') datMaTuyen(t[0].ma)
    } catch (e: unknown) {
      hienThi({ loai: 'loi', noiDung: e instanceof Error ? e.message : 'Lỗi tải tuyến' })
    }
  }

  async function taiDiem() {
    if (maTuyen === '') return
    try {
      const d = await moKhoiDuLieu(
        khachHttp.get<PhanHoi<DiemDungChan[]>>(`/diem-dung/tuyen/${maTuyen}`),
      )
      datDs(d)
    } catch (e: unknown) {
      hienThi({ loai: 'loi', noiDung: e instanceof Error ? e.message : 'Lỗi tải điểm dừng' })
    }
  }

  useEffect(() => {
    void taiTuyen()
  }, [])

  useEffect(() => {
    void taiDiem()
  }, [maTuyen])

  function moThe() {
    if (maTuyen === '') return
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
    if (maTuyen === '') return
    const tenDiem = chuanHoaChuoi(bieu.tenDiem)
    const loi: Partial<Record<'tenDiem' | 'thuTu' | 'thoiGianDungPhut' | 'chung', string>> = {}
    if (!tenDiem) loi.tenDiem = 'Nhập tên điểm dừng'
    if (bieu.thuTu < 0) loi.thuTu = 'Thứ tự phải từ 0 trở lên'
    if (bieu.thoiGianDungPhut < 0) loi.thoiGianDungPhut = 'Thời gian dừng không hợp lệ'
    if (trungThuTu(bieu.thuTu, sua?.ma)) loi.thuTu = `Thứ tự ${bieu.thuTu} đã có trên tuyến này`
    if (tenDiem && trungTenDiem(tenDiem, sua?.ma)) loi.chung = `Điểm « ${tenDiem} » đã có trên tuyến này`
    datLoiBieu(loi)
    if (Object.keys(loi).length > 0) return

    try {
      const than = { tenDiem, thuTu: bieu.thuTu, thoiGianDungPhut: bieu.thoiGianDungPhut, maTuyen: Number(maTuyen) }
      if (sua) {
        await moKhoiDuLieu(khachHttp.put<PhanHoi<DiemDungChan>>(`/diem-dung/${sua.ma}`, { ...than, ma: sua.ma }))
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
    <div className="admin-page">
      <header className="admin-page__head">
        <h1 className="admin-page__title">Điểm dừng chân</h1>
        <p className="admin-page__sub">Quản lý danh sách điểm dừng theo từng tuyến.</p>
      </header>
      <TheChua padding="lg">
        <TieuDeThe
          title="Chọn tuyến"
          action={
            <TruongChon
              nhan="Tuyến"
              value={maTuyen === '' ? '' : String(maTuyen)}
              onChange={(e) => datMaTuyen(e.target.value ? Number(e.target.value) : '')}
            >
              {dsTuyen.map((t) => (
                <option key={t.ma} value={t.ma}>
                  {t.diemDi} → {t.diemDen}
                </option>
              ))}
            </TruongChon>
          }
        />
        <p style={{ marginTop: '0.75rem' }}>
          <NutBam bien="chinh" onClick={moThe} con="+ Thêm điểm dừng" />
        </p>
      </TheChua>
      <TheChua padding="none">
        <div className="table-scroll">
          <table className="data-table">
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
      </TheChua>
      <CuaSo
        open={mo}
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
          <TruongNhap
            nhan="Tên điểm"
            value={bieu.tenDiem}
            onChange={(e) => datBieu({ ...bieu, tenDiem: e.target.value })}
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
