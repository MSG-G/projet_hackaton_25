# Projet Hackaton 25 – Gestion BTP

Bienvenue dans le dépôt **Projet Hackaton 25**. Cette application full-stack vise à simplifier la gestion de chantiers BTP pour trois profils d’utilisateur : **contractor**, **supplier** et **admin**.

---

## Sommaire
1. [Prérequis](#prérequis)
2. [Installation](#installation)
3. [Structure du monorepo](#structure-du-monorepo)
4. [Démarrage rapide](#démarrage-rapide)
5. [Workflow Git](#workflow-git)
6. [Scripts utiles](#scripts-utiles)
7. [Licence](#licence)

---

## Prérequis

* Node ≥ 18.x et npm ≥ 9.x
* PostgreSQL ≥ 14 (ou un service cloud équivalent)
* PNPM est recommandé (`npm i -g pnpm`) mais npm/yarn fonctionnent aussi

## Installation

```bash
# Cloner le dépôt
git clone git@github.com:votre-org/projet_hackaton_25.git
cd projet_hackaton_25

# Installer dépendances backend & frontend
pnpm install            # ou npm install

# Générer le client Prisma & lancer les migrations
pnpm prisma migrate dev # variables d'env. dans .env

# Seeder la base
pnpm prisma db seed
```

## Structure du monorepo

```
projet_hackaton_25/
├─ backend/        # API REST Node + Prisma
├─ frontend/       # Application React + Vite
├─ prisma/         # Schéma & seed
├─ uploads/        # Fichiers uploadés via Multer
└─ README.md
```

## Démarrage rapide

```bash
# Lancer le backend (port 5000)
pnpm --filter backend dev

# Dans un autre terminal : lancer le frontend (port 5173)
pnpm --filter frontend dev
```

Rendez-vous sur `http://localhost:5173` puis connectez-vous avec un utilisateur seedé ou inscrivez-vous.

## Workflow Git

> TL;DR : **branche ➜ rebase ➜ push ➜ Pull Request**

1. **Branches principales**
   * `main` : branche de production. Toujours *deployable*.
   * `develop` (optionnelle) : dernière version stable avant merge sur `main`.

2. **Convention de nommage des branches :**
   * `feature/<slug>`   : nouvelle fonctionnalité
   * `bugfix/<slug>`    : correction d’anomalie
   * `hotfix/<slug>`    : patch critique en production
   * `chore/<slug>`     : maintenance, docs, CI/CD…

   Exemple : `feature/supplier-module` (module fournisseur).

3. **Cycle de vie d’une tâche**

   ```bash
   # a) Créer la branche
   git switch -c feature/supplier-module

   # b) Commits atomiques & explicites
   git add .
   git commit -m "supplier: implémentation CRUD produits"

   # c) Rebase interactif sur la branche cible (souvent main)
   git fetch origin
   git rebase origin/main

   # d) Pousser la branche (upstream automatique)
   git push -u origin feature/supplier-module

   # e) Ouvrir une Pull Request (PR) sur GitHub/GitLab
   #    - Assign reviewer(s)
   #    - Décrire le contexte, la solution et tester 
   ```

4. **Pull Request**
   * **CI** : toutes les PR déclenchent lint, tests et build.
   * **Review** : au moins 1 approbation requise.
   * **Merge** : privilégier *Squash & Merge* pour conserver un historique propre.
   * **Delete branch** une fois la PR fusionnée.

5. **Bonnes pratiques supplémentaires**
   * Rebaser plutôt que fusionner (`git rebase`) pour éviter les *merge commits*.
   * Commits conformes à *Conventional Commits* (`type(scope): message`).
   * Un commit = une raison de rollback.
   * Pas de commit sur `main` : uniquement via PR.

## Scripts utiles

| Commande                         | Description                              |
| -------------------------------- | ---------------------------------------- |
| `pnpm dev` (root)                | Lance backend **et** frontend en parallèle |
| `pnpm -F backend dev`            | Backend API en watch (ts-node-dev)        |
| `pnpm -F frontend dev`           | Frontend Vite + React                    |
| `pnpm prisma studio`             | UI web pour la base Prisma               |
| `pnpm test`                      | Lancer les tests (à venir)               |

## Licence

MIT © 2025 – Projet Hackaton 25
