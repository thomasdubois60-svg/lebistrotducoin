'use client'
import {useLanguage} from './language-provider'
export function PageHero({ eyebrow, title, text }: { eyebrow: string; title: string; text?: string }) {
  const {t}=useLanguage()
  return <section className="page-hero"><div className="container"><span className="eyebrow">{t(eyebrow)}</span><h1>{t(title)}</h1>{text && <p>{t(text)}</p>}</div></section>
}
