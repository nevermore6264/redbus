import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { AlertCircle, CheckCircle2, Info, X } from 'lucide-react'

export type LoaiThongBao = 'thanhCong' | 'loi' | 'thongTin'

type NutThongBao = { loai: LoaiThongBao; noiDung: string }

export type GiaTriThongBao = {
  thongBao: (NutThongBao & { ma: number }) | null
  hienThi: (n: NutThongBao) => void
  anDi: () => void
}

const BoiCanhThongBao = createContext<GiaTriThongBao | undefined>(undefined)

export function NhaCungCapThongBao({ con }: { con: ReactNode }) {
  const [thongBao, datTb] = useState<(NutThongBao & { ma: number }) | null>(null)

  const anDi = useCallback(() => datTb(null), [])

  const hienThi = useCallback((n: NutThongBao) => {
    const ma = Date.now()
    datTb({ ma, ...n })
    window.setTimeout(() => datTb((t) => (t?.ma === ma ? null : t)), 4500)
  }, [])

  const giaTri = useMemo(() => ({ thongBao, hienThi, anDi }), [thongBao, hienThi, anDi])

  return (
    <BoiCanhThongBao.Provider value={giaTri}>
      {con}
      {thongBao && (
        <div
          className={`toast toast--${thongBao.loai === 'thanhCong' ? 'success' : thongBao.loai === 'thongTin' ? 'info' : 'error'}`}
          role="status"
        >
          {thongBao.loai === 'thanhCong' ? (
            <CheckCircle2 size={26} strokeWidth={2.25} aria-hidden />
          ) : thongBao.loai === 'thongTin' ? (
            <Info size={26} strokeWidth={2.25} aria-hidden />
          ) : (
            <AlertCircle size={26} strokeWidth={2.25} aria-hidden />
          )}
          <span className="toast__msg">{thongBao.noiDung}</span>
          <button type="button" className="toast__close" onClick={anDi} aria-label="Dong">
            <X size={20} strokeWidth={2.25} />
          </button>
        </div>
      )}
    </BoiCanhThongBao.Provider>
  )
}

export function dungThongBao() {
  const v = useContext(BoiCanhThongBao)
  if (!v) throw new Error('dungThongBao: thieu NhaCungCapThongBao')
  return v
}
