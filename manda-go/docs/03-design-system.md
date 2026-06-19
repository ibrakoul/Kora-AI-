# 03 — Design System Premium Manda Go

---

## 3.1 Concept Visuel — "Dragon Digital"

Manda Go fusionne l'esthétique du dragon chinois millénaire avec le design digital premium de la Silicon Valley. L'identité visuelle est construite sur trois piliers :

1. **Puissance** — Rouge vermillon dominant, formes dynamiques, animations fluides
2. **Sagesse** — Typographie précise, hiérarchie claire, espacement généreux
3. **Modernité** — Glassmorphism, gradients mesh, 3D légers, micro-animations

L'objectif est qu'un utilisateur reconnaisse Manda Go en 0,5 secondes, même sans voir le logo.

---

## 3.2 Palette de Couleurs

### Couleurs Primaires

| Nom | HEX | RGB | Usage |
|-----|-----|-----|-------|
| **Rouge Vermillon** | `#E8163C` | rgb(232, 22, 60) | CTA principaux, accent, streaks |
| **Noir Obsidienne** | `#0A0A0F` | rgb(10, 10, 15) | Fond dark mode, texte sur clair |
| **Blanc Jade** | `#F8F9FF` | rgb(248, 249, 255) | Fond light mode, cartes |
| **Or Impérial** | `#FFB800` | rgb(255, 184, 0) | Récompenses, premium, badges |

### Couleurs Secondaires

| Nom | HEX | Usage |
|-----|-----|-------|
| **Violet Électrique** | `#7C3AED` | Ligues, magie, IA |
| **Émeraude Mandarin** | `#10B981` | Succès, correct, progression |
| **Bleu Ciel de Pékin** | `#3B82F6` | Info, liens, eau |
| **Ambre Sable** | `#F59E0B` | Avertissements, XP |
| **Rose Cerisier** | `#EC4899` | Social, partage, amis |

### Couleurs Sémantiques

```dart
// Succès
success: Color(0xFF10B981),   // Émeraude
successLight: Color(0xFFD1FAE5),

// Erreur
error: Color(0xFFE8163C),     // Rouge Vermillon
errorLight: Color(0xFFFFE4E9),

// Avertissement
warning: Color(0xFFF59E0B),   // Ambre
warningLight: Color(0xFFFEF3C7),

// Information
info: Color(0xFF3B82F6),      // Bleu
infoLight: Color(0xFFDBEAFE),
```

### Gradients Signature

```dart
// Gradient Principal — Dragon Fire
LinearGradient(
  begin: Alignment.topLeft,
  end: Alignment.bottomRight,
  colors: [Color(0xFFE8163C), Color(0xFFFF6B35)],
)

// Gradient Premium — Imperial Gold
LinearGradient(
  begin: Alignment.topLeft,
  end: Alignment.bottomRight,
  colors: [Color(0xFFFFB800), Color(0xFFFF8C00)],
)

// Gradient IA — Violet Magic
LinearGradient(
  begin: Alignment.topLeft,
  end: Alignment.bottomRight,
  colors: [Color(0xFF7C3AED), Color(0xFF3B82F6)],
)

// Gradient Succès — Jade Victory
LinearGradient(
  begin: Alignment.topLeft,
  end: Alignment.bottomRight,
  colors: [Color(0xFF10B981), Color(0xFF059669)],
)

// Gradient Dark Background — Night Sky
LinearGradient(
  begin: Alignment.topCenter,
  end: Alignment.bottomCenter,
  colors: [Color(0xFF0A0A0F), Color(0xFF1A0A2E)],
)
```

### Dark Mode / Light Mode Tokens

```dart
class MandaColors {
  // Surfaces
  static Color surface(bool dark) =>
    dark ? const Color(0xFF0F0F1A) : const Color(0xFFF8F9FF);

  static Color surfaceVariant(bool dark) =>
    dark ? const Color(0xFF1A1A2E) : const Color(0xFFEEEFF8);

  static Color card(bool dark) =>
    dark ? const Color(0xFF16213E) : const Color(0xFFFFFFFF);

  // Text
  static Color textPrimary(bool dark) =>
    dark ? const Color(0xFFF8F9FF) : const Color(0xFF0A0A0F);

  static Color textSecondary(bool dark) =>
    dark ? const Color(0xFFB0B0C8) : const Color(0xFF6B6B8A);

  static Color textMuted(bool dark) =>
    dark ? const Color(0xFF6B6B8A) : const Color(0xFF9B9BB0);

  // Borders
  static Color border(bool dark) =>
    dark ? const Color(0xFF2A2A4A) : const Color(0xFFE0E0F0);
}
```

---

## 3.3 Typographie

### Familles de Polices

**Interface (Latin)** : Inter — Google Fonts
- Raisons : lisibilité exceptionnelle sur mobile, 900 weights, variable font
- Fallback : SF Pro (iOS), Roboto (Android)

**Caractères Chinois** : Noto Sans SC — Google Fonts
- Raisons : couverture complète CJK, harmonie avec Inter
- Variante simplifiée (SC) pour le mandarin continental

### Échelle Typographique

```dart
class MandaTypography {
  // Display — Titres principaux, splash screen
  static const displayLarge = TextStyle(
    fontFamily: 'Inter',
    fontSize: 57,
    fontWeight: FontWeight.w700,
    letterSpacing: -0.25,
    height: 1.12,
  );

  static const displayMedium = TextStyle(
    fontFamily: 'Inter',
    fontSize: 45,
    fontWeight: FontWeight.w700,
    letterSpacing: 0,
    height: 1.16,
  );

  // Headlines — Titres de sections
  static const headlineLarge = TextStyle(
    fontFamily: 'Inter',
    fontSize: 32,
    fontWeight: FontWeight.w700,
    letterSpacing: -0.5,
    height: 1.25,
  );

  static const headlineMedium = TextStyle(
    fontFamily: 'Inter',
    fontSize: 28,
    fontWeight: FontWeight.w600,
    letterSpacing: -0.3,
    height: 1.29,
  );

  static const headlineSmall = TextStyle(
    fontFamily: 'Inter',
    fontSize: 24,
    fontWeight: FontWeight.w600,
    letterSpacing: -0.2,
    height: 1.33,
  );

  // Body — Texte courant
  static const bodyLarge = TextStyle(
    fontFamily: 'Inter',
    fontSize: 16,
    fontWeight: FontWeight.w400,
    letterSpacing: 0.15,
    height: 1.5,
  );

  static const bodyMedium = TextStyle(
    fontFamily: 'Inter',
    fontSize: 14,
    fontWeight: FontWeight.w400,
    letterSpacing: 0.25,
    height: 1.43,
  );

  // Labels
  static const labelLarge = TextStyle(
    fontFamily: 'Inter',
    fontSize: 14,
    fontWeight: FontWeight.w600,
    letterSpacing: 0.1,
    height: 1.43,
  );

  // Caractères chinois
  static const hanziDisplay = TextStyle(
    fontFamily: 'NotoSansSC',
    fontSize: 48,
    fontWeight: FontWeight.w400,
    height: 1.2,
  );

  static const hanziLesson = TextStyle(
    fontFamily: 'NotoSansSC',
    fontSize: 32,
    fontWeight: FontWeight.w400,
    height: 1.3,
  );

  static const hanziCard = TextStyle(
    fontFamily: 'NotoSansSC',
    fontSize: 24,
    fontWeight: FontWeight.w400,
  );

  // Pinyin (latin avec tons)
  static const pinyin = TextStyle(
    fontFamily: 'Inter',
    fontSize: 18,
    fontWeight: FontWeight.w500,
    color: Color(0xFF7C3AED),
    letterSpacing: 0.5,
  );
}
```

---

## 3.4 Iconographie

### Système d'Icônes

- **Grille** : 24×24 dp (standard) / 20×20 dp (compact) / 32×32 dp (featured)
- **Trait** : 1.5 px (outlined), 2 px (filled pour actif)
- **Style** : Rounded corners, cohérence avec iOS SF Symbols et Material Icons 3
- **Format** : SVG exporté, converti flutter_svg

### Icônes Manda Go Spécifiques (Custom)

```
dragon_flame.svg          — Streak brûlant
tone_wave_1.svg           — Ton 1er (haut plat)
tone_wave_2.svg           — Ton 2e (montant)
tone_wave_3.svg           — Ton 3e (bas puis montant)
tone_wave_4.svg           — Ton 4e (descendant)
manda_coin.svg            — Monnaie virtuelle
hanzi_stroke.svg          — Tracé de caractère
brain_ai.svg              — IA / MandaBot
league_bronze.svg         — Ligue Bronze
league_silver.svg         — Ligue Argent
league_gold.svg           — Ligue Or
league_diamond.svg        — Ligue Diamant
league_dragon.svg         — Ligue Dragon
chest_jade.svg            — Coffre Jade
chest_gold.svg            — Coffre Or
chest_dragon.svg          — Coffre Dragon
```

---

## 3.5 Composants UI

### Boutons

```dart
// Bouton Primaire — Dragon Red
MandaButton.primary(
  label: 'Commencer la leçon',
  onPressed: () {},
  // Style:
  //   Background: #E8163C → gradient vers #FF6B35
  //   Border radius: 16px
  //   Padding: 16px vertical, 24px horizontal
  //   Text: Inter SemiBold 16px, blanc
  //   Shadow: 0 4px 20px rgba(232, 22, 60, 0.4)
  //   Press animation: scale 0.96 + haptic feedback
)

// Bouton Secondaire — Outline
MandaButton.secondary(
  label: 'Plus tard',
  onPressed: () {},
  // Style:
  //   Background: transparent
  //   Border: 1.5px #E8163C
  //   Text: Inter SemiBold 16px, #E8163C
)

// Bouton Ghost — Texte seul
MandaButton.ghost(
  label: 'Passer',
  onPressed: () {},
)

// Bouton Icon — Rond
MandaIconButton(
  icon: Icons.mic,
  onPressed: () {},
  // Cercle 56px, gradient violet pour IA
)
```

### Cards

```dart
// Card Standard — Glassmorphism
MandaCard(
  child: ...,
  // Background: rgba(255,255,255,0.08) dark / rgba(0,0,0,0.04) light
  // Blur: BackdropFilter sigma 10
  // Border: 1px rgba(255,255,255,0.15)
  // Border radius: 20px
  // Shadow: 0 8px 32px rgba(0,0,0,0.12)
)

// Card Leçon — Interactive
LessonCard(
  lesson: lesson,
  onTap: () {},
  // Progress bar en bas
  // Icône de sujet flottante
  // Tag HSK en badge
  // Animation hover avec elevation
)

// Card Statistique
StatCard(
  icon: Icons.local_fire_department,
  value: '15',
  label: 'Jours de suite',
  color: Colors.orange,
)
```

### Inputs

```dart
// Champ texte Manda Go
MandaTextField(
  label: 'Email',
  hint: 'ton@email.com',
  prefixIcon: Icons.email_outlined,
  // Border radius: 14px
  // Border: 1.5px couleur thème
  // Focus: border #E8163C + glow subtil
  // Error: border #E8163C + message en bas
  // Filled background: surface color
)

// Champ de recherche
MandaSearchField(
  placeholder: 'Chercher un caractère...',
  onChanged: (query) {},
  // Rounded pill shape
  // Icône recherche intégrée
  // Clear button quand rempli
)
```

### Barre de progression

```dart
// Progress Bar HSK
MandaProgressBar(
  value: 0.65,       // 65% complété
  color: Color(0xFFE8163C),
  backgroundColor: Color(0xFF2A2A4A),
  height: 8,
  borderRadius: 4,
  // Animation: Tween de 0 à value sur 600ms
)

// Progress Circle (pour leçons)
MandaProgressCircle(
  value: 0.75,
  size: 80,
  strokeWidth: 6,
  gradient: dragonFireGradient,
)

// XP Progress Bar (avec effet de brillance)
XpProgressBar(
  currentXP: 850,
  maxXP: 1000,
  level: 12,
)
```

### Badges & Tags

```dart
// Tag HSK
HskBadge(level: 2)
// → Fond #E8163C, "HSK 2" blanc, pill shape

// Badge Achievement
AchievementBadge(
  icon: '🔥',
  name: 'Semaine de feu',
  rarity: BadgeRarity.gold,
)

// Tag Streak
StreakBadge(days: 15)
// → Flamme animée + nombre de jours
```

---

## 3.6 Animations & Micro-interactions

### Principes d'Animation

```
Durée :
  Micro (boutons, toggles) : 100-150 ms
  Standard (transitions) : 200-300 ms
  Rich (célébrations, onboarding) : 400-800 ms
  Lottie (loading, success) : 1000-3000 ms

Courbes d'accélération :
  Entrée UI : Curves.easeOut
  Sortie UI : Curves.easeIn
  Transitions : Curves.easeInOutCubic
  Spring : SpringSimulation (mass: 1, stiffness: 100, damping: 15)
```

### Animations Clés

**Streak Flame** : Lottie animé, flamme qui grandit avec le nombre de jours

**XP Gain** : Particules dorées qui montent de l'action vers la barre XP

**Correct Answer** : Flash vert + confetti minimaliste + son de cloche

**Wrong Answer** : Shake horizontal (wiggle) + flash rouge + son doux

**Level Up** : Écran modal avec explosion de confettis + animation du nouveau niveau

**Ton Évaluation** : Courbe waveform qui se dessine en temps réel, code couleur (vert/orange/rouge)

**Carte flip** (flashcards) : Rotation 3D Y-axis sur 300ms

**Leçon complétée** : Étoiles qui tombent du haut, résumé qui monte, XP qui incrémente

**Chargement IA** : 3 points animés en rouge → violet (couleur IA)

**Onboarding transitions** : Page slide horizontale avec parallax sur l'illustration

---

## 3.7 Illustrations & 3D Légers

### Style Illustration

- **Rendu** : 3D low-poly stylisé / isométrique léger
- **Palette** : Couleurs vives mais cohérentes avec la palette Manda Go
- **Ombres** : Douces, longues, colorées (pas noires)
- **Personnages** : Style Gen Z, diversité représentée, expressions expressives
- **Décors** : Éléments chinois modernisés (dragon géométrique, temple pixel art, etc.)

### Illustrations Principales

```
mascot_dragon.png        — Dragon mascotte Manda Go (3D léger, rouge + or)
character_mandabot.png   — Avatar du professeur IA (robot sage + bonnet traditionnel)
illustration_onboarding_1.png — Personne utilisant app à Shanghai
illustration_onboarding_2.png — Conversation IA avec professeur dragon
illustration_onboarding_3.png — Gamification : ligues, trophées, confettis
illustration_lesson_complete.png — Célébration minimaliste
illustration_premium.png — Coffre ouvert avec features premium
illustration_empty_state.png — État vide avec petit dragon endormi
```

### Effets Visuels

```
Glassmorphism (cards):
  backdrop-filter: blur(10px)
  background: rgba(255,255,255,0.08)
  border: 1px solid rgba(255,255,255,0.15)

Neon Glow (éléments actifs):
  box-shadow: 0 0 20px rgba(232, 22, 60, 0.5)

Mesh Gradient (backgrounds):
  Gradient radial multipoints, couleurs douces
  Animation subtile de mouvement (5-10 secondes de cycle)

Noise Texture (overlay 2% opacity):
  Donne une texture tactile premium aux cards
```

---

## 3.8 Design Responsive

### Points de rupture

| Device | Width | Layout | Adaptations |
|--------|-------|--------|-------------|
| Petit mobile | 320-374 px | 1 colonne | Texte réduit 14px body |
| Mobile standard | 375-428 px | 1 colonne | Layout nominal |
| Grand mobile | 428-600 px | 1 colonne + | Bottom sheet max-height |
| Tablette portrait | 601-840 px | 2 colonnes | Split view leçons/contenu |
| Tablette paysage | 841-1200 px | 2-3 colonnes | Mode bureau adapté |
| iPad Pro | 1024-1366 px | 3 colonnes | Master-detail complet |

### Grille

```
Mobile : 4 colonnes, gutter 16px, marge 20px
Tablette : 8 colonnes, gutter 24px, marge 32px
```
