import jsPDF from "jspdf";

// Función para descargar una imagen en formato PNG
export const downloadPng = (base64Data, fileName = "downloaded-image.png") => {
  return new Promise((resolve, reject) => {
    try {
      const base64WithPrefix = `data:image/png;base64,${base64Data}`;
      const link = document.createElement("a");
      link.href = base64WithPrefix;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      resolve();
    } catch (error) {
      console.error("Error descargando PNG:", error);
      reject(error);
    }
  });
};

// Función para descargar una imagen en formato JPG
export const downloadJpg = (base64Data, fileName = "downloaded-image.jpg") => {
  return new Promise((resolve, reject) => {
    try {
      const base64WithPrefix = `data:image/jpeg;base64,${base64Data}`;
      const link = document.createElement("a");
      link.href = base64WithPrefix;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      resolve();
    } catch (error) {
      console.error("Error descargando JPG:", error);
      reject(error);
    }
  });
};

// Función para descargar una imagen en formato SVG
export const downloadSvg = (base64Data, fileName = "downloaded-image.svg") => {
  return new Promise((resolve, reject) => {
    // 1) Aseguramos que sea un data URI válido
    const dataUri = base64Data.startsWith("data:")
      ? base64Data
      : `data:image/png;base64,${base64Data}`;

    // 2) Cargamos la imagen para saber su tamaño
    const img = new Image();
    img.onload = () => {
      const { naturalWidth: w, naturalHeight: h } = img;

      // 3) Montamos el string SVG
      const svgString = `
        <svg xmlns="http://www.w3.org/2000/svg"
             width="${w}" height="${h}"
             viewBox="0 0 ${w} ${h}">
          <image href="${dataUri}" width="${w}" height="${h}" />
        </svg>
      `.trim();

      // 4) Lo convertimos a Blob y forzamos descarga
      const blob = new Blob([svgString], {
        type: "image/svg+xml;charset=utf-8",
      });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // 5) Liberamos el URL
      URL.revokeObjectURL(url);
      resolve();
    };

    img.onerror = (err) => {
      reject(new Error("No se pudo cargar la imagen Base64: " + err.message));
    };

    img.src = dataUri;
  });
};

// Función para descargar un documento en formato PDF
export const downloadPdf = (
  base64Data,
  fileName = "downloaded-document.pdf"
) => {
  return new Promise((resolve, reject) => {
    const base64WithPrefix = `data:image/png;base64,${base64Data}`;
    const pdf = new jsPDF("p", "mm", "a4");
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();

    // Define los márgenes (padding) en milímetros
    const horizontalPadding = 10; // 10 mm a cada lado
    const verticalPadding = 10; // 10 mm arriba y abajo (opcional)

    // Calcula el ancho y alto disponibles descontando los márgenes
    const availableWidth = pageWidth - 2 * horizontalPadding;
    const availableHeight = pageHeight - 2 * verticalPadding;

    const img = new Image();
    img.src = base64WithPrefix;

    img.onload = () => {
      try {
        const imgWidth = img.naturalWidth;
        const imgHeight = img.naturalHeight;
        // Calcula el ratio para que la imagen quepa en el espacio disponible sin deformarse
        const ratio = Math.min(
          availableWidth / imgWidth,
          availableHeight / imgHeight
        );
        const width = imgWidth * ratio;
        const height = imgHeight * ratio;

        // Centra la imagen dentro del área disponible (con márgenes)
        const x = horizontalPadding + (availableWidth - width) / 2;
        const y = verticalPadding + (availableHeight - height) / 2;

        pdf.addImage(base64WithPrefix, "PNG", x, y, width, height);
        pdf.save(fileName);
        resolve();
      } catch (error) {
        console.error("Error al procesar la imagen para PDF:", error);
        reject(error);
      }
    };

    img.onerror = (error) => {
      console.error("Error cargando la imagen:", error);
      reject(error);
    };
  });
};
