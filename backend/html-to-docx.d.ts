declare module "html-to-docx" {
  // Define la función exportada como una función por defecto
  export default function htmlToDocx(
    htmlString: string,
    headerHTMLString?: string,
    documentOptions: any,
    footerHTMLString?: string
  ): Promise<Buffer>;
}
