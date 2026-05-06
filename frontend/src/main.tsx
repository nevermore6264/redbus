import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { NhaCungCapThongBao } from './dinhDanh/boiCanhThongBao'
import { NhaCungCapNguoiDung } from './dinhDanh/boiCanhNguoiDung'
import { NhaCungCapModalXacThuc } from './dinhDanh/boiCanhModalXacThuc'
import { UngDung } from './ungDung'
import './style.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <NhaCungCapThongBao
        con={
          <NhaCungCapNguoiDung
            con={
              <NhaCungCapModalXacThuc con={<UngDung />} />
            }
          />
        }
      />
    </BrowserRouter>
  </StrictMode>,
)
