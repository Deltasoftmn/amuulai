'use client';

import React, { useEffect, useState, useRef } from 'react';

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
  const [editorLoaded, setEditorLoaded] = useState(false);
  const editorRef = useRef<{ CKEditor: any; ClassicEditor: any } | null>(null);

  useEffect(() => {
    let isMounted = true;
    Promise.all([
      import('@ckeditor/ckeditor5-react'),
      import('@ckeditor/ckeditor5-build-classic'),
    ])
      .then(([reactEditor, classicEditor]) => {
        if (isMounted) {
          editorRef.current = {
            CKEditor: reactEditor.CKEditor,
            ClassicEditor: classicEditor.default || classicEditor,
          };
          setEditorLoaded(true);
        }
      })
      .catch((err) => {
        console.error('Failed to load CKEditor component:', err);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  if (!editorLoaded || !editorRef.current) {
    return (
      <div
        style={{
          minHeight,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          border: '2px dashed #cbd5e1',
          borderRadius: '10px',
          backgroundColor: '#f8fafc',
          color: '#64748b',
          padding: '30px',
          gap: '12px',
        }}
      >
        <div
          style={{
            width: '32px',
            height: '32px',
            border: '3px solid #cbd5e1',
            borderTopColor: '#00829d',
            borderRadius: '50%',
            animation: 'ck-spin 0.8s linear infinite',
          }}
        />
        <span style={{ fontSize: '14px', fontWeight: '500', color: '#475569' }}>
          CKEditor ачаалж байна...
        </span>
        <style jsx>{`
          @keyframes ck-spin {
            0% {
              transform: rotate(0deg);
            }
            100% {
              transform: rotate(360deg);
            }
          }
        `}</style>
      </div>
    );
  }

  const { CKEditor: CKEditorComponent, ClassicEditor } = editorRef.current;

  return (
    <div className="ckeditor-custom-wrapper">
      <CKEditorComponent
        editor={ClassicEditor}
        data={value}
        config={{
          placeholder: placeholder,
          toolbar: [
            'heading',
            '|',
            'bold',
            'italic',
            'link',
            'bulletedList',
            'numberedList',
            '|',
            'outdent',
            'indent',
            '|',
            'blockQuote',
            'insertTable',
            'undo',
            'redo',
          ],
        }}
        onChange={(_event: any, editor: any) => {
          const data = editor.getData();
          onChange(data);
        }}
      />
      <style jsx global>{`
        .ckeditor-custom-wrapper .ck-editor__editable_inline {
          min-height: ${minHeight};
          max-height: 650px;
          border-bottom-left-radius: 8px !important;
          border-bottom-right-radius: 8px !important;
          font-size: 16px;
          line-height: 1.75;
          color: #1e293b;
          padding: 16px 20px !important;
        }
        .ckeditor-custom-wrapper .ck-toolbar {
          border-top-left-radius: 8px !important;
          border-top-right-radius: 8px !important;
          background-color: #f8fafc !important;
          border-color: #e2e8f0 !important;
          padding: 6px 10px !important;
        }
        .ckeditor-custom-wrapper .ck.ck-editor__main > .ck-editor__editable:not(.ck-focused) {
          border-color: #e2e8f0 !important;
        }
        .ckeditor-custom-wrapper .ck.ck-editor__editable.ck-focused:not(.ck-editor__nested-editable) {
          border-color: #00829d !important;
          box-shadow: 0 0 0 3px rgba(0, 130, 157, 0.15) !important;
        }
        .ckeditor-custom-wrapper .ck-content h2 {
          font-size: 1.5rem;
          font-weight: 700;
          margin-top: 1.2rem;
          margin-bottom: 0.6rem;
          color: #0f172a;
        }
        .ckeditor-custom-wrapper .ck-content h3 {
          font-size: 1.25rem;
          font-weight: 600;
          margin-top: 1rem;
          margin-bottom: 0.5rem;
          color: #1e293b;
        }
        .ckeditor-custom-wrapper .ck-content blockquote {
          border-left: 4px solid #00829d;
          padding-left: 16px;
          margin: 16px 0;
          color: #475569;
          font-style: italic;
          background: #f0fdfa;
          padding: 12px 18px;
          border-radius: 0 8px 8px 0;
        }
      `}</style>
    </div>
  );
}
