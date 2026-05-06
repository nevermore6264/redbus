import { useEffect, useState } from 'react'
import { Bell } from 'lucide-react'
import { khachHttp, moKhoiDuLieu } from '../nguon/apiClient'
import type { PhanHoi, ThongBao as BanGhiThongBao } from '../nguon/kieu'
import { dungThongBao } from '../dinhDanh/boiCanhThongBao'
import { NenTrangKhach } from '../thanhPhan/NenTrangKhach'
import { TheChua } from '../thanhPhan/theChua'
import { NutBam } from '../thanhPhan/nutBam'
import { dinhDangNgayGio } from '../tienIch/dinhDang'

export function TrangThongBao() {
  const { hienThi } = dungThongBao()
  const [ds, datDs] = useState<BanGhiThongBao[]>([])
  const [tai, datTai] = useState(true)

  async function napDanhSach() {
    datTai(true)
    try {
      const x = await moKhoiDuLieu(khachHttp.get<PhanHoi<BanGhiThongBao[]>>('/thong-bao'))
      datDs(x)
    } catch (e: unknown) {
      hienThi({ loai: 'loi', noiDung: e instanceof Error ? e.message : 'Có lỗi xảy ra' })
    } finally {
      datTai(false)
    }
  }

  useEffect(() => {
    void napDanhSach()
  }, [])

  async function daDoc(ma: number) {
    try {
      await moKhoiDuLieu(khachHttp.put<PhanHoi<unknown>>(`/thong-bao/${ma}/da-doc`))
      void napDanhSach()
    } catch (e: unknown) {
      hienThi({ loai: 'loi', noiDung: e instanceof Error ? e.message : 'Có lỗi xảy ra' })
    }
  }

  return (
    <NenTrangKhach
      Icon={Bell}
      tieuDe="Thông báo"
      moTa="Nhắc đặt vé, thanh toán và cập nhật từ RedBus — đánh dấu đã đọc sau khi xem."
    >
      <TheChua padding="lg" className="cust-panel" aria-busy={tai}>
        <div className="card__head" style={{ marginBottom: '1.15rem' }}>
          <div>
            <h2 className="card__title" style={{ margin: 0 }}>
              Hộp thư
            </h2>
            <p className="card__sub">Thông báo mới nhất hiển thị đầu danh sách.</p>
          </div>
          <NutBam
            bien="vien"
            className="btn--sm"
            onClick={() => void napDanhSach()}
            con="Làm mới"
            dangTai={tai}
          />
        </div>

        <ul className="cust-notif-list">
          {tai && ds.length === 0
            ? [0, 1, 2].map((i) => (
                <li key={`sk-${i}`} className="cust-notif" aria-hidden>
                  <div className="cust-notif__head">
                    <span className="cust-skel-line cust-skel-line--md" />
                    <span className="cust-skel-line cust-skel-line--xs" />
                  </div>
                  <p style={{ margin: 0 }}>
                    <span className="cust-skel-line cust-skel-line--lg" />
                  </p>
                  <p style={{ margin: '0.5rem 0 0' }}>
                    <span className="cust-skel-line cust-skel-line--md" />
                  </p>
                </li>
              ))
            : null}
          {ds.map((t) => (
            <li
              key={t.ma}
              className={`cust-notif ${t.daDoc ? 'cust-notif--read' : ''}`}
            >
              <div className="cust-notif__head">
                <h3 className="cust-notif__title">{t.tieuDe ?? 'Thông báo'}</h3>
                <span className="cust-notif__time muted">{dinhDangNgayGio(t.thoiGianTao)}</span>
              </div>
              <p className="cust-notif__body">{t.noiDung}</p>
              {!t.daDoc ? (
                <div className="cust-notif__act">
                  <NutBam bien="mo" className="btn--sm" onClick={() => void daDoc(t.ma)} con="Đánh dấu đã đọc" />
                </div>
              ) : null}
            </li>
          ))}
        </ul>

        {!tai && ds.length === 0 ? (
          <div className="cust-empty">
            <span className="cust-empty__ico" aria-hidden>
              <Bell size={34} strokeWidth={1.35} />
            </span>
            <p className="cust-empty__title">Chưa có thông báo</p>
            <p className="muted">Khi có cập nhật vé hoặc khuyến mãi, bạn sẽ thấy tại đây.</p>
          </div>
        ) : null}
      </TheChua>
    </NenTrangKhach>
  )
}
