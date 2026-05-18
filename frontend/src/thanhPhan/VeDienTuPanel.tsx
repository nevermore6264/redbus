import { useRef, useState } from 'react'
import { Check, Copy, Download } from 'lucide-react'
import { Link } from 'react-router-dom'
import { toPng } from 'html-to-image'
import { QRCode } from 'react-qr-code'
import type { VeDienTu } from '../nguon/kieu'
import { dinhDangNgayGio, dinhDangVnd } from '../tienIch/dinhDang'
import { trangThaiSangTiengViet } from '../tienIch/trangThai'
import { NutBam } from './nutBam'

type Props = {
  ve: VeDienTu
}

export function VeDienTuPanel({ ve }: Props) {
  const theVe = useRef<HTMLDivElement>(null)
  const [dangTaiAnh, datDangTaiAnh] = useState(false)
  const [daSaoChep, datDaSaoChep] = useState(false)

  const ma = ve.maVeHienThi.toUpperCase()
  const linkTraCuu = `/tra-cuu-ve?ma=${encodeURIComponent(ma)}`

  async function saoChepMa() {
    try {
      await navigator.clipboard.writeText(ma)
      datDaSaoChep(true)
      window.setTimeout(() => datDaSaoChep(false), 2000)
    } catch {
      window.prompt('Sao chép mã vé:', ma)
    }
  }

  async function taiAnhPng() {
    const el = theVe.current
    if (!el || dangTaiAnh) return
    datDangTaiAnh(true)
    try {
      const dataUrl = await toPng(el, {
        pixelRatio: 2,
        backgroundColor: '#ffffff',
        cacheBust: true,
        filter: (node) => !(node instanceof HTMLElement && node.dataset.exportExclude === 'true'),
      })
      const a = document.createElement('a')
      a.href = dataUrl
      a.download = `ve-${ma}.png`
      a.click()
    } catch {
      window.alert('Không tạo được ảnh. Thử lại sau.')
    } finally {
      datDangTaiAnh(false)
    }
  }

  return (
    <div className="e-ticket-wrap">
      <div className="e-ticket" ref={theVe}>
        <div className="e-ticket__top">
          <div className="e-ticket__qr" aria-hidden>
            <QRCode value={ve.noiDungQr} size={112} />
          </div>
          <div className="e-ticket__intro">
            <p className="e-ticket__label">Mã vé</p>
            <div className="e-ticket__ma-row">
              <code className="e-ticket__ma">{ma}</code>
              <NutBam
                bien="mo"
                className="e-ticket__copy"
                onClick={() => void saoChepMa()}
                aria-label="Sao chép mã vé"
                con={daSaoChep ? <Check size={16} aria-hidden /> : <Copy size={16} aria-hidden />}
              />
            </div>
            <p className="e-ticket__status">{trangThaiSangTiengViet(ve.trangThai)}</p>
          </div>
        </div>
        <ol className="e-ticket__steps">
          <li>
            <strong>Khi lên xe:</strong> xuất trình QR hoặc đọc mã <strong>{ma}</strong> cho nhân viên.
          </li>
          <li>
            <strong>Nhân viên / tra cứu:</strong> quét QR (mở trang tra cứu) hoặc nhập mã + số điện thoại đặt vé tại{' '}
            <Link to={linkTraCuu}>Tra cứu vé</Link>.
          </li>
        </ol>
        <dl className="e-ticket__meta">
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
      <div className="e-ticket__actions" data-export-exclude="true">
        <NutBam
          bien="vien"
          className="btn--block"
          dangTai={dangTaiAnh}
          onClick={() => void taiAnhPng()}
          con={
            <>
              <Download size={16} aria-hidden />
              Tải ảnh PNG
            </>
          }
        />
      </div>
    </div>
  )
}
