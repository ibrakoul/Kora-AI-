# 🛡️ Formation Cybersécurité Bilingue / Bilingual Cybersecurity Training

> **FR** — Formation professionnelle complète, du débutant au niveau professionnel, couvrant les systèmes, les réseaux, l'administration, la cybersécurité, la détection, la réponse à incident, le cloud, l'Active Directory, Microsoft 365 et les principaux outils du métier. Inspirée des compétences des parcours **CompTIA A+, Network+, Security+, CySA+** et des bonnes pratiques de l'industrie — **sans reproduction de contenu propriétaire**.
>
> **EN** — A complete professional training program, from beginner to job-ready, covering systems, networks, administration, cybersecurity, detection, incident response, cloud, Active Directory, Microsoft 365 and the industry's core tools. Aligned with the skills of the **CompTIA A+, Network+, Security+, CySA+** tracks and industry best practices — **without reproducing any proprietary content**.

---

## 📌 Avertissement / Disclaimer

**FR** — Ce cours est **original**. Il enseigne les *compétences* attendues par les certifications de l'industrie mais **ne reproduit aucun objectif d'examen, question, ou texte propriétaire** de CompTIA, (ISC)², Microsoft ou tout autre éditeur. Les marques citées appartiennent à leurs propriétaires respectifs et ne sont mentionnées qu'à titre de repère pédagogique. Tous les laboratoires doivent être réalisés **uniquement sur des systèmes que vous possédez ou pour lesquels vous disposez d'une autorisation écrite**. Le pentest sans autorisation est illégal.

**EN** — This course is **original**. It teaches the *skills* expected by industry certifications but **reproduces no exam objectives, questions, or proprietary text** from CompTIA, (ISC)², Microsoft or any other vendor. Trademarks belong to their respective owners and are cited only as pedagogical landmarks. All labs must be performed **only on systems you own or are explicitly authorized to test in writing**. Unauthorized penetration testing is illegal.

---

## 🎓 Objectif final / Final objective

**FR** — À la fin de la formation, l'étudiant sait :
- administrer un réseau professionnel ;
- sécuriser un parc informatique (Windows, Linux, macOS) ;
- analyser des journaux (logs) ;
- détecter des attaques ;
- répondre à un incident ;
- appliquer les bonnes pratiques de cybersécurité ;
- posséder les compétences fondamentales visées par CompTIA A+, Network+, Security+.

**EN** — By the end, the learner can:
- administer a professional network;
- secure an IT estate (Windows, Linux, macOS);
- analyze logs;
- detect attacks;
- respond to an incident;
- apply cybersecurity best practices;
- hold the foundational skills targeted by CompTIA A+, Network+, Security+.

---

## 🗺️ Parcours pédagogique / Learning path

```
                    ┌─────────────────────────────────────────────┐
                    │        FORMATION CYBERSÉCURITÉ (12 NIVEAUX)   │
                    └─────────────────────────────────────────────┘

  DÉBUTANT / BEGINNER                                     PROFESSIONNEL / PRO
  ────────────────────────────────────────────────────────────────────────▶

  N1 Fondamentaux IT ─▶ N2 Réseaux ─▶ N3 Admin Système ─▶ N4 Cybersécurité
        │                                                        │
        ▼                                                        ▼
  N5 Menaces (Threats) ◀───────────────────────────────  N6 Sécurité Windows
        │                                                        │
        ▼                                                        ▼
  N7 Sécurité Linux ─▶ N8 Cloud Security ─▶ N9 Pentest Basics
        │
        ▼
  N10 Réponse à Incident ─▶ N11 SOC Analyst ─▶ N12 Digital Forensics
```

| # | Niveau / Level | Dossier / Folder | Prérequis / Prereq |
|---|----------------|------------------|--------------------|
| 1 | Fondamentaux IT / IT Fundamentals | [`niveau-01-fondamentaux-it/`](niveau-01-fondamentaux-it/) | — |
| 2 | Réseaux / Networking | [`niveau-02-reseaux/`](niveau-02-reseaux/) | N1 |
| 3 | Administration système / System Admin | [`niveau-03-administration-systeme/`](niveau-03-administration-systeme/) | N1–N2 |
| 4 | Cybersécurité / Cybersecurity | [`niveau-04-cybersecurite/`](niveau-04-cybersecurite/) | N1–N3 |
| 5 | Menaces / Threats | [`niveau-05-menaces-threats/`](niveau-05-menaces-threats/) | N4 |
| 6 | Sécurité Windows / Windows Security | [`niveau-06-securite-windows/`](niveau-06-securite-windows/) | N3–N4 |
| 7 | Sécurité Linux / Linux Security | [`niveau-07-securite-linux/`](niveau-07-securite-linux/) | N3–N4 |
| 8 | Sécurité Cloud / Cloud Security | [`niveau-08-securite-cloud/`](niveau-08-securite-cloud/) | N4 |
| 9 | Bases du Pentest / Pentest Basics | [`niveau-09-pentest-basics/`](niveau-09-pentest-basics/) | N2–N5 |
| 10 | Réponse à incident / Incident Response | [`niveau-10-reponse-incident/`](niveau-10-reponse-incident/) | N4–N6 |
| 11 | Analyste SOC / SOC Analyst | [`niveau-11-soc-analyst/`](niveau-11-soc-analyst/) | N4–N10 |
| 12 | Forensique / Digital Forensics | [`niveau-12-forensics/`](niveau-12-forensics/) | N4–N10 |

---

## 🧩 Structure d'un chapitre / Chapter structure

**FR** — Chaque chapitre suit un gabarit constant de **24 sections**, toujours **français puis anglais**. Voir le gabarit : [`_TEMPLATE_CHAPITRE.md`](_TEMPLATE_CHAPITRE.md).

**EN** — Every chapter follows a constant **24-section** template, always **French then English**. See the template: [`_TEMPLATE_CHAPITRE.md`](_TEMPLATE_CHAPITRE.md).

1. Titre (FR/EN) · 2. Objectifs pédagogiques · 3. Introduction · 4. Explication détaillée · 5. Schémas ASCII · 6. Illustrations textuelles · 7. Analogies · 8. Exemples professionnels · 9. Exemples réels d'entreprises · 10. Bonnes pratiques · 11. Erreurs fréquentes · 12. Étude de cas · 13. Travaux pratiques · 14. Laboratoire complet · 15. Commandes Windows · 16. Commandes Linux · 17. PowerShell · 18. Bash · 19. Quiz (20 questions) · 20. Correction détaillée · 21. Résumé · 22. Glossaire bilingue · 23. Ressources complémentaires · 24. Check-list de fin.

---

## 🧪 Environnement de laboratoire / Lab environment

**FR** — Les laboratoires utilisent des outils gratuits/légaux : **VirtualBox / VMware / Hyper-V**, **Windows 11**, **Windows Server 2022**, **Ubuntu Server**, **Kali Linux**, **pfSense**, **Active Directory**, **Microsoft Defender**, **Microsoft Sentinel**, **Azure (compte gratuit)**. Guide de montage : [`_assets/labs/README-lab.md`](_assets/labs/README-lab.md).

**EN** — Labs rely on free/legal tooling: **VirtualBox / VMware / Hyper-V**, **Windows 11**, **Windows Server 2022**, **Ubuntu Server**, **Kali Linux**, **pfSense**, **Active Directory**, **Microsoft Defender**, **Microsoft Sentinel**, **Azure (free tier)**. Build guide: [`_assets/labs/README-lab.md`](_assets/labs/README-lab.md).

---

## ✅ Comment suivre le cours / How to follow

**FR**
1. Lisez les niveaux dans l'ordre (ou selon vos prérequis).
2. Faites **chaque** TP et laboratoire — la cybersécurité s'apprend par la pratique.
3. Répondez au quiz **sans regarder** la correction.
4. Tenez un journal de laboratoire (dates, commandes, captures).

**EN**
1. Read levels in order (or per prerequisites).
2. Do **every** hands-on lab — security is learned by doing.
3. Take the quiz **before** reading the answers.
4. Keep a lab journal (dates, commands, screenshots).

---

## 📚 État d'avancement / Build status

**FR** — Le cours est **modulaire et évolutif**. Le squelette des 12 niveaux, le gabarit et les chapitres phares sont livrés ; les chapitres restants suivent le même gabarit et sont ajoutés niveau par niveau.

**EN** — The course is **modular and incremental**. The 12-level scaffold, the template and flagship chapters are delivered; the remaining chapters follow the same template and are added level by level.

| Niveau | Chapitres livrés / Delivered | Statut |
|--------|------------------------------|--------|
| N1 | Hardware/CPU/RAM/Stockage, BIOS·UEFI·Virtualisation, OS | ✅ Complet |
| N2 | Modèles OSI & TCP/IP (+ index) | ✅ Chapitre phare |
| N4 | Triade CIA & Zero Trust (+ index) | ✅ Chapitre phare |
| N5 | Panorama des malwares (+ index) | ✅ Chapitre phare |
| N3, N6–N12 | Index + plan détaillé | 🧱 Scaffold |

---

*Licence pédagogique : contenu original destiné à la formation. / Educational license: original content for training purposes.*
