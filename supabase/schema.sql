-- ============================================================
-- Esquema del blog academico UNSM - FISI
-- Ejecutar en: Supabase Dashboard > SQL Editor
-- ============================================================

-- Publicaciones (trabajos por unidad y semana)
create table if not exists public.publicaciones (
  id uuid primary key default gen_random_uuid(),
  unidad smallint not null check (unidad between 1 and 3),
  semana smallint not null check (semana between 1 and 16),
  titulo text not null,
  tipo text not null default 'Informe',
  asignatura text,
  periodo text,
  resumen text,
  contenido text,
  etiquetas text[] default '{}',
  archivo_url text,
  portada_url text,
  imagenes text[] default '{}',
  videos text[] default '{}',
  autor_correo text,
  creado_en timestamptz not null default now()
);

-- Comentarios
create table if not exists public.comentarios (
  id uuid primary key default gen_random_uuid(),
  publicacion_id uuid not null references public.publicaciones (id) on delete cascade,
  autor_correo text not null,
  autor_nombre text not null,
  contenido text not null,
  creado_en timestamptz not null default now()
);

-- ============================================================
-- Row Level Security (RLS)
-- ============================================================
alter table public.publicaciones enable row level security;
alter table public.comentarios enable row level security;

-- Publicaciones: lectura publica
drop policy if exists "lectura_publica_publicaciones" on public.publicaciones;
create policy "lectura_publica_publicaciones" on public.publicaciones
  for select using (true);

-- Publicaciones: el autor crea y administra las suyas
drop policy if exists "insert_autor_publicacion" on public.publicaciones;
create policy "insert_autor_publicacion" on public.publicaciones
  for insert with check (auth.jwt() ->> 'email' = autor_correo);

drop policy if exists "update_autor_publicacion" on public.publicaciones;
create policy "update_autor_publicacion" on public.publicaciones
  for update using (auth.jwt() ->> 'email' = autor_correo);

drop policy if exists "delete_autor_publicacion" on public.publicaciones;
create policy "delete_autor_publicacion" on public.publicaciones
  for delete using (auth.jwt() ->> 'email' = autor_correo);

-- Comentarios: lectura publica
drop policy if exists "lectura_publica_comentarios" on public.comentarios;
create policy "lectura_publica_comentarios" on public.comentarios
  for select using (true);

-- Comentarios: insert solo para usuarios autenticados
drop policy if exists "insert_autenticado_comentario" on public.comentarios;
create policy "insert_autenticado_comentario" on public.comentarios
  for insert with check (
    auth.role() = 'authenticated' and auth.jwt() ->> 'email' = autor_correo
  );

-- Comentarios: el autor elimina los suyos
drop policy if exists "delete_autor_comentario" on public.comentarios;
create policy "delete_autor_comentario" on public.comentarios
  for delete using (auth.jwt() ->> 'email' = autor_correo);

-- Comentarios: el autor edita los suyos
drop policy if exists "update_autor_comentario" on public.comentarios;
create policy "update_autor_comentario" on public.comentarios
  for update using (auth.jwt() ->> 'email' = autor_correo)
  with check (auth.jwt() ->> 'email' = autor_correo);

-- ============================================================
-- Reacciones (me gusta) por publicacion
-- ============================================================
create table if not exists public.reacciones (
  id uuid primary key default gen_random_uuid(),
  publicacion_id uuid not null references public.publicaciones (id) on delete cascade,
  autor_correo text not null,
  creado_en timestamptz not null default now(),
  unique (publicacion_id, autor_correo)
);

alter table public.reacciones enable row level security;

drop policy if exists "lectura_publica_reacciones" on public.reacciones;
create policy "lectura_publica_reacciones" on public.reacciones
  for select using (true);

drop policy if exists "insert_autenticado_reaccion" on public.reacciones;
create policy "insert_autenticado_reaccion" on public.reacciones
  for insert with check (
    auth.role() = 'authenticated' and auth.jwt() ->> 'email' = autor_correo
  );

drop policy if exists "delete_autor_reaccion" on public.reacciones;
create policy "delete_autor_reaccion" on public.reacciones
  for delete using (auth.jwt() ->> 'email' = autor_correo);

-- ============================================================
-- Storage: bucket publico para archivos de trabajos
-- ============================================================
insert into storage.buckets (id, name, public)
values ('archivos', 'archivos', true)
on conflict (id) do update set public = true;

drop policy if exists "leer_archivos_publicos" on storage.objects;
create policy "leer_archivos_publicos" on storage.objects
  for select using (bucket_id = 'archivos');

drop policy if exists "subir_archivos_autenticados" on storage.objects;
create policy "subir_archivos_autenticados" on storage.objects
  for insert with check (bucket_id = 'archivos' and auth.role() = 'authenticated');