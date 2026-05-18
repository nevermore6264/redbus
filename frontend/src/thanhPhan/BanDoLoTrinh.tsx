import { MapContainer, Marker, Polyline, Popup, TileLayer } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import type { DiemDungChan } from '../nguon/kieu'

type Props = {
  diemDi: string
  diemDen: string
  dsDiem: DiemDungChan[]
}

const VI_TRI_MAC_DINH: [number, number][] = [
  [10.7769, 106.7009],
  [10.8231, 106.6297],
  [16.0544, 108.2022],
  [21.0285, 105.8542],
]

function layToaDo(d: DiemDungChan, chiSo: number): [number, number] | null {
  if (d.viDo != null && d.kinhDo != null) {
    return [d.viDo, d.kinhDo]
  }
  return VI_TRI_MAC_DINH[chiSo % VI_TRI_MAC_DINH.length]
}

export function BanDoLoTrinh({ diemDi, diemDen, dsDiem }: Props) {
  const diemCoToaDo = dsDiem
    .map((d, i) => ({ d, toaDo: layToaDo(d, i) }))
    .filter((x): x is { d: DiemDungChan; toaDo: [number, number] } => x.toaDo != null)

  if (diemCoToaDo.length === 0) {
    return (
      <p className="muted small">
        Chưa có tọa độ điểm dừng — admin có thể bổ sung lat/lng khi quản lý điểm dừng.
      </p>
    )
  }

  const giua = diemCoToaDo[Math.floor(diemCoToaDo.length / 2)].toaDo

  return (
    <div className="route-map">
      <MapContainer center={giua} zoom={6} scrollWheelZoom={false} className="route-map__canvas">
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Polyline positions={diemCoToaDo.map((x) => x.toaDo)} color="#e11d48" weight={4} opacity={0.75} />
        {diemCoToaDo.map(({ d, toaDo }) => (
          <Marker key={d.ma} position={toaDo}>
            <Popup>
              <strong>{d.tenDiem}</strong>
              <br />
              Thứ tự: {d.thuTu ?? '—'}
            </Popup>
          </Marker>
        ))}
      </MapContainer>
      <p className="route-map__caption muted small">
        {diemDi} → {diemDen} ({diemCoToaDo.length} điểm trên bản đồ)
      </p>
    </div>
  )
}
