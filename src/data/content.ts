import asyncNow from "../assets/work/asyncnow.webp";
import qualStream from "../assets/work/qualstream.webp";
import ezEnglish from "../assets/work/ezenglish.webp";
import misfits from "../assets/work/misfits.webp";
import bystro from "../assets/work/bystro.webp";
import proAssist from "../assets/work/pro-assist.webp";
import taheiya from "../assets/work/taheiya.webp";

export const PROFILE = {
  name: "Hassan Ali",
  role: "Software engineer",
  location: "Lahore, Pakistan",
  email: "hassan748_7@hotmail.com",
  phoneDisplay: "+92 309 1487113",
  phoneTel: "+923091487113",
  whatsapp: "https://wa.me/923091487113",
  linkedin: "https://www.linkedin.com/in/pakdragoon",
  github: "https://github.com/PakDragoon",
  resume: "/Hassan-Ali-Resume.pdf",
};

/**
 * Career told as the opening of a chess game (Italian Game, quiet line).
 * Each step plays one white move and black's reply on the 3D board.
 */
export type Step = {
  notation: string; // move pair shown in the margin, e.g. "1. e4 e5"
  when: string;
  title: string;
  place?: string;
  points: string[];
};

export const STEPS: Step[] = [
  {
    notation: "1. e4 e5",
    when: "Oct 2021",
    title: "JavaScript developer",
    place: "Reown Logics, Lahore",
    points: [
      "Opened with the front end: landing pages for 5+ brands, with interactive animation, SEO and fast load times.",
    ],
  },
  {
    notation: "2. Nf3 Nc6",
    when: "2022",
    title: "First full products",
    place: "Reown Logics",
    points: [
      "Built a video proposal app: record, upload and share a 60-second pitch with the MediaRecorder API, Node.js, MongoDB and S3.",
      "Built the front end of a job-posting and lead generation platform, with GPT-assisted job posts and candidate matching that cut time to hire by 30%.",
      "Pulled leads from several CRMs into one dashboard with webhooks and third-party APIs, cutting cost by more than half.",
    ],
  },
  {
    notation: "3. Bc4 Bc5",
    when: "Jul 2023",
    title: "Software engineer",
    place: "Nathan Digital, Dubai",
    points: [
      "Helped move an HR platform's front end and back end from a monolith to modular, component-based architecture, improving scalability and modularity by 40%.",
    ],
  },
  {
    notation: "4. c3 Nf6",
    when: "2024",
    title: "Workflows people configure themselves",
    place: "Nathan Digital",
    points: [
      "Built configurable React modules for leaves, letter generation and approval flows, so non-technical users set up workflows themselves. Client configuration time dropped by 50%.",
      "Shipped 5+ private TypeScript packages, JWT auth with Microsoft SSO, and GPT features for automated support and content generation.",
    ],
  },
  {
    notation: "5. d3 d6",
    when: "Jan 2025",
    title: "Leading the team",
    place: "CodingCops",
    points: [
      "Lead five engineers across backend, web and mobile, taking a product from first commit to production with phased plans and verification checkpoints.",
      "Reviewed and merged 320+ pull requests; the team has shipped about 2,200 across three codebases.",
      "Set the standards: hexagonal NestJS architecture, lint, test and build checks on every PR, and Renovate automation (70+ upgrade PRs).",
    ],
  },
  {
    notation: "6. O-O O-O",
    when: "2025 to now",
    title: "Castled: infrastructure and AI",
    place: "CodingCops",
    points: [
      "Own the AWS stack: ECS Fargate, RDS PostgreSQL, Redis, S3 and CloudFront, SES and CloudWatch. Led the moves from EC2 to ECS and from Vercel to CloudFront.",
      "Designed the scheduling engine. A one-year schedule for 250 employees previews in about 18 seconds, inside a rolled-back transaction.",
      "Introduced a shared Claude Code workflow: custom agents for PR review against acceptance criteria, API-contract checks, Prisma migration safety and tests.",
    ],
  },
];

export type Project = {
  name: string;
  kind: string;
  text: string;
  tags: string[];
  url?: string;
  img?: string;
};

export const FEATURED: Project = {
  name: "Relay",
  kind: "Multi-tenant SaaS for car dealerships",
  text:
    "Deal management and staff scheduling in one product, synced with Reynolds, Fortellis and RouteOne. I lead the team and own the architecture: a NestJS API with 23 roles and dealership scoping on every query, BullMQ workers on Redis, a React 19 scheduling calendar with drag-and-drop and live preview progress over Pusher, all on AWS ECS.",
  tags: ["NestJS", "Prisma", "PostgreSQL", "React 19", "BullMQ", "Redis", "AWS ECS", "Pusher", "Claude Code"],
};

export const PROJECTS: Project[] = [
  {
    name: "Nathan HR",
    kind: "HR management system",
    text: "Configurable HR workflows for leaves, letters and approvals, with Microsoft SSO and GPT-powered features.",
    tags: ["React", "TypeScript", "Node.js", "SSO"],
    url: "https://nathanhr.com",
  },
  {
    name: "Pro Assist",
    kind: "AI customer care",
    text: "A customer care app built around AI, with location-based access control so each team sees only its own region.",
    tags: ["AI", "React", "Access control"],
    img: proAssist,
  },
  {
    name: "Async Now",
    kind: "Video messaging",
    text: "Record, upload and share 60-second video proposals with leads and investors.",
    tags: ["React", "Node.js", "MongoDB", "S3"],
    url: "https://asyncnow.com",
    img: asyncNow,
  },
  {
    name: "QualStream",
    kind: "Recruitment platform",
    text: "Lead generation, job posting and talent sourcing, with GPT-assisted job posts and candidate matching.",
    tags: ["React", "OpenAI API"],
    img: qualStream,
  },
  {
    name: "Taheiya",
    kind: "Vehicle marketplace",
    text: "A Saudi platform to get offers on vehicles, search by make and model, and bid.",
    tags: ["React", "Laravel", "MySQL"],
    url: "https://taheiya.sa",
    img: taheiya,
  },
  {
    name: "EZ English Learning",
    kind: "Education marketplace",
    text: "Students choose a teacher, book classes and learn one-on-one over Zoom or Google Meet.",
    tags: ["React", "Marketplace"],
    img: ezEnglish,
  },
  {
    name: "Misfits",
    kind: "Esports academy",
    text: "Seasons, enrolment and coaching programmes for high school esports players.",
    tags: ["React", "Web app"],
    img: misfits,
  },
  {
    name: "Bystro",
    kind: "Brand marketing",
    text: "Brand listings and product catalogues customers can browse.",
    tags: ["React", "Web app"],
    img: bystro,
  },
];

export const SKILLS: [string, string[]][] = [
  ["Front end", ["TypeScript", "React", "Redux", "React Query", "Tailwind", "MUI", "three.js"]],
  ["Back end", ["Node.js", "NestJS", "REST APIs", "PostgreSQL", "Prisma", "MongoDB", "BullMQ", "WebSockets"]],
  ["Cloud", ["AWS ECS Fargate", "RDS", "S3 + CloudFront", "SES", "Docker", "Bitbucket Pipelines"]],
  ["AI", ["Claude Code agents", "OpenAI API", "LLM features", "RAG"]],
];
