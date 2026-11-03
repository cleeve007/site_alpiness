# Audit SEO, accessibilité et performances des treks

Audit réalisé sur la branche `refonte/treks-v2` pour le catalogue et les sept fiches de trek. Les informations commerciales existantes n'ont pas été modifiées et aucune offre structurée n'a été créée à partir d'une donnée non validée.

## SEO des fiches

- chaque fiche possède un titre SEO unique, compris entre 38 et 49 caractères ;
- chaque fiche possède une description unique, comprise entre 129 et 149 caractères ;
- l'URL canonique est générée à partir du `permalink` de la fiche et du domaine officiel ;
- les balises Open Graph et Twitter reprennent le titre, la description, l'URL et le visuel principal ;
- le modèle génère un graphe JSON-LD avec un `TouristTrip` et un fil d'Ariane `BreadcrumbList` ;
- les données structurées ne publient ni prix ni disponibilité afin de ne pas extrapoler les informations commerciales ;
- la hiérarchie suit un seul `h1`, des titres de section `h2`, puis des sous-sections `h3` ;
- des liens internes relient chaque fiche au catalogue, à la préparation, à l'orientation et aux randonnées à la journée.

## Redirections conservées

Les variantes historiques suivantes sont redirigées vers les URL canoniques :

- Baronnies : `/trek-baronnies-2027/` et `/trek-baronnies-2027.html` ;
- Majorque : `/trek-majorque-es-blau/` et `/trek-majorque-es-blau.html` ;
- Mont Olympe : `/trek-mont-olympe/` et `/trek-mont-olympe.html` ;
- Pays Basque : `/trek-pays-basque/` et `/trek-pays-basque.html` ;
- Portugal : `/trek-portugal-chemin-des-pecheurs/` et `/trek-portugal-chemin-des-pecheurs.html` ;
- Pyrénées : `/trek-pyrenees-2024/`, `/trek-pyrenees-2024.html` et `/trek-grands-sites-pyrenees/` ;
- Tenerife : `/trek-tenerife/`, `/trek-tenerife.html` et `/trek-tenerife-volcanique/` ;
- catalogue : `/treks.html` vers `/treks/`.

## Accessibilité

- lien d'évitement vers le contenu principal ;
- indicateur de focus renforcé et visible au clavier ;
- fermeture des sous-menus avec `Échap`, retour du focus au bouton et fermeture au clic extérieur ;
- état `aria-expanded` synchronisé avec les sous-menus ;
- alternative textuelle descriptive pour les images de contenu et alternative vide pour les images décoratives ;
- indication vocale lorsqu'un lien ouvre un PDF ou LinkedIn dans un nouvel onglet ;
- barres de niveau décoratives masquées aux technologies d'assistance ;
- réduction des animations lorsque le système demande moins de mouvement ;
- retours à la ligne forcés sur les titres et liens longs pour éviter le texte coupé sur mobile.

## Performances des images

- bandeaux WebP des treks : jusqu'à environ 334 Ko ;
- cartes WebP du catalogue : jusqu'à environ 147 Ko ;
- chargement différé et décodage asynchrone des cartes et images secondaires ;
- priorité haute et préchargement réservés au visuel principal de la fiche ;
- dimensions intrinsèques définies sur les cartes pour limiter les décalages de mise en page ;
- originaux conservés sans écrasement.

Le détail des cadrages et les deux visuels haute définition encore nécessaires sont consignés dans `docs/audit-images-treks.md`.

## Vérifications techniques

- syntaxe JavaScript contrôlée avec Node ;
- espaces et conflits de patch contrôlés avec `git diff --check` ;
- unicité et longueur des métadonnées contrôlées sur toutes les fiches ;
- références locales des images et documents contrôlées dans les sources ;
- contrôle statique des liens internes et des routes déclarées dans les `permalink` et `redirect_from`.

La génération complète Jekyll n'est pas disponible dans l'environnement local actuel. Une vérification visuelle finale de la version générée par GitHub Pages reste donc nécessaire après le déploiement de la branche, notamment pour les redirections produites par `jekyll-redirect-from`.

## Références utilisées

- Google Search Central : https://developers.google.com/search/docs/crawling-indexing/canonicalization
- Schema.org `TouristTrip` : https://schema.org/TouristTrip
- WCAG 2.2 : https://www.w3.org/TR/WCAG22/
- W3C, focus visible : https://www.w3.org/WAI/WCAG22/Understanding/focus-visible

