'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'

const links = [
  ['/', 'Accueil'],
  ['/aujourdhui', "Aujourd’hui"],
  ['/carte', 'Carte'],
  ['/histoire', 'Notre histoire'],
  ['/galerie', 'Galerie'],
  ['/contact', 'Contact']
]

export function Header() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  return (
    <header className="site-header">
      <div className="container nav-wrap">
        <Link href="/" className="brand" onClick={() => setOpen(false)}>
          <span className="brand-mark">BDC</span>
          <span><strong>Le Bistrot</strong><small>Du Coin</small></span>
        </Link>
        <button className="menu-button" aria-label="Ouvrir le menu" onClick={() => setOpen(!open)}>☰</button>
        <nav className={open ? 'nav open' : 'nav'}>
          {links.map(([href, label]) => (
            <Link key={href} href={href} className={pathname === href ? 'active' : ''} onClick={() => setOpen(false)}>{label}</Link>
          ))}
          <a className="button compact" href="tel:+33254443670">Réserver</a>
        </nav>
      </div>
    </header>
  )
}
