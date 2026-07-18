"use client";

import React, { useState, useMemo } from "react";
import { Search, SlidersHorizontal, ArrowUpDown, ShieldCheck, Mail, Phone, Layers, Scale } from "lucide-react";

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

interface LeaderboardProps {
  candidates: Candidate[];
  onSelectCandidate: (candidate: Candidate) => void;
  onCompareCandidates: (selectedIds: number[]) => void;
}

export default function Leaderboard({ candidates, onSelectCandidate, onCompareCandidates }: LeaderboardProps) {
  const [search, setSearch] = useState("");
  const [skillFilter, setSkillFilter] = useState("");
  const [sortBy, setSortBy] = useState<"score" | "experience">("score");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [selectedIds, setSelectedIds] = useState<number[]>([]);

  // Toggle candidate selection for comparison
  const handleSelectCompare = (id: number) => {
    setSelectedIds((prev) => {
      if (prev.includes(id)) {
        return prev.filter((item) => item !== id);
      } else {
        if (prev.length >= 3) {
          alert("You can compare a maximum of 3 candidates at a time.");
          return prev;
        }
        return [...prev, id];
      }
    });
  };

  const handleSortToggle = (field: "score" | "experience") => {
    if (sortBy === field) {
      setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortBy(field);
      setSortOrder("desc");
    }
  };

  // Get all unique skills for filter suggestion
  const allSkills = useMemo(() => {
    const set = new Set<string>();
    candidates.forEach((c) => c.skills.forEach((s) => set.add(s)));
    return Array.from(set);
  }, [candidates]);

  // Filtered and Sorted Candidates
  const processedCandidates = useMemo(() => {
    return candidates
      .filter((c) => {
        const matchesSearch = c.name.toLowerCase().includes(search.toLowerCase()) || 
                              (c.email && c.email.toLowerCase().includes(search.toLowerCase()));
        const matchesSkill = !skillFilter || c.skills.some((s) => s.toLowerCase() === skillFilter.toLowerCase());
        return matchesSearch && matchesSkill;
      })
      .sort((a, b) => {
        let valA = sortBy === "score" ? a.score : a.experience.years;
        let valB = sortBy === "score" ? b.score : b.experience.years;
        return sortOrder === "desc" ? valB - valA : valA - valB;
      });
  }, [candidates, search, skillFilter, sortBy, sortOrder]);

  const getScoreColor = (score: number) => {
    if (score >= 80) return "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/30 dark:text-emerald-400 dark:border-emerald-900";
    if (score >= 50) return "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/30 dark:text-amber-400 dark:border-amber-900";
    return "bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/30 dark:text-rose-400 dark:border-rose-900";
  };

  return (
    <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
      
      {/* Top Filter Controls */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50 flex items-center gap-2">
          <ShieldCheck className="h-5 w-5 text-indigo-500" />
          Ranking Leaderboard ({processedCandidates.length})
        </h2>
        
        <div className="flex flex-wrap items-center gap-2.5">
          {selectedIds.length >= 2 && (
            <button
              onClick={() => onCompareCandidates(selectedIds)}
              className="flex items-center gap-1.5 rounded-xl bg-indigo-600 px-4 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-indigo-500 active:scale-95 dark:bg-indigo-500 dark:hover:bg-indigo-400"
            >
              <Scale className="h-3.5 w-3.5" />
              Compare ({selectedIds.length})
            </button>
          )}
          
          <div className="relative">
            <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-zinc-400" />
            <input
              type="text"
              placeholder="Search by name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-48 rounded-xl border border-zinc-200 bg-zinc-50/50 py-1.8 pr-3.5 pl-9 text-xs outline-none transition focus:border-indigo-500 focus:bg-white dark:border-zinc-800 dark:bg-zinc-900/50 dark:focus:border-indigo-500 dark:focus:bg-zinc-900"
            />
          </div>

          <div className="relative">
            <SlidersHorizontal className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-zinc-400" />
            <select
              value={skillFilter}
              onChange={(e) => setSkillFilter(e.target.value)}
              className="w-40 appearance-none rounded-xl border border-zinc-200 bg-zinc-50/50 py-1.8 pr-8 pl-9 text-xs outline-none transition focus:border-indigo-500 focus:bg-white dark:border-zinc-800 dark:bg-zinc-900/50 dark:focus:border-indigo-500"
            >
              <option value="">All Skills</option>
              {allSkills.map((skill, idx) => (
                <option key={idx} value={skill}>{skill}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Leaderboard Table Grid */}
      {processedCandidates.length === 0 ? (
        <div className="flex flex-col items-center justify-center border border-dashed border-zinc-200 rounded-xl py-16 dark:border-zinc-800">
          <Layers className="h-10 w-10 text-zinc-300 dark:text-zinc-700 mb-2" />
          <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">No candidates analyzed yet</p>
          <p className="text-xs text-zinc-400 mt-1">Upload resumes to evaluate candidates for this pipeline.</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-zinc-100 dark:border-zinc-800 text-[10px] font-bold uppercase tracking-wider text-zinc-400">
                <th className="py-3 px-2 w-8">Compare</th>
                <th className="py-3 px-3">Candidate Details</th>
                <th className="py-3 px-3">
                  <button onClick={() => handleSortToggle("score")} className="flex items-center gap-1 hover:text-zinc-700 dark:hover:text-zinc-200">
                    Match Score
                    <ArrowUpDown className="h-3 w-3" />
                  </button>
                </th>
                <th className="py-3 px-3">
                  <button onClick={() => handleSortToggle("experience")} className="flex items-center gap-1 hover:text-zinc-700 dark:hover:text-zinc-200">
                    Experience
                    <ArrowUpDown className="h-3 w-3" />
                  </button>
                </th>
                <th className="py-3 px-3">Top Extracted Skills</th>
                <th className="py-3 px-2 text-right">Profile</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 dark:divide-zinc-850">
              {processedCandidates.map((cand, idx) => (
                <tr
                  key={cand.id}
                  className="group hover:bg-zinc-50/50 transition dark:hover:bg-zinc-900/30"
                >
                  {/* Checkbox */}
                  <td className="py-4 px-2">
                    <input
                      type="checkbox"
                      checked={selectedIds.includes(cand.id)}
                      onChange={() => handleSelectCompare(cand.id)}
                      className="h-4 w-4 rounded-md border-zinc-350 text-indigo-600 focus:ring-indigo-500 dark:border-zinc-700"
                    />
                  </td>

                  {/* Name and Contact info */}
                  <td className="py-4 px-3">
                    <div className="flex flex-col">
                      <span className="font-semibold text-zinc-900 dark:text-zinc-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition">
                        {cand.name}
                      </span>
                      <div className="mt-1 flex items-center gap-3 text-xs text-zinc-400">
                        {cand.email && (
                          <span className="flex items-center gap-1">
                            <Mail className="h-3.2 w-3.2" />
                            {cand.email}
                          </span>
                        )}
                        {cand.phone && (
                          <span className="flex items-center gap-1">
                            <Phone className="h-3.2 w-3.2" />
                            {cand.phone}
                          </span>
                        )}
                      </div>
                    </div>
                  </td>

                  {/* Score badge */}
                  <td className="py-4 px-3">
                    <div className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold ${getScoreColor(cand.score)}`}>
                      {cand.score}% Match
                    </div>
                  </td>

                  {/* Experience */}
                  <td className="py-4 px-3">
                    <div className="flex flex-col text-xs">
                      <span className="font-semibold text-zinc-800 dark:text-zinc-200">
                        {cand.experience.years} Years
                      </span>
                      <span className="text-[10px] text-zinc-400 line-clamp-1 max-w-[120px]">
                        {cand.experience.roles.join(", ") || "No role listed"}
                      </span>
                    </div>
                  </td>

                  {/* Skills tags list */}
                  <td className="py-4 px-3">
                    <div className="flex flex-wrap gap-1 max-w-[280px]">
                      {cand.skills.slice(0, 4).map((skill, sIdx) => (
                        <span
                          key={sIdx}
                          onClick={() => setSkillFilter(skillFilter === skill ? "" : skill)}
                          className={`rounded-md px-2 py-0.5 text-[10px] font-semibold transition cursor-pointer ${
                            skillFilter === skill
                              ? "bg-indigo-600 text-white dark:bg-indigo-500"
                              : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200 dark:bg-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800"
                          }`}
                        >
                          {skill}
                        </span>
                      ))}
                      {cand.skills.length > 4 && (
                        <span className="text-[9px] text-zinc-400 font-medium pt-0.5">
                          +{cand.skills.length - 4} more
                        </span>
                      )}
                    </div>
                  </td>

                  {/* Profile inspect action */}
                  <td className="py-4 px-2 text-right">
                    <button
                      onClick={() => onSelectCandidate(cand)}
                      className="rounded-lg border border-zinc-200 px-3 py-1.5 text-xs font-semibold text-zinc-700 hover:bg-zinc-50 dark:border-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-900"
                    >
                      View Report
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
