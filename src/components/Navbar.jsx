import { useAuth } from '../auth/AuthContext'
import { esAdmin } from '../config'

export default function Navbar({ onLogin, onLogout, onPublicar }) {
  const { user } = useAuth()
  const nombre =
    user?.user_metadata?.nombre ||
    (user?.email ? user.email.split('@')[0] : '')
  const iniciales = nombre[0]?.toUpperCase() ?? '?'

  return (
    <header className="topbar">
      <div className="container topbar-inner">
        <div className="brand">
          <img src="assets/img/logo-unsm.png" alt="Logo UNSM" />
          <div className="brand-text">
            <strong>Blog de Trabajo UNSM-FISI</strong>
            <small>UNSM · FISI — Tarapoto</small>
          </div>
        </div>
        <nav className="nav-actions">
          {user ? (
            <>
              <span className="avatar">
                <span className="avatar-dot">{iniciales}</span>
                {esAdmin(user.email) ? (
                  <em>Admin · {nombre}</em>
                ) : (
                  <span>{nombre}</span>
                )}
              </span>
              {esAdmin(user.email) && (
                <button className="btn btn-primary" onClick={onPublicar}>
                  ＋ Subir trabajo
                </button>
              )}
              <button className="btn btn-ghost" onClick={onLogout}>
                Cerrar sesión
              </button>
            </>
          ) : (
            <button className="btn btn-primary" onClick={onLogin}>
              Iniciar sesión
            </button>
          )}
        </nav>
      </div>
    </header>
  )
}