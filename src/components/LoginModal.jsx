import { useState } from 'react'
import { useAuth } from '../auth/AuthContext'

export default function LoginModal({ onClose }) {
  const { iniciarSesion, crearCuenta } = useAuth()
  const [modo, setModo] = useState('login')
  const [correo, setCorreo] = useState('')
  const [contrasena, setContrasena] = useState('')
  const [nombre, setNombre] = useState('')
  const [mensaje, setMensaje] = useState(null)
  const [cargando, setCargando] = useState(false)

  async function enviar(e) {
    e.preventDefault()
    setMensaje(null)
    setCargando(true)
    if (contrasena.length < 6) {
      setMensaje({ tipo: 'error', texto: 'La contraseña debe tener al menos 6 caracteres.' })
      setCargando(false)
      return
    }
    const { error } = modo === 'login'
      ? await iniciarSesion(correo, contrasena)
      : await crearCuenta(correo, contrasena, nombre)

    setCargando(false)
    if (error) {
      setMensaje({ tipo: 'error', texto: error.message })
    } else if (modo === 'signup') {
      setMensaje({
        tipo: 'ok',
        texto: 'Cuenta creada. Revisa tu correo para confirmarla (si el correo ya existe, inicia sesión).',
      })
      setModo('login')
    } else {
      onClose()
    }
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <h2>Iniciar sesión</h2>
        <p className="units-sub">Necesario para comentar{correo ? '.' : '.'} </p>
        <form onSubmit={enviar}>
          {modo === 'signup' && (
            <div className="form-row">
              <label>Nombre (cómo aparecerás en tus comentarios)</label>
              <input
                type="text"
                required
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                placeholder="Ej: María Pérez"
              />
            </div>
          )}
          <div className="form-row">
            <label>Correo</label>
            <input
              type="email"
              required
              value={correo}
              onChange={(e) => setCorreo(e.target.value)}
              placeholder="tu@correo.com"
            />
          </div>
          <div className="form-row">
            <label>Contraseña</label>
            <input
              type="password"
              required
              value={contrasena}
              onChange={(e) => setContrasena(e.target.value)}
              placeholder="••••••••"
            />
          </div>
          {mensaje && (
            <div className={`mensaje ${mensaje.tipo}`}>{mensaje.texto}</div>
          )}
          <div className="form-actions">
            <button type="button" className="btn btn-ghost" onClick={onClose}>
              Cancelar
            </button>
            <button type="submit" className="btn btn-primary" disabled={cargando}>
              {cargando ? 'Procesando…' : modo === 'login' ? 'Iniciar sesión' : 'Crear cuenta'}
            </button>
          </div>
        </form>
        <p style={{ fontSize: '0.85rem', color: 'var(--ink-soft)', marginTop: 10 }}>
          {modo === 'login' ? (
            <>
              ¿No tienes cuenta?{' '}
              <a href="#" onClick={(e) => { e.preventDefault(); setMensaje(null); setModo('signup') }}>
                Crear cuenta
              </a>
            </>
          ) : (
            <>
              ¿Ya tienes cuenta?{' '}
              <a href="#" onClick={(e) => { e.preventDefault(); setMensaje(null); setModo('login') }}>
                Iniciar sesión
              </a>
            </>
          )}
        </p>
      </div>
    </div>
  )
}