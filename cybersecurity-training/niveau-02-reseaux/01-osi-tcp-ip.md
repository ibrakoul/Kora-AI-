# Niveau 2 · Chapitre 1 — Modèles OSI & TCP/IP / OSI & TCP/IP Models

## 1. Titre / Title
**FR :** Comprendre les réseaux — les modèles en couches OSI et TCP/IP
**EN:** Understanding networks — the OSI and TCP/IP layered models

## 2. Objectifs pédagogiques / Learning objectives
**FR :** Nommer et ordonner les 7 couches OSI et les 4 couches TCP/IP, associer protocoles et couches, suivre un paquet de bout en bout, et localiser une panne ou une attaque par couche.
**EN:** Name and order the 7 OSI layers and 4 TCP/IP layers, map protocols to layers, follow a packet end-to-end, and locate a fault or attack by layer.

## 3. Introduction
**FR :** Un réseau relie des machines par un empilement de protocoles. Le modèle **OSI** est une carte mentale universelle : il permet de dire « le problème est en couche 3 (IP) » plutôt que « ça ne marche pas ». C'est l'outil de diagnostic n°1 de l'admin et de l'analyste.
**EN:** A network links machines through a stack of protocols. The **OSI** model is a universal mental map: it lets you say "the problem is at layer 3 (IP)" instead of "it's broken". It is the number-one diagnostic tool for admins and analysts.

## 4. Explication détaillée / Detailed explanation
**FR :** Le modèle **OSI** (théorique) a 7 couches ; le modèle **TCP/IP** (pratique, celui d'Internet) en a 4. Chaque couche rend un service à celle du dessus et **encapsule** les données.

| OSI | Couche FR | Layer EN | Rôle / Role | Exemples / PDU |
|----:|-----------|----------|-------------|----------------|
| 7 | Application | Application | Services utilisateur | HTTP, DNS, SMTP · *données* |
| 6 | Présentation | Presentation | Format/chiffrement | TLS, JPEG |
| 5 | Session | Session | Dialogues | RPC, NetBIOS |
| 4 | Transport | Transport | Fiabilité, ports | **TCP/UDP** · *segment* |
| 3 | Réseau | Network | Adressage/routage | **IP**, ICMP · *paquet* |
| 2 | Liaison | Data Link | Trames locales, MAC | Ethernet, ARP · *trame* |
| 1 | Physique | Physical | Bits/signaux | câble, WiFi · *bits* |

**Correspondance TCP/IP** : Application (7-6-5) · Transport (4) · Internet (3) · Accès réseau (2-1).

- **Encapsulation** : chaque couche ajoute son en-tête (comme des enveloppes gigognes).
- **Ports (couche 4)** : identifient l'application (HTTP 80, HTTPS 443, DNS 53, SSH 22, RDP 3389).
- **TCP** = fiable, orienté connexion (poignée de main SYN/SYN-ACK/ACK) ; **UDP** = rapide, sans connexion.

**EN:** The **OSI** model (theoretical) has 7 layers; **TCP/IP** (practical, the Internet's) has 4. Each layer serves the one above and **encapsulates** the data (see table). TCP/IP mapping: Application (7-6-5) · Transport (4) · Internet (3) · Network Access (2-1). Encapsulation nests headers like envelopes. Ports (L4) identify the app (HTTP 80, HTTPS 443, DNS 53, SSH 22, RDP 3389). TCP is reliable/connection-oriented (SYN/SYN-ACK/ACK handshake); UDP is fast/connectionless.

## 5. Schémas ASCII / ASCII diagrams
```
 ENCAPSULATION (émission) / ENCAPSULATION (sending)
 [App: Données] → [+TCP en-tête: Segment] → [+IP en-tête: Paquet]
   → [+Ethernet en-tête/fin: Trame] → [Bits sur le câble]

 7 ┌ Application ┐
 6 │ Présentation│  "All People Seem To Need Data Processing"
 5 │ Session     │   (7→1 :  A  P  S  T  N  D  P )
 4 │ Transport   │  Moyen mnémo FR : "Après Plusieurs Saisons, Tout Réseau Livre Peu"
 3 │ Réseau      │
 2 │ Liaison     │
 1 └ Physique    ┘

 POIGNÉE DE MAIN TCP / TCP HANDSHAKE
 Client ── SYN ──▶ Serveur
 Client ◀─ SYN-ACK ─ Serveur
 Client ── ACK ──▶ Serveur   (connexion établie)
```

## 6. Illustrations textuelles / Textual illustrations
**FR :** Envoyer une donnée, c'est poster une lettre : le **texte** (application) va dans une **enveloppe** (TCP), avec une **adresse ville** (IP), déposée au **bureau de poste local** (Ethernet/MAC), transportée par la **route** (physique). Chaque étape ajoute son enveloppe et le destinataire les ouvre en sens inverse.
**EN:** Sending data is like mailing a letter: the **text** (application) goes in an **envelope** (TCP), with a **city address** (IP), handed to the **local post office** (Ethernet/MAC), moved along the **road** (physical). Each step adds its envelope; the receiver opens them in reverse.

## 7. Analogies simples / Simple analogies
| Couche | Analogie FR | Analogy EN |
|---|---|---|
| 7 App | La langue de la lettre | The letter's language |
| 4 Transport | Le numéro d'appartement (port) | The apartment number (port) |
| 3 Réseau | L'adresse de la ville (IP) | The city address (IP) |
| 2 Liaison | Le facteur du quartier (MAC) | The local mail carrier (MAC) |
| 1 Physique | La route/le camion | The road/truck |

## 8. Exemples professionnels / Professional examples
**FR :** Un utilisateur ne charge pas un site. L'admin diagnostique **par couche** : `ping` (L3 OK ?), `nslookup` (DNS L7 ?), `telnet site 443` (port L4 ouvert ?). Il isole ainsi la panne en minutes.
**EN:** A user cannot load a site. The admin diagnoses **layer by layer**: `ping` (L3 OK?), `nslookup` (DNS L7?), `telnet site 443` (L4 port open?). The fault is isolated in minutes.

## 9. Exemples réels d'entreprises / Real-world company examples
**FR :** Les attaques se rangent par couche : **DDoS SYN flood** (L4), **ARP spoofing** (L2), **DNS poisoning** (L7). Wireshark, standard mondial de l'analyse, affiche justement chaque paquet **découpé par couches**. Les pare-feu « nouvelle génération » filtrent de la L3 à la L7.
**EN:** Attacks map to layers: **SYN flood DDoS** (L4), **ARP spoofing** (L2), **DNS poisoning** (L7). Wireshark, the global analysis standard, displays each packet **broken down by layer**. Next-gen firewalls filter from L3 to L7.

## 10. Bonnes pratiques / Best practices
- [ ] Diagnostiquer **de bas en haut** (câble → IP → port → application). / Troubleshoot **bottom-up**.
- [ ] Connaître par cœur les ports courants. / Memorize common ports.
- [ ] Chiffrer en couche présentation (TLS) tout trafic sensible. / Encrypt sensitive traffic with TLS.
- [ ] Segmenter le réseau (VLAN) pour limiter la portée d'une attaque L2. / Segment (VLAN) to limit L2 blast radius.

## 11. Erreurs fréquentes / Common mistakes
| Erreur / Mistake | Conséquence / Impact | Correction / Fix |
|---|---|---|
| Confondre IP (L3) et MAC (L2) | Mauvais diagnostic | IP = logique/routable, MAC = physique/local |
| Ignorer DNS lors d'une panne | Fausse piste réseau | Toujours tester la résolution de noms |
| Croire UDP « fiable » | Pertes non détectées | UDP = rapide, sans garantie |
| Confondre port et adresse | Mauvaise règle firewall | Port = application, IP = machine |

## 12. Étude de cas / Case study
**FR :** Un site interne est « lent ». Wireshark montre de nombreuses retransmissions **TCP** (L4) et des `ICMP` (L3) normaux. Conclusion : perte de paquets sur un lien saturé, pas un problème d'application. Correctif : QoS + lien élargi. Le modèle OSI a évité de blâmer le serveur web.
**EN:** An internal site is "slow". Wireshark shows many **TCP** retransmissions (L4) with normal `ICMP` (L3). Conclusion: packet loss on a saturated link, not an app issue. Fix: QoS + wider link. OSI kept the team from blaming the web server.

## 13. Travaux pratiques / Hands-on exercises
**FR :** 1) Faites un `ping` et un `tracert/traceroute` vers un site et identifiez la couche testée. 2) Ouvrez Wireshark, capturez une visite HTTPS et repérez la poignée de main TCP puis TLS. 3) Associez 5 protocoles à leur couche.
**EN:** 1) `ping` and `tracert/traceroute` a site and name the layer tested. 2) In Wireshark, capture an HTTPS visit and spot the TCP handshake then TLS. 3) Map 5 protocols to their layer.

## 14. Laboratoire complet / Full lab — « Suivre un paquet avec Wireshark »
**Objectif / Objective :** Observer l'encapsulation réelle et la poignée de main TCP. / Observe real encapsulation and the TCP handshake.
**Architecture :**
```
[VM Ubuntu + Wireshark] ── (host-only + NAT) ──▶ serveur web local
```
**Préparation / Preparation :** `sudo apt install -y wireshark tshark`. Lancer un serveur test : `python3 -m http.server 8080`.
**Configuration & étapes / Steps :**
1. Démarrer la capture sur l'interface. / Start capture on the interface.
2. Dans un navigateur/`curl`, visiter `http://127.0.0.1:8080`. / Visit the local server.
3. Filtrer `tcp.port==8080`. / Filter `tcp.port==8080`.

**Résultats attendus (décrits) / Expected results (described) :**
- **FR :** Wireshark montre d'abord **SYN → SYN,ACK → ACK** (L4), puis la requête `GET` (L7) encapsulée dans IP (L3) et Ethernet (L2). Chaque trame affiche les en-têtes empilés.
- **EN:** Wireshark shows **SYN → SYN,ACK → ACK** (L4) first, then the `GET` request (L7) wrapped in IP (L3) and Ethernet (L2). Each frame lists the stacked headers.

**Questions :** 1) Combien de paquets pour établir la connexion ? 2) À quelle couche voit-on le port ? l'IP ? la MAC ?
**Correction / Answer :** 1) **Trois** (SYN, SYN-ACK, ACK). 2) Port → L4/TCP ; IP → L3 ; MAC → L2/Ethernet.

## 15. Commandes Windows / Windows commands
```cmd
ping 8.8.8.8                 :: test L3
tracert www.exemple.com      :: chemin routeur par routeur (L3)
nslookup www.exemple.com     :: résolution DNS (L7)
netstat -ano                 :: connexions et ports (L4)
```

## 16. Commandes Linux / Linux commands
```bash
ping -c4 8.8.8.8             # test L3
traceroute www.exemple.com   # chemin (L3)
dig www.exemple.com          # DNS (L7)
ss -tulpn                    # ports en écoute (L4)
```

## 17. PowerShell
```powershell
Test-NetConnection www.exemple.com -Port 443   # teste L3 + L4 (port)
Resolve-DnsName www.exemple.com                # DNS (L7)
Get-NetTCPConnection | Select-Object -First 10 LocalPort, RemoteAddress, State
```

## 18. Bash
```bash
#!/usr/bin/env bash
host="${1:-www.exemple.com}"
echo "L3 ping:";  ping -c1 -W2 "$host" >/dev/null && echo "  OK" || echo "  KO"
echo "L7 DNS:";   dig +short "$host" | head -1
echo "L4 443:";   (exec 3<>/dev/tcp/$host/443) 2>/dev/null && echo "  ouvert" || echo "  fermé"
```

## 19. Quiz (20 questions)
1. Combien de couches OSI ? TCP/IP ?
2. Couche des adresses IP ?
3. Couche des adresses MAC ?
4. Couche des ports ?
5. TCP vs UDP : lequel est fiable ?
6. Étapes de la poignée de main TCP ?
7. Port de HTTPS ? de SSH ? de DNS ?
8. Qu'est-ce que l'encapsulation ?
9. PDU de la couche 3 ?
10. PDU de la couche 2 ?
11. À quelle couche agit TLS ?
12. À quelle couche l'ARP spoofing ?
13. Un SYN flood attaque quelle couche ?
14. Moyen mnémotechnique des couches ?
15. Rôle de la couche physique ?
16. Outil standard d'analyse de paquets ?
17. Commande pour tester un port en PowerShell ?
18. IP vs MAC : lequel est routable ?
19. Un pare-feu NGFW filtre jusqu'à quelle couche ?
20. Ordre de diagnostic recommandé ?

## 20. Correction détaillée / Detailed answer key
1. 7 et 4. 2. Couche 3 (Réseau). 3. Couche 2 (Liaison). 4. Couche 4 (Transport). 5. **TCP**. 6. SYN, SYN-ACK, ACK. 7. 443, 22, 53. 8. Ajout d'un en-tête par couche. 9. Le **paquet**. 10. La **trame**. 11. Présentation/Session (6-5), au-dessus de TCP. 12. Couche 2. 13. Couche 4 (Transport). 14. « All People Seem To Need Data Processing ». 15. Transmettre les bits/signaux. 16. **Wireshark**. 17. `Test-NetConnection -Port`. 18. **IP**. 19. Jusqu'à L7 (application). 20. De bas en haut (physique→application).

## 21. Résumé / Summary
**FR :** OSI (7) et TCP/IP (4) décrivent l'empilement des protocoles. Chaque couche encapsule la précédente. Raisonner par couche accélère le diagnostic et **classe les attaques**. Ports = applications, IP = machines, MAC = local.
**EN:** OSI (7) and TCP/IP (4) describe the protocol stack. Each layer encapsulates the previous. Layered reasoning speeds troubleshooting and **classifies attacks**. Ports = apps, IP = machines, MAC = local.

## 22. Glossaire bilingue / Bilingual glossary
| Terme FR | Term EN | Définition / Definition |
|---|---|---|
| Couche | Layer | Niveau fonctionnel du modèle |
| Encapsulation | Encapsulation | Ajout d'en-têtes par couche |
| Paquet | Packet | PDU de la couche 3 |
| Trame | Frame | PDU de la couche 2 |
| Port | Port | Identifiant d'application (L4) |
| Poignée de main | Handshake | Établissement de connexion TCP |
| Routage | Routing | Acheminement L3 entre réseaux |
| Segmentation | Segmentation | Découpage L4/en VLAN |

## 23. Ressources complémentaires / Further resources
- Wireshark User Guide ; RFC 793 (TCP), RFC 791 (IP).
- Chapitres suivants du Niveau 2 : IPv4/IPv6, DNS/DHCP, NAT, VLAN, VPN, routage, WiFi, pare-feu (voir [index](README.md)).

## 24. Check-list de fin / Completion checklist
- [ ] Je récite les 7 couches OSI et leur rôle.
- [ ] J'associe TCP/UDP, IP, MAC, ports à leur couche.
- [ ] J'ai capturé une poignée de main TCP dans Wireshark.
- [ ] I can troubleshoot a network fault layer by layer.
