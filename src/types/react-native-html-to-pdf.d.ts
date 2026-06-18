declare module 'react-native-html-to-pdf' {
  export type ConvertOptions = {
    html: string;
    fileName: string;
    directory?: 'Documents' | 'Download';
    base64?: boolean;
  };

  export type ConvertResult = {
    filePath?: string;
    base64?: string;
  };

  const RNHTMLtoPDF: {
    convert(
      options: ConvertOptions,
    ): Promise<ConvertResult>;
  };

  export default RNHTMLtoPDF;
}
