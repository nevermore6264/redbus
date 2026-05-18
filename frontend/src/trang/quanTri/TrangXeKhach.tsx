import { useEffect, useMemo, useState } from 'react'
import { khachHttp, moKhoiDuLieu } from '../../nguon/apiClient'
import type { LoaiXe, PhanHoi, XeKhach } from '../../nguon/kieu'
import { dungNguoiDung } from '../../dinhDanh/boiCanhNguoiDung'
import { dungThongBao } from '../../dinhDanh/boiCanhThongBao'
import { TheChua, TieuDeThe } from '../../thanhPhan/theChua'
import { NutBam, NutSuaQt, NutXoaQt } from '../../thanhPhan/nutBam'
import { TruongNhap, TruongChon } from '../../thanhPhan/truongNhap'
import { CuaSo } from '../../thanhPhan/cuaSo'
import { CuaSoXacNhanXoa } from '../../thanhPhan/cuaSoXacNhanXoa'
import { hopNhatHangXe } from '../../tienIch/danhSachHangXe'
import { chuanHoaBienSo } from '../../tienIch/kiemTraQuanTri'

export function TrangXeKhach() {
  const { nguoiDung } = dungNguoiDung()
  const { hienThi } = dungThongBao()
  const laAdmin = nguoiDung?.vaiTro === 'ADMIN'
  const [ds, datDs] = useState<XeKhach[]>([])
  const [mo, datMo] = useState(false)
  const [sua, datSua] = useState<XeKhach | null>(null)
  const [dsLoai, datDsLoai] = useState<LoaiXe[]>([])
  const [xoaChon, datXoaChon] = useState<XeKhach | null>(null)
  const [dangXoa, datDangXoa] = useState(false)
  const [loiBieu, datLoiBieu] = useState<Partial<Record<'maLoaiXe' | 'bienSo' | 'soCho' | 'chung', string>>>({})
  const [bieu, datBieu] = useState<{
    maLoaiXe: number | ''
    bienSo: string
    hangXe: string
    soCho: number
    hoatDong: boolean
  }>({ maLoaiXe: '', bienSo: '', hangXe: '', soCho: 40, hoatDong: true })

  const dsHangXe = useMemo(() => hopNhatHangXe(ds.map((x) => x.hangXe)), [ds])

  function trungBienSo(bienSo: string, maLoaiTru?: number) {
    const a = chuanHoaBienSo(bienSo)
    return ds.some((x) => {
      if (maLoaiTru != null && x.ma === maLoaiTru) return false
      return chuanHoaBienSo(x.bienSo) === a
    })
  }

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
    datLoiBieu({})
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
    datLoiBieu({})
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
    const loi: Partial<Record<'maLoaiXe' | 'bienSo' | 'soCho' | 'chung', string>> = {}
    const bienSo = chuanHoaBienSo(bieu.bienSo)
    if (bieu.maLoaiXe === '') loi.maLoaiXe = 'Chọn loại xe'
    if (!bienSo) loi.bienSo = 'Nhập biển số'
    if (!Number.isFinite(bieu.soCho) || bieu.soCho <= 0) loi.soCho = 'Số chỗ phải lớn hơn 0'
    if (bienSo && trungBienSo(bienSo, sua?.ma)) {
      loi.chung = `Biển số « ${bienSo} » đã tồn tại`
    }
    datLoiBieu(loi)
    if (Object.keys(loi).length > 0) return

    try {
      const payload = {
        maLoaiXe: bieu.maLoaiXe === '' ? undefined : bieu.maLoaiXe,
        bienSo,
        hangXe: bieu.hangXe.trim(),
        soCho: bieu.soCho,
        hoatDong: bieu.hoatDong,
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

  async function xacNhanXoa() {
    if (!xoaChon) return
    datDangXoa(true)
    try {
      await moKhoiDuLieu(khachHttp.delete<PhanHoi<unknown>>(`/xe-khach/${xoaChon.ma}`))
      datXoaChon(null)
      void taiDS()
      hienThi({ loai: 'thanhCong', noiDung: 'Đã xóa xe.' })
    } catch (e: unknown) {
      hienThi({ loai: 'loi', noiDung: e instanceof Error ? e.message : 'Lỗi xóa' })
    } finally {
      datDangXoa(false)
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
          {loiBieu.chung ? <p className="form-alert form-alert--error">{loiBieu.chung}</p> : null}
          <TruongChon
            nhan="Loại xe"
            value={bieu.maLoaiXe === '' ? '' : String(bieu.maLoaiXe)}
            onChange={(e) =>
              datBieu({ ...bieu, maLoaiXe: e.target.value ? Number(e.target.value) : '' })
            }
            loi={loiBieu.maLoaiXe}
            required
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
            loi={loiBieu.bienSo}
            required
          />
          <TruongChon
            nhan="Hãng xe"
            value={bieu.hangXe}
            onChange={(e) => datBieu({ ...bieu, hangXe: e.target.value })}
          >
            <option value="">— Chọn hãng —</option>
            {dsHangXe.map((h) => (
              <option key={h} value={h}>
                {h}
              </option>
            ))}
          </TruongChon>
          <TruongNhap
            nhan="Số chỗ"
            type="number"
            min={1}
            value={bieu.soCho}
            onChange={(e) => datBieu({ ...bieu, soCho: Number(e.target.value) })}
            loi={loiBieu.soCho}
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

      <CuaSoXacNhanXoa
        open={xoaChon !== null}
        title="Xóa xe khách"
        nhanNutXoa="Xóa xe"
        dangXoa={dangXoa}
        onClose={() => datXoaChon(null)}
        onConfirm={() => void xacNhanXoa()}
      >
        {xoaChon ? (
          <p className="modal-confirm-text">
            Bạn có chắc muốn xóa xe biển số <strong>{xoaChon.bienSo}</strong>? Thao tác không thể hoàn tác.
          </p>
        ) : null}
      </CuaSoXacNhanXoa>
    </div>
  )
}
