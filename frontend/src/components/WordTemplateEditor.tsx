import { useState, useRef, useEffect } from "react";
import axios from "axios";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

const textHtml = `<p class="ql-indent-1">Lorem ipsum dolor sit amet consectetur adipisicing elit. Illo ducimus, accusamus commodi deleniti obcaecati praesentium voluptatibus molestiae blanditiis sint? Atque consequatur ullam rerum porro aliquam laborum doloremque obcaecati ad! Ipsa.</p><p class="ql-indent-1 ql-align-center">	Lorem ipsum dolor sit amet consectetur adipisicing elit. Illo ducimus, accusamus commodi deleniti obcaecati praesentium voluptatibus molestiae blanditiis sint? Atque consequatur ullam rerum porro aliquam laborum doloremque obcaecati ad! Ipsa.</p><p class="ql-indent-1 ql-align-right">	Lorem ipsum dolor sit amet consectetur adipisicing elit. Illo ducimus, accusamus commodi deleniti obcaecati praesentium voluptatibus molestiae blanditiis sint? Atque consequatur ullam rerum porro aliquam laborum doloremque obcaecati ad! Ipsa.</p><p class="ql-indent-1 ql-align-justify">		Lorem ipsum dolor sit amet consectetur adipisicing elit. Illo ducimus, accusamus commodi deleniti obcaecati praesentium voluptatibus molestiae blanditiis sint? Atque consequatur ullam rerum porro aliquam laborum doloremque obcaecati ad! Ipsa.</p><p><span class="ql-size-small">Lorem ipsum dolor sit amet consectetur adipisicing elit. Illo ducimus, accusamus commodi deleniti obcaecati praesentium voluptatibus molestiae blanditiis sint? Atque consequatur ullam rerum porro aliquam laborum doloremque obcaecati ad! Ipsa.</span></p><p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Illo ducimus, accusamus commodi deleniti obcaecati praesentium voluptatibus molestiae blanditiis sint? Atque consequatur ullam rerum porro aliquam laborum doloremque obcaecati ad! Ipsa.</p><p><span class="ql-size-large">Lorem ipsum dolor sit amet consectetur adipisicing elit. Illo ducimus, accusamus commodi deleniti obcaecati praesentium voluptatibus molestiae blanditiis sint? Atque consequatur ullam rerum porro aliquam laborum doloremque obcaecati ad! Ipsa.</span></p><p><span class="ql-size-huge">Lorem ipsum dolor sit amet consectetur adipisicing elit. Illo ducimus, accusamus commodi deleniti obcaecati praesentium voluptatibus molestiae blanditiis sint? Atque consequatur ullam rerum porro aliquam laborum doloremque obcaecati ad! Ipsa.</span></p>`;

const WordTemplateEditor = () => {
  const [editorHtml, setEditorHtml] = useState("");
  const quillRef = useRef<ReactQuill | null>(null); // Tipar correctamente la referencia
  const [selectedVariable, setSelectedVariable] = useState("");

  useEffect(() => {
    console.log(editorHtml);
  }, [editorHtml]);

  // Función para manejar cambios en el editor
  const handleChange = (content: string) => {
    setEditorHtml(content);
  };

  // Función para reemplazar texto con un estilo específico
  const replaceStyledText = (oldText: string, newText: string) => {
    const quill = quillRef.current?.getEditor();

    if (quill) {
      const delta = quill.getContents();
      if (delta.ops) {
        const ops = delta.ops.map((op) => {
          if (
            op.insert &&
            typeof op.insert === "string" &&
            op.attributes?.background === "red"
          ) {
            // Reemplaza el texto en el contenido
            const newTextContent = op.insert.replace(
              new RegExp(oldText, "g"),
              newText
            );

            // Retorna la operación con el texto reemplazado
            return {
              insert: newTextContent,
              attributes: undefined,
            };
          }
          return op;
        });

        // Crea un nuevo delta con el texto reemplazado
        quill.setContents({ ...delta, ops });
        setEditorHtml(quill.root.innerHTML); // Actualiza el estado con el nuevo contenido
      }
    }
  };

  // Función para insertar una variable en la posición actual del cursor
  const insertVariable = () => {
    const quill = quillRef.current?.getEditor(); // Obtener la instancia de Quill

    if (quill) {
      const range = quill.getSelection(); // Obtener la posición actual del cursor

      if (range) {
        // const variable = `{{${selectedVariable}}}`;
        // const styledVariable = `<strong class="variable">${variable}</strong>`; // Agregar clase para el estilo de la variable

        quill.clipboard.dangerouslyPasteHTML(
          range.index,
          `<strong style="color: red">${selectedVariable}</strong>`
        );

        quill.addContainer("ql-custom");
      }
    }
  };

  // Función para enviar el contenido al backend
  const sendTemplateToBackend = async (route: string) => {
    try {
      const response = await axios.post(
        `http://localhost:3002/${route}`,
        { doc: handleStyles() }, // Asegúrate de enviar el contenido HTML correcto
        {
          responseType: "blob", // Establecer el tipo de respuesta a blob
        }
      );

      // Crear un objeto Blob con la respuesta
      const blob = new Blob([response.data]);

      // Crear un enlace temporal para la descarga
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute(
        "download",
        `${
          route === "doc" ? "Documento" : route === "pdf" ? "PDF" : ""
        }-${Date.now()}.${route}`
      ); // Nombre del archivo

      // Agregar el enlace al documento y hacer clic en él
      document.body.appendChild(link);
      link.click();

      // Limpiar el enlace después de la descarga
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url); // Liberar la URL del objeto
    } catch (error) {
      console.error("Error al enviar los datos:", error);
      alert("No se pudo enviar los datos");
    }
  };

  function handleStyles(): string {
    const parser = new DOMParser();
    const doc = parser.parseFromString(editorHtml, "text/html");

    // Mapeo de clases a estilos (puedes expandirlo según necesites)
    const classToStyleMap: { [key: string]: string } = {
      "ql-align-justify": "text-align: justify;",
      "ql-align-center": "text-align: center;",
      "ql-align-left": "text-align: left;",
      "ql-align-right": "text-align: right;",
      "ql-size-small": "font-size: 8pt;",
      "ql-size-normal": "font-size: 11pt;",
      "ql-size-large": "font-size: 15pt;",
      "ql-size-huge": "font-size: 20pt;",
      "ql-bold": "font-weight: bold;",
      "ql-italic": "font-style: italic;",
    };

    // Función recursiva para recorrer todos los nodos del body
    function traverseNodes(node: Node) {
      if (node.nodeType === Node.ELEMENT_NODE) {
        const element = node as HTMLElement; // Aseguramos que es un HTMLElement
        // Si tiene una clase, aplicamos los estilos
        const classes: string[] = element.className.split(" ");
        const styles: string[] = classes
          .map((cls: string) => classToStyleMap[cls])
          .filter(Boolean);

        // Si hay estilos, los aplicamos
        if (styles.length > 0) {
          element.setAttribute("style", styles.join(" "));
        }
      }

      // Recorrer los hijos
      node.childNodes.forEach((child) => traverseNodes(child));
    }

    // Iniciar el recorrido desde el body
    traverseNodes(doc.body);

    // Devolver el HTML convertido
    console.log(doc.body);
    return doc.body.innerHTML;
  }

  return (
    <div
      style={{
        display: "flex",
        height: "100%",
      }}
    >
      <ReactQuill
        ref={quillRef} // Referencia al editor
        style={{
          flexGrow: 1,
          color: "black",
          background: "white",
          width: "450px",
        }}
        value={editorHtml}
        onChange={handleChange}
        modules={WordTemplateEditor.modules}
        formats={WordTemplateEditor.formats}
      />
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          width: "200px",
          gap: "10px",
          padding: "20px",
        }}
      >
        <select
          value={selectedVariable}
          onChange={(e) => setSelectedVariable(e.target.value)}
        >
          <option value="">Seleccionar Variable</option>
          <option value="Nombre">Nombre</option>
          <option value="Fecha">Fecha</option>
          <option value="Empresa">Empresa</option>
        </select>

        <button onClick={insertVariable}>Agregar Variable</button>
        <button onClick={() => replaceStyledText("Nombre", "Maximiliano")}>
          Reemplazar
        </button>
        <button onClick={() => sendTemplateToBackend("doc")}>
          Generar documento Word
        </button>
        <button onClick={() => sendTemplateToBackend("pdf")}>
          Generar documento PDF
        </button>
        <button onClick={handleStyles}>Reemplazar estilos</button>
        <button onClick={() => setEditorHtml(textHtml)}>
          Texto de ejemplo
        </button>
      </div>
    </div>
  );
};

// Personalización de la barra de herramientas
WordTemplateEditor.modules = {
  toolbar: [
    ["bold", "italic", "underline", "strike"], // toggled buttons
    // ["blockquote", "code-block"],
    // ["link", "image", "video", "formula"],

    // [{ header: 1 }, { header: 2 }], // custom button values
    [{ list: "ordered" }, { list: "bullet" }, { list: "check" }],
    // [{ script: "sub" }, { script: "super" }], // superscript/subscript
    [{ indent: "-1" }, { indent: "+1" }], // outdent/indent
    // [{ direction: "rtl" }], // text direction

    [{ size: ["small", false, "large", "huge"] }], // custom dropdown
    // [{ header: [1, 2, 3, 4, 5, 6, false] }],

    // [{ font: [] }],
    [{ align: [] }],

    ["clean"],
  ],
};

WordTemplateEditor.formats = [
  "background",
  "bold",
  "color",
  "font",
  "code",
  "italic",
  "link",
  "size",
  "strike",
  "script",
  "underline",

  "color",
  "blockquote",
  "header",
  "indent",
  "list",
  "align",
  "direction",
  "code-block",
];

export default WordTemplateEditor;
