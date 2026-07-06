import Link from 'next/link';

interface Applied {
  label: string;
  href: string;
}

interface Certificate {
  title: string;
  issuer: string;
  blurb: string;
  verifyUrl?: string;
  appliedIn?: Applied;
}

const CERTIFICATES: Certificate[] = [
  {
    title: 'Machine Learning Specialization',
    issuer: 'Stanford · DeepLearning.AI',
    blurb: 'Supervised and unsupervised learning, up through neural networks.',
    verifyUrl: 'https://www.coursera.org/verify/specialization/XS22KQX0NZXG',
    appliedIn: { label: 'Wildfire Smoke Detection', href: '/projects' },
  },
  {
    title: 'Advanced Learning Algorithms',
    issuer: 'DeepLearning.AI',
    blurb: 'Neural networks, decision trees, and practical model tuning.',
    verifyUrl: 'https://www.coursera.org/verify/U3WCBF98OA8L',
    appliedIn: { label: 'Wildfire Smoke Detection', href: '/projects' },
  },
  {
    title: 'Supervised Machine Learning',
    issuer: 'DeepLearning.AI',
    blurb: 'Regression and classification, done from the ground up.',
    verifyUrl: 'https://www.coursera.org/verify/0TSB0JUPQFYF',
  },
  {
    title: 'NLP with Attention Models',
    issuer: 'DeepLearning.AI',
    blurb: 'Attention and transformer architectures for language.',
    verifyUrl: 'https://www.coursera.org/verify/ATJIV26LU47G',
    appliedIn: {
      label: 'Mental Health RAG',
      href: 'https://github.com/Amritesh-878/mental-health-chatbot',
    },
  },
  {
    title: 'Fundamentals of Reinforcement Learning',
    issuer: 'University of Alberta',
    blurb: 'MDPs, value functions, and policy learning.',
    verifyUrl: 'https://www.coursera.org/verify/LS7R5GE0RHTR',
    appliedIn: { label: 'Hunter Wumpus', href: '/projects/hunter-wumpus' },
  },
  {
    title: 'Introduction to TensorFlow',
    issuer: 'DeepLearning.AI',
    blurb: 'Building and training neural networks in TensorFlow.',
    verifyUrl: 'https://www.coursera.org/verify/BWBAIKI0CFRS',
    appliedIn: { label: 'Wildfire Smoke Detection', href: '/projects' },
  },
  {
    title: 'DevOps on AWS Specialization',
    issuer: 'Amazon Web Services',
    blurb: 'CI/CD pipelines that build, test, and deploy on AWS.',
    verifyUrl: 'https://www.coursera.org/verify/specialization/3HEC8IT66P0D',
    appliedIn: {
      label: 'Hunter Wumpus (deploy)',
      href: '/projects/hunter-wumpus',
    },
  },
  {
    title: 'DevOps on AWS: Code, Build, and Test',
    issuer: 'Amazon Web Services',
    blurb: 'Automated build and test stages inside a CI pipeline.',
    verifyUrl: 'https://www.coursera.org/verify/Z11YJWEB0A30',
  },
  {
    title: 'Regression & Forecasting for Data Scientists',
    issuer: 'EDUCBA',
    blurb: 'Regression and time-series forecasting in Python.',
    appliedIn: {
      label: 'YouTube Trends',
      href: 'https://github.com/Amritesh-878/youtube-trending-analysis',
    },
  },
  {
    title: 'AI & ML Course',
    issuer: 'Simplilearn',
    blurb: 'An applied tour across the ML and deep-learning stack.',
  },
  {
    title: 'Google Cloud Computing Foundations',
    issuer: 'Google Cloud',
    blurb: 'Cloud infrastructure, networking, security, and data/ML on GCP.',
  },
];

function AppliedLink({ applied }: { applied: Applied }) {
  const className = 'text-fd-muted-foreground hover:text-fd-primary';
  const label = `used in ${applied.label} →`;
  if (applied.href.startsWith('http')) {
    return (
      <a
        href={applied.href}
        target="_blank"
        rel="noreferrer noopener"
        className={className}
      >
        {label}
      </a>
    );
  }
  return (
    <Link href={applied.href} className={className}>
      {label}
    </Link>
  );
}

export function Certificates() {
  return (
    <div className="not-prose @container my-6">
      <div className="grid gap-3 @md:grid-cols-2 @2xl:grid-cols-3">
        {CERTIFICATES.map((cert) => (
          <div
            key={cert.title}
            className="flex flex-col gap-1 rounded-lg border border-fd-border bg-fd-card p-4"
          >
            <span className="font-mono text-sm font-medium text-fd-foreground">
              {cert.title}
            </span>
            <span className="text-xs text-fd-muted-foreground">
              {cert.issuer}
            </span>
            <p className="mt-1 flex-1 text-sm text-fd-muted-foreground">
              {cert.blurb}
            </p>
            <div className="mt-2 flex flex-col items-start gap-1 font-mono text-xs">
              {cert.verifyUrl ? (
                <a
                  href={cert.verifyUrl}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="text-fd-primary hover:underline"
                >
                  verify ↗
                </a>
              ) : null}
              {cert.appliedIn ? <AppliedLink applied={cert.appliedIn} /> : null}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
