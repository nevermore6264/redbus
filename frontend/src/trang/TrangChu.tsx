import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { dungModalXacThuc } from '../dinhDanh/boiCanhModalXacThuc'
import {
  ArrowRight,
  Bus,
  Check,
  CheckCircle2,
  Clock,
  Code2,
  Coffee,
  Cpu,
  CreditCard,
  Database,
  Headphones,
  Layers,
  MapPin,
  Newspaper,
  Shield,
  ShieldCheck,
  Smartphone,
  Sparkles,
  Star,
  Ticket,
  Wifi,
  Zap,
} from 'lucide-react'
import { khachHttp, moKhoiDuLieu } from '../nguon/apiClient'
import type { KhuyenMai, PhanHoi, TinTuc, TuyenDuong } from '../nguon/kieu'
import { TheChua } from '../thanhPhan/theChua'
import { dinhDangNgayGio } from '../tienIch/dinhDang'
import { useKhoiHienKhiCuon } from '../tienIch/useKhoiHienKhiCuon'
import { useDemSoKhiHien } from '../tienIch/useDemSoKhiHien'

const DANH_GIA_MAU = [
  {
    ten: 'Minh Anh',
    tuyen: 'Đà Nẵng → Huế',
    sao: 5,
    loi: 'Đặt vé nhanh, thấy rõ ghế còn trống. Nhắc chuyến qua thông báo trong app rất tiện.',
  },
  {
    ten: 'Tuấn Đạt',
    tuyen: 'TP.HCM → Đà Lạt',
    sao: 5,
    loi: 'Giao diện dễ hiểu, giá hiện ngay trên chuyến. Thanh toán xong là có vé trong tài khoản.',
  },
  {
    ten: 'Thu Hà',
    tuyen: 'Hà Nội — Ninh Bình',
    sao: 4,
    loi: 'Lần đầu đặt online mà không phải gọi tổng đài. Mong thêm nhiều tuyến trên hệ thống.',
  },
]

const CAU_HOI = [
  {
    h: 'Tôi có thể hủy vé sau khi đặt không?',
    d: 'Vé ở trạng thái chờ thanh toán có thể hủy theo nút trên trang « Vé của tôi ». Sau khi đã thanh toán, áp dụng chính sách của từng nhà xe (hiển thị trên hệ thống).',
  },
  {
    h: 'Thanh toán bằng cách nào?',
    d: 'Hệ thống hỗ trợ thanh toán tiền mặt tại quầy và các hình thức được cấu hình (ví dụ chuyển khoản). Chi tiết hiển thị bước thanh toán khi bạn chọn vé.',
  },
  {
    h: 'Làm sao biết ghế nào còn trống?',
    d: 'Sau khi chọn chuyến, sơ đồ xe hiển thị ghế trống, ghế đã đặt và ghế bạn đang chọn — cập nhật theo thời gian thực cho chuyến đó.',
  },
  {
    h: 'RedBus có phải nhà xe không?',
    d: 'RedBus là nền tảng đặt vé kết nối hành khách với lịch chạy; vận hành chuyến do đơn vị vận tải đối tác phụ trách.',
  },
]

const SO_SANH = [
  { tieuChi: 'Xem giá & giờ chạy trước khi đặt', redbus: true, truyenThong: false },
  { tieuChi: 'Chọn ghế trực tiếp trên sơ đồ', redbus: true, truyenThong: false },
  { tieuChi: 'Theo dõi vé & thông báo trong tài khoản', redbus: true, truyenThong: false },
  { tieuChi: 'Áp dụng mã khuyến mãi khi thanh toán', redbus: true, truyenThong: true },
  { tieuChi: 'Đặt qua tổng đài / bến', redbus: false, truyenThong: true },
]

export function TrangChu() {
  const { moDangNhap, moDangKy } = dungModalXacThuc()
  const [tin, datTin] = useState<TinTuc[]>([])
  const [km, datKm] = useState<KhuyenMai[]>([])
  const [dsTuyen, datDsTuyen] = useState<TuyenDuong[]>([])

  const refKhoi = useKhoiHienKhiCuon([tin.length, km.length, dsTuyen.length])
  const soTuyenHt = Math.max(dsTuyen.length, 1)
  const mucDemTuyen = Math.min(soTuyenHt * 15 + 24, 999)
  const demTuyen = useDemSoKhiHien(mucDemTuyen)
  const demPhut = useDemSoKhiHien(4)
  const demPhanTram = useDemSoKhiHien(98)

  useEffect(() => {
    void (async () => {
      try {
        const [a, b, c] = await Promise.all([
          moKhoiDuLieu(khachHttp.get<PhanHoi<TinTuc[]>>('/tin-tuc', { params: { gioiHan: 6 } })),
          moKhoiDuLieu(khachHttp.get<PhanHoi<KhuyenMai[]>>('/khuyen-mai/hien-thi')),
          moKhoiDuLieu(khachHttp.get<PhanHoi<TuyenDuong[]>>('/tuyen-duong')),
        ])
        datTin(a)
        datKm(b)
        datDsTuyen(c)
      } catch {
        /* ignore */
      }
    })()
  }, [])

  const chuoiMarquee =
    'Đặt vé online · Minh bạch giá · Chọn ghế trực quan · Thông báo tức thì · Ưu đãi mã khuyến mãi · An toàn thanh toán ·'

  return (
    <div className="home">
      <section className="hero-band hero-band--split hero-band--motion">
        <div className="hero-band__noise" aria-hidden />
        <div className="hero-band__orb hero-band__orb--1" aria-hidden />
        <div className="hero-band__orb hero-band__orb--2" aria-hidden />
        <div className="hero-band__glow hero-band__glow--a" aria-hidden />
        <div className="hero-band__glow hero-band__glow--b" aria-hidden />
        <div className="container hero-band__grid">
          <div className="hero-band__copy">
            <p className="eyebrow hero-fade hero-fade--1">
              <Sparkles size={14} className="hero-spark" /> Full-stack · REST API · JWT · Phân quyền vai trò
            </p>
            <h1 className="hero-title hero-fade hero-fade--2">
              Đặt vé online — chọn ghế, thanh toán, nhận thông báo tức thì
            </h1>
            <p className="hero-lead hero-fade hero-fade--3">
              Tra cứu tuyến, chọn chuyến và ghế ngồi trực tiếp trên web — giá và lịch khởi hành hiển thị rõ, vé và
              thông báo được quản lý tập trung trong tài khoản của bạn.
            </p>
            <div className="hero-cta hero-fade hero-fade--4">
              <Link className="btn btn--primary btn--lg hero-btn-pulse" to="/dat-ve">
                Đặt vé ngay
                <ArrowRight size={18} />
              </Link>
              <button
                type="button"
                className="btn btn--outline btn--lg hero-cta__ghost"
                onClick={() => moDangNhap()}
              >
                Đăng nhập
              </button>
            </div>
            <ul className="hero-trust hero-fade hero-fade--5">
              <li>
                <CheckCircle2 size={16} /> Không phí ẩn — giá hiển thị rõ trên chuyến
              </li>
              <li>
                <CheckCircle2 size={16} /> Có thể hủy vé khi chưa thanh toán (theo chính sách hiển thị trên hệ thống)
              </li>
            </ul>
          </div>
          <div className="hero-band__panel hero-fade hero-fade--6" aria-hidden>
            <div className="hero-mock">
              <div className="hero-mock__route">
                <span className="hero-mock__dot hero-pulse" />
                <div className="hero-mock__line hero-line-flow" />
                <MapPin size={20} className="hero-mock__pin hero-pin-swing" />
              </div>
              <div className="hero-mock__card hero-mock__card--float hero-card-a">
                <Bus size={18} />
                <div>
                  <strong>Chuyến trong ngày</strong>
                  <span className="muted small">Ghế còn trống theo thời gian thực</span>
                </div>
              </div>
              <div className="hero-mock__card hero-mock__card--accent hero-card-b">
                <Ticket size={18} />
                <div>
                  <strong>Vé điện tử</strong>
                  <span className="muted small">Theo dõi trong mục &quot;Vé của tôi&quot;</span>
                </div>
              </div>
              <div className="hero-mock__badge hero-badge-pop">
                <Zap size={14} /> Ưu đãi khi có mã khuyến mãi
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="home-marquee" aria-hidden>
        <div className="home-marquee__inner">
          <span>{chuoiMarquee}</span>
          <span>{chuoiMarquee}</span>
        </div>
      </div>

      <div ref={refKhoi}>
      <section className="home-metrics">
        <div className="container home-metrics__grid">
          <div className="home-metric home-reveal" ref={demTuyen.ref}>
            <span className="home-metric__value">
              {demTuyen.giaTri}
              <small>+</small>
            </span>
            <span className="home-metric__unit">tuyến &amp; chuyến được đồng bộ</span>
            <p className="home-metric__hint">Số liệu minh họa trên nền tảng — cập nhật theo dữ liệu thực tế.</p>
          </div>
          <div className="home-metric home-reveal" ref={demPhut.ref}>
            <span className="home-metric__value home-metric__value--sm">
              {demPhut.giaTri}
              <small> phút</small>
            </span>
            <span className="home-metric__unit">trung bình hoàn tất đặt vé</span>
            <p className="home-metric__hint">Từ lúc chọn tuyến đến xác nhận vé chờ thanh toán.</p>
          </div>
          <div className="home-metric home-reveal" ref={demPhanTram.ref}>
            <span className="home-metric__value">
              {demPhanTram.giaTri}
              <small>%</small>
            </span>
            <span className="home-metric__unit">hành khách đánh giá hài lòng</span>
            <p className="home-metric__hint">Khảo sát nội bộ &amp; phản hồi sau chuyến (minh họa).</p>
          </div>
          <div className="home-metric home-metric--accent home-reveal">
            <span className="home-metric__icon-wrap">
              <Clock size={28} />
            </span>
            <span className="home-metric__unit home-metric__unit--lg">Đặt vé 24/7</span>
            <p className="home-metric__hint">Không giới hạn giờ — chỉ cần còn ghế trên chuyến.</p>
          </div>
        </div>
      </section>

        <section className="home-stats">
          <div className="container home-stats__inner">
            <div className="home-stat home-reveal">
              <span className="home-stat__icon">
                <Clock size={22} />
              </span>
              <strong className="home-stat__title">Lịch chạy minh bạch</strong>
              <span className="home-stat__sub">Giờ khởi hành, giá vé, trạng thái chuyến</span>
            </div>
            <div className="home-stat home-reveal">
              <span className="home-stat__icon">
                <Smartphone size={22} />
              </span>
              <strong className="home-stat__title">Đặt vé mọi lúc</strong>
              <span className="home-stat__sub">Điện thoại hay máy tính — giao diện responsive</span>
            </div>
            <div className="home-stat home-reveal">
              <span className="home-stat__icon">
                <ShieldCheck size={22} />
              </span>
              <strong className="home-stat__title">Đăng nhập an toàn</strong>
              <span className="home-stat__sub">Khách · nhân viên · quản trị — khu vực riêng</span>
            </div>
            <div className="home-stat home-reveal">
              <span className="home-stat__icon">
                <Headphones size={22} />
              </span>
              <strong className="home-stat__title">Tin tức &amp; thông báo</strong>
              <span className="home-stat__sub">Ưu đãi, nhắc chuyến, đánh giá sau đi</span>
            </div>
          </div>
        </section>

        <section className="home-tech">
          <div className="container">
            <div className="section-head home-reveal">
              <h2 className="section-title">Kiến trúc &amp; công nghệ</h2>
              <p className="section-desc">
                Hệ thống minh họa luồng đặt vé end-to-end: giao diện khách hàng, API nghiệp vụ, quản trị và báo cáo —
                phù hợp trình bày trong báo cáo đồ án.
              </p>
            </div>
            <div className="home-tech__bento">
              <article className="home-tech__card home-tech__card--wide home-reveal">
                <div className="home-tech__card-head">
                  <span className="home-tech__icon">
                    <Layers size={22} aria-hidden />
                  </span>
                  <h3>Kiến trúc nhiều lớp</h3>
                </div>
                <p>
                  React (Vite) gọi REST API Spring Boot; phân tách khách · nhân viên · quản trị; dữ liệu qua lớp service
                  và persistence mapper — dễ giải thích trong luận văn.
                </p>
              </article>
              <article className="home-tech__card home-reveal">
                <div className="home-tech__card-head">
                  <span className="home-tech__icon">
                    <Shield size={22} aria-hidden />
                  </span>
                  <h3>Xác thực JWT</h3>
                </div>
                <p>Đăng nhập có token; một số thao tác yêu cầu đúng vai trò (CUSTOMER / STAFF / ADMIN).</p>
              </article>
              <article className="home-tech__card home-reveal">
                <div className="home-tech__card-head">
                  <span className="home-tech__icon">
                    <Database size={22} aria-hidden />
                  </span>
                  <h3>Cơ sở dữ liệu</h3>
                </div>
                <p>Thiết kế quan hệ cho tuyến, xe, chuyến, ghế, vé và thanh toán — truy vấn có kiểm soát.</p>
              </article>
              <article className="home-tech__card home-reveal">
                <div className="home-tech__card-head">
                  <span className="home-tech__icon">
                    <Code2 size={22} aria-hidden />
                  </span>
                  <h3>API nghiệp vụ</h3>
                </div>
                <p>Đặt vé, khóa ghế, khuyến mãi, tin tức, báo cáo doanh thu — endpoint rõ ràng cho demo &amp; slide.</p>
              </article>
              <article className="home-tech__card home-reveal">
                <div className="home-tech__card-head">
                  <span className="home-tech__icon">
                    <Cpu size={22} aria-hidden />
                  </span>
                  <h3>Giao diện hiện đại</h3>
                </div>
                <p>UI responsive, animation có chừng mực, trạng thái tải &amp; thông báo — trải nghiệm trình chiếu tốt.</p>
              </article>
            </div>
          </div>
        </section>

        <section className="container section section--tight">
          <div className="section-head home-reveal">
            <h2 className="section-title">Vì sao chọn RedBus?</h2>
            <p className="section-desc">
              Một luồng rõ ràng cho nhà xe và hành khách: ghế, vé, thanh toán và báo cáo trên cùng nền tảng.
            </p>
          </div>
          <div className="grid-3 home-feature-grid">
            <article className="feature-card feature-card--lift home-reveal">
              <div className="feature-card__icon">
                <Bus size={22} />
              </div>
              <h3>Sơ đồ ghế trực quan</h3>
              <p>
                Ghế trống / đã đặt hiển thị rõ — chọn đúng chỗ ngồi trước khi xác nhận, dữ liệu theo từng chuyến.
              </p>
              <ul className="home-mini-tags">
                <li>
                  <Wifi size={14} /> Trạng thái thời gian thực
                </li>
                <li>
                  <Coffee size={14} /> Tiện ích xe (nếu nhà xe khai báo)
                </li>
              </ul>
            </article>
            <article className="feature-card feature-card--lift home-reveal">
              <div className="feature-card__icon">
                <CreditCard size={22} />
              </div>
              <h3>Thanh toán &amp; khuyến mãi</h3>
              <p>
                Nhập mã giảm giá khi thanh toán; tiền mặt tại quầy và các hình thức được cấu hình. Giao dịch gắn với
                vé để đối soát.
              </p>
              <ul className="home-mini-tags">
                <li>Lịch sử thanh toán theo vé</li>
                <li>Nhiều hình thức thanh toán</li>
              </ul>
            </article>
            <article className="feature-card feature-card--lift home-reveal">
              <div className="feature-card__icon">
                <Shield size={22} />
              </div>
              <h3>Vận hành có kiểm soát</h3>
              <p>
                Khách đặt vé; nhân viên và quản trị quản lý tuyến, xe, khuyến mãi, tin tức và báo cáo — đúng vai trò,
                đúng dữ liệu.
              </p>
              <ul className="home-mini-tags">
                <li>
                  <UsersMini /> Phân quyền rõ ràng
                </li>
              </ul>
            </article>
          </div>
        </section>

        {dsTuyen.length > 0 ? (
          <section className="home-routes-section">
            <div className="container">
              <div className="section-head home-reveal">
                <h2 className="section-title">Tuyến đang mở bán</h2>
                <p className="section-desc">
                  Dữ liệu lấy trực tiếp từ hệ thống — chọn tuyến rồi sang trang đặt vé để xem chuyến cụ thể.
                </p>
              </div>
              <div className="home-routes-grid">
                {dsTuyen.slice(0, 6).map((t) => (
                  <article key={t.ma} className="home-route-card home-reveal">
                    <div className="home-route-card__path">
                      <span>{t.diemDi}</span>
                      <ArrowRight size={16} className="home-route-card__arrow" />
                      <span>{t.diemDen}</span>
                    </div>
                    <dl className="home-route-card__meta">
                      {t.khoangCachKm != null ? (
                        <div>
                          <dt>Khoảng cách</dt>
                          <dd>{t.khoangCachKm} km</dd>
                        </div>
                      ) : null}
                      {t.thoiGianUocTinhPhut != null ? (
                        <div>
                          <dt>Thời gian dự kiến</dt>
                          <dd>{t.thoiGianUocTinhPhut} phút</dd>
                        </div>
                      ) : null}
                    </dl>
                    <Link className="btn btn--ghost btn--sm home-route-card__cta" to="/dat-ve">
                      Đặt vé tuyến này
                    </Link>
                  </article>
                ))}
              </div>
            </div>
          </section>
        ) : null}

        <section className="home-news-spotlight" aria-labelledby="home-news-heading">
          <div className="container">
            <div className="home-news-spotlight__head section-head home-reveal">
              <div className="home-news-spotlight__intro">
                <span className="home-news-spotlight__badge">
                  <Newspaper size={16} aria-hidden /> Tin tức
                </span>
                <h2 id="home-news-heading" className="section-title">
                  Cập nhật mới nhất từ RedBus
                </h2>
                <p className="section-desc">
                  Ưu đãi lịch chạy, nhắc lịch và thông tin phục vụ hành khách — đọc nhanh hoặc vào trang tin đầy đủ.
                </p>
              </div>
              <Link className="btn btn--outline btn--sm home-news-spotlight__cta-top" to="/tin-tuc">
                Xem tất cả tin
                <ArrowRight size={16} aria-hidden />
              </Link>
            </div>

            {tin.length > 0 ? (
              <div className="home-news-spotlight__grid">
                {tin.map((t) => (
                  <article key={t.ma} className="home-news-card home-reveal">
                    <Link to={`/tin-tuc/${t.ma}`} className="home-news-card__link">
                      <span className="home-news-card__shine" aria-hidden />
                      <div className="home-news-card__top">
                        <span className="home-news-card__icon">
                          <Newspaper size={20} aria-hidden />
                        </span>
                        <time className="home-news-card__time muted small" dateTime={t.ngayXuatBan}>
                          {dinhDangNgayGio(t.ngayXuatBan)}
                        </time>
                      </div>
                      <h3 className="home-news-card__title">{t.tieuDe}</h3>
                      {t.tomTat ? <p className="home-news-card__sum">{t.tomTat}</p> : null}
                      <span className="home-news-card__more">
                        Đọc chi tiết <ArrowRight size={14} aria-hidden />
                      </span>
                    </Link>
                  </article>
                ))}
              </div>
            ) : (
              <div className="home-news-spotlight__empty home-reveal">
                <p className="muted">
                  Chưa có bài tin trên hệ thống hoặc không tải được dữ liệu. Bạn vẫn có thể vào trang tin để xem khi có cập
                  nhật.
                </p>
                <Link className="btn btn--primary btn--sm" to="/tin-tuc">
                  Đến trang tin tức
                </Link>
              </div>
            )}
          </div>
        </section>

        <section className="home-testimonials">
          <div className="container">
            <div className="section-head home-reveal">
              <h2 className="section-title">Hành khách nói gì?</h2>
              <p className="section-desc">Một vài phản hồi minh họa — có thể thay bằng đánh giá thật từ chuyến xe.</p>
            </div>
            <div className="home-testimonials__grid">
              {DANH_GIA_MAU.map((d, i) => (
                <blockquote key={i} className="home-quote home-reveal">
                  <div className="home-quote__stars" aria-label={`${d.sao} sao`}>
                    {Array.from({ length: 5 }, (_, j) => (
                      <Star key={j} size={16} className={j < d.sao ? 'home-quote__star--on' : ''} />
                    ))}
                  </div>
                  <p className="home-quote__text">&ldquo;{d.loi}&rdquo;</p>
                  <footer>
                    <strong>{d.ten}</strong>
                    <span className="muted small">{d.tuyen}</span>
                  </footer>
                </blockquote>
              ))}
            </div>
          </div>
        </section>

        <section className="home-compare">
          <div className="container">
            <div className="section-head home-reveal">
              <h2 className="section-title">RedBus và đặt vé truyền thống</h2>
              <p className="section-desc">So sánh nhanh — nhấn mạnh giá trị trực tuyến cho người đi xe và nhà xe.</p>
            </div>
            <div className="home-compare__table home-reveal">
              <div className="home-compare__row home-compare__row--head">
                <span>Tiêu chí</span>
                <span>RedBus</span>
                <span>Đặt qua điện thoại / bến</span>
              </div>
              {SO_SANH.map((r, i) => (
                <div key={i} className="home-compare__row">
                  <span>{r.tieuChi}</span>
                  <span className="home-compare__cell">
                    {redbusYesNo(r.redbus)}
                  </span>
                  <span className="home-compare__cell">
                    {redbusYesNo(r.truyenThong)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="home-steps-section">
          <div className="container">
            <div className="section-head home-reveal">
              <h2 className="section-title section-title--light">Đặt vé chỉ vài phút</h2>
              <p className="section-desc section-desc--light">
                Bốn bước đơn giản từ lúc chọn tuyến đến khi có vé chờ thanh toán.
              </p>
            </div>
            <ol className="home-steps">
              <li className="home-reveal">
                <span className="home-steps__num">1</span>
                <div>
                  <strong>Chọn tuyến &amp; thời gian</strong>
                  <p>Lọc chuyến khởi hành phù hợp, xem điểm dừng trên tuyến (nếu có).</p>
                </div>
              </li>
              <li className="home-reveal">
                <span className="home-steps__num">2</span>
                <div>
                  <strong>Chọn ghế</strong>
                  <p>Sơ đồ xe hiển thị ghế trống và ghế đã giữ — chọn một ghế còn trống.</p>
                </div>
              </li>
              <li className="home-reveal">
                <span className="home-steps__num">3</span>
                <div>
                  <strong>Xác nhận đặt vé</strong>
                  <p>Đăng nhập tài khoản khách hàng để tạo vé ở trạng thái chờ.</p>
                </div>
              </li>
              <li className="home-reveal">
                <span className="home-steps__num">4</span>
                <div>
                  <strong>Thanh toán &amp; đi xe</strong>
                  <p>Thanh toán theo hình thức hệ thống hỗ trợ; theo dõi vé và thông báo trong tài khoản.</p>
                </div>
              </li>
            </ol>
          </div>
        </section>

        <section className="home-faq">
          <div className="container">
            <div className="section-head home-reveal">
              <h2 className="section-title">Câu hỏi thường gặp</h2>
              <p className="section-desc">Giải đáp nhanh trước khi bạn đặt vé.</p>
            </div>
            <div className="home-faq__list home-reveal">
              {CAU_HOI.map((c, i) => (
                <details key={i} className="home-faq__item">
                  <summary>{c.h}</summary>
                  <p>{c.d}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        {km.length > 0 ? (
          <section className="container section">
            <div className="section-head home-reveal">
              <h2 className="section-title">Ưu đãi &amp; mã giảm giá</h2>
              <p className="section-desc">Mã khuyến mãi đang hiệu lực — nhập khi thanh toán vé chờ thanh toán.</p>
            </div>
            <TheChua padding="lg" className="feature-card feature-card--border home-reveal home-promo-card">
              <div className="feature-card__icon">
                <Sparkles size={22} />
              </div>
              <h3 className="home-promo-card__title">Mã đang áp dụng</h3>
              <ul className="home-mini-list home-promo-card__list">
                {km.map((k) => (
                  <li key={k.ma}>
                    <strong className="mono">{k.maCode}</strong>
                    <span className="muted">
                      {' '}
                      −{k.phanTramGiam}% {k.tieuDe ? `· ${k.tieuDe}` : ''}
                    </span>
                  </li>
                ))}
              </ul>
              <p className="muted small">Nhập mã khi thanh toán vé đang chờ thanh toán.</p>
            </TheChua>
          </section>
        ) : null}

        <section className="home-cta-band home-reveal">
          <div className="container home-cta-band__inner">
            <div>
              <h2 className="home-cta-band__title">Sẵn sàng cho chuyến đi tiếp theo?</h2>
              <p className="home-cta-band__lead">
                Tạo tài khoản khách hàng miễn phí, đặt vé và nhận thông báo ngay trên RedBus.
              </p>
            </div>
            <div className="home-cta-band__actions">
              <button type="button" className="btn btn--primary btn--lg" onClick={() => moDangKy()}>
                Đăng ký tài khoản
              </button>
              <Link className="btn btn--outline btn--lg home-cta-band__outline" to="/dat-ve">
                Xem chuyến xe
              </Link>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}

function UsersMini() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm14 10v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function redbusYesNo(ok: boolean) {
  return ok ? (
    <Check className="home-compare__ok" size={18} aria-label="Có" />
  ) : (
    <span className="home-compare__no" aria-label="Không">
      —
    </span>
  )
}
