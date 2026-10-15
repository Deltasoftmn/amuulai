import React from 'react';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { getNavMenu, getFooterMenu, getFooterData, getSettingData, getStrapiMedia } from '@/lib/api';

export const metadata = {
  title: 'Нууцлалын бодлого | Амуулай Групп',
  description: '“Амуулай Групп” ХХК болон түүний харьяа брэндүүдийн хэрэглэгчийн хувийн мэдээллийн нууцлал, аюулгүй байдлыг хамгаалах бодлого.',
};

export default async function PrivacyPolicyPage() {
  const navItems = await getNavMenu();
  const footerItems = await getFooterMenu();
  const footerData = await getFooterData();
  const settingData = await getSettingData();

  const logoUrl = settingData?.mainLogo?.url 
    ? getStrapiMedia(settingData.mainLogo.url) 
    : (settingData?.whiteLogo?.url ? getStrapiMedia(settingData.whiteLogo.url) : undefined);

  const sections = [
    { id: 'general', title: 'Ерөнхий зүйл' },
    { id: 'section-1', title: '1. Бидний цуглуулдаг мэдээлэл' },
    { id: 'section-2', title: '2. Мэдээллийг ашиглах зорилго' },
    { id: 'section-3', title: '3. Cookie болон ижил төстэй технологи' },
    { id: 'section-4', title: '4. Мэдээлэл хуваалцах болон дамжуулах' },
    { id: 'section-5', title: '5. Мэдээллийн аюулгүй байдал' },
    { id: 'section-6', title: '6. Мэдээлэл хадгалах хугацаа' },
    { id: 'section-7', title: '7. Хэрэглэгчийн эрх' },
    { id: 'section-8', title: '8. Маркетингийн зөвшөөрөл' },
    { id: 'section-9', title: '9. Loyalty point, гишүүнчлэл ба урамшуулал' },
    { id: 'section-10', title: '10. Гуравдагч талын холбоос ба үйлчилгээ' },
    { id: 'section-11', title: '11. Нууцлалын бодлогын өөрчлөлт' },
    { id: 'section-12', title: '12. Холбоо барих' },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[#f8fafc]">
      <Header navItems={navItems} logoUrl={logoUrl} transparentOnTop={false} />

      {/* TOP HERO BANNER */}
      <section 
        className="relative text-white overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, #006075 0%, #00829d 60%, #00a4c5 100%)',
          paddingTop: '130px',
          paddingBottom: '60px',
        }}
      >
        {/* Soft Pattern Overlay */}
        <div 
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: "url('/pattern2.png')",
            backgroundRepeat: 'repeat',
            backgroundSize: '240px',
            opacity: 0.12,
            mixBlendMode: 'overlay',
          }}
        />

        <div className="container mx-auto px-6 max-w-[1240px] relative z-10">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm text-white/80 mb-4 font-medium">
            <Link href="/" className="hover:text-white hover:underline transition-colors">
              Нүүр
            </Link>
            <span>/</span>
            <span className="text-white">Нууцлалын бодлого</span>
          </div>

          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/15 backdrop-blur-sm text-xs font-semibold uppercase tracking-wider text-white mb-4 border border-white/20">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
            Хууль зүй & Нууцлалын хамгаалалт
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white mb-3 uppercase">
            Нууцлалын бодлого
          </h1>
          <p className="text-base sm:text-lg text-white/90 max-w-2xl font-light">
            “Амуулай Групп” ХХК болон түүний харьяа брэндүүд таны хувийн мэдээллийн аюулгүй байдал, нууцлалыг чандлан хамгаална.
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-4 text-xs sm:text-sm text-white/80 border-t border-white/15 pt-4">
            <span className="flex items-center gap-1.5">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              Сүүлд шинэчилсэн: <strong>2026 оны 10 дүгээр сарын 01-ны өдөр</strong>
            </span>
            <span>•</span>
            <span>Хүчин төгөлдөр мөрдөгдөж буй хувилбар</span>
          </div>
        </div>
      </section>

      {/* MAIN CONTENT AREA */}
      <main className="flex-grow py-12 lg:py-16">
        <div className="container mx-auto px-6 max-w-[1240px]">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* SIDEBAR: TABLE OF CONTENTS (STICKY ON DESKTOP) */}
            <aside className="lg:col-span-4 lg:sticky lg:top-28 order-2 lg:order-1">
              <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm">
                <div className="flex items-center gap-2 mb-4 pb-3 border-b border-slate-100">
                  <svg className="w-5 h-5 text-[#00829d]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h7" />
                  </svg>
                  <h3 className="font-bold text-slate-900 text-base uppercase tracking-wider">
                    Гарчиг, Агуулга
                  </h3>
                </div>
                <nav className="space-y-1.5 text-sm">
                  {sections.map((sec) => (
                    <a
                      key={sec.id}
                      href={`#${sec.id}`}
                      className="block px-3 py-2 rounded-lg text-slate-600 hover:text-[#00829d] hover:bg-[#00829d]/5 font-medium transition-colors"
                    >
                      {sec.title}
                    </a>
                  ))}
                </nav>

                <div className="mt-6 pt-4 border-t border-slate-100 bg-slate-50/70 -mx-6 -mb-6 p-6 rounded-b-2xl">
                  <h4 className="font-semibold text-slate-800 text-xs uppercase tracking-wider mb-2">
                    Асууж тодруулах зүйл бий юу?
                  </h4>
                  <p className="text-xs text-slate-500 mb-3 leading-relaxed">
                    Манай хууль зүй болон хэрэглэгчийн үйлчилгээний төвтэй холбогдоорой.
                  </p>
                  <a
                    href="tel:75339966"
                    className="inline-flex items-center justify-center gap-2 w-full py-2.5 px-3 rounded-xl bg-[#00829d] hover:bg-[#006e85] text-white text-xs font-bold transition-all shadow-sm"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    Холбогдох: 75339966
                  </a>
                </div>
              </div>
            </aside>

            {/* MAIN ARTICLE / SECTIONS CONTENT */}
            <article className="lg:col-span-8 space-y-8 order-1 lg:order-2">

              {/* ЕРӨНХИЙ ЗҮЙЛ */}
              <section id="general" className="scroll-mt-28 bg-white rounded-2xl border border-slate-200/80 p-7 sm:p-9 shadow-sm">
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-10 h-10 rounded-xl bg-[#00829d]/10 flex items-center justify-center text-[#00829d] font-bold">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 uppercase">
                    Ерөнхий зүйл
                  </h2>
                </div>

                <div className="prose prose-slate max-w-none text-slate-700 leading-relaxed space-y-4 text-[15px] sm:text-base">
                  <p>
                    <strong>“Амуулай Групп” ХХК</strong> болон түүний харьяа компани, бизнесийн нэгж, брэнд, худалдаа, үйлчилгээний сувгууд, тухайлбал <strong>Mild Cosmetics</strong> (Майлд Косметикс), <strong>Genki Drugstore</strong> (Генки Драгстор), <strong>OEO</strong> болон цаашид “Амуулай Групп” ХХК-ийн үйл ажиллагааны хүрээнд шинээр бий болох, нэгдэх бусад брэнд, үйлчилгээ (цаашид хамтад нь <em>“Бид”, “Манай”, “Компани”</em> гэх) нь хэрэглэгч, үйлчлүүлэгчдийнхээ (цаашид <em>“Та”, “Хэрэглэгч”</em> гэх) хувийн мэдээлэл, түүний нууцлал, аюулгүй байдлыг хамгаалахыг эрхэмлэнэ.
                  </p>
                  <p>
                    Энэхүү Нууцлалын бодлого нь “Амуулай Групп” ХХК болон дээр дурдсан брэнд, үйлчилгээний:
                  </p>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 my-3 pl-0 list-none">
                    {[
                      'вэбсайт',
                      'мобайл аппликэйшн',
                      'онлайн худалдааны суваг',
                      'салбар дэлгүүр',
                      'loyalty буюу үнэнч хэрэглэгчийн хөтөлбөр',
                      'хүргэлт, захиалгын үйлчилгээ',
                      'хэрэглэгчийн үйлчилгээ',
                      'сошиал медиа болон бусад дижитал суваг'
                    ].map((item, i) => (
                      <li key={i} className="flex items-center gap-2 text-slate-700 bg-slate-50 px-3 py-2 rounded-lg text-sm border border-slate-100">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#00829d]" />
                        {item}
                      </li>
                    ))}
                  </ul>
                  <p>
                    зэргийг ашиглах үед хэрэглэгчийн хувийн мэдээллийг хэрхэн цуглуулах, боловсруулах, ашиглах, хадгалах, хамгаалах болон хууль тогтоомжид зөвшөөрөгдсөн тохиолдолд бусад этгээдэд дамжуулахтай холбоотой харилцааг зохицуулна.
                  </p>
                  <div className="p-4 rounded-xl bg-[#00829d]/5 border-l-4 border-[#00829d] text-sm text-slate-800">
                    Энэхүү бодлого нь <strong>www.amuulaigroup.mn</strong>, <strong>mild.mn</strong>, <strong>MILD app</strong> болон Компанийн бусад цахим үйлчилгээ, платформд хамаарна.
                  </div>
                  <p>
                    Mild Cosmetics, Genki Drugstore, OEO болон Амуулай Группийн бусад үйлчилгээ нь нэгдсэн хэрэглэгчийн бүртгэл, loyalty систем ашиглаж байгаа тохиолдолд хэрэглэгчийн бүртгэл, худалдан авалтын түүх, point/оноо, гишүүнчлэлийн түвшин болон бусад холбогдох мэдээллийг Амуулай Группийн нэгдсэн системд боловсруулж болно.
                  </p>
                  <p>
                    Хэрэглэгч манай үйлчилгээ, вэбсайт, аппликэйшн, loyalty хөтөлбөр болон бусад үйлчилгээнд бүртгүүлэх, ашиглах үед энэхүү Нууцлалын бодлоготой танилцах боломжийг олгоно. Хууль тогтоомжийн дагуу хэрэглэгчийн зөвшөөрөл шаардлагатай мэдээлэл боловсруулах тохиолдолд зохих зөвшөөрлийг авна.
                  </p>
                </div>
              </section>

              {/* 1. БИДНИЙ ЦУГЛУУЛДАГ МЭДЭЭЛЭЛ */}
              <section id="section-1" className="scroll-mt-28 bg-white rounded-2xl border border-slate-200/80 p-7 sm:p-9 shadow-sm">
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-10 h-10 rounded-xl bg-[#00829d]/10 flex items-center justify-center text-[#00829d] font-bold text-lg">
                    01
                  </div>
                  <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900">
                    1. БИДНИЙ ЦУГЛУУЛДАГ МЭДЭЭЛЭЛ
                  </h2>
                </div>

                <p className="text-slate-700 leading-relaxed mb-6 text-[15px] sm:text-base">
                  Бид бүтээгдэхүүн, үйлчилгээ хүргэх, хэрэглэгчийн бүртгэл болон loyalty хөтөлбөрийг ажиллуулах, хэрэглэгчийн туршлагыг сайжруулах болон бизнесийн үйл ажиллагааг хэвийн явуулах зорилгоор шаардлагатай мэдээллийг цуглуулж, боловсруулж болно.
                </p>

                <div className="space-y-6">
                  {/* 1.1 */}
                  <div className="bg-slate-50/70 p-5 rounded-xl border border-slate-200/60">
                    <h3 className="text-base font-bold text-slate-900 mb-3 text-[#00829d]">
                      1.1. Хувийн болон холбоо барих мэдээлэл
                    </h3>
                    <p className="text-sm text-slate-600 mb-3">Үүнд дараах мэдээллүүд багтаж болно:</p>
                    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-slate-700">
                      {[
                        'Овог, нэр',
                        'Утасны дугаар',
                        'Имэйл хаяг',
                        'Төрсөн огноо',
                        'Хүйс',
                        'Хүргэлтийн хаяг',
                        'Гэрийн болон ажлын хаяг',
                        'Хэрэглэгч өөрийн хүсэлтээр өгсөн арьсны төрөл зэрэг бүтээгдэхүүн, үйлчилгээ сонгоход ашиглагдах мэдээлэл',
                        'Захиалга болон төлбөрийн мэдээлэл',
                        'Платформ ашиглалтын мэдээлэл (cookie, IP хаяг, төхөөрөмжийн мэдээлэл)',
                        'Хэрэглэгч өөрийн хүсэлтээр өгсөн бусад мэдээлэл'
                      ].map((item, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <span className="text-[#00829d] font-bold mt-0.5">•</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* 1.2 */}
                  <div className="bg-slate-50/70 p-5 rounded-xl border border-slate-200/60">
                    <h3 className="text-base font-bold text-slate-900 mb-3 text-[#00829d]">
                      1.2. Хэрэглэгчийн бүртгэл болон Loyalty хөтөлбөрийн мэдээлэл
                    </h3>
                    <p className="text-sm text-slate-600 mb-3">
                      Хэрэв та манай loyalty буюу үнэнч хэрэглэгчийн хөтөлбөрт хамрагдсан бол бид:
                    </p>
                    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-slate-700 mb-3">
                      {[
                        'Loyalty гишүүнчлэлийн дугаар',
                        'Аппликэйшний хэрэглэгчийн ID',
                        'QR код болон түүнтэй холбоотой бүртгэл',
                        'Бүртгэлтэй утасны дугаар',
                        'Цуглуулсан болон зарцуулсан point/оноо',
                        'Point-ийн үлдэгдэл',
                        'Гишүүнчлэлийн түвшин, статус',
                        'Хөнгөлөлтийн хувь',
                        'Купон, voucher болон бусад урамшууллын мэдээлэл',
                        'Урамшууллын ашиглалтын түүх',
                        'Худалдан авалтын давтамж',
                        'Loyalty хөтөлбөртэй холбоотой бусад шаардлагатай мэдээлэл'
                      ].map((item, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <span className="text-[#00829d] font-bold mt-0.5">•</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                    <p className="text-xs text-slate-500 italic mt-2">
                      * Хэрэглэгчийг таних, point цуглуулах болон loyalty үйлчилгээг ашиглахдаа аппликэйшний QR код, бүртгэлтэй утасны дугаар эсвэл Компанийн зөвшөөрсөн бусад таних арга ашиглаж болно.
                    </p>
                  </div>

                  {/* 1.3 */}
                  <div className="bg-slate-50/70 p-5 rounded-xl border border-slate-200/60">
                    <h3 className="text-base font-bold text-slate-900 mb-3 text-[#00829d]">
                      1.3. Худалдан авалт болон гүйлгээний мэдээлэл
                    </h3>
                    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-slate-700">
                      {[
                        'Худалдан авсан бүтээгдэхүүн, ангилал',
                        'Худалдан авалтын огноо, цаг, дүн',
                        'Худалдан авалт хийсэн салбар (онлайн болон офлайн)',
                        'Ашигласан хөнгөлөлт, point, купон, voucher',
                        'Захиалгын түүх, сагсанд нэмсэн бүтээгдэхүүн',
                        'Буцаалт, солилтын мэдээлэл'
                      ].map((item, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <span className="text-[#00829d] font-bold mt-0.5">•</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* 1.4 */}
                  <div className="bg-slate-50/70 p-5 rounded-xl border border-slate-200/60">
                    <h3 className="text-base font-bold text-slate-900 mb-2 text-[#00829d]">
                      1.4. Төлбөрийн мэдээлэл
                    </h3>
                    <p className="text-sm text-slate-700 leading-relaxed mb-2">
                      Онлайн болон бусад цахим төлбөр хийх үед төлбөрийн хэлбэр, гүйлгээний төлөв болон гүйлгээтэй холбоотой шаардлагатай мэдээллийг боловсруулж болно.
                    </p>
                    <div className="p-3 bg-amber-50/80 border border-amber-200/70 rounded-lg text-xs text-amber-900">
                      <strong>Чухал:</strong> Бид банкны картын бүтэн дугаар, CVV/CVC, PIN зэрэг нууцлалтай мэдээллийг өөрийн системд шууд хадгалахгүй бөгөөд төлбөрийг эрх бүхий банк, төлбөрийн үйлчилгээ үзүүлэгчийн хамгаалагдсан системээр дамжуулан гүйцэтгэнэ.
                    </div>
                  </div>

                  {/* 1.5 & 1.6 */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-slate-50/70 p-5 rounded-xl border border-slate-200/60">
                      <h3 className="text-base font-bold text-slate-900 mb-2 text-[#00829d]">
                        1.5. Автоматаар цуглуулагдах техникийн мэдээлэл
                      </h3>
                      <p className="text-xs text-slate-600 mb-3">Вэбсайт, апп ашиглах үед автоматаар бүртгэгдэж болно:</p>
                      <ul className="space-y-1.5 text-xs text-slate-700">
                        <li>• IP хаяг, Төхөөрөмжийн төрөл, Үйлдлийн систем</li>
                        <li>• Вэб хөтөч, Аппликэйшний хувилбар</li>
                        <li>• Нэвтэрсэн огноо, цаг, ашигласан хуудас, функц</li>
                        <li>• Cookie болон төстэй технологи, алдааны бүртгэл</li>
                      </ul>
                    </div>

                    <div className="bg-slate-50/70 p-5 rounded-xl border border-slate-200/60">
                      <h3 className="text-base font-bold text-slate-900 mb-2 text-[#00829d]">
                        1.6. Харилцагчийн үйлчилгээний мэдээлэл
                      </h3>
                      <p className="text-xs text-slate-600 mb-3">Утас, имэйл, чат, сошиал сувгаар харилцах үед:</p>
                      <ul className="space-y-1.5 text-xs text-slate-700">
                        <li>• Таны хүсэлт, асуулт, санал, гомдол</li>
                        <li>• Буцаалт, солилтын хүсэлтийн мэдээлэл</li>
                        <li>• Харилцааны түүх, асуудал шийдвэрлэлтийн тэмдэглэл</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </section>

              {/* 2. МЭДЭЭЛЛИЙГ АШИГЛАХ ЗОРИЛГО */}
              <section id="section-2" className="scroll-mt-28 bg-white rounded-2xl border border-slate-200/80 p-7 sm:p-9 shadow-sm">
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-10 h-10 rounded-xl bg-[#00829d]/10 flex items-center justify-center text-[#00829d] font-bold text-lg">
                    02
                  </div>
                  <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900">
                    2. МЭДЭЭЛЛИЙГ АШИГЛАХ ЗОРИЛГО
                  </h2>
                </div>

                <p className="text-slate-700 leading-relaxed mb-6 text-[15px] sm:text-base">
                  Бид таны мэдээллийг дараах зорилгоор ашиглаж болно.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    {
                      num: '2.1',
                      title: 'Захиалга болон үйлчилгээ үзүүлэх',
                      items: [
                        'Захиалга хүлээн авах, боловсруулах',
                        'Бүтээгдэхүүн хүргэх, төлбөр баталгаажуулах',
                        'Буцаалт, солилт хийх',
                        'Захиалгын төлөвийн талаар мэдээлэх',
                        'Худалдан авалтын баримт болон холбогдох мэдээллийг хүргэх'
                      ]
                    },
                    {
                      num: '2.2',
                      title: 'Loyalty хөтөлбөрийг хэрэгжүүлэх',
                      items: [
                        'Хэрэглэгчийг loyalty хөтөлбөрт бүртгэх',
                        'QR код, утасны дугаараар хэрэглэгчийг таних',
                        'Point тооцох, нэмэх, хасах, үлдэгдлийг харуулах',
                        'Гишүүнчлэлийн түвшинг тодорхойлох, ахих/буурах нөхцөл',
                        'Хөнгөлөлт, купон, voucher олгох болон дүн шинжилгээ'
                      ]
                    },
                    {
                      num: '2.3',
                      title: 'Харилцагчийн үйлчилгээ',
                      items: [
                        'Захиалга, төлбөр, хүргэлт, буцаалтын асуудлаар холбогдох',
                        'Point, гишүүнчлэлтэй холбоотой асуудлаар туслах',
                        'Хэрэглэгчийн санал, гомдлыг хүлээн авч шийдвэрлэх'
                      ]
                    },
                    {
                      num: '2.4',
                      title: 'Маркетинг болон урамшуулал',
                      items: [
                        'Шинэ бүтээгдэхүүн, хямдрал, урамшуулал, купон',
                        'Онцгой санал, арга хэмжээний мэдээлэл хүргэх',
                        'SMS, имэйл, push notification сувгаар хүргэх',
                        '* Хэрэглэгч хүссэн үедээ зөвшөөрлөө цуцлах боломжтой'
                      ]
                    },
                    {
                      num: '2.5',
                      title: 'Хувь хүнд тохирсон санал, үйлчилгээ',
                      items: [
                        'Худалдан авалтын түүх, бүтээгдэхүүний сонирхолд тулгуурлах',
                        'Хэрэглэгчид тохирсон бүтээгдэхүүн, урамшуулал санал болгох'
                      ]
                    },
                    {
                      num: '2.6',
                      title: 'Үйлчилгээ, бизнесийг сайжруулах',
                      items: [
                        'Апп, вэбсайтын ажиллагаа, хэрэглэгчийн туршлагыг сайжруулах',
                        'Эрэлт хэрэгцээг судлах, үйлчилгээний үр дүнг шинжлэх',
                        'Техникийн алдаа доголдлыг илрүүлэх, хөгжүүлэлт хийх'
                      ]
                    }
                  ].map((block, idx) => (
                    <div key={idx} className="bg-slate-50/80 p-5 rounded-xl border border-slate-200/60">
                      <div className="flex items-center gap-2 mb-2.5">
                        <span className="text-xs font-bold px-2 py-0.5 rounded bg-[#00829d] text-white">
                          {block.num}
                        </span>
                        <h4 className="font-bold text-slate-900 text-sm">
                          {block.title}
                        </h4>
                      </div>
                      <ul className="space-y-1.5 text-xs text-slate-600">
                        {block.items.map((it, i) => (
                          <li key={i} className="flex items-start gap-1.5">
                            <span className="text-[#00829d] font-bold">•</span>
                            <span>{it}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>

                {/* 2.7 */}
                <div className="mt-4 p-5 rounded-xl bg-slate-50/80 border border-slate-200/60">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs font-bold px-2 py-0.5 rounded bg-[#00829d] text-white">2.7</span>
                    <h4 className="font-bold text-slate-900 text-sm">Аюулгүй байдал болон зөрчлөөс урьдчилан сэргийлэх</h4>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    Хэрэглэгчийн бүртгэл, point, купон, төлбөр болон бусад үйлчилгээг хууль бусаар ашиглах, залилан, хуурамч бүртгэл, системийн халдлага болон бусад зөрчлөөс урьдчилан сэргийлэх, илрүүлэх, шалгах зорилгоор шаардлагатай мэдээллийг ашиглаж болно.
                  </p>
                </div>
              </section>

              {/* 3. COOKIE БОЛОН ИЖИЛ ТӨСТЭЙ ТЕХНОЛОГИ */}
              <section id="section-3" className="scroll-mt-28 bg-white rounded-2xl border border-slate-200/80 p-7 sm:p-9 shadow-sm">
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-10 h-10 rounded-xl bg-[#00829d]/10 flex items-center justify-center text-[#00829d] font-bold text-lg">
                    03
                  </div>
                  <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900">
                    3. COOKIE БОЛОН ИЖИЛ ТӨСТЭЙ ТЕХНОЛОГИ
                  </h2>
                </div>

                <div className="prose prose-slate max-w-none text-slate-700 leading-relaxed text-[15px] sm:text-base space-y-4">
                  <p>
                    Манай вэбсайт болон цахим үйлчилгээ нь Cookie болон түүнтэй төстэй технологийг ашиглаж болно. Эдгээр технологийг:
                  </p>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-slate-700 pl-0 list-none my-3">
                    {[
                      'Хэрэглэгчийн нэвтрэлтийг хадгалах',
                      'Вэбсайтын үндсэн функцийг ажиллуулах',
                      'Хэрэглэгчийн сонголтыг санах',
                      'Вэбсайт болон аппликэйшний ашиглалтад дүн шинжилгээ хийх',
                      'Үйлчилгээний гүйцэтгэлийг сайжруулах',
                      'Зөвшөөрөгдсөн тохиолдолд хэрэглэгчид тохирсон контент, маркетинг хүргэх'
                    ].map((item, i) => (
                      <li key={i} className="flex items-center gap-2 bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                        <span className="w-2 h-2 rounded-full bg-[#00829d]" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                  <p className="text-sm text-slate-600">
                    Хэрэглэгч өөрийн вэб хөтөч болон төхөөрөмжийн тохиргоогоор Cookie-ийн хэрэглээг удирдах боломжтой. Зарим Cookie-г идэвхгүй болгосноор вэбсайт, аппликэйшний тодорхой функц хэвийн ажиллахгүй байж болно.
                  </p>
                </div>
              </section>

              {/* 4. МЭДЭЭЛЭЛ ХУВААЛЦАХ БОЛОН ДАМЖУУЛАХ */}
              <section id="section-4" className="scroll-mt-28 bg-white rounded-2xl border border-slate-200/80 p-7 sm:p-9 shadow-sm">
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-10 h-10 rounded-xl bg-[#00829d]/10 flex items-center justify-center text-[#00829d] font-bold text-lg">
                    04
                  </div>
                  <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900">
                    4. МЭДЭЭЛЭЛ ХУВААЛЦАХ БОЛОН ДАМЖУУЛАХ
                  </h2>
                </div>

                <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-sm font-medium mb-6 flex items-center gap-2.5">
                  <svg className="w-5 h-5 flex-shrink-0 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Бид таны хувийн мэдээллийг хууль бус зорилгоор гуравдагч этгээдэд худалдах, түрээслэхгүй.</span>
                </div>

                <p className="text-slate-700 leading-relaxed mb-6 text-[15px] sm:text-base">
                  Үйлчилгээ үзүүлэх, гэрээний үүргээ биелүүлэх, хууль тогтоомжийн шаардлага хангах болон энэхүү бодлогод заасан зорилгыг хэрэгжүүлэхэд шаардлагатай тохиолдолд мэдээллийг зөвхөн шаардлагатай хэмжээнд дараах этгээдэд дамжуулж болно:
                </p>

                <div className="space-y-4">
                  {[
                    {
                      tag: '4.1',
                      title: 'Хүргэлтийн үйлчилгээ үзүүлэгч',
                      desc: 'Бүтээгдэхүүн хүргэхэд шаардлагатай нэр, утасны дугаар, хүргэлтийн хаяг, захиалгын мэдээллийг хүргэлтийн үйлчилгээ үзүүлэгчид дамжуулж болно.'
                    },
                    {
                      tag: '4.2',
                      title: 'Банк болон төлбөрийн үйлчилгээ үзүүлэгч',
                      desc: 'Төлбөр боловсруулах, баталгаажуулах, буцаалт хийх болон гүйлгээтэй холбоотой үйлчилгээг үзүүлэхэд шаардлагатай мэдээллийг банк, төлбөрийн үйлчилгээ үзүүлэгчид дамжуулж болно.'
                    },
                    {
                      tag: '4.3',
                      title: 'IT болон системийн үйлчилгээ үзүүлэгч',
                      desc: 'Манай вэбсайт, аппликэйшн, CRM, loyalty system, cloud/server, SMS, имэйл, аналитик болон бусад технологийн үйлчилгээг үзүүлдэг гэрээт үйлчилгээ үзүүлэгчид үйлчилгээг гүйцэтгэхэд шаардлагатай хэмжээнд мэдээлэл боловсруулах боломжтой. Бид мэдээллийн нууцлалыг чанд хадгалах, зохих хамгаалалтын арга хэмжээ авахыг шаардана.'
                    },
                    {
                      tag: '4.4',
                      title: 'Амуулай Группийн харьяа компани, брэнд болон бизнесийн нэгжүүд',
                      desc: 'Үйлчилгээ, хэрэглэгчийн бүртгэл, loyalty хөтөлбөр, маркетинг болон хэрэглэгчийн үйлчилгээг нэгдсэн байдлаар ажиллуулах шаардлагатай тохиолдолд холбогдох хууль тогтоомжийн хүрээнд мэдээллийг Mild Cosmetics, Genki Drugstore, OEO болон Амуулай Группийн бусад холбогдох нэгжийн хүрээнд боловсруулж болно.'
                    },
                    {
                      tag: '4.5',
                      title: 'Бизнесийн бүтцийн өөрчлөлт',
                      desc: 'Компани болон холбогдох бизнесийн нэгжид нэгдэх, нийлэх, өөрчлөн байгуулах, бизнес эсвэл хөрөнгө шилжүүлэх зэрэг бүтцийн өөрчлөлт гарсан тохиолдолд холбогдох хууль тогтоомжийн хүрээнд, хамгаалалтын нөхцөлтэйгээр мэдээлэл шилжиж болно.'
                    },
                    {
                      tag: '4.6',
                      title: 'Эрх бүхий байгууллага',
                      desc: 'Монгол Улсын хууль тогтоомжид заасан үндэслэлээр эрх бүхий төрийн байгууллага, шүүх, хууль сахиулах байгууллагаас хууль ёсны шаардлага ирүүлсэн тохиолдолд шаардлагатай мэдээллийг гаргаж өгч болно.'
                    }
                  ].map((item, i) => (
                    <div key={i} className="p-4 rounded-xl bg-slate-50 border border-slate-200/70">
                      <div className="flex items-center gap-2 mb-1.5">
                        <span className="text-xs font-bold text-[#00829d]">{item.tag}</span>
                        <h4 className="font-bold text-slate-900 text-sm sm:text-base">{item.title}</h4>
                      </div>
                      <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">{item.desc}</p>
                    </div>
                  ))}
                </div>
              </section>

              {/* 5. МЭДЭЭЛЛИЙН АЮУЛГҮЙ БАЙДАЛ */}
              <section id="section-5" className="scroll-mt-28 bg-white rounded-2xl border border-slate-200/80 p-7 sm:p-9 shadow-sm">
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-10 h-10 rounded-xl bg-[#00829d]/10 flex items-center justify-center text-[#00829d] font-bold text-lg">
                    05
                  </div>
                  <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900">
                    5. МЭДЭЭЛЛИЙН АЮУЛГҮЙ БАЙДАЛ
                  </h2>
                </div>

                <div className="text-slate-700 leading-relaxed text-[15px] sm:text-base space-y-4">
                  <p>
                    Компани нь хэрэглэгчийн хувийн мэдээллийг зөвшөөрөлгүй хандах, ашиглах, задруулах, өөрчлөх, алдах, устгах болон бусад эрсдэлээс хамгаалах зорилгоор өөрийн үйл ажиллагаа, системийн онцлог, мэдээллийн төрөлд тохирсон зохистой техникийн болон зохион байгуулалтын хамгаалалтын арга хэмжээ авна.
                  </p>

                  <div className="bg-slate-50 p-5 rounded-xl border border-slate-200/60 my-4">
                    <p className="font-semibold text-slate-800 text-sm mb-3">Хамгаалалтын арга хэмжээнд:</p>
                    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs sm:text-sm text-slate-600">
                      {[
                        'Мэдээлэл дамжуулах үеийн хамгаалалт (SSL/TLS шифрлэлт)',
                        'Систем болон серверийн хамгаалалт',
                        'Хандалтын эрхийн шатлалтай хязгаарлалт',
                        'Нууц үг болон баталгаажуулалтын хамгаалалт',
                        'Мэдээллийн нөөцлөлт (Backup)',
                        'Системийн хяналт болон мониторинг',
                        'Ажилтнуудын мэдээлэлд хандах эрхийн зохицуулалт',
                        'Аюулгүй байдлын зөрчлийг илрүүлэх, хариу арга хэмжээ авах'
                      ].map((item, idx) => (
                        <li key={idx} className="flex items-center gap-2">
                          <svg className="w-4 h-4 text-emerald-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                          </svg>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <p className="text-sm text-slate-600">
                    Интернэт болон цахим системээр мэдээлэл дамжуулах, хадгалах аливаа арга нь эрсдэлийг бүрэн арилгах боломжгүй тул Компани нь мэдээллийн аюулгүй байдлыг хангах зохистой арга хэмжээ авах боловч абсолют буюу 100 хувийн аюулгүй байдлыг баталгаажуулахгүй.
                  </p>

                  <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-sm">
                    <strong>Хэрэглэгчийн үүрэг:</strong> Хэрэглэгч өөрийн бүртгэлийн нэвтрэх мэдээлэл, нууц үг, нэг удаагийн баталгаажуулах код (OTP) болон төхөөрөмжийн аюулгүй байдлыг хамгаалах үүрэгтэй. Хэрэв таны бүртгэлийг зөвшөөрөлгүй ашигласан эсвэл мэдээллийн аюулгүй байдал алдагдсан гэж сэжиглэж байгаа бол бидэнд нэн даруй мэдэгдэнэ үү.
                  </div>
                </div>
              </section>

              {/* 6. МЭДЭЭЛЭЛ ХАДГАЛАХ ХУГАЦАА */}
              <section id="section-6" className="scroll-mt-28 bg-white rounded-2xl border border-slate-200/80 p-7 sm:p-9 shadow-sm">
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-10 h-10 rounded-xl bg-[#00829d]/10 flex items-center justify-center text-[#00829d] font-bold text-lg">
                    06
                  </div>
                  <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900">
                    6. МЭДЭЭЛЭЛ ХАДГАЛАХ ХУГАЦАА
                  </h2>
                </div>

                <div className="prose prose-slate max-w-none text-slate-700 leading-relaxed text-[15px] sm:text-base space-y-4">
                  <p>
                    Бид таны мэдээллийг тухайн мэдээллийг цуглуулсан, боловсруулсан зорилгыг хэрэгжүүлэхэд шаардлагатай хугацаанд болон холбогдох хууль тогтоомжид заасан хугацаанд хадгална.
                  </p>
                  <p>
                    Хадгалах хугацааг тодорхойлохдоо мэдээллийн төрөл, боловсруулах зорилго, хэрэглэгчийн бүртгэл болон үйлчилгээний харилцааны үргэлжлэх хугацаа, хууль тогтоомжийн шаардлага, маргаан шийдвэрлэх болон хууль ёсны ашиг сонирхлыг хамгаалах шаардлагыг харгалзан үзэж болно.
                  </p>
                  <p>
                    Хадгалах шаардлага дууссан тохиолдолд мэдээллийг холбогдох хууль тогтоомж, Компанийн мэдээлэл хадгалах журмын дагуу устгах, таних боломжгүй болгох эсвэл шаардлагатай тохиолдолд архивлана.
                  </p>
                </div>
              </section>

              {/* 7. ХЭРЭГЛЭГЧИЙН ЭРХ */}
              <section id="section-7" className="scroll-mt-28 bg-white rounded-2xl border border-slate-200/80 p-7 sm:p-9 shadow-sm">
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-10 h-10 rounded-xl bg-[#00829d]/10 flex items-center justify-center text-[#00829d] font-bold text-lg">
                    07
                  </div>
                  <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900">
                    7. ХЭРЭГЛЭГЧИЙН ЭРХ
                  </h2>
                </div>

                <p className="text-slate-700 leading-relaxed mb-4 text-[15px] sm:text-base">
                  Та холбогдох хууль тогтоомжийн хүрээнд өөрийн хувийн мэдээлэлтэй холбоотойгоор дараах эрхийг эдэлнэ:
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
                  {[
                    'Өөрийн бүртгэлтэй мэдээлэлтэй танилцах',
                    'Буруу эсвэл дутуу мэдээллийг засах, шинэчлэх',
                    'Хуульд зөвшөөрөгдсөн хүрээнд мэдээллээ устгуулах хүсэлт гаргах',
                    'Өгсөн зөвшөөрлөө хүссэн үедээ цуцлах',
                    'Маркетингийн SMS, имэйл, push notification авахаас татгалзах',
                    'Өөрийн хэрэглэгчийн бүртгэлийг хаалгах',
                    'Мэдээллийг ямар зорилгоор боловсруулж байгааг мэдэх',
                    'Хууль тогтоомжид заасан бусад эрхээ хэрэгжүүлэх'
                  ].map((right, idx) => (
                    <div key={idx} className="flex items-center gap-2.5 p-3 rounded-xl bg-slate-50 border border-slate-200/60 text-xs sm:text-sm text-slate-700">
                      <span className="w-5 h-5 rounded-full bg-[#00829d]/15 text-[#00829d] flex items-center justify-center font-bold text-xs flex-shrink-0">
                        ✓
                      </span>
                      <span>{right}</span>
                    </div>
                  ))}
                </div>

                <div className="text-xs sm:text-sm text-slate-600 leading-relaxed space-y-2 bg-slate-50/60 p-4 rounded-xl border border-slate-200/60">
                  <p>
                    • Холбогдох хүсэлтийг аппликэйшнээр дамжуулан гаргаж болно. Мөн тухайн функц техникийн хувьд боломжгүй бол албан ёсны холбоо барих сувгаар хүсэлт гаргаж болно.
                  </p>
                  <p>
                    • Хэрэглэгчийн хүсэлтийг хүлээн авсны дараа бусдын мэдээлэлд зөвшөөрөлгүй хандахаас сэргийлэх зорилгоор хүсэлт гаргагчийн бичиг баримт, хэн болохыг баталгаажуулах шаардлага тавьж болно.
                  </p>
                  <p>
                    • Мэдээллийг устгуулах хүсэлт гаргасан боловч татвар, санхүү, төлбөр тооцоо, хууль тогтоомж, залилангаас сэргийлэх үндэслэлээр шаардлагатай бол тодорхой мэдээллийг хуулийн хугацаанд хадгална.
                  </p>
                </div>
              </section>

              {/* 8. МАРКЕТИНГИЙН ЗӨВШӨӨРӨЛ */}
              <section id="section-8" className="scroll-mt-28 bg-white rounded-2xl border border-slate-200/80 p-7 sm:p-9 shadow-sm">
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-10 h-10 rounded-xl bg-[#00829d]/10 flex items-center justify-center text-[#00829d] font-bold text-lg">
                    08
                  </div>
                  <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900">
                    8. МАРКЕТИНГИЙН ЗӨВШӨӨРӨЛ
                  </h2>
                </div>

                <div className="prose prose-slate max-w-none text-slate-700 leading-relaxed text-[15px] sm:text-base space-y-4">
                  <p>
                    Маркетингийн мэдээлэл авах нь манай үндсэн бүтээгдэхүүн, үйлчилгээг ашиглах зайлшгүй нөхцөл <strong>биш</strong> байна.
                  </p>
                  <p>
                    Хэрэглэгч маркетингийн мэдээлэл авахыг зөвшөөрсөн тохиолдолд бид SMS, имэйл, push notification болон бусад зөвшөөрсөн сувгаар Mild Cosmetics, Genki Drugstore, OEO болон Амуулай Группийн бусад брэнд, үйлчилгээний хямдрал, урамшуулал, шинэ бүтээгдэхүүний мэдээллийг хүргэж болно.
                  </p>
                  <p>
                    Хэрэглэгч маркетингийн зөвшөөрлөө аппликэйшний notification тохиргоо, имэйлийн unsubscribe функц болон бусад сувгаар хүссэн үедээ цуцалж болно.
                  </p>
                  <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-xs sm:text-sm text-slate-600">
                    * Маркетингийн зөвшөөрлийг цуцалсан нь захиалга, төлбөр, хүргэлт, бүртгэл, аюулгүй байдал зэрэг үндсэн үйлчилгээтэй холбоотой зайлшгүй шаардлагатай мэдэгдэл хүлээн авахад нөлөөлөхгүй.
                  </div>
                </div>
              </section>

              {/* 9. LOYALTY POINT, ГИШҮҮНЧЛЭЛ БОЛОН УРАМШУУЛАЛ */}
              <section id="section-9" className="scroll-mt-28 bg-white rounded-2xl border border-slate-200/80 p-7 sm:p-9 shadow-sm">
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-10 h-10 rounded-xl bg-[#00829d]/10 flex items-center justify-center text-[#00829d] font-bold text-lg">
                    09
                  </div>
                  <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900">
                    9. LOYALTY POINT, ГИШҮҮНЧЛЭЛ БОЛОН УРАМШУУЛАЛ
                  </h2>
                </div>

                <div className="text-slate-700 leading-relaxed text-[15px] sm:text-base space-y-4">
                  <p>
                    Loyalty point, гишүүнчлэлийн түвшин, хөнгөлөлт болон урамшууллын бизнесийн нөхцөлийг тусдаа <strong>“Loyalty хөтөлбөрийн нөхцөл”</strong> (Loyalty Program Terms & Conditions)-өөр зохицуулж болно.
                  </p>
                  <p>
                    Энэхүү Нууцлалын бодлого нь loyalty хөтөлбөрийн хүрээнд хэрэглэгчийн мэдээллийг хэрхэн боловсруулахтай холбоотой асуудлыг зохицуулна.
                  </p>
                  <p className="font-semibold text-slate-800 text-sm">
                    Харин дараах асуудлыг Loyalty хөтөлбөрийн нөхцөлөөр тусгайлан зохицуулна:
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs sm:text-sm text-slate-600 bg-slate-50 p-5 rounded-xl border border-slate-200/60">
                    {[
                      'Point хэрхэн цуглуулах',
                      'Утасны дугаар болон QR кодоор point цуглуулах нөхцөл',
                      'Point хэрхэн зарцуулах, хүчинтэй хугацаа',
                      'Point хүчингүй болох нөхцөл',
                      'Гишүүнчлэлийн түвшин (Tier upgrade/downgrade)',
                      'Хөнгөлөлтийн хувь, купон, voucher',
                      'Худалдан авалтын босго, тусгай урамшуулал',
                      'Mild Cosmetics, Genki, OEO-д point ашиглах боломж',
                      'Брэнд хооронд point цуглуулах, ашиглах нөхцөл',
                      'Өмнөх loyalty системээс шинэ системд шилжих нөхцөл',
                      'Хэрэглэгчийн хуримтлагдсан point-ийг шилжүүлэх',
                      'Loyalty хөтөлбөрөөс гарах болон account хаах нөхцөл'
                    ].map((item, idx) => (
                      <div key={idx} className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#00829d]" />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>

                  <p className="text-xs sm:text-sm text-slate-500">
                    Loyalty хөтөлбөрийн нөхцөл, point, tier, хөнгөлөлтийн хувь болон урамшууллын нөхцөл өөрчлөгдөж болох бөгөөд хэрэглэгчдэд чухал өөрчлөлтийн талаар боломжит сувгаар мэдээлнэ.
                  </p>
                </div>
              </section>

              {/* 10. ГУРАВДАГЧ ТАЛЫН ХОЛБООС БОЛОН ҮЙЛЧИЛГЭЭ */}
              <section id="section-10" className="scroll-mt-28 bg-white rounded-2xl border border-slate-200/80 p-7 sm:p-9 shadow-sm">
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-10 h-10 rounded-xl bg-[#00829d]/10 flex items-center justify-center text-[#00829d] font-bold text-lg">
                    10
                  </div>
                  <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900">
                    10. ГУРАВДАГЧ ТАЛЫН ХОЛБООС БОЛОН ҮЙЛЧИЛГЭЭ
                  </h2>
                </div>

                <div className="prose prose-slate max-w-none text-slate-700 leading-relaxed text-[15px] sm:text-base space-y-3">
                  <p>
                    Манай вэбсайт болон аппликэйшн нь гуравдагч этгээдийн вэбсайт, сошиал медиа, төлбөрийн үйлчилгээ, хүргэлтийн үйлчилгээ болон бусад цахим үйлчилгээ рүү чиглэсэн холбоос агуулж болно.
                  </p>
                  <p>
                    Тухайн гуравдагч этгээдийн үйлчилгээ нь өөрийн нууцлалын бодлого болон үйлчилгээний нөхцөлтэй байж болно.
                  </p>
                  <p>
                    Хэрэглэгч манай платформоос гарч гуравдагч этгээдийн үйлчилгээ рүү шилжсэн тохиолдолд тухайн этгээдийн мэдээлэл боловсруулах үйл ажиллагаанд түүний нууцлалын бодлого болон үйлчилгээний нөхцөл үйлчилнэ.
                  </p>
                </div>
              </section>

              {/* 11. НУУЦЛАЛЫН БОДЛОГЫН ӨӨРЧЛӨЛТ */}
              <section id="section-11" className="scroll-mt-28 bg-white rounded-2xl border border-slate-200/80 p-7 sm:p-9 shadow-sm">
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-10 h-10 rounded-xl bg-[#00829d]/10 flex items-center justify-center text-[#00829d] font-bold text-lg">
                    11
                  </div>
                  <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900">
                    11. НУУЦЛАЛЫН БОДЛОГЫН ӨӨРЧЛӨЛТ
                  </h2>
                </div>

                <div className="prose prose-slate max-w-none text-slate-700 leading-relaxed text-[15px] sm:text-base space-y-3">
                  <p>
                    Бид хууль тогтоомж, технологи, үйлчилгээ, loyalty хөтөлбөр, бизнесийн бүтэц болон үйл ажиллагааны өөрчлөлттэй холбоотойгоор энэхүү Нууцлалын бодлогыг үе үе шинэчилж болно.
                  </p>
                  <p>
                    Бодлогод хэрэглэгчийн эрх, мэдээлэл боловсруулах зорилго, хүрээ болон бусад чухал нөхцөлд нөлөөлөхүйц өөрчлөлт орсон тохиолдолд Вэбсайт, Аппликэйшн, Имэйл, SMS, Push notification болон Салбар дэлгүүрүүдээр хэрэглэгчдэд мэдээлж болно.
                  </p>
                  <p>
                    Шинэчилсэн бодлогын “Сүүлд шинэчилсэн огноо”-г энэхүү баримт бичгийн эхэнд байршуулах бөгөөд нийтлэгдсэн өдрөөс мөрдөгдөнө. Хуулийн дагуу зөвшөөрөл шаардлагатай тохиолдолд зохих зөвшөөрлийг дахин авна.
                  </p>
                </div>
              </section>

              {/* 12. ХОЛБОО БАРИХ */}
              <section id="section-12" className="scroll-mt-28 bg-gradient-to-br from-[#006075] to-[#00829d] text-white rounded-2xl p-7 sm:p-9 shadow-md relative overflow-hidden">
                <div 
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    backgroundImage: "url('/pattern2.png')",
                    backgroundRepeat: 'repeat',
                    backgroundSize: '220px',
                    opacity: 0.1,
                    mixBlendMode: 'overlay',
                  }}
                />

                <div className="relative z-10">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-xl bg-white/15 flex items-center justify-center text-white font-bold text-lg">
                      12
                    </div>
                    <h2 className="text-xl sm:text-2xl font-extrabold uppercase tracking-wide">
                      12. Холбоо барих
                    </h2>
                  </div>

                  <p className="text-white/90 text-sm sm:text-base leading-relaxed mb-6">
                    Энэхүү Нууцлалын бодлого, хувийн мэдээллийн боловсруулалт болон хэрэглэгчийн эрхтэй холбоотой асуулт, хүсэлт, гомдол байвал дараах хаягаар бидэнтэй холбогдоно уу.
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm bg-white/10 backdrop-blur-sm p-6 rounded-xl border border-white/15">
                    <div>
                      <span className="text-white/70 text-xs uppercase tracking-wider block mb-1">
                        Байгууллагын нэр
                      </span>
                      <strong className="text-base text-white">“Амуулай Групп” ХХК</strong>
                    </div>

                    <div>
                      <span className="text-white/70 text-xs uppercase tracking-wider block mb-1">
                        Харьяа брэндүүд
                      </span>
                      <strong className="text-white">Mild Cosmetics, Genki Drugstore, OEO</strong>
                    </div>

                    <div className="sm:col-span-2">
                      <span className="text-white/70 text-xs uppercase tracking-wider block mb-1">
                        Хаяг байршил
                      </span>
                      <p className="text-white/95">
                        Монгол Улс, Улаанбаатар хот, Хан-Уул дүүрэг, 18-р хороо, 19-р хороолол, Park Garden Plaza, 13-р давхар
                      </p>
                    </div>

                    <div>
                      <span className="text-white/70 text-xs uppercase tracking-wider block mb-1">
                        Утас
                      </span>
                      <a href="tel:75339966" className="text-lg font-bold text-white hover:underline">
                        75339966
                      </a>
                    </div>

                    <div>
                      <span className="text-white/70 text-xs uppercase tracking-wider block mb-1">
                        Албан ёсны вэбсайт
                      </span>
                      <a href="https://www.amuulaigroup.mn" target="_blank" rel="noopener noreferrer" className="text-white font-medium hover:underline">
                        www.amuulaigroup.mn
                      </a>
                    </div>
                  </div>

                  <div className="mt-6 pt-4 border-t border-white/15 flex flex-wrap justify-between items-center text-xs text-white/80">
                    <span>Сүүлд шинэчилсэн огноо: <strong>2026 оны 10 дүгээр сарын 01-ны өдөр</strong></span>
                    <span>Амуулай Групп © 2026 он</span>
                  </div>
                </div>
              </section>

            </article>

          </div>
        </div>
      </main>

      <Footer footerItems={footerItems} footerData={footerData} settingData={settingData} />
    </div>
  );
}
