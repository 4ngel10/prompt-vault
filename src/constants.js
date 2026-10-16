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

export const ITEM_TYPES = {
  prompt: { label: 'Prompt', plural: 'Prompts', demonstrative: 'este prompt', subject: 'El prompt será eliminado', newTitle: 'Nuevo Prompt', editTitle: 'Editar Prompt' },
  skill:  { label: 'Skill',  plural: 'Skills',  demonstrative: 'esta skill',  subject: 'La skill será eliminada',  newTitle: 'Nueva Skill',  editTitle: 'Editar Skill' },
};

// Los items guardados antes de existir el campo `type` se consideran prompts
export function getItemType(item) {
  return item?.type === 'skill' ? 'skill' : 'prompt';
}

export const SAMPLE_PROMPTS = [
  { id: '1', title: 'Analizar código Python', text: 'Analiza el siguiente código Python. Identifica errores, sugiere mejoras de rendimiento y buenas prácticas. Explica cada sugerencia con ejemplos claros.\n\nEstructura tu respuesta así:\n1. Errores encontrados\n2. Mejoras de rendimiento\n3. Buenas prácticas sugeridas\n4. Código refactorizado', category: 'Código', type: 'prompt' },
  { id: '2', title: 'Email de seguimiento', text: 'Redacta un email de seguimiento profesional para un cliente potencial. El tono debe ser cordial pero directo, recordando nuestra última conversación y proponiendo próximos pasos concretos.', category: 'Escritura', type: 'prompt' },
  { id: '3', title: 'Plan de contenido semanal', text: 'Crea un plan de contenido para redes sociales de una semana. Incluye ideas de posts, horarios óptimos y hashtags relevantes para el sector tecnológico.', category: 'Marketing', type: 'prompt' },
  { id: '4', title: 'Generar imágenes minimalistas', text: 'Genera una imagen minimalista con fondo pastel. Estilo flat design, sin texturas complejas, con máximo 3 elementos centrados y espacio negativo generoso.', category: 'Imagen', type: 'prompt' },
  { id: '5', title: 'Optimizar consultas SQL', text: 'Revisa esta consulta SQL y optimízala para mejorar el rendimiento. Sugiere índices necesarios, reescritura de joins y alternativas más eficientes.', category: 'Código', type: 'prompt' },
  { id: '6', title: 'Resumen ejecutivo', text: 'Genera un resumen ejecutivo del siguiente documento. Máximo 200 palabras, destacando los puntos clave, decisiones pendientes y próximos pasos a seguir.', category: 'Productividad', type: 'prompt' },
  { id: '7', title: 'Experto en Python', text: 'Actúa como un desarrollador senior experto en Python con más de 10 años de experiencia. Dominas la biblioteca estándar, el tipado estático, asyncio, testing con pytest y el ecosistema (FastAPI, Django, pandas).\n\nAl responder:\n- Escribe código idiomático, siguiendo PEP 8 y con type hints\n- Explica brevemente el porqué de cada decisión\n- Señala posibles errores, casos límite y problemas de rendimiento\n- Propón tests cuando sea relevante', category: 'Código', type: 'skill' },
  { id: '8', title: 'Corrector de textos', text: 'Eres un corrector profesional de textos en español. Revisa ortografía, gramática, puntuación y estilo del texto que te proporcione.\n\nPara cada corrección:\n1. Muestra el fragmento original\n2. Propón la versión corregida\n3. Explica la regla aplicada en una línea\n\nAl final, entrega el texto completo corregido manteniendo el tono y la intención del autor.', category: 'Escritura', type: 'skill' },
  { id: '9', title: 'Analista de datos', text: 'Actúa como analista de datos. Cuando te comparta un dataset (CSV, tabla o descripción), sigue este proceso:\n\n1. Describe la estructura: columnas, tipos y valores nulos\n2. Calcula estadísticas descriptivas clave\n3. Identifica patrones, tendencias y valores atípicos\n4. Sugiere visualizaciones adecuadas para cada hallazgo\n5. Resume las conclusiones accionables en lenguaje claro\n\nSi faltan datos o contexto, pregunta antes de asumir.', category: 'Productividad', type: 'skill' },
];
