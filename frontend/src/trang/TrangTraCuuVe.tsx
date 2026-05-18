import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Search, Ticket } from 'lucide-react'
import { khachHttp, moKhoiDuLieu } from '../nguon/apiClient'
import type { PhanHoi, VeDienTu } from '../nguon/kieu'
import { dungThongBao } from '../dinhDanh/boiCanhThongBao'
import { NenTrangKhach } from '../thanhPhan/NenTrangKhach'
import { TheChua } from '../thanhPhan/theChua'
import { NutBam } from '../thanhPhan/nutBam'
import { TruongNhap } from '../thanhPhan/truongNhap'
import { VeDienTuPanel } from '../thanhPhan/VeDienTuPanel'
import { phanTichMaTuQr } from '../tienIch/maVeQr'

export function TrangTraCuuVe() {
  const { hienThi } = dungThongBao()
  const [searchParams] = useSearchParams()
  const [maVe, datMaVe] = useState('')
  const [sdt, datSdt] = useState('')
  const [ketQua, datKetQua] = useState<VeDienTu | null>(null)
  const [tai, datTai] = useState(false)
  const [tuQr, datTuQr] = useState(false)

  useEffect(() => {
    const raw = searchParams.get('ma') ?? searchParams.get('qr') ?? ''
    const ma = phanTichMaTuQr(raw)
    if (ma) {
      datMaVe(ma)
      datTuQr(true)
    }
  }, [searchParams])

  async function traCuu(e: React.FormEvent) {
    e.preventDefault()
    datTai(true)
    datKetQua(null)
    try {
      const v = await moKhoiDuLieu(
        khachHttp.get<PhanHoi<VeDienTu>>('/ve-xe/tra-cuu', {
          params: { maVe: maVe.trim().toUpperCase(), soDienThoai: sdt.trim() },
        }),
      )
      datKetQua(v)
    } catch (err: unknown) {
      hienThi({ loai: 'loi', noiDung: err instanceof Error ? err.message : 'Không tra cứu được' })
    } finally {
      datTai(false)
    }
  }

  return (
    <NenTrangKhach
      Icon={Ticket}
      tieuDe="Tra cứu vé"
      moTa="Nhập mã vé (VD: RB12AB34CD) và số điện thoại đặt vé — không cần đăng nhập."
    >
      <TheChua padding="lg" className="cust-panel">
        {tuQr && maVe ? (
          <p className="tra-cuu-qr-hint form-alert">
            Đã nhận mã vé <strong>{maVe}</strong> từ QR — nhập số điện thoại đặt vé rồi bấm Tra cứu.
          </p>
        ) : null}
        <form className="form-stack" onSubmit={(e) => void traCuu(e)} noValidate>
          <TruongNhap
            nhan="Mã vé"
            value={maVe}
            onChange={(e) => datMaVe(e.target.value)}
            placeholder="RBXXXXXXXX"
            batBuoc
          />
          <TruongNhap
            nhan="Số điện thoại"
            value={sdt}
            onChange={(e) => datSdt(e.target.value)}
            placeholder="09xxxxxxxx"
            batBuoc
          />
          <NutBam
            bien="chinh"
            type="submit"
            dangTai={tai}
            con={
              <>
                <Search size={16} aria-hidden />
                Tra cứu
              </>
            }
          />
        </form>
        {ketQua ? <VeDienTuPanel ve={ketQua} /> : null}
      </TheChua>
    </NenTrangKhach>
  )
}
