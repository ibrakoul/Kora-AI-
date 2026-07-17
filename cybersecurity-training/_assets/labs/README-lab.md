# 🧪 Guide de montage du laboratoire / Lab Build Guide

> ⚠️ **FR :** Tous les laboratoires se font sur des machines **virtuelles isolées**, sur du matériel **que vous possédez**. N'utilisez jamais de vrai malware hors d'un réseau **host-only/interne**. Le test de systèmes tiers sans autorisation écrite est illégal.
> ⚠️ **EN:** All labs run on **isolated virtual machines**, on hardware **you own**. Never use real malware outside a **host-only/internal** network. Testing third-party systems without written authorization is illegal.

---

## 1. Matériel recommandé / Recommended hardware
| Composant | Minimum | Confortable / Comfortable |
|---|---|---|
| CPU | 4 cœurs, VT-x/AMD-V activé | 8 cœurs |
| RAM | 16 Go | 32 Go |
| Disque / Disk | 250 Go SSD | 500 Go+ NVMe |
| OS hôte / Host OS | Windows 11 / Linux / macOS | idem |

**FR :** Activez la **virtualisation matérielle** dans l'UEFI (VT-x/AMD-V). **EN:** Enable **hardware virtualization** in UEFI (VT-x/AMD-V).

---

## 2. Hyperviseur / Hypervisor
| Outil / Tool | Type | Notes |
|---|---|---|
| **VirtualBox** | 2 (hosted) | Gratuit, multiplateforme — recommandé pour débuter |
| **VMware Workstation/Player** | 2 (hosted) | Performant |
| **Hyper-V** | 1 (Windows Pro) | Intégré à Windows |
| **Proxmox / KVM** | 1 (bare-metal) | Pour un vrai lab serveur |

---

## 3. Images / VM images (sources officielles / official sources only)
| VM | Usage |
|---|---|
| **Windows 11** (éval. / eval) | Poste client, durcissement, Defender, BitLocker |
| **Windows Server 2022** (éval.) | Active Directory, GPO, DNS/DHCP |
| **Ubuntu Server 22.04 LTS** | Services Linux, durcissement |
| **Kali Linux** | Outils d'analyse et de pentest (labo autorisé) |
| **pfSense** | Pare-feu / routeur / segmentation |

**FR :** Téléchargez **uniquement** depuis les sites officiels des éditeurs. **EN:** Download **only** from vendors' official sites.

---

## 4. Réseaux virtuels / Virtual networks
```
 ┌─────────────────────────────────────────────────────────┐
 │  RÉSEAU DE LAB (isolé) / LAB NETWORK (isolated)          │
 │                                                          │
 │  [Kali] ──┐                                              │
 │           ├── [pfSense] ── (LAN interne 10.0.0.0/24)     │
 │  [Victime Windows] ──┘         │                         │
 │  [Ubuntu Server] ──────────────┘                         │
 │                                                          │
 │  Adaptateurs : Host-Only ou Internal Network UNIQUEMENT  │
 │  (NAT seulement si Internet nécessaire, jamais Bridged   │
 │   pour une VM d'analyse de malware)                      │
 └─────────────────────────────────────────────────────────┘
```

| Mode adaptateur | Quand l'utiliser / When to use |
|---|---|
| **Host-Only** | Isolation totale + accès depuis l'hôte |
| **Internal** | VM ↔ VM uniquement, pas d'hôte |
| **NAT** | Accès Internet contrôlé (mises à jour) |
| **Bridged** | ⚠️ Évitez pour l'analyse de menaces |

---

## 5. Bonnes pratiques de lab / Lab best practices
- [ ] **Snapshot « base propre »** après chaque installation. / Snapshot "clean base" after each install.
- [ ] Un **snapshot avant chaque manipulation** risquée. / Snapshot before every risky step.
- [ ] Jamais de données personnelles réelles dans le lab. / No real personal data in the lab.
- [ ] Étiqueter les VM (rôle, IP, date). / Label VMs (role, IP, date).
- [ ] Tenir un **journal de laboratoire** (commandes, observations). / Keep a **lab journal**.
- [ ] Détruire/réinitialiser les VM d'analyse après usage. / Destroy/reset analysis VMs after use.

---

## 6. Cloud (optionnel) / Cloud (optional)
**FR :** Pour les niveaux 8 et 11, un **compte gratuit Azure** permet d'explorer **Entra ID**, l'**accès conditionnel** et **Microsoft Sentinel** (SIEM). Surveillez les coûts et supprimez les ressources après usage.
**EN:** For levels 8 and 11, a **free Azure account** lets you explore **Entra ID**, **Conditional Access** and **Microsoft Sentinel** (SIEM). Watch costs and delete resources after use.

---

## 7. Vérification rapide / Quick check
```bash
# Linux hôte : la virtualisation est-elle disponible ?
grep -Eoc '(vmx|svm)' /proc/cpuinfo   # >0 => OK
```
```powershell
# Windows hôte : Hyper-V / virtualisation
Get-ComputerInfo -Property "HyperV*"
```

➡️ Retour à l'accueil / Back to home: [README](../../README.md)
