import { useEffect, useMemo, useState } from 'react'
import { Armchair } from 'lucide-react'
import type { GheNgoi } from '../nguon/kieu'
import { nhomTheoTang, xayDungLuoiGhe } from '../tienIch/soDoGhe'

type Props = {
  dsGhe: GheNgoi[]
  gheDaGiu: Set<number>
  maGheChon: number | null
  onChonMaGhe: (ma: number) => void
}

export function SoDoGheXe({ dsGhe, gheDaGiu, maGheChon, onChonMaGhe }: Props) {
  const tangNhom = useMemo(() => nhomTheoTang(dsGhe), [dsGhe])
  const nhieuTang = tangNhom.length > 1

  const [tangXem, datTangXem] = useState(1)

  useEffect(() => {
    const floors = nhomTheoTang(dsGhe)
    if (floors.length) datTangXem(floors[0].tang)
  }, [dsGhe])

  const gheTheoTang = useMemo(() => tangNhom.find((x) => x.tang === tangXem)?.ghe ?? [], [tangNhom, tangXem])

  const luoi = useMemo(() => xayDungLuoiGhe(gheTheoTang), [gheTheoTang])

  function nutGhe(s: GheNgoi | null, key: string) {
    if (!s) {
      return (
        <div key={key} className="seat-map__slot seat-map__slot--empty" aria-hidden />
      )
    }
    const bo =
      gheDaGiu.has(s.ma) || s.trangThai === 'BLOCKED' || s.trangThai?.toUpperCase() === 'BLOCKED'
    const chonGhe = maGheChon === s.ma
    return (
      <button
        key={key}
        type="button"
        disabled={bo}
        className={`seat-cell ${bo ? 'seat-cell--occ' : ''} ${chonGhe ? 'seat-cell--pick' : ''}`}
        onClick={() => !bo && onChonMaGhe(s.ma)}
      >
        <Armchair size={16} aria-hidden />
        <span>{s.maGhe}</span>
      </button>
    )
  }

  return (
    <div className="seat-map">
      <p className="seat-map__hint muted">
        Đầu xe — nhìn từ trước ra sau. Ghế <strong>trái / phải</strong> hai bên lối đi giữa. Xe giường nằm: chọn{' '}
        <strong>tầng</strong> trước khi chọn ghế.
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
          <div className="seat-map__rows">
            {luoi.hangGhe.map((hang, ri) => {
              const maHang = hang.find((x) => x)?.hang ?? ri + 1
              const trai = hang.slice(0, luoi.cotTrai)
              const phai = hang.slice(luoi.cotTrai)
              return (
                <div key={`r-${ri}`} className="seat-map__row">
                  <span className="seat-map__row-num" title={`Hàng ${maHang}`}>
                    Hàng {maHang}
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
        </div>
      </div>
    </div>
  )
}
