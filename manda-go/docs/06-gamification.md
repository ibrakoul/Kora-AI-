# 06 - Système de Gamification Manda Go

> Design complet du système de gamification de Manda Go, conçu pour surpasser Duolingo en profondeur, progression et récompenses.

---

## 1. Philosophie de Gamification

Manda Go adopte une approche de gamification dite "profonde" : chaque mécanique de jeu est directement connectée à un progrès linguistique réel. Le plaisir du jeu et l'apprentissage sont inséparables. Contrairement aux applications qui utilisent la gamification comme couche superficielle, Manda Go intègre les mécaniques dans la pédagogie elle-même.

**Principes Fondateurs :**
- Tout XP gagné correspond à un apprentissage réel effectué
- Les récompenses visuelles reflètent la progression linguistique
- La compétition reste optionnelle et bienveillante
- La régularité est récompensée plus que l'intensité ponctuelle
- Le progrès personnel est toujours mis en avant (vs comparaison avec les autres)

---

## 2. Système XP et Niveaux

### 2.1 Structure des 100 Niveaux

Manda Go propose 100 niveaux d'expérience organisés en 10 paliers thématiques. La courbe d'expérience est progressive mais non punitive : les premiers niveaux s'atteignent rapidement pour établir la motivation, puis la progression ralentit proportionnellement à la maîtrise acquise.

**Formule d'XP par Niveau :**
```
XP_requis(n) = 100 x n x (1 + n/20)  pour n <= 50
XP_requis(n) = 100 x n x (1 + n/10)  pour n > 50

Exemples :
- Niveau 1 -> 2 : 105 XP
- Niveau 10 -> 11 : 1 150 XP
- Niveau 25 -> 26 : 3 750 XP
- Niveau 50 -> 51 : 7 500 XP
- Niveau 75 -> 76 : 13 125 XP
- Niveau 99 -> 100 : 19 800 XP
XP Total pour atteindre le niveau 100 : environ 850 000 XP
```

### 2.2 Paliers et Titres en Chinois

#### Palier 1 - L'Éveil (Niveaux 1-10)
- **Titre :** 新手 (Xin Shou - Novice)
- **Thème visuel :** Poussin sortant de l'oeuf, couleurs douces
- **Récompenses de palier :** Avatar "Poussin Mandarin", 50 MandaCoins, badge "Premier Pas"
- **Contenu débloqué :** HSK 1 complet, 5 mini-jeux de base

#### Palier 2 - L'Exploration (Niveaux 11-20)
- **Titre :** 学生 (Xue Sheng - Étudiant)
- **Thème visuel :** Jeune dragon curieux, couleurs vives
- **Récompenses de palier :** Avatar "Dragon Curieux", 150 MandaCoins, badge "Explorateur"
- **Contenu débloqué :** HSK 2, mode conversation texte MandaBot

#### Palier 3 - La Fondation (Niveaux 21-30)
- **Titre :** 进步者 (Jin Bu Zhe - Progressant)
- **Thème visuel :** Bambou qui pousse, vert profond
- **Récompenses de palier :** Avatar "Maître Bambou", 300 MandaCoins, badge "Fondations Solides"
- **Contenu débloqué :** HSK 3, ligues Bronze, défis hebdomadaires

#### Palier 4 - La Montée (Niveaux 31-40)
- **Titre :** 勤学者 (Qin Xue Zhe - Studieux)
- **Thème visuel :** Aigle prenant son envol, couleurs dorées
- **Récompenses de palier :** Avatar "Aigle d'Or", 500 MandaCoins, badge "En Ascension"
- **Contenu débloqué :** HSK 4, mode conversation vocale MandaBot, tournois

#### Palier 5 - La Maîtrise (Niveaux 41-50)
- **Titre :** 能手 (Neng Shou - Habile)
- **Thème visuel :** Tigre en posture d'attaque, couleurs orange et noir
- **Récompenses de palier :** Avatar "Tigre Mandarin", 800 MandaCoins, badge "Mi-chemin"
- **Contenu débloqué :** HSK 5, système de coffres Dragon, boutique premium

#### Palier 6 - L'Illumination (Niveaux 51-60)
- **Titre :** 高手 (Gao Shou - Expert)
- **Thème visuel :** Phenix renaissant, couleurs rouge et or
- **Récompenses de palier :** Avatar "Phénix", 1200 MandaCoins, badge "Illuminé"
- **Contenu débloqué :** HSK 6, ligues Diamant, défis mensuels épiques

#### Palier 7 - La Profondeur (Niveaux 61-70)
- **Titre :** 达人 (Da Ren - Maître)
- **Thème visuel :** Montagne au sommet des nuages, couleurs bleues et blanches
- **Récompenses de palier :** Avatar "Sage de la Montagne", 1800 MandaCoins, badge "Profondeur"
- **Contenu débloqué :** HSK 7-8, mode calligraphie artistique, rang classement spécial

#### Palier 8 - La Transcendance (Niveaux 71-80)
- **Titre :** 宗师 (Zong Shi - Grand Maître)
- **Thème visuel :** Dragon impérial, couleurs or et jade
- **Récompenses de palier :** Avatar "Dragon Impérial", 2500 MandaCoins, badge "Transcendance"
- **Contenu débloqué :** HSK 9, ligue Dragon, génération de contenu IA personnalisé

#### Palier 9 - La Légende (Niveaux 81-90)
- **Titre :** 大师 (Da Shi - Maître Suprême)
- **Thème visuel :** Immortel taoïste, couleurs célestes
- **Récompenses de palier :** Avatar "Immortel", 4000 MandaCoins, badge "Légendaire"
- **Contenu débloqué :** Ligue Légende, mentor d'autres apprenants, contenu exclusif

#### Palier 10 - La Divinité (Niveaux 91-100)
- **Titre :** 传说 (Chuan Shuo - Légende)
- **Thème visuel :** Dieu de la Sagesse, effets visuels cosmiques
- **Récompenses de palier :** Avatar "Dieu de la Sagesse", 10 000 MandaCoins, 100 MandaGems, badge "LEGENDAIRE", cadre de profil exclusif animé, titre permanent affiché sur le classement mondial
- **Contenu débloqué :** Accès life-time premium, co-création de contenu avec l'équipe Manda Go

### 2.3 Sources d'XP

| Action | XP de Base | Notes |
|--------|-----------|-------|
| Compléter une leçon (1 étoile) | 50 XP | Score 0-59% |
| Compléter une leçon (2 étoiles) | 100 XP | Score 60-84% |
| Compléter une leçon (3 étoiles) | 150 XP | Score 85-100% |
| Révision SRS (carte correcte) | 5 XP | Par carte |
| Prononciation parfaite (90-100) | 20 XP | Par exercice |
| Mini-jeu complété | 30-200 XP | Selon le jeu et le score |
| Défi quotidien complété | 75 XP | x3 par jour max |
| Défi hebdomadaire | 300 XP | Par défi |
| Défi mensuel épique | 2000 XP | Un seul par mois |
| Leçon parfaite (100%) | Bonus 50 XP | En plus des XP normaux |
| Session journalière (première) | 25 XP | Bonus de connexion |
| Streak 7 jours | 500 XP | Bonus hebdomadaire |
| Badge obtenu | 50-500 XP | Selon rareté du badge |

### 2.4 Multiplicateurs d'XP

- **Streak actif :** +10% par semaine de streak jusqu'à +100% max
- **Ligue Diamond+** : +25% sur tous les XP
- **Mode Premium :** +50% XP (abonnement payant)
- **Week-end culturel :** x2 XP certains week-ends thématiques
- **Heure dorée** (6h-8h et 20h-22h) : +15% XP
- **Premier de la ligue :** +20% XP sur la semaine

---

## 3. Système de Ligues

### 3.1 Les 8 Ligues

#### Ligue Bronze (铜牌联赛)
- **Couleur :** Bronze
- **Icône :** Bouclier bronze avec idéogramme 铜
- **Capacité :** 30 joueurs par groupe
- **Durée :** Semaine calendaire (lundi-dimanche)
- **XP minimum pour rejoindre :** 0
- **Zone de promotion :** Top 5 -> Argent
- **Zone de sécurité :** Rang 6-20
- **Zone de rétrogradation :** N/A (ligue de départ)
- **Récompenses fin de semaine :**
  - 1er : 200 MandaCoins + badge "Champion Bronze"
  - 2e-3e : 100 MandaCoins
  - 4e-5e : 50 MandaCoins (promus)

#### Ligue Argent (银牌联赛)
- **Couleur :** Argent
- **Icône :** Bouclier argent avec idéogramme 银
- **XP minimum :** 500 XP pour maintien
- **Zone de promotion :** Top 5 -> Or
- **Zone de rétrogradation :** Bottom 5 -> Bronze
- **Récompenses fin de semaine :**
  - 1er : 400 MandaCoins + 5 MandaGems + badge "Champion Argent"
  - 2e-3e : 200 MandaCoins + 2 MandaGems
  - 4e-5e : 100 MandaCoins (promus)

#### Ligue Or (金牌联赛)
- **Couleur :** Or
- **Icône :** Bouclier or avec idéogramme 金
- **XP minimum :** 1000 XP pour maintien
- **Zone de promotion :** Top 5 -> Jade
- **Zone de rétrogradation :** Bottom 5 -> Argent
- **Récompenses :**
  - 1er : 600 MandaCoins + 10 MandaGems + coffre Jade + badge "Champion Or"
  - 2e-3e : 300 MandaCoins + 5 MandaGems
  - 4e-5e : 150 MandaCoins (promus)

#### Ligue Jade (翡翠联赛)
- **Couleur :** Jade (vert profond)
- **Icône :** Bouclier jade avec idéogramme 翡
- **XP minimum :** 1500 XP pour maintien
- **Zone de promotion :** Top 5 -> Saphir
- **Zone de rétrogradation :** Bottom 5 -> Or
- **Récompenses :**
  - 1er : 800 MandaCoins + 15 MandaGems + coffre Or + badge animé "Champion Jade"
  - 2e-3e : 400 MandaCoins + 8 MandaGems + coffre Jade
  - 4e-5e : 200 MandaCoins + 3 MandaGems (promus)

#### Ligue Saphir (蓝宝石联赛)
- **Couleur :** Saphir (bleu roi)
- **Icône :** Bouclier cristallin bleu
- **XP minimum :** 2000 XP pour maintien
- **Zone de promotion :** Top 5 -> Diamant
- **Zone de rétrogradation :** Bottom 5 -> Jade
- **Récompenses :**
  - 1er : 1200 MandaCoins + 25 MandaGems + coffre Dragon + avatar exclusif
  - 2e-3e : 600 MandaCoins + 12 MandaGems + coffre Or
  - 4e-5e : 300 MandaCoins + 5 MandaGems (promus)

#### Ligue Diamant (钻石联赛)
- **Couleur :** Diamant (blanc et bleu glacial)
- **Icône :** Diamant multicouches avec reflets
- **XP minimum :** 3000 XP pour maintien
- **Modificateur :** XP bonus +25% sur toute la semaine
- **Zone de promotion :** Top 5 -> Dragon
- **Zone de rétrogradation :** Bottom 5 -> Saphir
- **Récompenses :**
  - 1er : 2000 MandaCoins + 40 MandaGems + coffre Dragon x2 + cadre profil Diamant
  - 2e-3e : 1000 MandaCoins + 20 MandaGems + coffre Dragon
  - 4e-5e : 500 MandaCoins + 10 MandaGems (promus)

#### Ligue Dragon (龙族联赛)
- **Couleur :** Rouge impérial et or
- **Icône :** Dragon chinois animé
- **XP minimum :** 5000 XP pour maintien
- **Modificateur :** XP bonus +40%, accès à des défis exclusifs
- **Zone de promotion :** Top 3 -> Légende
- **Zone de rétrogradation :** Bottom 5 -> Diamant
- **Récompenses :**
  - 1er : 3500 MandaCoins + 75 MandaGems + coffre Dragon x3 + titre "Seigneur Dragon"
  - 2e-3e : 1500 MandaCoins + 35 MandaGems + coffre Dragon x2
  - 4e-10e : 700 MandaCoins + 15 MandaGems (dont top 3 promus)
  - Participation : 100 MandaCoins

#### Ligue Légende (传说联赛)
- **Couleur :** Or céleste et violet cosmique
- **Icône :** Phénix cosmique animé avec particules
- **Capacité :** 30 meilleurs apprenants mondiaux de la semaine
- **XP minimum :** 8000 XP pour maintien
- **Modificateur :** XP bonus +60%, badge permanent "Légende"
- **Pas de rétrogradation au rang 1-15** (sécurité pour les meilleurs)
- **Zone de rétrogradation :** Bottom 10 -> Dragon
- **Récompenses :**
  - 1er : 8000 MandaCoins + 200 MandaGems + trophy physique (envoi postal) + titre de "Grand Maître de la Semaine"
  - 2e-5e : 4000 MandaCoins + 100 MandaGems + coffre Dragon x5
  - 6e-15e : 2000 MandaCoins + 50 MandaGems + coffre Dragon x3
  - 16e-30e : 1000 MandaCoins + 25 MandaGems (avec risque rétrogradation)

### 3.2 Mécanique des Groupes

- Chaque lundi à 00h00, les groupes sont reformés automatiquement
- Algorithme d'équilibrage : appariement basé sur XP moyen des 4 dernières semaines
- Les amis peuvent se retrouver dans le même groupe si XP compatibles
- Affichage en temps réel du classement (actualisé toutes les 30 min)
- Notifications push configurables : "Tu es à 150 XP de la 1ère place !"
- Replay de la semaine : visualisation de l'évolution du classement jour par jour

### 3.3 Saison des Ligues

- Chaque trimestre correspond à une "Saison" thématique
- Saison printemps : thème "Fête du Printemps" (chun jie)
- Saison été : thème "Festival des Bateaux-Dragons" (dragon boat)
- Saison automne : thème "Fête de la Mi-Automne" (zhongqiu jie)
- Saison hiver : thème "Nouvel An Chinois" (chun jie)
- Récompenses de fin de saison selon ligue maximale atteinte pendant la saison

---

## 4. Séries (Streaks)

### 4.1 Streak Quotidien

**Définition :** Un streak est maintenu si l'utilisateur complète au moins un objectif minimum par jour (défini par lui, minimum 5 min d'activité productive).

**Jalons de Streak et Récompenses :**

| Jours de streak | Récompense | Bonus XP |
|----------------|-----------|---------|
| 3 jours | Badge "Premier Trios" + 50 MandaCoins | +5% XP |
| 7 jours | Badge "Une Semaine" + 200 MandaCoins + coffre Jade | +10% XP |
| 14 jours | Badge "Deux Semaines" + 400 MandaCoins + 5 MandaGems | +15% XP |
| 30 jours | Badge "Un Mois" + 800 MandaCoins + 10 MandaGems + avatar "Tortue Millénaire" | +20% XP |
| 60 jours | Badge "Deux Mois" + 1500 MandaCoins + 20 MandaGems | +25% XP |
| 100 jours | Badge "100 Jours" (animé) + 3000 MandaCoins + 50 MandaGems + cadre profil spécial | +30% XP |
| 200 jours | Badge "200 Jours" (légendaire) + 6000 MandaCoins + 100 MandaGems + titre "Persévérant" | +40% XP |
| 365 jours | Badge "Une Année" (ultra-rare) + 15000 MandaCoins + 365 MandaGems + récompense physique | +50% XP |

### 4.2 Boucliers de Streak

Les boucliers protègent le streak en cas de journée manquée.

**Obtention des Boucliers :**
- 1 bouclier offert tous les 7 jours de streak
- 1 bouclier achetable pour 200 MandaCoins
- 1 bouclier par mois avec abonnement premium
- Boucliers gagnables dans certains tournois et coffres

**Règles des Boucliers :**
- Max 5 boucliers stockables simultanément
- Un bouclier consommé automatiquement à minuit si journée non complétée
- Notification push : "Il te reste 2 heures, un bouclier sera utilisé !"
- Un seul bouclier consommé par journée manquée

### 4.3 Streak de Groupe

- Fonctionnalité "Streak en Famille" : jusqu'à 5 amis maintiennent un streak collectif
- Si un membre manque sa journée, les autres peuvent "couvrir" (max 2x par mois)
- Récompenses spéciales pour streaks de groupe (x2 vs streaks individuels)
- Chat de groupe intégré pour s'encourager

### 4.4 Animations de Célébration

**Streak 7 jours :** Animation dragon qui crache des flammes d'or, confettis aux couleurs chinoises

**Streak 30 jours :** Feu d'artifice animé, musique traditionnelle chinoise, texte "一个月坚持！" (Un mois de persévérance !)

**Streak 100 jours :** Cinématique complète de 5 secondes : le panda de l'utilisateur est couronné, parade de dragons autour du profil

**Streak 365 jours :** Animation épique exclusive, partage automatique proposé sur les réseaux sociaux

---

## 5. Système de Récompenses

### 5.1 Les 150 Badges Uniques

Les badges sont organisés en 12 catégories thématiques, chacune avec des badges de différentes raretés (Commun, Rare, Épique, Légendaire).

#### Catégorie 1 - Progression HSK (15 badges)
- Premiers caractères (Commun) : écrire 10 caractères correctement
- HSK 1 Completé (Commun) : terminer toutes les leçons HSK 1
- HSK 2 Maîtrisé (Rare) : obtenir 85%+ dans toutes les leçons HSK 2
- HSK 3 Champion (Rare) : ...
- HSK 4 Expert (Épique) : ...
- HSK 5 Elite (Épique) : ...
- HSK 6 Maître (Légendaire) : ...
- HSK 7-9 : badges Légendaires animés

#### Catégorie 2 - Streaks (12 badges)
- Du 3 jours au 365 jours (voir section 4.1)
- Streak familial : maintenir un streak de groupe 30 jours
- Streak parfait : 7 jours avec score moyen 90%+

#### Catégorie 3 - Prononciation (18 badges)
- Première Perfection (Commun) : premier score 100% en prononciation
- Tonalement Correct (Commun) : maîtriser les 4 tons en une session
- Maître des Tons (Rare) : 50 prononciation à 90%+ sur les 4 tons
- Oreille Absolue (Épique) : 100 évaluations parfaites consécutives
- Accent Pékinois (Légendaire) : score moyen 95%+ sur 500 évaluations
- Et 13 autres badges spécialisés (initiales, finales, tons neutrals, etc.)

#### Catégorie 4 - Écriture (15 badges)
- Premier Tracé (Commun)
- Calligraphe Débutant (Commun)
- 100 Caractères (Rare)
- 500 Caractères (Rare)
- 1000 Caractères (Épique)
- Grand Calligraphe (Légendaire) : 3000 caractères tracés avec précision 90%+

#### Catégorie 5 - Ligues (16 badges)
- Un badge par ligue atteinte (x8)
- Champion de ligue (badge pour chaque ligue remportée) (x8)
- Badge spécial "Invaincu" : rester 1er pendant 4 semaines consécutives

#### Catégorie 6 - Mini-jeux (20 badges)
- Un badge "Découverte" pour chaque mini-jeu joué pour la première fois (35 mini-jeux)
- Badges de maîtrise sélectifs pour les 15 jeux les plus populaires
- "Collectionneur" (Légendaire) : avoir joué tous les 35 mini-jeux au moins 10 fois

#### Catégorie 7 - Culture Chinoise (18 badges)
- Quiz Culturel Débutant (Commun) : réussir 10 quiz culture
- Sinologue (Rare) : connaître 50 faits culturels validés
- Passionné de Chengyu (Rare) : apprendre 50 expressions idiomatiques
- Expert Culturel (Épique) : 200 quiz culture avec 90%+ de réussite
- Ambassadeur (Légendaire) : partager 10 posts culturels dans la communauté

#### Catégorie 8 - Social (12 badges)
- Premier Ami (Commun) : ajouter 1 ami
- Sociable (Rare) : avoir 10 amis actifs
- Mentor (Épique) : aider 5 apprenants via les commentaires communauté
- Légende Sociale (Légendaire) : 100 amis actifs + mentor certifié

#### Catégorie 9 - Défis (14 badges)
- Premiers Défis (Commun) : compléter 7 défis quotidiens
- Défi Hebdo x10 (Rare)
- Conquérant Mensuel (Épique) : compléter 3 défis mensuels
- Tournoi Champion (Légendaire) : remporter un tournoi saisonnier

#### Catégorie 10 - Régularité (10 badges)
- Lève-tôt (Commun) : 10 sessions avant 8h
- Oiseau de Nuit (Commun) : 10 sessions après 22h
- Régulier (Rare) : même heure de pratique 30 jours de suite
- Machine (Épique) : 200 jours de sessions régulières

#### Catégorie 11 - Performance (8 badges)
- Perfectionniste (Rare) : 10 leçons avec 100%
- Ultra-Précis (Épique) : 50 leçons avec 100%
- Imbattable (Légendaire) : 10 000 révisions SRS sans erreur consécutive

#### Catégorie 12 - Spéciaux et Événementiels (2 badges permanents + saisonniers)
- "Bêta Testeur" (Épique) : pour les utilisateurs de la phase bêta
- "Fondateur" (Légendaire) : pour les 1000 premiers inscrits
- Badges saisonniers : Nouvel An Chinois, Fête des Lanternes, Golden Week, etc.
- Badges événements : compétitions mondiales, collaborations

### 5.2 Coffres de Récompenses (3 Raretés)

#### Coffre Jade (翡翠宝箱)
- **Couleur :** Vert jade avec dorures simples
- **Coût d'ouverture :** Gratuit (gagné en jeu)
- **Contenu possible (1 item aléatoire + 50-150 MandaCoins) :**
  - Éléments d'avatar communs et rares (60%)
  - 1 bouclier de streak (20%)
  - Booster XP x1.5 pour 1 leçon (15%)
  - Badge commun (5%)
- **Sources :** Ligues Bronze-Argent, défis quotidiens, mini-jeux niveau 1-2

#### Coffre Or (黄金宝箱)
- **Couleur :** Or brillant avec motifs de nuages chinois
- **Coût d'ouverture :** Gratuit (gagné en jeu) ou 50 MandaCoins
- **Contenu possible (2 items aléatoires + 150-400 MandaCoins) :**
  - Éléments d'avatar rares et épiques (50%)
  - 2 boucliers de streak (15%)
  - Booster XP x2 pour 3 leçons (15%)
  - Badge rare (10%)
  - 5 MandaGems (10%)
- **Sources :** Ligues Or-Jade, défis hebdomadaires, streak 7 jours

#### Coffre Dragon (龙鳞宝箱)
- **Couleur :** Rouge impérial avec écailles de dragon dorées, animation de flammes
- **Coût d'ouverture :** Gratuit (gagné rarement) ou 200 MandaCoins ou 10 MandaGems
- **Contenu possible (3 items aléatoires + 400-1000 MandaCoins + 5-20 MandaGems) :**
  - Éléments d'avatar épiques et légendaires (40%)
  - Badge rare ou épique garanti (30%)
  - Booster XP x3 pour 1 semaine (15%)
  - 3 boucliers de streak (10%)
  - Avatar exclusif (5%)
  - Titre honorifique rare (5%)
- **Sources :** Ligues Saphir+, streak 30 jours, tournois, événements spéciaux

### 5.3 Système d'Avatars Personnalisables (50+ Éléments)

#### Parties de l'Avatar

**Tête (10 options de base, 20 débloquables) :**
- Panda, Dragon, Tigre, Phénix, Tortue, Carp (Koi), Singe, Coq, Lapin, Boeuf (Zodiac)
- Versions premium : Dragon Impérial, Phénix Céleste, Kirin (Qilin), etc.

**Corps/Tenue (8 options de base, 15 débloquables) :**
- Tenue décontractée, Hanfu traditionnel, Costume Tang, Tenue impériale, Qi Pao, Tenue de kung-fu
- Versions premium : Armure de dragon, Robe de l'immortel, etc.

**Accessoires (5 de base, 15 débloquables) :**
- Chapeau de Mandarin, Éventail, Lanterne, Baguettes, Calligraphie
- Premium : Couronne impériale, Sceptre de jade, Aile de phénix, etc.

**Fond/Environnement (5 de base, 10 débloquables) :**
- Grande Muraille, Temple, Jardin de Lotus, Ville moderne, Campagne
- Premium : Palais Céleste, Mont Huangshan, Mer de nuages, etc.

**Effets d'Animation (0 de base, 8 débloquables) :**
- Particules de jade, Flammes de dragon, Pétales de cerisier, Fumée d'encens
- Premium : Aura légendaire, Éclairs célestes, etc.

### 5.4 Titres Honorifiques

Affichés sous le nom d'utilisateur dans le classement et le profil.

**Titres Permanents (gagnés pour toujours) :**
- "Premier Pas" : compléter la première leçon
- "Persévérant" : atteindre un streak de 200 jours
- "Ton Parfait" : 500 prononciations parfaites
- "Grand Calligraphe" : 3000 caractères tracés à 90%+
- "Champion du Dragon" : remporter la ligue Dragon
- "Légende Vivante" : atteindre le niveau 100

**Titres Événementiels (pour une saison) :**
- "Gardien du Feu" : top 100 mondial lors du tournoi Fête des Lanternes
- "Danseur du Dragon" : titre de la compétition Nouvel An

**Titres de Prestige (achetables avec MandaGems) :**
- "Maître de Thé", "Poète du Tang", "Philosophe", "Voyageur Céleste"

### 5.5 Médailles de Maîtrise

Pour chaque compétence et domaine, une médaille de progression en 5 niveaux :

- **Bronze :** Premier contact avec la compétence
- **Argent :** 50% des exercices de la compétence complétés
- **Or :** 100% complétés avec score moyen 70%+
- **Platine :** 100% avec score moyen 90%+
- **Dragon :** Maîtrise absolue validée par test rigoureux

Compétences suivies : Vocabulaire HSK1-9, Prononciation (par ton), Écriture de caractères, Grammaire, Compréhension Orale, Lecture, Conversation

---

## 6. Défis

### 6.1 Défis Quotidiens (3 Défis par Jour)

Chaque jour à 00h00, 3 nouveaux défis sont générés algorithmiquement basés sur :
- Le niveau HSK de l'utilisateur
- Ses points faibles identifiés par l'IA
- Sa progression dans les leçons en cours

**Types de Défis Quotidiens :**

**Défis de Rapidité :**
- "Complète 10 flashcards en moins de 3 minutes"
- "Enchaîne 5 prononciations parfaites"
- "Réponds à 15 QCM en moins de 2 minutes"
- Récompense type : 75 XP + 30 MandaCoins

**Défis de Précision :**
- "Obtiens 90%+ dans la leçon X"
- "Trace 5 caractères avec score 95%+"
- "Réussis le mini-jeu Stroke Master sans erreur"
- Récompense type : 100 XP + 50 MandaCoins

**Défis de Régularité :**
- "Pratique la prononciation 10 minutes aujourd'hui"
- "Révise 20 cartes SRS"
- "Complète 1 dialogue avec MandaBot"
- Récompense type : 75 XP + coffre Jade

**Défis Culturels :**
- "Apprends 3 faits sur la fête X"
- "Identifie 5 radicaux dans un texte"
- "Écoute un extrait audio et réponds aux questions"
- Récompense type : 50 XP + badge culturel

### 6.2 Défis Hebdomadaires (5 Défis par Semaine)

Disponibles le lundi, expirent le dimanche à 23h59.

**Niveaux de Difficulté Hebdomadaire :**

**Défi Facile (x2 par semaine) :**
- "Complète 5 leçons cette semaine"
- "Obtiens 1000 XP cette semaine"
- Récompense : 200 XP + 100 MandaCoins

**Défi Intermédiaire (x2 par semaine) :**
- "Maîtrise 30 nouvelles cartes SRS (niveau Familier+)"
- "Joue 5 mini-jeux différents et score dans le top 50%"
- Récompense : 400 XP + 200 MandaCoins + coffre Jade

**Défi Expert (x1 par semaine) :**
- "Complète une leçon entière avec 100% de précision"
- "Maintiens un score de prononciation moyen de 80%+ sur 20 exercices"
- "Remporte une partie de Flashcard Duel contre 3 adversaires"
- Récompense : 800 XP + 400 MandaCoins + 5 MandaGems + coffre Or

### 6.3 Défi Mensuel Épique (1 Défi par Mois)

Un défi de grande envergure publié le 1er de chaque mois. Thématique liée au calendrier culturel chinois.

**Exemples de Défis Mensuels Épiques :**

**Janvier - "La Course au Printemps" (春节冲刺) :**
- Objectif : Apprendre les 50 mots essentiels du Nouvel An Chinois + compléter 10 leçons + réussir 5 quiz culture
- Durée : 31 jours
- Récompense : 2000 XP + 1000 MandaCoins + 20 MandaGems + badge "Gardien du Printemps" + avatar "Dieu de la Fortune"

**Avril - "L'Éveil du Dragon" (苏醒的龙) :**
- Objectif : Progresser d'un niveau HSK (ou terminer un module entier) en un mois
- Durée : 30 jours
- Récompense : 2000 XP + 1000 MandaCoins + 20 MandaGems + badge "Dragon Éveillé" + coffre Dragon x3

**Septembre - "La Lune Pleine" (中秋挑战) :**
- Objectif : 30 jours de streak + 2000 cartes SRS révisées + compléter le module "Poésie Tang"
- Durée : 30 jours
- Récompense : 2000 XP + 1000 MandaCoins + 25 MandaGems + badge "Ami de la Lune" + titre "Poète du Tang"

### 6.4 Tournois Saisonniers

Organisés une fois par trimestre (4 par an), les tournois mettent en compétition les meilleurs apprenants mondiaux.

**Structure d'un Tournoi :**

**Phase 1 - Qualification (7 jours) :**
- Ouvert à tous les utilisateurs
- Accumulation de points de tournoi (différents des XP normaux)
- Top 500 qualifiés pour les phases suivantes

**Phase 2 - Éliminatoires (3 jours) :**
- Matchs 1v1 en temps réel sur des mini-jeux thématiques
- Bracket de 256 joueurs -> 32 finalistes

**Phase 3 - Finale (1 journée) :**
- 32 finalistes en direct
- 3 épreuves : Prononciation IA, Flashcard Duel, Grammar Builder
- Classement final en temps réel
- Commentaire live de MandaBot

**Récompenses de Tournoi :**
- 1er : 10 000 MandaCoins + 500 MandaGems + trophée physique + titre saisonnier + invitation événement physique (si disponible)
- 2e-3e : 5000 MandaCoins + 200 MandaGems + trophée numérique
- 4e-10e : 2000 MandaCoins + 100 MandaGems
- 11e-32e : 500 MandaCoins + 50 MandaGems + badge participation

---

## 7. Monnaie Virtuelle

### 7.1 MandaCoins (铜钱)

**Présentation :** Monnaie de base gagnée exclusivement en jouant. Inspirées des pièces de monnaie chinoises antiques (sapèques avec trou carré).

**Sources de MandaCoins :**
- Complétion de leçons : 10-50 MandaCoins selon performance
- Défis quotidiens : 30-50 MandaCoins
- Défis hebdomadaires : 100-400 MandaCoins
- Streak jalons : 50-15000 MandaCoins
- Ligues fin de semaine : 50-8000 MandaCoins
- Mini-jeux : 5-100 MandaCoins par partie
- Révisions SRS : 1 MandaCoin par carte correcte
- Prononciation parfaite : 20 MandaCoins par exercice

**Dépenses de MandaCoins :**

| Item | Coût |
|------|------|
| Bouclier de streak | 200 MC |
| Booster XP x1.5 (1h) | 100 MC |
| Booster XP x2 (1h) | 250 MC |
| Coffre Or (ouverture) | 50 MC |
| Coffre Dragon (ouverture) | 200 MC |
| Élément d'avatar commun | 500 MC |
| Élément d'avatar rare | 1500 MC |
| Titre honorifique commun | 1000 MC |
| Hint dans un exercice | 10 MC |
| Session MandaBot 30 min supplémentaire | 300 MC |
| Personnalisation de profil (bordure) | 800 MC |

**Limite de stockage :** 50 000 MandaCoins (incite à la dépense régulière)

### 7.2 MandaGems (龙珠)

**Présentation :** Monnaie premium sous forme de perles de dragon. Achetables avec de l'argent réel OU gagnables (lentement) en jeu pour les utilisateurs dédiés.

**Achat de MandaGems :**

| Offre | Gems | Prix | Prix/Gem |
|-------|------|------|---------|
| Starter | 100 gems | 1,99 EUR | 0,020 EUR |
| Small | 550 gems | 9,99 EUR | 0,018 EUR |
| Medium | 1200 gems | 19,99 EUR | 0,017 EUR |
| Large | 2500 gems | 39,99 EUR | 0,016 EUR |
| Mega | 6500 gems | 99,99 EUR | 0,015 EUR |

**Gain gratuit de MandaGems :**
- Streak 30 jours : 10 gems
- Streak 100 jours : 50 gems
- Streak 365 jours : 365 gems
- Niveau 100 atteint : 100 gems
- Tournoi participation : 10-50 gems
- Ligue Légende (hebdo) : 200 gems
- Invitations amis (5 gems par ami qui joue 7 jours)

**Dépenses de MandaGems :**

| Item | Coût |
|------|------|
| Abonnement Premium (mois) | 299 gems |
| Abonnement Premium (annuel) | 2499 gems |
| Coffre Dragon (ouverture) | 10 gems |
| Avatar épique exclusif | 50 gems |
| Avatar légendaire exclusif | 150 gems |
| Titre honorifique rare | 25 gems |
| Pack de 5 boucliers | 20 gems |
| Booster XP x3 (24h) | 30 gems |
| HSK Level Pack (hors-ligne) | 150 gems |
| Session MandaBot illimitée (24h) | 20 gems |
| Restauration d'un streak perdu (max 1x/mois) | 50 gems |

**Non-Pay-to-Win Garanti :**
- Les MandaGems n'achètent jamais directement de l'XP
- Aucun avantage compétitif direct en ligue n'est achetable
- Tous les contenus pédagogiques peuvent être accédés sans achat

### 7.3 Boutique Virtuelle (曼达商城)

**Section Avatars :**
- Mise à jour mensuelle de 5-10 nouveaux éléments
- Collections thématiques (Zodiac, Dynasties, Modernité)
- Offres "bundle" avec économie de 20%

**Section Boosters :**
- Boosters XP temporaires
- Boosters de streak
- Packs de hints

**Section Cosmétiques :**
- Cadres de profil animés
- Effets de célébration personnalisés
- Thèmes d'interface (Clair, Sombre, "Nuit de Jade", "Aube Impériale")
- Sons de notification personnalisés

**Section Événementielle :**
- Items limités lors des fêtes chinoises (disponibles 7-14 jours)
- Collections saisonnières
- Items de collaboration exclusive

**Section Éducative (MandaCoins uniquement) :**
- Cartes de vocabulaire premium (illustrations HD)
- Packs de mini-exercices bonus
- Thèmes de leçon alternatifs

---

## 8. Fonctionnalités Sociales

### 8.1 Système d'Amis

- Recherche par pseudo ou QR code
- Feed d'activité des amis (leçons complétées, badges gagnés, streaks)
- Envoi de "encouragements" (3 par jour, coeur ou message automatique)
- Comparaison de stats avec un ami spécifique
- Défis "1v1" envoyables à des amis (mini-jeu choisi, score à battre)

### 8.2 Clans (族群)

- Groupe de 20-50 apprenants avec objectif commun
- XP collectif hebdomadaire pour les récompenses de clan
- Classement des clans au niveau mondial
- Chat de clan avec modération
- Missions de clan (ex: "le clan complète 500 leçons cette semaine")
- Récompenses de clan : MandaCoins partagés + badge exclusif

### 8.3 Mur de la Communauté

- Partage de calligraphies créées
- Questions pédagogiques entre apprenants
- Célébrations de milestones (certifiées par Manda Go)
- Contenu culturel partagé (articles, vidéos, anecdotes)
- Modération IA + équipe humaine

---

*Document rédigé par l'équipe Gamification Manda Go - Version 1.0 - Juin 2026*
