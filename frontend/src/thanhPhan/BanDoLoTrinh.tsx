import { useEffect, useMemo, useState } from 'react'
import L from 'leaflet'
import iconUrl from 'leaflet/dist/images/marker-icon.png'
import iconRetinaUrl from 'leaflet/dist/images/marker-icon-2x.png'
import shadowUrl from 'leaflet/dist/images/marker-shadow.png'
import { MapContainer, Marker, Polyline, Popup, TileLayer, useMap } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import type { DiemDungChan } from '../nguon/kieu'
import { layBanDoLoTrinh } from '../tienIch/diaDanh'
import { sapXepDiemDung } from '../tienIch/loTrinhTuyen'

type Props = {
  diemDi: string
  diemDen: string
  dsDiem: DiemDungChan[]
}

const iconMacDinh = L.icon({
  iconUrl,
  iconRetinaUrl,
  shadowUrl,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
})
L.Marker.prototype.options.icon = iconMacDinh

function chuanHoaToaDo(viDo: number, kinhDo: number): [number, number] {
  const hopLe = (lat: number, lng: number) => lat >= 8 && lat <= 24 && lng >= 102 && lng <= 110
  if (hopLe(viDo, kinhDo)) return [viDo, kinhDo]
  if (hopLe(kinhDo, viDo)) return [kinhDo, viDo]
  return [viDo, kinhDo]
}

function FitBounds({ points }: { points: [number, number][] }) {
  const map = useMap()
  useEffect(() => {
    if (points.length === 0) return
    if (points.length === 1) {
      map.setView(points[0], 9)
      return
    }
    map.fitBounds(L.latLngBounds(points), { padding: [36, 36] })
  }, [map, points])
  return null
}

export function BanDoLoTrinh({ diemDi, diemDen, dsDiem }: Props) {
  const [diem, datDiem] = useState<{ ten: string; toaDo: [number, number] }[]>([])
  const [tai, datTai] = useState(true)
  const [loi, datLoi] = useState<string | null>(null)

  const dsDiemSap = useMemo(() => sapXepDiemDung(dsDiem), [dsDiem])
  const khoaYeuCau = `${diemDi}|${diemDen}|${dsDiemSap.map((d) => `${d.ma}:${d.viDo}:${d.kinhDo}`).join(',')}`

  useEffect(() => {
    let huy = false
    datTai(true)
    datLoi(null)
    void (async () => {
      try {
        const kq = await layBanDoLoTrinh(
          diemDi,
          diemDen,
          dsDiemSap.map((d) => ({
            tenDiem: d.tenDiem,
            viDo: d.viDo,
            kinhDo: d.kinhDo,
          })),
        )
        if (huy) return
        const pts = (kq.diem ?? []).map((d) => ({
          ten: d.ten,
          toaDo: chuanHoaToaDo(d.viDo, d.kinhDo),
        }))
        datDiem(pts)
        if (pts.length < 2) {
          datLoi('Không xác định đủ tọa độ lộ trình')
        }
      } catch (e: unknown) {
        if (!huy) {
          datDiem([])
          datLoi(e instanceof Error ? e.message : 'Không tải được bản đồ lộ trình')
        }
      } finally {
        if (!huy) datTai(false)
      }
    })()
    return () => {
      huy = true
    }
  }, [khoaYeuCau, diemDi, diemDen, dsDiemSap])

  const viTri = useMemo(() => diem.map((d) => d.toaDo), [diem])
  const tam = viTri[Math.floor(viTri.length / 2)] ?? [16.0, 108.0]

  if (tai) {
    return <p className="route-map__loading muted small">Đang tra cứu tọa độ lộ trình…</p>
  }

  if (loi || viTri.length < 2) {
    return <p className="muted small">{loi ?? 'Chưa hiển thị được bản đồ cho tuyến này.'}</p>
  }

  return (
    <div className="route-map">
      <MapContainer
        key={khoaYeuCau}
        center={tam}
        zoom={7}
        scrollWheelZoom={false}
        className="route-map__canvas"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <FitBounds points={viTri} />
        <Polyline positions={viTri} color="#e11d48" weight={4} opacity={0.8} />
        {diem.map((d, i) => (
          <Marker key={`${d.ten}-${i}`} position={d.toaDo}>
            <Popup>
              <strong>{d.ten}</strong>
              {i === 0 ? (
                <>
                  <br />
                  <span className="muted">Điểm đi</span>
                </>
              ) : null}
              {i === diem.length - 1 ? (
                <>
                  <br />
                  <span className="muted">Điểm đến</span>
                </>
              ) : null}
            </Popup>
          </Marker>
        ))}
      </MapContainer>
      <p className="route-map__caption muted small">
        {diemDi} → {diemDen} ({diem.length} điểm trên bản đồ)
      </p>
    </div>
  )
}
