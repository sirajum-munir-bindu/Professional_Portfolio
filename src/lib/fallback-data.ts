import { ProjectCaseStudy, ProjectCategoryItem, SkillCategoryWithSkills, ExperienceItem, AchievementItem, SiteSettingsData, EducationItem } from "@/types";

export const initialProjectCategories: ProjectCategoryItem[] = [
  { id: "pcat-1", name: "Cloud Architecture", slug: "cloud-architecture", order: 1, visible: true },
  { id: "pcat-2", name: "Full-Stack System", slug: "full-stack-system", order: 2, visible: true },
  { id: "pcat-3", name: "DevOps & SRE", slug: "devops-sre", order: 3, visible: true },
  { id: "pcat-4", name: "AI & Data Engineering", slug: "ai-data-engineering", order: 4, visible: true },
];

export const initialSiteSettings: SiteSettingsData = {
  id: "default",
  displayName: "Sirajum Munir",
  roleTitle: "Systems Architect",
  headline: "Staff Software Engineer & Distributed Systems Architect",
  bio: "Designing and scaling resilient distributed backends, edge-native microservices, and interactive developer tooling. Specializing in high-throughput cloud architectures, Rust/Go microservices, and modern Next.js systems.",
  avatarUrl: null,
  availableForWork: true,
  availabilityNote: "Available for select principal architecture consulting & executive engineering roles",
  primaryEmail: "sirajum.munir.eng@gmail.com",
  location: "San Francisco, CA / Hybrid Remote",
  githubUrl: "https://github.com",
  linkedinUrl: "https://linkedin.com",
  twitterUrl: "https://x.com",
  resumeUrl: "#resume",
  accentColor: "#10b981",
  metaTitle: "Sirajum Munir | Staff Software Engineer & Cloud Architect",
  metaDescription: "Senior Engineering Portfolio showcasing mission-critical distributed systems, high-concurrency event pipelines, and interactive architecture blueprints.",

  // Default display mode: DIGITAL_CARD
  activeDisplayMode: "DIGITAL_CARD",
  cardName: "Sirajum Munir",
  cardTitle: "Software Developer & Systems Architect",
  cardCompany: "Skill jobs",
  cardBio: "Building high-performance distributed systems, resilient cloud backends, and modern full-stack web platforms.",
  cardAvatarUrl: null,
  cardPhone: "+880 1885701076",
  cardWhatsapp: "+880 1885701076",
  cardEmail: "sirajummunir1102@gmail.com",
  cardLocation: "Mirpur-6, Dhaka, Bangladesh",
  cardWebsite: "",
  cardLinkedin: "https://linkedin.com",
  cardGithub: "https://github.com",
  cardTwitter: "https://x.com",
  cardResumeUrl: "",
  cardCustomLinks: "[]",
};

export const initialProjects: ProjectCaseStudy[] = [
  {
    id: "proj-1",
    slug: "nexus-event-mesh",
    title: "Nexus Stream: High-Throughput Event Mesh",
    category: "Cloud Architecture",
    shortDescription: "Distributed real-time event broker processing 180k msgs/sec with sub-5ms p99 latency across multi-region Kubernetes clusters.",
    coverImage: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1200&q=80",
    demoUrl: "https://nexus-mesh-preview.internal",
    githubUrl: "https://github.com/alexanderwright/nexus-stream",
    videoUrl: null,
    featured: true,
    published: true,
    order: 1,
    problemStatement: "Legacy monolithic message queues collapsed under bursty peak loads (>150k TPS), causing consumer lag of over 45 seconds and inconsistent ordering during node failover.",
    solutionOverview: "Engineered a partition-aware event distribution gateway with raft-backed consensus, zero-copy buffer pools in Go/Rust, and partitioned Kafka topic replication with automated backpressure telemetry.",
    architectureOverview: "Edge ingest reverse proxies terminate TLS and route gRPC streaming traffic directly into memory-mapped ring buffers before multi-AZ persistence and push-based SSE/WebSocket delivery.",
    keyFeatures: [
      "Zero-copy serialization with Protocol Buffers and custom ring-buffer queues",
      "Dynamic backpressure propagation preventing downstream consumer starvation",
      "Multi-tenant isolation with adaptive rate limiters and cryptographic token verification",
      "Real-time observability export via Prometheus, OpenTelemetry, and Grafana dashboards"
    ],
    personalContribution: "Lead Architect: Designed core raft quorum protocol, implemented zero-copy ring buffers in Go, and oversaw live migration with 99.999% uptime.",
    verifiedOutcomes: [
      "Reduced p99 ingestion latency from 85ms to 4.2ms",
      "Cut monthly cloud compute costs by 42% ($38,000/mo reduction)",
      "Maintained zero message loss across 3 simulated region failure drills"
    ],
    challengesLearned: "Handling TCP socket starvation required tuning Linux kernel epoll buffers and socket reuse flags (`SO_REUSEPORT`).",
    technologies: [
      { name: "Go / Golang", category: "Backend", order: 1 },
      { name: "Apache Kafka", category: "Infrastructure", order: 2 },
      { name: "Kubernetes (EKS)", category: "DevOps", order: 3 },
      { name: "gRPC & Protobuf", category: "Networking", order: 4 },
      { name: "Redis Cluster", category: "Database", order: 5 },
      { name: "OpenTelemetry", category: "Observability", order: 6 }
    ],
    media: [
      {
        url: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1200&q=80",
        caption: "Multi-cluster Grafana overview under 200k TPS synthetic load",
        isCover: true
      },
      {
        url: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80",
        caption: "Telemetry latency distribution breakdown",
        isCover: false
      }
    ],
    architectureDiagram: {
      title: "Nexus Stream Production Topology",
      description: "Edge ingest routing through stateless proxy nodes into durable raft storage clusters.",
      nodes: [
        { id: "node-clients", label: "Edge Clients & IoT", role: "Event Producers", description: "Thousands of distributed telemetry agents pushing events over HTTP/3 & gRPC.", tier: "frontend", status: "operational", techStack: ["Next.js", "Mobile SDK", "gRPC-Web"] },
        { id: "node-envoy", label: "Envoy API Gateway", role: "Edge Ingress", description: "mTLS termination, edge rate limiting, and round-robin upstream routing.", tier: "api", status: "active", techStack: ["Envoy", "Lua Scripts", "WASM Filter"] },
        { id: "node-auth", label: "Stateless Auth Gate", role: "Security & Auth", description: "Ed25519 asymmetric token verification under 0.8ms without hitting the primary database.", tier: "auth", status: "operational", techStack: ["Go Auth Service", "Vault", "JWT"] },
        { id: "node-ingest", label: "Nexus Ingestion Workers", role: "Stream Processing", description: "Zero-copy memory ring buffers and dynamic batching into partitioned Kafka brokers.", tier: "queue", status: "optimized", techStack: ["Go", "Raft Consensus", "Protobuf"] },
        { id: "node-storage", label: "Kafka Multi-AZ Cluster", role: "Durable Log", description: "Partitioned commit log across 3 Availability Zones with strict in-sync replica quorums.", tier: "database", status: "operational", techStack: ["Apache Kafka", "Zookeeper/KRaft", "EBS GP3"] },
        { id: "node-cache", label: "Dragonfly / Redis", role: "Live State Cache", description: "In-memory subscriber routing table and sliding-window rate limit counters.", tier: "cache", status: "operational", techStack: ["Redis 7.2", "Memory Store"] },
        { id: "node-consumers", label: "Downstream Consumer Microservices", role: "Analytics & DB Sinks", description: "Scalable worker fleet consuming events into ClickHouse OLAP and Postgres OLTP.", tier: "infrastructure", status: "operational", techStack: ["Rust", "PostgreSQL", "ClickHouse"] }
      ],
      edges: [
        { id: "e1", source: "node-clients", target: "node-envoy", label: "gRPC Stream", protocol: "gRPC" },
        { id: "e2", source: "node-envoy", target: "node-auth", label: "Token Validation", protocol: "TCP/TLS" },
        { id: "e3", source: "node-envoy", target: "node-ingest", label: "Validated Payload", protocol: "gRPC" },
        { id: "e4", source: "node-ingest", target: "node-cache", label: "Rate Limit Check", protocol: "TCP/TLS" },
        { id: "e5", source: "node-ingest", target: "node-storage", label: "Zero-Copy Append", protocol: "Async Queue" },
        { id: "e6", source: "node-storage", target: "node-consumers", label: "Push Notification", protocol: "Async Queue" }
      ]
    }
  },
  {
    id: "proj-2",
    slug: "aurora-fintech-ledger",
    title: "Aurora Core: Double-Entry Immutable Ledger",
    category: "Full-Stack System",
    shortDescription: "Financial transaction engine supporting strict ACID guarantees, cryptographic audit trails, and multi-currency exchange balancing.",
    coverImage: "https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&w=1200&q=80",
    demoUrl: "https://aurora-ledger.internal",
    githubUrl: "https://github.com/alexanderwright/aurora-ledger",
    videoUrl: null,
    featured: true,
    published: true,
    order: 2,
    problemStatement: "Legacy financial system relied on single-entry balance rows that periodically drifted during race conditions, requiring manual reconciliation at end of day.",
    solutionOverview: "Constructed an immutable, append-only double-entry ledger in PostgreSQL with strict constraints, optimistic locking, and a Next.js administrative treasury portal.",
    architectureOverview: "Next.js App Router admin interface connects to a hardened transaction processor API with isolation-level serializable transactions and cryptographic hash chaining per account block.",
    keyFeatures: [
      "Strict double-entry accounting with balanced credit/debit constraint assertions",
      "Cryptographic SHA-256 block chaining guaranteeing tamper-evident audit records",
      "Sub-millisecond ledger queries with customized B-tree and composite indexing",
      "Comprehensive admin reconciliation studio with simulated multi-currency stress testing"
    ],
    personalContribution: "Sole author of core SQL migration schema, transaction locking strategy, and full-stack administration dashboard.",
    verifiedOutcomes: [
      "Eliminated 100% of balance discrepancies across 14M transactions",
      "Passed SOC2 Type II compliance audit with zero discrepancies",
      "Enabled audited real-time settlement in under 120ms"
    ],
    challengesLearned: "Preventing deadlocks under concurrent debit/credit requests required deterministic account ID sorting before acquiring row-level locks.",
    technologies: [
      { name: "TypeScript", category: "Frontend", order: 1 },
      { name: "Next.js 15", category: "Full-Stack", order: 2 },
      { name: "PostgreSQL", category: "Database", order: 3 },
      { name: "Prisma ORM", category: "Backend", order: 4 },
      { name: "Tailwind CSS", category: "Frontend", order: 5 },
      { name: "Docker", category: "DevOps", order: 6 }
    ],
    media: [
      {
        url: "https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&w=1200&q=80",
        caption: "Auditor ledger verification interface and balance reconciliation",
        isCover: true
      }
    ],
    architectureDiagram: {
      title: "Aurora Ledger Isolation Blueprint",
      description: "ACID serializable pipeline enforcing deterministic lock ordering and cryptographic audit trails.",
      nodes: [
        { id: "node-treasury", label: "Treasury Management UI", role: "Admin Portal", description: "Next.js React Server Components with real-time settlement telemetry.", tier: "frontend", status: "operational", techStack: ["Next.js 15", "React 19", "Tailwind"] },
        { id: "node-ledger-api", label: "Ledger Engine API", role: "Transaction Orchestrator", description: "Applies deterministic account sorting, balance validation, and lock acquisition.", tier: "api", status: "operational", techStack: ["Node.js", "TypeScript", "Zod"] },
        { id: "node-auth-guard", label: "RBAC & Session Validator", role: "Security Layer", description: "Strict permission verification with signed tamper-proof admin credentials.", tier: "auth", status: "operational", techStack: ["Jose JWT", "Bcrypt"] },
        { id: "node-db-primary", label: "PostgreSQL Primary (ACID)", role: "Serializable Store", description: "Append-only entry logs, deterministic table locks, and row-level constraints.", tier: "database", status: "operational", techStack: ["PostgreSQL 16", "Prisma", "Composite Indexes"] },
        { id: "node-read-replica", label: "Reporting Read-Replica", role: "OLAP Query Replica", description: "Offloads read-heavy audit exports and balance history calculations.", tier: "database", status: "active", techStack: ["PostgreSQL Replica", "Streaming Replication"] },
        { id: "node-audit-s3", label: "Immutable Cold Vault", role: "Regulatory Archive", description: "Nightly cryptographic snapshots signed with KMS and stored on WORM storage.", tier: "infrastructure", status: "operational", techStack: ["AWS S3 Object Lock", "KMS"] }
      ],
      edges: [
        { id: "e1", source: "node-treasury", target: "node-ledger-api", label: "REST / Server Action", protocol: "HTTPS/REST" },
        { id: "e2", source: "node-ledger-api", target: "node-auth-guard", label: "Verify Session", protocol: "TCP/TLS" },
        { id: "e3", source: "node-ledger-api", target: "node-db-primary", label: "Serializable Transaction", protocol: "SQL Connection" },
        { id: "e4", source: "node-db-primary", target: "node-read-replica", label: "WAL Streaming", protocol: "TCP/TLS" },
        { id: "e5", source: "node-treasury", target: "node-read-replica", label: "Historical Audit Queries", protocol: "SQL Connection" },
        { id: "e6", source: "node-db-primary", target: "node-audit-s3", label: "Nightly Cryptographic Export", protocol: "HTTPS/REST" }
      ]
    }
  },
  {
    id: "proj-3",
    slug: "chronos-distributed-scheduler",
    title: "Chronos: Distributed Cron & Workflow Orchestration",
    category: "DevOps & SRE",
    shortDescription: "Fault-tolerant cron scheduler executing over 1.2M automated batch jobs daily with exactly-once execution guarantees.",
    coverImage: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80",
    demoUrl: null,
    githubUrl: "https://github.com/alexanderwright/chronos-engine",
    videoUrl: null,
    featured: true,
    published: true,
    order: 3,
    problemStatement: "Periodic batch tasks were handled by server-local crontabs that failed silently during AWS instance reboots, causing missed data warehouse aggregations and duplicate billing triggers.",
    solutionOverview: "Constructed a leader-elected scheduler daemon using Etcd leases, distributed lock fencing tokens, and automated heartbeat retries across worker pools.",
    architectureOverview: "Etcd election assigns master duties for dispatching job tasks into priority queues. Worker nodes acquire fencing tokens before executing jobs to avoid split-brain execution.",
    keyFeatures: [
      "Leader election and auto-failover via Etcd v3 distributed leases",
      "Fencing token validation preventing zombie workers from modifying state",
      "Dynamic cron expression parser with timezone-aware execution offsets",
      "Dead-letter queues with exponential backoff and Slack alerting webhooks"
    ],
    personalContribution: "Designed fault-tolerance semantics, authored worker execution agent, and implemented web-based execution graph monitor.",
    verifiedOutcomes: [
      "100% SLA adherence over 14 consecutive months",
      "Processed 1.2M jobs daily with 0 duplicate executions",
      "Cut incident triage time from 2 hours to under 3 minutes with unified job tracing"
    ],
    challengesLearned: "Network partitions could allow stale leaders to dispatch work. Solving this required monotonic fencing tokens validated by recipient services.",
    technologies: [
      { name: "Go / Golang", category: "Backend", order: 1 },
      { name: "Etcd v3", category: "Infrastructure", order: 2 },
      { name: "PostgreSQL", category: "Database", order: 3 },
      { name: "Redis", category: "Cache", order: 4 },
      { name: "Prometheus", category: "Observability", order: 5 },
      { name: "Terraform", category: "DevOps", order: 6 }
    ],
    media: [
      {
        url: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80",
        caption: "Chronos job execution timeline and node health matrix",
        isCover: true
      }
    ],
    architectureDiagram: null
  },
  {
    id: "proj-4",
    slug: "synapse-ai-rag-gateway",
    title: "Synapse: Semantic Vector RAG & Governance Engine",
    category: "AI & Data Engineering",
    shortDescription: "Enterprise LLM retrieval-augmented generation gateway with streaming latency optimization, PII sanitization, and vector cache.",
    coverImage: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80",
    demoUrl: "https://synapse-rag.internal",
    githubUrl: "https://github.com/alexanderwright/synapse-rag",
    videoUrl: null,
    featured: false,
    published: true,
    order: 4,
    problemStatement: "Internal teams faced high LLM inference costs and unverified hallucinations due to poor context chunking and duplicate semantic queries.",
    solutionOverview: "Architected a unified RAG proxy with hybrid dense-sparse vector search, semantic caching, and streaming token delivery with real-time prompt security filtering.",
    architectureOverview: "Client requests enter a Next.js App Router edge middleware that checks a cosine-similarity semantic vector cache in Redis before dispatching hybrid retrieval to Qdrant.",
    keyFeatures: [
      "Semantic caching layer reducing duplicate embedding queries by 64%",
      "Hybrid dense (vector) and sparse (BM25) re-ranking with cross-encoders",
      "Real-time PII regex and prompt injection sanitization before model dispatch",
      "Streaming SSE output with deterministic citation tracking"
    ],
    personalContribution: "Implemented the semantic cache algorithm, vector indexing pipeline, and Next.js frontend playground.",
    verifiedOutcomes: [
      "Reduced OpenAI monthly API spend by 58%",
      "Achieved average retrieval response time under 180ms",
      "Zero leakage of sensitive internal customer data across 800k queries"
    ],
    challengesLearned: "Semantic cache invalidation when underlying documentation changed was solved via document version hashing and inverted vector indexes.",
    technologies: [
      { name: "Python / FastAPI", category: "Backend", order: 1 },
      { name: "Next.js 15", category: "Frontend", order: 2 },
      { name: "Qdrant Vector DB", category: "Database", order: 3 },
      { name: "Redis", category: "Cache", order: 4 },
      { name: "OpenAI API", category: "AI", order: 5 },
      { name: "Docker", category: "DevOps", order: 6 }
    ],
    media: [
      {
        url: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80",
        caption: "Semantic similarity score inspection and citation graph",
        isCover: true
      }
    ],
    architectureDiagram: null
  }
];

export const initialSkillCategories: SkillCategoryWithSkills[] = [
  {
    id: "cat-1",
    name: "Distributed Systems & Backend",
    order: 1,
    skills: [
      { id: "s1", name: "Go / Golang", categoryId: "cat-1", categoryName: "Backend", iconName: "Cpu", shortDescription: "High-concurrency daemons, raft consensus, zero-copy socket buffers", evidenceNote: "Built Nexus Stream event mesh routing 180k msgs/sec", order: 1, visible: true },
      { id: "s2", name: "Node.js & TypeScript", categoryId: "cat-1", categoryName: "Backend", iconName: "Code", shortDescription: "Type-safe APIs, microservices, and high-performance server runtimes", evidenceNote: "Engineered Aurora Core double-entry ledger", order: 2, visible: true },
      { id: "s3", name: "gRPC & Protocol Buffers", categoryId: "cat-1", categoryName: "Backend", iconName: "Radio", shortDescription: "Low-latency binary inter-service RPC communication", evidenceNote: "Implemented protobuf streaming contracts for event mesh", order: 3, visible: true },
      { id: "s4", name: "Python (FastAPI / Asyncio)", categoryId: "cat-1", categoryName: "Backend", iconName: "Layers", shortDescription: "Data pipelines, vector search retrieval, and async services", evidenceNote: "Built Synapse AI RAG gateway and semantic cache", order: 4, visible: true }
    ]
  },
  {
    id: "cat-2",
    name: "Databases & Storage Architecture",
    order: 2,
    skills: [
      { id: "s5", name: "PostgreSQL & Prisma", categoryId: "cat-2", categoryName: "Databases", iconName: "Database", shortDescription: "ACID serializable transactions, index tuning, query plan analysis", evidenceNote: "Engineered Aurora immutable ledger schema with 0 discrepancies", order: 1, visible: true },
      { id: "s6", name: "Redis & In-Memory Stores", categoryId: "cat-2", categoryName: "Databases", iconName: "Zap", shortDescription: "Distributed locks, sliding-window rate limiters, pub/sub channels", evidenceNote: "Implemented semantic vector caching and token bucket limiters", order: 2, visible: true },
      { id: "s7", name: "Apache Kafka", categoryId: "cat-2", categoryName: "Databases", iconName: "Server", shortDescription: "Partitioning strategies, consumer groups, exact-once semantics", evidenceNote: "Managed multi-AZ Kafka cluster processing billions of events", order: 3, visible: true },
      { id: "s8", name: "Vector Databases (Qdrant/pgvector)", categoryId: "cat-2", categoryName: "Databases", iconName: "Sparkles", shortDescription: "HNSW indexing, cosine similarity, hybrid sparse/dense retrieval", evidenceNote: "Deployed production hybrid search for enterprise knowledge bases", order: 4, visible: true }
    ]
  },
  {
    id: "cat-3",
    name: "Cloud, Infrastructure & DevOps",
    order: 3,
    skills: [
      { id: "s9", name: "Kubernetes & EKS", categoryId: "cat-3", categoryName: "DevOps", iconName: "Container", shortDescription: "Cluster orchestration, custom operators, pod autoscaling, ingress", evidenceNote: "Orchestrated production microservices across 3 AWS regions", order: 1, visible: true },
      { id: "s10", name: "Terraform & IaC", categoryId: "cat-3", categoryName: "DevOps", iconName: "Terminal", shortDescription: "Modular cloud infrastructure provisioning with strict state locking", evidenceNote: "Automated AWS VPCs, EKS clusters, and RDS multi-AZ replicas", order: 2, visible: true },
      { id: "s11", name: "Docker & Container Security", categoryId: "cat-3", categoryName: "DevOps", iconName: "Shield", shortDescription: "Distroless minimal images, multi-stage builds, non-root users", evidenceNote: "Maintained secure baseline container images across engineering team", order: 3, visible: true },
      { id: "s12", name: "Observability (Prometheus/Grafana)", categoryId: "cat-3", categoryName: "DevOps", iconName: "Activity", shortDescription: "OpenTelemetry instrumentation, alerting rules, distributed tracing", evidenceNote: "Configured sub-second SLI/SLO dashboards for high-throughput brokers", order: 4, visible: true }
    ]
  },
  {
    id: "cat-4",
    name: "Modern Web & Frontend Engineering",
    order: 4,
    skills: [
      { id: "s13", name: "Next.js App Router (15)", categoryId: "cat-4", categoryName: "Frontend", iconName: "Globe", shortDescription: "React Server Components, server actions, targeted ISR caching", evidenceNote: "Architected portfolio and admin studio with sub-100ms INP", order: 1, visible: true },
      { id: "s14", name: "React 19 & TypeScript", categoryId: "cat-4", categoryName: "Frontend", iconName: "Code2", shortDescription: "State machines, custom hooks, accessible interactive visualizations", evidenceNote: "Built interactive SVG Architecture Explorer engine", order: 2, visible: true },
      { id: "s15", name: "Tailwind CSS & Design Systems", categoryId: "cat-4", categoryName: "Frontend", iconName: "Palette", shortDescription: "Design token architecture, dark-mode ergonomics, accessible contrast", evidenceNote: "Created custom dark graphite design system with cyber lime accents", order: 3, visible: true }
    ]
  }
];

export const initialExperience: ExperienceItem[] = [
  {
    id: "exp-1",
    company: "CloudScale Systems",
    role: "Staff Software Engineer / Distributed Systems Lead",
    location: "San Francisco, CA",
    startDate: "2023-03",
    endDate: null,
    current: true,
    type: "FULL_TIME",
    description: "Lead architect for core cloud ingestion infrastructure and real-time event streaming products.",
    highlights: [
      "Architected global multi-region event mesh handling 180k+ events/sec across 14 enterprise tenants.",
      "Mentored a team of 9 senior engineers across Go, Kubernetes, and platform observability disciplines.",
      "Reduced 99th percentile ingestion latency by 88% through zero-copy buffer architecture in Go.",
      "Saved $450,000 annually in AWS cross-AZ data transfer by optimizing inter-service topology."
    ],
    order: 1
  },
  {
    id: "exp-2",
    company: "Vanguard Fintech Labs",
    role: "Senior Backend / Infrastructure Engineer",
    location: "New York, NY (Remote)",
    startDate: "2021-02",
    endDate: "2023-02",
    current: false,
    type: "FULL_TIME",
    description: "Engineered high-security financial transaction ledgers and automated regulatory reporting engines.",
    highlights: [
      "Built immutable double-entry ledger in PostgreSQL handling $40M+ in daily transaction volume with 0 discrepancies.",
      "Designed and deployed automated distributed cron scheduler running 1.2M jobs daily.",
      "Spearheaded SOC2 Type II compliance technical remediation with automated cryptographic log sealing."
    ],
    order: 2
  },
  {
    id: "exp-3",
    company: "Apex Digital Media",
    role: "Full-Stack Software Engineer",
    location: "Austin, TX",
    startDate: "2019-06",
    endDate: "2021-01",
    current: false,
    type: "FULL_TIME",
    description: "Developed high-traffic media publishing platforms, real-time analytics dashboards, and headless CMS integrations.",
    highlights: [
      "Migrated monolithic frontend to Next.js with incremental static regeneration, improving Core Web Vitals to 98/100.",
      "Designed real-time collaborative editorial preview system using WebSockets and Redis Pub/Sub."
    ],
    order: 3
  }
];

export const initialEducation: EducationItem[] = [
  {
    id: "edu-1",
    institution: "University of California, Berkeley",
    degree: "B.S. in Computer Science & Engineering",
    fieldOfStudy: "Distributed Systems & Computer Architecture",
    startDate: "2015-08",
    endDate: "2019-05",
    gradeOrHonor: "Magna Cum Laude (GPA: 3.92/4.0)",
    activities: "Lead Chair of Systems & Networking Student Group; ACM ICPC Regional Finalist",
    order: 1
  }
];

export const initialAchievements: AchievementItem[] = [
  {
    id: "ach-1",
    title: "AWS Certified Solutions Architect – Professional",
    issuer: "Amazon Web Services",
    date: "2024-04",
    category: "CERTIFICATION",
    url: "https://aws.amazon.com/verification",
    description: "Validated advanced technical expertise in multi-tier, fault-tolerant enterprise cloud architectures.",
    order: 1
  },
  {
    id: "ach-2",
    title: "1st Place Winner – Global High-Concurrency Cloud Hackathon",
    issuer: "Cloud Native Computing Foundation (CNCF)",
    date: "2023-10",
    category: "HACKATHON",
    url: "https://cncf.io",
    description: "Built a decentralized Raft consensus proxy that remained available during simulated 60% network partition.",
    order: 2
  },
  {
    id: "ach-3",
    title: "Keynote Speaker: 'Zero-Copy Microservices with Go & eBPF'",
    issuer: "GopherCon / Systems Summit",
    date: "2023-06",
    category: "TALK",
    url: "https://gophercon.com",
    description: "Presented practical production lessons on reducing Linux kernel context switches for socket I/O.",
    order: 3
  },
  {
    id: "ach-4",
    title: "Certified Kubernetes Administrator (CKA)",
    issuer: "The Linux Foundation & CNCF",
    date: "2022-08",
    category: "CERTIFICATION",
    url: "https://linuxfoundation.org",
    description: "Demonstrated production cluster provisioning, RBAC configuration, network policies, and troubleshooting.",
    order: 4
  }
];
