'use client'
import {useLanguage} from '@/components/language-provider'
import { useRef, useState, useEffect } from 'react'
import { PageHero } from '@/components/page-hero'
import { useSiteContent } from '@/components/content-provider'
import { normalizeGalleryAlbums, GalleryAlbum, AlbumPhoto } from '@/lib/gallery-albums'
import styles from './gallery.module.css'
const validImage = (value: string) => value.trim().startsWith('/photos/') || /^https:\/\//i.test(value.trim())

function Album({ album, onOpen }: { album: GalleryAlbum; onOpen: (photo: AlbumPhoto, title: string) => void }) {
  const {t}=useLanguage()
  return <section className={styles.album} id="gallery-photos" aria-labelledby="gallery-album-title"><div className={styles.heading}><h2 id="gallery-album-title">{album.title || t('Album')}</h2><span className={styles.count}>{t(album.photos.length===1?'1 photo':'{count} photos',{count:album.photos.length})}</span></div><div className={styles.grid}>{album.photos.map((photo,index)=><figure className={styles.photo} key={photo.id}><button type="button" onClick={()=>onOpen(photo,album.title)} aria-label={`${t('Agrandir la photo')} ${index+1} — ${album.title}`}><img src={photo.image.trim()} alt={photo.imageAlt||photo.label||''} loading={index<4?'eager':'lazy'} decoding="async"/><span className={styles.enlarge} aria-hidden="true">↗</span></button>{photo.label&&<figcaption>{photo.label}</figcaption>}</figure>)}</div></section>
}

export default function GalleryPage() {
 const {t}=useLanguage();

  const content = useSiteContent()
  const albums = normalizeGalleryAlbums(content).map(album => ({ ...album, photos: album.photos.filter(photo => validImage(photo.image)) })).filter(album => album.photos.length)
  const [albumId,setAlbumId]=useState<string|null>(null)
  const activeAlbum=albums.find(album=>album.id===albumId)||albums[0]
  const dialog = useRef<HTMLDialogElement>(null)
  const [selected, setSelected] = useState<{photo: AlbumPhoto; title: string} | null>(null)
  useEffect(() => { if (!selected) return; const previous = document.body.style.overflow; document.body.style.overflow = 'hidden'; return () => { document.body.style.overflow = previous } }, [selected])
  const open = (photo: AlbumPhoto, title: string) => { setSelected({ photo, title }); dialog.current?.showModal() }
  return <div className={styles.gallery}><PageHero eyebrow={t("Ambiance & assiettes")} title={t("Galerie")} text={content.pageTexts.galleryIntro}/><section className={styles.collection}><div className="container">{albums.length>0&&<div className={styles.albums} role="group" aria-label={t('Choisir un album')}>{albums.map(album=><button type="button" key={album.id} aria-pressed={activeAlbum?.id===album.id} aria-controls="gallery-photos" onClick={()=>setAlbumId(album.id)}>{album.title||t('Album')}</button>)}</div>}{activeAlbum&&<Album key={activeAlbum.id} album={activeAlbum} onOpen={open}/>}</div></section><dialog ref={dialog} className={styles.lightbox} aria-label={t("Photo agrandie")} onClose={() => setSelected(null)} onClick={event => { if (event.target === event.currentTarget) dialog.current?.close() }}><button type="button" className={styles.close} onClick={() => dialog.current?.close()} aria-label={t("Fermer la photo")}>{t("Fermer ×")}</button>{selected && <figure><img src={selected.photo.image.trim()} alt={selected.photo.imageAlt || selected.photo.label || ''}/><figcaption>{selected.photo.label || selected.title}</figcaption></figure>}</dialog></div>
}
