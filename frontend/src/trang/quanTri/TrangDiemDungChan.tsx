import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { khachHttp, moKhoiDuLieu } from '../../nguon/apiClient'
import type { PhanHoi, TuyenDuong } from '../../nguon/kieu'
import { dungThongBao } from '../../dinhDanh/boiCanhThongBao'
import { TheChua, TieuDeThe } from '../../thanhPhan/theChua'
import { KhungQuanLyDiemDung } from '../../thanhPhan/khungQuanLyDiemDung'
import { TruongChon } from '../../thanhPhan/truongNhap'
import { chuoiLoTrinh, taiDiemDungTheoTuyen } from '../../tienIch/loTrinhTuyen'
import type { DiemDungChan } from '../../nguon/kieu'

export function TrangDiemDungChan() {
  const [searchParams] = useSearchParams()
  const { hienThi } = dungThongBao()
  const [dsTuyen, datTuyen] = useState<TuyenDuong[]>([])
  const [maTuyen, datMaTuyen] = useState<number | ''>('')
  const [diemDungTheoTuyen, datDiemDungTheoTuyen] = useState<Record<number, DiemDungChan[]>>({})

  async function taiTuyen() {
    try {
      const t = await moKhoiDuLieu(khachHttp.get<PhanHoi<TuyenDuong[]>>('/tuyen-duong'))
      datTuyen(t)
      datDiemDungTheoTuyen(await taiDiemDungTheoTuyen(t))
      const maTuUrl = searchParams.get('tuyen')
      if (maTuUrl) {
        const ma = Number(maTuUrl)
        if (t.some((x) => x.ma === ma)) datMaTuyen(ma)
      } else if (t.length && maTuyen === '') {
        datMaTuyen(t[0].ma)
      }
    } catch (e: unknown) {
      hienThi({ loai: 'loi', noiDung: e instanceof Error ? e.message : 'Lỗi tải tuyến' })
    }
  }

  useEffect(() => {
    void taiTuyen()
  }, [])

  const tuyenChon = dsTuyen.find((t) => t.ma === maTuyen)

  return (
    <div className="admin-page">
      <header className="admin-page__head">
        <h1 className="admin-page__title">Điểm dừng chân</h1>
        <p className="admin-page__sub">Quản lý các điểm dừng trên lộ trình từng tuyến (theo thứ tự đi qua).</p>
      </header>
      <TheChua padding="lg">
        <TieuDeThe
          title="Chọn tuyến"
          action={
            <TruongChon
              nhan="Tuyến"
              value={maTuyen === '' ? '' : String(maTuyen)}
              onChange={(e) => datMaTuyen(e.target.value ? Number(e.target.value) : '')}
            >
              {dsTuyen.map((t) => (
                <option key={t.ma} value={t.ma}>
                  {chuoiLoTrinh(t, diemDungTheoTuyen[t.ma] ?? [])}
                </option>
              ))}
            </TruongChon>
          }
        />
      </TheChua>
      {tuyenChon && maTuyen !== '' ? (
        <TheChua padding="lg">
          <KhungQuanLyDiemDung
            maTuyen={maTuyen}
            tuyen={tuyenChon}
            onDsThayDoi={(ds) => datDiemDungTheoTuyen((prev) => ({ ...prev, [maTuyen]: ds }))}
          />
        </TheChua>
      ) : (
        <TheChua padding="lg">
          <p className="muted">Chọn tuyến để quản lý điểm dừng.</p>
        </TheChua>
      )}
    </div>
  )
}
