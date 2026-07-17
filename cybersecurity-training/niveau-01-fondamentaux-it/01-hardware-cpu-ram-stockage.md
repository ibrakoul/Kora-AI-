# Niveau 1 · Chapitre 1 — Matériel : CPU, RAM, Stockage / Hardware: CPU, RAM, Storage

## 1. Titre / Title
**FR :** Le matériel informatique — Processeur (CPU), Mémoire vive (RAM), Stockage (SSD/HDD)
**EN:** Computer Hardware — Processor (CPU), Memory (RAM), Storage (SSD/HDD)

---

## 2. Objectifs pédagogiques / Learning objectives
**FR :** À la fin de ce chapitre, l'apprenant saura :
- décrire le rôle du CPU, de la RAM et du stockage, et comment ils coopèrent ;
- lire une fiche technique (GHz, cœurs, threads, cache, DDR, IOPS) ;
- distinguer SSD et HDD, et choisir le bon composant selon un besoin ;
- diagnostiquer un poste lent en raisonnant sur le goulet d'étranglement (bottleneck) ;
- comprendre pourquoi le matériel est une **surface d'attaque** (firmware, DMA, chiffrement disque).

**EN:** By the end, the learner will be able to:
- describe the role of CPU, RAM and storage and how they cooperate;
- read a spec sheet (GHz, cores, threads, cache, DDR, IOPS);
- tell SSD from HDD and pick the right component for a need;
- diagnose a slow machine by reasoning about the bottleneck;
- understand why hardware is an **attack surface** (firmware, DMA, disk encryption).

---

## 3. Introduction
**FR :** Tout, en cybersécurité, s'exécute sur du matériel. Un analyste qui ne comprend pas où vivent les données (RAM volatile vs disque persistant) ne peut ni faire de forensique mémoire, ni comprendre pourquoi BitLocker protège un portable volé. Ce chapitre pose la fondation physique de tout le reste de la formation.

**EN:** In cybersecurity, everything runs on hardware. An analyst who does not understand where data lives (volatile RAM vs persistent disk) can neither perform memory forensics nor grasp why BitLocker protects a stolen laptop. This chapter lays the physical foundation for the rest of the course.

---

## 4. Explication détaillée / Detailed explanation

### 4.1 Le CPU (Central Processing Unit)
**FR :** Le processeur exécute des **instructions**. Notions clés :
- **Fréquence (GHz)** : nombre de cycles par seconde (3,5 GHz ≈ 3,5 milliards de cycles/s).
- **Cœurs (cores)** : unités de calcul indépendantes ; plus de cœurs = plus de tâches en parallèle.
- **Threads / SMT / Hyper-Threading** : un cœur physique peut exécuter 2 fils logiques.
- **Cache (L1/L2/L3)** : mémoire ultra-rapide intégrée au CPU, tampon entre le cœur et la RAM.
- **ISA (jeu d'instructions)** : x86-64 (Intel/AMD) vs ARM64 (Apple Silicon, mobiles, serveurs cloud).

**EN:** The processor executes **instructions**. Key notions:
- **Clock (GHz)**: cycles per second (3.5 GHz ≈ 3.5 billion cycles/s).
- **Cores**: independent compute units; more cores = more parallel work.
- **Threads / SMT / Hyper-Threading**: one physical core can run 2 logical threads.
- **Cache (L1/L2/L3)**: ultra-fast on-die memory, a buffer between core and RAM.
- **ISA (instruction set)**: x86-64 (Intel/AMD) vs ARM64 (Apple Silicon, mobile, cloud servers).

### 4.2 La RAM (Random Access Memory)
**FR :** Mémoire de **travail**, **volatile** (vidée à l'extinction). Le CPU y charge le code et les données actifs. Générations **DDR4/DDR5**, mesurée en Go et en MHz/MT/s. Si la RAM manque, l'OS **pagine** sur le disque (lent) → ralentissement. En sécurité, la RAM contient mots de passe, clés de chiffrement et malware « fileless » → cible de la **forensique mémoire**.

**EN:** The **working** memory, **volatile** (wiped on power-off). The CPU loads active code and data here. Generations **DDR4/DDR5**, measured in GB and MHz/MT/s. When RAM runs out, the OS **pages** to disk (slow) → slowdown. In security, RAM holds passwords, encryption keys and "fileless" malware → the target of **memory forensics**.

### 4.3 Le stockage (SSD / HDD)
**FR :** Mémoire **persistante** (conservée hors tension).
- **HDD** : plateaux magnétiques + tête mécanique. Lent, pas cher, gros volumes, fragile aux chocs.
- **SSD** : puces flash NAND, aucune pièce mobile. Rapide, cher au Go. Interfaces **SATA** (~550 Mo/s) vs **NVMe/PCIe** (plusieurs Go/s).
- Métriques : **IOPS** (opérations/s), débit (Mo/s), latence (ms).

**EN:** **Persistent** memory (kept without power).
- **HDD**: magnetic platters + mechanical head. Slow, cheap, high capacity, shock-sensitive.
- **SSD**: NAND flash chips, no moving parts. Fast, pricier per GB. Interfaces **SATA** (~550 MB/s) vs **NVMe/PCIe** (several GB/s).
- Metrics: **IOPS** (operations/s), throughput (MB/s), latency (ms).

### 4.4 La hiérarchie mémoire / The memory hierarchy
**FR :** Plus c'est proche du cœur, plus c'est rapide, cher et petit.
**EN:** The closer to the core, the faster, costlier and smaller.

---

## 5. Schémas ASCII / ASCII diagrams

```
        RAPIDE / FAST · CHER / COSTLY · PETIT / SMALL
        ┌───────────────────────────────────────────┐
        │  Registres CPU        ~1 ns     octets     │
        │  Cache L1/L2/L3       ~1-10 ns  Ko–Mo      │
        │  RAM (DDR5)           ~50-100 ns Go        │  ← volatile
        │  SSD NVMe             ~10-100 µs To        │  ← persistant
        │  HDD                  ~5-10 ms  To         │  ← persistant
        │  Réseau / Cloud       ~ms–s     ∞          │
        └───────────────────────────────────────────┘
        LENT / SLOW · BON MARCHÉ / CHEAP · GRAND / LARGE

   FLUX D'EXÉCUTION / EXECUTION FLOW
   Disque(SSD) ──charge──▶ RAM ──alimente──▶ Cache ──▶ Cœur CPU
       (persistant)        (volatile)                  (calcul)
```

---

## 6. Illustrations textuelles / Textual illustrations
**FR :** Imaginez un bureau : le **cœur du CPU** est vous, le **cache** votre main, la **RAM** le plan de travail où sont posés les dossiers ouverts, le **SSD/HDD** l'armoire d'archives. Vous ne pouvez lire qu'un dossier posé devant vous (RAM) ; le sortir de l'armoire (disque) prend du temps.

**EN:** Picture a desk: the **CPU core** is you, the **cache** is your hand, **RAM** is the desktop holding the open folders, the **SSD/HDD** is the filing cabinet. You can only read a folder that is on the desk (RAM); pulling one from the cabinet (disk) takes time.

---

## 7. Analogies simples / Simple analogies
| Composant | Analogie FR | Analogy EN |
|---|---|---|
| CPU | Le chef cuisinier qui exécute la recette | The chef executing the recipe |
| RAM | Le plan de travail (ce qui est sous la main) | The countertop (what's within reach) |
| SSD/HDD | Le garde-manger / la réserve | The pantry / storeroom |
| Cache | Les épices déjà à portée de main | Spices already at hand |

---

## 8. Exemples professionnels / Professional examples
**FR :** Un technicien de support voit un poste « qui rame ». Il ouvre le Gestionnaire des tâches : RAM à 98 %, disque HDD à 100 %. Diagnostic : manque de RAM → pagination sur HDD lent. Solution : +8 Go de RAM ou passage SSD. Il raisonne **goulet d'étranglement**, pas « ça bug ».

**EN:** A helpdesk tech faces a "sluggish" PC. Task Manager shows RAM at 98%, HDD at 100%. Diagnosis: low RAM → paging to a slow HDD. Fix: +8 GB RAM or move to SSD. They reason about the **bottleneck**, not "it's buggy."

---

## 9. Exemples réels d'entreprises / Real-world company examples
**FR :**
- **Apple (M-series)** a migré de x86 (Intel) vers **ARM64** maison → gains d'autonomie et intégration sécurité (Secure Enclave).
- Les hébergeurs cloud (**AWS Graviton**, ARM) déploient massivement l'ARM pour le rapport performance/watt.
- **Cold boot attacks** (recherche Princeton) : des clés de chiffrement ont été extraites de la **RAM** encore rémanente après extinction → montre pourquoi la RAM est sensible.

**EN:**
- **Apple (M-series)** moved from x86 (Intel) to in-house **ARM64** → battery gains and security integration (Secure Enclave).
- Cloud providers (**AWS Graviton**, ARM) deploy ARM at scale for performance-per-watt.
- **Cold boot attacks** (Princeton research): encryption keys were recovered from **RAM** still holding residual charge after power-off → shows why RAM is sensitive.

---

## 10. Bonnes pratiques / Best practices
- [ ] **FR/EN** — Dimensionner la RAM selon la charge réelle, pas « au hasard ». / Size RAM to real load, not by guessing.
- [ ] Préférer un **SSD NVMe** comme disque système. / Prefer an **NVMe SSD** for the OS drive.
- [ ] Activer le **chiffrement disque** (BitLocker / FileVault / LUKS). / Enable **disk encryption**.
- [ ] Tenir le **firmware/BIOS à jour** (correctifs de sécurité). / Keep **firmware/BIOS updated**.
- [ ] Surveiller la **santé SSD (SMART)** et prévoir le remplacement. / Monitor **SSD health (SMART)**.

---

## 11. Erreurs fréquentes / Common mistakes
| Erreur / Mistake | Conséquence / Impact | Correction / Fix |
|---|---|---|
| Confondre RAM et stockage | Mauvais diagnostic de lenteur | RAM = travail volatile ; disque = archive persistante |
| Croire « plus de GHz = toujours plus rapide » | Achat inadapté | Regarder cœurs, cache, charge réelle |
| Négliger le firmware | Vulnérabilités persistantes | Patcher BIOS/UEFI |
| SSD sans sauvegarde | Perte de données à la panne | 3-2-1 backup + SMART |

---

## 12. Étude de cas / Case study
**FR :** Une PME se plaint que ses postes comptables « gèlent » chaque fin de mois. Analyse : lors de la clôture, un ERP charge de gros fichiers ; RAM 8 Go saturée, disque HDD à 100 %. Décision : passage à 16 Go + SSD NVMe. Résultat : temps de clôture divisé par 4, plus de gel. Leçon : mesurer avant d'acheter.

**EN:** An SMB reports accounting PCs "freezing" every month-end. Analysis: during closing, an ERP loads large files; 8 GB RAM saturated, HDD at 100%. Decision: upgrade to 16 GB + NVMe SSD. Result: closing time cut 4×, no more freezes. Lesson: measure before you buy.

---

## 13. Travaux pratiques / Hands-on exercises
**FR :**
1. Ouvrez le Gestionnaire des tâches (Windows) / `htop` (Linux) et identifiez le composant le plus sollicité.
2. Relevez sur votre machine : nb de cœurs, RAM totale, type de disque.
3. Calculez : si un HDD fait 100 IOPS et un SSD NVMe 500 000 IOPS, quel facteur d'accélération ?

**EN:**
1. Open Task Manager (Windows) / `htop` (Linux) and find the busiest component.
2. Record on your machine: core count, total RAM, disk type.
3. Compute: if an HDD does 100 IOPS and an NVMe SSD 500,000 IOPS, what is the speed-up factor?

---

## 14. Laboratoire complet / Full lab — « Inventaire matériel & goulet d'étranglement »

**Objectif / Objective**
**FR :** Inventorier le matériel d'une VM et identifier le composant limitant sous charge.
**EN:** Inventory a VM's hardware and identify the limiting component under load.

**Architecture**
```
[Hôte] ─ VirtualBox ─ [VM Ubuntu 22.04, 2 vCPU, 2 Go RAM, disque 20 Go]
```

**Préparation / Preparation**
- **FR :** Installer VirtualBox, créer la VM Ubuntu (voir guide labs). Installer `htop stress-ng sysstat`.
- **EN:** Install VirtualBox, create the Ubuntu VM (see labs guide). Install `htop stress-ng sysstat`.

**Configuration**
```bash
sudo apt update && sudo apt install -y htop stress-ng sysstat
lscpu ; free -h ; lsblk -d -o NAME,SIZE,ROTA   # ROTA=1 => HDD, 0 => SSD
```

**Résultats attendus (décrits) / Expected results (described)**
- **FR :** `lscpu` montre 2 CPU ; `free -h` ~2 Go ; sous `stress-ng --cpu 2`, `htop` affiche 100 % CPU → goulet CPU. Sous `stress-ng --vm 2 --vm-bytes 90%`, la RAM sature et le `swap` grimpe.
- **EN:** `lscpu` shows 2 CPUs; `free -h` ~2 GB; under `stress-ng --cpu 2`, `htop` shows 100% CPU → CPU bottleneck. Under `stress-ng --vm 2 --vm-bytes 90%`, RAM saturates and `swap` climbs.

**Commandes de charge / Load commands**
```bash
stress-ng --cpu 2 --timeout 30s --metrics-brief
stress-ng --vm 2 --vm-bytes 90% --timeout 30s
vmstat 1 5    # colonnes r, si/so (swap), us/sy (CPU)
```

**Questions**
1. Quel composant sature en premier sous charge CPU ? mémoire ?
2. Que signifie une valeur `so` (swap out) non nulle dans `vmstat` ?

**Correction / Answer**
1. **FR :** CPU sous `--cpu` ; RAM sous `--vm`. **EN:** CPU under `--cpu`; RAM under `--vm`.
2. **FR/EN :** L'OS écrit de la RAM vers le disque → manque de RAM. / The OS writes RAM to disk → out of RAM.

---

## 15. Commandes Windows / Windows commands
```cmd
systeminfo | findstr /C:"Total Physical Memory"
wmic cpu get Name,NumberOfCores,NumberOfLogicalProcessors
wmic diskdrive get Model,Size,MediaType
```

## 16. Commandes Linux / Linux commands
```bash
lscpu                 # infos CPU
free -h               # RAM et swap
lsblk -d -o NAME,SIZE,ROTA   # ROTA 0=SSD 1=HDD
sudo dmidecode -t memory     # détails barrettes RAM
```

## 17. PowerShell
```powershell
Get-CimInstance Win32_Processor | Select-Object Name, NumberOfCores, NumberOfLogicalProcessors
Get-CimInstance Win32_PhysicalMemory | Measure-Object -Property Capacity -Sum
Get-PhysicalDisk | Select-Object FriendlyName, MediaType, @{n='GB';e={[math]::Round($_.Size/1GB)}}
```

## 18. Bash
```bash
#!/usr/bin/env bash
echo "== CPU =="; lscpu | grep -E 'Model name|^CPU\(s\)|Thread'
echo "== RAM =="; free -h | awk 'NR==2{print $2" total, "$3" used"}'
echo "== DISQUES =="; lsblk -d -o NAME,SIZE,ROTA | awk '{t=($3=="1")?"HDD":"SSD"; print $1, $2, t}'
```

---

## 19. Quiz (20 questions)
1. La RAM est-elle volatile ou persistante ?
2. Que signifie « 3,5 GHz » ?
3. Différence entre cœur physique et thread logique ?
4. Rôle du cache L1/L2/L3 ?
5. SATA vs NVMe : lequel est le plus rapide ?
6. Que mesure l'IOPS ?
7. `ROTA=1` dans `lsblk` indique quoi ?
8. Qu'est-ce que la pagination (swap) ?
9. x86-64 vs ARM64 : donnez un exemple d'appareil pour chaque.
10. Pourquoi la RAM intéresse-t-elle la forensique ?
11. Où sont stockées temporairement les clés de chiffrement en usage ?
12. Un poste « rame » avec RAM à 99 % : quel composant renforcer ?
13. Qu'est-ce que le SMART sur un disque ?
14. Pourquoi un SSD n'aime pas la défragmentation classique ?
15. Quelle commande Linux liste les CPU ?
16. Quelle commande Windows montre la mémoire totale ?
17. Un « cold boot attack » exploite quelle propriété de la RAM ?
18. Vrai/Faux : plus de GHz = toujours plus rapide.
19. Citez 2 métriques d'un disque.
20. Pourquoi patcher le firmware/BIOS ?

---

## 20. Correction détaillée / Detailed answer key
1. **Volatile** (vidée hors tension).
2. 3,5 milliards de cycles d'horloge par seconde.
3. Cœur = unité physique ; thread = fil d'exécution logique (SMT/HT) partageant un cœur.
4. Tampon ultra-rapide réduisant les accès lents à la RAM.
5. **NVMe** (PCIe), plusieurs Go/s vs ~550 Mo/s pour SATA.
6. Le nombre d'opérations d'E/S par seconde.
7. Un disque **rotatif = HDD**.
8. L'OS déplace des pages RAM vers le disque quand la RAM manque.
9. x86-64 : PC de bureau ; ARM64 : smartphone / Mac M-series.
10. Elle contient mots de passe, clés, et malwares « fileless » en clair.
11. En **RAM** (et registres CPU) pendant l'utilisation.
12. La **RAM** (ou vérifier un processus fautif).
13. Un système d'auto-surveillance de santé/erreurs du disque.
14. Flash à accès aléatoire, pas de tête mécanique ; la défrag use les cellules inutilement.
15. `lscpu`.
16. `systeminfo` (ou `wmic memorychip`).
17. La **rémanence** : la RAM garde des données quelques secondes après extinction.
18. **Faux** — cœurs, cache, architecture et charge comptent.
19. IOPS, débit (Mo/s), latence (au choix, 2).
20. Corriger des vulnérabilités et bugs de bas niveau persistants.

---

## 21. Résumé / Summary
**FR :** Le CPU calcule, la RAM (volatile) est l'espace de travail, le stockage (persistant) archive. La performance se raisonne par **goulet d'étranglement**. Le matériel est aussi une **surface d'attaque** : firmware, RAM (clés), disque (chiffrement).
**EN:** The CPU computes, RAM (volatile) is the workspace, storage (persistent) archives. Performance is reasoned via the **bottleneck**. Hardware is also an **attack surface**: firmware, RAM (keys), disk (encryption).

---

## 22. Glossaire bilingue / Bilingual glossary
| Terme FR | Term EN | Définition / Definition |
|---|---|---|
| Processeur | CPU | Unité qui exécute les instructions |
| Mémoire vive | RAM | Mémoire de travail volatile |
| Stockage | Storage | Mémoire persistante (SSD/HDD) |
| Cœur | Core | Unité de calcul indépendante |
| Fil / thread | Thread | Fil d'exécution logique |
| Cache | Cache | Mémoire tampon très rapide du CPU |
| Volatile | Volatile | Perdue à l'extinction |
| Pagination | Paging/Swap | RAM déportée sur disque |
| Goulet d'étranglement | Bottleneck | Composant qui limite la performance |
| Firmware | Firmware | Logiciel bas niveau du matériel |

---

## 23. Ressources complémentaires / Further resources
- **FR/EN** — Documentation officielle Intel/AMD/ARM (fiches produit).
- Manuels VirtualBox / VMware.
- Utilitaires : CrystalDiskInfo (Windows), `smartctl` (Linux) pour la santé disque.
- Chapitre suivant : [BIOS, UEFI & Virtualisation](02-bios-uefi-virtualisation.md).

---

## 24. Check-list de fin / Completion checklist
- [ ] Je sais expliquer CPU vs RAM vs stockage.
- [ ] Je lis une fiche technique (cœurs, GHz, DDR, NVMe).
- [ ] J'ai réalisé le laboratoire et identifié un goulet d'étranglement.
- [ ] Je cite 3 raisons pour lesquelles le matériel est une surface d'attaque.
- [ ] I can explain CPU vs RAM vs storage and diagnose a bottleneck.
