# Niveau 4 · Chapitre 1 — Triade CIA & Zero Trust / CIA Triad & Zero Trust

## 1. Titre / Title
**FR :** Les fondations de la sécurité — Triade CIA, moindre privilège et modèle Zero Trust
**EN:** Security foundations — the CIA Triad, least privilege and the Zero Trust model

## 2. Objectifs pédagogiques / Learning objectives
**FR :** Définir Confidentialité, Intégrité, Disponibilité ; relier chaque pilier à des contrôles concrets ; expliquer le moindre privilège, la défense en profondeur et le modèle **Zero Trust** (« ne jamais faire confiance, toujours vérifier »).
**EN:** Define Confidentiality, Integrity, Availability; map each pillar to concrete controls; explain least privilege, defense in depth, and the **Zero Trust** model ("never trust, always verify").

## 3. Introduction
**FR :** Avant tout outil, la sécurité repose sur trois objectifs — la **triade CIA** — qui servent de boussole pour toute décision. Le modèle **Zero Trust** modernise cette boussole pour un monde sans périmètre (cloud, télétravail, mobiles).
**EN:** Before any tool, security rests on three goals — the **CIA triad** — a compass for every decision. **Zero Trust** modernizes that compass for a perimeter-less world (cloud, remote work, mobile).

## 4. Explication détaillée / Detailed explanation
**FR :**
- **Confidentialité** : seules les personnes autorisées accèdent à l'information → chiffrement, contrôle d'accès, MFA.
- **Intégrité** : l'information n'est pas altérée → hachage, signatures, contrôle de version, journaux inviolables.
- **Disponibilité** : l'information est accessible quand nécessaire → redondance, sauvegardes, anti-DDoS.
- **AAA** : *Authentication* (qui êtes-vous ?), *Authorization* (avez-vous le droit ?), *Accounting* (traçabilité).
- **Moindre privilège** : chaque compte a le minimum de droits.
- **Défense en profondeur** : plusieurs couches de contrôles (comme un château à plusieurs murs).
- **Zero Trust** : aucune confiance implicite, même à l'intérieur du réseau. Chaque requête est **authentifiée, autorisée et chiffrée**, selon l'identité, l'appareil et le contexte. Principes : vérifier explicitement, moindre privilège, **présumer la compromission**.

**EN:**
- **Confidentiality**: only authorized people access data → encryption, access control, MFA.
- **Integrity**: data is not altered → hashing, signatures, versioning, tamper-proof logs.
- **Availability**: data is reachable when needed → redundancy, backups, anti-DDoS.
- **AAA**: Authentication (who are you?), Authorization (are you allowed?), Accounting (traceability).
- **Least privilege**: every account gets the minimum rights.
- **Defense in depth**: multiple layers of controls (a castle with several walls).
- **Zero Trust**: no implicit trust, even inside the network. Every request is **authenticated, authorized and encrypted**, based on identity, device and context. Principles: verify explicitly, least privilege, **assume breach**.

## 5. Schémas ASCII / ASCII diagrams
```
        LA TRIADE CIA / THE CIA TRIAD
                 Confidentialité
                  Confidentiality
                       /\
                      /  \
                     /    \
                    / DATA \
                   /________\
          Intégrité          Disponibilité
          Integrity           Availability

   ZERO TRUST — "Never trust, always verify"
   [Utilisateur]+[Appareil]+[Contexte] ──▶ (Vérif. identité/MFA)
        ──▶ (Conformité appareil ?) ──▶ (Moindre privilège)
        ──▶ Accès à UNE ressource, chiffré, journalisé
   (À chaque requête, on revérifie — pas de "libre-service" interne)

   DÉFENSE EN PROFONDEUR / DEFENSE IN DEPTH
   [Sensibilisation] > [Périmètre] > [Réseau] > [Hôte] > [Appli] > [Donnée]
```

## 6. Illustrations textuelles / Textual illustrations
**FR :** La triade est un **tabouret à trois pieds** : retirez-en un et tout tombe. Zero Trust remplace le vieux château (mur unique = périmètre) par un **aéroport** : contrôle d'identité à chaque porte, badge limité à votre vol, re-vérification permanente.
**EN:** The triad is a **three-legged stool**: remove one leg and it collapses. Zero Trust replaces the old castle (single wall = perimeter) with an **airport**: identity checks at every gate, a badge limited to your flight, constant re-verification.

## 7. Analogies simples / Simple analogies
| Notion | Analogie FR | Analogy EN |
|---|---|---|
| Confidentialité | Coffre-fort verrouillé | A locked safe |
| Intégrité | Sceau de cire sur une lettre | Wax seal on a letter |
| Disponibilité | Générateur de secours | Backup generator |
| Zero Trust | Aéroport (contrôle à chaque porte) | Airport (checks at every gate) |

## 8. Exemples professionnels / Professional examples
**FR :** Un RSSI choisit un contrôle et le **rattache à un pilier** : MFA → confidentialité ; sauvegardes immuables → intégrité + disponibilité ; cluster redondant → disponibilité. Cette grille justifie chaque dépense.
**EN:** A CISO picks a control and **ties it to a pillar**: MFA → confidentiality; immutable backups → integrity + availability; redundant cluster → availability. This grid justifies every spend.

## 9. Exemples réels d'entreprises / Real-world company examples
**FR :** Après la brèche de son réseau (opération Aurora, 2009), **Google** a lancé **BeyondCorp**, pionnier du Zero Trust : accès basé sur l'identité et l'appareil, sans VPN de confiance implicite. Les **ransomwares** modernes visent d'abord la **disponibilité** (chiffrement) puis la **confidentialité** (double extorsion). L'ordre exécutif US de 2021 impose le Zero Trust aux agences fédérales.
**EN:** After its network breach (Operation Aurora, 2009), **Google** launched **BeyondCorp**, a Zero Trust pioneer: access based on identity and device, no implicitly trusted VPN. Modern **ransomware** attacks **availability** (encryption) then **confidentiality** (double extortion). The 2021 US executive order mandates Zero Trust for federal agencies.

## 10. Bonnes pratiques / Best practices
- [ ] Classer chaque contrôle selon C, I ou D. / Map each control to C, I or A.
- [ ] Activer la **MFA** partout. / Enable **MFA** everywhere.
- [ ] Appliquer le **moindre privilège** et revoir les accès régulièrement. / Enforce **least privilege**, review access regularly.
- [ ] Sauvegardes **3-2-1** immuables et testées. / **3-2-1** immutable, tested backups.
- [ ] Présumer la compromission : segmenter, journaliser, détecter. / Assume breach: segment, log, detect.

## 11. Erreurs fréquentes / Common mistakes
| Erreur / Mistake | Conséquence / Impact | Correction / Fix |
|---|---|---|
| Se concentrer sur la seule confidentialité | Perte de données/dispo ignorée | Traiter les 3 piliers |
| Confiance implicite au réseau interne | Déplacement latéral facile | Zero Trust, micro-segmentation |
| MFA seulement pour les admins | Comptes standards piratés | MFA généralisée |
| Sauvegardes non testées | Restauration impossible | Tester la restauration |

## 12. Étude de cas / Case study
**FR :** Un ransomware chiffre les serveurs d'une PME (disponibilité ✗) et exfiltre des données (confidentialité ✗). Grâce à des **sauvegardes immuables hors-ligne** (intégrité/disponibilité ✓) et à la **segmentation Zero Trust** qui a freiné la propagation, l'entreprise restaure en 24 h sans payer. Les journaux prouvent l'étendue (accounting).
**EN:** Ransomware encrypts an SMB's servers (availability ✗) and exfiltrates data (confidentiality ✗). Thanks to **immutable offline backups** (integrity/availability ✓) and **Zero Trust segmentation** that slowed spread, the firm restores in 24 h without paying. Logs prove the scope (accounting).

## 13. Travaux pratiques / Hands-on exercises
**FR :** 1) Pour 10 contrôles, indiquez le(s) pilier(s) CIA. 2) Rédigez une politique de moindre privilège pour un stagiaire. 3) Dessinez le parcours d'une requête Zero Trust.
**EN:** 1) For 10 controls, tag the CIA pillar(s). 2) Draft a least-privilege policy for an intern. 3) Diagram a Zero Trust request flow.

## 14. Laboratoire complet / Full lab — « Intégrité par le hachage & MFA »
**Objectif / Objective :** Démontrer l'intégrité (hachage) et la confidentialité (MFA/chiffrement). / Demonstrate integrity (hashing) and confidentiality (MFA/encryption).
**Architecture :**
```
[VM Linux] fichiers + sha256   |   [Compte cloud test] activation MFA
```
**Préparation / Preparation :** VM Linux ; un compte de test (ex. e-mail perso) pour activer la MFA.
**Configuration & étapes / Steps :**
1. Créer `secret.txt`, calculer `sha256sum secret.txt`. / Create file, hash it.
2. Modifier un octet, recalculer → le hachage change. / Alter a byte, re-hash → hash changes.
3. Activer la MFA (TOTP) sur un compte de test et se reconnecter. / Enable MFA (TOTP) and re-login.

**Résultats attendus (décrits) / Expected results (described) :**
- **FR :** Toute modification, même minime, change complètement l'empreinte SHA-256 → preuve d'intégrité. Après MFA, la connexion exige un code à usage unique → confidentialité renforcée.
- **EN:** Any change, however tiny, fully alters the SHA-256 digest → integrity proof. After MFA, login requires a one-time code → stronger confidentiality.

**Questions :** 1) Pourquoi un hachage détecte-t-il une altération ? 2) Quel pilier la MFA renforce-t-elle surtout ?
**Correction / Answer :** 1) Effet d'avalanche : 1 bit changé → empreinte totalement différente. 2) La **confidentialité** (et l'authentification).

## 15. Commandes Windows / Windows commands
```cmd
certutil -hashfile secret.txt SHA256      :: empreinte d'intégrité
cipher /e C:\Confidentiel                  :: chiffrer un dossier (EFS)
whoami /groups                             :: droits (moindre privilège)
```

## 16. Commandes Linux / Linux commands
```bash
sha256sum secret.txt                       # empreinte
gpg -c secret.txt                          # chiffrer (confidentialité)
sudo -l                                     # privilèges accordés
```

## 17. PowerShell
```powershell
Get-FileHash .\secret.txt -Algorithm SHA256
# Comparer deux empreintes (intégrité)
(Get-FileHash .\a.txt).Hash -eq (Get-FileHash .\b.txt).Hash
```

## 18. Bash
```bash
#!/usr/bin/env bash
f="secret.txt"
h1=$(sha256sum "$f" | awk '{print $1}')
echo "octet ajouté" >> "$f"
h2=$(sha256sum "$f" | awk '{print $1}')
[ "$h1" != "$h2" ] && echo "Intégrité: fichier MODIFIÉ (hash différent)"
```

## 19. Quiz (20 questions)
1. Que signifie CIA ?
2. Quel pilier protège le chiffrement ?
3. Quel pilier vise le ransomware en premier ?
4. Définissez le moindre privilège.
5. Qu'est-ce que la défense en profondeur ?
6. Zero Trust en une phrase ?
7. Que signifie « assume breach » ?
8. Rôle du hachage ?
9. AAA : que veut dire le 3e A ?
10. La MFA renforce quel pilier ?
11. Sauvegarde 3-2-1 : expliquez.
12. Quel projet Google a popularisé le Zero Trust ?
13. Une signature numérique assure quoi ?
14. La redondance sert quel pilier ?
15. Confiance implicite interne : bon ou mauvais ?
16. Micro-segmentation : à quoi sert-elle ?
17. Effet d'avalanche : c'est quoi ?
18. Différence authentification / autorisation ?
19. Un DDoS attaque quel pilier ?
20. Pourquoi tester les sauvegardes ?

## 20. Correction détaillée / Detailed answer key
1. Confidentiality, Integrity, Availability. 2. Confidentialité. 3. Disponibilité. 4. Donner le minimum de droits nécessaires. 5. Empiler plusieurs couches de contrôles. 6. Ne jamais faire confiance, toujours vérifier. 7. Concevoir en supposant qu'on est déjà compromis. 8. Détecter toute altération (intégrité). 9. Accounting (traçabilité). 10. Confidentialité/authentification. 11. 3 copies, 2 supports, 1 hors-site. 12. **BeyondCorp**. 13. Intégrité + authenticité + non-répudiation. 14. Disponibilité. 15. Mauvais (Zero Trust l'élimine). 16. Limiter le déplacement latéral. 17. 1 bit modifié → empreinte totalement différente. 18. Qui vous êtes vs ce que vous avez le droit de faire. 19. Disponibilité. 20. Garantir qu'on peut vraiment restaurer.

## 21. Résumé / Summary
**FR :** La triade **CIA** est la boussole de toute décision de sécurité. Le **moindre privilège** et la **défense en profondeur** la mettent en œuvre. Le **Zero Trust** — vérifier explicitement, moindre privilège, présumer la compromission — l'adapte au monde sans périmètre.
**EN:** The **CIA** triad is the compass for every security decision. **Least privilege** and **defense in depth** implement it. **Zero Trust** — verify explicitly, least privilege, assume breach — adapts it to a perimeter-less world.

## 22. Glossaire bilingue / Bilingual glossary
| Terme FR | Term EN | Définition / Definition |
|---|---|---|
| Confidentialité | Confidentiality | Accès réservé aux autorisés |
| Intégrité | Integrity | Données non altérées |
| Disponibilité | Availability | Données accessibles au besoin |
| Moindre privilège | Least privilege | Droits minimaux |
| Défense en profondeur | Defense in depth | Contrôles en couches |
| Confiance zéro | Zero Trust | Aucune confiance implicite |
| Hachage | Hashing | Empreinte d'intégrité |
| Non-répudiation | Non-repudiation | Impossible de nier un acte |

## 23. Ressources complémentaires / Further resources
- NIST SP 800-207 (Zero Trust Architecture) ; ANSSI — guides d'hygiène.
- Google BeyondCorp (documents publics).
- Chapitres suivants du Niveau 4 : IAM/MFA/RBAC, chiffrement/PKI/TLS, SIEM/SOC/EDR (voir [index](README.md)).

## 24. Check-list de fin / Completion checklist
- [ ] Je définis C, I, A et j'y rattache des contrôles.
- [ ] J'explique moindre privilège, défense en profondeur, Zero Trust.
- [ ] J'ai démontré l'intégrité par le hachage et activé la MFA.
- [ ] I can map controls to CIA and describe a Zero Trust flow.
