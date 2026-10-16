---
name: Prompt Vault
description: Bóveda personal de prompts y skills de IA, ordenada como un cuaderno de conjuros.
colors:
  lavender: "#C3B1E1"
  lavender-ink: "#5B4682"
  mint: "#A8D5BA"
  mint-ink: "#2E6644"
  sky: "#A7C7E7"
  sky-ink: "#3A5F82"
  rose: "#F2C4CE"
  peach: "#FADADD"
  cream: "#F9E4B7"
  danger: "#D94444"
  warm-50: "#FAFAF8"
  warm-100: "#F5F4F0"
  warm-200: "#ECEAE5"
  warm-400: "#9B9690"
  warm-500: "#6B6560"
  warm-600: "#5A5550"
  warm-700: "#3A3835"
  warm-800: "#2D2D2D"
  white: "#FFFFFF"
  dark-900: "#1A1A2E"
  dark-800: "#1E1E34"
  dark-700: "#252540"
  dark-600: "#2E2E48"
  dark-500: "#3A3A58"
  dark-400: "#7A7890"
  dark-300: "#9A98AE"
  dark-200: "#B0ACA6"
  dark-100: "#E8E8E8"
typography:
  display:
    fontFamily: "Plus Jakarta Sans, system-ui, sans-serif"
    fontSize: "22px"
    fontWeight: 700
    letterSpacing: "-0.025em"
  headline:
    fontFamily: "Plus Jakarta Sans, system-ui, sans-serif"
    fontSize: "19px"
    fontWeight: 700
    lineHeight: 1.375
  title:
    fontFamily: "Plus Jakarta Sans, system-ui, sans-serif"
    fontSize: "15px"
    fontWeight: 600
    lineHeight: 1.375
  body:
    fontFamily: "Plus Jakarta Sans, system-ui, sans-serif"
    fontSize: "13px"
    fontWeight: 400
    lineHeight: 1.625
  label:
    fontFamily: "Plus Jakarta Sans, system-ui, sans-serif"
    fontSize: "11px"
    fontWeight: 600
    letterSpacing: "0.025em"
  mono:
    fontFamily: "SF Mono, Fira Code, Cascadia Code, ui-monospace, monospace"
    fontSize: "13px"
    fontWeight: 400
    lineHeight: 1.625
rounded:
  sm: "8px"
  md: "10px"
  lg: "12px"
  card: "14px"
  sheet: "16px"
  full: "9999px"
spacing:
  xs: "6px"
  sm: "10px"
  md: "16px"
  lg: "20px"
  xl: "28px"
  gutter: "16px"
  gutter-wide: "40px"
components:
  button-primary:
    backgroundColor: "{colors.lavender}"
    textColor: "{colors.warm-800}"
    typography: "{typography.title}"
    rounded: "{rounded.md}"
    padding: "10px 24px"
  button-secondary:
    backgroundColor: "{colors.white}"
    textColor: "{colors.warm-500}"
    rounded: "{rounded.md}"
    padding: "10px 20px"
  button-danger:
    backgroundColor: "{colors.danger}"
    textColor: "{colors.white}"
    rounded: "{rounded.md}"
    padding: "10px 20px"
  button-icon:
    backgroundColor: "{colors.warm-50}"
    textColor: "{colors.warm-600}"
    rounded: "{rounded.md}"
    size: "38px"
  input:
    backgroundColor: "{colors.warm-50}"
    textColor: "{colors.warm-800}"
    rounded: "{rounded.md}"
    padding: "10px 14px"
  search-input:
    backgroundColor: "{colors.white}"
    textColor: "{colors.warm-800}"
    rounded: "{rounded.lg}"
    padding: "14px 16px 14px 44px"
  chip:
    backgroundColor: "{colors.white}"
    textColor: "{colors.warm-500}"
    rounded: "{rounded.full}"
    padding: "6px 16px"
  chip-active:
    backgroundColor: "{colors.lavender}"
    textColor: "{colors.warm-800}"
    rounded: "{rounded.full}"
    padding: "6px 16px"
  card:
    backgroundColor: "{colors.white}"
    textColor: "{colors.warm-800}"
    rounded: "{rounded.card}"
    padding: "20px"
  badge-prompt:
    textColor: "{colors.lavender-ink}"
    typography: "{typography.label}"
    rounded: "{rounded.md}"
    padding: "3px 8px"
  badge-skill:
    textColor: "{colors.mint-ink}"
    typography: "{typography.label}"
    rounded: "{rounded.md}"
    padding: "3px 8px"
  badge-shared:
    textColor: "{colors.sky-ink}"
    rounded: "{rounded.md}"
    padding: "3px 8px"
  menu:
    backgroundColor: "{colors.white}"
    rounded: "{rounded.lg}"
    padding: "6px 0"
  modal:
    backgroundColor: "{colors.white}"
    rounded: "{rounded.sheet}"
    padding: "28px"
  avatar:
    backgroundColor: "{colors.lavender}"
    textColor: "{colors.warm-800}"
    rounded: "{rounded.full}"
    size: "34px"
---

# Design System: Prompt Vault

## Overview

**Creative North Star: "El Cuaderno de Conjuros"**

Prompt Vault es un cuaderno donde cada prompt y cada skill es una fórmula escrita con cuidado, guardada para invocarla en el momento justo. La magia está en el contenido, no en la interfaz: la página es papel cálido y ordenado, las fórmulas se leen en tipografía monoespaciada como si estuvieran transcritas a mano, y el color pastel funciona como las cintas y pestañas de un cuaderno bien organizado: marca, clasifica y se aparta.

El carácter es **ordenado y preciso**. La densidad es media: tarjetas con aire suficiente para leer tres líneas de cada fórmula, pero una cuadrícula de hasta tres columnas para recorrer la colección de un vistazo. Cada color tiene un trabajo concreto (tipo, categoría, estado compartido, acción principal) y nada es decorativo. El modo oscuro cambia el papel por tinta azul noche sin cambiar la lógica: los pasteles se convierten en luz tenue sobre fondo profundo.

Se rechazan explícitamente los **colores saturados** y el **exceso de decoración**: ni tonos chillones, ni ilustraciones, emojis o adornos que compitan con el texto de las fórmulas.

**Key Characteristics:**
- Neutros cálidos (papel) en claro; azul tinta en oscuro.
- Pasteles solo como código de información: lavanda = acción y prompt, menta = skill, cielo = compartido.
- Bordes finos de 1px como estructura; sombras solo para capas superpuestas o en respuesta a hover.
- Una sola familia sans (Plus Jakarta Sans) para la interfaz y monoespaciada para el texto de las fórmulas.
- Esquinas suaves y consistentes (10–16px); píldoras solo para filtros.

## Colors

Pasteles empolvados sobre neutros cálidos: la paleta clasifica, nunca grita.

### Primary
- **Lavanda Sello** (lavender): el color de la acción y de la marca. Botones primarios, chip de filtro activo, borde de foco de los campos, candado del logo, avatar sin foto y badge de tipo "Prompt" (al 20% de opacidad con borde al 60%). Su variante de texto, **Tinta Lavanda** (lavender-ink), da contraste legible a texto lavanda sobre fondo claro.

### Secondary
- **Menta Skill** (mint): identifica las skills. Badge "Skill" con rayo, opción activa "Skills" del filtro y del selector de tipo, botón secundario "Crear una skill" del estado vacío, avisos de éxito. **Tinta Menta** (mint-ink) para el texto menta en modo claro.

### Tertiary
- **Cielo Compartido** (sky): señala lo compartido. Badge "Compartido" / "Compartido por [email]". **Tinta Cielo** (sky-ink) para su texto en modo claro.

### Neutral
- **Papel Cálido** (warm-50): fondo de la página en claro y relleno de campos de texto.
- **Papel Blanco** (white): superficies elevadas en claro: tarjetas, header, menús, modales.
- **Hueso** (warm-100) y **Línea de Cuaderno** (warm-200): hover sutil y todos los bordes y separadores en claro.
- **Grafito Suave** (warm-400 → warm-600): placeholders, texto secundario e iconos.
- **Tinta** (warm-800): texto principal en claro y texto sobre lavanda/menta en ambos modos (en oscuro se usa dark-900).
- **Noche Profunda** (dark-900) y **Noche** (dark-800): fondo de página y header en oscuro.
- **Pizarra** (dark-700 → dark-500): tarjetas, campos, hover y bordes en oscuro.
- **Niebla** (dark-400 → dark-100): texto secundario a principal en oscuro.

### Category tints
Cada categoría tiene un color de una paleta de diez pasteles: lavanda, rosa, menta, cielo, melocotón, crema, coral (#F4A98C), lila (#D4B8E0), salvia (#B5C9A8) y mantequilla (#F5E6A3). Por defecto: cielo para Código, rosa para Escritura, menta para Marketing, melocotón para Imagen y crema para Productividad; las categorías creadas por el usuario reciben uno estable a partir de su nombre. El usuario puede cambiar el de cada categoría desde "Personalizar colores" (se guarda en su cuenta).

El color se aplica igual en la badge de la tarjeta y del detalle, en el chip de filtro activo (con borde del pastel puro) y en el selector del formulario. En claro es el pastel aclarado con su tinta oscura; en oscuro, el pastel al 18% de opacidad con el pastel como texto. Todos los pares superan 4.5:1. La fuente única es `COLOR_PALETTE` en `src/constants.js`. Sin categoría: gris cálido neutro.

### Danger
- **Rojo Lacre** (danger): solo para destruir o fallar: "Eliminar", "Cerrar sesión", mensajes de error. Nunca como acento decorativo.

### Named Rules
**The Ribbon Rule.** Cada pastel tiene un significado (acción/prompt, skill, compartido, categoría). Si un color no clasifica ni indica una acción, no se usa.

**The Powder-Only Rule.** Ningún color de la interfaz supera la saturación de los pasteles de la paleta; el único tono intenso permitido es el rojo de peligro.

**The Ink-on-Pastel Rule.** El texto sobre un relleno pastel es siempre tinta oscura (warm-800 en claro, dark-900 en oscuro), nunca blanco.

## Typography

**Display Font:** Plus Jakarta Sans (con system-ui, sans-serif)
**Body Font:** Plus Jakarta Sans (con system-ui, sans-serif)
**Label/Mono Font:** SF Mono (con Fira Code, Cascadia Code, ui-monospace)

**Character:** Una sans geométrica y amable para toda la interfaz, que deja a la monoespaciada el papel de "escritura de la fórmula": cuando ves mono, estás leyendo el contenido que vas a copiar.

### Hierarchy
- **Display** (700, 22px, tracking ajustado): títulos de pantalla completa: estado vacío, "Prompt Vault" en el login.
- **Headline** (700, 19px, 1.375): título del item en el detalle y nombre de la app en el header (17px en móvil). Los títulos de modal usan 18px.
- **Title** (600, 15px, 1.375): título de cada tarjeta y botones grandes.
- **Body** (400, 13px, 1.625): extracto de la tarjeta (recortado a 3 líneas), etiquetas de campo (600), menús y textos de apoyo. 14–15px para párrafos explicativos.
- **Label** (600, 11px, +0.025em, MAYÚSCULAS): badges de tipo ("PROMPT", "SKILL"). Las insignias de categoría y compartido usan 11–12px en peso 500 sin mayúsculas.
- **Mono** (400, 13px, 1.625): el texto completo del prompt o skill en el detalle y en el área de texto del formulario, con saltos de línea preservados.

### Named Rules
**The Formula-in-Mono Rule.** La monoespaciada se reserva para el texto del item (lo que se copia). Nunca para etiquetas, botones ni títulos.

**The 16px Input Rule.** Los campos de texto usan 16px en móvil (13–14px en escritorio) para que iOS no haga zoom al enfocarlos.

## Layout

Contenedor centrado de 1160px como máximo, con márgenes laterales de 16px en móvil y 40px desde 640px. Header fijo arriba, con fondo sólido y borde inferior. El orden vertical de la pantalla principal es fijo: buscador → filtro de tipo → chips de categoría → cuadrícula.

La cuadrícula de tarjetas es de 1 columna en móvil, 2 desde 640px y 3 desde 1024px, con 12px de separación (16px en escritorio). Dentro de las tarjetas el ritmo es de 10px entre bloques. Los formularios apilan campos con 16px de separación.

En móvil, los chips de categoría se desplazan en horizontal sin barra visible en lugar de saltar de línea, los modales se convierten en hojas inferiores a ancho completo y todos los márgenes respetan las zonas seguras (`env(safe-area-inset-*)`) para la PWA instalada. Los botones táctiles miden al menos 36–38px.

## Elevation & Depth

Sistema plano por capas: la estructura la dan los bordes de 1px (Línea de Cuaderno en claro, Pizarra en oscuro) y el cambio de tono entre papel y superficie blanca, no las sombras. La sombra aparece solo cuando algo flota sobre otra cosa o como respuesta al hover.

### Shadow Vocabulary
- **Hover de tarjeta** (`box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)`): solo al pasar el ratón por una tarjeta en claro; en oscuro se aclara el borde en su lugar.
- **Menú flotante** (`box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)`): desplegables (tres puntos, "Nuevo", cuenta) y avisos de error.
- **Modal** (`box-shadow: 0 25px 50px -12px rgb(0 0 0 / 0.25)`): sobre un fondo negro al 40% (60% en oscuro) con desenfoque.

### Named Rules
**The Flat-at-Rest Rule.** En reposo nada tiene sombra salvo lo que flota (menús, modales, avisos). La jerarquía de la página se construye con bordes y tono.

## Shapes

Esquinas suaves y consistentes que suben con el tamaño de la pieza: 8px en botones pequeños de menú, 10px en botones, campos y badges, 12px en el buscador, menús y control segmentado, 14px en tarjetas y 16px en modales y el panel de login. Las píldoras completas se reservan para los chips de categoría; los círculos, para el avatar y el spinner. Los bordes son siempre de 1px y sólidos, salvo el chip "Editar" categorías, que usa borde discontinuo para indicar "acción, no filtro".

## Components

### Buttons
Directos y sin adornos: la jerarquía la da el relleno, no el tamaño.
- **Shape:** esquinas suaves (10px).
- **Primary:** relleno Lavanda Sello con texto Tinta, 600, 10px × 24px. Un solo primario por vista.
- **Hover / Focus:** el primario se oscurece ligeramente (brightness 95%); los secundarios pasan a fondo Papel Cálido / Pizarra. Transiciones de color cortas. Deshabilitado: 40% de opacidad.
- **Secondary:** fondo blanco (dark-700 en oscuro), borde Línea de Cuaderno, texto gris cálido.
- **Danger:** relleno Rojo Lacre con texto blanco para confirmar; en contexto (menú, detalle) es texto rojo sobre fondo rojo muy claro.
- **Icon:** cuadrado de 38px con fondo Papel Cálido y borde (tema); el avatar de cuenta es un círculo de 34px.

### Chips
- **Style:** píldora con fondo blanco, borde Línea de Cuaderno y texto gris cálido 13px.
- **State:** "Todos" activo se rellena de Lavanda Sello con texto Tinta en 600 y sin borde; una categoría activa adopta su propio par fondo/texto con borde del pastel puro. El hover de los inactivos tiñe el borde de lavanda.

### Segmented Control
- **Style:** contenedor de 12px de radio con borde y fondo blanco y 4px de relleno interno; los segmentos son botones de 8px de radio.
- **State:** el segmento activo se rellena de lavanda, salvo "Skills"/"Skill", que se rellena de menta con el icono de rayo. Se usa para el filtro de tipo y para elegir el tipo en el formulario.

### Cards / Containers
- **Corner Style:** 14px.
- **Background:** blanco en claro, Pizarra (dark-700) en oscuro.
- **Shadow Strategy:** plana en reposo; sombra de hover (ver Elevation & Depth).
- **Border:** 1px Línea de Cuaderno / dark-500.
- **Internal Padding:** 16px en móvil, 20px en escritorio; título, extracto de 3 líneas y fila de badges separados por 10px.

### Badges
- **Tipo:** 11px en mayúsculas, borde del color del tipo al 60%, relleno al 20%: lavanda para "Prompt", menta con rayo para "Skill". Siempre presente en tarjeta y detalle.
- **Categoría:** relleno con el par fondo/texto de su categoría, sin borde, 12px.
- **Compartido:** cielo con icono de compartir; "Compartido" en los propios, "Compartido por [email]" (recortado) en los ajenos.

### Inputs / Fields
- **Style:** fondo Papel Cálido (dark-700 en oscuro), borde 1px, 10px de radio, 10px × 14px. El buscador es más alto (14px), con 12px de radio, fondo blanco e icono de lupa a la izquierda.
- **Focus:** el borde cambia a Lavanda Sello; sin anillo ni resplandor.
- **Error / Disabled:** los errores se muestran como bloque de texto rojo sobre fondo rojo muy claro con borde, bajo el formulario; deshabilitado al 40–50% de opacidad.

### Navigation
- **Header:** fijo, fondo blanco (dark-800), borde inferior. Izquierda: candado lavanda y nombre de la app (vuelve al inicio y resetea los filtros). Derecha: tema, botón "Nuevo ▾" en lavanda y avatar de cuenta. En móvil se mantiene en una sola fila.
- **Menús desplegables:** panel blanco (dark-700), borde, 12px de radio, sombra flotante, entrada con escala y desplazamiento de 0.2s; se cierran al hacer clic fuera o con Escape. Las acciones destructivas van en rojo y al final, tras un separador cuando lo hay.

### Modal
Ventana centrada de 16px de radio y 28px de relleno en escritorio; hoja inferior a ancho completo con esquinas superiores redondeadas en móvil. Cabecera con título de 18px y botón de cierre cuadrado. Entra con la animación de escala y desplazamiento de 0.2s.

## Do's and Don'ts

### Do:
- **Do** asignar cada pastel a un único significado: lavanda para acción y prompt, menta para skill, cielo para compartido.
- **Do** mostrar el badge de tipo en todas las tarjetas y en el detalle, para que un prompt y una skill nunca se confundan.
- **Do** usar texto Tinta (warm-800 / dark-900) sobre cualquier relleno pastel.
- **Do** separar superficies con bordes de 1px y cambio de tono; guardar la sombra para lo que flota.
- **Do** escribir el texto del item en monoespaciada de 13px con los saltos de línea preservados.
- **Do** probar cada componente en claro y en oscuro: cada token neutro tiene su pareja dark-*.

### Don't:
- **Don't** introducir colores más saturados que los pasteles de la paleta; el rojo de peligro es la única excepción y solo para acciones destructivas o errores.
- **Don't** añadir ilustraciones, emojis decorativos, patrones de fondo ni adornos que compitan con el texto de los items.
- **Don't** usar texto blanco sobre lavanda, menta o cielo.
- **Don't** poner sombras en tarjetas o campos en reposo.
- **Don't** usar la monoespaciada para etiquetas, botones o títulos.
