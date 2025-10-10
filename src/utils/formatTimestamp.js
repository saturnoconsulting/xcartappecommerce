export function formatTimestamp(seconds) {
  if (!seconds) return '';

  const date = new Date(seconds * 1000); // timestamp in secondi

  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear(); 

  return `${day}/${month}/${year}`;
}
