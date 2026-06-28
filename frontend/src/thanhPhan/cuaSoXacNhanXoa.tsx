import type { ReactNode } from 'react'
import { CuaSo } from './cuaSo'
import { NutBam } from './nutBam'

type Props = {
  open: boolean
  title: string
  onClose: () => void
  onConfirm: () => void
  dangXoa?: boolean
  nhanNutXoa?: string
  nhanDangTai?: string
  children: ReactNode
}

export function CuaSoXacNhanXoa({
  open,
  title,
  onClose,
  onConfirm,
  dangXoa = false,
  nhanNutXoa = 'Xóa',
  nhanDangTai = 'Đang xóa…',
  children,
}: Props) {
  return (
    <CuaSo
      open={open}
      title={title}
      size="sm"
      onClose={() => !dangXoa && onClose()}
      footer={
        <>
          <NutBam bien="huy" onClick={onClose} disabled={dangXoa} con="Hủy" />
          <NutBam
            bien="nguyHiem"
            onClick={() => void onConfirm()}
            disabled={dangXoa}
            con={dangXoa ? nhanDangTai : nhanNutXoa}
          />
        </>
      }
    >
      {children}
    </CuaSo>
  )
}
