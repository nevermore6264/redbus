import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ComposedChart,
  Legend,
  Line,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import type { BaoCaoBieuDoPhanHoi } from '../../nguon/kieu'
import { dinhDangVnd } from '../../tienIch/dinhDang'
import { TheChua } from '../theChua'

const MAU_BIEU_DO = ['#e11d48', '#2563eb', '#16a34a', '#d97706', '#7c3aed', '#0891b2', '#64748b']

function so(val: number | string | undefined | null): number {
  if (val == null) return 0
  const n = typeof val === 'number' ? val : Number(val)
  return Number.isFinite(n) ? n : 0
}

function TooltipTuyChinh({
  active,
  payload,
  label,
}: {
  active?: boolean
  payload?: { name?: string; value?: number; color?: string; dataKey?: string }[]
  label?: string
}) {
  if (!active || !payload?.length) return null
  return (
    <div className="report-chart-tooltip">
      {label ? <p className="report-chart-tooltip__label">{label}</p> : null}
      <ul>
        {payload.map((p) => (
          <li key={p.dataKey ?? p.name}>
            <span className="report-chart-tooltip__dot" style={{ background: p.color }} />
            {p.name}:{' '}
            {p.dataKey === 'doanhThu'
              ? dinhDangVnd(p.value ?? 0)
              : (p.value ?? 0).toLocaleString('vi-VN')}
          </li>
        ))}
      </ul>
    </div>
  )
}

type Props = {
  duLieu: BaoCaoBieuDoPhanHoi | null
  dangTai: boolean
}

export function BieuDoBaoCao({ duLieu, dangTai }: Props) {
  const doanhThu = (duLieu?.doanhThuTheoNgay ?? []).map((m) => ({
    ngay: m.nhan,
    doanhThu: so(m.giaTri),
    soVe: so(m.soLuong),
  }))

  const trangThai = (duLieu?.trangThaiVe ?? []).map((m) => ({
    ten: m.nhan,
    soLuong: so(m.soLuong),
  }))

  const phuongThuc = (duLieu?.phuongThucThanhToan ?? []).map((m) => ({
    ten: m.nhan,
    soVe: so(m.soLuong),
    doanhThu: so(m.giaTri),
  }))

  const topTuyen = (duLieu?.topTuyenTheoVe ?? []).map((m) => ({
    tuyen: m.nhan,
    soVe: so(m.soLuong),
    doanhThu: so(m.giaTri),
  }))

  const danhGia = (duLieu?.phanBoDanhGia ?? []).map((m) => ({
    sao: m.nhan,
    soLuong: so(m.soLuong),
  }))

  if (dangTai && !duLieu) {
    return (
      <div className="report-charts">
        {Array.from({ length: 4 }).map((_, i) => (
          <TheChua key={`chart-sk-${i}`} padding="lg" className="report-chart-card report-chart-card--skel">
            <span className="report-kpi-skel__line" style={{ width: '40%', height: 18 }} />
            <span className="report-kpi-skel__line" style={{ width: '100%', height: 220, marginTop: 16 }} />
          </TheChua>
        ))}
      </div>
    )
  }

  if (!duLieu) return null

  return (
    <div className="report-charts">
      <TheChua padding="lg" className="report-chart-card report-chart-card--wide">
        <h2 className="report-panel-card__title">Doanh thu 7 ngày gần nhất</h2>
        <p className="report-panel-card__sub">Cột: doanh thu theo ngày · Đường: số vé đã thanh toán</p>
        {doanhThu.some((d) => d.doanhThu > 0 || d.soVe > 0) ? (
          <div className="report-chart-wrap">
            <ResponsiveContainer width="100%" height={280}>
              <ComposedChart data={doanhThu} margin={{ top: 8, right: 12, left: 4, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                <XAxis dataKey="ngay" tick={{ fontSize: 12 }} />
                <YAxis
                  yAxisId="left"
                  tick={{ fontSize: 11 }}
                  tickFormatter={(v) => (v >= 1_000_000 ? `${Math.round(v / 1_000_000)}tr` : String(v))}
                />
                <YAxis yAxisId="right" orientation="right" allowDecimals={false} tick={{ fontSize: 11 }} />
                <Tooltip content={<TooltipTuyChinh />} />
                <Legend />
                <Bar yAxisId="left" dataKey="doanhThu" name="Doanh thu" fill="#e11d48" radius={[6, 6, 0, 0]} maxBarSize={48} />
                <Line yAxisId="right" type="monotone" dataKey="soVe" name="Số vé" stroke="#2563eb" strokeWidth={2.5} dot={{ r: 4 }} />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <p className="muted report-panel-empty">Chưa có doanh thu trong 7 ngày qua.</p>
        )}
      </TheChua>

      <TheChua padding="lg" className="report-chart-card">
        <h2 className="report-panel-card__title">Trạng thái vé</h2>
        <p className="report-panel-card__sub">Phân bổ toàn bộ vé trong hệ thống</p>
        {trangThai.length > 0 ? (
          <div className="report-chart-wrap report-chart-wrap--pie">
            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <Pie data={trangThai} dataKey="soLuong" nameKey="ten" cx="50%" cy="50%" innerRadius={52} outerRadius={88} paddingAngle={2}>
                  {trangThai.map((_, i) => (
                    <Cell key={i} fill={MAU_BIEU_DO[i % MAU_BIEU_DO.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(v) => [Number(v ?? 0).toLocaleString('vi-VN'), 'Số vé']} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <p className="muted report-panel-empty">Chưa có dữ liệu vé.</p>
        )}
      </TheChua>

      <TheChua padding="lg" className="report-chart-card">
        <h2 className="report-panel-card__title">Phương thức thanh toán</h2>
        <p className="report-panel-card__sub">Số vé đã thanh toán theo hình thức</p>
        {phuongThuc.length > 0 ? (
          <div className="report-chart-wrap">
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={phuongThuc} layout="vertical" margin={{ top: 4, right: 16, left: 8, bottom: 4 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" horizontal={false} />
                <XAxis type="number" allowDecimals={false} tick={{ fontSize: 11 }} />
                <YAxis type="category" dataKey="ten" width={100} tick={{ fontSize: 11 }} />
                <Tooltip formatter={(v) => [Number(v ?? 0).toLocaleString('vi-VN'), 'Số vé']} />
                <Bar dataKey="soVe" name="Số vé" fill="#16a34a" radius={[0, 6, 6, 0]} maxBarSize={28} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <p className="muted report-panel-empty">Chưa có giao dịch thanh toán.</p>
        )}
      </TheChua>

      <TheChua padding="lg" className="report-chart-card">
        <h2 className="report-panel-card__title">Top tuyến theo vé bán</h2>
        <p className="report-panel-card__sub">5 tuyến có nhiều vé đã thanh toán nhất</p>
        {topTuyen.length > 0 ? (
          <div className="report-chart-wrap">
            <ResponsiveContainer width="100%" height={Math.max(200, topTuyen.length * 52)}>
              <BarChart data={topTuyen} layout="vertical" margin={{ top: 4, right: 16, left: 8, bottom: 4 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" horizontal={false} />
                <XAxis type="number" allowDecimals={false} tick={{ fontSize: 11 }} />
                <YAxis type="category" dataKey="tuyen" width={120} tick={{ fontSize: 10 }} />
                <Tooltip
                  formatter={(v, name) =>
                    name === 'doanhThu'
                      ? [dinhDangVnd(Number(v ?? 0)), 'Doanh thu']
                      : [Number(v ?? 0).toLocaleString('vi-VN'), 'Số vé']
                  }
                />
                <Legend />
                <Bar dataKey="soVe" name="Số vé" fill="#2563eb" radius={[0, 4, 4, 0]} maxBarSize={22} />
                <Bar dataKey="doanhThu" name="Doanh thu" fill="#e11d48" radius={[0, 4, 4, 0]} maxBarSize={22} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <p className="muted report-panel-empty">Chưa có vé theo tuyến.</p>
        )}
      </TheChua>

      <TheChua padding="lg" className="report-chart-card report-chart-card--wide">
        <h2 className="report-panel-card__title">Phân bổ đánh giá</h2>
        <p className="report-panel-card__sub">Số lượt đánh giá theo mức sao</p>
        {danhGia.length > 0 ? (
          <div className="report-chart-wrap">
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={danhGia} margin={{ top: 8, right: 12, left: 4, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                <XAxis dataKey="sao" tick={{ fontSize: 12 }} />
                <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
                <Tooltip formatter={(v) => [Number(v ?? 0).toLocaleString('vi-VN'), 'Lượt']} />
                <Bar dataKey="soLuong" name="Lượt đánh giá" fill="#d97706" radius={[6, 6, 0, 0]} maxBarSize={56} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <p className="muted report-panel-empty">Chưa có đánh giá nào.</p>
        )}
      </TheChua>
    </div>
  )
}
