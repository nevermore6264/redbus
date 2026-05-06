import { useEffect, useMemo, useState } from 'react'
import { Armchair, Ban } from 'lucide-react'
import { khachHttp, moKhoiDuLieu } from '../../nguon/apiClient'
import type { PhanHoi, GheNgoi, XeKhach } from '../../nguon/kieu'
import { dungThongBao } from '../../dinhDanh/boiCanhThongBao'
import { TheChua, TieuDeThe } from '../../thanhPhan/theChua'
import { TruongChon } from '../../thanhPhan/truongNhap'
import { NutBam } from '../../thanhPhan/nutBam'

function sapXepGhe(ds: GheNgoi[]) {
  return [...ds].sort((a, b) => {
    const ta = a.tang ?? 1
    const tb = b.tang ?? 1
    if (ta !== tb) return ta - tb
    const ha = a.hang ?? 0
    const hb = b.hang ?? 0
    if (ha !== hb) return ha - hb
    return (a.cot ?? 0) - (b.cot ?? 0)
  })
}

function tenTrangThai(st: string) {
  if (st === 'AVAILABLE') return 'Còn trống'
  if (st === 'BLOCKED') return 'Đang khóa'
  return 'Đang giữ / đã bán'
}

function lopBadgeTrangThai(st: string) {
  const u = st.toUpperCase()
  if (u === 'AVAILABLE') return 'seat-admin-badge--available'
  if (u === 'BLOCKED') return 'seat-admin-badge--blocked'
  return 'seat-admin-badge--other'
}

export function TrangGheNgoi() {
  const { hienThi } = dungThongBao()
  const [dsXe, datXe] = useState<XeKhach[]>([])
  const [maXe, datMaXe] = useState<number | ''>('')
  const [ds, datDs] = useState<GheNgoi[]>([])
  const [tai, datTai] = useState(false)

  useEffect(() => {
    void (async () => {
      try {
        const x = await moKhoiDuLieu(khachHttp.get<PhanHoi<XeKhach[]>>('/xe-khach'))
        datXe(x)
        if (x.length && maXe === '') datMaXe(x[0].ma)
      } catch (e: unknown) {
        hienThi({ loai: 'loi', noiDung: e instanceof Error ? e.message : 'Lỗi tải xe' })
      }
    })()
  }, [])

  async function taiGhe() {
    if (maXe === '') return
    datTai(true)
    datDs([])
    try {
      const g = await moKhoiDuLieu(khachHttp.get<PhanHoi<GheNgoi[]>>(`/ghe-ngoi/xe/${maXe}`))
      datDs(g)
    } catch (e: unknown) {
      hienThi({ loai: 'loi', noiDung: e instanceof Error ? e.message : 'Lỗi tải ghế' })
    } finally {
      datTai(false)
    }
  }

  useEffect(() => {
    if (maXe !== '') void taiGhe()
  }, [maXe])

  async function doiTrangThai(g: GheNgoi, trangThai: string) {
    try {
      await moKhoiDuLieu(
        khachHttp.put<PhanHoi<unknown>>(`/ghe-ngoi/${g.ma}/trang-thai`, { trangThai }),
      )
      void taiGhe()
      hienThi({ loai: 'thanhCong', noiDung: 'Đã cập nhật trạng thái ghế.' })
    } catch (e: unknown) {
      hienThi({ loai: 'loi', noiDung: e instanceof Error ? e.message : 'Lỗi cập nhật' })
    }
  }

  const xeChon = maXe !== '' ? dsXe.find((x) => x.ma === maXe) : undefined
  const dsSap = useMemo(() => sapXepGhe(ds), [ds])

  const thongKe = useMemo(() => {
    let trong = 0
    let khoa = 0
    let khac = 0
    for (const g of ds) {
      if (g.trangThai === 'AVAILABLE') trong++
      else if (g.trangThai === 'BLOCKED') khoa++
      else khac++
    }
    return { trong, khoa, khac, tong: ds.length }
  }, [ds])

  return (
    <div className="admin-page admin-page--seats">
      <section className="seat-admin-hero" aria-labelledby="seat-admin-title">
        <div className="seat-admin-hero__icon" aria-hidden>
          <Armchair size={26} strokeWidth={1.9} />
        </div>
        <div className="seat-admin-hero__copy">
          <h1 id="seat-admin-title" className="seat-admin-hero__title">
            Quản lý ghế theo xe
          </h1>
          <p className="seat-admin-hero__sub">
            Khóa ghế để bảo trì hoặc không mở bán; mở khóa để đặt vé lại. Ghế đang có vé không đổi trạng thái tại đây.
          </p>
        </div>
      </section>

      <TheChua padding="lg" className="seat-admin-card">
        <TieuDeThe
          title="Chọn xe"
          subtitle={xeChon ? `${xeChon.bienSo}${xeChon.hangXe ? ` · ${xeChon.hangXe}` : ''} · ${xeChon.soCho} chỗ` : 'Chọn biển số để tải danh sách ghế'}
          action={
            <div className="seat-admin-toolbar__pick">
              <TruongChon
                nhan="Xe"
                id="seat-admin-xe"
                value={maXe === '' ? '' : String(maXe)}
                onChange={(e) => datMaXe(e.target.value ? Number(e.target.value) : '')}
              >
                {dsXe.map((x) => (
                  <option key={x.ma} value={x.ma}>
                    {x.bienSo}
                  </option>
                ))}
              </TruongChon>
              <NutBam
                bien="vien"
                className="btn--sm seat-admin-refresh"
                dangTai={tai}
                onClick={() => void taiGhe()}
                con="Tải lại"
              />
            </div>
          }
        />

        {maXe !== '' && ds.length > 0 ? (
          <div className="seat-admin-summary" role="group" aria-label="Thống kê ghế">
            <div className="seat-admin-summary__item">
              <span className="seat-admin-summary__val">{thongKe.tong}</span>
              <span className="seat-admin-summary__lab">Tổng ghế</span>
            </div>
            <div className="seat-admin-summary__item seat-admin-summary__item--ok">
              <span className="seat-admin-summary__val">{thongKe.trong}</span>
              <span className="seat-admin-summary__lab">Còn trống</span>
            </div>
            <div className="seat-admin-summary__item seat-admin-summary__item--lock">
              <span className="seat-admin-summary__val">{thongKe.khoa}</span>
              <span className="seat-admin-summary__lab">Đang khóa</span>
            </div>
            {thongKe.khac > 0 ? (
              <div className="seat-admin-summary__item seat-admin-summary__item--muted">
                <span className="seat-admin-summary__val">{thongKe.khac}</span>
                <span className="seat-admin-summary__lab">Đã giữ / đã bán</span>
              </div>
            ) : null}
          </div>
        ) : null}

        <div className="seat-admin-legend" aria-hidden="false">
          <span className="seat-admin-legend__item">
            <span className="seat-admin-dot seat-admin-dot--ok" /> Còn trống — có thể khóa
          </span>
          <span className="seat-admin-legend__item">
            <span className="seat-admin-dot seat-admin-dot--lock" /> Đang khóa — có thể mở
          </span>
          <span className="seat-admin-legend__item">
            <span className="seat-admin-dot seat-admin-dot--busy" /> Đang giữ hoặc đã bán — chỉ xem
          </span>
        </div>
      </TheChua>

      <TheChua padding="none" className="seat-admin-table-card">
        <div className="table-wrap-pad">
          <h2 className="seat-admin-table-title">Danh sách ghế</h2>
          <p className="seat-admin-table-title-sub muted">Sắp xếp theo tầng, hàng và cột.</p>
        </div>
        <div className="table-scroll">
          <table className="data-table seat-admin-table">
            <thead>
              <tr>
                <th>Ký hiệu ghế</th>
                <th>Tầng</th>
                <th>Hàng</th>
                <th>Cột</th>
                <th>Trạng thái</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {tai && ds.length === 0 ? (
                <tr>
                  <td colSpan={6} className="seat-admin-loading">
                    Đang tải danh sách ghế…
                  </td>
                </tr>
              ) : null}
              {!tai && ds.length === 0 && maXe !== '' ? (
                <tr>
                  <td colSpan={6} className="seat-admin-empty">
                    Không có ghế cho xe này hoặc chưa cấu hình sơ đồ.
                  </td>
                </tr>
              ) : null}
              {dsSap.map((g) => (
                <tr key={g.ma} className={`seat-admin-row seat-admin-row--${g.trangThai.toUpperCase() === 'BLOCKED' ? 'blocked' : 'norm'}`}>
                  <td>
                    <strong className="seat-admin-seat-code">{g.maGhe}</strong>
                  </td>
                  <td className="mono">{g.tang ?? '—'}</td>
                  <td className="mono">{g.hang ?? '—'}</td>
                  <td className="mono">{g.cot ?? '—'}</td>
                  <td>
                    <span className={`seat-admin-badge ${lopBadgeTrangThai(g.trangThai)}`}>
                      {tenTrangThai(g.trangThai)}
                    </span>
                  </td>
                  <td className="row-actions">
                    {g.trangThai === 'BLOCKED' ? (
                      <NutBam
                        bien="chinh"
                        className="btn--sm"
                        onClick={() => void doiTrangThai(g, 'AVAILABLE')}
                        con="Mở khóa"
                      />
                    ) : g.trangThai === 'AVAILABLE' ? (
                      <NutBam
                        bien="vien"
                        className="btn--sm"
                        onClick={() => void doiTrangThai(g, 'BLOCKED')}
                        con="Khóa ghế"
                      />
                    ) : (
                      <span className="muted small seat-admin-readonly">
                        <Ban size={14} style={{ verticalAlign: '-0.15em' }} aria-hidden /> Chỉ xem
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </TheChua>
    </div>
  )
}
