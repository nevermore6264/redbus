import { useEffect, useMemo, useRef, useState } from 'react'
import { Armchair, CalendarClock, CalendarRange, MapPin, RefreshCw, Tag, Ticket } from 'lucide-react'
import { khachHttp, moKhoiDuLieu } from '../nguon/apiClient'
import type { PhanHoi, PhanHoiLinkPayOs, PhanHoiThanhToanGop, VeDienTu, VeXe, ChuyenXe, TuyenDuong, GheNgoi } from '../nguon/kieu'
import { dungThongBao } from '../dinhDanh/boiCanhThongBao'
import { NenTrangKhach } from '../thanhPhan/NenTrangKhach'
import { TheChua, TieuDeThe } from '../thanhPhan/theChua'
import { NutBam, NutLienKet } from '../thanhPhan/nutBam'
import { TruongNhap } from '../thanhPhan/truongNhap'
import { NhanHieu } from '../thanhPhan/nhanHieu'
import { dinhDangNgayGio, dinhDangVnd } from '../tienIch/dinhDang'
import { trangThaiSangTiengViet } from '../tienIch/trangThai'
import { rutGonTenDiaDanh } from '../tienIch/rutGonDiaDanh'
import { DemNguocThanhToanVe } from '../thanhPhan/DemNguocThanhToanVe'
import { CuaSo } from '../thanhPhan/cuaSo'
import { VeDienTuPanel } from '../thanhPhan/VeDienTuPanel'
import { CuaSoDoiVe, coTheDoiVe, type ThongTinVeDoi } from '../thanhPhan/CuaSoDoiVe'
import { conLaiGiayThanhToan, daHetHanThanhToan } from '../tienIch/hetHanThanhToan'

function laVeDaHuy(trangThai: string) {
  return trangThai === 'CANCELLED' || trangThai === 'EXPIRED'
}

type BamPhu = ThongTinVeDoi & {
  gia: string
  giaSo: number
}

type BoLoc = 'ALL' | 'PENDING' | 'PAID' | 'CANCELLED'

const BO_LOC: { ma: BoLoc; nhan: string }[] = [
  { ma: 'ALL', nhan: 'Tất cả' },
  { ma: 'PENDING', nhan: 'Chờ thanh toán' },
  { ma: 'PAID', nhan: 'Đã thanh toán' },
  { ma: 'CANCELLED', nhan: 'Đã hủy' },
]

export function TrangVeCuaToi() {
  const { hienThi } = dungThongBao()
  const [dsVe, datVe] = useState<VeXe[]>([])
  const [phu, datPhu] = useState<Record<number, BamPhu>>({})
  const [tai, datTai] = useState(true)
  const [maKhuyenMai, datMaKhuyenMai] = useState('')
  const [boLoc, datBoLoc] = useState<BoLoc>('ALL')
  const [veDaChon, datVeDaChon] = useState<Set<number>>(() => new Set())
  const [veDangXuLy, datVeDangXuLy] = useState<number | null>(null)
  const [veDienTu, datVeDienTu] = useState<VeDienTu | null>(null)
  const [veDoiChon, datVeDoiChon] = useState<VeXe | null>(null)
  const [cheDoDoiVe, datCheDoDoiVe] = useState<'chuyen' | 'ghe'>('chuyen')
  const [lucHienTai, datLucHienTai] = useState(() => Date.now())
  const daThongBaoHetHan = useRef<Set<number>>(new Set())
  const dangLamMoiHetHan = useRef(false)

  async function lamMoi() {
    datTai(true)
    try {
      const v = await moKhoiDuLieu(khachHttp.get<PhanHoi<VeXe[]>>('/ve-xe/cua-toi'))
      datVe(v)
      const phuMoi: Record<number, BamPhu> = {}
      for (const t of v) {
        const cx = await moKhoiDuLieu(
          khachHttp.get<PhanHoi<ChuyenXe>>(`/chuyen-xe/${t.maChuyen}`),
        )
        const r = await moKhoiDuLieu(
          khachHttp.get<PhanHoi<TuyenDuong>>(`/tuyen-duong/${cx.maTuyen}`),
        )
        const gheList = await moKhoiDuLieu(
          khachHttp.get<PhanHoi<GheNgoi[]>>(`/ghe-ngoi/xe/${cx.maXe}`),
        )
        const g = gheList.find((x) => x.ma === t.maGhe)
        phuMoi[t.ma] = {
          diemDi: r.diemDi,
          diemDen: r.diemDen,
          tuyenDayDu: `${r.diemDi} → ${r.diemDen}`,
          gio: dinhDangNgayGio(cx.thoiDiemKhoiHanh),
          gia: dinhDangVnd(cx.giaVe),
          giaSo: Number(cx.giaVe),
          maGhe: g?.maGhe ?? String(t.maGhe),
          maTuyen: cx.maTuyen,
          maChuyen: cx.ma,
          maGheId: t.maGhe,
          thoiDiemKhoiHanh: cx.thoiDiemKhoiHanh,
        }
      }
      datPhu(phuMoi)
    } catch (e: unknown) {
      hienThi({ loai: 'loi', noiDung: e instanceof Error ? e.message : 'Có lỗi tải dữ liệu' })
    } finally {
      datTai(false)
    }
  }

  useEffect(() => {
    void lamMoi()
  }, [])

  const coVeChoThanhToan = useMemo(
    () => dsVe.some((v) => v.trangThai === 'PENDING'),
    [dsVe],
  )

  useEffect(() => {
    if (!coVeChoThanhToan) return
    const id = window.setInterval(() => datLucHienTai(Date.now()), 1000)
    return () => window.clearInterval(id)
  }, [coVeChoThanhToan])

  useEffect(() => {
    const hetHan = dsVe.filter(
      (v) => v.trangThai === 'PENDING' && daHetHanThanhToan(v.thoiGianDat, lucHienTai),
    )
    if (hetHan.length === 0 || dangLamMoiHetHan.current) return
    let canRefresh = false
    for (const v of hetHan) {
      if (!daThongBaoHetHan.current.has(v.ma)) {
        daThongBaoHetHan.current.add(v.ma)
        canRefresh = true
      }
    }
    if (!canRefresh) return
    dangLamMoiHetHan.current = true
    hienThi({
      loai: 'thongTin',
      noiDung: 'Vé đã quá hạn thanh toán và được hủy tự động.',
    })
    void lamMoi().finally(() => {
      dangLamMoiHetHan.current = false
    })
  }, [lucHienTai, dsVe])

  const dsHien = useMemo(() => {
    if (boLoc === 'ALL') return dsVe
    if (boLoc === 'CANCELLED') return dsVe.filter((v) => laVeDaHuy(v.trangThai))
    return dsVe.filter((v) => v.trangThai === boLoc)
  }, [dsVe, boLoc])

  const demTheoLoc = useMemo(() => {
    const dem: Record<BoLoc, number> = { ALL: dsVe.length, PENDING: 0, PAID: 0, CANCELLED: 0 }
    for (const v of dsVe) {
      if (v.trangThai === 'PENDING') dem.PENDING++
      else if (v.trangThai === 'PAID') dem.PAID++
      else if (laVeDaHuy(v.trangThai)) dem.CANCELLED++
    }
    return dem
  }, [dsVe])

  const veChoThanhToan = useMemo(
    () =>
      dsVe.filter(
        (v) =>
          v.trangThai === 'PENDING' &&
          !daHetHanThanhToan(v.thoiGianDat, lucHienTai),
      ),
    [dsVe, lucHienTai],
  )

  const soVeDaChon = veDaChon.size
  const tongTamTinh = useMemo(() => {
    let tong = 0
    for (const ma of veDaChon) {
      tong += phu[ma]?.giaSo ?? 0
    }
    return tong
  }, [veDaChon, phu])

  function chonVe(ma: number, chon: boolean) {
    datVeDaChon((prev) => {
      const next = new Set(prev)
      if (chon) next.add(ma)
      else next.delete(ma)
      return next
    })
  }

  function chonTatCaChoThanhToan() {
    datVeDaChon(new Set(veChoThanhToan.map((v) => v.ma)))
  }

  function boChonTatCa() {
    datVeDaChon(new Set())
  }

  function thanPayload() {
    return maKhuyenMai.trim() ? { maKhuyenMai: maKhuyenMai.trim() } : {}
  }

  async function thanhToanGopTienMat() {
    const ds = [...veDaChon]
    if (ds.length === 0) return
    datVeDangXuLy(-1)
    try {
      const than = { dsMaVe: ds, ...thanPayload() }
      const kq = await moKhoiDuLieu(
        khachHttp.post<PhanHoi<PhanHoiThanhToanGop>>('/thanh-toan/gop/tien-mat', than),
      )
      hienThi({
        loai: 'thanhCong',
        noiDung: `Đã thanh toán gộp ${kq.dsMaVe.length} vé (${dinhDangVnd(kq.tongTien)})`,
      })
      boChonTatCa()
      void lamMoi()
    } catch (e: unknown) {
      hienThi({ loai: 'loi', noiDung: e instanceof Error ? e.message : 'Thanh toán gộp thất bại' })
    } finally {
      datVeDangXuLy(null)
    }
  }

  async function thanhToanGopPayOs() {
    const ds = [...veDaChon]
    if (ds.length === 0) return
    datVeDangXuLy(-1)
    try {
      const than = { dsMaVe: ds, ...thanPayload() }
      const link = await moKhoiDuLieu(
        khachHttp.post<PhanHoi<PhanHoiLinkPayOs>>('/thanh-toan/gop/payos', than),
      )
      if (link.checkoutUrl) {
        window.location.href = link.checkoutUrl
      } else {
        hienThi({ loai: 'loi', noiDung: 'Không nhận được link PayOS' })
        datVeDangXuLy(null)
      }
    } catch (e: unknown) {
      hienThi({ loai: 'loi', noiDung: e instanceof Error ? e.message : 'Không tạo được link PayOS' })
      datVeDangXuLy(null)
    }
  }

  async function thanhToanTienMat(maVe: number) {
    datVeDangXuLy(maVe)
    try {
      const than = maKhuyenMai.trim() ? { maKhuyenMai: maKhuyenMai.trim() } : {}
      await moKhoiDuLieu(
        khachHttp.post<PhanHoi<unknown>>(`/thanh-toan/ve/${maVe}/tien-mat`, than),
      )
      hienThi({ loai: 'thanhCong', noiDung: 'Thanh toán tiền mặt thành công' })
      void lamMoi()
    } catch (e: unknown) {
      hienThi({ loai: 'loi', noiDung: e instanceof Error ? e.message : 'Thanh toán thất bại' })
    } finally {
      datVeDangXuLy(null)
    }
  }

  async function thanhToanPayOs(maVe: number) {
    datVeDangXuLy(maVe)
    try {
      const than = maKhuyenMai.trim() ? { maKhuyenMai: maKhuyenMai.trim() } : {}
      const link = await moKhoiDuLieu(
        khachHttp.post<PhanHoi<PhanHoiLinkPayOs>>(`/thanh-toan/ve/${maVe}/payos`, than),
      )
      if (link.checkoutUrl) {
        window.location.href = link.checkoutUrl
      } else {
        hienThi({ loai: 'loi', noiDung: 'Không nhận được link PayOS' })
        datVeDangXuLy(null)
      }
    } catch (e: unknown) {
      hienThi({ loai: 'loi', noiDung: e instanceof Error ? e.message : 'Không tạo được link PayOS' })
      datVeDangXuLy(null)
    }
  }

  async function xemVeDienTu(ma: number) {
    datVeDangXuLy(ma)
    try {
      const v = await moKhoiDuLieu(khachHttp.get<PhanHoi<VeDienTu>>(`/ve-xe/${ma}/dien-tu`))
      datVeDienTu(v)
    } catch (e: unknown) {
      hienThi({ loai: 'loi', noiDung: e instanceof Error ? e.message : 'Không tải vé điện tử' })
    } finally {
      datVeDangXuLy(null)
    }
  }

  async function huyVe(ma: number) {
    if (!confirm('Bạn có chắc muốn hủy vé này?')) return
    datVeDangXuLy(ma)
    try {
      await moKhoiDuLieu(khachHttp.post<PhanHoi<unknown>>(`/ve-xe/${ma}/huy`))
      hienThi({ loai: 'thanhCong', noiDung: 'Đã hủy vé' })
      void lamMoi()
    } catch (e: unknown) {
      hienThi({ loai: 'loi', noiDung: e instanceof Error ? e.message : 'Hủy vé thất bại' })
    } finally {
      datVeDangXuLy(null)
    }
  }

  function moDoiVe(t: VeXe, cheDo: 'chuyen' | 'ghe') {
    datCheDoDoiVe(cheDo)
    datVeDoiChon(t)
  }

  const veDienTuGoc = useMemo(
    () => (veDienTu ? dsVe.find((v) => v.ma === veDienTu.ma) ?? null : null),
    [veDienTu, dsVe],
  )

  const phuVeDienTu = veDienTuGoc ? phu[veDienTuGoc.ma] : undefined
  const duocDoiVeDienTu =
    veDienTuGoc != null &&
    (veDienTuGoc.trangThai === 'PAID' || veDienTuGoc.trangThai === 'PENDING') &&
    coTheDoiVe(phuVeDienTu?.thoiDiemKhoiHanh)

  return (
    <NenTrangKhach
      Icon={Ticket}
      tieuDe="Vé của tôi"
      moTa="Quản lý vé, thanh toán, đổi chuyến/ghế (trước giờ khởi hành 2 giờ) và vé điện tử."
    >
      <TheChua padding="none" className="cust-panel ve-panel" aria-busy={tai}>
        <div className="ve-panel__toolbar">
          <div className="ve-panel__toolbar-top">
            <TieuDeThe title="Danh sách vé" subtitle={`${dsVe.length} vé trong tài khoản`} />
            <NutBam
              bien="vien"
              className="btn--sm"
              onClick={() => void lamMoi()}
              dangTai={tai}
              con={
                <>
                  <RefreshCw size={16} aria-hidden />
                  Làm mới
                </>
              }
            />
          </div>

          <div className="ve-panel__promo">
            <span className="ve-panel__promo-icon" aria-hidden>
              <Tag size={18} />
            </span>
            <TruongNhap
              nhan=""
              goiY="Mã khuyến mãi khi thanh toán vé chờ"
              placeholder="Mã KM — VD: REDBUS10"
              value={maKhuyenMai}
              onChange={(e) => datMaKhuyenMai(e.target.value)}
            />
          </div>

          <div className="ve-panel__tabs" role="tablist" aria-label="Lọc vé">
            {BO_LOC.map((b) => (
              <button
                key={b.ma}
                type="button"
                role="tab"
                aria-selected={boLoc === b.ma}
                className={`ve-panel__tab${boLoc === b.ma ? ' ve-panel__tab--active' : ''}`}
                onClick={() => datBoLoc(b.ma)}
              >
                {b.nhan}
                <span className="ve-panel__tab-count">{demTheoLoc[b.ma]}</span>
              </button>
            ))}
          </div>

          {veChoThanhToan.length > 0 ? (
            <div className="ve-panel__bulk-hint muted small">
              Chọn nhiều vé chờ thanh toán để thanh toán gộp một lần (tối đa 10 vé).
              {veChoThanhToan.length > 1 ? (
                <button type="button" className="ve-panel__bulk-link" onClick={chonTatCaChoThanhToan}>
                  Chọn tất cả ({veChoThanhToan.length})
                </button>
              ) : null}
            </div>
          ) : null}
        </div>

        {soVeDaChon > 0 ? (
          <div className="ve-panel__bulk-bar" role="region" aria-label="Thanh toán gộp">
            <div className="ve-panel__bulk-info">
              <strong>{soVeDaChon} vé</strong>
              <span className="muted"> · Tạm tính {dinhDangVnd(tongTamTinh)}</span>
              {maKhuyenMai.trim() ? (
                <span className="muted small"> (KM áp dụng từng vé khi thanh toán)</span>
              ) : null}
            </div>
            <div className="ve-panel__bulk-actions">
              <NutBam
                bien="chinh"
                className="btn--sm"
                dangTai={veDangXuLy === -1}
                onClick={() => void thanhToanGopPayOs()}
                con={`PayOS gộp (${soVeDaChon})`}
              />
              <NutBam
                bien="vien"
                className="btn--sm"
                disabled={veDangXuLy === -1}
                onClick={() => void thanhToanGopTienMat()}
                con="Tiền mặt gộp"
              />
              <NutBam bien="vien" className="btn--sm" onClick={boChonTatCa} con="Bỏ chọn" />
            </div>
          </div>
        ) : null}

        <div className="ve-list">
          {tai && dsVe.length === 0
            ? Array.from({ length: 3 }).map((_, i) => (
                <article key={`sk-${i}`} className="ve-card ve-card--skeleton" aria-hidden>
                  <div className="cust-skel-line cust-skel-line--md" />
                  <div className="cust-skel-line cust-skel-line--lg" />
                  <div className="cust-skel-line cust-skel-line--sm" />
                </article>
              ))
            : dsHien.map((t) => {
                const x = phu[t.ma]
                const dangXuLy = veDangXuLy === t.ma
                const choThanhToan = t.trangThai === 'PENDING'
                const conLaiGiay = choThanhToan
                  ? conLaiGiayThanhToan(t.thoiGianDat, lucHienTai)
                  : 0
                const hetHanLocal = choThanhToan && conLaiGiay <= 0
                const daChon = veDaChon.has(t.ma)
                const duocDoiVe =
                  (t.trangThai === 'PAID' || t.trangThai === 'PENDING') &&
                  coTheDoiVe(x?.thoiDiemKhoiHanh)
                const ganGioKhoiHanh =
                  (t.trangThai === 'PAID' || t.trangThai === 'PENDING') &&
                  !coTheDoiVe(x?.thoiDiemKhoiHanh) &&
                  x?.thoiDiemKhoiHanh != null &&
                  new Date(x.thoiDiemKhoiHanh).getTime() > Date.now()
                const di = x ? rutGonTenDiaDanh(x.diemDi) : '…'
                const den = x ? rutGonTenDiaDanh(x.diemDen) : '…'
                return (
                  <article
                    key={t.ma}
                    className={`ve-card${choThanhToan ? ' ve-card--pending' : ''}${daChon ? ' ve-card--selected' : ''}${t.trangThai === 'CANCELLED' ? ' ve-card--cancelled' : ''}${t.trangThai === 'EXPIRED' ? ' ve-card--expired' : ''}`}
                  >
                    <header className="ve-card__head">
                      {choThanhToan && !hetHanLocal ? (
                        <label className="ve-card__check">
                          <input
                            type="checkbox"
                            checked={daChon}
                            onChange={(e) => chonVe(t.ma, e.target.checked)}
                            aria-label={`Chọn vé #${t.ma} để thanh toán gộp`}
                          />
                        </label>
                      ) : null}
                      <span className="ve-card__id">
                        Vé #{t.ma}
                        {t.maVeHienThi ? <span className="ve-card__code muted"> · {t.maVeHienThi}</span> : null}
                      </span>
                      <NhanHieu tone={t.trangThai}>
                        {trangThaiSangTiengViet(t.trangThai)}
                      </NhanHieu>
                    </header>

                    <div className="ve-card__route" title={x?.tuyenDayDu}>
                      <span className="ve-card__route-from">
                        <MapPin size={15} aria-hidden />
                        {di}
                      </span>
                      <span className="ve-card__route-arrow" aria-hidden>
                        →
                      </span>
                      <span className="ve-card__route-to">{den}</span>
                    </div>

                    <ul className="ve-card__meta">
                      <li>
                        <CalendarClock size={15} aria-hidden />
                        {x?.gio ?? '…'}
                      </li>
                      <li>
                        <Armchair size={15} aria-hidden />
                        Ghế <strong>{x?.maGhe ?? '…'}</strong>
                      </li>
                      <li className="ve-card__price">{x?.gia ?? '…'}</li>
                    </ul>

                    {choThanhToan && t.thoiGianDat ? (
                      <DemNguocThanhToanVe thoiGianDat={t.thoiGianDat} lucHienTai={lucHienTai} />
                    ) : null}

                    {(t.trangThai === 'PAID' || duocDoiVe) ? (
                      <div className="ve-card__extra">
                        {t.trangThai === 'PAID' ? (
                          <NutBam
                            bien="vien"
                            className="btn--sm"
                            onClick={() => void xemVeDienTu(t.ma)}
                            con="Vé điện tử / QR"
                          />
                        ) : null}
                        {duocDoiVe ? (
                          <>
                            <NutBam
                              bien="vien"
                              className="btn--sm"
                              disabled={dangXuLy}
                              onClick={() => moDoiVe(t, 'ghe')}
                              con={
                                <>
                                  <Armchair size={15} aria-hidden />
                                  Đổi ghế
                                </>
                              }
                            />
                            <NutBam
                              bien="vien"
                              className="btn--sm"
                              disabled={dangXuLy}
                              onClick={() => moDoiVe(t, 'chuyen')}
                              con={
                                <>
                                  <CalendarRange size={15} aria-hidden />
                                  Đổi chuyến / ngày
                                </>
                              }
                            />
                          </>
                        ) : null}
                      </div>
                    ) : null}

                    {ganGioKhoiHanh ? (
                      <p className="ve-card__doi-hint muted small">
                        Đổi vé chỉ khả dụng trước giờ khởi hành ít nhất 2 giờ.
                      </p>
                    ) : null}

                    {choThanhToan && !hetHanLocal ? (
                      <footer className="ve-card__actions">
                        <div className="ve-card__pay-group">
                          <NutBam
                            bien="chinh"
                            className="btn--sm"
                            dangTai={dangXuLy}
                            onClick={() => void thanhToanPayOs(t.ma)}
                            con="PayOS"
                          />
                          <NutBam
                            bien="vien"
                            className="btn--sm"
                            disabled={dangXuLy}
                            onClick={() => void thanhToanTienMat(t.ma)}
                            con="Tiền mặt"
                          />
                        </div>
                        <NutBam
                          bien="huy"
                          className="btn--sm ve-card__cancel"
                          disabled={dangXuLy}
                          onClick={() => void huyVe(t.ma)}
                          con="Hủy vé"
                        />
                      </footer>
                    ) : null}
                  </article>
                )
              })}
        </div>

        {dsHien.length === 0 && !tai ? (
          <div className="cust-empty ve-panel__empty">
            <span className="cust-empty__ico" aria-hidden>
              <Ticket size={34} strokeWidth={1.35} />
            </span>
            <p className="cust-empty__title">
              {boLoc === 'ALL' ? 'Chưa có vé nào' : 'Không có vé trong mục này'}
            </p>
            <p className="muted">
              {boLoc === 'ALL'
                ? 'Đặt vé online và quản lý thanh toán ngay tại đây.'
                : 'Thử chọn bộ lọc khác hoặc đặt vé mới.'}
            </p>
            {boLoc === 'ALL' ? (
              <div className="cust-empty__cta">
                <NutLienKet bien="chinh" className="btn--sm" to="/dat-ve" con="Đặt vé ngay" />
              </div>
            ) : (
              <NutBam bien="vien" className="btn--sm" onClick={() => datBoLoc('ALL')} con="Xem tất cả vé" />
            )}
          </div>
        ) : null}
      </TheChua>

      <CuaSo open={veDienTu != null} title="Vé điện tử" size="ticket" onClose={() => datVeDienTu(null)}>
        {veDienTu ? (
          <VeDienTuPanel
            ve={veDienTu}
            coTheDoiVe={duocDoiVeDienTu}
            onDoiGhe={
              veDienTuGoc && duocDoiVeDienTu
                ? () => {
                    datVeDienTu(null)
                    moDoiVe(veDienTuGoc, 'ghe')
                  }
                : undefined
            }
            onDoiChuyen={
              veDienTuGoc && duocDoiVeDienTu
                ? () => {
                    datVeDienTu(null)
                    moDoiVe(veDienTuGoc, 'chuyen')
                  }
                : undefined
            }
          />
        ) : null}
      </CuaSo>

      <CuaSoDoiVe
        open={veDoiChon != null}
        ve={veDoiChon}
        phu={veDoiChon ? phu[veDoiChon.ma] ?? null : null}
        cheDo={cheDoDoiVe}
        onClose={() => datVeDoiChon(null)}
        onThanhCong={() => void lamMoi()}
      />
    </NenTrangKhach>
  )
}
