export const tagsStyles = {
  p: { marginVertical: 8, fontSize: 15, color: '#333', lineHeight: 22 },
  b: { fontWeight: 'bold' },
  strong: { fontWeight: 'bold' },
  i: { fontStyle: 'italic' },
  em: { fontStyle: 'italic' },
  u: { textDecorationLine: 'underline' },
  a: { color: '#1e90ff', textDecorationLine: 'underline' },
  h1: { fontSize: 24, fontWeight: 'bold', marginVertical: 12 },
  h2: { fontSize: 20, fontWeight: 'bold', marginVertical: 10 },
  h3: { fontSize: 18, fontWeight: 'bold', marginVertical: 8 },
  ul: { marginVertical: 8, paddingLeft: 20 },
  ol: { marginVertical: 8, paddingLeft: 20 },
  li: { marginVertical: 4, fontSize: 15, color: '#444' },
  table: { borderWidth: 1, borderColor: '#ccc', marginVertical: 10 },
  th: { borderWidth: 1, padding: 6, backgroundColor: '#eee', fontWeight: 'bold' },
  td: { borderWidth: 1, padding: 6 },
  blockquote: { borderLeftWidth: 4, borderLeftColor: '#ccc', paddingLeft: 10, marginVertical: 8, fontStyle: 'italic', color: '#555' },
  img: { marginVertical: 10, maxWidth: '100%', height: 'auto', resizeMode: 'contain' },
};

// Nuovo oggetto con color bianco
export const tagsStylesPlayer = Object.keys(tagsStyles).reduce((acc, tag) => {
  acc[tag] = { ...tagsStyles[tag], color: '#FFF' };
  return acc;
}, {});
