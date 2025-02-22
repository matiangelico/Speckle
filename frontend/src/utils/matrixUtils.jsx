// Función para descargar la matriz en formato .txt
export const downloadTxt = (matrix, fileName = "matrix.txt") => {
  return new Promise((resolve, reject) => {
    try {
      const textContent = matrix.map((row) => row.join(" ")).join("\n");
      const dataUrl = `data:text/plain;charset=utf-8,${encodeURIComponent(
        textContent
      )}`;
      const link = document.createElement("a");
      link.href = dataUrl;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      resolve();
    } catch (error) {
      console.error("Error descargando TXT:", error);
      reject(error);
    }
  });
};

// Función para descargar la matriz en formato .csv
export const downloadCsv = (matrix, fileName = "matrix.csv") => {
  return new Promise((resolve, reject) => {
    try {
      const csvContent = matrix.map((row) => row.join(",")).join("\n");
      const dataUrl = `data:text/csv;charset=utf-8,${encodeURIComponent(
        csvContent
      )}`;
      const link = document.createElement("a");
      link.href = dataUrl;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      resolve();
    } catch (error) {
      console.error("Error descargando CSV:", error);
      reject(error);
    }
  });
};

// Función para descargar la matriz en formato .json
export const downloadJson = (matrix, fileName = "matrix.json") => {
  return new Promise((resolve, reject) => {
    try {
      const jsonContent = JSON.stringify(matrix, null, 2);
      const dataUrl = `data:application/json;charset=utf-8,${encodeURIComponent(
        jsonContent
      )}`;
      const link = document.createElement("a");
      link.href = dataUrl;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      resolve();
    } catch (error) {
      console.error("Error descargando JSON:", error);
      reject(error);
    }
  });
};
