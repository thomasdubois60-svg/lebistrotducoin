'use client'
import Image from 'next/image'
import { PageHero } from '@/components/page-hero'
import { useSiteContent } from '@/components/content-provider'

const imageUrl = (value: unknown) => typeof value === 'string' && (value.trim().startsWith('/photos/') || /^https:\/\//i.test(value.trim())) ? value.trim() : ''
const priceParts = (value?: string) => (value || '').split(/\s*(?:\/|·)\s*/).filter(Boolean).map(part => part.replace(/^([^:]+):\s*(.+)$/, '$1 — $2'))
const isPriceDescription = (value?: string) => Boolean(value && /€/.test(value) && /\b(?:cl|litres?|l)\b/i.test(value))

const slugify = (value: string, index: number) => {
  const slug = value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
  return slug || `categorie-${index + 1}`
}

export default function MenuPage() {
  const { menu, pageTexts } = useSiteContent()
  return <>
    <PageHero eyebrow="Notre cuisine" title="La carte" text={pageTexts.menuIntro}/>
    <nav className="category-nav" aria-label="Accès rapide aux catégories"><div className="container category-nav-inner">
      {menu.map((section, index)=><a key={`${section.category}-${index}`} href={`#${slugify(section.category,index)}`}>{section.category}</a>)}
    </div></nav>
    <section className="section"><div className="container card-menu">
      {menu.map((section,index)=><section id={slugify(section.category,index)} key={`${section.category}-${index}`} className="menu-section scroll-target">
        <h2>{section.category}</h2>
        {section.items.map((item,i)=>{const image=imageUrl(item.image),descriptionIsPrice=isPriceDescription(item.description),prices=priceParts([descriptionIsPrice?item.description:'',item.price].filter(Boolean).join(' · '));return <div className={`menu-product ${image?'with-image':''}`} key={`${section.category}-${item.name}-${i}`}>
          {image&&<div className="menu-product-image"><Image src={image} alt={item.imageAlt||item.name} fill sizes="(max-width: 800px) 110px, 140px"/></div>}
          <strong className="menu-product-name">{item.name}</strong>
          {item.description&&!descriptionIsPrice&&<small className="menu-product-description">{item.description}</small>}
          <span className="menu-product-price">{prices.map((part,partIndex,parts)=><span key={`${part}-${partIndex}`}>{part}{partIndex<parts.length-1&&<i> · </i>}</span>)}</span>
        </div>})}
      </section>)}
    </div></section>
  </>
}
