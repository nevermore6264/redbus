import { useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { MapPinned, Route, Search } from 'lucide-react'
import { khachHttp, moKhoiDuLieu } from '../../nguon/apiClient'
import type { DiemDungChan, PhanHoi, TuyenDuong } from '../../nguon/kieu'
import { dungThongBao } from '../../dinhDanh/boiCanhThongBao'
import { TheChua } from '../../thanhPhan/theChua'
import { KhungQuanLyDiemDung } from '../../thanhPhan/khungQuanLyDiemDung'
import { taiDiemDungTheoTuyen } from '../../tienIch/loTrinhTuyen'

export function TrangDiemDungChan() {
  const [searchParams] = useSearchParams()
  const { hienThi } = dungThongBao()
  const [dsTuyen, datTuyen] = useState<TuyenDuong[]>([])
  const [maTuyen, datMaTuyen] = useState<number | ''>('')
  const [diemDungTheoTuyen, datDiemDungTheoTuyen] = useState<Record<number, DiemDungChan[]>>({})
  const [tuKhoa, datTuKhoa] = useState('')

  async function taiTuyen() {
    try {
      const t = await moKhoiDuLieu(khachHttp.get<PhanHoi<TuyenDuong[]>>('/tuyen-duong'))
      datTuyen(t)
      datDiemDungTheoTuyen(await taiDiemDungTheoTuyen(t))
      const maTuUrl = searchParams.get('tuyen')
      if (maTuUrl) {
        const ma = Number(maTuUrl)
        if (t.some((x) => x.ma === ma)) datMaTuyen(ma)
      } else if (t.length && maTuyen === '') {
        datMaTuyen(t[0].ma)
      }
    } catch (e: unknown) {
      hienThi({ loai: 'loi', noiDung: e instanceof Error ? e.message : 'Lỗi tải tuyến' })
    }
  }

  useEffect(() => {
    void taiTuyen()
  }, [])

  const tuyenChon = dsTuyen.find((t) => t.ma === maTuyen)
  const soDiemChon = maTuyen !== '' ? (diemDungTheoTuyen[maTuyen]?.length ?? 0) : 0

  const dsTuyenLoc = useMemo(() => {
    const q = tuKhoa.trim().toLowerCase()
    if (!q) return dsTuyen
    return dsTuyen.filter((t) => {
      const chuoi = `${t.diemDi} ${t.diemDen}`.toLowerCase()
      return chuoi.includes(q)
    })
  }, [dsTuyen, tuKhoa])

  return (
    <div className="admin-page admin-page--stops">
      <header className="stops-hero">
        <div className="stops-hero__copy">
          <p className="stops-hero__kicker">
            <MapPinned size={16} strokeWidth={2.25} aria-hidden />
            Lộ trình &amp; điểm dừng
          </p>
          <h1 className="stops-hero__title">Điểm dừng chân</h1>
          <p className="stops-hero__lead">
            Cấu hình thứ tự đi qua và thời gian dừng trên từng tuyến — khách chọn điểm đón/trả khi đặt vé.
          </p>
        </div>
        <div className="stops-hero__stat" aria-live="polite">
          <span className="stops-hero__stat-label">Tuyến đang quản lý</span>
          <span className="stops-hero__stat-value">{dsTuyen.length}</span>
          <span className="stops-hero__stat-hint">
            {tuyenChon
              ? `${tuyenChon.diemDi} → ${tuyenChon.diemDen} · ${soDiemChon} điểm dừng`
              : 'Chọn tuyến bên trái để bắt đầu'}
          </span>
        </div>
      </header>

      <div className="stops-layout">
        <aside className="stops-sidebar">
          <TheChua padding="lg" className="stops-sidebar__card">
            <div className="stops-sidebar__head">
              <h2 className="stops-sidebar__title">
                <Route size={18} aria-hidden />
                Danh sách tuyến
              </h2>
              <span className="stops-sidebar__count">{dsTuyenLoc.length}</span>
            </div>
            <label className="stops-sidebar__search">
              <Search size={16} aria-hidden className="stops-sidebar__search-ico" />
              <input
                type="search"
                className="stops-sidebar__search-input"
                placeholder="Tìm điểm đi, điểm đến…"
                value={tuKhoa}
                onChange={(e) => datTuKhoa(e.target.value)}
              />
            </label>
            <div className="stops-route-list" role="listbox" aria-label="Chọn tuyến">
              {dsTuyenLoc.length === 0 ? (
                <p className="stops-route-list__empty muted">
                  {dsTuyen.length === 0 ? 'Chưa có tuyến nào.' : 'Không khớp từ khóa tìm kiếm.'}
                </p>
              ) : (
                dsTuyenLoc.map((t) => {
                  const soDiem = diemDungTheoTuyen[t.ma]?.length ?? 0
                  const active = maTuyen === t.ma
                  return (
                    <button
                      key={t.ma}
                      type="button"
                      role="option"
                      aria-selected={active}
                      className={`stops-route-item${active ? ' stops-route-item--active' : ''}`}
                      onClick={() => datMaTuyen(t.ma)}
                    >
                      <span className="stops-route-item__route">
                        <span className="stops-route-item__di">{t.diemDi}</span>
                        <span className="stops-route-item__arrow" aria-hidden>
                          →
                        </span>
                        <span className="stops-route-item__den">{t.diemDen}</span>
                      </span>
                      <span className="stops-route-item__meta">
                        <span
                          className={`stops-route-item__badge${soDiem > 0 ? ' stops-route-item__badge--on' : ''}`}
                        >
                          {soDiem} điểm
                        </span>
                        {t.khoangCachKm != null ? <span>{t.khoangCachKm} km</span> : null}
                      </span>
                    </button>
                  )
                })
              )}
            </div>
          </TheChua>
        </aside>

        <main className="stops-main">
          {tuyenChon && maTuyen !== '' ? (
            <KhungQuanLyDiemDung
              maTuyen={maTuyen}
              tuyen={tuyenChon}
              onDsThayDoi={(ds) => datDiemDungTheoTuyen((prev) => ({ ...prev, [maTuyen]: ds }))}
            />
          ) : (
            <TheChua padding="lg" className="stops-empty">
              <MapPinned size={40} strokeWidth={1.5} className="stops-empty__icon" aria-hidden />
              <h2 className="stops-empty__title">Chọn tuyến để cấu hình</h2>
              <p className="stops-empty__text muted">
                Mỗi tuyến có lộ trình riêng. Thêm điểm dừng giữa điểm đi và điểm đến để khách chọn nơi lên/xuống xe.
              </p>
            </TheChua>
          )}
        </main>
      </div>
    </div>
  )
}
