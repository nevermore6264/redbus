import { useEffect, useState } from 'react'
import { khachHttp, moKhoiDuLieu } from '../../nguon/apiClient'
import type { PhanHoi, TinTuc } from '../../nguon/kieu'
import { dungNguoiDung } from '../../dinhDanh/boiCanhNguoiDung'
import { dungThongBao } from '../../dinhDanh/boiCanhThongBao'
import { TheChua, TieuDeThe } from '../../thanhPhan/theChua'
import { NutBam, NutSuaQt, NutXoaQt } from '../../thanhPhan/nutBam'
import { TruongNhap } from '../../thanhPhan/truongNhap'
import { TruongNoiDungHtml } from '../../thanhPhan/TruongNoiDungHtml'
import { TruongTaiAnhTin } from '../../thanhPhan/TruongTaiAnhTin'
import { CuaSo } from '../../thanhPhan/cuaSo'
import { CuaSoXacNhanXoa } from '../../thanhPhan/cuaSoXacNhanXoa'
import { chuanHoaChuoi } from '../../tienIch/kiemTraQuanTri'

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
  const [xoaChon, datXoaChon] = useState<TinTuc | null>(null)
  const [dangXoa, datDangXoa] = useState(false)
  const [loiBieu, datLoiBieu] = useState<Partial<Record<'tieuDe' | 'noiDung', string>>>({})
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
    datLoiBieu({})
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
    datLoiBieu({})
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
    const tieuDe = chuanHoaChuoi(bieu.tieuDe)
    const noiDung = bieu.noiDung.trim()
    const loi: Partial<Record<'tieuDe' | 'noiDung', string>> = {}
    if (!tieuDe) loi.tieuDe = 'Nhập tiêu đề'
    if (!noiDung) loi.noiDung = 'Nhập nội dung'
    datLoiBieu(loi)
    if (Object.keys(loi).length > 0) return

    try {
      const than = {
        tieuDe,
        tomTat: bieu.tomTat.trim(),
        noiDung,
        duongAnh: bieu.duongAnh.trim(),
        ngayXuatBan: bieu.ngayXuatBan ? new Date(bieu.ngayXuatBan).toISOString() : undefined,
        hoatDong: bieu.hoatDong,
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

  async function xacNhanXoa() {
    if (!xoaChon) return
    datDangXoa(true)
    try {
      await moKhoiDuLieu(khachHttp.delete<PhanHoi<unknown>>(`/tin-tuc/${xoaChon.ma}`))
      datXoaChon(null)
      void taiDS()
      hienThi({ loai: 'thanhCong', noiDung: 'Đã xóa tin.' })
    } catch (e: unknown) {
      hienThi({ loai: 'loi', noiDung: e instanceof Error ? e.message : 'Lỗi xóa' })
    } finally {
      datDangXoa(false)
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
                    {laAdmin ? <NutXoaQt onClick={() => datXoaChon(r)} /> : null}
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
        size="xl"
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
            loi={loiBieu.tieuDe}
            required
          />
          <TruongNhap
            nhan="Tóm tắt"
            value={bieu.tomTat}
            onChange={(e) => datBieu({ ...bieu, tomTat: e.target.value })}
          />
          <TruongNoiDungHtml
            id="nd-tin"
            value={bieu.noiDung}
            onChange={(html) => datBieu({ ...bieu, noiDung: html })}
            loi={loiBieu.noiDung}
            required
          />
          <TruongTaiAnhTin giaTri={bieu.duongAnh} onDoi={(duongAnh) => datBieu({ ...bieu, duongAnh })} />
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

      <CuaSoXacNhanXoa
        open={xoaChon !== null}
        title="Xóa bài tin"
        nhanNutXoa="Xóa tin"
        dangXoa={dangXoa}
        onClose={() => datXoaChon(null)}
        onConfirm={() => void xacNhanXoa()}
      >
        {xoaChon ? (
          <p className="modal-confirm-text">
            Bạn có chắc muốn xóa bài <strong>{xoaChon.tieuDe}</strong>? Thao tác không thể hoàn tác.
          </p>
        ) : null}
      </CuaSoXacNhanXoa>
    </div>
  )
}
