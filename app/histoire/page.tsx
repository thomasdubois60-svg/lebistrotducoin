import Image from 'next/image'
import { PageHero } from '@/components/page-hero'

export const metadata = {
  title: 'La petite histoire du Bistrot',
  description: 'Découvrez l’histoire d’Ismaël et Thomas, les deux passionnés à l’origine du Bistrot Du Coin.'
}

export default function HistoirePage() {
  return (
    <>
      <PageHero
        eyebrow="Depuis 2021"
        title="La petite histoire du Bistrot"
        text="C’est l’histoire de deux passionnés réunis autour du goût, de l’accueil et du plaisir de partager."
      />
      <section className="section story-section">
        <div className="container story-grid">
          <div className="story-copy">
            <span className="eyebrow">Deux parcours, une même envie</span>
            <h2>Une belle aventure humaine</h2>
            <p>Depuis tout petit, Ismaël rêvait d’ouvrir son propre restaurant. Il a suivi les études qui lui ont permis de faire de sa passion son métier. En 2006, après plusieurs années d’expérience, il ouvre son premier restaurant, qu’il revendra treize ans plus tard.</p>
            <p>Thomas, lui, rêvait simplement de travailler avec plaisir. Il découvre la restauration en extra pendant ses études, en 2013, et se prend rapidement au jeu du service et de l’animation en salle.</p>
            <p>En 2019, les deux passionnés se rencontrent. Deux ans plus tard, le 2 novembre 2021, ils ouvrent ensemble Le Bistrot Du Coin : Ismaël pour régaler vos papilles en cuisine, et Thomas pour vous servir et faire vivre la salle.</p>
            <p>De cette rencontre est née une belle amitié, puis une adresse chaleureuse qui grandit chaque année grâce à vous.</p>
            <blockquote>« Le Bistrot est avant tout un lieu où l’on vient se rencontrer, passer et partager de bons moments. Voilà ce que vous trouverez en poussant nos portes. »</blockquote>
          </div>
          <figure className="story-photo">
            <Image src="/photos/interieur-bar.webp" alt="Le bar chaleureux du Bistrot Du Coin" fill sizes="(max-width: 800px) 100vw, 42vw" priority />
          </figure>
        </div>
      </section>
    </>
  )
}
