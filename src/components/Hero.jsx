import { AUTOR } from '../config'

export default function Hero({ stats }) {
  return (
    <section className="banner">
      <div className="container banner-grid">
        <div>
          <span className="banner-eyebrow">Facultad de Ingeniería de Sistemas e Informática</span>
          <h1>
            Blog de Trabajo
            <br />
            UNSM-FISI
          </h1>

          <div className="autor-box">
            <p>Semestre: {AUTOR.periodo}</p>
            <p>Ciclo: {AUTOR.ciclo}</p>
            <p>Curso: {AUTOR.curso}</p>
            <p>Docente: {AUTOR.docente}</p>
            <p>
              Estudiante: <b>{AUTOR.nombre}</b>
            </p>
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