'use client'
import {useLanguage} from '@/components/language-provider'
import { useRef, useState, useEffect } from 'react'
import { PageHero } from '@/components/page-hero'
import { useSiteContent } from '@/components/content-provider'
import { normalizeGalleryAlbums, GalleryAlbum, AlbumPhoto } from '@/lib/gallery-albums'
import styles from './gallery.module.css'
const validImage = (value: string) => value.trim().startsWith('/photos/') || /^https:\/\//i.test(value.trim())

function Album({ album, onOpen }: { album: GalleryAlbum; onOpen: (photo: AlbumPhoto, title: string) => void }) {
 const {t,locale}=useLanguage();

  const track = useRef<HTMLDivElement>(null)
  const id = `gallery-${album.id}`
  const scroll = (direction: number) => track.current?.scrollBy({ left: direction * track.current.clientWidth * .85, behavior: 'smooth' })
  return <section className={styles.album} aria-label={album.title || 'Album'}><div className={styles.heading}><h2>{album.title || 'Album'}</h2><div className={styles.controls}><button type="button" aria-label={`${t("Photos précédentes")} — ${album.title}`} aria-controls={id} onClick={() => scroll(-1)}>←</button><button type="button" aria-label={`${t("Photos suivantes")} — ${album.title}`} aria-controls={id} onClick={() => scroll(1)}>→</button></div></div><div className={styles.track} id={id} ref={track} tabIndex={0} aria-label={`${t("Photos de")} ${album.title}`} onKeyDown={event => { if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') { event.preventDefault(); scroll(event.key === 'ArrowRight' ? 1 : -1) } }}>{album.photos.map((photo, index) => <figure className={styles.photo} key={photo.id}><button type="button" onClick={() => onOpen(photo, album.title)} aria-label={`${t("Agrandir la photo")} ${index + 1} — ${album.title}`}><img src={photo.image.trim()} alt={photo.imageAlt || photo.label || ''} loading="lazy" decoding="async"/></button>{photo.label && <figcaption>{photo.label}</figcaption>}</figure>)}</div></section>
}

export default function GalleryPage() {
 const {t,locale}=useLanguage();

  const content = useSiteContent()
  const albums = normalizeGalleryAlbums(content).map(album => ({ ...album, photos: album.photos.filter(photo => validImage(photo.image)) })).filter(album => album.photos.length)
  const dialog = useRef<HTMLDialogElement>(null)
  const [selected, setSelected] = useState<{photo: AlbumPhoto; title: string} | null>(null)
  useEffect(() => { if (!selected) return; const previous = document.body.style.overflow; document.body.style.overflow = 'hidden'; return () => { document.body.style.overflow = previous } }, [selected])
  const open = (photo: AlbumPhoto, title: string) => { setSelected({ photo, title }); dialog.current?.showModal() }
  return <><PageHero eyebrow={t("Ambiance & assiettes")} title={t("Galerie")} text={content.pageTexts.galleryIntro}/><section className="section"><div className="container">{albums.map(album => <Album key={album.id} album={album} onOpen={open}/>)}</div></section><dialog ref={dialog} className={styles.lightbox} aria-label={t("Photo agrandie")} onClose={() => setSelected(null)} onClick={event => { if (event.target === event.currentTarget) dialog.current?.close() }}><button type="button" className={styles.close} onClick={() => dialog.current?.close()} aria-label={t("Fermer la photo")}>{t("Fermer ×")}</button>{selected && <figure><img src={selected.photo.image.trim()} alt={selected.photo.imageAlt || selected.photo.label || ''}/><figcaption>{selected.photo.label || selected.title}</figcaption></figure>}</dialog></>
}
