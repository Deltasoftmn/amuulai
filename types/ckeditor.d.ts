declare module '@ckeditor/ckeditor5-react' {
  import * as React from 'react';

  export interface CKEditorProps {
    editor: any;
    data?: string;
    config?: any;
    onChange?: (event: any, editor: any) => void;
    onReady?: (editor: any) => void;
    onFocus?: (event: any, editor: any) => void;
    onBlur?: (event: any, editor: any) => void;
    disabled?: boolean;
  }

  export class CKEditor extends React.Component<CKEditorProps, any> {}
}

declare module '@ckeditor/ckeditor5-build-classic' {
  const ClassicEditor: any;
  export default ClassicEditor;
}
