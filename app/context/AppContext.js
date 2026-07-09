"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

const AppContext = createContext();

// Mock Initial Databases
const DEFAULT_JOBS = [
    {
        id: "job-1",
        title: "Software Engineer (SDE-1)",
        companyName: "Google India",
        companyLogo: "🤖",
        category: "Software Development",
        salaryRange: "₹15,00,000 - ₹25,00,000 / year",
        location: "Bengaluru, Karnataka",
        isRemote: false,
        isFeatured: true,
        isSponsored: true,
        applicationUrl: "https://www.google.com/about/careers/applications/",
        expiryDate: "2026-12-31",
        clicks: 345,
        views: 1200,
        applications: 45
    },
    {
        id: "job-2",
        title: "System Engineer / Developer",
        companyName: "Tata Consultancy Services (TCS)",
        companyLogo: "💻",
        category: "Software Development",
        salaryRange: "₹4,50,000 - ₹8,00,000 / year",
        location: "Mumbai, Maharashtra",
        isRemote: false,
        isFeatured: true,
        isSponsored: true,
        applicationUrl: "https://www.tcs.com/careers",
        expiryDate: "2026-10-31",
        clicks: 180,
        views: 650,
        applications: 32
    },
    {
        id: "job-3",
        title: "AWS Cloud DevOps Associate",
        companyName: "Amazon Web Services (AWS) India",
        companyLogo: "☁️",
        category: "Cloud Engineering",
        salaryRange: "₹12,00,000 - ₹20,00,000 / year",
        location: "Hyderabad, Telangana",
        isRemote: true,
        isFeatured: false,
        isSponsored: false,
        applicationUrl: "https://www.amazon.jobs/",
        expiryDate: "2026-09-30",
        clicks: 89,
        views: 400,
        applications: 12
    }
];

const DEFAULT_BOOTCAMPS = [
    {
        id: "bc-1",
        name: "Full Stack Software Engineering",
        bannerUrl: "💻",
        description: "12-week intensive training program covering Next.js, Node.js, databases, and system design. Guided by AlmaBetter.",
        price: 120000,
        duration: "12 Weeks",
        placementRate: 94.5,
        scholarship: "Up to 50% Merit-Based",
        affiliateLink: "https://www.almabetter.com/",
        isSponsored: true,
        category: "Coding Bootcamp"
    },
    {
        id: "bc-2",
        name: "UPSC Civil Services Foundation",
        bannerUrl: "🏛️",
        description: "Comprehensive preparation modules for IAS/IPS prelims and mains. Mock interview panels and regular answer training by Drishti IAS.",
        price: 75000,
        duration: "12 Months",
        placementRate: 12.4,
        scholarship: "Need-Based Fee Waiver Available",
        affiliateLink: "https://www.drishtiias.com/",
        isSponsored: true,
        category: "UPSC"
    },
    {
        id: "bc-3",
        name: "Advanced Product Design Bootcamp",
        bannerUrl: "🎨",
        description: "Master UI/UX research, Figma component styling, wireframing, and interactive design methodologies. Directed by Designerrs Academy.",
        price: 65000,
        duration: "8 Weeks",
        placementRate: 88.0,
        scholarship: "None",
        affiliateLink: "https://designerrs.com/",
        isSponsored: false,
        category: "Design"
    }
];

const DEFAULT_MENTORS = [
    {
        id: "mentor-1",
        name: "Sarah Jenkins",
        avatar: "👩‍💻",
        bio: "Senior Engineering Manager at Google India. 10+ years experience guiding tech team scaling operations and software careers.",
        skills: ["Software Architecture", "Career Planning", "System Design", "React"],
        experience: "12 Years (Google, Meta)",
        hourlyRate: 2500,
        availableSlots: ["Mon 10:00 AM", "Mon 02:00 PM", "Wed 11:00 AM", "Fri 04:00 PM"],
        rating: 4.9,
        reviewsCount: 42,
        zoomLink: "https://zoom.us/j/sarah-jenkins"
    },
    {
        id: "mentor-2",
        name: "Aarav Mehta",
        avatar: "👨‍💼",
        bio: "Experienced UPSC Counselor and former academy trainer. Expert in general studies syllabus mapping and strategy prep.",
        skills: ["Civics Strategy", "Interview Practice", "Study Planning", "Motivation"],
        experience: "8 Years (Civil Prep Academy)",
        hourlyRate: 1500,
        availableSlots: ["Tue 09:00 AM", "Thu 03:00 PM", "Sat 10:00 AM"],
        rating: 4.8,
        reviewsCount: 29,
        zoomLink: "https://zoom.us/j/aarav-mehta"
    },
    {
        id: "mentor-3",
        name: "Elisa Thorne",
        avatar: "👩‍🎨",
        bio: "Lead Product Designer at Linear. Passionate about glassmorphic UI layout structures and Figma systems mapping.",
        skills: ["Figma", "UI/UX Design", "Portfolio Review", "Framer Motion"],
        experience: "6 Years (Linear, Notion)",
        hourlyRate: 2000,
        availableSlots: ["Wed 09:00 AM", "Wed 03:00 PM", "Fri 02:00 PM"],
        rating: 5.0,
        reviewsCount: 15,
        zoomLink: "https://zoom.us/j/elisa-thorne"
    }
];

const DEFAULT_AFFILIATES = [
    {
        id: "aff-1",
        title: "Google Data Analytics Professional Certificate",
        provider: "Coursera",
        affiliateUrl: "https://www.coursera.org/professional-certificates/google-data-analytics",
        duration: "6 Months (10h/week)",
        difficulty: "Beginner",
        rating: 4.8,
        price: 3200,
        discountBadge: "7-Day Free Trial",
        reason: "Matches your analytical background and builds fundamental spreadsheets, SQL, and Tableau capabilities.",
        clicks: 210,
        conversions: 32,
        revenue: 30000
    },
    {
        id: "aff-2",
        title: "Python for Data Science and Machine Learning Bootcamp",
        provider: "Udemy",
        affiliateUrl: "https://www.udemy.com/course/python-for-data-science-and-machine-learning-bootcamp/",
        duration: "25 Hours",
        difficulty: "Intermediate",
        rating: 4.7,
        price: 499,
        discountBadge: "85% Off Discount",
        reason: "Excellent for building portfolio items. Covers NumPy, Pandas, Scikit-Learn, and predictive models.",
        clicks: 430,
        conversions: 84,
        revenue: 25000
    },
    {
        id: "aff-3",
        title: "Become a Cloud Engineer: Microsoft Azure Specialization",
        provider: "Coursera",
        affiliateUrl: "https://www.coursera.org/specializations/microsoft-azure-cloud-engineering",
        duration: "4 Months (8h/week)",
        difficulty: "Intermediate",
        rating: 4.6,
        price: 4000,
        discountBadge: "Financial Aid Available",
        reason: "Fits cloud technology roadmaps. Develops cloud storage, serverless frameworks, and VPC networks expertise.",
        clicks: 125,
        conversions: 18,
        revenue: 18000
    }
];

export function AppProvider({ children }) {
    // Current Session State
    const [currentUser, setCurrentUser] = useState(null); // { id, email, name, role, plan, xp, level, streak, badges, institutionId }
    const [themeMode, setThemeMode] = useState("dark"); // dark, light
    
    // Core SaaS Database Records (Backed by LocalStorage)
    const [jobs, setJobs] = useState(DEFAULT_JOBS);
    const [bootcamps, setBootcamps] = useState(DEFAULT_BOOTCAMPS);
    const [mentors, setMentors] = useState(DEFAULT_MENTORS);
    const [affiliates, setAffiliates] = useState(DEFAULT_AFFILIATES);
    const [bookings, setBookings] = useState([]);
    const [institutions, setInstitutions] = useState([
        {
            id: "inst-1",
            name: "Vanguard Institute of Tech",
            logoUrl: "🏫",
            customDomain: "vanguard.pathfinder.ai",
            primaryColor: "#7c3aed",
            licenseKey: "VANGUARD-2026-X99",
            licenseExpiry: "2027-06-30"
        }
    ]);
    const [scans, setScans] = useState([]);
    const [usersList, setUsersList] = useState({}); // { email: userObject }

    // Usage Tracker Parameters (reloading from localStorage)
    const [usageLimits, setUsageLimits] = useState({
        scansCount: 0,
        chatsCount: 0,
        roadmapsCount: 0
    });

    // Stripe checkout dialog triggers
    const [stripeModalOpen, setStripeModalOpen] = useState(false);
    const [activeCheckoutPlan, setActiveCheckoutPlan] = useState(null);

    // Load initial states from LocalStorage
    useEffect(() => {
        const localTheme = localStorage.getItem("pf_theme") || "dark";
        setThemeMode(localTheme);
        document.body.classList.toggle("light-theme", localTheme === "light");

        // Load mock databases
        const savedJobs = localStorage.getItem("pf_jobs");
        if (savedJobs) setJobs(JSON.parse(savedJobs));

        const savedBootcamps = localStorage.getItem("pf_bootcamps");
        if (savedBootcamps) setBootcamps(JSON.parse(savedBootcamps));

        const savedMentors = localStorage.getItem("pf_mentors");
        if (savedMentors) setMentors(JSON.parse(savedMentors));

        const savedAffiliates = localStorage.getItem("pf_affiliates");
        if (savedAffiliates) setAffiliates(JSON.parse(savedAffiliates));

        const savedBookings = localStorage.getItem("pf_bookings");
        if (savedBookings) setBookings(JSON.parse(savedBookings));

        const savedScans = localStorage.getItem("pf_scans");
        if (savedScans) setScans(JSON.parse(savedScans));

        const savedUsers = localStorage.getItem("pf_users_db") || "{}";
        setUsersList(JSON.parse(savedUsers));

        // Check active session user
        const activeEmail = localStorage.getItem("pf_active_email");
        if (activeEmail) {
            const db = JSON.parse(savedUsers);
            if (db[activeEmail]) {
                setCurrentUser(db[activeEmail]);
                // Load active usage metrics
                const usage = localStorage.getItem(`pf_usage_${db[activeEmail].id}`) || '{"scansCount":0,"chatsCount":0,"roadmapsCount":0}';
                setUsageLimits(JSON.parse(usage));
            }
        }
    }, []);

    // Theme Toggle Handler
    const toggleTheme = () => {
        const nextTheme = themeMode === "dark" ? "light" : "dark";
        setThemeMode(nextTheme);
        localStorage.setItem("pf_theme", nextTheme);
        document.body.classList.toggle("light-theme", nextTheme === "light");
    };

    // User Authentication Handlers
    const registerUser = (name, email, password, role = "CANDIDATE") => {
        const nextUsers = { ...usersList };
        if (nextUsers[email]) {
            alert("User already registered.");
            return false;
        }

        const newUser = {
            id: `usr-${Date.now()}`,
            name,
            email,
            password, // Stored directly as plaintext in mock context database
            role,
            plan: "FREE",
            xp: 0,
            level: 1,
            streak: 1,
            badges: JSON.stringify(["explorer"]),
            referralCode: `REF-${name.replace(/\s+/g, "").toUpperCase()}-${Math.floor(100 + Math.random() * 900)}`,
            referralDaysEarned: 0,
            createdAt: new Date().toLocaleDateString()
        };

        nextUsers[email] = newUser;
        setUsersList(nextUsers);
        localStorage.setItem("pf_users_db", JSON.stringify(nextUsers));
        
        // Log user in automatically
        loginUser(email, password);
        return true;
    };

    const loginUser = (email, password) => {
        if (!usersList[email] || usersList[email].password !== password) {
            return false;
        }

        const user = usersList[email];
        setCurrentUser(user);
        localStorage.setItem("pf_active_email", email);

        // Load usage
        const usage = localStorage.getItem(`pf_usage_${user.id}`) || '{"scansCount":0,"chatsCount":0,"roadmapsCount":0}';
        setUsageLimits(JSON.parse(usage));

        // Track last active streak checking
        const todayStr = new Date().toLocaleDateString();
        const lastActive = localStorage.getItem(`pf_last_active_${user.id}`);
        
        if (lastActive && lastActive !== todayStr) {
            const yesterday = new Date();
            yesterday.setDate(yesterday.getDate() - 1);
            const yesterdayStr = yesterday.toLocaleDateString();
            
            let currentStreak = user.streak;
            if (lastActive === yesterdayStr) {
                currentStreak++;
            } else {
                currentStreak = 1; // reset streak
            }
            
            const updatedUser = { ...user, streak: currentStreak };
            usersList[email] = updatedUser;
            setUsersList(usersList);
            setCurrentUser(updatedUser);
            localStorage.setItem("pf_users_db", JSON.stringify(usersList));
        }
        localStorage.setItem(`pf_last_active_${user.id}`, todayStr);

        return true;
    };

    const loginWithGoogle = (name, email) => {
        // Read latest users DB
        const savedUsers = localStorage.getItem("pf_users_db") || "{}";
        const db = JSON.parse(savedUsers);
        
        if (!db[email]) {
            // Register them automatically
            const newUser = {
                id: `usr-${Date.now()}`,
                name,
                email,
                password: "google-oauth-sso-token",
                role: "CANDIDATE",
                plan: "FREE",
                xp: 0,
                level: 1,
                streak: 1,
                badges: JSON.stringify(["explorer"]),
                referralCode: `REF-${name.replace(/\s+/g, "").toUpperCase()}-${Math.floor(100 + Math.random() * 900)}`,
                referralDaysEarned: 0,
                createdAt: new Date().toLocaleDateString()
            };
            db[email] = newUser;
            localStorage.setItem("pf_users_db", JSON.stringify(db));
            setUsersList(db);
        }
        
        // Log user in
        const user = db[email];
        setCurrentUser(user);
        localStorage.setItem("pf_active_email", email);

        // Load usage limits
        const usage = localStorage.getItem(`pf_usage_${user.id}`) || '{"scansCount":0,"chatsCount":0,"roadmapsCount":0}';
        setUsageLimits(JSON.parse(usage));

        // Track last active streak checking
        const todayStr = new Date().toLocaleDateString();
        localStorage.setItem(`pf_last_active_${user.id}`, todayStr);
        return true;
    };

    const logoutUser = () => {
        setCurrentUser(null);
        localStorage.removeItem("pf_active_email");
        setUsageLimits({ scansCount: 0, chatsCount: 0, roadmapsCount: 0 });
    };

    // Subscriptions Pricing & Upgrade Controls
    const launchStripeCheckout = (plan) => {
        setActiveCheckoutPlan(plan);
        setStripeModalOpen(true);
    };

    const completeMockSubscription = () => {
        if (!currentUser) return;

        const updatedUser = { ...currentUser, plan: activeCheckoutPlan };
        const nextUsers = { ...usersList };
        nextUsers[currentUser.email] = updatedUser;
        
        setUsersList(nextUsers);
        setCurrentUser(updatedUser);
        localStorage.setItem("pf_users_db", JSON.stringify(nextUsers));
        localStorage.setItem("pf_active_email", currentUser.email);
        
        setStripeModalOpen(false);
        setActiveCheckoutPlan(null);
        alert(`Successfully upgraded to ${updatedUser.plan} Subscription!`);
    };

    // Usage Incrementor / Limit Checking Helper
    const checkUsageLimit = (type, limitMax) => {
        if (!currentUser) return false;
        
        // Pro users have unlimited access
        if (currentUser.plan === "PRO" || currentUser.plan === "ENTERPRISE") return true;

        const currentVal = usageLimits[type] || 0;
        if (currentVal >= limitMax) {
            alert(`You have reached your Free Tier monthly limit for this resource (${limitMax}). Please upgrade to Pro to continue.`);
            return false;
        }

        // Increment count
        const nextUsage = { ...usageLimits, [type]: currentVal + 1 };
        setUsageLimits(nextUsage);
        localStorage.setItem(`pf_usage_${currentUser.id}`, JSON.stringify(nextUsage));
        return true;
    };

    // Gamification Reward Mechanism
    const earnXP = (amount) => {
        if (!currentUser) return;

        const nextXP = currentUser.xp + amount;
        const nextLevel = Math.floor(nextXP / 500) + 1;
        
        const updatedUser = { ...currentUser, xp: nextXP, level: nextLevel };
        
        // Check for level up badges
        let badges = JSON.parse(updatedUser.badges);
        if (nextLevel >= 2 && !badges.includes("tech_enthusiast")) badges.push("tech_enthusiast");
        if (nextLevel >= 3 && !badges.includes("fast_learner")) badges.push("fast_learner");
        if (nextXP >= 1000 && !badges.includes("master")) badges.push("master");
        updatedUser.badges = JSON.stringify(badges);

        const nextUsers = { ...usersList };
        nextUsers[currentUser.email] = updatedUser;
        
        setUsersList(nextUsers);
        setCurrentUser(updatedUser);
        localStorage.setItem("pf_users_db", JSON.stringify(nextUsers));
    };

    // Sponsored Jobs Board Operations
    const createJobListing = (jobData) => {
        const newJob = {
            id: `job-${Date.now()}`,
            clicks: 0,
            views: 0,
            applications: 0,
            isFeatured: jobData.isFeatured || false,
            isSponsored: jobData.isSponsored || false,
            ...jobData
        };

        const updatedJobs = [newJob, ...jobs];
        setJobs(updatedJobs);
        localStorage.setItem("pf_jobs", JSON.stringify(updatedJobs));
        return true;
    };

    // Booking a Mentor session
    const bookMentorSession = (mentorId, slot, price) => {
        if (!currentUser) return false;

        const newBooking = {
            id: `bk-${Date.now()}`,
            studentId: currentUser.id,
            mentorId: mentorId,
            slot: slot,
            paymentStatus: "PAID", // Automatically marks PAID in our mock checkouts
            meetingLink: `https://meet.google.com/mock-id-${Math.floor(1000 + Math.random()*9000)}`,
            createdAt: new Date().toLocaleString()
        };

        const updatedBookings = [...bookings, newBooking];
        setBookings(updatedBookings);
        localStorage.setItem("pf_bookings", JSON.stringify(updatedBookings));

        // Deduct/Track 20% platform commission from mentor profile
        const commission = price * 0.20;
        alert(`Booking Confirmed! $${price} paid ($${commission} platform commission deducted). Meeting Link created!`);
        return true;
    };

    // Add a parsed resume scan
    const saveResumeScan = (scanRecord) => {
        if (!currentUser) return;

        const newScan = {
            id: `scan-${Date.now()}`,
            userId: currentUser.id,
            createdAt: new Date().toLocaleDateString(),
            ...scanRecord
        };

        const updatedScans = [newScan, ...scans];
        setScans(updatedScans);
        localStorage.setItem("pf_scans", JSON.stringify(updatedScans));
    };

    const updateCurrentUser = (updatedFields) => {
        if (!currentUser) return;
        
        // Read latest users DB to prevent overwrite conflicts
        const savedUsers = localStorage.getItem("pf_users_db") || "{}";
        const db = JSON.parse(savedUsers);

        const updatedUser = { ...currentUser, ...updatedFields };
        db[currentUser.email] = updatedUser;
        
        setUsersList(db);
        setCurrentUser(updatedUser);
        localStorage.setItem("pf_users_db", JSON.stringify(db));
    };

    return (
        <AppContext.Provider value={{
            currentUser,
            themeMode,
            toggleTheme,
            jobs,
            bootcamps,
            mentors,
            affiliates,
            bookings,
            scans,
            institutions,
            usageLimits,
            registerUser,
            loginUser,
            loginWithGoogle,
            logoutUser,
            launchStripeCheckout,
            stripeModalOpen,
            setStripeModalOpen,
            activeCheckoutPlan,
            completeMockSubscription,
            checkUsageLimit,
            earnXP,
            createJobListing,
            bookMentorSession,
            saveResumeScan,
            updateCurrentUser
        }}>
            {children}
        </AppContext.Provider>
    );
}

export function useApp() {
    return useContext(AppContext);
}
