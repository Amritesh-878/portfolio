import Link from 'next/link';

interface Project {
  name: string;
  blurb: string;
  stack: string[];
  href?: string;
  badge?: string;
  locked?: boolean;
}

const PROJECTS: Project[] = [
  {
    name: 'Hunter Wumpus',
    blurb:
      'An adversarial dungeon game where a PPO-trained agent hunts you through fog of war. Playable here, and the subject of a published paper.',
    stack: ['PyTorch', 'stable-baselines3', 'FastAPI', 'React'],
    href: '/projects/hunter-wumpus',
    badge: '▸ playable',
  },
  {
    name: 'Survey Intelligence',
    blurb:
      'A production pipeline at work that turns plain-English questions over multilingual survey data into guarded, read-only SQL and narrates the exact result.',
    stack: ['Python', 'SQL', 'FastAPI'],
    href: '/projects/survey-intelligence',
    badge: '▸ production',
  },
  {
    name: 'Student Learning Assistant',
    blurb:
      'A production RAG assistant that grounds each student in their own classes: the recordings themselves plus the material the class was taught from. It handles student audio, so the deep write-up is shared on request.',
    stack: ['WhisperX', 'pgvector', 'Groq'],
    href: '/projects/student-learning-assistant',
    locked: true,
  },
  {
    name: 'Exam Portal',
    blurb:
      'An online entrance-exam portal with in-browser proctoring, used for real admission intakes at work.',
    stack: ['FastAPI', 'OpenCV', 'React'],
  },
  {
    name: 'Wildfire Smoke Detection',
    blurb:
      'Term-long college research: we took SmokeyNet, a published wildfire smoke-detection model, got its codebase training on our own hardware, and tested our own improvement ideas against it, from background subtraction to captioning to anomaly detection. Clouds defeated most of them, and learning why was the point.',
    stack: ['PyTorch Lightning', 'torchvision', 'OpenCV'],
    badge: '▸ research',
  },
  {
    name: 'Mental Health RAG Chatbot',
    blurb:
      'A retrieval-augmented chatbot over a mental-health corpus, returning grounded answers with citations.',
    stack: ['Groq', 'LangChain', 'ChromaDB'],
    href: 'https://github.com/Amritesh-878/mental-health-chatbot',
  },
  {
    name: 'Cognizant Hackathon RAG',
    blurb:
      'Document-intelligence RAG built for a Cognizant hackathon: two pipelines built in parallel, one fully local and one API-based, then benchmarked head to head. The local build won on context recall and answer faithfulness. My slice was the model integration and the benchmarking.',
    stack: ['LangChain', 'ChromaDB', 'Groq', 'Ollama'],
    href: 'https://github.com/Amritesh-878/rag-application',
  },
  {
    name: 'Easy Cash ATM',
    blurb:
      'My 10th grade final project, a console Java ATM that kept its records in a CSV file, redesigned in my free time as a full-stack app with an actual UI. A homage, not a flagship.',
    stack: ['Java', 'React', 'Node.js', 'Express'],
    href: 'https://github.com/Amritesh-878/atm-banking-system',
    badge: '▸ homage',
  },
  {
    name: 'YouTube Trends Dashboard',
    blurb:
      'Trending-video analysis across the US and India, delivered as an interactive dashboard.',
    stack: ['Pandas', 'Plotly', 'Streamlit'],
    href: 'https://github.com/Amritesh-878/youtube-trending-analysis',
  },
];

function StackTags({ stack }: { stack: string[] }) {
  return (
    <div className="mt-auto flex flex-wrap gap-1 pt-3">
      {stack.map((tech) => (
        <span
          key={tech}
          className="rounded border border-fd-border px-1.5 py-0.5 font-mono text-[0.7rem] text-fd-muted-foreground"
        >
          {tech}
        </span>
      ))}
    </div>
  );
}

function ProjectCard({
  project,
  featured = false,
}: {
  project: Project;
  featured?: boolean;
}) {
  const isExternal = project.href?.startsWith('http') ?? false;
  const inner = (
    <>
      <div className="flex items-start justify-between gap-3">
        <span
          className={`flex items-center gap-2 font-mono font-medium text-fd-foreground ${featured ? 'text-base' : 'text-sm'}`}
        >
          {project.name}
          {project.locked ? (
            <span className="flex items-center gap-1 text-xs text-fd-muted-foreground">
              <svg
                width="11"
                height="11"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                aria-hidden
              >
                <rect x="4.5" y="10.5" width="15" height="10" rx="2" />
                <path d="M8 10.5V7a4 4 0 0 1 8 0v3.5" />
              </svg>
              on request
            </span>
          ) : project.badge ? (
            <span className="text-xs text-fd-primary">{project.badge}</span>
          ) : null}
        </span>
        {project.href ? (
          <span
            aria-hidden
            className="font-mono text-sm text-fd-muted-foreground transition-colors group-hover:text-fd-primary"
          >
            {isExternal ? '↗' : '→'}
          </span>
        ) : null}
      </div>
      <p
        className={`text-sm text-fd-muted-foreground ${featured ? 'max-w-2xl' : ''}`}
      >
        {project.blurb}
      </p>
      <StackTags stack={project.stack} />
    </>
  );

  const base =
    'group flex h-full flex-col gap-1.5 rounded-lg border bg-fd-card p-4 shadow-sm transition-all hover:shadow-md';
  const tone = project.locked
    ? 'border-dashed border-fd-border hover:border-fd-primary/50'
    : project.href
      ? 'border-fd-border hover:border-fd-primary/60'
      : 'border-fd-border';
  const accent = featured ? 'border-fd-primary/30 sm:p-5' : '';
  const className = `${base} ${tone} ${accent}`;

  if (!project.href) {
    return <div className={className}>{inner}</div>;
  }
  return isExternal ? (
    <a
      href={project.href}
      target="_blank"
      rel="noreferrer noopener"
      className={className}
    >
      {inner}
    </a>
  ) : (
    <Link href={project.href} className={className}>
      {inner}
    </Link>
  );
}

export function ProjectGrid() {
  const [featured, ...rest] = PROJECTS;
  return (
    <div className="not-prose @container my-6 flex flex-col gap-3">
      <ProjectCard project={featured} featured />
      <div className="grid gap-3 @md:grid-cols-2">
        {rest.map((project) => (
          <ProjectCard key={project.name} project={project} />
        ))}
      </div>
    </div>
  );
}
