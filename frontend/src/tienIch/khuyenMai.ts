import { khachHttp, moKhoiDuLieu } from "../nguon/apiClient";
import type { KetQuaTinhTongKm, PhanHoi } from "../nguon/kieu";

export const KHO_MA_KM = "redbus_ma_km";

export function luuMaKmSession(ma: string) {
  const s = ma.trim();
  if (s) sessionStorage.setItem(KHO_MA_KM, s);
  else sessionStorage.removeItem(KHO_MA_KM);
}

export function docMaKmSession(): string {
  return sessionStorage.getItem(KHO_MA_KM) ?? "";
}

export async function tinhTongKhuyenMai(
  maCode: string,
  dsGiaVe: number[],
): Promise<KetQuaTinhTongKm> {
  return moKhoiDuLieu(
    khachHttp.post<PhanHoi<KetQuaTinhTongKm>>("/khuyen-mai/tinh-tong", {
      maCode: maCode.trim(),
      dsGiaVe,
    }),
  );
}

export function mapGiaSauTheoMa(
  dsMa: number[],
  chiTiet?: { giaSauGiam?: number | string }[],
): Record<number, number> {
  const map: Record<number, number> = {};
  if (!chiTiet) return map;
  dsMa.forEach((ma, i) => {
    const g = chiTiet[i]?.giaSauGiam;
    if (g != null) map[ma] = Number(g);
  });
  return map;
}
