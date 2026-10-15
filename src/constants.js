export const CATEGORIES = [
  'Escritura',
  'Código',
  'Marketing',
  'Productividad',
  'Imagen',
];

export const CATEGORY_COLORS = {
  Código:        { light: { bg: '#DBE9F6', text: '#3A5F82' }, dark: { bg: 'rgba(167,199,231,0.18)', text: '#A7C7E7' } },
  Escritura:     { light: { bg: '#F6DEE4', text: '#7A3B4E' }, dark: { bg: 'rgba(242,196,206,0.18)', text: '#F2C4CE' } },
  Marketing:     { light: { bg: '#D4ECDF', text: '#2E6644' }, dark: { bg: 'rgba(168,213,186,0.18)', text: '#A8D5BA' } },
  Imagen:        { light: { bg: '#FCEAEC', text: '#8A4050' }, dark: { bg: 'rgba(250,218,221,0.18)', text: '#FADADD' } },
  Productividad: { light: { bg: '#F9EDCF', text: '#6E5520' }, dark: { bg: 'rgba(249,228,183,0.18)', text: '#F9E4B7' } },
};

// Colores para categorías creadas por el usuario
const CATEGORY_PALETTE = [
  { light: { bg: '#E9E1F5', text: '#5B4682' }, dark: { bg: 'rgba(195,177,225,0.18)', text: '#C3B1E1' } },
  ...Object.values(CATEGORY_COLORS),
];

const UNCATEGORIZED_COLORS = { light: { bg: '#ECEAE5', text: '#6B6560' }, dark: { bg: 'rgba(176,172,166,0.15)', text: '#B0ACA6' } };

export function getCategoryColors(name) {
  if (!name) return UNCATEGORIZED_COLORS;
  if (CATEGORY_COLORS[name]) return CATEGORY_COLORS[name];
  let hash = 0;
  for (const ch of name) hash = (hash * 31 + ch.charCodeAt(0)) >>> 0;
  return CATEGORY_PALETTE[hash % CATEGORY_PALETTE.length];
}

export const SAMPLE_PROMPTS = [
  { id: '1', title: 'Analizar código Python', text: 'Analiza el siguiente código Python. Identifica errores, sugiere mejoras de rendimiento y buenas prácticas. Explica cada sugerencia con ejemplos claros.\n\nEstructura tu respuesta así:\n1. Errores encontrados\n2. Mejoras de rendimiento\n3. Buenas prácticas sugeridas\n4. Código refactorizado', category: 'Código' },
  { id: '2', title: 'Email de seguimiento', text: 'Redacta un email de seguimiento profesional para un cliente potencial. El tono debe ser cordial pero directo, recordando nuestra última conversación y proponiendo próximos pasos concretos.', category: 'Escritura' },
  { id: '3', title: 'Plan de contenido semanal', text: 'Crea un plan de contenido para redes sociales de una semana. Incluye ideas de posts, horarios óptimos y hashtags relevantes para el sector tecnológico.', category: 'Marketing' },
  { id: '4', title: 'Generar imágenes minimalistas', text: 'Genera una imagen minimalista con fondo pastel. Estilo flat design, sin texturas complejas, con máximo 3 elementos centrados y espacio negativo generoso.', category: 'Imagen' },
  { id: '5', title: 'Optimizar consultas SQL', text: 'Revisa esta consulta SQL y optimízala para mejorar el rendimiento. Sugiere índices necesarios, reescritura de joins y alternativas más eficientes.', category: 'Código' },
  { id: '6', title: 'Resumen ejecutivo', text: 'Genera un resumen ejecutivo del siguiente documento. Máximo 200 palabras, destacando los puntos clave, decisiones pendientes y próximos pasos a seguir.', category: 'Productividad' },
];
