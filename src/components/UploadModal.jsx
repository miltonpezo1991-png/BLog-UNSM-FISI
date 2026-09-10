import { useState } from 'react'
import { supabase } from '../supabase'
import { UNIDADES } from '../config'
import { useAuth } from '../auth/AuthContext'

const TIPOS = ['Informe', 'Mapa mental', 'Presentación', 'Ensayo', 'Otro']

function subirArchivo(carpeta, archivo) {
  const ruta = `${carpeta}/${Date.now()}-${archivo.name.replace(/[^a-zA-Z0-9._-]/g, '_')}`
  return supabase.storage.from('archivos').upload(ruta, archivo).then(({ error }) => {
    if (error) throw error
    return supabase.storage.from('archivos').getPublicUrl(ruta).data.publicUrl
  })
}

export default function UploadModal({ onClose, onPublicado }) {
  const { user } = useAuth()
  const [form, setForm] = useState({
    unidad: 1,
    semana: 1,
    titulo: '',
    tipo: TIPOS[0],
    asignatura: 'Teoría General de Sistemas',
    periodo: '2026-II',
    resumen: '',
    contenido: '',
    etiquetas: '',
    archivo: null,
    portada: null,
    imagenes: [],
    videos: [],
  })
  const [cargando, setCargando] = useState(false)
  const [mensaje, setMensaje] = useState(null)

  function set(k, v) {
    setForm((f) => ({ ...f, [k]: v }))
  }

  async function enviar(e) {
    e.preventDefault()
    setMensaje(null)
    if (!form.titulo.trim()) {
      setMensaje({ tipo: 'error', texto: 'El título es obligatorio.' })
      return
    }
    setCargando(true)
    try {
      const carpeta = `unidad-${form.unidad}/semana-${form.semana}`
      let archivoUrl = null
      let portadaUrl = null
      const imagenes = []
      const videos = []

      if (form.archivo) archivoUrl = await subirArchivo(carpeta, form.archivo)
      if (form.portada) portadaUrl = await subirArchivo(carpeta, form.portada)
      for (const img of form.imagenes) imagenes.push(await subirArchivo(carpeta, img))
      for (const vid of form.videos) videos.push(await subirArchivo(carpeta, vid))

      const etiquetas = form.etiquetas
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean)

      const { error } = await supabase.from('publicaciones').insert({
        unidad: Number(form.unidad),
        semana: Number(form.semana),
        titulo: form.titulo.trim(),
        tipo: form.tipo,
        asignatura: form.asignatura.trim(),
        periodo: form.periodo.trim(),
        resumen: form.resumen.trim(),
        contenido: form.contenido.trim(),
        etiquetas,
        archivo_url: archivoUrl,
        portada_url: portadaUrl,
        imagenes,
        videos,
        autor_correo: user.email,
      })

      if (error) throw error
      onPublicado()
      onClose()
    } catch (err) {
      setMensaje({ tipo: 'error', texto: err.message || 'Error al publicar.' })
      setCargando(false)
    }
  }

  const semanasDisponibles = UNIDADES.find((u) => u.unidad === Number(form.unidad))?.semanas ?? [1, 2, 3, 4]

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal modal-wide" onClick={(e) => e.stopPropagation()}>
        <h2>Publicar nuevo trabajo</h2>
        <form onSubmit={enviar}>
          <div className="form-grid">
            <div className="form-row">
              <label>Unidad</label>
              <select value={form.unidad} onChange={(e) => set('unidad', Number(e.target.value))}>
                {UNIDADES.map((u) => (
                  <option key={u.unidad} value={u.unidad}>
                    Unidad {u.unidad} ({u.semanas.length} semanas)
                  </option>
                ))}
              </select>
            </div>
            <div className="form-row">
              <label>Semana</label>
              <select value={form.semana} onChange={(e) => set('semana', Number(e.target.value))}>
                {semanasDisponibles.map((w) => (
                  <option key={w} value={w}>
                    Semana {w}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="form-row">
            <label>Título</label>
            <input value={form.titulo} onChange={(e) => set('titulo', e.target.value)} required />
          </div>
          <div className="form-grid">
            <div className="form-row">
              <label>Tipo de trabajo</label>
              <select value={form.tipo} onChange={(e) => set('tipo', e.target.value)}>
                {TIPOS.map((t) => (
                  <option key={t}>{t}</option>
                ))}
              </select>
            </div>
            <div className="form-row">
              <label>Asignatura</label>
              <input value={form.asignatura} onChange={(e) => set('asignatura', e.target.value)} />
            </div>
          </div>
          <div className="form-grid">
            <div className="form-row">
              <label>Periodo</label>
              <input value={form.periodo} onChange={(e) => set('periodo', e.target.value)} />
            </div>
            <div className="form-row">
              <label>Etiquetas (separadas por coma)</label>
              <input value={form.etiquetas} onChange={(e) => set('etiquetas', e.target.value)} placeholder="teoría, informes" />
            </div>
          </div>
          <div className="form-row">
            <label>Resumen corto</label>
            <input value={form.resumen} onChange={(e) => set('resumen', e.target.value)} />
          </div>
          <div className="form-row">
            <label>Contenido / descripción</label>
            <textarea rows={4} value={form.contenido} onChange={(e) => set('contenido', e.target.value)} />
          </div>
          <div className="form-grid">
            <div className="form-row">
              <label>Archivo del trabajo</label>
              <input type="file" accept=".pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx,.zip" onChange={(e) => set('archivo', e.target.files[0])} />
              <p className="file-hint">PDF, Word, PowerPoint, Excel o ZIP.</p>
            </div>
            <div className="form-row">
              <label>Portada (opcional)</label>
              <input type="file" accept="image/*" onChange={(e) => set('portada', e.target.files[0])} />
              <p className="file-hint">JPG, PNG o WebP.</p>
            </div>
          </div>
          <div className="form-grid">
            <div className="form-row">
              <label>Imágenes adicionales (opcional)</label>
              <input type="file" accept="image/*" multiple onChange={(e) => set('imagenes', Array.from(e.target.files))} />
            </div>
            <div className="form-row">
              <label>Videos (opcional)</label>
              <input type="file" accept="video/*" multiple onChange={(e) => set('videos', Array.from(e.target.files))} />
            </div>
          </div>
          {mensaje && <div className={`mensaje ${mensaje.tipo}`}>{mensaje.texto}</div>}
          <div className="form-actions">
            <button type="button" className="btn btn-ghost" onClick={onClose}>
              Cancelar
            </button>
            <button type="submit" className="btn btn-primary" disabled={cargando}>
              {cargando ? 'Publicando…' : 'Publicar trabajo'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}