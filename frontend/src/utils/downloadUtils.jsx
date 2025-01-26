export const downloadImage = (
  base64Data,
  fileName = "downloaded-image.png"
) => {
  const base64WithPrefix = `data:image/png;base64,${base64Data}`;

  const link = document.createElement("a");
  link.href = base64WithPrefix; // La cadena Base64 con el prefijo
  link.download = fileName; // Nombre del archivo
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
