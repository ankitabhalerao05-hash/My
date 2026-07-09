"use client";

import React, { useState } from "react";
import { useApp } from "../context/AppContext";
import { Bookmark, Trash2, ExternalLink, Sparkles, BookOpen, Compass, Briefcase, Award } from "lucide-react";

export default function SavedTab() {
    const { currentUser, updateCurrentUser, affiliates, jobs } = useApp();
    const [activeFilter, setActiveFilter] = useState("ALL");

    // Initialize list of saved resources if not present in DB
    const savedResources = currentUser?.savedResources || [
        { id: "sav-1", type: "Course", title: "Google Data Analytics Professional Certificate", provider: "Coursera", link: "https://www.coursera.org/professional-certificates/google-data-analytics" },
        { id: "sav-2", type: "Job", title: "Associate Software Engineer", provider: "TCS India", link: "https://www.tcs.com/careers" },
        { id: "sav-3", type: "Book", title: "Designing Data-Intensive Applications", provider: "Martin Kleppmann", link: "https://www.oreilly.com/library/view/designing-data-intensive-applications/9781491903063/" }
    ];

    // Remove saved item helper
    const handleRemoveSaved = (id) => {
        const updated = savedResources.filter(item => item.id !== id);
        updateCurrentUser({ savedResources: updated });

        // Add to Activity history
        const activity = currentUser?.activityHistory || [];
        const target = savedResources.find(item => item.id === id);
        const newAct = {
            id: `act-${Date.now()}`,
            type: "Bookmark Deleted",
            text: `Removed bookmark: ${target ? target.title : "Resource"}`,
            date: new Date().toLocaleDateString()
        };
        updateCurrentUser({ activityHistory: [newAct, ...activity] });
    };

    // Filter items
    const filteredResources = activeFilter === "ALL" 
        ? savedResources 
        : savedResources.filter(item => item.type.toUpperCase() === activeFilter.toUpperCase());

    const filters = ["ALL", "COURSE", "JOB", "PROJECT", "MENTOR", "BOOK", "RESOURCE"];

    return (
        <div className="flex flex-col gap-6 text-left">
            <div className="glass-panel p-6">
                <h3 className="text-xl font-bold text-white mb-1">Saved Bookmarks & Resources</h3>
                <p className="text-xs text-slate-400">Manage bookmarks for online certifications, job applications, books, and interactive career roadmaps.</p>
            </div>

            {/* Filter buttons row */}
            <div className="flex flex-wrap gap-2">
                {filters.map((f) => (
                    <button
                        key={f}
                        onClick={() => setActiveFilter(f)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${activeFilter === f ? "bg-violet-600/20 border-violet-500 text-white" : "bg-white/5 border-white/5 text-slate-400 hover:bg-white/10"}`}
                    >
                        {f}
                    </button>
                ))}
            </div>

            {/* Bookmarks Grid list */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredResources.length > 0 ? (
                    filteredResources.map((item) => (
                        <div key={item.id} className="glass-panel p-5 flex flex-col justify-between">
                            <div>
                                <div className="flex justify-between items-center mb-3">
                                    <span className="px-2.5 py-0.5 rounded text-[9px] font-bold bg-violet-600/10 border border-violet-500/20 text-violet-400 uppercase tracking-wide">
                                        {item.type}
                                    </span>
                                    <span className="text-[10px] text-slate-500">{item.provider}</span>
                                </div>
                                <h4 className="font-bold text-white text-sm leading-snug mb-2">{item.title}</h4>
                            </div>

                            <div className="mt-6 border-t border-white/5 pt-3.5 flex items-center justify-between">
                                <button 
                                    onClick={() => handleRemoveSaved(item.id)}
                                    className="p-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/10 transition-all"
                                    title="Remove bookmark"
                                >
                                    <Trash2 size={13} />
                                </button>
                                <a 
                                    href={item.link} 
                                    target="_blank" 
                                    rel="noopener noreferrer" 
                                    className="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-violet-600 hover:bg-violet-700 text-white transition-all flex items-center gap-1"
                                >
                                    Visit site <ExternalLink size={12} />
                                </a>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="lg:col-span-3 glass-panel p-12 text-center text-slate-500 text-xs">
                        No bookmarks match the active category filter selection.
                    </div>
                )}
            </div>

            {/* AI Prompt to save recommendations */}
            <div className="glass-panel p-6">
                <span className="font-bold text-violet-300 flex items-center gap-1.5 text-xs mb-1.5"><Sparkles size={13} /> Quick Tip</span>
                <p className="text-xs text-slate-400 leading-relaxed">
                    You can bookmark items directly from the "Dashboard Insights", "Bootcamp Marketplace", and "Learning Pathways" sections. Saved items are synced to your account database permanently and will remain loaded upon your next login.
                </p>
            </div>

        </div>
    );
}
