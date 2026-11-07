import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { ArrowRightIcon, PrinterIcon, PencilSquareIcon, EnvelopeIcon, CheckCircleIcon, ExclamationTriangleIcon, XCircleIcon, InformationCircleIcon, PaperAirplaneIcon, BriefcaseIcon, DocumentChartBarIcon, UserGroupIcon } from '@heroicons/react/24/outline';
import { API_BASE_URL } from '../config/api';
import WorkflowStepper from '../components/WorkflowStepper';
import { Badge, buttonClass, Card, CardHeader, Chip, cx, Notice, Spinner } from '../components/ui';
import { getScoreMeta, toneForPercent } from '../utils/score';
import { saveRecentAudit } from '../utils/recentAudits';
import { CountUp, Reveal, useInView } from '../components/motion';

/* ------------------------------------------------------------------ */
/* Invitation form (top-level so typing never remounts it)             */
/* ------------------------------------------------------------------ */
function SendInvitationCard({ resumeId, email, scoreValue }) {
  const [sending, setSending] = useState(false);
  const [inviteStatus, setInviteStatus] = useState(null);
  const [interviewDate, setInterviewDate] = useState('');
  const [interviewLocation, setInterviewLocation] = useState('Google Meet');
  const [customMessage, setCustomMessage] = useState(
    `Hello, based on your audited profile (Reality Score: ${Math.round(scoreValue || 0)}/100), we would like to invite you for a technical interview.`
  );

  const handleSend = async (e) => {
    e.preventDefault();
    setSending(true);
    setInviteStatus(null);
    try {
      await axios.post(`${API_BASE_URL}/api/invite/${resumeId}`, {
        message: customMessage,
        interview_date: interviewDate || null,
        interview_location: interviewLocation || null,
      });
      setInviteStatus({ success: true, message: 'Invitation email dispatched successfully.' });
    } catch (err) {
      console.error('Error sending invitation:', err);
      let msg = 'Failed to dispatch email. Check SMTP configuration in backend/.env.';
      if (err.response?.data?.detail) {
        msg = typeof err.response.data.detail === 'string' ? err.response.data.detail : JSON.stringify(err.response.data.detail);
      }
      setInviteStatus({ success: false, message: msg });
    } finally {
      setSending(false);
    }
  };

  return (
    <Card data-no-print>
      <CardHeader
        icon={EnvelopeIcon}
        title="Interview invitation"
        description="Send a technical interview invite straight to the candidate."
      />
      <form onSubmit={handleSend} className="space-y-4 p-5">
        <div className="flex items-center justify-between gap-3 rounded-lg bg-sunken px-3 py-2 text-xs">
          <span className="text-fg-muted">To</span>
          <span className="truncate font-mono text-fg">{email || 'No email extracted'}</span>
        </div>
        <div>
          <label className="label" htmlFor="inv-date">Suggested date &amp; time</label>
          <input id="inv-date" type="text" placeholder="Tomorrow at 2:00 PM EST" value={interviewDate} onChange={(e) => setInterviewDate(e.target.value)} className="field" />
        </div>
        <div>
          <label className="label" htmlFor="inv-loc">Location / video link</label>
          <input id="inv-loc" type="text" value={interviewLocation} onChange={(e) => setInterviewLocation(e.target.value)} className="field" />
        </div>
        <div>
          <label className="label" htmlFor="inv-msg">Message</label>
          <textarea id="inv-msg" rows={4} value={customMessage} onChange={(e) => setCustomMessage(e.target.value)} className="field resize-y leading-relaxed" />
        </div>

        {inviteStatus && (
          <Notice tone={inviteStatus.success ? 'ok' : 'bad'}>
            {inviteStatus.success ? <CheckCircleIcon className="mt-px h-4 w-4 shrink-0" /> : <XCircleIcon className="mt-px h-4 w-4 shrink-0" />}
            <span>{inviteStatus.message}</span>
          </Notice>
        )}

        <button type="submit" disabled={sending} className={buttonClass('primary', 'md', 'w-full')}>
          {sending ? <><Spinner /> Sending…</> : <><PaperAirplaneIcon className="h-4 w-4" /> Send invitation</>}
        </button>
        <p className="text-center text-[11px] text-fg-subtle">Sent via the SMTP account configured on the backend.</p>
      </form>
    </Card>
  );
}

/* ------------------------------------------------------------------ */
/* Small presentational helpers                                         */
/* ------------------------------------------------------------------ */
function SkillChips({ items, tone, empty }) {
  if (!items.length) return <p className="text-xs italic text-fg-subtle">{empty}</p>;
  return (
    <div className="flex flex-wrap gap-2">
      {items.map((s, i) => <Chip key={`${s}-${i}`} tone={tone}>{s}</Chip>)}
    </div>
  );
}

function RequirementColumn({ title, tag, tone, items, empty }) {
  return (
    <div className="rounded-lg border border-line bg-sunken/40 p-4">
      <div className="mb-3 flex items-center justify-between">
        <span className="text-xs font-semibold text-fg">{title} <span className="font-mono text-fg-subtle">({items.length})</span></span>
        <Badge tone={tone} mono>{tag}</Badge>
      </div>
      <SkillChips items={items} tone={tone} empty={empty} />
    </div>
  );
}

function MiniMetric({ label, value, hint }) {
  return (
    <div className="rounded-lg border border-line bg-sunken/40 p-3">
      <div className="text-[11px] font-medium text-fg-muted">{label}</div>
      <div className="mt-1 font-mono text-lg font-semibold text-fg">{value}</div>
      {hint && <div className="mt-0.5 text-[11px] text-fg-subtle">{hint}</div>}
    </div>
  );
}

function BulletList({ items, tone }) {
  const dot = tone === 'ok' ? 'bg-ok' : 'bg-warn';
  return (
    <ul className="space-y-2">
      {items.map((t, i) => (
        <li key={i} className="flex items-start gap-2.5 text-xs leading-relaxed text-fg-muted">
          <span className={cx('mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full', dot)} />
          <span>{t}</span>
        </li>
      ))}
    </ul>
  );
}


function ClaimRow({ ok, name, detail }) {
  return (
    <Reveal className="grid items-baseline gap-2 border-t border-ink/15 py-5 sm:grid-cols-12">
      <span className={cx('font-display text-3xl font-bold tracking-tight sm:col-span-5', !ok && 'text-fg-subtle')}>
        <span className={ok ? 'hl' : 'st'}>{name}</span>
      </span>
      <span className="text-sm leading-relaxed text-fg-muted sm:col-span-5">{detail}</span>
      <span className="sm:col-span-2 sm:text-right"><Badge tone={ok ? 'ok' : 'neutral'} mono>{ok ? 'Verified' : 'Unverified'}</Badge></span>
    </Reveal>
  );
}

function Ruler({ value, max, label }) {
  const [ref, on] = useInView(0.3);
  const n = on ? Math.round((Math.min(value, max) / max) * 40) : 0;
  return (
    <div ref={ref} className="border-b border-snow/25 py-4">
      <div className="flex items-baseline justify-between">
        <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-snow/75">{label}</span>
        <CountUp value={value} run={on} className="font-display text-5xl font-extrabold leading-none tracking-tighter" />
      </div>
      <div className="mt-3 flex h-4 items-end gap-[2px]" aria-hidden="true">
        {Array.from({ length: 40 }).map((_, i) => (
          <span key={i} className={cx('flex-1 transition-all duration-500', i < n ? 'h-full bg-lime' : 'h-1/3 bg-snow/25')} style={{ transitionDelay: `${i * 15}ms` }} />
        ))}
      </div>
      <div className="mt-1 text-right font-mono text-[10px] text-snow/50">scale 0–{max}</div>
    </div>
  );
}

function ScoreRuler({ score }) {
  const [ref, on] = useInView(0.2);
  return (
    <div ref={ref} className="flex h-16 items-end gap-[3px]" aria-hidden="true">
      {Array.from({ length: 50 }).map((_, i) => (
        <span key={i} className={cx('flex-1 transition-all duration-500', on && i < score / 2 ? 'h-full bg-lime' : 'h-1/3 bg-snow/25')} style={{ transitionDelay: `${300 + i * 18}ms` }} />
      ))}
    </div>
  );
}

/* Loading view: cycling stage titles + segmented bar */
function AuditProgress({ resumeLoaded, verified }) {
  const stages = [
    ['Parsing the resume', 'Extracting text, skills and projects.', resumeLoaded],
    ['Checking the footprint', 'Reading public GitHub repositories and LeetCode.', verified],
    ['Scoring reality', 'Weighing the evidence across sources.', false],
  ];
  const cur = Math.max(stages.findIndex((s) => !s[2]), 0);
  return (
    <div className="mx-auto max-w-3xl py-16 text-snow">
      <div className="rise font-mono text-[11px] uppercase tracking-[0.18em] text-lime">● Auditing · {String(cur + 1).padStart(2, '0')} / 03</div>
      <h2 key={cur} className="rise mt-5 font-display text-[clamp(2.6rem,7vw,5.5rem)] font-extrabold leading-[0.92] tracking-tighter">
        {stages[cur][0]}<span className="dots" />
      </h2>
      <p key={`d${cur}`} style={{ '--d': '.12s' }} className="rise mt-5 font-serif text-2xl italic text-snow/80">{stages[cur][1]}</p>
      <div className="mt-12 grid grid-cols-3 gap-2" aria-hidden="true">
        {stages.map((st, i) => <span key={i} className={cx('h-2 transition-colors duration-700', st[2] ? 'bg-lime' : i === cur ? 'bar-run' : 'bg-snow/25')} />)}
      </div>
      <ol className="mt-6 space-y-2 font-mono text-[11px] uppercase tracking-[0.14em]">
        {stages.map((st, i) => (
          <li key={st[0]} className={cx('flex items-center gap-3 transition-colors duration-500', st[2] ? 'text-lime' : i === cur ? 'text-snow' : 'text-snow/40')}>
            <span>{st[2] ? '✓' : String(i + 1).padStart(2, '0')}</span>{st[0]}
          </li>
        ))}
      </ol>
    </div>
  );
}

function ResultsPage() {
  const { resumeId } = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [verificationStatus, setVerificationStatus] = useState('pending');
  const [score, setScore] = useState(null);
  const [verificationData, setVerificationData] = useState(null);
  const [resumeData, setResumeData] = useState(null);

  useEffect(() => {
    if (resumeId) {
      sessionStorage.setItem('profileauditor_last_resume_id', resumeId);
    }
  }, [resumeId]);

  // Main linear audit pipeline
  useEffect(() => {
    let isMounted = true;
    let pollTimeout = null;

    const runAuditPipeline = async () => {
      try {
        setLoading(true);
        setError(null);

        // 1. Fetch parsed resume data
        const resumeRes = await axios.get(`${API_BASE_URL}/api/resume/${resumeId}`);
        if (!isMounted) return;

        if (resumeRes.status === 202 || resumeRes.data.status === 'processing') {
          // Still processing, poll in 1.2s
          pollTimeout = setTimeout(runAuditPipeline, 1200);
          return;
        }

        if (resumeRes.data.status === 'error') {
          setError(resumeRes.data.error || 'Failed to parse resume');
          setLoading(false);
          return;
        }

        const parsedResume = resumeRes.data;
        setResumeData(parsedResume);

        // 2. Check if verification was already executed
        let isAlreadyDone = false;
        try {
          const verCheck = await axios.get(`${API_BASE_URL}/api/verification/${resumeId}`);
          if (!isMounted) return;
          if (verCheck.data && verCheck.data.status === 'completed') {
            setVerificationData(verCheck.data);
            setVerificationStatus('completed');
            isAlreadyDone = true;
          }
        } catch (_) {
          // 404 is expected on first run before verification is started
        }

        // 3. If not already verified, start verification POST
        if (!isAlreadyDone) {
          const urlParams = new URLSearchParams(window.location.search);
          const handles = {
            github_username:
              urlParams.get('github') ||
              localStorage.getItem('github_username') ||
              parsedResume.github_username ||
              null,
            leetcode_username:
              urlParams.get('leetcode') ||
              localStorage.getItem('leetcode_username') ||
              parsedResume.leetcode_username ||
              null,
          };

          await axios.post(`${API_BASE_URL}/api/verification/${resumeId}`, handles);
          if (!isMounted) return;

          const verResult = await axios.get(`${API_BASE_URL}/api/verification/${resumeId}`);
          if (!isMounted) return;
          setVerificationData(verResult.data);
          setVerificationStatus('completed');
        }

        // 4. Fetch Reality Score
        const scoreRes = await axios.get(`${API_BASE_URL}/api/score/${resumeId}`);
        if (!isMounted) return;
        setScore(scoreRes.data);
        setLoading(false);

        // Index this audit for the dashboard's "Recent audits" table
        saveRecentAudit({
          id: resumeId,
          name: parsedResume?.name || null,
          score: Math.round(scoreRes.data?.score || 0),
          roleFit: scoreRes.data?.role_analysis?.role_fit_score ?? null,
          ats: scoreRes.data?.ats_analysis?.ats_score ?? null,
        });

        // Clear overrides from local storage
        localStorage.removeItem('github_username');
        localStorage.removeItem('leetcode_username');

      } catch (err) {
        if (!isMounted) return;
        console.error('Audit pipeline error:', err);
        let msg = 'Failed to complete candidate verification audit.';
        if (err.response?.data?.detail) {
          msg = typeof err.response.data.detail === 'string' ? err.response.data.detail : JSON.stringify(err.response.data.detail);
        } else if (err.message) {
          msg = err.message;
        }
        setError(msg);
        setLoading(false);
      }
    };

    runAuditPipeline();

    return () => {
      isMounted = false;
      if (pollTimeout) clearTimeout(pollTimeout);
    };
  }, [resumeId]);


  /* ---------------- Loading / error ---------------- */
  if (loading) {
    return <AuditProgress resumeLoaded={!!resumeData} verified={verificationStatus === 'completed'} />;
  }

  if (error) {
    return (
      <div className="mx-auto max-w-md animate-fade-up py-12">
        <Card className="p-8 text-center">
          <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-full bg-bad/10 text-bad">
            <ExclamationTriangleIcon className="h-5 w-5" />
          </div>
          <h2 className="mt-4 text-base font-semibold text-fg">Verification couldn’t finish</h2>
          <p className="mt-1.5 text-xs leading-relaxed text-fg-muted">{error}</p>
          <div className="mt-6 flex items-center justify-center gap-2">
            <button onClick={() => window.location.reload()} className={buttonClass('primary', 'sm')}>Retry audit</button>
            <Link to="/upload" className={buttonClass('secondary', 'sm')}>Upload another resume</Link>
          </div>
        </Card>
      </div>
    );
  }

  /* ---------------- Derived data (unchanged semantics) ---------------- */
  const realityScore = score?.score ? Math.round(score.score) : 0;
  const scoreMeta = getScoreMeta(realityScore);
  const candidateName = resumeData?.name || 'Candidate report';
  const candidateEmail = resumeData?.email || '';
  const githubUser = resumeData?.github_username || verificationData?.github_username || verificationData?.github?.username;
  const leetcodeUser = resumeData?.leetcode_username || verificationData?.leetcode_username || verificationData?.leetcode?.username;
  const breakdown = score?.breakdown || {};

  const verifiedSkills = score?.verified_skills || [];
  const unverifiedSkills = score?.unverified_skills || [];
  const softSkills = score?.soft_skills || verificationData?.soft_skills || resumeData?.soft_skills || [];
  const verifiedProjects = score?.verified_projects || [];
  const unverifiedProjects = score?.unverified_projects || [];

  const githubData = verificationData?.github || verificationData?.github_results || {};
  const leetcodeData = verificationData?.leetcode || {};
  const role = score?.role_analysis;
  const ats = score?.ats_analysis;

  const breakdownRows = [
    ['GitHub code authenticity', breakdown.github_score],
    ['Technical skills verification', breakdown.skills_score],
    ['Projects verification', breakdown.projects_score],
    ['LeetCode problem solving', breakdown.leetcode_score],
  ];

  const projectDescription = (project, fallback) => {
    const pName = typeof project === 'string' ? project : project.name || 'Project';
    const rp = (resumeData?.projects || []).find((p) => (p.name || '').toLowerCase() === pName.toLowerCase());
    return { pName, desc: rp?.description || fallback };
  };

  return (
    <div className="animate-fade-up">
      <WorkflowStepper activeResumeId={resumeId} candidateName={candidateName} />

      {/* ---------- Case file hero ---------- */}
      <header className="mb-14 text-snow">
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 font-mono text-[11px] uppercase tracking-[0.18em] text-snow/70">
          <span className="text-lime">● Case file</span><span>AUD-{resumeId.slice(0, 8)}</span>
          {candidateEmail && <span className="normal-case tracking-normal">{candidateEmail}</span>}
        </div>
        <div className="mt-4 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <h1 className="font-display text-[clamp(2.6rem,7vw,6rem)] font-extrabold leading-[0.92] tracking-tighter">{candidateName}</h1>
          <div className="flex flex-wrap gap-2" data-no-print>
            <button onClick={() => window.print()} className={buttonClass('outline')}><PrinterIcon className="h-4 w-4" /> Print</button>
            <Link to={`/editor/${resumeId}`} className={buttonClass('lime')}><PencilSquareIcon className="h-4 w-4" /> Open ATS editor</Link>
          </div>
        </div>
        <div className="mt-4 flex flex-wrap gap-2 font-mono text-xs">
          {githubUser && <a href={`https://github.com/${githubUser}`} target="_blank" rel="noreferrer" className="border border-snow/40 px-3 py-1.5 hover:bg-snow hover:text-ink">GitHub @{githubUser} ↗</a>}
          {leetcodeUser && <a href={`https://leetcode.com/u/${leetcodeUser}`} target="_blank" rel="noreferrer" className="border border-snow/40 px-3 py-1.5 hover:bg-snow hover:text-ink">LeetCode @{leetcodeUser} ↗</a>}
        </div>

        <div className="mt-14 grid items-end gap-12 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <div className="font-mono text-[11px] uppercase tracking-[0.18em] text-snow/70">Reality score</div>
            <div className="flex items-baseline gap-2">
              <CountUp value={realityScore} ms={1500} className="font-display text-[clamp(8rem,20vw,15rem)] font-extrabold leading-[0.8] tracking-tighter" />
              <span className="font-mono text-sm text-snow/60">/100</span>
            </div>
            <p className="mt-5 font-serif text-3xl italic"><span className="mark">{scoreMeta.label}</span></p>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-snow/80">{scoreMeta.subtext}</p>
          </div>
          <div className="lg:col-span-7">
            <ScoreRuler score={realityScore} />
            <div className="mt-8 grid gap-x-10 gap-y-6 sm:grid-cols-2">
              {breakdownRows.map(([label, val]) => (
                <div key={label} className="flex items-baseline justify-between border-b border-snow/30 pb-2">
                  <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-snow/75">{label}</span>
                  <CountUp value={Math.round(val || 0)} ms={1200} className="font-display text-4xl font-bold tracking-tighter" />
                </div>
              ))}
            </div>
          </div>
        </div>

        <dl className="mt-12 grid grid-cols-2 border-y border-snow/30 sm:grid-cols-4">
          {[
            ['Role fit', role ? `${role.role_fit_score}%` : '—'],
            ['ATS health', ats ? `${ats.ats_score}%` : '—'],
            ['Skills verified', `${verifiedSkills.length}/${verifiedSkills.length + unverifiedSkills.length}`],
            ['Projects matched', `${verifiedProjects.length}/${verifiedProjects.length + unverifiedProjects.length}`],
          ].map(([k, v]) => (
            <div key={k} className="border-snow/30 p-5 sm:border-r sm:last:border-r-0">
              <dt className="font-mono text-[11px] uppercase tracking-[0.14em] text-snow/70">{k}</dt>
              <dd className="mt-1 font-display text-4xl font-extrabold tracking-tighter">{v}</dd>
            </div>
          ))}
        </dl>
      </header>

      {/* ---------- The ledger ---------- */}
      <section className="mb-14 bg-snow p-6 text-ink shadow-pop sm:p-10">
        <div className="flex items-end justify-between gap-4">
          <h2 className="font-display text-[clamp(2rem,5vw,3.5rem)] font-extrabold leading-none tracking-tighter">The ledger</h2>
          <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-fg-muted">Claimed → Proven</span>
        </div>

        <h3 className="mt-10 font-mono text-[11px] uppercase tracking-[0.18em] text-fg-muted">
          Technical skills · {verifiedSkills.length}/{verifiedSkills.length + unverifiedSkills.length} verified
        </h3>
        <div className="mt-3 border-b border-ink/15">
          {verifiedSkills.map((n) => <ClaimRow key={`v-${n}`} ok name={n} detail="Corroborated by the candidate’s public, non-fork code." />)}
          {unverifiedSkills.map((n) => <ClaimRow key={`u-${n}`} ok={false} name={n} detail="No trace in public, non-fork code." />)}
          {verifiedSkills.length + unverifiedSkills.length === 0 && <p className="border-t border-ink/15 py-5 text-sm italic text-fg-subtle">No technical skills were extracted.</p>}
        </div>

        <h3 className="mt-12 font-mono text-[11px] uppercase tracking-[0.18em] text-fg-muted">
          Projects · {verifiedProjects.length}/{verifiedProjects.length + unverifiedProjects.length} matched
        </h3>
        <div className="mt-3 border-b border-ink/15">
          {verifiedProjects.map((p, i) => { const { pName, desc } = projectDescription(p, 'Repository match confirmed on GitHub.'); return <ClaimRow key={`vp-${i}`} ok name={pName} detail={desc} />; })}
          {unverifiedProjects.map((p, i) => { const { pName, desc } = projectDescription(p, 'No matching public repository found.'); return <ClaimRow key={`up-${i}`} ok={false} name={pName} detail={desc} />; })}
          {verifiedProjects.length + unverifiedProjects.length === 0 && <p className="border-t border-ink/15 py-5 text-sm italic text-fg-subtle">No projects were detected on the resume.</p>}
        </div>
      </section>

      {/* ---------- Evidence locker ---------- */}
      <section className="mb-14 grid gap-14 text-snow lg:grid-cols-2">
        <div>
          <div className="font-mono text-[11px] uppercase tracking-[0.18em] text-lime">● GitHub{githubUser ? ` · @${githubUser}` : ''}</div>
          <h2 className="mt-2 font-display text-4xl font-extrabold tracking-tighter">Authored code</h2>
          <div className="mt-6 border-t border-snow/25">
            <Ruler label="Original repos" value={githubData.original_repos?.length || githubData.repositories?.length || 0} max={30} />
            <Ruler label="Stars" value={githubData.total_stars || 0} max={500} />
            <Ruler label="Recently active" value={githubData.recent_active_repos?.length || 0} max={10} />
            <Ruler label="Authored commits" value={githubData.contributions || 0} max={1000} />
          </div>
          <p className="mt-4 font-mono text-[11px] uppercase tracking-[0.14em] text-snow/70">{githubData.forked_repos?.length || 0} forked / template repos filtered out</p>
          {githubData.languages?.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2 font-mono text-xs">{githubData.languages.map((l, i) => <span key={i} className="border border-snow/40 px-2.5 py-1">{l}</span>)}</div>
          )}
        </div>

        <div>
          <div className="font-mono text-[11px] uppercase tracking-[0.18em] text-lime">● LeetCode{leetcodeUser ? ` · @${leetcodeUser}` : ''}</div>
          <h2 className="mt-2 font-display text-4xl font-extrabold tracking-tighter">Problem solving</h2>
          {leetcodeUser ? (
            <div className="mt-6 border-t border-snow/25 pt-4">
              <div className="flex items-baseline gap-3">
                <span className="font-display text-[clamp(5rem,12vw,8rem)] font-extrabold leading-[0.85] tracking-tighter">{leetcodeData.total_solved || 0}</span>
                <span className="font-mono text-xs uppercase tracking-[0.14em] text-snow/70">solved</span>
              </div>
              <div className="mt-6 flex h-4 w-full overflow-hidden" aria-hidden="true">
                {[['easy_solved', 'bg-lime'], ['medium_solved', 'bg-snow'], ['hard_solved', 'bg-snow/40']].map(([k, c]) => (
                  <span key={k} className={c} style={{ width: `${((leetcodeData[k] || 0) / Math.max(leetcodeData.total_solved || 1, 1)) * 100}%` }} />
                ))}
              </div>
              <div className="mt-3 flex gap-6 font-mono text-[11px] uppercase tracking-[0.14em]">
                <span><span className="mr-1.5 inline-block h-2 w-2 bg-lime" />Easy {leetcodeData.easy_solved || 0}</span>
                <span><span className="mr-1.5 inline-block h-2 w-2 bg-snow" />Medium {leetcodeData.medium_solved || 0}</span>
                <span><span className="mr-1.5 inline-block h-2 w-2 bg-snow/40" />Hard {leetcodeData.hard_solved || 0}</span>
              </div>
              <dl className="mt-8 border-t border-snow/25">
                {[['Global ranking', leetcodeData.global_ranking ? `#${leetcodeData.global_ranking.toLocaleString()}` : '—'], ['Contest rating', leetcodeData.contest_rating ? `${leetcodeData.contest_rating}` : 'Unrated']].map(([k, v]) => (
                  <div key={k} className="flex items-baseline justify-between border-b border-snow/25 py-3">
                    <dt className="font-mono text-[11px] uppercase tracking-[0.14em] text-snow/75">{k}</dt>
                    <dd className="font-display text-3xl font-bold tracking-tighter">{v}</dd>
                  </div>
                ))}
              </dl>
            </div>
          ) : (
            <p className="mt-6 border-t border-snow/25 pt-6 font-serif text-3xl italic text-snow/85">No LeetCode profile found.</p>
          )}
        </div>
      </section>

      {/* ---------- Main grid ---------- */}
      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        {/* Left / main column */}
        <div className="space-y-6 lg:col-span-2">
          {/* Role fit */}
          {role && (
            <Card>
              <CardHeader
                icon={BriefcaseIcon}
                title={`Target role fit — ${role.role_title}`}
                description={`Domain: ${role.domain_focus}. Verified code evidence evaluated against job requirements.`}
                action={<Badge tone={toneForPercent(role.role_fit_score)} mono>{role.role_fit_score}% · {role.verdict}</Badge>}
              />
              <div className="space-y-4 p-5">
                <Notice tone="info">
                  <InformationCircleIcon className="mt-px h-4 w-4 shrink-0" />
                  <span>{role.verdict_summary}</span>
                </Notice>
                <div className="grid gap-3 md:grid-cols-3">
                  <RequirementColumn title="Verified in code" tag="MATCH" tone="ok" items={role.verified_requirements || []} empty="No core requirements verified in code." />
                  <RequirementColumn title="Claimed, unverified" tag="PENDING" tone="warn" items={role.claimed_unverified_requirements || []} empty="All claimed JD skills were verified." />
                  <RequirementColumn title="Missing from resume" tag="GAP" tone="bad" items={role.missing_requirements || []} empty="No missing requirements from JD." />
                </div>
              </div>
            </Card>
          )}

          {/* ATS */}
          {ats && (
            <Card>
              <CardHeader
                icon={DocumentChartBarIcon}
                title="ATS & resume health"
                description="Impact metrics, action-verb variety, section structure and readability."
                action={
                  <div className="flex items-center gap-2">
                    <Badge tone={toneForPercent(ats.ats_score)} mono>{ats.ats_score}% · {ats.health_label}</Badge>
                  </div>
                }
              />
              <div className="space-y-5 p-5">
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                  <MiniMetric label="Impact metrics" value={`${Math.round(ats.sub_scores?.impact_metrics || 0)}%`} hint={`${ats.metric_count} detected`} />
                  <MiniMetric label="Action verbs" value={`${Math.round(ats.sub_scores?.action_verbs || 0)}%`} hint={`${ats.action_verbs_count} unique`} />
                  <MiniMetric label="Sections" value={`${Math.round(ats.sub_scores?.structure_completeness || 0)}%`} hint="ATS standard" />
                  <MiniMetric label="Length & format" value={`${Math.round(ats.sub_scores?.formatting_health || 0)}%`} hint={`${ats.word_count} words`} />
                </div>
                <div className="grid gap-3 md:grid-cols-2">
                  <div className="rounded-lg border border-line bg-sunken/40 p-4">
                    <div className="mb-3 flex items-center justify-between">
                      <span className="text-xs font-semibold text-fg">Passed checks <span className="font-mono text-fg-subtle">({ats.passed_checks?.length || 0})</span></span>
                      <Badge tone="ok" mono>PASSED</Badge>
                    </div>
                    <BulletList items={ats.passed_checks || []} tone="ok" />
                  </div>
                  <div className="rounded-lg border border-line bg-sunken/40 p-4">
                    <div className="mb-3 flex items-center justify-between">
                      <span className="text-xs font-semibold text-fg">Recommendations <span className="font-mono text-fg-subtle">({ats.improvement_tips?.length || 0})</span></span>
                      <Badge tone="warn" mono>TIPS</Badge>
                    </div>
                    {ats.improvement_tips?.length > 0 ? (
                      <BulletList items={ats.improvement_tips} tone="warn" />
                    ) : (
                      <p className="text-xs italic text-fg-subtle">No major ATS optimisations needed. Excellent structure.</p>
                    )}
                  </div>
                </div>
                <Link to={`/editor/${resumeId}`} className={buttonClass('secondary', 'sm')} data-no-print>
                  Optimise in the live editor <ArrowRightIcon className="h-3.5 w-3.5" />
                </Link>
              </div>
            </Card>
          )}
        </div>

        {/* Right rail */}
        <div className="space-y-6">
          {/* Soft skills */}
          <Card>
            <CardHeader
              icon={UserGroupIcon}
              title="Self-reported skills"
              description="Interpersonal and domain capabilities. Never penalise the Reality Score."
            />
            <div className="p-5">
              <SkillChips items={softSkills} tone="neutral" empty="No self-reported soft skills were listed on the resume." />
            </div>
          </Card>

          {/* Invite */}
          <SendInvitationCard resumeId={resumeId} email={candidateEmail} scoreValue={score?.score} />

          <Link to="/upload" className={buttonClass('secondary', 'md', 'w-full')} data-no-print>
            Audit another resume
          </Link>
        </div>
      </div>
    </div>
  );
}

export default ResultsPage;
