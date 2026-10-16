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
    rgb: `${r},${g},${b}`,
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

// Color por defecto de los tipos de item
export const DEFAULT_TYPE_COLORS = {
  prompt: 'lavender',
  skill: 'mint',
};

// Variables CSS para piezas "suaves" (badges de tipo, iconos de menú) de un color de la paleta.
// Se usan con clases como bg-(--soft-bg) dark:bg-(--soft-bg-dark) para no depender de `dark` en props.
export function softVars(color) {
  return {
    '--soft-bg': `rgba(${color.rgb},0.22)`,
    '--soft-bg-dark': `rgba(${color.rgb},0.15)`,
    '--soft-border': `rgba(${color.rgb},0.65)`,
    '--soft-text': color.light.text,
    '--soft-text-dark': color.swatch,
    '--swatch': color.swatch,
  };
}

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

// Tipos por defecto. Los usuarios pueden renombrarlos, reordenarlos, eliminarlos y crear otros
export const DEFAULT_TYPES = [
  { id: 'prompt', name: 'Prompt' },
  { id: 'skill', name: 'Skill' },
];

// Tipo que se muestra para items compartidos cuyo tipo no existe en la lista del usuario
export const UNKNOWN_TYPE = { id: '__unknown__', name: 'Otro', unknown: true };

// Textos exactos de los tipos por defecto mientras conserven su nombre original
const DEFAULT_TYPE_TEXTS = {
  prompt: { gender: 'm', plural: 'Prompts', placeholder: 'Pega o escribe tu prompt aquí...' },
  skill: { gender: 'f', plural: 'Skills', placeholder: 'Describe tu skill aquí...' },
};

export function pluralize(word) {
  const w = word.trim();
  if (/[sx]$/i.test(w)) return w;
  if (/[aeiouáéíóú]$/i.test(w)) return `${w}s`;
  if (/z$/i.test(w)) return `${w.slice(0, -1)}ces`;
  if (/ión$/i.test(w)) return `${w.slice(0, -3)}iones`;
  // Grupos consonánticos finales (Skill, Prompt, Agent) suelen ser préstamos del inglés
  if (/[^aeiouáéíóú]{2}$/i.test(w)) return `${w}s`;
  return `${w}es`;
}

// Textos derivados del nombre de un tipo; el género se deduce del nombre (termina en -a → femenino)
export function typeLabels(type) {
  const preset = DEFAULT_TYPES.some(t => t.id === type.id && t.name === type.name) ? DEFAULT_TYPE_TEXTS[type.id] : null;
  const name = type.name;
  const lower = name.toLowerCase();
  const f = (preset?.gender ?? (/a$/i.test(name.trim()) ? 'f' : 'm')) === 'f';
  return {
    name,
    plural: preset?.plural ?? pluralize(name),
    newTitle: `${f ? 'Nueva' : 'Nuevo'} ${name}`,
    editTitle: `Editar ${name}`,
    demonstrative: `${f ? 'esta' : 'este'} ${lower}`,
    subject: `${f ? 'La' : 'El'} ${lower} será ${f ? 'eliminada' : 'eliminado'}`,
    placeholder: preset?.placeholder ?? `Escribe aquí tu ${lower}...`,
  };
}

// Color por defecto de un tipo creado por el usuario: estable a partir de su id
export function getDefaultTypeColorKey(id) {
  if (DEFAULT_TYPE_COLORS[id]) return DEFAULT_TYPE_COLORS[id];
  let hash = 0;
  for (const ch of id) hash = (hash * 31 + ch.charCodeAt(0)) >>> 0;
  const keys = Object.keys(COLOR_PALETTE);
  return keys[hash % keys.length];
}

export const NEUTRAL_COLORS = { ...UNCATEGORIZED_COLORS, rgb: '176,172,166' };
