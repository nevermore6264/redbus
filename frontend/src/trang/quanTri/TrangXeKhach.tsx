import { useEffect, useState } from 'react'
import { khachHttp, moKhoiDuLieu } from '../../nguon/apiClient'
import type { LoaiXe, PhanHoi, XeKhach } from '../../nguon/kieu'
import { dungNguoiDung } from '../../dinhDanh/boiCanhNguoiDung'
import { dungThongBao } from '../../dinhDanh/boiCanhThongBao'
import { TheChua, TieuDeThe } from '../../thanhPhan/theChua'
import { NutBam, NutSuaQt, NutXoaQt } from '../../thanhPhan/nutBam'
import { TruongNhap, TruongChon } from '../../thanhPhan/truongNhap'
import { CuaSo } from '../../thanhPhan/cuaSo'

export function TrangXeKhach() {
  const { nguoiDung } = dungNguoiDung()
  const { hienThi } = dungThongBao()
  const laAdmin = nguoiDung?.vaiTro === 'ADMIN'
  const [ds, datDs] = useState<XeKhach[]>([])
  const [mo, datMo] = useState(false)
  const [sua, datSua] = useState<XeKhach | null>(null)
  const [dsLoai, datDsLoai] = useState<LoaiXe[]>([])
  const [bieu, datBieu] = useState<{
    maLoaiXe: number | ''
    bienSo: string
    hangXe: string
    soCho: number
    hoatDong: boolean
  }>({ maLoaiXe: '', bienSo: '', hangXe: '', soCho: 40, hoatDong: true })

  function tenLoaiXe(maLoai?: number | null) {
    if (maLoai == null) return '—'
    const loai = dsLoai.find((l) => l.ma === maLoai)
    return loai?.ten ?? `#${maLoai}`
  }

  async function taiDS() {
    try {
      const [x, loai] = await Promise.all([
        moKhoiDuLieu(khachHttp.get<PhanHoi<XeKhach[]>>('/xe-khach')),
        moKhoiDuLieu(khachHttp.get<PhanHoi<LoaiXe[]>>('/loai-xe')),
      ])
      datDs(x)
      datDsLoai(loai)
    } catch (e: unknown) {
      hienThi({ loai: 'loi', noiDung: e instanceof Error ? e.message : 'Lỗi tải dữ liệu' })
    }
  }

  useEffect(() => {
    void taiDS()
  }, [])

  function moThe() {
    datSua(null)
    datBieu({
      maLoaiXe: dsLoai[0]?.ma ?? '',
      bienSo: '',
      hangXe: '',
      soCho: 40,
      hoatDong: true,
    })
    datMo(true)
  }

  function moSua(t: XeKhach) {
    datSua(t)
    datBieu({
      maLoaiXe: t.maLoaiXe ?? '',
      bienSo: t.bienSo,
      hangXe: t.hangXe ?? '',
      soCho: t.soCho,
      hoatDong: t.hoatDong !== false,
    })
    datMo(true)
  }

  async function luu() {
    try {
      const payload = {
        ...bieu,
        maLoaiXe: bieu.maLoaiXe === '' ? undefined : bieu.maLoaiXe,
      }
      if (sua) {
        await moKhoiDuLieu(
          khachHttp.put<PhanHoi<XeKhach>>(`/xe-khach/${sua.ma}`, { ...payload, ma: sua.ma }),
        )
      } else {
        await moKhoiDuLieu(khachHttp.post<PhanHoi<XeKhach>>('/xe-khach', payload))
      }
      datMo(false)
      void taiDS()
      hienThi({ loai: 'thanhCong', noiDung: 'Đã lưu xe.' })
    } catch (e: unknown) {
      hienThi({ loai: 'loi', noiDung: e instanceof Error ? e.message : 'Lỗi lưu' })
    }
  }

  async function xoa(ma: number) {
    if (!confirm('Xóa xe này?')) return
    try {
      await moKhoiDuLieu(khachHttp.delete<PhanHoi<unknown>>(`/xe-khach/${ma}`))
      void taiDS()
      hienThi({ loai: 'thanhCong', noiDung: 'Đã xóa xe.' })
    } catch (e: unknown) {
      hienThi({ loai: 'loi', noiDung: e instanceof Error ? e.message : 'Lỗi xóa' })
    }
  }

  return (
    <div className="admin-page">
      <header className="admin-page__head">
        <h1 className="admin-page__title">Xe khách</h1>
        <p className="admin-page__sub">Biển số, loại xe và số chỗ phục vụ sơ đồ ghế.</p>
      </header>
      <TheChua padding="none">
        <div className="table-wrap-pad">
          <TieuDeThe title="Danh sách xe" action={<NutBam bien="chinh" onClick={moThe} con="+ Thêm xe" />} />
        </div>
        <div className="table-scroll">
          <table className="data-table">
            <thead>
              <tr>
                <th>Mã</th>
                <th>Loại xe</th>
                <th>Biển số</th>
                <th>Hãng</th>
                <th>Số chỗ</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {ds.map((r) => (
                <tr key={r.ma}>
                  <td className="mono">{r.ma}</td>
                  <td title={r.maLoaiXe != null ? `Mã loại: ${r.maLoaiXe}` : undefined}>{tenLoaiXe(r.maLoaiXe)}</td>
                  <td>
                    <strong>{r.bienSo}</strong>
                  </td>
                  <td>{r.hangXe}</td>
                  <td>{r.soCho}</td>
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
        title={sua ? 'Sửa xe' : 'Thêm xe'}
        onClose={() => datMo(false)}
        footer={
          <>
            <NutBam bien="huy" onClick={() => datMo(false)} con="Hủy" />
            <NutBam bien="chinh" onClick={() => void luu()} con="Lưu" />
          </>
        }
      >
        <div className="form-stack">
          <TruongChon
            nhan="Loại xe"
            value={bieu.maLoaiXe === '' ? '' : String(bieu.maLoaiXe)}
            onChange={(e) =>
              datBieu({ ...bieu, maLoaiXe: e.target.value ? Number(e.target.value) : '' })
            }
          >
            <option value="">— Chọn loại —</option>
            {dsLoai.map((l) => (
              <option key={l.ma} value={l.ma}>
                {l.ten}
              </option>
            ))}
          </TruongChon>
          <TruongNhap
            nhan="Biển số"
            value={bieu.bienSo}
            onChange={(e) => datBieu({ ...bieu, bienSo: e.target.value })}
            required
          />
          <TruongNhap
            nhan="Hãng xe"
            value={bieu.hangXe}
            onChange={(e) => datBieu({ ...bieu, hangXe: e.target.value })}
          />
          <TruongNhap
            nhan="Số chỗ"
            type="number"
            value={bieu.soCho}
            onChange={(e) => datBieu({ ...bieu, soCho: Number(e.target.value) })}
            required
          />
          <label className="check">
            <input
              type="checkbox"
              checked={bieu.hoatDong}
              onChange={(e) => datBieu({ ...bieu, hoatDong: e.target.checked })}
            />
            Hoạt động
          </label>
        </div>
      </CuaSo>
    </div>
  )
}
