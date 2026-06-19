# 05 — Fonctionnalités Principales Manda Go

---

## 5.1 Système de Leçons HSK 1-9

### Structure Globale du Contenu

| Niveau | Caractères | Mots | Leçons | Durée estimée |
|--------|-----------|------|--------|---------------|
| HSK 1 | 174 | 150 | 30 | 1-2 mois |
| HSK 2 | 347 | 300 | 45 | 2-3 mois |
| HSK 3 | 617 | 600 | 60 | 3-4 mois |
| HSK 4 | 1 064 | 1 200 | 80 | 4-6 mois |
| HSK 5 | 1 685 | 2 500 | 100 | 6-9 mois |
| HSK 6 | 2 663 | 5 000 | 120 | 9-12 mois |
| HSK 7 | 5 000+ | 8 000+ | 80 | 12-18 mois |
| HSK 8 | 6 000+ | 12 000+ | 60 | 18-24 mois |
| HSK 9 | 11 092 | 25 000+ | 50 | 24-36 mois |

**Total : 625 leçons progressives**

### Structure d'une Leçon Type (7 phases)

```
┌────────────────────────────────────────────────────────────────┐
│  Phase 1 — Introduction (1-2 min)                              │
│  Objectifs de la leçon, aperçu du vocabulaire                 │
│  Mise en contexte culturelle ou dialoguée                      │
├────────────────────────────────────────────────────────────────┤
│  Phase 2 — Présentation Vocabulaire (3-5 min)                  │
│  Flashcards animées avec: hanzi + pinyin + audio natif        │
│  Illustration visuelle du concept                              │
│  Exemple en phrase contextualisée                              │
├────────────────────────────────────────────────────────────────┤
│  Phase 3 — Prononciation (2-3 min)                             │
│  Écoute + répétition guidée                                   │
│  Analyse des tons en temps réel                               │
│  Score de précision + feedback                                │
├────────────────────────────────────────────────────────────────┤
│  Phase 4 — Exercices Pratiques (5-8 min)                       │
│  QCM, association, complétion, réorganisation                 │
│  Difficulté progressive au sein de la leçon                   │
├────────────────────────────────────────────────────────────────┤
│  Phase 5 — Écriture des Caractères (2-4 min, si activée)       │
│  Tracé stroke-by-stroke guidé                                 │
│  Détection IA de la forme des traits                          │
├────────────────────────────────────────────────────────────────┤
│  Phase 6 — Dialogue Pratique (2-3 min)                         │
│  Mini-dialogue avec MandaBot sur le thème de la leçon         │
│  Utilisation des mots appris en contexte réel                 │
├────────────────────────────────────────────────────────────────┤
│  Phase 7 — Révision & Résumé (1-2 min)                         │
│  Récapitulatif des points appris                              │
│  Planification SRS pour la prochaine révision                 │
│  Attribution XP + badge si premier passage                    │
└────────────────────────────────────────────────────────────────┘
```

### Types d'Exercices par Compétence

#### Vocabulaire

**1. Flashcard SRS (Spaced Repetition)**
- Affichage: hanzi → l'utilisateur se souvient → retourne la carte → note sa mémoire (1-4)
- Algorithme SM-2 amélioré avec ajustement par niveau de confiance
- Score 1 (oublié) → revu dans 1h
- Score 2 (difficile) → revu demain
- Score 3 (correct) → revu dans 3 jours
- Score 4 (facile) → revu dans 7+ jours

**2. Reconnaissance Multiple Choice**
- Hanzi affiché, 4 traductions proposées
- Temps limite optionnel (15 secondes en mode challenge)
- Variante inverse: traduction → choisir le bon hanzi

**3. Matching Pairs**
- 8 paires hanzi-traduction à associer par glisser-déposer
- Timer décompte, score basé sur précision + vitesse

**4. Remplissage de Lacune (Fill-in)**
- Phrase avec un ou plusieurs mots manquants
- Banque de mots fournie ou frappe libre

#### Grammaire

**5. Pattern Drilling**
- Structure grammaticale présentée
- 5-8 exemples à compléter en variant le contexte
- Ex: "Sujet + 想 + Verbe" → "我 ___ 去中国"

**6. Construction de Phrase**
- Mots désordonnés à réorganiser par glisser-déposer
- Niveau avancé: frappe libre avec correction IA

**7. Transformation de Structure**
- "Convertis cette phrase affirmatif → négatif"
- "Mets cette phrase au futur avec 要"

#### Écriture

**8. Tracé Stroke-by-Stroke**
- Canvas tactile haute précision (120 Hz)
- Guide animé du tracé correct (8 règles de tracé appliquées)
- Détection IA de: forme du trait, ordre, direction, proportion
- Score 0-100 par trait, score global du caractère

**9. Tracé Libre Évalué**
- Écrire le caractère sans guide
- IA évalue la ressemblance avec le standard
- Feedback visuel sur les zones à améliorer

**10. Dictée d'Écriture**
- Audio en mandarin → écrire le caractère
- Intègre reconnaissance vocale + écriture

#### Lecture

**11. Texte Progressif avec Annotation**
- Textes courts (HSK 1-2) → articles (HSK 4-6) → articles complexes (HSK 7-9)
- Tap sur un caractère → définition + pinyin + audio
- Mode: avec pinyin / sans pinyin / texte pur

**12. Lecture QCM**
- Texte + 5 questions de compréhension
- Questions: détail factuel, inférence, vocabulaire en contexte

**13. Résumé de Texte**
- HSK 5-9: écrire un résumé de 50-100 mots
- Correction IA avec feedback détaillé

#### Compréhension Orale

**14. Dictée Simple**
- Audio de 1-3 secondes → écrire/sélectionner ce qu'on entend
- Vitesses: normale / lente / rapide

**15. Dialogue avec Questions**
- Conversation entre 2 personnages (30-60 sec)
- 3-5 questions de compréhension

**16. Appariement Audio-Image**
- Entendre 4 phrases → associer à 4 images

---

## 5.2 Système SRS Avancé (Spaced Repetition)

### Algorithme SM-2 Amélioré

```dart
class MandaSRS {
  /// Calcule le prochain intervalle de révision
  static SRSResult calculateNextReview({
    required int currentInterval,   // Jours depuis dernière révision
    required double easeFactor,     // Facteur de facilité (1.3 - 2.5)
    required int quality,           // Qualité de réponse (0-4)
    required int consecutiveCorrect,
    required double toneScore,      // Bonus pour précision tonale
  }) {
    double newEaseFactor = easeFactor + (0.1 - (4 - quality) * (0.08 + (4 - quality) * 0.02));
    newEaseFactor = newEaseFactor.clamp(1.3, 2.5);

    int newInterval;
    if (quality < 2) {
      newInterval = 1; // Révision demain
    } else if (consecutiveCorrect == 0) {
      newInterval = 1;
    } else if (consecutiveCorrect == 1) {
      newInterval = 6;
    } else {
      newInterval = (currentInterval * newEaseFactor).round();
    }

    // Bonus prononciation : allonge l'intervalle si ton bien maîtrisé
    if (toneScore > 0.9) {
      newInterval = (newInterval * 1.15).round();
    }

    return SRSResult(
      nextInterval: newInterval,
      easeFactor: newEaseFactor,
      nextReviewDate: DateTime.now().add(Duration(days: newInterval)),
    );
  }
}
```

### Tableau de Bord SRS

```
Mon vocabulaire — 847 mots
┌───────────────────────────────────────────────────────┐
│  🔴 À réviser aujourd'hui    : 23 mots               │
│  🟡 Dus demain               : 47 mots               │
│  🟢 Bien maîtrisés           : 631 mots              │
│  🔵 Nouveaux (non vus)       : 146 mots              │
│                                                       │
│  Prochain pic de révisions   : Vendredi (89 mots)    │
└───────────────────────────────────────────────────────┘
```

---

## 5.3 Reconnaissance Vocale des Tons

### Les 5 Tons du Mandarin

| Ton | Symbole | Description | Exemple | Waveform |
|-----|---------|-------------|---------|----------|
| 1er ton | ā | Haut et plat | mā (maman) | ▔▔▔▔▔ |
| 2e ton | á | Montant | máo (chapeau) | ╱ |
| 3e ton | ǎ | Descend puis monte | mǎ (cheval) | ╲╱ |
| 4e ton | à | Descendant brusque | mà (gronder) | ╲ |
| Ton neutre | a | Court et léger | ma (particule) | ─ |

### Pipeline d'Analyse Vocale

```
Audio utilisateur (WAV 16kHz)
        │
        ▼
Prétraitement (débruitage, normalisation)
        │
        ▼
Azure Speech → Transcription phonétique
        │
        ▼
Extraction caractéristiques F0 (fréquence fondamentale)
        │
        ▼
Modèle ONNX custom (ToneNet) → Score par syllabe
        │
        ▼
Comparaison avec enregistrement référence natif
        │
        ▼
Score global (0-100) + Feedback par syllabe
        │
        ▼
Visualisation waveform + courbe mélodique colorée
```

### Interface de Prononciation

```
┌──────────────────────────────────────────────────────────┐
│  Prononcez : 你好 (nǐ hǎo)                               │
│                                                          │
│  ┌──────────────────────────────────────────────────┐   │
│  │  Référence natif                                 │   │
│  │  ~~~~~~~~~~~╲╱~~~╲╱~~~~~~~~~~~~~~~~             │   │
│  └──────────────────────────────────────────────────┘   │
│                                                          │
│  ┌──────────────────────────────────────────────────┐   │
│  │  Votre prononciation                             │   │
│  │  ─────────────╲╱──╲╱───────────────────         │   │
│  └──────────────────────────────────────────────────┘   │
│                                                          │
│  Score : 78/100  ⭐⭐⭐⭐                                 │
│                                                          │
│  nǐ : 85/100 ✅    hǎo : 71/100 ⚠️                     │
│                                                          │
│  💡 "Le 3e ton de 'hǎo' doit descendre plus bas        │
│      avant de remonter. Imaginez une vallée profonde."  │
│                                                          │
│  [🎤 Réessayer]         [▶ Passer]                      │
└──────────────────────────────────────────────────────────┘
```

---

## 5.4 MandaBot — Professeur IA

### Modes de Conversation

**Mode Chat Texte** :
- Interface type messagerie moderne
- Correction grammaticale automatique intégrée dans les réponses
- Bulles de message différenciées (utilisateur / MandaBot)
- Support caractères chinois + pinyin + traduction au tap

**Mode Chat Vocal** :
- Bouton microphone maintenu pour parler
- Transcription temps réel (Whisper)
- Réponse IA parlée (TTS OpenAI, voix "shimmer")
- Historique texte de la conversation vocale

**Mode Correction** :
- L'utilisateur écrit une phrase en mandarin
- MandaBot corrige et explique chaque erreur
- Propose 3 variantes du même sens à des niveaux différents

**Mode Génération** :
- "Génère un dialogue sur une situation au restaurant"
- MandaBot crée le dialogue, joue les deux rôles, puis l'utilisateur pratique

### Personnalités de MandaBot

| Persona | Nom | Style | Usage |
|---------|-----|-------|-------|
| Défaut | Master Chen | Formel, précis, pédagogique | Tous niveaux |
| Amical | Mei Mei | Décontracté, encourageant, humoristique | Débutants |
| Sévère | Liu Laoshi | Exigeant, drill, aucun écart toléré | Préparation HSK |
| Culturel | Dragon Sage | Riche en proverbes, histoires, culture | Passionnés culture |
| Business | Manager Wang | Vocabulaire formel, scénarios pro | Apprenants business |

### Limites par Niveau d'Abonnement

| Plan | Messages/jour | Vocal/jour | Mode |
|------|--------------|------------|------|
| Gratuit | 10 | 3 min | Texte seulement |
| Premium | Illimité | Illimité | Texte + Vocal |
