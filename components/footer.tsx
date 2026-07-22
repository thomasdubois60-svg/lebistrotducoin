import Link from 'next/link'

export function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-grid">
        <div><h3>Le Bistrot Du Coin</h3><p>15 Place de la Halle<br/>41220 Saint-Laurent-Nouan</p></div>
        <div><h3>Contact</h3><p><a href="tel:+33254443670">02 54 44 36 70</a><br/><a href="mailto:lebistrotducoin41220@gmail.com">lebistrotducoin41220@gmail.com</a></p></div>
        <div><h3>Horaires</h3><p>Lun–Jeu : 7h–20h<br/>Vendredi : 7h–15h</p></div>
        <div><h3>Navigation</h3><p><Link href="/administration">Administration</Link><br/><Link href="/contact">Nous trouver</Link></p></div>
      </div>
      <div className="container footer-bottom">© {new Date().getFullYear()} Le Bistrot Du Coin</div>
    </footer>
  )
}
