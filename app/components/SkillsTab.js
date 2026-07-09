"use client";

import React, { useState, useEffect } from "react";
import { useApp } from "../context/AppContext";
import { Award, Plus, Trash2, Edit, Save, ArrowRight, BookOpen, Terminal, Sparkles } from "lucide-react";

export default function SkillsTab() {
    const { currentUser, updateCurrentUser } = useApp();

    // Default initialized skills if not in context
    const initialSkills = currentUser?.skills || [
        { id: "sk-1", name: "JavaScript", category: "Programming" },
        { id: "sk-2", name: "React & Next.js", category: "Frameworks" },
        { id: "sk-3", name: "PostgreSQL", category: "Database" }
    ];

    const initialProgress = currentUser?.skillProgress || {
        "sk-1": { level: "Expert", progress: 90, status: "In Progress", recommendedProjects: ["Build a SaaS Dashboard", "Create Chrome Extension"], recommendedCourses: ["JS Core Patterns"], aiRec: "Add deep concurrency and performance benchmarks to your projects." },
        "sk-2": { level: "Intermediate", progress: 75, status: "In Progress", recommendedProjects: ["Portfolio with Next.js SSR", "State manager toolkit"], recommendedCourses: ["NextJS Router Mastery"], aiRec: "Learn server actions and dynamic routing configurations." },
        "sk-3": { level: "Beginner", progress: 40, status: "Planned", recommendedProjects: ["Design banking schema"], recommendedCourses: ["SQL Bootcamps"], aiRec: "Learn normalization practices and connection pooling." }
    };

    const [skillsList, setSkillsList] = useState(initialSkills);
    const [progressMap, setProgressMap] = useState(initialProgress);
    const [selectedSkillId, setSelectedSkillId] = useState(null);

    // Form inputs for adding skills
    const [newName, setNewName] = useState("");
    const [newCategory, setNewCategory] = useState("Programming");
    const [newLevel, setNewLevel] = useState("Beginner");
    const [newProgressVal, setNewProgressVal] = useState(30);
    const [newStatus, setNewStatus] = useState("Planned");

    // Form inputs for editing selected skill progress
    const [editLevel, setEditLevel] = useState("Beginner");
    const [editProgressVal, setEditProgressVal] = useState(30);
    const [editStatus, setEditStatus] = useState("Planned");
    const [editProject, setEditProject] = useState("");
    const [editCourse, setEditCourse] = useState("");

    const categories = [
        "Programming", "Technical", "Soft Skills", "Languages", 
        "Frameworks", "Cloud", "Database", "Tools"
    ];

    // Sync back changes to parent
    const syncSkillsToDB = (updatedSkills, updatedProgress) => {
        updateCurrentUser({
            skills: updatedSkills,
            skillProgress: updatedProgress
        });
    };

    // Add Skill
    const handleAddSkill = (e) => {
        e.preventDefault();
        if (!newName.trim()) return;

        const newId = `sk-${Date.now()}`;
        const newSk = { id: newId, name: newName.trim(), category: newCategory };
        const updatedSkills = [...skillsList, newSk];

        // Projects / Course defaults based on category
        let defaultProjects = ["Build a practical sandbox project"];
        let defaultCourses = ["Fundamentals Tutorial Course"];
        let defaultAi = "Focus on basics and hands-on coding tests to progress quickly.";

        if (newCategory === "Programming") {
            defaultProjects = ["Algorithm builder", "Text processing suite"];
            defaultCourses = ["Programming Paradigms 101"];
        } else if (newCategory === "Cloud") {
            defaultProjects = ["Deploy static files to S3 bucket"];
            defaultCourses = ["Introduction to Cloud Infrastructure"];
        }

        const updatedProgress = {
            ...progressMap,
            [newId]: {
                level: newLevel,
                progress: Number(newProgressVal),
                status: newStatus,
                recommendedProjects: defaultProjects,
                recommendedCourses: defaultCourses,
                aiRec: defaultAi
            }
        };

        setSkillsList(updatedSkills);
        setProgressMap(updatedProgress);
        syncSkillsToDB(updatedSkills, updatedProgress);

        // Activity log
        const activity = currentUser?.activityHistory || [];
        const newAct = {
            id: `act-${Date.now()}`,
            type: "Skill Added",
            text: `Added skill tag: ${newName} (${newCategory})`,
            date: new Date().toLocaleDateString()
        };
        updateCurrentUser({ activityHistory: [newAct, ...activity] });

        setNewName("");
    };

    // Remove Skill
    const handleRemoveSkill = (id) => {
        const target = skillsList.find(s => s.id === id);
        const updatedSkills = skillsList.filter(s => s.id !== id);
        
        const updatedProgress = { ...progressMap };
        delete updatedProgress[id];

        setSkillsList(updatedSkills);
        setProgressMap(updatedProgress);
        syncSkillsToDB(updatedSkills, updatedProgress);

        if (selectedSkillId === id) {
            setSelectedSkillId(null);
        }

        // Activity log
        const activity = currentUser?.activityHistory || [];
        const newAct = {
            id: `act-${Date.now()}`,
            type: "Skill Deleted",
            text: `Removed skill tag: ${target ? target.name : "Skill"}`,
            date: new Date().toLocaleDateString()
        };
        updateCurrentUser({ activityHistory: [newAct, ...activity] });
    };

    // Load edit values
    const selectSkill = (sk) => {
        setSelectedSkillId(sk.id);
        const prog = progressMap[sk.id] || { level: "Beginner", progress: 30, status: "Planned", recommendedProjects: [], recommendedCourses: [], aiRec: "Start learning!" };
        setEditLevel(prog.level);
        setEditProgressVal(prog.progress);
        setEditStatus(prog.status);
    };

    // Save edited progress values
    const handleSaveProgress = (e) => {
        e.preventDefault();
        if (!selectedSkillId) return;

        const currentProg = progressMap[selectedSkillId] || {};
        const projects = [...(currentProg.recommendedProjects || [])];
        if (editProject.trim()) {
            projects.push(editProject.trim());
            setEditProject("");
        }

        const courses = [...(currentProg.recommendedCourses || [])];
        if (editCourse.trim()) {
            courses.push(editCourse.trim());
            setEditCourse("");
        }

        const updatedProgress = {
            ...progressMap,
            [selectedSkillId]: {
                ...currentProg,
                level: editLevel,
                progress: Number(editProgressVal),
                status: editStatus,
                recommendedProjects: projects,
                recommendedCourses: courses
            }
        };

        setProgressMap(updatedProgress);
        syncSkillsToDB(skillsList, updatedProgress);
        alert("Progress updated successfully!");
    };

    const activeSelectedSk = skillsList.find(s => s.id === selectedSkillId);
    const activeSelectedProg = activeSelectedSk ? (progressMap[activeSelectedSk.id] || {}) : null;

    return (
        <div className="flex flex-col gap-6 text-left">
            <div className="glass-panel p-6">
                <h3 className="text-xl font-bold text-white mb-1">Skills Manager & Tracker</h3>
                <p className="text-xs text-slate-400">Classify your technical competency and track skill growth modules in coordination with AI roadmap engines.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Left block: Add skills and list by categories */}
                <div className="lg:col-span-2 flex flex-col gap-6">
                    
                    {/* Add Skill form */}
                    <div className="glass-panel p-6">
                        <h4 className="font-bold text-white text-sm mb-4">Add Competency Skill Tag</h4>
                        <form onSubmit={handleAddSkill} className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                            <div>
                                <label className="text-[10px] font-bold text-slate-400 block mb-1">Skill Name</label>
                                <input 
                                    type="text"
                                    value={newName}
                                    onChange={(e) => setNewName(e.target.value)}
                                    className="w-full glass-input px-3 py-2 text-xs text-white"
                                    placeholder="e.g. Kotlin, Docker"
                                />
                            </div>
                            <div>
                                <label className="text-[10px] font-bold text-slate-400 block mb-1">Category</label>
                                <select 
                                    value={newCategory}
                                    onChange={(e) => setNewCategory(e.target.value)}
                                    className="w-full glass-input px-3 py-2 text-xs text-slate-300"
                                >
                                    {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                                </select>
                            </div>
                            <button type="submit" className="w-full py-2 rounded-xl bg-violet-600 hover:bg-violet-700 text-white font-bold text-xs transition-all flex items-center justify-center gap-1.5">
                                <Plus size={14} /> Add Skill
                            </button>
                        </form>
                    </div>

                    {/* Categorized tag display */}
                    <div className="flex flex-col gap-5">
                        {categories.map((cat) => {
                            const catSkills = skillsList.filter(s => s.category === cat);
                            if (catSkills.length === 0) return null;
                            return (
                                <div key={cat} className="glass-panel p-5">
                                    <h5 className="text-xs font-bold text-slate-400 border-b border-white/5 pb-2 mb-3.5 tracking-wider uppercase">{cat} Skills</h5>
                                    <div className="flex flex-wrap gap-2.5">
                                        {catSkills.map(sk => {
                                            const prog = progressMap[sk.id] || {};
                                            return (
                                                <div 
                                                    key={sk.id}
                                                    onClick={() => selectSkill(sk)}
                                                    className={`px-3 py-1.5 rounded-xl border text-xs font-semibold cursor-pointer transition-all flex items-center gap-2.5 ${selectedSkillId === sk.id ? "bg-violet-600/20 border-violet-500 text-white shadow-glow" : "bg-white/5 border-white/5 text-slate-300 hover:bg-white/10"}`}
                                                >
                                                    <span>{sk.name}</span>
                                                    {prog.progress !== undefined && (
                                                        <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-slate-900/50 text-slate-400">{prog.progress}%</span>
                                                    )}
                                                    <button 
                                                        type="button" 
                                                        onClick={(e) => { e.stopPropagation(); handleRemoveSkill(sk.id); }}
                                                        className="text-slate-500 hover:text-red-400 ml-1 text-xs"
                                                    >
                                                        ×
                                                    </button>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Right block: Skill details, learning status, recommended items */}
                <div className="lg:col-span-1 flex flex-col gap-6">
                    {activeSelectedSk && activeSelectedProg ? (
                        <div className="glass-panel p-6">
                            <div className="flex justify-between items-start border-b border-white/5 pb-3 mb-4">
                                <div>
                                    <h4 className="font-bold text-white text-base">{activeSelectedSk.name}</h4>
                                    <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">{activeSelectedSk.category} category</span>
                                </div>
                                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-violet-500/20 text-violet-300 border border-violet-500/30">{activeSelectedProg.level}</span>
                            </div>

                            <form onSubmit={handleSaveProgress} className="flex flex-col gap-4">
                                {/* Slider completion progress */}
                                <div>
                                    <div className="flex justify-between text-xs text-slate-300 mb-1">
                                        <span>Competency Progress</span>
                                        <span className="font-bold">{editProgressVal}%</span>
                                    </div>
                                    <input 
                                        type="range"
                                        min="0"
                                        max="100"
                                        value={editProgressVal}
                                        onChange={(e) => setEditProgressVal(Number(e.target.value))}
                                        className="w-full accent-violet-500 h-1.5 bg-white/5 rounded-full cursor-pointer"
                                    />
                                </div>

                                {/* Select levels */}
                                <div className="grid grid-cols-2 gap-3.5">
                                    <div>
                                        <label className="text-[10px] font-bold text-slate-400 block mb-1">Level</label>
                                        <select 
                                            value={editLevel}
                                            onChange={(e) => setEditLevel(e.target.value)}
                                            className="w-full glass-input px-2.5 py-1.5 text-xs text-slate-200"
                                        >
                                            <option value="Beginner">Beginner</option>
                                            <option value="Intermediate">Intermediate</option>
                                            <option value="Expert">Expert</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="text-[10px] font-bold text-slate-400 block mb-1">Status</label>
                                        <select 
                                            value={editStatus}
                                            onChange={(e) => setEditStatus(e.target.value)}
                                            className="w-full glass-input px-2.5 py-1.5 text-xs text-slate-200"
                                        >
                                            <option value="Planned">Planned</option>
                                            <option value="In Progress">In Progress</option>
                                            <option value="Completed">Completed</option>
                                        </select>
                                    </div>
                                </div>

                                {/* AI Recommendations */}
                                <div className="p-3.5 rounded-xl bg-white/5 border border-white/5 text-xs">
                                    <span className="font-bold text-violet-300 flex items-center gap-1 mb-1.5"><Sparkles size={12} className="animate-spin-slow" /> AI Advisory Recommendation</span>
                                    <p className="text-slate-300 leading-relaxed text-[11px]">{activeSelectedProg.aiRec}</p>
                                </div>

                                {/* Recommended Projects list */}
                                <div className="text-xs">
                                    <span className="font-semibold text-slate-400 block mb-1.5 flex items-center gap-1.5"><Terminal size={12} /> Target Projects</span>
                                    <ul className="list-disc pl-4 text-slate-300 flex flex-col gap-1 pr-1 text-[11px]">
                                        {activeSelectedProg.recommendedProjects?.map((proj, idx) => <li key={idx}>{proj}</li>)}
                                    </ul>
                                    <input 
                                        type="text"
                                        value={editProject}
                                        onChange={(e) => setEditProject(e.target.value)}
                                        className="w-full glass-input px-2 py-1 text-[10px] mt-2 text-slate-300"
                                        placeholder="Add custom project..."
                                    />
                                </div>

                                {/* Recommended Courses list */}
                                <div className="text-xs">
                                    <span className="font-semibold text-slate-400 block mb-1.5 flex items-center gap-1.5"><BookOpen size={12} /> Upgrades Pathways</span>
                                    <ul className="list-disc pl-4 text-slate-300 flex flex-col gap-1 pr-1 text-[11px]">
                                        {activeSelectedProg.recommendedCourses?.map((crs, idx) => <li key={idx}>{crs}</li>)}
                                    </ul>
                                    <input 
                                        type="text"
                                        value={editCourse}
                                        onChange={(e) => setEditCourse(e.target.value)}
                                        className="w-full glass-input px-2 py-1 text-[10px] mt-2 text-slate-300"
                                        placeholder="Add custom course..."
                                    />
                                </div>

                                <button type="submit" className="w-full py-2.5 rounded-xl bg-violet-600 hover:bg-violet-700 text-white font-bold text-xs transition-all flex items-center justify-center gap-1.5 mt-2">
                                    <Save size={14} /> Save Progress Settings
                                </button>
                            </form>
                        </div>
                    ) : (
                        <div className="glass-panel p-6 text-center text-slate-500 text-xs">
                            Select a skill tag on the left to view detailed progress indicators, recommended projects, and AI suggestions.
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
}
