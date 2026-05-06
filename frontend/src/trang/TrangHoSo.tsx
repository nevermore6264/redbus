import { useEffect, useState } from 'react'
import { UserCircle } from 'lucide-react'
import { khachHttp, moKhoiDuLieu } from '../nguon/apiClient'
import type { PhanHoi, ThongTinHoSoCaNhan } from '../nguon/kieu'
import { dungThongBao } from '../dinhDanh/boiCanhThongBao'
import { NenTrangKhach } from '../thanhPhan/NenTrangKhach'
import { TheChua } from '../thanhPhan/theChua'
import { TruongNhap } from '../thanhPhan/truongNhap'
import { NutBam } from '../thanhPhan/nutBam'

export function TrangHoSo() {
  const { hienThi } = dungThongBao()
  const [hs, datHs] = useState<ThongTinHoSoCaNhan | null>(null)
  const [bieu, datBieu] = useState({ hoTen: '', soDienThoai: '', diaChi: '' })
  const [mk, datMk] = useState({ cu: '', moi: '' })
  const [tai, datTai] = useState(true)

  useEffect(() => {
    void (async () => {
      datTai(true)
      try {
        const x = await moKhoiDuLieu(
          khachHttp.get<PhanHoi<ThongTinHoSoCaNhan>>('/ho-so/cua-toi'),
        )
        datHs(x)
        datBieu({
          hoTen: x.hoTen,
          soDienThoai: x.soDienThoai ?? '',
          diaChi: x.diaChi ?? '',
        })
      } catch (e: unknown) {
        hienThi({ loai: 'loi', noiDung: e instanceof Error ? e.message : 'Có lỗi xảy ra' })
      } finally {
        datTai(false)
      }
    })()
  }, [])

  async function luuHoSo(e: React.FormEvent) {
    e.preventDefault()
    try {
      const x = await moKhoiDuLieu(
        khachHttp.put<PhanHoi<ThongTinHoSoCaNhan>>('/ho-so/cua-toi', bieu),
      )
      datHs(x)
      hienThi({ loai: 'thanhCong', noiDung: 'Đã cập nhật hồ sơ' })
    } catch (e: unknown) {
      hienThi({ loai: 'loi', noiDung: e instanceof Error ? e.message : 'Có lỗi xảy ra' })
    }
  }

  async function doiMk(e: React.FormEvent) {
    e.preventDefault()
    try {
      await moKhoiDuLieu(
        khachHttp.put<PhanHoi<unknown>>('/ho-so/mat-khau', {
          matKhauCu: mk.cu,
          matKhauMoi: mk.moi,
        }),
      )
      datMk({ cu: '', moi: '' })
      hienThi({ loai: 'thanhCong', noiDung: 'Đã đổi mật khẩu' })
    } catch (e: unknown) {
      hienThi({ loai: 'loi', noiDung: e instanceof Error ? e.message : 'Có lỗi xảy ra' })
    }
  }

  return (
    <NenTrangKhach
      Icon={UserCircle}
      tieuDe="Hồ sơ &amp; bảo mật"
      moTa="Cập nhật thông tin liên hệ và đổi mật khẩu đăng nhập."
    >
      <div className="cust-profile-grid" aria-busy={tai}>
        <TheChua padding="lg" className="cust-profile-card cust-panel">
          <h2>Thông tin cá nhân</h2>
          {tai && !hs ? (
            <div className="cust-profile-skel" aria-hidden>
              <span className="cust-skel-line cust-skel-line--md" />
              <span className="cust-skel-line cust-skel-line--lg" />
              <span className="cust-skel-line cust-skel-line--lg" />
              <span className="cust-skel-line cust-skel-line--lg" />
              <span className="cust-skel-line cust-skel-line--sm" />
            </div>
          ) : null}
          {hs ? (
            <>
              <p className="cust-account-hint">
                <strong>Tài khoản:</strong> {hs.tenDangNhap}
                <br />
                <strong>Email:</strong> {hs.email}
              </p>
              <form className="form-stack" onSubmit={luuHoSo}>
                <TruongNhap
                  nhan="Họ và tên"
                  value={bieu.hoTen}
                  onChange={(e) => datBieu({ ...bieu, hoTen: e.target.value })}
                  required
                />
                <TruongNhap
                  nhan="Số điện thoại"
                  value={bieu.soDienThoai}
                  onChange={(e) => datBieu({ ...bieu, soDienThoai: e.target.value })}
                />
                <TruongNhap
                  nhan="Địa chỉ"
                  value={bieu.diaChi}
                  onChange={(e) => datBieu({ ...bieu, diaChi: e.target.value })}
                />
                <NutBam bien="chinh" type="submit" con="Lưu hồ sơ" />
              </form>
            </>
          ) : null}
          {!tai && !hs ? (
            <p className="muted">Không tải được hồ sơ. Vui lòng làm mới trang hoặc đăng nhập lại.</p>
          ) : null}
        </TheChua>
        <TheChua padding="lg" className="cust-profile-card cust-panel">
          <h2>Đổi mật khẩu</h2>
          {tai && !hs ? (
            <div className="cust-profile-skel" aria-hidden>
              <span className="cust-skel-line cust-skel-line--lg" />
              <span className="cust-skel-line cust-skel-line--lg" />
              <span className="cust-skel-line cust-skel-line--sm" />
            </div>
          ) : (
            <>
              <p className="muted small" style={{ marginTop: '-0.25rem', marginBottom: '1rem' }}>
                Nên dùng mật khẩu đủ dài, kết hợp chữ và số.
              </p>
              <form className="form-stack" onSubmit={doiMk}>
                <TruongNhap
                  nhan="Mật khẩu hiện tại"
                  type="password"
                  value={mk.cu}
                  onChange={(e) => datMk({ ...mk, cu: e.target.value })}
                  required
                />
                <TruongNhap
                  nhan="Mật khẩu mới"
                  type="password"
                  value={mk.moi}
                  onChange={(e) => datMk({ ...mk, moi: e.target.value })}
                  required
                  minLength={6}
                />
                <NutBam bien="chinh" type="submit" con="Đổi mật khẩu" disabled={!hs} />
              </form>
            </>
          )}
        </TheChua>
      </div>
    </NenTrangKhach>
  )
}
