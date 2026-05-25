# AfriLink Pro — Synthèse Technique Professionnelle

> **Réseau professionnel africain de référence**  
> Full-stack · Next.js 16 · React 19 · Supabase · TypeScript 5  
> *Document généré le 25 mai 2026*

---

## Table des matières

1. [Vue d'ensemble du projet](#1-vue-densemble)
2. [Stack technique](#2-stack-technique)
3. [Architecture du projet](#3-architecture)
4. [Base de données — 20 tables Supabase](#4-base-de-données)
5. [Authentification & Sécurité](#5-authentification--sécurité)
6. [API Routes — 18 endpoints REST](#6-api-routes)
7. [Pages & Fonctionnalités](#7-pages--fonctionnalités)
8. [Composants réutilisables](#8-composants)
9. [Helpers API côté client](#9-helpers-api-client)
10. [Guide d'installation](#10-guide-dinstallation)
11. [Variables d'environnement](#11-variables-denvironnement)
12. [Statistiques du projet](#12-statistiques)

---

## 1. Vue d'ensemble

**AfriLink Pro** est une plateforme professionnelle complète, pensée comme le *LinkedIn africain*. Elle connecte les professionnels de 54 pays africains et centralise en un seul endroit :

- La mise en réseau entre professionnels
- Les offres d'emploi et les candidatures
- Les stages et programmes jeunes talents
- Les formations certifiantes
- Les appels d'offres publics et privés
- La messagerie instantanée entre membres
- Un système de notifications en temps réel

L'application est entièrement **connectée à Supabase** (base de données PostgreSQL + authentification + Row Level Security), toutes les pages affichent des données réelles et non des données fictives.

---

## 2. Stack technique

| Couche | Technologie | Version |
|--------|------------|---------|
| Framework | Next.js (App Router) | 16.2.6 |
| UI Library | React | 19.2.4 |
| Langage | TypeScript (strict) | ^5.0 |
| Base de données | Supabase (PostgreSQL) | ^2.106.2 |
| Auth & SSR | @supabase/ssr | ^0.10.3 |
| Styling | Tailwind CSS | ^4.0 |
| Icônes | lucide-react | ^1.16.0 |
| Animations | Framer Motion | ^12.40.0 |
| Composants | Radix UI (Avatar, Dialog, Tabs…) | ^1.x |
| Graphiques | Recharts | ^3.8.1 |
| Font | Inter (Google Fonts) | — |

### Choix architecturaux clés

- **App Router Next.js 16** : Server Components par défaut, `"use client"` uniquement là où nécessaire
- **Supabase SSR** : sessions basées sur les cookies HTTP-only (pas de localStorage), compatibles server-side rendering
- **Typing sans generic Supabase** : les clients Supabase ne sont pas typés avec `<Database>` (incompatibilité Next.js 16 + React 19). Les types sont appliqués à la couche application via casting
- **Row Level Security activé sur toutes les tables** : la sécurité est garantie au niveau base de données, pas seulement applicatif

---

## 3. Architecture

```
afrilink-pro/
├── app/                          # Next.js App Router
│   ├── layout.tsx                # Root layout + AuthProvider
│   ├── page.tsx                  # Landing page
│   │
│   ├── login/page.tsx            # Authentification
│   ├── register/page.tsx         # Inscription
│   ├── forgot-password/page.tsx  # Réinitialisation mdp
│   ├── auth/callback/route.ts    # OAuth callback
│   │
│   ├── dashboard/page.tsx        # Fil d'actualité + stats
│   ├── jobs/page.tsx             # Offres d'emploi
│   ├── reseau/page.tsx           # Réseau professionnel
│   ├── messages/page.tsx         # Messagerie
│   ├── notifications/page.tsx    # Notifications
│   ├── formations/page.tsx       # Cours & certifications
│   ├── stages/page.tsx           # Stages & alternances
│   ├── appels-offres/page.tsx    # Marchés publics/privés
│   ├── profile/[id]/page.tsx     # Profil utilisateur
│   └── premium/page.tsx          # Plans d'abonnement
│
│   └── api/                      # API Routes (REST)
│       ├── auth/                 # Auth callbacks
│       ├── profile/              # GET/PATCH profil propre
│       ├── profile/[id]/         # GET profil public
│       ├── profiles/             # GET suggestions réseau
│       ├── connections/          # GET/POST connexions
│       ├── connections/[id]/     # PATCH/DELETE connexion
│       ├── jobs/                 # GET liste / POST créer
│       ├── jobs/[id]/            # GET détail / DELETE
│       ├── jobs/[id]/apply/      # POST postuler
│       ├── jobs/[id]/save/       # POST toggle sauvegarde
│       ├── posts/                # GET feed / POST publier
│       ├── posts/[id]/like/      # POST toggle like
│       ├── messages/             # GET conversations / POST créer
│       ├── messages/[convId]/    # GET messages / POST envoyer
│       ├── notifications/        # GET liste / PATCH marquer lu
│       ├── courses/              # GET formations
│       ├── internships/          # GET stages
│       └── tenders/              # GET appels d'offres
│
├── components/
│   ├── layout/
│   │   ├── DashboardLayout.tsx   # Layout principal avec sidebar
│   │   ├── AppSidebar.tsx        # Navigation latérale
│   │   └── Navbar.tsx            # Barre de navigation
│   ├── providers/
│   │   └── AuthProvider.tsx      # Context auth global
│   └── ui/
│       ├── Avatar.tsx
│       ├── Badge.tsx
│       ├── Button.tsx
│       └── Card.tsx
│
├── lib/
│   ├── supabase/
│   │   ├── client.ts             # Browser Supabase client
│   │   └── server.ts             # Server + Admin Supabase client
│   ├── api/                      # Helpers fetch côté client
│   │   ├── jobs.ts
│   │   ├── posts.ts
│   │   ├── messages.ts
│   │   ├── notifications.ts
│   │   ├── internships.ts
│   │   └── tenders.ts
│   └── hooks/
│       └── useAuth.ts
│
├── types/
│   └── database.ts               # 20 types Row + type Database complet
│
├── supabase/
│   └── schema.sql                # Schéma complet (tables + RLS + triggers)
│
├── middleware.ts                 # Protection des routes (Next.js Edge)
├── tailwind.config.ts
└── .env.local.example
```

---

## 4. Base de données

### 20 tables PostgreSQL

#### Profil & Réseau social

| Table | Description | Colonnes clés |
|-------|-------------|---------------|
| `profiles` | Profil professionnel de chaque utilisateur | `user_id`, `headline`, `bio`, `premium_tier`, `is_verified`, `profile_views` |
| `experiences` | Expériences professionnelles | `profile_id`, `title`, `company`, `start_date`, `end_date`, `is_current`, `skills[]` |
| `educations` | Formations académiques | `profile_id`, `school_name`, `degree`, `field_of_study`, `start_year` |
| `skills` | Compétences avec niveau et endorsements | `profile_id`, `name`, `proficiency` (0-100), `endorsements_count` |
| `certifications` | Certifications professionnelles | `profile_id`, `name`, `issuer`, `issue_date`, `credential_url` |
| `languages` | Langues parlées | `profile_id`, `name`, `proficiency` (native/professional/intermediate/basic) |
| `connections` | Connexions entre professionnels | `requester_id`, `receiver_id`, `status` (pending/accepted/blocked) |

#### Emploi & Stages

| Table | Description | Colonnes clés |
|-------|-------------|---------------|
| `jobs` | Offres d'emploi | `company_name`, `title`, `job_type` (CDI/CDD/Freelance/Internship), `remote_status`, `salary_min/max`, `is_featured` |
| `job_applications` | Candidatures | `job_id`, `user_id`, `status` (pending/reviewed/accepted/rejected), `cover_letter` |
| `saved_jobs` | Offres sauvegardées | `user_id`, `job_id` |
| `internships` | Stages & alternances | `company_name`, `duration_months`, `sector`, `is_paid`, `indemnity_amount` |

#### Formations

| Table | Description | Colonnes clés |
|-------|-------------|---------------|
| `courses` | Cours & certifications | `instructor_name`, `category`, `level`, `price`, `rating`, `is_certified`, `is_bestseller` |
| `course_enrollments` | Inscriptions aux cours | `user_id`, `course_id`, `progress` (0-100) |

#### Marchés & Appels d'offres

| Table | Description | Colonnes clés |
|-------|-------------|---------------|
| `tenders` | Appels d'offres | `client_name`, `client_type` (Government/International/Private), `budget_amount`, `sector`, `status` (open/urgent/closed) |

#### Social & Messagerie

| Table | Description | Colonnes clés |
|-------|-------------|---------------|
| `posts` | Publications du feed | `user_id`, `content`, `post_type`, `visibility`, `likes_count` |
| `post_engagements` | Likes, commentaires, partages | `post_id`, `user_id`, `engagement_type` |
| `conversations` | Conversations privées | `participant_1_id`, `participant_2_id`, `last_message_preview` |
| `messages` | Messages individuels | `conversation_id`, `sender_id`, `content`, `read_at` |
| `notifications` | Notifications en temps réel | `user_id`, `type`, `title`, `action_url`, `is_read` |
| `subscriptions` | Abonnements premium | `user_id`, `plan` (free/pro/business/enterprise), `status` |

### Triggers automatiques

```sql
handle_new_user()         → Crée un profil + abonnement free à chaque inscription
handle_new_message()      → Met à jour conversations.last_message_preview
handle_new_application()  → Incrémente jobs.applicants_count
handle_updated_at()       → Met à jour updated_at sur 6 tables
```

### Row Level Security (RLS)

Toutes les 20 tables ont RLS activé avec des politiques précises :
- **Profils, Expériences, Compétences, etc.** → lecture publique, écriture propriétaire uniquement
- **Connexions, Messages, Conversations** → visibles par les participants uniquement
- **Notifications** → visibles par l'utilisateur concerné uniquement
- **Jobs, Stages, Formations, Appels d'offres** → lecture publique, écriture authentifiée

---

## 5. Authentification & Sécurité

### Flux d'authentification

```
Utilisateur → /login ou /register
     ↓
Supabase Auth (email/password)
     ↓
Session cookie HTTP-only (SSR-safe)
     ↓
middleware.ts vérifie la session (Edge Runtime)
     ↓
Redirection vers /dashboard si authentifié
     ↓
AuthProvider.tsx fournit {user, profile, loading, signOut}
à tous les composants via React Context
```

### Middleware de protection (Edge Runtime)

```typescript
// Routes publiques uniquement :
const PUBLIC_ROUTES = ['/', '/login', '/register', '/api/auth']

// Toute autre route → vérification session Supabase
// Non authentifié → redirect /login?redirectTo=<url>
// Déjà connecté + page auth → redirect /dashboard
```

### Clients Supabase

| Client | Fichier | Usage |
|--------|---------|-------|
| `createClient()` browser | `lib/supabase/client.ts` | Composants client (`"use client"`) |
| `createClient()` server | `lib/supabase/server.ts` | API Routes, Server Components |
| `createAdminClient()` | `lib/supabase/server.ts` | Opérations admin (bypass RLS) |

---

## 6. API Routes

### 18 endpoints REST

| Endpoint | Méthodes | Auth | Description |
|----------|----------|------|-------------|
| `/api/profile` | GET, PATCH | ✅ | Profil propre avec expériences/compétences/etc. |
| `/api/profile/[id]` | GET | ❌ | Profil public, incrémente `profile_views` |
| `/api/profiles` | GET | ✅ | Suggestions réseau (exclusion des connexions existantes) |
| `/api/connections` | GET, POST | ✅ | Connexions acceptées / Créer une demande |
| `/api/connections/[id]` | PATCH, DELETE | ✅ | Accepter/bloquer / Supprimer une connexion |
| `/api/jobs` | GET, POST | GET:❌ POST:✅ | Liste filtrée / Publier une offre |
| `/api/jobs/[id]` | GET, DELETE | GET:❌ DEL:✅ | Détail + `is_saved` / Supprimer |
| `/api/jobs/[id]/apply` | POST | ✅ | Postuler (409 si doublon) |
| `/api/jobs/[id]/save` | POST | ✅ | Toggle sauvegarde → `{saved: boolean}` |
| `/api/posts` | GET, POST | GET:❌ POST:✅ | Feed public avec `is_liked` / Publier |
| `/api/posts/[id]/like` | POST | ✅ | Toggle like + mise à jour `likes_count` |
| `/api/messages` | GET, POST | ✅ | Conversations avec profils / Créer ou récupérer |
| `/api/messages/[convId]` | GET, POST | ✅ | Messages (marque lu) / Envoyer |
| `/api/notifications` | GET, PATCH | ✅ | Liste / Marquer lu (par id ou `mark_all`) |
| `/api/courses` | GET | ❌ | Formations filtrées (category, level, q) |
| `/api/internships` | GET | ❌ | Stages filtrés (sector, country, paid, q) |
| `/api/tenders` | GET | ❌ | Appels d'offres filtrés + incrémente `views_count` |
| `/api/auth/callback` | GET | — | Exchange OAuth code → session |

### Filtres disponibles par endpoint

```
/api/jobs        → ?category= &country= &type= &remote= &q= &page= &limit=
/api/posts       → ?page= &limit= &user_id=
/api/courses     → ?category= &level= &q= &limit=
/api/internships → ?sector= &country= &paid= &q= &page= &limit=
/api/tenders     → ?sector= &country= &status= &client_type= &q= &page= &limit=
/api/profiles    → ?q= &country= &limit=
```

---

## 7. Pages & Fonctionnalités

### Pages publiques

| Page | Route | Fonctionnalités |
|------|-------|-----------------|
| Landing | `/` | Présentation marketing, stats, CTA |
| Connexion | `/login` | Email/mdp, redirection `?redirectTo`, affichage erreurs |
| Inscription | `/register` | Formulaire complet (nom, type de compte, pays), email de confirmation |
| Mot de passe oublié | `/forgot-password` | Envoi d'un email de reset via Supabase |

### Pages authentifiées

| Page | Route | Données réelles | Fonctionnalités clés |
|------|-------|----------------|---------------------|
| **Dashboard** | `/dashboard` | ✅ | Feed de posts avec like/unlike, modal création post, stats profil, 3 dernières offres d'emploi, scroll infini |
| **Emplois** | `/jobs` | ✅ | Recherche full-text, filtres (catégorie, contrat, remote), pagination, postuler, sauvegarder |
| **Réseau** | `/reseau` | ✅ | Suggestions de profils (exclusion connexions existantes), mes connexions, bouton "Connecter" → POST API |
| **Messages** | `/messages` | ✅ | Liste conversations, messagerie temps-réel, scroll auto, receipts de lecture (✓✓) |
| **Notifications** | `/notifications` | ✅ | Filtres par type, marquer lu (unitaire ou tout), compteur non-lus |
| **Formations** | `/formations` | ✅ | Catalogue par catégorie, cartes cours (rating, durée, prix, bestseller, certifiant) |
| **Stages** | `/stages` | ✅ | Filtres par secteur, toggle sauvegarde, sidebar mentors/badge/conseils |
| **Appels d'offres** | `/appels-offres` | ✅ | Filtres secteur + pays + recherche debouncée (400ms), calcul jours restants, timeAgo |
| **Profil** | `/profile/[id]` | ✅ | Profil complet (expériences, formation, compétences avec barres, certifications, langues), détection profil propre → stats analytics |
| **Premium** | `/premium` | — | Plans tarifaires (Free/Pro/Business/Enterprise) |

---

## 8. Composants

### Layout

**`DashboardLayout`** — Layout principal avec :
- Sidebar fixe desktop / overlay mobile avec animation
- Header avec barre de recherche globale
- Dropdown notifications (avec badge compteur)
- Dropdown utilisateur (profil, paramètres, déconnexion)
- Utilise `useAuthContext()` pour nom/rôle/vérifié/premium réels

**`AppSidebar`** — Navigation avec liens actifs, icônes lucide-react

### Providers

**`AuthProvider`** — Context React global exposant :
```typescript
{
  user: User | null,        // Supabase auth user
  profile: Profile | null,  // Profil complet depuis la table profiles
  loading: boolean,
  signOut: () => Promise<void>
}
```
Écoute `onAuthStateChange` pour les mises à jour en temps réel.

### UI Primitives

| Composant | Description |
|-----------|-------------|
| `Avatar` | Avatar avec fallback initiales, ring vérifié, tailles sm/md/lg |
| `Badge` | Badge coloré configurable |
| `Button` | Bouton avec variants (primary, secondary, ghost, danger) |
| `Card` | Carte avec glass effect et border |

---

## 9. Helpers API client

Ces helpers encapsulent les appels `fetch` vers l'API REST :

```typescript
// lib/api/jobs.ts
fetchJobs(params)          // Récupère la liste filtrée
fetchJob(id)               // Détail + is_saved
applyToJob(id, data)       // Postuler
toggleSaveJob(id)          // Sauvegarder/désauvegarder
createJob(data)            // Publier une offre

// lib/api/posts.ts
fetchPosts(params)         // Feed paginé
createPost(data)           // Nouveau post
likePost(id)               // Toggle like

// lib/api/messages.ts
fetchConversations()       // Liste conversations avec profils
fetchMessages(convId)      // Messages d'une conversation
sendMessage(convId, text)  // Envoyer un message
createConversation(userId) // Créer ou récupérer une conversation

// lib/api/notifications.ts
fetchNotifications(unreadOnly?)   // Notifications filtrées
markNotificationsRead(ids?)       // Marquer lu (ids ou all)

// lib/api/internships.ts
fetchInternships(params)   // Stages filtrés

// lib/api/tenders.ts
fetchTenders(params)       // Appels d'offres filtrés
```

---

## 10. Guide d'installation

### Prérequis

- Node.js ≥ 20
- Un compte Supabase (gratuit sur supabase.com)

### Étape 1 — Cloner et installer

```bash
git clone <repo>
cd afrilink-pro
npm install
```

### Étape 2 — Configurer Supabase

1. Créer un projet sur [supabase.com](https://supabase.com)
2. Dans **SQL Editor**, exécuter le fichier `supabase/schema.sql` en entier
3. Récupérer les clés dans **Settings → API**

### Étape 3 — Variables d'environnement

```bash
cp .env.local.example .env.local
# Remplir les 3 variables (voir section 11)
```

### Étape 4 — Lancer en développement

```bash
npm run dev
# → http://localhost:3000
```

### Étape 5 — Build production

```bash
npm run build
npm start
```

### Déploiement Vercel (recommandé)

```bash
npx vercel --prod
# Configurer les variables d'environnement dans le dashboard Vercel
```

---

## 11. Variables d'environnement

```env
# .env.local

# URL de votre projet Supabase
# Settings → API → Project URL
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co

# Clé publique anon (safe côté client)
# Settings → API → anon public
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Clé service role (NE JAMAIS EXPOSER côté client)
# Settings → API → service_role
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

> ⚠️ `SUPABASE_SERVICE_ROLE_KEY` n'est utilisée que dans les Server Components et API Routes (jamais dans le navigateur). Elle bypass le RLS — à protéger impérativement.

---

## 12. Statistiques du projet

| Métrique | Valeur |
|----------|--------|
| Fichiers source (.ts, .tsx, .sql, .css) | 59 |
| Lignes de code total | ~9 500 |
| Tables PostgreSQL | 20 |
| API Routes Next.js | 18 endpoints |
| Pages applicatives | 14 |
| Triggers SQL | 4 |
| Politiques RLS | 30+ |
| Index de performance | 9 |
| Composants UI | 4 primitives + layout |
| Helpers API client | 6 modules |

---

## Décisions techniques notables

### 1. Supabase sans générique `<Database>`
Les clients Supabase (`createBrowserClient`, `createServerClient`) ne sont pas typés avec `<Database>`. Cette décision résout une incompatibilité entre Next.js 16 + React 19 + `@supabase/ssr` 0.10 qui provoquait des erreurs `type 'never'` sur toutes les requêtes. Les types sont appliqués via casting à la couche application.

### 2. Params asynchrones (Next.js 16)
Les paramètres de routes dynamiques sont des `Promise` en Next.js 16 :
```typescript
// API Route
async function GET(req, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params  // ← obligatoire
}
// Client Component
const params = useParams<{ id: string }>()  // ← hook synchrone
```

### 3. Cookies HTTP-only pour la session
`@supabase/ssr` gère les sessions via cookies HTTP-only, rendant l'auth compatible SSR/Edge sans risque XSS. Le middleware s'exécute en Edge Runtime pour une latence minimale.

### 4. Suggestions réseau intelligentes
L'endpoint `/api/profiles` exclut dynamiquement : soi-même + tous les profils déjà connectés (pending ou accepted), garantissant que les suggestions sont toujours pertinentes.

---

*AfriLink Pro — Tous droits réservés*
