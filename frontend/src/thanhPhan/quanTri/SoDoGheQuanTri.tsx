import { useEffect, useMemo, useState } from 'react'
import { Armchair, Lock, Unlock } from 'lucide-react'
import type { GheNgoi } from '../../nguon/kieu'
import { nhomTheoTang, xayDungLuoiGhe } from '../../tienIch/soDoGhe'

type Props = {
  dsGhe: GheNgoi[]
  dangTai?: boolean
  onDoiTrangThai: (g: GheNgoi, trangThai: string) => void
}

function lopGhe(st: string) {
  const u = st.toUpperCase()
  if (u === 'AVAILABLE') return 'seat-admin-cell--available'
  if (u === 'BLOCKED') return 'seat-admin-cell--blocked'
  return 'seat-admin-cell--busy'
}

export function SoDoGheQuanTri({ dsGhe, dangTai, onDoiTrangThai }: Props) {
  const tangNhom = useMemo(() => nhomTheoTang(dsGhe), [dsGhe])
  const nhieuTang = tangNhom.length > 1
  const [tangXem, datTangXem] = useState(1)

  useEffect(() => {
    const floors = nhomTheoTang(dsGhe)
    if (floors.length) datTangXem(floors[0].tang)
  }, [dsGhe])

  const gheTheoTang = useMemo(() => tangNhom.find((x) => x.tang === tangXem)?.ghe ?? [], [tangNhom, tangXem])
  const luoi = useMemo(() => xayDungLuoiGhe(gheTheoTang), [gheTheoTang])

  function bamGhe(g: GheNgoi) {
    if (g.trangThai === 'AVAILABLE') onDoiTrangThai(g, 'BLOCKED')
    else if (g.trangThai === 'BLOCKED') onDoiTrangThai(g, 'AVAILABLE')
  }

  function nutGhe(s: GheNgoi | null, key: string) {
    if (!s) {
      return <div key={key} className="seat-map__slot seat-map__slot--empty" aria-hidden />
    }
    const coTheDoi = s.trangThai === 'AVAILABLE' || s.trangThai === 'BLOCKED'
    const lop = lopGhe(s.trangThai)
    return (
      <button
        key={key}
        type="button"
        disabled={!coTheDoi || dangTai}
        className={`seat-admin-cell ${lop}`}
        onClick={() => coTheDoi && bamGhe(s)}
        title={
          s.trangThai === 'AVAILABLE'
            ? `${s.maGhe} — nhấn để khóa`
            : s.trangThai === 'BLOCKED'
              ? `${s.maGhe} — nhấn để mở khóa`
              : `${s.maGhe} — đang giữ hoặc đã bán`
        }
      >
        <Armchair size={15} aria-hidden />
        <span>{s.maGhe}</span>
        {s.trangThai === 'BLOCKED' ? <Lock size={11} className="seat-admin-cell__ico" aria-hidden /> : null}
        {s.trangThai === 'AVAILABLE' ? <Unlock size={11} className="seat-admin-cell__ico" aria-hidden /> : null}
      </button>
    )
  }

  if (dangTai && dsGhe.length === 0) {
    return <p className="seat-admin-map__loading muted">Đang tải sơ đồ ghế…</p>
  }

  if (!dangTai && dsGhe.length === 0) {
    return (
      <div className="seat-admin-map__empty">
        <Armchair size={36} strokeWidth={1.5} aria-hidden />
        <p>Chưa có ghế cho xe này.</p>
      </div>
    )
  }

  return (
    <div className="seat-admin-map">
      <p className="seat-admin-map__hint muted">
        Nhấn ghế <strong className="seat-admin-map__hint--ok">xanh</strong> để khóa · ghế{' '}
        <strong className="seat-admin-map__hint--lock">vàng</strong> để mở khóa. Ghế xám chỉ xem.
      </p>

      {nhieuTang ? (
        <div className="seat-map__tabs" role="tablist" aria-label="Tầng xe">
          {tangNhom.map(({ tang }) => (
            <button
              key={tang}
              type="button"
              role="tab"
              aria-selected={tangXem === tang}
              className={`seat-map__tab ${tangXem === tang ? 'seat-map__tab--on' : ''}`}
              onClick={() => datTangXem(tang)}
            >
              {tang === 1 ? 'Tầng dưới' : tang === 2 ? 'Tầng trên' : `Tầng ${tang}`}
            </button>
          ))}
        </div>
      ) : null}

      <div className="seat-bus seat-bus--layout seat-admin-map__bus">
        <div className="seat-bus__driver" aria-hidden>
          <span className="seat-bus__driver-badge">Đầu xe · Lái xe</span>
        </div>
        <div className="seat-map__legend-cols">
          <span className="seat-map__col-label seat-map__col-label--left">Ghế trái</span>
          <span className="seat-map__aisle-label">Lối đi</span>
          <span className="seat-map__col-label seat-map__col-label--right">Ghế phải</span>
        </div>
        <div className="seat-map__grid-wrap">
          <div className="seat-map__rows">
            {luoi.hangGhe.map((hang, ri) => {
              const maHang = hang.find((x) => x)?.hang ?? ri + 1
              const trai = hang.slice(0, luoi.cotTrai)
              const phai = hang.slice(luoi.cotTrai)
              return (
                <div key={`r-${ri}`} className="seat-map__row">
                  <span className="seat-map__row-num">H{maHang}</span>
                  <div className="seat-map__half seat-map__half--left">
                    {trai.map((s, ci) => nutGhe(s, `l-${ri}-${ci}`))}
                  </div>
                  <div className="seat-map__aisle" aria-hidden />
                  <div className="seat-map__half seat-map__half--right">
                    {phai.map((s, ci) => nutGhe(s, `r-${ri}-${ci}`))}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
