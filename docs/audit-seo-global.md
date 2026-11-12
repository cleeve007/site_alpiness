# Audit SEO global

Audit du 12 novembre 2026, réalisé sur le site généré localement.

## Résultat page par page

| Page canonique | Indexation | `title` | Description | Canonique, social, JSON-LD et favicon |
| --- | --- | ---: | ---: | --- |
| `/randonnees/` | oui | 52 car. | 121 car. | conforme |
| `/treks/` | oui | 53 car. | 114 car. | conforme |
| `/treks/baronnies-2027/` | oui | 47 car. | 129 car. | conforme |
| `/treks/grands-sites-pyrenees/` | oui | 48 car. | 134 car. | conforme |
| `/treks/majorque-es-blau/` | oui | 48 car. | 138 car. | conforme |
| `/treks/mont-olympe/` | oui | 49 car. | 142 car. | conforme |
| `/treks/pays-basque/` | oui | 42 car. | 149 car. | conforme |
| `/treks/portugal-chemin-des-pecheurs/` | oui | 38 car. | 144 car. | conforme |
| `/treks/tenerife-volcanique/` | oui | 38 car. | 144 car. | conforme |
| `/contact/` | oui | 51 car. | 107 car. | conforme |
| `/decouverte-du-patrimoine/` | oui | 53 car. | 117 car. | conforme |
| `/formation-orientation/` | oui | 54 car. | 105 car. | conforme |
| `/hebergement/` | oui | 53 car. | 96 car. | conforme |
| `/observation-marmottes/` | oui | 51 car. | 119 car. | conforme |
| `/preparation-physique-trek/` | oui | 55 car. | 109 car. | conforme |
| `/preparer-un-objectif/` | oui | 53 car. | 131 car. | conforme |
| `/se-faire-du-bien/` | oui | 49 car. | 99 car. | conforme |
| `/vivre-une-aventure/` | oui | 54 car. | 95 car. | conforme |

Les deux pages de réservation et `hebergement-old.html` sont volontairement en
`noindex, follow` et absentes du sitemap. Les 28 anciennes URL générées par
`jekyll-redirect-from` redirigent vers leur page canonique.

## Corrections techniques

- métadonnées uniques sur les 18 pages indexables ;
- URL canonique, Open Graph, Twitter Card et JSON-LD sur chaque page indexable ;
- un seul `h1` par page ;
- favicon racine stable, PNG 96 × 96 et icône Apple 180 × 180 ;
- `robots.txt` autorisant l’exploration et déclarant le sitemap ;
- génération de `/sitemap.xml` avec le module officiel `jekyll-sitemap` ;
- ancien hébergement exclu de l’index pour éviter un contenu concurrent.

## Contrôle automatique

Après génération du site :

```powershell
npm run seo:check -- _site
```

Le contrôle échoue en cas de titre, description, canonique, partage social,
données structurées, favicon ou image Open Graph manquants, ainsi qu’en cas de
métadonnée dupliquée.
