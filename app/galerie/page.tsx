'use client'
import Image from 'next/image'
import { PageHero } from '@/components/page-hero'
import { useSiteContent } from '@/components/content-provider'

export default function GalleryPage() {
  const { gallery } = useSiteContent()
  return <><PageHero eyebrow="Ambiance & assiettes" title="Galerie" text="Un aperçu de l’atmosphère du Bistrot Du Coin."/><section className="section"><div className="container gallery-grid">{gallery.map((photo,i)=><figure key={i} className={i===0?'gallery-item featured':'gallery-item'}><Image src={photo.src} alt={photo.alt} fill sizes="(max-width: 800px) 100vw, 50vw"/><figcaption>{photo.label}</figcaption></figure>)}</div></section></>
}
