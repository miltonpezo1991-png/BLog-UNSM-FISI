import { useEffect, useState } from 'react'
import { supabase } from '../supabase'
import { useAuth } from '../auth/AuthContext'
import { esAdmin } from '../config'

export default function PostDetail({ post, onClose, onCambio }) {
  const { user } = useAuth()
  const [comentarios, setComentarios] = useState([])
  const [texto, setTexto] = useState('')
  const [cargando, setCargando] = useState(false)
  const [confirmar, setConfirmar] = useState(false)

  async function cargarComentarios() {
    const { data } = await supabase
      .from('comentarios')
      .select('*')
      .eq('publicacion_id', post.id)
      .order('creado_en', { ascending: true })
    setComentarios(data ?? [])
  }

  useEffect(() => {
    cargarComentarios()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [post.id])

  async function comentar(e) {
    e.preventDefault()
    if (!texto.trim()) return
    setCargando(true)
    const { error } = await supabase.from('comentarios').insert({
      publicacion_id: post.id,
      autor_correo: user.email,
      autor_nombre: user.email.split('@')[0],
      contenido: texto.trim(),
    })
    setCargando(false)
    if (!error) {
      setTexto('')
      cargarComentarios()
    }
  }

  async function eliminar() {
    setCargando(true)
    await supabase.from('publicaciones').delete().eq('id', post.id)
    setCargando(false)
    onCambio()
    onClose()
  }

  const fecha = new Date(post.creado_en).toLocaleDateString('es-PE', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal modal-wide" onClick={(e) => e.stopPropagation()}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 10 }}>
          <span className="tag" style={{ fontSize: '0.8rem' }}>
            Unidad {post.unidad} · Semana {post.semana}
          </span>
          <button className="btn btn-ghost" onClick={onClose} style={{ fontSize: '1.2rem' }} aria-label="Cerrar">
            ✕
          </button>
        </div>
        <h2 style={{ marginTop: 8 }}>{post.titulo}</h2>
        <div className="post-meta-tags">
          <span className="tag">{post.tipo}</span>
          <span className="tag">{post.asignatura}</span>
          <span className="tag">{post.periodo}</span>
          {post.etiquetas?.map((t) => (
            <span key={t} className="tag">{t}</span>
          ))}
        </div>
        <p style={{ fontSize: '0.82rem', color: 'var(--ink-soft)' }}>Publicado el {fecha}</p>
        {post.portada_url && <img className="portada" src={post.portada_url} alt="Portada" />}
        {post.resumen && <p style={{ margin: '10px 0' }}><b>{post.resumen}</b></p>}
        {post.contenido && <p style={{ whiteSpace: 'pre-wrap' }}>{post.contenido}</p>}
        {post.imagenes?.map((u) => (
          <img key={u} className="portada" src={u} alt="Evidencia" />
        ))}
        {post.videos?.map((u) => (
          <video key={u} className="portada" src={u} controls />
        ))}
        {post.archivo_url && (
          <p style={{ marginTop: 10 }}>
            <a className="archivo-link" href={post.archivo_url} target="_blank" rel="noreferrer">
              📄 Descargar archivo del trabajo
            </a>
          </p>
        )}

        <div className="comments">
          <h3>Comentarios ({comentarios.length})</h3>
          {comentarios.length === 0 && (
            <p style={{ fontSize: '0.88rem', color: 'var(--ink-soft)' }}>Aún no hay comentarios. Sé el primero en aportar.</p>
          )}
          {comentarios.map((c) => (
            <div className="comment" key={c.id}>
              <div className="c-head">
                <span className="avatar-dot" style={{ width: 26, height: 26, fontSize: '0.72rem' }}>
                  {c.autor_nombre?.[0]?.toUpperCase() ?? '?'}
                </span>
                <span className="c-nombre">{c.autor_nombre}</span>
                <span className="c-fecha">
                  {new Date(c.creado_en).toLocaleString('es-PE', { dateStyle: 'short', timeStyle: 'short' })}
                </span>
              </div>
              <p>{c.contenido}</p>
            </div>
          ))}

          {user ? (
            <form className="comment-form" onSubmit={comentar}>
              <textarea
                rows={2}
                placeholder="Deja una sugerencia, pregunta o aporte…"
                value={texto}
                onChange={(e) => setTexto(e.target.value)}
              />
              <div className="form-actions">
                <button type="submit" className="btn btn-primary" disabled={cargando || !texto.trim()}>
                  Comentar
                </button>
              </div>
            </form>
          ) : (
            <p style={{ fontSize: '0.9rem', color: 'var(--ink-soft)', marginTop: 8 }}>
              <a href="#" onClick={(e) => e.preventDefault()}>Inicia sesión</a> para comentar.
            </p>
          )}
        </div>

        {esAdmin(user?.email) && (
          <div style={{ marginTop: 14 }}>
            {confirmar ? (
              <div className="mensaje error">
                ¿Seguro que deseas eliminar este trabajo para siempre?
                <div style={{ marginTop: 8, display: 'flex', gap: 8 }}>
                  <button className="btn btn-primary" style={{ background: '#b91c1c' }} onClick={eliminar} disabled={cargando}>
                    Sí, eliminar
                  </button>
                  <button className="btn btn-ghost" onClick={() => setConfirmar(false)}>
                    Cancelar
                  </button>
                </div>
              </div>
            ) : (
              <button className="btn btn-ghost" style={{ color: '#b91c1c' }} onClick={() => setConfirmar(true)}>
                🗑 Eliminar trabajo
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}