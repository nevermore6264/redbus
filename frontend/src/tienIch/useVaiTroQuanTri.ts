import { dungNguoiDung } from '../dinhDanh/boiCanhNguoiDung'

export function useVaiTroQuanTri() {
  const { nguoiDung } = dungNguoiDung()
  const vaiTro = nguoiDung?.vaiTro
  return {
    laAdmin: vaiTro === 'ADMIN',
    laStaff: vaiTro === 'STAFF',
    laQuanTri: vaiTro === 'ADMIN' || vaiTro === 'STAFF',
  }
}
