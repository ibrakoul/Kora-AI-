export type ContractType = 'CDI' | 'CDD' | 'Stage' | 'Freelance'
export type WorkMode = 'Remote' | 'Hybride' | 'Présentiel'
export type ExpLevel = 'Junior' | 'Confirmé' | 'Senior' | 'Expert'

export interface Job {
  id: number
  title: string
  company: string
  logo: string
  color: string
  location: string
  mode: WorkMode
  type: ContractType
  salary: { min: number; max: number }
  experience: string
  expLevel: ExpLevel
  tags: string[]
  posted: string
  isNew: boolean
  isHot: boolean
  description: string
  missions: string[]
  profile: string[]
  benefits: string[]
  applicants: number
}

export const JOBS: Job[] = [
  {
    id: 1,
    title: "Senior React Engineer",
    company: "Doctolib",
    logo: "🏥",
    color: "#3B82F6",
    location: "Paris, 75",
    mode: "Hybride",
    type: "CDI",
    salary: { min: 75000, max: 95000 },
    experience: "5+ ans",
    expLevel: "Senior",
    tags: ["React", "TypeScript", "GraphQL", "Node.js"],
    posted: "Il y a 2j",
    isNew: true,
    isHot: false,
    description: "Rejoignez Doctolib, la licorne de la santé digitale française, pour construire des produits qui améliorent l'accès aux soins pour 80M+ utilisateurs en Europe.",
    missions: [
      "Développer et maintenir des features React haute qualité pour 80M+ utilisateurs",
      "Concevoir l'architecture frontend de nouvelles apps médicales",
      "Mentoring des engineers juniors et revues de code exigeantes",
      "Collaborer avec Product et Design dans un workflow agile bi-hebdomadaire"
    ],
    profile: [
      "5+ ans d'expérience en React / TypeScript en production",
      "Maîtrise des patterns modernes (hooks, suspense, concurrent mode)",
      "Expérience GraphQL / REST APIs à grande échelle",
      "Sensibilité produit et goût pour l'accessibilité (WCAG)"
    ],
    benefits: [
      "Remote 2j/semaine",
      "Stock options licorne",
      "50% abonnement transport",
      "Budget formation 2 000 €/an",
      "Mutuelle premium Alan"
    ],
    applicants: 47
  },
  {
    id: 2,
    title: "LLM Research Engineer",
    company: "Mistral AI",
    logo: "🌬️",
    color: "#8B5CF6",
    location: "Paris, 75",
    mode: "Hybride",
    type: "CDI",
    salary: { min: 90000, max: 140000 },
    experience: "3+ ans",
    expLevel: "Senior",
    tags: ["Python", "PyTorch", "LLMs", "CUDA", "MLOps"],
    posted: "Il y a 1j",
    isNew: true,
    isHot: true,
    description: "Mistral AI repousse les frontières de l'IA open source européenne. Rejoignez une équipe world-class pour entraîner les meilleurs LLMs du continent.",
    missions: [
      "Recherche et implémentation de nouvelles architectures de LLMs",
      "Optimisation des pipelines d'entraînement et de fine-tuning à grande échelle",
      "Contribution aux papers de recherche et publications open source",
      "Collaboration quotidienne avec des chercheurs de niveau PhD"
    ],
    profile: [
      "Expérience démontrée en entraînement de LLMs (>1B params)",
      "Maîtrise PyTorch avancée et optimisation CUDA/kernels",
      "Publication(s) académique(s) fortement appréciée(s)",
      "PhD ou Master en ML / CS ou équivalent"
    ],
    benefits: [
      "Full remote possible",
      "Equity généreux (BSPCE)",
      "Cluster H100 dédié",
      "Budget conférences illimité (NeurIPS, ICML…)",
      "Chef cuisinier maison le midi"
    ],
    applicants: 234
  },
  {
    id: 3,
    title: "Senior DevOps Engineer",
    company: "OVHcloud",
    logo: "☁️",
    color: "#06B6D4",
    location: "Roubaix, 59",
    mode: "Remote",
    type: "CDI",
    salary: { min: 65000, max: 85000 },
    experience: "4+ ans",
    expLevel: "Senior",
    tags: ["Kubernetes", "Terraform", "Go", "Ansible", "Prometheus"],
    posted: "Il y a 4j",
    isNew: false,
    isHot: false,
    description: "OVHcloud, leader européen du cloud souverain, recrute pour scaler son infrastructure critique hébergeant des milliers de clients B2B à travers l'Europe.",
    missions: [
      "Design et maintenance de clusters Kubernetes production (5 000+ nodes)",
      "Automatisation Infrastructure-as-Code avec Terraform et Ansible",
      "Mise en place de pipelines CI/CD haute disponibilité",
      "On-call rotation avec processus d'escalation clair et post-mortems"
    ],
    profile: [
      "4+ ans en DevOps / SRE sur des environnements critiques",
      "Certification Kubernetes CKA / CKAD appréciée",
      "Scripting Go ou Python pour outillage interne",
      "Expérience infrastructure bare-metal et virtualisation"
    ],
    benefits: [
      "100% Remote (France)",
      "Matériel haut de gamme au choix",
      "RTT + télétravail flexible",
      "Accès aux labs R&D internes",
      "13ème mois + participation"
    ],
    applicants: 31
  },
  {
    id: 4,
    title: "Product Designer Senior",
    company: "Malt",
    logo: "🍺",
    color: "#F59E0B",
    location: "Paris, 75",
    mode: "Hybride",
    type: "CDI",
    salary: { min: 60000, max: 78000 },
    experience: "4+ ans",
    expLevel: "Senior",
    tags: ["Figma", "Design System", "UX Research", "Prototyping", "A/B Tests"],
    posted: "Il y a 3j",
    isNew: false,
    isHot: false,
    description: "Malt, 1ère marketplace freelance d'Europe avec 700k+ freelances, cherche un Product Designer pour façonner l'expérience de sa plateforme leader.",
    missions: [
      "Concevoir end-to-end des features clés de la marketplace (de la discovery à la livraison)",
      "Contribuer à l'évolution et la maintenance du design system Malt",
      "Mener des sessions de recherche utilisateurs (interviews, tests, analyses heatmaps)",
      "Prototyper et itérer rapidement sur les hypothèses produit"
    ],
    profile: [
      "Portfolio solide montrant des décisions UX/UI argumentées",
      "Maîtrise avancée Figma et outils de prototypage (Protopie apprécié)",
      "Sensibilité data et expérience en A/B testing et metrics produit",
      "Communication fluide avec les équipes engineering et PMs"
    ],
    benefits: [
      "Hybride 2j bureau / 3j remote",
      "MacBook Pro M3",
      "Carte Swile 10€/j",
      "Abonnement Figma + outils design",
      "Séminaire d'équipe 2x/an"
    ],
    applicants: 88
  },
  {
    id: 5,
    title: "Backend Engineer (Go)",
    company: "Alan",
    logo: "💙",
    color: "#10B981",
    location: "Paris, 75",
    mode: "Remote",
    type: "CDI",
    salary: { min: 85000, max: 115000 },
    experience: "4+ ans",
    expLevel: "Senior",
    tags: ["Go", "PostgreSQL", "gRPC", "Microservices", "GCP"],
    posted: "Il y a 5j",
    isNew: false,
    isHot: true,
    description: "Alan révolutionne l'assurance santé avec une approche tech-first. Construisez les APIs qui servent 500k+ membres et 25k+ entreprises clientes.",
    missions: [
      "Développer des microservices Go robustes et scalables côté plateforme",
      "Concevoir les APIs internes et partenaires (gRPC / REST)",
      "Contribuer à l'architecture data et événementielle (Kafka)",
      "Améliorer observabilité, fiabilité et respect des SLOs"
    ],
    profile: [
      "4+ ans en développement backend Go (ou autre langage fortement typé)",
      "Expérience microservices, systèmes distribués et résilience",
      "Culture de la sécurité des données de santé (HDS apprécié)",
      "Appétit pour l'impact social et la santé"
    ],
    benefits: [
      "100% Remote France",
      "BSPCE (stock options)",
      "Couverture santé Alan offerte",
      "Setup home office 500€",
      "Learning budget 1 500€/an"
    ],
    applicants: 63
  },
  {
    id: 6,
    title: "Staff Engineer",
    company: "Qonto",
    logo: "🏦",
    color: "#F43F5E",
    location: "Paris, 75",
    mode: "Hybride",
    type: "CDI",
    salary: { min: 115000, max: 155000 },
    experience: "8+ ans",
    expLevel: "Expert",
    tags: ["Ruby on Rails", "React", "PostgreSQL", "Architecture", "Tech Leadership"],
    posted: "Il y a 1j",
    isNew: true,
    isHot: true,
    description: "Qonto, néobanque B2B #1 en Europe avec 500k+ clients, cherche un Staff Engineer pour driver la vision technique à l'échelle de ses 30+ squads.",
    missions: [
      "Définir et aligner la vision technique sur des domaines entiers du produit",
      "Résoudre les problèmes d'architecture complexes cross-équipes",
      "Mentoring intensif des engineers seniors et leads",
      "Contribuer à la roadmap technique long-terme avec le CTO"
    ],
    profile: [
      "8+ ans dont 2+ ans en rôle lead / principal engineer",
      "Track record avéré sur des systèmes haute disponibilité (>99.99%)",
      "Excellent communicant écrit et oral (français + anglais)",
      "Expérience en environnement fintech ou réglementé (DSP2, PSD3)"
    ],
    benefits: [
      "Hybride flexible (3j remote mini)",
      "Equity significatif (RSUs)",
      "Matériel premium illimité",
      "Coaching exécutif personnalisé",
      "Plan épargne retraite entreprise"
    ],
    applicants: 19
  },
  {
    id: 7,
    title: "Data Engineer Senior",
    company: "Contentsquare",
    logo: "📊",
    color: "#6366F1",
    location: "Paris, 75",
    mode: "Hybride",
    type: "CDI",
    salary: { min: 70000, max: 92000 },
    experience: "4+ ans",
    expLevel: "Senior",
    tags: ["Spark", "dbt", "Airflow", "Snowflake", "Python"],
    posted: "Il y a 6j",
    isNew: false,
    isHot: false,
    description: "Contentsquare, leader mondial de l'analytics d'expérience digitale, traite des milliards d'interactions. Construisez les pipelines data qui alimentent 1 000+ clients enterprise.",
    missions: [
      "Concevoir et maintenir des pipelines Spark sur des pétaoctets de données",
      "Modéliser les données avec dbt pour les équipes analytics et data science",
      "Orchestrer les workflows avec Airflow dans un environnement AWS",
      "Garantir la qualité, la fraîcheur et la gouvernance des données"
    ],
    profile: [
      "4+ ans en Data Engineering avec expérience en production à grande échelle",
      "Maîtrise Spark, SQL avancé, Python",
      "Expérience cloud AWS ou GCP (certifications appréciées)",
      "Rigueur, documentation et sens de la qualité"
    ],
    benefits: [
      "Hybride 3j remote",
      "RSUs (actions cotées NYSE)",
      "Carte Swile 10€/jour",
      "Salle de sport dans les bureaux",
      "Congés illimités"
    ],
    applicants: 42
  },
  {
    id: 8,
    title: "Security Engineer",
    company: "Ledger",
    logo: "🔐",
    color: "#F97316",
    location: "Paris, 75",
    mode: "Hybride",
    type: "CDI",
    salary: { min: 80000, max: 108000 },
    experience: "4+ ans",
    expLevel: "Senior",
    tags: ["Cryptography", "Rust", "Pentest", "Hardware Security", "C"],
    posted: "Il y a 2j",
    isNew: true,
    isHot: false,
    description: "Ledger protège les actifs crypto de 6M+ personnes et d'institutions tier-1. Rejoignez l'équipe sécurité pour défendre les hardware wallets les plus sécurisés au monde.",
    missions: [
      "Audit de sécurité du firmware et du hardware des appareils Ledger",
      "Développement d'outils de tests de pénétration et fuzzing internes",
      "Threat modeling sur de nouveaux produits dès la phase de design",
      "Veille CVE / exploit, réponse aux incidents et bug bounty"
    ],
    profile: [
      "Expérience en sécurité hardware ou embedded systems",
      "Maîtrise de la cryptographie appliquée (ECC, RSA, AES…)",
      "Rust ou C bas niveau (side-channel analysis appréciée)",
      "Certification OSCP / GREM ou CTF track-record"
    ],
    benefits: [
      "Hybride 2j bureau",
      "Nano X + hardware Ledger offerts",
      "Budget conférences sécurité (DEF CON, Black Hat…)",
      "Prime de participation",
      "Congés sabbatiques après 3 ans"
    ],
    applicants: 28
  }
]
