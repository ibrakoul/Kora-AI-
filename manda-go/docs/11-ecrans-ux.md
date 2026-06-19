# Manda Go — Documentation UX Complète des 18 Écrans

> Version 1.0 — Application mobile d'apprentissage du mandarin
> Plateforme : iOS & Android (React Native)
> Langue de rédaction : Français

---

## Table des matières

1. [Splash Screen](#1-splash-screen)
2. [Onboarding (7 sous-écrans)](#2-onboarding-1-à-7)
3. [Login / Register](#3-login--register)
4. [Home Dashboard](#4-home-dashboard)
5. [Journey Map](#5-journey-map)
6. [Active Lesson](#6-active-lesson)
7. [Vocabulary Exercise](#7-vocabulary-exercise)
8. [Pronunciation Exercise](#8-pronunciation-exercise)
9. [Writing Exercise](#9-writing-exercise)
10. [End of Lesson](#10-end-of-lesson)
11. [AI Teacher — MandaBot](#11-ai-teacher--mandabot)
12. [User Profile](#12-user-profile)
13. [Leaderboards / Leagues](#13-leaderboards--leagues)
14. [Mini-Games Hub](#14-mini-games-hub)
15. [Shop](#15-shop)
16. [Premium Subscription](#16-premium-subscription)
17. [Statistics](#17-statistics)
18. [Settings](#18-settings)

---

## 1. Splash Screen

### Description générale
Premier écran affiché au démarrage de l'application. Durée : 2,5 à 3 secondes. Rôle double : chargement des assets essentiels en arrière-plan et présentation de l'identité visuelle de la marque.

### Wireframe ASCII

```
┌─────────────────────────────────┐
│                                 │
│                                 │
│         ╔═══════════╗           │
│         ║  ~龍~     ║           │
│         ║  DRAGON   ║           │
│         ║ ANIMATION ║           │
│         ╚═══════════╝           │
│                                 │
│     ┌───────────────────┐       │
│     │   M A N D A  G O  │       │
│     └───────────────────┘       │
│                                 │
│        学 普 通 话 吧 !          │
│     (Apprenons le mandarin !)   │
│                                 │
│     ▓▓▓▓▓▓▓░░░░░░░░░░░         │
│          Chargement...          │
│                                 │
└─────────────────────────────────┘
```

### Composants UI
- **Dragon animé** : SVG ou Lottie, centré verticalement, couleur principale rouge #E53935 avec reflets dorés #FFD700
- **Logo Manda Go** : typographie personnalisée, gradient rouge → orange
- **Slogan** : texte mandarin + traduction française, apparition en fondu
- **Barre de chargement** : linéaire, couleur accent or, hauteur 4 dp
- **Fond** : dégradé vertical blanc #FFFFFF → rouge très clair #FFEBEE

### Animations
- **0 ms → 400 ms** : fond apparaît en fondu (opacity 0 → 1)
- **400 ms → 1200 ms** : dragon entre depuis le bas, courbe d'easing `spring(damping: 0.7)`, rotation de 0° → 360° sur lui-même
- **1200 ms → 1800 ms** : logo apparaît en scale 0.3 → 1.0, `easeOutBack`
- **1800 ms → 2200 ms** : slogan glisse vers le haut depuis opacity 0
- **2200 ms → 2800 ms** : barre de progression se remplit de gauche à droite
- **Dragon loop** : après apparition, boucle infinie de flottement vertical ±8 dp, période 2 s

### États
| État | Comportement |
|------|-------------|
| Normal | Animation complète → redirection automatique |
| Chargement lent | Barre de progression reste à 80 %, spinner apparaît après 5 s |
| Erreur réseau | Toast rouge en bas : "Connexion impossible. Mode hors-ligne activé." |
| Premier lancement | Redirige vers Onboarding 1 |
| Utilisateur connu | Redirige vers Home Dashboard |

### Navigation
- **Entrée** : Démarrage de l'app (aucune transition entrante)
- **Sortie** : Transition `crossFade` 300 ms vers Onboarding 1 ou Home Dashboard selon l'état de session

---

## 2. Onboarding 1 à 7

### Description générale
Flux de bienvenue présenté uniquement à la première ouverture. Chaque sous-écran présente une fonctionnalité clé. Navigation : swipe horizontal ou bouton "Suivant". Bouton "Passer" disponible dès l'écran 1.

---

### Onboarding 1 — Bienvenue dans Manda Go

#### Wireframe ASCII
```
┌─────────────────────────────────┐
│  [Passer]                  1/7  │
│                                 │
│   ╔═══════════════════════╗     │
│   ║                       ║     │
│   ║   ILLUSTRATION        ║     │
│   ║   Ville chinoise      ║     │
│   ║   animée              ║     │
│   ╚═══════════════════════╝     │
│                                 │
│   Bienvenue dans Manda Go !     │
│                                 │
│   Apprenez le mandarin de       │
│   façon ludique, rapide et      │
│   efficace. 15 min par jour     │
│   suffisent.                    │
│                                 │
│   ● ○ ○ ○ ○ ○ ○                 │
│                                 │
│   ┌─────────────────────────┐   │
│   │        Suivant →        │   │
│   └─────────────────────────┘   │
└─────────────────────────────────┘
```

#### Composants UI
- Illustration Lottie : ville chinoise animée (lanternes, buildings)
- Titre H1 bold
- Corps de texte 16 sp, couleur #424242
- Indicateurs de pagination (dots) : dot actif rouge, inactifs gris clair
- Bouton "Suivant" : fond rouge, texte blanc, border-radius 12 dp
- Bouton "Passer" : lien texte gris, coin supérieur gauche

#### Interactions
- Swipe gauche → écran suivant
- Swipe droit depuis écran 1 → aucun effet
- Tap "Passer" → navigation directe vers Login/Register avec confirmation facultative

---

### Onboarding 2 — Méthode d'apprentissage

#### Wireframe ASCII
```
┌─────────────────────────────────┐
│  [Passer]                  2/7  │
│                                 │
│   ┌──────────────────────────┐  │
│   │  Leçons gamifiées        │  │
│   │  Prononciation IA        │  │
│   │  Écriture guidée         │  │
│   │  Tuteur IA 24/7          │  │
│   └──────────────────────────┘  │
│                                 │
│   Une méthode complète          │
│                                 │
│   4 compétences couvertes :     │
│   lecture, écriture,            │
│   écoute, expression orale.     │
│                                 │
│   ○ ● ○ ○ ○ ○ ○                 │
│                                 │
│   ┌─────────────────────────┐   │
│   │        Suivant →        │   │
│   └─────────────────────────┘   │
└─────────────────────────────────┘
```

#### Composants UI
- Liste de 4 fonctionnalités avec icône + label
- Chaque item apparaît avec un délai décalé (stagger 150 ms)
- Fond des items : cartes blanches avec ombre légère

#### Interactions
- Swipe horizontal pour naviguer
- Chaque item de liste peut être tapé pour un micro-détail

---

### Onboarding 3 — Définir son objectif

#### Wireframe ASCII
```
┌─────────────────────────────────┐
│  [Passer]                  3/7  │
│                                 │
│   Quel est votre objectif ?     │
│                                 │
│   ┌──────────┐  ┌──────────┐    │
│   │ Voyages  │  │ Affaires │    │
│   │ (avion)  │  │ (valise) │    │
│   └──────────┘  └──────────┘    │
│                                 │
│   ┌──────────┐  ┌──────────┐    │
│   │ Culture  │  │  Examen  │    │
│   │ (masque) │  │ (carnet) │    │
│   └──────────┘  └──────────┘    │
│                                 │
│   ┌──────────────────────────┐  │
│   │  Curiosité personnelle   │  │
│   │         (étoile)         │  │
│   └──────────────────────────┘  │
│                                 │
│   ○ ○ ● ○ ○ ○ ○                 │
│                                 │
│   ┌─────────────────────────┐   │
│   │        Suivant →        │   │
│   └─────────────────────────┘   │
└─────────────────────────────────┘
```

#### Composants UI
- Grille 2x2 + 1 carte pleine largeur
- Sélection unique avec highlight rouge + coche blanche
- Bouton "Suivant" désactivé (grisé) jusqu'à sélection

#### Interactions
- Tap sur une carte → highlight immédiat, déselectionne la précédente
- "Suivant" actif uniquement après sélection
- État mémorisé si retour en arrière

---

### Onboarding 4 — Niveau actuel

#### Wireframe ASCII
```
┌─────────────────────────────────┐
│  [Passer]                  4/7  │
│                                 │
│   Quel est votre niveau ?       │
│                                 │
│   ◉ Débutant complet            │
│     Je ne connais rien encore   │
│                                 │
│   ○ Quelques bases              │
│     J'ai appris un peu avant    │
│                                 │
│   ○ Intermédiaire               │
│     Je peux tenir               │
│     une conversation simple     │
│                                 │
│   ○ Avancé                      │
│     Je lis les caractères       │
│                                 │
│   ○ ○ ○ ● ○ ○ ○                 │
│                                 │
│   ┌─────────────────────────┐   │
│   │        Suivant →        │   │
│   └─────────────────────────┘   │
└─────────────────────────────────┘
```

#### Composants UI
- Radio buttons stylisés (cercle rouge rempli = sélectionné)
- Description sous chaque option en texte secondaire #757575
- Animation de sélection : cercle se remplit (200 ms)

#### Interactions
- Tap n'importe où sur la ligne → sélectionne l'option
- "Suivant" immédiatement actif (option 1 présélectionnée par défaut)

---

### Onboarding 5 — Engagement quotidien

#### Wireframe ASCII
```
┌─────────────────────────────────┐
│  [Passer]                  5/7  │
│                                 │
│   Combien de temps par jour ?   │
│                                 │
│   ┌─────────────────────────┐   │
│   │ ◀─────────────────●───▶ │   │
│   │  5 min    15 min   30+  │   │
│   └─────────────────────────┘   │
│                                 │
│        15 minutes / jour        │
│                                 │
│   À ce rythme, vous maîtriserez │
│   300 mots en 30 jours !        │
│                                 │
│   Streak objectif :             │
│   ┌──┐ ┌──┐ ┌──┐ ┌──┐ ┌──┐     │
│   │ L│ │ M│ │ M│ │ J│ │ V│     │
│   └──┘ └──┘ └──┘ └──┘ └──┘     │
│                                 │
│   ○ ○ ○ ○ ● ○ ○                 │
│                                 │
│   ┌─────────────────────────┐   │
│   │        Suivant →        │   │
│   └─────────────────────────┘   │
└─────────────────────────────────┘
```

#### Composants UI
- Slider horizontal avec snap aux valeurs 5 / 10 / 15 / 20 / 30 min
- Texte dynamique montrant l'impact de la durée choisie (calcul temps réel)
- Jours de la semaine : 7 boutons toggle (L M M J V S D)

#### Interactions
- Drag slider → mise à jour texte en temps réel
- Toggle jours → sélection multiple possible (minimum 1 jour requis)

---

### Onboarding 6 — Résumé personnalisé

#### Wireframe ASCII
```
┌─────────────────────────────────┐
│  [Passer]                  6/7  │
│                                 │
│   Votre parcours est prêt !     │
│                                 │
│   ╔═════════════════════════╗   │
│   ║  Niveau : Débutant      ║   │
│   ║  15 min / jour          ║   │
│   ║  Objectif : Voyages     ║   │
│   ║  5 jours / semaine      ║   │
│   ╚═════════════════════════╝   │
│                                 │
│   Nous avons créé un parcours   │
│   sur mesure de 12 semaines.    │
│                                 │
│   480 leçons adaptées           │
│   Révisions intelligentes       │
│   Exercices personnalisés       │
│                                 │
│   ○ ○ ○ ○ ○ ● ○                 │
│                                 │
│   ┌─────────────────────────┐   │
│   │        Suivant →        │   │
│   └─────────────────────────┘   │
└─────────────────────────────────┘
```

#### Composants UI
- Carte récapitulatif avec bordure colorée
- Données injectées dynamiquement depuis les écrans précédents
- Liste de 3 bénéfices avec icônes de validation

#### Animations
- Carte apparaît avec animation de "déploiement" (scale + fade, 400 ms)
- Chaque bénéfice apparaît en stagger (200 ms)

---

### Onboarding 7 — Activation des notifications

#### Wireframe ASCII
```
┌─────────────────────────────────┐
│                            7/7  │
│                                 │
│   ╔═══════════════════════╗     │
│   ║  Illustration cloche  ║     │
│   ║  et rappel quotidien  ║     │
│   ╚═══════════════════════╝     │
│                                 │
│   Ne perdez jamais votre        │
│   streak !                      │
│                                 │
│   À quelle heure pratiquer ?    │
│   ┌─────────────────────────┐   │
│   │   ▲  19 h 00  ▲         │   │
│   │   ▼           ▼         │   │
│   └─────────────────────────┘   │
│                                 │
│   ● ● ● ● ● ● ●                 │
│                                 │
│   ┌─────────────────────────┐   │
│   │   Activer les rappels   │   │
│   └─────────────────────────┘   │
│   [Non merci, continuer]        │
└─────────────────────────────────┘
```

#### Composants UI
- Time picker scroll (roue iOS-style ou picker Android natif)
- CTA principal : "Activer les rappels" → déclenche permission système native
- Lien secondaire texte pour passer sans notifications
- Illustration Lottie cloche animée

#### Interactions
- Tap "Activer les rappels" → dialogue permission OS → si accepté : sauvegarde heure + création notification récurrente
- "Non merci" → continue vers Login/Register sans notification

### Animations globales Onboarding
- Transition entre écrans : swipe horizontal avec parallaxe (contenu défile à 80 % de la vitesse du fond)
- Dots de pagination : transition scale + opacity (dot actif scale 1.5x)
- Éléments de chaque écran : apparition en cascade (stagger 100 ms par composant)
- Retour arrière : swipe depuis le bord droit → écran précédent avec parallaxe inversé

### États globaux Onboarding
| État | Comportement |
|------|-------------|
| Navigation normale | Swipe ou boutons |
| Validation requise (écran 3) | Bouton "Suivant" grisé jusqu'à sélection |
| Dernier écran | Bouton "Suivant" devient "Commencer" |
| Sortie via "Passer" | Toutes les données collectées sont sauvegardées quand même |

### Navigation Onboarding
- **Entrée** : depuis Splash Screen (crossFade)
- **Inter-écrans** : swipe horizontal ou tap "Suivant"
- **"Passer"** : saute directement à l'écran de Login/Register
- **Sortie** : vers Login/Register après l'écran 7

---

## 3. Login / Register

### Description générale
Écran d'authentification combiné. Mode inscription et connexion sur la même vue avec basculement par onglets. Supporte OAuth (Google, Apple, WeChat) et email/mot de passe.

### Wireframe ASCII
```
┌─────────────────────────────────┐
│         ← Retour                │
│                                 │
│   ╔═══════════╗                 │
│   ║  LOGO MG  ║                 │
│   ╚═══════════╝                 │
│                                 │
│  ┌──────────┬──────────────┐    │
│  │ Connexion│ Inscription  │    │
│  └──────────┴──────────────┘    │
│                                 │
│  ┌──────────────────────────┐   │
│  │  Email                   │   │
│  └──────────────────────────┘   │
│  ┌──────────────────────────┐   │
│  │  Mot de passe       [oeil]│   │
│  └──────────────────────────┘   │
│                                 │
│              [Mot de passe      │
│               oublié ?]         │
│                                 │
│  ┌──────────────────────────┐   │
│  │     Se connecter         │   │
│  └──────────────────────────┘   │
│                                 │
│  ─────────── ou ──────────────  │
│                                 │
│  ┌────────┐ ┌────────┐ ┌──────┐ │
│  │ Google │ │ Apple  │ │  微信 │ │
│  └────────┘ └────────┘ └──────┘ │
│                                 │
│  Pas encore de compte ?         │
│  [Créer un compte gratuitement] │
└─────────────────────────────────┘
```

### Composants UI
- **Onglets** : "Connexion" / "Inscription", indicateur rouge coulissant en bas
- **Champs texte** : style outlined Material Design, label flottant
  - Email : icône enveloppe, validation format en temps réel
  - Mot de passe : icône cadenas, bouton oeil pour afficher/masquer
  - En mode inscription : champ "Prénom" + "Confirmer mot de passe"
- **Bouton principal** : rouge, pleine largeur, hauteur 52 dp, border-radius 12 dp
- **Séparateur "ou"** : ligne horizontale avec texte centré
- **Boutons OAuth** : cartes blanches avec bordure 1 dp, logo provider à gauche
  - Google : logo coloré
  - Apple : logo noir (ou blanc en dark mode)
  - WeChat : logo vert
- **Lien "Mot de passe oublié"** : texte rouge, aligné à droite

### États des champs
| État | Comportement visuel |
|------|---------------------|
| Vide | Placeholder visible, bordure grise #BDBDBD |
| Focus | Bordure rouge 2 dp, label flottant au-dessus |
| Valide | Bordure verte + icône coche |
| Invalide | Bordure rouge + message d'erreur inline rouge |
| Chargement | Champs désactivés (opacity 0.5) |

### États de l'écran
| État | Comportement |
|------|-------------|
| Normal | Formulaire interactif |
| Chargement | Overlay semi-transparent + spinner dans le bouton |
| Erreur identifiants | Animation shake du formulaire + toast rouge |
| Erreur réseau | Toast "Connexion impossible" + retry |
| Succès | Icône check animé dans le bouton → navigation |
| Compte inexistant | Message + lien vers inscription |

### Animations
- Bascule d'onglet : glissement du contenu + changement d'indicateur (200 ms, easeInOut)
- Apparition clavier : formulaire remonte automatiquement (KeyboardAvoidingView)
- Bouton loading : texte disparaît, spinner apparaît en scale 0 → 1 (200 ms)
- Erreur shake : translation X ±10 dp, 4 oscillations (400 ms total)
- Succès : bouton pulse vert → expansion plein écran → crossFade vers Home

### Navigation
- **Entrée** : depuis Onboarding 7 ou Splash (session expirée)
- **Sortie succès** : vers Home Dashboard (slide up)
- **"Mot de passe oublié"** : sheet modale depuis le bas (email + code OTP)
- **Retour** : vers Onboarding (si première session)

---

## 4. Home Dashboard

### Description générale
Hub central de l'application. Résume la progression, propose la leçon du jour, affiche la streak, et donne accès rapide aux principales sections. ScrollView vertical.

### Wireframe ASCII
```
┌─────────────────────────────────┐
│  Bonjour, Lucas !               │
│  ┌──────────────────────────┐   │
│  │ Streak : 14 jours        │   │
│  │ [flamme animée]          │   │
│  └──────────────────────────┘   │
│                                 │
│  ── LEÇON DU JOUR ─────────── │
│  ┌──────────────────────────┐   │
│  │  Chapitre 3 - Leçon 7   │   │
│  │  "Les transports"        │   │
│  │  ▓▓▓▓▓▓░░░░  60 %        │   │
│  │  ┌──────────────────┐    │   │
│  │  │  Commencer →     │    │   │
│  │  └──────────────────┘    │   │
│  └──────────────────────────┘   │
│                                 │
│  ── PROGRESSION ────────────── │
│  Vocabulaire  ▓▓▓▓▓░  420 mots  │
│  Grammaire    ▓▓▓░░░  58 %      │
│  Prononciation▓▓░░░░  35 %      │
│                                 │
│  ── CLASSEMENT ─────────────── │
│  Rang #12 dans votre ligue      │
│  [Voir le classement →]         │
│                                 │
│  ── ACCES RAPIDE ──────────── │
│  [MandaBot] [Jeux] [Boutique]   │
│                                 │
│  [Accueil] [Carte] [Jeux] [Bot] [Profil] │
└─────────────────────────────────┘
```

### Composants UI
- **Header** : "Bonjour, [prénom] !" + avatar circulaire (tap → profil)
- **Streak banner** : fond rouge dégradé, flamme Lottie animée en boucle, compteur de jours
- **Carte leçon du jour** :
  - Ombre portée `elevation: 4`
  - Coins arrondis 16 dp
  - Titre chapitre + leçon
  - Barre de progression avec pourcentage
  - Bouton CTA rouge pleine largeur
- **Section progression** :
  - 3 barres de progression horizontales (hauteur 8 dp)
  - Label compétence à gauche, valeur à droite
- **Teaser classement** : rang actuel + nom de la ligue + bouton lien
- **Accès rapide** : 3 boutons icône circulaires avec label
- **Barre de navigation inférieure** : 5 onglets avec icônes et labels

### États
| État | Comportement |
|------|-------------|
| Normal | Toutes les sections visibles, données chargées |
| Skeleton loading | Rectangles gris animés (shimmer) pour chaque section |
| Streak en danger | Flamme clignotante + bannière orange "Votre streak est en danger !" |
| Leçon déjà complétée | Bouton change en "Réviser" avec icône différente |
| Hors connexion | Badge "Hors-ligne" dans le header + sections locales uniquement |
| Nouvel utilisateur | Section leçon du jour propose "Leçon 1 - Introduction" |

### Animations
- Pull-to-refresh : dragon tourne en boucle pendant le rafraîchissement
- Streak flamme : animation Lottie en boucle, pulse sur le nombre de jours toutes les 3 s
- Barres de progression : remplissage animé à l'entrée de l'écran (600 ms, easeOut, stagger 200 ms)
- Notification nouveauté : badge rouge pulsant sur les onglets navbar

### Navigation
- **Entrée** : depuis Login, Splash, ou retour depuis n'importe quelle section
- **Onglet Leçon** : vers Active Lesson
- **Onglet Classement** : vers Leaderboards
- **Accès MandaBot** : vers AI Teacher
- **Accès Jeux** : vers Mini-Games Hub
- **Accès Boutique** : vers Shop

---

## 5. Journey Map

### Description générale
Carte visuelle de type Super Mario Bros. représentant tous les chapitres et leçons. L'utilisateur navigue sur un chemin sinueux à travers différents décors thématiques (ville, montagne, temple, forêt de bambou, Grande Muraille).

### Wireframe ASCII
```
┌─────────────────────────────────┐
│  Parcours d'apprentissage  [?]  │
│  Chapitre 3 : Les transports    │
│                                 │
│    [TROPHEE] CH5 Temple         │
│         |                       │
│   ●──●──●──○──○    CH4 Montagne │
│              |                  │
│   CH3 Ville  ●──●──○──○         │
│   ●──●──★   |                   │
│   |         ●──○    CH2 Marché  │
│   ●──●──●                       │
│   |         CH1 Ville           │
│   [ETOILE] DEPART               │
│                                 │
│  ┌──────────────────────────┐   │
│  │  Chapitre 3 - Leçon 7   │   │
│  │  Les transports en ville │   │
│  │  ▓▓▓▓░░  3/5 complétées  │   │
│  │  [Continuer la leçon]    │   │
│  └──────────────────────────┘   │
│                                 │
│  [Accueil] [Carte] [Jeux] [Bot] [Profil] │
└─────────────────────────────────┘
```

### Composants UI
- **Carte scrollable** : ScrollView vertical avec zoom pinch-to-zoom
- **Noeuds de leçon** :
  - Complet : cercle plein vert + 1/2/3 étoiles selon le score
  - En cours : cercle plein rouge + animation pulse
  - Verrouillé : cercle gris avec icône cadenas
  - Boss de chapitre : icône dragon/trophée plus grande
  - Bonus secret : étoile dorée
- **Chemins entre noeuds** : lignes avec tirets colorés par chapitre
- **Décors** : illustrations SVG par zone (bâtiments, arbres, montagnes)
- **Panel inférieur** (sheet) : glisse depuis le bas lors du tap sur un noeud
  - Nom de la leçon + description courte
  - Barre de progression si commencée
  - Bouton "Commencer" / "Continuer" / "Réviser"

### États des noeuds
| État | Visuel | Interaction |
|------|--------|-------------|
| Complété 3 étoiles | Vert vif, 3 étoiles dorées | Tap → panel révision |
| Complété 1-2 étoiles | Vert clair, étoiles partielles | Tap → panel "Améliorer" |
| En cours | Rouge avec pulse | Tap → panel + CTA principal |
| Non commencé (déverrouillé) | Blanc avec contour rouge | Tap → panel "Commencer" |
| Verrouillé | Gris, cadenas | Tap → toast "Complétez la leçon précédente" |
| Boss chapitre | Grande icône animée | Tap → panel spécial boss |

### Animations
- **Scroll automatique** : à l'ouverture, scroll jusqu'à la leçon en cours (500 ms ease)
- **Sélection noeud** : scale 1.0 → 1.3 → 1.1 (spring bounce), puis panel glisse en 300 ms
- **Completion récente** : étoiles s'allument une à une avec son
- **Parallaxe décors** : fond défile à 60 % de la vitesse du plan des noeuds
- **Pulse en cours** : cercle rouge s'étend et revient (2 s loop)

### Navigation
- **Entrée** : depuis Home (onglet Carte) ou bouton "Journey"
- **Tap noeud** : ouvre panel sans quitter l'écran
- **CTA panel** : → Active Lesson
- **Retour** : navbar ou flèche

---

## 6. Active Lesson

### Description générale
Interface principale d'une leçon en cours. Orchestre les différents types d'exercices (vocabulaire, prononciation, écriture, QCM, glisser-déposer) avec barre de progression globale. Durée type : 10-15 minutes.

### Wireframe ASCII
```
┌─────────────────────────────────┐
│  [X]   ▓▓▓▓▓▓░░░░░░░   5/12    │
│                      [c][c][c]  │
│                                 │
│  ┌──────────────────────────┐   │
│  │                          │   │
│  │   ZONE D'EXERCICE        │   │
│  │   (contenu dynamique     │   │
│  │    selon le type :       │   │
│  │    vocab / pronon /      │   │
│  │    écriture / QCM)       │   │
│  │                          │   │
│  │                          │   │
│  └──────────────────────────┘   │
│                                 │
│  ┌──────────────────────────┐   │
│  │   Vérifier la réponse    │   │
│  └──────────────────────────┘   │
│                                 │
│  ╔══════════════════════════╗   │
│  ║ Correct ! +10 XP         ║   │
│  ║ La bonne réponse était : ║   │
│  ║ 公交车 (gongjiaoché)      ║   │
│  ║ [Continuer →]            ║   │
│  ╚══════════════════════════╝   │
└─────────────────────────────────┘
```

### Composants UI
- **Barre de progression** : haut de l'écran, couleur rouge, label "X/Y exercices"
- **Vies (coeurs)** : 3 icônes coeur en haut droite, perdues à chaque erreur
- **Bouton fermer [X]** : coin haut gauche, modal de confirmation (abandon)
- **Zone d'exercice centrale** : composant dynamique remplacé entre exercices
- **Bouton "Vérifier"** : en bas, grisé jusqu'à saisie/sélection, rouge actif
- **Panel feedback** (bottom sheet) :
  - Correct : fond vert, message positif, XP gagné, bouton "Continuer"
  - Incorrect : fond rouge, explication, bonne réponse, bouton "Je comprends"

### Types d'exercices supportés
| Type | Description | Interface |
|------|-------------|-----------|
| QCM 4 choix | 4 cartes à taper | Grille 2x2 |
| Correspondance | Glisser-déposer paires | 2 colonnes |
| Complétion | Trou à remplir dans une phrase | Input clavier |
| Réordonner | Mots à remettre dans l'ordre | Chips draggables |
| Flashcard vocab | → voir écran 7 | Flashcard flip |
| Prononciation | → voir écran 8 | Micro + waveform |
| Écriture | → voir écran 9 | Canvas tracé |

### États
| État | Comportement |
|------|-------------|
| Attente réponse | Bouton "Vérifier" grisé |
| Réponse saisie | Bouton "Vérifier" actif (rouge) |
| Vérification | Bouton loading spinner |
| Correct | Panel vert, animation XP, son positif |
| Incorrect | Panel rouge, explication, -1 coeur, son négatif |
| 0 coeur | Modal "Plus de vies" : recommencer / continuer (premium) |
| Fin de leçon | Transition automatique vers End of Lesson |
| Abandon | Modal confirmation → Journey Map |

### Animations
- Transition entre exercices : glissement horizontal (350 ms, easeInOut)
- Coeur perdu : shake + scale down 1.0 → 0.0 avec rebond
- XP gagné : chiffre "+10" flotte vers le haut depuis le panel
- Panel feedback : slide up depuis le bas (250 ms, spring stiffness 300)
- QCM sélection : scale 0.95 sur la carte sélectionnée
- Correct en QCM : fond de la carte correcte devient vert (200 ms)

### Navigation
- **Entrée** : depuis Journey Map (panel CTA) ou Home (leçon du jour)
- **Abandon** : [X] → modal → Journey Map
- **Fin automatique** : → End of Lesson

---

## 7. Vocabulary Exercise

### Description générale
Exercice de vocabulaire sous forme de flashcard interactive. L'utilisateur voit un mot en mandarin, l'écoute, retourne la carte pour voir traduction et pinyin, puis s'auto-évalue.

### Wireframe ASCII
```
┌─────────────────────────────────┐
│  [X]   ▓▓▓▓▓░░░░░░░░   Vocab   │
│                                 │
│         ── FACE AVANT ──        │
│  ╔══════════════════════════╗   │
│  ║                          ║   │
│  ║        公交车             ║   │
│  ║   [caractères chinois]   ║   │
│  ║                          ║   │
│  ║     [bouton audio]       ║   │
│  ║                          ║   │
│  ╚══════════════════════════╝   │
│                                 │
│        Appuyez pour retourner   │
│                                 │
│         ── FACE ARRIERE ──      │
│  ╔══════════════════════════╗   │
│  ║  gongjiaoché             ║   │
│  ║  ─────────────────────── ║   │
│  ║  Bus / Autobus            ║   │
│  ║                          ║   │
│  ║  [illustration bus]      ║   │
│  ╚══════════════════════════╝   │
│                                 │
│  [Je savais (vert)] [Réviser(rouge)]│
└─────────────────────────────────┘
```

### Composants UI
- **Flashcard** : composant 3D flip physique
  - Dimensions : 90 % de la largeur, hauteur ~250 dp
  - Fond blanc, ombre portée `elevation: 8`, border-radius 20 dp
  - Face avant : caractère(s) en 48 sp bold (Noto Sans SC), bouton audio centré
  - Face arrière : pinyin 24 sp rouge, séparateur, traduction 20 sp, illustration optionnelle
- **Bouton audio** : icône haut-parleur 32 dp, fond gris clair circulaire
- **Invite** : texte "Appuyez pour retourner" avec flèche bidirectionnelle
- **Boutons auto-évaluation** : apparaissent uniquement après flip
  - "Je savais" : fond vert #43A047, pleine moitié gauche
  - "Réviser" : fond rouge #E53935, pleine moitié droite
- **Compteur** : "3 sur 10" en haut de la carte

### États
| État | Comportement |
|------|-------------|
| Face avant | Invite visible, boutons cachés |
| Face arrière | Traduction visible, boutons d'évaluation affichés |
| Audio en lecture | Animation onde sonore sur le bouton |
| Audio chargement | Spinner sur le bouton |
| Fin du paquet | Écran récap avec score (X "savais" / Y "révise") |

### Animations
- **Flip 3D** : rotationY 0° → 180° (400 ms, easeInOut), le dos commence à 180° → 360°
- **Apparition boutons** : fadeIn + slideUp depuis le bas (200 ms délai après flip)
- **Swipe alternatif** : swipe droite = "Je savais" (carte file vers droite), swipe gauche = "Réviser"
- **Retour pile** : carte suivante pop depuis le bas (spring)
- **Evaluation** : la carte file dans la direction de l'évaluation (300 ms)

### Navigation
- **Entrée** : injecté dans le flow Active Lesson
- **Sortie** : retour automatique au flow Active Lesson

---

## 8. Pronunciation Exercise

### Description générale
Exercice de prononciation utilisant la reconnaissance vocale IA. L'utilisateur écoute un modèle natif, enregistre sa prononciation, et reçoit un score en temps réel avec analyse par syllabe et tonalité.

### Wireframe ASCII
```
┌─────────────────────────────────┐
│  [X]   ▓▓▓▓▓▓▓░░░░  Pronon.    │
│                                 │
│  Prononcez ce mot :             │
│                                 │
│  ┌──────────────────────────┐   │
│  │   你好  (ni hao)          │   │
│  │   Bonjour                │   │
│  └──────────────────────────┘   │
│                                 │
│  [Ecouter le modèle natif]      │
│                                 │
│  ─── Votre prononciation ────   │
│                                 │
│  ╔══════════════════════════╗   │
│  ║  ~~~~~~~~~~~~~~~~~~~~    ║   │
│  ║  Forme d'onde temps réel ║   │
│  ╚══════════════════════════╝   │
│                                 │
│          [micro] 00:02          │
│  [  APPUYER POUR PARLER     ]   │
│                                 │
│  Score : ████████░░  82 %       │
│  ni  [ok]   hao  [ton 3 !]      │
│                                 │
│  [Réessayer]  [Continuer]       │
└─────────────────────────────────┘
```

### Composants UI
- **Carte du mot** : mot mandarin 36 sp, pinyin avec tons diacritiques, traduction
- **Bouton "Écouter le modèle"** : icône play, lance l'audio professionnel
- **Visualiseur de forme d'onde** : canvas SVG animé en temps réel via Web Audio API
  - Points/barres interpolés selon l'amplitude du micro
  - Couleur : rouge pendant enregistrement, bleu pendant lecture modèle
- **Bouton microphone** : cercle rouge 64 dp, pulse pendant enregistrement
- **Minuteur** : compteur MM:SS sous le bouton micro
- **Barre de score** : gradient rouge → orange → vert selon le score
- **Analyse syllabique** : chips par syllabe avec indicateur de ton

### Analyse de tonalité
| Résultat | Indicateur |
|----------|-----------|
| Correct | Contour vert, coche |
| Ton incorrect | Contour orange, numéro du bon ton |
| Syllabe manquée | Contour rouge, croix |
| Excellent (>90 %) | Badge "Parfait !" doré |

### États
| État | Comportement |
|------|-------------|
| Inactif | Bouton micro rouge disponible, invitation |
| Enregistrement | Forme d'onde animée, minuteur actif, bouton = STOP |
| Analyse | Spinner "Analyse..." (500-1500 ms) |
| Résultat affiché | Score visible, boutons action disponibles |
| Score >= 80 % | Badge "Excellent !" + sons positifs |
| Score < 60 % | Conseil ciblé sur le(s) ton(s) incorrect(s) |
| Permission micro refusée | Écran avec lien vers les réglages système |

### Animations
- **Forme d'onde** : barres SVG se mettent à jour 60 fps via requestAnimationFrame
- **Pulse microphone** : cercle concentriques s'étendent (2 s loop pendant enregistrement)
- **Barre de score** : remplissage progressif avec changement de couleur (700 ms)
- **Analyse syllabique** : chips apparaissent en stagger (150 ms par syllabe)
- **Excellent** : mini confetti depuis le badge (300 ms)

### Navigation
- **Entrée** : injecté dans le flow Active Lesson
- **Sortie** : retour automatique au flow Active Lesson

---

## 9. Writing Exercise

### Description générale
Exercice d'écriture des caractères chinois sur canevas tactile. L'IA analyse l'ordre des traits, la forme et les proportions. Guidage progressif par trait avec indice optionnel.

### Wireframe ASCII
```
┌─────────────────────────────────┐
│  [X]   ▓▓▓▓▓▓▓▓░░  Écriture    │
│                                 │
│  Écrivez ce caractère :         │
│                                 │
│  ┌──────────────────────────┐   │
│  │  你  (ni) — Tu / Vous    │   │
│  └──────────────────────────┘   │
│                                 │
│  ╔══════════════════════════╗   │
│  ║  .  ─  ─  .  ─  ─  .   ║   │
│  ║  |           |          ║   │
│  ║  . ─ ─ + ─ ─ .          ║   │
│  ║  |           |          ║   │
│  ║  .  ─  ─  .  ─  ─  .   ║   │
│  ║       [Canvas tracé]    ║   │
│  ╚══════════════════════════╝   │
│                                 │
│  Trait 3/7     [Afficher indice]│
│  ────────────────────────────── │
│  [Animation guide] [Effacer]    │
│                                 │
│  Précision : ████████░░  80 %   │
│  Ordre des traits : Correct     │
└─────────────────────────────────┘
```

### Composants UI
- **Carte référence** : caractère cible en grande taille, pinyin, traduction
- **Canevas de tracé** : zone tactile principale
  - Grille de repère : croix centrale + carré (style papier d'écolier chinois)
  - Superposition du modèle gris très clair (référence transparente)
  - Tracé utilisateur : noir, strokeWidth 8, caps ronds
  - Tracé des traits validés : reste visible en gris foncé
- **Compteur de traits** : "Trait X/Y" sous le canevas
- **Bouton "Afficher indice"** : révèle le prochain trait animé en rouge (-5 XP signalé)
- **Bouton "Animation guide"** : joue l'animation complète des traits dans l'ordre
- **Bouton "Effacer"** : supprime le dernier trait ou réinitialise (appui long)
- **Métriques** : barre de précision + statut ordre des traits

### Analyse des traits
| Critère | Description | Pondération |
|---------|-------------|-------------|
| Ordre | Les traits sont tracés dans le bon ordre | 40 % |
| Direction | Le trait va dans la bonne direction | 30 % |
| Forme | La forme correspond au modèle | 30 % |

### États
| État | Comportement |
|------|-------------|
| En attente | Canevas vide, invite à tracer |
| Tracé en cours | Ligne suit le doigt/stylet en temps réel |
| Trait validé | Flash vert + vibration légère, compteur avance |
| Trait incorrect | Flash rouge + shake + effacement automatique du trait |
| Indice demandé | Animation rouge du trait attendu, -5 XP |
| Caractère complet | Tous les traits en vert, animation "Bravo !" |
| Score calculé | Barre de précision animée, score final |

### Animations
- **Tracé** : mise à jour canvas à 60 fps (touch events)
- **Validation trait** : flash de couleur 200 ms + vibration 50 ms (Haptics API)
- **Erreur trait** : fond canvas flash rouge + shake horizontal (200 ms)
- **Completion** : tous les traits en vert progressivement, scale up du caractère
- **Guide animation** : trait rouge qui se trace automatiquement à 2x vitesse normale

### Navigation
- **Entrée** : injecté dans le flow Active Lesson
- **Sortie** : retour automatique au flow Active Lesson

---

## 10. End of Lesson

### Description générale
Écran de résultats affiché à la fin d'une leçon. Récapitulatif des performances, XP gagnés, étoiles obtenues, options pour continuer l'apprentissage ou réviser les erreurs.

### Wireframe ASCII
```
┌─────────────────────────────────┐
│                                 │
│   [======= CONFETTI =======]    │
│                                 │
│   ╔══════════════════════════╗  │
│   ║  LEÇON TERMINÉE !        ║  │
│   ║                          ║  │
│   ║      [*] [*] [*]         ║  │
│   ║   (3 étoiles obtenues)   ║  │
│   ║                          ║  │
│   ║  XP gagnés : +150 XP     ║  │
│   ║  [===BARRE XP========]   ║  │
│   ║       2850 / 3000        ║  │
│   ╚══════════════════════════╝  │
│                                 │
│  ─── RÉSUMÉ ─────────────────  │
│  Exercices : 12/12              │
│  Précision :  91 %              │
│  Temps :      8 min 42 s        │
│  Nouveaux mots : 8              │
│                                 │
│  Streak maintenu ! 15 jours     │
│                                 │
│  ┌──────────────────────────┐   │
│  │   Leçon suivante →       │   │
│  └──────────────────────────┘   │
│  [Réviser les erreurs]          │
│  [Retourner à la carte]         │
└─────────────────────────────────┘
```

### Composants UI
- **Confetti Lottie** : plein écran, lecture unique 3 s, particules aux couleurs de la marque
- **Panneau principal** : carte centrée, border dorée si 3 étoiles
- **Étoiles** : 3 étoiles SVG animables
  - 1 étoile : score < 70 % (mauvais)
  - 2 étoiles : score 70-89 %
  - 3 étoiles : score >= 90 %
- **Compteur XP** : roll-up animé de 0 → valeur finale (1 s)
- **Barre XP** : barre de niveau actuel, peut déclencher animation level-up
- **Tableau récapitulatif** : 4 métriques avec icônes et valeurs
- **Streak banner** : si streak maintenu, icône flamme + compteur + message
- **Boutons** : primaire (leçon suivante), secondaires (réviser, retour carte)

### Séquence d'animation (chronologique)
| Timing | Animation |
|--------|-----------|
| 0 ms | Fond blanc flash |
| 0-500 ms | Confetti explosent depuis le centre |
| 300 ms | Panneau principal scale 0 → 1.05 → 1.0 (spring) |
| 600 ms | Étoile 1 apparaît avec son "ding" |
| 750 ms | Étoile 2 apparaît |
| 900 ms | Étoile 3 apparaît |
| 1000 ms | Compteur XP commence à rouler |
| 1300 ms | Barre XP se remplit progressivement |
| 1600 ms | Tableau récap slide depuis le bas |
| 2000 ms | Boutons apparaissent avec fade in |
| Si level-up | Bannière dorée "Niveau X atteint !" en overlay 2 s |

### États
| État | Comportement |
|------|-------------|
| 3 étoiles | Confetti complet, son fanfare, bordure or |
| 1-2 étoiles | Confetti réduit, sons plus discrets, encouragement |
| Level-up | Animation bannière niveau supplémentaire |
| Streak maintenu | Bannière streak animée avant les boutons |
| Streak cassé | Pas de bannière, modal optionnel "vie de grâce" (premium) |

### Navigation
- **Entrée** : depuis Active Lesson (automatique en fin de leçon)
- **Leçon suivante** : → Active Lesson (leçon suivante dans le chapitre)
- **Réviser les erreurs** : → Active Lesson (mode révision, exercices ratés uniquement)
- **Retour carte** : → Journey Map

---

## 11. AI Teacher — MandaBot

### Description générale
Interface de chat conversationnel avec l'IA pédagogique MandaBot. Répond en français ou en mandarin, explique la grammaire, corrige des phrases, génère des exercices personnalisés et propose un mode conversation vocale.

### Wireframe ASCII
```
┌─────────────────────────────────┐
│  ← MandaBot          [Voix]     │
│  En ligne                       │
│  ─────────────────────────────  │
│                                 │
│  ┌────────────────────────────┐ │
│  │ Bonjour ! Je suis          │ │
│  │ MandaBot. Comment puis-je  │ │
│  │ t'aider aujourd'hui ?      │ │
│  │                 10:24      │ │
│  └────────────────────────────┘ │
│                                 │
│         ┌────────────────────┐  │
│         │ Comment dit-on     │  │
│         │ "je voudrais..."   │  │
│         │ en mandarin ?      │  │
│         │          10:25 [v] │  │
│         └────────────────────┘  │
│                                 │
│  ┌────────────────────────────┐ │
│  │ On dit 我想要 (wo xiang    │ │
│  │ yao). Par exemple :        │ │
│  │ 我想要一杯茶 = Je voudrais │ │
│  │ une tasse de thé.          │ │
│  └────────────────────────────┘ │
│  ─────────────────────────────  │
│  [Exercice] [Vocab] [Grammaire] │
│  ┌──────────────────────────┐   │
│  │ Écrivez un message...    │[M]│
│  └──────────────────────────┘   │
└─────────────────────────────────┘
```

### Composants UI
- **Header** : nom "MandaBot", indicateur statut (toujours "En ligne"), bouton mode voix
- **Liste de messages** : FlatList scrollable vers le bas automatiquement
  - Bulles bot : côté gauche, fond #F5F5F5, coins arrondis sauf bas-gauche, avatar bot
  - Bulles utilisateur : côté droit, fond #E53935, texte blanc, coins sauf bas-droit
  - Horodatage discret sous chaque bulle
  - Indicateurs de lecture (✓ envoyé, ✓✓ lu)
  - Support des caractères mandarin avec mise en forme pinyin
- **Indicateur frappe bot** : 3 points gris pulsants
- **Suggestions rapides** : chips scrollables horizontalement
- **Zone de saisie** : TextInput auto-expand, max 5 lignes
- **Bouton micro [M]** : à droite de l'input, maintenir pour enregistrer

### Mode Voix (overlay plein écran)

```
┌─────────────────────────────────┐
│                    [X Fermer]   │
│                                 │
│     ╔═══════════════════╗       │
│     ║   [Avatar Bot]    ║       │
│     ║   MandaBot parle  ║       │
│     ║   ~~~~waveform~~~ ║       │
│     ╚═══════════════════╝       │
│                                 │
│      "Essayez de répéter :"     │
│      你好，你叫什么名字？        │
│                                 │
│         [APPUYER POUR PARLER]   │
│                  ●              │
│                                 │
└─────────────────────────────────┘
```

### États
| État | Comportement |
|------|-------------|
| Inactif | Chat standard, input disponible |
| Bot en cours d'écriture | Indicateur "..." animé (3 points stagger) |
| Limite freemium atteinte | Message système + CTA Premium |
| Mode voix actif | Overlay plein écran, micro en attente |
| Erreur réseau | Toast + mode hors-ligne limité |

### Capacités de MandaBot
- Traduction bidirectionnelle français ↔ mandarin
- Correction grammaticale de phrases utilisateur
- Génération d'exercices personnalisés
- Explication des tons et de la prononciation
- Conversation simulée sur des scénarios réels
- Référence culturelle et contextuelle

### Animations
- **Apparition message** : slide depuis le bas (200 ms, spring)
- **Indicateur frappe** : 3 points en sequence (400 ms loop)
- **Envoi** : bulle scale 0 → 1 (150 ms)
- **Mode voix** : blur du fond + slide up overlay (300 ms)
- **Chips suggestions** : scroll snap horizontal

### Navigation
- **Entrée** : depuis Home (tab ou accès rapide), depuis n'importe quel écran
- **Mode voix** : overlay sans navigation
- **Sortie** : flèche retour → écran précédent

---

## 12. User Profile

### Description générale
Page de profil affichant les statistiques, les badges obtenus, l'historique d'activité sous forme de heatmap, et les options de personnalisation d'avatar.

### Wireframe ASCII
```
┌─────────────────────────────────┐
│  ← Profil               [Edit] │
│                                 │
│  ┌──────────────────────────┐   │
│  │  [Avatar 80dp circulaire]│   │
│  │  Lucas Martin            │   │
│  │  Niveau 12 - HSK 2       │   │
│  │  Membre depuis jan. 2025 │   │
│  └──────────────────────────┘   │
│                                 │
│  ─── STATISTIQUES ────────────  │
│  ┌───────┐ ┌───────┐ ┌───────┐  │
│  │  14   │ │  47   │ │  92 % │  │
│  │ Jours │ │Leçons │ │Préci. │  │
│  └───────┘ └───────┘ └───────┘  │
│  ┌───────┐ ┌───────┐            │
│  │  #12  │ │  380  │            │
│  │ Ligue │ │  Mots │            │
│  └───────┘ └───────┘            │
│                                 │
│  ─── BADGES OBTENUS ──────────  │
│  [B1] [B2] [B3] [B4] [B5] [+14]│
│                                 │
│  ─── ACTIVITÉ (30 jours) ─────  │
│  ░▓▓▓░░▓▓▓▓░░▓░▓▓▓▓▓░░▓▓▓▓▓░   │
│  Calendrier heatmap             │
│                                 │
│  [Accueil] [Carte] [Jeux] [Bot] [Profil] │
└─────────────────────────────────┘
```

### Composants UI
- **Bannière profil** : fond dégradé rouge léger, avatar circulaire 80 dp avec bordure
  - Tap avatar → modal choix avatar (galerie personnages)
- **Grille statistiques** : 3+2 cartes avec valeur principale + label
- **Galerie badges** : scroll horizontal, badges colorés si obtenus, gris si non
  - Tap badge → modal détail (nom, description, condition d'obtention, date)
- **Heatmap 30 jours** : grille de carrés (5 semaines × 7 jours)
  - Couleur : blanc = pas d'activité, rouge clair → rouge foncé selon intensité XP

### Modal édition profil
- Modification avatar (galerie de personnages déblocables + upload photo)
- Pseudo (validation unicité en temps réel)
- Bio courte (120 caractères)
- Langue d'interface

### États
| État | Comportement |
|------|-------------|
| Propre profil | Bouton "Modifier" visible |
| Profil d'un autre utilisateur | Bouton "Défier" + "Suivre" à la place |
| Badge cliqué | Modal détail badge |
| Heatmap tap | Tooltip : date + nombre de leçons + XP du jour |
| Niveau up depuis dernière visite | Animation banner "Niveau X atteint !" |

### Animations
- **Entrée** : chiffres des stats comptent de 0 → valeur (700 ms, stagger 100 ms)
- **Heatmap** : cellules apparaissent en vague gauche → droite (5 ms par cellule)
- **Badges** : fadeIn stagger (50 ms par badge)
- **Modal** : slide up (300 ms, spring)

### Navigation
- **Entrée** : depuis tab navbar, depuis lien classement
- **Sortie** : retour, vers Settings (bouton engrenage dans header)

---

## 13. Leaderboards / Leagues

### Description générale
Tableau de bord compétitif organisé par ligues hebdomadaires. Promotion/rétrogradation en fin de semaine selon le classement. Vue "Cette semaine", "Amis" et "Monde".

### Wireframe ASCII
```
┌─────────────────────────────────┐
│  ← Classements                  │
│                                 │
│  ┌──────────────────────────┐   │
│  │  [icône] LIGUE BRONZE    │   │
│  │  Fin dans : 3j 14h 22min │   │
│  │  Top 10 → Ligue Argent   │   │
│  └──────────────────────────┘   │
│                                 │
│  [Cette semaine] [Amis] [Monde] │
│                                 │
│  ──────────────────────────────  │
│  [or]  1. DragonMaster99  4820  │
│  [Ag]  2. LingoQueen      4105  │
│  [Br]  3. MandarinPro     3890  │
│        ...                      │
│  ──  12. VOUS             1540 ── │
│        13. ChinaFan88     1420   │
│  ══ Zone rétrogradation ══════   │
│  ──────────────────────────────  │
│                                 │
│  ┌──────────────────────────┐   │
│  │  +50 XP = remonter #9   │   │
│  │  [Faire une leçon →]    │   │
│  └──────────────────────────┘   │
│                                 │
│  [Accueil] [Carte] [Jeux] [Bot] [Profil] │
└─────────────────────────────────┘
```

### Composants UI
- **Header ligue** : icône trophée coloré selon la ligue, nom, compte à rebours, règle
- **Onglets** : Cette semaine / Amis / Monde, indicateur rouge coulissant
- **Liste classement** : FlatList optimisée
  - Médailles gold/silver/bronze pour les 3 premiers
  - Ligne utilisateur : fond rouge clair, sticky si hors champ de vision
  - Avatar + pseudo + XP semaine
- **Séparateur zone danger** : ligne rouge épaisse avec label
- **CTA motivation** : carte calculant XP requis pour remonter

### Ligues (7 niveaux)
| Ligue | Couleur | Icône |
|-------|---------|-------|
| Bronze | #CD7F32 | Médaille bronze |
| Argent | #C0C0C0 | Médaille argent |
| Or | #FFD700 | Trophée or |
| Jade | #00A86B | Jade vert |
| Rubis | #E0115F | Gemme rouge |
| Diamant | #B9F2FF | Diamant bleu |
| Dragon | #FF4500 | Dragon rouge |

### États
| État | Comportement |
|------|-------------|
| Classement chargé | Liste complète avec rang utilisateur |
| Aucun ami | Onglet Amis : "Invitez des amis !" |
| Fin de semaine | Animation transition de ligue si promotion/rétrogradation |
| Hors connexion | Classement en cache affiché avec badge "Hors-ligne" |

### Animations
- **Rang utilisateur** : highlight pulse toutes les 3 s
- **Compte à rebours** : mise à jour chaque seconde
- **Changement de ligue** (fin de semaine) : cinématique dédiée avec animation trophée

### Navigation
- **Entrée** : depuis Home (teaser classement), depuis profil
- **Tap rival** : → profil de l'utilisateur
- **Sortie** : navbar

---

## 14. Mini-Games Hub

### Description générale
Galerie de 35 mini-jeux classés par catégorie. Chaque jeu propose un score personnel, un classement dédié et un niveau de difficulté. Certains jeux sont réservés aux abonnés premium.

### Wireframe ASCII
```
┌─────────────────────────────────┐
│  Mini-Jeux            [Chercher]│
│                                 │
│  [Tous][Vocab][Tons][Caract][+] │
│                                 │
│  ─── POPULAIRES ──────────────  │
│  ┌──────────┐  ┌──────────┐     │
│  │ Mahjong  │  │ Cibles   │     │
│  │ Vocab    │  │ Tonalité │     │
│  │ Note 4.8 │  │ Note 4.6 │     │
│  └──────────┘  └──────────┘     │
│  ┌──────────┐  ┌──────────┐     │
│  │ Course   │  │ Puzzle   │     │
│  │ de mots  │  │ Hanzi    │     │
│  │ Note 4.5 │  │ Note 4.7 │     │
│  └──────────┘  └──────────┘     │
│                                 │
│  ─── NOUVEAUX ────────────────  │
│  ┌──────────┐  ┌──────────┐     │
│  │ Chansons │  │ Menu     │     │
│  │ Mandarin │  │ Restau.  │     │
│  │ NOUVEAU  │  │ NOUVEAU  │     │
│  └──────────┘  └──────────┘     │
│                                 │
│  Total : 35 jeux disponibles    │
│                                 │
│  [Accueil] [Carte] [Jeux] [Bot] [Profil] │
└─────────────────────────────────┘
```

### Composants UI
- **Barre de recherche** : collapsible, animation slide depuis la droite
- **Filtres** : chips scrollables (Tous / Vocabulaire / Tonalité / Caractères / Culture / Premium)
- **Grille 2 colonnes** : cartes 160×180 dp
  - Illustration thématique en haut (60 % de la carte)
  - Nom du jeu + icône catégorie
  - Note étoile (étoiles jaunes)
  - Badge "NOUVEAU" (rouge), "PREMIUM" (doré), score personnel (bas droite)
- **Sections** : "Populaires", "Nouveaux", par catégorie

### Catalogue (sélection des 35 jeux)
| N° | Catégorie | Nom du jeu | Description |
|----|-----------|-----------|-------------|
| 1 | Vocabulaire | Mahjong Mots | Associer tuiles hanzi et traductions |
| 2 | Vocabulaire | Sprint Lexical | Valider/rejeter des mots en 60 s |
| 3 | Vocabulaire | Memory Mandarin | Retourner des paires de cartes |
| 4 | Vocabulaire | Anagramme Hanzi | Reconstituer le mot dans le bon ordre |
| 5 | Tonalité | Chasse au Ton | Identifier le ton parmi 4 options |
| 6 | Tonalité | Mélodie Mandarin | Associer mélodie et ton |
| 7 | Tonalité | Ton ou Pas | Swipe gauche/droite selon le ton |
| 8 | Caractères | Puzzle Hanzi | Reconstituer par radicaux |
| 9 | Caractères | Course aux Traits | Tracer le plus vite possible |
| 10 | Caractères | Radical Master | Identifier les radicaux |
| 11 | Culture | Menu Restaurant | Commander en mandarin |
| 12 | Culture | Voyage en Chine | Jeu de rôle multi-villes |
| ... | ... | ... | 23 autres jeux |

### États
| État | Comportement |
|------|-------------|
| Jeu disponible | Carte normale, tap → lancement direct |
| Jeu premium (non abonné) | Overlay semi-transparent, cadenas, CTA Premium |
| Session active (jeu en cours) | Badge "En cours" sur la carte |
| Meilleur score battu | Toast "Nouveau record !" au retour |

### Animations
- **Entrée grille** : cartes apparaissent en stagger (50 ms/carte, haut vers bas)
- **Tap** : scale 0.95 → 1.0 (bounce), ombre s'approfondit
- **Lancement** : hero animation : carte s'expand pour remplir l'écran (350 ms)
- **Retour** : hero animation inverse

### Navigation
- **Entrée** : depuis Home (accès rapide), navbar onglet Jeux
- **Lancement jeu** : hero animation → écran du mini-jeu
- **Retour** : hero animation inverse → hub

---

## 15. Shop

### Description générale
Boutique de personnalisation proposant avatars, thèmes visuels, effets sonores, boosts de XP et packs. Modèle freemium éthique : aucun avantage pédagogique à vendre, uniquement du cosmétique et des boosts de confort.

### Wireframe ASCII
```
┌─────────────────────────────────┐
│  ← Boutique                     │
│  1250 pièces  |  50 gemmes      │
│                                 │
│  [Avatars][Thèmes][Boosts][Packs│
│                                 │
│  ─── EN VEDETTE ──────────────  │
│  ╔══════════════════════════╗   │
│  ║  Pack Dragon Légendaire  ║   │
│  ║  Avatar + Thème + Sons   ║   │
│  ║  500 pièces → 350 !  -30%║   │
│  ║  [Acheter maintenant]    ║   │
│  ╚══════════════════════════╝   │
│                                 │
│  ─── AVATARS ─────────────────  │
│  ┌──────┐ ┌──────┐ ┌──────┐    │
│  │ Base │ │Samouraï│ Panda│     │
│  │Grat. │ │ 200p  │ │ 50g │     │
│  └──────┘ └──────┘ └──────┘    │
│                                 │
│  ─── BOOSTS ──────────────────  │
│  Double XP 1h          100 pièces│
│  Bouclier Streak        80 pièces│
│  Bonus Précision +10 %  60 pièces│
│                                 │
│  [Accueil] [Carte] [Jeux] [Bot] [Profil] │
└─────────────────────────────────┘
```

### Composants UI
- **Header solde** : compteur pièces (or) et gemmes (bleu/violet), tap → historique
- **Onglets catégories** : Avatars / Thèmes / Boosts / Packs / Premium
- **Bannière vedette** : pleine largeur, dégradé animé, countdown si offre limitée
- **Cartes avatar/thème** : image preview, nom, prix, état (possédé/équipé)
- **Lignes boost** : icône + nom + durée + prix alignés
- **Modal d'achat** : confirmation avant débit (montant, solde après)

### Monnaies et obtention
| Monnaie | Obtention | Usage |
|---------|-----------|-------|
| Pièces (or) | Leçons terminées, streak, défis quotidiens | Items standards, boosts courants |
| Gemmes (violet) | Achat IAP, récompenses événements | Items rares, packs premium |

### États
| État | Comportement |
|------|-------------|
| Item non possédé | Bouton "Acheter" actif |
| Item possédé (non équipé) | Bouton "Équiper" |
| Item équipé | Bouton "Équipé" grisé + badge |
| Solde insuffisant | Bouton "Acheter" grisé + modal "Pas assez de pièces" |
| Achat en cours | Spinner, bouton désactivé |
| Achat confirmé | Animation item qui vole vers le compteur + toast |
| Offre limitée | Countdown visible en rouge sur la bannière |

### Animations
- **Achat réussi** : item scale up + confetti → miniature file vers le compteur header
- **Bannière vedette** : shimmer animé en boucle (3 s)
- **Équipement avatar** : preview de l'avatar sur l'écran de confirmation

### Navigation
- **Entrée** : depuis Home (accès rapide), depuis profil, depuis navbar
- **Vers Premium** : depuis onglet Premium ou CTA dans items verrouillés

---

## 16. Premium Subscription

### Description générale
Paywall présentant clairement les avantages de l'abonnement Premium vs la version gratuite. Essai gratuit 7 jours mis en avant. Respect des directives App Store / Google Play (pas de dark patterns).

### Wireframe ASCII
```
┌─────────────────────────────────┐
│                    [X Fermer]   │
│                                 │
│  ╔══════════════════════════╗   │
│  ║  [couronne animée]       ║   │
│  ║  MANDA GO PREMIUM        ║   │
│  ║  Débloquez tout !        ║   │
│  ╚══════════════════════════╝   │
│                                 │
│       GRATUIT  |  PREMIUM       │
│  ────────────────────────────── │
│  Leçons base   oui |  oui       │
│  Mini-jeux       5 |  35        │
│  MandaBot      10  |  illimité  │
│  Hors-ligne    non |  oui       │
│  Pub           oui |  non       │
│  Vies            3 |  illimitées│
│  Analyses      non |  oui       │
│  ────────────────────────────── │
│                                 │
│  ─── CHOISISSEZ VOTRE PLAN ─── │
│                                 │
│  ┌──────────────────────────┐   │
│  │ ANNUEL   9,99 €/mois     │   │
│  │ 119,88 €/an - MEILLEUR   │   │
│  └──────────────────────────┘   │
│  ┌──────────────────────────┐   │
│  │ MENSUEL  14,99 €/mois    │   │
│  └──────────────────────────┘   │
│                                 │
│  ┌──────────────────────────┐   │
│  │  Essai 7 jours GRATUIT   │   │
│  │      Commencer →         │   │
│  └──────────────────────────┘   │
│  [Restaurer un achat]           │
│  Annulable à tout moment        │
└─────────────────────────────────┘
```

### Composants UI
- **Header** : couronne Lottie animée, titre, sous-titre accrocheur
- **Tableau comparaison** : 2 colonnes (Gratuit / Premium), lignes alternées
  - Colonne Premium : coches vertes et valeurs en gras
- **Sélecteur de plan** : 2 cartes, annuel highlighté avec badge "MEILLEURE OFFRE"
- **CTA principal** : bouton doré/gradient, label "Essai 7 jours GRATUIT"
- **Mentions légales** : prix exact, conditions de renouvellement, lien CGU
- **Lien restauration** : obligatoire selon les règles App Store

### États
| État | Comportement |
|------|-------------|
| Présentation | Tableau visible, plan annuel présélectionné |
| Plan sélectionné | Carte highlightée, bouton mis à jour |
| Paiement IAP | Dialogue natif OS (Apple Pay / Google Pay) |
| Paiement réussi | Animations célébration + redirection |
| Déjà abonné | Bouton changé en "Gérer l'abonnement" |
| Essai en cours | Indication "Essai se termine le JJ/MM" |

### Animations
- **Couronne** : flottement vertical doux (loop 2 s)
- **Bouton CTA** : pulse toutes les 3 s pour attirer l'attention
- **Plan annuel** : reflet lumineux qui parcourt la carte (loop 5 s)
- **Succès achat** : explosion de confetti + feux d'artifice (2 s) → retour

### Navigation
- **Entrée** : depuis Shop, depuis limites freemium, depuis Settings (gérer abo)
- **Succès** : retour à l'écran précédent avec état premium activé
- **Abandon [X]** : retour sans changement

---

## 17. Statistics

### Description générale
Tableau de bord analytique complet. Graphiques de performance dans le temps, heatmap annuelle, analyse des points forts et faibles par compétence, recommandations IA personnalisées.

### Wireframe ASCII
```
┌─────────────────────────────────┐
│  ← Statistiques                 │
│                                 │
│  [7 jours] [30 jours] [Tout]   │
│                                 │
│  ─── ACTIVITÉ XP ─────────────  │
│  ╔══════════════════════════╗   │
│  ║  XP par jour             ║   │
│  ║  |       [|]             ║   │
│  ║  |   [|] [|][|] [|]      ║   │
│  ║  |[|][|] [|][|] [|]      ║   │
│  ║  └──────────────────      ║   │
│  ║  L   M   M   J   V   S   ║   │
│  ╚══════════════════════════╝   │
│                                 │
│  ─── HEATMAP ANNUELLE ────────  │
│  ░▓▓░▓▓░░▓▓▓░░░▓▓▓▓░▓▓░░░▓▓▓   │
│  Jan      Avr      Juil    Oct  │
│                                 │
│  ─── COMPÉTENCES ─────────────  │
│  Vocabulaire    ████████░░  91 %│
│  Lecture        ███████░░░  84 %│
│  Prononciation  █████░░░░░  67 %│
│  Écriture       ████░░░░░░  43 %│
│                                 │
│  MandaBot recommande :          │
│  "Exercice Tons 3/4, 3x/semaine"│
│                                 │
│  ─── VOCABULAIRE ─────────────  │
│  Total : 380 mots | +28 ce mois │
│                                 │
│  [Accueil] [Carte] [Jeux] [Bot] [Profil] │
└─────────────────────────────────┘
```

### Composants UI
- **Sélecteur période** : onglets 7j / 30j / 1 an / Tout
- **Graphique XP** : histogramme avec axe Y auto-ajusté, barres rouges
- **Heatmap annuelle** : grille 52×7, intensité rouge selon XP du jour
- **Barres de compétences** : 4 barres avec % et couleur selon score
- **Recommandation MandaBot** : carte avec avatar bot, texte personnalisé, CTA lien vers l'exercice ciblé
- **Radar chart** (premium) : graphique en araignée des 4 compétences
- **Compteur vocabulaire** : total + delta période

### Analyse des compétences
| Score | Couleur barre | Recommandation |
|-------|--------------|----------------|
| 80-100 % | Vert | "Excellent ! Maintenez le rythme." |
| 60-79 % | Orange | "Bon niveau, quelques exercices ciblés." |
| 40-59 % | Rouge clair | "Besoin de renforcement, leçons dédiées." |
| 0-39 % | Rouge foncé | "Zone critique, programme intensif suggéré." |

### États
| État | Comportement |
|------|-------------|
| Données suffisantes (> 7 jours) | Tous les graphiques affichés |
| Début (< 7 jours) | "Revenez après une semaine de pratique" |
| Premium non actif | Radar chart remplacé par placeholder "Premium" |
| Tap sur heatmap | Tooltip date + nombre de leçons + XP total |

### Animations
- **Graphique XP** : barres poussent depuis 0 à l'entrée (500 ms, easeOut, stagger 50 ms)
- **Heatmap** : cellules apparaissent en vague gauche → droite (5 ms par cellule)
- **Barres compétences** : remplissage de 0 % → valeur (600 ms, easeOut)
- **Radar chart** : contour se trace progressivement, surface se remplit (800 ms)
- **Compteur vocabulaire** : roll-up depuis 0 à l'entrée

### Navigation
- **Entrée** : depuis Profil, depuis Settings
- **Tap recommandation** : → exercice ciblé ou leçon spécifique
- **Sortie** : retour arrière

---

## 18. Settings

### Description générale
Écran de paramètres centralisé et exhaustif. Organisé en 6 sections : Profil, Apprentissage, Notifications, Application, Compte, Légal.

### Wireframe ASCII
```
┌─────────────────────────────────┐
│  ← Paramètres                   │
│                                 │
│  ─── PROFIL ──────────────────  │
│  [Ava] Lucas Martin             │
│        Niveau 12                │
│        [Modifier le profil →]   │
│                                 │
│  ─── APPRENTISSAGE ───────────  │
│  Langue d'interface    Français  │
│  Langue cible          Mandarin  │
│  Caractères            Simplifiés│
│  Affichage pinyin      Toujours  │
│  Durée session cible   15 min    │
│                                 │
│  ─── NOTIFICATIONS ───────────  │
│  Rappel quotidien   [Toggle ON] │
│  Heure du rappel         19:00  │
│  Alertes streak     [Toggle ON] │
│  Nouvelles leçons  [Toggle OFF] │
│                                 │
│  ─── APPLICATION ─────────────  │
│  Thème                  Auto    │
│  Sons               [Toggle ON] │
│  Vibrations         [Toggle ON] │
│  Hors-ligne        [Toggle OFF] │
│                                 │
│  ─── COMPTE ──────────────────  │
│  [Gérer l'abonnement →]        │
│  [Exporter mes données →]      │
│  [Supprimer mon compte →]      │
│                                 │
│  ─── LÉGAL ───────────────────  │
│  [Politique de confidentialité]│
│  [Conditions d'utilisation]    │
│  Version : 2.1.4               │
│                                 │
│  ┌──────────────────────────┐   │
│  │     Se déconnecter       │   │
│  └──────────────────────────┘   │
└─────────────────────────────────┘
```

### Composants UI

#### Section Profil
- Avatar 40 dp + nom + niveau + lien vers édition profil

#### Section Apprentissage
- **Langue d'interface** : sélecteur → sheet avec liste de langues
- **Langue cible** : sélecteur (Mandarin simplifié / traditionnel)
- **Affichage caractères** : segmented control Simplifié / Traditionnel
- **Affichage pinyin** : sélecteur (Toujours / Jamais / Seulement pour les nouveaux mots)
- **Durée session** : slider 5-45 min avec snap tous les 5 min

#### Section Notifications
- **Rappel quotidien** : toggle ON/OFF
- **Heure du rappel** : time picker (visible uniquement si rappel activé)
- **Alertes streak** : toggle (notification si streak en danger)
- **Nouvelles leçons** : toggle

#### Section Application
- **Thème** : segmented control Clair / Sombre / Automatique
- **Sons** : toggle
- **Vibrations** : toggle
- **Mode hors-ligne** : toggle + info sur espace disque utilisé

#### Section Compte
- **Gérer l'abonnement** : → Premium screen ou paramètres Store natifs
- **Exporter mes données** : → modal confirmation + envoi email JSON
- **Supprimer mon compte** : → modal 2 étapes (saisie "SUPPRIMER" requise)

#### Section Légal
- Liens vers CGU et Politique de confidentialité (WebView interne)
- Numéro de version (tap × 7 → mode développeur easter egg)

### États des toggles et leur impact
| Toggle | Effet ON | Effet OFF |
|--------|----------|-----------|
| Rappel quotidien | Affiche champ heure, crée notification | Cache l'heure, annule la notification |
| Alertes streak | Envoie push si streak en danger | Aucune alerte |
| Sons | Effets sonores dans les leçons | Silence complet (hors OS) |
| Vibrations | Retours haptiques actifs | Aucun retour haptique |
| Mode hors-ligne | Lance téléchargement des leçons actuelles | Supprime les fichiers locaux (confirmation) |

### États de l'écran
| État | Comportement |
|------|-------------|
| Normal | Toutes les sections interactives |
| Sauvegarde | Indicateur discret en haut droite |
| Erreur sauvegarde | Toast rouge en bas avec retry |
| Utilisateur Premium | Section compte affiche "Premium actif jusqu'au JJ/MM" |
| Utilisateur freemium | Section compte affiche CTA "Passer à Premium" |

### Animations
- **Toggle** : transition couleur fond + thumb (200 ms, spring)
- **Sheet modale** (sélecteurs) : slide up depuis le bas (300 ms, spring)
- **Suppression compte** : progress de l'input bloque le bouton jusqu'à "SUPPRIMER" complet
- **Déconnexion** : crossFade vers l'écran de Login (400 ms)

### Sheets modales depuis Settings
| Action | Modal |
|--------|-------|
| Modifier profil | Sheet mi-écran : avatar + pseudo + bio |
| Langue d'interface | Liste de langues avec drapeaux |
| Heure rappel | Time picker natif |
| Hors-ligne désactivé | Confirmation : "Supprimer X MB ?" |
| Supprimer compte | 2 étapes : raison + saisie "SUPPRIMER" |

### Navigation
- **Entrée** : depuis Profil (icône engrenage), depuis menu
- **Vers Premium** : depuis "Gérer l'abonnement" ou CTA freemium
- **Déconnexion** : → Login screen
- **Suppression** : → Splash screen (compte effacé)
- **Liens légaux** : → WebView interne

---

## Annexe A — Design System Global

### Palette de couleurs principale
| Nom | Hex | Usage |
|-----|-----|-------|
| Rouge principal | #E53935 | CTA, actifs, streak |
| Rouge sombre | #B71C1C | Pressed / hover |
| Rouge très clair | #FFEBEE | Fond splash, accents |
| Or | #FFD700 | Étoiles, premium, récompenses |
| Vert succès | #43A047 | Validations, completion |
| Vert clair | #E8F5E9 | Fond feedback correct |
| Orange avertissement | #FB8C00 | Scores moyens, danger |
| Gris fond | #F5F5F5 | Arrière-plans écrans |
| Gris secondaire | #757575 | Labels secondaires |
| Gris bordure | #BDBDBD | Bordures champs |
| Noir texte | #212121 | Corps de texte principal |
| Blanc | #FFFFFF | Cartes, texte sur rouge |

### Typographie
| Style | Taille | Poids | Interlignes | Usage |
|-------|--------|-------|-------------|-------|
| Display | 32 sp | Bold 700 | 40 | Titres principaux |
| H1 | 28 sp | Bold 700 | 36 | Titres d'écrans |
| H2 | 22 sp | SemiBold 600 | 28 | Titres de sections |
| H3 | 18 sp | SemiBold 600 | 24 | Sous-titres |
| Body L | 16 sp | Regular 400 | 24 | Corps de texte |
| Body S | 14 sp | Regular 400 | 20 | Corps secondaire |
| Caption | 12 sp | Regular 400 | 16 | Labels, métadonnées |
| Mandarin | 36-48 sp | Regular | Auto | Caractères (Noto Sans SC) |
| Pinyin | 20 sp | Medium 500 | 28 | Translittération (rouge) |

### Composants communs réutilisables
| Composant | Propriétés |
|-----------|-----------|
| Bouton principal | Hauteur 52 dp, border-radius 12, rouge, texte blanc 16 sp bold |
| Bouton secondaire | Hauteur 44 dp, contour rouge, fond transparent, texte rouge |
| Champ texte | Outlined, label flottant, hauteur 56 dp, radius 8 |
| Carte | Fond blanc, shadow elevation 2-8, radius 12-16 |
| Toggle | Largeur 51 dp, hauteur 31 dp, style iOS natif |
| Chip | Hauteur 32 dp, radius 16, fond gris ou rouge actif |
| Barre de progression | Hauteur 8 dp, radius 4, fond gris, remplissage rouge |

### Espacements (grille de 8 dp)
- Marge écran : 16 dp
- Padding carte interne : 16 dp
- Gap entre composants : 8, 12 ou 16 dp
- Hauteur barre navigation : 56 dp + zone sécurité
- Hauteur header : 56 dp

### Icônes
- Bibliothèque : Material Design Icons 3.0 + icônes personnalisées
- Taille standard : 24 dp
- Barre de navigation inférieure : 28 dp
- Avatar par défaut : 40 dp (header), 80 dp (profil)

---

## Annexe B — Accessibilité

### Standards respectés
- WCAG 2.1 niveau AA
- Contraste texte principal : minimum 4.5:1
- Contraste texte large (>18 sp) : minimum 3:1
- Cible tactile minimum : 44×44 dp sur tous les éléments interactifs

### Support lecteurs d'écran
- VoiceOver (iOS) : labels accessibilityLabel sur tous les composants
- TalkBack (Android) : contentDescription équivalents
- Navigation clavier : ordre logique défini via accessibilityOrder

### Adaptations
- Réduction de mouvement : `useReducedMotion()` désactive les animations Lottie et réduit les transitions
- Taille de police : respect de Dynamic Type (iOS) et Font Scale (Android) — toutes les tailles en sp
- Mode contraste élevé : couleurs alternatives pour les utilisateurs ayant une déficience visuelle
- Mode daltonisme : les informations ne sont jamais transmises par la couleur seule (toujours + icône + texte)

---

## Annexe C — Performance et états de chargement

| Pattern UX | Contexte d'usage |
|------------|-----------------|
| Skeleton loaders (shimmer) | Première charge des listes, cartes, profil |
| Pull-to-refresh | Home, Leaderboard, Profil, Boutique |
| Pagination infinie | Chat MandaBot, historique de statistiques |
| Optimistic UI | Toggles paramètres, envoi message chat |
| Cache local (AsyncStorage) | Dernier état utilisateur, leçons hors-ligne |
| Retry automatique | Requêtes réseau avec backoff exponentiel (max 3 tentatives) |
| Placeholder image | Avatars et illustrations pendant le chargement |

### Temps de réponse cibles
| Action | Cible UX |
|--------|----------|
| Tap bouton → feedback visuel | < 100 ms |
| Navigation entre écrans | < 300 ms |
| Chargement données réseau | < 2 s (sinon skeleton) |
| Analyse prononciation IA | < 2 s |
| Analyse tracé écriture IA | < 1 s |

---

*Fin du document — Manda Go UX Documentation v1.0*
*Auteur : Équipe Produit Kora AI*
*Date de rédaction : Juin 2026*
*Total : 18 écrans documentés*
