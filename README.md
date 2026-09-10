# Bitácora Académica · UNSM FISI

Blog académico de la Universidad Nacional de San Martín (Tarapoto, Perú) - Facultad de
Ingeniería de Sistemas e Informática.

## Características

- Login con correo y contraseña (Supabase Auth)
- Comentarios por publicación (solo usuarios autenticados)
- Subida de trabajos organizados en **3 unidades**:
  - Unidad I: 4 semanas
  - Unidad II: 4 semanas
  - Unidad III: 6 semanas
- Archivos, portadas, evidencias y videos por trabajo (Supabase Storage)
- Desplegado en GitHub Pages

## Stack

- **Frontend:** React + Vite (sitio estático)
- **Backend:** Supabase (Auth, PostgreSQL, Storage)
- **Deploy:** GitHub Pages + GitHub Actions

## Configuración local

1. Instala dependencias: `npm install`
2. Copia `.env.example` a `.env` y completa los valores
3. Ejecuta `supabase/schema.sql` en el SQL Editor de Supabase
4. Corre el proyecto: `npm run dev`

## Variables de entorno

| Variable | Descripción |
|---|---|
| `VITE_SUPABASE_URL` | URL del proyecto de Supabase |
| `VITE_SUPABASE_ANON_KEY` | Key publishable / anon |
| `VITE_ADMIN_EMAIL` | Correo que podrá publicar y administrar trabajos |

## Autor

Estudiante de Ingeniería de Sistemas e Informática · UNSM · Tarapoto, Perú

## Despliegue

El sitio se publica automáticamente en GitHub Pages al hacer push a `main`
(workflow `.github/workflows/deploy.yml`).