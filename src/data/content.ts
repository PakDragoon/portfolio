import asyncNow from "../assets/work/asyncnow.webp";
import qualStream from "../assets/work/qualstream.webp";
import ezEnglish from "../assets/work/ezenglish.webp";
import misfits from "../assets/work/misfits.webp";
import bystro from "../assets/work/bystro.webp";
import proAssist from "../assets/work/pro-assist.webp";
import taheiya from "../assets/work/taheiya.webp";

/*
 * Every word on the site lives here.
 * `short` is used in Concise mode (temperature 0.2), `long` in Detailed mode (0.8).
 * Facts come from the résumé; edit freely.
 */

export type Audience = "hiring" | "client";
export type Depth = "concise" | "detailed";
export type Text = { short: string; long: string };

export const PROFILE = {
  name: "Hassan Ali",
  title: "Senior Software Engineer",
  company: "CodingCops",
  location: "Lahore, Pakistan",
  timezone: "PKT, UTC+5",
  email: "hassan748_7@hotmail.com",
  phoneDisplay: "+92 309 1487113",
  whatsapp: "https://wa.me/923091487113",
  linkedin: "https://www.linkedin.com/in/pakdragoon",
  github: "https://github.com/PakDragoon",
  resume: "/Hassan-Ali-Resume.pdf",
};

/* ---------------- hero ---------------- */

export const HEADLINE: [string, number][] = [
  ["I", 0.98], [" build", 0.91], [" software", 0.88], [" that", 0.76], [" thinks", 0.41], [" in", 0.83], [" production", 0.95], [".", 0.99],
];

export const HERO_LEDE: Record<Audience, string> = {
  hiring:
    "I'm Hassan Ali, a Senior Software Engineer who leads a team of five shipping a multi-tenant SaaS on NestJS, React and AWS. I own the architecture, the infrastructure and the review process, and I've built AI into how the team writes and verifies code.",
  client:
    "I'm Hassan Ali, a Senior Software Engineer who builds SaaS products end to end: the backend, the web app, the AWS setup underneath, and the AI features on top. You get someone who has taken a product from first commit to production and still runs it.",
};

export const HERO_CTA: Record<Audience, { primary: [string, string]; secondary: [string, string] }> = {
  hiring: { primary: ["See the work", "#work"], secondary: ["Download résumé", PROFILE.resume] },
  client: { primary: ["What I can build", "#services"], secondary: ["Start a project", "#contact"] },
};

export const SYSTEM_PROMPT: Record<Audience, string> = {
  hiring: "You are a hiring manager evaluating a senior engineer. Prioritise ownership, scale and leadership.",
  client: "You are a founder or team lead looking to get something built. Prioritise outcomes, speed and reliability.",
};

/* ---------------- model card (about) ---------------- */

export const MODEL_CARD = {
  id: "hassan-ali/senior-swe",
  version: "v5.0, 2026",
  summary: {
    short: "Full-stack engineer and team lead. Strongest in TypeScript across NestJS and React, AWS infrastructure, and practical AI tooling.",
    long: "Full-stack engineer and team lead with five years of shipping web products. Strongest in TypeScript across NestJS and React, owning AWS infrastructure, and turning AI from a demo into something a team uses every day. Comfortable at both ends of a project: breaking a vague requirement into a phased plan with checkpoints, and owning what happens after it reaches production.",
  },
  rows: [
    ["Intended use", "Senior and lead engineering roles. Freelance builds: SaaS platforms, AI features, AWS setup and migrations."],
    ["Trained on", "5 years across 3 companies: a Lahore product studio, a Dubai HR platform, and a multi-tenant automotive SaaS."],
    ["Architecture", "TypeScript end to end. NestJS + Prisma + PostgreSQL, React 19, Redis and BullMQ, AWS ECS."],
    ["Context window", "Leads a team of 5 across backend, web and mobile. Reviews every layer, from Prisma migrations to the React calendar."],
    ["Latency", "Based in Lahore (UTC+5), with good overlap with UK and EU working hours."],
    ["Languages", "English, Urdu."],
  ] as [string, string][],
};

/* ---------------- evals (impact) ---------------- */

export type Eval = { name: string; score: string; bar: number; note: string; src: string };

export const EVALS: Eval[] = [
  { name: "Pull requests reviewed and merged", score: "320+", bar: 0.82, note: "Out of ~2,200 the team has shipped across three codebases.", src: "CodingCops" },
  { name: "One-year schedule preview, 250 employees", score: "~18 s", bar: 0.9, note: "Runs the real scheduler in a rolled-back transaction on a worker.", src: "Relay" },
  { name: "Tenant-scoped roles enforced on every query", score: "23", bar: 0.74, note: "JWT access/refresh, email OTP MFA, rate limiting.", src: "Relay" },
  { name: "Client configuration time", score: "−50%", bar: 0.5, note: "Configurable workflow modules replaced per-client code.", src: "Nathan HR" },
  { name: "Time to hire with GPT-assisted matching", score: "−30%", bar: 0.3, note: "Generated job posts and candidate matching.", src: "QualStream" },
  { name: "Lead pipeline cost after CRM consolidation", score: "−50%+", bar: 0.55, note: "Webhooks pulled leads from several CRMs into one dashboard.", src: "Reown Logics" },
  { name: "Automated dependency upgrade PRs", score: "70+", bar: 0.62, note: "Renovate plus lint, test and build checks on every PR.", src: "CodingCops" },
];

/* ---------------- training history (experience) ---------------- */

export type Job = {
  when: string;
  role: string;
  org: string;
  place: string;
  weight: number;
  summary: Text;
  points: string[];
  stack: string[];
};

export const JOBS: Job[] = [
  {
    when: "Jan 2025 to now",
    role: "Senior Software Engineer",
    org: "CodingCops",
    place: "Lahore",
    weight: 0.62,
    summary: {
      short: "Lead a team of five that took a multi-tenant automotive SaaS from first commit to production. Own the architecture, AWS and review process.",
      long: "Lead a team of five engineers across backend, web and mobile that took a multi-tenant automotive SaaS from its first commit to production. I break client requirements into phased plans with verification checkpoints, assign the work, and review it. I own the AWS infrastructure and designed the parts of the system where correctness matters most: tenancy, scheduling and the deploy pipeline.",
    },
    points: [
      "Reviewed and merged 320+ pull requests; the team has shipped about 2,200 across three codebases.",
      "Set engineering standards: hexagonal NestJS architecture, lint, test and build checks on every PR in Bitbucket Pipelines, pre-commit hooks, Renovate (70+ upgrade PRs).",
      "Introduced a shared Claude Code workflow: custom agents for PR review against acceptance criteria, cross-repo API-contract checks, Prisma migration safety and test writing.",
      "Own AWS: ECS Fargate for API and workers, ECR, RDS PostgreSQL, Redis, S3 + CloudFront, SES, CloudWatch, IAM. Led the moves from EC2 to ECS and from Vercel to S3/CloudFront.",
      "Designed the scheduling engine: rotation, fixed and bi-weekly strategies with fairness tracking, day-off caps, holidays, blackout dates and swap requests.",
      "Built preview-before-commit: the real scheduler runs on a BullMQ worker inside a rolled-back transaction, progress streams over Pusher, and the commit is rejected if data changed since the preview.",
      "Secured 23 roles: JWT access/refresh tokens, email OTP MFA, rate limiting, dealership scoping on every query, role-based impersonation for admin dashboards.",
    ],
    stack: ["NestJS", "Prisma", "PostgreSQL", "React 19", "BullMQ", "Redis", "AWS ECS", "Pusher", "Claude Code"],
  },
  {
    when: "Jul 2023 to Nov 2024",
    role: "Software Engineer",
    org: "Nathan Digital",
    place: "Dubai, UAE",
    weight: 0.24,
    summary: {
      short: "Re-architected an HR platform into configurable modules. Client setup time dropped by half.",
      long: "Worked on an HR platform used by companies with very different processes. We moved the front end and back end from a traditional structure to modular, component-based architecture, and I built workflow modules that HR teams configure themselves instead of waiting on developers.",
    },
    points: [
      "Built configurable React modules for leave, letter generation and custom approval flows; client configuration time dropped by 50%.",
      "Developed 5+ private TypeScript packages for workflows, reducing development time across the platform.",
      "Implemented JWT authentication and Microsoft SSO across services.",
      "Integrated GPT models for automated support and content generation.",
    ],
    stack: ["React", "TypeScript", "Node.js", "JWT", "Microsoft SSO", "OpenAI API"],
  },
  {
    when: "Oct 2021 to Jul 2023",
    role: "JavaScript Developer",
    org: "Reown Logics",
    place: "Lahore",
    weight: 0.14,
    summary: {
      short: "Brand sites, then whole products: video pitches, recruiting with GPT, CRM lead consolidation.",
      long: "Started on landing pages for brands, with animation, SEO and performance work, then moved on to building whole products: a video pitch platform, a recruiting platform with early GPT features, and integrations that pulled leads from several CRMs into one place.",
    },
    points: [
      "Landing pages for 5+ brands with interactive animation and SEO.",
      "Built a web app to record, upload and share 60-second video proposals with the MediaRecorder API, React, Node.js, MongoDB and S3.",
      "Front end of a lead generation and job posting platform; GPT-assisted job posts and candidate matching cut time to hire by 30%.",
      "Webhooks and third-party APIs consolidated leads from several CRMs into one dashboard, cutting cost by more than 50%.",
    ],
    stack: ["React", "Node.js", "MongoDB", "S3", "OpenAI API", "Webhooks"],
  },
];

export const EDUCATION = "B.Sc. Computer Engineering, The University of Lahore";

/* ---------------- work ---------------- */

export type Cluster = "saas" | "ai" | "teams" | "market";
export const CLUSTERS: Record<Cluster, { label: string; x: number; y: number }> = {
  saas: { label: "Multi-tenant SaaS", x: 0.3, y: 0.32 },
  ai: { label: "AI and automation", x: 0.72, y: 0.28 },
  teams: { label: "Platforms for teams", x: 0.28, y: 0.74 },
  market: { label: "Marketplaces and media", x: 0.74, y: 0.72 },
};

export type Project = {
  id: string;
  name: string;
  kind: string;
  year: string;
  where: string;
  cluster: Cluster;
  pos: [number, number]; // position in the embedding map, 0..1
  summary: string;
  role: string;
  body: Text;
  highlights: string[];
  stack: string[];
  url?: string;
  img?: string;
  featured?: boolean;
};

export const PROJECTS: Project[] = [
  {
    id: "relay",
    name: "Relay",
    kind: "Multi-tenant SaaS for car dealerships",
    year: "2025 to now",
    where: "CodingCops",
    cluster: "saas",
    pos: [0.27, 0.27],
    featured: true,
    summary: "Deal pipeline and staff scheduling in one product, synced with the dealer systems dealerships already use.",
    role: "Team lead. Architecture, AWS, scheduling engine, review process.",
    body: {
      short: "Dealerships were tracking deals and rotas across spreadsheets, DMS portals, group chats and whiteboards. Relay brings both into one multi-tenant product, synced with Reynolds, Fortellis and RouteOne.",
      long: "Dealerships were tracking deals and rotas across spreadsheets, DMS portals, group chats and whiteboards. Relay brings both into one multi-tenant product. The deal side follows every deal from quote to finalisation with role-specific dashboards, finance products and commission reporting, and stays in sync with Reynolds, Fortellis and RouteOne. The scheduling side builds fair staff schedules automatically and respects every decision a manager makes by hand. I lead the team that built it and own the parts where a mistake is expensive: tenancy, scheduling, and the deploy pipeline.",
    },
    highlights: [
      "Preview before commit: the real scheduler runs on a BullMQ worker inside a transaction that is rolled back; progress streams over Pusher; the commit is refused if the data changed. 250 employees, one year, about 18 seconds.",
      "A Redis lock serialises runs per dealership department, so two managers can't generate conflicting schedules.",
      "23 roles with dealership scoping on every query, JWT access and refresh tokens, email OTP MFA, and role-based impersonation for admin 'view as' dashboards.",
      "Deploys build a Docker image, register a new ECS task definition and run Prisma migrations as a one-off task before traffic moves.",
      "React 19 scheduling UI: month calendar with expandable days, drag-and-drop shifts and vacations, conflict warnings, and a live preview screen.",
    ],
    stack: ["NestJS", "Prisma", "PostgreSQL", "BullMQ", "Redis", "React 19", "TypeScript", "AWS ECS", "CloudFront", "Pusher"],
  },
  {
    id: "agents",
    name: "AI review workflow",
    kind: "Claude Code agents for an engineering team",
    year: "2025 to now",
    where: "CodingCops",
    cluster: "ai",
    pos: [0.68, 0.22],
    featured: true,
    summary: "Custom agents that check pull requests, API contracts and database migrations before a human reviewer spends time on them.",
    role: "Designed and introduced it; the whole team uses it.",
    body: {
      short: "A shared Claude Code setup for a two-repo product: agents review each PR against its ticket's acceptance criteria, trace API contracts across repos, check Prisma migrations and write tests.",
      long: "Three codebases and five engineers means a lot of review. I set up a shared Claude Code workflow with per-module context docs and custom agents. One reviews each pull request against its ticket's acceptance criteria, one traces API contracts between the backend and web repos, one checks Prisma migrations for safety, and one writes integration tests against a dummy tenant. Human review still decides; the agents make sure the obvious problems are gone before it starts.",
    },
    highlights: [
      "PR review against each ticket's acceptance criteria.",
      "Cross-repo API-contract tracing between backend and web.",
      "Prisma migration safety checks before deploy.",
      "Test writing against seeded data, never real tenants.",
      "Per-module context docs so agents and new engineers start from the same map.",
    ],
    stack: ["Claude Code", "Prisma", "Bitbucket Pipelines", "TypeScript"],
  },
  {
    id: "nathan",
    name: "Nathan HR",
    kind: "HR platform",
    year: "2023 to 2024",
    where: "Nathan Digital, Dubai",
    cluster: "teams",
    pos: [0.24, 0.7],
    summary: "Leave, letters and approval chains that each company configures for itself.",
    role: "Software engineer on the platform and workflow modules.",
    body: {
      short: "Configurable workflow modules let HR teams shape their own processes. Client setup time dropped by 50%.",
      long: "Every client ran HR differently, and every difference used to mean developer time. We rebuilt the product on modular, component-based architecture, and I built workflow modules for leave, letter generation and custom approvals that non-technical users configure in the UI. Client setup time dropped by half.",
    },
    highlights: [
      "Configurable workflow modules: leave, letters, approval chains.",
      "5+ private TypeScript packages shared across the platform.",
      "JWT authentication and Microsoft SSO.",
      "GPT features for automated support and content.",
    ],
    stack: ["React", "TypeScript", "Node.js", "Microsoft SSO", "OpenAI API"],
    url: "https://nathanhr.com",
  },
  {
    id: "qualstream",
    name: "QualStream",
    kind: "Recruiting and lead generation",
    year: "2022",
    where: "Reown Logics",
    cluster: "ai",
    pos: [0.78, 0.36],
    summary: "Job posting, lead generation and talent sourcing, with GPT writing the first draft.",
    role: "Front-end engineer; GPT integration.",
    body: {
      short: "GPT-assisted job posts and candidate matching cut time to hire by 30%.",
      long: "A recruiting platform that combines job posting, lead generation and talent sourcing. I built the front end and worked on the GPT features that write job posts and match candidates, which cut time to hire by 30%.",
    },
    highlights: ["GPT-generated job posts.", "Candidate matching.", "Time to hire down 30%."],
    stack: ["React", "OpenAI API"],
    img: qualStream,
  },
  {
    id: "proassist",
    name: "Pro Assist",
    kind: "AI customer care",
    year: "",
    where: "",
    cluster: "ai",
    pos: [0.62, 0.4],
    summary: "A customer care app built around AI, with location-based access control.",
    role: "Development.",
    body: {
      short: "Support teams work with AI assistance, and each region only sees its own customers.",
      long: "A customer care web app built around AI. Access is controlled by location, so each team works only with the customers and data for its own region.",
    },
    highlights: ["AI-assisted support.", "Location-based access control."],
    stack: ["React", "Node.js", "AI"],
    img: proAssist,
  },
  {
    id: "asyncnow",
    name: "Async Now",
    kind: "Video pitches",
    year: "2022",
    where: "Reown Logics",
    cluster: "market",
    pos: [0.7, 0.66],
    summary: "Record a 60-second pitch in the browser and share it with a link.",
    role: "Built the recording and sharing app.",
    body: {
      short: "Browser recording with the MediaRecorder API, uploads to S3, shareable links.",
      long: "A platform where startups record a 60-second video proposal in the browser and share it with whoever they're pitching. Recording uses the MediaRecorder API; videos upload to S3 and are served behind shareable links.",
    },
    highlights: ["In-browser recording.", "S3 uploads.", "Shareable links."],
    stack: ["React", "Node.js", "MongoDB", "S3", "MediaRecorder API"],
    url: "https://asyncnow.com",
    img: asyncNow,
  },
  {
    id: "taheiya",
    name: "Taheiya",
    kind: "Vehicle marketplace, Saudi Arabia",
    year: "",
    where: "",
    cluster: "market",
    pos: [0.82, 0.78],
    summary: "Get offers on a vehicle, search by make and model, and bid.",
    role: "Web development.",
    body: { short: "Vehicle offers, search and bidding.", long: "A vehicle platform for the Saudi market: owners get offers, buyers search by make and model, and listings go to bidding." },
    highlights: ["Search by make, model and city.", "Offers and bidding."],
    stack: ["React", "Laravel", "MySQL"],
    url: "https://taheiya.sa",
    img: taheiya,
  },
  {
    id: "ezenglish",
    name: "EZ English",
    kind: "Online classes marketplace",
    year: "",
    where: "",
    cluster: "market",
    pos: [0.62, 0.8],
    summary: "Students pick a teacher, book a slot and learn one-on-one over Zoom or Meet.",
    role: "Web development.",
    body: { short: "Teacher marketplace with booking and video classes.", long: "An English learning marketplace: students choose a teacher, book classes and learn one-on-one over Zoom or Google Meet." },
    highlights: ["Teacher profiles and booking.", "Zoom and Google Meet classes."],
    stack: ["React"],
    img: ezEnglish,
  },
  {
    id: "misfits",
    name: "Misfits",
    kind: "Esports academy",
    year: "",
    where: "",
    cluster: "teams",
    pos: [0.36, 0.82],
    summary: "Seasons, enrolment and coaching for high school esports.",
    role: "Web development.",
    body: { short: "Season sign-ups and coaching programmes.", long: "An esports academy site for high school players: seasons, enrolment and coaching programmes." },
    highlights: ["Season enrolment.", "Coaching programmes."],
    stack: ["React"],
    img: misfits,
  },
  {
    id: "bystro",
    name: "Bystro",
    kind: "Brand catalogue",
    year: "",
    where: "",
    cluster: "market",
    pos: [0.86, 0.62],
    summary: "Brands list their products and shoppers browse them in one place.",
    role: "Web development.",
    body: { short: "Brand listings and product catalogues.", long: "A marketing platform where brands list their products and shoppers browse them in one place." },
    highlights: ["Brand listings.", "Product catalogues."],
    stack: ["React"],
    img: bystro,
  },
];

/* attention: how much each skill was used in each project (0..1) */
export const SKILLS = ["TypeScript", "React", "NestJS", "Node.js", "PostgreSQL", "Redis / BullMQ", "AWS", "LLM / OpenAI", "Claude Code", "MongoDB"];
export const ATTN_PROJECTS = ["relay", "agents", "nathan", "qualstream", "proassist", "asyncnow"];
export const ATTENTION: number[][] = [
  // relay agents nathan qual  pro  async
  [1.0, 0.9, 0.9, 0.5, 0.6, 0.4], // TypeScript
  [1.0, 0.1, 1.0, 1.0, 0.9, 1.0], // React
  [1.0, 0.5, 0.0, 0.0, 0.0, 0.0], // NestJS
  [0.8, 0.3, 0.8, 0.4, 0.8, 0.9], // Node.js
  [1.0, 0.6, 0.2, 0.0, 0.2, 0.0], // PostgreSQL
  [0.9, 0.0, 0.0, 0.0, 0.0, 0.0], // Redis / BullMQ
  [1.0, 0.2, 0.2, 0.0, 0.2, 0.7], // AWS
  [0.2, 0.6, 0.6, 1.0, 1.0, 0.0], // LLM / OpenAI
  [0.7, 1.0, 0.0, 0.0, 0.0, 0.0], // Claude Code
  [0.0, 0.0, 0.3, 0.3, 0.3, 0.9], // MongoDB
];

/* ---------------- services (for clients) ---------------- */

export const SERVICES = [
  {
    name: "SaaS platforms, end to end",
    text: "Multi-tenant architecture, roles and permissions, billing, real-time updates and integrations with the systems your customers already use.",
    proof: "Relay: 23 roles, tenant scoping on every query, three DMS integrations.",
  },
  {
    name: "AI features that ship",
    text: "LLM features inside your product, retrieval over your own data, and agent workflows with a human in the loop. Built to be measured, not demoed.",
    proof: "GPT matching cut time to hire 30%; Claude Code agents in daily team use.",
  },
  {
    name: "AWS setup and migrations",
    text: "ECS, RDS, Redis, CloudFront and CI/CD that a small team can run. Migrations off EC2 or Vercel without downtime surprises.",
    proof: "Led EC2 to ECS and Vercel to S3/CloudFront moves for a production SaaS.",
  },
  {
    name: "Technical leadership",
    text: "Phased plans with checkpoints, review standards, CI that catches problems early, and an AI-assisted workflow your team will actually use.",
    proof: "Lead of 5; 320+ PRs reviewed; standards across three codebases.",
  },
];

export const PIPELINE: [string, string][] = [
  ["Discovery", "We pin down the problem, the users and what a good result looks like."],
  ["Plan", "A phased plan with a verification checkpoint at the end of each phase."],
  ["Build", "Working increments you can click, reviewed and tested as they land."],
  ["Deploy", "CI/CD, monitoring and migrations set up properly, not bolted on."],
  ["Handover", "Docs and context files so your team, or your AI tools, can carry on."],
];

/* ---------------- ask hassan (local retrieval) ---------------- */

export type QA = { q: string; keys: string; a: string; src: string[] };

export const QAS: QA[] = [
  { q: "What do you work on day to day?", keys: "day work daily job now current role do", a: "I lead a team of five building Relay, a multi-tenant SaaS for car dealerships. Most days are a mix of planning work into phases, reviewing pull requests, owning the AWS setup and building the hardest parts myself, like the scheduling engine.", src: ["Experience", "Relay"] },
  { q: "Have you led a team?", keys: "lead leadership team manage mentor senior", a: "Yes. I lead five engineers across backend, web and mobile. I break requirements into phased plans with checkpoints, assign and review the work, and set the standards: architecture, CI checks on every pull request, and a shared AI review workflow. I've reviewed and merged 320+ pull requests.", src: ["Experience", "AI review workflow"] },
  { q: "Can you build AI features for my product?", keys: "ai llm gpt rag agent model openai claude feature", a: "Yes. I've shipped GPT features in production (job posts and candidate matching that cut time to hire by 30%, and support automation at Nathan HR) and built a Claude Code agent workflow my team uses daily. I focus on features that can be measured and have a human in the loop where mistakes are costly.", src: ["QualStream", "AI review workflow", "Services"] },
  { q: "What's your strongest stack?", keys: "stack tech technologies skills best strongest language framework", a: "TypeScript end to end: NestJS with Prisma and PostgreSQL on the backend, React on the front end, Redis and BullMQ for background work, all on AWS ECS. I'm also comfortable with Node.js and MongoDB.", src: ["Model card", "Attention map"] },
  { q: "How do you handle infrastructure?", keys: "aws devops infrastructure cloud deploy ci cd ecs migration", a: "I own the AWS setup for Relay: ECS Fargate for the API and workers, RDS PostgreSQL, Redis, S3 and CloudFront, SES and CloudWatch. I led the moves from EC2 to ECS and from Vercel to CloudFront. Deploys build an image, register a new task definition and run migrations as a one-off task.", src: ["Experience", "Relay"] },
  { q: "Are you available for freelance work?", keys: "freelance contract available hire project client work with", a: "I take on selected freelance projects alongside my role, especially SaaS builds, AI features and AWS work. The best way to start is a short email about the problem and your timeline.", src: ["Services", "Contact"] },
  { q: "What time zone are you in?", keys: "time zone timezone hours where location based remote", a: "Lahore, Pakistan (UTC+5), which overlaps well with UK and EU working hours. For other time zones we agree on a fixed overlap window.", src: ["Model card"] },
];

export const QA_FALLBACK = "That's outside what I have in context here. Email me and I'll answer it properly.";
