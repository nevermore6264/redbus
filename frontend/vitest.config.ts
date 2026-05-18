import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'node',
    include: ['src/**/*.test.ts'],
    coverage: {
      provider: 'v8',
      include: [
        'src/tienIch/trangThai.ts',
        'src/tienIch/kiemTraQuanTri.ts',
        'src/tienIch/rutGonDiaDanh.ts',
        'src/tienIch/soDoGhe.ts',
        'src/tienIch/loTrinhTuyen.ts',
      ],
      thresholds: {
        lines: 100,
        functions: 100,
        branches: 100,
        statements: 100,
      },
    },
  },
})
