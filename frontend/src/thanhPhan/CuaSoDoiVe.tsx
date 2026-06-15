import { useEffect, useState } from 'react'
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

export function CuaSoDoiVe({ open, ve, phu, onClose, onThanhCong }: Props) {
  const { hienThi } = dungThongBao()
  const [tuNgay, datTuNgay] = useState('')
  const [dsChuyen, datDsChuyen] = useState<ChuyenXe[]>([])
  const [chon, datChon] = useState<ChuyenXe | null>(null)
  const [dsGhe, datDsGhe] = useState<GheNgoi[]>([])
  const [gheDaGiu, datGheDaGiu] = useState<Set<number>>(new Set())
  const [maGheChon, datMaGheChon] = useState<number | null>(null)
  const [taiTim, datTaiTim] = useState(false)
  const [dangGui, datDangGui] = useState(false)
  const [daTim, datDaTim] = useState(false)

  useEffect(() => {
    if (!open || !phu) return
    const goc = phu.thoiDiemKhoiHanh ? new Date(phu.thoiDiemKhoiHanh) : new Date()
    const d = new Date(goc)
    d.setHours(0, 0, 0, 0)
    datTuNgay(sangLocalDatetime(d))
    datDsChuyen([])
    datChon(null)
    datDsGhe([])
    datGheDaGiu(new Set())
    datMaGheChon(null)
    datDaTim(false)
  }, [open, ve?.ma, phu])

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
    if (!ve) return
    datChon(c)
    datMaGheChon(null)
    try {
      const [ghe, thuTu] = await Promise.all([
        moKhoiDuLieu(khachHttp.get<PhanHoi<GheNgoi[]>>(`/ghe-ngoi/xe/${c.maXe}`)),
        moKhoiDuLieu(khachHttp.get<PhanHoi<number[]>>(`/chuyen-xe/${c.ma}/ghe-da-giu`)),
      ])
      const held = new Set(thuTu)
      if (c.ma === ve.maChuyen) {
        held.delete(ve.maGhe)
      }
      datGhe(ghe)
      datGheDaGiu(held)
    } catch (e: unknown) {
      hienThi({ loai: 'loi', noiDung: e instanceof Error ? e.message : 'Lỗi tải ghế' })
    }
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

  return (
    <CuaSo
      open={open}
      title="Đổi chuyến / đổi ngày"
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
            <TruongNhap
              nhan="Ngày chuyến mới"
              type="datetime-local"
              value={tuNgay}
              onChange={(e) => datTuNgay(e.target.value)}
            />
            <NutBam bien="chinh" className="btn--sm" dangTai={taiTim} onClick={() => void timChuyen()} con="Tìm chuyến" />
          </div>

          {daTim ? (
            <div className="doi-ve__trips">
              <h3 className="doi-ve__sub">
                <CalendarDays size={17} aria-hidden />
                Chọn chuyến ({dsChuyen.length})
              </h3>
              {dsChuyen.length === 0 ? (
                <p className="muted">Không có chuyến trong khoảng thời gian này.</p>
              ) : (
                <ul className="trip-cards doi-ve__trip-list">
                  {dsChuyen.map((c) => {
                    const on = chon?.ma === c.ma
                    const laHienTai = c.ma === ve.maChuyen
                    return (
                      <li key={c.ma}>
                        <button
                          type="button"
                          className={`trip-card${on ? ' trip-card--on' : ''}`}
                          onClick={() => void khiChonChuyen(c)}
                        >
                          <div className="trip-card__main">
                            <span className="trip-card__time">{dinhDangNgayGio(c.thoiDiemKhoiHanh)}</span>
                            <span className="trip-card__meta">
                              {laHienTai ? 'Chuyến hiện tại · ' : ''}
                              {dinhDangVnd(c.giaVe)}
                            </span>
                          </div>
                        </button>
                      </li>
                    )
                  })}
                </ul>
              )}
            </div>
          ) : null}

          {chon ? (
            <div className="doi-ve__seat">
              <h3 className="doi-ve__sub">
                <span>Chọn ghế mới</span>
                {gheLabel ? (
                  <span className="muted">
                    Đã chọn: <strong>{gheLabel}</strong>
                  </span>
                ) : null}
              </h3>
              <SoDoGheXe
                dsGhe={dsGhe}
                gheDaGiu={gheDaGiu}
                maGheChon={maGheChon}
                onChonMaGhe={(ma) => datMaGheChon(ma)}
              />
            </div>
          ) : null}
        </div>
      ) : null}
    </CuaSo>
  )
}
