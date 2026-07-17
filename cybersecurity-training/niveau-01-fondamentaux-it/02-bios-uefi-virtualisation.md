# Niveau 1 · Chapitre 2 — BIOS, UEFI & Virtualisation / BIOS, UEFI & Virtualization

## 1. Titre / Title
**FR :** Le démarrage (BIOS/UEFI, Secure Boot, TPM) et la virtualisation
**EN:** Boot process (BIOS/UEFI, Secure Boot, TPM) and virtualization

## 2. Objectifs pédagogiques / Learning objectives
**FR :** Comprendre la séquence de démarrage, la différence BIOS↔UEFI, le rôle de Secure Boot et du TPM, et les principes de la virtualisation (hyperviseurs type 1/2, VM, conteneurs).
**EN:** Understand the boot sequence, BIOS↔UEFI differences, the role of Secure Boot and TPM, and virtualization principles (type-1/2 hypervisors, VMs, containers).

## 3. Introduction
**FR :** Avant même le système d'exploitation, un micrologiciel (firmware) prépare la machine. C'est la première brique de confiance : la compromettre (bootkit) rend le malware quasi invisible. La virtualisation, elle, est la fondation du cloud et des laboratoires de cybersécurité.
**EN:** Before the OS even loads, firmware prepares the machine. It is the first trust brick: compromising it (bootkit) makes malware nearly invisible. Virtualization is the foundation of the cloud and of cybersecurity labs.

## 4. Explication détaillée / Detailed explanation
**FR :**
- **BIOS** (ancien) : firmware 16-bit, partitions **MBR** (≤2 To), démarrage par secteur d'amorçage.
- **UEFI** (moderne) : firmware avancé, partitions **GPT** (>2 To), interface graphique, **Secure Boot** (n'autorise que des chargeurs signés), **fast boot**.
- **TPM** (Trusted Platform Module) : puce qui stocke des clés/mesures d'intégrité ; requis par Windows 11 et BitLocker.
- **Chaîne de démarrage** : Firmware → chargeur (bootloader) → noyau (kernel) → OS.
- **Virtualisation** : un **hyperviseur** partage le matériel entre plusieurs **machines virtuelles (VM)**.
  - **Type 1 (bare-metal)** : ESXi, Hyper-V, Proxmox/KVM — sur le matériel nu, pour serveurs/cloud.
  - **Type 2 (hosted)** : VirtualBox, VMware Workstation — sur un OS hôte, pour postes/labs.
  - **Conteneurs** (Docker) : partagent le **noyau** de l'hôte, plus légers que les VM.

**EN:**
- **BIOS** (legacy): 16-bit firmware, **MBR** partitions (≤2 TB), boot-sector startup.
- **UEFI** (modern): advanced firmware, **GPT** partitions (>2 TB), GUI, **Secure Boot** (only signed loaders), **fast boot**.
- **TPM**: chip storing keys/integrity measurements; required by Windows 11 and BitLocker.
- **Boot chain**: Firmware → bootloader → kernel → OS.
- **Virtualization**: a **hypervisor** shares hardware across several **virtual machines (VMs)**.
  - **Type 1 (bare-metal)**: ESXi, Hyper-V, Proxmox/KVM — on bare hardware, servers/cloud.
  - **Type 2 (hosted)**: VirtualBox, VMware Workstation — on a host OS, desktops/labs.
  - **Containers** (Docker): share the host **kernel**, lighter than VMs.

## 5. Schémas ASCII / ASCII diagrams
```
 SÉQUENCE DE DÉMARRAGE / BOOT SEQUENCE
 [Power] → [UEFI Firmware] → [Secure Boot vérifie signature] → [Bootloader]
          → [Kernel] → [Système d'exploitation] → [Session utilisateur]

 TYPE 1 (bare-metal)              TYPE 2 (hosted)            CONTENEURS
 ┌───────────────┐               ┌───────────────┐          ┌───────────┐
 │ VM1 │ VM2 │VM3│               │ VM1 │  VM2     │          │C1│C2│C3│C4│
 ├───────────────┤               ├───────────────┤          ├───────────┤
 │  Hyperviseur  │               │ VirtualBox    │          │  Docker    │
 ├───────────────┤               ├───────────────┤          ├───────────┤
 │   Matériel    │               │  OS Hôte      │          │  OS Hôte   │
 └───────────────┘               ├───────────────┤          ├───────────┤
                                 │  Matériel     │          │  Matériel  │
                                 └───────────────┘          └───────────┘
```

## 6. Illustrations textuelles / Textual illustrations
**FR :** Le firmware est le **vigile** qui vérifie l'identité (Secure Boot) avant de laisser entrer le système. Le TPM est le **coffre-fort** qui garde les clés. La virtualisation, c'est un **immeuble** (matériel) découpé en **appartements** (VM) par un **syndic** (hyperviseur).
**EN:** Firmware is the **doorman** checking identity (Secure Boot) before letting the OS in. The TPM is the **safe** holding the keys. Virtualization is a **building** (hardware) split into **apartments** (VMs) by a **manager** (hypervisor).

## 7. Analogies simples / Simple analogies
| Élément | Analogie FR | Analogy EN |
|---|---|---|
| Secure Boot | Contrôle d'identité à l'entrée | ID check at the door |
| TPM | Coffre-fort à clés | Key safe |
| Hyperviseur | Syndic d'immeuble | Building manager |
| Conteneur | Colocation (cuisine partagée = noyau) | Shared flat (shared kitchen = kernel) |

## 8. Exemples professionnels / Professional examples
**FR :** Un admin déploie 30 serveurs sur **VMware ESXi (type 1)** au lieu de 30 machines physiques → économies d'énergie, snapshots, haute disponibilité. Un pentester lance **Kali** dans **VirtualBox (type 2)** pour isoler ses outils.
**EN:** An admin runs 30 servers on **VMware ESXi (type 1)** instead of 30 physical boxes → energy savings, snapshots, high availability. A pentester runs **Kali** in **VirtualBox (type 2)** to isolate tooling.

## 9. Exemples réels d'entreprises / Real-world company examples
**FR :** Tout le **cloud** (AWS, Azure, GCP) repose sur des hyperviseurs type 1. **LoJax** (2018) fut le premier rootkit **UEFI** repéré « dans la nature », survivant à la réinstallation de l'OS → justifie Secure Boot. Windows 11 impose **TPM 2.0**.
**EN:** All **cloud** (AWS, Azure, GCP) runs on type-1 hypervisors. **LoJax** (2018) was the first **UEFI** rootkit seen in the wild, surviving OS reinstalls → justifies Secure Boot. Windows 11 mandates **TPM 2.0**.

## 10. Bonnes pratiques / Best practices
- [ ] Activer **Secure Boot** et **TPM** en production. / Enable **Secure Boot** and **TPM** in production.
- [ ] Mot de passe firmware/BIOS pour empêcher le boot USB non autorisé. / Set a firmware password to block unauthorized USB boot.
- [ ] Snapshots avant toute manip de lab. / Take snapshots before any lab change.
- [ ] Isoler les VM de labo dans un **réseau host-only**. / Isolate lab VMs in a **host-only network**.

## 11. Erreurs fréquentes / Common mistakes
| Erreur / Mistake | Conséquence / Impact | Correction / Fix |
|---|---|---|
| Désactiver Secure Boot « pour que ça marche » | Bootkit possible | Le garder, signer les composants |
| VM de lab sur le réseau de prod | Propagation de malware | Réseau host-only/interne |
| Pas de snapshot | Impossible de revenir en arrière | Snapshot avant chaque test |
| Virtualisation non activée dans l'UEFI | VM lentes/refusées | Activer VT-x/AMD-V |

## 12. Étude de cas / Case study
**FR :** Un portable volé contenait des données clients. Grâce à **BitLocker + TPM**, le disque était chiffré et lié au matériel : l'attaquant n'a rien pu lire. Sans TPM/Secure Boot, une attaque « evil maid » aurait été possible.
**EN:** A stolen laptop held client data. Thanks to **BitLocker + TPM**, the disk was encrypted and bound to the hardware: the attacker read nothing. Without TPM/Secure Boot, an "evil maid" attack would have been possible.

## 13. Travaux pratiques / Hands-on exercises
**FR :** 1) Entrez dans l'UEFI de votre PC et repérez Secure Boot/TPM. 2) Vérifiez si la virtualisation matérielle est activée. 3) Décrivez la chaîne de démarrage de votre machine.
**EN:** 1) Enter your PC's UEFI and locate Secure Boot/TPM. 2) Check if hardware virtualization is enabled. 3) Describe your machine's boot chain.

## 14. Laboratoire complet / Full lab — « Première VM + snapshot »
**Objectif / Objective :** Créer une VM Ubuntu, activer un snapshot, comprendre l'isolation réseau. / Create an Ubuntu VM, use a snapshot, understand network isolation.
**Architecture :**
```
[Hôte] ─ VirtualBox ─ [VM Ubuntu] (adaptateur: Host-Only)
```
**Préparation / Preparation :** Installer VirtualBox + image Ubuntu ISO.
**Configuration :**
1. Créer la VM (2 vCPU, 2 Go, 20 Go). / Create the VM.
2. Réseau → **Host-Only Adapter**. / Network → **Host-Only**.
3. Installer Ubuntu, puis **snapshot « base propre »**. / Install Ubuntu, then snapshot "clean base".
4. Modifier un fichier, puis **restaurer le snapshot**. / Change a file, then **restore snapshot**.

**Résultats attendus (décrits) / Expected results (described) :**
- **FR :** Après restauration, le fichier modifié a disparu → l'état est revenu à « base propre ». La VM ne peut pas accéder à Internet (host-only) mais parle à l'hôte.
- **EN:** After restore, the modified file is gone → state rolled back to "clean base". The VM cannot reach the Internet (host-only) but talks to the host.

**Questions :** 1) Pourquoi un snapshot avant test ? 2) Quel adaptateur pour un lab d'analyse de malware ?
**Correction / Answer :** 1) Revenir instantanément à un état sain. / Instantly revert to a clean state. 2) **Host-only / interne**, jamais Bridged. / **Host-only/internal**, never Bridged.

## 15. Commandes Windows / Windows commands
```cmd
msinfo32                      :: voir "Mode BIOS" (UEFI/Legacy) et Secure Boot
tpm.msc                       :: console TPM
bcdedit /enum                 :: entrées de démarrage
```

## 16. Commandes Linux / Linux commands
```bash
[ -d /sys/firmware/efi ] && echo "UEFI" || echo "BIOS/Legacy"
mokutil --sb-state            # état Secure Boot
lscpu | grep -i virtual       # support VT-x/AMD-V
systemd-detect-virt           # suis-je dans une VM ? laquelle ?
```

## 17. PowerShell
```powershell
Confirm-SecureBootUEFI                     # True si Secure Boot actif
Get-Tpm                                     # état du TPM
Get-ComputerInfo | Select BiosFirmwareType  # Uefi / Bios
```

## 18. Bash
```bash
#!/usr/bin/env bash
if [ -d /sys/firmware/efi ]; then echo "Firmware: UEFI"; else echo "Firmware: BIOS"; fi
echo "Secure Boot: $(mokutil --sb-state 2>/dev/null || echo 'n/a')"
echo "Virtualisation détectée: $(systemd-detect-virt)"
```

## 19. Quiz (20 questions)
1. BIOS vs UEFI : quel schéma de partition chacun ?
2. Que fait Secure Boot ?
3. Rôle du TPM ?
4. Ordre de la chaîne de démarrage ?
5. Hyperviseur type 1 vs type 2 ?
6. Un conteneur partage quoi avec l'hôte ?
7. Pourquoi Windows 11 exige TPM 2.0 ?
8. Qu'est-ce qu'un bootkit ?
9. Quel adaptateur réseau pour isoler une VM de malware ?
10. À quoi sert un snapshot ?
11. VT-x / AMD-V : à quoi ça sert ?
12. GPT permet des disques de quelle taille vs MBR ?
13. Qu'est-ce qu'une attaque « evil maid » ?
14. Citez un hyperviseur type 1.
15. Citez un hyperviseur type 2.
16. Commande Linux pour détecter UEFI ?
17. Cmdlet PowerShell pour l'état TPM ?
18. Pourquoi un mot de passe firmware ?
19. Docker : VM ou conteneur ?
20. LoJax : quel type de menace ?

## 20. Correction détaillée / Detailed answer key
1. BIOS→MBR, UEFI→GPT. 2. N'autorise que des chargeurs signés. 3. Stocke clés et mesures d'intégrité. 4. Firmware→bootloader→kernel→OS. 5. Type 1 sur le matériel nu, type 2 sur un OS hôte. 6. Le **noyau**. 7. Racine de confiance matérielle + BitLocker. 8. Malware infectant le processus de démarrage. 9. **Host-only/interne**. 10. Sauvegarder/rétablir un état de VM. 11. Accélération matérielle de la virtualisation. 12. GPT >2 To, MBR ≤2 To. 13. Accès physique modifiant le boot d'un appareil non surveillé. 14. ESXi/Hyper-V/KVM. 15. VirtualBox/VMware Workstation. 16. `[ -d /sys/firmware/efi ]`. 17. `Get-Tpm`. 18. Empêcher le boot USB non autorisé / changement de config. 19. **Conteneur**. 20. Rootkit **UEFI**.

## 21. Résumé / Summary
**FR :** UEFI+Secure Boot+TPM forment la racine de confiance du démarrage ; la virtualisation (type 1/2, conteneurs) est la base du cloud et des labs. Protéger le firmware = protéger la première brique.
**EN:** UEFI+Secure Boot+TPM form the boot root of trust; virtualization (type 1/2, containers) underpins cloud and labs. Protecting firmware protects the first brick.

## 22. Glossaire bilingue / Bilingual glossary
| Terme FR | Term EN | Définition / Definition |
|---|---|---|
| Micrologiciel | Firmware | Logiciel bas niveau du matériel |
| Démarrage sécurisé | Secure Boot | Vérifie la signature des chargeurs |
| Module de confiance | TPM | Puce de clés/intégrité |
| Hyperviseur | Hypervisor | Couche qui gère les VM |
| Machine virtuelle | Virtual machine | OS émulé sur du matériel partagé |
| Conteneur | Container | Isolation partageant le noyau |
| Instantané | Snapshot | État sauvegardé d'une VM |
| Amorceur | Bootloader | Charge le noyau au démarrage |

## 23. Ressources complémentaires / Further resources
- Manuels VirtualBox / VMware / Hyper-V.
- Documentation UEFI (uefi.org), TPM (Trusted Computing Group).
- Chapitre suivant : [Systèmes d'exploitation](03-systemes-exploitation.md).

## 24. Check-list de fin / Completion checklist
- [ ] Je distingue BIOS et UEFI, et j'explique Secure Boot + TPM.
- [ ] Je crée une VM et un snapshot, et j'isole son réseau.
- [ ] Je distingue VM et conteneur.
- [ ] I can build an isolated lab VM and explain the boot root of trust.
