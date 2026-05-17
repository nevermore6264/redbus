import { useEffect, useState } from 'react'
import { khachHttp, moKhoiDuLieu } from '../../nguon/apiClient'
import type { KhuyenMai, PhanHoi } from '../../nguon/kieu'
import { dungNguoiDung } from '../../dinhDanh/boiCanhNguoiDung'
import { dungThongBao } from '../../dinhDanh/boiCanhThongBao'
import { TheChua, TieuDeThe } from '../../thanhPhan/theChua'
import { NutBam, NutSuaQt, NutXoaQt } from '../../thanhPhan/nutBam'
import { TruongNhap } from '../../thanhPhan/truongNhap'
import { CuaSo } from '../../thanhPhan/cuaSo'
import { CuaSoXacNhanXoa } from '../../thanhPhan/cuaSoXacNhanXoa'
import { chuanHoaMaCode } from '../../tienIch/kiemTraQuanTri'

function raLocal(iso: string | undefined): string {
  if (!iso) return ''
  const d = new Date(iso)
  const p = (n: number) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}T${p(d.getHours())}:${p(d.getMinutes())}`
}

type BieuKm = {
  maCode: string
  tieuDe: string
  phanTramGiam: number
  soTienGiamToiDa: number
  ngayBatDau: string
  ngayKetThuc: string
  soLanToiDa: number | ''
  hoatDong: boolean
}

type LoiBieu = Partial<Record<keyof BieuKm | 'chung', string>>

function trungMaCode(ds: KhuyenMai[], maCode: string, maLoaiTru?: number) {
  const a = chuanHoaMaCode(maCode).toLowerCase()
  return ds.some((k) => {
    if (maLoaiTru != null && k.ma === maLoaiTru) return false
    return chuanHoaMaCode(k.maCode).toLowerCase() === a
  })
}

function kiemTraBieu(bieu: BieuKm, ds: KhuyenMai[], maLoaiTru?: number): LoiBieu {
  const loi: LoiBieu = {}
  const maCode = chuanHoaMaCode(bieu.maCode)

  if (!maCode) loi.maCode = 'Nhập mã code'
  if (!bieu.ngayBatDau || !bieu.ngayKetThuc) loi.ngayBatDau = 'Chọn thời hạn hiệu lực'
  if (bieu.ngayBatDau && bieu.ngayKetThuc && new Date(bieu.ngayKetThuc) <= new Date(bieu.ngayBatDau)) {
    loi.ngayKetThuc = 'Ngày kết thúc phải sau ngày bắt đầu'
  }
  if (!Number.isFinite(bieu.phanTramGiam) || bieu.phanTramGiam <= 0 || bieu.phanTramGiam > 100) {
    loi.phanTramGiam = 'Phần trăm giảm từ 1 đến 100'
  }
  if (maCode && trungMaCode(ds, maCode, maLoaiTru)) {
    loi.chung = `Mã « ${maCode} » đã tồn tại trong hệ thống`
  }
  return loi
}

export function TrangKhuyenMai() {
  const { nguoiDung } = dungNguoiDung()
  const { hienThi } = dungThongBao()
  const laAdmin = nguoiDung?.vaiTro === 'ADMIN'
  const [ds, datDs] = useState<KhuyenMai[]>([])
  const [mo, datMo] = useState(false)
  const [sua, datSua] = useState<KhuyenMai | null>(null)
  const [xoaChon, datXoaChon] = useState<KhuyenMai | null>(null)
  const [dangXoa, datDangXoa] = useState(false)
  const [loiBieu, datLoiBieu] = useState<LoiBieu>({})
  const [bieu, datBieu] = useState<BieuKm>({
    maCode: '',
    tieuDe: '',
    phanTramGiam: 10,
    soTienGiamToiDa: 50000,
    ngayBatDau: '',
    ngayKetThuc: '',
    soLanToiDa: 1000,
    hoatDong: true,
  })

  async function taiDS() {
    try {
      const x = await moKhoiDuLieu(khachHttp.get<PhanHoi<KhuyenMai[]>>('/khuyen-mai'))
      datDs(x)
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
    const a = new Date()
    const b = new Date()
    b.setMonth(b.getMonth() + 6)
    datBieu({
      maCode: '',
      tieuDe: '',
      phanTramGiam: 10,
      soTienGiamToiDa: 50000,
      ngayBatDau: raLocal(a.toISOString()),
      ngayKetThuc: raLocal(b.toISOString()),
      soLanToiDa: 1000,
      hoatDong: true,
    })
    datMo(true)
  }

  function moSua(k: KhuyenMai) {
    datSua(k)
    datLoiBieu({})
    datBieu({
      maCode: k.maCode,
      tieuDe: k.tieuDe ?? '',
      phanTramGiam: Number(k.phanTramGiam),
      soTienGiamToiDa: k.soTienGiamToiDa != null ? Number(k.soTienGiamToiDa) : 0,
      ngayBatDau: raLocal(k.ngayBatDau),
      ngayKetThuc: raLocal(k.ngayKetThuc),
      soLanToiDa: k.soLanToiDa ?? '',
      hoatDong: k.hoatDong !== false,
    })
    datMo(true)
  }

  async function luu() {
    const loi = kiemTraBieu(bieu, ds, sua?.ma)
    datLoiBieu(loi)
    if (Object.keys(loi).length > 0) return

    const than = {
      maCode: chuanHoaMaCode(bieu.maCode),
      tieuDe: bieu.tieuDe.trim(),
      phanTramGiam: bieu.phanTramGiam,
      soTienGiamToiDa: bieu.soTienGiamToiDa,
      ngayBatDau: new Date(bieu.ngayBatDau).toISOString(),
      ngayKetThuc: new Date(bieu.ngayKetThuc).toISOString(),
      soLanToiDa: bieu.soLanToiDa === '' ? undefined : bieu.soLanToiDa,
      soLanDaDung: sua?.soLanDaDung ?? 0,
      hoatDong: bieu.hoatDong,
    }
    try {
      if (sua) {
        await moKhoiDuLieu(khachHttp.put<PhanHoi<KhuyenMai>>(`/khuyen-mai/${sua.ma}`, { ...than, ma: sua.ma }))
      } else {
        await moKhoiDuLieu(khachHttp.post<PhanHoi<KhuyenMai>>('/khuyen-mai', than))
      }
      datMo(false)
      void taiDS()
      hienThi({ loai: 'thanhCong', noiDung: 'Đã lưu khuyến mãi.' })
    } catch (e: unknown) {
      hienThi({ loai: 'loi', noiDung: e instanceof Error ? e.message : 'Lỗi lưu' })
    }
  }

  async function xacNhanXoa() {
    if (!xoaChon) return
    datDangXoa(true)
    try {
      await moKhoiDuLieu(khachHttp.delete<PhanHoi<unknown>>(`/khuyen-mai/${xoaChon.ma}`))
      datXoaChon(null)
      void taiDS()
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
        <h1 className="admin-page__title">Khuyến mãi</h1>
        <p className="admin-page__sub">Mã giảm giá, thời hạn và giới hạn lượt sử dụng.</p>
      </header>
      <TheChua padding="none">
        <div className="table-wrap-pad">
          <TieuDeThe title="Danh sách mã" action={<NutBam bien="chinh" onClick={moThe} con="+ Thêm mã" />} />
        </div>
        <div className="table-scroll">
          <table className="data-table">
            <thead>
              <tr>
                <th>Mã</th>
                <th>Giảm %</th>
                <th>Đã dùng</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {ds.map((r) => (
                <tr key={r.ma}>
                  <td className="mono">{r.maCode}</td>
                  <td>{r.phanTramGiam}%</td>
                  <td>
                    {r.soLanDaDung ?? 0}/{r.soLanToiDa ?? '∞'}
                  </td>
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
        title={sua ? 'Sửa khuyến mãi' : 'Thêm khuyến mãi'}
        onClose={() => datMo(false)}
        size="lg"
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
            nhan="Mã code"
            value={bieu.maCode}
            onChange={(e) => datBieu({ ...bieu, maCode: e.target.value })}
            loi={loiBieu.maCode}
            required
          />
          <TruongNhap
            nhan="Tiêu đề"
            value={bieu.tieuDe}
            onChange={(e) => datBieu({ ...bieu, tieuDe: e.target.value })}
          />
          <TruongNhap
            type="number"
            nhan="Phần trăm giảm"
            min={1}
            max={100}
            value={bieu.phanTramGiam}
            onChange={(e) => datBieu({ ...bieu, phanTramGiam: Number(e.target.value) })}
            loi={loiBieu.phanTramGiam}
            required
          />
          <TruongNhap
            type="number"
            nhan="Tối đa giảm (VNĐ)"
            value={bieu.soTienGiamToiDa}
            onChange={(e) => datBieu({ ...bieu, soTienGiamToiDa: Number(e.target.value) })}
          />
          <TruongNhap
            type="datetime-local"
            nhan="Từ ngày"
            value={bieu.ngayBatDau}
            onChange={(e) => datBieu({ ...bieu, ngayBatDau: e.target.value })}
            loi={loiBieu.ngayBatDau}
            required
          />
          <TruongNhap
            type="datetime-local"
            nhan="Đến ngày"
            value={bieu.ngayKetThuc}
            onChange={(e) => datBieu({ ...bieu, ngayKetThuc: e.target.value })}
            loi={loiBieu.ngayKetThuc}
            required
          />
          <TruongNhap
            type="number"
            nhan="Giới hạn lượt (để trống = không giới hạn)"
            value={bieu.soLanToiDa === '' ? '' : bieu.soLanToiDa}
            onChange={(e) => datBieu({ ...bieu, soLanToiDa: e.target.value ? Number(e.target.value) : '' })}
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
        title="Xóa khuyến mãi"
        nhanNutXoa="Xóa mã"
        dangXoa={dangXoa}
        onClose={() => datXoaChon(null)}
        onConfirm={() => void xacNhanXoa()}
      >
        {xoaChon ? (
          <p className="modal-confirm-text">
            Bạn có chắc muốn xóa mã <strong>{xoaChon.maCode}</strong>? Thao tác không thể hoàn tác.
          </p>
        ) : null}
      </CuaSoXacNhanXoa>
    </div>
  )
}
