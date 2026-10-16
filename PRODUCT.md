# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Uso personal: el usuario principal es el propio autor, que trabaja a diario con asistentes de IA y necesita tener a mano sus prompts y skills. Otras personas entran solo como receptoras o emisoras de items compartidos; no hay equipos, roles ni administración.

## Product Purpose

Prompt Vault es una bóveda personal para guardar, organizar, encontrar y copiar prompts y skills de IA. Existe para que el texto bueno que uno escribe o encuentra (en foros, blogs, conversaciones) no se pierda en notas sueltas y esté listo para reutilizarse. El éxito es que, en mitad de una tarea con una IA, el usuario encuentre el item adecuado y lo copie sin fricción.

## Positioning

Frente a guardar prompts en notas o documentos, Prompt Vault ofrece tres cosas a la vez:

- **Prompts y skills como tipos distintos:** un prompt es una petición puntual; una skill es una instrucción de rol reutilizable (p. ej. "Experto en Python"). Se filtran y se distinguen visualmente.
- **La misma bóveda en cualquier dispositivo:** PWA instalable con los datos sincronizados en la nube por cuenta de usuario.
- **Compartir:** el usuario puede compartir sus items y ver, copiar (no editar) los que otros comparten, con su autoría visible.

## Operating Context

- Se usa junto a un asistente de IA abierto en otra ventana o app: buscar → abrir → copiar → pegar.
- Escritorio y móvil (PWA instalable, modo claro y oscuro).
- Desplegada en Vercel (https://prompt-vault-three-xi.vercel.app); datos y autenticación en Supabase.

## Capabilities and Constraints

- Items con título, categoría, texto y tipo (`prompt` | `skill`); un item sin tipo se trata como prompt.
- Búsqueda por título y texto, filtro por tipo (Todos / Prompts / Skills) y por categoría; se combinan.
- Categorías gestionables por el usuario (guardadas en el dispositivo, no en la nube).
- Crear, editar, eliminar y copiar al portapapeles. Compartir / dejar de compartir los items propios.
- Items compartidos por otros: solo lectura y copia; muestran "Compartido por [email]".
- Autenticación con email + contraseña o Google. Hay que iniciar sesión para ver cualquier contenido.
- Interfaz en español.
- Stack existente: React + Vite + Tailwind CSS v4, Supabase (auth + Postgres con RLS), PWA.
- Abierto: no hay importación/exportación ni migración de los datos antiguos de localStorage.

## Brand Commitments

- Nombre: **Prompt Vault**. Icono de candado como marca.
- Voz: español cercano y directo, tuteando ("Tu bóveda está vacía", "Guardar mi primer prompt").

## Evidence on Hand

- Iconos PWA y favicon en `public/`; política de privacidad en `public/privacy.html` (requisito de Google OAuth).
- No hay testimonios, métricas de uso, clientes ni capturas de marketing: no deben inventarse.

## Product Principles

1. **Encontrar y copiar rápido manda.** Cualquier cambio se mide por cuánto acerca al usuario del texto correcto en el portapapeles.
2. **Un prompt no es una skill.** La distinción de tipo es parte del producto, no decoración; debe seguir siendo evidente en toda la interfaz.
3. **Lo mío y lo compartido nunca se confunden.** Debe quedar claro qué es propio (editable) y qué es de otros (solo lectura) y de quién es.
4. **Igual de bien en el móvil que en el escritorio.** La bóveda es la misma en todos los dispositivos; ninguna función es solo de escritorio.
