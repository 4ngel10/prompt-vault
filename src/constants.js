export const CATEGORIES = [
  'Escritura',
  'Código',
  'Marketing',
  'Productividad',
  'Imagen',
];

// Paleta pastel para categorías. `swatch` es el color puro (círculos del selector y bordes);
// light/dark son los pares fondo/texto de badges y chips, todos con contraste AA (≥ 4.5:1).
function tint(swatch, lightBg, lightText) {
  const [r, g, b] = [1, 3, 5].map(i => parseInt(swatch.slice(i, i + 2), 16));
  return {
    swatch,
    light: { bg: lightBg, text: lightText, border: swatch },
    dark: { bg: `rgba(${r},${g},${b},0.18)`, text: swatch, border: `rgba(${r},${g},${b},0.55)` },
  };
}

export const COLOR_PALETTE = {
  lavender: { label: 'Lavanda',   ...tint('#C3B1E1', '#E9E1F5', '#5B4682') },
  rose:     { label: 'Rosa',      ...tint('#F2C4CE', '#F6DEE4', '#7A3B4E') },
  mint:     { label: 'Menta',     ...tint('#A8D5BA', '#D4ECDF', '#2E6644') },
  sky:      { label: 'Cielo',     ...tint('#A7C7E7', '#DBE9F6', '#3A5F82') },
  peach:    { label: 'Melocotón', ...tint('#FADADD', '#FCEAEC', '#8A4050') },
  cream:    { label: 'Crema',     ...tint('#F9E4B7', '#F9EDCF', '#6E5520') },
  coral:    { label: 'Coral',     ...tint('#F4A98C', '#FCE3D9', '#8A3F22') },
  lilac:    { label: 'Lila',      ...tint('#D4B8E0', '#F1E6F6', '#6B3F80') },
  sage:     { label: 'Salvia',    ...tint('#B5C9A8', '#E3EBDD', '#4A5E3C') },
  butter:   { label: 'Mantequilla', ...tint('#F5E6A3', '#FBF3D3', '#6B5A12') },
};

// Color por defecto de las categorías predefinidas
export const DEFAULT_CATEGORY_COLORS = {
  Código: 'sky',
  Escritura: 'rose',
  Marketing: 'mint',
  Imagen: 'peach',
  Productividad: 'cream',
};

// Categorías creadas por el usuario: color estable a partir del nombre (mismo orden que antes)
const HASH_KEYS = ['lavender', 'sky', 'rose', 'mint', 'peach', 'cream'];

const UNCATEGORIZED_COLORS = {
  swatch: '#B0ACA6',
  light: { bg: '#ECEAE5', text: '#6B6560', border: '#B0ACA6' },
  dark: { bg: 'rgba(176,172,166,0.15)', text: '#B0ACA6', border: 'rgba(176,172,166,0.5)' },
};

export function getDefaultColorKey(name) {
  if (DEFAULT_CATEGORY_COLORS[name]) return DEFAULT_CATEGORY_COLORS[name];
  let hash = 0;
  for (const ch of name) hash = (hash * 31 + ch.charCodeAt(0)) >>> 0;
  return HASH_KEYS[hash % HASH_KEYS.length];
}

// `overrides` es el mapa { categoría: clave de COLOR_PALETTE } que el usuario ha personalizado
export function getColorKey(name, overrides = {}) {
  return COLOR_PALETTE[overrides[name]] ? overrides[name] : getDefaultColorKey(name);
}

export function getCategoryColors(name, overrides) {
  if (!name) return UNCATEGORIZED_COLORS;
  return COLOR_PALETTE[getColorKey(name, overrides)];
}

export const ITEM_TYPES = {
  prompt: { label: 'Prompt', plural: 'Prompts', demonstrative: 'este prompt', subject: 'El prompt será eliminado', newTitle: 'Nuevo Prompt', editTitle: 'Editar Prompt' },
  skill:  { label: 'Skill',  plural: 'Skills',  demonstrative: 'esta skill',  subject: 'La skill será eliminada',  newTitle: 'Nueva Skill',  editTitle: 'Editar Skill' },
};

// Los items guardados antes de existir el campo `type` se consideran prompts
export function getItemType(item) {
  return item?.type === 'skill' ? 'skill' : 'prompt';
}
