# 08 - Intelligence Artificielle - Manda Go

## Vue d'ensemble

L'intelligence artificielle est au coeur de l'expérience Manda Go. Elle personnalise chaque session d'apprentissage, évalue la prononciation en temps réel, adapte la difficulté et génère du contenu contextualisé. Ce document décrit l'architecture complète du système IA.

---

## Stack IA

| Composant | Technologie | Usage |
|---|---|---|
| Conversations & corrections | OpenAI GPT-4o | MandaBot, feedback pédagogique, génération d'exercices |
| Reconnaissance vocale (batch) | OpenAI Whisper v3 | Transcription audio, évaluation prononciation |
| Synthèse vocale native | OpenAI TTS (tts-1-hd) | Voix du professeur, audio des leçons |
| Reconnaissance temps réel | Azure Cognitive Services Speech | Feedback vocal live, évaluation phonème par phonème |
| Évaluation des tons | Custom ML model (ToneScorerV2) | Scoring tonal mandarin (4 tons + ton neutre) |
| Embeddings sémantiques | OpenAI text-embedding-3-large | Similarité de contenu, recommandations |
| Modération contenu | OpenAI Moderation API | Filtrage des entrées utilisateur |

---

## 1. MandaBot - Le Professeur IA

### Architecture générale

```
Utilisateur
    │
    ▼
[NestJS API Gateway]
    │
    ├── [Context Builder] ──► PostgreSQL (profil, historique, faiblesses)
    │                    ──► Redis (session en cours)
    │
    ▼
[Prompt Assembler]
    │  - System prompt (personnalité choisie)
    │  - Contexte utilisateur injecté
    │  - Historique conversation (window: 20 messages)
    │  - Instructions pédagogiques dynamiques
    │
    ▼
[OpenAI GPT-4o]
    │
    ▼
[Response Parser]
    │  - Extraction correction
    │  - Extraction vocabulaire nouveau
    │  - Extraction niveau de difficulté détecté
    │
    ▼
[Stream SSE → Client]
```

### Contexte utilisateur injecté dans chaque requête

```typescript
interface UserContext {
  hsk_level: number;           // 1-6
  total_xp: number;
  current_streak: number;
  weak_tones: number[];        // ex: [2, 4] = ton montant et ton descendant
  weak_initials: string[];     // ex: ['zh', 'ch', 'sh']
  weak_finals: string[];       // ex: ['ü', 'ian']
  recent_vocabulary: string[]; // 20 derniers mots appris (hanzi)
  learning_goals: string[];    // ex: ['voyage', 'business', 'hsk3']
  preferred_style: 'visual' | 'auditory' | 'kinesthetic';
  session_count: number;
  last_error_types: string[];  // ex: ['tone_2_vs_3', 'measure_words']
  daily_goal_minutes: number;
  mother_tongue: string;       // pour anticiper les interférences linguistiques
}
```

### Personnalités disponibles

#### Liu Laoshi (严格的老师 - Stricte & rigoureuse)

Cible: apprenants qui préfèrent la discipline et la précision académique.

```
SYSTEM PROMPT - LIU LAOSHI:

Tu es Liu Laoshi (刘老师), professeure de mandarin stricte mais bienveillante.
Tu enseignes depuis 20 ans à l'Université de Pékin. Tu es exigeante mais juste.

RÈGLES ABSOLUES:
1. Corriger SYSTÉMATIQUEMENT chaque erreur de ton, grammaire ou vocabulaire.
2. Ne jamais laisser passer une faute sans explication pédagogique.
3. Utiliser l'approche structurée: présenter la règle → exemple correct → exemple incorrect → exercice de vérification.
4. Alterner 70% mandarin / 30% langue de l'apprenant selon son niveau.
5. Terminer chaque échange par une question de vérification ou un mini-exercice.

CONTEXTE APPRENANT:
- Niveau HSK: {hsk_level}
- Points faibles: tons {weak_tones}, initiales {weak_initials}
- Vocabulaire récent: {recent_vocabulary}
- Objectifs: {learning_goals}

FORMAT DE CORRECTION:
❌ Erreur: [ce que l'apprenant a dit]
✅ Correct: [la forme correcte en hanzi]
📖 Pinyin: [translittération avec tons marqués]
💡 Règle: [explication concise de la règle]
🔄 Pratique: [exercice immédiat]

PERSONNALITÉ:
- Parle de façon formelle et précise
- Utilise des proverbes chinois en contexte (avec traduction)
- Fait référence à la culture et l'histoire chinoises
- Exprime ta satisfaction quand l'apprenant progresse, mais reste sobre
- Utilise occasionnellement "非常好！" ou "继续努力！"

LIMITES:
- Ne jamais faire les exercices à la place de l'apprenant
- Ne pas simplifier excessivement les corrections
- Ne pas hésiter à répéter une explication plusieurs fois si nécessaire
```

#### Mei Mei (友好的朋友 - Amicale & encourageante)

Cible: débutants, apprenants découragés, enfants.

```
SYSTEM PROMPT - MEI MEI:

Tu es Mei Mei (美美), une étudiante chinoise de 22 ans qui aide ses amis à apprendre le mandarin.
Tu es enjouée, patiente, et tu adores la culture pop chinoise.

RÈGLES:
1. Encourager AVANT de corriger. Toujours commencer par ce qui était bien.
2. Utiliser un langage simple et des analogies avec la culture occidentale.
3. Gamifier les corrections: "Tu es à 2 fautes de maîtriser ce point !"
4. Partager des anecdotes personnelles fictives pour contextualiser.
5. Alterner 50% mandarin / 50% langue de l'apprenant selon le niveau.

CONTEXTE APPRENANT:
- Niveau HSK: {hsk_level}
- Streak actuel: {current_streak} jours
- Points faibles: {weak_tones}, {weak_initials}
- Objectifs: {learning_goals}

FORMAT DE RÉPONSE:
🎉 Super essai ! [ce qui était bien]
💬 Petite correction: [explication douce]
✨ La bonne version: [hanzi + pinyin + traduction]
🎮 Challenge: [mini-jeu ou exercice ludique]

PERSONNALITÉ:
- Utiliser des emojis régulièrement
- Faire des références à la musique C-pop, aux dramas, à la nourriture
- Célébrer chaque petite victoire
- Utiliser un humour léger et des blagues simples
- Partager des "fun facts" culturels
- "加油！你可以的！" = sa phrase signature

INTERDICTIONS:
- Ne jamais décourager
- Ne jamais utiliser un jargon linguistique complexe sans l'expliquer
- Ne jamais sauter une correction même si elle est délicate
```

#### Master Chen (游戏化大师 - Gamifiée & compétitive)

Cible: apprenants motivés par les challenges et la compétition.

```
SYSTEM PROMPT - MASTER CHEN:

Tu es Master Chen (陈大师), un maître des arts martiaux qui enseigne le mandarin comme un art de combat.
Chaque leçon est un duel, chaque erreur est une occasion de devenir plus fort.

RÈGLES:
1. Transformer chaque exercice en mission ou défi avec des points.
2. Utiliser la métaphore des niveaux d'arts martiaux (élève → disciple → maître).
3. Créer un sentiment d'urgence et de compétition saine.
4. Utiliser un système de "combos": réponses correctes consécutives = bonus XP narratif.
5. Alterner 60% mandarin / 40% langue de l'apprenant selon le niveau.

CONTEXTE APPRENANT:
- Niveau HSK: {hsk_level} (= rang dans le dojo)
- XP total: {total_xp} (= puissance du guerrier)
- Streak: {current_streak} (= jours d'entraînement consécutifs)
- Faiblesses: tons {weak_tones} (= les techniques à maîtriser)

FORMAT DE RÉPONSE:
⚔️ Mission: [description du challenge]
🏆 XP en jeu: [points narratifs]
📜 Technique: [enseignement linguistique]
💥 Ton score: [évaluation de la réponse]
🔥 Prochain niveau: [ce qu'il faut maîtriser]

PERSONNALITÉ:
- Parler comme un sensei: sage, direct, inspirant
- Utiliser des métaphores guerrières pour la grammaire
- Créer des arcs narratifs sur plusieurs sessions
- Références aux récits épiques chinois (三国演义, 西游记)
- Célébrer les "combos" et les "streaks"
- Phrase signature: "Un guerrier ne cède pas face à la difficulté！"
```

### Window de contexte et mémoire

```typescript
// Gestion de la fenêtre de contexte (max 128k tokens GPT-4o)
interface ConversationMemory {
  // Mémoire courte: messages récents
  short_term: Message[];        // 20 derniers messages (~4000 tokens)

  // Mémoire longue: résumé compressé des sessions précédentes
  long_term_summary: string;    // Résumé GPT-3.5 des 10 sessions passées (~500 tokens)

  // Points clés persistants
  key_learnings: string[];      // Ce que l'utilisateur a appris et maîtrisé
  persistent_errors: string[];  // Erreurs récurrentes non résolues

  // Métadonnées
  session_id: string;
  created_at: Date;
  last_activity: Date;
  total_tokens_used: number;
}

// Compression automatique quand > 15k tokens
async function compressMemory(memory: ConversationMemory): Promise<string> {
  // Résumé via GPT-3.5-turbo (économie de coût)
  // Préserve: erreurs clés, vocabulaire appris, points de progression
}
```

---

## 2. Système d'évaluation de la prononciation

### Pipeline complet

```
Microphone utilisateur
        │
        ▼ (WebRTC / React Native Audio)
[Capture audio: WAV 16kHz mono, 16-bit PCM]
        │
        ▼
[Validation: durée 0.5s-10s, niveau sonore > -40dB]
        │
     ┌──┴──────────────────────────────────────┐
     │                                         │
     ▼                                         ▼
[Whisper v3]                      [Azure Cognitive Services]
 - Transcription texte             - Phonème par phonème
 - Détection langue                - Score de prononciation natif
 - Timestamps par mot              - Analyse prosodique
     │                                         │
     └──────────────┬──────────────────────────┘
                    │
                    ▼
         [ToneScorerV2 ML Model]
          - Input: spectrogramme mel + transcription
          - Output: score par ton (0-100 chacun)
          - Latence: < 150ms (modèle ONNX optimisé)
                    │
                    ▼
         [Phonetic Analyzer]
          - Comparaison avec prononciation native (TTS reference)
          - Calcul DTW (Dynamic Time Warping) sur formants F1/F2
          - Analyse des erreurs initiales/finales
                    │
                    ▼
         [Score Aggregator]
          - Calcul score global 0-100
          - Génération feedback structuré
          - Sauvegarde en DB + Redis cache
                    │
                    ▼
         [Response Builder]
          → Score global + sous-scores
          → Feedback audio (TTS sur correction)
          → Visualisation spectrogramme
          → Recommandations d'exercices ciblés
```

### Métriques d'évaluation

```typescript
interface PronunciationScore {
  // Score global
  overall: number;              // 0-100

  // Sous-scores
  tonal_accuracy: number;       // Précision des 4 tons + ton neutre (0-100)
  phonemic_clarity: number;     // Clarté des initiales et finales (0-100)
  rhythm: number;               // Rythme et découpage syllabique (0-100)
  intonation: number;           // Courbe intonative de la phrase (0-100)
  fluency: number;              // Fluidité, absence d'hésitations (0-100)

  // Détail par syllabe
  syllable_breakdown: Array<{
    syllable: string;           // ex: "nǐ"
    expected_pinyin: string;    // ex: "ni3"
    detected_pinyin: string;    // ex: "ni2" (erreur ton)
    tone_score: number;         // 0-100
    initial_score: number;      // 0-100
    final_score: number;        // 0-100
    error_type: ToneError | InitialError | FinalError | null;
  }>;

  // Feedback texte
  feedback: {
    positive: string;           // Ce qui était bien
    improvement: string;        // Principal point à améliorer
    tip: string;                // Conseil pratique
    native_comparison: string;  // URL audio référence
  };

  // Métadonnées
  audio_url: string;
  processing_time_ms: number;
  model_version: string;
}

enum ToneError {
  TONE1_AS_TONE2 = 'flat_as_rising',
  TONE2_AS_TONE3 = 'rising_as_dipping',
  TONE3_AS_TONE4 = 'dipping_as_falling',
  TONE4_AS_TONE1 = 'falling_as_flat',
  NEUTRAL_MISSED = 'neutral_tone_missed',
}
```

### ToneScorerV2 - Architecture du modèle custom

```
Architecture: CNN + BiLSTM + Attention
Entrée: spectrogramme mel 128 bandes, fenêtre 25ms, hop 10ms
Sortie: vecteur de probabilités [ton1, ton2, ton3, ton4, neutre] par syllabe

Dataset d'entraînement:
  - 50 000 locuteurs natifs (AISHELL-3)
  - 15 000 apprenants non-natifs annotés (Common Voice ZH)
  - 8 000 exemples d'erreurs classifiées par linguistes

Métriques:
  - Accuracy tons: 94.2% (natifs), 87.6% (apprenants)
  - F1-score global: 0.912
  - Latence inférence: 47ms (ONNX, CPU), 12ms (GPU)

Déploiement:
  - Format: ONNX Runtime
  - Hébergement: AWS Lambda (CPU) + ECS Fargate (GPU pour batch)
  - Versioning: MLflow
  - Monitoring: evidently.ai (drift detection)
```

---

## 3. Parcours adaptatif IA

### Algorithme de détection des faiblesses

```typescript
interface WeaknessDetector {
  // Analyse toutes les tentatives des 30 derniers jours
  analyzePatterns(userId: string): Promise<WeaknessProfile>;
}

interface WeaknessProfile {
  // Catégories de faiblesses avec score de confiance
  tones: Array<{ tone: number; error_rate: number; confidence: number }>;
  initials: Array<{ initial: string; error_rate: number; examples: string[] }>;
  finals: Array<{ final: string; error_rate: number; examples: string[] }>;
  grammar_patterns: Array<{ pattern: string; error_rate: number }>;
  vocabulary_gaps: Array<{ hsk_level: number; gap_percentage: number }>;

  // Score global de progression
  progression_velocity: number;   // XP/jour sur 7 jours glissants
  retention_score: number;        // % vocabulaire retenu sur 30 jours

  // Recommandations générées
  priority_topics: string[];      // Top 5 sujets à travailler
  suggested_daily_plan: DayPlan;
}
```

### Courbe d'oubli de Ebbinghaus - Implémentation SRS

```typescript
// Algorithme SM-2 modifié pour le mandarin
interface SRSCard {
  vocab_id: number;
  user_id: number;

  // Paramètres SRS
  ease_factor: number;        // Facteur de facilité (1.3 - 2.5), initial: 2.5
  interval_days: number;      // Intervalle actuel en jours
  repetitions: number;        // Nombre de révisions réussies consécutives
  next_review: Date;          // Prochaine révision planifiée

  // Historique
  last_score: number;         // Score de la dernière tentative (0-5)
  review_history: ReviewEntry[];
}

function calculateNextReview(card: SRSCard, score: number): SRSCard {
  // score: 0-1 = échec, 2 = difficile, 3 = correct, 4 = facile, 5 = très facile

  if (score < 3) {
    // Échec: recommencer depuis le début
    return { ...card, interval_days: 1, repetitions: 0 };
  }

  let new_ease = card.ease_factor + (0.1 - (5 - score) * (0.08 + (5 - score) * 0.02));
  new_ease = Math.max(1.3, new_ease); // Minimum 1.3

  let new_interval: number;
  if (card.repetitions === 0) {
    new_interval = 1;
  } else if (card.repetitions === 1) {
    new_interval = 6;
  } else {
    new_interval = Math.round(card.interval_days * new_ease);
  }

  // Bonus mandarin: mots avec tons difficiles = intervalle réduit de 20%
  if (card.has_difficult_tone) {
    new_interval = Math.round(new_interval * 0.8);
  }

  return {
    ...card,
    ease_factor: new_ease,
    interval_days: new_interval,
    repetitions: card.repetitions + 1,
    next_review: addDays(new Date(), new_interval),
  };
}
```

### Ajustement dynamique de la difficulté

```typescript
class AdaptiveDifficultyEngine {
  // Calcule le niveau optimal pour la prochaine leçon
  async getNextDifficulty(userId: string): Promise<DifficultyConfig> {
    const recentScores = await this.getRecentScores(userId, 10);
    const avgScore = mean(recentScores);

    // Zone proximale de développement (ZPD): cibler 70-80% de réussite
    if (avgScore > 85) {
      return this.increaseDifficulty(0.15);    // Trop facile: augmenter
    } else if (avgScore < 65) {
      return this.decreaseDifficulty(0.15);    // Trop difficile: réduire
    } else {
      return this.maintainDifficulty();         // Zone optimale
    }
  }
}

// Paramètres ajustables
interface DifficultyConfig {
  hsk_vocab_mix: { current: number; preview: number };   // % mots niveau actuel vs N+1
  sentence_complexity: 'simple' | 'compound' | 'complex';
  tone_density: number;         // % syllabes avec tons complexes
  grammar_patterns: string[];   // Structures grammaticales incluses
  exercise_types: ExerciseType[];
  time_pressure: boolean;       // Activer le chronomètre
}
```

---

## 4. Génération de contenu IA

### Dialogues contextuels

```
SYSTEM PROMPT - DIALOGUE GENERATOR:

Tu es un générateur de dialogues pédagogiques pour l'apprentissage du mandarin.

PARAMÈTRES D'ENTRÉE:
- Niveau HSK: {hsk_level}
- Thème: {theme}  (ex: "au restaurant", "transport", "travail")
- Vocabulaire cible: {target_vocabulary}  (liste de 5-10 mots à intégrer)
- Structures grammaticales: {grammar_points}
- Longueur: {turn_count} échanges (2-6)
- Contexte culturel: {cultural_context}

RÈGLES DE GÉNÉRATION:
1. 100% du vocabulaire cible doit apparaître naturellement
2. Aucun mot au-delà du niveau HSK {hsk_level + 1}
3. Chaque réplique: 1-3 phrases maximum
4. Inclure des marqueurs culturels authentiques
5. Varier les types de phrases (question, affirmation, exclamation)

FORMAT DE SORTIE (JSON):
{
  "title": "string",
  "context": "string (description de la scène)",
  "cultural_note": "string",
  "turns": [
    {
      "speaker": "A|B",
      "hanzi": "string",
      "pinyin": "string",
      "translation": "string",
      "grammar_note": "string|null",
      "vocabulary_highlight": ["string"]
    }
  ],
  "comprehension_questions": [
    { "question": "string", "answer": "string" }
  ]
}
```

### Génération d'exercices personnalisés

```
SYSTEM PROMPT - EXERCISE GENERATOR:

Tu crées des exercices de mandarin ultra-ciblés sur les faiblesses identifiées.

PROFIL APPRENANT:
- Niveau: {hsk_level}
- Faiblesses tones: {weak_tones}
- Faiblesses phonétiques: {weak_initials}, {weak_finals}
- Erreurs grammaticales récurrentes: {grammar_errors}
- Vocabulaire à réviser: {review_vocabulary}

TYPES D'EXERCICES DISPONIBLES:
1. FILL_BLANK: Compléter une phrase (réponse texte)
2. TONE_MARK: Ajouter les tons sur un pinyin donné
3. TRANSLATION_CN_FR: Traduire du chinois vers le français
4. TRANSLATION_FR_CN: Traduire du français vers le chinois (hanzi)
5. REORDER: Remettre les mots dans l'ordre
6. MULTIPLE_CHOICE: QCM (4 options)
7. DICTATION: Écouter et écrire en hanzi
8. TONE_PAIR: Distinguer deux tons similaires (2, 3)
9. MEASURE_WORD: Choisir le bon classificateur

CONTRAINTES:
- Exercice principal sur le point faible n°1 ({weak_tones[0]})
- 60% des exercices sur les faiblesses identifiées
- 40% sur du contenu récemment appris (consolidation)
- Inclure au moins un exercice de production libre

FORMAT JSON STRICT pour chaque exercice:
{
  "type": "ExerciseType",
  "instruction": "string",
  "question": "string|object",
  "correct_answer": "string|string[]",
  "distractors": ["string"],
  "hint": "string|null",
  "explanation": "string",
  "difficulty": 1-5,
  "xp_value": 5-20,
  "tags": ["string"],
  "cultural_context": "string|null"
}
```

### Histoires adaptées au niveau

```
SYSTEM PROMPT - STORY GENERATOR:

Tu écris des micro-nouvelles en mandarin adaptées au niveau de l'apprenant.

PARAMÈTRES:
- Niveau: HSK {hsk_level}
- Genre: {genre} (aventure / romance / mystère / sci-fi / historique)
- Longueur: {word_count} caractères chinois (150-500 selon niveau)
- Personnages: {characters} (optionnel)
- Vocabulaire imposé: {mandatory_vocab}

RÈGLES:
1. Vocabulaire 90% HSK <= {hsk_level}, 10% HSK {hsk_level + 1} (découverte)
2. Structures grammaticales: exclusivement HSK <= {hsk_level + 1}
3. Longueur de phrase: max 15 caractères/phrase pour HSK1-2, 25 pour HSK3-4, 35 pour HSK5-6
4. Inclure des éléments culturels authentiques
5. Arc narratif complet: situation initiale, complication, résolution

FORMAT DE SORTIE:
{
  "title": { "hanzi": "", "pinyin": "", "translation": "" },
  "paragraphs": [
    {
      "hanzi": "",
      "pinyin": "",
      "translation": "",
      "vocabulary_glossary": [{ "word": "", "meaning": "", "hsk_level": 0 }]
    }
  ],
  "comprehension_questions": [],
  "new_vocabulary": [],
  "cultural_notes": ""
}
```

---

## 5. Intégrations et infrastructure IA

### Gestion des coûts OpenAI

```typescript
class AIBudgetManager {
  // Limites par utilisateur/jour
  FREE_USER_DAILY_TOKENS = 10_000;
  PREMIUM_USER_DAILY_TOKENS = 100_000;

  // Modèles par priorité de coût
  getModelForTask(task: AITask, userTier: Tier): string {
    const modelMap = {
      [AITask.SIMPLE_CORRECTION]:   'gpt-4o-mini',    // Moins cher
      [AITask.CONVERSATION]:        'gpt-4o',          // Qualité max
      [AITask.EXERCISE_GENERATION]: 'gpt-4o-mini',
      [AITask.STORY_GENERATION]:    'gpt-4o',
      [AITask.TRANSLATION]:         'gpt-4o-mini',
    };

    // Dégrader vers mini si budget presque épuisé
    if (this.isNearDailyLimit(userTier)) {
      return 'gpt-4o-mini';
    }

    return modelMap[task];
  }

  // Streaming pour réduire la latence perçue
  async streamResponse(prompt: string): Promise<AsyncGenerator<string>> {
    // SSE vers le client dès le 1er token
  }
}
```

### Cache intelligent

```typescript
// Mise en cache des réponses IA similaires (Redis)
class AIResponseCache {
  async getOrGenerate(
    promptHash: string,
    generateFn: () => Promise<string>,
    ttl: number = 3600
  ): Promise<string> {
    const cached = await redis.get(`ai:${promptHash}`);
    if (cached) return cached;

    const response = await generateFn();
    await redis.setex(`ai:${promptHash}`, ttl, response);
    return response;
  }

  // Exercices pré-générés en batch (cron job nocturne)
  async prewarmExerciseCache(hsk_level: number): Promise<void> {
    // Génère 50 exercices par niveau/type pour réponse instantanée
  }
}
```

### Monitoring et observabilité IA

```typescript
// Tracking de chaque appel IA (Langfuse ou Helicone)
interface AICallMetrics {
  trace_id: string;
  user_id: string;
  task_type: AITask;
  model: string;
  prompt_tokens: number;
  completion_tokens: number;
  latency_ms: number;
  cost_usd: number;
  quality_score?: number;     // Noté par l'utilisateur (thumbs up/down)
  error?: string;
  timestamp: Date;
}

// Alertes automatiques
const ALERTS = {
  HIGH_LATENCY:    5000,      // ms - alerte si > 5s
  HIGH_COST_DAILY: 100,       // USD - alerte si > 100$/jour
  ERROR_RATE:      0.05,      // 5% - alerte si taux d'erreur > 5%
  DRIFT_SCORE:     0.15,      // ToneScorerV2 - alerte si drift > 15%
};
```

---

## 6. Sécurité et éthique IA

- **Modération des entrées**: Toutes les saisies utilisateur passent par OpenAI Moderation API avant traitement.
- **Pas de données biométriques stockées**: Les fichiers audio sont supprimés de S3 après analyse (TTL: 24h).
- **Consentement explicite**: L'utilisateur doit accepter l'enregistrement vocal à chaque session.
- **Transparence**: L'utilisateur sait toujours qu'il parle à une IA (MandaBot se présente comme tel).
- **RGPD**: Droit à l'oubli - suppression totale des données IA sur demande (cascade DB + S3 + MLflow logs).
- **Biais de prononciation**: Le modèle ToneScorerV2 est entraîné sur des locuteurs de 40+ nationalités pour éviter les biais liés à la langue maternelle.
