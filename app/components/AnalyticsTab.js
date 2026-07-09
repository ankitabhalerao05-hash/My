"use client";

import React, { useState } from "react";
import { useApp } from "../context/AppContext";
import {
    BarChart2, Award, FileText, Milestone, Bookmark, Clock, ShieldCheck,
    TrendingUp, Activity, Bell, CheckCircle, ChevronRight, AlertCircle,
    BookOpen, Terminal, Sparkles, ExternalLink, Calendar
} from "lucide-react";
import {
    ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
    RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar
} from "recharts";

export default function AnalyticsTab() {
    const { currentUser, updateCurrentUser, affiliates, jobs } = useApp();
    const [notifDropdownOpen, setNotifDropdownOpen] = useState(false);

    // Default Fallbacks
    const resumes = currentUser?.resumes || [];
    const resumeHistory = currentUser?.resumeHistory || [];
    const skills = currentUser?.skills || [
        { id: "sk-1", name: "JavaScript", category: "Programming" },
        { id: "sk-2", name: "React & Next.js", category: "Frameworks" },
        { id: "sk-3", name: "SQL & Databases", category: "Database" }
    ];
    const activityHistory = currentUser?.activityHistory || [
        { id: "act-1", type: "Account Created", text: "Registered at PathFinder", date: currentUser?.createdAt || new Date().toLocaleDateString() }
    ];
    const notifications = currentUser?.notifications || [
        { id: "nt-1", type: "Roadmap Reminder", text: "Phase 2 node is awaiting review.", date: "Today", read: false },
        { id: "nt-2", type: "AI Suggestion", text: "AWS Cert path aligns with your DevOps goal.", date: "Yesterday", read: true }
    ];

    const roadmapSteps = currentUser?.roadmapProgress?.steps || [
        { id: "step-1", title: "Frontend Foundations", status: "COMPLETED" },
        { id: "step-2", title: "Backend Systems", status: "IN_PROGRESS" },
        { id: "step-3", title: "DevOps & Deploy", status: "PLANNED" }
    ];

    const savedResources = currentUser?.savedResources || [];

    // 1. Profile Completion calculation
    let completionScore = 20; // 20% for name/email presence
    if (currentUser?.profilePic) completionScore += 10;
    if (currentUser?.personalInfo?.bio) completionScore += 15;
    if (currentUser?.education?.degree) completionScore += 20;
    if (currentUser?.socials?.linkedin || currentUser?.socials?.github) completionScore += 15;
    if (currentUser?.professionalSummary) completionScore += 10;
    if (currentUser?.interests?.length > 0 || currentUser?.languages?.length > 0) completionScore += 10;

    // 2. Highest ATS Score
    const highestATS = resumes.length > 0 ? Math.max(...resumes.map(r => r.score)) : 0;

    // 3. Roadmap completion
    const completedRoadmapSteps = roadmapSteps.filter(s => s.status === "COMPLETED").length;
    const roadmapCompletionPercent = Math.round((completedRoadmapSteps / roadmapSteps.length) * 100) || 0;

    // 4. Certificates count
    const certsCount = roadmapSteps.filter(s => s.status === "COMPLETED" && s.certificates).length + (currentUser?.badges ? JSON.parse(currentUser.badges).length : 0);

    // 5. Portfolio Strength
    let portfolioStrength = 15;
    if (currentUser?.socials?.github) portfolioStrength += 30;
    if (currentUser?.socials?.linkedin) portfolioStrength += 25;
    if (currentUser?.socials?.portfolio) portfolioStrength += 30;

    // 6. Learning hours (mock/tracked)
    const learningHours = currentUser?.learningHours || 34;

    // 7. Career Score calculation
    const careerScore = Math.round((highestATS * 0.4) + (skills.length * 5) + (completionScore * 0.3) + (portfolioStrength * 0.1)) || 45;

    // Mock Chart Datasets
    const learningTrendData = [
        { week: "Wk 1", Hours: 4 },
        { week: "Wk 2", Hours: 8 },
        { week: "Wk 3", Hours: 12 },
        { week: "Wk 4", Hours: 15 },
        { week: "Wk 5", Hours: 23 },
        { week: "Wk 6", Hours: learningHours }
    ];

    const radarSkillData = skills.slice(0, 6).map((sk, idx) => ({
        subject: sk.name,
        A: 60 + (idx * 8) % 40,
        fullMark: 100
    }));

    // AI Suggestions Generator based on Goal & Missing Gaps
    const dreamCareer = currentUser?.careerDetails?.dreamCareer || "Software Developer";
    const recommendedCourses = affiliates.slice(0, 3);
    const recommendedJobsList = jobs.slice(0, 2);

    const markAllNotificationsRead = () => {
        const updated = notifications.map(n => ({ ...n, read: true }));
        updateCurrentUser({ notifications: updated });
    };

    return (
        <div className="flex flex-col gap-6 text-left">
            
            {/* Notification and Header Row */}
            <div className="glass-panel p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h3 className="text-xl font-bold text-white mb-1">Dashboard Insights</h3>
                    <p className="text-xs text-slate-400">Welcome back, {currentUser?.name}. Real-time analytics mapped to your career records.</p>
                </div>
                
                {/* Notification Dropdown Component */}
                <div className="relative">
                    <button 
                        onClick={() => setNotifDropdownOpen(!notifDropdownOpen)}
                        className="relative p-2.5 rounded-xl border border-white/5 bg-white/5 hover:bg-white/10 text-slate-300 transition-all flex items-center gap-2"
                    >
                        <Bell size={18} />
                        {notifications.some(n => !n.read) && (
                            <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-violet-500 rounded-full animate-ping" />
                        )}
                        <span className="text-xs font-semibold">Alerts ({notifications.filter(n => !n.read).length})</span>
                    </button>

                    {notifDropdownOpen && (
                        <div className="absolute right-0 mt-2 w-80 glass-panel border-violet-500/20 bg-slate-950 p-4 shadow-2xl rounded-2xl z-50 animate-fadeIn">
                            <div className="flex justify-between items-center mb-3 pb-2 border-b border-white/5">
                                <span className="text-xs font-bold text-white">Alerts & Reminders</span>
                                <button onClick={markAllNotificationsRead} className="text-[10px] text-violet-400 hover:underline">Mark all read</button>
                            </div>
                            <div className="flex flex-col gap-2 max-h-60 overflow-y-auto pr-1">
                                {notifications.map((nt) => (
                                    <div key={nt.id} className={`p-2.5 rounded-xl border transition-all text-left ${nt.read ? "bg-white/1 border-white/5" : "bg-violet-600/10 border-violet-500/20"}`}>
                                        <div className="flex justify-between items-center mb-1">
                                            <span className="text-[10px] font-bold text-violet-300 uppercase tracking-wide">{nt.type}</span>
                                            <span className="text-[9px] text-slate-500">{nt.date}</span>
                                        </div>
                                        <p className="text-xs text-slate-300 leading-snug">{nt.text}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Core Analytics Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                
                {/* 1. Career Score */}
                <div className="glass-panel p-5 flex flex-col justify-between border-l-4 border-l-violet-500">
                    <div className="flex justify-between items-start">
                        <div>
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Career readiness Score</span>
                            <h4 className="text-3xl font-extrabold text-white mt-1">{careerScore}/100</h4>
                        </div>
                        <div className="w-8 h-8 rounded-lg bg-violet-500/10 flex items-center justify-center text-violet-400">
                            <ShieldCheck size={18} />
                        </div>
                    </div>
                    <span className="text-[10px] text-slate-500 mt-4 block">Calculated from profile, skills, and ATS audit metrics</span>
                </div>

                {/* 2. Profile Completion */}
                <div className="glass-panel p-5 flex flex-col justify-between border-l-4 border-l-cyan-500">
                    <div className="flex justify-between items-start">
                        <div>
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Profile completeness</span>
                            <h4 className="text-3xl font-extrabold text-white mt-1">{completionScore}%</h4>
                        </div>
                        <div className="w-8 h-8 rounded-lg bg-cyan-500/10 flex items-center justify-center text-cyan-400">
                            <Clock size={18} />
                        </div>
                    </div>
                    {/* Progress indicator */}
                    <div className="w-full bg-white/5 rounded-full h-1.5 mt-4">
                        <div className="bg-cyan-500 h-1.5 rounded-full transition-all duration-500" style={{ width: `${completionScore}%` }} />
                    </div>
                </div>

                {/* 3. Highest ATS Score */}
                <div className="glass-panel p-5 flex flex-col justify-between border-l-4 border-l-emerald-500">
                    <div className="flex justify-between items-start">
                        <div>
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Highest ATS Score</span>
                            <h4 className="text-3xl font-extrabold text-white mt-1">{highestATS > 0 ? `${highestATS}%` : "No Scan"}</h4>
                        </div>
                        <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-400">
                            <FileText size={18} />
                        </div>
                    </div>
                    <span className="text-[10px] text-slate-500 mt-4 block">{resumes.length} active resume versions in Vault</span>
                </div>

                {/* 4. Roadmap Completion */}
                <div className="glass-panel p-5 flex flex-col justify-between border-l-4 border-l-amber-500">
                    <div className="flex justify-between items-start">
                        <div>
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Roadmap Progress</span>
                            <h4 className="text-3xl font-extrabold text-white mt-1">{roadmapCompletionPercent}%</h4>
                        </div>
                        <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center text-amber-400">
                            <Milestone size={18} />
                        </div>
                    </div>
                    {/* Progress indicator */}
                    <div className="w-full bg-white/5 rounded-full h-1.5 mt-4">
                        <div className="bg-amber-500 h-1.5 rounded-full transition-all duration-500" style={{ width: `${roadmapCompletionPercent}%` }} />
                    </div>
                </div>
            </div>

            {/* Sub-analytics details */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <div className="glass-panel p-4 flex items-center gap-4 text-left">
                    <div className="w-10 h-10 rounded-xl bg-violet-600/10 border border-violet-500/20 flex items-center justify-center text-violet-400"><Award size={20} /></div>
                    <div>
                        <span className="text-[10px] text-slate-400 uppercase font-semibold">Active skills tags</span>
                        <h5 className="font-bold text-white mt-0.5">{skills.length} Categories</h5>
                    </div>
                </div>
                <div className="glass-panel p-4 flex items-center gap-4 text-left">
                    <div className="w-10 h-10 rounded-xl bg-pink-600/10 border border-pink-500/20 flex items-center justify-center text-pink-400"><Clock size={20} /></div>
                    <div>
                        <span className="text-[10px] text-slate-400 uppercase font-semibold">Active Learning hours</span>
                        <h5 className="font-bold text-white mt-0.5">{learningHours} Hours logged</h5>
                    </div>
                </div>
                <div className="glass-panel p-4 flex items-center gap-4 text-left">
                    <div className="w-10 h-10 rounded-xl bg-emerald-600/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400"><Bookmark size={20} /></div>
                    <div>
                        <span className="text-[10px] text-slate-400 uppercase font-semibold">Saved bookmarks</span>
                        <h5 className="font-bold text-white mt-0.5">{savedResources.length} Items</h5>
                    </div>
                </div>
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Learning Hours trend */}
                <div className="glass-panel p-6">
                    <h4 className="font-bold text-white mb-4 text-sm flex items-center gap-2">
                        <TrendingUp size={16} className="text-violet-400" /> Learning hours accumulation
                    </h4>
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={learningTrendData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="hoursGrad" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3}/>
                                        <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                                <XAxis dataKey="week" stroke="#64748b" fontSize={10} />
                                <YAxis stroke="#64748b" fontSize={10} />
                                <Tooltip contentStyle={{ backgroundColor: "#1e1b4b", borderColor: "#4c1d95", borderRadius: "10px", color: "white" }} />
                                <Area type="monotone" dataKey="Hours" stroke="#8b5cf6" fillOpacity={1} fill="url(#hoursGrad)" strokeWidth={2} />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Radar Skill Map */}
                <div className="glass-panel p-6">
                    <h4 className="font-bold text-white mb-4 text-sm flex items-center gap-2">
                        <Activity size={16} className="text-cyan-400" /> Competency distribution profile
                    </h4>
                    <div className="h-64 flex items-center justify-center">
                        {skills.length > 0 ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <RadarChart cx="50%" cy="50%" r="70%" data={radarSkillData}>
                                    <PolarGrid stroke="rgba(255,255,255,0.05)" />
                                    <PolarAngleAxis dataKey="subject" stroke="#94a3b8" fontSize={9} />
                                    <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="#475569" fontSize={8} />
                                    <Radar name={currentUser?.name} dataKey="A" stroke="#06b6d4" fill="#06b6d4" fillOpacity={0.2} />
                                </RadarChart>
                            </ResponsiveContainer>
                        ) : (
                            <span className="text-xs text-slate-500">Configure your Skills manager to map competency radar maps</span>
                        )}
                    </div>
                </div>
            </div>

            {/* AI Personalised Recommendations widget */}
            <div className="glass-panel p-6">
                <h4 className="font-bold text-white mb-4 flex items-center gap-2 text-sm">
                    <Sparkles size={16} className="text-violet-400 animate-pulse" /> Personalized AI Career recommendations
                </h4>
                <p className="text-xs text-slate-400 mb-4 leading-relaxed">
                    Based on your target goal of <strong className="text-violet-300">{dreamCareer}</strong>, active skills tags, and interactive roadmap milestones, PathFinder AI recommends the following tracks:
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Courses and credentials recommendations */}
                    <div className="p-4 rounded-xl bg-white/5 border border-white/5 flex flex-col gap-3">
                        <span className="text-xs font-bold text-slate-300 block border-b border-white/5 pb-1">📚 Recommended Courses & Credentials</span>
                        {recommendedCourses.map(course => (
                            <div key={course.id} className="flex justify-between items-center text-xs">
                                <div>
                                    <span className="font-bold text-white block">{course.title}</span>
                                    <span className="text-[10px] text-slate-400">By {course.provider} • {course.duration}</span>
                                </div>
                                <a href={course.affiliateUrl} target="_blank" rel="noopener noreferrer" className="p-1 text-violet-400 hover:text-violet-300">
                                    <ExternalLink size={14} />
                                </a>
                            </div>
                        ))}
                    </div>

                    {/* Jobs and Projects suggestions */}
                    <div className="p-4 rounded-xl bg-white/5 border border-white/5 flex flex-col gap-3">
                        <span className="text-xs font-bold text-slate-300 block border-b border-white/5 pb-1">💼 Target Openings & Projects</span>
                        {recommendedJobsList.map(job => (
                            <div key={job.id} className="flex justify-between items-center text-xs">
                                <div>
                                    <span className="font-bold text-white block">{job.title}</span>
                                    <span className="text-[10px] text-slate-400">{job.companyName} • {job.location}</span>
                                </div>
                                <a href={job.applicationUrl} target="_blank" rel="noopener noreferrer" className="p-1 text-violet-400 hover:text-violet-300">
                                    <ExternalLink size={14} />
                                </a>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div className="p-3 rounded-lg bg-white/1 border border-white/5 text-xs text-left">
                        <span className="font-semibold text-slate-300 block mb-1">📖 Recommended Books</span>
                        <p className="text-[11px] text-slate-400">Designing Data-Intensive Applications by Martin Kleppmann.</p>
                    </div>
                    <div className="p-3 rounded-lg bg-white/1 border border-white/5 text-xs text-left">
                        <span className="font-semibold text-slate-300 block mb-1">🚀 Practice Platforms</span>
                        <p className="text-[11px] text-slate-400">Solve daily challenges on LeetCode and HackerRank SQL tracks.</p>
                    </div>
                    <div className="p-3 rounded-lg bg-white/1 border border-white/5 text-xs text-left">
                        <span className="font-semibold text-slate-300 block mb-1">🌟 Internship Pathways</span>
                        <p className="text-[11px] text-slate-400">Google Summer of Code (GSoC) & Microsoft Learn paths.</p>
                    </div>
                </div>
            </div>

            {/* Timeline Row (Activity History) */}
            <div className="glass-panel p-6">
                <h4 className="font-bold text-white mb-4 text-sm flex items-center gap-2">
                    <Activity size={16} className="text-rose-400" /> User Activity History
                </h4>
                <div className="relative pl-6 border-l border-white/10 flex flex-col gap-5 text-xs">
                    {activityHistory.slice(0, 5).map((act) => (
                        <div key={act.id} className="relative text-left">
                            <span className="absolute -left-[30px] top-0.5 w-3 h-3 rounded-full bg-violet-500 border border-slate-900" />
                            <div className="flex justify-between items-center">
                                <span className="font-bold text-slate-200">{act.type}</span>
                                <span className="text-[9px] text-slate-500">{act.date}</span>
                            </div>
                            <p className="text-slate-400 mt-1">{act.text}</p>
                        </div>
                    ))}
                </div>
            </div>

        </div>
    );
}
