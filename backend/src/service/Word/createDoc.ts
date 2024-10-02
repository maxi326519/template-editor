import htmlToDocx from "html-to-docx";
import fs from "fs";

// Función para convertir una imagen a Base64
const getImageAsBase64 = (imagePath: string): string => {
  const imageBuffer = fs.readFileSync(imagePath);
  return imageBuffer.toString("base64");
};

const convertHtmlToWord = async (htmlContent: string) => {
  // Cargar la imagen y convertirla a base64
  const headerImg = getImageAsBase64(__dirname + "/templates/header.png"); // Ruta de la imagen
  const footerImg = getImageAsBase64(__dirname + "/templates/footer.png"); // Ruta de la imagen
  const firmaImg = getImageAsBase64(__dirname + "/templates/gdoc_firma.jpeg"); // Ruta de la imagen

  const contentHtml = fs.readFileSync(
    __dirname + "/templates/content.html",
    "utf8"
  );

  // Get Header template
  const headerHtml = fs.readFileSync(
    __dirname + "/templates/header.html",
    "utf8"
  );

  // Get Footer template
  const footerHtml = fs.readFileSync(
    __dirname + "/templates/footer.html",
    "utf8"
  );

  // Convertir HTML a un documento DOCX
  const docxBuffer = await htmlToDocx(
    `
      <!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="UTF-8" />
          <title>Document</title>
          <style>
            p {
              text-align: justify;
              font-style: italic;
            }
              .ql-align-justify {
              text-align: justify;
            }
          </style>
        </head>
        <body style="font-family: Arial, sans-serif; text-aling: center;">
          ${htmlContent.replace("em>", "i>")}
        </body>
      </html>
    `,
    headerHtml.replace("${image}", `data:image/png;base64,${headerImg}`),
    {
      font: "Arial",
      footer: true,
      header: true,
    },
    footerHtml.replace("${image}", `data:image/png;base64,${footerImg}`)
  );

  return docxBuffer;
};

export default convertHtmlToWord;
