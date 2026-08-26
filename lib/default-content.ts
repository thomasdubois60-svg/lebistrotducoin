export type MenuItem = { name: string; description?: string; price?: string; image?: string; imageAlt?: string }
export type MenuSection = { category: string; items: MenuItem[] }
export type GalleryItem = { src: string; alt: string; label: string }
export type FormulaItem = { name: string; price: string; description?: string; takeawayPrice?: string }
export type EventGalleryItem = { src: string; alt?: string }
export type EventItem = { title: string; date: string; description: string; price?: string; image?: string; imageAlt?: string; gallery?: EventGalleryItem[] }
export type SocialLink = { label: string; url: string }
export type ClubContent = {
  presentation: string
  programExplanation: string
  conditions: string
  rewards: string[]
  availableTitle: string
  historyTitle: string
  summaryTitle: string
  savingsMessage: string
}
export type SiteContent = {
  heroImage: string
  general: { phone: string; phoneHref: string; email: string; address: string; hours: string; closureEnabled: boolean; closureMessage: string; closureStart: string; closureEnd: string; analyticsUrl: string }
  pageTexts: { homeSlogan: string; todayIntro: string; menuIntro: string; galleryIntro: string; contactIntro: string; eventsIntro: string; reviewsIntro: string }
  daily: { dateLabel: string; startersTitle: string; mainsTitle: string; dessertsTitle: string; suggestionSupplementText: string; formulas: FormulaItem[]; starters: MenuItem[]; mains: MenuItem[]; suggestion: MenuItem; desserts: MenuItem[] }
  menu: MenuSection[]
  gallery: GalleryItem[]
  story: { eyebrow: string; title: string; intro: string; paragraphs: string[]; quote: string; image: string; imageAlt: string }
  privatization: { title: string; intro: string; text: string; photos: GalleryItem[] }
  events: EventItem[]
  reviews: { title: string; intro: string; googleReviewsUrl: string; googleReviewWriteUrl: string }
  socials: SocialLink[]
  club: ClubContent
}

export const defaultContent: SiteContent = {
  heroImage: '/photos/facade.webp',
  general: {
    phone: '02 54 44 36 70', phoneHref: '+33254443670', email: 'lebistrotducoin41220@gmail.com',
    address: '15 Place de la Halle\n41220 Saint-Laurent-Nouan',
    hours: 'Lundi au jeudi : 7h–20h\nVendredi : 7h–15h\nRestauration : 11h45–14h',
    closureEnabled: false, closureMessage: 'Le Bistrot est exceptionnellement fermé.', closureStart: '', closureEnd: '',
    analyticsUrl: 'https://vercel.com/dashboard'
  },
  pageTexts: {
    homeSlogan: 'Le Bistrot est avant tout un lieu où l’on vient se rencontrer, passer et partager de bons moments. Voilà ce que vous trouverez en poussant nos portes.',
    todayIntro: 'Une formule qui change au fil des envies du chef et des produits disponibles.',
    menuIntro: 'Des recettes de bistrot, généreuses et sans détour.',
    galleryIntro: 'Quelques images de notre cuisine et de l’ambiance du Bistrot.',
    contactIntro: 'Une question, une réservation ou simplement l’envie de venir nous voir ?',
    eventsIntro: 'Concerts, karaokés, soirées à thème et rendez-vous à ne pas manquer.',
    reviewsIntro: 'Retrouvez les avis de nos clients et suivez toute l’actualité du Bistrot.'
  },
  daily: {
    dateLabel: 'Aujourd’hui',
    startersTitle: '3 entrées au choix',
    mainsTitle: '3 plats au choix',
    dessertsTitle: '3 desserts au choix',
    suggestionSupplementText: '+4 € sur le prix du plat du jour ou de la formule choisie',
    formulas: [
      { name: 'Entrée seule', price: 'À compléter', takeawayPrice: '' },
      { name: 'Plat du jour', price: 'À compléter', takeawayPrice: '' },
      { name: 'Dessert seul', price: 'À compléter', takeawayPrice: '' },
      { name: 'Entrée + plat ou plat + dessert', price: 'À compléter', takeawayPrice: '' },
      { name: 'Entrée + plat + dessert', price: 'À compléter', takeawayPrice: '' }
    ],
    starters: [{ name: 'Entrée du jour 1' }, { name: 'Entrée du jour 2' }, { name: 'Entrée du jour 3' }],
    mains: [{ name: 'Plat du jour 1' }, { name: 'Plat du jour 2' }, { name: 'Plat du jour 3' }],
    suggestion: { name: 'Suggestion du chef', description: 'Selon arrivage', price: '+4 €' },
    desserts: [{ name: 'Dessert du jour 1' }, { name: 'Dessert du jour 2' }, { name: 'Dessert du jour 3' }]
  },
  menu: [
    { category: 'À partager… ou pas', items: [
      { name: 'Planche mixte', description: 'Rosette de Lyon, chorizo, terrine du moment, jambon de pays, jambon blanc et sélection de 3 fromages', price: '20 €' },
      { name: 'Saucisson sec du terroir', description: 'Cèpes, nature ou piment d’Espelette', price: '6 €' },
      { name: 'Chips Lay’s 145 g', description: 'Nature, barbecue…', price: '3 €' }
    ]},
    { category: 'Notre sélection de vins', items: [
      { name: 'Masfleur — rosé de Provence', description: '12 cl : 5 € · 25 cl : 9 €', price: '50 cl : 16 €' },
      { name: 'Saint-Nicolas-de-Bourgueil — rouge de Loire', description: '12 cl : 5 € · 25 cl : 9 €', price: '50 cl : 16 €' }
    ]},
    { category: 'Cocktails du moment', items: [
      { name: 'Tequila Sunrise', description: 'Tequila, jus d’orange, sirop de grenadine', price: '8 €' },
      { name: 'Délices des îles', description: 'Rhum blanc martiniquais, jus de maracuja, sirop de grenadine', price: '8 €' }
    ]},
    { category: 'Nos pressions', items: [
      { name: 'Pélican', description: '25 cl : 4,50 € · 33 cl : 6 €', price: '50 cl : 8 €' },
      { name: 'Pelforth', description: '25 cl : 3,50 € · 33 cl : 5 €', price: '50 cl : 6 €' },
      { name: 'Gallia West IPA', description: '25 cl : 4,50 € · 33 cl : 6 €', price: '50 cl : 8 €' }
    ]},
    { category: 'Bières en bouteille', items: [
      { name: 'Chouffe / Duvel / Triple Karmeliet / Rince Cochon / Leffe', price: '5 €' },
      { name: 'Paix Dieu / Orval / Queue de Charrue', price: '6 €' }
    ]},
    { category: 'Bières sans alcool', items: [{ name: 'Heineken 0.0 / Desperados 0.0', price: '5 €' }]},
    { category: 'Softs', items: [{ name: 'Coca-Cola, Coca-Cola Zéro, Fuze Tea pêche, Schweppes, Orangina, Perrier, limonade et jus de fruits', price: '3,50 €' }]},
    { category: 'Boissons chaudes', items: [
      { name: 'Expresso / Café serré', price: '1,50 €' }, { name: 'Allongé / Noisette', price: '1,60 €' },
      { name: 'Thé / Café crème', price: '3 €' }, { name: 'Chocolat chaud', price: '3 €' }, { name: 'Cappuccino', price: '3,20 €' }
    ]},
    { category: 'Apéritifs', items: [
      { name: 'Ricard', price: '2,50 €' }, { name: 'Kir', description: 'Cassis, mûre, pêche ou framboise', price: '2,50 €' },
      { name: 'Kir pétillant', price: '3,70 €' }, { name: 'Pétillant nature', description: 'Blanc de blancs brut', price: '3,50 €' },
      { name: 'Porto', description: 'Rouge ou blanc', price: '4,50 €' }, { name: 'Martini', description: 'Rouge ou blanc', price: '4,50 €' }
    ]},
    { category: 'Whiskys', items: [
      { name: 'Sir Edwards', description: 'Écosse', price: '6 €' }, { name: 'Jameson', description: 'Irlande', price: '7 €' },
      { name: 'Jack Daniel’s', description: 'États-Unis', price: '7 €' }, { name: 'Glenlivet', description: 'Écosse', price: '8 €' },
      { name: 'Togouchi', description: 'Japon', price: '8 €' }, { name: 'Yamagochi', price: '8 €' },
      { name: 'Aberstone', description: 'Légèrement tourbé', price: '8 €' }, { name: 'Big Peat', description: 'Très tourbé', price: '8 €' }
    ]}
  ],
  gallery: [
    { src: '/photos/facade.webp', alt: 'Façade du Bistrot Du Coin', label: 'Le Bistrot' },
    { src: '/photos/interieur-bar.webp', alt: 'Bar et intérieur du restaurant', label: 'Notre ambiance' },
    { src: '/photos/plat-pommes.webp', alt: 'Assiette maison', label: 'Cuisine maison' },
    { src: '/photos/plat-couscous.webp', alt: 'Couscous du Bistrot', label: 'Plat du jour' },
    { src: '/photos/plat-saumon.webp', alt: 'Pavé de saumon', label: 'Produits frais' },
    { src: '/photos/plat-crevettes.webp', alt: 'Crevettes et riz', label: 'Saveurs du moment' },
    { src: '/photos/plat-choucroute.webp', alt: 'Choucroute du Bistrot', label: 'Générosité' }
  ],
  story: {
    eyebrow: 'Depuis 2021', title: 'La petite histoire du Bistrot',
    intro: 'C’est l’histoire de deux passionnés réunis autour du goût, de l’accueil et du plaisir de partager.',
    paragraphs: [
      'Depuis tout petit, Ismaël rêvait d’ouvrir son propre restaurant. Il a suivi les études qui lui ont permis de faire de sa passion son métier. En 2006, après plusieurs années d’expérience, il ouvre son premier restaurant, qu’il revendra treize ans plus tard.',
      'Thomas, lui, rêvait simplement de travailler avec plaisir. Il découvre la restauration en extra pendant ses études, en 2013, et se prend rapidement au jeu du service et de l’animation en salle.',
      'En 2019, les deux passionnés se rencontrent. Deux ans plus tard, le 2 novembre 2021, ils ouvrent ensemble Le Bistrot Du Coin : Ismaël pour régaler vos papilles en cuisine, et Thomas pour vous servir et faire vivre la salle.',
      'De cette rencontre est née une belle amitié, puis une adresse chaleureuse qui grandit chaque année grâce à vous.'
    ],
    quote: 'Le Bistrot est avant tout un lieu où l’on vient se rencontrer, passer et partager de bons moments. Voilà ce que vous trouverez en poussant nos portes.',
    image: '/photos/interieur-bar.webp', imageAlt: 'Le bar chaleureux du Bistrot Du Coin'
  },
  privatization: {
    title: 'Privatisez Le Bistrot',
    intro: 'Un moment rien qu’à vous, imaginé selon vos envies.',
    text: 'Nous pouvons privatiser le restaurant sur devis et selon les souhaits du client : repas de famille, anniversaire, réception professionnelle ou soirée privée. Contactez-nous directement afin que nous construisions ensemble une proposition adaptée.',
    photos: [{ src: '/photos/interieur-bar.webp', alt: 'Salle du Bistrot', label: 'Un lieu à votre image' }, { src: '/photos/facade.webp', alt: 'Façade du Bistrot', label: 'Le Bistrot Du Coin' }]
  },
  events: [],
  reviews: {
    title: 'Avis Google & réseaux sociaux',
    intro: 'Votre avis compte beaucoup pour nous. Consultez les témoignages de nos clients ou partagez votre expérience.',
    googleReviewsUrl: 'https://share.google/I0OlzrRJJKi4ne3kO',
    googleReviewWriteUrl: 'https://share.google/I0OlzrRJJKi4ne3kO'
  },
  socials: [
    { label: 'Facebook', url: 'https://www.facebook.com/share/1BjtCjdbBa/?mibextid=wwXIfr' },
    { label: 'Instagram', url: '' },
    { label: 'TikTok', url: 'https://www.tiktok.com/@lebistrotducoin41?_r=1&_t=ZN-98H20Dw4COs' }
  ],
  club: {
    presentation: 'Bienvenue dans votre Club LBDC : retrouvez en un coup d’œil les avantages que vous pouvez utiliser aujourd’hui et tout ce que votre fidélité vous a déjà apporté.',
    programExplanation: 'À chaque formule achetée, un tampon est ajouté à votre carte. Après 10 tampons, votre prochaine formule complète est offerte.',
    conditions: 'Une seule validation fidélité par jour et par personne. Les avantages sont personnels, non cessibles et utilisables pendant leur période de validité.',
    rewards: ['Une formule complète offerte après 10 tampons', 'Des coupons et offres réservés aux membres'],
    availableTitle: 'Mes avantages disponibles',
    historyTitle: 'Historique de mes avantages',
    summaryTitle: 'Mon bilan Club LBDC',
    savingsMessage: 'Grâce au Club LBDC vous avez déjà économisé {amount}.'
  }
}

function publishedImageUrl(value: unknown) {
  const url = typeof value === 'string' ? value.trim().replace(/\\/g, '/') : ''
  if (!url || /^(blob:|data:|file:)/i.test(url)) return ''
  if (/^https:\/\//i.test(url)) return url
  const publicPath = url.replace(/^\.?\//, '').replace(/^public\//, '')
  return publicPath.startsWith('photos/') ? `/${publicPath}` : ''
}

function normalizeEvents(value: unknown): EventItem[] {
  if (!Array.isArray(value)) return defaultContent.events
  return value.map(source => {
    const event = source && typeof source === 'object' ? source as EventItem : { title: '', date: '', description: '' }
    const image = publishedImageUrl(event.image)
    const normalized = { ...event }
    if (image) normalized.image = image
    else { delete normalized.image; delete normalized.imageAlt }
    const gallery = Array.isArray(event.gallery) ? event.gallery.map(photo => ({
      src: publishedImageUrl(typeof photo === 'string' ? photo : photo?.src),
      alt: typeof photo === 'object' && typeof photo?.alt === 'string' ? photo.alt : ''
    })).filter(photo => photo.src) : []
    return { ...normalized, gallery }
  })
}

export function normalizeContent(value: Partial<SiteContent> | null | undefined): SiteContent {
  return {
    ...defaultContent, ...value,
    general: { ...defaultContent.general, ...(value?.general || {}) },
    pageTexts: { ...defaultContent.pageTexts, ...(value?.pageTexts || {}) },
    heroImage: value?.heroImage || defaultContent.heroImage,
    daily: {
      ...defaultContent.daily, ...(value?.daily || {}),
      formulas: value?.daily?.formulas?.length ? value.daily.formulas : defaultContent.daily.formulas,
      starters: value?.daily?.starters?.length ? value.daily.starters : defaultContent.daily.starters,
      mains: value?.daily?.mains?.length ? value.daily.mains : defaultContent.daily.mains,
      desserts: value?.daily?.desserts?.length ? value.daily.desserts : defaultContent.daily.desserts,
      suggestion: { ...defaultContent.daily.suggestion, ...(value?.daily?.suggestion || {}) }
    },
    menu: value?.menu?.length ? value.menu : defaultContent.menu,
    gallery: value?.gallery?.length ? value.gallery : defaultContent.gallery,
    story: { ...defaultContent.story, ...(value?.story || {}), paragraphs: value?.story?.paragraphs?.length ? value.story.paragraphs : defaultContent.story.paragraphs },
    privatization: { ...defaultContent.privatization, ...(value?.privatization || {}), photos: value?.privatization?.photos?.length ? value.privatization.photos : defaultContent.privatization.photos },
    events: normalizeEvents(value?.events),
    reviews: { ...defaultContent.reviews, ...(value?.reviews || {}) },
    socials: value?.socials || defaultContent.socials,
    club: {
      ...defaultContent.club,
      ...(value?.club || {}),
      rewards: value?.club?.rewards?.length ? value.club.rewards : defaultContent.club.rewards
    }
  }
}
