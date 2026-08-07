'use client';

import React, { useState, useRef } from 'react';

interface CKEditorWrapperProps {
  value: string;
  onChange: (data: string) => void;
  placeholder?: string;
  minHeight?: string;
}

export default function CKEditorWrapper({
  value,
  onChange,
  placeholder = 'Агуулгаа энд оруулна уу...',
  minHeight = '350px',
}: CKEditorWrapperProps) {
  const [activeTab, setActiveTab] = useState<'editor' | 'preview'>('editor');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const insertTag = (startTag: string, endTag: string = '', defaultText: string = '') => {
    const textarea = textareaRef.current;
    if (!textarea) {
      onChange((value || '') + `${startTag}${defaultText}${endTag}`);
      return;
    }

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const currentVal = value || '';
    const selectedText = currentVal.substring(start, end) || defaultText;
    const replacement = `${startTag}${selectedText}${endTag}`;

    const newValue = currentVal.substring(0, start) + replacement + currentVal.substring(end);
    onChange(newValue);

    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + startTag.length, start + startTag.length + selectedText.length);
    }, 10);
  };

  return (
    <div className="ckeditor-custom-wrapper border border-slate-300 rounded-xl overflow-hidden bg-white shadow-xs">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-2 p-2.5 bg-slate-50 border-b border-slate-200">
        <div className="flex flex-wrap items-center gap-1.5">
          <button
            type="button"
            onClick={() => insertTag('<h2>', '</h2>', 'Дэд гарчиг 2')}
            className="px-2.5 py-1 text-xs font-bold text-slate-700 bg-white border border-slate-200 rounded hover:bg-slate-100 transition-colors"
            title="Heading 2"
          >
            H2
          </button>
          <button
            type="button"
            onClick={() => insertTag('<h3>', '</h3>', 'Дэд гарчиг 3')}
            className="px-2.5 py-1 text-xs font-bold text-slate-700 bg-white border border-slate-200 rounded hover:bg-slate-100 transition-colors"
            title="Heading 3"
          >
            H3
          </button>
          <div className="h-4 w-px bg-slate-300 mx-1" />
          <button
            type="button"
            onClick={() => insertTag('<strong>', '</strong>', 'Өргөн текст')}
            className="px-2.5 py-1 text-xs font-bold text-slate-800 bg-white border border-slate-200 rounded hover:bg-slate-100 transition-colors"
            title="Bold"
          >
            <b>B</b>
          </button>
          <button
            type="button"
            onClick={() => insertTag('<em>', '</em>', 'Хэвтээ текст')}
            className="px-2.5 py-1 text-xs italic font-serif text-slate-800 bg-white border border-slate-200 rounded hover:bg-slate-100 transition-colors"
            title="Italic"
          >
            <i>I</i>
          </button>
          <div className="h-4 w-px bg-slate-300 mx-1" />
          <button
            type="button"
            onClick={() => insertTag('<ul>\n  <li>', '</li>\n  <li>Нэгж 2</li>\n</ul>', 'Жагсаалт 1')}
            className="px-2.5 py-1 text-xs font-medium text-slate-700 bg-white border border-slate-200 rounded hover:bg-slate-100 transition-colors flex items-center gap-1"
            title="Bullet List"
          >
            • Жагсаалт
          </button>
          <button
            type="button"
            onClick={() => insertTag('<blockquote>', '</blockquote>', 'Ишлэл текст...')}
            className="px-2.5 py-1 text-xs font-medium text-slate-700 bg-white border border-slate-200 rounded hover:bg-slate-100 transition-colors"
            title="Quote"
          >
            “Ишлэл”
          </button>
        </div>

        {/* Tab Toggle (Editor / Preview) */}
        <div className="flex items-center bg-slate-200 p-0.5 rounded-lg text-xs font-medium">
          <button
            type="button"
            onClick={() => setActiveTab('editor')}
            className={`px-3 py-1 rounded-md transition-all ${
              activeTab === 'editor' ? 'bg-white text-slate-900 shadow-xs font-bold' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Редактор
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('preview')}
            className={`px-3 py-1 rounded-md transition-all ${
              activeTab === 'preview' ? 'bg-white text-slate-900 shadow-xs font-bold' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Урьдчилан харах
          </button>
        </div>
      </div>

      {/* Editor Content Area */}
      {activeTab === 'editor' ? (
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          style={{ minHeight }}
          className="w-full p-4 text-base text-slate-800 bg-white border-0 outline-none resize-y font-mono leading-relaxed focus:ring-0"
        />
      ) : (
        <div
          style={{ minHeight }}
          className="p-5 bg-white text-slate-800 overflow-y-auto prose max-w-none ck-content-render"
          dangerouslySetInnerHTML={{ __html: value || '<p class="text-slate-400 italic">Агуулга хоосон байна...</p>' }}
        />
      )}

      {/* Embedded CKEditor Styles */}
      <style dangerouslySetInnerHTML={{ __html: `
        .ck-content-render h2 {
          font-size: 1.5rem !important;
          font-weight: 800 !important;
          color: #0f172a !important;
          margin-top: 1.25rem !important;
          margin-bottom: 0.75rem !important;
        }
        .ck-content-render h3 {
          font-size: 1.25rem !important;
          font-weight: 700 !important;
          color: #1e293b !important;
          margin-top: 1rem !important;
          margin-bottom: 0.5rem !important;
        }
        .ck-content-render p {
          margin-bottom: 1rem !important;
          line-height: 1.75 !important;
        }
        .ck-content-render blockquote {
          border-left: 4px solid #00829d !important;
          background-color: #f0fdfa !important;
          padding: 12px 18px !important;
          margin: 16px 0 !important;
          border-radius: 0 8px 8px 0 !important;
          font-style: italic !important;
          color: #0f766e !important;
        }
        .ck-content-render ul {
          list-style-type: disc !important;
          padding-left: 1.5rem !important;
          margin-bottom: 1rem !important;
        }
        .ck-content-render li {
          margin-bottom: 0.25rem !important;
        }
      ` }} />
    </div>
  );
}
