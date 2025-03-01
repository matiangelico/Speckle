export const convertToTimestamp = (date) => {
  // Convierte una fecha a un timestamp (milisegundos desde 1970)
  return new Date(date).getTime();
};

export const convertToReadableDateAndHour = (timestamp) => {
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

export const convertToReadableDate = (timestamp) => {
  // Convierte un timestamp a un formato legible
  const date = new Date(timestamp);

  // Opciones de formateo de fecha en español
  const options = {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  };

  // Formatear la fecha en español
  return new Intl.DateTimeFormat('es-ES', options).format(date);
};

export const isToday = (date) => {
  const today = new Date();
  return (
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear()
  );
};

export const isYesterday = (date) => {
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);
  return (
    date.getDate() === yesterday.getDate() &&
    date.getMonth() === yesterday.getMonth() &&
    date.getFullYear() === yesterday.getFullYear()
  );
};

export  const isThisWeek = (date) => {
  const today = new Date();
  const startOfWeek = today.getDate() - today.getDay();
  const endOfWeek = startOfWeek + 6;
  const startDate = new Date(today.setDate(startOfWeek));
  const endDate = new Date(today.setDate(endOfWeek));

  return date >= startDate && date <= endDate;
};