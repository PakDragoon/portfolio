import asyncNow from "../assets/work/asyncnow.webp";
import qualStream from "../assets/work/qualstream.webp";
import ezEnglish from "../assets/work/ezenglish.webp";
import misfits from "../assets/work/misfits.webp";
import bystro from "../assets/work/bystro.webp";
import proAssist from "../assets/work/pro-assist.webp";
import taheiya from "../assets/work/taheiya.webp";

export const PROFILE = {
  name: "Hassan Ali",
  email: "hassan748_7@hotmail.com",
  phoneDisplay: "+92 309 1487113",
  whatsapp: "https://wa.me/923091487113",
  linkedin: "https://www.linkedin.com/in/pakdragoon",
  github: "https://github.com/PakDragoon",
  resume: "/Hassan-Ali-Resume.pdf",
};

/* ------------------------------------------------------------------
 * The story. First person, in my own voice. Edit freely.
 * ------------------------------------------------------------------ */

export type Chapter = {
  phase: string; // chess phase the chapter maps to
  move: string; // a move from the Italian Game, as a quiet nod
  years: string;
  where: string;
  body: string[];
};

export const CHAPTERS: Chapter[] = [
  {
    phase: "The opening",
    move: "1. e4",
    years: "2021 to 2023",
    where: "Reown Logics, Lahore",
    body: [
      "I started where most front-end people start: landing pages. Animations, SEO, shaving milliseconds off load times. It taught me to care about the thing people actually see.",
      "Within a year I was building whole products. One let founders record a 60-second video pitch in the browser and share it with whoever they were pitching. Another was a recruiting platform where we first put GPT to work, writing job posts and matching candidates, and hiring got about 30% faster.",
    ],
  },
  {
    phase: "The middlegame",
    move: "3. Bc4",
    years: "2023 to 2024",
    where: "Nathan Digital, Dubai",
    body: [
      "Dubai meant an HR platform used by companies that all ran things differently. Instead of hard-coding each client's process, we rebuilt the product as modules that HR teams configure themselves: leave, letters, approval chains.",
      "Client setup time dropped by half, because the people who knew the process could now shape it themselves. Along the way I wired in Microsoft single sign-on and our first GPT features for support.",
    ],
  },
  {
    phase: "Where I am now",
    move: "6. O-O",
    years: "2025 to now",
    where: "CodingCops, Lahore",
    body: [
      "Today I lead five engineers across backend, web and mobile. We took a SaaS for car dealerships from its first commit to production, and I've reviewed and merged more than 320 of the roughly 2,200 pull requests the team has shipped.",
      "I own the AWS setup, designed the scheduling engine, and brought AI into how the team works. Our Claude Code agents review pull requests against their tickets and check database migrations before they run.",
    ],
  },
];

export const OFF_THE_BOARD =
  "Away from the keyboard I'm usually playing chess. It's the same habit as engineering: look a few moves ahead, and don't fall in love with your first idea.";

/* ------------------------------------------------------------------
 * Work
 * ------------------------------------------------------------------ */

export type Annotation = { glyph: "!!" | "!" | "!?"; title: string; text: string };

export const FEATURED = {
  name: "Relay",
  pgn: [
    ["Event", "Relay"],
    ["Site", "CodingCops, Lahore"],
    ["Date", "2025.01.??"],
    ["White", "Hassan Ali, team lead"],
    ["Result", "*"],
  ] as [string, string][],
  summary:
    "A multi-tenant SaaS for car dealerships that runs the deal pipeline and staff scheduling in one place, and stays in sync with the dealer systems they already use (Reynolds, Fortellis and RouteOne).",
  annotations: [
    {
      glyph: "!!",
      title: "Preview before you commit",
      text: "Managers can run the auto-scheduler and see a full year of shifts before anything is saved. The real scheduler runs inside a transaction that gets rolled back, progress streams live, and the save is refused if anything changed in the meantime. 250 people, one year, about 18 seconds.",
    },
    {
      glyph: "!",
      title: "Respect the human move",
      text: "Re-running the scheduler never overwrites what a manager placed by hand, or a swap or leave request that's already approved.",
    },
    {
      glyph: "!",
      title: "Castle early",
      text: "Every query is scoped to the dealership from the signed token, across 23 roles, with MFA and rate limits. Security isn't a layer on top; it's in every query.",
    },
    {
      glyph: "!?",
      title: "Let the agents review first",
      text: "Alongside human review, Claude Code agents check each pull request against the ticket's acceptance criteria, trace API contracts across both repos and flag risky Prisma migrations.",
    },
  ] as Annotation[],
  stack: ["NestJS", "Prisma", "PostgreSQL", "React 19", "BullMQ", "Redis", "AWS ECS", "Pusher", "Claude Code"],
};

export type Project = {
  name: string;
  kind: string;
  text: string;
  tags: string[];
  url?: string;
  img?: string;
};

export const PROJECTS: Project[] = [
  {
    name: "Nathan HR",
    kind: "HR platform, Dubai",
    text: "Leave, letters and approval chains that each company configures for itself, with Microsoft sign-in.",
    tags: ["React", "TypeScript", "Node.js"],
    url: "https://nathanhr.com",
  },
  {
    name: "Pro Assist",
    kind: "AI customer care",
    text: "A customer care app built around AI, where each region only ever sees its own customers.",
    tags: ["AI", "React", "Access control"],
    img: proAssist,
  },
  {
    name: "Async Now",
    kind: "Video pitches",
    text: "Founders record a 60-second pitch in the browser and share it with a link.",
    tags: ["React", "MediaRecorder", "Node.js", "S3"],
    url: "https://asyncnow.com",
    img: asyncNow,
  },
  {
    name: "QualStream",
    kind: "Recruiting",
    text: "Job posts, lead generation and candidate matching, with GPT doing the first draft.",
    tags: ["React", "OpenAI"],
    img: qualStream,
  },
  {
    name: "Taheiya",
    kind: "Vehicle marketplace, Saudi Arabia",
    text: "Get offers on your car, search by make and model, and bid.",
    tags: ["React", "Laravel", "MySQL"],
    url: "https://taheiya.sa",
    img: taheiya,
  },
  {
    name: "EZ English",
    kind: "Online classes",
    text: "Students pick a teacher, book a slot and learn one-on-one over Zoom or Meet.",
    tags: ["React", "Marketplace"],
    img: ezEnglish,
  },
  {
    name: "Misfits",
    kind: "Esports academy",
    text: "Seasons, sign-ups and coaching for high school esports teams.",
    tags: ["React"],
    img: misfits,
  },
  {
    name: "Bystro",
    kind: "Brand catalogue",
    text: "Brands list their products and shoppers browse them in one place.",
    tags: ["React"],
    img: bystro,
  },
];

/* ------------------------------------------------------------------
 * How I work, told as the opening principles every chess coach teaches
 * ------------------------------------------------------------------ */

export const PRINCIPLES: [string, string][] = [
  ["Control the centre", "Before any code, I want to understand the core of the problem: who uses this, and what breaks for them if we get it wrong."],
  ["Develop your pieces", "A team is fast when everyone can move. Clear tickets, plans split into phases with checkpoints, and reviews that teach instead of block."],
  ["Castle early", "Security, CI and monitoring go in at the start, not after the first incident."],
  ["Don't move the same piece twice", "Plan the phase, then build it once. Rework is the most expensive move on the board."],
];

export const REPERTOIRE: [string, string[]][] = [
  ["Front end", ["TypeScript", "React", "React Query", "Redux", "Tailwind", "MUI", "three.js"]],
  ["Back end", ["Node.js", "NestJS", "PostgreSQL", "Prisma", "MongoDB", "BullMQ", "Redis", "WebSockets"]],
  ["Cloud", ["AWS ECS Fargate", "RDS", "S3 + CloudFront", "SES", "Docker", "Bitbucket Pipelines"]],
  ["AI", ["Claude Code agents", "OpenAI API", "LLM features", "RAG"]],
];
