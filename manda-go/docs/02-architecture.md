# 02 — Architecture Technique Manda Go

---

## 2.1 Vue d'Ensemble

```
┌─────────────────────────────────────────────────────────────────┐
│                     CLIENTS                                      │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐       │
│  │ Flutter  │  │ Flutter  │  │ Flutter  │  │  PWA     │       │
│  │  iOS     │  │ Android  │  │ Tablette │  │  Web     │       │
│  └────┬─────┘  └────┬─────┘  └────┬─────┘  └────┬─────┘       │
└───────┼─────────────┼─────────────┼──────────────┼─────────────┘
        │             │             │              │
        └─────────────┴─────────────┴──────────────┘
                               │
                    ┌──────────▼──────────┐
                    │   AWS CloudFront     │
                    │   (CDN + WAF)        │
                    └──────────┬──────────┘
                               │
                    ┌──────────▼──────────┐
                    │   AWS API Gateway   │
                    │   + Load Balancer   │
                    └──────────┬──────────┘
                               │
          ┌────────────────────┼────────────────────┐
          │                    │                    │
┌─────────▼──────┐  ┌─────────▼──────┐  ┌─────────▼──────┐
│  Auth Service  │  │ Learning Svc   │  │   AI Service   │
│  (NestJS)      │  │  (NestJS)      │  │  (NestJS)      │
│  Port 3001     │  │  Port 3002     │  │  Port 3003     │
└─────────┬──────┘  └─────────┬──────┘  └─────────┬──────┘
          │                    │                    │
┌─────────▼──────┐  ┌─────────▼──────┐  ┌─────────▼──────┐
│ Payment Svc    │  │ Gamification   │  │ Notification   │
│  (NestJS)      │  │  Svc (NestJS)  │  │  Svc (NestJS)  │
│  Port 3004     │  │  Port 3005     │  │  Port 3006     │
└─────────┬──────┘  └─────────┬──────┘  └─────────┬──────┘
          │                    │                    │
          └────────────────────┼────────────────────┘
                               │
          ┌────────────────────┼────────────────────┐
          │                    │                    │
┌─────────▼──────┐  ┌─────────▼──────┐  ┌─────────▼──────┐
│  PostgreSQL 16 │  │   Redis 7      │  │   AWS S3       │
│  (AWS RDS)     │  │ (ElastiCache)  │  │  (Media/Audio) │
└────────────────┘  └────────────────┘  └────────────────┘
```

---

## 2.2 Architecture Frontend Flutter

### Clean Architecture + BLoC

```
lib/
├── core/
│   ├── config/
│   │   ├── app_config.dart          # Environnements (dev/staging/prod)
│   │   └── constants.dart
│   ├── di/
│   │   └── injection.dart           # GetIt dependency injection
│   ├── router/
│   │   └── app_router.dart          # GoRouter configuration
│   ├── theme/
│   │   ├── app_theme.dart           # ThemeData light + dark
│   │   ├── app_colors.dart          # Palette Manda Go
│   │   └── app_typography.dart      # Typographie Inter + Noto SC
│   ├── network/
│   │   ├── api_client.dart          # Dio + interceptors
│   │   └── network_info.dart        # Connectivity check
│   ├── storage/
│   │   ├── local_storage.dart       # Hive boxes
│   │   └── secure_storage.dart      # Tokens sécurisés
│   ├── error/
│   │   ├── failures.dart            # Failure hierarchy
│   │   └── exceptions.dart
│   └── utils/
│       ├── extensions.dart
│       └── validators.dart
├── features/
│   ├── auth/
│   │   ├── data/
│   │   │   ├── datasources/
│   │   │   ├── models/
│   │   │   └── repositories/
│   │   ├── domain/
│   │   │   ├── entities/
│   │   │   ├── repositories/        # Interfaces
│   │   │   └── usecases/
│   │   └── presentation/
│   │       ├── bloc/
│   │       ├── pages/
│   │       └── widgets/
│   ├── home/
│   ├── lessons/
│   ├── exercises/
│   ├── pronunciation/
│   ├── ai_chat/
│   ├── gamification/
│   ├── mini_games/
│   ├── profile/
│   ├── premium/
│   └── settings/
└── shared/
    ├── widgets/                     # Composants réutilisables
    ├── animations/                  # Animations Lottie
    └── services/                    # Services transversaux
```

### Packages Flutter (pubspec.yaml)

```yaml
dependencies:
  flutter:
    sdk: flutter

  # State Management
  flutter_bloc: ^8.1.6
  equatable: ^2.0.5

  # Navigation
  go_router: ^14.2.0

  # Dependency Injection
  get_it: ^8.0.0
  injectable: ^2.4.1

  # HTTP & API
  dio: ^5.7.0
  retrofit: ^4.1.0

  # Code Generation
  freezed_annotation: ^2.4.1
  json_annotation: ^4.9.0

  # Local Storage
  hive_flutter: ^1.1.0
  flutter_secure_storage: ^9.2.2
  shared_preferences: ^2.3.2

  # UI & Animations
  lottie: ^3.1.2
  flutter_animate: ^4.5.0
  shimmer: ^3.0.0
  flutter_svg: ^2.0.10+1
  cached_network_image: ^3.4.1
  google_fonts: ^6.2.1

  # Audio
  just_audio: ^0.9.40
  record: ^5.1.2
  speech_to_text: ^7.0.0
  flutter_tts: ^4.1.0

  # Charts & Visualization
  fl_chart: ^0.69.0
  waveform_flutter: ^0.0.5

  # Payments
  stripe_flutter: ^10.2.0
  flutter_inapp_purchase: ^5.6.0

  # Firebase
  firebase_core: ^3.6.0
  firebase_analytics: ^11.3.3
  firebase_messaging: ^15.1.3
  firebase_crashlytics: ^4.1.3

  # Permissions & Device
  permission_handler: ^11.3.1
  connectivity_plus: ^6.1.1
  path_provider: ^2.1.5
  package_info_plus: ^8.1.0

  # Analytics
  mixpanel_flutter: ^2.3.2

  # Drawing (Hanzi strokes)
  flutter_drawing_board: ^0.4.2

  # Misc
  in_app_review: ^2.0.9
  url_launcher: ^6.3.1
  share_plus: ^10.0.3
  image_picker: ^1.1.2
  intl: ^0.19.0

dev_dependencies:
  flutter_test:
    sdk: flutter
  build_runner: ^2.4.13
  freezed: ^2.5.7
  json_serializable: ^6.8.0
  injectable_generator: ^2.6.2
  retrofit_generator: ^9.1.3
  mockito: ^5.4.4
  bloc_test: ^9.1.7
  very_good_analysis: ^6.0.0
```

---

## 2.3 Architecture Backend NestJS

### Structure Microservices

```
backend/
├── src/
│   ├── app.module.ts
│   ├── main.ts
│   ├── modules/
│   │   ├── auth/                    # JWT, OAuth, 2FA
│   │   ├── users/                   # Profils, settings
│   │   ├── learning/                # Cours, leçons, exercices
│   │   ├── progress/                # Suivi progression SRS
│   │   ├── ai/                      # GPT-4o, Whisper, TTS
│   │   ├── pronunciation/           # Analyse vocale
│   │   ├── gamification/            # XP, badges, ligues
│   │   ├── mini-games/              # Sessions de jeux
│   │   ├── subscriptions/           # Stripe Billing
│   │   ├── notifications/           # FCM + in-app
│   │   ├── media/                   # Upload S3
│   │   └── analytics/              # Événements, métriques
│   ├── common/
│   │   ├── decorators/
│   │   ├── filters/                 # Exception filters
│   │   ├── guards/                  # JWT, Roles, Throttle
│   │   ├── interceptors/            # Logging, Transform
│   │   ├── middleware/
│   │   └── pipes/                   # Validation
│   ├── config/
│   │   ├── database.config.ts
│   │   ├── redis.config.ts
│   │   ├── jwt.config.ts
│   │   └── stripe.config.ts
│   └── shared/
│       ├── entities/                # TypeORM base entities
│       └── types/
├── test/
├── migrations/
└── seeds/
```

### Communication inter-services

```
Synchrone (REST) :
  Gateway → Auth Service      (validation token)
  Gateway → Learning Service  (leçons, exercices)
  Gateway → AI Service        (chat, prononciation)
  Gateway → Payment Service   (abonnements)

Asynchrone (AWS SQS/SNS) :
  Learning → Gamification     (completion de leçon → XP)
  Payment  → Notification     (confirmation paiement)
  Auth     → Notification     (bienvenue, vérif email)
  AI       → Analytics        (log conversations)
```

---

## 2.4 Infrastructure AWS

### Services AWS Utilisés

| Service | Usage | Configuration |
|---------|-------|---------------|
| **EKS** | Orchestration Kubernetes | 3 nodes m5.xlarge |
| **RDS PostgreSQL** | Base de données principale | db.r6g.large Multi-AZ |
| **ElastiCache Redis** | Cache + sessions + files | cache.r6g.large |
| **S3** | Audio, images, médias | Versionning activé |
| **CloudFront** | CDN global | 400+ PoP, HTTPS forcé |
| **SQS** | File de messages async | Standard + FIFO queues |
| **SNS** | Notifications broadcast | Topics par région |
| **Cognito** | Auth OAuth2 social | Google, Apple, Facebook |
| **Secrets Manager** | Variables sensibles | Rotation automatique |
| **ACM** | Certificats TLS | Renouvellement auto |
| **Route 53** | DNS | Latency routing |
| **WAF** | Firewall applicatif | OWASP ruleset |
| **CloudWatch** | Monitoring + logs | Alertes Slack intégrées |
| **ECR** | Registry Docker | Scan vulnérabilités |
| **CodePipeline** | CI/CD AWS natif | Backup GitHub Actions |

### Diagram de flux AWS (simplifié)

```
Internet → Route53 → CloudFront → WAF → ALB → EKS Pods
                              ↓
                           S3 (static assets, audio files)

EKS Pods → RDS (PostgreSQL via VPC Private Subnet)
         → ElastiCache (Redis via VPC Private Subnet)
         → SQS (async jobs)
         → Secrets Manager (config sécurisée)
         → S3 (upload médias)
         → SNS → Lambda → Firebase FCM (notifications)
```

---

## 2.5 Services Tiers

### Authentification
- **AWS Cognito** : Identity pools, OAuth2 (Google, Apple)
- **JWT** : Access token 15 min + Refresh token 30 jours
- **2FA** : TOTP via authenticator app (optionnel)

### Paiement
- **Stripe Billing** : Abonnements récurrents, trials, coupons
- **Stripe Connect** : Programme d'affiliation
- **Apple Pay / Google Pay** : Via Stripe SDK mobile
- **Webhooks** : payment_intent.succeeded, customer.subscription.deleted

### Intelligence Artificielle
- **OpenAI GPT-4o** : Conversations MandaBot, génération d'exercices
- **OpenAI Whisper** : Transcription audio mandarin
- **OpenAI TTS** : Synthèse vocale native (voix "shimmer" pour femme)
- **Azure Cognitive Speech** : Reconnaissance vocale temps réel (latence < 100ms)
- **Custom ONNX model** : Évaluation précision des tons (déployé sur EKS)

### Notifications
- **Firebase FCM** : Push iOS + Android
- **AWS SNS** : Broadcast à segments d'utilisateurs
- **In-app** : Socket.io temps réel pour notifications dans l'app

### Stockage Médias
- **AWS S3** : Audio d'exercices, images de caractères, avatars
- **CloudFront** : Distribution CDN avec signed URLs
- **Formats audio** : MP3 (natifs), WebM (web), AAC (iOS)

### Analytics
- **Mixpanel** : Funnel d'acquisition, rétention, feature adoption
- **Firebase Analytics** : Événements mobiles, crash reporting
- **Custom dashboard** : Métrique spécifiques (précision tonale, SRS stats)

---

## 2.6 Sécurité

### Mesures de sécurité implémentées

```
API Security:
├── Rate Limiting (100 req/min/IP via @nestjs/throttler)
├── Helmet.js (headers HTTP sécurisés)
├── CORS whitelist (domaines autorisés uniquement)
├── Input validation (class-validator sur tous DTOs)
├── SQL injection (TypeORM parameterized queries)
├── JWT blacklist (Redis pour tokens révoqués)
└── WAF AWS (SQLi, XSS, rate abuse rules)

Data Security:
├── Encryption at rest (RDS + S3 AES-256)
├── Encryption in transit (TLS 1.3 forcé)
├── PII masking dans les logs
├── RGPD compliant (droit à l'effacement implémenté)
└── SOC2 Type II (roadmap 18 mois)

Mobile Security:
├── Certificate pinning (Dio + custom CertificatePinner)
├── Root/Jailbreak detection
├── ProGuard/R8 obfuscation (Android)
├── Bitcode disabled (iOS)
└── flutter_secure_storage (Keychain iOS / Keystore Android)
```

---

## 2.7 Scalabilité

### Objectifs de performance

| Métrique | Cible | Max |
|----------|-------|-----|
| Temps de réponse API p95 | < 150 ms | < 500 ms |
| Disponibilité | 99,9% | — |
| Utilisateurs simultanés | 50 000 | 500 000 |
| Débit DB (queries/sec) | 5 000 | 50 000 |
| Latence vocale (prononciation) | < 200 ms | < 500 ms |
| Taille APK Android | < 35 MB | < 50 MB |
| Taille IPA iOS | < 80 MB | < 150 MB |

### Stratégie de mise à l'échelle

```
Horizontale (HPA Kubernetes) :
  NestJS pods : 3 → 50 pods selon CPU/mémoire
  AI service  : 2 → 20 pods (coûteux, scaling conservatif)

Verticale :
  RDS Read Replicas : 1 → 5 selon charge lectures

Cache Strategy :
  Redis L1 : Sessions, tokens (TTL 15 min)
  Redis L2 : Contenu leçons (TTL 24h)
  Redis L3 : Classements/leaderboards (TTL 5 min)
  CloudFront : Médias statiques (TTL 7 jours)

Database :
  Connection pooling (PgBouncer, max 1000 connections)
  Read/Write splitting (Write → Primary, Read → Replica)
  Partitioning user_progress par user_id range
```
