import { useEffect, useMemo, useState } from 'react'
import { Clock, MapPin, Timer } from 'lucide-react'
import { khachHttp, moKhoiDuLieu } from '../nguon/apiClient'
import type { DiemDungChan, PhanHoi, TuyenDuong } from '../nguon/kieu'
import { LoTrinhTuyen } from './LoTrinhTuyen'
import { NutBam, NutSuaQt, NutXoaQt } from './nutBam'
import { ChonDiaDanh } from './ChonDiaDanh'
import { TruongNhap } from './truongNhap'
import { CuaSo } from './cuaSo'
import { CuaSoXacNhanXoa } from './cuaSoXacNhanXoa'
import { TheChua } from './theChua'
import { chuanHoaChuoi, soSanhKhongPhanBiet } from '../tienIch/kiemTraQuanTri'
import { sapXepDiemDung } from '../tienIch/loTrinhTuyen'
import { dungThongBao } from '../dinhDanh/boiCanhThongBao'
import { dungNguoiDung } from '../dinhDanh/boiCanhNguoiDung'

interface Props {
  maTuyen: number
  tuyen: Pick<TuyenDuong, 'diemDi' | 'diemDen' | 'khoangCachKm' | 'thoiGianUocTinhPhut'>
  onDsThayDoi?: (ds: DiemDungChan[]) => void
}

export function KhungQuanLyDiemDung({ maTuyen, tuyen, onDsThayDoi }: Props) {
  const { hienThi } = dungThongBao()
  const { nguoiDung } = dungNguoiDung()
  const laAdmin = nguoiDung?.vaiTro === 'ADMIN'
  const [ds, datDs] = useState<DiemDungChan[]>([])
  const [mo, datMo] = useState(false)
  const [sua, datSua] = useState<DiemDungChan | null>(null)
  const [xoaChon, datXoaChon] = useState<DiemDungChan | null>(null)
  const [dangXoa, datDangXoa] = useState(false)
  const [loiBieu, datLoiBieu] = useState<
    Partial<Record<'tenDiem' | 'thuTu' | 'thoiGianDungPhut' | 'chung', string>>
  >({})
  const [bieu, datBieu] = useState({ tenDiem: '', thuTu: 0, thoiGianDungPhut: 5 })

  const dsSap = useMemo(() => sapXepDiemDung(ds), [ds])
  const tongPhutDung = useMemo(
    () => ds.reduce((t, d) => t + (d.thoiGianDungPhut ?? 0), 0),
    [ds],
  )

  function trungThuTu(thuTu: number, maLoaiTru?: number) {
    return ds.some((d) => {
      if (maLoaiTru != null && d.ma === maLoaiTru) return false
      return d.thuTu === thuTu
    })
  }

  function trungTenDiem(tenDiem: string, maLoaiTru?: number) {
    return ds.some((d) => {
      if (maLoaiTru != null && d.ma === maLoaiTru) return false
      return soSanhKhongPhanBiet(d.tenDiem, tenDiem)
    })
  }

  async function taiDiem() {
    try {
      const d = await moKhoiDuLieu(
        khachHttp.get<PhanHoi<DiemDungChan[]>>(`/diem-dung/tuyen/${maTuyen}`),
      )
      datDs(d)
      onDsThayDoi?.(d)
    } catch (e: unknown) {
      hienThi({ loai: 'loi', noiDung: e instanceof Error ? e.message : 'Lỗi tải điểm dừng' })
    }
  }

  useEffect(() => {
    void taiDiem()
  }, [maTuyen])

  function moThe() {
    datSua(null)
    datLoiBieu({})
    datBieu({ tenDiem: '', thuTu: ds.length, thoiGianDungPhut: 5 })
    datMo(true)
  }

  function moSua(d: DiemDungChan) {
    datSua(d)
    datLoiBieu({})
    datBieu({
      tenDiem: d.tenDiem,
      thuTu: d.thuTu ?? 0,
      thoiGianDungPhut: d.thoiGianDungPhut ?? 5,
    })
    datMo(true)
  }

  async function luu() {
    const tenDiem = chuanHoaChuoi(bieu.tenDiem)
    const loi: Partial<Record<'tenDiem' | 'thuTu' | 'thoiGianDungPhut' | 'chung', string>> = {}
    if (!tenDiem) loi.tenDiem = 'Chọn tỉnh và phường/xã cho điểm dừng'
    if (bieu.thuTu < 0) loi.thuTu = 'Thứ tự phải từ 0 trở lên'
    if (bieu.thoiGianDungPhut < 0) loi.thoiGianDungPhut = 'Thời gian dừng không hợp lệ'
    if (trungThuTu(bieu.thuTu, sua?.ma)) loi.thuTu = `Thứ tự ${bieu.thuTu} đã có trên tuyến này`
    if (tenDiem && trungTenDiem(tenDiem, sua?.ma)) loi.chung = `Điểm « ${tenDiem} » đã có trên tuyến này`
    datLoiBieu(loi)
    if (Object.keys(loi).length > 0) return

    try {
      const than = {
        tenDiem,
        thuTu: bieu.thuTu,
        thoiGianDungPhut: bieu.thoiGianDungPhut,
        maTuyen,
      }
      if (sua) {
        await moKhoiDuLieu(
          khachHttp.put<PhanHoi<DiemDungChan>>(`/diem-dung/${sua.ma}`, { ...than, ma: sua.ma }),
        )
      } else {
        await moKhoiDuLieu(khachHttp.post<PhanHoi<DiemDungChan>>('/diem-dung', than))
      }
      datMo(false)
      void taiDiem()
      hienThi({ loai: 'thanhCong', noiDung: 'Đã lưu điểm dừng.' })
    } catch (e: unknown) {
      hienThi({ loai: 'loi', noiDung: e instanceof Error ? e.message : 'Lỗi lưu' })
    }
  }

  async function xacNhanXoa() {
    if (!xoaChon) return
    datDangXoa(true)
    try {
      await moKhoiDuLieu(khachHttp.delete<PhanHoi<unknown>>(`/diem-dung/${xoaChon.ma}`))
      datXoaChon(null)
      void taiDiem()
      hienThi({ loai: 'thanhCong', noiDung: 'Đã xóa.' })
    } catch (e: unknown) {
      hienThi({ loai: 'loi', noiDung: e instanceof Error ? e.message : 'Lỗi xóa' })
    } finally {
      datDangXoa(false)
    }
  }

  return (
    <div className="stops-workspace">
      <header className="stops-workspace__head">
        <div className="stops-workspace__route">
          <span className="stops-workspace__pill stops-workspace__pill--di">{tuyen.diemDi}</span>
          <span className="stops-workspace__arrow" aria-hidden>
            →
          </span>
          <span className="stops-workspace__pill stops-workspace__pill--den">{tuyen.diemDen}</span>
        </div>
        <NutBam bien="chinh" className="btn--sm" onClick={moThe} con="Thêm điểm dừng" />
      </header>

      <div className="stops-kpi">
        <TheChua padding="md" className="stops-kpi__item">
          <MapPin size={20} className="stops-kpi__ico stops-kpi__ico--rose" aria-hidden />
          <div>
            <span className="stops-kpi__val">{ds.length}</span>
            <span className="stops-kpi__lab">Điểm dừng</span>
          </div>
        </TheChua>
        <TheChua padding="md" className="stops-kpi__item">
          <Clock size={20} className="stops-kpi__ico stops-kpi__ico--amber" aria-hidden />
          <div>
            <span className="stops-kpi__val">{tongPhutDung}</span>
            <span className="stops-kpi__lab">Phút dừng (tổng)</span>
          </div>
        </TheChua>
        <TheChua padding="md" className="stops-kpi__item">
          <Timer size={20} className="stops-kpi__ico stops-kpi__ico--blue" aria-hidden />
          <div>
            <span className="stops-kpi__val">
              {tuyen.thoiGianUocTinhPhut != null ? `${tuyen.thoiGianUocTinhPhut}` : '—'}
            </span>
            <span className="stops-kpi__lab">
              {tuyen.khoangCachKm != null ? `Ước tính · ${tuyen.khoangCachKm} km` : 'Thời gian tuyến (phút)'}
            </span>
          </div>
        </TheChua>
      </div>

      <div className="stops-grid">
        <TheChua padding="lg" className="stops-preview">
          <h3 className="stops-preview__title">Xem trước lộ trình</h3>
          <p className="stops-preview__sub muted">Thứ tự đi qua từ điểm đi đến điểm đến</p>
          <LoTrinhTuyen tuyen={tuyen} diemDung={ds} kieu="timeline" className="stops-preview__timeline" />
        </TheChua>

        <TheChua padding="lg" className="stops-list-panel">
          <div className="stops-list-panel__head">
            <h3 className="stops-list-panel__title">Chi tiết điểm dừng</h3>
            <span className="stops-list-panel__count">{ds.length} mục</span>
          </div>

          {dsSap.length > 0 ? (
            <ul className="stops-list">
              {dsSap.map((r) => (
                <li key={r.ma} className="stops-card">
                  <span className="stops-card__order" title={`Thứ tự ${r.thuTu}`}>
                    {r.thuTu}
                  </span>
                  <div className="stops-card__body">
                    <strong className="stops-card__name">{r.tenDiem}</strong>
                    <span className="stops-card__meta">
                      <Clock size={14} aria-hidden />
                      Dừng {r.thoiGianDungPhut ?? 0} phút
                    </span>
                  </div>
                  <div className="stops-card__actions">
                    <NutSuaQt onClick={() => moSua(r)} />
                    {laAdmin ? <NutXoaQt onClick={() => datXoaChon(r)} /> : null}
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <div className="stops-list-empty">
              <MapPin size={32} strokeWidth={1.5} className="stops-list-empty__icon" aria-hidden />
              <p className="stops-list-empty__title">Chưa có điểm dừng</p>
              <p className="muted small">Thêm điểm giữa lộ trình để khách chọn đón/trả khi đặt vé.</p>
              <NutBam bien="chinh" className="btn--sm" onClick={moThe} con="Thêm điểm đầu tiên" />
            </div>
          )}
        </TheChua>
      </div>

      <CuaSo
        open={mo}
        size="xl"
        title={sua ? 'Sửa điểm dừng' : 'Thêm điểm dừng'}
        onClose={() => datMo(false)}
        footer={
          <>
            <NutBam bien="huy" onClick={() => datMo(false)} con="Hủy" />
            <NutBam bien="chinh" onClick={() => void luu()} con="Lưu" />
          </>
        }
      >
        <div className="form-stack">
          {loiBieu.chung ? <p className="form-alert form-alert--error">{loiBieu.chung}</p> : null}
          <ChonDiaDanh
            bien="dung"
            nhan="Vị trí điểm dừng"
            giaTri={bieu.tenDiem}
            onDoi={(chuoi) => datBieu({ ...bieu, tenDiem: chuoi })}
            loi={loiBieu.tenDiem}
            required
          />
          <div className="stops-form-row">
            <TruongNhap
              type="number"
              nhan="Thứ tự"
              min={0}
              value={bieu.thuTu}
              onChange={(e) => datBieu({ ...bieu, thuTu: Number(e.target.value) })}
              loi={loiBieu.thuTu}
              required
            />
            <TruongNhap
              type="number"
              nhan="Phút dừng"
              min={0}
              value={bieu.thoiGianDungPhut}
              onChange={(e) => datBieu({ ...bieu, thoiGianDungPhut: Number(e.target.value) })}
              loi={loiBieu.thoiGianDungPhut}
            />
          </div>
        </div>
      </CuaSo>

      <CuaSoXacNhanXoa
        open={xoaChon !== null}
        title="Xóa điểm dừng"
        nhanNutXoa="Xóa điểm"
        dangXoa={dangXoa}
        onClose={() => datXoaChon(null)}
        onConfirm={() => void xacNhanXoa()}
      >
        {xoaChon ? (
          <p className="modal-confirm-text">
            Bạn có chắc muốn xóa điểm <strong>{xoaChon.tenDiem}</strong>? Thao tác không thể hoàn tác.
          </p>
        ) : null}
      </CuaSoXacNhanXoa>
    </div>
  )
}
