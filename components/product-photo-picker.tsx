'use client'

import { useRef, useState } from 'react'

type SearchResult = { title: string; thumbnail: string; sourceUrl: string; domain: string }

export function ProductPhotoPicker({ password, image, productName, busy, onSelect, onRemove }: {
  password: string
  image?: string
  productName: string
  busy: boolean
  onSelect: (source: File | string) => Promise<void>
  onRemove: () => void
}) {
  const cameraRef = useRef<HTMLInputElement>(null)
  const libraryRef = useRef<HTMLInputElement>(null)
  const [searchOpen, setSearchOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<SearchResult[]>([])
  const [searching, setSearching] = useState(false)
  const [error, setError] = useState('')

  const search = async (event: React.FormEvent) => {
    event.preventDefault()
    if (!query.trim()) return
    setSearching(true); setError('')
    try {
      const response = await fetch(`/api/image-search?q=${encodeURIComponent(query.trim())}`, { headers: { 'x-admin-password': password }, cache: 'no-store' })
      const data = await response.json()
      if (!response.ok) throw new Error(data.error || 'Recherche impossible.')
      setResults(data.results || [])
    } catch (reason) { setError(reason instanceof Error ? reason.message : 'Recherche impossible.') }
    setSearching(false)
  }

  const chooseFile = (file?: File) => { if (file) void onSelect(file) }

  return <div className="product-photo-picker">
    {image && <img src={image} alt={productName || 'Photo du produit'}/>} 
    <strong>Ajouter / rechercher une photo</strong>
    <div className="product-photo-actions">
      <button type="button" className="button secondary" disabled={busy} onClick={() => setSearchOpen(open => !open)}>Rechercher sur le web</button>
      <button type="button" className="button secondary" disabled={busy} onClick={() => cameraRef.current?.click()}>Prendre une photo</button>
      <button type="button" className="button secondary" disabled={busy} onClick={() => libraryRef.current?.click()}>Choisir dans mes photos</button>
      {image && <button type="button" className="danger-link" disabled={busy} onClick={onRemove}>Supprimer la photo</button>}
    </div>
    <input ref={cameraRef} className="visually-hidden" type="file" accept="image/jpeg,image/png,image/webp" capture="environment" onChange={event => { chooseFile(event.target.files?.[0]); event.currentTarget.value = '' }}/>
    <input ref={libraryRef} className="visually-hidden" type="file" accept="image/jpeg,image/png,image/webp" onChange={event => { chooseFile(event.target.files?.[0]); event.currentTarget.value = '' }}/>
    {searchOpen && <div className="product-image-search">
      <p className="admin-help">Résultats de Wikimedia Commons. L’image choisie sera copiée dans les photos du site.</p>
      <form onSubmit={search}><label>Rechercher une image<input value={query} onChange={event => setQuery(event.target.value)} placeholder="Ex. logo Pelforth"/></label><button className="button" disabled={searching || !query.trim()}>{searching ? 'Recherche…' : 'Rechercher'}</button></form>
      {error && <p className="admin-login-message">{error}</p>}
      <div className="product-image-results">{results.map(result => <article key={result.sourceUrl}>
        <img src={result.thumbnail} alt={result.title}/><strong>{result.title}</strong><small>{result.domain}</small>
        <a href={result.sourceUrl} target="_blank" rel="noreferrer">Voir la source</a>
        <button type="button" className="button secondary" disabled={busy} onClick={() => void onSelect(result.thumbnail)}>Utiliser cette image</button>
      </article>)}</div>
    </div>}
  </div>
}
