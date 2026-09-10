import { useAuth } from '../auth/AuthContext'
import { esAdmin } from '../config'

export default function Navbar({ onLogin, onLogout, onPublicar }) {
  const { user } = useAuth()
  const iniciales = user?.email ? user.email[0].toUpperCase() : '?'

  return (
    <header className="navbar">
      <div className="container navbar-inner">
        <div className="brand">
          <img src="assets/img/logo-unsm.png" alt="Logo UNSM" />
          <div className="brand-text">
            <strong>Bitácora Académica</strong>
            <small>Universidad Nacional de San Martín · FISI</small>
          </div>
        </div>
        <nav className="nav-actions">
          {user ? (
            <>
              <span className="avatar">
                <span className="avatar-dot">{iniciales}</span>
                {esAdmin(user.email) ? (
                  <em>Admin</em>
                ) : (
                  <span style={{ color: 'var(--ink-soft)' }}>{user.email}</span>
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