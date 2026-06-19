# 12 — Modèle Économique Manda Go

> Stratégie de monétisation d'une startup licorne en apprentissage des langues.

---

## 12.1 Vue d'Ensemble

Manda Go adopte un modèle **Freemium Premium-First** : l'expérience gratuite est suffisamment riche pour créer l'habitude, mais le premium est si attractif que la conversion devient naturelle.

**Principe directeur :** Proposer une valeur premium supérieure à HelloChinese à **50 % du prix**.

| Métrique | HelloChinese | Manda Go |
|----------|-------------|----------|
| Abonnement mensuel | ~9,99 €/mois | **4,99 €/mois** |
| Abonnement annuel | ~79,99 €/an | **39,99 €/an** |
| IA illimitée | Non | Oui |
| Mini-jeux | 10 | 35 |
| Mode hors ligne | Partiel | Complet |
| Prononciation IA | Basique | Avancée |

---

## 12.2 Version Gratuite (Freemium)

### Contenu inclus gratuitement
- **3 leçons par jour** (5 pendant la première semaine de bienvenue)
- **Niveaux HSK 1-2** en accès libre
- **10 échanges IA MandaBot** par jour (puis retour le lendemain)
- **5 mini-jeux de base** : Dragon Chase, Manda Match, Pinyin Rain, Flashcard Duel, Tone Tower
- **Streak quotidien** (sans bouclier)
- **Classement Bronze** uniquement
- **Vocabulaire SRS** limité à 200 mots actifs
- **Prononciation basique** : feedback textuel uniquement

### Publicités (non-intrusives)
- 1 bannière non-animée en bas de l'écran principal
- 1 interstitiel après la 3e leçon du jour (max)
- **Zéro publicité** pendant les exercices, les leçons et le chat IA
- Récompense optionnelle : regarder une publicité pour +1 leçon bonus

### Objectif du freemium
Créer l'habitude d'apprentissage sur 7 jours, puis déclencher l'envie de passer premium grâce aux **blocages doux** (messages motivants, aperçus du contenu premium).

---

## 12.3 Plans Premium

### Plan Manda Go Plus — Mensuel
- **Prix : 4,99 €/mois**
- Facturation mensuelle via Stripe
- Annulation à tout moment
- Essai gratuit 7 jours (carte requise)

### Plan Manda Go Plus — Annuel ⭐ RECOMMANDÉ
- **Prix : 39,99 €/an** (soit 3,33 €/mois)
- Économie de 40 % vs mensuel
- Équivalent à 2 mois offerts
- Badge "Supporter Annuel" exclusif
- Essai gratuit 14 jours

### Plan Manda Go Family — Annuel
- **Prix : 59,99 €/an**
- Jusqu'à **5 comptes** premium
- Tableau de bord famille avec suivi des progrès
- Idéal pour famille, duo, classe
- Essai gratuit 7 jours

### Plan Manda Go Lifetime (Offre de lancement)
- **Prix : 149,99 €** (offre limitée aux 10 000 premiers utilisateurs)
- Accès à vie à toutes les fonctionnalités premium actuelles et futures
- Badge "Fondateur" unique et non-reproductible
- Accès prioritaire aux nouvelles fonctionnalités en bêta

---

## 12.4 Fonctionnalités Premium Détaillées

### Apprentissage
- Leçons **illimitées** (HSK 1 à HSK 9)
- Accès aux cours spécialisés : Business Mandarin, Voyage, Culture, Médias
- Mode hors ligne complet (téléchargement jusqu'à 5 cours)
- SRS illimité (vocabulaire sans plafond)
- Exercices d'écriture avec reconnaissance IA des caractères

### Intelligence Artificielle
- **MandaBot illimité** (conversations sans limite quotidienne)
- Mode vocal temps réel avec le professeur IA
- 3 personnalités de professeur : Liu Laoshi, Mei Mei, Master Chen
- Génération de dialogues sur mesure selon les intérêts
- Correction grammaticale avancée avec explications contextuelles

### Prononciation
- Analyse des 4 tons en temps réel (score 0-100%)
- Visualisation waveform + courbe mélodique
- Comparaison audio avec 3 locuteurs natifs (Beijing, Shanghai, Taiwan)
- Historique de progression de prononciation
- Exercices ciblés sur les faiblesses phonétiques détectées

### Gamification Premium
- Accès à toutes les **8 ligues** (jusqu'à Ligue Dragon et Ligue Légende)
- Tous les **35 mini-jeux**
- Boucliers de streak (2 par mois)
- Coffres Dragon exclusifs (rareté maximale)
- Avatars premium et personnalisations
- Badges exclusifs (or et platine)

### Expérience
- **Zéro publicité**
- Statistiques avancées (heatmap, temps par compétence, courbe de rétention)
- Exports de progression (PDF mensuel)
- Support prioritaire (réponse < 24h)
- Accès bêta aux nouvelles fonctionnalités

---

## 12.5 Intégration Stripe

### Configuration des produits Stripe

```typescript
// Stripe Products & Prices
const products = {
  plus_monthly: {
    productId: 'prod_manda_plus',
    priceId: 'price_4_99_monthly',
    amount: 499, // centimes
    currency: 'eur',
    interval: 'month',
    trial_period_days: 7,
  },
  plus_yearly: {
    productId: 'prod_manda_plus',
    priceId: 'price_39_99_yearly',
    amount: 3999,
    currency: 'eur',
    interval: 'year',
    trial_period_days: 14,
  },
  family_yearly: {
    productId: 'prod_manda_family',
    priceId: 'price_59_99_family',
    amount: 5999,
    currency: 'eur',
    interval: 'year',
    trial_period_days: 7,
  },
  lifetime: {
    productId: 'prod_manda_lifetime',
    priceId: 'price_149_99_lifetime',
    amount: 14999,
    currency: 'eur',
    type: 'one_time',
  },
};
```

### Gestion des Webhooks Stripe

Événements gérés :
- `customer.subscription.created` → Activer premium
- `customer.subscription.updated` → Mettre à jour le plan
- `customer.subscription.deleted` → Révoquer l'accès premium
- `invoice.payment_succeeded` → Confirmer le renouvellement
- `invoice.payment_failed` → Email de relance + grace period 3 jours
- `customer.subscription.trial_will_end` → Notification 3 jours avant la fin d'essai

### Gestion des Échecs de Paiement

```
Jour 0: Paiement échoué → Email + notification in-app
Jour 1: Retry automatique Stripe
Jour 3: 2e retry + email "Votre accès sera suspendu dans 48h"
Jour 5: Accès premium révoqué → Downgrade gracieux
Jour 7: 3e email "Réactivez votre compte"
Jour 30: Email dernière chance avec coupon -20%
```

### Prix par Région (PPP — Parité de Pouvoir d'Achat)

| Région | Plus Mensuel | Plus Annuel |
|--------|-------------|-------------|
| Europe (€) | 4,99 € | 39,99 € |
| USA ($) | 5,99 $ | 44,99 $ |
| UK (£) | 4,49 £ | 35,99 £ |
| Brésil (R$) | 14,90 R$ | 119,90 R$ |
| Inde (₹) | 249 ₹ | 1 999 ₹ |
| Chine (¥) | — | — (App localisée séparément) |

---

## 12.6 Projections Financières

### Hypothèses de Conversion
- Taux de conversion freemium → premium : **8 %** (industrie : 3-5%, premium prix bas vise 8-12%)
- Distribution plans : 55% annuel, 35% mensuel, 10% family/lifetime
- Churn mensuel : 5% (annuel : 15%)
- ARPU moyen : 5,20 €/mois (blended)

### Trajectoire de Croissance

#### An 1 — Phase de lancement
- Utilisateurs actifs : **50 000**
- Utilisateurs premium : **4 000** (8%)
- ARR : **250 000 €**
- MRR moyen : **20 800 €**
- Burn rate estimé : 30 000 €/mois
- Coût acquisition (CAC) cible : < 3 €

#### An 2 — Phase de croissance
- Utilisateurs actifs : **500 000**
- Utilisateurs premium : **45 000** (9%)
- ARR : **2 800 000 €**
- Breakeven attendu en Q3 An 2

#### An 3 — Phase d'échelle
- Utilisateurs actifs : **2 000 000**
- Utilisateurs premium : **200 000** (10%)
- ARR : **12 500 000 €**
- EBITDA positif : ~30%

#### An 5 — Vision licorne
- Utilisateurs actifs : **10 000 000**
- Utilisateurs premium : **1 500 000** (15%)
- ARR : **93 600 000 €**
- Valorisation estimée : **500M€ — 1 Md€**

---

## 12.7 Revenus Annexes

### Contenu B2B
- **Manda Go Entreprise** : licences pour entreprises souhaitant former leurs équipes
  - Prix : 8 €/utilisateur/mois (min 10 utilisateurs)
  - Dashboard RH, suivi équipe, certifications
  - Cible : entreprises avec activités en Chine

### Manda Go Academy (An 2+)
- Cours live hebdomadaires avec professeurs natifs
- 19,99 €/mois (add-on premium)
- Sessions de groupe (8 personnes max)

### Certifications HSK
- Préparation officielle HSK 3-6
- Pack préparation : 29,99 € (one-time)
- Partenariat avec Hanban/Institut Confucius

### Programme Ambassadeurs
- Commission 20% récurrente sur les abonnements référés
- Paiement mensuel via Stripe Connect
- Dashboard dédié avec analytics

---

## 12.8 Métriques Clés (North Star)

| KPI | Cible An 1 | Cible An 2 |
|-----|-----------|-----------|
| DAU/MAU ratio | > 40% | > 50% |
| D1 Retention | > 60% | > 65% |
| D7 Retention | > 35% | > 40% |
| D30 Retention | > 20% | > 25% |
| Streak 30 jours | > 15% utilisateurs | > 20% |
| Session moyenne | > 12 min | > 15 min |
| NPS | > 50 | > 65 |
| CAC blended | < 3 € | < 2,50 € |
| LTV (12 mois) | > 40 € | > 50 € |
| LTV/CAC | > 13x | > 20x |
| ARPU mensuel | 5,20 € | 5,80 € |
