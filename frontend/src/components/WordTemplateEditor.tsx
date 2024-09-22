import { useState, useRef } from "react";
import axios from "axios";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

const WordTemplateEditor = () => {
  const [editorHtml, setEditorHtml] = useState("");
  const quillRef = useRef<ReactQuill | null>(null); // Tipar correctamente la referencia
  const [selectedVariable, setSelectedVariable] = useState("");

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
  const sendTemplateToBackend = async () => {
    await axios
      .post("http://localhost:3001/", { doc: editorHtml })
      .then(() => alert("Datos enviados"))
      .catch(() => alert("No se pudo enviar los datos"));
  };

  return (
    <div
      style={{
        display: "flex",
        height: "100%",
      }}
    >
      <ReactQuill
        ref={quillRef} // Referencia al editor
        style={{ flexGrow: 1, color: "black", background: "white" }}
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
        <button onClick={sendTemplateToBackend}>Generar documento Word</button>
      </div>
    </div>
  );
};

// Personalización de la barra de herramientas
WordTemplateEditor.modules = {
  toolbar: [
    ["bold", "italic", "underline", "strike"], // toggled buttons
    ["blockquote", "code-block"],
    ["link", "image", "video", "formula"],

    [{ header: 1 }, { header: 2 }], // custom button values
    [{ list: "ordered" }, { list: "bullet" }, { list: "check" }],
    [{ script: "sub" }, { script: "super" }], // superscript/subscript
    [{ indent: "-1" }, { indent: "+1" }], // outdent/indent
    [{ direction: "rtl" }], // text direction

    [{ size: ["small", false, "large", "huge"] }], // custom dropdown
    [{ header: [1, 2, 3, 4, 5, 6, false] }],

    [{ font: [] }],
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
