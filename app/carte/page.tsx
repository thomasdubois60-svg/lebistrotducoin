'use client'
import Image from 'next/image'
import { PageHero } from '@/components/page-hero'
import { useSiteContent } from '@/components/content-provider'

const slugify = (value: string, index: number) => {
  const slug = value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
  return slug || `categorie-${index + 1}`
}

export default function MenuPage() {
  const { menu } = useSiteContent()
  return <>
    <PageHero eyebrow="Notre cuisine" title="La carte" text="Des recettes de bistrot, généreuses et sans détour."/>
    <nav className="category-nav" aria-label="Accès rapide aux catégories"><div className="container category-nav-inner">
      {menu.map((section, index)=><a key={`${section.category}-${index}`} href={`#${slugify(section.category,index)}`}>{section.category}</a>)}
    </div></nav>
    <section className="section"><div className="container card-menu">
      {menu.map((section,index)=><section id={slugify(section.category,index)} key={`${section.category}-${index}`} className="menu-section scroll-target">
        <h2>{section.category}</h2>
        {section.items.map((item,i)=><div className={`menu-product ${item.image ? 'with-image' : ''}`} key={`${section.category}-${item.name}-${i}`}>
          {item.image&&<div className="menu-product-image"><Image src={item.image} alt={item.imageAlt||item.name} fill sizes="(max-width: 800px) 110px, 140px"/></div>}
          <div className="menu-row large"><div><strong>{item.name}</strong>{item.description&&<small>{item.description}</small>}</div><span>{item.price}</span></div>
        </div>)}
      </section>)}
    </div></section>
  </>
}
