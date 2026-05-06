import { useEffect, useState } from 'react'
import { khachHttp, moKhoiDuLieu, guiMultipart, urlTaiNguyen } from '../../nguon/apiClient'
import type { LoaiXe, PhanHoi } from '../../nguon/kieu'
import { dungNguoiDung } from '../../dinhDanh/boiCanhNguoiDung'
import { dungThongBao } from '../../dinhDanh/boiCanhThongBao'
import { TheChua, TieuDeThe } from '../../thanhPhan/theChua'
import { NutBam, NutSuaQt, NutXoaQt } from '../../thanhPhan/nutBam'
import { TruongNhap } from '../../thanhPhan/truongNhap'
import { CuaSo } from '../../thanhPhan/cuaSo'

export function TrangLoaiXe() {
  const { nguoiDung } = dungNguoiDung()
  const { hienThi } = dungThongBao()
  const laAdmin = nguoiDung?.vaiTro === 'ADMIN'
  const [ds, datDs] = useState<LoaiXe[]>([])
  const [mo, datMo] = useState(false)
  const [sua, datSua] = useState<LoaiXe | null>(null)
  const [bieu, datBieu] = useState({ ten: '', moTa: '', tienIch: '', hoatDong: true })

  async function taiDS() {
    try {
      const x = await moKhoiDuLieu(khachHttp.get<PhanHoi<LoaiXe[]>>('/loai-xe'))
      datDs(x)
    } catch (e: unknown) {
      hienThi({ loai: 'loi', noiDung: e instanceof Error ? e.message : 'Lỗi tải dữ liệu' })
    }
  }

  useEffect(() => {
    void taiDS()
  }, [])

  function moThe() {
    datSua(null)
    datBieu({ ten: '', moTa: '', tienIch: '', hoatDong: true })
    datMo(true)
  }

  function moSua(t: LoaiXe) {
    datSua(t)
    datBieu({
      ten: t.ten,
      moTa: t.moTa ?? '',
      tienIch: t.tienIch ?? '',
      hoatDong: t.hoatDong !== false,
    })
    datMo(true)
  }

  async function luu() {
    try {
      if (sua) {
        await moKhoiDuLieu(
          khachHttp.put<PhanHoi<LoaiXe>>(`/loai-xe/${sua.ma}`, { ...bieu, ma: sua.ma }),
        )
        datMo(false)
        void taiDS()
        hienThi({ loai: 'thanhCong', noiDung: 'Đã lưu loại xe.' })
      } else {
        const ketQua = await moKhoiDuLieu(khachHttp.post<PhanHoi<LoaiXe>>('/loai-xe', bieu))
        datSua(ketQua)
        datBieu({
          ten: ketQua.ten,
          moTa: ketQua.moTa ?? '',
          tienIch: ketQua.tienIch ?? '',
          hoatDong: ketQua.hoatDong !== false,
        })
        void taiDS()
        hienThi({
          loai: 'thanhCong',
          noiDung: 'Đã thêm loại xe — có thể tải thêm ảnh minh họa bên dưới.',
        })
      }
    } catch (e: unknown) {
      hienThi({ loai: 'loi', noiDung: e instanceof Error ? e.message : 'Lỗi lưu' })
    }
  }

  async function taiMotAnh(tep: File) {
    if (!sua) return
    try {
      const fd = new FormData()
      fd.append('tep', tep)
      await guiMultipart(`/loai-xe/${sua.ma}/anh`, fd)
      const capNhat = await moKhoiDuLieu(khachHttp.get<PhanHoi<LoaiXe>>(`/loai-xe/${sua.ma}`))
      datSua(capNhat)
      void taiDS()
      hienThi({ loai: 'thanhCong', noiDung: 'Đã tải ảnh lên.' })
    } catch (e: unknown) {
      hienThi({ loai: 'loi', noiDung: e instanceof Error ? e.message : 'Lỗi tải ảnh' })
    }
  }

  async function xoaAnh(maAnh: number) {
    if (!sua) return
    if (!confirm('Xóa ảnh này?')) return
    try {
      await moKhoiDuLieu(khachHttp.delete<PhanHoi<unknown>>(`/loai-xe/${sua.ma}/anh/${maAnh}`))
      const capNhat = await moKhoiDuLieu(khachHttp.get<PhanHoi<LoaiXe>>(`/loai-xe/${sua.ma}`))
      datSua(capNhat)
      void taiDS()
      hienThi({ loai: 'thanhCong', noiDung: 'Đã xóa ảnh.' })
    } catch (e: unknown) {
      hienThi({ loai: 'loi', noiDung: e instanceof Error ? e.message : 'Lỗi xóa ảnh' })
    }
  }

  async function xoa(ma: number) {
    if (!confirm('Xóa loại xe này?')) return
    try {
      await moKhoiDuLieu(khachHttp.delete<PhanHoi<unknown>>(`/loai-xe/${ma}`))
      void taiDS()
      hienThi({ loai: 'thanhCong', noiDung: 'Đã xóa.' })
    } catch (e: unknown) {
      hienThi({ loai: 'loi', noiDung: e instanceof Error ? e.message : 'Lỗi xóa' })
    }
  }

  return (
    <div className="admin-page">
      <header className="admin-page__head">
        <h1 className="admin-page__title">Loại xe</h1>
        <p className="admin-page__sub">Phân loại xe và ảnh minh họa (khách xem khi đặt vé).</p>
      </header>
      <TheChua padding="none">
        <div className="table-wrap-pad">
          <TieuDeThe title="Danh sách" action={<NutBam bien="chinh" onClick={moThe} con="+ Thêm loại" />} />
        </div>
        <div className="table-scroll">
          <table className="data-table">
            <thead>
              <tr>
                <th>Mã</th>
                <th>Tên</th>
                <th>Ảnh</th>
                <th>Tiện ích</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {ds.map((r) => (
                <tr key={r.ma}>
                  <td className="mono">{r.ma}</td>
                  <td>{r.ten}</td>
                  <td>
                    <span className="muted">{r.dsAnh?.length ?? 0} ảnh</span>
                  </td>
                  <td className="muted">{r.tienIch}</td>
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
        title={sua ? 'Sửa loại xe' : 'Thêm loại xe'}
        onClose={() => datMo(false)}
        footer={
          <>
            <NutBam bien="huy" onClick={() => datMo(false)} con="Hủy" />
            <NutBam bien="chinh" onClick={() => void luu()} con={sua ? 'Lưu' : 'Lưu & tiếp tục'} />
          </>
        }
      >
        <div className="form-stack">
          <TruongNhap
            nhan="Tên loại"
            value={bieu.ten}
            onChange={(e) => datBieu({ ...bieu, ten: e.target.value })}
            required
          />
          <TruongNhap
            nhan="Mô tả"
            value={bieu.moTa}
            onChange={(e) => datBieu({ ...bieu, moTa: e.target.value })}
          />
          <TruongNhap
            nhan="Tiện ích"
            value={bieu.tienIch}
            onChange={(e) => datBieu({ ...bieu, tienIch: e.target.value })}
          />
          <label className="check">
            <input
              type="checkbox"
              checked={bieu.hoatDong}
              onChange={(e) => datBieu({ ...bieu, hoatDong: e.target.checked })}
            />
            Hoạt động
          </label>

          {sua ? (
            <div className="loai-xe-anh-panel">
              <p className="muted small">
                Ảnh minh họa — khách xem khi chọn chuyến (tối đa ~8MB/ảnh; jpg, png, webp, gif).
              </p>
              <div className="loai-xe-anh-grid">
                {(sua.dsAnh ?? []).map((a) => (
                  <div key={a.ma} className="loai-xe-anh-item">
                    <img src={urlTaiNguyen(a.duongAnh)} alt="" />
                    <button type="button" className="btn-text loai-xe-anh-item__del" onClick={() => void xoaAnh(a.ma)}>
                      Xóa
                    </button>
                  </div>
                ))}
              </div>
              <label className="field loai-xe-anh-upload">
                <span className="field__label">Thêm ảnh</span>
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/gif"
                  className="field__input"
                  onChange={(e) => {
                    const f = e.target.files?.[0]
                    if (f) void taiMotAnh(f)
                    e.target.value = ''
                  }}
                />
              </label>
            </div>
          ) : (
            <p className="muted small">Sau khi lưu loại mới, bạn có thể tải nhiều ảnh minh họa.</p>
          )}
        </div>
      </CuaSo>
    </div>
  )
}
