import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { getNavMenu, getFooterMenu, getFooterData, getSettingData, getStrapiMedia } from '@/lib/api';

export const metadata = {
  title: 'Карьер | Амуулай Групп',
  description: 'Амуулай Группт ажиллах орчин, байгууллагын соёл, ажилтанд санал болгодог боломж болон нээлттэй ажлын байруудтай танилцаарай.',
};

export default async function CareersPage() {
  const navItems = await getNavMenu();
  const footerItems = await getFooterMenu();
  const footerData = await getFooterData();
  const settingData = await getSettingData();

  const logoUrl = settingData?.mainLogo?.url 
    ? getStrapiMedia(settingData.mainLogo.url) 
    : (settingData?.whiteLogo?.url ? getStrapiMedia(settingData.whiteLogo.url) : undefined);

  // Sample benefits data
  const benefits = [
    {
      icon: (
        <svg className="w-8 h-8 text-[#00829d]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      title: 'Өрсөлдөхүйц цалин & Урамшуулал',
      desc: 'Үр дүнд суурилсан цалингийн тогтолцоо, гүйцэтгэлийн сар, улирал, жилийн урамшуулалт бонус хөтөлбөр.'
    },
    {
      icon: (
        <svg className="w-8 h-8 text-[#00829d]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
      ),
      title: 'Сургалт & Мэргэшил',
      desc: 'Гадаад, дотоодын мэргэшүүлэх академик сургалтууд, хувь хүний болон ур чадварын байнгын хөгжил.'
    },
    {
      icon: (
        <svg className="w-8 h-8 text-[#00829d]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
        </svg>
      ),
      title: 'Карьер өсөх боломж',
      desc: 'Ил тод, нээлттэй дэвших шатлал. Дотоод шилжилт болон удирдах албан тушаалд дэвших бодит боломжууд.'
    },
    {
      icon: (
        <svg className="w-8 h-8 text-[#00829d]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
        </svg>
      ),
      title: 'Брэндийн хөнгөлөлт',
      desc: 'Амуулай Группийн албан ёсоор оруулж ирдэг 50+ олон улсын брэндийн бараа бүтээгдэхүүний тусгай хөнгөлөлт.'
    },
    {
      icon: (
        <svg className="w-8 h-8 text-[#00829d]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
      ),
      title: 'Эрүүл мэнд & Нийгмийн халамж',
      desc: 'Жил бүрийн эрүүл мэндийн иж бүрэн урьдчилан сэргийлэх үзлэг, ажилтнуудын эрүүл мэндийн даатгал.'
    },
    {
      icon: (
        <svg className="w-8 h-8 text-[#00829d]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      title: 'Багийн аялал & Эвэнтүүд',
      desc: 'Жил бүрийн зуны аялал, шинэ жилийн баяр, Teambuilding болон спорт, урлагийн цогц арга хэмжээнүүд.'
    }
  ];

  // Sample Testimonials
  const testimonials = [
    {
      name: 'Б.Бат-Эрдэнэ',
      role: 'Маркетингийн Албаны Захирал',
      tenure: '6 жил ажиллаж байгаа',
      quote: 'Амуулай Группт ажилласнаар би өөрийгөө өдөр бүр хөгжүүлж, олон улсын шилдэг брэндүүдийн төслүүдийг биечлэн удирдах боломжтой болсон. Энд санал бүрийг сонсдог.',
      image: '/images/who_are_we_mild.jpg'
    },
    {
      name: 'Н.Энхжин',
      role: 'Дистрибьюшн Ахлах Менежер',
      tenure: '4 жил ажиллаж байгаа',
      quote: 'Бүтээлч санааг үргэлж дэмждэг, найрсэг халуун дулаан уур амьсгалтай хамт олон бол манай группийн хамгийн том үнэ цэнэ юм.',
      image: '/images/who_are_we_genki.jpg'
    },
    {
      name: 'Т.Сүхбат',
      role: 'IT & Системийн Архитектор',
      tenure: '3 жил ажиллаж байгаа',
      quote: 'Бид хамгийн сүүлийн үеийн технологи, дижитал инновацийг ашиглаж, өөрсдийн ур чадвараа олон улсын түвшинд ахиулах таатай орчноор хангагддаг.',
      image: '/images/who_are_we_oeo.jpg'
    }
  ];

  // Sample Company Events & Team Activities
  const companyEvents = [
    {
      title: 'Жилийн эцэст зохион байгуулагддаг "Амуулай Кубок" Спорт Наадам',
      category: 'Спорт & Эрүүл Мэнд',
      date: '2025.10.20',
      image: '/images/who_are_we_genki.jpg',
      desc: 'Ажилтнуудынхаа эрүүл мэнд, спортын идэвхийг дэмжих зорилгоор баг хамт олноороо өрсөлддөг уламжлалт спорт наадам.'
    },
    {
      title: 'Зуны Багийн Аялал & Teambuilding Эвэнт',
      category: 'Багийн Аялал',
      date: '2025.07.15',
      image: '/images/who_are_we_main.jpg',
      desc: 'Жил бүр уламжлал болгон байгалийн үзэсгэлэнт газарт баг хамт олноороо амарч, багийн ажиллагаагаа бэхжүүлдэг цугларалт.'
    },
    {
      title: 'Шинэ Жилийн Гала Эвэнт & Оны Шилдгүүд',
      category: 'Баярын Эвэнт',
      date: '2025.12.28',
      image: '/images/who_are_we_mild.jpg',
      desc: 'Оны шилдэг ажилтнуудыг шалгаруулж, хамт олноороо нэгэн үдшийг баяр хөөртэй, дурсгалтай өнгөрүүлдэг Гала эвэнт.'
    },
    {
      title: 'Нийгмийн Хариуцлага & "Эко Амуулай" Мод Тарих Өдөр',
      category: 'CSR & Эко Аян',
      date: '2026.05.12',
      image: '/images/who_are_we_oeo.jpg',
      desc: 'Эх байгальдаа оруулах хувь нэмэр болгон жил бүр ажилтнууд нэгдэн мод тарих, нийгэмд ээлтэй сайн үйлсийн аян зохион байгуулдаг.'
    }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Header navItems={navItems} logoUrl={logoUrl} transparentOnTop={true} />

      {/* 1. HERO SECTION */}
      <section 
        className="relative w-full min-h-[640px] overflow-hidden flex items-center pt-24 pb-16"
        style={{ background: 'linear-gradient(135deg, #001b24 0%, #003340 50%, #004b5c 100%)' }}
      >
        <Image
          src="/images/who_are_we_main.jpg"
          alt="Амуулай Групп Баг Хамт Олон"
          fill
          className="object-cover opacity-25"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#001b24]/95 via-[#002f3b]/85 to-transparent z-10" />

        <div className="container mx-auto px-6 max-w-[1240px] relative z-20">
          <div className="max-w-2xl text-white">
            <span className="inline-block px-4 py-1.5 rounded-full bg-[#00829d]/20 text-cyan-300 text-xs font-bold tracking-widest uppercase mb-4 border border-[#00829d]/30">
              АМУУЛАЙ ГРУПП КАРЬЕР
            </span>
            <h1 className="text-4xl md:text-6xl font-black text-white leading-tight mb-6 tracking-tight">
              Амуулай Группт карьераа бүтээ
            </h1>
            <p className="text-lg md:text-xl text-slate-200 leading-relaxed mb-8 font-normal">
              Ирээдүйгээ бидэнтэй хамт бүтээж, салбартаа тэргүүлэгч мэргэжилтнүүдийн нэг болоорой. Бид таны өсөлт хөгжилт бүрийг чин сэтгэлээсээ дэмжинэ.
            </p>
            <div className="flex flex-wrap gap-4">
              <a
                href="#join-us"
                className="px-8 py-4 bg-[#00829d] hover:bg-[#006b82] text-white font-bold rounded-xl shadow-lg shadow-[#00829d]/30 transition-all duration-300 transform hover:-translate-y-0.5"
              >
                Бидэнтэй нэгдэх
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* STATS STRIP */}
      <section 
        className="text-white py-10 relative overflow-hidden border-b border-[#005c70]"
        style={{
          background: 'linear-gradient(135deg, rgb(0, 130, 157) 0%, #006b82 60%, #005c70 100%)'
        }}
      >
        <div className="container mx-auto px-6 max-w-[1240px]">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div>
              <div className="text-3xl md:text-4xl font-extrabold text-white">500+</div>
              <div className="text-xs md:text-sm text-cyan-100 font-medium uppercase tracking-wider mt-1">Багийн гишүүд</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-extrabold text-white">98%</div>
              <div className="text-xs md:text-sm text-cyan-100 font-medium uppercase tracking-wider mt-1">Ажилтны сэтгэл ханамж</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-extrabold text-white">24+</div>
              <div className="text-xs md:text-sm text-cyan-100 font-medium uppercase tracking-wider mt-1">Жил тасралтгүй өсөлт</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-extrabold text-white">50+</div>
              <div className="text-xs md:text-sm text-cyan-100 font-medium uppercase tracking-wider mt-1">Олон улсын брэнд</div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. WHY AMUULAI (ЯАГААД АМУУЛАЙ ГЭЖ?) */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6 max-w-[1240px]">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-[#00829d] font-extrabold text-xs tracking-widest uppercase mb-2 block">
              ЯАГААД БИДНИЙГ СҮНГЭХ ВЭ?
            </span>
            <h2 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight">
              Яагаад Амуулай Групп гэж?
            </h2>
            <p className="text-slate-600 text-base mt-4 leading-relaxed">
              Бид зөвхөн ажлын байр санал болгоод зогсохгүй, таны мэргэшлийн ба хувь хүний үнэ цэнийг нэмэгдүүлэгч таатай орчинг бүрдүүлдэг.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="p-8 rounded-2xl bg-slate-50 border border-slate-100 hover:border-[#00829d]/40 hover:shadow-xl transition-all duration-300 group">
              <div className="w-14 h-14 rounded-xl bg-[#00829d]/10 text-[#00829d] flex items-center justify-center text-2xl font-bold mb-6 group-hover:scale-110 transition-transform">
                🏛️
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Байгууллагын соёл</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Нээлттэй, ил тод, бие биенээ хүндэтгэж дэмждэг найрсаг хамт олон болон байгууллагын эерэг соёл.
              </p>
            </div>

            <div className="p-8 rounded-2xl bg-slate-50 border border-slate-100 hover:border-[#00829d]/40 hover:shadow-xl transition-all duration-300 group">
              <div className="w-14 h-14 rounded-xl bg-[#00829d]/10 text-[#00829d] flex items-center justify-center text-2xl font-bold mb-6 group-hover:scale-110 transition-transform">
                🚀
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Хөгжих боломж</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Тогтмол явагддаг сургалт хөтөлбөрүүд, менторшип болон карьерын дэвшилтэт шатлалууд.
              </p>
            </div>

            <div className="p-8 rounded-2xl bg-slate-50 border border-slate-100 hover:border-[#00829d]/40 hover:shadow-xl transition-all duration-300 group">
              <div className="w-14 h-14 rounded-xl bg-[#00829d]/10 text-[#00829d] flex items-center justify-center text-2xl font-bold mb-6 group-hover:scale-110 transition-transform">
                🤝
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Эрч хүчтэй баг</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Шинийг санаачлагч, залуулаг, өндөр бүтээмжтэй нэгэн зорилгын дор нэгдсэн гар сэтгэл нийлсэн баг.
              </p>
            </div>

            <div className="p-8 rounded-2xl bg-slate-50 border border-slate-100 hover:border-[#00829d]/40 hover:shadow-xl transition-all duration-300 group">
              <div className="w-14 h-14 rounded-xl bg-[#00829d]/10 text-[#00829d] flex items-center justify-center text-2xl font-bold mb-6 group-hover:scale-110 transition-transform">
                🎁
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Ажилтны хангамж</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Өрсөлдөхүйц цалин хөлс, гүйцэтгэлийн бонус, эрүүл мэндийн болон нийгмийн иж бүрэн халамжийн багц.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. WORK ENVIRONMENT (АЖИЛЛАХ ОРЧИН) */}
      <section 
        className="py-20 text-white relative overflow-hidden border-t border-[#00829d]/20"
        style={{ background: 'linear-gradient(180deg, #00222b 0%, #003745 50%, #00222b 100%)' }}
      >
        <div className="container mx-auto px-6 max-w-[1240px]">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-[#00829d] font-extrabold text-xs tracking-widest uppercase mb-2 block">
              АЖИЛЛАХ ОРЧИН & БАГИЙН СУРАГ
            </span>
            <h2 className="text-3xl md:text-4xl font-black text-white tracking-tight">
              Манай ажиллах орчин
            </h2>
            <p className="text-slate-300 text-base mt-4 leading-relaxed">
              Орчин үеийн тав тухтай оффис, бүтээлч байдлыг дэмжсэн орон зай болон багийн халуун дулаан уур амьсгал.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="relative h-80 rounded-2xl overflow-hidden shadow-2xl group border border-slate-800">
              <Image
                src="/images/who_are_we_main.jpg"
                alt="Оффис ажиллах орчин"
                fill
                className="object-cover group-hover:scale-110 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
              <div className="absolute bottom-6 left-6 right-6">
                <span className="text-xs text-[#00829d] font-bold uppercase">Орчин үеийн Оффис</span>
                <h4 className="text-lg font-bold text-white mt-1">Бүтээлч Ажлын Орон Зай</h4>
              </div>
            </div>

            <div className="relative h-80 rounded-2xl overflow-hidden shadow-2xl group border border-slate-800">
              <Image
                src="/images/who_are_we_mild.jpg"
                alt="Багийн уулзалт"
                fill
                className="object-cover group-hover:scale-110 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
              <div className="absolute bottom-6 left-6 right-6">
                <span className="text-xs text-[#00829d] font-bold uppercase">Хамтын Ажиллагаа</span>
                <h4 className="text-lg font-bold text-white mt-1">Багийн Хурлууд ба Хамтын Сэтгэлгээ</h4>
              </div>
            </div>

            <div className="relative h-80 rounded-2xl overflow-hidden shadow-2xl group border border-slate-800">
              <Image
                src="/images/who_are_we_genki.jpg"
                alt="Салбар дэлгүүрийн ажилтнууд"
                fill
                className="object-cover group-hover:scale-110 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
              <div className="absolute bottom-6 left-6 right-6">
                <span className="text-xs text-[#00829d] font-bold uppercase">Салбарын Хамт Олон</span>
                <h4 className="text-lg font-bold text-white mt-1">Жижиглэн Худалдаа ба Дистрибьюшн Баг</h4>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. EMPLOYEE BENEFITS (АЖИЛТНЫ ДАВУУ ТАЛУУД) */}
      <section className="py-20 bg-slate-50">
        <div className="container mx-auto px-6 max-w-[1240px]">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-[#00829d] font-extrabold text-xs tracking-widest uppercase mb-2 block">
              ХАНГАМЖ & ХӨНГӨЛӨЛТ
            </span>
            <h2 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight">
              Ажилтны давуу талууд
            </h2>
            <p className="text-slate-600 text-base mt-4 leading-relaxed">
              Бид ажилтнуудынхаа сайн сайхан байдал, ажил амьдралын тэнцвэрт байдлыг хангах иж бүрэн хангамжийг санал болгодог.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {benefits.map((b, idx) => (
              <div key={idx} className="bg-white p-8 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow">
                <div className="w-12 h-12 rounded-xl bg-[#00829d]/10 flex items-center justify-center mb-6">
                  {b.icon}
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">{b.title}</h3>
                <p className="text-slate-600 text-sm leading-relaxed">{b.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. TESTIMONIALS (АЖИЛТНУУДЫН СЭТГЭГДЭЛ) */}
      <section className="py-20 bg-white border-t border-slate-100">
        <div className="container mx-auto px-6 max-w-[1240px]">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-[#00829d] font-extrabold text-xs tracking-widest uppercase mb-2 block">
              БҮТЭЭГЧДИЙН СҮРТ СОЁЛ
            </span>
            <h2 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight">
              Ажилтнуудын сэтгэгдэл
            </h2>
            <p className="text-slate-600 text-base mt-4 leading-relaxed">
              Манай багийн гишүүд Амуулай Группт ажилласан туршлага болон карьерын өсөлтийн талаарх сэтгэгдлээсээ хуваалцаж байна.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((t, idx) => (
              <div key={idx} className="bg-slate-50 p-8 rounded-3xl border border-slate-200/80 hover:border-[#00829d]/30 hover:shadow-xl transition-all duration-300 flex flex-col justify-between relative group">
                <div>
                  <div className="text-[#00829d] text-5xl font-serif mb-4 leading-none">&ldquo;</div>
                  <p className="text-slate-700 text-sm md:text-base leading-relaxed mb-8 italic font-normal">
                    {t.quote}
                  </p>
                </div>
                <div className="flex items-center gap-5 pt-6 border-t border-slate-200/80">
                  <div className="relative w-20 h-20 rounded-2xl overflow-hidden border-2 border-[#00829d] shadow-md flex-shrink-0 group-hover:scale-105 transition-transform duration-300">
                    <Image src={t.image} alt={t.name} fill className="object-cover" />
                  </div>
                  <div>
                    <h4 className="text-lg font-extrabold text-slate-900">{t.name}</h4>
                    <p className="text-xs text-[#00829d] font-bold mt-0.5">{t.role}</p>
                    <span className="text-xs text-slate-400 font-medium mt-1 block">{t.tenure}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. COMPANY EVENTS SECTION (АЖИЛТНУУДЫН ДУНД БОЛСОН АРГА ХЭМЖЭЭ, ҮЙЛ ЯВДЛУУД) */}
      <section className="py-20 bg-slate-50 border-t border-slate-200/60">
        <div className="container mx-auto px-6 max-w-[1240px]">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="inline-block px-4 py-1.5 rounded-full bg-[#00829d]/10 text-[#00829d] font-extrabold text-xs tracking-widest uppercase mb-3 border border-[#00829d]/20">
              🎉 ХАМТ ОЛОН & АРГА ХЭМЖЭЭ
            </span>
            <h2 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight">
              Ажилтнуудын дунд болсон арга хэмжээ, үйл явдлууд
            </h2>
            <p className="text-slate-600 text-base mt-4 leading-relaxed">
              Амуулай Группийн ажилтнуудын идэвхтэй амьдрал, багийн аялал, спорт, урлаг болон нийгмийн хариуцлагын арга хэмжээнүүдээс.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {companyEvents.map((ev, idx) => (
              <div 
                key={idx}
                className="bg-white rounded-2xl overflow-hidden border border-slate-200/80 shadow-sm hover:shadow-xl transition-all duration-300 group flex flex-col justify-between"
              >
                <div>
                  <div className="relative h-48 w-full overflow-hidden">
                    <Image
                      src={ev.image}
                      alt={ev.title}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute top-3 left-3 bg-[#00829d] text-white text-[11px] font-extrabold px-3 py-1 rounded-full shadow-md">
                      {ev.category}
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="text-xs text-gray-400 font-medium mb-2 flex items-center gap-1.5">
                      <span>🗓️</span>
                      <span>{ev.date}</span>
                    </div>
                    <h3 className="text-base font-bold text-slate-900 mb-2 leading-snug group-hover:text-[#00829d] transition-colors line-clamp-2">
                      {ev.title}
                    </h3>
                    <p className="text-slate-600 text-xs leading-relaxed line-clamp-3">
                      {ev.desc}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. OPEN VACANCIES BANNER MATCHING REFERENCE SCREENSHOT */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-6 max-w-[1240px]">
          <a
            href="https://www.zangia.mn"
            target="_blank"
            rel="noopener noreferrer"
            className="group block relative w-full rounded-2xl md:rounded-3xl p-6 sm:p-8 md:px-12 md:py-8 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 overflow-hidden"
            style={{
              background: 'linear-gradient(135deg, rgb(0, 130, 157) 0%, #006b82 60%, #005c70 100%)',
              boxShadow: '0 20px 40px rgba(0, 130, 157, 0.28)'
            }}
          >
            <div className="flex flex-col sm:flex-row items-center justify-between gap-6 relative z-10">
              
              {/* LEFT LOGO */}
              <div className="flex-shrink-0">
                {logoUrl ? (
                  <Image
                    src={logoUrl}
                    alt="Amuulai Logo"
                    width={140}
                    height={40}
                    className="object-contain max-h-10 w-auto brightness-0 invert opacity-95"
                  />
                ) : (
                  <span className="text-white font-extrabold text-lg tracking-wider">AMUULAI</span>
                )}
              </div>

              {/* CENTER TITLE MATCHING REFERENCE IMAGE */}
              <div className="text-center flex-grow px-4">
                <h3 className="text-xl sm:text-2xl md:text-3xl font-black text-white uppercase tracking-wide leading-tight drop-shadow-sm">
                  АМУУЛАЙ ГРУПП - НЭЭЛТТЭЙ АЖЛЫН
                  <span className="block mt-1">БАЙРУУД</span>
                </h3>
              </div>

              {/* RIGHT CIRCULAR ARROW BUTTON */}
              <div className="flex-shrink-0">
                <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full border border-white/40 bg-white/10 group-hover:bg-white flex items-center justify-center text-white group-hover:text-[#00829d] transition-all duration-300 shadow-md">
                  <svg className="w-6 h-6 transform group-hover:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </div>
              </div>

            </div>
          </a>
        </div>
      </section>

      {/* 7. CTA SECTION (БИДЭНТЭЙ НЭГДЭХ / ШИНЭ БОЛОМЖУУД) */}
      <section 
        id="join-us" 
        className="py-20 text-white relative overflow-hidden border-t border-[#00829d]/20"
        style={{ background: 'linear-gradient(180deg, #001f28 0%, #003440 50%, #001f28 100%)' }}
      >
        {/* Glowing Background Orbs */}
        <div className="absolute top-1/2 left-1/4 -translate-y-1/2 -translate-x-1/2 w-96 h-96 bg-[#00829d]/20 blur-3xl rounded-full pointer-events-none" />
        <div className="absolute top-1/2 right-1/4 -translate-y-1/2 translate-x-1/2 w-96 h-96 bg-cyan-500/15 blur-3xl rounded-full pointer-events-none" />

        <div className="container mx-auto px-6 max-w-[1240px] relative z-10">
          <div 
            className="rounded-3xl p-10 md:p-16 text-center relative overflow-hidden shadow-2xl border border-white/15"
            style={{
              background: 'linear-gradient(135deg, rgb(0, 130, 157) 0%, #005c70 50%, #004554 100%)',
              boxShadow: '0 25px 50px -12px rgba(0, 130, 157, 0.35)'
            }}
          >
            {/* Background Pattern */}
            <div 
              className="absolute inset-0 opacity-15 pointer-events-none"
              style={{
                backgroundImage: "url('/pattern2.png')",
                backgroundRepeat: 'repeat',
                backgroundSize: '200px'
              }}
            />

            <div className="relative z-10 max-w-3xl mx-auto">
              <span className="inline-block px-4 py-1.5 rounded-full bg-white/15 text-cyan-200 font-extrabold text-xs tracking-widest uppercase mb-4 border border-white/20 backdrop-blur-md">
                ✨ ШИНЭ БОЛОМЖУУД
              </span>
              <h2 className="text-3xl md:text-5xl font-black text-white mb-6 tracking-tight drop-shadow-sm">
                Бидэнтэй нэгдэхэд бэлэн үү?
              </h2>
              <p className="text-slate-100 text-base md:text-lg max-w-2xl mx-auto mb-10 leading-relaxed font-normal opacity-95">
                Хэрэв та өөрийн нөөц бололцоог бүрэн дайчилж, салбартаа манлайлагч багтай мөр зэрэгцэн ажиллахыг хүсвэл CV анкетаа бидэнд илгээгээрэй.
              </p>

              <div className="flex flex-wrap items-center justify-center gap-5">
                <a
                  href="mailto:hr@anungoo.mn"
                  className="px-8 py-4 bg-white text-[#00829d] font-extrabold rounded-2xl shadow-xl hover:bg-slate-100 transition-all transform hover:-translate-y-1 flex items-center gap-2"
                >
                  <span className="text-lg">✉️</span>
                  <span>hr@anungoo.mn рүү CV явуулах</span>
                </a>
                <a
                  href="tel:+97677115511"
                  className="px-8 py-4 bg-slate-950/50 hover:bg-slate-950/80 text-white font-bold rounded-2xl border border-white/30 backdrop-blur-md transition-all flex items-center gap-2"
                >
                  <span className="text-lg">📞</span>
                  <span>(+976) 7711-5511</span>
                </a>
              </div>
            </div>

          </div>
        </div>
      </section>

      <Footer footerItems={footerItems} footerData={footerData} settingData={settingData} />
    </div>
  );
}
