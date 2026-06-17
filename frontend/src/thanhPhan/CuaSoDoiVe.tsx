import { useEffect, useRef, useState } from 'react'
import { CalendarDays, Clock, Info } from 'lucide-react'
import { khachHttp, moKhoiDuLieu } from '../nguon/apiClient'
import type { ChuyenXe, ChuyenXeLoc, GheNgoi, PhanHoi, VeXe } from '../nguon/kieu'
import { dungThongBao } from '../dinhDanh/boiCanhThongBao'
import { CuaSo } from './cuaSo'
import { NutBam } from './nutBam'
import { TruongNhap } from './truongNhap'
import { SoDoGheXe } from './SoDoGheXe'
import { dinhDangNgayGio, dinhDangVnd } from '../tienIch/dinhDang'

export type ThongTinVeDoi = {
  diemDi: string
  diemDen: string
  tuyenDayDu: string
  gio: string
  maGhe: string
  maTuyen: number
  maChuyen: number
  maGheId: number
  thoiDiemKhoiHanh: string
}

type Props = {
  open: boolean
  ve: VeXe | null
  phu: ThongTinVeDoi | null
  cheDo?: 'chuyen' | 'ghe'
  onClose: () => void
  onThanhCong: () => void
}

function sangLocalDatetime(d: Date) {
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`
}

export function coTheDoiVe(thoiDiemKhoiHanh: string | undefined): boolean {
  if (!thoiDiemKhoiHanh) return false
  const kh = new Date(thoiDiemKhoiHanh).getTime()
  if (Number.isNaN(kh)) return false
  return kh - Date.now() >= 2 * 60 * 60 * 1000
}

export function CuaSoDoiVe({ open, ve, phu, cheDo = 'chuyen', onClose, onThanhCong }: Props) {
  const { hienThi } = dungThongBao()
  const [tuNgay, datTuNgay] = useState('')
  const [dsChuyen, datDsChuyen] = useState<ChuyenXe[]>([])
  const [chon, datChon] = useState<ChuyenXe | null>(null)
  const [dsGhe, datDsGhe] = useState<GheNgoi[]>([])
  const [gheDaGiu, datGheDaGiu] = useState<Set<number>>(new Set())
  const [maGheChon, datMaGheChon] = useState<number | null>(null)
  const [taiTim, datTaiTim] = useState(false)
  const [taiGhe, datTaiGhe] = useState(false)
  const [dangGui, datDangGui] = useState(false)
  const [daTim, datDaTim] = useState(false)

  const thoiDiemKhoiHanh = phu?.thoiDiemKhoiHanh
  const khuGheRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open || !phu || !ve) return

    let huy = false

    const goc = thoiDiemKhoiHanh ? new Date(thoiDiemKhoiHanh) : new Date()
    const d = new Date(goc)
    d.setHours(0, 0, 0, 0)
    const bayGio = new Date()
    datTuNgay(sangLocalDatetime(d.getTime() < bayGio.getTime() ? bayGio : d))
    datDsChuyen([])
    datMaGheChon(null)
    datDaTim(false)

    async function napGheChoChuyen(cx: ChuyenXe) {
      datTaiGhe(true)
      try {
        const [ghe, thuTu] = await Promise.all([
          moKhoiDuLieu(khachHttp.get<PhanHoi<GheNgoi[]>>(`/ghe-ngoi/xe/${cx.maXe}`)),
          moKhoiDuLieu(khachHttp.get<PhanHoi<number[]>>(`/chuyen-xe/${cx.ma}/ghe-da-giu`)),
        ])
        if (huy) return
        const held = new Set(thuTu)
        if (cx.ma === ve.maChuyen) {
          held.delete(ve.maGhe)
        }
        datChon(cx)
        datDsGhe(ghe)
        datGheDaGiu(held)
        if (ghe.length === 0) {
          hienThi({ loai: 'thongTin', noiDung: 'Xe chưa có sơ đồ ghế — liên hệ hỗ trợ' })
        }
      } catch (e: unknown) {
        if (!huy) {
          datChon(null)
          datDsGhe([])
          datGheDaGiu(new Set())
          hienThi({ loai: 'loi', noiDung: e instanceof Error ? e.message : 'Lỗi tải ghế' })
        }
      } finally {
        if (!huy) datTaiGhe(false)
      }
    }

    if (cheDo === 'ghe') {
      void (async () => {
        datTaiGhe(true)
        try {
          const cx = await moKhoiDuLieu(
            khachHttp.get<PhanHoi<ChuyenXe>>(`/chuyen-xe/${ve.maChuyen}`),
          )
          if (huy) return
          await napGheChoChuyen(cx)
        } catch (e: unknown) {
          if (!huy) {
            datChon(null)
            datDsGhe([])
            datGheDaGiu(new Set())
            datTaiGhe(false)
            hienThi({
              loai: 'loi',
              noiDung: e instanceof Error ? e.message : 'Không tải được chuyến hiện tại',
            })
          }
        }
      })()
    } else {
      datChon(null)
      datDsGhe([])
      datGheDaGiu(new Set())
      datTaiGhe(false)
    }

    return () => {
      huy = true
    }
  }, [open, ve?.ma, ve?.maChuyen, cheDo, thoiDiemKhoiHanh])

  async function taiGheChoChuyen(c: ChuyenXe) {
    if (!ve) return
    datMaGheChon(null)
    datChon(c)
    datDsGhe([])
    datGheDaGiu(new Set())
    datTaiGhe(true)
    try {
      const [ghe, thuTu] = await Promise.all([
        moKhoiDuLieu(khachHttp.get<PhanHoi<GheNgoi[]>>(`/ghe-ngoi/xe/${c.maXe}`)),
        moKhoiDuLieu(khachHttp.get<PhanHoi<number[]>>(`/chuyen-xe/${c.ma}/ghe-da-giu`)),
      ])
      const held = new Set(thuTu)
      if (c.ma === ve.maChuyen) {
        held.delete(ve.maGhe)
      }
      datDsGhe(ghe)
      datGheDaGiu(held)
      if (ghe.length === 0) {
        hienThi({ loai: 'thongTin', noiDung: 'Chuyến này chưa có ghế để chọn' })
      } else {
        requestAnimationFrame(() => {
          khuGheRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
        })
      }
    } catch (e: unknown) {
      datChon(null)
      datDsGhe([])
      datGheDaGiu(new Set())
      hienThi({ loai: 'loi', noiDung: e instanceof Error ? e.message : 'Lỗi tải ghế' })
    } finally {
      datTaiGhe(false)
    }
  }

  async function timChuyen() {
    if (!phu || !tuNgay) return
    datTaiTim(true)
    datChon(null)
    datDsGhe([])
    datMaGheChon(null)
    try {
      const loc = await moKhoiDuLieu(
        khachHttp.get<PhanHoi<ChuyenXeLoc[]>>('/chuyen-xe/tim-kiem', {
          params: {
            maTuyen: String(phu.maTuyen),
            tuLuc: new Date(tuNgay).toISOString(),
          },
        }),
      )
      const ds = loc.map((x) => x.chuyen).filter((c) => c.trangThai === 'SCHEDULED')
      datDsChuyen(ds)
      datDaTim(true)
      if (ds.length === 0) {
        hienThi({ loai: 'thongTin', noiDung: 'Không có chuyến phù hợp trong ngày đã chọn' })
      }
    } catch (e: unknown) {
      hienThi({ loai: 'loi', noiDung: e instanceof Error ? e.message : 'Lỗi tìm chuyến' })
    } finally {
      datTaiTim(false)
    }
  }

  async function khiChonChuyen(c: ChuyenXe) {
    await taiGheChoChuyen(c)
  }

  async function xacNhan() {
    if (!ve || !chon || maGheChon == null) return
    if (chon.ma === ve.maChuyen && maGheChon === ve.maGhe) {
      hienThi({ loai: 'thongTin', noiDung: 'Vui lòng chọn chuyến hoặc ghế khác với vé hiện tại' })
      return
    }
    datDangGui(true)
    try {
      if (chon.ma === ve.maChuyen) {
        await moKhoiDuLieu(
          khachHttp.post<PhanHoi<VeXe>>(`/ve-xe/${ve.ma}/doi-ghe`, { maGheMoi: maGheChon }),
        )
      } else {
        await moKhoiDuLieu(
          khachHttp.post<PhanHoi<VeXe>>(`/ve-xe/${ve.ma}/doi-chuyen`, {
            maChuyenMoi: chon.ma,
            maGheMoi: maGheChon,
          }),
        )
      }
      hienThi({ loai: 'thanhCong', noiDung: 'Đã đổi lịch trình thành công' })
      onThanhCong()
      onClose()
    } catch (e: unknown) {
      hienThi({ loai: 'loi', noiDung: e instanceof Error ? e.message : 'Đổi vé thất bại' })
    } finally {
      datDangGui(false)
    }
  }

  const gheLabel = maGheChon != null ? dsGhe.find((g) => g.ma === maGheChon)?.maGhe : null

  const tieuDe = cheDo === 'ghe' ? 'Đổi ghế' : 'Đổi chuyến / đổi ngày'

  return (
    <CuaSo
      open={open}
      title={tieuDe}
      size="xl"
      onClose={onClose}
      footer={
        <div className="doi-ve-foot">
          <NutBam bien="vien" onClick={onClose} disabled={dangGui} con="Hủy" />
          <NutBam
            bien="chinh"
            dangTai={dangGui}
            disabled={!chon || maGheChon == null}
            onClick={() => void xacNhan()}
            con="Xác nhận đổi vé"
          />
        </div>
      }
    >
      {phu && ve ? (
        <div className="doi-ve">
          <p className="doi-ve__note">
            <Info size={16} aria-hidden />
            Chỉ đổi trước giờ khởi hành <strong>ít nhất 2 giờ</strong>, cùng tuyến{' '}
            <strong>{phu.tuyenDayDu}</strong>.
          </p>

          <div className="doi-ve__current">
            <span className="muted small">Vé hiện tại</span>
            <p>
              <Clock size={15} aria-hidden /> {phu.gio} · Ghế <strong>{phu.maGhe}</strong>
            </p>
          </div>

          <div className="doi-ve__search">
            {cheDo === 'chuyen' ? (
              <>
                <TruongNhap
                  nhan="Ngày chuyến mới"
                  type="datetime-local"
                  value={tuNgay}
                  min={sangLocalDatetime(new Date())}
                  onChange={(e) => datTuNgay(e.target.value)}
                />
                <NutBam
                  bien="chinh"
                  className="doi-ve__search-btn"
                  dangTai={taiTim}
                  onClick={() => void timChuyen()}
                  con="Tìm chuyến"
                />
              </>
            ) : (
              <p className="muted small">
                Chọn ghế trống khác trên chuyến <strong>{phu.gio}</strong>.
              </p>
            )}
          </div>

          <div className={`doi-ve__main${cheDo === 'chuyen' && daTim ? ' doi-ve__main--split' : ''}`}>
            {cheDo === 'chuyen' && daTim ? (
              <div className="doi-ve__trips">
                <h3 className="doi-ve__sub">
                  <CalendarDays size={17} aria-hidden />
                  Chọn chuyến ({dsChuyen.length})
                </h3>
                {dsChuyen.length === 0 ? (
                  <p className="muted">Không có chuyến trong khoảng thời gian này.</p>
                ) : (
                  <ul className="doi-ve__trip-list">
                    {dsChuyen.map((c) => {
                      const on = chon?.ma === c.ma
                      const laHienTai = c.ma === ve.maChuyen
                      return (
                        <li key={c.ma}>
                          <button
                            type="button"
                            className={`doi-ve__trip-btn${on ? ' doi-ve__trip-btn--on' : ''}`}
                            onClick={() => void khiChonChuyen(c)}
                          >
                            <span className="doi-ve__trip-time">{dinhDangNgayGio(c.thoiDiemKhoiHanh)}</span>
                            <span className="doi-ve__trip-price">{dinhDangVnd(c.giaVe)}</span>
                            {laHienTai ? <span className="doi-ve__trip-tag">Chuyến hiện tại</span> : null}
                          </button>
                        </li>
                      )
                    })}
                  </ul>
                )}
              </div>
            ) : null}

            {(cheDo === 'ghe' || chon || taiGhe) ? (
              <div className="doi-ve__seat" ref={khuGheRef}>
                <h3 className="doi-ve__sub">
                  <span>Chọn ghế mới</span>
                  {chon ? (
                    <span className="muted small">
                      {dinhDangNgayGio(chon.thoiDiemKhoiHanh)}
                    </span>
                  ) : null}
                  {gheLabel ? (
                    <span className="doi-ve__picked">
                      Ghế <strong>{gheLabel}</strong>
                    </span>
                  ) : null}
                </h3>
                {taiGhe ? (
                  <div className="doi-ve__seat-loading" aria-busy="true">
                    <span className="doi-ve__seat-spinner" aria-hidden />
                    <span>Đang tải sơ đồ ghế…</span>
                  </div>
                ) : chon && dsGhe.length > 0 ? (
                  <SoDoGheXe
                    compact
                    dsGhe={dsGhe}
                    gheDaGiu={gheDaGiu}
                    maGheChon={maGheChon}
                    onChonMaGhe={(ma) => datMaGheChon(ma)}
                  />
                ) : chon ? (
                  <p className="muted small">Không có ghế để hiển thị trên chuyến này.</p>
                ) : (
                  <p className="muted small">Chọn một chuyến bên trái để xem ghế trống.</p>
                )}
              </div>
            ) : null}
          </div>
        </div>
      ) : null}
    </CuaSo>
  )
}
