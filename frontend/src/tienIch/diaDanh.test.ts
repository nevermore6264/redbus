import { describe, expect, it } from 'vitest'
import { taoChuoiDiaDanh } from './diaDanh'
import type { DonViHanhChinh } from '../nguon/kieu'

function dv(name: string, code: number): DonViHanhChinh {
  return { code, name, division_type: 'tinh', codename: 'x' }
}

describe('taoChuoiDiaDanh', () => {
  it('ghép tên xã và tỉnh', () => {
    expect(taoChuoiDiaDanh(dv('Hà Nội', 1), dv('Ba Đình', 2))).toBe('Ba Đình, Hà Nội')
  })
})
