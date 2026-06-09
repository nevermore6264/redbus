import { useState } from 'react'
import { guiMultipart, urlTaiNguyen } from '../nguon/apiClient'
import { dungThongBao } from '../dinhDanh/boiCanhThongBao'
import { NutVanBan } from './nutBam'

type DuongAnhUpload = { duongAnh: string }

type Props = {
  nhan?: string
  giaTri: string
  onDoi: (duongAnh: string) => void
}

export function TruongTaiAnhTin({ nhan = 'Ảnh đại diện', giaTri, onDoi }: Props) {
  const { hienThi } = dungThongBao()
  const [dangTai, datDangTai] = useState(false)

  async function chonTep(tep: File) {
    datDangTai(true)
    try {
      const fd = new FormData()
      fd.append('tep', tep)
      const kq = await guiMultipart<DuongAnhUpload>('/tin-tuc/upload-anh', fd)
      onDoi(kq.duongAnh)
      hienThi({ loai: 'thanhCong', noiDung: 'Đã tải ảnh lên.' })
    } catch (e: unknown) {
      hienThi({ loai: 'loi', noiDung: e instanceof Error ? e.message : 'Không tải được ảnh' })
    } finally {
      datDangTai(false)
    }
  }

  return (
    <div className="field tin-anh-upload">
      <span className="field__label">{nhan}</span>
      <p className="muted small tin-anh-upload__hint">jpg, png, webp, gif — tối đa 8MB</p>
      {giaTri ? (
        <div className="tin-anh-upload__preview">
          <img src={urlTaiNguyen(giaTri)} alt="" />
          <NutVanBan con="Gỡ ảnh" onClick={() => onDoi('')} />
        </div>
      ) : null}
      <label className="tin-anh-upload__pick">
        <input
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif"
          className="field__input"
          disabled={dangTai}
          onChange={(e) => {
            const f = e.target.files?.[0]
            if (f) void chonTep(f)
            e.target.value = ''
          }}
        />
        <span className="btn btn--outline btn--sm">{dangTai ? 'Đang tải…' : giaTri ? 'Đổi ảnh' : 'Chọn ảnh tải lên'}</span>
      </label>
    </div>
  )
}
