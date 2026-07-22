import Link from 'next/link'

export default function Home() {
  return (
    <>
      <section className="hero hero-photo">
        <div className="hero-overlay" />
        <div className="container hero-content">
          <span className="eyebrow light">Bienvenue à Saint-Laurent-Nouan</span>
          <h1>Le Bistrot<br/><em>Du Coin</em></h1>
          <p>« Le Bistrot est avant tout un lieu où l’on vient se rencontrer, passer et partager de bons moments. Voilà ce que vous trouverez en poussant nos portes. »</p>
          <div className="actions"><Link className="button" href="/aujourdhui">Voir le menu du jour</Link><a className="button ghost" href="tel:+33254443670">02 54 44 36 70</a></div>
        </div>
      </section>
      <section className="section"><div className="container intro-grid"><div><span className="eyebrow">L’esprit bistrot</span><h2>Simple, généreux et convivial</h2><p className="lead">Une cuisine de saison, des produits choisis avec soin et une équipe heureuse de vous accueillir au cœur de la place de la Halle.</p><div className="home-links"><Link href="/carte" className="text-link">Découvrir la carte →</Link><Link href="/histoire" className="text-link">Lire notre histoire →</Link></div></div><div className="wood-card"><strong>Restauration</strong><span>Du lundi au vendredi</span><hr/><strong>Adresse</strong><span>15 Place de la Halle<br/>41220 Saint-Laurent-Nouan</span></div></div></section>
      <section className="feature-strip"><div className="container feature-grid"><div><b>01</b><h3>Fait maison</h3><p>Des plats préparés sur place avec des produits de saison.</p></div><div><b>02</b><h3>À partager</h3><p>Des planches, des sourires et de vrais moments de convivialité.</p></div><div><b>03</b><h3>Au cœur du village</h3><p>Une adresse vivante et chaleureuse sur la place de la Halle.</p></div></div></section>
      <section className="section centered"><div className="container narrow"><span className="eyebrow">Une table pour aujourd’hui ?</span><h2>Appelez-nous, on s’occupe du reste.</h2><a className="button" href="tel:+33254443670">Réserver par téléphone</a></div></section>
    </>
  )
}
