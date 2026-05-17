import { useEffect, useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { dungModalXacThuc } from "../dinhDanh/boiCanhModalXacThuc";
import {
  ArrowLeftRight,
  ArrowRight,
  Armchair,
  Bus,
  CalendarDays,
  Check,
  CheckCircle2,
  Clock,
  Coffee,
  CreditCard,
  Headphones,
  MapPin,
  Newspaper,
  Search,
  ShieldCheck,
  Smartphone,
  Sparkles,
  Ticket,
  Wifi,
  Zap,
} from "lucide-react";
import { khachHttp, moKhoiDuLieu, urlTaiNguyen } from "../nguon/apiClient";
import type {
  DanhGiaCongKhai,
  KhuyenMai,
  PhanHoi,
  TinTuc,
  TuyenDuong,
} from "../nguon/kieu";
import { AnhCoFallback } from "../thanhPhan/AnhCoFallback";
import { TrinhChieuAnh } from "../thanhPhan/TrinhChieuAnh";
import {
  TrinhChieuDanhGia,
  type DanhGiaHienThi,
} from "../thanhPhan/TrinhChieuDanhGia";
import { TruongChon } from "../thanhPhan/truongNhap";
import {
  ANH_CO_DINH,
  SLIDE_HERO,
  anhChoTuyen,
  anhTinFallback,
} from "../tienIch/anhTrang";
import { dinhDangNgayGio } from "../tienIch/dinhDang";
import { useKhoiHienKhiCuon } from "../tienIch/useKhoiHienKhiCuon";
import { useDemSoKhiHien } from "../tienIch/useDemSoKhiHien";

const DANH_GIA_MAU: DanhGiaHienThi[] = [
  {
    ma: 1,
    ten: "Minh Anh",
    tuyen: "Đà Nẵng → Huế",
    sao: 5,
    loi: "Đặt vé nhanh, thấy rõ ghế còn trống. Nhắc chuyến qua thông báo trong app rất tiện.",
  },
  {
    ma: 2,
    ten: "Tuấn Đạt",
    tuyen: "TP.HCM → Đà Lạt",
    sao: 5,
    loi: "Giao diện dễ hiểu, giá hiện ngay trên chuyến. Thanh toán xong là có vé trong tài khoản.",
  },
  {
    ma: 3,
    ten: "Thu Hà",
    tuyen: "Hà Nội — Ninh Bình",
    sao: 4,
    loi: "Lần đầu đặt online mà không phải gọi tổng đài. Mong thêm nhiều tuyến trên hệ thống.",
  },
];

const CAU_HOI = [
  {
    h: "Tôi có thể hủy vé sau khi đặt không?",
    d: "Vé ở trạng thái chờ thanh toán có thể hủy theo nút trên trang « Vé của tôi ». Sau khi đã thanh toán, áp dụng chính sách của từng nhà xe (hiển thị trên hệ thống).",
  },
  {
    h: "Thanh toán bằng cách nào?",
    d: "Hệ thống hỗ trợ thanh toán tiền mặt tại quầy và các hình thức được cấu hình (ví dụ chuyển khoản). Chi tiết hiển thị bước thanh toán khi bạn chọn vé.",
  },
  {
    h: "Làm sao biết ghế nào còn trống?",
    d: "Sau khi chọn chuyến, sơ đồ xe hiển thị ghế trống, ghế đã đặt và ghế bạn đang chọn — cập nhật theo thời gian thực cho chuyến đó.",
  },
  {
    h: "RedBus có phải nhà xe không?",
    d: "RedBus là nền tảng đặt vé kết nối hành khách với lịch chạy; vận hành chuyến do đơn vị vận tải đối tác phụ trách.",
  },
];

const SO_SANH = [
  {
    tieuChi: "Xem giá & giờ chạy trước khi đặt",
    redbus: true,
    truyenThong: false,
  },
  {
    tieuChi: "Chọn ghế trực tiếp trên sơ đồ",
    redbus: true,
    truyenThong: false,
  },
  {
    tieuChi: "Theo dõi vé & thông báo trong tài khoản",
    redbus: true,
    truyenThong: false,
  },
  {
    tieuChi: "Áp dụng mã khuyến mãi khi thanh toán",
    redbus: true,
    truyenThong: true,
  },
  { tieuChi: "Đặt qua tổng đài / bến", redbus: false, truyenThong: true },
];

function rutGonTen(hoTen: string) {
  const p = hoTen.trim().split(/\s+/).filter(Boolean);
  if (p.length === 0) return "Hành khách";
  if (p.length === 1) return p[0];
  return `${p[0]} ${p[p.length - 1].charAt(0)}.`;
}

function chuyenDanhGiaApi(ds: DanhGiaCongKhai[]): DanhGiaHienThi[] {
  return ds
    .filter((d) => d.nhanXet?.trim())
    .map((d) => ({
      ma: d.ma,
      ten: rutGonTen(d.tenKhach),
      tuyen: `${d.diemDi} → ${d.diemDen}`,
      sao: Math.min(5, Math.max(1, d.diemSo)),
      loi: d.nhanXet!.trim(),
      thoiGian: d.thoiGianTao,
    }));
}

function macDinhTuLuc() {
  const d = new Date();
  d.setHours(d.getHours() + 2, 0, 0, 0);
  return d.toISOString().slice(0, 16);
}

export function TrangChu() {
  const navigate = useNavigate();
  const { moDangKy } = dungModalXacThuc();
  const [tin, datTin] = useState<TinTuc[]>([]);
  const [km, datKm] = useState<KhuyenMai[]>([]);
  const [dsTuyen, datDsTuyen] = useState<TuyenDuong[]>([]);
  const [maTuyenTim, datMaTuyenTim] = useState<number | "">("");
  const [tuLucTim, datTuLucTim] = useState(macDinhTuLuc);
  const [dsDanhGia, datDsDanhGia] = useState<DanhGiaHienThi[]>(DANH_GIA_MAU);

  const refKhoi = useKhoiHienKhiCuon([
    tin.length,
    km.length,
    dsTuyen.length,
    dsDanhGia.length,
  ]);
  const soTuyenHt = Math.max(dsTuyen.length, 1);
  const mucDemTuyen = Math.min(soTuyenHt * 15 + 24, 999);
  const demTuyen = useDemSoKhiHien(mucDemTuyen);
  const demPhut = useDemSoKhiHien(4);
  const demPhanTram = useDemSoKhiHien(98);

  useEffect(() => {
    void (async () => {
      try {
        const [a, b, c, dg] = await Promise.all([
          moKhoiDuLieu(
            khachHttp.get<PhanHoi<TinTuc[]>>("/tin-tuc", {
              params: { gioiHan: 6 },
            }),
          ),
          moKhoiDuLieu(
            khachHttp.get<PhanHoi<KhuyenMai[]>>("/khuyen-mai/hien-thi"),
          ),
          moKhoiDuLieu(khachHttp.get<PhanHoi<TuyenDuong[]>>("/tuyen-duong")),
          moKhoiDuLieu(
            khachHttp.get<PhanHoi<DanhGiaCongKhai[]>>("/danh-gia/cong-khai", {
              params: { gioiHan: 12 },
            }),
          ).catch(() => [] as DanhGiaCongKhai[]),
        ]);
        datTin(a);
        datKm(b);
        datDsTuyen(c);
        const tuApi = chuyenDanhGiaApi(dg);
        if (tuApi.length > 0) datDsDanhGia(tuApi);
        if (c.length && maTuyenTim === "") datMaTuyenTim(c[0].ma);
      } catch {}
    })();
  }, []);

  function timVe(e?: FormEvent, maTuyenGoiY?: number) {
    e?.preventDefault();
    const ma = maTuyenGoiY ?? maTuyenTim;
    if (ma === "") return;
    const q = new URLSearchParams({ tuyen: String(ma) });
    if (tuLucTim) q.set("tuLuc", new Date(tuLucTim).toISOString());
    navigate(`/dat-ve?${q.toString()}`);
  }

  const chuoiMarquee =
    "Đặt vé online 24/7 · Giá minh bạch · Chọn ghế trực quan · Vé điện tử · Mã khuyến mãi · Thanh toán linh hoạt ·";

  const tuyenPhoBien = dsTuyen.slice(0, 4);

  return (
    <div className="home">
      <section className="hero-band hero-band--split hero-band--motion hero-band--landing">
        <AnhCoFallback
          src={ANH_CO_DINH.heroNen}
          fallback={ANH_CO_DINH.heroNen}
          alt=""
          className="hero-band__bg-img"
          loading="eager"
        />
        <div className="hero-band__noise" aria-hidden />
        <div className="hero-band__orb hero-band__orb--1" aria-hidden />
        <div className="hero-band__orb hero-band__orb--2" aria-hidden />
        <div className="hero-band__glow hero-band__glow--a" aria-hidden />
        <div className="hero-band__glow hero-band__glow--b" aria-hidden />
        <div className="container hero-band__grid hero-band__grid--landing">
          <div className="hero-band__copy">
            <p className="eyebrow hero-fade hero-fade--1">
              <Bus size={14} className="hero-spark" /> Đặt vé xe khách trực
              tuyến
            </p>
            <h1 className="hero-title hero-fade hero-fade--2">
              Đi đâu cũng dễ — chọn tuyến, ghế và đặt vé trong vài phút
            </h1>
            <p className="hero-lead hero-fade hero-fade--3">
              Tra cứu lịch chạy, so sánh giá vé và chọn ghế ngồi ngay trên web.
              Vé điện tử và thông báo chuyến nằm gọn trong tài khoản của bạn.
            </p>
            <ul className="hero-trust hero-fade hero-fade--4">
              <li>
                <CheckCircle2 size={16} /> Giá hiển thị rõ trước khi xác nhận
              </li>
              <li>
                <CheckCircle2 size={16} /> Sơ đồ ghế cập nhật theo từng chuyến
              </li>
              <li>
                <CheckCircle2 size={16} /> Đặt vé 24/7 — không cần ra bến
              </li>
            </ul>
          </div>

          <div className="hero-band__panel hero-fade hero-fade--5">
            <form
              className="home-search"
              onSubmit={timVe}
              aria-label="Tìm chuyến xe"
            >
              <h2 className="home-search__title">
                <Search size={20} aria-hidden />
                Tìm chuyến xe
              </h2>
              <div className="home-search__fields">
                <TruongChon
                  nhan="Điểm đi — Điểm đến"
                  value={maTuyenTim === "" ? "" : String(maTuyenTim)}
                  onChange={(e) =>
                    datMaTuyenTim(e.target.value ? Number(e.target.value) : "")
                  }
                >
                  {dsTuyen.length === 0 ? (
                    <option value="">Đang tải tuyến…</option>
                  ) : (
                    dsTuyen.map((t) => (
                      <option key={t.ma} value={t.ma}>
                        {t.diemDi} → {t.diemDen}
                      </option>
                    ))
                  )}
                </TruongChon>
                <div className="field">
                  <label className="field__label" htmlFor="home-tu-luc">
                    Ngày giờ khởi hành từ
                  </label>
                  <div className="field__control">
                    <span className="field__icon">
                      <CalendarDays size={18} />
                    </span>
                    <input
                      id="home-tu-luc"
                      className="field__input"
                      type="datetime-local"
                      value={tuLucTim}
                      onChange={(e) => datTuLucTim(e.target.value)}
                    />
                  </div>
                </div>
              </div>
              <button
                type="submit"
                className="btn btn--primary btn--lg home-search__submit"
                disabled={maTuyenTim === ""}
              >
                <Search size={18} aria-hidden />
                Tìm chuyến
              </button>
              {tuyenPhoBien.length > 0 ? (
                <div className="home-search__quick">
                  <span className="home-search__quick-label">
                    Tuyến phổ biến:
                  </span>
                  <div className="home-search__chips">
                    {tuyenPhoBien.map((t) => (
                      <button
                        key={t.ma}
                        type="button"
                        className="home-search__chip"
                        onClick={() => {
                          datMaTuyenTim(t.ma);
                          timVe(undefined, t.ma);
                        }}
                      >
                        {t.diemDi} → {t.diemDen}
                      </button>
                    ))}
                  </div>
                </div>
              ) : null}
            </form>
            <TrinhChieuAnh
              dsSlide={SLIDE_HERO}
              className="hero-slideshow hero-fade hero-fade--6"
              tuDongMs={5500}
              variant="hero"
            />
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
        {dsTuyen.length > 0 ? (
          <section className="home-routes-section home-routes-section--hero">
            <div className="container">
              <div className="section-head home-reveal">
                <h2 className="section-title">Tuyến đang mở bán</h2>
                <p className="section-desc">
                  Chọn tuyến phù hợp — hệ thống hiển thị chuyến, giá vé và ghế
                  còn trống theo thời gian thực.
                </p>
              </div>
              <div className="home-routes-grid">
                {dsTuyen.slice(0, 6).map((t) => (
                  <article key={t.ma} className="home-route-card home-reveal">
                    <AnhCoFallback
                      src={anhChoTuyen(t.ma)}
                      fallback={ANH_CO_DINH.heroChinh}
                      alt={`Xe khách ${t.diemDi} đến ${t.diemDen}`}
                      className="home-route-card__img"
                    />
                    <div className="home-route-card__body">
                      <div className="home-route-card__path">
                        <span className="home-route-card__from">
                          {t.diemDi}
                        </span>
                        <span className="home-route-card__mid">
                          <ArrowRight
                            size={14}
                            className="home-route-card__arrow"
                            aria-hidden
                          />
                          Tuyến xe khách
                        </span>
                        <span className="home-route-card__to">{t.diemDen}</span>
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
                      <button
                        type="button"
                        className="btn btn--ghost btn--sm home-route-card__cta"
                        onClick={() => timVe(undefined, t.ma)}
                      >
                        Tìm chuyến
                        <ArrowRight size={14} aria-hidden />
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </section>
        ) : null}

        <section className="home-bus-gallery">
          <div className="container">
            <div className="section-head home-reveal">
              <h2 className="section-title">Đội xe &amp; loại xe</h2>
              <p className="section-desc">
                Xem hình ảnh loại xe trước khi chọn chuyến — ảnh từ nhà xe đối
                tác trên hệ thống.
              </p>
            </div>
            <div className="home-bus-gallery__grid home-reveal">
              {SLIDE_HERO.map((s, i) => (
                <figure key={i} className="home-bus-gallery__item">
                  <AnhCoFallback
                    src={s.src}
                    fallback={ANH_CO_DINH.heroChinh}
                    alt={s.alt}
                    className="home-bus-gallery__img"
                  />
                  <figcaption>{s.chu ?? s.alt}</figcaption>
                </figure>
              ))}
            </div>
          </div>
        </section>

        <section className="home-steps-section home-steps-section--early">
          <div className="container home-steps-layout">
            <div className="home-steps-layout__media home-reveal">
              <AnhCoFallback
                src={ANH_CO_DINH.ghe}
                fallback={ANH_CO_DINH.heroChinh}
                alt="Nội thất xe khách — chọn ghế ngồi"
                className="home-steps-layout__img"
              />
            </div>
            <div className="home-steps-layout__content">
              <div className="section-head home-reveal">
                <h2 className="section-title section-title--light">
                  Đặt vé chỉ 4 bước
                </h2>
                <p className="section-desc section-desc--light">
                  Từ lúc chọn tuyến đến khi có vé — quy trình đơn giản, không
                  cần gọi điện.
                </p>
              </div>
              <ol className="home-steps">
                <li className="home-reveal">
                  <span className="home-steps__num">1</span>
                  <div>
                    <strong>Chọn tuyến &amp; thời gian</strong>
                    <p>
                      Lọc chuyến khởi hành phù hợp, xem điểm dừng trên tuyến
                      (nếu có).
                    </p>
                  </div>
                </li>
                <li className="home-reveal">
                  <span className="home-steps__num">2</span>
                  <div>
                    <strong>Chọn ghế</strong>
                    <p>
                      Sơ đồ xe hiển thị ghế trống và ghế đã giữ — chọn một ghế
                      còn trống.
                    </p>
                  </div>
                </li>
                <li className="home-reveal">
                  <span className="home-steps__num">3</span>
                  <div>
                    <strong>Xác nhận đặt vé</strong>
                    <p>
                      Đăng nhập tài khoản khách hàng để tạo vé ở trạng thái chờ.
                    </p>
                  </div>
                </li>
                <li className="home-reveal">
                  <span className="home-steps__num">4</span>
                  <div>
                    <strong>Thanh toán &amp; đi xe</strong>
                    <p>
                      Thanh toán theo hình thức hệ thống hỗ trợ; theo dõi vé và
                      thông báo trong tài khoản.
                    </p>
                  </div>
                </li>
              </ol>
            </div>
          </div>
        </section>

        <section className="home-metrics">
          <div className="container home-metrics__grid">
            <div className="home-metric home-reveal" ref={demTuyen.ref}>
              <span className="home-metric__value">
                {demTuyen.giaTri}
                <small>+</small>
              </span>
              <span className="home-metric__unit">tuyến xe khách</span>
              <p className="home-metric__hint">
                Nhiều hành trình nội địa — cập nhật theo lịch nhà xe đối tác.
              </p>
            </div>
            <div className="home-metric home-reveal" ref={demPhut.ref}>
              <span className="home-metric__value home-metric__value--sm">
                {demPhut.giaTri}
                <small> phút</small>
              </span>
              <span className="home-metric__unit">
                trung bình hoàn tất đặt vé
              </span>
              <p className="home-metric__hint">
                Từ lúc chọn tuyến đến xác nhận vé chờ thanh toán.
              </p>
            </div>
            <div className="home-metric home-reveal" ref={demPhanTram.ref}>
              <span className="home-metric__value">
                {demPhanTram.giaTri}
                <small>%</small>
              </span>
              <span className="home-metric__unit">hành khách hài lòng</span>
              <p className="home-metric__hint">
                Đánh giá sau chuyến — minh họa trải nghiệm đặt vé online.
              </p>
            </div>
            <div className="home-metric home-metric--accent home-reveal">
              <span className="home-metric__icon-wrap">
                <Clock size={28} />
              </span>
              <span className="home-metric__unit home-metric__unit--lg">
                Đặt vé 24/7
              </span>
              <p className="home-metric__hint">
                Không giới hạn giờ — chỉ cần còn ghế trên chuyến.
              </p>
            </div>
          </div>
        </section>

        <section className="home-stats">
          <div className="container home-stats__inner">
            <div className="home-stat home-reveal">
              <span className="home-stat__icon">
                <MapPin size={22} />
              </span>
              <strong className="home-stat__title">Lịch chạy minh bạch</strong>
              <span className="home-stat__sub">
                Giờ khởi hành, giá vé, trạng thái chuyến
              </span>
            </div>
            <div className="home-stat home-reveal">
              <span className="home-stat__icon">
                <Smartphone size={22} />
              </span>
              <strong className="home-stat__title">Đặt vé mọi lúc</strong>
              <span className="home-stat__sub">
                Điện thoại hay máy tính — giao diện thân thiện
              </span>
            </div>
            <div className="home-stat home-reveal">
              <span className="home-stat__icon">
                <ShieldCheck size={22} />
              </span>
              <strong className="home-stat__title">Thanh toán an toàn</strong>
              <span className="home-stat__sub">
                Nhiều hình thức — vé gắn với giao dịch
              </span>
            </div>
            <div className="home-stat home-reveal">
              <span className="home-stat__icon">
                <Headphones size={22} />
              </span>
              <strong className="home-stat__title">
                Hỗ trợ &amp; thông báo
              </strong>
              <span className="home-stat__sub">
                Nhắc chuyến, ưu đãi, đánh giá sau đi
              </span>
            </div>
          </div>
        </section>

        <section className="container section section--tight">
          <div className="section-head home-reveal">
            <h2 className="section-title">Vì sao đặt vé qua RedBus?</h2>
            <p className="section-desc">
              Trải nghiệm đặt vé hiện đại — tiết kiệm thời gian so với gọi điện
              hay ra bến.
            </p>
          </div>
          <div className="grid-3 home-feature-grid">
            <article className="feature-card feature-card--lift feature-card--img home-reveal">
              <AnhCoFallback
                src={ANH_CO_DINH.ghe}
                fallback={ANH_CO_DINH.heroChinh}
                alt="Sơ đồ ghế xe khách"
                className="feature-card__cover"
              />
              <div className="feature-card__icon">
                <Armchair size={22} />
              </div>
              <h3>Sơ đồ ghế trực quan</h3>
              <p>
                Ghế trống / đã đặt hiển thị rõ — chọn đúng chỗ ngồi trước khi
                xác nhận, dữ liệu theo từng chuyến.
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
            <article className="feature-card feature-card--lift feature-card--img home-reveal">
              <AnhCoFallback
                src={ANH_CO_DINH.thanhToan}
                fallback={ANH_CO_DINH.thanhToan}
                alt=""
                className="feature-card__cover"
              />
              <div className="feature-card__icon">
                <CreditCard size={22} />
              </div>
              <h3>Thanh toán &amp; khuyến mãi</h3>
              <p>
                Nhập mã giảm giá khi thanh toán; tiền mặt tại quầy và các hình
                thức được cấu hình. Giao dịch gắn với vé để đối soát.
              </p>
              <ul className="home-mini-tags">
                <li>Lịch sử thanh toán theo vé</li>
                <li>Nhiều hình thức thanh toán</li>
              </ul>
            </article>
            <article className="feature-card feature-card--lift feature-card--img home-reveal">
              <AnhCoFallback
                src={ANH_CO_DINH.veDienTu}
                fallback={ANH_CO_DINH.veDienTu}
                alt=""
                className="feature-card__cover"
              />
              <div className="feature-card__icon">
                <Ticket size={22} />
              </div>
              <h3>Vé điện tử &amp; thông báo</h3>
              <p>
                Vé lưu trong « Vé của tôi »; nhận thông báo nhắc chuyến và cập
                nhật ưu đãi — không lo mất giấy vé.
              </p>
              <ul className="home-mini-tags">
                <li>
                  <Zap size={14} /> Xác nhận nhanh sau khi đặt
                </li>
                <li>
                  <ArrowLeftRight size={14} /> Đổi / hủy theo chính sách hiển
                  thị
                </li>
              </ul>
            </article>
          </div>
        </section>

        {km.length > 0 ? (
          <section className="container section home-promo-section">
            <div className="section-head home-reveal">
              <h2 className="section-title">Ưu đãi &amp; mã giảm giá</h2>
              <p className="section-desc">
                Mã khuyến mãi đang hiệu lực — nhập khi thanh toán vé chờ thanh
                toán.
              </p>
            </div>
            <div className="home-promo-band home-reveal">
              <div className="home-promo-band__visual">
                <AnhCoFallback
                  src={ANH_CO_DINH.khuyenMai}
                  fallback={ANH_CO_DINH.heroChinh}
                  alt="Xe khách RedBus"
                  className="home-promo-band__img"
                />
              </div>
              <div className="home-promo-band__content">
                <div className="feature-card__icon">
                  <Sparkles size={22} />
                </div>
                <h3 className="home-promo-band__title">Mã đang áp dụng</h3>
                <div className="home-promo-codes">
                  {km.map((k) => (
                    <article key={k.ma} className="home-promo-code">
                      <strong className="mono home-promo-code__ma">{k.maCode}</strong>
                      <span className="home-promo-code__giam">−{k.phanTramGiam}%</span>
                      {k.tieuDe ? <span className="muted small home-promo-code__tieuDe">{k.tieuDe}</span> : null}
                    </article>
                  ))}
                </div>
                <p className="muted small home-promo-band__hint">
                  Nhập mã khi thanh toán vé đang chờ thanh toán.
                </p>
                <button type="button" className="btn btn--primary btn--sm" onClick={() => timVe()}>
                  Đặt vé ngay
                  <ArrowRight size={16} aria-hidden />
                </button>
              </div>
            </div>
          </section>
        ) : null}

        <section className="home-testimonials">
          <div className="container">
            <div className="section-head home-reveal">
              <h2 className="section-title">Hành khách nói gì?</h2>
              <p className="section-desc">
                Đánh giá thật sau chuyến đi — từ khách đã thanh toán vé và gửi
                nhận xét trên hệ thống.
              </p>
            </div>
            <div className="home-reveal">
              <TrinhChieuDanhGia ds={dsDanhGia} />
            </div>
          </div>
        </section>

        <section className="home-compare">
          <div className="container">
            <div className="section-head home-reveal">
              <h2 className="section-title">RedBus và đặt vé truyền thống</h2>
              <p className="section-desc">
                So sánh nhanh — lợi ích khi đặt vé trực tuyến.
              </p>
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

        <section
          className="home-news-spotlight"
          aria-labelledby="home-news-heading"
        >
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
                  Ưu đãi lịch chạy, nhắc lịch và thông tin phục vụ hành khách —
                  đọc nhanh hoặc vào trang tin đầy đủ.
                </p>
              </div>
              <Link
                className="btn btn--outline btn--sm home-news-spotlight__cta-top"
                to="/tin-tuc"
              >
                Xem tất cả tin
                <ArrowRight size={16} aria-hidden />
              </Link>
            </div>

            {tin.length > 0 ? (
              <div className="home-news-spotlight__grid">
                {tin.map((t) => (
                  <article key={t.ma} className="home-news-card home-reveal">
                    <Link
                      to={`/tin-tuc/${t.ma}`}
                      className="home-news-card__link"
                    >
                      <AnhCoFallback
                        src={t.duongAnh ? urlTaiNguyen(t.duongAnh) : undefined}
                        fallback={anhTinFallback(t.ma)}
                        alt=""
                        className="home-news-card__cover"
                      />
                      <span className="home-news-card__shine" aria-hidden />
                      <div className="home-news-card__body">
                        <div className="home-news-card__top">
                          <span className="home-news-card__icon">
                            <Newspaper size={20} aria-hidden />
                          </span>
                          <time
                            className="home-news-card__time muted small"
                            dateTime={t.ngayXuatBan}
                          >
                            {dinhDangNgayGio(t.ngayXuatBan)}
                          </time>
                        </div>
                        <h3 className="home-news-card__title">{t.tieuDe}</h3>
                        {t.tomTat ? (
                          <p className="home-news-card__sum">{t.tomTat}</p>
                        ) : null}
                        <span className="home-news-card__more">
                          Đọc chi tiết <ArrowRight size={14} aria-hidden />
                        </span>
                      </div>
                    </Link>
                  </article>
                ))}
              </div>
            ) : (
              <div className="home-news-spotlight__empty home-reveal">
                <p className="muted">
                  Chưa có bài tin trên hệ thống hoặc không tải được dữ liệu. Bạn
                  vẫn có thể vào trang tin để xem khi có cập nhật.
                </p>
                <Link className="btn btn--primary btn--sm" to="/tin-tuc">
                  Đến trang tin tức
                </Link>
              </div>
            )}
          </div>
        </section>

        <section className="home-faq">
          <div className="container">
            <div className="section-head home-reveal">
              <h2 className="section-title">Câu hỏi thường gặp</h2>
              <p className="section-desc">
                Giải đáp nhanh trước khi bạn đặt vé.
              </p>
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

        <section className="home-cta-band home-reveal">
          <AnhCoFallback
            src={ANH_CO_DINH.cta}
            fallback={ANH_CO_DINH.cta}
            alt=""
            className="home-cta-band__bg"
          />
          <div className="container home-cta-band__inner">
            <div>
              <h2 className="home-cta-band__title">
                Sẵn sàng cho chuyến đi tiếp theo?
              </h2>
              <p className="home-cta-band__lead">
                Tìm chuyến ngay — hoặc tạo tài khoản miễn phí để lưu vé và nhận
                thông báo.
              </p>
            </div>
            <div className="home-cta-band__actions">
              <button
                type="button"
                className="btn btn--primary btn--lg"
                onClick={() => timVe()}
              >
                <Search size={18} aria-hidden />
                Tìm chuyến xe
              </button>
              <button
                type="button"
                className="btn btn--outline btn--lg home-cta-band__outline"
                onClick={() => moDangKy()}
              >
                Đăng ký tài khoản
              </button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

function redbusYesNo(ok: boolean) {
  return ok ? (
    <Check className="home-compare__ok" size={18} aria-label="Có" />
  ) : (
    <span className="home-compare__no" aria-label="Không">
      —
    </span>
  );
}
