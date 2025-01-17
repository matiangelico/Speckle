export const convertToTimestamp = (date) => {
  // Convierte una fecha a un timestamp (milisegundos desde 1970)
  return new Date(date).getTime();
};

export const convertToReadableDate = (timestamp) => {
  // Convierte un timestamp a un formato legible
  const date = new Date(timestamp);

  // Opciones de formateo de fecha en español
  const options = {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  };

  // Formatear la fecha en español
  return new Intl.DateTimeFormat('es-ES', options).format(date);
};
