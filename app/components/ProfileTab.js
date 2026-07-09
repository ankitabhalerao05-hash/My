"use client";

import React, { useState, useEffect } from "react";
import { useApp } from "../context/AppContext";
import { UserCog, Upload, Save, User, BookOpen, Globe, Link, X, Plus, Edit2, Trash2, Camera, MapPin, Briefcase, GraduationCap, Award, Languages as LanguagesIcon, CheckCircle } from "lucide-react";

export default function ProfileTab() {
    const { currentUser, updateCurrentUser } = useApp();

    // Profile Header
    const [headline, setHeadline] = useState(currentUser?.profileHeader?.headline || "");
    const [profileCompletion, setProfileCompletion] = useState(0);

    // Personal Information
    const [fullName, setFullName] = useState(currentUser?.personalInfo?.fullName || currentUser?.name || "");
    const [email, setEmail] = useState(currentUser?.email || "");
    const [phone, setPhone] = useState(currentUser?.personalInfo?.phone || "");
    const [dateOfBirth, setDateOfBirth] = useState(currentUser?.personalInfo?.dateOfBirth || "");
    const [gender, setGender] = useState(currentUser?.personalInfo?.gender || "");
    const [country, setCountry] = useState(currentUser?.personalInfo?.country || "");
    const [state, setState] = useState(currentUser?.personalInfo?.state || "");
    const [city, setCity] = useState(currentUser?.personalInfo?.city || "");
    const [address, setAddress] = useState(currentUser?.personalInfo?.address || "");

    // Education (Multiple records)
    const [education, setEducation] = useState(currentUser?.education || []);
    const [editingEducation, setEditingEducation] = useState(null);
    const [educationForm, setEducationForm] = useState({
        degree: "",
        branch: "",
        college: "",
        university: "",
        gradYear: "",
        currentSemester: "",
        cgpa: ""
    });

    // Career Details
    const [dreamJob, setDreamJob] = useState(currentUser?.careerDetails?.dreamJob || "");
    const [preferredIndustry, setPreferredIndustry] = useState(currentUser?.careerDetails?.preferredIndustry || "");
    const [preferredLocation, setPreferredLocation] = useState(currentUser?.careerDetails?.preferredLocation || "");
    const [employmentType, setEmploymentType] = useState(currentUser?.careerDetails?.employmentType || "");
    const [experienceLevel, setExperienceLevel] = useState(currentUser?.careerDetails?.experienceLevel || "Entry Level");
    const [currentStatus, setCurrentStatus] = useState(currentUser?.careerDetails?.currentStatus || "");

    // Skills (Categorized)
    const [skills, setSkills] = useState(currentUser?.skills || {
        programming: [],
        technical: [],
        frameworks: [],
        databases: [],
        cloud: [],
        tools: [],
        languages: [],
        softSkills: []
    });
    const [skillInput, setSkillInput] = useState("");
    const [skillCategory, setSkillCategory] = useState("programming");

    // Social Links
    const [linkedin, setLinkedin] = useState(currentUser?.socials?.linkedin || "");
    const [github, setGithub] = useState(currentUser?.socials?.github || "");
    const [portfolio, setPortfolio] = useState(currentUser?.socials?.portfolio || "");
    const [personalWebsite, setPersonalWebsite] = useState(currentUser?.socials?.personalWebsite || "");

    // About Me
    const [professionalSummary, setProfessionalSummary] = useState(currentUser?.aboutMe?.professionalSummary || "");
    const [careerObjective, setCareerObjective] = useState(currentUser?.aboutMe?.careerObjective || "");
    const [interests, setInterests] = useState(currentUser?.aboutMe?.interests || []);
    const [achievements, setAchievements] = useState(currentUser?.aboutMe?.achievements || []);
    const [languagesKnown, setLanguagesKnown] = useState(currentUser?.aboutMe?.languagesKnown || []);

    const [interestInput, setInterestInput] = useState("");
    const [achievementInput, setAchievementInput] = useState("");
    const [languageInput, setLanguageInput] = useState("");

    // UI State
    const [saveStatus, setSaveStatus] = useState("");
    const [errors, setErrors] = useState({});
    const [showEducationForm, setShowEducationForm] = useState(false);

    // Sync from database on load
    useEffect(() => {
        if (currentUser) {
            setHeadline(currentUser.profileHeader?.headline || "");
            setFullName(currentUser.personalInfo?.fullName || currentUser.name || "");
            setEmail(currentUser.email || "");
            setPhone(currentUser.personalInfo?.phone || "");
            setDateOfBirth(currentUser.personalInfo?.dateOfBirth || "");
            setGender(currentUser.personalInfo?.gender || "");
            setCountry(currentUser.personalInfo?.country || "");
            setState(currentUser.personalInfo?.state || "");
            setCity(currentUser.personalInfo?.city || "");
            setAddress(currentUser.personalInfo?.address || "");
            setEducation(currentUser.education || []);
            setDreamJob(currentUser.careerDetails?.dreamJob || "");
            setPreferredIndustry(currentUser.careerDetails?.preferredIndustry || "");
            setPreferredLocation(currentUser.careerDetails?.preferredLocation || "");
            setEmploymentType(currentUser.careerDetails?.employmentType || "");
            setExperienceLevel(currentUser.careerDetails?.experienceLevel || "Entry Level");
            setCurrentStatus(currentUser.careerDetails?.currentStatus || "");
            setSkills(currentUser.skills || {
                programming: [],
                technical: [],
                frameworks: [],
                databases: [],
                cloud: [],
                tools: [],
                languages: [],
                softSkills: []
            });
            setLinkedin(currentUser.socials?.linkedin || "");
            setGithub(currentUser.socials?.github || "");
            setPortfolio(currentUser.socials?.portfolio || "");
            setPersonalWebsite(currentUser.socials?.personalWebsite || "");
            setProfessionalSummary(currentUser.aboutMe?.professionalSummary || "");
            setCareerObjective(currentUser.aboutMe?.careerObjective || "");
            setInterests(currentUser.aboutMe?.interests || []);
            setAchievements(currentUser.aboutMe?.achievements || []);
            setLanguagesKnown(currentUser.aboutMe?.languagesKnown || []);
        }
    }, [currentUser]);

    // Calculate profile completion
    useEffect(() => {
        let completed = 0;
        let total = 10;

        if (currentUser?.profilePic) completed++;
        if (headline) completed++;
        if (fullName && phone && email) completed++;
        if (education && education.length > 0) completed++;
        if (dreamJob && preferredIndustry) completed++;
        if (skills && Object.values(skills).some(arr => arr.length > 0)) completed++;
        if (linkedin || github || portfolio) completed++;
        if (professionalSummary) completed++;
        if (careerObjective) completed++;
        if (interests.length > 0 || achievements.length > 0) completed++;

        setProfileCompletion(Math.round((completed / total) * 100));
    }, [currentUser, headline, fullName, phone, email, education, dreamJob, preferredIndustry, skills, linkedin, github, portfolio, professionalSummary, careerObjective, interests, achievements]);

    // Validation
    const validateForm = () => {
        const newErrors = {};

        if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            newErrors.email = "Invalid email format";
        }

        if (phone && !/^[+]?[\d\s\-()]{10,}$/.test(phone)) {
            newErrors.phone = "Invalid phone number";
        }

        if (linkedin && !linkedin.includes('linkedin.com')) {
            newErrors.linkedin = "Invalid LinkedIn URL";
        }

        if (github && !github.includes('github.com')) {
            newErrors.github = "Invalid GitHub URL";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // Save profile to context
    const handleSave = (e) => {
        e.preventDefault();

        if (!validateForm()) {
            setSaveStatus("Please fix validation errors");
            setTimeout(() => setSaveStatus(""), 3000);
            return;
        }

        setSaveStatus("Saving...");

        updateCurrentUser({
            name: fullName,
            profileHeader: { headline },
            personalInfo: {
                fullName,
                phone,
                dateOfBirth,
                gender,
                country,
                state,
                city,
                address
            },
            education,
            careerDetails: {
                dreamJob,
                preferredIndustry,
                preferredLocation,
                employmentType,
                experienceLevel,
                currentStatus
            },
            skills,
            socials: { linkedin, github, portfolio, personalWebsite },
            aboutMe: {
                professionalSummary,
                careerObjective,
                interests,
                achievements,
                languagesKnown
            },
            profileCompletion
        });

        // Add to Activity history
        const activity = currentUser?.activityHistory || [];
        const newAct = {
            id: `act-${Date.now()}`,
            type: "Profile Updated",
            text: "Updated comprehensive profile information",
            date: new Date().toLocaleDateString()
        };
        updateCurrentUser({ activityHistory: [newAct, ...activity] });

        setSaveStatus("Saved successfully!");
        setTimeout(() => setSaveStatus(""), 3000);
    };

    // Handle profile picture file load
    const handlePicChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 5 * 1024 * 1024) {
                alert("File size must be less than 5MB");
                return;
            }
            if (!file.type.startsWith('image/')) {
                alert("Please upload an image file");
                return;
            }
            const reader = new FileReader();
            reader.onloadend = () => {
                updateCurrentUser({ profilePic: reader.result });
            };
            reader.readAsDataURL(file);
        }
    };

    // Remove profile picture
    const handleRemovePic = () => {
        if (confirm("Are you sure you want to remove your profile picture?")) {
            updateCurrentUser({ profilePic: null });
        }
    };

    // Education CRUD operations
    const handleAddEducation = () => {
        const newEducation = {
            id: `edu-${Date.now()}`,
            ...educationForm
        };
        setEducation([...education, newEducation]);
        setEducationForm({ degree: "", branch: "", college: "", university: "", gradYear: "", currentSemester: "", cgpa: "" });
        setShowEducationForm(false);
    };

    const handleEditEducation = (edu) => {
        setEditingEducation(edu.id);
        setEducationForm({ ...edu });
        setShowEducationForm(true);
    };

    const handleUpdateEducation = () => {
        setEducation(education.map(edu => edu.id === editingEducation ? { ...educationForm, id: editingEducation } : edu));
        setEditingEducation(null);
        setEducationForm({ degree: "", branch: "", college: "", university: "", gradYear: "", currentSemester: "", cgpa: "" });
        setShowEducationForm(false);
    };

    const handleDeleteEducation = (id) => {
        if (confirm("Are you sure you want to delete this education record?")) {
            setEducation(education.filter(edu => edu.id !== id));
        }
    };

    // Skills CRUD operations
    const handleAddSkill = () => {
        if (skillInput.trim() && !skills[skillCategory].includes(skillInput.trim())) {
            setSkills({
                ...skills,
                [skillCategory]: [...skills[skillCategory], skillInput.trim()]
            });
            setSkillInput("");
        }
    };

    const handleDeleteSkill = (category, skill) => {
        setSkills({
            ...skills,
            [category]: skills[category].filter(s => s !== skill)
        });
    };

    // About Me CRUD operations
    const addInterest = () => {
        if (interestInput.trim() && !interests.includes(interestInput.trim())) {
            setInterests([...interests, interestInput.trim()]);
            setInterestInput("");
        }
    };

    const removeInterest = (item) => {
        setInterests(interests.filter(i => i !== item));
    };

    const addAchievement = () => {
        if (achievementInput.trim()) {
            setAchievements([...achievements, achievementInput.trim()]);
            setAchievementInput("");
        }
    };

    const removeAchievement = (index) => {
        setAchievements(achievements.filter((_, i) => i !== index));
    };

    const addLanguage = () => {
        if (languageInput.trim() && !languagesKnown.includes(languageInput.trim())) {
            setLanguagesKnown([...languagesKnown, languageInput.trim()]);
            setLanguageInput("");
        }
    };

    const removeLanguage = (item) => {
        setLanguagesKnown(languagesKnown.filter(l => l !== item));
    };

    return (
        <div className="flex flex-col gap-6 text-left">
            <div className="glass-panel p-6">
                <h3 className="text-xl font-bold text-white mb-1">Professional Profile</h3>
                <p className="text-xs text-slate-400">Complete your profile to unlock personalized career recommendations and opportunities.</p>
            </div>

            <form onSubmit={handleSave} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Left Column - Profile Header & Quick Info */}
                <div className="lg:col-span-1 flex flex-col gap-6">
                    {/* Profile Header Card */}
                    <div className="glass-panel p-6 flex flex-col items-center text-center">
                        <div className="relative group w-28 h-28 rounded-2xl overflow-hidden bg-white/5 border border-white/10 mb-4 flex items-center justify-center">
                            {currentUser?.profilePic ? (
                                <img src={currentUser.profilePic} alt="Profile" className="w-full h-full object-cover" />
                            ) : (
                                <div className="text-4xl">👤</div>
                            )}
                            <label className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center cursor-pointer text-[10px] text-white font-bold">
                                <Camera size={18} className="mb-1" />
                                Change Photo
                                <input type="file" onChange={handlePicChange} accept="image/*" className="hidden" />
                            </label>
                        </div>
                        {currentUser?.profilePic && (
                            <button 
                                type="button" 
                                onClick={handleRemovePic}
                                className="text-[10px] text-red-400 hover:text-red-300 mb-2"
                            >
                                Remove Photo
                            </button>
                        )}
                        <h4 className="font-bold text-white text-lg">{fullName || currentUser?.name}</h4>
                        <input 
                            type="text"
                            value={headline}
                            onChange={(e) => setHeadline(e.target.value)}
                            className="w-full glass-input px-3 py-1.5 text-xs text-slate-300 text-center mt-2"
                            placeholder="Professional Headline"
                        />
                        <span className="text-xs text-slate-400 block mt-1">{email}</span>
                        <span className="px-2.5 py-0.5 mt-3 rounded-full text-[10px] font-bold bg-violet-600/20 border border-violet-500/30 text-violet-300">
                            {currentUser?.plan} Member
                        </span>

                        {/* Profile Completion */}
                        <div className="w-full mt-4">
                            <div className="flex justify-between items-center mb-1">
                                <span className="text-[10px] font-bold text-slate-400">Profile Completion</span>
                                <span className="text-[10px] font-bold text-violet-300">{profileCompletion}%</span>
                            </div>
                            <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
                                <div 
                                    className="h-full bg-gradient-to-r from-violet-500 to-cyan-500 transition-all duration-500"
                                    style={{ width: `${profileCompletion}%` }}
                                />
                            </div>
                        </div>

                        <div className="w-full h-px bg-white/5 my-4" />

                        {/* Current Career Goal */}
                        {dreamJob && (
                            <div className="w-full text-left">
                                <label className="text-[10px] font-bold text-slate-400 block mb-1">Current Goal</label>
                                <div className="flex items-center gap-2 text-xs text-violet-300">
                                    <Briefcase size={12} />
                                    <span>{dreamJob}</span>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Contact Information */}
                    <div className="glass-panel p-6">
                        <h4 className="font-bold text-white text-sm mb-4 flex items-center gap-2">
                            <User size={16} className="text-violet-400" /> Contact Information
                        </h4>
                        <div className="space-y-3">
                            <div>
                                <label className="text-xs font-bold text-slate-400 block mb-1">Phone Number</label>
                                <input 
                                    type="text"
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                    className={`w-full glass-input px-3 py-2 text-xs text-slate-200 ${errors.phone ? 'border-red-500' : ''}`}
                                    placeholder="+91 99999-88888"
                                />
                                {errors.phone && <span className="text-[10px] text-red-400">{errors.phone}</span>}
                            </div>
                            <div>
                                <label className="text-xs font-bold text-slate-400 block mb-1">Email (Read Only)</label>
                                <input 
                                    type="text"
                                    value={email}
                                    disabled
                                    className="w-full glass-input px-3 py-2 text-xs text-slate-400 opacity-60"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Location Information */}
                    <div className="glass-panel p-6">
                        <h4 className="font-bold text-white text-sm mb-4 flex items-center gap-2">
                            <MapPin size={16} className="text-cyan-400" /> Location
                        </h4>
                        <div className="space-y-3">
                            <div className="grid grid-cols-2 gap-2">
                                <div>
                                    <label className="text-[10px] font-bold text-slate-400 block mb-1">Country</label>
                                    <input 
                                        type="text"
                                        value={country}
                                        onChange={(e) => setCountry(e.target.value)}
                                        className="w-full glass-input px-2 py-1.5 text-xs text-slate-200"
                                        placeholder="India"
                                    />
                                </div>
                                <div>
                                    <label className="text-[10px] font-bold text-slate-400 block mb-1">State</label>
                                    <input 
                                        type="text"
                                        value={state}
                                        onChange={(e) => setState(e.target.value)}
                                        className="w-full glass-input px-2 py-1.5 text-xs text-slate-200"
                                        placeholder="Delhi"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="text-xs font-bold text-slate-400 block mb-1">City</label>
                                <input 
                                    type="text"
                                    value={city}
                                    onChange={(e) => setCity(e.target.value)}
                                    className="w-full glass-input px-3 py-2 text-xs text-slate-200"
                                    placeholder="New Delhi"
                                />
                            </div>
                            <div>
                                <label className="text-xs font-bold text-slate-400 block mb-1">Address</label>
                                <input 
                                    type="text"
                                    value={address}
                                    onChange={(e) => setAddress(e.target.value)}
                                    className="w-full glass-input px-3 py-2 text-xs text-slate-200"
                                    placeholder="Street address"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column - Detailed Information */}
                <div className="lg:col-span-2 flex flex-col gap-6">
                    
                    {/* Personal Information */}
                    <div className="glass-panel p-6">
                        <h4 className="font-bold text-white text-sm mb-4 flex items-center gap-2">
                            <UserCog size={16} className="text-violet-400" /> Personal Information
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="text-xs font-bold text-slate-400 block mb-1.5">Full Name</label>
                                <input 
                                    type="text"
                                    value={fullName}
                                    onChange={(e) => setFullName(e.target.value)}
                                    className="w-full glass-input px-3 py-2 text-xs text-slate-200"
                                    placeholder="John Doe"
                                />
                            </div>
                            <div>
                                <label className="text-xs font-bold text-slate-400 block mb-1.5">Date of Birth</label>
                                <input 
                                    type="date"
                                    value={dateOfBirth}
                                    onChange={(e) => setDateOfBirth(e.target.value)}
                                    className="w-full glass-input px-3 py-2 text-xs text-slate-200"
                                />
                            </div>
                            <div>
                                <label className="text-xs font-bold text-slate-400 block mb-1.5">Gender</label>
                                <select 
                                    value={gender}
                                    onChange={(e) => setGender(e.target.value)}
                                    className="w-full glass-input px-3 py-2 text-xs text-slate-200"
                                >
                                    <option value="">Select Gender</option>
                                    <option value="Male">Male</option>
                                    <option value="Female">Female</option>
                                    <option value="Other">Other</option>
                                    <option value="Prefer not to say">Prefer not to say</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Education Section */}
                    <div className="glass-panel p-6">
                        <div className="flex justify-between items-center mb-4">
                            <h4 className="font-bold text-white text-sm flex items-center gap-2">
                                <GraduationCap size={16} className="text-violet-400" /> Education
                            </h4>
                            <button 
                                type="button" 
                                onClick={() => setShowEducationForm(!showEducationForm)}
                                className="px-3 py-1.5 rounded-lg bg-violet-600 hover:bg-violet-700 text-white text-xs flex items-center gap-1"
                            >
                                <Plus size={12} />
                                Add Education
                            </button>
                        </div>

                        {showEducationForm && (
                            <div className="mb-4 p-4 bg-white/5 rounded-xl border border-white/10">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                    <div>
                                        <label className="text-[10px] font-bold text-slate-400 block mb-1">Degree</label>
                                        <input 
                                            type="text"
                                            value={educationForm.degree}
                                            onChange={(e) => setEducationForm({...educationForm, degree: e.target.value})}
                                            className="w-full glass-input px-2 py-1.5 text-xs text-slate-200"
                                            placeholder="B.Tech"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-[10px] font-bold text-slate-400 block mb-1">Branch/Specialization</label>
                                        <input 
                                            type="text"
                                            value={educationForm.branch}
                                            onChange={(e) => setEducationForm({...educationForm, branch: e.target.value})}
                                            className="w-full glass-input px-2 py-1.5 text-xs text-slate-200"
                                            placeholder="Computer Science"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-[10px] font-bold text-slate-400 block mb-1">College</label>
                                        <input 
                                            type="text"
                                            value={educationForm.college}
                                            onChange={(e) => setEducationForm({...educationForm, college: e.target.value})}
                                            className="w-full glass-input px-2 py-1.5 text-xs text-slate-200"
                                            placeholder="College Name"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-[10px] font-bold text-slate-400 block mb-1">University</label>
                                        <input 
                                            type="text"
                                            value={educationForm.university}
                                            onChange={(e) => setEducationForm({...educationForm, university: e.target.value})}
                                            className="w-full glass-input px-2 py-1.5 text-xs text-slate-200"
                                            placeholder="University Name"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-[10px] font-bold text-slate-400 block mb-1">Graduation Year</label>
                                        <input 
                                            type="text"
                                            value={educationForm.gradYear}
                                            onChange={(e) => setEducationForm({...educationForm, gradYear: e.target.value})}
                                            className="w-full glass-input px-2 py-1.5 text-xs text-slate-200"
                                            placeholder="2026"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-[10px] font-bold text-slate-400 block mb-1">Current Semester</label>
                                        <input 
                                            type="text"
                                            value={educationForm.currentSemester}
                                            onChange={(e) => setEducationForm({...educationForm, currentSemester: e.target.value})}
                                            className="w-full glass-input px-2 py-1.5 text-xs text-slate-200"
                                            placeholder="6th Semester"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-[10px] font-bold text-slate-400 block mb-1">CGPA (Optional)</label>
                                        <input 
                                            type="text"
                                            value={educationForm.cgpa}
                                            onChange={(e) => setEducationForm({...educationForm, cgpa: e.target.value})}
                                            className="w-full glass-input px-2 py-1.5 text-xs text-slate-200"
                                            placeholder="8.5"
                                        />
                                    </div>
                                </div>
                                <div className="flex gap-2 mt-3">
                                    <button 
                                        type="button" 
                                        onClick={editingEducation ? handleUpdateEducation : handleAddEducation}
                                        className="px-3 py-1.5 rounded-lg bg-violet-600 hover:bg-violet-700 text-white text-xs"
                                    >
                                        {editingEducation ? 'Update' : 'Add'} Education
                                    </button>
                                    <button 
                                        type="button" 
                                        onClick={() => {
                                            setShowEducationForm(false);
                                            setEditingEducation(null);
                                            setEducationForm({ degree: "", branch: "", college: "", university: "", gradYear: "", currentSemester: "", cgpa: "" });
                                        }}
                                        className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        )}

                        {education.length > 0 && (
                            <div className="space-y-3">
                                {education.map((edu) => (
                                    <div key={edu.id} className="p-4 bg-white/5 rounded-xl border border-white/10 flex justify-between items-start">
                                        <div>
                                            <h5 className="text-xs font-bold text-white">{edu.degree} {edu.branch && `(${edu.branch})`}</h5>
                                            <p className="text-[10px] text-slate-400">{edu.college}, {edu.university}</p>
                                            <p className="text-[10px] text-slate-500">Graduation: {edu.gradYear} {edu.currentSemester && `• ${edu.currentSemester}`} {edu.cgpa && `• CGPA: ${edu.cgpa}`}</p>
                                        </div>
                                        <div className="flex gap-1">
                                            <button 
                                                type="button" 
                                                onClick={() => handleEditEducation(edu)}
                                                className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white"
                                            >
                                                <Edit2 size={12} />
                                            </button>
                                            <button 
                                                type="button" 
                                                onClick={() => handleDeleteEducation(edu.id)}
                                                className="p-1.5 rounded-lg bg-red-500/20 hover:bg-red-500/30 text-red-400"
                                            >
                                                <Trash2 size={12} />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Career Details */}
                    <div className="glass-panel p-6">
                        <h4 className="font-bold text-white text-sm mb-4 flex items-center gap-2">
                            <Briefcase size={16} className="text-cyan-400" /> Career Details
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="text-xs font-bold text-slate-400 block mb-1.5">Dream Job</label>
                                <input 
                                    type="text"
                                    value={dreamJob}
                                    onChange={(e) => setDreamJob(e.target.value)}
                                    className="w-full glass-input px-3 py-2 text-xs text-slate-200"
                                    placeholder="e.g. Senior Software Engineer"
                                />
                            </div>
                            <div>
                                <label className="text-xs font-bold text-slate-400 block mb-1.5">Preferred Industry</label>
                                <input 
                                    type="text"
                                    value={preferredIndustry}
                                    onChange={(e) => setPreferredIndustry(e.target.value)}
                                    className="w-full glass-input px-3 py-2 text-xs text-slate-200"
                                    placeholder="e.g. Technology, Finance"
                                />
                            </div>
                            <div>
                                <label className="text-xs font-bold text-slate-400 block mb-1.5">Preferred Location</label>
                                <input 
                                    type="text"
                                    value={preferredLocation}
                                    onChange={(e) => setPreferredLocation(e.target.value)}
                                    className="w-full glass-input px-3 py-2 text-xs text-slate-200"
                                    placeholder="e.g. Bengaluru, Remote"
                                />
                            </div>
                            <div>
                                <label className="text-xs font-bold text-slate-400 block mb-1.5">Employment Type</label>
                                <select 
                                    value={employmentType}
                                    onChange={(e) => setEmploymentType(e.target.value)}
                                    className="w-full glass-input px-3 py-2 text-xs text-slate-200"
                                >
                                    <option value="">Select Type</option>
                                    <option value="Full-time">Full-time</option>
                                    <option value="Part-time">Part-time</option>
                                    <option value="Contract">Contract</option>
                                    <option value="Internship">Internship</option>
                                    <option value="Freelance">Freelance</option>
                                </select>
                            </div>
                            <div>
                                <label className="text-xs font-bold text-slate-400 block mb-1.5">Experience Level</label>
                                <select 
                                    value={experienceLevel}
                                    onChange={(e) => setExperienceLevel(e.target.value)}
                                    className="w-full glass-input px-3 py-2 text-xs text-slate-200"
                                >
                                    <option value="Student">Student</option>
                                    <option value="Fresher">Fresher</option>
                                    <option value="Entry Level">Entry Level</option>
                                    <option value="Mid-Senior Level">Mid-Senior Level</option>
                                    <option value="Lead/Architect">Lead/Architect</option>
                                </select>
                            </div>
                            <div>
                                <label className="text-xs font-bold text-slate-400 block mb-1.5">Current Status</label>
                                <select 
                                    value={currentStatus}
                                    onChange={(e) => setCurrentStatus(e.target.value)}
                                    className="w-full glass-input px-3 py-2 text-xs text-slate-200"
                                >
                                    <option value="">Select Status</option>
                                    <option value="Student">Student</option>
                                    <option value="Fresher">Fresher</option>
                                    <option value="Working Professional">Working Professional</option>
                                    <option value="Job Seeker">Job Seeker</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Skills Section */}
                    <div className="glass-panel p-6">
                        <h4 className="font-bold text-white text-sm mb-4 flex items-center gap-2">
                            <Award size={16} className="text-violet-400" /> Skills
                        </h4>
                        
                        <div className="mb-4 p-4 bg-white/5 rounded-xl border border-white/10">
                            <div className="flex gap-2 mb-3">
                                <select 
                                    value={skillCategory}
                                    onChange={(e) => setSkillCategory(e.target.value)}
                                    className="glass-input px-3 py-2 text-xs text-slate-200"
                                >
                                    <option value="programming">Programming</option>
                                    <option value="technical">Technical</option>
                                    <option value="frameworks">Frameworks</option>
                                    <option value="databases">Databases</option>
                                    <option value="cloud">Cloud</option>
                                    <option value="tools">Tools</option>
                                    <option value="languages">Languages</option>
                                    <option value="softSkills">Soft Skills</option>
                                </select>
                                <input 
                                    type="text"
                                    value={skillInput}
                                    onChange={(e) => setSkillInput(e.target.value)}
                                    className="flex-1 glass-input px-3 py-2 text-xs text-slate-200"
                                    placeholder="Add a skill"
                                    onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), handleAddSkill())}
                                />
                                <button 
                                    type="button" 
                                    onClick={handleAddSkill}
                                    className="px-3 py-2 rounded-lg bg-violet-600 hover:bg-violet-700 text-white text-xs flex items-center gap-1"
                                >
                                    <Plus size={12} />
                                    Add
                                </button>
                            </div>
                        </div>

                        <div className="space-y-3">
                            {Object.entries(skills).map(([category, skillsList]) => (
                                skillsList.length > 0 && (
                                    <div key={category}>
                                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wide mb-2 block">
                                            {category.replace(/([A-Z])/g, ' $1').trim()}
                                        </label>
                                        <div className="flex flex-wrap gap-2">
                                            {skillsList.map((skill, idx) => (
                                                <span 
                                                    key={idx} 
                                                    className="px-3 py-1 rounded-full text-xs bg-violet-500/20 border border-violet-500/30 text-violet-300 flex items-center gap-2"
                                                >
                                                    {skill}
                                                    <button 
                                                        type="button" 
                                                        onClick={() => handleDeleteSkill(category, skill)}
                                                        className="text-violet-400 hover:text-red-400"
                                                    >
                                                        <X size={10} />
                                                    </button>
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )
                            ))}
                        </div>
                    </div>

                    {/* Social Links */}
                    <div className="glass-panel p-6">
                        <h4 className="font-bold text-white text-sm mb-4 flex items-center gap-2">
                            <Link size={16} className="text-rose-400" /> Social Links
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="text-xs font-bold text-slate-400 block mb-1.5">LinkedIn</label>
                                <input 
                                    type="text"
                                    value={linkedin}
                                    onChange={(e) => setLinkedin(e.target.value)}
                                    className={`w-full glass-input px-3 py-2 text-xs text-slate-200 ${errors.linkedin ? 'border-red-500' : ''}`}
                                    placeholder="https://linkedin.com/in/username"
                                />
                                {errors.linkedin && <span className="text-[10px] text-red-400">{errors.linkedin}</span>}
                            </div>
                            <div>
                                <label className="text-xs font-bold text-slate-400 block mb-1.5">GitHub</label>
                                <input 
                                    type="text"
                                    value={github}
                                    onChange={(e) => setGithub(e.target.value)}
                                    className={`w-full glass-input px-3 py-2 text-xs text-slate-200 ${errors.github ? 'border-red-500' : ''}`}
                                    placeholder="https://github.com/username"
                                />
                                {errors.github && <span className="text-[10px] text-red-400">{errors.github}</span>}
                            </div>
                            <div>
                                <label className="text-xs font-bold text-slate-400 block mb-1.5">Portfolio Website</label>
                                <input 
                                    type="text"
                                    value={portfolio}
                                    onChange={(e) => setPortfolio(e.target.value)}
                                    className="w-full glass-input px-3 py-2 text-xs text-slate-200"
                                    placeholder="https://yourportfolio.com"
                                />
                            </div>
                            <div>
                                <label className="text-xs font-bold text-slate-400 block mb-1.5">Personal Website</label>
                                <input 
                                    type="text"
                                    value={personalWebsite}
                                    onChange={(e) => setPersonalWebsite(e.target.value)}
                                    className="w-full glass-input px-3 py-2 text-xs text-slate-200"
                                    placeholder="https://yourwebsite.com"
                                />
                            </div>
                        </div>
                    </div>

                    {/* About Me Section */}
                    <div className="glass-panel p-6">
                        <h4 className="font-bold text-white text-sm mb-4 flex items-center gap-2">
                            <User size={16} className="text-violet-400" /> About Me
                        </h4>
                        
                        <div className="space-y-4">
                            <div>
                                <label className="text-xs font-bold text-slate-300 block mb-2">Professional Summary</label>
                                <textarea 
                                    value={professionalSummary}
                                    onChange={(e) => setProfessionalSummary(e.target.value)}
                                    rows={3}
                                    className="w-full glass-input px-3 py-2 text-xs text-slate-200 leading-relaxed"
                                    placeholder="Brief overview of your professional background..."
                                />
                            </div>

                            <div>
                                <label className="text-xs font-bold text-slate-300 block mb-2">Career Objective</label>
                                <textarea 
                                    value={careerObjective}
                                    onChange={(e) => setCareerObjective(e.target.value)}
                                    rows={2}
                                    className="w-full glass-input px-3 py-2 text-xs text-slate-200 leading-relaxed"
                                    placeholder="Your career goals and aspirations..."
                                />
                            </div>

                            <div>
                                <label className="text-xs font-bold text-slate-300 block mb-1.5">Interests</label>
                                <div className="flex gap-2 mb-2">
                                    <input 
                                        type="text"
                                        value={interestInput}
                                        onChange={(e) => setInterestInput(e.target.value)}
                                        className="flex-1 glass-input px-3 py-2 text-xs text-slate-200"
                                        placeholder="Add interest"
                                        onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addInterest())}
                                    />
                                    <button 
                                        type="button" 
                                        onClick={addInterest}
                                        className="px-3 py-2 rounded-lg bg-violet-600 hover:bg-violet-700 text-white text-xs"
                                    >
                                        Add
                                    </button>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    {interests.map((item, idx) => (
                                        <span key={idx} className="px-2 py-1 rounded text-xs bg-white/5 border border-white/10 text-slate-300 flex items-center gap-2">
                                            {item}
                                            <button 
                                                type="button" 
                                                onClick={() => removeInterest(item)} 
                                                className="text-slate-500 hover:text-red-400"
                                            >
                                                <X size={10} />
                                            </button>
                                        </span>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <label className="text-xs font-bold text-slate-300 block mb-1.5">Achievements</label>
                                <div className="flex gap-2 mb-2">
                                    <input 
                                        type="text"
                                        value={achievementInput}
                                        onChange={(e) => setAchievementInput(e.target.value)}
                                        className="flex-1 glass-input px-3 py-2 text-xs text-slate-200"
                                        placeholder="Add achievement"
                                        onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addAchievement())}
                                    />
                                    <button 
                                        type="button" 
                                        onClick={addAchievement}
                                        className="px-3 py-2 rounded-lg bg-violet-600 hover:bg-violet-700 text-white text-xs"
                                    >
                                        Add
                                    </button>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    {achievements.map((item, idx) => (
                                        <span key={idx} className="px-2 py-1 rounded text-xs bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 flex items-center gap-2">
                                            <CheckCircle size={10} />
                                            {item}
                                            <button 
                                                type="button" 
                                                onClick={() => removeAchievement(idx)} 
                                                className="text-emerald-400 hover:text-red-400"
                                            >
                                                <X size={10} />
                                            </button>
                                        </span>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <label className="text-xs font-bold text-slate-300 block mb-1.5">Languages Known</label>
                                <div className="flex gap-2 mb-2">
                                    <input 
                                        type="text"
                                        value={languageInput}
                                        onChange={(e) => setLanguageInput(e.target.value)}
                                        className="flex-1 glass-input px-3 py-2 text-xs text-slate-200"
                                        placeholder="Add language"
                                        onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addLanguage())}
                                    />
                                    <button 
                                        type="button" 
                                        onClick={addLanguage}
                                        className="px-3 py-2 rounded-lg bg-violet-600 hover:bg-violet-700 text-white text-xs"
                                    >
                                        Add
                                    </button>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    {languagesKnown.map((item, idx) => (
                                    <span key={idx} className="px-2 py-1 rounded text-xs bg-cyan-500/20 border border-cyan-500/30 text-cyan-300 flex items-center gap-2">
                                        <LanguagesIcon size={10} />
                                        {item}
                                        <button 
                                            type="button" 
                                            onClick={() => removeLanguage(item)} 
                                            className="text-cyan-400 hover:text-red-400"
                                        >
                                            <X size={10} />
                                        </button>
                                    </span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Submit Row */}
                    <div className="flex justify-between items-center bg-white/1 p-4 rounded-2xl border border-white/5">
                        <span className={`text-xs font-bold ${saveStatus.includes('error') || saveStatus.includes('fix') ? 'text-red-400' : 'text-slate-400'}`}>{saveStatus}</span>
                        <button type="submit" className="px-5 py-2.5 rounded-xl font-bold bg-violet-600 hover:bg-violet-700 text-white text-xs transition-all flex items-center gap-2">
                            <Save size={14} />
                            Save Profile
                        </button>
                    </div>
                </div>

            </form>
        </div>
    );
}
