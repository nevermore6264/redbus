import { useRef, useState } from 'react'
import { ImagePlus } from 'lucide-react'
import { guiMultipart, urlTaiNguyen } from '../nguon/apiClient'
import { NutBam } from './nutBam'

type DuongAnhUpload = { duongAnh: string }

type Props = {
  id?: string
  nhan?: string
  value: string
  onChange: (html: string) => void
  loi?: string
  required?: boolean
}

function capNhatOTextarea(ta: HTMLTextAreaElement, giaTriMoi: string, viTriChen: number, doDaiChen: number) {
  ta.value = giaTriMoi
  ta.focus()
  const conTro = viTriChen + doDaiChen
  ta.setSelectionRange(conTro, conTro)
}

function chenDoan(ta: HTMLTextAreaElement, doan: string, giaTri: string, onChange: (v: string) => void) {
  const start = ta.selectionStart
  const end = ta.selectionEnd
  const next = giaTri.slice(0, start) + doan + giaTri.slice(end)
  onChange(next)
  capNhatOTextarea(ta, next, start, doan.length)
}

function bocThe(
  ta: HTMLTextAreaElement,
  theMo: string,
  theDong: string,
  giaTri: string,
  onChange: (v: string) => void,
) {
  const start = ta.selectionStart
  const end = ta.selectionEnd
  const chon = giaTri.slice(start, end) || 'nội dung'
  const doan = `${theMo}${chon}${theDong}`
  const next = giaTri.slice(0, start) + doan + giaTri.slice(end)
  onChange(next)
  capNhatOTextarea(ta, next, start, doan.length)
}

export function TruongNoiDungHtml({
  id = 'noi-dung-html',
  nhan = 'Nội dung',
  value,
  onChange,
  loi,
  required,
}: Props) {
  const taRef = useRef<HTMLTextAreaElement>(null)
  const [tab, datTab] = useState<'soan' | 'xem'>('soan')
  const [dangTaiAnh, datDangTaiAnh] = useState(false)

  function layTa() {
    return taRef.current
  }

  async function chenAnhTuTep(tep: File) {
    const ta = layTa()
    if (!ta) return
    datDangTaiAnh(true)
    try {
      const fd = new FormData()
      fd.append('tep', tep)
      const kq = await guiMultipart<DuongAnhUpload>('/tin-tuc/upload-anh', fd)
      const src = urlTaiNguyen(kq.duongAnh)
      chenDoan(ta, `\n<p><img src="${src}" alt="" style="max-width:100%;height:auto;border-radius:8px" /></p>\n`, value, onChange)
    } finally {
      datDangTaiAnh(false)
    }
  }

  const lopField = `field html-editor${loi ? ' field--error' : ''}`

  return (
    <div className={lopField}>
      <div className="html-editor__head">
        <label className="field__label" htmlFor={id}>
          {nhan}
          {required ? <span className="field__req"> *</span> : null}
        </label>
        <div className="html-editor__tabs" role="tablist">
          <button
            type="button"
            role="tab"
            className={tab === 'soan' ? 'html-editor__tab html-editor__tab--active' : 'html-editor__tab'}
            aria-selected={tab === 'soan'}
            onClick={() => datTab('soan')}
          >
            Soạn HTML
          </button>
          <button
            type="button"
            role="tab"
            className={tab === 'xem' ? 'html-editor__tab html-editor__tab--active' : 'html-editor__tab'}
            aria-selected={tab === 'xem'}
            onClick={() => datTab('xem')}
          >
            Xem trước
          </button>
        </div>
      </div>
      <p className="muted small html-editor__hint">
        Hỗ trợ thẻ HTML: &lt;p&gt;, &lt;strong&gt;, &lt;em&gt;, &lt;h2&gt;, &lt;ul&gt;, &lt;a&gt;, &lt;img&gt;…
      </p>
      {tab === 'soan' ? (
        <>
          <div className="html-editor__toolbar">
            <NutBam bien="mo" type="button" className="btn--sm html-editor__tool" onClick={() => { const ta = layTa(); if (ta) bocThe(ta, '<strong>', '</strong>', value, onChange) }} con="B" />
            <NutBam bien="mo" type="button" className="btn--sm html-editor__tool" onClick={() => { const ta = layTa(); if (ta) bocThe(ta, '<em>', '</em>', value, onChange) }} con="I" />
            <NutBam bien="mo" type="button" className="btn--sm html-editor__tool" onClick={() => { const ta = layTa(); if (ta) chenDoan(ta, '<h2>', value, onChange) }} con="H2" />
            <NutBam bien="mo" type="button" className="btn--sm html-editor__tool" onClick={() => { const ta = layTa(); if (ta) chenDoan(ta, '<p>', value, onChange) }} con="P" />
            <NutBam bien="mo" type="button" className="btn--sm html-editor__tool" onClick={() => { const ta = layTa(); if (ta) chenDoan(ta, '<ul>\n<li>', value, onChange) }} con="List" />
            <NutBam bien="mo" type="button" className="btn--sm html-editor__tool" onClick={() => { const ta = layTa(); if (ta) chenDoan(ta, '<a href="https://">liên kết</a>', value, onChange) }} con="Link" />
            <label className="html-editor__img-btn">
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp,image/gif"
                hidden
                disabled={dangTaiAnh}
                onChange={(e) => {
                  const f = e.target.files?.[0]
                  if (f) void chenAnhTuTep(f)
                  e.target.value = ''
                }}
              />
              <span className="btn btn--ghost btn--sm html-editor__tool">
                <ImagePlus size={14} aria-hidden />
                {dangTaiAnh ? 'Đang tải…' : 'Ảnh'}
              </span>
            </label>
          </div>
          <textarea
            ref={taRef}
            id={id}
            className="field__input html-editor__area"
            rows={12}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="<p>Nội dung bài viết…</p>"
            spellCheck={false}
          />
        </>
      ) : (
        <div
          className="html-editor__preview article-body article-body--html"
          dangerouslySetInnerHTML={{ __html: value || '<p class="muted">Chưa có nội dung.</p>' }}
        />
      )}
      {loi ? <p className="field__error">{loi}</p> : null}
    </div>
  )
}
