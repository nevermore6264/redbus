import { useEffect, useMemo, useRef, useState } from 'react'
import { Link, useLocation, useSearchParams } from 'react-router-dom'
import {
  Armchair,
  ArrowRight,
  Bus,
  CalendarDays,
  ChevronRight,
  Clock,
  Info,
  MapPin,
  Percent,
  ShieldCheck,
  Sparkles,
  Tag,
  Ticket,
  Wallet,
} from 'lucide-react'
import { khachHttp, moKhoiDuLieu, urlTaiNguyen } from '../nguon/apiClient'
import { AnhCoFallback } from '../thanhPhan/AnhCoFallback'
import { ANH_CO_DINH } from '../tienIch/anhTrang'
import type {
  PhanHoi,
  ChuyenXe,
  ChuyenXeLoc,
  DiemDungChan,
  GheNgoi,
  KhuyenMai,
  LoaiXe,
  TuyenDuong,
  XeKhach,
} from '../nguon/kieu'
import { dungNguoiDung } from '../dinhDanh/boiCanhNguoiDung'
import { dungThongBao } from '../dinhDanh/boiCanhThongBao'
import { dungModalXacThuc } from '../dinhDanh/boiCanhModalXacThuc'
import { SoDoGheXe } from '../thanhPhan/SoDoGheXe'
import { TheChua, TieuDeThe } from '../thanhPhan/theChua'
import { NutBam, NutVanBan } from '../thanhPhan/nutBam'
import { TruongChon, TruongNhap } from '../thanhPhan/truongNhap'
import { NhanHieu } from '../thanhPhan/nhanHieu'
import { LoTrinhTuyen } from '../thanhPhan/LoTrinhTuyen'
import { BanDoLoTrinh } from '../thanhPhan/BanDoLoTrinh'
import { dinhDangNgayGio, dinhDangVnd } from '../tienIch/dinhDang'
import { chuoiLoTrinh, taiDiemDungTheoTuyen } from '../tienIch/loTrinhTuyen'
import { trangThaiSangTiengViet } from '../tienIch/trangThai'

function isoSangLocalInput(iso: string) {
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return null
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`
}

export function TrangDatVe() {
  const viTri = useLocation()
  const [searchParams] = useSearchParams()
  const { moDangNhap, moDangKy } = dungModalXacThuc()
  const { nguoiDung } = dungNguoiDung()
  const { hienThi } = dungThongBao()
  const [dsTuyen, datTuyen] = useState<TuyenDuong[]>([])
  const [maTuyen, datMaTuyen] = useState<number | ''>('')
  const [tuNgay, datTuNgay] = useState(() => {
    const d = new Date()
    d.setDate(d.getDate() - 1)
    return d.toISOString().slice(0, 16)
  })
  const [dsChuyen, datChuyen] = useState<ChuyenXe[]>([])
  const [dsChuyenLoc, datDsChuyenLoc] = useState<ChuyenXeLoc[]>([])
  const [giaMin, datGiaMin] = useState('')
  const [giaMax, datGiaMax] = useState('')
  const [maLoaiXeLoc, datMaLoaiXeLoc] = useState<number | ''>('')
  const [gioTu, datGioTu] = useState('')
  const [gioDen, datGioDen] = useState('')
  const [sapXep, datSapXep] = useState('')
  const [maDiemLen, datMaDiemLen] = useState<number | ''>('')
  const [maDiemXuong, datMaDiemXuong] = useState<number | ''>('')
  const [chon, datChon] = useState<ChuyenXe | null>(null)
  const [dsGhe, datGhe] = useState<GheNgoi[]>([])
  const [gheDaGiu, datGheDaGiu] = useState<Set<number>>(new Set())
  const [dsMaGheChon, datDsMaGheChon] = useState<Set<number>>(new Set())
  const [taiDS, datTaiDS] = useState(false)
  const [taiDat, datTaiDat] = useState(false)
  const [dsDiemDung, datDsDiemDung] = useState<DiemDungChan[]>([])
  const [diemDungTheoTuyen, datDiemDungTheoTuyen] = useState<Record<number, DiemDungChan[]>>({})
  const [daTimChuyen, datDaTimChuyen] = useState(false)
  const [kmGoiY, datKmGoiY] = useState<KhuyenMai[]>([])
  const [dsLoaiXe, datDsLoaiXe] = useState<LoaiXe[]>([])
  const [dsXeKhach, datDsXeKhach] = useState<XeKhach[]>([])
  const daTuDongTimTuUrl = useRef(false)

  const tuyenHienTai = useMemo(
    () => dsTuyen.find((t) => t.ma === maTuyen),
    [dsTuyen, maTuyen],
  )

  const soGheChon = dsMaGheChon.size
  const buocHienTai = soGheChon > 0 ? 3 : chon ? 2 : 1

  const nhanGheDaChon = useMemo(() => {
    if (!chon || soGheChon === 0) return ''
    const labels = [...dsMaGheChon]
      .map((ma) => dsGhe.find((g) => g.ma === ma)?.maGhe)
      .filter(Boolean)
    return labels.join(', ')
  }, [dsMaGheChon, dsGhe, chon, soGheChon])

  const tongTien = chon && soGheChon > 0 ? Number(chon.giaVe) * soGheChon : 0

  const loaiTheoChuyen = useMemo(() => {
    if (!chon) return null
    const xe = dsXeKhach.find((x) => x.ma === chon.maXe)
    if (xe?.maLoaiXe == null) return null
    return dsLoaiXe.find((l) => l.ma === xe.maLoaiXe) ?? null
  }, [chon, dsXeKhach, dsLoaiXe])

  function loaiCuaChuyen(cx: ChuyenXe): LoaiXe | null {
    const xe = dsXeKhach.find((x) => x.ma === cx.maXe)
    if (xe?.maLoaiXe == null) return null
    return dsLoaiXe.find((l) => l.ma === xe.maLoaiXe) ?? null
  }

  function lopBuoc(n: number) {
    const on = buocHienTai === n
    const done = buocHienTai > n
    return `booking-steps__item${on ? ' booking-steps__item--on' : ''}${done ? ' booking-steps__item--done' : ''}`
  }

  useEffect(() => {
    void (async () => {
      try {
        const ds = await moKhoiDuLieu(khachHttp.get<PhanHoi<TuyenDuong[]>>('/tuyen-duong'))
        datTuyen(ds)
        datDiemDungTheoTuyen(await taiDiemDungTheoTuyen(ds))
        const maTuUrl = searchParams.get('tuyen')
        const tuLucTuUrl = searchParams.get('tuLuc')
        if (maTuUrl && ds.some((t) => t.ma === Number(maTuUrl))) {
          datMaTuyen(Number(maTuUrl))
        } else if (ds.length && maTuyen === '') {
          datMaTuyen(ds[0].ma)
        }
        if (tuLucTuUrl) {
          const local = isoSangLocalInput(tuLucTuUrl)
          if (local) datTuNgay(local)
        }
      } catch {
        hienThi({ loai: 'loi', noiDung: 'Không tải được danh sách tuyến' })
      }
    })()
  }, [])

  useEffect(() => {
    if (daTuDongTimTuUrl.current) return
    if (!searchParams.get('tuLuc') || maTuyen === '' || dsTuyen.length === 0) return
    daTuDongTimTuUrl.current = true
    void timChuyen()
  }, [dsTuyen.length, maTuyen, searchParams])

  useEffect(() => {
    void (async () => {
      try {
        const [loai, xe] = await Promise.all([
          moKhoiDuLieu(khachHttp.get<PhanHoi<LoaiXe[]>>('/loai-xe')),
          moKhoiDuLieu(khachHttp.get<PhanHoi<XeKhach[]>>('/xe-khach')),
        ])
        datDsLoaiXe(loai)
        datDsXeKhach(xe)
      } catch {
        datDsLoaiXe([])
        datDsXeKhach([])
      }
    })()
  }, [])

  useEffect(() => {
    void (async () => {
      try {
        const k = await moKhoiDuLieu(khachHttp.get<PhanHoi<KhuyenMai[]>>('/khuyen-mai/hien-thi'))
        datKmGoiY(Array.isArray(k) ? k.slice(0, 5) : [])
      } catch {
        datKmGoiY([])
      }
    })()
  }, [])

  useEffect(() => {
    if (maTuyen === '') {
      datDsDiemDung([])
      return
    }
    void (async () => {
      try {
        const d = await moKhoiDuLieu(
          khachHttp.get<PhanHoi<DiemDungChan[]>>(`/diem-dung/tuyen/${maTuyen}`),
        )
        datDsDiemDung(d)
      } catch {
        datDsDiemDung([])
      }
    })()
  }, [maTuyen])

  async function timChuyen() {
    if (maTuyen === '') return
    datTaiDS(true)
    datChon(null)
    datGhe([])
    datGheDaGiu(new Set())
    datDsMaGheChon(new Set())
    try {
      const q: Record<string, string> = { maTuyen: String(maTuyen) }
      if (tuNgay) q.tuLuc = new Date(tuNgay).toISOString()
      if (giaMin) q.giaMin = giaMin
      if (giaMax) q.giaMax = giaMax
      if (maLoaiXeLoc !== '') q.maLoaiXe = String(maLoaiXeLoc)
      if (gioTu) q.gioTu = gioTu
      if (gioDen) q.gioDen = gioDen
      if (sapXep) q.sapXep = sapXep
      const loc = await moKhoiDuLieu(
        khachHttp.get<PhanHoi<ChuyenXeLoc[]>>('/chuyen-xe/tim-kiem', { params: q }),
      )
      datDsChuyenLoc(loc)
      datChuyen(loc.map((x) => x.chuyen))
    } catch (e: unknown) {
      hienThi({ loai: 'loi', noiDung: e instanceof Error ? e.message : 'Lỗi tìm chuyến' })
    } finally {
      datTaiDS(false)
      datDaTimChuyen(true)
    }
  }

  async function khiChonChuyen(c: ChuyenXe) {
    datChon(c)
    datDsMaGheChon(new Set())
    try {
      const [ghe, thuTu] = await Promise.all([
        moKhoiDuLieu(khachHttp.get<PhanHoi<GheNgoi[]>>(`/ghe-ngoi/xe/${c.maXe}`)),
        moKhoiDuLieu(khachHttp.get<PhanHoi<number[]>>(`/chuyen-xe/${c.ma}/ghe-da-giu`)),
      ])
      datGhe(ghe)
      datGheDaGiu(new Set(thuTu))
    } catch (e: unknown) {
      hienThi({ loai: 'loi', noiDung: e instanceof Error ? e.message : 'Lỗi tải ghế' })
    }
  }

  function chonHoacBoGhe(ma: number) {
    datDsMaGheChon((truoc) => {
      const sau = new Set(truoc)
      if (sau.has(ma)) {
        sau.delete(ma)
        return sau
      }
      if (sau.size >= 10) {
        hienThi({ loai: 'thongTin', noiDung: 'Tối đa 10 ghế mỗi lần đặt' })
        return truoc
      }
      sau.add(ma)
      return sau
    })
  }

  async function xacNhanDat() {
    if (!chon || soGheChon === 0) return
    if (nguoiDung?.vaiTro !== 'CUSTOMER') {
      hienThi({ loai: 'thongTin', noiDung: 'Vui lòng đăng nhập tài khoản khách hàng (CUSTOMER) để đặt vé.' })
      return
    }
    datTaiDat(true)
    try {
      const ve = await moKhoiDuLieu(
        khachHttp.post<PhanHoi<unknown[]>>('/ve-xe/dat', {
          maChuyen: chon.ma,
          dsMaGhe: [...dsMaGheChon],
          maDiemLen: maDiemLen === '' ? undefined : maDiemLen,
          maDiemXuong: maDiemXuong === '' ? undefined : maDiemXuong,
        }),
      )
      const soVe = Array.isArray(ve) ? ve.length : soGheChon
      hienThi({
        loai: 'thanhCong',
        noiDung: soVe > 1 ? `Đã đặt ${soVe} vé thành công!` : 'Đặt vé thành công!',
      })
      datGheDaGiu((s) => {
        const moi = new Set(s)
        dsMaGheChon.forEach((ma) => moi.add(ma))
        return moi
      })
      datDsMaGheChon(new Set())
    } catch (e: unknown) {
      hienThi({ loai: 'loi', noiDung: e instanceof Error ? e.message : 'Lỗi đặt vé' })
    } finally {
      datTaiDat(false)
    }
  }

  return (
    <div className="booking-page">
      <section className="booking-hero" aria-labelledby="booking-hero-title">
        <AnhCoFallback
          src={ANH_CO_DINH.heroChinh}
          fallback={ANH_CO_DINH.heroChinh}
          alt=""
          className="booking-hero__bg-img"
          loading="eager"
        />
        <div className="booking-hero__noise" aria-hidden />
        <div className="container booking-hero__inner">
          <p className="booking-hero__eyebrow">
            <Bus size={15} aria-hidden /> Đặt vé trực tuyến
          </p>
          <h1 id="booking-hero-title" className="booking-hero__title">
            Chọn tuyến, giờ khởi hành và ghế ngồi
          </h1>
          <p className="booking-hero__lead">
            Giá vé và trạng thái chuyến hiển thị rõ trước khi bạn xác nhận. Sau khi đặt, vé ở trạng thái chờ — hoàn tất
            thanh toán trong mục « Vé của tôi ».
          </p>
          <ul className="booking-hero__chips">
            <li>
              <Sparkles size={14} aria-hidden /> Giá minh bạch theo chuyến
            </li>
            <li>
              <ShieldCheck size={14} aria-hidden /> Đăng nhập khách để giữ vé
            </li>
            <li>
              <Ticket size={14} aria-hidden /> Sơ đồ ghế theo xe thực tế
            </li>
          </ul>
        </div>
      </section>

      <div className="container booking booking-page__body">
        <nav className="booking-steps" aria-label="Tiến trình đặt vé">
          <ol>
            <li className={lopBuoc(1)}>
              <span className="booking-steps__num">1</span>
              <span className="booking-steps__txt">Tuyến &amp; chuyến</span>
            </li>
            <li className={lopBuoc(2)}>
              <span className="booking-steps__num">2</span>
              <span className="booking-steps__txt">Chọn ghế (nhiều ghế)</span>
            </li>
            <li className={lopBuoc(3)}>
              <span className="booking-steps__num">3</span>
              <span className="booking-steps__txt">Xác nhận đặt</span>
            </li>
          </ol>
        </nav>

        <div className="booking-layout">
          <div className="booking-grid">
        <TheChua padding="md">
          <TieuDeThe
            title="1 — Tuyến &amp; thời gian"
            subtitle="Lọc chuyến khởi hành"
            action={
              <NutBam bien="chinh" onClick={timChuyen} dangTai={taiDS} con="Tìm chuyến" />
            }
          />
          <div className="filters-row">
            <TruongChon
              nhan="Tuyến"
              value={maTuyen === '' ? '' : String(maTuyen)}
              onChange={(e) => datMaTuyen(e.target.value ? Number(e.target.value) : '')}
            >
              {dsTuyen.map((r) => (
                <option key={r.ma} value={r.ma}>
                  {chuoiLoTrinh(r, diemDungTheoTuyen[r.ma] ?? [])}
                </option>
              ))}
            </TruongChon>
            <div className="field">
              <label className="field__label" htmlFor="tu-luc">
                Từ thời điểm
              </label>
              <div className="field__control">
                <span className="field__icon">
                  <CalendarDays size={18} />
                </span>
                <input
                  id="tu-luc"
                  className="field__input"
                  type="datetime-local"
                  value={tuNgay}
                  onChange={(e) => datTuNgay(e.target.value)}
                  placeholder="Chọn ngày giờ để lọc chuyến khởi hành từ mốc này"
                />
              </div>
            </div>
          </div>
          <div className="filters-row filters-row--adv">
            <TruongChon
              nhan="Loại xe"
              value={maLoaiXeLoc === '' ? '' : String(maLoaiXeLoc)}
              onChange={(e) => datMaLoaiXeLoc(e.target.value ? Number(e.target.value) : '')}
            >
              <option value="">Tất cả</option>
              {dsLoaiXe.map((l) => (
                <option key={l.ma} value={l.ma}>
                  {l.ten}
                </option>
              ))}
            </TruongChon>
            <TruongChon nhan="Sắp xếp" value={sapXep} onChange={(e) => datSapXep(e.target.value)}>
              <option value="">Giờ sớm nhất</option>
              <option value="gia_tang">Giá tăng dần</option>
              <option value="gia_giam">Giá giảm dần</option>
              <option value="ghe_nhieu">Nhiều ghế trống</option>
            </TruongChon>
            <TruongNhap nhan="Giá từ (VNĐ)" type="number" value={giaMin} onChange={(e) => datGiaMin(e.target.value)} />
            <TruongNhap nhan="Giá đến (VNĐ)" type="number" value={giaMax} onChange={(e) => datGiaMax(e.target.value)} />
            <TruongChon nhan="Giờ từ" value={gioTu} onChange={(e) => datGioTu(e.target.value)}>
              <option value="">—</option>
              {Array.from({ length: 24 }, (_, h) => (
                <option key={h} value={String(h)}>
                  {String(h).padStart(2, '0')}:00
                </option>
              ))}
            </TruongChon>
            <TruongChon nhan="Giờ đến" value={gioDen} onChange={(e) => datGioDen(e.target.value)}>
              <option value="">—</option>
              {Array.from({ length: 24 }, (_, h) => (
                <option key={h} value={String(h)}>
                  {String(h).padStart(2, '0')}:00
                </option>
              ))}
            </TruongChon>
          </div>
          {tuyenHienTai ? (
            <p className="muted small">
              <MapPin size={14} className="inline-ico" />
              {tuyenHienTai.khoangCachKm != null ? `${tuyenHienTai.khoangCachKm} km` : '—'} ·{' '}
              {tuyenHienTai.thoiGianUocTinhPhut != null
                ? `${tuyenHienTai.thoiGianUocTinhPhut} phút`
                : '—'}
            </p>
          ) : null}
          {tuyenHienTai ? (
            <div className="route-stops">
              <p className="route-stops__label">Lộ trình tuyến</p>
              <LoTrinhTuyen tuyen={tuyenHienTai} diemDung={dsDiemDung} kieu="timeline" />
            </div>
          ) : null}
          {tuyenHienTai ? (
            <BanDoLoTrinh diemDi={tuyenHienTai.diemDi} diemDen={tuyenHienTai.diemDen} dsDiem={dsDiemDung} />
          ) : null}
          <ul className={`trip-cards ${dsChuyen.length === 0 ? 'trip-cards--empty' : ''}`}>
            {dsChuyen.length > 0 ? (
              dsChuyen.map((t) => {
                const loc = dsChuyenLoc.find((x) => x.chuyen.ma === t.ma)
                const loai = loaiCuaChuyen(t)
                const thumb = loai?.dsAnh?.[0]
                return (
                  <li key={t.ma}>
                    <button
                      type="button"
                      className={`trip-card ${chon?.ma === t.ma ? 'trip-card--on' : ''}`}
                      onClick={() => void khiChonChuyen(t)}
                    >
                      <div className="trip-card__thumb-wrap" aria-hidden>
                        {thumb ? (
                          <img className="trip-card__thumb" src={urlTaiNguyen(thumb.duongAnh)} alt="" />
                        ) : (
                          <span className="trip-card__thumb trip-card__thumb--ph">
                            <Bus size={22} strokeWidth={1.5} />
                          </span>
                        )}
                      </div>
                      <div className="trip-card__body">
                        <div className="trip-card__main">
                          <span className="trip-card__time">{dinhDangNgayGio(t.thoiDiemKhoiHanh)}</span>
                          <NhanHieu tone={t.trangThai}>{trangThaiSangTiengViet(t.trangThai)}</NhanHieu>
                        </div>
                        <div className="trip-card__meta">
                          <span>
                            {loai ? loai.ten : `Xe #${t.maXe}`}
                            {loc?.soGheTrong != null ? ` · ${loc.soGheTrong} ghế trống` : ''}
                          </span>
                          <span className="trip-card__price">{dinhDangVnd(t.giaVe)}</span>
                        </div>
                      </div>
                      <ChevronRight className="trip-card__chev" size={18} />
                    </button>
                  </li>
                )
              })
            ) : (
              <li className="booking-trip-empty">
                <div className="booking-trip-empty__ico" aria-hidden>
                  <CalendarDays size={28} strokeWidth={1.5} />
                </div>
                {taiDS ? (
                  <p className="booking-trip-empty__title">Đang tìm chuyến…</p>
                ) : !daTimChuyen ? (
                  <>
                    <p className="booking-trip-empty__title">Chưa có lịch trình</p>
                    <p className="booking-trip-empty__hint muted">
                      Chọn tuyến và mốc thời gian, sau đó nhấn <strong>Tìm chuyến</strong> để xem các khởi hành còn chỗ.
                    </p>
                  </>
                ) : (
                  <>
                    <p className="booking-trip-empty__title">Không tìm thấy chuyến</p>
                    <p className="booking-trip-empty__hint muted">
                      Thử đổi <strong>từ thời điểm</strong> (sớm hơn hoặc muộn hơn) hoặc chọn tuyến khác trong danh sách.
                    </p>
                  </>
                )}
              </li>
            )}
          </ul>
        </TheChua>

        <TheChua padding="md">
          <TieuDeThe
            title="2 — Chọn ghế"
            subtitle={
              chon
                ? `Chuyến #${chon.ma} · ${dinhDangVnd(chon.giaVe)}`
                : 'Chọn chuyến bên trái'
            }
          />
          {chon && tuyenHienTai ? (
            <div className="booking-pick-summary">
              <div className="booking-pick-summary__route">
                <LoTrinhTuyen tuyen={tuyenHienTai} diemDung={dsDiemDung} kieu="dong" />
              </div>
              <div className="booking-pick-summary__row">
                <span className="booking-pick-summary__time">
                  <Clock size={15} aria-hidden />
                  {dinhDangNgayGio(chon.thoiDiemKhoiHanh)}
                </span>
                <span className="booking-pick-summary__price">{dinhDangVnd(chon.giaVe)}</span>
              </div>
            </div>
          ) : null}
          {loaiTheoChuyen && (loaiTheoChuyen.dsAnh?.length ?? 0) > 0 ? (
            <div className="booking-loai-gallery">
              <p className="booking-loai-gallery__label">
                <Bus size={14} className="inline-ico" aria-hidden /> Hình ảnh loại xe — {loaiTheoChuyen.ten}
              </p>
              <div className="booking-loai-gallery__strip">
                {loaiTheoChuyen.dsAnh!.map((a) => (
                  <a
                    key={a.ma}
                    className="booking-loai-gallery__item"
                    href={urlTaiNguyen(a.duongAnh)}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <img src={urlTaiNguyen(a.duongAnh)} alt="" />
                  </a>
                ))}
              </div>
            </div>
          ) : null}
          {chon ? (
            <>
              <div className="seat-legend">
                <span>
                  <i className="dot dot--free" /> Trống
                </span>
                <span>
                  <i className="dot dot--busy" /> Đã đặt / khóa
                </span>
                <span>
                  <i className="dot dot--pick" /> Đang chọn (nhiều ghế)
                </span>
              </div>
              <SoDoGheXe
                dsGhe={dsGhe}
                gheDaGiu={gheDaGiu}
                dsMaGheChon={dsMaGheChon}
                onChonMaGhe={chonHoacBoGhe}
              />
              {soGheChon > 0 ? (
                <div className="booking-seat-summary">
                  <p className="booking-seat-summary__label">
                    <Armchair size={16} aria-hidden />
                    Đã chọn <strong>{soGheChon}</strong> ghế: {nhanGheDaChon}
                  </p>
                  <p className="booking-seat-summary__total">
                    Tạm tính: <strong>{dinhDangVnd(tongTien)}</strong>
                    <span className="muted small"> ({dinhDangVnd(chon.giaVe)} × {soGheChon})</span>
                  </p>
                  <NutBam
                    bien="mo"
                    className="btn--sm"
                    onClick={() => datDsMaGheChon(new Set())}
                    con="Bỏ chọn tất cả"
                  />
                </div>
              ) : null}
              {chon && dsDiemDung.length > 0 ? (
                <div className="filters-row booking-pickup">
                  <TruongChon
                    nhan="Điểm lên (tùy chọn)"
                    value={maDiemLen === '' ? '' : String(maDiemLen)}
                    onChange={(e) => datMaDiemLen(e.target.value ? Number(e.target.value) : '')}
                  >
                    <option value="">— Không chọn —</option>
                    {dsDiemDung.map((d) => (
                      <option key={d.ma} value={d.ma}>
                        {d.tenDiem}
                      </option>
                    ))}
                  </TruongChon>
                  <TruongChon
                    nhan="Điểm xuống (tùy chọn)"
                    value={maDiemXuong === '' ? '' : String(maDiemXuong)}
                    onChange={(e) => datMaDiemXuong(e.target.value ? Number(e.target.value) : '')}
                  >
                    <option value="">— Không chọn —</option>
                    {dsDiemDung.map((d) => (
                      <option key={d.ma} value={d.ma}>
                        {d.tenDiem}
                      </option>
                    ))}
                  </TruongChon>
                </div>
              ) : null}
              <div className="booking-actions">
                {nguoiDung?.vaiTro === 'CUSTOMER' ? (
                  <NutBam
                    bien="chinh"
                    className="btn--lg"
                    disabled={soGheChon === 0}
                    dangTai={taiDat}
                    onClick={() => void xacNhanDat()}
                    con={
                      soGheChon > 1
                        ? `Xác nhận đặt ${soGheChon} vé`
                        : 'Xác nhận đặt vé'
                    }
                  />
                ) : (
                  <p className="muted">
                    <NutVanBan onClick={() => moDangKy(`${viTri.pathname}${viTri.search}`)} con="Đăng ký" />{' '}
                    hoặc{' '}
                    <NutVanBan onClick={() => moDangNhap(`${viTri.pathname}${viTri.search}`)} con="đăng nhập" />{' '}
                    tài khoản khách hàng (CUSTOMER).
                  </p>
                )}
              </div>
            </>
          ) : (
            <div className="empty-panel empty-panel--booking muted">
              <div className="empty-panel__ico" aria-hidden>
                <Armchair size={32} strokeWidth={1.25} />
              </div>
              <p className="empty-panel__title">Sơ đồ ghế hiển thị tại đây</p>
              <p className="empty-panel__hint">
                Chọn một chuyến trong cột « Tuyến &amp; thời gian » để xem ghế trống và giá vé áp dụng.
              </p>
            </div>
          )}
        </TheChua>
          </div>

          <aside className="booking-aside" aria-label="Gợi ý &amp; tiện ích">
            <div className="booking-aside__card">
              <h2 className="booking-aside__h">
                <Info size={18} aria-hidden /> Mẹo nhanh
              </h2>
              <ul className="booking-aside__list">
                <li>
                  <Wallet size={16} aria-hidden />
                  Vé sau khi đặt sẽ ở trạng thái chờ thanh toán — thanh toán kịp để giữ chỗ.
                </li>
                <li>
                  <Tag size={16} aria-hidden />
                  Có mã khuyến mãi? Nhập khi thanh toán vé trong « Vé của tôi ».
                </li>
                <li>
                  <ShieldCheck size={16} aria-hidden />
                  Chỉ tài khoản <strong>khách hàng</strong> mới đặt được vé trên trang này.
                </li>
              </ul>
            </div>

            {kmGoiY.length > 0 ? (
              <div className="booking-aside__card booking-aside__card--promo">
                <h2 className="booking-aside__h">
                  <Percent size={18} aria-hidden /> Ưu đãi đang áp dụng
                </h2>
                <ul className="booking-aside__promos">
                  {kmGoiY.map((k) => (
                    <li key={k.ma}>
                      <code className="booking-aside__code">{k.maCode}</code>
                      <span className="muted">
                        −{k.phanTramGiam}% {k.tieuDe ? `· ${k.tieuDe}` : ''}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}

            <Link className="booking-aside__cta" to="/ve-cua-toi">
              <Ticket size={18} aria-hidden />
              <span>Xem vé đã đặt &amp; thanh toán</span>
              <ArrowRight size={18} aria-hidden />
            </Link>
          </aside>
        </div>
      </div>
    </div>
  )
}
