import { useEffect, useState } from 'react'
import { khachHttp, moKhoiDuLieu } from '../../nguon/apiClient'
import type { PhanHoi, TuyenDuong } from '../../nguon/kieu'
import { dungNguoiDung } from '../../dinhDanh/boiCanhNguoiDung'
import { dungThongBao } from '../../dinhDanh/boiCanhThongBao'
import { TheChua, TieuDeThe } from '../../thanhPhan/theChua'
import { NutBam, NutSuaQt, NutXoaQt } from '../../thanhPhan/nutBam'
import { TruongNhap } from '../../thanhPhan/truongNhap'
import { CuaSo } from '../../thanhPhan/cuaSo'

export function TrangTuyenDuong() {
  const { nguoiDung } = dungNguoiDung()
  const { hienThi } = dungThongBao()
  const laAdmin = nguoiDung?.vaiTro === 'ADMIN'
  const [ds, datDs] = useState<TuyenDuong[]>([])
  const [mo, datMo] = useState(false)
  const [sua, datSua] = useState<TuyenDuong | null>(null)
  const [bieu, datBieu] = useState({
    diemDi: '',
    diemDen: '',
    khoangCachKm: 0,
    thoiGianUocTinhPhut: 0,
    hoatDong: true,
  })
  async function taiDS() {
    try {
      const x = await moKhoiDuLieu(khachHttp.get<PhanHoi<TuyenDuong[]>>('/tuyen-duong'))
      datDs(x)
    } catch (e: unknown) {
      hienThi({ loai: 'loi', noiDung: e instanceof Error ? e.message : String(e) })
    }
  }

  useEffect(() => {
    void taiDS()
  }, [])

  function moThe() {
    datSua(null)
    datBieu({ diemDi: '', diemDen: '', khoangCachKm: 0, thoiGianUocTinhPhut: 0, hoatDong: true })
    datMo(true)
  }

  function moSua(t: TuyenDuong) {
    datSua(t)
    datBieu({
      diemDi: t.diemDi,
      diemDen: t.diemDen,
      khoangCachKm: t.khoangCachKm ?? 0,
      thoiGianUocTinhPhut: t.thoiGianUocTinhPhut ?? 0,
      hoatDong: t.hoatDong !== false,
    })
    datMo(true)
  }

  async function luu() {
    try {
      if (sua) {
        await moKhoiDuLieu(
          khachHttp.put<PhanHoi<TuyenDuong>>(`/tuyen-duong/${sua.ma}`, { ...bieu, ma: sua.ma }),
        )
      } else {
        await moKhoiDuLieu(khachHttp.post<PhanHoi<TuyenDuong>>('/tuyen-duong', bieu))
      }
      datMo(false)
      void taiDS()
      hienThi({ loai: 'thanhCong', noiDung: 'Đã lưu tuyến đường.' })
    } catch (e: unknown) {
      hienThi({ loai: 'loi', noiDung: e instanceof Error ? e.message : 'Lỗi lưu dữ liệu' })
    }
  }

  async function xoa(ma: number) {
    if (!confirm('Xóa tuyến này? Thao tác không hoàn tác.')) return
    try {
      await moKhoiDuLieu(khachHttp.delete<PhanHoi<unknown>>(`/tuyen-duong/${ma}`))
      void taiDS()
      hienThi({ loai: 'thanhCong', noiDung: 'Đã xóa tuyến.' })
    } catch (e: unknown) {
      hienThi({ loai: 'loi', noiDung: e instanceof Error ? e.message : 'Lỗi xóa' })
    }
  }

  return (
    <div className="admin-page">
      <header className="admin-page__head">
        <h1 className="admin-page__title">Tuyến đường</h1>
        <p className="admin-page__sub">Quản lý điểm đi — điểm đến, quãng đường và thời gian ước tính.</p>
      </header>
      <TheChua padding="none">
        <div className="table-wrap-pad">
          <TieuDeThe
            title="Danh sách tuyến"
            subtitle="Chọn sửa hoặc thêm tuyến mới"
            action={<NutBam bien="chinh" onClick={moThe} con="+ Thêm tuyến" />}
          />
        </div>
        <div className="table-scroll">
          <table className="data-table">
            <thead>
              <tr>
                <th>Mã</th>
                <th>Điểm đi</th>
                <th>Điểm đến</th>
                <th>Km</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {ds.map((r) => (
                <tr key={r.ma}>
                  <td className="mono">{r.ma}</td>
                  <td>{r.diemDi}</td>
                  <td>{r.diemDen}</td>
                  <td>{r.khoangCachKm}</td>
                  <td className="row-actions">
                    <NutSuaQt onClick={() => moSua(r)} />
                    {laAdmin ? <NutXoaQt onClick={() => void xoa(r.ma)} /> : null}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </TheChua>

      <CuaSo
        open={mo}
        title={sua ? 'Sửa tuyến' : 'Thêm tuyến'}
        onClose={() => datMo(false)}
        footer={
          <>
            <NutBam bien="huy" onClick={() => datMo(false)} con="Hủy" />
            <NutBam bien="chinh" onClick={() => void luu()} con="Lưu" />
          </>
        }
      >
        <div className="form-stack">
          <TruongNhap
            nhan="Điểm đi"
            value={bieu.diemDi}
            onChange={(e) => datBieu({ ...bieu, diemDi: e.target.value })}
            required
          />
          <TruongNhap
            nhan="Điểm đến"
            value={bieu.diemDen}
            onChange={(e) => datBieu({ ...bieu, diemDen: e.target.value })}
            required
          />
          <TruongNhap
            nhan="Khoảng cách (km)"
            type="number"
            value={bieu.khoangCachKm}
            onChange={(e) => datBieu({ ...bieu, khoangCachKm: Number(e.target.value) })}
          />
          <TruongNhap
            nhan="Thời gian ước tính (phút)"
            type="number"
            value={bieu.thoiGianUocTinhPhut}
            onChange={(e) => datBieu({ ...bieu, thoiGianUocTinhPhut: Number(e.target.value) })}
          />
          <label className="check">
            <input
              type="checkbox"
              checked={bieu.hoatDong}
              onChange={(e) => datBieu({ ...bieu, hoatDong: e.target.checked })}
            />
            Hoạt động
          </label>
        </div>
      </CuaSo>
    </div>
  )
}
