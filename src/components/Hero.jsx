export default function Hero({ stats }) {
  return (
    <section className="banner">
      <div className="container banner-grid">
        <div>
          <span className="banner-eyebrow">Ingeniería de Sistemas e Informática</span>
          <h1>
            Bitácora académica
            <br />
            semestre 2026-II
          </h1>
          <p>
            Mis trabajos de clase organizados semana a semana, ordenados por
            unidades académicas, con un espacio para comentarios y aportes.
          </p>
          <div className="chips">
            <span className="chip">IV ciclo</span>
            <span className="chip">2026-II</span>
            <span className="chip">UNSM · Tarapoto</span>
          </div>
        </div>
        <div className="banner-logos">
          <img src="assets/img/logo-unsm.png" alt="Universidad Nacional de San Martín" />
          <img src="assets/img/logo-fisi.png" alt="Facultad de Ingeniería de Sistemas e Informática" />
        </div>
      </div>
      <div className="container stats">
        <div>
          <b>{stats.publicaciones}</b>
          <span>publicaciones</span>
        </div>
        <div>
          <b>{stats.unidades}</b>
          <span>unidades</span>
        </div>
        <div>
          <b>{stats.semanas}</b>
          <span>semanas de clase</span>
        </div>
        <div>
          <b>{stats.examenes}</b>
          <span>exámenes</span>
        </div>
      </div>
    </section>
  )
}