import { Response } from "express";
import path from "path";
import pdf from "html-pdf";

export default async function creatPDF(
  content: string,
  res: Response
): Promise<void> {
  const html = `
  <!DOCTYPE html>
  <html>
    <head>
      <title>Prueba PDF</title>
      <style>
        .ql-align-left{
          text-align: left;
        }
        .ql-align-center{
          text-align: center;
        }
        .ql-indent-1 {
          text-indent: 50px;
        }
        p {
         margin: none;
        }
      </style>
    </head>
    <body
      style="
        font-size: 11px;
        font-family: Arial, Helvetica, sans-serif;
        text-align: justify;
      "
    >
    ${content.replace(`<br>`, "")}
    </body>
  </html>
  
`;

  const options = {
    format: "A4" as "A4",
    border: {
      top: "1in",
      right: "1in",
      bottom: "0.3in",
      left: "1in",
    },
    footer: {
      height: "28mm",
      contents: {
        default:
          '<div style="text-align: center; margin-top: 50px;">{{page}}</div>',
      },
    },
    childProcessOptions: {
      env: {
        OPENSSL_CONF: "/dev/null",
      },
    },
  };

  pdf.create(html, options as any).toBuffer((err, buffer) => {
    if (err) return console.log(err);
    res.status(200).send(buffer);
  });
}
