import { useEffect, useMemo, useState } from 'react'
import { supabase } from './supabase'
import { UNIDADES } from './config'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import LoginModal from './components/LoginModal'
import UploadModal from './components/UploadModal'
import PostDetail from './components/PostDetail'

export default function App() {
  const [publicaciones, setPublicaciones] = useState([])
  const [cargando, setCargando] = useState(true)
  const [unidad, setUnidad] = useState(1)
  const [modales, setModales] = useState({ login: false, publicar: false, detalle: null })

  async function cargar() {
    setCargando(true)
    const { data } = await supabase
      .from('publicaciones')
      .select('*')
      .order('creado_en', { ascending: false })
    setPublicaciones(data ?? [])
    setCargando(false)
  }

  useEffect(() => {
    cargar()
  }, [])

  const datosUnidad = useMemo(() => {
    return UNIDADES.map((u) => {
      const semanas = Array.from({ length: u.semanas }, (_, i) => {
        const posts = publicaciones
          .filter((p) => p.unidad === u.unidad && p.semana === i + 1)
          .sort((a, b) => new Date(b.creado_en) - new Date(a.creado_en))
        return { semana: i + 1, posts }
      })
      return { ...u, semanas }
    })
  }, [publicaciones])

  const unidadActiva = datosUnidad.find((u) => u.unidad === unidad) ?? datosUnidad[0]
  const totalPosts = publicaciones.length
  const ultimaPub = publicaciones[0]

  return (
    <>
      <Navbar
        onLogin={() => setModales((m) => ({ ...m, login: true }))}
        onLogout={() => supabase.auth.signOut()}
        onPublicar={() => setModales((m) => ({ ...m, publicar: true }))}
      />

      <Hero />

      <main className="container sections">
        <section className="units" id="trabajos">
          <h2>Mis trabajos</h2>
          <p className="units-sub">
            Organizados por unidades académicas y semanas de clase. Haz clic en una
            semana para ver sus publicaciones.
          </p>

          <div className="unit-tabs">
            {datosUnidad.map((u) => (
              <button
                key={u.unidad}
                className={`unit-tab ${u.unidad === unidad ? 'active' : ''}`}
                onClick={() => setUnidad(u.unidad)}
              >
                Unidad {u.unidad}
                <small>
                  {u.semanas.length} semanas ·{' '}
                  {publicaciones.filter((p) => p.unidad === u.unidad).length} publicaciones
                </small>
              </button>
            ))}
          </div>

          {cargando ? (
            <div className="loading">Cargando publicaciones…</div>
          ) : (
            <div className="weeks">
              {unidadActiva?.semanas.map((s) => (
                <button key={s.semana} className="week-card">
                  <h3>Semana {s.semana}</h3>
                  <span className="week-count">
                    <b>{s.posts.length}</b> {s.posts.length === 1 ? 'trabajo' : 'trabajos'}
                  </span>
                  {s.posts.length === 0 ? (
                    <p className="empty-week" style={{ margin: 0, border: 'none', padding: '14px 0 0', textAlign: 'left' }}>
                      Sin publicaciones todavía.
                    </p>
                  ) : (
                    s.posts.map((p) => (
                      <div
                        key={p.id}
                        className="post-card"
                        onClick={(e) => {
                          e.stopPropagation()
                          setModales((m) => ({ ...m, detalle: p }))
                        }}
                      >
                        <div className="pc-titulo">{p.titulo}</div>
                        <div className="pc-tipo">{p.tipo} · {p.asignatura}</div>
                      </div>
                    ))
                  )}
                </button>
              ))}
            </div>
          )}

          <div className="publicaciones-meta">
            <span className="stat">
              <b>{totalPosts}</b> publicaciones activas
            </span>
            <span className="stat">
              <b>3</b> unidades académicas
            </span>
            <span className="stat">
              <b>14</b> semanas
            </span>
            <span className="stat">
              {ultimaPub ? (
                <>
                  Última: <b>{ultimaPub.titulo}</b>
                </>
              ) : (
                <>Sin publicaciones aún</>
              )}
            </span>
          </div>
        </section>

        <section className="about" id="sobre">
          <div className="container">
            <h2 style={{ color: 'var(--unsm-green-dark)', marginBottom: 6 }}>Sobre este espacio</h2>
            <p className="units-sub" style={{ marginBottom: 18 }}>
              Un portafolio académico para organizar, compartir y mejorar mis trabajos de clase.
            </p>
            <div className="about-grid">
              <div>
                <h3>Estructura</h3>
                <ul>
                  <li>Trabajos organizados por unidades y semanas.</li>
                  <li>Archivos, evidencias e imágenes por publicación.</li>
                  <li>Etiquetas para identificar cada tipo de trabajo.</li>
                </ul>
              </div>
              <div>
                <h3>Participación</h3>
                <ul>
                  <li>Comentarios identificados con inicio de sesión.</li>
                  <li>Aportes, preguntas y críticas constructivas.</li>
                  <li>Solo el autor publica y administra los trabajos.</li>
                </ul>
              </div>
              <div>
                <h3>Almacenamiento</h3>
                <ul>
                  <li>Base de datos en Supabase (PostgreSQL).</li>
                  <li>Archivos alojados en Supabase Storage.</li>
                  <li>Desplegado en GitHub Pages.</li>
                </ul>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer>
        <div className="footer-logos">
          <img src="assets/img/logo-unsm.png" alt="UNSM" />
          <img src="assets/img/logo-fisi.png" alt="FISI" />
        </div>
        <p><b>Bitácora Académica</b> · Universidad Nacional de San Martín</p>
        <p>Facultad de Ingeniería de Sistemas e Informática · Tarapoto, Perú</p>
        <p style={{ marginTop: 6, fontSize: '0.8rem', opacity: 0.75 }}>Proyecto académico · 2026-II</p>
      </footer>

      {modales.login && <LoginModal onClose={() => setModales((m) => ({ ...m, login: false }))} />}
      {modales.publicar && (
        <UploadModal
          onClose={() => setModales((m) => ({ ...m, publicar: false }))}
          onPublicado={cargar}
        />
      )}
      {modales.detalle && (
        <PostDetail
          post={modales.detalle}
          onClose={() => setModales((m) => ({ ...m, detalle: null }))}
          onCambio={cargar}
        />
      )}
    </>
  )
}