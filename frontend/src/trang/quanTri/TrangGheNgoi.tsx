import { useEffect, useMemo, useState } from 'react'
import { Armchair, BusFront, Search } from 'lucide-react'
import { khachHttp, moKhoiDuLieu } from '../../nguon/apiClient'
import type { PhanHoi, GheNgoi, XeKhach } from '../../nguon/kieu'
import { dungThongBao } from '../../dinhDanh/boiCanhThongBao'
import { TheChua } from '../../thanhPhan/theChua'
import { NutBam } from '../../thanhPhan/nutBam'
import { SoDoGheQuanTri } from '../../thanhPhan/quanTri/SoDoGheQuanTri'

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

export function TrangGheNgoi() {
  const { hienThi } = dungThongBao()
  const [dsXe, datXe] = useState<XeKhach[]>([])
  const [maXe, datMaXe] = useState<number | ''>('')
  const [ds, datDs] = useState<GheNgoi[]>([])
  const [tai, datTai] = useState(false)
  const [tuKhoa, datTuKhoa] = useState('')

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
      hienThi({
        loai: 'thanhCong',
        noiDung: trangThai === 'BLOCKED' ? `Đã khóa ghế ${g.maGhe}` : `Đã mở khóa ghế ${g.maGhe}`,
      })
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

  const dsXeLoc = useMemo(() => {
    const q = tuKhoa.trim().toLowerCase()
    if (!q) return dsXe
    return dsXe.filter((x) => {
      const s = `${x.bienSo} ${x.hangXe ?? ''}`.toLowerCase()
      return s.includes(q)
    })
  }, [dsXe, tuKhoa])

  return (
    <div className="admin-page admin-page--seats">
      <header className="seat-admin-hero seat-admin-hero--dash">
        <div className="seat-admin-hero__copy">
          <p className="seat-admin-hero__kicker">
            <Armchair size={16} strokeWidth={2.25} aria-hidden />
            Sơ đồ ghế
          </p>
          <h1 className="seat-admin-hero__title">Quản lý ghế theo xe</h1>
          <p className="seat-admin-hero__sub">
            Khóa ghế để bảo trì hoặc ngừng mở bán; mở khóa để đặt vé lại. Ghế đã có vé chỉ xem, không đổi tại đây.
          </p>
        </div>
        <div className="seat-admin-hero__stat" aria-live="polite">
          {xeChon && maXe !== '' && ds.length > 0 ? (
            <>
              <span className="seat-admin-hero__stat-label">Xe đang chọn</span>
              <span className="seat-admin-hero__stat-value">{xeChon.bienSo}</span>
              <span className="seat-admin-hero__stat-hint">
                {thongKe.trong} trống · {thongKe.khoa} khóa
                {thongKe.khac > 0 ? ` · ${thongKe.khac} đã giữ/bán` : ''}
              </span>
            </>
          ) : (
            <>
              <span className="seat-admin-hero__stat-label">Tổng xe</span>
              <span className="seat-admin-hero__stat-value">{dsXe.length}</span>
              <span className="seat-admin-hero__stat-hint">Chọn xe bên trái để xem sơ đồ ghế</span>
            </>
          )}
        </div>
      </header>

      <div className="seat-admin-layout">
        <aside className="seat-admin-sidebar">
          <TheChua padding="lg" className="seat-admin-sidebar__card">
            <div className="seat-admin-sidebar__head">
              <h2 className="seat-admin-sidebar__title">
                <BusFront size={18} aria-hidden />
                Danh sách xe
              </h2>
              <span className="seat-admin-sidebar__count">{dsXeLoc.length}</span>
            </div>
            <label className="seat-admin-sidebar__search">
              <Search size={16} aria-hidden className="seat-admin-sidebar__search-ico" />
              <input
                type="search"
                className="seat-admin-sidebar__search-input"
                placeholder="Tìm biển số, hãng…"
                value={tuKhoa}
                onChange={(e) => datTuKhoa(e.target.value)}
              />
            </label>
            <div className="seat-admin-bus-list" role="listbox" aria-label="Chọn xe">
              {dsXeLoc.length === 0 ? (
                <p className="muted small seat-admin-bus-list__empty">Không có xe phù hợp.</p>
              ) : (
                dsXeLoc.map((x) => {
                  const active = maXe === x.ma
                  return (
                    <button
                      key={x.ma}
                      type="button"
                      role="option"
                      aria-selected={active}
                      className={`seat-admin-bus-item${active ? ' seat-admin-bus-item--active' : ''}`}
                      onClick={() => datMaXe(x.ma)}
                    >
                      <span className="seat-admin-bus-item__plate">{x.bienSo}</span>
                      <span className="seat-admin-bus-item__meta">
                        {x.hangXe ? <span>{x.hangXe}</span> : null}
                        <span>{x.soCho} chỗ</span>
                      </span>
                    </button>
                  )
                })
              )}
            </div>
          </TheChua>
        </aside>

        <main className="seat-admin-main">
          {maXe !== '' ? (
            <>
              <TheChua padding="lg" className="seat-admin-workspace">
                <div className="seat-admin-workspace__head">
                  <div>
                    <h2 className="seat-admin-workspace__title">
                      {xeChon?.bienSo ?? 'Xe'}
                      {xeChon?.hangXe ? (
                        <span className="seat-admin-workspace__brand"> · {xeChon.hangXe}</span>
                      ) : null}
                    </h2>
                    <p className="seat-admin-workspace__sub muted">
                      {xeChon?.soCho ?? '—'} chỗ · Nhấn trực tiếp trên sơ đồ để khóa / mở khóa
                    </p>
                  </div>
                  <NutBam
                    bien="vien"
                    className="btn--sm"
                    dangTai={tai}
                    onClick={() => void taiGhe()}
                    con="Tải lại"
                  />
                </div>

                {ds.length > 0 ? (
                  <div className="seat-admin-summary seat-admin-summary--inline" role="group" aria-label="Thống kê ghế">
                    <div className="seat-admin-summary__item">
                      <span className="seat-admin-summary__val">{thongKe.tong}</span>
                      <span className="seat-admin-summary__lab">Tổng</span>
                    </div>
                    <div className="seat-admin-summary__item seat-admin-summary__item--ok">
                      <span className="seat-admin-summary__val">{thongKe.trong}</span>
                      <span className="seat-admin-summary__lab">Trống</span>
                    </div>
                    <div className="seat-admin-summary__item seat-admin-summary__item--lock">
                      <span className="seat-admin-summary__val">{thongKe.khoa}</span>
                      <span className="seat-admin-summary__lab">Khóa</span>
                    </div>
                    {thongKe.khac > 0 ? (
                      <div className="seat-admin-summary__item seat-admin-summary__item--muted">
                        <span className="seat-admin-summary__val">{thongKe.khac}</span>
                        <span className="seat-admin-summary__lab">Giữ / bán</span>
                      </div>
                    ) : null}
                  </div>
                ) : null}

                <div className="seat-admin-legend seat-admin-legend--compact">
                  <span className="seat-admin-legend__item">
                    <span className="seat-admin-dot seat-admin-dot--ok" /> Trống
                  </span>
                  <span className="seat-admin-legend__item">
                    <span className="seat-admin-dot seat-admin-dot--lock" /> Khóa
                  </span>
                  <span className="seat-admin-legend__item">
                    <span className="seat-admin-dot seat-admin-dot--busy" /> Giữ / đã bán
                  </span>
                </div>

                <SoDoGheQuanTri dsGhe={ds} dangTai={tai} onDoiTrangThai={(g, st) => void doiTrangThai(g, st)} />
              </TheChua>

              {dsSap.length > 0 ? (
                <TheChua padding="lg" className="seat-admin-detail">
                  <details className="seat-admin-detail__fold">
                    <summary className="seat-admin-detail__summary">
                      Danh sách chi tiết ({dsSap.length} ghế)
                    </summary>
                    <div className="seat-admin-chip-grid">
                      {dsSap.map((g) => {
                        const u = g.trangThai.toUpperCase()
                        const lop =
                          u === 'AVAILABLE'
                            ? 'seat-admin-chip--ok'
                            : u === 'BLOCKED'
                              ? 'seat-admin-chip--lock'
                              : 'seat-admin-chip--busy'
                        return (
                          <span key={g.ma} className={`seat-admin-chip ${lop}`} title={`T${g.tang ?? 1} · H${g.hang ?? '—'} · C${g.cot ?? '—'}`}>
                            {g.maGhe}
                          </span>
                        )
                      })}
                    </div>
                  </details>
                </TheChua>
              ) : null}
            </>
          ) : (
            <TheChua padding="lg" className="seat-admin-empty-main">
              <Armchair size={40} strokeWidth={1.5} aria-hidden />
              <h2>Chọn xe để quản lý ghế</h2>
              <p className="muted">Danh sách xe nằm ở cột trái.</p>
            </TheChua>
          )}
        </main>
      </div>
    </div>
  )
}

