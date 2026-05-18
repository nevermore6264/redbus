import QRCode from 'react-qr-code'
import type { VeDienTu } from '../nguon/kieu'
import { dinhDangNgayGio, dinhDangVnd } from '../tienIch/dinhDang'
import { trangThaiSangTiengViet } from '../tienIch/trangThai'

type Props = {
  ve: VeDienTu
}

export function VeDienTuPanel({ ve }: Props) {
  return (
    <div className="e-ticket">
      <div className="e-ticket__qr">
        <QRCode value={ve.noiDungQr} size={148} />
      </div>
      <p className="e-ticket__code">
        Mã vé: <strong>{ve.maVeHienThi}</strong>
      </p>
      <p className="muted small">Quét QR khi lên xe</p>
      <dl className="e-ticket__meta">
        <dt>Trạng thái</dt>
        <dd>{trangThaiSangTiengViet(ve.trangThai)}</dd>
        <dt>Tuyến</dt>
        <dd>
          {ve.diemDi} → {ve.diemDen}
        </dd>
        {ve.diemLen ? (
          <>
            <dt>Điểm lên</dt>
            <dd>{ve.diemLen}</dd>
          </>
        ) : null}
        {ve.diemXuong ? (
          <>
            <dt>Điểm xuống</dt>
            <dd>{ve.diemXuong}</dd>
          </>
        ) : null}
        <dt>Khởi hành</dt>
        <dd>{ve.thoiDiemKhoiHanh ? dinhDangNgayGio(ve.thoiDiemKhoiHanh) : '—'}</dd>
        <dt>Ghế</dt>
        <dd>{ve.maGhe ?? '—'}</dd>
        {ve.soTienThanhToan != null ? (
          <>
            <dt>Đã thanh toán</dt>
            <dd>{dinhDangVnd(ve.soTienThanhToan)}</dd>
          </>
        ) : null}
      </dl>
    </div>
  )
}
