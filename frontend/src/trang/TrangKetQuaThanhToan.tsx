import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { CheckCircle2, CreditCard, Loader2, XCircle } from 'lucide-react'
import { khachHttp, moKhoiDuLieu } from '../nguon/apiClient'
import type { KetQuaThanhToanPayOs, PhanHoi } from '../nguon/kieu'
import { NenTrangKhach } from '../thanhPhan/NenTrangKhach'
import { TheChua } from '../thanhPhan/theChua'
import { NutLienKet } from '../thanhPhan/nutBam'

export function TrangKetQuaThanhToan() {
  const [params] = useSearchParams()
  const orderCode = params.get('orderCode')
  const [ketQua, datKetQua] = useState<KetQuaThanhToanPayOs | null>(null)
  const [loi, datLoi] = useState<string | null>(null)
  const [dangTai, datDangTai] = useState(true)

  useEffect(() => {
    if (!orderCode) {
      datLoi('Thiếu mã đơn thanh toán')
      datDangTai(false)
      return
    }
    void (async () => {
      try {
        const kq = await moKhoiDuLieu(
          khachHttp.get<PhanHoi<KetQuaThanhToanPayOs>>('/thanh-toan/payos/ket-qua', {
            params: { orderCode },
          }),
        )
        datKetQua(kq)
      } catch (e: unknown) {
        datLoi(e instanceof Error ? e.message : 'Không tra cứu được kết quả')
      } finally {
        datDangTai(false)
      }
    })()
  }, [orderCode])

  const thanhCong = ketQua?.daThanhToan === true

  return (
    <NenTrangKhach Icon={CreditCard} tieuDe="Kết quả thanh toán" moTa="Xác nhận giao dịch PayOS">
      <TheChua padding="lg" className="payos-ket-qua">
        {dangTai ? (
          <p className="payos-ket-qua__trang-thai">
            <Loader2 size={28} className="spin" aria-hidden />
            Đang xác nhận thanh toán…
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
              Vé #{ketQua?.maVe} đã được xác nhận. Email xác nhận đã được gửi (nếu đã cấu hình Gmail).
            </p>
          </>
        ) : (
          <>
            <Loader2 size={48} className="payos-ket-qua__icon spin" aria-hidden />
            <h2>Đang chờ xác nhận</h2>
            <p className="muted">
              PayOS có thể cần vài giây để đồng bộ. Vui lòng làm mới trang Vé của tôi sau ít phút.
            </p>
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
