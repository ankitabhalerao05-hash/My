"use client";

import React, { useState, useEffect } from "react";
import { useApp } from "../context/AppContext";
import { Milestone, CheckCircle, Clock, Save, Sparkles, AlertCircle, Compass, Award, Briefcase } from "lucide-react";

export default function RoadmapTab() {
    const { currentUser, updateCurrentUser } = useApp();

    // Default roadmap structures if not present in DB
    const defaultSteps = [
        {
            id: "step-1",
            title: "Phase 1: Basic Foundations & Architecture",
            status: "COMPLETED",
            learning: "Master modern ECMAScript specifications, OOP patterns, and data structures.",
            projects: "Build a multi-client real-time chat application.",
            certificates: "Interactive Javascript Certifications",
            internships: "Web design intern at local IT hub",
            jobs: "Junior Web Developer",
            expectedSalary: "₹4,00,000 - ₹6,00,000",
            timeline: "Weeks 1-8"
        },
        {
            id: "step-2",
            title: "Phase 2: Framework Core & Database Design",
            status: "IN_PROGRESS",
            learning: "Dynamic router frameworks, relational database querying, and JWT state management.",
            projects: "Develop a secure e-commerce dashboard system with transactions.",
            certificates: "Next.js & React Developer Certification",
            internships: "Full-stack developer trainee",
            jobs: "Associate software engineer",
            expectedSalary: "₹6,00,000 - ₹9,00,000",
            timeline: "Weeks 9-16"
        },
        {
            id: "step-3",
            title: "Phase 3: Deployment, Cloud & Scalability",
            status: "PLANNED",
            learning: "Docker containers, multi-stage pipelines, AWS deployments, and CDN setups.",
            projects: "Deploy load-balanced clusters to AWS with automated pipeline builds.",
            certificates: "AWS Certified Developer",
            internships: "DevOps specialist trainee",
            jobs: "Cloud/DevOps Engineer",
            expectedSalary: "₹9,00,000 - ₹14,00,000",
            timeline: "Weeks 17-24"
        }
    ];

    const [steps, setSteps] = useState(currentUser?.roadmapProgress?.steps || defaultSteps);
    const [title, setTitle] = useState(currentUser?.roadmapProgress?.title || "Custom AI Full Stack Roadmap");
    const [goal, setGoal] = useState(currentUser?.roadmapProgress?.goal || currentUser?.careerDetails?.dreamCareer || "Software Developer");
    const [expectedSalary, setExpectedSalary] = useState(currentUser?.roadmapProgress?.expectedSalary || "₹7,50,000 - ₹12,00,000");
    const [timeline, setTimeline] = useState(currentUser?.roadmapProgress?.timeline || "6 Months");

    // Dynamic roadmap generation based on user profile configurations
    const regenerateRoadmap = () => {
        const targetGoal = currentUser?.careerDetails?.dreamCareer || "Software Developer";
        const degree = currentUser?.education?.degree || "CS/B.Tech Graduate";
        
        // Setup new customized steps
        const regeneratedSteps = [
            {
                id: "step-1",
                title: `Phase 1: Basic foundations mapped to ${degree}`,
                status: "IN_PROGRESS",
                learning: `Master core programming paradigms, algorithms, and OOP concepts relevant to ${targetGoal}.`,
                projects: "Build a client sandbox application demonstrating basic CRUD operations.",
                certificates: "PathFinder Fundamental Proficiency Exam",
                internships: "Local enterprise tech internship program",
                jobs: "Junior Associate Developer",
                expectedSalary: "₹4,50,000 - ₹6,50,000",
                timeline: "Month 1-2"
            },
            {
                id: "step-2",
                title: "Phase 2: Backend Architecture & Database structures",
                status: "PLANNED",
                learning: "Study system scalability, indexing databases, server hosting, and API development.",
                projects: "Create an open source API catalog manager.",
                certificates: "Associate Software Architect License",
                internships: "Mid-tier backend developer assistant",
                jobs: "Software Engineer SDE-1",
                expectedSalary: "₹8,00,000 - ₹11,00,000",
                timeline: "Month 3-4"
            },
            {
                id: "step-3",
                title: "Phase 3: Systems engineering and Cloud deployments",
                status: "PLANNED",
                learning: "Deployments via container virtualization, CI/CD automated test runs, and cloud storage optimization.",
                projects: "Containerize static and dynamic components to live host under cluster environments.",
                certificates: "AWS Practitioner/Azure Engineer Credential",
                internships: "Systems analyst assistant",
                jobs: "Senior Software Engineer / DevOps Architect",
                expectedSalary: "₹12,00,000 - ₹18,00,000",
                timeline: "Month 5-6"
            }
        ];

        setSteps(regeneratedSteps);
        setGoal(targetGoal);
        setTitle(`Dynamic Roadmap: ${targetGoal}`);
        setExpectedSalary("₹6,00,000 - ₹15,00,000");
        setTimeline("6 Months");

        updateCurrentUser({
            roadmapProgress: {
                title: `Dynamic Roadmap: ${targetGoal}`,
                goal: targetGoal,
                expectedSalary: "₹6,00,000 - ₹15,00,000",
                timeline: "6 Months",
                steps: regeneratedSteps
            }
        });
    };

    // Toggle step completion status
    const toggleStepStatus = (stepId, currentStatus) => {
        const nextStatus = currentStatus === "COMPLETED" ? "IN_PROGRESS" : currentStatus === "IN_PROGRESS" ? "PLANNED" : "COMPLETED";
        
        const updatedSteps = steps.map(s => s.id === stepId ? { ...s, status: nextStatus } : s);
        setSteps(updatedSteps);

        // Auto Save to local context DB
        updateCurrentUser({
            roadmapProgress: {
                title,
                goal,
                expectedSalary,
                timeline,
                steps: updatedSteps
            }
        });

        // Add to Activity history
        const activity = currentUser?.activityHistory || [];
        const targetStep = steps.find(s => s.id === stepId);
        const newAct = {
            id: `act-${Date.now()}`,
            type: "Roadmap Step Updated",
            text: `Step '${targetStep ? targetStep.title : "Milestone"}' status set to ${nextStatus}`,
            date: new Date().toLocaleDateString()
        };
        updateCurrentUser({ activityHistory: [newAct, ...activity] });
    };

    // Calculate progress percentage
    const completedCount = steps.filter(s => s.status === "COMPLETED").length;
    const progressPercent = Math.round((completedCount / steps.length) * 100);

    return (
        <div className="flex flex-col gap-6 text-left">
            
            {/* Header roadmap dashboard */}
            <div className="glass-panel p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h3 className="text-xl font-bold text-white mb-1">Interactive Career Roadmap</h3>
                    <p className="text-xs text-slate-400">Customised steps compiled from profile skills, academic degrees, and dream goals.</p>
                </div>
                <button 
                    onClick={regenerateRoadmap} 
                    className="px-4 py-2 rounded-xl text-xs font-bold bg-violet-600 hover:bg-violet-700 text-white transition-all flex items-center gap-1.5"
                >
                    <Sparkles size={14} className="animate-pulse" /> Rebuild Roadmap
                </button>
            </div>

            {/* General Roadmap Stats card */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                
                {/* 1. Track Name */}
                <div className="glass-panel p-5">
                    <span className="text-[10px] text-slate-400 font-bold uppercase block">Roadmap Title</span>
                    <h4 className="font-extrabold text-white text-base mt-1.5">{title}</h4>
                </div>

                {/* 2. Target Goal */}
                <div className="glass-panel p-5">
                    <span className="text-[10px] text-slate-400 font-bold uppercase block">Dream Goal Career</span>
                    <h4 className="font-extrabold text-violet-400 text-base mt-1.5">{goal}</h4>
                </div>

                {/* 3. Expected Salary range */}
                <div className="glass-panel p-5">
                    <span className="text-[10px] text-slate-400 font-bold uppercase block">Expected Salary Package</span>
                    <h4 className="font-extrabold text-emerald-400 text-base mt-1.5">{expectedSalary}</h4>
                </div>

                {/* 4. Estimated Timeline */}
                <div className="glass-panel p-5">
                    <span className="text-[10px] text-slate-400 font-bold uppercase block">Timeline Duration</span>
                    <h4 className="font-extrabold text-amber-400 text-base mt-1.5">{timeline} ({progressPercent}% Completed)</h4>
                </div>

            </div>

            {/* Interactive Step Timeline */}
            <div className="flex flex-col gap-6">
                {steps.map((step, idx) => (
                    <div 
                        key={step.id} 
                        className={`glass-panel p-6 border-l-4 transition-all ${step.status === "COMPLETED" ? "border-l-emerald-500 bg-emerald-500/1" : step.status === "IN_PROGRESS" ? "border-l-violet-500 bg-violet-500/1" : "border-l-white/10"}`}
                    >
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4 pb-3 border-b border-white/5">
                            <div className="flex items-center gap-3">
                                <span className="w-8 h-8 rounded-full bg-slate-900 border border-white/10 flex items-center justify-center text-xs font-bold text-slate-300">{idx + 1}</span>
                                <div>
                                    <h4 className="font-bold text-white text-sm">{step.title}</h4>
                                    <span className="text-[10px] text-slate-500 block mt-0.5">Est. Duration: {step.timeline}</span>
                                </div>
                            </div>
                            
                            {/* Toggle checkbox */}
                            <button 
                                onClick={() => toggleStepStatus(step.id, step.status)}
                                className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all flex items-center gap-1.5 ${step.status === 'COMPLETED' ? 'bg-emerald-500/20 border-emerald-500/30 text-emerald-400' : step.status === 'IN_PROGRESS' ? 'bg-violet-500/20 border-violet-500/30 text-violet-400' : 'bg-white/5 border-white/5 text-slate-400 hover:bg-white/10'}`}
                            >
                                <CheckCircle size={12} />
                                {step.status}
                            </button>
                        </div>

                        {/* Node details */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-2 text-xs">
                            
                            {/* Learning */}
                            <div className="p-3.5 rounded-xl bg-white/5 border border-white/5 flex flex-col gap-1.5">
                                <span className="font-bold text-slate-400 uppercase tracking-wider text-[9px] flex items-center gap-1"><Compass size={11} /> 1. Syllabus & Concepts</span>
                                <p className="text-slate-300 leading-relaxed text-[11px]">{step.learning}</p>
                            </div>

                            {/* Projects */}
                            <div className="p-3.5 rounded-xl bg-white/5 border border-white/5 flex flex-col gap-1.5">
                                <span className="font-bold text-slate-400 uppercase tracking-wider text-[9px] flex items-center gap-1"><Compass size={11} /> 2. Recommended Project</span>
                                <p className="text-slate-300 leading-relaxed text-[11px]">{step.projects}</p>
                            </div>

                            {/* Certificates & Internships */}
                            <div className="p-3.5 rounded-xl bg-white/5 border border-white/5 flex flex-col gap-1.5">
                                <span className="font-bold text-slate-400 uppercase tracking-wider text-[9px] flex items-center gap-1"><Award size={11} /> 3. Certificates & Interns</span>
                                <p className="text-slate-300 leading-relaxed text-[11px]">Cert: <strong>{step.certificates}</strong><br />Intern: <strong>{step.internships}</strong></p>
                            </div>

                            {/* Target Jobs & Salaries */}
                            <div className="p-3.5 rounded-xl bg-white/5 border border-white/5 flex flex-col gap-1.5">
                                <span className="font-bold text-slate-400 uppercase tracking-wider text-[9px] flex items-center gap-1"><Briefcase size={11} /> 4. Expected Job role</span>
                                <p className="text-slate-300 leading-relaxed text-[11px]">Job: <strong>{step.jobs}</strong><br />Salary: <strong className="text-emerald-400">{step.expectedSalary}</strong></p>
                            </div>

                        </div>

                    </div>
                ))}
            </div>

        </div>
    );
}
