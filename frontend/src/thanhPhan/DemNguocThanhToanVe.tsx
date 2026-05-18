import { Clock } from 'lucide-react'
import {
  PHUT_CHO_THANH_TOAN,
  conLaiGiayThanhToan,
  dinhDangDemNguoc,
  phanTramConLai,
} from '../tienIch/hetHanThanhToan'

type Props = {
  thoiGianDat?: string
  lucHienTai: number
}

export function DemNguocThanhToanVe({ thoiGianDat, lucHienTai }: Props) {
  const conLai = conLaiGiayThanhToan(thoiGianDat, lucHienTai)
  const pct = phanTramConLai(conLai)
  const sapHet = conLai > 0 && conLai <= 120

  return (
    <div className={`ve-countdown${sapHet ? ' ve-countdown--urgent' : ''}`}>
      <div className="ve-countdown__head">
        <Clock size={16} aria-hidden />
        <span>
          Thanh toán trong <strong>{dinhDangDemNguoc(conLai)}</strong>
        </span>
      </div>
      <div className="ve-countdown__bar" role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100}>
        <span className="ve-countdown__fill" style={{ width: `${pct}%` }} />
      </div>
      <p className="ve-countdown__hint muted small">
        Hết {PHUT_CHO_THANH_TOAN} phút kể từ lúc đặt — vé tự hủy do quá hạn thanh toán.
      </p>
    </div>
  )
}
