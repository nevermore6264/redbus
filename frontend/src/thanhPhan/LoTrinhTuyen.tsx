import type { DiemDungChan, TuyenDuong } from '../nguon/kieu'
import { sapXepDiemDung, taoDanhSachLoTrinh } from '../tienIch/loTrinhTuyen'

type TuyenGocDen = Pick<TuyenDuong, 'diemDi' | 'diemDen'>

interface Props {
  tuyen: TuyenGocDen
  diemDung?: DiemDungChan[]
  kieu?: 'chuoi' | 'dong' | 'timeline'
  className?: string
}

export function LoTrinhTuyen({ tuyen, diemDung = [], kieu = 'dong', className }: Props) {
  const buoc = taoDanhSachLoTrinh(tuyen, diemDung)
  const dung = sapXepDiemDung(diemDung)

  if (kieu === 'chuoi') {
    return <span className={className}>{buoc.join(' → ')}</span>
  }

  if (kieu === 'dong') {
    return (
      <span className={`lo-trinh-dong ${className ?? ''}`.trim()}>
        {buoc.map((ten, i) => (
          <span key={`${ten}-${i}`} className="lo-trinh-dong__buoc">
            {i > 0 ? (
              <span className="lo-trinh-dong__moc" aria-hidden>
                →
              </span>
            ) : null}
            <span
              className={
                i === 0
                  ? 'lo-trinh-dong__di'
                  : i === buoc.length - 1
                    ? 'lo-trinh-dong__den'
                    : 'lo-trinh-dong__dung'
              }
            >
              {ten}
            </span>
          </span>
        ))}
      </span>
    )
  }

  return (
    <ol className={`lo-trinh-timeline ${className ?? ''}`.trim()}>
      <li className="lo-trinh-timeline__buoc lo-trinh-timeline__buoc--di">
        <span className="lo-trinh-timeline__ten">{tuyen.diemDi}</span>
        <span className="lo-trinh-timeline__mo-ta muted">Điểm đi</span>
      </li>
      {dung.map((d) => (
        <li key={d.ma} className="lo-trinh-timeline__buoc lo-trinh-timeline__buoc--dung">
          <span className="lo-trinh-timeline__ten">{d.tenDiem}</span>
          {d.thoiGianDungPhut != null ? (
            <span className="lo-trinh-timeline__mo-ta muted">Dừng ~{d.thoiGianDungPhut} phút</span>
          ) : (
            <span className="lo-trinh-timeline__mo-ta muted">Điểm dừng</span>
          )}
        </li>
      ))}
      <li className="lo-trinh-timeline__buoc lo-trinh-timeline__buoc--den">
        <span className="lo-trinh-timeline__ten">{tuyen.diemDen}</span>
        <span className="lo-trinh-timeline__mo-ta muted">Điểm đến</span>
      </li>
    </ol>
  )
}
