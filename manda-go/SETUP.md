# Manda Go — Guide de Démarrage

Application mobile d'apprentissage du mandarin avec IA, gamification et mini-jeux.

---

## Prérequis

| Outil | Version minimale | Vérification |
|-------|-----------------|--------------|
| Flutter | 3.x (stable) | `flutter --version` |
| Dart | 3.x (inclus avec Flutter) | `dart --version` |
| Node.js | 20+ | `node --version` |
| Docker Desktop | 4.x | `docker --version` |
| Git | 2.x | `git --version` |

**Clés API nécessaires :**
- **OpenAI** — requis pour le MandaBot IA et la synthèse vocale
- **Stripe** — optionnel pour le MVP (les achats in-app fonctionnent en mode mock)
- **Firebase** — optionnel pour les notifications push

---

## Installation en 5 minutes

### 1. Cloner le dépôt

```bash
git clone https://github.com/ton-org/manda-go.git
cd manda-go
```

### 2. Configurer les variables d'environnement

```bash
cp backend/.env.example backend/.env
```

Ouvrez `backend/.env` et renseignez au minimum :

```env
OPENAI_API_KEY=sk-proj-...       # Requis pour l'IA
JWT_SECRET=change_me_32_chars    # Changez cette valeur !
```

Les autres variables ont des valeurs par défaut pour le développement local.

### 3. Démarrer le backend

```bash
make dev
```

Cette commande :
- Vérifie que Docker est installé et démarré
- Lance PostgreSQL 15 sur le port 5432
- Lance Redis 7 sur le port 6379
- Démarre l'API NestJS sur http://localhost:3000
- Applique automatiquement les migrations SQL et les données de seed

Attendez que vous voyiez `Services démarrés !` dans le terminal.

### 4. Vérifier que l'API répond

```bash
curl http://localhost:3000/api/v1/health
# Réponse attendue: {"status":"ok","timestamp":"..."}
```

### 5. Lancer l'app Flutter

Ouvrez un **deuxième terminal** :

```bash
make flutter
```

Choisissez un appareil dans la liste (simulateur iOS, émulateur Android, ou Chrome pour le web).

---

## Structure du projet

```
manda-go/
├── backend/                    # API NestJS (TypeScript)
│   ├── src/
│   │   ├── auth/               # Authentification JWT + OAuth
│   │   ├── users/              # Gestion des profils utilisateurs
│   │   ├── lessons/            # Système de leçons et contenus
│   │   ├── ai/                 # Intégration OpenAI (chat + TTS + Whisper)
│   │   ├── gamification/       # XP, niveaux, streaks, badges
│   │   ├── mini-games/         # Moteur de mini-jeux
│   │   ├── payments/           # Stripe et abonnements
│   │   └── common/             # Guards, intercepteurs, utils
│   ├── .env.example            # Template de variables d'environnement
│   └── package.json
│
├── flutter/                    # App mobile Flutter (Dart)
│   ├── lib/
│   │   ├── core/               # Thème, routeur, injection de dépendances
│   │   │   ├── theme/          # AppTheme, AppColors, typographies
│   │   │   ├── router/         # GoRouter — toutes les routes
│   │   │   ├── di/             # GetIt — injection de dépendances
│   │   │   └── services/       # Services globaux (storage, analytics)
│   │   ├── shared/             # Widgets réutilisables dans toute l'app
│   │   │   └── widgets/        # MandaButton, MandaCard, badges, etc.
│   │   ├── features/           # Fonctionnalités organisées par domaine
│   │   │   ├── auth/           # Login, inscription, onboarding
│   │   │   ├── home/           # Dashboard principal
│   │   │   ├── lessons/        # Cours de mandarin
│   │   │   ├── ai_chat/        # MandaBot — chat IA
│   │   │   ├── mini_games/     # 35 mini-jeux gamifiés
│   │   │   ├── gamification/   # XP, classements, défis
│   │   │   ├── pronunciation/  # Entraînement vocal
│   │   │   ├── premium/        # Page paywall et gestion abonnement
│   │   │   ├── profile/        # Profil et paramètres utilisateur
│   │   │   └── settings/       # Préférences de l'app
│   │   └── main.dart           # Point d'entrée
│   ├── assets/                 # Images, sons, animations Lottie
│   └── pubspec.yaml
│
├── database/                   # Scripts SQL
│   ├── 001_init_schema.sql     # Schéma complet de la base
│   └── 002_seed_data.sql       # Données de test (leçons, utilisateurs demo)
│
├── infrastructure/             # Configuration Docker et déploiement
│   └── docker/
│       ├── docker-compose.yml  # Stack complète (API + DB + Redis)
│       └── Dockerfile          # Image multi-stage pour l'API
│
├── docs/                       # Documentation technique
├── Makefile                    # Commandes de développement
└── SETUP.md                    # Ce fichier
```

---

## Tester l'application

### Avec le backend complet

Une fois `make dev` lancé et `make flutter` démarré, connectez-vous avec le compte de test :

```
Email    : demo@mandago.app
Mot de passe : Demo1234!
```

### Sans backend (mode mock)

Pour développer l'UI sans démarrer Docker, activez le mode mock dans `flutter/lib/core/di/injection.dart` :

```dart
const bool kUseMockData = true; // Passer à true
```

Toutes les données seront simulées localement (leçons, XP, mini-jeux).

### Tests automatisés

```bash
# Tous les tests
make test

# Tests backend uniquement (Jest + NestJS)
make api-test

# Tests Flutter uniquement (flutter_test)
make flutter-test

# Analyse statique Flutter (lint)
make flutter-analyze
```

---

## Variables d'environnement

### Backend (`backend/.env`)

| Variable | Valeur de dev | Description |
|----------|--------------|-------------|
| `NODE_ENV` | `development` | Environnement |
| `PORT` | `3000` | Port de l'API |
| `DATABASE_URL` | `postgresql://manda_user:manda_pass@localhost:5432/manda_go` | URL PostgreSQL |
| `REDIS_URL` | `redis://localhost:6379` | URL Redis |
| `JWT_SECRET` | *(à changer)* | Clé secrète JWT (min. 32 caractères) |
| `JWT_EXPIRATION` | `15m` | Durée de vie du token d'accès |
| `JWT_REFRESH_EXPIRATION` | `7d` | Durée de vie du token de refresh |
| `OPENAI_API_KEY` | `sk-proj-...` | Clé API OpenAI (requis pour l'IA) |
| `OPENAI_MODEL` | `gpt-4o` | Modèle GPT utilisé |
| `STRIPE_SECRET_KEY` | `sk_test_...` | Clé Stripe (optionnel MVP) |
| `FIREBASE_PROJECT_ID` | *(optionnel)* | Pour les notifications push |
| `FEATURE_AI_ENABLED` | `true` | Active/désactive l'IA |
| `FEATURE_VOICE_ENABLED` | `true` | Active/désactive le vocal |

### Flutter (`flutter/lib/core/constants/`)

Les constantes Flutter sont dans le code (pas de fichier .env) :

```dart
// lib/core/constants/api_constants.dart
static const String baseUrl = 'http://localhost:3000/api/v1'; // dev
```

---

## Outils de développement optionnels

### Adminer (interface graphique PostgreSQL)

```bash
make tools-up
# Accéder à http://localhost:8080
# Serveur: manda-db | User: manda_user | Pass: manda_pass | DB: manda_go
```

### Redis Commander (interface graphique Redis)

Démarre en même temps qu'Adminer via `make tools-up`.
Accéder à http://localhost:8081

### Shell direct dans les conteneurs

```bash
make shell-api   # Shell dans le conteneur API NestJS
make shell-db    # psql dans le conteneur PostgreSQL
```

---

## Problèmes courants

**L'API ne démarre pas :**
```bash
make logs        # Vérifier les logs pour le détail de l'erreur
```

**Erreur "Cannot connect to Docker" :**
Ouvrez Docker Desktop et attendez qu'il soit complètement démarré.

**Erreur de migration PostgreSQL :**
```bash
make clean       # Supprime les volumes (données perdues)
make dev         # Recrée tout depuis zéro
```

**Flutter — erreur de dépendances :**
```bash
cd flutter && flutter clean && flutter pub get
```

**Port 3000 déjà utilisé :**
```bash
lsof -i :3000    # Identifier le processus
kill -9 <PID>    # Le terminer
```

---

## Déploiement (production)

Voir `docs/DEPLOYMENT.md` pour le guide de déploiement sur AWS.

Architecture cible : AWS ECS (API) + RDS PostgreSQL + ElastiCache Redis + S3 + CloudFront.

---

## Contribution

1. Créez une branche : `git checkout -b feature/ma-fonctionnalite`
2. Développez avec `make dev` + `make flutter`
3. Testez avec `make test`
4. Formatez avec `make flutter-format`
5. Ouvrez une Pull Request

Pour toute question : ouvrez une issue GitHub.
