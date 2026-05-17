import { useEffect, useState } from 'react'
import type { DonViHanhChinh } from '../nguon/kieu'
import { layDanhSachTinh, layXaTheoTinh, taoChuoiDiaDanh } from '../tienIch/diaDanh'
import { TruongChon } from './truongNhap'

interface Props {
  nhan: string
  giaTri: string
  onDoi: (chuoi: string) => void
  loi?: string
  required?: boolean
}

export function ChonDiaDanh({ nhan, giaTri, onDoi, loi, required }: Props) {
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

  return (
    <div className={`field chon-dia-danh ${loi ? 'field--error' : ''}`.trim()}>
      <span className="field__label">
        {nhan}
        {required ? (
          <span className="field__req" aria-hidden="true">
            {' '}
            *
          </span>
        ) : null}
      </span>
      {giaTri && !daChonDayDu ? (
        <p className="chon-dia-danh__cu muted small">
          Hiện tại: <strong>{giaTri}</strong>
        </p>
      ) : null}
      {loiTai ? <p className="field__err">{loiTai}</p> : null}
      <div className="chon-dia-danh__hang">
        <TruongChon
          nhan="Tỉnh / TP"
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
        </TruongChon>
        <span className="chon-dia-danh__moc" aria-hidden>
          →
        </span>
        <TruongChon
          nhan="Phường / xã"
          value={maXa === '' ? '' : String(maXa)}
          onChange={(e) => datMaXa(e.target.value ? Number(e.target.value) : '')}
          disabled={maTinh === '' || taiXa || dsXa.length === 0}
          required={required}
        >
          <option value="">
            {maTinh === ''
              ? 'Chọn tỉnh trước'
              : taiXa
                ? 'Đang tải…'
                : dsXa.length === 0
                  ? 'Không có dữ liệu'
                  : 'Chọn phường/xã'}
          </option>
          {dsXa.map((x) => (
            <option key={x.code} value={x.code}>
              {x.name}
            </option>
          ))}
        </TruongChon>
      </div>
      {daChonDayDu && giaTri ? (
        <p className="chon-dia-danh__ket-qua">{giaTri}</p>
      ) : null}
      {loi ? <p className="field__err">{loi}</p> : null}
    </div>
  )
}
