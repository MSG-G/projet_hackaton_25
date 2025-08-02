## Gestion des accès utilisateurs - SmartChantier

### Structure des rôles

#### 🏗️ ENTREPRENEUR (contractor)
**Pages accessibles :**
- `/dashboard` - Tableau de bord principal
- `/projects` - Gestion des projets
- `/projects/:id` - Détails d'un projet
- `/projects/new` - Créer un projet
- `/tasks` - Gestion des tâches
- `/tasks/new` - Créer une tâche
- `/cart` - Panier d'achat
- `/marketplace` - Marketplace (lecture seule)
- `/delivery` - Suivi des livraisons

**Fonctionnalités :**
- Créer et gérer des projets
- Assigner des tâches
- Acheter des matériaux
- Suivre les livraisons
- Consulter le marketplace

#### 🏪 FOURNISSEUR (supplier)
**Pages accessibles :**
- `/supplier` - Tableau de bord fournisseur
- `/supplier/products` - Gestion des produits
- `/supplier/orders` - Gestion des commandes
- `/marketplace` - Marketplace (gestion produits)
- `/delivery` - Suivi des livraisons

**Fonctionnalités :**
- Gérer le catalogue produits
- Traiter les commandes
- Suivre les livraisons
- Analytics des ventes

#### 👑 ADMIN (admin)
**Pages accessibles :**
- `/admin` - Tableau de bord administrateur
- `/security` - Gestion de la sécurité
- Toutes les pages des autres rôles (supervision)

**Fonctionnalités :**
- Gestion des utilisateurs
- Monitoring système
- Sécurité et conformité
- Analytics globales
- Administration complète

### Règles d'accès

#### Pages publiques (sans authentification)
- `/` - Page d'accueil
- `/auth/*` - Authentification

#### Pages partagées (tous les utilisateurs connectés)
- `/marketplace` - Avec permissions différentes selon le rôle
- `/delivery` - Suivi des livraisons

#### Redirections automatiques
- Connexion → Redirection vers le tableau de bord approprié
- Accès non autorisé → Redirection vers le tableau de bord du rôle
- Non connecté → Redirection vers `/auth`

### Sécurité
- Vérification du rôle à chaque route protégée
- Redirection automatique en cas d'accès non autorisé
- Session persistante avec localStorage
- Protection CSRF intégrée