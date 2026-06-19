# 07 - Mini-Jeux Éducatifs Manda Go

> Catalogue complet et détaillé des 35 mini-jeux éducatifs de l'application Manda Go.

---

## Introduction

Les 35 mini-jeux de Manda Go ont été conçus selon le principe d'"apprentissage masqué" (hidden learning) : le joueur s'engage dans une mécanique ludique tout en consolidant inconsciemment ses connaissances en chinois mandarin. Chaque jeu cible une ou plusieurs compétences linguistiques précises, s'adapte au niveau HSK de l'utilisateur, et inclut un système de scoring qui encourage la progression.

**Principes de Conception Communs à Tous les Jeux :**
- Durée courte (3-8 min) pour s'intégrer dans des sessions mobiles
- Difficulté adaptive basée sur les performances passées
- Feedback immédiat et clair sur les erreurs
- Connexion explicite avec le vocabulaire/grammaire des leçons en cours
- Système de scoring transparent avec leaderboard
- Accessibles hors-ligne une fois téléchargés

---

## Jeu 1 - Dragon Chase (龙族追逐)

**Catégorie :** Vocabulaire

**Objectif Pédagogique :**
Reconnaître rapidement les caractères chinois et leur traduction, développer la fluidité de lecture et la mémoire visuelle à court terme.

**Règles Détaillées :**
Le joueur contrôle un dragon qui court automatiquement vers la droite sur un chemin défilant. Des obstacles apparaissent sous forme de portails contenant un caractère chinois. A gauche de l'écran défile la traduction française correcte. Le joueur doit faire sauter le dragon (tap) pour passer à travers le bon portail, ou rester au sol pour éviter le mauvais. Si le dragon passe par le bon portail : gain de vitesse + XP. Si par le mauvais : le dragon ralentit et perd une vie (3 vies par partie).

La difficulté augmente progressivement :
- Niveaux 1-5 : 1 portail à la fois, 3 secondes de décision
- Niveaux 6-10 : 2 portails simultanés, 2 secondes
- Niveaux 11-15 : 3 portails, 1.5 secondes, certains faux amis
- Niveau Master : portails qui bougent, 4 choix, homophones inclus

**UX/Interface :**
- Arrière-plan : Grande Muraille défilant avec montagnes stylisées
- Dragon animé en 2D stylisé (style encre de Chine moderne)
- Portails : arches chinoises avec caractère lumineux
- HUD : score en haut, vies restantes (coeurs de jade), combo multiplier
- Effets visuels : flammes dorées sur bon portail, fumée grise sur mauvais
- Musique : drum et erhu accélèrent avec la vitesse

**Système de Scoring :**
- Portail correct : 10 pts x combo multiplier
- Combo (enchainements corrects) : x1 -> x2 -> x3 -> x5 -> x10
- Bonus de vitesse : +50% si distance parcourue en moins de 30 sec
- Distance totale en mètres : bonus final de distance x 0.5
- Score parfait (0 erreur) : bonus x2 sur total
- Score max possible par session (5 min) : ~50 000 points

**Difficulté Progressive :**
Débute avec le vocabulaire HSK 1 de l'utilisateur. Après chaque 3 sessions, un mot des leçons récentes est ajouté au pool. L'IA ajuste la vitesse selon le taux de réussite (>80% : accélère, <60% : ralentit légèrement).

**Durée Moyenne :** 4-6 minutes par partie

---

## Jeu 2 - Tone Tower (声调塔楼)

**Catégorie :** Prononciation

**Objectif Pédagogique :**
Discriminer auditivement les 4 tons + ton neutre du mandarin, associer la courbe mélodique à la représentation visuelle des tons.

**Règles Détaillées :**
Le joueur doit construire une tour de blocs. Chaque bloc tombe du ciel avec une syllabe affichée en pinyin (sans marque de ton). Le joueur entend la syllabe prononcée et doit sélectionner le bon ton parmi 4-5 boutons (ton 1, 2, 3, 4, neutre) avant que le bloc touche le sol. Un bon choix empile le bloc correctement. Un mauvais choix fait tomber le bloc à côté, créant une instabilité. Si la tour penche trop (3 erreurs consécutives), elle s'effondre.

Modes spéciaux :
- Mode "Paires Minimales" : deux syllabes identiques sauf le ton, identifier la différence
- Mode "Phrase" : entendre une phrase courte, identifier tous les tons en séquence
- Mode "Contre la Montre" : 60 secondes, empiler un maximum de blocs

**UX/Interface :**
- Vue de côté d'une tour qui monte vers le ciel (défilement vertical)
- Blocs stylisés comme briques de temple chinois
- Courbe mélodique animée visible sur le côté droit lors de la lecture audio
- 5 boutons de ton colorés et iconographiés (ex: ton 1 = flèche horizontale, ton 2 = flèche montante)
- Indicateur de stabilité de la tour (barre de stabilité)
- Arrière-plan : ciel avec nuages se modifiant selon la hauteur de la tour

**Système de Scoring :**
- Bloc correctement placé : 20 pts
- Chaîne sans erreur : bonus progressif (+5 pts par bloc supplémentaire)
- Hauteur de tour atteinte : 1 pt par bloc de hauteur
- Temps restant (mode contre-la-montre) : 10 pts par seconde restante
- Effondrement : pénalité -20% sur le score total

**Difficulté Progressive :**
- Niveau 1-3 : Tons clairement distincts, syllabes simples (ma, fa, ba)
- Niveau 4-6 : Syllabes plus complexes, introduction du ton neutre
- Niveau 7-9 : Sandhi tonal (règles de changement de ton en contexte)
- Niveau Expert : Phrases courtes, tous tons, vitesse augmentée

**Durée Moyenne :** 5-7 minutes

---

## Jeu 3 - Character Puzzle (汉字拼图)

**Catégorie :** Vocabulaire / Écriture

**Objectif Pédagogique :**
Comprendre la structure interne des caractères chinois, identifier les radicaux et composants, mémoriser la forme globale des caractères.

**Règles Détaillées :**
Un caractère cible est affiché en grand pendant 3 secondes puis se brise en 4-8 pièces de puzzle. Les pièces sont mélangées sur l'écran. Le joueur doit glisser-déposer chaque pièce à la bonne position pour reconstituer le caractère. Un indice sonore (lecture du caractère) est disponible à tout moment. En mode avancé, plusieurs caractères sont reconstituables simultanément à partir d'un pool de pièces communes.

Variantes :
- Mode "Radical Focus" : les pièces correspondent exactement aux radicaux du caractère
- Mode "Speed Puzzle" : chronomètre de 30 secondes par caractère
- Mode "Multi-Character" : 3 caractères à reconstituer en même temps, pièces mélangées entre eux
- Mode "Silhouette" : seule la silhouette du caractère est visible en fond

**UX/Interface :**
- Surface de jeu : parchemin chinois texturé
- Pièces : style bois laqué rouge avec traits en or
- Zone de dépôt : grille translucide du caractère cible
- Feedback : snap magnétique quand une pièce est proche de sa position
- Animation de complétion : caractère s'illumine et se calligraphie à nouveau
- Barre de progression : nombre de caractères complétés / objectif

**Système de Scoring :**
- Placement correct en 1er essai : 50 pts
- Placement correct en 2e essai : 30 pts
- Utilisation d'indice son : -10 pts
- Bonus de rapidité : jusqu'à +100 pts selon le temps
- Série de caractères parfaite : multiplicateur x1.5
- Score max par session : ~15 000 pts (15 caractères)

**Difficulté Progressive :**
- Niveaux 1-2 : 3-4 pièces, caractères simples (一, 二, 人, 山)
- Niveaux 3-4 : 5-6 pièces, caractères composés courants
- Niveaux 5-6 : 7-8 pièces, mode silhouette activable
- Niveau Expert : mode multi-caractères, pièces identiques partagées

**Durée Moyenne :** 5-8 minutes

---

## Jeu 4 - Stroke Master (笔顺大师)

**Catégorie :** Écriture

**Objectif Pédagogique :**
Maîtriser l'ordre des traits des caractères chinois, développer la mémoire musculaire du tracé, améliorer la lisibilité et la vitesse d'écriture.

**Règles Détaillées :**
Le joueur doit tracer un caractère en respectant scrupuleusement l'ordre des traits, avec un chronomètre qui défile. Des numéros apparaissent brièvement sur chaque trait à tracer, puis disparaissent. Le stylet (ou doigt) doit tracer chaque trait dans le bon sens. Un juge IA évalue :
1. L'ordre des traits (pénalité si inversé)
2. La direction du trait (de haut en bas, de gauche à droite pour la plupart)
3. La forme du trait (courbe, crochet, point)
4. La proportion (un trait trop long ou trop court = malus)
5. La fluidité (tracé sans hésitation = bonus)

Le mode compétitif permet de défier d'autres joueurs en temps réel, le premier à tracer correctement le caractère gagne la manche.

**UX/Interface :**
- Fond : grille chinoise traditionnelle (tian zi ge) en bleu pâle
- Pinceau animé indiquant le prochain trait
- Couleur du tracé : rouge pour le guidage, noir encre pour le tracé libre
- Numéros des traits : apparaissent 1 seconde puis disparaissent
- Retour immédiat : trait correct = flash vert, incorrect = flash rouge + vibration
- Replay disponible : revoir son tracé en ralenti comparé au tracé parfait

**Système de Scoring :**
- Tracé parfait (tous critères) : 100 pts par caractère
- Chaque erreur de trait : -10 pts
- Bonus de fluidité (tracé sans pause) : +20 pts
- Bonus de rapidité : jusqu'à +50 pts (temps < 50% du temps alloué)
- Malus d'utilisation du guide animé : -15 pts par consultation
- Série parfaite (3 caractères d'affilée à 100%) : +200 pts

**Difficulté Progressive :**
- Niveau Guidé : animation complète du tracé à copier
- Niveau Semi-Guidé : numéros des traits seulement
- Niveau Libre : caractère affiché brièvement puis tracé de mémoire
- Niveau Chronométré : 15 secondes max par caractère
- Niveau Expert : dictée (audio -> tracé de mémoire sans voir le caractère)

**Durée Moyenne :** 4-6 minutes

---

## Jeu 5 - Echo Chamber (回声室)

**Catégorie :** Prononciation

**Objectif Pédagogique :**
Développer l'oreille pour les sons du mandarin par répétition immédiate, améliorer l'intelligibilité de la prononciation, pratiquer le shadowing.

**Règles Détaillées :**
Le joueur entre dans une "chambre à écho" où une voix native prononce une syllabe, un mot, ou une phrase. Le joueur doit répéter immédiatement après (dans un délai de 2 secondes). L'IA analyse la répétition et affiche un score en temps réel. Des ondes sonores visuelles comparent la voix native (bleue) et la voix du joueur (orange). Si le score est inférieur à 70%, la chambre "rebondit" l'audio natif une nouvelle fois pour une 2e tentative.

Mode "Écho en Cascade" : le joueur répète après chaque syllabe d'une phrase, construisant progressivement la phrase complète.

Mode "Écho Miroir" : le joueur lit le pinyin à voix haute, puis l'IA native le répète pour correction immédiate.

**UX/Interface :**
- Interface circulaire : le joueur au centre, voix native sur les bords
- Ondes sonores animées en temps réel (style oscilloscope artistique)
- Score de similarité affiché en temps réel (0-100%) avec jauge colorée
- Waveform superposée : voix native vs joueur
- "Chambre" qui se remplit de lumière dorée selon le score
- Replay côte à côte disponible pour toute tentative

**Système de Scoring :**
- Score IA sur 100 par répétition
- Bonus de cohérence (score stable sur 10 répétitions) : +10%
- Progression globale de session (amélioration du score moyen) : bonus XP
- "Écho Parfait" (95+) : animation spéciale et MandaCoins bonus

**Difficulté Progressive :**
- Niveau 1 : Syllabes isolées, 1 ton à la fois
- Niveau 2 : Mots de 2 syllabes
- Niveau 3 : Phrases de 3-4 mots, vitesse normale
- Niveau 4 : Phrases de 5-8 mots, vitesse 1.1x
- Niveau Expert : Dialogues courts, vitesse 1.2x, registre naturel (liaison, réduction)

**Durée Moyenne :** 4-5 minutes

---

## Jeu 6 - Market Rush (市场冲刺)

**Catégorie :** Vocabulaire / Conversation

**Objectif Pédagogique :**
Appliquer le vocabulaire des achats, des nombres, des couleurs et des quantités dans un contexte simulé de marché traditionnel chinois.

**Règles Détaillées :**
Le joueur est un acheteur dans un marché animé. Des vendeurs (personnages NPC) affichent des marchandises avec prix et quantités en caractères chinois. Le joueur reçoit une commande en français (ex: "3 kilo de pommes et 2 bouteilles de sauce soja") et doit interagir avec les bons vendeurs dans les 60 secondes. Chaque interaction nécessite de sélectionner le bon objet, d'entrer la quantité correcte (clavier chinois de chiffres), et de négocier le prix (phrase prédéfinie à choisir parmi 3).

Mode "Vendeur" : inverser les rôles, répondre aux demandes des acheteurs NPC.

Mode "Dialogue Libre" : conversation ouverte avec un vendeur IA pour simuler une vraie transaction.

**UX/Interface :**
- Décor : marché traditionnel chinois coloré et animé (sons ambiants)
- Vendeurs : personnages ethniquement divers et expressifs
- Marchandises : photos réalistes avec étiquettes de prix en caractères
- Interface de commande : liste de courses apparaît comme un scroll chinois déroulant
- Timer : bougie qui brûle en haut de l'écran
- Foule animée en arrière-plan créant urgence visuelle

**Système de Scoring :**
- Bonne marchandise sélectionnée : 30 pts
- Quantité correcte : 20 pts
- Phrase de négociation correcte : 25 pts
- Bonus de rapidité (< 30 sec pour la commande) : +50 pts
- Commande parfaite (tout correct) : x2 sur le total
- Chaque erreur de quantité ou de marchandise : -20 pts

**Difficulté Progressive :**
- Niveau 1 : 1 marchandise, quantité chiffre simple, prix affiché en pinyin
- Niveau 2 : 2-3 marchandises, prix en caractères
- Niveau 3 : 3-5 marchandises, négociation simple, marchands pressants
- Niveau 4 : 5-8 marchandises, dialogues complets, fausse monnaie à repérer
- Niveau Expert : conversations libres, argot marchand, quantités complexes (一斤半)

**Durée Moyenne :** 5-7 minutes

---

## Jeu 7 - Manda Match (汉字记忆)

**Catégorie :** Vocabulaire

**Objectif Pédagogique :**
Mémoriser les paires caractère-traduction, renforcer la reconnaissance visuelle rapide, améliorer la mémoire de travail.

**Règles Détaillées :**
Jeu de mémoire classique revisité. Une grille de 16-36 cartes face cachée est présentée. Chaque carte a un "jumeau" : une carte avec le caractère chinois et une carte avec sa traduction française. Le joueur retourne 2 cartes par tour. Si elles forment une paire : elles restent visibles et le joueur gagne des points. Si non : elles se retournent après 1.5 secondes.

Variante "Triades" : groupes de 3 cartes (caractère + pinyin + traduction) à retrouver ensemble.

Variante "Sons" : une carte audio (prononciation) à associer à la carte caractère.

Mode "Versus" : duel contre IA ou ami en temps réel, chacun joue à son tour.

**UX/Interface :**
- Grille adaptative selon taille d'écran (4x4, 4x5, 5x6)
- Cartes : recto blanc avec caractère en rouge, verso motif de soie bleue
- Animation de retournement : flip 3D
- Paires trouvées : restent visibles avec halo doré
- Timer visible (mode chronométré) ou nombre de coups (mode classique)
- Son de correspondance : gong doux pour paire trouvée, son de bois pour raté

**Système de Scoring :**
- Paire trouvée : 100 pts
- Triade trouvée (variante) : 200 pts
- Combo (2 paires d'affilée) : +50 pts bonus par niveau de combo
- Grille complétée : 500 pts bonus
- Moins de coups = meilleur bonus (comparé à minimum théorique)
- Temps total : bonus dégressif si trop long

**Difficulté Progressive :**
- Niveau 1 : Grille 4x4 (8 paires), vocabulaire HSK 1 simple
- Niveau 2 : Grille 4x5 (10 paires), caractères similaires inclus
- Niveau 3 : Grille 5x6 (15 paires), variante triades
- Niveau 4 : Grille 6x6 (18 paires), variante sons
- Niveau Expert : Grille 6x7 (21 paires), durée limitée 90 secondes

**Durée Moyenne :** 5-8 minutes

---

## Jeu 8 - Pinyin Rain (拼音雨)

**Catégorie :** Vocabulaire / Prononciation

**Objectif Pédagogique :**
Reconnaître et taper rapidement les pinyins correspondant aux caractères affichés, renforcer la correspondance caractère-pinyin.

**Règles Détaillées :**
Des caractères chinois tombent depuis le haut de l'écran comme des gouttes de pluie. Le joueur doit taper rapidement le pinyin correct (avec ton) du caractère avant qu'il atteigne le bas de l'écran. Clavier pinyin dédié avec touches de tons. Si le caractère atteint le bas : une "flaque" se forme et réduit la zone de jeu. 5 flaques = game over.

Mode "Ouragan" : rafale de 5 caractères simultanés qui tombent à vitesse croissante.

Mode "Parapluie" : certains caractères sont protégés (pas besoin de les attraper, décision de priorisation).

**UX/Interface :**
- Arrière-plan : ville chinoise pluvieuse, vue isométrique animée
- Caractères : gouttes de pluie stylisées avec caractère incrusté (taille selon urgence)
- Clavier personnalisé avec initiales, finales et boutons de tons
- Indicateur de vitesse de chute (barre latérale)
- Flaques d'eau s'accumulant en bas de l'écran
- Effets météo qui s'intensifient selon le niveau de difficulté

**Système de Scoring :**
- Pinyin correct saisi : 50 pts
- Ton correct en plus : +25 pts (total 75 pts)
- Pinyin saisi avant que le caractère arrive à mi-écran : bonus x1.5
- Combo (5 caractères d'affilée sans erreur) : +100 pts
- Caractère manqué : pénalité -30 pts
- Survie totale (aucune flaque) : bonus 500 pts

**Difficulté Progressive :**
- Niveau 1 : Caractères simples, 1 à la fois, chute lente (10 sec)
- Niveau 2 : 2 simultanés, chute 7 sec, pinyin exigé sans ton
- Niveau 3 : 3 simultanés, chute 5 sec, ton exigé
- Niveau 4 : 4 simultanés, chute 3 sec, caractères similaires (homophones)
- Niveau Expert : 5 simultanés, chute 2 sec, caractères rares HSK avancé

**Durée Moyenne :** 4-5 minutes

---

## Jeu 9 - Grammar Builder (语法建筑师)

**Catégorie :** Grammaire

**Objectif Pédagogique :**
Construire des phrases grammaticalement correctes en chinois, comprendre les structures syntaxiques du mandarin (SVO, particules, compléments).

**Règles Détaillées :**
Le joueur reçoit des "briques" linguistiques (mots, particules, compléments) et doit les assembler pour former une phrase correcte. La phrase cible est donnée en français. Les briques tombent dans un "chantier" et le joueur les place sur une "ligne de construction". L'IA valide la phrase au fur et à mesure.

Chaque position sur la ligne de construction est étiquetée (Sujet, Prédicat, Objet, etc.) avec un code couleur. Certaines briques sont des pièges (grammaticalement incorrectes dans le contexte).

Mode "Destruction" : la phrase incorrecte est donnée, le joueur doit identifier et retirer les briques erronées.

Mode "Extension" : une phrase de base est donnée, le joueur doit l'enrichir avec les briques disponibles (compléments de temps, lieu, manière).

**UX/Interface :**
- Interface de chantier de construction : grues, échafaudages stylisés
- Briques de couleurs selon type grammatical (bleu = sujet, rouge = verbe, vert = objet, jaune = particule, violet = complément)
- "Mur" en construction qui s'élève au fur et à mesure des phrases correctes
- Tooltip sur chaque brique : explication grammaticale de sa fonction
- Validation en temps réel : mur s'illumine si phrase correcte, tremble si incorrecte
- Replay animé de la structure correcte après chaque exercice

**Système de Scoring :**
- Phrase construite correctement du 1er coup : 150 pts
- Phrase correcte au 2e essai : 100 pts
- Phrase correcte au 3e essai : 50 pts
- Bonus de rapidité : +10 pts par seconde sous le temps standard
- Structure complexe (3+ éléments) construite parfaitement : bonus x1.5
- Série de 5 phrases parfaites : +300 pts bonus

**Difficulté Progressive :**
- Niveau 1 : Phrases SVO simples, 3-4 briques, tout le vocabulaire HSK 1
- Niveau 2 : Ajout de 不/没, questions avec 吗, 5-6 briques
- Niveau 3 : Particules aspectuelles (了/过/着), 6-8 briques
- Niveau 4 : Structure 把, passif 被, propositions relatives
- Niveau Expert : Chengyu intégrés, structures classiques, 10+ briques

**Durée Moyenne :** 6-8 minutes

---

## Jeu 10 - Culture Quiz (文化问答)

**Catégorie :** Culture

**Objectif Pédagogique :**
Acquérir des connaissances culturelles sur la Chine (histoire, traditions, gastronomie, arts, géographie, philosophie) qui contextualisent et enrichissent l'apprentissage linguistique.

**Règles Détaillées :**
Quiz de 10-20 questions sur la culture chinoise, présentées sous forme de QCM (4 réponses possibles). Chaque question est accompagnée d'une image et d'un contexte textuel. Un timer de 20 secondes par question. Le joueur peut utiliser 3 jokers par partie : 50/50 (éliminer 2 mauvaises réponses), Sondage (voir les réponses des autres joueurs), Temps Supplémentaire (+10 sec).

Après chaque réponse : explication détaillée de la bonne réponse avec note culturelle et parfois un mot chinois en lien.

Thèmes couverts : Festivals et fêtes, Gastronomie, Histoire dynastique, Arts (calligraphie, peinture, musique), Philosophie (Confucianisme, Taoïsme, Bouddhisme), Géographie, Architecture, Cinéma et culture pop moderne, Inventions chinoises, Coutumes et étiquette.

**UX/Interface :**
- Design encyclopédique : fond crème, illustrations historiques style gravure
- Barre de progression sous le titre (Question X/15)
- Timer : sablier animé qui s'écoule
- 4 boutons réponse colorés (A, B, C, D) avec animation de sélection
- Feedback : vert avec explication courte si correct, rouge avec correction si incorrect
- Galerie culturelle débloquée : chaque question réussie ajoute une fiche culturelle illustrée à la collection personnelle

**Système de Scoring :**
- Réponse correcte : 100 pts
- Rapidité : +50 pts si répondu en < 5 sec, +25 pts si < 10 sec
- Sans joker sur toute la partie : bonus +200 pts
- Score parfait : bonus +500 pts
- Fiches culturelles collectées : 10 pts chacune par nouvelle fiche

**Difficulté Progressive :**
- Niveau 1 : Questions très générales (capitales, fêtes notoires, nourriture populaire)
- Niveau 2 : Questions sur dynasties, inventions majeures, personnalités historiques
- Niveau 3 : Arts, philosophie, géographie détaillée
- Niveau 4 : Histoire complexe, nuances culturelles régionales
- Niveau Expert : Faits obscurs, comparaisons culturelles, étymologies

**Durée Moyenne :** 5-7 minutes

---

## Jeu 11 - Listening Ninja (听力忍者)

**Catégorie :** Compréhension Orale

**Objectif Pédagogique :**
Développer la capacité à comprendre le chinois parlé à vitesse naturelle, identifier des mots et phrases dans un flux audio continu.

**Règles Détaillées :**
Le joueur est un ninja invisible dans un dojo. Des conversations entre personnages se déroulent autour de lui. Des mots-clés apparaissent sur l'écran (traduits en français) et le joueur doit "attraper" ces mots en tapant l'écran dès qu'il les entend dans la conversation. Trop tôt ou trop tard : raté. Un cercle de précision détermine le score de timing.

Mode "Interception" : le joueur doit mémoriser une liste de 5 mots à écouter, puis les identifier séquentiellement dans un dialogue de 2 minutes.

Mode "Dictée Ninja" : après l'écoute, le joueur doit restituer l'ordre correct des mots-clés entendus.

**UX/Interface :**
- Décor : dojo japonais/chinois hybride en nuit étoilée
- Personnages conversant en ombres chinoises animées
- Mots-cibles : rouleaux de parchemin qui tombent du plafond
- Ninja (avatar) : personnage stylisé en bas de l'écran
- Cercle de précision concentriques (or-vert-rouge) selon timing
- Waveform de l'audio affichée en arrière-plan translucide

**Système de Scoring :**
- Mot attrapé dans la zone or (timing parfait) : 100 pts
- Mot attrapé dans la zone verte (bon timing) : 60 pts
- Mot attrapé en zone rouge (timing passable) : 20 pts
- Mot raté : 0 pts + pénalité de combo
- Combo x5+ : aura ninja qui multiplie le score
- Dialogue complété sans aucun raté : +500 pts

**Difficulté Progressive :**
- Niveau 1 : Vitesse 0.7x, 3 mots-cibles simples, pauses naturelles
- Niveau 2 : Vitesse normale, 5 mots-cibles, phrases courtes
- Niveau 3 : Vitesse 1.0x, 8 mots-cibles, argot et liaisons
- Niveau 4 : Vitesse 1.1x, accents régionaux
- Niveau Expert : Vitesse 1.2x, 10 mots-cibles, conversations spontanées enregistrées in-situ

**Durée Moyenne :** 5-6 minutes

---

## Jeu 12 - Word Chain (词语接龙)

**Catégorie :** Vocabulaire

**Objectif Pédagogique :**
Activer le vocabulaire de manière productive, renforcer les associations entre mots, développer la fluidité lexicale.

**Règles Détaillées :**
Jeu de chaîne de mots : le dernier caractère du mot précédent doit être le premier du mot suivant. Le joueur reçoit un mot de départ et doit proposer un mot commençant par le dernier caractère. Contre une IA ou un autre joueur en temps réel. Chaque mot doit être du vocabulaire connu (dans le niveau HSK de l'utilisateur). Si le joueur ne trouve pas de mot en 15 secondes : il perd ce tour.

Mode "Thématique" : tous les mots de la chaîne doivent appartenir à un même champ sémantique (nourriture, transport, etc.).

Mode "Ton Contraint" : le premier mot de chaque lien doit être à un ton précis.

**UX/Interface :**
- Serpent qui grandit à chaque maillon de la chaîne
- Chaque maillon = un mot chinois affiché sur le corps du serpent
- Timer par tour : sablier qui brûle en rouge vers la fin
- Clavier de saisie optimisé pour le chinois (radicals, pinyin)
- Suggestion d'indice : tap sur l'IA pour une piste (coûte des points)
- Classement en temps réel si mode multijoueur

**Système de Scoring :**
- Mot correct : 50 pts + (longueur du mot en caractères x 10 pts)
- Mot rare (HSK avancé) : bonus x2
- Mot de 4+ caractères (chengyu) : bonus x3
- Chaîne de 10 mots sans aide : +200 pts bonus
- Victoire en duel IA : +300 pts

**Difficulté Progressive :**
- Niveau 1 : Mots de 2 caractères, 20 secondes par tour, aides disponibles
- Niveau 2 : Mots de 2-3 caractères, 15 secondes
- Niveau 3 : Mots de 2-4 caractères, 12 secondes, thèmes imposés
- Niveau 4 : Tous mots connus, 10 secondes, chengyu bonus
- Niveau Expert : Duel humain ou IA avancée, 8 secondes

**Durée Moyenne :** 4-6 minutes

---

## Jeu 13 - Flashcard Duel (单词决斗)

**Catégorie :** Vocabulaire

**Objectif Pédagogique :**
Tester la connaissance du vocabulaire en conditions de compétition, renforcer la rapidité de reconnaissance lexicale.

**Règles Détaillées :**
Duel 1v1 (contre IA ou autre joueur) : un caractère apparaît sur l'écran partagé. Les deux joueurs ont chacun une liste de 4 traductions possibles. Le premier à cliquer la bonne réponse gagne la manche. Si les deux appuient simultanément (< 100ms d'écart) : manche nulle. Premier à 7 manches gagne le duel.

Mode "Bluff" : chaque joueur peut miser des "jetons" sur sa réponse. La confiance est récompensée.

Mode "Captain" : équipes de 2 joueurs, communication de stratégie possible via emojis prédéfinis.

**UX/Interface :**
- Écran divisé verticalement : avatar et zone de réponse de chaque côté
- Caractère central lumineux entre les deux joueurs
- Buzzer animé : doigt qui appuie sur un bouton géant
- Indicateur de latence réseau (pour équité)
- Score de manches : 7 étoiles à remplir de chaque côté
- Animations de célébration / déception pour chaque manche

**Système de Scoring :**
- Manche gagnée : 100 pts
- Manche gagnée en < 1 seconde : +50 pts
- Duel complet gagné (7-0) : bonus +500 pts
- Duel gagné à la belle (7-6) : bonus +200 pts
- Streak de victoires en duel (5 duels gagnés) : +300 pts

**Difficulté Progressive :**
- Niveau 1 : Vocabulaire HSK 1, 4 choix très distincts, IA lente (2 sec)
- Niveau 2 : HSK 1-2, choix plus proches, IA normale (1 sec)
- Niveau 3 : HSK 1-3, faux amis inclus, IA rapide (0.7 sec)
- Niveau 4 : HSK 1-4, homophones et quasi-synonymes, IA experte
- Niveau Expert : HSK complet, IA de niveau natif simulé

**Durée Moyenne :** 5-8 minutes (selon déroulement du duel)

---

## Jeu 14 - Sentence Scramble (句子解谜)

**Catégorie :** Grammaire

**Objectif Pédagogique :**
Comprendre et appliquer l'ordre des mots en chinois mandarin, distinguer les structures syntaxiques du mandarin vs français.

**Règles Détaillées :**
Des mots sont affichés dans le désordre (style magnets sur réfrigérateur). Le joueur doit les réordonner pour former la phrase correcte correspondant à la traduction française fournie. Les mots peuvent être glissés-déposés sur une ligne de reconstruction. Validation immédiate dès que tous les mots sont placés.

Variante "Phrase à Trous" : la structure est partiellement donnée, seuls 2-3 mots sont à replacer.

Variante "Multi-Phrases" : 3 phrases mélangées ensemble, trier et reconstruire chacune.

Variante "Logique" : pas de traduction fournie, le joueur déduit le sens du contexte pour ordonner correctement.

**UX/Interface :**
- Mots sur tuiles colorées magnétisables (style carrelage de cuisine)
- Ligne de reconstruction avec emplacements numérotés
- Traduction cible affichée en haut, bien visible
- Couleur des tuiles par type grammatical (bleu, rouge, vert...)
- Validation visuelle : ligne tremble si incorrecte, s'illumine si correcte
- Hint disponible : surligner le prochain mot à placer (coûte 10 MandaCoins)

**Système de Scoring :**
- Phrase correcte du 1er essai : 150 pts
- Du 2e essai (après un hint) : 100 pts
- Du 3e essai : 50 pts
- Bonus vitesse : -2 pts par seconde utilisée, max -50 pts de pénalité
- Série de 5 phrases parfaites : +250 pts
- Placement parfait du premier mot = bonus +20 pts

**Difficulté Progressive :**
- Niveau 1 : 3-4 mots, SVO simple, HSK 1
- Niveau 2 : 4-5 mots, inclusion de 不/很/也
- Niveau 3 : 5-7 mots, particules, temps et lieu
- Niveau 4 : 7-9 mots, structures complexes (把/被)
- Niveau Expert : 9-12 mots, chengyu, structures classiques

**Durée Moyenne :** 5-7 minutes

---

## Jeu 15 - Radical Hunt (部首猎人)

**Catégorie :** Vocabulaire / Écriture

**Objectif Pédagogique :**
Identifier les radicaux chinois dans les caractères, comprendre comment les radicaux donnent des indices sémantiques ou phonétiques, enrichir la stratégie de mémorisation.

**Règles Détaillées :**
Un radical est affiché (ex: 氵eau). Le joueur doit trouver et taper tous les caractères contenant ce radical parmi 20-30 caractères affichés dans une grille. Un chronomètre de 60 secondes. Des personnages (chasseurs) animés traquent les caractères sur l'écran.

Mode "Famille de Mots" : à partir du radical, deviner le sens des caractères inconnues (activité méta-cognitive).

Mode "Radical Inconnu" : un caractère complexe est montré, le joueur doit identifier son radical parmi 5 propositions.

**UX/Interface :**
- Grille de caractères : forêt de caractères en arrière-plan, style jungle
- Radical mis en évidence : encadré en or, légèrement plus grand
- Personnage chasseur : archer animé qui "tire" sur les bons caractères
- Timer : torche qui diminue
- Score en temps réel avec animation de particules sur chaque hit
- En fin de partie : galerie des radicaux découverts avec mnémoniques

**Système de Scoring :**
- Caractère contenant le radical trouvé : 30 pts
- Pas de mauvais tap : bonus de précision +100 pts en fin
- Tous les caractères trouvés avant 30 sec : bonus x2
- Radical rare identifié (>15 traits) : +50 pts bonus
- 10 radicaux différents découverts en une session : badge spécial

**Difficulté Progressive :**
- Niveau 1 : Radicaux très communs (氵, 木, 口, 日), 12 caractères max
- Niveau 2 : 20 radicaux courants, 18 caractères
- Niveau 3 : 50 radicaux, 25 caractères, faux amis visuels inclus
- Niveau 4 : Radicaux obscurs, 30 caractères, mode "famille de mots"
- Niveau Expert : Tous radicaux du Kangxi (214), 35 caractères, mode radical inconnu

**Durée Moyenne :** 4-5 minutes

---

## Jeu 16 - Tone Surfer (声调冲浪者)

**Catégorie :** Prononciation

**Objectif Pédagogique :**
Visualiser et reproduire les courbes mélodiques des 4 tons, développer la conscience prosodique, entraîner le contrôle vocal précis.

**Règles Détaillées :**
Le joueur contrôle un surfeur qui "surfe" sur les vagues sonores. La vague représente la courbe mélodique du ton d'une syllabe. Le joueur doit chanter/vocaliser le son dans le microphone pour guider le surfeur sur la vague. Plus le joueur suit précisément la courbe F0 attendue, plus le surfeur reste sur la vague et avance. S'il dévie trop, le surfeur tombe à l'eau.

Une syllabe à la fois. La vague est affichée 1 seconde avant pour permettre la préparation. La courbe du joueur est tracée en temps réel sur la vague.

**UX/Interface :**
- Ocean stylisé, vagues de sons (formes de tons visualisées)
- Surfeur : personnage chibi en tenue de surf avec drapeau à 5 étoiles
- Vague = courbe mélodique du ton (collines pour ton 3, ligne droite haute pour ton 1, etc.)
- Oscilloscope discret en haut montrant la fréquence vocale en temps réel
- Score de précision en % affiché dans une bulle
- Applaudissements de mouettes (pour score >90%)

**Système de Scoring :**
- Corrélation F0 joueur/vague > 90% : 100 pts (Parfait)
- Entre 75-90% : 70 pts (Très Bien)
- Entre 60-75% : 40 pts (Bien)
- < 60% : 0 pts + replay audio du ton correct
- Série de 5 tons parfaits : +150 pts bonus
- Série de 4 tons différents parfaits (ton 1 à 4) : badge "Maître des Vagues"

**Difficulté Progressive :**
- Niveau 1 : Ton 1 seulement (le plus facile), syllabes simples
- Niveau 2 : Tons 1 et 4 (plus différents entre eux)
- Niveau 3 : Les 4 tons, syllabes variées
- Niveau 4 : Tons en contexte de mots (2 syllabes, sandhi possible)
- Niveau Expert : Phrases courtes, tons naturels, vitesse normale

**Durée Moyenne :** 4-5 minutes

---

## Jeu 17 - HSK Sprint (汉语水平冲刺)

**Catégorie :** Vocabulaire

**Objectif Pédagogique :**
Passer en revue rapidement le vocabulaire d'un niveau HSK entier, identifier les lacunes, se préparer aux examens officiels.

**Règles Détaillées :**
Sprint chronométré de 5 minutes à travers tout le vocabulaire d'un niveau HSK. Les mots sont présentés en flashcards rapides. Le joueur doit appuyer sur VERT (connais) ou ROUGE (ne connais pas). En fin de sprint, un rapport détaillé montre les lacunes identifiées et les programme automatiquement en révision SRS prioritaire.

Mode "Exam Simulator" : simulation des conditions d'examen HSK officiel (temps, format, score seuil).

Mode "Weak Words" : uniquement les mots ayant un taux d'erreur élevé dans l'historique.

**UX/Interface :**
- Interface de stade athlétique : piste avec marqueurs de distance
- Flashcard au centre : personnage qui court
- Boutons VERT/ROUGE en bas (grands, facilement cliquables)
- Compteur de vitesse : mots par minute
- Graphique circulaire de progression : mots vus / total du niveau
- Rapport final : camembert "maîtrisés / en cours / à réviser"

**Système de Scoring :**
- Mot correct évalué : 10 pts
- Précision finale (comparée avec résultats réels des sessions suivantes) : bonus
- Session complète (tous les mots du niveau vus) : badge "HSK X Traversé"
- Amélioration d'un sprint à l'autre : bonus XP de progression

**Difficulté Progressive :**
- Sprint HSK 1 : 150 mots en 5 min (30 mots/min)
- Sprint HSK 2 : 150 nouveaux mots
- Sprint HSK 3-6 : packs de 100-150 mots thématiques
- Mode "Ultra Sprint" : 200 mots en 5 minutes pour apprenants avancés

**Durée Moyenne :** 5 minutes fixes (sprint chronométré)

---

## Jeu 18 - Hanzi Artist (汉字艺术家)

**Catégorie :** Écriture / Culture

**Objectif Pédagogique :**
Pratiquer le tracé de caractères de manière créative et artistique, comprendre l'esthétique calligraphique, développer l'expression personnelle via les sinogrammes.

**Règles Détaillées :**
Mode créatif de tracé de caractères. Le joueur choisit un pinceau (8 styles disponibles), une couleur d'encre, et un fond de papier (blanc, parchemin, bambou). Il trace des caractères de son choix (dans son vocabulaire connu) ou suit des modèles progressifs. L'IA évalue la qualité artistique en plus de la précision technique. Les créations peuvent être partagées dans la galerie communautaire.

Défis artistiques hebdomadaires : un thème (ex: "Les saisons en 4 caractères"), une contrainte (pinceau sec, style seal script), vote communautaire.

Mode "Copie de Maîtres" : reproduire des oeuvres de calligraphes célèbres (Wang Xizhi, Su Shi) et comparer.

**UX/Interface :**
- Interface épurée style atelier de calligraphie
- Outils : 8 pinceaux (fin, épais, sec, mouillé, texturé, multicolore...) + gomme + undo
- Palette de 20 couleurs d'encre + mode "encre traditionnelle"
- Zone de dessin : papier texturé avec grain réaliste
- Score artistique affiché discrètement (n'interrompt pas la créativité)
- Galerie personnelle : grille des oeuvres précédentes, partage en 1 tap

**Système de Scoring :**
- Précision des traits : 0-50 pts (technique)
- Score artistique IA (composition, proportions esthétiques) : 0-30 pts
- Votes communautaires reçus (si partagé) : 1 pt par like, max +100 pts
- Défi hebdomadaire complété : +200 pts + badge
- Série de 7 jours de création : badge "Artiste Régulier"

**Difficulté Progressive :**
- Mode Guidé : tracé entièrement guidé, pinceaux assistés
- Mode Semi-Guidé : modèles transparents à suivre
- Mode Libre : création totalement libre
- Mode Maître : contraintes stylistiques imposées (script sceau, style cursif)
- Mode Compétition : défis communautaires avec votes

**Durée Moyenne :** 5-15 minutes (mode créatif ouvert)

---

## Jeu 19 - Conversation Roulette (对话轮盘)

**Catégorie :** Vocabulaire / Grammaire / Conversation

**Objectif Pédagogique :**
Pratiquer des scénarios de conversation variés et imprévisibles, développer l'adaptabilité linguistique, consolider le vocabulaire dans des contextes multiples.

**Règles Détaillées :**
Une roulette détermine aléatoirement un scénario de conversation parmi 50 situations différentes. Le joueur a 10 secondes pour lire la situation, puis entre en conversation directe avec MandaBot dans ce contexte. La durée est de 3-5 échanges minimum. L'IA évalue la pertinence des réponses, la grammaire et le vocabulaire utilisé.

Exemples de scénarios : Demander son chemin à un policier, commander au restaurant, appel téléphonique à un médecin, interview d'embauche, marchander au marché, consoler un ami, passer une commande en ligne, décrire un accident...

Mode "Hot Potato" : à deux joueurs, la roulette désigne le scénario et ils alternent les réponses, l'IA note les deux.

**UX/Interface :**
- Grande roulette animée avec icônes des situations
- Spin animé avec son de roulette
- Interface chat ensuite : bulles de dialogue, avatar MandaBot
- Score en cours affiché latéralement (pour ne pas perturber la fluidité)
- Suggestions de vocabulary hint disponibles (coût en points)
- Rapport post-conversation : points forts, à améliorer, vocabulaire utile non utilisé

**Système de Scoring :**
- Pertinence de chaque réponse : 0-30 pts
- Qualité grammaticale : 0-20 pts
- Vocabulaire avancé utilisé : +10 pts par mot HSK+ du niveau
- Conversation complétée sans abandon : +100 pts
- Improvisation (scénario difficile réussi) : bonus x1.5

**Difficulté Progressive :**
- Niveau 1 : Scénarios simples (salutations, commandes basiques), vocabulaire HSK 1-2
- Niveau 2 : Scénarios quotidiens (transport, shopping), HSK 2-3
- Niveau 3 : Scénarios professionnels et sociaux, HSK 3-4
- Niveau 4 : Scénarios imprévus et complexes, HSK 4-5
- Niveau Expert : Scénarios formels, argot, situations d'urgence, HSK 5-6

**Durée Moyenne :** 5-7 minutes

---

## Jeu 20 - Number Ninja (数字忍者)

**Catégorie :** Vocabulaire

**Objectif Pédagogique :**
Maîtriser les chiffres et nombres en chinois de 1 à 1 000 000 000, les systèmes de numération chinois (10 000 = 万, 100 000 000 = 亿).

**Règles Détaillées :**
Le joueur est un ninja des maths. Des ennemis (petits démons) apparaissent portant des nombres en caractères chinois. Le joueur doit résoudre des opérations mentales simples (+, -, x) affichées en chinois et taper sur l'ennemi qui porte le bon résultat. Si l'ennemi atteint la base : une vie perdue (3 vies).

Mode "Chiffres Chinois" : transformer des chiffres arabes en caractères chinois (1234 -> 一千二百三十四).

Mode "Monnaie" : calculer des prix en yuans en utilisant la lecture chinoise des chiffres.

Mode "Dates" : lire et comprendre dates et heures en chinois.

**UX/Interface :**
- Scène de bataille de ninjas : dojo fantastique nocturne
- Ennemis : petits yokai portant des lanternes avec nombres
- Ninja (avatar) : héros stylisé avec shuriken numérotés
- Opération en cours : fond rouge avec équation en grand
- Effets de coup : éclairs et étincelles numériques
- Combo counter : multiplicateur qui monte avec les victoires successives

**Système de Scoring :**
- Ennemi correct éliminé : 20 pts
- Bonus de rapidité (< 3 sec) : +10 pts
- Combo x5 : +50 pts bonus
- Base préservée (0 ennemi passé) : +200 pts
- Niveau parfait : x2 sur le score total

**Difficulté Progressive :**
- Niveau 1 : Chiffres 1-10, additions simples
- Niveau 2 : Chiffres 1-100, additions et soustractions
- Niveau 3 : 1-10 000, système 万, multiplications simples
- Niveau 4 : Grands nombres, système 亿, divisions
- Niveau Expert : Nombres complexes, fractions, pourcentages, prix en yuan

**Durée Moyenne :** 4-5 minutes

---

## Jeu 21 - Story Builder (故事建造者)

**Catégorie :** Grammaire / Vocabulaire

**Objectif Pédagogique :**
Développer la capacité de narration en chinois, utiliser les connecteurs logiques et temporels, construire un discours cohérent.

**Règles Détaillées :**
Le joueur co-crée une histoire avec MandaBot. L'IA commence par une phrase d'accroche, le joueur ajoute la suivante, et ainsi de suite. Contraintes grammaticales imposées à chaque tour (ex: "utiliser 然后 dans ta phrase", "introduire un personnage avec 有一个"). L'histoire est illustrée automatiquement par des images générées.

Mode "Story Prompt" : l'IA donne un titre et 3 mots-clés à intégrer, le joueur construit l'histoire seul.

Mode "Repair" : une histoire avec erreurs est fournie, le joueur la corrige et l'améliore.

**UX/Interface :**
- Parchemin qui se déroule verticalement à chaque phrase ajoutée
- Illustrations générées style peinture chinoise pour chaque scène
- Contrainte grammaticale affichée dans un cadre rouge en haut
- Clavier avec suggestions adaptées à la contrainte
- Bouton "Demander un indice" avec hint contextuel de MandaBot
- Export de l'histoire complète sous forme de livre illustré

**Système de Scoring :**
- Phrase grammaticalement correcte : 50 pts
- Contrainte respectée : +30 pts
- Vocabulaire avancé utilisé : +15 pts
- Cohérence narrative (évaluée par IA) : jusqu'à +50 pts
- Histoire complète (min 10 phrases) : bonus +300 pts

**Difficulté Progressive :**
- Niveau 1 : Phrases simples, connecteurs de base (然后, 但是), 5 phrases
- Niveau 2 : Descriptions et adjectifs, 7 phrases, connecteurs temporels
- Niveau 3 : Dialogue dans l'histoire, 10 phrases, structures complexes
- Niveau 4 : Récit non-linéaire (flashback), 12 phrases, registres variés
- Niveau Expert : Écriture créative libre, chengyu obligatoires, 15+ phrases

**Durée Moyenne :** 7-10 minutes

---

## Jeu 22 - Idiom Explorer (成语探险)

**Catégorie :** Culture / Vocabulaire

**Objectif Pédagogique :**
Apprendre les chengyu (成语 - expressions idiomatiques de 4 caractères) et leur histoire, comprendre les allusions culturelles dans le langage courant.

**Règles Détaillées :**
Le joueur est un aventurier explorant une bibliothèque ancienne. Chaque salle contient un chengyu. L'exploration se déroule en 3 étapes : 1) Lire l'histoire (anecdote historique) du chengyu en 5 lignes illustrées. 2) Trouver le bon sens parmi 4 propositions. 3) Utiliser le chengyu dans une phrase construite (drag & drop ou saisie libre).

Mode "Bataille de Chengyu" : duel avec un ami, chacun doit expliquer un chengyu tiré au sort.

Mode "Contexte" : un texte est affiché, le joueur doit identifier quel chengyu s'y applique.

**UX/Interface :**
- Bibliothèque ancienne en 3D isométrique
- Chaque salle = un thème (amour, guerre, sagesse, nature...)
- Parchemins animés qui se déroulent pour l'histoire du chengyu
- 4 caractères du chengyu affichés en calligraphie somptueuse
- Carte de la bibliothèque : salles débloquées = couleur, verrouillées = gris
- Encyclopédie personnelle : tous les chengyu appris avec exemples

**Système de Scoring :**
- Histoire lue : 20 pts
- Sens correct trouvé (1er essai) : 50 pts
- Phrase correcte construite : 80 pts
- Chengyu spontanément utilisé dans MandaBot (hors jeu) : 200 pts bonus
- 10 chengyu appris : badge "Explorateur Littéraire"

**Difficulté Progressive :**
- Niveau 1 : 20 chengyu très courants (马到成功, 一石二鸟...)
- Niveau 2 : 50 chengyu HSK 5-6, histoires plus longues
- Niveau 3 : 100 chengyu, mode contexte activé
- Niveau 4 : Chengyu obscurs, nuances de sens multiples
- Niveau Expert : Xiehouyu (devinettes), yanyu (proverbes), création de phrases complexes

**Durée Moyenne :** 6-8 minutes

---

## Jeu 23 - Pronunciation Duel (发音决斗)

**Catégorie :** Prononciation

**Objectif Pédagogique :**
Améliorer la précision phonétique sous pression, pratiquer des sons difficiles en compétition stimulante.

**Règles Détaillées :**
Duel 1v1 de prononciation (contre IA ou autre joueur). Chaque joueur prononce le même mot/phrase dans son microphone. L'IA compare les deux enregistrements et proclame le vainqueur selon :
- Précision des tons (40%)
- Clarté des phonèmes (40%)
- Fluidité et rythme (20%)

5 manches, le joueur gagnant 3 manches remporte le duel. En cas d'égalité sur une manche : manche rejouer.

Mode "Catégorie de Sons" : le duel se focalise sur une difficulté spécifique (initiales rétroflexes, finales nasales, ton 3 vs ton 2...).

**UX/Interface :**
- Arène de duel : scène de ring stylisée avec lanternes chinoises
- Deux avatars face à face avec barres de vie
- Microphone géant au centre qui s'active en alternance
- Waveform des deux enregistrements affichée côte à côte
- Résultat IA : barre de score avec vainqueur mis en évidence
- Replay des deux prononciations disponible en fin de manche

**Système de Scoring :**
- Manche gagnée : 100 pts
- Score de précision phonétique perso (0-100) : bonus en pts
- Duel gagné 3-0 : +300 pts bonus
- Manche "parfaite" (score 95+) : +50 pts supplémentaires
- Streak de victoires en duel (5) : badge "Maître de la Voix"

**Difficulté Progressive :**
- Niveau 1 : Syllabes isolées, sons faciles, IA avec marge de tolérance élevée
- Niveau 2 : Mots de 2 syllabes, sons intermédiaires, IA standard
- Niveau 3 : Phrases courtes, tolérance réduite
- Niveau 4 : Phrases naturelles avec liaisons et réductions
- Niveau Expert : Discours rapide, accents régionaux, IA de niveau natif

**Durée Moyenne :** 6-8 minutes

---

## Jeu 24 - Speed Reader (快速阅读)

**Catégorie :** Lecture

**Objectif Pédagogique :**
Développer la vitesse de lecture en chinois, habituer l'oeil aux blocs de caractères, améliorer la compréhension globale sans décodage syllabe par syllabe.

**Règles Détaillées :**
Un texte est affiché progressivement, un segment à la fois (de 1 mot à 1 phrase), avec un timing contrôlé. Le joueur lit au rythme imposé, puis répond à des questions de compréhension à la fin. Objectif : lire de plus en plus vite tout en maintenant la compréhension.

Mode "RSVP" (Rapid Serial Visual Presentation) : les mots s'affichent un à un très rapidement au centre de l'écran.

Mode "Scan" : un texte entier est affiché 30 secondes, le joueur doit mémoriser un maximum d'informations.

Mode "Skimming" : identifier le thème principal d'un texte en 15 secondes.

**UX/Interface :**
- Fond blanc épuré, police claire et grande
- Indicateur de WPM (mots par minute) en temps réel
- Zone de focus visuel : ligne surlignée active
- Questions à choix multiples après chaque passage
- Graphique de progression de vitesse vs précision
- "Zone verte" idéale affichée (vitesse optimale selon l'utilisateur)

**Système de Scoring :**
- WPM x taux de compréhension (%) = score de base
- Exemple : 80 WPM x 90% = 72 pts de base
- Amélioration par rapport à la session précédente : +10% sur le score
- Question difficile réussie : +50 pts
- Lecture sans pinyin (mode avancé) : x1.5

**Difficulté Progressive :**
- Niveau 1 : Textes HSK 1-2, 30 WPM, pinyin intégral, 2 questions
- Niveau 2 : Textes HSK 2-3, 50 WPM, pinyin au tap, 4 questions
- Niveau 3 : Textes HSK 3-4, 80 WPM, sans pinyin, 6 questions
- Niveau 4 : Textes HSK 4-5, 120 WPM, mode RSVP, 8 questions
- Niveau Expert : Textes HSK 5-6, 200 WPM, mode scan, 10 questions complexes

**Durée Moyenne :** 4-6 minutes

---

## Jeu 25 - Context Detective (语境侦探)

**Catégorie :** Vocabulaire / Grammaire

**Objectif Pédagogique :**
Déduire le sens de mots inconnus par le contexte, développer les stratégies de lecture intelligente, renforcer les compétences d'inférence.

**Règles Détaillées :**
Le joueur est un détective. Un texte est présenté avec un mot/expression souligné en rouge (inconnu). Le joueur doit deviner le sens en utilisant le contexte (mots voisins, structure de la phrase, thème du texte). 4 indices progressifs disponibles (chaque indice coûte des points). Le suspect (le bon sens) doit être identifié parmi 4 pistes.

Mode "Double Sens" : un mot a deux sens possibles selon le contexte, le joueur doit les identifier tous les deux.

Mode "Faux Amis" : mots qui ressemblent à des mots connus mais ont un sens différent.

**UX/Interface :**
- Style policier noir et blanc avec accents rouges
- Loupe animée sur le mot mystère
- Carnet d'enquête : indices accumulés au fil du jeu
- Tableau de suspects (4 traductions possibles) style moodboard
- Timer : réveil à aiguille qui tic-tac
- Révélation dramatique avec animation "RÉSOLU" ou "RATÉ"

**Système de Scoring :**
- Sens correct trouvé sans indice : 200 pts
- Avec 1 indice : 150 pts
- Avec 2 indices : 100 pts
- Avec 3 indices : 50 pts
- 5 mystères résolus sans indice : badge "Super Détective"
- Série de 3 doubles sens trouvés : bonus +300 pts

**Difficulté Progressive :**
- Niveau 1 : Contexte très clair, 1 mot inconnu par texte, vocabulaire HSK adjacent
- Niveau 2 : Contexte modéré, 2 mots inconnus, faux amis légers
- Niveau 3 : Contexte subtil, doubles sens, expressions idiomatiques simples
- Niveau 4 : Textes authentiques (non adaptés), jeux de mots culturels
- Niveau Expert : Textes littéraires, allusions classiques, argot contemporain

**Durée Moyenne :** 5-6 minutes

---

## Jeu 26 - Measure Word Master (量词大师)

**Catégorie :** Grammaire

**Objectif Pédagogique :**
Maîtriser les classificateurs (量词 - mots mesure) du chinois mandarin, comprendre pourquoi un objet prend un certain classificateur.

**Règles Détaillées :**
Des objets apparaissent sur l'écran (photos réalistes). Le joueur doit choisir le bon classificateur parmi une sélection. Si correct, l'objet rejoint une "collection" organisée par classificateur. Si incorrect, une explication apparaît expliquant pourquoi ce classificateur est utilisé.

Mode "Tri" : trier 20 objets dans les bonnes catégories de classificateurs (glisser-déposer).

Mode "Phrase Complète" : construire "一 [mesure] [objet]" en entier.

Mode "Combat de Mesures" : face à un adversaire, identifier le bon classificateur plus vite.

**UX/Interface :**
- Interface de musée : vitrines d'objets classés
- Étiquettes de vitrines : classificateurs en grand avec exemples
- Objets : photos HD avec effet "floating"
- Feedback : son différent selon classificateur (ex: son d'eau pour 条, son de papier pour 张)
- Collection personnelle : galerie de ses "trouvailles" par classificateur
- Encyclopédie des classificateurs : ouverte après chaque découverte

**Système de Scoring :**
- Bon classificateur du 1er essai : 50 pts
- Du 2e essai : 30 pts
- Série de 5 corrects : +100 pts
- Classificateur rare correctement identifié (副, 阵, 缕...) : +50 pts bonus
- Compléter une collection de classificateur : badge + 200 pts

**Difficulté Progressive :**
- Niveau 1 : 个 (universel), 只, 本 - 10 objets communs
- Niveau 2 : 张, 条, 块, 杯 - étendre aux objets courants
- Niveau 3 : 20 classificateurs, objets abstraits (une idée = 个)
- Niveau 4 : 40 classificateurs, contextes spéciaux (军队 = 支/队)
- Niveau Expert : 60+ classificateurs, nuances régionales, formels vs informels

**Durée Moyenne :** 5-6 minutes

---

## Jeu 27 - Time Traveler (时间旅行者)

**Catégorie :** Grammaire / Vocabulaire

**Objectif Pédagogique :**
Maîtriser les expressions temporelles en chinois (aujourd'hui, hier, dans 3 jours, le 15 mars...), comprendre le système de dates chinoises, les expressions de durée et de fréquence.

**Règles Détaillées :**
Le joueur est un voyageur temporel dans une machine. L'interface montre une "ligne du temps" et des événements. Des scénarios sont présentés ("L'événement X s'est produit il y a 3 semaines et 2 jours") et le joueur doit exprimer cela en chinois. Différents types de questions : expressions de date, de durée, de fréquence, de moment relatif.

Mode "Calendrier Chinois" : apprendre les jours de la semaine, les mois, les fêtes calendaires.

Mode "Futur/Passé" : transformer des phrases du présent au passé ou futur avec les bons marqueurs temporels.

**UX/Interface :**
- Machine à voyager dans le temps style steampunk-chinois
- Ligne du temps horizontale avec événements marqués
- Calendrier lunaire intégré (optionnel à consulter)
- Expressions temporelles qui "volent" autour de la machine
- Animations de saut temporel entre les questions
- Collection de "timbres temporels" : chaque expression apprise = un timbre

**Système de Scoring :**
- Expression correcte : 60 pts
- Nuance temporelle complexe réussie : +30 pts bonus
- Série de 5 expressions : +100 pts
- Compléter le "passeport temporel" (toutes expressions de base) : badge

**Difficulté Progressive :**
- Niveau 1 : 今天, 明天, 昨天, jours de la semaine
- Niveau 2 : Semaines, mois, expressions relatives (上个月, 下周)
- Niveau 3 : Durées (三天后, 已经两年了), fréquence (每天, 偶尔)
- Niveau 4 : Expressions formelles (就...了, 已...快), dates précises
- Niveau Expert : Calendrier lunaire, expressions littéraires temporelles

**Durée Moyenne :** 5-6 minutes

---

## Jeu 28 - Restaurant Simulator (餐厅模拟器)

**Catégorie :** Vocabulaire / Conversation

**Objectif Pédagogique :**
Maîtriser le vocabulaire de la restauration (commander, demander, payer, se plaindre), pratiquer des dialogues fonctionnels en contexte immersif.

**Règles Détaillées :**
Le joueur joue alternativement le rôle d'un client ou d'un serveur dans un restaurant chinois. En mode "Client" : déchiffrer un menu en caractères, commander en mandarin via dialogue avec le serveur (IA), demander des modifications, réclamer l'addition, payer en calculant le bon montant. En mode "Serveur" : comprendre les commandes des clients (IA), les retranscrire correctement, gérer les plaintes.

Mode "Chef Étoilé" : connaître les ingrédients (原料) et techniques culinaires (烹饪方法) chinoises.

**UX/Interface :**
- Restaurant 3D isométrique animé avec atmosphère chinoise
- Menus authentiques : noms de plats en caractères (avec photos)
- Serveur/client IA expressif avec bulles de dialogue
- Caisse enregistreuse pour calculer le total
- Jauge de satisfaction client (si mode serveur)
- Recettes débloquées : collection de recettes chinoises authentiques

**Système de Scoring :**
- Commande correctement passée : 100 pts
- Modification demandée correctement : +50 pts
- Addition calculée sans erreur : +75 pts
- Aucune erreur de compréhension : bonus +150 pts
- Conversation fluide (moins de 10 sec par échange) : x1.3

**Difficulté Progressive :**
- Niveau 1 : Menu avec pinyin, commande basique, plats simples
- Niveau 2 : Menu en caractères uniquement, modifications simples
- Niveau 3 : Plats complexes, allergies à signaler, addition en yuan
- Niveau 4 : Gestion des problèmes (mauvaise commande, attente longue)
- Niveau Expert : Restaurant gastronomique, vin chinois (baijiu), étiquette formelle

**Durée Moyenne :** 6-8 minutes

---

## Jeu 29 - Dragon Ball (龙珠问答)

**Catégorie :** Vocabulaire / Grammaire

**Objectif Pédagogique :**
Révision rapide et intensive de tous types de connaissances linguistiques, entraîner la rapidité de rappel mnésique.

**Règles Détaillées :**
Questions rapides en rafale (style quiz radiophonique). Une "boule de dragon" est en jeu. Le joueur et l'IA s'affrontent pour la capturer. Chaque bonne réponse rapide fait avancer le joueur vers la boule. Chaque erreur fait avancer l'IA. 20 questions, le premier à 10 bonnes réponses gagne la boule.

Questions mélangent tous types : vocabulaire, ton, classificateur, grammaire, culture, chengyu...

Mode "7 Boules" : collecter les 7 boules de dragon en 7 sessions (une thématique différente chacune) pour débloquer un bonus légendaire.

**UX/Interface :**
- Style manga/anime inspiré mais original (dragon volant, boule étoilée)
- Questions sur cartes qui "tombent" du dragon
- Timer par question : 5 secondes maximum
- Barre de progression : joueur vs IA (boule au milieu)
- Animations de combat : le dragon réagit aux bonnes/mauvaises réponses
- Boule collectée : animation épique de récupération

**Système de Scoring :**
- Bonne réponse en < 2 sec : 50 pts
- Bonne réponse en 2-4 sec : 30 pts
- Bonne réponse en 4-5 sec : 10 pts
- Mauvaise réponse : 0 pts
- Boule capturée : +500 pts
- 7 boules collectées (toutes thématiques) : 5000 pts + badge légendaire

**Difficulté Progressive :**
- Niveau 1 : Questions uniquement HSK 1-2, temps 5 sec, 4 choix
- Niveau 2 : HSK 1-3, temps 4 sec, 4 choix
- Niveau 3 : HSK 1-4, temps 3 sec, questions mixtes
- Niveau 4 : HSK 1-5, temps 3 sec, questions pièges
- Niveau Expert : HSK 1-6+, temps 2 sec, chengyu et culture

**Durée Moyenne :** 4-5 minutes

---

## Jeu 30 - Manda Karaoke (曼达卡拉OK)

**Catégorie :** Prononciation / Vocabulaire

**Objectif Pédagogique :**
Apprendre le vocabulaire et la prononciation via des chansons chinoises populaires, développer le sens du rythme de la langue, mémoriser des patterns linguistiques par la musique.

**Règles Détaillées :**
Karaoké de vraies chansons chinoises (populaires, folk, traditionnelles). Les paroles défilent avec mise en évidence du mot en cours. Le joueur chante dans le microphone. L'IA évalue la prononciation (tons, phonèmes, rythme) en temps réel. Un score s'affiche sous forme de "flammes" comme un vrai karaoké asiatique.

Mode "Apprentissage" : la chanson est enseignée d'abord segment par segment avant le karaoké complet.

Mode "Duel Karaoké" : deux joueurs chantent la même chanson, l'IA déclare le vainqueur.

Catalogue : 200+ chansons catégorisées par niveau HSK, genre (pop, folk, traditionnelle, contemporaine, hip-hop).

**UX/Interface :**
- Interface karaoké néon coloré : fond sombre, texte coloré
- Paroles en grand : caractères + pinyin + traduction optionnelle
- Barre de score "flammes" sur le côté (style karaoké asiatique)
- Waveform de la voix en temps réel
- Étoiles de performance en fin de chanson
- Partage du score sur les réseaux sociaux (optionnel)

**Système de Scoring :**
- Précision de prononciation par syllabe : 0-10 pts
- Rythme (timing avec la musique) : 0-5 pts par syllabe
- Score total : Σ (pts prononciation + pts rythme)
- Chanson complète sans arrêt : +200 pts
- Score > 80% sur chanson difficile : badge "Star du Karaoké"

**Difficulté Progressive :**
- Niveau 1 : Comptines et chansons enfantines (一二三四五), tempo lent
- Niveau 2 : Chansons folkloriques simples (茉莉花), tempo modéré
- Niveau 3 : Pop contemporaine adaptée, tempo normal
- Niveau 4 : Pop et rock originaux non adaptés, tempo rapide
- Niveau Expert : Rap (Mandopop), chansons classiques, opéra de Pékin simplifié

**Durée Moyenne :** 3-5 minutes par chanson

---

## Jeu 31 - Character Evolution (汉字演变)

**Catégorie :** Culture / Écriture

**Objectif Pédagogique :**
Comprendre l'évolution historique des caractères chinois (pictogrammes -> idéogrammes -> caractères modernes), renforcer la mémorisation par l'histoire visuelle.

**Règles Détaillées :**
Le joueur observe l'évolution d'un caractère de ses origines picturales jusqu'à sa forme moderne (os oraculaire -> bronze -> sceau -> clerical -> standard). Il doit :
1. Reconnaître ce que représentait le pictogramme original (ex: 日 = soleil stylisé)
2. Relier les formes intermédiaires dans l'ordre chronologique
3. Identifier le caractère moderne correspondant parmi 5 propositions
4. Tracer le caractère moderne correctement

Mode "Archéologue" : des formes anciennes inconnues sont présentées, le joueur déduit leur signification.

**UX/Interface :**
- Frise chronologique horizontale : 3000 ans d'histoire sur l'écran
- Chaque époque : texture appropriée (os, bronze, parchemin, papier, écran)
- Animations de transformation entre les formes
- Animations d'encre qui coule pour reconstituer les transitions
- Musique : guqin pour les formes anciennes, moderne pour les contemporaines
- "Musée personnel" : galerie des évolutions apprises

**Système de Scoring :**
- Pictogramme correct identifié : 50 pts
- Relier dans l'ordre chronologique : 30 pts
- Caractère moderne identifié : 50 pts
- Tracé correct : 70 pts
- Bonus "vision archéologique" (tout juste sans aide) : +100 pts
- 50 évolutions apprises : badge "Archéologue Hanzi"

**Difficulté Progressive :**
- Niveau 1 : Pictogrammes très reconnaissables (山, 日, 月, 水, 火, 人)
- Niveau 2 : Idéogrammes composés simples (明 = 日+月 = brillant)
- Niveau 3 : Évolutions non-linéaires, transformation phonétique
- Niveau 4 : Caractères spécialisés, histoire peu connue
- Niveau Expert : Script sceau, formes régionales, caractères traditionnels vs simplifiés

**Durée Moyenne :** 6-8 minutes

---

## Jeu 32 - Tones Battle Royale (声调大逃杀)

**Catégorie :** Prononciation

**Objectif Pédagogique :**
Maîtriser les tons sous pression compétitive maximale, améliorer la rapidité et la précision dans la production des tons.

**Règles Détaillées :**
Mode battle royale : 30 joueurs simultanément (mix humains et IA). Chaque round, tous les joueurs prononcent le même mot dans leur microphone. L'IA note chacun. Les 5 moins bons scores sont éliminés. Survie = meilleure prononciation relative. Jusqu'à ce qu'il reste 1 survivant.

Les mots deviennent progressivement plus difficiles (tons complexes, homophones problématiques, paires minimales...).

Mode "Solo Survival" : le joueur seul contre 29 IA de difficulté croissante.

**UX/Interface :**
- Carte vue du dessus avec 30 avatars (style battle royale)
- Zone sûre qui se rétrécit (pression croissante)
- Microphone géant qui s'allume pour les rounds de prononciation
- Scoreboard en temps réel : classement des 30 joueurs
- Éliminations animées : le personnage s'envole en dragon de vapeur
- Dernier survivant : cinématique de victoire épique

**Système de Scoring :**
- Score de prononciation IA (0-100) = classement relatif
- Survivre un round : 50 pts
- Chaque joueur éliminé (si score au-dessus) : 10 pts
- Victoire (dernier survivant) : 1000 pts + badge "Roi des Tons"
- Top 3 : 500/300/200 pts

**Difficulté Progressive :**
- Round 1-5 : Mots à 1 syllabe, tous tons séparément
- Round 6-10 : Mots de 2 syllabes, combinaisons de tons
- Round 11-15 : Phrases courtes, sandhi tonal
- Round 16-20 : Paires minimales délicates
- Round Final : Phrases rapides avec tous les tons, rythme naturel

**Durée Moyenne :** 8-12 minutes (selon elimination speed)

---

## Jeu 33 - Vocabulary Garden (词汇花园)

**Catégorie :** Vocabulaire

**Objectif Pédagogique :**
Cultiver et entretenir son vocabulaire sur le long terme via une métaphore de jardin, visualiser la progression de maîtrise de chaque mot.

**Règles Détaillées :**
Le joueur possède un jardin virtuel. Chaque mot de son vocabulaire SRS est une plante. L'état de la plante reflète le niveau de maîtrise (graine -> pousse -> fleur -> arbre -> arbre centenaire). Arroser une plante = réviser le mot SRS correspondant. Les plantes non arrosées se fanent (le mot retombe dans l'intervalle SRS). Objectif : maintenir un jardin florissant.

Fonctionnalités :
- Aménagement libre du jardin (personnalisation esthétique)
- Plantes rares pour mots difficiles (rose bleue, lotus d'or)
- Visites de jardins d'amis (inspiration et motivation sociale)
- Saisons du jardin reflétant la saison réelle

**UX/Interface :**
- Jardin 2D isométrique coloré et vivant
- 5 stades de croissance par plante, animations de pluie/soleil
- Arrosoir : utilisé pour la révision, se recharge en 4h
- Carte de santé globale : % de jardin "en bonne santé"
- Rapport mensuel : "Ton jardin a grandi de X nouvelles fleurs"
- Plantes thématiques : les mots du même champ sémantique forment une "massif" cohérent

**Système de Scoring :**
- Révision correcte (arrosage réussi) : plante monte d'un niveau + 20 XP
- Révision incorrecte : plante redescend d'un niveau
- Jardin 100% en bonne santé (toutes plantes niveau 3+) : badge hebdomadaire
- Première fleur (niveau 4) : 100 pts
- Premier arbre centenaire (niveau 5, 1 an de maîtrise) : badge légendaire + 500 pts

**Difficulté Progressive :**
Pas de difficulté progressive intrinsèque : la difficulté reflète le niveau SRS des mots. Un jardin HSK 1 est simple à maintenir ; un jardin HSK 5 nécessite un entretien intensif.

**Durée Moyenne :** 5-10 minutes (session d'entretien)

---

## Jeu 34 - Grammar Maze (语法迷宫)

**Catégorie :** Grammaire

**Objectif Pédagogique :**
Naviguer dans des structures grammaticales complexes, comprendre les règles de manière dynamique plutôt que mémorisée, résoudre des problèmes syntaxiques.

**Règles Détaillées :**
Un labyrinthe en vue de dessus. Le joueur contrôle un personnage qui avance dans des couloirs. À chaque intersection, une question grammaticale détermine le chemin : bon chemin si bonne réponse, mur si erreur (pénalité de 5 secondes). L'objectif est de trouver la sortie le plus rapidement possible.

Questions dans le labyrinthe : choix de particule (了/过/着), accord de classificateurs, ordre d'adjectifs, placement d'adverbes, choix de compléments...

Mode "Labyrinthe Brisé" : des phrases incorrectes jalonnent le chemin, identifier et réparer les erreurs pour avancer.

Mode "Boss de Fin" : à la sortie du labyrinthe, un "boss grammatical" pose 5 questions complexes.

**UX/Interface :**
- Labyrinthe style temple ancien chinois, vue isométrique
- Personnage : petit moine/lettré animé
- Carrefours : portes avec questions grammaticales sur des tablettes
- Erreur : mur qui se ferme avec son dramatique, temps de pénalité
- Bon chemin : portes qui s'ouvrent avec son harmonieux
- Carte du labyrinthe dévoilée progressivement
- Timer en haut de l'écran

**Système de Scoring :**
- Temps total pour sortir : base du score (moins vite = plus de points)
- Erreurs = pénalités temporelles accumulées
- Score final : (temps max - temps réel) x 100
- Boss de fin battu : +500 pts
- Parcours parfait (0 erreur) : x2 sur le score
- Labyrinthe expert complété : badge "Architecte Grammatical"

**Difficulté Progressive :**
- Niveau 1 : Labyrinthe 5x5, structures HSK 1-2 basiques, 3 chemins
- Niveau 2 : Labyrinthe 8x8, HSK 2-3, faux amis grammaticaux
- Niveau 3 : Labyrinthe 10x10, HSK 3-4, structures complexes
- Niveau 4 : Labyrinthe 12x12, HSK 4-5, questions pièges multiples
- Niveau Expert : Labyrinthe 15x15, HSK 5-6, boss intermédiaires, mode Boss de Fin

**Durée Moyenne :** 6-10 minutes

---

## Jeu 35 - Final Boss (最终Boss)

**Catégorie :** Vocabulaire / Grammaire / Prononciation / Culture (ALL)

**Objectif Pédagogique :**
Évaluation globale et synthétique de toutes les compétences acquises dans une session de jeu épique et culminante, motiver la progression vers le niveau HSK supérieur.

**Règles Détaillées :**
Le jeu ultime de Manda Go. Accessible une fois par semaine (samedi). Le joueur affronte un "Boss Dragon" qui représente le niveau HSK en cours. Le boss a 5 "formes" correspondant à 5 compétences :

- **Forme 1 - Le Vocabulaire (龙鳞)** : 20 questions de reconnaissance rapide (vocabulaire du niveau entier), 10 secondes par question, 3 vies
- **Forme 2 - La Prononciation (龙吼)** : 10 séquences de prononciation à évaluer par l'IA, score moyen 75%+ pour passer
- **Forme 3 - L'Écriture (龙爪)** : 5 caractères clés à tracer de mémoire avec précision 80%+
- **Forme 4 - La Grammaire (龙corne)** : 15 questions de grammaire croissantes en difficulté, alternance QCM et construction
- **Forme 5 - La Culture (龙sagesse)** : 10 questions culturelles liées au niveau + dialogue libre 2 minutes avec MandaBot

Le boss s'anime dramatiquement à chaque transition de forme. Chaque forme vaincue = une partie du dragon s'illumine. Si le joueur échoue une forme 3 fois : il peut la sauter (mais perd des points).

**UX/Interface :**
- Cinématique d'ouverture : le dragon géant émerge d'un temple avec grondements
- 5 phases visuellement distinctes : décors épiques différents pour chaque compétence
- Dragon animé en grande qualité graphique au centre de l'écran
- Barre de vie du dragon (décroît avec chaque bonne réponse)
- Effets de lumière, son épique, musique orchestrale qui s'intensifie
- Résumé final détaillé : score par compétence, comparaison avec semaines précédentes
- Récompenses débloquées selon le score total

**Système de Scoring :**
- Forme 1 (Vocab) : max 2000 pts
- Forme 2 (Prononciation) : max 1000 pts
- Forme 3 (Écriture) : max 500 pts
- Forme 4 (Grammaire) : max 1500 pts
- Forme 5 (Culture + Dialogue) : max 1000 pts
- **Score Parfait (toutes formes) :** 6000 pts + bonus 2000 pts = 8000 pts max
- **Dragon vaincu :** 500 XP + coffre Dragon + badge "Tueur de Dragon Niveau X"
- **Dragon légendaire vaincu (score 90%+) :** 1500 XP + coffre Dragon x2 + titre saisonnier
- **Dragon impossible vaincu (score 100%)** : titre permanent "Dieu du Mandarin" + récompense physique possible

**Difficulté Progressive :**
- Boss Niveau HSK 1 : Dragon Bébé, forme simplifiée, 3 vies par forme
- Boss Niveau HSK 2 : Dragon Adolescent, légèrement plus rapide
- Boss Niveau HSK 3 : Dragon Adulte, questions plus complexes, 2 vies
- Boss Niveau HSK 4 : Dragon Ancien, temps réduit, 2 vies, moins d'indices
- Boss Niveau HSK 5 : Dragon Impérial, mode Immersion (pas de français)
- Boss Niveau HSK 6 : Dragon Légendaire, textes authentiques, niveau natif
- Boss Niveaux HSK 7-9 : Dragon Divin - "Le Maître du Langage", défis dans les deux sens (expliquer des concepts aux personnages)

**Durée Moyenne :** 15-25 minutes (boss complet)

---

## Récapitulatif des 35 Mini-Jeux

| # | Nom du Jeu | Catégorie | Durée | Difficulté Max |
|---|-----------|-----------|-------|---------------|
| 1 | Dragon Chase | Vocabulaire | 4-6 min | Expert |
| 2 | Tone Tower | Prononciation | 5-7 min | Expert |
| 3 | Character Puzzle | Vocabulaire/Écriture | 5-8 min | Expert |
| 4 | Stroke Master | Écriture | 4-6 min | Expert |
| 5 | Echo Chamber | Prononciation | 4-5 min | Expert |
| 6 | Market Rush | Vocabulaire/Conversation | 5-7 min | Expert |
| 7 | Manda Match | Vocabulaire | 5-8 min | Expert |
| 8 | Pinyin Rain | Vocabulaire/Prononciation | 4-5 min | Expert |
| 9 | Grammar Builder | Grammaire | 6-8 min | Expert |
| 10 | Culture Quiz | Culture | 5-7 min | Expert |
| 11 | Listening Ninja | Compréhension Orale | 5-6 min | Expert |
| 12 | Word Chain | Vocabulaire | 4-6 min | Expert |
| 13 | Flashcard Duel | Vocabulaire | 5-8 min | Expert |
| 14 | Sentence Scramble | Grammaire | 5-7 min | Expert |
| 15 | Radical Hunt | Vocabulaire/Écriture | 4-5 min | Expert |
| 16 | Tone Surfer | Prononciation | 4-5 min | Expert |
| 17 | HSK Sprint | Vocabulaire | 5 min fixes | Expert |
| 18 | Hanzi Artist | Écriture/Culture | 5-15 min | Maître |
| 19 | Conversation Roulette | Conversation | 5-7 min | Expert |
| 20 | Number Ninja | Vocabulaire | 4-5 min | Expert |
| 21 | Story Builder | Grammaire/Vocabulaire | 7-10 min | Expert |
| 22 | Idiom Explorer | Culture/Vocabulaire | 6-8 min | Expert |
| 23 | Pronunciation Duel | Prononciation | 6-8 min | Expert |
| 24 | Speed Reader | Lecture | 4-6 min | Expert |
| 25 | Context Detective | Vocabulaire/Grammaire | 5-6 min | Expert |
| 26 | Measure Word Master | Grammaire | 5-6 min | Expert |
| 27 | Time Traveler | Grammaire/Vocabulaire | 5-6 min | Expert |
| 28 | Restaurant Simulator | Vocabulaire/Conversation | 6-8 min | Expert |
| 29 | Dragon Ball | Vocabulaire/Grammaire | 4-5 min | Expert |
| 30 | Manda Karaoke | Prononciation/Vocabulaire | 3-5 min | Expert |
| 31 | Character Evolution | Culture/Écriture | 6-8 min | Expert |
| 32 | Tones Battle Royale | Prononciation | 8-12 min | Expert |
| 33 | Vocabulary Garden | Vocabulaire | 5-10 min | - |
| 34 | Grammar Maze | Grammaire | 6-10 min | Expert |
| 35 | Final Boss | Toutes compétences | 15-25 min | Légendaire |

---

*Document rédigé par l'équipe Game Design Manda Go - Version 1.0 - Juin 2026*
