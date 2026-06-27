import { useEffect, useMemo, useState } from 'react'
import { Bus, CalendarPlus, Route, Search } from 'lucide-react'
import { khachHttp, moKhoiDuLieu } from '../../nguon/apiClient'
import type { KetQuaGenLich, PhanHoi, ChuyenXe, TuyenDuong, XeKhach } from '../../nguon/kieu'
import { dungNguoiDung } from '../../dinhDanh/boiCanhNguoiDung'
import { dungThongBao } from '../../dinhDanh/boiCanhThongBao'
import { TheChua } from '../../thanhPhan/theChua'
import { NutBam, NutSuaQt, NutXoaQt } from '../../thanhPhan/nutBam'
import { TruongNhap, TruongChon } from '../../thanhPhan/truongNhap'
import { CuaSo } from '../../thanhPhan/cuaSo'
import { CuaSoXacNhanXoa } from '../../thanhPhan/cuaSoXacNhanXoa'
import { dinhDangNgayGio, dinhDangVnd, apiSangDatetimeLocal, datetimeLocalSangApi, gioHienTaiDatetimeLocal, ngayHienTai } from '../../tienIch/dinhDang'

function BadgeTrangThai({ trangThai }: { trangThai: string }) {
  if (trangThai === 'CANCELLED') {
    return <span className="badge badge--muted">Đã hủy</span>
  }
  return <span className="badge badge--ok">Đã lên lịch</span>
}

export function TrangChuyenXe() {
  const { nguoiDung } = dungNguoiDung()
  const { hienThi } = dungThongBao()
  const laAdmin = nguoiDung?.vaiTro === 'ADMIN'
  const [ds, datDs] = useState<ChuyenXe[]>([])
  const [dsTuyen, datTuyen] = useState<TuyenDuong[]>([])
  const [dsXe, datXe] = useState<XeKhach[]>([])
  const [tai, datTai] = useState(true)
  const [mo, datMo] = useState(false)
  const [sua, datSua] = useState<ChuyenXe | null>(null)
  const [xoaChon, datXoaChon] = useState<ChuyenXe | null>(null)
  const [dangXoa, datDangXoa] = useState(false)
  const [loiBieu, datLoiBieu] = useState<
    Partial<Record<'maTuyen' | 'maXe' | 'thoiDiemKhoiHanh' | 'thoiDiemDen' | 'giaVe' | 'chung', string>>
  >({})
  const [tuNgayGen, datTuNgayGen] = useState(() => ngayHienTai())
  const minNgayGen = ngayHienTai()
  const [soNgayGen, datSoNgayGen] = useState(7)
  const [maTuyenGen, datMaTuyenGen] = useState<number | ''>('')
  const [dangGen, datDangGen] = useState(false)
  const [ketQuaGen, datKetQuaGen] = useState<string | null>(null)
  const [tuKhoa, datTuKhoa] = useState('')
  const [locTuyen, datLocTuyen] = useState<number | ''>('')
  const [locTrangThai, datLocTrangThai] = useState('')

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
    datTai(true)
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
    } finally {
      datTai(false)
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

  const thongKe = useMemo(() => {
    let lenLich = 0
    let huy = 0
    for (const c of ds) {
      if (c.trangThai === 'CANCELLED') huy++
      else lenLich++
    }
    return { tong: ds.length, lenLich, huy }
  }, [ds])

  const dsLoc = useMemo(() => {
    const q = tuKhoa.trim().toLowerCase()
    return ds.filter((c) => {
      if (locTuyen !== '' && c.maTuyen !== locTuyen) return false
      if (locTrangThai !== '' && c.trangThai !== locTrangThai) return false
      if (!q) return true
      const chuoi = [
        String(c.ma),
        tenTuyen(c.maTuyen),
        hienThiBienSoXe(c.maXe),
        dinhDangNgayGio(c.thoiDiemKhoiHanh),
        String(c.giaVe),
      ]
        .join(' ')
        .toLowerCase()
      return chuoi.includes(q)
    })
  }, [ds, tuKhoa, locTuyen, locTrangThai, dsTuyen, dsXe])

  function moThe() {
    datSua(null)
    datLoiBieu({})
    datBieu({
      maTuyen: dsTuyen[0]?.ma ?? '',
      maXe: dsXe[0]?.ma ?? '',
      thoiDiemKhoiHanh: gioHienTaiDatetimeLocal(),
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
      thoiDiemKhoiHanh: apiSangDatetimeLocal(c.thoiDiemKhoiHanh),
      thoiDiemDen: c.thoiDiemDen ? apiSangDatetimeLocal(c.thoiDiemDen) : '',
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
      thoiDiemKhoiHanh: datetimeLocalSangApi(bieu.thoiDiemKhoiHanh),
      thoiDiemDen: bieu.thoiDiemDen ? datetimeLocalSangApi(bieu.thoiDiemDen) : undefined,
      giaVe: bieu.giaVe,
      trangThai: bieu.trangThai,
    }
    try {
      if (sua) {
        await moKhoiDuLieu(
          khachHttp.put<PhanHoi<ChuyenXe>>(`/chuyen-xe/${sua.ma}`, { ...than, ma: sua.ma }),
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
    <div className="admin-page admin-page--trips">
      <header className="trip-hero">
        <div className="trip-hero__copy">
          <p className="trip-hero__kicker">
            <Bus size={16} strokeWidth={2.25} aria-hidden />
            Lịch vận hành
          </p>
          <h1 className="trip-hero__title">Chuyến xe</h1>
          <p className="trip-hero__lead">
            Gán tuyến, xe, giờ khởi hành và giá vé. Admin có thể gen lịch hàng loạt theo khung giờ cố định.
          </p>
        </div>
        <div className="trip-hero__stats" aria-live="polite">
          <div className="trip-hero__stat">
            <span className="trip-hero__stat-val">{tai ? '…' : thongKe.tong}</span>
            <span className="trip-hero__stat-lab">Tổng chuyến</span>
          </div>
          <div className="trip-hero__stat trip-hero__stat--ok">
            <span className="trip-hero__stat-val">{tai ? '…' : thongKe.lenLich}</span>
            <span className="trip-hero__stat-lab">Đã lên lịch</span>
          </div>
          <div className="trip-hero__stat trip-hero__stat--muted">
            <span className="trip-hero__stat-val">{tai ? '…' : thongKe.huy}</span>
            <span className="trip-hero__stat-lab">Đã hủy</span>
          </div>
        </div>
      </header>

      {laAdmin ? (
        <TheChua padding="lg" className="trip-gen-card">
          <div className="trip-gen-card__head">
            <div className="trip-gen-card__icon" aria-hidden>
              <CalendarPlus size={22} strokeWidth={2} />
            </div>
            <div>
              <h2 className="trip-gen-card__title">Gen lịch tự động</h2>
              <p className="trip-gen-card__sub muted">
                Tạo chuyến 6h, 9h, 13h, 17h, 21h từ hiện tại — chỉ các ngày chưa có lịch trên tuyến.
              </p>
            </div>
          </div>
          <div className="trip-gen-form">
            <TruongNhap
              nhan="Từ ngày"
              type="date"
              value={tuNgayGen}
              min={minNgayGen}
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
            <div className="trip-gen-form__action">
              <span className="field__label trip-gen-form__action-label" aria-hidden="true">
                &nbsp;
              </span>
              <NutBam
                bien="chinh"
                className="trip-gen-form__btn"
                dangTai={dangGen}
                onClick={() => void genLich()}
                con="Gen lịch"
              />
            </div>
          </div>
          {ketQuaGen ? (
            <p className="trip-gen-card__result" role="status">
              {ketQuaGen}
            </p>
          ) : null}
        </TheChua>
      ) : null}

      <TheChua padding="none" className="trip-list-card">
        <div className="trip-list-toolbar">
          <div className="trip-list-toolbar__left">
            <h2 className="trip-list-toolbar__title">Danh sách chuyến</h2>
            <span className="trip-list-toolbar__count">
              {tai ? '…' : `${dsLoc.length}${dsLoc.length !== ds.length ? ` / ${ds.length}` : ''} chuyến`}
            </span>
          </div>
          <div className="trip-list-toolbar__actions">
            <NutBam bien="vien" className="btn--sm" dangTai={tai} onClick={() => void taiDS()} con="Làm mới" />
            <NutBam bien="chinh" className="btn--sm" onClick={moThe} con="+ Thêm chuyến" />
          </div>
        </div>

        <div className="trip-filters">
          <label className="trip-filters__search">
            <Search size={16} aria-hidden className="trip-filters__search-ico" />
            <input
              type="search"
              className="trip-filters__search-input"
              placeholder="Tìm mã, tuyến, biển số, giờ…"
              value={tuKhoa}
              onChange={(e) => datTuKhoa(e.target.value)}
            />
          </label>
          <TruongChon
            nhan="Lọc tuyến"
            value={locTuyen === '' ? '' : String(locTuyen)}
            onChange={(e) => datLocTuyen(e.target.value ? Number(e.target.value) : '')}
          >
            <option value="">Tất cả tuyến</option>
            {dsTuyen.map((t) => (
              <option key={t.ma} value={t.ma}>
                {t.diemDi} → {t.diemDen}
              </option>
            ))}
          </TruongChon>
          <TruongChon
            nhan="Trạng thái"
            value={locTrangThai}
            onChange={(e) => datLocTrangThai(e.target.value)}
          >
            <option value="">Tất cả</option>
            <option value="SCHEDULED">Đã lên lịch</option>
            <option value="CANCELLED">Đã hủy</option>
          </TruongChon>
        </div>

        <div className="table-scroll">
          <table className="data-table trip-table">
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
              {tai && ds.length === 0 ? (
                <tr>
                  <td colSpan={7} className="trip-table__empty">
                    Đang tải danh sách chuyến…
                  </td>
                </tr>
              ) : null}
              {!tai && dsLoc.length === 0 ? (
                <tr>
                  <td colSpan={7} className="trip-table__empty">
                    {ds.length === 0
                      ? 'Chưa có chuyến nào — thêm thủ công hoặc gen lịch.'
                      : 'Không có chuyến khớp bộ lọc.'}
                  </td>
                </tr>
              ) : null}
              {dsLoc.map((r) => (
                <tr
                  key={r.ma}
                  className={r.trangThai === 'CANCELLED' ? 'trip-table__row--cancelled' : undefined}
                >
                  <td className="mono trip-table__id">#{r.ma}</td>
                  <td className="trip-table__route">
                    <Route size={14} aria-hidden className="trip-table__route-ico" />
                    <strong>{tenTuyen(r.maTuyen)}</strong>
                  </td>
                  <td>
                    <span className="trip-table__plate">{hienThiBienSoXe(r.maXe)}</span>
                  </td>
                  <td className="trip-table__time">{dinhDangNgayGio(r.thoiDiemKhoiHanh)}</td>
                  <td className="trip-table__price">{dinhDangVnd(r.giaVe)}</td>
                  <td>
                    <BadgeTrangThai trangThai={r.trangThai} />
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
                {t.diemDi} → {t.diemDen}
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
                {x.bienSo}
                {x.hangXe ? ` · ${x.hangXe}` : ''}
              </option>
            ))}
          </TruongChon>
          <div className="trip-form-row">
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
          </div>
          <div className="trip-form-row">
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
              <option value="SCHEDULED">Đã lên lịch</option>
              <option value="CANCELLED">Đã hủy</option>
            </TruongChon>
          </div>
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


