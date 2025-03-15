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
    try {
      // Asegúrate de que el base64Data sea realmente de un SVG. Si no incluye el prefijo, agrégalo:
      const base64WithPrefix = base64Data.startsWith("data:")
        ? base64Data
        : `data:image/svg+xml;base64,${base64Data}`;
      const link = document.createElement("a");
      link.href = base64WithPrefix;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      resolve();
    } catch (error) {
      console.error("Error descargando SVG:", error);
      reject(error);
    }
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
