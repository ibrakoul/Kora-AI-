# Niveau 12 — Forensique numérique / Digital Forensics

**FR :** Collecter et analyser des preuves numériques dans les règles de l'art. **EN:** Collect and analyze digital evidence to professional standards.

## Chapitres / Chapters
| # | Titre / Title | Sujets / Topics | Statut |
|---|---------------|-----------------|--------|
| 1 | Principes & chaîne de custody *(planifié)* | Chain of Custody, intégrité, ordre de volatilité | 🧱 |
| 2 | Analyse mémoire : Volatility *(planifié)* | Volatility, dumps RAM, artefacts | 🧱 |
| 3 | Analyse disque : Autopsy *(planifié)* | Autopsy, systèmes de fichiers, timeline | 🧱 |
| 4 | Outils forensiques : FTK *(planifié)* | FTK, imaging, recherche | 🧱 |
| 5 | Rapport & présentation *(planifié)* | Rapport, reproductibilité | 🧱 |

Gabarit : [`_TEMPLATE_CHAPITRE.md`](../_TEMPLATE_CHAPITRE.md). Couvre : Volatility · Autopsy · FTK · Chain of Custody · Memory Analysis · Disk Analysis.

## Principe clé / Key principle
```
ORDRE DE VOLATILITÉ / ORDER OF VOLATILITY (collecter du + volatil au - volatil)
Registres/cache ▶ RAM ▶ état réseau ▶ processus ▶ disque ▶ sauvegardes ▶ archives
```

## Compétences visées / Target skills
**FR :** Préserver l'intégrité et la chaîne de custody, imager un disque, analyser la RAM (Volatility) et le disque (Autopsy), rédiger un rapport recevable.
**EN:** Preserve integrity and chain of custody, image a disk, analyze RAM (Volatility) and disk (Autopsy), write an admissible report.

⬅️ [Niveau 11](../niveau-11-soc-analyst/README.md) · 🏁 Fin du parcours / End of path → [Accueil](../README.md)
