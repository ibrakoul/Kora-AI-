# 04 — Parcours d'Onboarding Manda Go

---

## 4.1 Philosophie de l'Onboarding

L'onboarding de Manda Go suit la règle des **3 Vs** :
- **Valeur immédiate** : L'utilisateur comprend en 30 secondes pourquoi Manda Go est différent
- **Viscéralité** : Chaque écran est une expérience visuelle mémorable
- **Vélocité** : Minimum de friction pour arriver à la première leçon

**KPIs cibles** :
- Taux de complétion onboarding : 85%
- Temps moyen : 4 minutes 30 secondes
- Taux de création de compte post-onboarding : 72%
- Taux de conversion Premium à J+3 : 18%

---

## 4.2 Flow Complet de l'Onboarding

```
┌─────────────────────────────────────────────────────────┐
│                  ONBOARDING FLOW                        │
│                                                         │
│  App Launch                                             │
│      │                                                  │
│      ▼                                                  │
│  [01] Splash Screen Animé (2 sec auto)                  │
│      │                                                  │
│      ▼                                                  │
│  [02] Welcome Screen (langue d'interface)               │
│      │                                                  │
│      ▼                                                  │
│  [03] Choix des Objectifs (multi-select)               │
│      │                                                  │
│      ▼                                                  │
│  [04] Niveau Actuel (5 options)                         │
│      │                                                  │
│      ▼                                                  │
│  [05] Temps Quotidien Disponible                        │
│      │                                                  │
│      ▼                                                  │
│  [06] Style d'Apprentissage                             │
│      │                                                  │
│      ▼                                                  │
│  [07] Test de Placement IA (15 questions adaptatives)   │
│      │                                                  │
│      ▼                                                  │
│  [08] Génération du Programme Personnalisé (animation)  │
│      │                                                  │
│      ▼                                                  │
│  [09] Compte / Connexion                                │
│      │                                                  │
│      ▼                                                  │
│  HOME — Première leçon                                  │
└─────────────────────────────────────────────────────────┘
```

---

## 4.3 Détail de Chaque Étape

---

### Étape 01 — Splash Screen Animé

**Durée** : 2 secondes (automatique, non skippable)

**Animation** :
1. Fond noir (#0A0A0F)
2. Dragon stylisé 3D apparaît depuis le centre (scale 0 → 1.2 → 1.0 avec spring)
3. Les flammes du dragon s'animent en Lottie (rouge → or)
4. Logo "Manda Go" apparaît en dessous (fade in + slide up)
5. Tagline : "学普通话" (Apprendre le Mandarin) apparaît en caractères chinois
6. Transition vers Écran 02 (fade out)

**Assets** :
- `lottie/dragon_intro.json` — Dragon animé 3D
- `fonts/NotoSansSC` — Pour les caractères chinois
- Son ambiant optionnel : gong chinois subtil

**Données collectées** : Aucune

---

### Étape 02 — Welcome Screen & Langue d'Interface

**Titre** : "Bienvenue sur Manda Go" (adapté automatiquement selon la langue OS)

**Contenu** :
- Illustration : Mascotte Dragon Manda Go avec geste de bienvenue
- Sous-titre : "La meilleure façon d'apprendre le mandarin"
- Sélecteur de langue d'interface (dropdown ou liste)

**Langues disponibles** :
🇫🇷 Français | 🇺🇸 English | 🇩🇪 Deutsch | 🇯🇵 日本語 | 🇪🇸 Español | 🇧🇷 Português | 🇸🇦 العربية | 🇰🇷 한국어

**Action** : Bouton "Commencer →" (CTA primaire rouge)

**Données collectées** : `interface_language`

---

### Étape 03 — Objectifs d'Apprentissage

**Titre** : "Pourquoi apprenez-vous le mandarin ?"
**Sous-titre** : "Choisissez un ou plusieurs objectifs"

**Options (sélection multiple, illustrées)** :

```
┌────────────────────────────────────────────────────────┐
│                                                        │
│  ✈️ Voyage & Tourisme    💼 Travail & Business         │
│  "Explorer la Chine"     "Opportunités pro"            │
│                                                        │
│  ❤️ Amour & Relations   🎭 Culture & Loisirs           │
│  "Parler avec famille"   "Séries, musique..."          │
│                                                        │
│  📜 Examen HSK          🧠 Défi Personnel              │
│  "Certification"         "Je relève le défi"           │
│                                                        │
│  🏫 Études              💡 Autre                       │
│  "Cours universitaires"                                │
│                                                        │
│                     ───────────────                    │
│            [ Suivant → ]  (actif si ≥1 sélection)     │
└────────────────────────────────────────────────────────┘
```

**Données collectées** : `learning_goals[]`

**Impact IA** : Les objectifs influencent :
- Les domaines lexicaux privilégiés (business vocab pour "Travail")
- Le style du MandaBot (formal vs casual)
- Les mini-jeux recommandés en priorité
- Les notifications push thématiques

---

### Étape 04 — Niveau Actuel

**Titre** : "Quel est votre niveau actuel en mandarin ?"

**Options** :

```
○  🌱 Zéro absolu
   "Je ne connais aucun mot"

○  🌿 Grand débutant
   "Je connais quelques mots isolés"

○  🌳 Débutant
   "Je peux me présenter, commandes basiques"

○  🌲 Intermédiaire
   "Conversations simples, environ 500 mots"

○  🎋 Avancé
   "Conversations courantes, 2000+ mots"
```

**Note** : "Pas sûr ? Faites le test de placement gratuit →" (lien vers Étape 07)

**Données collectées** : `self_assessed_level` (1-5)

---

### Étape 05 — Temps Quotidien Disponible

**Titre** : "Combien de temps pouvez-vous consacrer chaque jour ?"

**Options visuelles (selector circulaire)** :

```
  ⏰ 5 min     📚 10 min     🎯 15 min
  "Express"   "Régulier"   "Sérieux"

  🚀 20 min   ⭐ 30 min+
  "Intensif"  "Expert"
```

**Message sous sélection** :
- 5 min → "En 90 jours, vous connaîtrez 200 mots !"
- 10 min → "Niveau HSK 1 en 60 jours !"
- 15 min → "HSK 2 en 6 mois, c'est réaliste !"
- 20 min → "Conversation de base en 3 mois !"
- 30 min+ → "HSK 4 en 12 mois avec notre parcours intensif !"

**Données collectées** : `daily_goal_minutes`

---

### Étape 06 — Style d'Apprentissage

**Titre** : "Comment apprenez-vous le mieux ?"

**Options illustrées** :

```
┌──────────────────┐  ┌──────────────────┐  ┌──────────────────┐
│   👁️ Visuel      │  │   👂 Auditif      │  │   ✋ Kinésthésiq  │
│                  │  │                  │  │                  │
│ Images, couleurs │  │ Sons, prononc.   │  │ Écriture, tracé  │
│ Associations     │  │ Chansons         │  │ Répétitions      │
│ visuelles        │  │ Répétition orale │  │ Jeux interactifs │
└──────────────────┘  └──────────────────┘  └──────────────────┘
```

**Note** : L'utilisateur peut sélectionner plusieurs styles.

**Données collectées** : `learning_styles[]`

---

### Étape 07 — Test de Placement IA

**Titre** : "Trouvons votre niveau exact"
**Sous-titre** : "15 questions, 3-5 minutes — s'adapte en temps réel à vos réponses"

**Algorithme adaptatif** :
- Question 1 : Niveau HSK 1 basique (si réponse fausse → reste en HSK 1)
- Question 2 : Si réponse correcte → monte au niveau suivant
- Questions suivantes : S'ajustent selon performance (IRT — Item Response Theory)
- Questions 13-15 : Confirmation du niveau estimé

**Types de questions** :

```
Q1  — Vocabulaire : "永远" signifie ?
      A) Toujours  B) Jamais  C) Parfois  D) Déjà

Q5  — Ton : Quelle mélodie correspond à "mā" (1er ton) ?
      [Audio 4 options]

Q8  — Grammaire : Complétez "我___去超市" (futur proche)
      A) 要  B) 了  C) 过  D) 着

Q12 — Compréhension : Écoutez le dialogue et répondez
      [Audio 30 secondes]

Q15 — Production : Traduisez "Je voudrais réserver une table"
      [Zone de saisie libre + IA évalue]
```

**Animation pendant le test** :
- Barre de progression en haut (1/15 → 15/15)
- Indicateur de niveau estimé qui se met à jour à chaque réponse
- Feedback immédiat après chaque réponse (correct = flash vert, faux = explication)
- Pas de chronomètre (réduit l'anxiété)

**Données collectées** :
```json
{
  "placement_level": "HSK2",
  "precision_score": 0.68,
  "weak_areas": ["tons", "grammaire_ba"],
  "strong_areas": ["vocabulaire_base"],
  "recommended_path": "accelerated_hsk2"
}
```

---

### Étape 08 — Génération du Programme Personnalisé

**Titre** : "MandaBot crée votre parcours…"

**Animation** (4-6 secondes) :
1. Avatar MandaBot apparaît (professeur robot avec bonnet traditionnel)
2. Barres de progression se remplissent en séquence :
   - "Analyse de votre niveau…" → 100%
   - "Identification des priorités…" → 100%
   - "Optimisation du parcours…" → 100%
   - "Calibration des répétitions espacées…" → 100%
3. Résultat s'affiche :

```
┌─────────────────────────────────────────────────────────┐
│          🎯 Votre Programme Personnalisé                │
│                                                         │
│   Niveau détecté : HSK 2 (débutant avancé)             │
│   Objectif : HSK 3 en 5 mois                          │
│                                                         │
│   ┌─────────────────────────────────────────┐          │
│   │  📅 15 min/jour                         │          │
│   │  📚 3 leçons par semaine                │          │
│   │  🎮 2 sessions de jeux                  │          │
│   │  🎤 1 conversation IA par jour          │          │
│   └─────────────────────────────────────────┘          │
│                                                         │
│   Points forts à améliorer :                           │
│   • Tons 2e et 3e (72% de précision actuelle)          │
│   • Structure ba-sentence                              │
│                                                         │
│       [ Voir mon parcours complet → ]                  │
└─────────────────────────────────────────────────────────┘
```

**Données collectées** : Génération du `learning_path` JSON

---

### Étape 09 — Création de Compte / Connexion

**Titre** : "Sauvegardez votre progression"
**Sous-titre** : "Créez votre compte gratuit pour ne rien perdre"

**Options de connexion** :

```
┌─────────────────────────────────────────────────────────┐
│                                                         │
│  ┌─────────────────────────────────────────────────┐   │
│  │  🍎  Continuer avec Apple                       │   │
│  └─────────────────────────────────────────────────┘   │
│                                                         │
│  ┌─────────────────────────────────────────────────┐   │
│  │  🔵  Continuer avec Google                      │   │
│  └─────────────────────────────────────────────────┘   │
│                                                         │
│  ──────────────── ou ────────────────                  │
│                                                         │
│  📧 Email                                              │
│  [                                    ]                │
│                                                         │
│  🔒 Mot de passe                                       │
│  [                                    ]                │
│                                                         │
│  ┌─────────────────────────────────────────────────┐   │
│  │         Créer mon compte gratuit →              │   │
│  └─────────────────────────────────────────────────┘   │
│                                                         │
│  Déjà inscrit ? Connexion                              │
│                                                         │
│  ─────────────────────────────────────────────────     │
│  🔓 Option : Essayer sans compte (données locales)     │
└─────────────────────────────────────────────────────────┘
```

**Option "Sans compte"** : Les données sont stockées localement (Hive) et synchronisées si l'utilisateur crée un compte plus tard.

**Paywall doux** (affiché 3 secondes après création du compte) :
```
"Passez à Premium — 50% moins cher que la concurrence"
4,99 €/mois — Essai gratuit 7 jours — Annulable à tout moment
[Essayer Premium]  [Continuer gratuitement]
```

---

## 4.4 Logique IA de Personnalisation

### Algorithme de Génération du Parcours

```python
def generate_learning_path(user_data: dict) -> dict:
    """
    Génère un parcours personnalisé basé sur les données d'onboarding.
    
    Entrée:
    - interface_language: str
    - learning_goals: list[str]
    - self_assessed_level: int (1-5)
    - daily_goal_minutes: int
    - learning_styles: list[str]
    - placement_result: dict
    
    Sortie:
    - starting_hsk_level: int
    - weekly_lesson_count: int
    - priority_skills: list[str]
    - recommended_mini_games: list[str]
    - ai_personality: str
    - expected_milestones: dict
    """
    
    # Niveau de départ (fusion auto-évaluation + test placement)
    starting_level = max(
        self_assessed_level,
        placement_result['hsk_level']
    ) if placement_result['precision_score'] > 0.8 else placement_result['hsk_level']
    
    # Rythme selon temps disponible
    if daily_goal_minutes <= 5:
        lessons_per_week = 2
        review_sessions = 1
    elif daily_goal_minutes <= 15:
        lessons_per_week = 4
        review_sessions = 2
    elif daily_goal_minutes <= 20:
        lessons_per_week = 5
        review_sessions = 3
    else:
        lessons_per_week = 7
        review_sessions = 5
    
    # Priorités selon objectifs
    priority_skills = []
    if 'travel' in learning_goals:
        priority_skills += ['survival_vocab', 'tones', 'listening']
    if 'business' in learning_goals:
        priority_skills += ['formal_vocab', 'reading', 'writing_basic']
    if 'hsk_exam' in learning_goals:
        priority_skills += ['grammar', 'reading', 'writing_characters']
    
    # Style IA selon apprentissage
    ai_personality = {
        'visual': 'context_rich',     # Beaucoup d'exemples visuels
        'auditory': 'voice_focused',   # Prioriser la conversation orale
        'kinesthetic': 'game_heavy',   # Max de jeux interactifs
    }[learning_styles[0]] if learning_styles else 'balanced'
    
    return {
        'starting_hsk_level': starting_level,
        'weekly_lesson_count': lessons_per_week,
        'priority_skills': priority_skills[:5],
        'ai_personality': ai_personality,
        'mandabot_persona': 'mei_mei' if 'culture' in learning_goals else 'master_chen',
        'expected_hsk_target_months': calculate_target(starting_level, daily_goal_minutes),
    }
```

### Personnalités MandaBot selon objectif

| Objectif | Persona IA | Style |
|----------|------------|-------|
| Voyage | Mei Mei | Amicale, pratique, expressions quotidiennes |
| Business | Master Chen | Formel, précis, vocabulaire professionnel |
| Culture | Dragon Sage | Narratif, riche en culture, idiomes |
| HSK Exam | Liu Laoshi | Strict, grammatical, exercices types examen |
| Débutant absolu | Panda Petit | Ultra-patient, beaucoup d'encouragements |
