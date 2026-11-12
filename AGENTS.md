# Consignes de maintenance du dépôt

Ce dépôt est public et ses modifications sont principalement réalisées par Codex.

## Priorités

1. Préserver le rendu, les URL et les contenus existants sauf demande explicite.
2. Ne jamais inventer une information commerciale ou pratique.
3. Éviter les doublons : les treks se modifient dans `_treks/`, les éléments partagés
   dans `_layouts/`, `_includes/` ou `partials/`.
4. Ne jamais suivre `tmp/`, `work/`, `_site/`, les caches ou les fichiers sources
   reçus de l’utilisateur qui ne sont pas destinés au public.
5. Vérifier qu’aucun secret ni renseignement privé n’entre dans l’historique Git.

## Méthode avant chaque modification

- Lire `README.md` et `docs/architecture.md`.
- Vérifier la branche courante, l’état de `main` et les pull requests ouvertes.
- Conserver les changements non liés appartenant à l’utilisateur.
- Préférer une seule pull request ouverte et cohérente lorsque c’est possible.
- Faire des commits courts, nommés en français et limités à une intention.

## Vérifications obligatoires

- Exécuter `npm run check`.
- Exécuter `git diff --check`.
- Pour tout changement visible, générer le site et contrôler au minimum les pages
  concernées sur mobile et ordinateur.
- Vérifier les liens et fichiers publics concernés avant de pousser.

## Règles de contenu des treks

- Statuts autorisés : `upcoming`, `on-request`, `past`.
- Niveau : entier de 1 à 5 lorsqu’il est confirmé ; sinon ne pas afficher le champ.
- Une donnée absente ne doit pas produire de bloc vide dans le rendu.
- Les anciens prix ne doivent pas être présentés comme des offres actuelles.
- Les images principales doivent posséder un texte alternatif descriptif.
- Les contenus à redemander sont consignés dans `docs/contenus-a-confirmer.md`.

## Sécurité du dépôt public

- Ne jamais enregistrer une authentification dans un fichier suivi.
- Ne jamais committer de `.env`, `.eml`, `.msg`, clé privée ou archive de travail.
- N’ajouter dans `assets/docs/` qu’un document explicitement destiné au téléchargement.
- Si un secret est découvert, arrêter la publication et signaler qu’une révocation et
  éventuellement un nettoyage de l’historique sont nécessaires.
