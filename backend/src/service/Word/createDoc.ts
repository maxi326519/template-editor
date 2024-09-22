import htmlToDocx from "html-to-docx";
import fs from "fs";
import path from "path";

// Función para convertir una imagen a Base64
const getImageAsBase64 = (imagePath: string): string => {
  const imageBuffer = fs.readFileSync(imagePath);
  return imageBuffer.toString("base64");
};

const convertHtmlToWord = async (htmlContent: string) => {
  // Cargar la imagen y convertirla a base64
  const headerImg = getImageAsBase64(__dirname + "/templates/header.png"); // Ruta de la imagen
  const footerImg = getImageAsBase64(__dirname + "/templates/footer.png"); // Ruta de la imagen

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

  const firmaHtml = `
    <table style="width: 100%; border-collapse: collapse;">
      <tr>
        <td style="border: 1px solid black; padding: 10px; font-size: 10px; width: 70%;">
          <p><b>SECRETARÍA DISTRITAL DE PLANEACIÓN</b></p>
          <p><b>Folios:</b> XXXX <b>Anexos:</b> XX</p>
          <p><b>No. Radicación:</b> XXXXXXXXXX</p>
          <p><b>No. Proceso:</b> XXXXXX <b>Fecha:</b> XXXX-XX-XX XX:XX</p>
          <p><b>Tercero:</b> XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX</p>
          <p><b>Dep. Radicadora:</b> XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX</p>
          <p><b>Doc:</b> XXXXXXXX <b>Tipo Doc:</b> XXXXXXXX <b>Consec:</b> XXXXXX-XXXXX</p>
        </td>
      </tr>
    </table>
  `;

  // Convertir HTML a un documento DOCX
  const docxBuffer = await htmlToDocx(
    `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <title>Document</title>
      </head>
      <body>
        <div>
          ${htmlContent.replace("${FIRMA}", firmaHtml)}
        </div>
      </body>
    </html>`,
    headerHtml.replace("${image}", `data:image/png;base64,${headerImg}`), // Insertar imagen base64
    {
      footer: true,
      header: true,
      margins: {
        // Márgenes en TWIPS (1 pulgada = 1440 twips)
        top: 1440, // 1 pulgada
        right: 720, // 0.5 pulgadas
        bottom: 1440, // 1 pulgada
        left: 720, // 0.5 pulgadas
      },
    },
    footerHtml.replace("${image}", `data:image/png;base64,${footerImg}`) // Insertar imagen base64
  );

  // Guardar el archivo DOCX en el sistema de archivos
  const filePath = path.join(__dirname, `${new Date().getTime()}.docx`);
  fs.writeFileSync(filePath, docxBuffer);

  return filePath;
};

export default convertHtmlToWord;
