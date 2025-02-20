export const extractTextBetweenParentheses = (text) => {
  const match = text.match(/\(([^)]+)\)/);
  return match ? match[1] : "";
}