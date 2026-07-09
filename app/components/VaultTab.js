"use client";

import React, { useState, useRef } from "react";
import { useApp } from "../context/AppContext";
import { Upload, FileText, Download, Trash2, Edit, RefreshCw, FileCheck2, ArrowRight, Eye } from "lucide-react";

export default function VaultTab() {
    const { currentUser, updateCurrentUser } = useApp();
    const [dragging, setDragging] = useState(false);
    const [viewingResume, setViewingResume] = useState(null);
    const [editingResume, setEditingResume] = useState(null);
    const [newName, setNewName] = useState("");
    
    const fileInputRef = useRef(null);
    const replaceInputRefs = useRef({});

    const resumes = currentUser?.resumes || [];
    const resumeHistory = currentUser?.resumeHistory || [];

    // Drag-and-Drop handlers
    const handleDragOver = (e) => {
        e.preventDefault();
        setDragging(true);
    };

    const handleDragLeave = () => {
        setDragging(false);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setDragging(false);
        const files = e.dataTransfer.files;
        if (files && files[0]) {
            addResumeToVault(files[0]);
        }
    };

    const handleFileSelect = (e) => {
        const files = e.target.files;
        if (files && files[0]) {
            addResumeToVault(files[0]);
        }
    };

    // Helper to read and append file
    const addResumeToVault = (file) => {
        const currentResumes = currentUser?.resumes || [];
        const nextVersion = `${currentResumes.length + 1}.0.0`;
        
        const reader = new FileReader();
        reader.onloadend = () => {
            const newResume = {
                id: `res-${Date.now()}`,
                name: file.name,
                uploadDate: new Date().toLocaleDateString(),
                score: Math.floor(65 + Math.random() * 30),
                fileType: file.name.split('.').pop().toUpperCase(),
                version: nextVersion,
                fileData: reader.result
            };

            // Event Logs
            const history = currentUser?.resumeHistory || [];
            const newEvent = {
                id: `ev-${Date.now()}`,
                type: "UPLOAD",
                name: file.name,
                date: new Date().toLocaleString(),
                description: `Uploaded version ${nextVersion}`
            };

            const activity = currentUser?.activityHistory || [];
            const newAct = {
                id: `act-${Date.now()}`,
                type: "Resume Uploaded",
                text: `Added resume ${file.name} to Vault (v${nextVersion})`,
                date: new Date().toLocaleDateString()
            };

            updateCurrentUser({
                resumes: [newResume, ...currentResumes],
                resumeHistory: [newEvent, ...history],
                activityHistory: [newAct, ...activity]
            });
        };
        reader.readAsDataURL(file);
    };

    // Replace helper
    const handleReplace = (resId, file) => {
        const reader = new FileReader();
        reader.onloadend = () => {
            const updated = resumes.map(r => {
                if (r.id === resId) {
                    const parts = r.version.split('.');
                    const nextVer = `${parseInt(parts[0]) + 1}.0.0`;
                    return {
                        ...r,
                        name: file.name,
                        uploadDate: new Date().toLocaleDateString(),
                        score: Math.floor(65 + Math.random() * 30),
                        fileType: file.name.split('.').pop().toUpperCase(),
                        version: nextVer,
                        fileData: reader.result
                    };
                }
                return r;
            });

            const target = resumes.find(r => r.id === resId);
            const history = currentUser?.resumeHistory || [];
            const newEvent = {
                id: `ev-${Date.now()}`,
                type: "REPLACE",
                name: file.name,
                date: new Date().toLocaleString(),
                description: `Replaced version ${target ? target.version : "1.0.0"} with file: ${file.name}`
            };

            updateCurrentUser({
                resumes: updated,
                resumeHistory: [newEvent, ...history]
            });
        };
        reader.readAsDataURL(file);
    };

    // Rename helper
    const handleRenameSave = (resId) => {
        if (!newName.trim()) return;
        const updated = resumes.map(r => r.id === resId ? { ...r, name: newName } : r);
        
        const history = currentUser?.resumeHistory || [];
        const newEvent = {
            id: `ev-${Date.now()}`,
            type: "RENAME",
            name: newName,
            date: new Date().toLocaleString(),
            description: `Renamed file`
        };

        updateCurrentUser({
            resumes: updated,
            resumeHistory: [newEvent, ...history]
        });

        setEditingResume(null);
        setNewName("");
    };

    // Download handler
    const handleDownload = (res) => {
        const link = document.createElement("a");
        link.href = res.fileData;
        link.download = res.name;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        const history = currentUser?.resumeHistory || [];
        const newEvent = {
            id: `ev-${Date.now()}`,
            type: "DOWNLOAD",
            name: res.name,
            date: new Date().toLocaleString(),
            description: `Downloaded file version ${res.version}`
        };

        updateCurrentUser({ resumeHistory: [newEvent, ...history] });
    };

    // Delete handler
    const handleDelete = (resId) => {
        const target = resumes.find(r => r.id === resId);
        const updated = resumes.filter(r => r.id !== resId);

        const history = currentUser?.resumeHistory || [];
        const newEvent = {
            id: `ev-${Date.now()}`,
            type: "DELETE",
            name: target ? target.name : "Resume",
            date: new Date().toLocaleString(),
            description: `Removed from vault`
        };

        updateCurrentUser({
            resumes: updated,
            resumeHistory: [newEvent, ...history]
        });
    };

    return (
        <div className="flex flex-col gap-6 text-left">
            <div className="glass-panel p-6">
                <h3 className="text-xl font-bold text-white mb-1">Resume Vault Center</h3>
                <p className="text-xs text-slate-400">Securely deposit multiple versions of your resume. PathFinder parses qualifications and logs history.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Vault list & Drag box */}
                <div className="lg:col-span-2 flex flex-col gap-6">
                    
                    {/* Drag-and-drop zone */}
                    <div 
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onDrop={handleDrop}
                        onClick={() => fileInputRef.current.click()}
                        className={`border-2 border-dashed rounded-2xl p-8 flex flex-col items-center justify-center text-center cursor-pointer transition-all ${dragging ? "border-violet-500 bg-violet-500/10" : "border-white/10 hover:border-violet-500/50 bg-white/1"}`}
                    >
                        <Upload size={32} className="text-violet-400 mb-2.5 animate-bounce" />
                        <span className="text-xs font-semibold text-slate-300">Drag & Drop new resume files here or click to browse</span>
                        <span className="text-[10px] text-slate-500 mt-1 block">Supports PDF, DOCX, TXT formats</span>
                        <input type="file" ref={fileInputRef} onChange={handleFileSelect} className="hidden" accept=".pdf,.txt,.docx" />
                    </div>

                    {/* Resumes List Grid */}
                    <div className="flex flex-col gap-4">
                        {resumes.length > 0 ? (
                            resumes.map((res) => (
                                <div key={res.id} className="glass-panel p-5 flex flex-col sm:flex-row justify-between sm:items-center gap-4 transition-all">
                                    <div className="flex items-start gap-3">
                                        <div className="w-10 h-10 rounded-xl bg-violet-600/10 border border-violet-500/20 flex items-center justify-center text-violet-400"><FileText size={20} /></div>
                                        <div>
                                            {editingResume === res.id ? (
                                                <div className="flex gap-2">
                                                    <input 
                                                        type="text"
                                                        value={newName}
                                                        onChange={(e) => setNewName(e.target.value)}
                                                        className="glass-input px-2.5 py-1 text-xs text-white"
                                                    />
                                                    <button onClick={() => handleRenameSave(res.id)} className="px-2 py-1 rounded bg-violet-600 text-[10px] font-bold text-white">Save</button>
                                                    <button onClick={() => setEditingResume(null)} className="px-2 py-1 rounded bg-white/5 text-[10px] font-bold text-slate-400">Cancel</button>
                                                </div>
                                            ) : (
                                                <h4 className="font-bold text-white text-sm flex items-center gap-2">
                                                    {res.name} 
                                                    <button onClick={() => { setEditingResume(res.id); setNewName(res.name); }} className="text-slate-500 hover:text-violet-400"><Edit size={12} /></button>
                                                </h4>
                                            )}
                                            
                                            <div className="flex flex-wrap gap-2.5 mt-1.5 text-[10px] text-slate-400">
                                                <span>Ver: <strong className="text-violet-300">{res.version}</strong></span>
                                                <span>Uploaded: <strong>{res.uploadDate}</strong></span>
                                                <span>Score: <strong className="text-emerald-400">{res.score}% ATS</strong></span>
                                                <span>Type: <strong>{res.fileType}</strong></span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Action row */}
                                    <div className="flex items-center gap-2.5">
                                        <button onClick={() => setViewingResume(res)} className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 border border-white/5" title="View details"><Eye size={14} /></button>
                                        <button onClick={() => handleDownload(res)} className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 border border-white/5" title="Download"><Download size={14} /></button>
                                        
                                        {/* Replace Trigger */}
                                        <label className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 border border-white/5 cursor-pointer" title="Replace file">
                                            <RefreshCw size={14} />
                                            <input 
                                                type="file" 
                                                className="hidden" 
                                                accept=".pdf,.txt,.docx"
                                                onChange={(e) => e.target.files[0] && handleReplace(res.id, e.target.files[0])}
                                            />
                                        </label>
                                        
                                        <button onClick={() => handleDelete(res.id)} className="p-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/10" title="Delete"><Trash2 size={14} /></button>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="glass-panel p-12 text-center text-slate-500 text-xs">
                                No active resumes saved in Vault. Drop files above to upload your first resume audit profile.
                            </div>
                        )}
                    </div>
                </div>

                {/* Resume Timeline/History */}
                <div className="lg:col-span-1 flex flex-col gap-6">
                    <div className="glass-panel p-6">
                        <h4 className="font-bold text-white text-sm mb-4 flex items-center gap-2">
                            <FileCheck2 size={16} className="text-violet-400" /> Resume Action History
                        </h4>
                        
                        <div className="relative pl-6 border-l border-white/10 flex flex-col gap-4 text-xs">
                            {resumeHistory.length > 0 ? (
                                resumeHistory.map((item) => (
                                    <div key={item.id} className="relative text-left">
                                        <span className={`absolute -left-[30px] top-0.5 w-3 h-3 rounded-full border border-slate-900 ${item.type === 'UPLOAD' ? 'bg-violet-500' : item.type === 'DELETE' ? 'bg-red-500' : 'bg-cyan-500'}`} />
                                        <div className="flex justify-between items-center">
                                            <span className="font-bold text-slate-200">{item.type}</span>
                                            <span className="text-[9px] text-slate-500">{item.date.split(',')[0]}</span>
                                        </div>
                                        <p className="text-[10px] text-slate-400 mt-0.5 leading-snug">{item.name}</p>
                                        <span className="text-[9px] text-slate-500 italic block mt-0.5">{item.description}</span>
                                    </div>
                                ))
                            ) : (
                                <span className="text-[11px] text-slate-500">History timeline logs will record automatically upon uploads/audits.</span>
                            )}
                        </div>
                    </div>
                </div>

            </div>

            {/* Viewer Modal */}
            {viewingResume && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="glass-panel modal-panel p-6 w-full max-w-lg">
                        <div className="flex justify-between items-center border-b border-white/5 pb-3 mb-4">
                            <h3 className="text-base font-bold text-white">Viewer: {viewingResume.name}</h3>
                            <button onClick={() => setViewingResume(null)} className="text-slate-400 hover:text-white font-bold text-sm">×</button>
                        </div>
                        <div className="bg-slate-900/50 p-4 rounded-xl border border-white/5 max-h-80 overflow-y-auto mb-6 text-xs text-slate-300 leading-relaxed font-mono">
                            <p>=== Resume Vault File Records ===</p>
                            <p>Filename: {viewingResume.name}</p>
                            <p>Upload Date: {viewingResume.uploadDate}</p>
                            <p>ATS Match Score: {viewingResume.score}%</p>
                            <p>Internal Registry Reference: {viewingResume.id}</p>
                            <p>File Extension parsed: {viewingResume.fileType}</p>
                            <p className="mt-4 text-[10px] text-slate-500 italic">Base64 file representation storage matches active index structures successfully.</p>
                        </div>
                        <div className="flex justify-end gap-3">
                            <button onClick={() => setViewingResume(null)} className="px-4 py-2 rounded-xl text-xs font-bold bg-white/5 text-slate-300 hover:bg-white/10 transition-all">Close</button>
                            <button onClick={() => handleDownload(viewingResume)} className="px-4 py-2 rounded-xl text-xs font-bold bg-violet-600 hover:bg-violet-700 text-white transition-all">Download</button>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
}
