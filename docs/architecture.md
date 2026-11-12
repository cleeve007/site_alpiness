# Architecture technique

## Principe général

Le site est une source Jekyll compatible GitHub Pages. Les fichiers du dépôt sont la
source de vérité ; `_site/` et les aperçus locaux ne doivent jamais être suivis.

## Arborescence

| Chemin | Rôle |
| --- | --- |
| `_config.yml` | Configuration Jekyll, collection `treks` et permaliens. |
| `_treks/` | Une fiche Markdown/YAML par trek. |
| `_layouts/trek.html` | Modèle commun de toutes les fiches de trek. |
| `_includes/` | Composants Jekyll des cartes et statuts. |
| `_data/` | Données complémentaires non rendues directement. |
| `treks/index.html` | Catalogue et regroupement des treks. |
| `partials/` | Navigation et pied de page chargés par `assets/js/main.js`. |
| `assets/css/` | Feuille de style globale. |
| `assets/js/` | Comportements partagés et scripts spécialisés. |
| `assets/img/` | Images publiques, regroupées par sujet ou trek. |
| `assets/docs/` | Documents volontairement téléchargeables par les visiteurs. |
| `docs/` | Documentation et audits internes, néanmoins publics sur GitHub. |
| `scripts/` | Contrôles locaux non publiés dans la navigation. |

## Pages et URL

- Accueil canonique : `/randonnees/` avec redirections depuis `/` et `/randonnes/`.
- Catalogue : `/treks/`.
- Fiches : `/treks/<nom-du-trek>/` via la collection Jekyll.
- Pages historiques en HTML à la racine : conserver leur nom tant qu’une redirection
  explicite n’a pas été prévue.
- `hebergement-old.html` est une copie historique conservée temporairement. Elle ne
  doit pas être utilisée comme source pour la page actuelle.

## Source d’une fiche de trek

Les champs communs vivent dans le front matter du fichier `_treks/<slug>.md`.
Le modèle n’affiche que les blocs renseignés. Les champs structurants sont :

- identité : `title`, `destination`, `permalink`, `status`, `order` ;
- référencement : `seo_title`, `seo_description`, `og_title` ;
- catalogue : `card_image`, `card_image_alt`, `duration`, `level`, `season` ;
- fiche : `hero`, `facts`, `introduction`, `highlights`, `gallery`, `route` ;
- offre : `stays`, `practical`, `cta`, `pdf_url`.

Un nouveau champ partagé doit être géré dans le modèle commun, pas copié dans chaque
page HTML.

## Médias

- Conserver les originaux utiles lorsqu’ils servent d’archive éditoriale.
- Utiliser les versions WebP ou AVIF optimisées dans le rendu lorsque disponibles.
- Ne pas remplacer une image par une version de moindre définition.
- Décrire le sujet utile dans chaque texte alternatif.
- Vérifier les droits d’utilisation avant toute publication.

## Contrôles

`npm run check` ne génère pas le site et ne modifie aucun fichier. Il contrôle :

- les champs principaux et les statuts des treks ;
- l’unicité des permaliens ;
- l’existence des fichiers référencés sous `/assets/` ;
- les extensions de fichiers sensibles qui ne doivent pas être publiées.

Ce contrôle complète, mais ne remplace pas, une génération Jekyll et une vérification
visuelle lorsqu’un changement touche au rendu.
