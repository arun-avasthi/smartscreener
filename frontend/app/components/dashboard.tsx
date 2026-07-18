"use client";

import React, { useState, useEffect } from "react";
import { Sparkles, Activity, Layers, Trash2, ShieldCheck, Cpu } from "lucide-react";
import { API_BASE } from "../config";
import JobInput from "./job-input";
import UploadZone from "./upload-zone";
import Leaderboard from "./leaderboard";
import CandidateDetail from "./candidate-detail";
import ComparisonMatrix from "./comparison-matrix";

interface Job {
  id: number;
  title: string;
  description: string;
  requirements: string[];
  created_at: string;
}

interface Candidate {
  id: number;
  job_id: number;
  name: string;
  email: string | null;
  phone: string | null;
  skills: string[];
  experience: {
    years: number;
    roles: string[];
    companies: string[];
  };
  education: string | null;
  summary: string | null;
  score: number;
  technical_score: number;
  experience_score: number;
  education_score: number;
  resume_text: string | null;
  created_at: string;
}

export default function Dashboard() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [activeJob, setActiveJob] = useState<Job | null>(null);
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [activeCandidate, setActiveCandidate] = useState<Candidate | null>(null);
  const [comparingIds, setComparingIds] = useState<number[] | null>(null);
  const [healthStatus, setHealthStatus] = useState<{
    status: string;
    ollama_status: string;
    message: string;
  } | null>(null);

  // 1. Fetch jobs list and health status on startup
  useEffect(() => {
    fetchJobs();
    checkHealth();
  }, []);

  // 2. Fetch candidates whenever active job changes
  useEffect(() => {
    if (activeJob) {
      fetchCandidates(activeJob.id);
    } else {
      setCandidates([]);
    }
  }, [activeJob]);

  const checkHealth = async () => {
    try {
      const response = await fetch(`${API_BASE}/api/health`);
      if (response.ok) {
        const data = await response.json();
        setHealthStatus(data);
      }
    } catch (e) {
      console.warn("Backend server not reachable yet.");
    }
  };

  const fetchJobs = async () => {
    try {
      const response = await fetch(`${API_BASE}/api/jobs`);
      if (response.ok) {
        const data = await response.json();
        setJobs(data);
        if (data.length > 0 && !activeJob) {
          // Auto select first job as active
          setActiveJob(data[0]);
        }
      }
    } catch (err) {
      console.error("Failed to load jobs list", err);
    }
  };

  const fetchCandidates = async (jobId: number) => {
    try {
      const response = await fetch(`${API_BASE}/api/jobs/${jobId}/candidates`);
      if (response.ok) {
        const data = await response.json();
        setCandidates(data);
      }
    } catch (err) {
      console.error("Failed to fetch candidates", err);
    }
  };

  const handleJobCreated = (newJob: Job) => {
    setJobs((prev) => [newJob, ...prev]);
    setActiveJob(newJob);
  };

  const handleCandidatesProcessed = (newCandidates: Candidate[]) => {
    if (activeJob) {
      // Refresh candidates list from DB to get updated rankings
      fetchCandidates(activeJob.id);
    }
  };

  const handleDeleteJob = async (jobId: number, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm("Are you sure you want to delete this screening pipeline? All candidates will be deleted.")) return;

    try {
      const response = await fetch(`${API_BASE}/api/jobs/${jobId}`, {
        method: "DELETE",
      });
      if (response.ok) {
        setJobs((prev) => prev.filter((job) => job.id !== jobId));
        if (activeJob?.id === jobId) {
          setActiveJob(null);
        }
      }
    } catch (err) {
      alert("Failed to delete pipeline.");
    }
  };

  return (
    <div className="min-h-screen bg-zinc-50/50 pb-16 dark:bg-black font-sans">
      
      {/* Premium Header */}
      <header className="sticky top-0 z-40 border-b border-zinc-150 bg-white/80 backdrop-blur-md dark:border-zinc-900 dark:bg-zinc-950/80">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          
          {/* Logo Brand */}
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-md shadow-indigo-500/20 dark:bg-indigo-500">
              <Sparkles className="h-5 w-5" />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-black tracking-tight text-zinc-900 dark:text-white uppercase">
                SmartScreener
              </span>
              <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider">
                AI Talent Screening Platform
              </span>
            </div>
          </div>

          {/* Action Row */}
          <div className="flex items-center gap-4">
            
            {/* Health / Ollama Status Pill */}
            {healthStatus && (
              <div className={`flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold ${
                healthStatus.ollama_status === "connected"
                  ? "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/20 dark:text-emerald-400 dark:border-emerald-900"
                  : "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/20 dark:text-amber-400 dark:border-amber-900"
              }`}>
                {healthStatus.ollama_status === "connected" ? (
                  <>
                    <Cpu className="h-3.5 w-3.5" />
                    Ollama LLM Engine
                  </>
                ) : (
                  <>
                    <Activity className="h-3.5 w-3.5" />
                    NLP Fallback Engine
                  </>
                )}
              </div>
            )}

            {/* Pipeline Dropdown selector */}
            {jobs.length > 0 && (
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-bold text-zinc-400 uppercase">
                  Active Pipeline:
                </span>
                <select
                  value={activeJob?.id || ""}
                  onChange={(e) => {
                    const job = jobs.find((j) => j.id === Number(e.target.value));
                    if (job) setActiveJob(job);
                  }}
                  className="rounded-xl border border-zinc-200 bg-white py-1.8 px-3.5 text-xs font-semibold text-zinc-700 outline-none focus:border-indigo-500 dark:border-zinc-850 dark:bg-zinc-900 dark:text-zinc-300"
                >
                  {jobs.map((job) => (
                    <option key={job.id} value={job.id}>
                      {job.title}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Workspace Dashboard Container */}
      <main className="mx-auto max-w-7xl px-6 pt-8">
        
        {/* Core Layout Grid */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
          
          {/* Left specification / upload controls panel */}
          <div className="space-y-8 lg:col-span-4">
            <JobInput onJobCreated={handleJobCreated} activeJob={activeJob} />
            <UploadZone
              activeJobId={activeJob ? activeJob.id : null}
              onCandidatesProcessed={handleCandidatesProcessed}
            />

            {/* Screening pipelines history drawer */}
            {jobs.length > 0 && (
              <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
                <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400 mb-3.5 flex items-center gap-1.5">
                  <Layers className="h-4 w-4 text-indigo-500" />
                  Existing Pipelines ({jobs.length})
                </h3>
                <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1">
                  {jobs.map((job) => (
                    <div
                      key={job.id}
                      onClick={() => setActiveJob(job)}
                      className={`group flex items-center justify-between rounded-xl border p-3 cursor-pointer transition ${
                        activeJob?.id === job.id
                          ? "border-indigo-500 bg-indigo-50/10 dark:border-indigo-500 dark:bg-indigo-950/10"
                          : "border-zinc-100 hover:border-zinc-300 dark:border-zinc-900 dark:hover:border-zinc-800"
                      }`}
                    >
                      <div className="min-w-0 pr-2">
                        <p className={`text-xs font-semibold truncate ${
                          activeJob?.id === job.id ? "text-indigo-600 dark:text-indigo-400" : "text-zinc-800 dark:text-zinc-200"
                        }`}>
                          {job.title}
                        </p>
                        <p className="text-[10px] text-zinc-400 mt-0.5">
                          {new Date(job.created_at).toLocaleDateString()}
                        </p>
                      </div>
                      <button
                        onClick={(e) => handleDeleteJob(job.id, e)}
                        className="opacity-0 group-hover:opacity-100 transition rounded-lg p-1.5 text-zinc-400 hover:bg-zinc-100 hover:text-rose-500 dark:hover:bg-zinc-900"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right leaderboard report listing */}
          <div className="lg:col-span-8">
            <Leaderboard
              candidates={candidates}
              onSelectCandidate={setActiveCandidate}
              onCompareCandidates={setComparingIds}
            />
          </div>
        </div>
      </main>

      {/* Floating Candidate details report drawer */}
      <CandidateDetail
        candidate={activeCandidate}
        onClose={() => setActiveCandidate(null)}
      />

      {/* Floating Side-by-side comparison matrix modal */}
      {comparingIds && activeJob && (
        <ComparisonMatrix
          jobId={activeJob.id}
          candidateIds={comparingIds}
          onClose={() => setComparingIds(null)}
        />
      )}
    </div>
  );
}
