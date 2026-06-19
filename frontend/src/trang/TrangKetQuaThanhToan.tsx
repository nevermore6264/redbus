import { useCallback, useEffect, useRef, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { CheckCircle2, CreditCard, Loader2, RefreshCw, XCircle } from 'lucide-react'
import { khachHttp, moKhoiDuLieu } from '../nguon/apiClient'
import type { KetQuaThanhToanPayOs, PhanHoi } from '../nguon/kieu'
import { NenTrangKhach } from '../thanhPhan/NenTrangKhach'
import { TheChua } from '../thanhPhan/theChua'
import { NutBam, NutLienKet } from '../thanhPhan/nutBam'

const TRANG_THAI_THAT_BAI = new Set(['CANCELLED', 'FAILED', 'EXPIRED'])
const SO_LAN_THU = 8
const GIUA_MOI_LAN_MS = 2500

async function traCuuPayOs(orderCode: string): Promise<KetQuaThanhToanPayOs> {
  return moKhoiDuLieu(
    khachHttp.get<PhanHoi<KetQuaThanhToanPayOs>>('/thanh-toan/payos/ket-qua', {
      params: { orderCode },
    }),
  )
}

export function TrangKetQuaThanhToan() {
  const [params] = useSearchParams()
  const orderCode = params.get('orderCode')
  const [ketQua, datKetQua] = useState<KetQuaThanhToanPayOs | null>(null)
  const [loi, datLoi] = useState<string | null>(null)
  const [dangTai, datDangTai] = useState(true)
  const [dangThuLai, datDangThuLai] = useState(false)
  const huyRef = useRef(false)

  const kiemTraLai = useCallback(async () => {
    if (!orderCode) return
    datDangThuLai(true)
    try {
      const kq = await traCuuPayOs(orderCode)
      datKetQua(kq)
      datLoi(null)
    } catch (e: unknown) {
      datLoi(e instanceof Error ? e.message : 'Không tra cứu được kết quả')
    } finally {
      datDangThuLai(false)
    }
  }, [orderCode])

  useEffect(() => {
    huyRef.current = false
    if (!orderCode) {
      datLoi('Thiếu mã đơn thanh toán')
      datDangTai(false)
      return
    }

    void (async () => {
      datDangTai(true)
      try {
        for (let lan = 0; lan < SO_LAN_THU && !huyRef.current; lan++) {
          try {
            const kq = await traCuuPayOs(orderCode)
            datKetQua(kq)
            datLoi(null)
            if (kq.daThanhToan || (kq.trangThaiPayOs && TRANG_THAI_THAT_BAI.has(kq.trangThaiPayOs))) {
              return
            }
          } catch (e: unknown) {
            datLoi(e instanceof Error ? e.message : 'Không tra cứu được kết quả')
            return
          }
          if (lan < SO_LAN_THU - 1) {
            await new Promise((r) => setTimeout(r, GIUA_MOI_LAN_MS))
          }
        }
      } finally {
        datDangTai(false)
      }
    })()

    return () => {
      huyRef.current = true
    }
  }, [orderCode])

  const thanhCong = ketQua?.daThanhToan === true
  const thatBai =
    ketQua?.trangThaiPayOs != null && TRANG_THAI_THAT_BAI.has(ketQua.trangThaiPayOs)
  const dangXuLy = dangTai || dangThuLai

  return (
    <NenTrangKhach Icon={CreditCard} tieuDe="Kết quả thanh toán" moTa="Xác nhận giao dịch PayOS">
      <TheChua padding="lg" className="payos-ket-qua">
        {dangXuLy ? (
          <p className="payos-ket-qua__trang-thai">
            <Loader2 size={28} className="spin" aria-hidden />
            {dangThuLai ? 'Đang kiểm tra lại với PayOS…' : 'Đang xác nhận thanh toán với PayOS…'}
          </p>
        ) : loi ? (
          <>
            <XCircle size={48} className="payos-ket-qua__icon payos-ket-qua__icon--loi" aria-hidden />
            <p>{loi}</p>
          </>
        ) : thanhCong ? (
          <>
            <CheckCircle2 size={48} className="payos-ket-qua__icon payos-ket-qua__icon--ok" aria-hidden />
            <h2>Thanh toán thành công</h2>
            <p className="muted">
              {ketQua?.soVe != null && ketQua.soVe > 1
                ? `Đã xác nhận ${ketQua.soVeDaThanhToan ?? ketQua.soVe}/${ketQua.soVe} vé (mã đơn ${ketQua.orderCode}). Email xác nhận đã được gửi (nếu đã cấu hình Gmail).`
                : `Vé #${ketQua?.maVe} đã được xác nhận. Email xác nhận đã được gửi (nếu đã cấu hình Gmail).`}
            </p>
          </>
        ) : thatBai ? (
          <>
            <XCircle size={48} className="payos-ket-qua__icon payos-ket-qua__icon--loi" aria-hidden />
            <h2>Thanh toán chưa hoàn tất</h2>
            <p className="muted">
              Giao dịch PayOS: {ketQua?.trangThaiPayOs}.{' '}
              {ketQua?.soVe != null && ketQua.soVe > 1
                ? `${ketQua.soVe} vé trong đơn #${ketQua.orderCode} vẫn chờ thanh toán.`
                : `Vé #${ketQua?.maVe} vẫn ở trạng thái chờ thanh toán.`}{' '}
              Bạn có thể thử lại tại trang Vé của tôi.
            </p>
          </>
        ) : (
          <>
            <Loader2 size={48} className="payos-ket-qua__icon spin" aria-hidden />
            <h2>Đang chờ xác nhận</h2>
            <p className="muted">
              Chưa nhận được xác nhận từ PayOS. Hệ thống đã thử đồng bộ tự động (phù hợp khi chạy localhost,
              không có webhook). Bấm &quot;Kiểm tra lại&quot; nếu bạn đã thanh toán xong.
            </p>
            <NutBam bien="phu" onClick={() => void kiemTraLai()}>
              <RefreshCw size={16} aria-hidden /> Kiểm tra lại
            </NutBam>
          </>
        )}
        <div className="payos-ket-qua__cta">
          <NutLienKet bien="chinh" to="/ve-cua-toi" con="Vé của tôi" />
          <Link to="/" className="muted small">
            Về trang chủ
          </Link>
        </div>
      </TheChua>
    </NenTrangKhach>
  )
}
