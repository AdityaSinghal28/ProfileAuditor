import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useDropzone } from 'react-dropzone';
import axios from 'axios';
import {
  CloudArrowUpIcon,
  DocumentTextIcon,
  XMarkIcon,
  ChevronDownIcon,
  ArrowRightIcon,
  BriefcaseIcon,
  UserCircleIcon,
  ExclamationCircleIcon,
} from '@heroicons/react/24/outline';
import { API_BASE_URL } from '../config/api';
import WorkflowStepper from '../components/WorkflowStepper';
import { Badge, buttonClass, Card, CardHeader, cx, Notice, PageHeader, Spinner } from '../components/ui';
import { formatFileSize } from '../utils/formatters';

const PRESETS = [
  {
    title: 'Backend Go Engineer',
    text: 'Role: Senior Backend Engineer\nRequired Skills: Go, Docker, PostgreSQL, Kubernetes, Microservices, Git\nPreferred Skills: Redis, gRPC, AWS, Kafka\nResponsibilities: Build high-throughput distributed backend services, design resilient SQL schemas, and deploy containerized microservices.',
  },
  {
    title: 'Full-Stack React/Node',
    text: 'Role: Full-Stack Engineer\nRequired Skills: TypeScript, React, Node.js, Next.js, SQL, Tailwind CSS\nPreferred Skills: GraphQL, Docker, Redis\nResponsibilities: Develop interactive responsive web applications and scalable REST APIs.',
  },
  {
    title: 'AI / ML Engineer',
    text: 'Role: Machine Learning Engineer\nRequired Skills: Python, PyTorch, FastAPI, Docker, Scikit-learn, SQL\nPreferred Skills: Ray, MLflow, HuggingFace, CUDA\nResponsibilities: Train and serve large language models and computer vision pipelines.',
  },
];

function Disclosure({ icon: Icon, title, badge, open, onToggle, children }) {
  return (
    <div className="border-t border-line">
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={open}
        className="flex w-full items-center justify-between gap-3 px-6 py-4 text-left transition hover:bg-sunken/40"
      >
        <span className="flex items-center gap-3">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-sunken text-fg-muted">
            <Icon className="h-4 w-4" />
          </span>
          <span className="text-sm font-medium text-fg">{title}</span>
          {badge}
        </span>
        <ChevronDownIcon className={cx('h-4 w-4 text-fg-subtle transition-transform', open && 'rotate-180')} />
      </button>
      {open && <div className="px-6 pb-5">{children}</div>}
    </div>
  );
}

function UploadPage() {
  const [file, setFile] = useState(null);
  const [consentGiven, setConsentGiven] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingStage, setLoadingStage] = useState('');
  const [error, setError] = useState('');
  const [showOverrides, setShowOverrides] = useState(false);
  const [githubUsername, setGithubUsername] = useState('');
  const [leetcodeUsername, setLeetcodeUsername] = useState('');
  const [showJobDescription, setShowJobDescription] = useState(false);
  const [jobDescription, setJobDescription] = useState('');

  const navigate = useNavigate();
  const stageTimer = useRef(null);
  useEffect(() => () => clearTimeout(stageTimer.current), []);

  const onDrop = (acceptedFiles) => {
    if (acceptedFiles && acceptedFiles.length > 0) {
      setFile(acceptedFiles[0]);
      setError('');
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
    },
    maxFiles: 1,
    multiple: false,
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!file) {
      setError('Please select a resume file (PDF or DOCX) to begin.');
      return;
    }

    setLoading(true);
    setLoadingStage('Parsing document text & structure…');
    setError('');

    if (githubUsername.trim()) localStorage.setItem('github_username', githubUsername.trim().replace(/^@/, ''));
    if (leetcodeUsername.trim()) localStorage.setItem('leetcode_username', leetcodeUsername.trim().replace(/^@/, ''));

    const formData = new FormData();
    formData.append('file', file);
    if (jobDescription.trim()) formData.append('job_description', jobDescription.trim());

    try {
      stageTimer.current = setTimeout(() => setLoadingStage('Auditing GitHub commits, LeetCode metrics & JD fit…'), 1200);

      const response = await axios.post(`${API_BASE_URL}/api/resume/upload`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      const resumeId = response.data.resume_id;
      sessionStorage.setItem('profileauditor_last_resume_id', resumeId);

      const queryParams = new URLSearchParams();
      if (githubUsername.trim()) queryParams.set('github', githubUsername.trim());
      if (leetcodeUsername.trim()) queryParams.set('leetcode', leetcodeUsername.trim());
      const queryStr = queryParams.toString() ? `?${queryParams.toString()}` : '';
      navigate(`/results/${resumeId}${queryStr}`);
    } catch (err) {
      console.error('Error uploading resume:', err);
      let errorMessage = 'Failed to process resume. Please check your connection and try again.';
      if (err.code === 'ERR_NETWORK') {
        errorMessage = `Cannot reach the backend at ${API_BASE_URL}. Ensure the FastAPI server is running.`;
      } else if (err.response?.status === 400) {
        errorMessage = err.response.data?.detail || 'Invalid file format. Please upload a valid PDF or DOCX resume.';
      } else if (err.response?.status === 500) {
        errorMessage = 'Server error during parsing. Please try again.';
      }
      setError(errorMessage);
    } finally {
      clearTimeout(stageTimer.current);
      setLoading(false);
      setLoadingStage('');
    }
  };

  const ready = !!file && consentGiven && !loading;

  return (
    <div className="animate-fade-up">
      <WorkflowStepper />

      <PageHeader
        eyebrow="New audit"
        title="Audit a developer resume"
        description="Upload a resume to verify claimed languages, check GitHub code authenticity and optionally score fit against a target role."
      />

      <div className="grid gap-6 lg:grid-cols-3">
        <form onSubmit={handleSubmit} className="lg:col-span-2">
          <Card className="overflow-hidden">
            {/* Dropzone */}
            <div className="p-6">
              <div
                {...getRootProps()}
                className={cx(
                  'relative overflow-hidden cursor-pointer rounded-xl border-2 border-dashed p-8 text-center transition',
                  isDragActive ? 'border-brand bg-brand/5' : file ? 'border-line-strong bg-sunken/50' : 'border-line hover:border-brand/50 hover:bg-sunken/40'
                )}
              >
                <input {...getInputProps()} />
                {!file && <div className="scanline" />}
                {file ? (
                  <div className="flex items-center justify-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand/10 text-brand">
                      <DocumentTextIcon className="h-6 w-6" />
                    </div>
                    <div className="min-w-0 text-left">
                      <p className="truncate text-sm font-medium text-fg">{file.name}</p>
                      <p className="mt-0.5 text-xs text-fg-muted">{formatFileSize(file.size)} · click or drop to replace</p>
                    </div>
                    <button
                      type="button"
                      onClick={(ev) => {
                        ev.stopPropagation();
                        setFile(null);
                      }}
                      className="rounded-lg p-1.5 text-fg-subtle hover:bg-surface hover:text-fg"
                      aria-label="Remove file"
                    >
                      <XMarkIcon className="h-4 w-4" />
                    </button>
                  </div>
                ) : (
                  <>
                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-sunken text-fg-muted">
                      <CloudArrowUpIcon className="h-6 w-6" />
                    </div>
                    <p className="mt-4 text-sm font-medium text-fg">
                      Drop a resume here, or <span className="text-brand">browse files</span>
                    </p>
                    <p className="mt-1 text-xs text-fg-muted">PDF or DOCX · up to 10 MB</p>
                  </>
                )}
              </div>
            </div>

            {/* Target role */}
            <Disclosure
              icon={BriefcaseIcon}
              title="Target role"
              badge={<Badge tone="ok">Enables role-fit score</Badge>}
              open={showJobDescription}
              onToggle={() => setShowJobDescription((v) => !v)}
            >
              <div className="mb-3 flex flex-wrap items-center gap-2">
                <span className="text-xs text-fg-muted">Presets</span>
                {PRESETS.map((p) => (
                  <button
                    key={p.title}
                    type="button"
                    onClick={() => setJobDescription(p.text)}
                    className="rounded-md border border-line bg-surface px-2.5 py-1 text-xs font-medium text-fg-muted transition hover:border-brand/40 hover:text-brand"
                  >
                    {p.title}
                  </button>
                ))}
              </div>
              <textarea
                rows={5}
                placeholder="Paste the job description, required tech stack or hiring requirements…"
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                className="field resize-y leading-relaxed"
              />
              <p className="mt-2 text-xs text-fg-subtle">Verified code evidence is cross-referenced against these requirements.</p>
            </Disclosure>

            {/* Overrides */}
            <Disclosure
              icon={UserCircleIcon}
              title="Profile handles"
              badge={<Badge>Optional</Badge>}
              open={showOverrides}
              onToggle={() => setShowOverrides((v) => !v)}
            >
              <p className="mb-3 text-xs text-fg-muted">Use these if the resume doesn’t list handles, or to override the ones it does.</p>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="gh" className="label">GitHub username</label>
                  <input id="gh" type="text" placeholder="torvalds" value={githubUsername} onChange={(e) => setGithubUsername(e.target.value)} className="field font-mono" />
                </div>
                <div>
                  <label htmlFor="lc" className="label">LeetCode username</label>
                  <input id="lc" type="text" placeholder="neetcode" value={leetcodeUsername} onChange={(e) => setLeetcodeUsername(e.target.value)} className="field font-mono" />
                </div>
              </div>
            </Disclosure>

            {/* Consent + submit */}
            <div className="space-y-4 border-t border-line bg-sunken/30 p-6">
              <label htmlFor="form-consent" className="flex cursor-pointer select-none items-start gap-3">
                <input
                  id="form-consent"
                  type="checkbox"
                  checked={consentGiven}
                  onChange={(e) => setConsentGiven(e.target.checked)}
                  className="mt-0.5 h-4 w-4 cursor-pointer rounded border-line-strong accent-[rgb(var(--brand))]"
                  aria-required="true"
                />
                <span className="text-xs leading-relaxed text-fg-muted">
                  I confirm I have the right to process this resume and agree to the{' '}
                  <Link to="/terms" target="_blank" rel="noopener noreferrer" className="font-medium text-brand hover:underline">Terms of Service</Link> and{' '}
                  <Link to="/privacy" target="_blank" rel="noopener noreferrer" className="font-medium text-brand hover:underline">Privacy Policy</Link>.
                </span>
              </label>

              {error && (
                <Notice tone="bad">
                  <ExclamationCircleIcon className="mt-px h-4 w-4 shrink-0" />
                  <span>{error}</span>
                </Notice>
              )}

              <button type="submit" disabled={!ready} className={buttonClass('primary', 'lg', 'w-full')}>
                {loading ? (
                  <>
                    <Spinner />
                    <span>{loadingStage || 'Processing resume…'}</span>
                  </>
                ) : (
                  <>
                    Run verification audit
                    <ArrowRightIcon className="h-4 w-4" />
                  </>
                )}
              </button>
            </div>
          </Card>
        </form>

        {/* Side rail */}
        <div className="space-y-6">
          <Card>
            <CardHeader title="What gets checked" />
            <ul className="space-y-4 p-5 text-xs">
              {[
                ['Skills', 'Languages and tools on the resume vs. code in original (non-fork) repos.'],
                ['Projects', 'Each listed project matched to a public repository.'],
                ['Problem solving', 'Solved counts, contest rating and rank from LeetCode.'],
                ['Role fit', 'Verified evidence against your job description, if provided.'],
              ].map(([t, d], i) => (
                <li key={t} className="flex gap-3">
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-brand/10 font-mono text-[10px] font-semibold text-brand">{i + 1}</span>
                  <div>
                    <div className="font-medium text-fg">{t}</div>
                    <div className="mt-0.5 leading-relaxed text-fg-muted">{d}</div>
                  </div>
                </li>
              ))}
            </ul>
          </Card>
          <Card className="p-5">
            <div className="text-xs font-medium text-fg">After you submit</div>
            <p className="mt-1 text-xs leading-relaxed text-fg-muted">
              You’ll be taken to the report automatically as soon as parsing finishes.
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default UploadPage;
