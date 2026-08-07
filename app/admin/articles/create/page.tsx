'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import CKEditorWrapper from '@/components/CKEditorWrapper';

export default function CreateArticlePage() {
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    category: 'ОНЦЛОХ МЭДЭЭ',
    publishDate: new Date().toISOString().split('T')[0],
    coverImage: '/images/corporate_team.png',
    excerpt: '',
    body: `<h2>Нийтлэлийн дэд гарчиг</h2>
<p>Энд Амуулай Группийн шинэ мэдээлэл, үйл явдлын тухай дэлгэрэнгүй агуулгыг <strong>CKEditor</strong> ашиглан найруулан бичнэ үү.</p>
<ul>
  <li>Онцлох үйл явдал 1</li>
  <li>Онцлох үйл явдал 2</li>
</ul>
<blockquote>Хэрэглэгчдэд чанартай, баталгаатай бүтээгдэхүүнийг хүргэх нь бидний эрхэм зорилго юм.</blockquote>`,
  });

  const [isPreview, setIsPreview] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const title = e.target.value;
    const generatedSlug = title
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');
    
    setFormData((prev) => ({
      ...prev,
      title,
      slug: prev.slug === '' ? generatedSlug : prev.slug,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaved(true);
    setTimeout(() => {
      setIsSaved(false);
    }, 4000);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-20">
      {/* Header Bar */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link 
              href="/news" 
              className="text-slate-500 hover:text-slate-900 transition-colors flex items-center text-sm font-medium"
            >
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
              </svg>
              Буцах
            </Link>
            <span className="h-4 w-px bg-slate-300" />
            <h1 className="text-lg font-bold text-slate-800 flex items-center gap-2">
              <span>Мэдээлэл Оруулгах Хэсэг (Article Editor)</span>
              <span className="px-2.5 py-0.5 text-xs font-semibold bg-teal-100 text-teal-800 rounded-full">
                CKEditor 5
              </span>
            </h1>
          </div>

          <div className="flex items-center space-x-3">
            <button
              type="button"
              onClick={() => setIsPreview(!isPreview)}
              className={`px-4 py-2 text-sm font-medium rounded-lg border transition-all flex items-center gap-2 ${
                isPreview
                  ? 'bg-slate-900 text-white border-slate-900'
                  : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
              }`}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              {isPreview ? 'Редактор руу буцах' : 'Урьдчилан харах'}
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              className="px-5 py-2 text-sm font-semibold text-white bg-teal-700 hover:bg-teal-800 active:bg-teal-900 rounded-lg shadow-sm transition-all flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
              Нийтлэлийг нийтлэх
            </button>
          </div>
        </div>
      </header>

      {/* Success Notification */}
      {isSaved && (
        <div className="max-w-7xl mx-auto px-4 mt-4">
          <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 px-4 py-3 rounded-lg flex items-center justify-between shadow-xs">
            <div className="flex items-center space-x-3">
              <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="font-medium text-sm">
                Article мэдээлэл амжилттай хадгалагдлаа! CKEditor-ийн body контент бэлэн боллоо.
              </span>
            </div>
          </div>
        </div>
      )}

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
        {isPreview ? (
          /* Live Article Preview */
          <div className="bg-white rounded-xl border border-slate-200 p-8 shadow-sm max-w-4xl mx-auto">
            <div className="mb-4">
              <span className="inline-block px-3 py-1 bg-teal-50 text-teal-700 text-xs font-bold rounded-md uppercase tracking-wider">
                {formData.category}
              </span>
              <span className="ml-3 text-xs text-slate-400">
                {formData.publishDate}
              </span>
            </div>
            <h1 className="text-3xl font-extrabold text-slate-900 mb-6 leading-snug">
              {formData.title || 'Нийтлэлийн гарчиг...'}
            </h1>
            {formData.coverImage && (
              <div className="relative w-full h-80 rounded-lg overflow-hidden mb-8 bg-slate-100">
                <Image
                  src={formData.coverImage}
                  alt={formData.title}
                  fill
                  className="object-cover"
                />
              </div>
            )}
            {/* Render CKEditor Body Content */}
            <div
              className="prose prose-teal max-w-none text-slate-700 leading-relaxed ck-content-render"
              dangerouslySetInnerHTML={{ __html: formData.body }}
            />
          </div>
        ) : (
          /* Article Form Editor */
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content Form */}
            <div className="lg:col-span-2 space-y-6">
              {/* Title Field */}
              <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-2xs">
                <label className="block text-sm font-semibold text-slate-800 mb-2">
                  Нийтлэлийн гарчиг (Title) <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={handleTitleChange}
                  placeholder="Мэдээний гарчигийг оруулна уу..."
                  className="w-full px-4 py-2.5 text-base border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all outline-none"
                />
              </div>

              {/* Body Field with CKEditor */}
              <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-2xs">
                <div className="flex items-center justify-between mb-3">
                  <label className="block text-sm font-semibold text-slate-800">
                    Үндсэн Агуулга (Body Content - CKEditor) <span className="text-red-500">*</span>
                  </label>
                  <span className="text-xs text-teal-700 bg-teal-50 px-2 py-1 rounded-md font-medium">
                    Rich Text Enabled
                  </span>
                </div>
                
                {/* CKEditor Integration */}
                <CKEditorWrapper
                  value={formData.body}
                  onChange={(newBody) => setFormData((prev) => ({ ...prev, body: newBody }))}
                  placeholder="Нийтлэлийн дэлгэрэнгүй агуулгыг бичнэ үү..."
                  minHeight="380px"
                />
              </div>
            </div>

            {/* Sidebar Meta Settings */}
            <div className="space-y-6">
              {/* Publication Settings */}
              <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-2xs space-y-4">
                <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wide border-b border-slate-100 pb-3">
                  Тохиргоо ба Ангилал
                </h3>

                {/* Category */}
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                    Ангилал (Category)
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none"
                  >
                    <option value="ОНЦЛОХ МЭДЭЭ">ОНЦЛОХ МЭДЭЭ</option>
                    <option value="МЭДЭЭ МЭДЭЭЛЭЛ">МЭДЭЭ МЭДЭЭЛЭЛ</option>
                    <option value="БРЭНД МЭДЭЭ">БРЭНД МЭДЭЭ</option>
                    <option value="ҮЙЛ АЖИЛЛАГАА">ҮЙЛ АЖИЛЛАГАА</option>
                  </select>
                </div>

                {/* Slug */}
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                    Холбоос (Slug)
                  </label>
                  <input
                    type="text"
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    placeholder="article-slug-url"
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none"
                  />
                </div>

                {/* Date */}
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                    Нийтлэх огноо
                  </label>
                  <input
                    type="date"
                    value={formData.publishDate}
                    onChange={(e) => setFormData({ ...formData, publishDate: e.target.value })}
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none"
                  />
                </div>
              </div>

              {/* Cover Image */}
              <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-2xs space-y-4">
                <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wide border-b border-slate-100 pb-3">
                  Ковер Зураг (Cover Image)
                </h3>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                    Зургийн URL
                  </label>
                  <input
                    type="text"
                    value={formData.coverImage}
                    onChange={(e) => setFormData({ ...formData, coverImage: e.target.value })}
                    placeholder="/images/corporate_team.png"
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none"
                  />
                </div>
                {formData.coverImage && (
                  <div className="relative w-full h-40 rounded-lg overflow-hidden border border-slate-200 bg-slate-50">
                    <Image
                      src={formData.coverImage}
                      alt="Cover Preview"
                      fill
                      className="object-cover"
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
