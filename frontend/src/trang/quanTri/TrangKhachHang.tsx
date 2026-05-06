import { useEffect, useState } from 'react'
import { khachHttp, moKhoiDuLieu } from '../../nguon/apiClient'
import type { PhanHoi, ThongTinKhachHang } from '../../nguon/kieu'
import { dungThongBao } from '../../dinhDanh/boiCanhThongBao'
import { TheChua, TieuDeThe } from '../../thanhPhan/theChua'
import { NutBam, NutSuaQt } from '../../thanhPhan/nutBam'
import { TruongNhap } from '../../thanhPhan/truongNhap'
import { CuaSo } from '../../thanhPhan/cuaSo'

type BieuThem = {
  tenDangNhap: string
  email: string
  matKhau: string
  hoTen: string
  soDienThoai: string
  diaChi: string
}

type BieuSua = {
  hoTen: string
  soDienThoai: string
  diaChi: string
  email: string
  matKhauMoi: string
  hoatDong: boolean
}

const rongThem: BieuThem = {
  tenDangNhap: '',
  email: '',
  matKhau: '',
  hoTen: '',
  soDienThoai: '',
  diaChi: '',
}

export function TrangKhachHang() {
  const { hienThi } = dungThongBao()
  const [ds, datDs] = useState<ThongTinKhachHang[]>([])
  const [mo, datMo] = useState(false)
  const [sua, datSua] = useState<ThongTinKhachHang | null>(null)
  const [bieuThem, datBieuThem] = useState<BieuThem>(rongThem)
  const [bieuSua, datBieuSua] = useState<BieuSua>({
    hoTen: '',
    soDienThoai: '',
    diaChi: '',
    email: '',
    matKhauMoi: '',
    hoatDong: true,
  })

  async function taiDS() {
    try {
      const x = await moKhoiDuLieu(khachHttp.get<PhanHoi<ThongTinKhachHang[]>>('/khach-hang'))
      datDs(x)
    } catch (e: unknown) {
      hienThi({ loai: 'loi', noiDung: e instanceof Error ? e.message : 'Lỗi tải danh sách' })
    }
  }

  useEffect(() => {
    void taiDS()
  }, [])

  function moThe() {
    datSua(null)
    datBieuThem(rongThem)
    datMo(true)
  }

  function moSua(r: ThongTinKhachHang) {
    datSua(r)
    datBieuSua({
      hoTen: r.hoTen,
      soDienThoai: r.soDienThoai ?? '',
      diaChi: r.diaChi ?? '',
      email: r.email,
      matKhauMoi: '',
      hoatDong: r.hoatDong !== false,
    })
    datMo(true)
  }

  async function luu() {
    try {
      if (sua) {
        const payload: Record<string, unknown> = {
          hoTen: bieuSua.hoTen,
          soDienThoai: bieuSua.soDienThoai,
          diaChi: bieuSua.diaChi,
          email: bieuSua.email,
          hoatDong: bieuSua.hoatDong,
        }
        if (bieuSua.matKhauMoi.trim()) {
          payload.matKhauMoi = bieuSua.matKhauMoi.trim()
        }
        await moKhoiDuLieu(
          khachHttp.put<PhanHoi<ThongTinKhachHang>>(`/khach-hang/${sua.maKhach}`, payload),
        )
      } else {
        await moKhoiDuLieu(
          khachHttp.post<PhanHoi<ThongTinKhachHang>>('/khach-hang', {
            tenDangNhap: bieuThem.tenDangNhap.trim(),
            email: bieuThem.email.trim(),
            matKhau: bieuThem.matKhau,
            hoTen: bieuThem.hoTen.trim(),
            soDienThoai: bieuThem.soDienThoai.trim() || undefined,
            diaChi: bieuThem.diaChi.trim() || undefined,
          }),
        )
      }
      datMo(false)
      void taiDS()
      hienThi({ loai: 'thanhCong', noiDung: sua ? 'Đã cập nhật khách hàng.' : 'Đã thêm khách hàng.' })
    } catch (e: unknown) {
      hienThi({ loai: 'loi', noiDung: e instanceof Error ? e.message : 'Lỗi lưu' })
    }
  }

  return (
    <div className="admin-page">
      <header className="admin-page__head">
        <h1 className="admin-page__title">Khách hàng</h1>
        <p className="admin-page__sub">Quản lý tài khoản CUSTOMER: thêm, sửa hồ sơ, khóa/mở đăng nhập.</p>
      </header>
      <TheChua padding="none">
        <div className="table-wrap-pad">
          <TieuDeThe
            title="Danh sách"
            subtitle="Thông tin liên kết tài khoản khách"
            action={<NutBam bien="chinh" onClick={moThe} con="+ Thêm khách" />}
          />
        </div>
        <div className="table-scroll">
          <table className="data-table">
            <thead>
              <tr>
                <th>Mã KH</th>
                <th>Họ tên</th>
                <th>SĐT</th>
                <th>Tên đăng nhập</th>
                <th>Email</th>
                <th>Trạng thái</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {ds.map((r) => (
                <tr key={r.maKhach}>
                  <td className="mono">{r.maKhach}</td>
                  <td>{r.hoTen}</td>
                  <td>{r.soDienThoai ?? '—'}</td>
                  <td>{r.tenDangNhap}</td>
                  <td>{r.email}</td>
                  <td>
                    {r.hoatDong === false ? (
                      <span className="badge badge--muted">Đã khóa</span>
                    ) : (
                      <span className="badge badge--ok">Hoạt động</span>
                    )}
                  </td>
                  <td className="row-actions">
                    <NutSuaQt onClick={() => moSua(r)} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </TheChua>

      <CuaSo
        open={mo}
        title={sua ? 'Sửa khách hàng' : 'Thêm khách hàng'}
        onClose={() => datMo(false)}
        footer={
          <>
            <NutBam bien="huy" onClick={() => datMo(false)} con="Hủy" />
            <NutBam bien="chinh" onClick={() => void luu()} con="Lưu" />
          </>
        }
      >
        {sua ? (
          <div className="form-stack">
            <p className="muted mono">
              Mã KH: {sua.maKhach} · Tên đăng nhập: {sua.tenDangNhap}
            </p>
            <TruongNhap
              nhan="Họ tên"
              value={bieuSua.hoTen}
              onChange={(e) => datBieuSua({ ...bieuSua, hoTen: e.target.value })}
              required
            />
            <TruongNhap
              nhan="Số điện thoại"
              value={bieuSua.soDienThoai}
              onChange={(e) => datBieuSua({ ...bieuSua, soDienThoai: e.target.value })}
            />
            <TruongNhap
              nhan="Địa chỉ"
              value={bieuSua.diaChi}
              onChange={(e) => datBieuSua({ ...bieuSua, diaChi: e.target.value })}
            />
            <TruongNhap
              nhan="Email"
              type="email"
              value={bieuSua.email}
              onChange={(e) => datBieuSua({ ...bieuSua, email: e.target.value })}
              required
            />
            <TruongNhap
              nhan="Mật khẩu mới"
              type="password"
              autoComplete="new-password"
              value={bieuSua.matKhauMoi}
              onChange={(e) => datBieuSua({ ...bieuSua, matKhauMoi: e.target.value })}
              placeholder="Để trống nếu không đổi"
            />
            <label className="check">
              <input
                type="checkbox"
                checked={bieuSua.hoatDong}
                onChange={(e) => datBieuSua({ ...bieuSua, hoatDong: e.target.checked })}
              />
              Tài khoản hoạt động (bỏ chọn để khóa đăng nhập)
            </label>
          </div>
        ) : (
          <div className="form-stack">
            <TruongNhap
              nhan="Tên đăng nhập"
              value={bieuThem.tenDangNhap}
              onChange={(e) => datBieuThem({ ...bieuThem, tenDangNhap: e.target.value })}
              required
              autoComplete="username"
            />
            <TruongNhap
              nhan="Email"
              type="email"
              value={bieuThem.email}
              onChange={(e) => datBieuThem({ ...bieuThem, email: e.target.value })}
              required
            />
            <TruongNhap
              nhan="Mật khẩu"
              type="password"
              value={bieuThem.matKhau}
              onChange={(e) => datBieuThem({ ...bieuThem, matKhau: e.target.value })}
              required
              autoComplete="new-password"
            />
            <TruongNhap
              nhan="Họ tên"
              value={bieuThem.hoTen}
              onChange={(e) => datBieuThem({ ...bieuThem, hoTen: e.target.value })}
              required
            />
            <TruongNhap
              nhan="Số điện thoại"
              value={bieuThem.soDienThoai}
              onChange={(e) => datBieuThem({ ...bieuThem, soDienThoai: e.target.value })}
            />
            <TruongNhap
              nhan="Địa chỉ"
              value={bieuThem.diaChi}
              onChange={(e) => datBieuThem({ ...bieuThem, diaChi: e.target.value })}
            />
          </div>
        )}
      </CuaSo>
    </div>
  )
}
