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
