# Le Bistrot Du Coin

Site officiel du restaurant, construit avec Next.js et prêt pour Vercel.

## Mise en ligne

1. Décompresser le ZIP.
2. Envoyer tout le contenu du dossier dans le dépôt GitHub `thomasdubois60-svg/lebistrotducoin`.
3. Dans Vercel, importer ce dépôt puis cliquer sur **Deploy**.
4. Dans **Vercel > Project > Settings > Environment Variables**, ajouter :
   - `ADMIN_PASSWORD` : le mot de passe choisi pour l’administration.
   - `GITHUB_TOKEN` : un jeton GitHub à accès fin autorisé à lire et écrire le contenu du dépôt.
   - `GITHUB_REPO` : `thomasdubois60-svg/lebistrotducoin`.
   - `GITHUB_BRANCH` : `main`.
   - `NEXT_PUBLIC_SITE_URL` : l’adresse finale du site, par exemple `https://lebistrotducoin.vercel.app`.
5. Redéployer une fois après l’ajout des variables.

## Administration

Ouvrir `/administration` sur le site. L’espace permet de modifier depuis un téléphone :

- les trois entrées, trois plats et trois desserts du jour ;
- la suggestion et son supplément ;
- les catégories, produits, descriptions et prix de la carte ;
- une photo facultative pour chaque produit ;
- les photos et légendes de la galerie.

Les modifications sont enregistrées dans GitHub. Vercel redéploie ensuite automatiquement le site.

## Sécurité du jeton GitHub

Créer un jeton **fine-grained** limité uniquement au dépôt du Bistrot, avec la permission **Contents: Read and write**. Ne jamais placer ce jeton dans un fichier du projet : il doit rester dans les variables privées de Vercel.
