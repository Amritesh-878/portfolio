import Link from 'next/link';

interface Certificate {
  title: string;
  issuer: string;
  blurb: string;
  verifyUrl?: string;
  appliedIn?: { label: string; href: string };
}

const CERTIFICATES: Certificate[] = [
  {
    title: 'NLP with Attention Models',
    issuer: 'DeepLearning.AI',
    blurb: 'Attention and transformer architectures for language.',
    verifyUrl: 'https://www.coursera.org/verify/ATJIV26LU47G',
    appliedIn: {
      label: 'Mental Health RAG',
      href: '/projects/mental-health-rag',
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
    title: 'Machine Learning Specialization',
    issuer: 'Stanford · DeepLearning.AI',
    blurb: 'Supervised and unsupervised learning, up to neural networks.',
    verifyUrl: 'https://www.coursera.org/verify/specialization/XS22KQX0NZXG',
    appliedIn: {
      label: 'Wildfire Smoke Detection',
      href: '/projects/wildfire-smoke',
    },
  },
  {
    title: 'Introduction to TensorFlow',
    issuer: 'DeepLearning.AI',
    blurb: 'Building and training neural networks in TensorFlow.',
    verifyUrl: 'https://www.coursera.org/verify/BWBAIKI0CFRS',
    appliedIn: {
      label: 'Wildfire Smoke Detection',
      href: '/projects/wildfire-smoke',
    },
  },
  {
    title: 'DevOps on AWS Specialization',
    issuer: 'Amazon Web Services',
    blurb: 'CI/CD — build, test, and deploy pipelines on AWS.',
    verifyUrl: 'https://www.coursera.org/verify/specialization/3HEC8IT66P0D',
    appliedIn: {
      label: 'Hunter Wumpus (deploy)',
      href: '/projects/hunter-wumpus',
    },
  },
  {
    title: 'Regression & Forecasting for Data Scientists',
    issuer: 'EDUCBA',
    blurb: 'Regression and time-series forecasting in Python.',
    appliedIn: { label: 'YouTube Trends', href: '/projects/youtube-trends' },
  },
  {
    title: 'Google Cloud Computing Foundations',
    issuer: 'Google Cloud',
    blurb:
      'Cloud infrastructure, networking, security, and data/ML on GCP (skill badges).',
  },
];

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
            <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 font-mono text-xs">
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
              {cert.appliedIn ? (
                <Link
                  href={cert.appliedIn.href}
                  className="text-fd-muted-foreground hover:text-fd-primary"
                >
                  used in {cert.appliedIn.label} →
                </Link>
              ) : null}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
