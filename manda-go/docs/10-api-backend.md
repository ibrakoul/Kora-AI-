# 10 - API Backend - Manda Go

## Vue d'ensemble

L'API Manda Go est construite avec **NestJS 10** (Node.js 20 LTS) et expose:
- Une **REST API** versionnée (`/api/v1`) pour toutes les opérations CRUD
- Une **API GraphQL** (`/graphql`) pour les queries temps réel et subscriptions
- Des **WebSockets** (Socket.IO) pour le chat IA et les classements live

**Base URL production:** `https://api.mandago.app`

---

## Authentification JWT

### Structure du token

```typescript
// Access Token (JWT signé RS256)
interface AccessTokenPayload {
  // Claims standard RFC 7519
  sub: string;          // user_id (UUID)
  iss: string;          // "mandago-api"
  aud: string;          // "mandago-client"
  iat: number;          // Issued at (unix timestamp)
  exp: number;          // Expiration: NOW + 15 minutes
  jti: string;          // JWT ID unique (pour blacklist)

  // Claims personnalisés Manda Go
  email: string;
  username: string;
  hsk_level: number;    // 1-6
  is_premium: boolean;
  roles: string[];      // ['user'] | ['user','admin'] | ['user','moderator']
  session_id: string;   // Lie le token à une session Redis
}

// Refresh Token (opaque, stocké en HTTP-only cookie)
interface RefreshToken {
  token: string;        // 64 bytes aléatoires (crypto.randomBytes)
  user_id: string;
  session_id: string;
  expires_at: Date;     // NOW + 30 jours
  ip_address: string;
  user_agent: string;
}
```

### Rotation des refresh tokens

```
Client                        API                           Redis/DB
  │                             │                               │
  │ POST /auth/refresh          │                               │
  │ Cookie: refresh_token       │                               │
  ├────────────────────────────►│                               │
  │                             │ Valider refresh_token         │
  │                             ├──────────────────────────────►│
  │                             │◄──────────────────────────────┤
  │                             │ Invalider ancien token        │
  │                             ├──────────────────────────────►│
  │                             │ Générer nouveau refresh_token │
  │                             ├──────────────────────────────►│
  │                             │ Générer nouvel access_token   │
  │                             │                               │
  │◄────────────────────────────┤                               │
  │ 200 { access_token }        │                               │
  │ Set-Cookie: refresh_token   │                               │
```

### Blacklisting des tokens révoqués

Lors d'un logout ou changement de mot de passe, le `jti` du token actif est ajouté dans Redis avec un TTL égal au temps de vie restant du token. Chaque requête authentifiée vérifie `GET jwt_blacklist:{jti}` avant d'autoriser l'accès.

---

## REST API

### Convention de réponse

```typescript
// Succès
{
  "success": true,
  "data": { ... },
  "meta": {            // Optionnel - pagination
    "page": 1,
    "limit": 20,
    "total": 150,
    "total_pages": 8
  }
}

// Erreur
{
  "success": false,
  "error": {
    "code": "LESSON_NOT_FOUND",      // Code machine
    "message": "Leçon introuvable",  // Message lisible
    "details": { ... }               // Optionnel: champs invalides
  }
}
```

---

### AUTH - Authentification

#### POST /api/v1/auth/register

Crée un nouveau compte utilisateur.

```
Auth: Non requis
Body:
{
  "email": "string (requis, format email)",
  "username": "string (requis, 3-30 chars, alphanumérique)",
  "password": "string (requis, min 8 chars, 1 maj, 1 chiffre)",
  "locale": "string (optionnel, default: 'fr')",
  "timezone": "string (optionnel, IANA timezone)",
  "referral_code": "string (optionnel)"
}

Réponse 201:
{
  "success": true,
  "data": {
    "user": {
      "id": "uuid",
      "email": "user@example.com",
      "username": "mandarin_learner",
      "hsk_level": 1,
      "xp_total": 0
    },
    "access_token": "eyJhbGciOiJSUzI1NiJ9...",
    "message": "Compte créé. Vérifiez votre email."
  }
}

Erreurs:
400 VALIDATION_ERROR        - Email/username invalide
409 EMAIL_ALREADY_EXISTS    - Email déjà utilisé
409 USERNAME_ALREADY_EXISTS - Username déjà pris
429 RATE_LIMIT_EXCEEDED     - Trop de tentatives (10/heure/IP)
```

#### POST /api/v1/auth/login

```
Auth: Non requis
Body:
{
  "email": "string",
  "password": "string",
  "remember_me": "boolean (optionnel, default: false)"
}

Réponse 200:
{
  "success": true,
  "data": {
    "access_token": "string (JWT, expire dans 15min)",
    "user": {
      "id": "uuid",
      "email": "string",
      "username": "string",
      "hsk_level": 1,
      "xp_total": 0,
      "current_streak": 5,
      "is_premium": false,
      "premium_until": null,
      "hearts": 5,
      "gems": 100,
      "avatar_url": "string|null"
    }
  }
}
Set-Cookie: refresh_token=<opaque>; HttpOnly; Secure; SameSite=Strict; Max-Age=2592000

Erreurs:
400 VALIDATION_ERROR          - Champs manquants
401 INVALID_CREDENTIALS       - Email ou mot de passe incorrect
403 ACCOUNT_BANNED            - Compte suspendu
403 EMAIL_NOT_VERIFIED        - Email non vérifié
429 RATE_LIMIT_EXCEEDED       - 10 tentatives/min/IP (anti-bruteforce)
```

#### POST /api/v1/auth/refresh

```
Auth: Cookie refresh_token (HTTP-only)
Body: aucun

Réponse 200:
{
  "success": true,
  "data": {
    "access_token": "string"
  }
}

Erreurs:
401 REFRESH_TOKEN_INVALID  - Token expiré ou invalide
401 REFRESH_TOKEN_ROTATED  - Token déjà utilisé (détection vol)
```

#### POST /api/v1/auth/logout

```
Auth: Bearer token
Body: aucun

Réponse 200:
{
  "success": true,
  "data": { "message": "Déconnecté avec succès" }
}
Actions: Blacklist JWT + invalider refresh token Redis
```

#### POST /api/v1/auth/forgot-password

```
Auth: Non requis
Body:
{
  "email": "string"
}

Réponse 200 (toujours, même si email inconnu - sécurité):
{
  "success": true,
  "data": { "message": "Si cet email existe, un lien a été envoyé." }
}
TTL du token de réinitialisation: 1 heure
Limite: 3 demandes/heure/email
```

#### POST /api/v1/auth/verify-email

```
Auth: Non requis
Body:
{
  "token": "string (token reçu par email)"
}

Réponse 200:
{
  "success": true,
  "data": { "message": "Email vérifié avec succès", "access_token": "string" }
}

Erreurs:
400 TOKEN_INVALID   - Token malformé
410 TOKEN_EXPIRED   - Token expiré (TTL: 24h)
```

---

### USERS - Utilisateurs

#### GET /api/v1/users/me

```
Auth: Bearer token (requis)

Réponse 200:
{
  "success": true,
  "data": {
    "id": "uuid",
    "email": "string",
    "username": "string",
    "avatar_url": "string|null",
    "hsk_level": 1,
    "xp_total": 1250,
    "xp_weekly": 300,
    "gems": 150,
    "hearts": 4,
    "hearts_refill_at": "2025-06-18T20:00:00Z",
    "is_premium": true,
    "premium_until": "2025-12-31T23:59:59Z",
    "current_streak": 12,
    "longest_streak": 34,
    "last_activity_date": "2025-06-17",
    "preferred_teacher": "mei_mei",
    "daily_goal_minutes": 15,
    "locale": "fr",
    "timezone": "Europe/Paris",
    "created_at": "2025-01-01T00:00:00Z"
  }
}
```

#### PATCH /api/v1/users/me

```
Auth: Bearer token (requis)
Body (tous optionnels):
{
  "username": "string",
  "avatar_url": "string",
  "timezone": "string",
  "locale": "string",
  "daily_goal_minutes": 5|10|15|20|30,
  "preferred_teacher": "liu_laoshi|mei_mei|master_chen",
  "notification_enabled": boolean,
  "reminder_time": "HH:MM",
  "sound_enabled": boolean,
  "haptic_enabled": boolean,
  "learning_goals": ["string"],
  "learning_style": "visual|auditory|kinesthetic|balanced"
}

Réponse 200: utilisateur mis à jour (même structure que GET /me)

Erreurs:
400 VALIDATION_ERROR       - Champ invalide
409 USERNAME_ALREADY_EXISTS
```

#### DELETE /api/v1/users/me

```
Auth: Bearer token (requis)
Body:
{
  "password": "string",
  "reason": "string (optionnel)"
}

Réponse 200:
{
  "success": true,
  "data": { "message": "Compte supprimé définitivement." }
}
Actions: Suppression RGPD en cascade (async job 48h - délai de rétractation)
```

#### GET /api/v1/users/:id/profile

```
Auth: Bearer token (requis)
Params: id = UUID utilisateur

Réponse 200:
{
  "success": true,
  "data": {
    "id": "uuid",
    "username": "string",
    "avatar_url": "string|null",
    "hsk_level": 3,
    "current_streak": 45,
    "longest_streak": 120,
    "xp_total": 8500,
    "completed_lessons": 87,
    "mastered_vocab": 340,
    "achievements_count": 23,
    "joined_at": "2025-01-15T00:00:00Z",
    "is_premium": true
  }
}
Note: données limitées si profil_public = FALSE (retourne 404 ou données réduites)

Erreurs:
404 USER_NOT_FOUND
```

#### GET /api/v1/users/:id/stats

```
Auth: Bearer token (requis)

Réponse 200:
{
  "success": true,
  "data": {
    "xp": { "total": 8500, "this_week": 420, "last_week": 350 },
    "streak": { "current": 45, "longest": 120, "last_date": "2025-06-17" },
    "vocabulary": {
      "total_learned": 520,
      "mastered": 340,
      "in_review": 150,
      "due_today": 23
    },
    "lessons": {
      "total_completed": 87,
      "this_week": 12,
      "accuracy_avg": 78.5
    },
    "pronunciation": {
      "attempts_total": 234,
      "avg_score": 72,
      "tone_accuracy": 68,
      "best_score": 96
    },
    "time_spent_hours": 42.5,
    "current_league": "gold",
    "league_rank": 14
  }
}
```

---

### LEARNING - Apprentissage

#### GET /api/v1/courses

```
Auth: Bearer token (requis)
Query params:
  - hsk_level: number (optionnel, filtre par niveau)
  - include_progress: boolean (default: true)

Réponse 200:
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "slug": "hsk1-basics",
      "hsk_level": 1,
      "title": "HSK 1 - Les bases",
      "title_zh": "HSK1基础",
      "description": "string",
      "thumbnail_url": "string",
      "total_lessons": 30,
      "total_xp": 600,
      "estimated_hours": 10.5,
      "is_premium": false,
      "tags": ["greetings","numbers","colors"],
      "user_progress": {          // null si include_progress=false
        "completed_lessons": 12,
        "percentage": 40,
        "status": "in_progress"
      }
    }
  ]
}
```

#### GET /api/v1/courses/:id

```
Auth: Bearer token (requis)
Params: id = UUID ou slug

Réponse 200: Cours complet + liste des leçons (résumé)
Erreurs: 404 COURSE_NOT_FOUND
```

#### GET /api/v1/courses/:id/lessons

```
Auth: Bearer token (requis)
Query: page=1&limit=20

Réponse 200:
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "title": "Leçon 1 - Bonjour en mandarin",
      "type": "vocabulary",
      "xp_reward": 20,
      "duration_est_s": 300,
      "is_premium": false,
      "order_index": 1,
      "user_progress": {
        "status": "completed",
        "score": 92,
        "completed_at": "2025-06-15T14:30:00Z"
      }
    }
  ],
  "meta": { "page": 1, "limit": 20, "total": 30, "total_pages": 2 }
}
```

#### GET /api/v1/lessons/:id

```
Auth: Bearer token (requis)
Réponse 200: Leçon complète avec content_json, exercises preview

Erreurs:
403 PREMIUM_REQUIRED  - Leçon premium, utilisateur free
404 LESSON_NOT_FOUND
```

#### POST /api/v1/lessons/:id/complete

```
Auth: Bearer token (requis)
Body:
{
  "score": 85,                      // Score 0-100
  "time_spent_s": 320,              // Temps passé en secondes
  "mistakes": [                     // Erreurs commises
    {
      "exercise_id": "uuid",
      "wrong_answer": "string",
      "correct_answer": "string"
    }
  ]
}

Réponse 200:
{
  "success": true,
  "data": {
    "xp_earned": 18,
    "gems_earned": 0,
    "new_streak": 13,
    "streak_extended": true,
    "hearts_lost": 0,
    "achievements_unlocked": [
      {
        "id": "uuid",
        "name": "Première victoire",
        "icon_emoji": "🏅",
        "xp_reward": 50
      }
    ],
    "vocabulary_added_to_srs": 8,
    "next_lesson": { "id": "uuid", "title": "string" }
  }
}

Erreurs:
400 ALREADY_COMPLETED  - Déjà complété aujourd'hui (pour éviter farm XP)
403 HEARTS_EMPTY       - Plus de coeurs (mode premium non actif)
```

#### GET /api/v1/exercises/:id

```
Auth: Bearer token (requis)
Réponse 200: Exercice complet sans la réponse correcte (sécurité)
```

#### POST /api/v1/exercises/:id/submit

```
Auth: Bearer token (requis)
Body:
{
  "answer": "string | string[] | object",
  "time_taken_ms": 3200
}

Réponse 200:
{
  "success": true,
  "data": {
    "is_correct": true,
    "correct_answer": "你好",
    "explanation": "string",
    "xp_earned": 5,
    "next_exercise_id": "uuid|null"
  }
}
```

---

### AI - Intelligence Artificielle

#### POST /api/v1/ai/chat

```
Auth: Bearer token (requis)
Content-Type: application/json
Body:
{
  "message": "string (max 2000 chars)",
  "session_id": "string (optionnel, reprend une conv existante)",
  "teacher": "liu_laoshi|mei_mei|master_chen (optionnel, default: profil user)",
  "context": {
    "current_lesson_id": "uuid (optionnel)",
    "topic": "string (optionnel)"
  }
}

Réponse: Server-Sent Events (text/event-stream)
Chaque event:
  data: {"type":"chunk","content":"Bonjour"}\n\n
  data: {"type":"chunk","content":" ! "}\n\n
  data: {"type":"done","session_id":"uuid","tokens_used":342}\n\n
  data: {"type":"error","code":"RATE_LIMIT_EXCEEDED"}\n\n

Erreurs:
400 MESSAGE_TOO_LONG        - > 2000 caractères
403 DAILY_LIMIT_REACHED     - Quota IA journalier épuisé (free users)
429 RATE_LIMIT_EXCEEDED     - 30 req/min
```

#### POST /api/v1/ai/pronunciation-check

```
Auth: Bearer token (requis)
Content-Type: multipart/form-data
Body:
  audio: File (WAV/M4A/OGG, max 10MB, durée 0.5s-10s)
  target_text: string (texte attendu en hanzi)
  target_pinyin: string (optionnel)
  exercise_id: string UUID (optionnel)

Réponse 200:
{
  "success": true,
  "data": {
    "overall": 78,
    "tonal_accuracy": 65,
    "phonemic_clarity": 82,
    "rhythm": 80,
    "fluency": 88,
    "passed": true,
    "syllable_breakdown": [
      {
        "syllable": "nǐ",
        "expected": "ni3",
        "detected": "ni3",
        "tone_score": 95,
        "initial_score": 100,
        "final_score": 90,
        "error_type": null
      },
      {
        "syllable": "hǎo",
        "expected": "hao3",
        "detected": "hao2",
        "tone_score": 45,
        "initial_score": 85,
        "final_score": 80,
        "error_type": "rising_as_dipping"
      }
    ],
    "feedback": {
      "positive": "Bonne prononciation du 'n' initial",
      "improvement": "Le 3e ton de 好 doit descendre plus bas avant de remonter",
      "tip": "Pour le 3e ton: pensez à une courbe en U, pas seulement une descente",
      "native_audio_url": "https://cdn.mandago.app/audio/ref/nihao.mp3"
    },
    "attempt_id": "uuid"
  }
}

Erreurs:
400 AUDIO_TOO_SHORT         - Moins de 0.5 secondes
400 AUDIO_TOO_LONG          - Plus de 10 secondes
400 AUDIO_NO_SPEECH         - Aucune voix détectée
400 LANGUAGE_NOT_DETECTED   - Whisper ne détecte pas du mandarin
415 UNSUPPORTED_FORMAT      - Format audio non supporté
429 RATE_LIMIT_EXCEEDED     - 20 tentatives/min
```

#### POST /api/v1/ai/generate-exercise

```
Auth: Bearer token (requis)
Body:
{
  "type": "fill_blank|multiple_choice|translation_fr_cn|...",
  "hsk_level": 1-6,
  "focus": "vocabulary|grammar|pronunciation",
  "topic": "string (optionnel)",
  "count": 1-5
}

Réponse 200:
{
  "success": true,
  "data": {
    "exercises": [
      {
        "type": "multiple_choice",
        "instruction": "Choisissez la bonne traduction",
        "question": { "text": "你好", "audio_url": "string" },
        "options": ["Bonjour", "Au revoir", "Merci", "S'il vous plaît"],
        "correct_index": 0,
        "explanation": "你好 (nǐ hǎo) signifie bonjour en mandarin",
        "difficulty": 1,
        "xp_value": 5
      }
    ],
    "generated_by": "gpt-4o-mini"
  }
}
```

#### POST /api/v1/ai/translate

```
Auth: Bearer token (requis)
Body:
{
  "text": "string (max 500 chars)",
  "source_lang": "fr|en|zh",
  "target_lang": "zh|fr|en",
  "include_pinyin": true,
  "include_breakdown": false   // Décomposition mot à mot
}

Réponse 200:
{
  "success": true,
  "data": {
    "translation": "你好",
    "pinyin": "nǐ hǎo",
    "pronunciation_tip": "string",
    "breakdown": [                  // Si include_breakdown=true
      { "source": "Bonjour", "target": "你好", "pinyin": "nǐ hǎo" }
    ],
    "alternative_translations": ["你好！","大家好"]
  }
}
```

#### GET /api/v1/ai/conversation/:id

```
Auth: Bearer token (requis)
Params: id = session_id UUID

Réponse 200:
{
  "success": true,
  "data": {
    "id": "uuid",
    "session_id": "string",
    "teacher": "mei_mei",
    "topic": "string|null",
    "messages": [
      {
        "role": "user|assistant",
        "content": "string",
        "timestamp": "ISO8601"
      }
    ],
    "total_messages": 24,
    "started_at": "ISO8601",
    "key_learnings": ["string"]
  }
}
```

---

### GAMIFICATION

#### GET /api/v1/gamification/leaderboard

```
Auth: Bearer token (requis)
Query:
  - type: weekly|alltime|minigame (default: weekly)
  - game_type: string (si type=minigame)
  - league: bronze|silver|gold|... (optionnel)
  - limit: 10-100 (default: 50)

Réponse 200:
{
  "success": true,
  "data": {
    "type": "weekly",
    "reset_at": "2025-06-23T00:00:00Z",
    "current_user_rank": 14,
    "current_user_score": 420,
    "entries": [
      {
        "rank": 1,
        "user_id": "uuid",
        "username": "dragon_learner",
        "avatar_url": "string|null",
        "hsk_level": 4,
        "score": 1850,
        "is_current_user": false
      }
    ]
  }
}
```

#### GET /api/v1/gamification/achievements

```
Auth: Bearer token (requis)
Query:
  - category: streak|xp|lesson|... (optionnel)
  - status: earned|in_progress|locked (optionnel)

Réponse 200:
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "slug": "streak-7",
      "name": "Semaine de feu",
      "description": "Maintenez un streak de 7 jours",
      "icon_emoji": "🔥",
      "category": "streak",
      "rarity": "common",
      "xp_reward": 100,
      "status": "earned",
      "progress": 7,
      "target": 7,
      "earned_at": "2025-06-10T08:00:00Z"
    }
  ]
}
```

#### GET /api/v1/gamification/streak

```
Auth: Bearer token (requis)

Réponse 200:
{
  "success": true,
  "data": {
    "current_streak": 12,
    "longest_streak": 45,
    "last_activity_date": "2025-06-17",
    "today_completed": true,
    "freeze_available": 2,
    "at_risk": false,
    "next_milestone": 14,
    "streak_history": [
      { "start_date": "2025-06-06", "end_date": "2025-06-17", "length": 12 }
    ]
  }
}
```

#### POST /api/v1/gamification/claim-reward

```
Auth: Bearer token (requis)
Body:
{
  "type": "daily_chest|achievement|league_prize|streak_milestone",
  "reference_id": "uuid (optionnel selon type)"
}

Réponse 200:
{
  "success": true,
  "data": {
    "xp_earned": 50,
    "gems_earned": 25,
    "items": ["streak_freeze"],
    "new_xp_total": 8550
  }
}

Erreurs:
400 ALREADY_CLAIMED   - Récompense déjà réclamée
400 NOT_ELIGIBLE      - Conditions non remplies
```

---

### SUBSCRIPTIONS - Abonnements

#### GET /api/v1/subscriptions/plans

```
Auth: Non requis

Réponse 200:
{
  "success": true,
  "data": [
    {
      "id": "premium_monthly",
      "name": "Manda Go Premium",
      "price_monthly": 999,            // En centimes (9.99 EUR)
      "price_currency": "EUR",
      "stripe_price_id": "price_xxx",
      "billing_period": "monthly",
      "trial_days": 7,
      "features": [
        "Accès illimité à tous les cours",
        "MandaBot IA illimité",
        "Évaluation vocale avancée",
        "Coeurs illimités",
        "Téléchargement hors-ligne",
        "Streak Freeze (3/mois)"
      ]
    },
    {
      "id": "premium_annual",
      "name": "Manda Go Premium Annuel",
      "price_monthly": 666,            // 6.66 EUR/mois
      "price_annually": 7999,          // 79.99 EUR/an
      "price_currency": "EUR",
      "stripe_price_id": "price_yyy",
      "billing_period": "annual",
      "trial_days": 7,
      "savings_percentage": 33,
      "features": ["..."]
    }
  ]
}
```

#### POST /api/v1/subscriptions/create

```
Auth: Bearer token (requis)
Body:
{
  "plan_id": "premium_monthly|premium_annual",
  "payment_method_id": "pm_xxx",     // Stripe payment method
  "promo_code": "string (optionnel)"
}

Réponse 200:
{
  "success": true,
  "data": {
    "subscription_id": "uuid",
    "stripe_sub_id": "sub_xxx",
    "status": "active|trialing",
    "current_period_end": "ISO8601",
    "trial_end": "ISO8601|null",
    "client_secret": "pi_xxx_secret_xxx"  // Pour confirmation 3DS si nécessaire
  }
}

Erreurs:
400 INVALID_PAYMENT_METHOD   - Carte refusée
400 INVALID_PROMO_CODE       - Code promo invalide
409 ALREADY_SUBSCRIBED       - Abonnement actif existant
```

#### POST /api/v1/subscriptions/cancel

```
Auth: Bearer token (requis)
Body:
{
  "reason": "string (optionnel)",
  "cancel_immediately": false    // default: false = fin de période
}

Réponse 200:
{
  "success": true,
  "data": {
    "message": "Abonnement annulé. Accès Premium jusqu'au 2025-12-31.",
    "access_until": "ISO8601"
  }
}
```

#### POST /api/v1/subscriptions/webhook/stripe

```
Auth: Signature Stripe (header: Stripe-Signature)
Content-Type: application/json
Body: Payload Stripe brut

Événements traités:
  - customer.subscription.created   → Activer premium
  - customer.subscription.updated   → Mettre à jour statut
  - customer.subscription.deleted   → Désactiver premium
  - invoice.payment_succeeded       → Créer transaction
  - invoice.payment_failed          → Notifier user, envoyer email
  - customer.subscription.trial_will_end → Rappel 3 jours avant

Réponse 200: { "received": true }
Déduplication via Redis lock: SET lock:stripe_webhook:{event_id} 1 NX EX 300
```

---

## Schéma GraphQL

```graphql
# ============================================================
# TYPES
# ============================================================

type User {
  id: ID!
  email: String!
  username: String!
  avatarUrl: String
  hskLevel: Int!
  xpTotal: Int!
  xpWeekly: Int!
  gems: Int!
  hearts: Int!
  isPremium: Boolean!
  premiumUntil: String
  createdAt: String!
  streak: Streak
  profile: UserProfile
  stats: UserStats
}

type UserProfile {
  motherTongue: String!
  learningGoals: [String!]!
  learningStyle: String!
  dailyGoalMinutes: Int!
  preferredTeacher: String!
  country: String
}

type UserStats {
  completedLessons: Int!
  masteredVocab: Int!
  achievementsCount: Int!
  totalTimeHours: Float!
  pronunciationAvgScore: Int
  currentLeague: String
  leagueRank: Int
}

type Streak {
  current: Int!
  longest: Int!
  lastActivityDate: String
  todayCompleted: Boolean!
  freezeAvailable: Int!
  atRisk: Boolean!
}

type Course {
  id: ID!
  slug: String!
  hskLevel: Int!
  title: String!
  titleZh: String
  description: String
  thumbnailUrl: String
  totalLessons: Int!
  totalXp: Int!
  estimatedHours: Float
  isPremium: Boolean!
  tags: [String!]!
  lessons(page: Int, limit: Int): LessonConnection!
  userProgress: CourseProgress
}

type Lesson {
  id: ID!
  title: String!
  type: LessonType!
  xpReward: Int!
  durationEstS: Int!
  isPremium: Boolean!
  orderIndex: Int!
  userProgress: LessonProgress
}

enum LessonType {
  VOCABULARY
  GRAMMAR
  DIALOGUE
  PRONUNCIATION
  READING
  LISTENING
  WRITING
  CULTURE
  REVIEW
  TEST
}

type Vocabulary {
  id: ID!
  hanzi: String!
  pinyin: String!
  meaningFr: String!
  hskLevel: Int!
  partOfSpeech: String
  strokeCount: Int
  audioUrlMale: String
  audioUrlFemale: String
  exampleSentenceZh: String
  exampleSentenceFr: String
  userVocabulary: UserVocabulary
}

type UserVocabulary {
  status: VocabStatus!
  srsLevel: Int!
  nextReview: String
  correctCount: Int!
  wrongCount: Int!
}

enum VocabStatus {
  NEW
  LEARNING
  REVIEWING
  MASTERED
  BURNED
}

type LeaderboardEntry {
  rank: Int!
  userId: ID!
  username: String!
  avatarUrl: String
  hskLevel: Int!
  score: Int!
  isCurrentUser: Boolean!
}

type Achievement {
  id: ID!
  slug: String!
  name: String!
  description: String!
  iconEmoji: String
  category: String!
  rarity: String!
  xpReward: Int!
  status: AchievementStatus!
  progress: Int!
  target: Int!
  earnedAt: String
}

enum AchievementStatus {
  EARNED
  IN_PROGRESS
  LOCKED
}

type AIMessage {
  role: String!
  content: String!
  timestamp: String!
}

type AIConversation {
  id: ID!
  sessionId: String!
  teacher: String!
  messages: [AIMessage!]!
  totalMessages: Int!
  startedAt: String!
}

type Notification {
  id: ID!
  type: String!
  title: String!
  body: String!
  dataJson: JSON
  readAt: String
  createdAt: String!
}

type PronunciationResult {
  overall: Int!
  tonalAccuracy: Int!
  phonemicClarity: Int!
  rhythm: Int!
  fluency: Int!
  passed: Boolean!
  feedback: PronunciationFeedback!
  attemptId: ID!
}

type PronunciationFeedback {
  positive: String!
  improvement: String!
  tip: String!
  nativeAudioUrl: String
}

type LessonConnection {
  nodes: [Lesson!]!
  totalCount: Int!
  pageInfo: PageInfo!
}

type PageInfo {
  hasNextPage: Boolean!
  hasPreviousPage: Boolean!
  currentPage: Int!
  totalPages: Int!
}

scalar JSON

# ============================================================
# QUERIES
# ============================================================

type Query {
  # Utilisateur courant
  me: User

  # Utilisateur par ID (profil public)
  user(id: ID!): User

  # Cours
  courses(hskLevel: Int, includePremium: Boolean): [Course!]!
  course(id: ID, slug: String): Course

  # Leçon
  lesson(id: ID!): Lesson

  # Vocabulaire
  vocabulary(id: ID!): Vocabulary
  searchVocabulary(query: String!, hskLevel: Int, limit: Int): [Vocabulary!]!
  dueVocabulary(limit: Int): [Vocabulary!]!   # SRS: cartes dues aujourd'hui

  # Gamification
  leaderboard(type: String!, league: String, limit: Int): [LeaderboardEntry!]!
  achievements(category: String, status: String): [Achievement!]!
  streak: Streak

  # Conversations IA
  conversation(id: ID!): AIConversation
  conversations(limit: Int): [AIConversation!]!

  # Notifications
  notifications(unreadOnly: Boolean, limit: Int): [Notification!]!
  unreadNotificationsCount: Int!
}

# ============================================================
# MUTATIONS
# ============================================================

type Mutation {
  # Profil
  updateProfile(input: UpdateProfileInput!): User!
  uploadAvatar(file: Upload!): User!

  # Apprentissage
  completeLesson(lessonId: ID!, score: Int!, timeSpentS: Int!): CompleteLessonResult!
  submitExercise(exerciseId: ID!, answer: JSON!): SubmitExerciseResult!

  # Vocabulaire SRS
  reviewVocabulary(vocabId: ID!, score: Int!): UserVocabulary!
  addToVocabulary(vocabId: ID!): UserVocabulary!

  # IA
  sendAIMessage(sessionId: String, message: String!, teacher: String): Boolean!
  # → Déclenche subscription AIMessageChunk

  # Gamification
  claimReward(type: String!, referenceId: ID): ClaimRewardResult!
  readNotifications(ids: [ID!]!): Int!

  # Abonnement
  cancelSubscription(reason: String): Boolean!
}

# ============================================================
# SUBSCRIPTIONS (temps réel via WebSocket)
# ============================================================

type Subscription {
  # Streaming du chat IA token par token
  aiMessageChunk(sessionId: String!): AIChunk!

  # Mise à jour live du classement
  leaderboardUpdate(type: String!): LeaderboardEntry!

  # Notification en temps réel
  notificationReceived: Notification!

  # Mise à jour XP/streak en temps réel
  userStatsUpdate: UserStatsUpdate!
}

type AIChunk {
  sessionId: String!
  content: String!
  isDone: Boolean!
  totalTokens: Int
}

type UserStatsUpdate {
  xpTotal: Int!
  xpEarned: Int!
  newStreak: Int!
  achievementsUnlocked: [Achievement!]!
}

# ============================================================
# INPUT TYPES
# ============================================================

input UpdateProfileInput {
  username: String
  timezone: String
  locale: String
  dailyGoalMinutes: Int
  preferredTeacher: String
  notificationEnabled: Boolean
  reminderTime: String
  soundEnabled: Boolean
  hapticEnabled: Boolean
  learningGoals: [String!]
  learningStyle: String
}

type CompleteLessonResult {
  xpEarned: Int!
  gemsEarned: Int!
  newStreak: Int!
  streakExtended: Boolean!
  heartsLost: Int!
  achievementsUnlocked: [Achievement!]!
  vocabularyAddedToSrs: Int!
  nextLesson: Lesson
}

type SubmitExerciseResult {
  isCorrect: Boolean!
  correctAnswer: JSON!
  explanation: String
  xpEarned: Int!
}

type ClaimRewardResult {
  xpEarned: Int!
  gemsEarned: Int!
  items: [String!]!
  newXpTotal: Int!
}
```

---

## WebSocket Events (Socket.IO)

### Connexion

```typescript
// Client
const socket = io('wss://api.mandago.app', {
  auth: { token: accessToken },      // JWT dans auth header
  transports: ['websocket'],
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
});

// Rooms automatiques à la connexion:
// - user:{user_id}         (notifications personnelles)
// - league:{league_slug}   (updates classement)
```

### Events serveur → client

```typescript
// Chat IA: streaming token par token
socket.on('ai:chunk', (data: {
  session_id: string;
  content: string;        // Fragment du message
  is_done: boolean;
  total_tokens?: number;
}) => { /* Afficher le chunk */ });

// Classement: mise à jour en temps réel
socket.on('leaderboard:update', (data: {
  type: 'weekly' | 'season';
  entry: { user_id: string; rank: number; score: number; };
}) => { /* Mettre à jour UI */ });

// Notification reçue en temps réel
socket.on('notification:new', (data: {
  id: string;
  type: string;
  title: string;
  body: string;
  data_json: object;
}) => { /* Afficher badge + toast */ });

// Streak mis en danger (20h sans activité)
socket.on('streak:at_risk', (data: {
  current_streak: number;
  hours_remaining: number;
}) => { /* Alerte urgente */ });

// Succès débloqué
socket.on('achievement:unlocked', (data: {
  achievement_id: string;
  name: string;
  icon_emoji: string;
  xp_reward: number;
}) => { /* Animation succès */ });

// Mise à jour XP (après validation leçon)
socket.on('xp:update', (data: {
  xp_earned: number;
  new_total: number;
  new_weekly: number;
  level_up?: boolean;
  new_hsk_level?: number;
}) => { /* Animation XP */ });
```

### Events client → serveur

```typescript
// Rejoindre une session chat IA
socket.emit('ai:join_session', { session_id: 'uuid' });

// Envoyer un message IA
socket.emit('ai:send_message', {
  session_id: 'uuid',
  message: 'string',
  teacher: 'mei_mei',
});

// Heartbeat présence (toutes les 30s)
socket.emit('presence:heartbeat', { user_id: 'uuid' });

// Marquer notification comme lue
socket.emit('notification:read', { notification_id: 'uuid' });
```

---

## Codes d'erreur globaux

| Code HTTP | Code Erreur | Description |
|---|---|---|
| 400 | VALIDATION_ERROR | Données invalides (détails dans `error.details`) |
| 401 | UNAUTHORIZED | Token manquant ou invalide |
| 401 | TOKEN_EXPIRED | Access token expiré |
| 403 | FORBIDDEN | Accès refusé (rôle insuffisant) |
| 403 | PREMIUM_REQUIRED | Fonctionnalité réservée aux abonnés |
| 403 | ACCOUNT_BANNED | Compte suspendu |
| 404 | NOT_FOUND | Ressource introuvable |
| 409 | CONFLICT | Ressource déjà existante |
| 410 | GONE | Token/lien expiré |
| 422 | UNPROCESSABLE | Données valides mais logique métier impossible |
| 429 | RATE_LIMIT_EXCEEDED | Trop de requêtes |
| 500 | INTERNAL_ERROR | Erreur serveur (loggé, alerte Sentry) |
| 503 | SERVICE_UNAVAILABLE | OpenAI ou Azure indisponible (fallback activé) |

---

## Middleware et sécurité

```typescript
// Pipeline des middlewares NestJS (ordre d'exécution)
1. Helmet (headers sécurité HTTP)
2. CORS (whitelist: mandago.app, localhost)
3. Rate Limiting (Redis)
4. Request Logger (avec trace_id)
5. JWT Guard (routes protégées)
6. Premium Guard (routes premium)
7. Request Validation (class-validator)
8. Business Logic (Controllers/Services)
9. Response Transformer
10. Error Handler (Global Exception Filter)
```

---

## Variables d'environnement requises

```bash
# App
NODE_ENV=production
PORT=3000
API_URL=https://api.mandago.app

# JWT
JWT_PRIVATE_KEY=<RS256 private key>
JWT_PUBLIC_KEY=<RS256 public key>
JWT_ACCESS_EXPIRY=15m
JWT_REFRESH_EXPIRY=30d

# PostgreSQL
DATABASE_URL=postgresql://user:pass@host:5432/mandago
DATABASE_POOL_MIN=5
DATABASE_POOL_MAX=20

# Redis
REDIS_URL=redis://host:6379
REDIS_CLUSTER_MODE=true

# OpenAI
OPENAI_API_KEY=sk-...
OPENAI_ORG_ID=org-...
OPENAI_DEFAULT_MODEL=gpt-4o
OPENAI_MINI_MODEL=gpt-4o-mini

# Azure Speech
AZURE_SPEECH_KEY=...
AZURE_SPEECH_REGION=westeurope

# AWS
AWS_REGION=eu-west-1
AWS_S3_BUCKET=mandago-audio
AWS_ACCESS_KEY_ID=...
AWS_SECRET_ACCESS_KEY=...

# Stripe
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...

# APM
SENTRY_DSN=https://xxx@sentry.io/xxx
LANGFUSE_PUBLIC_KEY=...
LANGFUSE_SECRET_KEY=...
```
