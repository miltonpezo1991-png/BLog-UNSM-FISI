export default function Hero() {
  return (
    <section className="hero">
      <div className="container hero-inner">
        <div>
          <h1>Portafolio académico personal</h1>
          <p>
            Bitácora de los trabajos desarrollados durante mi formación en
            Ingeniería de Sistemas e Informática. Cada publicación reúne su
            archivo, evidencias y un espacio de comentarios para recibir
            aportes.
          </p>
          <span className="badge">FISI · IV ciclo · 2026-II</span>
          <div className="hero-logos">
            <img src="assets/img/logo-unsm.png" alt="Universidad Nacional de San Martín" />
            <img src="assets/img/logo-fisi.png" alt="Facultad de Ingeniería de Sistemas e Informática" />
          </div>
        </div>
      </div>
    </section>
  )
}