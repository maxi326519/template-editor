import htmlToDocx from "html-to-docx";
import fs from "fs";
import path from "path";
import creatPDF from "./createPDF";

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
      </head>
      <body style="font-family: Arial, sans-serif; text-aling: justify">
        ${htmlContent.replace(
          "<p><strong>${Firma}</strong></p>",
          `
          <img style="width: 150px" src="data:image/png;base64,${firmaImg}" alt="header" />
          `
        )}
      </body>
    </html>`,
    headerHtml.replace("${image}", `data:image/png;base64,${headerImg}`), // Insertar imagen base64
    {
      font: "Arial",
      footer: true,
      header: true,
      // margins: {
      //   // Márgenes en TWIPS (1 pulgada = 1440 twips)
      //   top: 1440, // 1 pulgada
      //   right: 720, // 0.5 pulgadas
      //   bottom: 1440, // 1 pulgada
      //   left: 720, // 0.5 pulgadas
      // },
    },
    footerHtml.replace("${image}", `data:image/png;base64,${footerImg}`) // Insertar imagen base64
  );

  return docxBuffer;
};

export default convertHtmlToWord;
