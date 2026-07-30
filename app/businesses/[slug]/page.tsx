import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { getBusinessBySlug } from '@/lib/api';

import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { getNavMenu, getSettingData, getStrapiMedia } from '@/lib/api';

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

const fallbackBusinessData: Record<string, any> = {
  'mild-cosmetics': {
    name: 'Mild Cosmetics',
    slogan: 'Япон, Солонгос улсын №1 гоо сайхны брэндүүдийг Монголд',
    description: `Mild Cosmetics нь 2008 оноос хойш Монгол улсын хэрэглэгчдэд Япон болон Солонгос улсын нэр хүнд бүхий гоо сайхан, арьс арчилгаа, бие арчилгааны шилдэг брэндүүдийг албан ёсны дистрибьюторын эрхтэйгээр нийлүүлж байна. 

Бид хэрэглэгчдийнхээ эрүүл мэнд, гоо сайханд 100% баталгаатай, оригнал бүтээгдэхүүнийг хүргэхийг гол зорилгоо болгон ажилладаг. Сүлжээ дэлгүүрүүд болон онлайн платформдоо 1000 гаруй нэр төрлийн бараа бүтээгдэхүүнийг борлуулж байна.`,
    coverImage: '/images/mild_store_front_1783644603936.png',
    infographicImage: '/images/mild_shelf_1783644620504.png',
    gallery: [
      '/images/mild_checkout_1783644612305.png',
      '/images/corporate_team.png',
    ],
    contactPhone: '+976 7711-8899',
    contactWebsite: 'https://mild.mn',
    contactAddress: 'Улаанбаатар хот, Сүхбаатар дүүрэг, Амуулай Тауэр, 5 давхар',
  },
};

export default async function BusinessDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const fetchedBusiness = await getBusinessBySlug(slug);
  const navItems = await getNavMenu();
  const settingData = await getSettingData();
  const logoUrl = settingData?.mainLogo?.url 
    ? getStrapiMedia(settingData.mainLogo.url) 
    : (settingData?.whiteLogo?.url ? getStrapiMedia(settingData.whiteLogo.url) : undefined);

  const business = fetchedBusiness?.attributes || fallbackBusinessData[slug] || {
    name: slug.toUpperCase().replace('-', ' '),
    slogan: 'Амуулай Группийн салбар бизнес',
    description: `${slug} салбарын дэлгэрэнгүй мэдээлэл. Бид чанартай бүтээгдэхүүн үйлчилгээг хэрэглэгчдэдээ нийлүүлдэг.`,
    coverImage: '/images/why_amuulai_main.png',
    infographicImage: '/images/corporate_team.png',
    gallery: ['/images/why_amuulai_main.png', '/images/corporate_team.png'],
    contactPhone: '+976 7711-8899',
    contactWebsite: 'https://amuulai.mn',
    contactAddress: 'Улаанбаатар хот, Амуулай Тауэр',
  };

  return (
    <>
      <Header navItems={navItems} logoUrl={logoUrl} />
      <div className="bg-slate-50 min-h-screen pt-28 pb-12 lg:pb-20">
        <div className="max-w-[1320px] mx-auto px-6">
          {/* Breadcrumb Navigation */}
          <div className="mb-8 flex items-center gap-2 text-sm text-gray-500 font-medium">
            <Link href="/" className="hover:text-[#00829d] transition-colors">
              Нүүр
            </Link>
            <span>/</span>
            <Link href="/#businesses" className="hover:text-[#00829d] transition-colors">
              Бизнесүүд
            </Link>
            <span>/</span>
            <span className="text-gray-900 font-bold">{business.name}</span>
          </div>

          {/* 2-Column Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            {/* Left Column */}
            <div className="lg:col-span-7 flex flex-col gap-8">
              <div>
                <span className="bg-[#00829d]/10 text-[#00829d] px-4 py-1.5 rounded-full text-xs font-bold inline-block mb-3">
                  Амуулай Бизнес
                </span>
                <h1 className="text-3xl lg:text-5xl font-extrabold text-gray-900 mb-4 leading-tight">
                  {business.name}
                </h1>
                {business.slogan && (
                  <p className="text-xl font-semibold text-[#00829d] italic leading-relaxed">
                    "{business.slogan}"
                  </p>
                )}
              </div>

              {/* Rich Text Description */}
              <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed whitespace-pre-line bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
                {business.description}
              </div>

              {/* Infographic Image at Bottom */}
              {business.infographicImage && (
                <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">Инфографик & Үзүүлэлт</h3>
                  <div className="relative w-full h-80 lg:h-96 rounded-2xl overflow-hidden">
                    <Image
                      src={business.infographicImage}
                      alt={`${business.name} Infographic`}
                      fill
                      className="object-cover"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Right Column */}
            <div className="lg:col-span-5 flex flex-col gap-8 sticky top-8">
              {/* Large Cover Image */}
              <div className="relative w-full h-80 rounded-3xl overflow-hidden shadow-md">
                <Image
                  src={business.coverImage}
                  alt={business.name}
                  fill
                  className="object-cover"
                />
              </div>

              {/* 2-Image Gallery */}
              {business.gallery && business.gallery.length > 0 && (
                <div className="grid grid-cols-2 gap-4">
                  {business.gallery.slice(0, 2).map((imgUrl: string, idx: number) => (
                    <div key={idx} className="relative h-40 rounded-2xl overflow-hidden shadow-sm">
                      <Image
                        src={imgUrl}
                        alt={`${business.name} gallery ${idx + 1}`}
                        fill
                        className="object-cover hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  ))}
                </div>
              )}

              {/* Dark Box with Contact Info */}
              <div className="bg-slate-900 text-white rounded-3xl p-8 shadow-xl border border-slate-800">
                <h3 className="text-xl font-bold mb-6 text-white border-b border-slate-800 pb-4">
                  Холбоо барих
                </h3>
                <div className="flex flex-col gap-4 text-sm text-slate-300">
                  {business.contactPhone && (
                    <div className="flex items-center gap-3">
                      <span className="text-[#00829d] font-bold">Утас:</span>
                      <a href={`tel:${business.contactPhone}`} className="hover:text-white transition-colors">
                        {business.contactPhone}
                      </a>
                    </div>
                  )}
                  {business.contactWebsite && (
                    <div className="flex items-center gap-3">
                      <span className="text-[#00829d] font-bold">Вэбсайт:</span>
                      <a
                        href={business.contactWebsite}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-white transition-colors underline"
                      >
                        {business.contactWebsite}
                      </a>
                    </div>
                  )}
                  {business.contactAddress && (
                    <div className="flex items-start gap-3">
                      <span className="text-[#00829d] font-bold shrink-0">Хаяг:</span>
                      <span className="leading-normal">{business.contactAddress}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
