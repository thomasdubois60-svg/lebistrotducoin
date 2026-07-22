'use client'
import Image from 'next/image'
import { PageHero } from '@/components/page-hero'
import { useSiteContent } from '@/components/content-provider'

export default function MenuPage() {
  const { menu } = useSiteContent()
  return <>
    <PageHero eyebrow="Notre cuisine" title="La carte" text="Des recettes de bistrot, généreuses et sans détour."/>
    <section className="section"><div className="container card-menu">
      {menu.map((section)=><section key={section.category} className="menu-section">
        <h2>{section.category}</h2>
        {section.items.map((item,i)=><div className={`menu-product ${item.image ? 'with-image' : ''}`} key={`${section.category}-${item.name}-${i}`}>
          {item.image&&<div className="menu-product-image"><Image src={item.image} alt={item.imageAlt||item.name} fill sizes="(max-width: 800px) 110px, 140px"/></div>}
          <div className="menu-row large"><div><strong>{item.name}</strong>{item.description&&<small>{item.description}</small>}</div><span>{item.price}</span></div>
        </div>)}
      </section>)}
    </div></section>
  </>
}
