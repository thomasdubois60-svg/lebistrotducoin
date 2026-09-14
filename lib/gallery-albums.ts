export type AlbumPhoto = { id: string; image: string; imageAlt: string; order: number; label?: string }
export type GalleryAlbum = { id: string; title: string; order: number; photos: AlbumPhoto[] }
type Source = { galleryAlbums?: unknown; gallery?: unknown }
const record = (value: unknown): Record<string, unknown> => value && typeof value === 'object' ? value as Record<string, unknown> : {}
const text = (value: unknown) => typeof value === 'string' ? value : ''
const position = (value: unknown, fallback: number) => typeof value === 'number' && Number.isFinite(value) ? value : fallback

export function normalizeGalleryAlbums(source: Source = {}): GalleryAlbum[] {
  const albums = Array.isArray(source.galleryAlbums) ? source.galleryAlbums
    : Array.isArray(source.gallery) && source.gallery.length ? [{ id: 'legacy-gallery', title: 'Galerie', photos: source.gallery }] : []
  const ids = new Set<string>()
  return albums.map((value, index) => {
    const album = record(value)
    let id = text(album.id) || `album-${index}`
    while (ids.has(id)) id += `-${index}`
    ids.add(id)
    const photos = (Array.isArray(album.photos) ? album.photos : []).map((value, photoIndex) => {
      const photo = record(value)
      return { id: text(photo.id) || `${id}-photo-${photoIndex}`, image: text(photo.image) || text(photo.src), imageAlt: text(photo.imageAlt) || text(photo.alt), label: text(photo.label), order: position(photo.order, photoIndex) }
    }).sort((a, b) => a.order - b.order).map((photo, order) => ({ ...photo, order }))
    return { id, title: text(album.title), order: position(album.order, index), photos }
  }).sort((a, b) => a.order - b.order).map((album, order) => ({ ...album, order }))
}
