import { useEffect, useState } from 'react'
import { khachHttp, moKhoiDuLieu } from '../../nguon/apiClient'
import type { PhanHoi, TinTuc } from '../../nguon/kieu'
import { dungNguoiDung } from '../../dinhDanh/boiCanhNguoiDung'
import { dungThongBao } from '../../dinhDanh/boiCanhThongBao'
import { TheChua, TieuDeThe } from '../../thanhPhan/theChua'
import { NutBam, NutSuaQt, NutXoaQt } from '../../thanhPhan/nutBam'
import { TruongNhap, TruongVanBan } from '../../thanhPhan/truongNhap'
import { CuaSo } from '../../thanhPhan/cuaSo'

function raLocal(iso: string | undefined): string {
  if (!iso) return ''
  const d = new Date(iso)
  const p = (n: number) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}T${p(d.getHours())}:${p(d.getMinutes())}`
}

export function TrangTinTucQuanTri() {
  const { nguoiDung } = dungNguoiDung()
  const { hienThi } = dungThongBao()
  const laAdmin = nguoiDung?.vaiTro === 'ADMIN'
  const [ds, datDs] = useState<TinTuc[]>([])
  const [mo, datMo] = useState(false)
  const [sua, datSua] = useState<TinTuc | null>(null)
  const [bieu, datBieu] = useState({
    tieuDe: '',
    tomTat: '',
    noiDung: '',
    duongAnh: '',
    ngayXuatBan: '',
    hoatDong: true,
  })

  async function taiDS() {
    try {
      const x = await moKhoiDuLieu(khachHttp.get<PhanHoi<TinTuc[]>>('/tin-tuc/quan-tri/tat-ca'))
      datDs(x)
    } catch (e: unknown) {
      hienThi({ loai: 'loi', noiDung: e instanceof Error ? e.message : 'Lỗi tải tin' })
    }
  }

  useEffect(() => {
    void taiDS()
  }, [])

  function moThe() {
    datSua(null)
    datBieu({
      tieuDe: '',
      tomTat: '',
      noiDung: '',
      duongAnh: '',
      ngayXuatBan: raLocal(new Date().toISOString()),
      hoatDong: true,
    })
    datMo(true)
  }

  function moSua(t: TinTuc) {
    datSua(t)
    datBieu({
      tieuDe: t.tieuDe,
      tomTat: t.tomTat ?? '',
      noiDung: t.noiDung,
      duongAnh: t.duongAnh ?? '',
      ngayXuatBan: raLocal(t.ngayXuatBan),
      hoatDong: t.hoatDong !== false,
    })
    datMo(true)
  }

  async function luu() {
    try {
      const than = {
        ...bieu,
        ngayXuatBan: bieu.ngayXuatBan ? new Date(bieu.ngayXuatBan).toISOString() : undefined,
      }
      if (sua) {
        await moKhoiDuLieu(khachHttp.put<PhanHoi<TinTuc>>(`/tin-tuc/${sua.ma}`, { ...than, ma: sua.ma }))
      } else {
        await moKhoiDuLieu(khachHttp.post<PhanHoi<TinTuc>>('/tin-tuc', than))
      }
      datMo(false)
      void taiDS()
      hienThi({ loai: 'thanhCong', noiDung: 'Đã lưu tin tức.' })
    } catch (e: unknown) {
      hienThi({ loai: 'loi', noiDung: e instanceof Error ? e.message : 'Lỗi lưu' })
    }
  }

  async function xoa(ma: number) {
    if (!confirm('Xóa bài tin này?')) return
    try {
      await moKhoiDuLieu(khachHttp.delete<PhanHoi<unknown>>(`/tin-tuc/${ma}`))
      void taiDS()
      hienThi({ loai: 'thanhCong', noiDung: 'Đã xóa tin.' })
    } catch (e: unknown) {
      hienThi({ loai: 'loi', noiDung: e instanceof Error ? e.message : 'Lỗi xóa' })
    }
  }

  return (
    <div className="admin-page">
      <header className="admin-page__head">
        <h1 className="admin-page__title">Tin tức</h1>
        <p className="admin-page__sub">Đăng và chỉnh sửa bài viết hiển thị trên trang khách.</p>
      </header>
      <TheChua padding="none">
        <div className="table-wrap-pad">
          <TieuDeThe title="Danh sách bài viết" action={<NutBam bien="chinh" onClick={moThe} con="+ Thêm tin" />} />
        </div>
        <div className="table-scroll">
          <table className="data-table">
            <thead>
              <tr>
                <th>Mã</th>
                <th>Tiêu đề</th>
                <th>Hiển thị</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {ds.map((r) => (
                <tr key={r.ma}>
                  <td className="mono">{r.ma}</td>
                  <td>{r.tieuDe}</td>
                  <td>{r.hoatDong ? 'Có' : 'Không'}</td>
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
        title={sua ? 'Sửa tin' : 'Thêm tin'}
        onClose={() => datMo(false)}
        size="lg"
        footer={
          <>
            <NutBam bien="huy" onClick={() => datMo(false)} con="Hủy" />
            <NutBam bien="chinh" onClick={() => void luu()} con="Lưu" />
          </>
        }
      >
        <div className="form-stack">
          <TruongNhap
            nhan="Tiêu đề"
            value={bieu.tieuDe}
            onChange={(e) => datBieu({ ...bieu, tieuDe: e.target.value })}
            required
          />
          <TruongNhap
            nhan="Tóm tắt"
            value={bieu.tomTat}
            onChange={(e) => datBieu({ ...bieu, tomTat: e.target.value })}
          />
          <TruongVanBan
            id="nd-tin"
            nhan="Nội dung"
            rows={6}
            value={bieu.noiDung}
            onChange={(e) => datBieu({ ...bieu, noiDung: e.target.value })}
            required
          />
          <TruongNhap
            nhan="URL ảnh đại diện"
            value={bieu.duongAnh}
            onChange={(e) => datBieu({ ...bieu, duongAnh: e.target.value })}
          />
          <TruongNhap
            type="datetime-local"
            nhan="Ngày đăng"
            value={bieu.ngayXuatBan}
            onChange={(e) => datBieu({ ...bieu, ngayXuatBan: e.target.value })}
          />
          <label className="check">
            <input
              type="checkbox"
              checked={bieu.hoatDong}
              onChange={(e) => datBieu({ ...bieu, hoatDong: e.target.checked })}
            />
            Hiển thị công khai
          </label>
        </div>
      </CuaSo>
    </div>
  )
}
