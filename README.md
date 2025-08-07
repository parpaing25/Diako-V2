# Diako-V2 – Réseau social de voyage

Diako est une application web de réseau social centrée sur les voyages à Madagascar.
Les utilisateurs peuvent partager des expériences, créer des groupes, organiser des événements,
gagner et dépenser des crédits, et effectuer des paiements via les principaux services Mobile Money
(Orange Money, Mvola, Airtel). Cette version inclut une API PHP/MySQL et un frontend React/TypeScript
avec Tailwind CSS.

## Fonctions principales

- **Authentification** : connexion via email/mot de passe ou numéro de téléphone (Firebase).
- **Crédits utilisateur** : les utilisateurs gagnent des crédits en interagissant (aimer, partager),
  et peuvent en acheter via Mobile Money ; 1 crédit = 5 Ariary.
- **Groupes et événements** : création et gestion de groupes thématiques, planification d’événements,
  inscriptions et discussions.
- **Vérification d’identité** : envoi d’un scan de la CIN pour obtenir le badge bleu.
- **Messagerie et notifications** : chat en temps réel et notifications des interactions.
- **Publications** : fil d’actualité, posts sponsorisés et tags.
- **Paiements Mobile Money** : intégration avec les APIs backend (simulées) pour Mvola, Orange et Airtel.
- **Système de badges** : badge de vérification et badges spéciaux pour les contributeurs.

## Technologies utilisées

Ce projet est une application web mono‑page (SPA) construite avec les technologies suivantes :

- **Vite** : bundler et serveur de développement ultra‑rapide.
- **React 18** et **TypeScript** pour l’interface utilisateur.
- **shadcn‑ui** et **Tailwind CSS** pour les composants et la mise en page responsive.
- **Firebase** (authentification, Firestore, Storage) côté client.
- **PHP 8** et **MySQL** pour l’API backend (gestion des groupes, événements, crédits, paiements, vérification d’identité, etc.).

## Mise en place locale

1. **Prérequis :** installez Node.js (≥ 18), npm, PHP 8 avec l’extension PDO MySQL et un serveur MySQL.
2. Clonez ce dépôt :

```bash
git clone https://github.com/parpaing25/Diako-V2.git
cd Diako-V2
```

3. Installez les dépendances frontend :

```bash
npm install
```

4. Préparez la base de données MySQL automatiquement :

```bash
# Variables optionnelles : DB_USER, DB_PASS, DB_HOST, DB_NAME
npm run setup
```

Ce script crée (si besoin) la base `diako_db` et importe `sql/schema.sql` en utilisant l’utilisateur MySQL `root` sans mot de passe par défaut.

5. Les identifiants MySQL peuvent être modifiés via les variables d’environnement `DB_HOST`, `DB_NAME`, `DB_USER` et `DB_PASS`. Le fichier `backend/db.php` les lit automatiquement.

6. Mettez à jour la configuration Firebase dans `src/firebase.ts` ou, pour plus de sécurité, créez un fichier `.env` et chargez les variables via `import.meta.env`.

7. Démarrez le serveur de développement (frontend Vite + backend PHP intégré) :

```bash
npm run dev
```

L’interface sera accessible sur `http://localhost:5173` pour le frontend et les requêtes API seront servies sur `http://localhost:8000` par le serveur PHP intégré.

### Fichiers importants

- `src/` : composants React, pages et contextes (UserContext, CreditContext, GroupContext, etc.).
- `backend/` : points de terminaison PHP pour l'API (paiements, groupes, événements, crédits).
- `sql/` : scripts SQL pour la création des tables.
- `index.html` : point d'entrée HTML avec métadonnées SEO (titre, description, Open Graph, Twitter).

## Tests et qualité du code

Des tests unitaires et d’intégration peuvent être ajoutés à l’aide de Vitest ou Jest. Veillez à tester les contextes (`UserContext`, `CreditContext`, etc.) ainsi que les composants clés (groupes, événements, crédits, vérification). Exécutez `npm run lint` pour lancer ESLint et respecter les bonnes pratiques de développement.

## Bonnes pratiques et accessibilité

Le code suit les conventions TypeScript et React modernes : utilisation de hooks, typage strict et absence de `any`. Des commentaires descriptifs ont été ajoutés pour chaque composant et fonction importante. Les éléments interactifs utilisent des étiquettes (`Label`), et des attributs ARIA sont appliqués lorsque nécessaire pour améliorer l'accessibilité.

## Instructions de déploiement sur O2Switch

1. **Préparation du build** : générez la version de production du frontend.

```bash
npm run build
```

Le dossier `dist/` contiendra les fichiers statiques minifiés.

2. **Transfert des fichiers** : envoyez via FTP ou via le gestionnaire de fichiers d’O2Switch :
   - Le contenu de `dist/` à la racine du site (ou dans un sous‑dossier selon votre configuration).
   - Le dossier `backend/` dans un répertoire accessible par PHP (par exemple à la racine du domaine). Vérifiez que `backend/uploads/` est inscriptible (`chmod 775`).

3. **Configuration de la base de données** : créez une base MySQL sur O2Switch, importez `sql/schema.sql` et ajustez `backend/db.php` avec les identifiants fournis par O2Switch.

4. **Réécriture des URL** : puisque l’application est une SPA, toutes les routes doivent retourner `index.html`. Déposez un fichier `.htaccess` dans le dossier `dist/` avec :

```apache
RewriteEngine On
RewriteBase /
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule ^ index.html [L]
```

5. **Sécurité** : renommez ou placez les fichiers sensibles (`db.php`, `config.php`) hors du dossier public. Configurez des règles de pare‑feu et utilisez HTTPS.

6. **Droits d’écriture** : assurez‑vous que `backend/uploads/` est accessible en écriture pour permettre les envois de fichiers (photos de profil, posts, scans CIN…).

Après ces étapes, votre application Diako devrait être pleinement opérationnelle sur O2Switch.

## Notes de maintenance et d’optimisation

Cette application a été auditée et corrigée pour éliminer les erreurs TypeScript, supprimer l’usage de `any` et améliorer la structure du code. Les interfaces sont désormais explicites, le calcul des crédits est cohérent entre l’interface et le backend (1 crédit = 5 Ariary) et les pages d’inscription, de connexion, de profil, de messagerie et de notifications respectent les bonnes pratiques React. Le fichier `tailwind.config.ts` est désormais un module ESM pour éviter l’usage de `require`, et l’analyse statique (`npm run lint`) ne signale plus d’erreurs bloquantes (seuls quelques avertissements de hot‑reload subsistent sans impact en production). Avant la mise en production, renseignez vos identifiants de base de données dans `backend/db.php`.

Les styles utilisent Tailwind CSS et s’adaptent aux mobiles comme aux ordinateurs grâce à l’utilisation de flexbox et de breakpoints. Testez néanmoins l’interface sur plusieurs navigateurs (Chrome, Firefox, Safari, Edge) pour vérifier le rendu des composants (`DropdownMenu`, `Tabs`, etc.).
