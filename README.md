# Prompt Vault

Aplicación web personal para guardar, organizar y gestionar prompts y skills de IA. Permite categorizar, buscar, compartir y personalizar la experiencia con colores y orden de categorías.

**🔗 https://prompt-vault-three-xi.vercel.app**

## Features

- Autenticación con Google y con email + contraseña
- Tipos de item personalizables (por defecto Prompt y Skill): crear, renombrar, eliminar, reordenar y elegir su color, con filtro por tipo
- Búsqueda por título y contenido
- Categorías personalizables: crear, renombrar, eliminar, reordenar (arrastrar y soltar) y elegir su color
- Compartir items de dos formas: con personas concretas por email (lo ven en su bóveda al iniciar sesión) o con un enlace público de solo lectura que no requiere cuenta
- Copiar al portapapeles en un clic
- Papelera: lo eliminado se puede deshacer al momento o restaurar durante 30 días
- Modo oscuro
- Responsive e instalable como PWA

## Stack

- [React 19](https://react.dev) + [Vite](https://vite.dev)
- [Tailwind CSS v4](https://tailwindcss.com)
- [Supabase](https://supabase.com): Auth (Google + email) y base de datos Postgres con Row Level Security

## Desarrollo local

Requisitos: Node.js 20+ y un proyecto de Supabase.

```bash
npm install
cp .env.example .env   # rellena las dos variables
npm run dev            # http://localhost:5173
```

Variables de entorno (`.env`):

| Variable | Valor |
|---|---|
| `VITE_SUPABASE_URL` | URL del proyecto (`https://<ref>.supabase.co`) |
| `VITE_SUPABASE_ANON_KEY` | Clave pública *anon* (nunca la `service_role`) |

### Base de datos

Ejecuta en el SQL Editor de Supabase, en este orden:

1. [`supabase/schema.sql`](supabase/schema.sql): tabla `items` con sus políticas RLS.
2. [`supabase/user_preferences.sql`](supabase/user_preferences.sql): tabla `user_preferences` (colores).
3. [`supabase/user_preferences_v2.sql`](supabase/user_preferences_v2.sql): orden de categorías y colores de los tipos.
4. [`supabase/types_v3.sql`](supabase/types_v3.sql): tipos personalizables.
5. [`supabase/sharing_v4.sql`](supabase/sharing_v4.sql): compartir por email y enlace público.
6. [`supabase/trash_v5.sql`](supabase/trash_v5.sql): papelera (`deleted_at`); lo que está en ella deja de verse al compartir.

En Supabase → Authentication → URL Configuration, añade como Redirect URLs la URL de producción y `http://localhost:5173`.

En Supabase → Authentication → Providers → Email, fija la longitud mínima de contraseña en **8** (la misma que valida el formulario).

### Scripts

| Comando | Qué hace |
|---|---|
| `npm run dev` | Servidor de desarrollo |
| `npm run build` | Build de producción en `dist/` |
| `npm run preview` | Sirve el build localmente |
| `npm run lint` | Lint con Oxlint |

## Deploy

[Vercel](https://vercel.com), con auto-deploy en cada push a `main`. Las variables `VITE_SUPABASE_URL` y `VITE_SUPABASE_ANON_KEY` se configuran en Vercel → Settings → Environment Variables.

[`vercel.json`](vercel.json) define las cabeceras de seguridad (CSP, `X-Frame-Options`, `nosniff`…), `noindex` para los enlaces compartidos y caché larga para `/assets`. Si añades un servicio externo (imágenes, APIs), amplía la CSP o el navegador lo bloqueará.

La analítica es [Vercel Web Analytics](https://vercel.com/docs/analytics), sin cookies: actívala en el proyecto de Vercel → Analytics.

Páginas estáticas en `public/`: [`privacy.html`](public/privacy.html), [`aviso-legal.html`](public/aviso-legal.html), [`404.html`](public/404.html), `robots.txt` y `sitemap.xml`. Si cambias de dominio, actualiza las URLs absolutas de `index.html`, `robots.txt` y `sitemap.xml`.
