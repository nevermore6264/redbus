import { useEffect, useState } from 'react'
import { khachHttp, moKhoiDuLieu } from '../../nguon/apiClient'
import type { PhanHoi, TuyenDuong } from '../../nguon/kieu'
import { dungNguoiDung } from '../../dinhDanh/boiCanhNguoiDung'
import { dungThongBao } from '../../dinhDanh/boiCanhThongBao'
import { TheChua, TieuDeThe } from '../../thanhPhan/theChua'
import { NutBam, NutSuaQt, NutXoaQt } from '../../thanhPhan/nutBam'
import { TruongNhap } from '../../thanhPhan/truongNhap'
import { CuaSo } from '../../thanhPhan/cuaSo'
import { CuaSoXacNhanXoa } from '../../thanhPhan/cuaSoXacNhanXoa'
import { chuanHoaChuoi } from '../../tienIch/kiemTraQuanTri'

type BieuTuyen = {
  diemDi: string
  diemDen: string
  khoangCachKm: number
  thoiGianUocTinhPhut: number
  hoatDong: boolean
}

type LoiBieu = Partial<Record<keyof BieuTuyen | 'chung', string>>

const chuanHoaDiem = chuanHoaChuoi

function trungTuyen(ds: TuyenDuong[], diemDi: string, diemDen: string, maLoaiTru?: number) {
  const a = diemDi.toLowerCase()
  const b = diemDen.toLowerCase()
  return ds.some((t) => {
    if (maLoaiTru != null && t.ma === maLoaiTru) return false
    return chuanHoaDiem(t.diemDi).toLowerCase() === a && chuanHoaDiem(t.diemDen).toLowerCase() === b
  })
}

function kiemTraBieu(bieu: BieuTuyen, ds: TuyenDuong[], maLoaiTru?: number): LoiBieu {
  const loi: LoiBieu = {}
  const diemDi = chuanHoaDiem(bieu.diemDi)
  const diemDen = chuanHoaDiem(bieu.diemDen)

  if (!diemDi) loi.diemDi = 'Nhập điểm đi'
  if (!diemDen) loi.diemDen = 'Nhập điểm đến'

  if (diemDi && diemDen && diemDi.toLowerCase() === diemDen.toLowerCase()) {
    loi.diemDen = 'Điểm đến phải khác điểm đi'
  }

  if (!Number.isFinite(bieu.khoangCachKm) || bieu.khoangCachKm <= 0) {
    loi.khoangCachKm = 'Khoảng cách phải lớn hơn 0'
  }

  if (!Number.isFinite(bieu.thoiGianUocTinhPhut) || bieu.thoiGianUocTinhPhut <= 0) {
    loi.thoiGianUocTinhPhut = 'Thời gian ước tính phải lớn hơn 0'
  }

  if (diemDi && diemDen && trungTuyen(ds, diemDi, diemDen, maLoaiTru)) {
    loi.chung = `Tuyến « ${diemDi} — ${diemDen} » đã tồn tại trong hệ thống`
  }

  return loi
}

export function TrangTuyenDuong() {
  const { nguoiDung } = dungNguoiDung()
  const { hienThi } = dungThongBao()
  const laAdmin = nguoiDung?.vaiTro === 'ADMIN'
  const [ds, datDs] = useState<TuyenDuong[]>([])
  const [mo, datMo] = useState(false)
  const [sua, datSua] = useState<TuyenDuong | null>(null)
  const [xoaChon, datXoaChon] = useState<TuyenDuong | null>(null)
  const [dangXoa, datDangXoa] = useState(false)
  const [loiBieu, datLoiBieu] = useState<LoiBieu>({})
  const [bieu, datBieu] = useState<BieuTuyen>({
    diemDi: '',
    diemDen: '',
    khoangCachKm: 0,
    thoiGianUocTinhPhut: 0,
    hoatDong: true,
  })

  async function taiDS() {
    try {
      const x = await moKhoiDuLieu(khachHttp.get<PhanHoi<TuyenDuong[]>>('/tuyen-duong'))
      datDs(x)
    } catch (e: unknown) {
      hienThi({ loai: 'loi', noiDung: e instanceof Error ? e.message : String(e) })
    }
  }

  useEffect(() => {
    void taiDS()
  }, [])

  function moThe() {
    datSua(null)
    datLoiBieu({})
    datBieu({ diemDi: '', diemDen: '', khoangCachKm: 0, thoiGianUocTinhPhut: 0, hoatDong: true })
    datMo(true)
  }

  function moSua(t: TuyenDuong) {
    datSua(t)
    datLoiBieu({})
    datBieu({
      diemDi: t.diemDi,
      diemDen: t.diemDen,
      khoangCachKm: t.khoangCachKm ?? 0,
      thoiGianUocTinhPhut: t.thoiGianUocTinhPhut ?? 0,
      hoatDong: t.hoatDong !== false,
    })
    datMo(true)
  }

  async function luu() {
    const loi = kiemTraBieu(bieu, ds, sua?.ma)
    datLoiBieu(loi)
    if (Object.keys(loi).length > 0) return

    const than = {
      diemDi: chuanHoaDiem(bieu.diemDi),
      diemDen: chuanHoaDiem(bieu.diemDen),
      khoangCachKm: Math.round(bieu.khoangCachKm),
      thoiGianUocTinhPhut: Math.round(bieu.thoiGianUocTinhPhut),
      hoatDong: bieu.hoatDong,
    }

    try {
      if (sua) {
        await moKhoiDuLieu(
          khachHttp.put<PhanHoi<TuyenDuong>>(`/tuyen-duong/${sua.ma}`, { ...than, ma: sua.ma }),
        )
      } else {
        await moKhoiDuLieu(khachHttp.post<PhanHoi<TuyenDuong>>('/tuyen-duong', than))
      }
      datMo(false)
      void taiDS()
      hienThi({ loai: 'thanhCong', noiDung: 'Đã lưu tuyến đường.' })
    } catch (e: unknown) {
      hienThi({ loai: 'loi', noiDung: e instanceof Error ? e.message : 'Lỗi lưu dữ liệu' })
    }
  }

  async function xacNhanXoa() {
    if (!xoaChon) return
    datDangXoa(true)
    try {
      await moKhoiDuLieu(khachHttp.delete<PhanHoi<unknown>>(`/tuyen-duong/${xoaChon.ma}`))
      datXoaChon(null)
      void taiDS()
      hienThi({ loai: 'thanhCong', noiDung: 'Đã xóa tuyến.' })
    } catch (e: unknown) {
      hienThi({ loai: 'loi', noiDung: e instanceof Error ? e.message : 'Lỗi xóa' })
    } finally {
      datDangXoa(false)
    }
  }

  return (
    <div className="admin-page">
      <header className="admin-page__head">
        <h1 className="admin-page__title">Tuyến đường</h1>
        <p className="admin-page__sub">Quản lý điểm đi — điểm đến, quãng đường và thời gian ước tính.</p>
      </header>
      <TheChua padding="none">
        <div className="table-wrap-pad">
          <TieuDeThe
            title="Danh sách tuyến"
            subtitle="Chọn sửa hoặc thêm tuyến mới"
            action={<NutBam bien="chinh" onClick={moThe} con="+ Thêm tuyến" />}
          />
        </div>
        <div className="table-scroll">
          <table className="data-table">
            <thead>
              <tr>
                <th>Mã</th>
                <th>Điểm đi</th>
                <th>Điểm đến</th>
                <th>Km</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {ds.map((r) => (
                <tr key={r.ma}>
                  <td className="mono">{r.ma}</td>
                  <td>{r.diemDi}</td>
                  <td>{r.diemDen}</td>
                  <td>{r.khoangCachKm}</td>
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
        title={sua ? 'Sửa tuyến' : 'Thêm tuyến'}
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
            nhan="Điểm đi"
            value={bieu.diemDi}
            onChange={(e) => datBieu({ ...bieu, diemDi: e.target.value })}
            loi={loiBieu.diemDi}
            required
          />
          <TruongNhap
            nhan="Điểm đến"
            value={bieu.diemDen}
            onChange={(e) => datBieu({ ...bieu, diemDen: e.target.value })}
            loi={loiBieu.diemDen}
            required
          />
          <TruongNhap
            nhan="Khoảng cách (km)"
            type="number"
            min={1}
            value={bieu.khoangCachKm || ''}
            onChange={(e) => datBieu({ ...bieu, khoangCachKm: Number(e.target.value) })}
            loi={loiBieu.khoangCachKm}
          />
          <TruongNhap
            nhan="Thời gian ước tính (phút)"
            type="number"
            min={1}
            value={bieu.thoiGianUocTinhPhut || ''}
            onChange={(e) => datBieu({ ...bieu, thoiGianUocTinhPhut: Number(e.target.value) })}
            loi={loiBieu.thoiGianUocTinhPhut}
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
        title="Xóa tuyến đường"
        nhanNutXoa="Xóa tuyến"
        dangXoa={dangXoa}
        onClose={() => datXoaChon(null)}
        onConfirm={() => void xacNhanXoa()}
      >
        {xoaChon ? (
          <p className="modal-confirm-text">
            Bạn có chắc muốn xóa tuyến{' '}
            <strong>
              {xoaChon.diemDi} — {xoaChon.diemDen}
            </strong>
            ? Thao tác không thể hoàn tác.
          </p>
        ) : null}
      </CuaSoXacNhanXoa>
    </div>
  )
}
