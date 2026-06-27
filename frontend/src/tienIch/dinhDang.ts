export function dinhDangVnd(gia: number | string | undefined): string {
  const x = Number(gia ?? 0);
  if (Number.isNaN(x)) return "—";
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(x);
}

const RE_LOCAL_DT = /^(\d{4})-(\d{2})-(\d{2})[T ](\d{2}):(\d{2})/;

function parseGioDiaPhuong(chuoi: string): Date | null {
  const m = chuoi.match(RE_LOCAL_DT);
  if (!m) return null;
  return new Date(
    Number(m[1]),
    Number(m[2]) - 1,
    Number(m[3]),
    Number(m[4]),
    Number(m[5]),
  );
}

export function datetimeLocalSangApi(value: string): string {
  if (!value) return value;
  return value.length === 16 ? `${value}:00` : value.slice(0, 19);
}

export function apiSangDatetimeLocal(value: string | undefined): string {
  if (!value) return "";
  const m = value.match(/^(\d{4}-\d{2}-\d{2}T\d{2}:\d{2})/);
  return m ? m[1] : "";
}

export function gioHienTaiDatetimeLocal(): string {
  const d = new Date();
  const p = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}T${p(d.getHours())}:${p(d.getMinutes())}`;
}

export function ngayHienTai(): string {
  const d = new Date();
  const p = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`;
}

export function dinhDangNgayGio(chuoiIso: string | undefined): string {
  if (!chuoiIso) return "—";
  const d = parseGioDiaPhuong(chuoiIso) ?? new Date(chuoiIso);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleString("vi-VN", {
    weekday: "short",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}
