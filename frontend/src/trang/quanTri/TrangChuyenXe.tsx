import { useEffect, useState } from 'react'
import { khachHttp, moKhoiDuLieu } from '../../nguon/apiClient'
import type { KetQuaGenLich, PhanHoi, ChuyenXe, TuyenDuong, XeKhach } from '../../nguon/kieu'
import { dungNguoiDung } from '../../dinhDanh/boiCanhNguoiDung'
import { dungThongBao } from '../../dinhDanh/boiCanhThongBao'
import { TheChua, TieuDeThe } from '../../thanhPhan/theChua'
import { NutBam, NutSuaQt, NutXoaQt } from '../../thanhPhan/nutBam'
import { TruongNhap, TruongChon } from '../../thanhPhan/truongNhap'
import { CuaSo } from '../../thanhPhan/cuaSo'
import { CuaSoXacNhanXoa } from '../../thanhPhan/cuaSoXacNhanXoa'
import { dinhDangNgayGio, dinhDangVnd } from '../../tienIch/dinhDang'

function chuyenDatetimeLocal(iso: string | undefined): string {
  if (!iso) return ''
  const d = new Date(iso)
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`
}

function tenTrangThai(s: string) {
  if (s === 'SCHEDULED') return 'Đã lên lịch'
  if (s === 'CANCELLED') return 'Đã hủy'
  return s
}

export function TrangChuyenXe() {
  const { nguoiDung } = dungNguoiDung()
  const { hienThi } = dungThongBao()
  const laAdmin = nguoiDung?.vaiTro === 'ADMIN'
  const [ds, datDs] = useState<ChuyenXe[]>([])
  const [dsTuyen, datTuyen] = useState<TuyenDuong[]>([])
  const [dsXe, datXe] = useState<XeKhach[]>([])
  const [mo, datMo] = useState(false)
  const [sua, datSua] = useState<ChuyenXe | null>(null)
  const [xoaChon, datXoaChon] = useState<ChuyenXe | null>(null)
  const [dangXoa, datDangXoa] = useState(false)
  const [loiBieu, datLoiBieu] = useState<
    Partial<Record<'maTuyen' | 'maXe' | 'thoiDiemKhoiHanh' | 'thoiDiemDen' | 'giaVe' | 'chung', string>>
  >({})
  const [tuNgayGen, datTuNgayGen] = useState(() => {
    const d = new Date()
    return d.toISOString().slice(0, 10)
  })
  const [soNgayGen, datSoNgayGen] = useState(7)
  const [maTuyenGen, datMaTuyenGen] = useState<number | ''>('')
  const [dangGen, datDangGen] = useState(false)
  const [ketQuaGen, datKetQuaGen] = useState<string | null>(null)

  const [bieu, datBieu] = useState({
    maTuyen: '' as number | '',
    maXe: '' as number | '',
    thoiDiemKhoiHanh: '',
    thoiDiemDen: '',
    giaVe: 0,
    trangThai: 'SCHEDULED',
  })

  function trungChuyen(maTuyen: number, maXe: number, thoiDiemKhoiHanh: string, maLoaiTru?: number) {
    const luc = new Date(thoiDiemKhoiHanh).getTime()
    return ds.some((c) => {
      if (maLoaiTru != null && c.ma === maLoaiTru) return false
      if (c.maTuyen !== maTuyen || c.maXe !== maXe) return false
      return new Date(c.thoiDiemKhoiHanh).getTime() === luc
    })
  }

  async function taiDS() {
    try {
      const [cx, tuyen, xe] = await Promise.all([
        moKhoiDuLieu(khachHttp.get<PhanHoi<ChuyenXe[]>>('/chuyen-xe/toan-bo')),
        moKhoiDuLieu(khachHttp.get<PhanHoi<TuyenDuong[]>>('/tuyen-duong')),
        moKhoiDuLieu(khachHttp.get<PhanHoi<XeKhach[]>>('/xe-khach')),
      ])
      datDs(cx)
      datTuyen(tuyen)
      datXe(xe)
    } catch (e: unknown) {
      hienThi({ loai: 'loi', noiDung: e instanceof Error ? e.message : 'Lỗi tải dữ liệu' })
    }
  }

  useEffect(() => {
    void taiDS()
  }, [])

  function tenTuyen(ma?: number) {
    if (ma == null) return '—'
    const t = dsTuyen.find((x) => x.ma === ma)
    return t ? `${t.diemDi} → ${t.diemDen}` : `#${ma}`
  }

  function hienThiBienSoXe(ma?: number) {
    if (ma == null) return '—'
    const x = dsXe.find((z) => z.ma === ma)
    return x?.bienSo ?? `#${ma}`
  }

  function moThe() {
    datSua(null)
    datLoiBieu({})
    const macDinh = new Date()
    macDinh.setMinutes(0, 0, 0)
    datBieu({
      maTuyen: dsTuyen[0]?.ma ?? '',
      maXe: dsXe[0]?.ma ?? '',
      thoiDiemKhoiHanh: chuyenDatetimeLocal(macDinh.toISOString()),
      thoiDiemDen: '',
      giaVe: 150000,
      trangThai: 'SCHEDULED',
    })
    datMo(true)
  }

  function moSua(c: ChuyenXe) {
    datSua(c)
    datLoiBieu({})
    datBieu({
      maTuyen: c.maTuyen,
      maXe: c.maXe,
      thoiDiemKhoiHanh: chuyenDatetimeLocal(c.thoiDiemKhoiHanh),
      thoiDiemDen: c.thoiDiemDen ? chuyenDatetimeLocal(c.thoiDiemDen) : '',
      giaVe: Number(c.giaVe),
      trangThai: c.trangThai || 'SCHEDULED',
    })
    datMo(true)
  }

  async function luu() {
    const loi: Partial<
      Record<'maTuyen' | 'maXe' | 'thoiDiemKhoiHanh' | 'thoiDiemDen' | 'giaVe' | 'chung', string>
    > = {}
    if (bieu.maTuyen === '') loi.maTuyen = 'Chọn tuyến'
    if (bieu.maXe === '') loi.maXe = 'Chọn xe'
    if (!bieu.thoiDiemKhoiHanh) loi.thoiDiemKhoiHanh = 'Chọn giờ khởi hành'
    if (!Number.isFinite(bieu.giaVe) || bieu.giaVe <= 0) loi.giaVe = 'Giá vé phải lớn hơn 0'
    if (
      bieu.thoiDiemDen &&
      bieu.thoiDiemKhoiHanh &&
      new Date(bieu.thoiDiemDen) <= new Date(bieu.thoiDiemKhoiHanh)
    ) {
      loi.thoiDiemDen = 'Giờ đến phải sau giờ khởi hành'
    }
    if (
      bieu.maTuyen !== '' &&
      bieu.maXe !== '' &&
      bieu.thoiDiemKhoiHanh &&
      trungChuyen(Number(bieu.maTuyen), Number(bieu.maXe), bieu.thoiDiemKhoiHanh, sua?.ma)
    ) {
      loi.chung = 'Chuyến trùng tuyến, xe và giờ khởi hành đã tồn tại'
    }
    datLoiBieu(loi)
    if (Object.keys(loi).length > 0) return

    const than = {
      maTuyen: Number(bieu.maTuyen),
      maXe: Number(bieu.maXe),
      thoiDiemKhoiHanh: new Date(bieu.thoiDiemKhoiHanh).toISOString(),
      thoiDiemDen: bieu.thoiDiemDen ? new Date(bieu.thoiDiemDen).toISOString() : undefined,
      giaVe: bieu.giaVe,
      trangThai: bieu.trangThai,
    }
    try {
      if (sua) {
        await moKhoiDuLieu(
          khachHttp.put<PhanHoi<ChuyenXe>>(`/chuyen-xe/${sua.ma}`, {
            ...than,
            ma: sua.ma,
          }),
        )
      } else {
        await moKhoiDuLieu(khachHttp.post<PhanHoi<ChuyenXe>>('/chuyen-xe', than))
      }
      datMo(false)
      void taiDS()
      hienThi({ loai: 'thanhCong', noiDung: 'Đã lưu chuyến.' })
    } catch (e: unknown) {
      hienThi({ loai: 'loi', noiDung: e instanceof Error ? e.message : 'Lỗi lưu' })
    }
  }

  async function genLich() {
    datDangGen(true)
    datKetQuaGen(null)
    try {
      const kq = await moKhoiDuLieu(
        khachHttp.post<PhanHoi<KetQuaGenLich>>('/chuyen-xe/gen-lich', {
          tuNgay: tuNgayGen,
          soNgay: soNgayGen,
          maTuyen: maTuyenGen === '' ? null : maTuyenGen,
        }),
      )
      const boQua =
        kq.cacNgayDaBoQua?.length > 0 ? ` · Bỏ qua ${kq.soNgayDaBoQua} ngày đã có lịch` : ''
      datKetQuaGen(
        `Đã tạo ${kq.soChuyenDaTao} chuyến trên ${kq.soNgayDaGen} ngày${boQua}.` +
          (kq.cacNgayDaGen?.length ? ` Ngày gen: ${kq.cacNgayDaGen.join(', ')}.` : ''),
      )
      void taiDS()
      hienThi({ loai: 'thanhCong', noiDung: `Đã gen ${kq.soChuyenDaTao} chuyến.` })
    } catch (e: unknown) {
      hienThi({ loai: 'loi', noiDung: e instanceof Error ? e.message : 'Lỗi gen lịch' })
    } finally {
      datDangGen(false)
    }
  }

  async function xacNhanXoa() {
    if (!xoaChon) return
    datDangXoa(true)
    try {
      await moKhoiDuLieu(khachHttp.delete<PhanHoi<unknown>>(`/chuyen-xe/${xoaChon.ma}`))
      datXoaChon(null)
      void taiDS()
      hienThi({ loai: 'thanhCong', noiDung: 'Đã xóa chuyến.' })
    } catch (e: unknown) {
      hienThi({ loai: 'loi', noiDung: e instanceof Error ? e.message : 'Lỗi xóa' })
    } finally {
      datDangXoa(false)
    }
  }

  return (
    <div className="admin-page">
      <header className="admin-page__head">
        <h1 className="admin-page__title">Chuyến xe</h1>
        <p className="admin-page__sub">Gán tuyến, xe, giờ khởi hành và giá vé cho từng chuyến.</p>
      </header>
      {laAdmin ? (
      <TheChua padding="lg">
        <TieuDeThe
          title="Gen lịch tự động"
          subtitle="Chỉ gen các ngày chưa có chuyến (6h, 9h, 13h, 17h, 21h mỗi tuyến)"
        />
        <div className="gen-lich-panel">
          <TruongNhap
            nhan="Từ ngày"
            type="date"
            value={tuNgayGen}
            onChange={(e) => datTuNgayGen(e.target.value)}
          />
          <TruongNhap
            nhan="Số ngày"
            type="number"
            min={1}
            max={31}
            value={soNgayGen}
            onChange={(e) => datSoNgayGen(Math.max(1, Math.min(31, Number(e.target.value) || 1)))}
          />
          <TruongChon
            nhan="Tuyến (tùy chọn)"
            value={maTuyenGen === '' ? '' : String(maTuyenGen)}
            onChange={(e) => datMaTuyenGen(e.target.value ? Number(e.target.value) : '')}
          >
            <option value="">Tất cả tuyến</option>
            {dsTuyen.map((t) => (
              <option key={t.ma} value={t.ma}>
                {t.diemDi} → {t.diemDen}
              </option>
            ))}
          </TruongChon>
          <div className="gen-lich-panel__nut">
            <NutBam bien="chinh" dangTai={dangGen} onClick={() => void genLich()} con="Gen lịch" />
          </div>
        </div>
        {ketQuaGen ? <p className="gen-lich-panel__ket-qua muted small">{ketQuaGen}</p> : null}
      </TheChua>
      ) : null}

      <TheChua padding="none">
        <div className="table-wrap-pad">
          <TieuDeThe title="Danh sách chuyến" action={<NutBam bien="chinh" onClick={moThe} con="+ Thêm chuyến" />} />
        </div>
        <div className="table-scroll">
          <table className="data-table">
            <thead>
              <tr>
                <th>Mã</th>
                <th>Tuyến</th>
                <th>Xe</th>
                <th>Khởi hành</th>
                <th>Giá vé</th>
                <th>Trạng thái</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {ds.map((r) => (
                <tr key={r.ma}>
                  <td className="mono">{r.ma}</td>
                  <td title={`Mã tuyến: ${r.maTuyen}`}>
                    <strong>{tenTuyen(r.maTuyen)}</strong>
                  </td>
                  <td title={`Mã xe: ${r.maXe}`}>{hienThiBienSoXe(r.maXe)}</td>
                  <td>{dinhDangNgayGio(r.thoiDiemKhoiHanh)}</td>
                  <td>{dinhDangVnd(r.giaVe)}</td>
                  <td>
                    <span className="muted">{tenTrangThai(r.trangThai)}</span>
                    <span className="mono small muted"> ({r.trangThai})</span>
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
        title={sua ? 'Sửa chuyến' : 'Thêm chuyến'}
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
            nhan="Tuyến"
            value={bieu.maTuyen === '' ? '' : String(bieu.maTuyen)}
            onChange={(e) =>
              datBieu({ ...bieu, maTuyen: e.target.value ? Number(e.target.value) : '' })
            }
            loi={loiBieu.maTuyen}
            required
          >
            <option value="">— Chọn tuyến —</option>
            {dsTuyen.map((t) => (
              <option key={t.ma} value={t.ma}>
                {t.diemDi} → {t.diemDen} ({t.ma})
              </option>
            ))}
          </TruongChon>
          <TruongChon
            nhan="Xe"
            value={bieu.maXe === '' ? '' : String(bieu.maXe)}
            onChange={(e) => datBieu({ ...bieu, maXe: e.target.value ? Number(e.target.value) : '' })}
            loi={loiBieu.maXe}
            required
          >
            <option value="">— Chọn xe —</option>
            {dsXe.map((x) => (
              <option key={x.ma} value={x.ma}>
                {x.bienSo} ({x.ma})
              </option>
            ))}
          </TruongChon>
          <TruongNhap
            nhan="Khởi hành"
            type="datetime-local"
            value={bieu.thoiDiemKhoiHanh}
            onChange={(e) => datBieu({ ...bieu, thoiDiemKhoiHanh: e.target.value })}
            loi={loiBieu.thoiDiemKhoiHanh}
            required
          />
          <TruongNhap
            nhan="Đến (tùy chọn)"
            type="datetime-local"
            value={bieu.thoiDiemDen}
            onChange={(e) => datBieu({ ...bieu, thoiDiemDen: e.target.value })}
            loi={loiBieu.thoiDiemDen}
          />
          <TruongNhap
            nhan="Giá vé (VNĐ)"
            type="number"
            min={1}
            value={bieu.giaVe}
            onChange={(e) => datBieu({ ...bieu, giaVe: Number(e.target.value) })}
            loi={loiBieu.giaVe}
            required
          />
          <TruongChon
            nhan="Trạng thái"
            value={bieu.trangThai}
            onChange={(e) => datBieu({ ...bieu, trangThai: e.target.value })}
          >
            <option value="SCHEDULED">Đã lên lịch (SCHEDULED)</option>
            <option value="CANCELLED">Đã hủy (CANCELLED)</option>
          </TruongChon>
        </div>
      </CuaSo>

      <CuaSoXacNhanXoa
        open={xoaChon !== null}
        title="Xóa chuyến xe"
        nhanNutXoa="Xóa chuyến"
        dangXoa={dangXoa}
        onClose={() => datXoaChon(null)}
        onConfirm={() => void xacNhanXoa()}
      >
        {xoaChon ? (
          <p className="modal-confirm-text">
            Bạn có chắc muốn xóa chuyến <strong>#{xoaChon.ma}</strong> ({tenTuyen(xoaChon.maTuyen)},{' '}
            {hienThiBienSoXe(xoaChon.maXe)})? Thao tác không thể hoàn tác.
          </p>
        ) : null}
      </CuaSoXacNhanXoa>
    </div>
  )
}
