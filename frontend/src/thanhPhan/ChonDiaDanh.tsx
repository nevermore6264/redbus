import { useEffect, useState } from 'react'
import { ArrowRight, CheckCircle2, Loader2, MapPin } from 'lucide-react'
import type { DonViHanhChinh } from '../nguon/kieu'
import { layDanhSachTinh, layXaTheoTinh, taoChuoiDiaDanh } from '../tienIch/diaDanh'

interface Props {
  nhan: string
  giaTri: string
  onDoi: (chuoi: string) => void
  loi?: string
  required?: boolean
  bien?: 'di' | 'den' | 'dung'
}

export function ChonDiaDanh({ nhan, giaTri, onDoi, loi, required, bien = 'di' }: Props) {
  const [dsTinh, datDsTinh] = useState<DonViHanhChinh[]>([])
  const [dsXa, datDsXa] = useState<DonViHanhChinh[]>([])
  const [maTinh, datMaTinh] = useState<number | ''>('')
  const [maXa, datMaXa] = useState<number | ''>('')
  const [taiTinh, datTaiTinh] = useState(true)
  const [taiXa, datTaiXa] = useState(false)
  const [loiTai, datLoiTai] = useState<string | null>(null)

  useEffect(() => {
    void (async () => {
      datTaiTinh(true)
      datLoiTai(null)
      try {
        datDsTinh(await layDanhSachTinh())
      } catch (e: unknown) {
        datLoiTai(e instanceof Error ? e.message : 'Không tải được danh sách tỉnh')
      } finally {
        datTaiTinh(false)
      }
    })()
  }, [])

  useEffect(() => {
    if (maTinh === '') {
      datDsXa([])
      datMaXa('')
      return
    }
    void (async () => {
      datTaiXa(true)
      try {
        datDsXa(await layXaTheoTinh(maTinh))
      } catch {
        datDsXa([])
      } finally {
        datTaiXa(false)
        datMaXa('')
      }
    })()
  }, [maTinh])

  useEffect(() => {
    if (maTinh === '' || maXa === '') return
    const tinh = dsTinh.find((t) => t.code === maTinh)
    const xa = dsXa.find((x) => x.code === maXa)
    if (!tinh || !xa) return
    const chuoi = taoChuoiDiaDanh(tinh, xa)
    if (chuoi !== giaTri) onDoi(chuoi)
  }, [maTinh, maXa, dsTinh, dsXa, giaTri, onDoi])

  const daChonDayDu = maTinh !== '' && maXa !== ''
  const lopThe = `chon-dia-danh-card chon-dia-danh-card--${bien}${daChonDayDu ? ' chon-dia-danh-card--done' : ''}${loi ? ' chon-dia-danh-card--error' : ''}`

  const placeholderXa =
    maTinh === ''
      ? 'Chọn tỉnh trước'
      : taiXa
        ? 'Đang tải…'
        : dsXa.length === 0
          ? 'Không có dữ liệu'
          : 'Chọn phường / xã'

  return (
    <article className={lopThe}>
      <header className="chon-dia-danh-card__head">
        <span className="chon-dia-danh-card__badge" aria-hidden>
          <MapPin size={16} strokeWidth={2.25} />
        </span>
        <div className="chon-dia-danh-card__meta">
          <h3 className="chon-dia-danh-card__title">
            {nhan}
            {required ? <span className="field__req"> *</span> : null}
          </h3>
          {daChonDayDu && giaTri ? (
            <p className="chon-dia-danh-card__done">
              <CheckCircle2 size={13} aria-hidden />
              {giaTri}
            </p>
          ) : giaTri && !daChonDayDu ? (
            <p className="chon-dia-danh-card__legacy">Đang lưu: {giaTri}</p>
          ) : (
            <p className="chon-dia-danh-card__hint">Chọn tỉnh và phường/xã</p>
          )}
        </div>
      </header>

      {loiTai ? <p className="field__err chon-dia-danh-card__err">{loiTai}</p> : null}

      <div className="chon-dia-danh-card__flow">
        <div className="chon-dia-danh-card__step">
          <span className="chon-dia-danh-card__step-num">1</span>
          <label className="chon-dia-danh-card__lbl" htmlFor={`${bien}-tinh`}>
            Tỉnh / Thành phố
          </label>
          <div className="chon-dia-danh-card__wrap">
            <select
              id={`${bien}-tinh`}
              className="field__input field__select chon-dia-danh-card__sel"
              value={maTinh === '' ? '' : String(maTinh)}
              onChange={(e) => datMaTinh(e.target.value ? Number(e.target.value) : '')}
              disabled={taiTinh || !!loiTai}
              required={required}
            >
              <option value="">{taiTinh ? 'Đang tải…' : 'Chọn tỉnh'}</option>
              {dsTinh.map((t) => (
                <option key={t.code} value={t.code}>
                  {t.name}
                </option>
              ))}
            </select>
            {taiTinh ? <Loader2 className="chon-dia-danh-card__spin" size={16} aria-hidden /> : null}
          </div>
        </div>

        <span className="chon-dia-danh-card__arrow" aria-hidden>
          <ArrowRight size={16} strokeWidth={2.5} />
        </span>

        <div className="chon-dia-danh-card__step">
          <span className="chon-dia-danh-card__step-num">2</span>
          <label className="chon-dia-danh-card__lbl" htmlFor={`${bien}-xa`}>
            Phường / Xã
          </label>
          <div className="chon-dia-danh-card__wrap">
            <select
              id={`${bien}-xa`}
              className="field__input field__select chon-dia-danh-card__sel"
              value={maXa === '' ? '' : String(maXa)}
              onChange={(e) => datMaXa(e.target.value ? Number(e.target.value) : '')}
              disabled={maTinh === '' || taiXa || dsXa.length === 0}
              required={required}
            >
              <option value="">{placeholderXa}</option>
              {dsXa.map((x) => (
                <option key={x.code} value={x.code}>
                  {x.name}
                </option>
              ))}
            </select>
            {taiXa ? <Loader2 className="chon-dia-danh-card__spin" size={16} aria-hidden /> : null}
          </div>
        </div>
      </div>

      {loi ? <p className="field__err">{loi}</p> : null}
    </article>
  )
}
