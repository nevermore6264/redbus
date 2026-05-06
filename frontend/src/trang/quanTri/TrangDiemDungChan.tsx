import { useEffect, useState } from 'react'
import { khachHttp, moKhoiDuLieu } from '../../nguon/apiClient'
import type { DiemDungChan, PhanHoi, TuyenDuong } from '../../nguon/kieu'
import { dungNguoiDung } from '../../dinhDanh/boiCanhNguoiDung'
import { dungThongBao } from '../../dinhDanh/boiCanhThongBao'
import { TheChua, TieuDeThe } from '../../thanhPhan/theChua'
import { NutBam, NutSuaQt, NutXoaQt } from '../../thanhPhan/nutBam'
import { TruongNhap, TruongChon } from '../../thanhPhan/truongNhap'
import { CuaSo } from '../../thanhPhan/cuaSo'

export function TrangDiemDungChan() {
  const { nguoiDung } = dungNguoiDung()
  const { hienThi } = dungThongBao()
  const laAdmin = nguoiDung?.vaiTro === 'ADMIN'
  const [dsTuyen, datTuyen] = useState<TuyenDuong[]>([])
  const [maTuyen, datMaTuyen] = useState<number | ''>('')
  const [ds, datDs] = useState<DiemDungChan[]>([])
  const [mo, datMo] = useState(false)
  const [sua, datSua] = useState<DiemDungChan | null>(null)
  const [bieu, datBieu] = useState({ tenDiem: '', thuTu: 0, thoiGianDungPhut: 5 })

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
    datBieu({ tenDiem: '', thuTu: ds.length, thoiGianDungPhut: 5 })
    datMo(true)
  }

  function moSua(d: DiemDungChan) {
    datSua(d)
    datBieu({
      tenDiem: d.tenDiem,
      thuTu: d.thuTu ?? 0,
      thoiGianDungPhut: d.thoiGianDungPhut ?? 5,
    })
    datMo(true)
  }

  async function luu() {
    if (maTuyen === '') return
    try {
      const than = { ...bieu, maTuyen: Number(maTuyen) }
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

  async function xoa(ma: number) {
    if (!confirm('Xóa điểm dừng này?')) return
    try {
      await moKhoiDuLieu(khachHttp.delete<PhanHoi<unknown>>(`/diem-dung/${ma}`))
      void taiDiem()
      hienThi({ loai: 'thanhCong', noiDung: 'Đã xóa.' })
    } catch (e: unknown) {
      hienThi({ loai: 'loi', noiDung: e instanceof Error ? e.message : 'Lỗi xóa' })
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
                    {laAdmin ? <NutXoaQt onClick={() => void xoa(r.ma)} /> : null}
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
          <TruongNhap
            nhan="Tên điểm"
            value={bieu.tenDiem}
            onChange={(e) => datBieu({ ...bieu, tenDiem: e.target.value })}
            required
          />
          <TruongNhap
            type="number"
            nhan="Thứ tự"
            value={bieu.thuTu}
            onChange={(e) => datBieu({ ...bieu, thuTu: Number(e.target.value) })}
          />
          <TruongNhap
            type="number"
            nhan="Phút dừng"
            value={bieu.thoiGianDungPhut}
            onChange={(e) => datBieu({ ...bieu, thoiGianDungPhut: Number(e.target.value) })}
          />
        </div>
      </CuaSo>
    </div>
  )
}
