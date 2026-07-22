export type MenuItem = { name: string; description?: string; price?: string; image?: string; imageAlt?: string }
export type MenuSection = { category: string; items: MenuItem[] }
export type GalleryItem = { src: string; alt: string; label: string }
export type SiteContent = {
  daily: {
    dateLabel: string
    starters: MenuItem[]
    mains: MenuItem[]
    suggestion: MenuItem
    desserts: MenuItem[]
  }
  menu: MenuSection[]
  gallery: GalleryItem[]
}

export const defaultContent: SiteContent = {
  daily: {
    dateLabel: "Aujourd’hui",
    starters: [{ name: "Entrée du jour 1" }, { name: "Entrée du jour 2" }, { name: "Entrée du jour 3" }],
    mains: [{ name: "Plat du jour 1" }, { name: "Plat du jour 2" }, { name: "Plat du jour 3" }],
    suggestion: { name: "Suggestion du chef", description: "Selon arrivage", price: "+4 €" },
    desserts: [{ name: "Dessert du jour 1" }, { name: "Dessert du jour 2" }, { name: "Dessert du jour 3" }]
  },
  menu: [
    {
      category: "À partager… ou pas",
      items: [
        { name: "Planche mixte", description: "Rosette de Lyon, chorizo, terrine du moment, jambon de pays, jambon blanc et sélection de 3 fromages", price: "20 €" },
        { name: "Saucisson sec du terroir", description: "Cèpes, nature ou piment d’Espelette", price: "6 €" },
        { name: "Chips Lay’s 145 g", description: "Nature, barbecue…", price: "3 €" }
      ]
    },
    {
      category: "Notre sélection de vins",
      items: [
        { name: "Masfleur — rosé de Provence", description: "12 cl : 5 € · 25 cl : 9 €", price: "50 cl : 16 €" },
        { name: "Saint-Nicolas-de-Bourgueil — rouge de Loire", description: "12 cl : 5 € · 25 cl : 9 €", price: "50 cl : 16 €" }
      ]
    },
    {
      category: "Cocktails du moment",
      items: [
        { name: "Tequila Sunrise", description: "Tequila, jus d’orange, sirop de grenadine", price: "8 €" },
        { name: "Délices des îles", description: "Rhum blanc martiniquais, jus de maracuja, sirop de grenadine", price: "8 €" }
      ]
    },
    {
      category: "Nos pressions",
      items: [
        { name: "Pélican", description: "25 cl : 4,50 € · 33 cl : 6 €", price: "50 cl : 8 €" },
        { name: "Pelforth", description: "25 cl : 3,50 € · 33 cl : 5 €", price: "50 cl : 6 €" },
        { name: "Gallia West IPA", description: "25 cl : 4,50 € · 33 cl : 6 €", price: "50 cl : 8 €" }
      ]
    },
    {
      category: "Bières en bouteille",
      items: [
        { name: "Chouffe / Duvel / Triple Karmeliet / Rince Cochon / Leffe", price: "5 €" },
        { name: "Paix Dieu / Orval / Queue de Charrue", price: "6 €" }
      ]
    },
    {
      category: "Bières sans alcool",
      items: [
        { name: "Heineken 0.0 / Desperados 0.0", price: "5 €" }
      ]
    },
    {
      category: "Softs",
      items: [
        { name: "Coca-Cola, Coca-Cola Zéro, Fuze Tea pêche, Schweppes, Orangina, Perrier, limonade et jus de fruits", price: "3,50 €" }
      ]
    },
    {
      category: "Boissons chaudes",
      items: [
        { name: "Expresso / Café serré", price: "1,50 €" },
        { name: "Allongé / Noisette", price: "1,60 €" },
        { name: "Thé / Café crème", price: "3 €" },
        { name: "Chocolat chaud", price: "3 €" },
        { name: "Cappuccino", price: "3,20 €" }
      ]
    },
    {
      category: "Apéritifs",
      items: [
        { name: "Ricard", price: "2,50 €" },
        { name: "Kir", description: "Cassis, mûre, pêche ou framboise", price: "2,50 €" },
        { name: "Kir pétillant", price: "3,70 €" },
        { name: "Pétillant nature", description: "Blanc de blancs brut", price: "3,50 €" },
        { name: "Porto", description: "Rouge ou blanc", price: "4,50 €" },
        { name: "Martini", description: "Rouge ou blanc", price: "4,50 €" }
      ]
    },
    {
      category: "Whiskys",
      items: [
        { name: "Sir Edwards", description: "Écosse", price: "6 €" },
        { name: "Jameson", description: "Irlande", price: "7 €" },
        { name: "Jack Daniel’s", description: "États-Unis", price: "7 €" },
        { name: "Glenlivet", description: "Écosse", price: "8 €" },
        { name: "Togouchi", description: "Japon", price: "8 €" },
        { name: "Yamagochi", price: "8 €" },
        { name: "Aberstone", description: "Légèrement tourbé", price: "8 €" },
        { name: "Big Peat", description: "Très tourbé", price: "8 €" }
      ]
    }
  ],
  gallery: [
    { src: "/photos/facade.webp", alt: "Façade du Bistrot Du Coin", label: "Le Bistrot" },
    { src: "/photos/interieur-bar.webp", alt: "Bar et intérieur du restaurant", label: "Notre ambiance" },
    { src: "/photos/plat-pommes.webp", alt: "Assiette maison aux pommes de terre", label: "Cuisine maison" },
    { src: "/photos/plat-couscous.webp", alt: "Couscous généreux du Bistrot", label: "Plat du jour" },
    { src: "/photos/plat-saumon.webp", alt: "Pavé de saumon et légumes", label: "Produits frais" },
    { src: "/photos/plat-crevettes.webp", alt: "Crevettes cuisinées et riz", label: "Saveurs du moment" },
    { src: "/photos/plat-choucroute.webp", alt: "Grande choucroute préparée au Bistrot", label: "Générosité" }
  ]
}
