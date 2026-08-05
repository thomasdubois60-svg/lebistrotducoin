# Le Bistrot Du Coin

Site officiel du restaurant, construit avec Next.js et prêt pour Vercel.

## Mise à jour du site existant

1. Décompresser le ZIP.
2. Ouvrir le dépôt GitHub `thomasdubois60-svg/lebistrotducoin`.
3. Envoyer tout le contenu du dossier décompressé à la racine du dépôt et valider le remplacement des fichiers existants.
4. Cliquer sur **Commit changes**.
5. Vercel lance automatiquement un nouveau déploiement.

## Configuration de l’administration

Dans **Vercel > Project > Settings > Environment Variables**, ajouter :

- `ADMIN_PASSWORD` : le mot de passe choisi pour l’administration.
- `GITHUB_TOKEN` : un jeton GitHub à accès fin limité au dépôt, avec **Contents: Read and write**.
- `GITHUB_REPO` : `thomasdubois60-svg/lebistrotducoin`.
- `GITHUB_BRANCH` : `main`.
- `NEXT_PUBLIC_SITE_URL` : `https://lebistrotducoin.vercel.app`.

Redéployer une fois après l’ajout ou la modification des variables.

## Fonctions de l’administration

L’adresse `/administration` permet de gérer depuis un téléphone :

- les coordonnées, horaires, vacances et fermetures exceptionnelles ;
- la photo principale et les textes de l’accueil ;
- les prix des formules ;
- un nombre libre d’entrées, plats et desserts ;
- la suggestion du jour ;
- l’histoire du Bistrot et sa photo ;
- la privatisation, son texte et ses photos ;
- les événements avec date, descriptif, prix et photo ;
- les catégories de la carte et leurs raccourcis automatiques ;
- les produits, prix, descriptions et photos ;
- les avis Google et les réseaux sociaux ;
- la galerie.

Les changements sont enregistrés dans GitHub, puis Vercel republie automatiquement le site.

## Sécurité

Le jeton GitHub et le mot de passe administrateur doivent uniquement être enregistrés dans les variables privées de Vercel. Ils ne doivent jamais être ajoutés aux fichiers du dépôt.
Test déploiement après réglage Vercel
