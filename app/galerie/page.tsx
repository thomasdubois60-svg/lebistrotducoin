'use client'
import Image from 'next/image'
import { PageHero } from '@/components/page-hero'
import { useSiteContent } from '@/components/content-provider'

const validImageUrl = (value: unknown): value is string => typeof value === 'string' && (value.trim().startsWith('/photos/') || /^https:\/\//i.test(value.trim()))

export default function GalleryPage() {
  const { gallery, pageTexts } = useSiteContent()
  const photos = gallery.filter(photo => validImageUrl(photo.src))
  return <><PageHero eyebrow="Ambiance & assiettes" title="Galerie" text={pageTexts.galleryIntro}/>{photos.length>0&&<section className="section"><div className="container gallery-grid">{photos.map((photo,i)=><figure key={`${photo.src}-${i}`} className={i===0?'gallery-item featured':'gallery-item'}><Image src={photo.src.trim()} alt={photo.alt||photo.label||'Photo du Bistrot'} fill sizes="(max-width: 800px) 100vw, 50vw"/>{photo.label&&<figcaption>{photo.label}</figcaption>}</figure>)}</div></section>}</>
}
