# Alpiness en Oisans

Site public d’Alpiness en Oisans, construit avec Jekyll et publié par GitHub Pages.

## Repères rapides

- `_treks/` : source unique des fiches de trek.
- `_layouts/` et `_includes/` : modèles Jekyll partagés.
- `_data/` : données internes complémentaires.
- `treks/index.html` : catalogue des treks.
- `partials/` : en-tête et pied de page injectés sur les pages.
- `assets/` : styles, scripts, images et documents réellement publics.
- `docs/` : architecture, audits et suivi éditorial.
- `scripts/` : contrôles locaux sans dépendance externe.

Le détail complet se trouve dans [docs/architecture.md](docs/architecture.md).

## Modifier un trek

1. Modifier le fichier correspondant dans `_treks/`.
2. Ne renseigner que des informations confirmées.
3. Laisser les informations inconnues absentes plutôt que d’inventer une valeur.
4. Placer ses images dans un sous-dossier dédié de `assets/img/`.
5. Lancer `npm run check` avant de créer une pull request.

Les informations à confirmer sont centralisées dans
[docs/contenus-a-confirmer.md](docs/contenus-a-confirmer.md).

## Vérification locale

```powershell
npm run check
npm start
```

`npm run check` vérifie notamment les données principales des treks, les références
vers les fichiers de `assets/` et la présence accidentelle de fichiers sensibles.

Après une génération Jekyll, l’audit des métadonnées de toutes les pages se lance avec :

```powershell
npm run seo:check -- _site
```

## Dépôt public

Tout fichier suivi par Git est visible publiquement. Ne jamais ajouter :

- de jeton, mot de passe, clé privée ou fichier `.env` ;
- d’export de messagerie (`.eml`, `.msg`) ;
- de document client ou de donnée personnelle non destinée au site ;
- de dossier d’aperçu, cache, export ou fichier de travail local.

Un fichier placé dans `assets/` doit être considéré comme téléchargeable par tout le
monde. Les documents présents dans `assets/docs/` sont donc uniquement ceux qui sont
volontairement proposés aux visiteurs.
