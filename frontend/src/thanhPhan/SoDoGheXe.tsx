import { useMemo, useState } from 'react'
import { Armchair } from 'lucide-react'
import type { GheNgoi } from '../nguon/kieu'
import { nhomTheoTang, xayDungLuoiGhe } from '../tienIch/soDoGhe'

type Props = {
  dsGhe: GheNgoi[]
  gheDaGiu: Set<number>
  maGheChon?: number | null
  dsMaGheChon?: Set<number>
  onChonMaGhe: (ma: number) => void
  compact?: boolean
}

export function SoDoGheXe({
  dsGhe,
  gheDaGiu,
  maGheChon,
  dsMaGheChon,
  onChonMaGhe,
  compact = false,
}: Props) {
  const nhieuLuaChon = dsMaGheChon != null

  function dangChon(ma: number) {
    if (nhieuLuaChon) return dsMaGheChon!.has(ma)
    return maGheChon === ma
  }

  const tangNhom = useMemo(() => nhomTheoTang(dsGhe), [dsGhe])
  const nhieuTang = tangNhom.length > 1
  const [tangChon, datTangChon] = useState<number | null>(null)

  const tangXem = useMemo(() => {
    if (tangChon != null && tangNhom.some((x) => x.tang === tangChon)) return tangChon
    return tangNhom[0]?.tang ?? 1
  }, [tangChon, tangNhom])

  const gheTheoTang = useMemo(
    () => tangNhom.find((x) => x.tang === tangXem)?.ghe ?? [],
    [tangNhom, tangXem],
  )

  const luoi = useMemo(() => xayDungLuoiGhe(gheTheoTang), [gheTheoTang])

  function nutGhe(s: GheNgoi | null, key: string) {
    if (!s) {
      return <div key={key} className="seat-map__slot seat-map__slot--empty" aria-hidden />
    }
    const bo =
      gheDaGiu.has(s.ma) || s.trangThai === 'BLOCKED' || s.trangThai?.toUpperCase() === 'BLOCKED'
    const chonGhe = dangChon(s.ma)
    return (
      <button
        key={key}
        type="button"
        disabled={bo}
        className={`seat-cell ${bo ? 'seat-cell--occ' : ''} ${chonGhe ? 'seat-cell--pick' : ''}`}
        onClick={() => !bo && onChonMaGhe(s.ma)}
        aria-pressed={chonGhe}
      >
        <Armchair size={16} aria-hidden />
        <span>{s.maGhe}</span>
      </button>
    )
  }

  if (!dsGhe.length) {
    return <p className="muted small seat-map__empty">Chưa có ghế trên xe này.</p>
  }

  return (
    <div className={`seat-map${compact ? ' seat-map--compact' : ''}`}>
      {!compact ? (
        <p className="seat-map__hint muted">
          {nhieuLuaChon
            ? 'Nhấn nhiều ghế trống để chọn — nhấn lại để bỏ chọn. Tối đa 10 ghế / lần.'
            : 'Chọn một ghế trống.'}{' '}
          Đầu xe — nhìn từ trước ra sau.
          {nhieuTang ? (
            <>
              {' '}
              Xe giường nằm: chọn <strong>tầng</strong> trước.
            </>
          ) : null}
        </p>
      ) : null}

      {nhieuTang ? (
        <div className="seat-map__tabs" role="tablist" aria-label="Tầng xe">
          {tangNhom.map(({ tang }) => (
            <button
              key={tang}
              type="button"
              role="tab"
              aria-selected={tangXem === tang}
              className={`seat-map__tab ${tangXem === tang ? 'seat-map__tab--on' : ''}`}
              onClick={() => datTangChon(tang)}
            >
              {tang === 1 ? 'Tầng dưới' : tang === 2 ? 'Tầng trên' : `Tầng ${tang}`}
            </button>
          ))}
        </div>
      ) : null}

      <div className="seat-bus seat-bus--layout">
        <div className="seat-bus__driver" aria-hidden>
          <span className="seat-bus__driver-badge">Đầu xe · Lái xe</span>
        </div>

        <div className="seat-map__legend-cols">
          <span className="seat-map__col-label seat-map__col-label--left">Ghế trái</span>
          <span className="seat-map__aisle-label">Lối đi</span>
          <span className="seat-map__col-label seat-map__col-label--right">Ghế phải</span>
        </div>

        <div className="seat-map__grid-wrap">
          {luoi.hangGhe.length === 0 ? (
            <p className="muted small seat-map__empty-floor">Không hiển thị được sơ đồ ghế tầng này.</p>
          ) : (
            <div className="seat-map__rows">
              {luoi.hangGhe.map((hang, ri) => {
                const maHang = hang.find((x) => x)?.hang ?? ri + 1
                const trai = hang.slice(0, luoi.cotTrai)
                const phai = hang.slice(luoi.cotTrai)
                return (
                  <div key={`r-${ri}`} className="seat-map__row">
                    <span className="seat-map__row-num" title={`Hàng ${maHang}`}>
                      H{maHang}
                    </span>
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
          )}
        </div>
      </div>
    </div>
  )
}
