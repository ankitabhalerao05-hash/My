/* ==========================================================================
   Global State & Data Definitions
   ========================================================================== */
let currentStep = 1;
const selectedSkills = new Set();
let radarChartInstance = null;
let companyTargetChartInstance = null;
let userData = {};
let predictionResults = {};
let chatHistory = []; 
let currentUser = null; // Currently logged-in username

// Skill Definitions
const TECH_SKILLS = [
    { id: "Python", name: "Python", category: "tech", icon: "code" },
    { id: "Java", name: "Java", category: "tech", icon: "code" },
    { id: "C++", name: "C++ / C#", category: "tech", icon: "code" },
    { id: "HTML_CSS", name: "HTML & CSS", category: "tech", icon: "layout" },
    { id: "JavaScript", name: "JavaScript / TS", category: "tech", icon: "braces" },
    { id: "SQL", name: "SQL & Databases", category: "tech", icon: "database" },
    { id: "Machine_Learning", name: "Machine Learning", category: "tech", icon: "cpu" },
    { id: "Data_Analysis", name: "Data Analysis", category: "tech", icon: "pie-chart" }
];

const GOVT_ACADEMIC_SKILLS = [
    { id: "History", name: "History & Culture", category: "govt", icon: "book-open" },
    { id: "Geography", name: "Geography & Ecology", category: "govt", icon: "globe" },
    { id: "Polity", name: "Polity & Constitution", category: "govt", icon: "shield" },
    { id: "Economics", name: "Indian Economics", category: "govt", icon: "trending-up" },
    { id: "General_Science", name: "General Science", category: "govt", icon: "flask" },
    { id: "Current_Affairs", name: "Current Affairs & GK", category: "govt", icon: "newspaper" },
    { id: "State_GK", name: "State GK & Geography", category: "govt", icon: "map" },
    { id: "Pedagogy", name: "Pedagogy & Child Dev.", category: "govt", icon: "users" },
    { id: "Quantitative_Aptitude", name: "Quantitative Aptitude", category: "govt", icon: "binary" },
    { id: "Reasoning_Ability", name: "Logical Reasoning", category: "govt", icon: "help-circle" },
    { id: "General_English", name: "General English", category: "govt", icon: "languages" },
    { id: "Banking_Awareness", name: "Banking Awareness", category: "govt", icon: "landmark" }
];

// Career Path Database
const CAREER_PATHS = {
    "Software Engineer": {
        domain: "private",
        coreSkills: ["Python", "Java", "C++", "HTML_CSS", "JavaScript"],
        softWeights: { communication: 0.2, problem_solving: 0.5, teamwork: 0.2, leadership: 0.1 },
        salary: "$115,000 / ₹12-25 LPA",
        growth: "+25% (Much faster than average)",
        description: "Develops, tests, and maintains software applications and systems. Crucial role in tech companies.",
        certRecommendations: ["AWS Certified Developer", "Oracle Java SE Certification"],
        projectSuggestions: ["Full-stack E-commerce Web App", "RESTful API with Node.js/Python", "Custom Compiler or Shell"],
        resumeKeywords: ["software", "developer", "coding", "git", "database", "python", "javascript", "java", "c++", "frontend", "backend", "api", "algorithms", "data structures"]
    },
    "Data Scientist": {
        domain: "private",
        coreSkills: ["Python", "SQL", "Machine_Learning", "Data_Analysis"],
        softWeights: { communication: 0.3, problem_solving: 0.4, teamwork: 0.2, leadership: 0.1 },
        salary: "$122,000 / ₹15-30 LPA",
        growth: "+35% (Extremely high demand)",
        description: "Analyzes complex data to help organizations make strategic decisions using ML and statistical modeling.",
        certRecommendations: ["Google Professional Data Engineer", "Microsoft Certified: Azure Data Scientist"],
        projectSuggestions: ["Predictive Housing Price Model", "Sentiment Analysis on Social Media Data", "Interactive Tableau/PowerBI Dashboard"],
        resumeKeywords: ["data", "science", "machine learning", "statistics", "python", "sql", "analysis", "pandas", "visualization", "r", "tableau", "modeling", "predictive", "regression"]
    },
    "UX/UI Designer": {
        domain: "private",
        coreSkills: ["HTML_CSS", "Figma", "JavaScript"],
        softWeights: { communication: 0.4, problem_solving: 0.2, teamwork: 0.3, leadership: 0.1 },
        salary: "$92,000 / ₹8-18 LPA",
        growth: "+16% (Faster than average)",
        description: "Designs the interface and user journey of digital products, ensuring they are intuitive and visually stunning.",
        certRecommendations: ["Google UX Design Professional Certificate", "Interaction Design Foundation Certs"],
        projectSuggestions: ["Redesign of a Local Business Website", "Mobile App UI Case Study with User Research", "Interactive High-Fidelity Figma Prototype"],
        resumeKeywords: ["design", "ui", "ux", "figma", "wireframe", "prototype", "user research", "visual", "adobe", "layout", "user experience", "usability", "interface", "sketch"]
    },
    "Product Manager": {
        domain: "private",
        coreSkills: ["Data_Analysis", "Agile_Scrum"],
        softWeights: { communication: 0.4, problem_solving: 0.2, teamwork: 0.2, leadership: 0.2 },
        salary: "$110,000 / ₹14-28 LPA",
        growth: "+10% (Steady growth)",
        description: "Guides the product lifecycle, defining product vision, collaborating with engineering, and prioritizing features.",
        certRecommendations: ["Certified Scrum Product Owner (CSPO)", "Product School Product Manager Certificate"],
        projectSuggestions: ["Comprehensive Product Requirements Document (PRD)", "Market Competitor Analysis Report", "Feature Launch Strategy and Roadmap"],
        resumeKeywords: ["product", "manager", "agile", "scrum", "roadmap", "strategy", "prd", "market research", "metrics", "analytics", "cross-functional", "wireframe", "lifecycle", "launch"]
    },
    "UPSC Civil Services (IAS/IPS)": {
        domain: "government",
        examType: "upsc",
        coreSkills: ["History", "Geography", "Polity", "Economics", "Current_Affairs", "Reasoning_Ability"],
        softWeights: { communication: 0.3, problem_solving: 0.3, teamwork: 0.1, leadership: 0.3 },
        salary: "₹70,000 - ₹2,500,000/month (IAS/IPS)",
        growth: "Highest Social Prestige & Policy Impact",
        description: "Administers public services, maintains law and order, and executes government policy at district, state, and national levels.",
        certRecommendations: ["Civil Services Foundation Course", "Public Administration Certificate"],
        projectSuggestions: ["Analysis of a Local Public Policy Scheme", "Case Study on District Administrative Reform", "Social Service Volunteering Portfolio"],
        resumeKeywords: ["civil services", "upsc", "general studies", "history", "polity", "geography", "economics", "current affairs", "public administration", "administration", "governance", "social", "policy"]
    },
    "MPSC State Services (DySP/Deputy Collector)": {
        domain: "government",
        examType: "mpsc",
        coreSkills: ["History", "Geography", "Polity", "Economics", "State_GK", "Current_Affairs", "Reasoning_Ability"],
        softWeights: { communication: 0.3, problem_solving: 0.3, teamwork: 0.2, leadership: 0.2 },
        salary: "₹56,100 - ₹1,77,500/month (Class-I)",
        growth: "Excellent State Administration Career",
        description: "Serves in the state administration of Maharashtra, managing revenue, law enforcement, and regional welfare.",
        certRecommendations: ["State Public Policy Seminars", "Marathi Language Proficiency"],
        projectSuggestions: ["State Agriculture Policy Impact Analysis", "Regional Water Management Case Study", "Local Panchayati Raj Governance Audit"],
        resumeKeywords: ["mpsc", "state services", "maharashtra", "marathi", "general studies", "history", "polity", "geography", "economics", "regional", "state", "administration", "public service"]
    },
    "Railway Recruitment Board (RRB Officer)": {
        domain: "government",
        examType: "railway",
        coreSkills: ["Quantitative_Aptitude", "Reasoning_Ability", "General_Science", "Current_Affairs"],
        softWeights: { communication: 0.2, problem_solving: 0.4, teamwork: 0.3, leadership: 0.1 },
        salary: "₹45,000 - ₹1,10,000/month (NTPC/Technical)",
        growth: "High Job Security & Railway Welfare Perks",
        description: "Manages railway traffic, station administration, logistics, and technical maintenance for Indian Railways.",
        certRecommendations: ["Logistics & Supply Chain Diploma", "Railway Safety Standards Cert"],
        projectSuggestions: ["Railway Traffic Congestion Modeling", "Public Transit Operations Case Study", "Basic Electronics/Mechanical Safety Design"],
        resumeKeywords: ["railway", "rrb", "aptitude", "reasoning", "technical", "logistics", "maintenance", "operations", "engineering", "safety", "science", "general awareness", "ntpc"]
    },
    "Banking Officer (SBI PO / IBPS)": {
        domain: "government",
        examType: "banking",
        coreSkills: ["Quantitative_Aptitude", "Reasoning_Ability", "General_English", "Banking_Awareness"],
        softWeights: { communication: 0.4, problem_solving: 0.3, teamwork: 0.2, leadership: 0.1 },
        salary: "₹65,000 - ₹1,20,000/month (Scale-I)",
        growth: "Rapid Promotions & Financial Sector Perks",
        description: "Manages branch operations, loan approvals, customer relations, and business growth for public sector banks.",
        certRecommendations: ["JAIIB/CAIIB Banking Certifications", "Financial Risk Management (FRM)"],
        projectSuggestions: ["Micro-Finance Lending Case Study", "Aptitude and Logic Prep Tracker", "Analysis of NPA (Non-Performing Asset) Management"],
        resumeKeywords: ["banking", "bank", "finance", "accounts", "aptitude", "quantitative", "reasoning", "english", "economics", "audit", "clerk", "po", "loan", "customer service", "ledger"]
    },
    "Government Teacher (TET/NET Educator)": {
        domain: "government",
        examType: "teaching",
        coreSkills: ["Pedagogy", "Child_Development", "General_English", "Current_Affairs"],
        softWeights: { communication: 0.5, problem_solving: 0.1, teamwork: 0.2, leadership: 0.2 },
        salary: "₹42,000 - ₹95,000/month",
        growth: "Work-Life Balance & Education Pension",
        description: "Educates students in government schools, designs curriculum, and contributes to child development and academic success.",
        certRecommendations: ["B.Ed / D.El.Ed Degree", "CTET / State TET Qualifying Certificate", "UGC NET for Lecturership"],
        projectSuggestions: ["Interactive Classroom Lesson Plan Design", "Child Psychology Case Study", "Digital Learning Resource Portfolio"],
        resumeKeywords: ["teaching", "education", "teacher", "pedagogy", "child development", "lesson plan", "classroom", "school", "instruction", "lecture", "learning", "tet", "ctet", "academic"]
    }
};

// Target Companies & Organizations Database
const TARGET_COMPANIES = {
    "Software Engineer": [
        { name: "Google", package: 28, volume: 85 },
        { name: "Microsoft", package: 32, volume: 70 },
        { name: "Razorpay", package: 16, volume: 90 },
        { name: "TCS / Infosys", package: 5.5, volume: 98 }
    ],
    "Data Scientist": [
        { name: "Amazon", package: 26, volume: 75 },
        { name: "Fractal Analytics", package: 14, volume: 88 },
        { name: "Mu Sigma", package: 8, volume: 95 },
        { name: "Accenture", package: 9.5, volume: 90 }
    ],
    "UX/UI Designer": [
        { name: "Figma", package: 22, volume: 60 },
        { name: "Canva", package: 18, volume: 70 },
        { name: "Zomato", package: 12, volume: 85 },
        { name: "Cognizant", package: 6.5, volume: 92 }
    ],
    "Product Manager": [
        { name: "Uber", package: 30, volume: 65 },
        { name: "Paytm", package: 15, volume: 80 },
        { name: "Flipkart", package: 20, volume: 75 },
        { name: "Deloitte", package: 11, volume: 85 }
    ],
    "UPSC Civil Services (IAS/IPS)": [
        { name: "Central Govt (IAS)", package: 18, volume: 100 },
        { name: "Home Ministry (IPS)", package: 15, volume: 85 },
        { name: "Foreign Ministry (IFS)", package: 16, volume: 60 },
        { name: "State Secretariats", package: 12, volume: 90 }
    ],
    "MPSC State Services (DySP/Deputy Collector)": [
        { name: "Revenue Dept", package: 12, volume: 95 },
        { name: "Police Dept (DySP)", package: 12, volume: 80 },
        { name: "Finance Dept", package: 11, volume: 85 },
        { name: "Administration Dept", package: 10.5, volume: 90 }
    ],
    "Railway Recruitment Board (RRB Officer)": [
        { name: "NTPC Admin", package: 9.5, volume: 95 },
        { name: "Technical Cadres", package: 10, volume: 88 },
        { name: "Traffic & Operations", package: 9.8, volume: 85 },
        { name: "Security (RPF)", package: 8.5, volume: 75 }
    ],
    "Banking Officer (SBI PO / IBPS)": [
        { name: "Reserve Bank (Grade B)", package: 18, volume: 55 },
        { name: "State Bank of India", package: 11, volume: 95 },
        { name: "Bank of Baroda", package: 9.5, volume: 90 },
        { name: "Punjab National Bank", package: 9.2, volume: 88 }
    ],
    "Government Teacher (TET/NET Educator)": [
        { name: "Colleges (Asst Prof)", package: 14, volume: 65 },
        { name: "Central Schools (KVS)", package: 8.5, volume: 92 },
        { name: "Navodaya Vidyalayas", package: 8.0, volume: 85 },
        { name: "State Govt Schools", package: 7.2, volume: 98 }
    ]
};

// Active Vacancies Database
const VACANCIES = {
    "Software Engineer": [
        { title: "Software Engineer I", company: "Google", location: "Bengaluru", package: "₹18 - 35 LPA", url: "https://careers.google.com" },
        { title: "Frontend Developer", company: "Razorpay", location: "Remote / Pune", package: "₹12 - 18 LPA", url: "https://razorpay.com/jobs" },
        { title: "Systems Engineer", company: "TCS", location: "Mumbai", package: "₹4.5 - 7 LPA", url: "https://www.tcs.com/careers" }
    ],
    "Data Scientist": [
        { title: "Associate Data Scientist", company: "Fractal Analytics", location: "Mumbai", package: "₹10 - 15 LPA", url: "https://fractal.ai" },
        { title: "Data Scientist", company: "Amazon", location: "Hyderabad", package: "₹20 - 40 LPA", url: "https://amazon.jobs" },
        { title: "Junior Data Analyst", company: "Mu Sigma", location: "Bengaluru", package: "₹6 - 8 LPA", url: "https://www.mu-sigma.com" }
    ],
    "UX/UI Designer": [
        { title: "Product Designer", company: "Zomato", location: "Gurugram", package: "₹9 - 14 LPA", url: "https://www.zomato.com/careers" },
        { title: "UX Designer", company: "Canva", location: "Remote", package: "₹12 - 20 LPA", url: "https://www.canva.com/careers" },
        { title: "UI Developer", company: "Cognizant", location: "Chennai", package: "₹5 - 8 LPA", url: "https://careers.cognizant.com" }
    ],
    "Product Manager": [
        { title: "Associate Product Manager", company: "Flipkart", location: "Bengaluru", package: "₹15 - 22 LPA", url: "https://careers.flipkart.com" },
        { title: "Product Manager - Tech", company: "Uber", location: "Bengaluru", package: "₹25 - 40 LPA", url: "https://www.uber.com/careers" },
        { title: "Management Consultant", company: "Deloitte", location: "Mumbai", package: "₹10 - 15 LPA", url: "https://jobs.deloitte.com" }
    ],
    "UPSC Civil Services (IAS/IPS)": [
        { title: "Civil Services Examination 2026", company: "UPSC", location: "All India (IAS/IPS/IFS)", package: "1,056 Vacancies", url: "https://upsc.gov.in" },
        { title: "Combined Defence Services (CDS)", company: "UPSC", location: "Indian Military Academy", package: "418 Vacancies", url: "https://upsc.gov.in" },
        { title: "Assistant Commandant (CAPF)", company: "UPSC", location: "Paramilitary Forces", package: "320 Vacancies", url: "https://upsc.gov.in" }
    ],
    "MPSC State Services (DySP/Deputy Collector)": [
        { title: "State Services Exam 2026", company: "MPSC", location: "Maharashtra", package: "274 Vacancies (Class-I/II)", url: "https://mpsc.gov.in" },
        { title: "Maharashtra Police Service (DySP)", company: "MPSC", location: "Maharashtra Police", package: "45 Vacancies", url: "https://mpsc.gov.in" },
        { title: "Assistant Section Officer (ASO)", company: "MPSC", location: "Mantralaya, Mumbai", package: "120 Vacancies", url: "https://mpsc.gov.in" }
    ],
    "Railway Recruitment Board (RRB Officer)": [
        { title: "RRB NTPC (Officer Cadres)", company: "Indian Railways", location: "Zonal Railways", package: "11,558 Vacancies", url: "https://indianrailways.gov.in" },
        { title: "Section Engineer (RRB SSE)", company: "Indian Railways", location: "Production Units", package: "1,240 Vacancies", url: "https://indianrailways.gov.in" },
        { title: "Junior Engineer (RRB JE)", company: "Indian Railways", location: "Railway Divisions", package: "7,911 Vacancies", url: "https://indianrailways.gov.in" }
    ],
    "Banking Officer (SBI PO / IBPS)": [
        { title: "Probationary Officer (SBI PO)", company: "State Bank of India", location: "Pan India Branches", package: "2,000 Vacancies", url: "https://sbi.co.in/careers" },
        { title: "IBPS PO XIV Recruitment", company: "Public Sector Banks", location: "Nationalized Banks", package: "4,455 Vacancies", url: "https://ibps.in" },
        { title: "Grade B Officer Exam", company: "Reserve Bank of India", location: "RBI Offices", package: "120 Vacancies", url: "https://rbi.org.in" }
    ],
    "Government Teacher (TET/NET Educator)": [
        { title: "PGT/TGT Teacher Recruitment", company: "Kendriya Vidyalaya (KVS)", location: "Central Schools", package: "6,500 Vacancies", url: "https://kvsangathan.nic.in" },
        { title: "CTET August 2026 Examination", company: "CBSE", location: "National Schools", package: "Eligibility Certificate", url: "https://ctet.nic.in" },
        { title: "Assistant Professor (UGC NET)", company: "Universities & Colleges", location: "Higher Education", package: "NET / JRF Awards", url: "https://ugcnet.nta.nic.in" }
    ]
};

/* ==========================================================================
   IndexedDB Storage Helper (Client-side Database for Images)
   ========================================================================== */
const dbName = "PathFinderDB";
const storeName = "portal_assets";

function initDB() {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open(dbName, 1);
        request.onupgradeneeded = (e) => {
            const db = e.target.result;
            if (!db.objectStoreNames.contains(storeName)) {
                db.createObjectStore(storeName, { keyPath: "id" });
            }
        };
        request.onsuccess = (e) => resolve(e.target.result);
        request.onerror = (e) => reject(e.target.error);
    });
}

async function saveAssetToDB(id, data) {
    const db = await initDB();
    return new Promise((resolve, reject) => {
        const transaction = db.transaction(storeName, "readwrite");
        const store = transaction.objectStore(storeName);
        store.put({ id: id, data: data });
        transaction.oncomplete = () => resolve();
        transaction.onerror = () => reject(transaction.error);
    });
}

async function loadAssetFromDB(id) {
    try {
        const db = await initDB();
        return new Promise((resolve, reject) => {
            const transaction = db.transaction(storeName, "readonly");
            const store = transaction.objectStore(storeName);
            const request = store.get(id);
            request.onsuccess = (e) => resolve(e.target.result ? e.target.result.data : null);
            request.onerror = (e) => reject(request.error);
        });
    } catch (err) {
        console.warn("IndexedDB not initialized yet or failed", err);
        return null;
    }
}

async function deleteAssetFromDB(id) {
    const db = await initDB();
    return new Promise((resolve, reject) => {
        const transaction = db.transaction(storeName, "readwrite");
        const store = transaction.objectStore(storeName);
        store.delete(id);
        transaction.oncomplete = () => resolve();
        transaction.onerror = () => reject(transaction.error);
    });
}

async function loadUserCertificates(username) {
    const db = await initDB();
    return new Promise((resolve, reject) => {
        const transaction = db.transaction(storeName, "readonly");
        const store = transaction.objectStore(storeName);
        const request = store.getAll();
        request.onsuccess = (e) => {
            const all = e.target.result || [];
            const prefix = `cert_${username}_`;
            const userCerts = all.filter(item => item.id.startsWith(prefix));
            resolve(userCerts);
        };
        request.onerror = (e) => reject(request.error);
    });
}

/* ==========================================================================
   Initialization
   ========================================================================== */
document.addEventListener("DOMContentLoaded", () => {
    // Initialize Theme
    const savedTheme = localStorage.getItem("theme") || "dark";
    if (savedTheme === "light") {
        document.body.classList.add("light-theme");
        const icon = document.getElementById("theme-toggle-icon");
        if (icon) icon.setAttribute("data-lucide", "moon");
        const authIcon = document.querySelector(".auth-theme-icon");
        if (authIcon) authIcon.setAttribute("data-lucide", "moon");
    }

    lucide.createIcons();

    // Render Skill Grids
    renderSkillTags("skills-grid-tech", TECH_SKILLS);
    renderSkillTags("skills-grid-tools", GOVT_ACADEMIC_SKILLS);

    // Bind Sliders
    setupSliders();
    
    const aptSlider = document.getElementById("input-aptitude");
    const aptVal = document.getElementById("aptitude-val");
    if (aptSlider && aptVal) {
        aptSlider.addEventListener("input", () => {
            aptVal.textContent = aptSlider.value + "/10";
        });
    }

    // Initialize API Key UI
    initApiKeyUI();

    // Check Authentication Session
    checkAuthSession();

    // Setup drag & drop listeners for resume analyzer
    setupResumeDragAndDrop();
});

function renderSkillTags(containerId, skillsList) {
    const container = document.getElementById(containerId);
    container.innerHTML = "";
    
    skillsList.forEach(skill => {
        const tag = document.createElement("div");
        tag.className = "skill-tag";
        tag.setAttribute("data-skill-id", skill.id);
        tag.innerHTML = `
            <i data-lucide="${skill.icon}"></i>
            <span>${skill.name}</span>
        `;
        
        tag.addEventListener("click", () => {
            if (selectedSkills.has(skill.id)) {
                selectedSkills.delete(skill.id);
                tag.classList.remove("selected");
            } else {
                selectedSkills.add(skill.id);
                tag.classList.add("selected");
            }
        });
        
        container.appendChild(tag);
    });
    
    lucide.createIcons();
}

function setupSliders() {
    const sliders = [
        { id: "input-comm", valId: "comm-val", suffix: "/10" },
        { id: "input-problem", valId: "problem-val", suffix: "/10" },
        { id: "input-teamwork", valId: "teamwork-val", suffix: "/10" },
        { id: "input-leadership", valId: "leadership-val", suffix: "/10" }
    ];

    sliders.forEach(slider => {
        const sliderEl = document.getElementById(slider.id);
        const valEl = document.getElementById(slider.valId);
        if (sliderEl && valEl) {
            sliderEl.addEventListener("input", () => {
                valEl.textContent = sliderEl.value + slider.suffix;
            });
        }
    });
}

// API Key UI Functions
function initApiKeyUI() {
    const apiKey = currentUser ? localStorage.getItem(`gemini_api_key_${currentUser}`) : null;
    const apiModel = currentUser ? (localStorage.getItem(`gemini_api_model_${currentUser}`) || "gemini-2.0-flash") : "gemini-2.0-flash";
    const statusDot = document.getElementById("engine-status-dot");
    const statusText = document.getElementById("engine-status-text");
    const keyInput = document.getElementById("input-api-key");
    const modelSelect = document.getElementById("input-api-model");
    
    if (apiKey) {
        statusDot.className = "pulse-dot online";
        statusText.textContent = "Gemini LLM Active";
        if (keyInput) keyInput.value = apiKey;
        if (modelSelect) modelSelect.value = apiModel;
    } else {
        statusDot.className = "pulse-dot";
        statusText.textContent = "Offline Mode";
        if (keyInput) keyInput.value = "";
    }
}

function toggleApiPanel() {
    const panel = document.getElementById("api-config-panel");
    panel.classList.toggle("hidden");
}

function saveApiKey() {
    const keyInput = document.getElementById("input-api-key");
    const modelSelect = document.getElementById("input-api-model");
    const key = keyInput.value.trim();
    
    if (!key) {
        alert("Please enter a valid API Key.");
        return;
    }
    
    if (!currentUser) {
        alert("You must be logged in to save API keys.");
        return;
    }
    
    const model = modelSelect ? modelSelect.value : "gemini-2.0-flash";
    
    localStorage.setItem(`gemini_api_key_${currentUser}`, key);
    localStorage.setItem(`gemini_api_model_${currentUser}`, model);
    initApiKeyUI();
    toggleApiPanel();
    alert("Gemini API settings saved successfully! PathFinder is now running in LLM mode.");
}

function clearApiKey() {
    if (!currentUser) return;
    localStorage.removeItem(`gemini_api_key_${currentUser}`);
    localStorage.removeItem(`gemini_api_model_${currentUser}`);
    const keyInput = document.getElementById("input-api-key");
    if (keyInput) keyInput.value = "";
    initApiKeyUI();
    toggleApiPanel();
    alert("Gemini API settings removed. PathFinder is now running in local offline mode.");
}

/* ==========================================================================
   User Authentication & Session Management
   ========================================================================== */
function checkAuthSession() {
    const sessionUser = localStorage.getItem("current_user");
    const authOverlay = document.getElementById("auth-overlay");
    const appContainer = document.getElementById("app-main-container");
    
    if (sessionUser) {
        currentUser = sessionUser;
        authOverlay.classList.add("hidden");
        appContainer.classList.remove("hidden");
        
        initializeUserPortal();
        initApiKeyUI();
    } else {
        authOverlay.classList.remove("hidden");
        appContainer.classList.add("hidden");
    }
}

function switchAuthView(view) {
    const loginView = document.getElementById("login-view");
    const registerView = document.getElementById("register-view");
    const authCard = document.getElementById("auth-card");
    
    if (view === "login") {
        loginView.classList.remove("hidden");
        registerView.classList.add("hidden");
        authCard.classList.remove("wide-card");
    } else {
        loginView.classList.add("hidden");
        registerView.classList.remove("hidden");
        authCard.classList.add("wide-card");
    }
}

function handleRegister(event) {
    event.preventDefault();
    const userEl = document.getElementById("register-username");
    const passEl = document.getElementById("register-password");
    const confirmPassEl = document.getElementById("register-confirm-password");
    const fullNameEl = document.getElementById("register-fullname");
    const emailEl = document.getElementById("register-email");
    const mobileEl = document.getElementById("register-mobile");
    const domainEl = document.getElementById("register-domain");
    
    const username = userEl.value.trim().toLowerCase();
    const password = passEl.value;
    const confirmPassword = confirmPassEl.value;
    const fullName = fullNameEl.value.trim();
    const email = emailEl.value.trim();
    const mobile = mobileEl.value.trim();
    const domain = domainEl.value;
    
    // Check mandatory fields
    if (!username || !password || !confirmPassword || !fullName || !email || !mobile || !domain) {
        alert("All fields are mandatory. Please fill in all fields.");
        return;
    }
    
    if (password !== confirmPassword) {
        alert("Passwords do not match. Please verify.");
        return;
    }
    
    if (!email.includes("@") || !email.includes(".")) {
        alert("Please enter a valid email address.");
        return;
    }
    
    if (username.length < 3) {
        alert("Username must be at least 3 characters long.");
        return;
    }
    
    const users = JSON.parse(localStorage.getItem("pf_users") || "{}");
    if (users[username]) {
        alert("Username already exists. Please choose a different username.");
        return;
    }
    
    // Save user
    users[username] = password;
    localStorage.setItem("pf_users", JSON.stringify(users));
    
    // Save profile metadata
    const profileData = {
        fullName: fullName,
        email: email,
        mobile: mobile,
        domain: domain,
        createdDate: new Date().toLocaleDateString()
    };
    localStorage.setItem(`profile_data_${username}`, JSON.stringify(profileData));
    localStorage.setItem(`created_${username}`, profileData.createdDate);
    
    // Set active session
    localStorage.setItem("current_user", username);
    
    // Reset values
    userEl.value = "";
    passEl.value = "";
    confirmPassEl.value = "";
    fullNameEl.value = "";
    emailEl.value = "";
    mobileEl.value = "";
    domainEl.value = "";
    
    checkAuthSession();
}

function handleLogin(event) {
    event.preventDefault();
    const userEl = document.getElementById("login-username");
    const passEl = document.getElementById("login-password");
    
    const username = userEl.value.trim().toLowerCase();
    const password = passEl.value;
    
    const users = JSON.parse(localStorage.getItem("pf_users") || "{}");
    
    if (users[username] && users[username] === password) {
        localStorage.setItem("current_user", username);
        userEl.value = "";
        passEl.value = "";
        checkAuthSession();
    } else {
        alert("Invalid username or password. Please try again.");
    }
}

function handleLogout() {
    clearUIOnLogout();
    localStorage.removeItem("current_user");
    currentUser = null;
    
    switchToTab("assessment");
    resetAssessment();
    checkAuthSession();
}

function clearUIOnLogout() {
    resetAssessment();
    const careerList = document.getElementById("career-recommendations-list");
    if (careerList) careerList.innerHTML = "";
    const gapRoadmap = document.getElementById("skill-gap-roadmap");
    if (gapRoadmap) gapRoadmap.innerHTML = "";
    const vacancies = document.getElementById("vacancy-recommendations-list");
    if (vacancies) vacancies.innerHTML = "";
    
    const resumeText = document.getElementById("resume-text-input");
    if (resumeText) resumeText.value = "";
    
    const detectedSkills = document.getElementById("resume-detected-skills");
    if (detectedSkills) detectedSkills.innerHTML = "";
    
    const missingSkills = document.getElementById("resume-missing-skills");
    if (missingSkills) missingSkills.innerHTML = "";
    
    const tipsList = document.getElementById("resume-tips");
    if (tipsList) tipsList.innerHTML = "";
    
    const scoreVal = document.getElementById("resume-score-val");
    if (scoreVal) scoreVal.textContent = "0";
    
    const gradeVal = document.getElementById("resume-score-grade");
    if (gradeVal) gradeVal.textContent = "Ready for Analysis";
    
    const summaryVal = document.getElementById("resume-summary");
    if (summaryVal) summaryVal.textContent = "Upload or paste your resume and click Analyze.";
    
    const resultsCard = document.getElementById("resume-results-card");
    if (resultsCard) resultsCard.classList.add("hidden");
    
    const placeholderCard = document.getElementById("resume-placeholder-card");
    if (placeholderCard) placeholderCard.classList.remove("hidden");
    
    document.getElementById("user-profile-name").textContent = "Guest";
    document.getElementById("profile-detail-username").textContent = "Guest";
    document.getElementById("profile-detail-email").textContent = "N/A";
    document.getElementById("profile-detail-mobile").textContent = "N/A";
    document.getElementById("profile-detail-domain").textContent = "N/A";
    document.getElementById("profile-detail-score").textContent = "N/A";
    document.getElementById("profile-detail-created").textContent = "N/A";
    
    const sidebarAvatar = document.getElementById("user-sidebar-avatar");
    const sidebarFallback = document.getElementById("user-sidebar-avatar-fallback");
    const profileAvatar = document.getElementById("user-profile-avatar");
    const profileFallback = document.getElementById("user-profile-avatar-fallback");
    
    if (sidebarAvatar) sidebarAvatar.classList.add("hidden");
    if (sidebarFallback) sidebarFallback.classList.remove("hidden");
    if (profileAvatar) profileAvatar.classList.add("hidden");
    if (profileFallback) profileFallback.classList.remove("hidden");
    
    const gallery = document.getElementById("portfolio-gallery");
    const emptyState = document.getElementById("portfolio-empty-state");
    if (gallery) gallery.innerHTML = "";
    if (emptyState) emptyState.classList.remove("hidden");
    
    const historyContainer = document.getElementById("history-timeline-container");
    const historyEmpty = document.getElementById("history-empty-state");
    if (historyContainer) historyContainer.innerHTML = "";
    if (historyEmpty) historyEmpty.classList.remove("hidden");
    
    const chatContainer = document.getElementById("chat-messages-container");
    if (chatContainer) chatContainer.innerHTML = "";

    // Clear stats widgets
    const statCareerVal = document.getElementById("stat-val-career-match");
    const statCareerSub = document.getElementById("stat-sub-career-match");
    const statEmployVal = document.getElementById("stat-val-employability");
    const statEmploySub = document.getElementById("stat-sub-employability");
    const statSkillVal = document.getElementById("stat-val-skill-readiness");
    const statSkillSub = document.getElementById("stat-sub-skill-readiness");
    const statResumeVal = document.getElementById("stat-val-resume-score");
    const statResumeSub = document.getElementById("stat-sub-resume-score");

    if (statCareerVal) statCareerVal.textContent = "N/A";
    if (statCareerSub) statCareerSub.textContent = "Complete assessment";
    if (statEmployVal) statEmployVal.textContent = "0%";
    if (statEmploySub) statEmploySub.textContent = "Predicted readiness";
    if (statSkillVal) statSkillVal.textContent = "0%";
    if (statSkillSub) statSkillSub.textContent = "Technical index score";
    if (statResumeVal) statResumeVal.textContent = "0%";
    if (statResumeSub) statResumeSub.textContent = "ATS Match Level";

    // Reset gamification screens
    const gamifiedDash = document.getElementById("gamified-dashboard");
    if (gamifiedDash) gamifiedDash.classList.remove("hidden");
    const quizInterface = document.getElementById("quiz-interface-section");
    if (quizInterface) quizInterface.classList.add("hidden");
    const assessSection = document.getElementById("assessment-section");
    if (assessSection) assessSection.classList.add("hidden");
    const resultsSection = document.getElementById("results-section");
    if (resultsSection) resultsSection.classList.add("hidden");
}

/* Gmail Authentication Helper Actions */
function openGmailLogin() {
    document.getElementById("gmail-modal").classList.remove("hidden");
    document.getElementById("oauth-email-view").classList.remove("hidden");
    document.getElementById("oauth-password-view").classList.add("hidden");
    document.getElementById("oauth-loading-view").classList.add("hidden");
    
    document.getElementById("oauth-email-input").value = "";
    document.getElementById("oauth-password-input").value = "";
    document.getElementById("oauth-show-pass-check").checked = false;
    document.getElementById("oauth-password-input").type = "password";
}

function closeGmailLogin() {
    document.getElementById("gmail-modal").classList.add("hidden");
}

function submitOAuthEmail() {
    const emailInput = document.getElementById("oauth-email-input");
    const email = emailInput.value.trim();
    
    if (!email || !email.includes("@") || !email.includes(".")) {
        alert("Please enter a valid email address.");
        return;
    }
    
    document.getElementById("oauth-email-view").classList.add("hidden");
    document.getElementById("oauth-password-view").classList.remove("hidden");
    
    const userDisplay = document.getElementById("oauth-user-display-email");
    if (userDisplay) {
        userDisplay.innerHTML = `<i data-lucide="user" style="width:14px; height:14px; vertical-align:middle; margin-right:4px;"></i> ${email}`;
        lucide.createIcons();
    }
    
    setTimeout(() => {
        document.getElementById("oauth-password-input").focus();
    }, 100);
}

function backToOAuthEmail() {
    document.getElementById("oauth-password-view").classList.add("hidden");
    document.getElementById("oauth-email-view").classList.remove("hidden");
}

function toggleOAuthPasswordVisibility() {
    const passInput = document.getElementById("oauth-password-input");
    const check = document.getElementById("oauth-show-pass-check");
    if (passInput && check) {
        passInput.type = check.checked ? "text" : "password";
    }
}

async function submitOAuthPassword() {
    const passInput = document.getElementById("oauth-password-input");
    const pass = passInput.value;
    
    if (!pass) {
        alert("Please enter your password.");
        return;
    }
    
    document.getElementById("oauth-password-view").classList.add("hidden");
    document.getElementById("oauth-loading-view").classList.remove("hidden");
    
    await new Promise(resolve => setTimeout(resolve, 1800));
    
    const email = document.getElementById("oauth-email-input").value.trim();
    const fallbackName = email.split("@")[0].split(/[._-]/).map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
    
    selectGmailAccount(fallbackName, email);
}

function selectGmailAccount(name, email) {
    const username = email.split('@')[0].toLowerCase().replace(/[^a-z0-9]/g, '');
    
    // Register if user doesn't exist
    const users = JSON.parse(localStorage.getItem("pf_users") || "{}");
    if (!users[username]) {
        users[username] = "gmail-sso-auth-token"; // mock password token
        localStorage.setItem("pf_users", JSON.stringify(users));
        
        // Save mandatory details
        const profileData = {
            fullName: name,
            email: email,
            mobile: "N/A (Google Link)",
            domain: "both",
            createdDate: new Date().toLocaleDateString()
        };
        localStorage.setItem(`profile_data_${username}`, JSON.stringify(profileData));
        localStorage.setItem(`created_${username}`, profileData.createdDate);
    }
    
    // Set active session
    localStorage.setItem("current_user", username);
    
    closeGmailLogin();
    checkAuthSession();
}

function toggleCustomGmailInput(show) {
    // No-op - accounts list removed
}

function submitCustomGmail() {
    const nameEl = document.getElementById("gmail-custom-name");
    const emailEl = document.getElementById("gmail-custom-email");
    const name = nameEl.value.trim();
    const email = emailEl.value.trim();
    
    if (!name || !email) {
        alert("Please fill in both name and Gmail address.");
        return;
    }
    
    if (!email.includes("@") || !email.includes(".") || !email.toLowerCase().endsWith("gmail.com")) {
        alert("Please enter a valid Gmail address (ending in @gmail.com).");
        return;
    }
    
    selectGmailAccount(name, email);
}

async function initializeUserPortal() {
    const profileDataStr = localStorage.getItem(`profile_data_${currentUser}`);
    let displayName = currentUser.charAt(0).toUpperCase() + currentUser.slice(1);
    let emailText = "N/A";
    let mobileText = "N/A";
    let domainText = "N/A";
    
    if (profileDataStr) {
        const profile = JSON.parse(profileDataStr);
        if (profile.fullName) displayName = profile.fullName;
        if (profile.email) emailText = profile.email;
        if (profile.mobile) mobileText = profile.mobile;
        
        if (profile.domain) {
            if (profile.domain === "both") domainText = "Both (Private & Govt)";
            else if (profile.domain === "private") domainText = "Private Tech / Corporate";
            else if (profile.domain === "government") domainText = "Government Exams / Teaching";
        }
    }
    
    // 1. Update Profile Names in sidebar and profile tab
    document.getElementById("user-sidebar-name").textContent = displayName;
    document.getElementById("user-profile-name").textContent = displayName;
    document.getElementById("profile-detail-username").textContent = currentUser;
    document.getElementById("profile-detail-email").textContent = emailText;
    document.getElementById("profile-detail-mobile").textContent = mobileText;
    document.getElementById("profile-detail-domain").textContent = domainText;

    // Load account creation date
    const createdDate = localStorage.getItem(`created_${currentUser}`) || "N/A";
    document.getElementById("profile-detail-created").textContent = createdDate;

    // Load last score from history
    const history = JSON.parse(localStorage.getItem(`history_${currentUser}`) || "[]");
    if (history.length > 0) {
        document.getElementById("profile-detail-score").textContent = `${history[0].score}% (${history[0].role})`;
    } else {
        document.getElementById("profile-detail-score").textContent = "No evaluations yet";
    }

    // 2. Load User Profile Picture
    loadUserProfilePicture();

    // 3. Load Portfolio Certificates
    loadAndRenderCertificates();

    // 4. Initialize Gamified Dashboard Stats
    initGamifiedStats();
}

/* ==========================================================================
   Tab Navigation Manager
   ========================================================================== */
function switchToTab(tabName) {
    // Hide all panels, remove active from nav buttons
    const panels = document.querySelectorAll(".tab-panel");
    const navItems = document.querySelectorAll(".nav-item");
    
    panels.forEach(p => p.classList.remove("active"));
    navItems.forEach(n => n.classList.remove("active"));
    
    // Show selected panel
    document.getElementById(`panel-${tabName}`).classList.add("active");
    
    // Set button active
    if (tabName === "assessment") {
        document.getElementById("tab-btn-assessment").classList.add("active");
    } else if (tabName === "resume") {
        document.getElementById("tab-btn-resume").classList.add("active");
    } else if (tabName === "history") {
        document.getElementById("tab-btn-history").classList.add("active");
        renderHistoryList();
    } else if (tabName === "profile") {
        document.getElementById("tab-btn-profile").classList.add("active");
    } else if (tabName === "about") {
        const btn = document.getElementById("tab-btn-about");
        if (btn) btn.classList.add("active");
    } else if (tabName === "contact") {
        const btn = document.getElementById("tab-btn-contact");
        if (btn) btn.classList.add("active");
    }
}

/* ==========================================================================
   Assessment History Manager
   ========================================================================== */
function saveAssessmentToHistory(results, profile) {
    if (!currentUser) return;
    
    const historyKey = `history_${currentUser}`;
    const history = JSON.parse(localStorage.getItem(historyKey) || "[]");
    
    const historyItem = {
        id: Date.now(),
        date: new Date().toLocaleString(),
        score: results.employabilityScore,
        status: results.status,
        role: results.primaryCareer.name,
        results: results,
        profile: profile
    };
    
    history.unshift(historyItem); // Add to beginning of array
    localStorage.setItem(historyKey, JSON.stringify(history));
    
    // Update score detail in profile tab
    document.getElementById("profile-detail-score").textContent = `${results.employabilityScore}% (${results.primaryCareer.name})`;
}

function renderHistoryList() {
    const container = document.getElementById("history-timeline-container");
    const emptyState = document.getElementById("history-empty-state");
    
    if (!currentUser) return;
    
    const history = JSON.parse(localStorage.getItem(`history_${currentUser}`) || "[]");
    
    if (history.length === 0) {
        container.innerHTML = "";
        emptyState.classList.remove("hidden");
        return;
    }
    
    emptyState.classList.add("hidden");
    container.innerHTML = "";
    
    history.forEach((item, idx) => {
        const step = document.createElement("div");
        step.className = "roadmap-step active";
        step.style.opacity = "1";
        step.style.transform = "translateX(0)";
        
        step.innerHTML = `
            <div class="roadmap-marker" style="background-color: var(--primary);"></div>
            <div class="roadmap-content" style="display: flex; justify-content: space-between; align-items: center; gap: 1.5rem;">
                <div>
                    <div class="roadmap-type" style="color: var(--accent);">${item.date}</div>
                    <h4 class="roadmap-title" style="font-size: 1.1rem; margin: 0.2rem 0;">
                        Employability Score: <span style="color: var(--primary);">${item.score}%</span>
                    </h4>
                    <p class="roadmap-desc">Recommended Path: <strong>${item.role}</strong> (${item.status})</p>
                </div>
                <button class="btn btn-secondary btn-sm" onclick="reloadPastAssessment(${item.id})">
                    <i data-lucide="folder-open" style="width: 14px; height: 14px;"></i> Load Report
                </button>
            </div>
        `;
        container.appendChild(step);
    });
    
    lucide.createIcons();
}

function reloadPastAssessment(id) {
    if (!currentUser) return;
    
    const history = JSON.parse(localStorage.getItem(`history_${currentUser}`) || "[]");
    const item = history.find(h => h.id === id);
    
    if (!item) {
        alert("Assessment report not found.");
        return;
    }
    
    // Load state
    predictionResults = item.results;
    userData = item.profile;
    
    // Fill out profile form fields so user can see what they entered
    fillFormFields(userData);
    
    // Display dashboard
    displayResults(predictionResults);
    
    // Switch to assessment tab and hide form, show results
    switchToTab("assessment");
    document.getElementById("assessment-section").classList.add("hidden");
    const gamifiedDash = document.getElementById("gamified-dashboard");
    if (gamifiedDash) gamifiedDash.classList.add("hidden");
    const quizInterface = document.getElementById("quiz-interface-section");
    if (quizInterface) quizInterface.classList.add("hidden");
    document.getElementById("results-section").classList.remove("hidden");
    window.scrollTo({ top: 0, behavior: "smooth" });
}

function fillFormFields(profile) {
    document.getElementById("input-name").value = profile.name;
    document.getElementById("input-degree").value = profile.degree;
    document.getElementById("input-major").value = profile.major;
    document.getElementById("input-specialization").value = profile.specialization;
    document.getElementById("input-gpa").value = profile.gpa;
    document.getElementById("input-sector").value = profile.sector;
    document.getElementById("input-exam-interest").value = profile.examInterest;
    document.getElementById("input-projects").value = profile.projects;
    document.getElementById("input-internships").value = profile.internships;
    document.getElementById("input-certs").value = profile.certs;
    document.getElementById("input-experience").value = profile.experience;
    
    document.getElementById("input-aptitude").value = profile.aptitude;
    document.getElementById("aptitude-val").textContent = profile.aptitude + "/10";

    document.getElementById("input-comm").value = profile.softSkills.communication;
    document.getElementById("comm-val").textContent = profile.softSkills.communication + "/10";

    document.getElementById("input-problem").value = profile.softSkills.problem_solving;
    document.getElementById("problem-val").textContent = profile.softSkills.problem_solving + "/10";

    document.getElementById("input-teamwork").value = profile.softSkills.teamwork;
    document.getElementById("teamwork-val").textContent = profile.softSkills.teamwork + "/10";

    document.getElementById("input-leadership").value = profile.softSkills.leadership;
    document.getElementById("leadership-val").textContent = profile.softSkills.leadership + "/10";

    // Set selected skills
    selectedSkills.clear();
    const allTags = document.querySelectorAll(".skill-tag");
    allTags.forEach(tag => {
        const skillId = tag.getAttribute("data-skill-id");
        if (profile.skills.includes(skillId)) {
            selectedSkills.add(skillId);
            tag.classList.add("selected");
        } else {
            tag.classList.remove("selected");
        }
    });
}

/* ==========================================================================
   Resume Drag & Drop & Reader
   ========================================================================== */
function setupResumeDragAndDrop() {
    const dropZone = document.getElementById("resume-drop-zone");
    if (!dropZone) return;

    // Prevent default drag behaviors
    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
        dropZone.addEventListener(eventName, preventDefaults, false);
    });

    function preventDefaults(e) {
        e.preventDefault();
        e.stopPropagation();
    }

    // Highlight drop area when item is dragged over it
    ['dragenter', 'dragover'].forEach(eventName => {
        dropZone.addEventListener(eventName, () => dropZone.classList.add('dragover'), false);
    });

    ['dragleave', 'drop'].forEach(eventName => {
        dropZone.addEventListener(eventName, () => dropZone.classList.remove('dragover'), false);
    });

    // Handle dropped files
    dropZone.addEventListener('drop', handleDrop, false);

    function handleDrop(e) {
        const dt = e.dataTransfer;
        const files = dt.files;
        if (files.length > 0) {
            parseResumeFile(files[0]);
        }
    }
}

function handleResumeUpload(event) {
    const file = event.target.files[0];
    if (file) {
        parseResumeFile(file);
    }
}

function parseResumeFile(file) {
    if (file.name.toLowerCase().endsWith(".pdf")) {
        const reader = new FileReader();
        reader.onload = async (e) => {
            const typedarray = new Uint8Array(e.target.result);
            try {
                // Initialize PDF.js using global fallback namespace
                const pdfjsLib = window.pdfjsLib || window['pdfjs-dist/build/pdf'];
                if (!pdfjsLib) {
                    throw new Error("PDF.js library failed to load from CDN.");
                }
                
                pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.16.105/pdf.worker.min.js';
                
                const pdf = await pdfjsLib.getDocument({ data: typedarray }).promise;
                let fullText = "";
                
                for (let i = 1; i <= pdf.numPages; i++) {
                    const page = await pdf.getPage(i);
                    const textContent = await page.getTextContent();
                    const pageText = textContent.items.map(item => item.str).join(" ");
                    fullText += pageText + "\n";
                }
                
                document.getElementById("resume-text-input").value = fullText;
                alert(`Successfully loaded and parsed PDF resume: ${file.name}`);
            } catch (error) {
                console.error("PDF Parsing error:", error);
                alert("Failed to parse PDF. Please verify it is not password-protected, or copy-paste the text content directly.");
            }
        };
        reader.readAsArrayBuffer(file);
    } else if (file.type === "text/plain" || file.name.toLowerCase().endsWith(".txt")) {
        const reader = new FileReader();
        reader.onload = (e) => {
            document.getElementById("resume-text-input").value = e.target.result;
            alert(`Successfully loaded text resume: ${file.name}`);
        };
        reader.onerror = () => {
            alert("Error reading text file.");
        };
        reader.readAsText(file);
    } else {
        alert("Unsupported file format. Please upload a .txt or .pdf file.");
    }
}

/* ==========================================================================
   AI Resume Analyzer Engine
   ========================================================================== */
async function analyzeResume() {
    const resumeText = document.getElementById("resume-text-input").value.trim();
    const targetRole = document.getElementById("resume-target-role").value;

    if (!resumeText) {
        alert("Please paste your resume text or upload a text file.");
        return;
    }

    const btn = document.getElementById("btn-analyze-resume");
    const btnText = document.getElementById("btn-resume-text");
    const btnSpinner = document.getElementById("btn-resume-spinner");

    btn.disabled = true;
    btnText.textContent = "Analyzing Resume...";
    btnSpinner.classList.remove("hidden");

    const apiKey = currentUser ? localStorage.getItem(`gemini_api_key_${currentUser}`) : null;

    try {
        let results = null;
        if (apiKey) {
            // ONLINE MODE: Call Gemini
            results = await callGeminiResumeAnalysis(apiKey, resumeText, targetRole);
        } else {
            // OFFLINE MODE: Local keyword matcher
            await new Promise(resolve => setTimeout(resolve, 1500));
            results = runLocalResumeInference(resumeText, targetRole);
        }

        // Display results
        displayResumeResults(results);

    } catch (error) {
        console.error("Resume analysis failed:", error);
        alert(`AI Analysis failed: ${error.message}. Falling back to local offline analysis.`);
        const results = runLocalResumeInference(resumeText, targetRole);
        displayResumeResults(results);
    } finally {
        btn.disabled = false;
        btnText.textContent = "Analyze Resume";
        btnSpinner.classList.add("hidden");
    }
}

async function callGeminiResumeAnalysis(apiKey, text, role) {
    const systemInstruction = `You are an expert ATS (Applicant Tracking System) Auditor and Career Recruiter.
    You must evaluate the provided resume text against the target career role: '${role}'.
    Provide a detailed evaluation in JSON format.
    
    You must follow this exact JSON schema:
    {
        "score": number (0-100, representing ATS match score),
        "grade": string (e.g. "Excellent Match", "Good Match", "Average Match", "Needs Improvement"),
        "summary": string (2-3 sentences summarizing how well their resume aligns with the target role and key gaps),
        "skills": array of strings (core relevant skills detected in their resume),
        "missing": array of strings (core skills and keywords they are missing for this role),
        "tips": array of strings (3 actionable bullet points to improve their resume, e.g. 'Add a section on Docker', 'Use active verbs')
    }`;

    const prompt = `Target Role: ${role}
    Resume Text:
    ${text}`;

    return await callGeminiAPI(apiKey, prompt, systemInstruction);
}

function runLocalResumeInference(text, role) {
    const textLower = text.toLowerCase();
    const config = CAREER_PATHS[role] || CAREER_PATHS["Software Engineer"];
    const keywords = config.resumeKeywords;

    const matchedKeywords = keywords.filter(word => textLower.includes(word));
    const missingKeywords = keywords.filter(word => !textLower.includes(word));

    // Calculate score
    const overlapRatio = matchedKeywords.length / keywords.length;
    let score = Math.round(35 + (overlapRatio * 55)); // scale between 35 and 90

    // Add points for general professional terms
    const profTerms = ["experience", "education", "project", "skills", "certifications", "achievements", "leadership"];
    const matchedTermsCount = profTerms.filter(t => textLower.includes(t)).length;
    score += matchedTermsCount * 1.5; // up to 10 points

    score = Math.clip(Math.round(score), 10, 100);

    let grade = "Needs Improvement";
    let summary = "";

    if (score >= 85) {
        grade = "Excellent Match";
        summary = `Your resume has excellent alignment with the ${role} role, containing strong ATS keyword density and structured sections.`;
    } else if (score >= 70) {
        grade = "Good Match";
        summary = `Your resume shows a solid match for ${role}. However, adding more technical keywords and quantitative achievements will boost your ATS score.`;
    } else {
        grade = "Needs Improvement";
        summary = `Your resume has low keyword alignment for ${role}. You need to explicitly add core skills and revise your project descriptions.`;
    }

    const tips = [
        `Incorporate missing core keywords such as: ${missingKeywords.slice(0, 3).join(", ")}.`,
        "Use action verbs (e.g., 'Developed', 'Led', 'Optimized') and quantify your achievements with metrics.",
        "Add a dedicated 'Technical Skills' section at the top to clear ATS parser filters instantly."
    ];

    return {
        score: score,
        grade: grade,
        summary: summary,
        skills: matchedKeywords.map(w => w.charAt(0).toUpperCase() + w.slice(1)),
        missing: missingKeywords.map(w => w.charAt(0).toUpperCase() + w.slice(1)),
        tips: tips
    };
}

function displayResumeResults(results) {
    document.getElementById("resume-score-val").textContent = results.score;
    document.getElementById("resume-score-grade").textContent = results.grade;
    document.getElementById("resume-summary").textContent = results.summary;

    // Update main dashboard Resume Score stat card
    const statResumeVal = document.getElementById("stat-val-resume-score");
    const statResumeSub = document.getElementById("stat-sub-resume-score");
    if (statResumeVal) statResumeVal.textContent = `${results.score}%`;
    if (statResumeSub) statResumeSub.textContent = results.grade;

    // Render detected skills
    const skillsContainer = document.getElementById("resume-detected-skills");
    skillsContainer.innerHTML = "";
    results.skills.slice(0, 8).forEach(skill => {
        const tag = document.createElement("span");
        tag.className = "resume-tag resume-tag-success";
        tag.textContent = skill;
        skillsContainer.appendChild(tag);
    });
    if (results.skills.length === 0) {
        skillsContainer.innerHTML = `<span style="font-size: 0.8rem; color: var(--text-muted);">No matching skills found</span>`;
    }

    // Render missing skills
    const missingContainer = document.getElementById("resume-missing-skills");
    missingContainer.innerHTML = "";
    results.missing.slice(0, 6).forEach(skill => {
        const tag = document.createElement("span");
        tag.className = "resume-tag resume-tag-danger";
        tag.textContent = skill;
        missingContainer.appendChild(tag);
    });
    if (results.missing.length === 0) {
        missingContainer.innerHTML = `<span style="font-size: 0.8rem; color: var(--text-muted);">None! Excellent keyword coverage.</span>`;
    }

    // Render tips
    const tipsContainer = document.getElementById("resume-tips");
    tipsContainer.innerHTML = "";
    results.tips.forEach(tip => {
        const li = document.createElement("li");
        li.textContent = tip;
        tipsContainer.appendChild(li);
    });

    // Toggle panels
    document.getElementById("resume-placeholder-card").classList.add("hidden");
    document.getElementById("resume-results-card").classList.remove("hidden");
}

/* ==========================================================================
   Profile Picture & Avatar Manager
   ========================================================================== */
async function handleAvatarUpload(event) {
    const file = event.target.files[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
        alert("Please select a valid image file.");
        return;
    }

    const reader = new FileReader();
    reader.onload = async (e) => {
        const base64Data = e.target.result;
        
        if (!currentUser) return;
        
        try {
            // Save to IndexedDB
            await saveAssetToDB(`avatar_${currentUser}`, base64Data);
            
            // Update UI
            updateAvatarUI(base64Data);
            alert("Profile picture updated successfully!");
        } catch (err) {
            console.error("Failed to save avatar:", err);
            alert("Failed to save avatar image.");
        }
    };
    reader.readAsDataURL(file);
}

async function loadUserProfilePicture() {
    if (!currentUser) return;
    
    const avatarData = await loadAssetFromDB(`avatar_${currentUser}`);
    if (avatarData) {
        updateAvatarUI(avatarData);
    } else {
        resetAvatarUI();
    }
}

function updateAvatarUI(base64) {
    const sidebarAvatar = document.getElementById("user-sidebar-avatar");
    const sidebarFallback = document.getElementById("user-sidebar-avatar-fallback");
    const profileAvatar = document.getElementById("user-profile-avatar");
    const profileFallback = document.getElementById("user-profile-avatar-fallback");

    if (sidebarAvatar && sidebarFallback) {
        sidebarAvatar.src = base64;
        sidebarAvatar.classList.remove("hidden");
        sidebarFallback.classList.add("hidden");
    }
    if (profileAvatar && profileFallback) {
        profileAvatar.src = base64;
        profileAvatar.classList.remove("hidden");
        profileFallback.classList.add("hidden");
    }
}

async function deleteAvatar() {
    if (!currentUser) return;
    
    if (confirm("Are you sure you want to remove your profile picture?")) {
        await deleteAssetFromDB(`avatar_${currentUser}`);
        resetAvatarUI();
        alert("Profile picture removed.");
    }
}

function resetAvatarUI() {
    const sidebarAvatar = document.getElementById("user-sidebar-avatar");
    const sidebarFallback = document.getElementById("user-sidebar-avatar-fallback");
    const profileAvatar = document.getElementById("user-profile-avatar");
    const profileFallback = document.getElementById("user-profile-avatar-fallback");

    if (sidebarAvatar && sidebarFallback) {
        sidebarAvatar.src = "";
        sidebarAvatar.classList.add("hidden");
        sidebarFallback.classList.remove("hidden");
    }
    if (profileAvatar && profileFallback) {
        profileAvatar.src = "";
        profileAvatar.classList.add("hidden");
        profileFallback.classList.remove("hidden");
    }
}

/* ==========================================================================
   Certificate & Portfolio Manager
   ========================================================================== */
async function handleCertificateUpload(event) {
    const file = event.target.files[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
        alert("Please select a valid certificate image.");
        return;
    }

    const title = prompt("Enter a title/label for this certificate:", file.name.split('.')[0]);
    if (title === null) return; // User cancelled
    
    const finalTitle = title.trim() || "Certificate";

    const reader = new FileReader();
    reader.onload = async (e) => {
        const base64Data = e.target.result;
        
        if (!currentUser) return;
        
        const certId = `cert_${currentUser}_${Date.now()}`;
        const certData = {
            title: finalTitle,
            image: base64Data,
            date: new Date().toLocaleDateString()
        };

        try {
            await saveAssetToDB(certId, certData);
            loadAndRenderCertificates();
            alert("Certificate uploaded to your portfolio!");
        } catch (err) {
            console.error("Failed to save certificate:", err);
            alert("Failed to save certificate image.");
        }
    };
    reader.readAsDataURL(file);
}

async function loadAndRenderCertificates() {
    const gallery = document.getElementById("portfolio-gallery");
    const emptyState = document.getElementById("portfolio-empty-state");
    
    if (!currentUser || !gallery) return;
    
    try {
        const certs = await loadUserCertificates(currentUser);
        
        if (certs.length === 0) {
            gallery.innerHTML = "";
            emptyState.classList.remove("hidden");
            return;
        }
        
        emptyState.classList.add("hidden");
        gallery.innerHTML = "";
        
        certs.forEach(item => {
            const certData = item.data;
            const card = document.createElement("div");
            card.className = "portfolio-item";
            card.title = `${certData.title} (${certData.date})`;
            
            card.innerHTML = `
                <img src="${certData.image}" alt="${certData.title}">
                <button class="portfolio-item-delete" onclick="deleteCertificate('${item.id}', event)">
                    <i data-lucide="trash-2" style="width: 12px; height: 12px;"></i>
                </button>
                <div style="position: absolute; bottom: 0; left: 0; width: 100%; padding: 4px 8px; background: rgba(9,10,15,0.75); font-size: 0.7rem; color: white; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; pointer-events: none;">
                    ${certData.title}
                </div>
            `;
            
            // Open full image in new tab on click
            card.addEventListener("click", (e) => {
                if (e.target.closest(".portfolio-item-delete")) return;
                const newTab = window.open();
                newTab.document.write(`<img src="${certData.image}" style="max-width:100%; height:auto;" />`);
            });
            
            gallery.appendChild(card);
        });
        
        lucide.createIcons();
    } catch (err) {
        console.error("Failed to render certificates:", err);
    }
}

async function deleteCertificate(id, event) {
    event.stopPropagation();
    if (confirm("Are you sure you want to delete this certificate from your portfolio?")) {
        await deleteAssetFromDB(id);
        loadAndRenderCertificates();
        alert("Certificate deleted.");
    }
}

/* ==========================================================================
   Core Predictor Models
   ========================================================================== */
async function submitAssessment() {
    const projects = document.getElementById("input-projects").value;
    const internships = document.getElementById("input-internships").value;
    const certs = document.getElementById("input-certs").value;
    const experience = document.getElementById("input-experience").value;

    if (projects === "" || internships === "" || certs === "" || experience === "") {
        alert("Please fill in all experience and aptitude fields.");
        return;
    }

    userData = {
        name: document.getElementById("input-name").value.trim(),
        degree: document.getElementById("input-degree").value,
        major: document.getElementById("input-major").value,
        specialization: document.getElementById("input-specialization").value.trim(),
        gpa: document.getElementById("input-gpa").value.trim(),
        sector: document.getElementById("input-sector").value,
        examInterest: document.getElementById("input-exam-interest").value,
        skills: Array.from(selectedSkills),
        projects: parseInt(projects),
        internships: parseInt(internships),
        certs: parseInt(certs),
        experience: parseInt(experience),
        aptitude: parseInt(document.getElementById("input-aptitude").value),
        softSkills: {
            communication: parseInt(document.getElementById("input-comm").value),
            problem_solving: parseInt(document.getElementById("input-problem").value),
            teamwork: parseInt(document.getElementById("input-teamwork").value),
            leadership: parseInt(document.getElementById("input-leadership").value)
        }
    };

    const btn = document.getElementById("btn-submit");
    const btnText = document.getElementById("btn-submit-text");
    const btnIcon = document.getElementById("btn-submit-icon");
    const btnSpinner = document.getElementById("btn-submit-spinner");

    btn.disabled = true;
    btnText.textContent = "Running AI Engine...";
    btnIcon.classList.add("hidden");
    btnSpinner.classList.remove("hidden");

    const apiKey = currentUser ? localStorage.getItem(`gemini_api_key_${currentUser}`) : null;

    try {
        if (apiKey) {
            // ONLINE MODE
            predictionResults = await callGeminiProfileAnalysis(apiKey, userData);
            document.getElementById("dashboard-subtitle").textContent = "Aesthetic report generated live by Google Gemini LLM.";
            document.getElementById("chat-engine-badge").innerHTML = `<span class="badge" style="background-color: var(--success-glow); color: var(--success);">Gemini Pro Enabled</span>`;
        } else {
            // OFFLINE MODE
            await new Promise(resolve => setTimeout(resolve, 1500));
            predictionResults = runLocalInference(userData);
            document.getElementById("dashboard-subtitle").textContent = "Offline report generated using local statistical algorithms. Paste a Gemini API Key to enable the LLM.";
            document.getElementById("chat-engine-badge").textContent = "Local AI Engine • Online";
        }

        // Save to history
        saveAssessmentToHistory(predictionResults, userData);

        // Display results to UI
        displayResults(predictionResults);

        // Hide form, show dashboard
        document.getElementById("assessment-section").classList.add("hidden");
        const gamifiedDash = document.getElementById("gamified-dashboard");
        if (gamifiedDash) gamifiedDash.classList.add("hidden");
        const quizInterface = document.getElementById("quiz-interface-section");
        if (quizInterface) quizInterface.classList.add("hidden");
        document.getElementById("results-section").classList.remove("hidden");
        window.scrollTo({ top: 0, behavior: "smooth" });

    } catch (error) {
        console.error("AI Evaluation failed:", error);
        alert(`AI Engine Error: ${error.message}. Falling back to local offline evaluation.`);
        predictionResults = runLocalInference(userData);
        saveAssessmentToHistory(predictionResults, userData);
        displayResults(predictionResults);
        document.getElementById("assessment-section").classList.add("hidden");
        const gamifiedDash = document.getElementById("gamified-dashboard");
        if (gamifiedDash) gamifiedDash.classList.add("hidden");
        const quizInterface = document.getElementById("quiz-interface-section");
        if (quizInterface) quizInterface.classList.add("hidden");
        document.getElementById("results-section").classList.remove("hidden");
        window.scrollTo({ top: 0, behavior: "smooth" });
    } finally {
        btn.disabled = false;
        btnText.textContent = "Analyze Profile";
        btnIcon.classList.remove("hidden");
        btnSpinner.classList.add("hidden");
    }
}

async function callGeminiAPI(apiKey, prompt, systemInstruction) {
    const model = (currentUser ? localStorage.getItem(`gemini_api_model_${currentUser}`) : null) || "gemini-2.0-flash";
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
    const requestBody = {
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
            responseMimeType: "application/json",
            temperature: 0.2
        }
    };
    if (systemInstruction) {
        requestBody.systemInstruction = {
            parts: [{ text: systemInstruction }]
        };
    }
    
    const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestBody)
    });
    
    if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error?.message || "Failed to communicate with Gemini API");
    }
    
    const data = await response.json();
    const responseText = data.candidates[0].content.parts[0].text;
    return JSON.parse(responseText);
}

async function callGeminiProfileAnalysis(apiKey, profile) {
    const systemInstruction = `You are the core predictive algorithm for an AI Career Guidance and Employability Predictor. 
    You must evaluate the student's profile and return a detailed, mathematically sound report in JSON format.
    
    You must follow this exact JSON schema:
    {
        "employabilityScore": number (0-100),
        "status": string (e.g., "Highly Employable", "Industry Ready", "Developing Profile", "Needs Upskilling"),
        "statusDescription": string (2-3 sentences analyzing their specific profile, strengths, and areas to work on),
        "radarScores": {
            "technicalDepth": number (0-10, representing skill count and complexity),
            "softSkills": number (0-10, average of soft skills),
            "academicStanding": number (0-10, mapping of GPA/Percentage),
            "practicalProjects": number (0-10, based on project count & specialization),
            "professionalExp": number (0-10, based on internships, work experience, prep time)
        },
        "careerRecommendations": [
            {
                "name": string (must match their goals, can be private tech roles like 'Software Engineer', or government roles like 'UPSC Civil Services (IAS/IPS)', 'MPSC State Services (DySP/Deputy Collector)', 'Railway Recruitment Board (RRB Officer)', 'Banking Officer (SBI PO / IBPS)', 'Government Teacher (TET/NET Educator)'),
                "matchScore": number (0-100, representing match percentage),
                "salary": string (average salary in USD and INR, e.g. '$115,000 / ₹12-25 LPA' or '₹56,100 - ₹1,77,500/month'),
                "growth": string (growth rate or career progression),
                "description": string (brief description of the role),
                "coreSkills": array of strings (essential skills),
                "certRecommendations": array of strings (recommended certs/exams),
                "projectSuggestions": array of strings (recommended projects/preps)
            }
        ],
        "roadmap": [
            {
                "phase": string (e.g., "Phase 1: Skill Bridging", "Phase 2: Exam Preparation", "Phase 3: Validation", "Phase 4: Placement"),
                "title": string (action item title),
                "description": string (specific actionable steps for this user)
            }
        ],
        "missingSkills": array of strings (core skills the user is missing for the top recommended path)
    }
    
    Make sure your recommendations strictly respect the user's selected 'sector' (private, government, or both). Calculate the employabilityScore based on their GPA, skills, projects, internships, and aptitude, adjusting for the sector's requirements.`;

    const prompt = `Here is the candidate profile:
    ${JSON.stringify(profile, null, 2)}
    
    Analyze the profile and generate the JSON report.`;

    return await callGeminiAPI(apiKey, prompt, systemInstruction);
}

function runLocalInference(profile) {
    const recommendations = [];
    const isGovInterest = profile.sector === "government" || profile.sector === "both";
    const isPrivateInterest = profile.sector === "private" || profile.sector === "both";
    const specLower = profile.specialization.toLowerCase();

    for (const [careerName, config] of Object.entries(CAREER_PATHS)) {
        if (config.domain === "government" && !isGovInterest) continue;
        if (config.domain === "private" && !isPrivateInterest) continue;

        let matchScore = 0;

        // A. Major & Specialization Alignment (Weight: 35%)
        let majorScore = 30;
        
        if (config.domain === "private") {
            if (careerName === "Software Engineer") {
                if (profile.major === "Computer Science") majorScore = 95;
                else if (profile.major === "Engineering") majorScore = 80;
                else if (specLower.includes("code") || specLower.includes("software") || specLower.includes("java") || specLower.includes("python")) majorScore = 90;
            } else if (careerName === "Data Scientist") {
                if (profile.major === "Computer Science" || profile.major === "Science") majorScore = 90;
                else if (specLower.includes("data") || specLower.includes("stat") || specLower.includes("math")) majorScore = 95;
            } else if (careerName === "UX/UI Designer") {
                if (profile.major === "Arts & Humanities" || profile.major === "Other") majorScore = 85;
                if (specLower.includes("design") || specLower.includes("figma") || specLower.includes("ui") || specLower.includes("ux")) majorScore = 95;
            } else if (careerName === "Product Manager") {
                if (profile.major === "Business Administration" || profile.major === "Commerce & Finance") majorScore = 90;
            }
        } else {
            if (careerName.includes("UPSC") || careerName.includes("MPSC")) {
                if (profile.major === "Arts & Humanities" || profile.major === "Commerce & Finance") majorScore = 85;
                if (specLower.includes("history") || specLower.includes("polity") || specLower.includes("geography") || specLower.includes("admin")) majorScore = 95;
            } else if (careerName.includes("Teacher")) {
                if (profile.major === "Education") majorScore = 100;
                else majorScore = 70;
            } else if (careerName.includes("Banking")) {
                if (profile.major === "Commerce & Finance" || profile.major === "Business Administration") majorScore = 95;
            }
        }
        matchScore += majorScore * 0.35;

        // B. Core Skills Match (Weight: 45%)
        const userHasCore = config.coreSkills.filter(s => profile.skills.includes(s));
        const skillOverlapPct = config.coreSkills.length > 0 
            ? (userHasCore.length / config.coreSkills.length) * 100 
            : 0;
        
        let skillWeightScore = skillOverlapPct;
        if (config.domain === "government") {
            if (config.examType === "banking" || config.examType === "railway") {
                skillWeightScore = (skillOverlapPct * 0.6) + (profile.aptitude * 10 * 0.4);
            } else if (config.examType === "upsc" || config.examType === "mpsc") {
                const gkSkills = ["History", "Geography", "Polity", "Economics", "Current_Affairs"];
                const userGkCount = gkSkills.filter(s => profile.skills.includes(s)).length;
                skillWeightScore = (userGkCount / gkSkills.length) * 100;
            }
        }
        matchScore += skillWeightScore * 0.45;

        // C. Soft Skills Alignment (Weight: 20%)
        let softScore = 0;
        for (const [sName, weight] of Object.entries(config.softWeights)) {
            softScore += profile.softSkills[sName] * 10 * weight; 
        }
        matchScore += softScore * 0.20;

        if (config.examType && profile.examInterest === config.examType) {
            matchScore += 25; 
        }

        recommendations.push({
            name: careerName,
            matchScore: Math.round(Math.clip(matchScore, 20, 100)),
            salary: config.salary,
            growth: config.growth,
            description: config.description,
            coreSkills: config.coreSkills,
            certRecommendations: config.certRecommendations,
            projectSuggestions: config.projectSuggestions,
            domain: config.domain
        });
    }

    recommendations.sort((a, b) => b.matchScore - a.matchScore);
    const primaryCareer = recommendations[0];

    // Calculate Employability Score (0-100)
    let score = 35.0;

    let academicPoints = 12.0;
    const gpaClean = parseFloat(profile.gpa);
    if (!isNaN(gpaClean)) {
        if (gpaClean <= 4.0) {
            academicPoints = (gpaClean - 2.0) * 6; 
        } else if (gpaClean > 4.0 && gpaClean <= 100) {
            academicPoints = ((gpaClean - 50) / 50) * 12; 
        }
    }
    score += Math.clip(academicPoints, 4, 12);

    const primaryCoreSkills = primaryCareer.coreSkills;
    const userPrimaryCoreCount = primaryCoreSkills.filter(s => profile.skills.includes(s)).length;
    score += (userPrimaryCoreCount / primaryCoreSkills.length) * 15;
    score += Math.min(profile.skills.length * 0.7, 8); 

    score += Math.min(profile.projects * 2.5, 10);
    score += Math.min(profile.internships * 6.0, 12);
    score += Math.min(profile.experience * 0.25, 8);
    score += Math.min(profile.certs * 1.5, 5);

    const avgSoft = (profile.softSkills.communication + profile.softSkills.problem_solving + 
                     profile.softSkills.teamwork + profile.softSkills.leadership) / 4.0;
    score += (avgSoft - 1.0) * 1.33; 
    score += (profile.aptitude - 1) * 0.33; 

    score = Math.round(Math.clip(score, 10, 100));

    const missingSkills = primaryCareer.coreSkills.filter(s => !profile.skills.includes(s));

    let status = "Developing Profile";
    let statusDescription = "";
    if (score >= 85) {
        status = "Highly Employable";
        statusDescription = `Excellent profile! You have a competitive edge in ${profile.major}. Your skills are highly aligned for a ${primaryCareer.name} career.`;
    } else if (score >= 70) {
        status = "Industry Ready";
        statusDescription = `Solid background. You are well-positioned for ${primaryCareer.name}, but addressing a few core skill gaps will secure top-tier placements.`;
    } else {
        statusDescription = `You have a decent foundation, but need to build more projects and acquire core skills for ${primaryCareer.name} to boost your employability index.`;
    }

    const roadmap = [
        {
            phase: "Phase 1: Skill Bridging",
            title: "Bridge Core Gaps",
            description: missingSkills.length > 0 
                ? `Acquire missing skills: ${missingSkills.map(s => s.replace("_", " ")).join(", ")}.` 
                : "Your core skills are solid. Focus on advanced frameworks and deeper projects."
        },
        {
            phase: "Phase 2: Validation",
            title: "Target Credentials",
            description: `Earn recommended credentials: ${primaryCareer.certRecommendations[0]}.`
        },
        {
            phase: "Phase 3: Portfolio & Prep",
            title: "Build Projects & Prepare",
            description: primaryCareer.domain === "government"
                ? "Solve past 5 years' exam question papers, practice essay writing, and take mock tests."
                : `Build a capstone project: "${primaryCareer.projectSuggestions[0]}".`
        }
    ];

    return {
        employabilityScore: score,
        status: status,
        statusDescription: statusDescription,
        radarScores: {
            technicalDepth: Math.clip((profile.skills.length / 12) * 10, 2, 10),
            softSkills: avgSoft,
            academicStanding: Math.clip(academicPoints * 0.83, 2, 10),
            practicalProjects: Math.clip(Math.min((profile.projects * 2.5), 10), 1, 10),
            professionalExp: Math.clip(Math.min(((profile.internships * 3.5) + (profile.experience / 6.0)), 10), 1, 10)
        },
        careerRecommendations: recommendations,
        primaryCareer: primaryCareer,
        missingSkills: missingSkills,
        roadmap: roadmap
    };
}

// Math helper
Math.clip = function(number, min, max) {
    return Math.max(min, Math.min(number, max));
};

/* ==========================================================================
   UI Data Display & Visual Rendering
   ========================================================================== */
function displayResults(results) {
    const scoreVal = results.employabilityScore;
    const scoreTextEl = document.getElementById("result-score");
    const statusEl = document.getElementById("result-status");
    const descEl = document.getElementById("result-score-desc");

    // Populate dashboard statistics widgets
    const statCareerVal = document.getElementById("stat-val-career-match");
    const statCareerSub = document.getElementById("stat-sub-career-match");
    const statEmployVal = document.getElementById("stat-val-employability");
    const statEmploySub = document.getElementById("stat-sub-employability");
    const statSkillVal = document.getElementById("stat-val-skill-readiness");
    const statSkillSub = document.getElementById("stat-sub-skill-readiness");

    if (statCareerVal) statCareerVal.textContent = results.primaryCareer.name;
    if (statCareerSub) statCareerSub.textContent = `${results.primaryCareer.matchScore}% Match Index`;
    
    if (statEmployVal) statEmployVal.textContent = `${scoreVal}%`;
    if (statEmploySub) statEmploySub.textContent = results.status;
    
    const skillReadinessRaw = (results.radarScores.technicalDepth + results.radarScores.softSkills + results.radarScores.academicStanding + results.radarScores.practicalProjects + results.radarScores.professionalExp) / 5.0;
    const skillReadinessPercent = Math.round(skillReadinessRaw * 10);
    if (statSkillVal) statSkillVal.textContent = `${skillReadinessPercent}%`;
    if (statSkillSub) statSkillSub.textContent = `Technical: ${results.radarScores.technicalDepth.toFixed(1)}/10`;

    animateNumberCounter("result-score", 0, scoreVal, 1000);

    const circle = document.getElementById("gauge-progress-bar");
    const circumference = 2 * Math.PI * 80;
    const offset = circumference - (scoreVal / 100) * circumference;
    circle.style.strokeDashoffset = offset;

    statusEl.textContent = results.status;
    descEl.textContent = results.statusDescription;

    if (scoreVal >= 85) {
        statusEl.style.color = "var(--success)";
        statusEl.style.textShadow = "0 0 10px var(--success-glow)";
        circle.style.stroke = "var(--success)";
    } else if (scoreVal >= 70) {
        statusEl.style.color = "var(--primary)";
        statusEl.style.textShadow = "0 0 10px var(--primary-glow)";
        circle.style.stroke = "var(--primary)";
    } else if (scoreVal >= 50) {
        statusEl.style.color = "var(--warning)";
        statusEl.style.textShadow = "0 0 10px var(--warning-glow)";
        circle.style.stroke = "var(--warning)";
    } else {
        statusEl.style.color = "var(--danger)";
        statusEl.style.textShadow = "0 0 10px rgba(239, 68, 68, 0.2)";
        circle.style.stroke = "var(--danger)";
    }

    // Render Radar Chart
    renderRadarChart(results.radarScores);

    // Render Company Target Visualization
    renderCompanyTargetChart(results.primaryCareer.name);

    // Render Vacancy Recommendations
    renderVacancyRecommendations(results.primaryCareer.name, scoreVal);

    // Render Career recommendations
    renderCareerRecommendations(results.careerRecommendations);

    // Render Roadmap
    renderRoadmap(results.roadmap);

    // Initialize Chatbot
    initAuraCoach(results);
}

function animateNumberCounter(id, start, end, duration) {
    const obj = document.getElementById(id);
    let startTimestamp = null;
    const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        obj.innerHTML = Math.floor(progress * (end - start) + start);
        if (progress < 1) {
            window.requestAnimationFrame(step);
        }
    };
    window.requestAnimationFrame(step);
}

function renderRadarChart(radarScores) {
    const ctx = document.getElementById("skillsRadarChart").getContext("2d");
    const isLightTheme = document.body.classList.contains("light-theme");
    const gridColor = isLightTheme ? 'rgba(15, 23, 42, 0.08)' : 'rgba(255, 255, 255, 0.08)';
    const textColor = isLightTheme ? '#334155' : '#9ca3af';
    const legendColor = isLightTheme ? '#0f172a' : '#f3f4f6';
    
    const dataValues = [
        parseFloat(radarScores.technicalDepth).toFixed(1), 
        parseFloat(radarScores.softSkills).toFixed(1), 
        parseFloat(radarScores.academicStanding).toFixed(1), 
        parseFloat(radarScores.practicalProjects).toFixed(1), 
        parseFloat(radarScores.professionalExp).toFixed(1)
    ];

    const benchmarkValues = [7.2, 7.5, 7.0, 6.8, 6.5];

    if (radarChartInstance) {
        radarChartInstance.destroy();
    }

    radarChartInstance = new Chart(ctx, {
        type: 'radar',
        data: {
            labels: ['Technical Depth', 'Soft Skills', 'Academic Standing', 'Practical Projects', 'Professional Exp'],
            datasets: [
                {
                    label: 'Your Profile',
                    data: dataValues,
                    backgroundColor: isLightTheme ? 'rgba(79, 70, 229, 0.15)' : 'rgba(99, 102, 241, 0.2)',
                    borderColor: isLightTheme ? 'rgba(79, 70, 229, 1)' : 'rgba(99, 102, 241, 1)',
                    borderWidth: 2,
                    pointBackgroundColor: isLightTheme ? 'rgba(79, 70, 229, 1)' : 'rgba(99, 102, 241, 1)',
                    pointBorderColor: '#fff',
                    pointHoverBackgroundColor: '#fff',
                    pointHoverBorderColor: isLightTheme ? 'rgba(79, 70, 229, 1)' : 'rgba(99, 102, 241, 1)'
                },
                {
                    label: 'Industry Benchmark',
                    data: benchmarkValues,
                    backgroundColor: isLightTheme ? 'rgba(5, 150, 105, 0.03)' : 'rgba(16, 185, 129, 0.05)',
                    borderColor: isLightTheme ? 'rgba(5, 150, 105, 0.4)' : 'rgba(16, 185, 129, 0.5)',
                    borderWidth: 1.5,
                    borderDash: [5, 5],
                    pointBackgroundColor: isLightTheme ? 'rgba(5, 150, 105, 0.4)' : 'rgba(16, 185, 129, 0.5)',
                    pointBorderColor: '#fff',
                    pointHoverBackgroundColor: '#fff',
                    pointHoverBorderColor: isLightTheme ? 'rgba(5, 150, 105, 0.4)' : 'rgba(16, 185, 129, 0.5)'
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    labels: { color: legendColor, font: { family: 'Inter', size: 12 } }
                }
            },
            scales: {
                r: {
                    angleLines: { color: gridColor },
                    grid: { color: gridColor },
                    pointLabels: { color: textColor, font: { family: 'Plus Jakarta Sans', size: 11, weight: '600' } },
                    ticks: { color: isLightTheme ? '#64748b' : '#6b7280', backdropColor: 'transparent', stepSize: 2 },
                    min: 0,
                    max: 10
                }
            }
        }
    });
}

function renderCompanyTargetChart(careerName) {
    const ctx = document.getElementById("companyTargetChart").getContext("2d");
    const isLightTheme = document.body.classList.contains("light-theme");
    const gridColor = isLightTheme ? 'rgba(15, 23, 42, 0.06)' : 'rgba(255, 255, 255, 0.06)';
    const textColor = isLightTheme ? '#334155' : '#9ca3af';
    
    const data = TARGET_COMPANIES[careerName] || TARGET_COMPANIES["Software Engineer"];
    
    const labels = data.map(c => c.name);
    const packages = data.map(c => c.package);

    if (companyTargetChartInstance) {
        companyTargetChartInstance.destroy();
    }

    const isGov = careerName.includes("UPSC") || careerName.includes("MPSC") || careerName.includes("Railway") || careerName.includes("Banking") || careerName.includes("Teacher");
    const yLabel = isGov ? "Salary / Allowance Est. (₹ Lakhs LPA)" : "Avg Package (₹ LPA / $10k)";

    companyTargetChartInstance = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: yLabel,
                data: packages,
                backgroundColor: isLightTheme ? [
                    'rgba(79, 70, 229, 0.75)',
                    'rgba(124, 58, 237, 0.75)',
                    'rgba(13, 148, 136, 0.75)',
                    'rgba(5, 150, 105, 0.75)'
                ] : [
                    'rgba(99, 102, 241, 0.65)',
                    'rgba(168, 85, 247, 0.65)',
                    'rgba(0, 242, 254, 0.65)',
                    'rgba(16, 185, 129, 0.65)'
                ],
                borderColor: isLightTheme ? [
                    '#4f46e5',
                    '#7c3aed',
                    '#0f766e',
                    '#059669'
                ] : [
                    'var(--primary)',
                    'var(--secondary)',
                    'var(--accent)',
                    'var(--success)'
                ],
                borderWidth: 1.5,
                borderRadius: 8
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                y: {
                    grid: { color: gridColor },
                    ticks: { color: textColor, font: { family: 'Inter', size: 11 } }
                },
                x: {
                    grid: { display: false },
                    ticks: { color: textColor, font: { family: 'Plus Jakarta Sans', size: 11, weight: '600' } }
                }
            }
        }
    });
}

function renderVacancyRecommendations(careerName, userScore) {
    const container = document.getElementById("vacancy-recommendations-list");
    container.innerHTML = "";

    const list = VACANCIES[careerName] || VACANCIES["Software Engineer"];

    list.forEach((vac, idx) => {
        const card = document.createElement("div");
        card.className = "career-match-card";
        
        const variance = Math.round((Math.random() - 0.5) * 6);
        const matchPct = Math.clip(userScore + variance - (idx * 4), 40, 99);

        card.innerHTML = `
            <div class="career-match-header" style="margin-bottom: 0.5rem;">
                <div>
                    <h4 class="career-title" style="font-size: 1rem;">${vac.title}</h4>
                    <p style="font-size: 0.8rem; color: var(--text-secondary); margin-top: 0.15rem;">
                        <strong>${vac.company}</strong> • ${vac.location}
                    </p>
                </div>
                <span class="career-badge badge-primary" style="background-color: rgba(0, 242, 254, 0.1); border-color: rgba(0, 242, 254, 0.3); color: var(--accent);">
                    ${matchPct}% Match
                </span>
            </div>
            
            <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 0.85rem;">
                <span style="font-size: 0.85rem; color: var(--success); font-weight: 700;">
                    ${vac.package}
                </span>
                <a href="${vac.url}" target="_blank" class="btn btn-primary" style="padding: 0.4rem 1rem; font-size: 0.8rem; border-radius: 8px; text-decoration: none;">
                    Apply Now <i data-lucide="external-link" style="width: 12px; height: 12px; margin-left: 2px;"></i>
                </a>
            </div>
        `;
        
        container.appendChild(card);
    });

    lucide.createIcons();
}

function renderCareerRecommendations(recs) {
    const container = document.getElementById("career-recommendations-list");
    container.innerHTML = "";

    recs.slice(0, 3).forEach((rec, idx) => {
        const isPrimary = idx === 0;
        const card = document.createElement("div");
        card.className = `career-match-card ${isPrimary ? 'primary-match' : ''}`;
        
        const domainIcon = rec.domain === "government" ? "shield" : "briefcase";

        card.innerHTML = `
            <div class="career-match-header">
                <div>
                    <h4 class="career-title">${rec.name}</h4>
                    <p style="font-size: 0.8rem; color: var(--text-secondary); margin-top: 0.25rem;">${rec.description}</p>
                </div>
                <span class="career-badge ${isPrimary ? 'badge-primary' : 'badge-secondary'}">
                    ${isPrimary ? 'Top Recommendation' : 'Alternative Match'}
                </span>
            </div>
            
            <div style="display: flex; justify-content: space-between; font-size: 0.85rem; margin-bottom: 0.35rem;">
                <span style="color: var(--text-secondary);">Profile Match Alignment</span>
                <span style="font-weight: 700; color: ${isPrimary ? 'var(--primary)' : 'white'};">${rec.matchScore}%</span>
            </div>
            
            <div class="career-match-bar-container">
                <div class="career-match-bar" id="career-bar-${idx}"></div>
            </div>
            
            <div class="career-meta">
                <div class="career-meta-item">
                    <i data-lucide="${domainIcon}"></i>
                    <span>Sector: <strong>${rec.domain === "government" ? "Govt Exam" : "Private"}</strong></span>
                </div>
                <div class="career-meta-item">
                    <i data-lucide="trending-up"></i>
                    <span>Outcome: <strong>${rec.growth.split(' ')[0]}</strong></span>
                </div>
            </div>
        `;
        
        container.appendChild(card);

        setTimeout(() => {
            const bar = document.getElementById(`career-bar-${idx}`);
            if (bar) bar.style.width = `${rec.matchScore}%`;
        }, 100);
    });

    lucide.createIcons();
}

function renderRoadmap(roadmap) {
    const container = document.getElementById("skill-gap-roadmap");
    container.innerHTML = "";

    roadmap.forEach((stepData, idx) => {
        const step = document.createElement("div");
        step.className = `roadmap-step ${idx === 0 ? 'active' : ''}`;
        
        step.innerHTML = `
            <div class="roadmap-marker"></div>
            <div class="roadmap-content">
                <div class="roadmap-type">${stepData.phase}</div>
                <h4 class="roadmap-title">${stepData.title}</h4>
                <p class="roadmap-desc">${stepData.description}</p>
            </div>
        `;
        container.appendChild(step);
    });

    const steps = container.querySelectorAll(".roadmap-step");
    steps.forEach((s, i) => {
        setTimeout(() => {
            s.style.opacity = "1";
            s.style.transform = "translateX(0)";
        }, i * 150);
    });
}

function resetAssessment() {
    currentStep = 1;
    selectedSkills.clear();
    
    document.getElementById("profile-form").reset();
    
    document.getElementById("aptitude-val").textContent = "6/10";
    document.getElementById("comm-val").textContent = "7/10";
    document.getElementById("problem-val").textContent = "7/10";
    document.getElementById("teamwork-val").textContent = "8/10";
    document.getElementById("leadership-val").textContent = "6/10";

    const tags = document.querySelectorAll(".skill-tag");
    tags.forEach(tag => tag.classList.remove("selected"));

    document.getElementById("form-step-1").classList.add("active");
    document.getElementById("form-step-2").classList.remove("active");
    document.getElementById("form-step-3").classList.remove("active");

    document.getElementById("step-indicator-1").className = "step active";
    document.getElementById("step-indicator-2").className = "step";
    document.getElementById("step-indicator-3").className = "step";

    document.getElementById("assessment-section").classList.add("hidden");
    const gamifiedDash = document.getElementById("gamified-dashboard");
    if (gamifiedDash) gamifiedDash.classList.remove("hidden");
    const quizInterface = document.getElementById("quiz-interface-section");
    if (quizInterface) quizInterface.classList.add("hidden");
    
    document.getElementById("results-section").classList.add("hidden");
    const quizResultCard = document.getElementById("quiz-results-summary-card");
    if (quizResultCard) quizResultCard.classList.add("hidden");

    if (radarChartInstance) {
        radarChartInstance.destroy();
        radarChartInstance = null;
    }
    if (companyTargetChartInstance) {
        companyTargetChartInstance.destroy();
        companyTargetChartInstance = null;
    }
    resetYouTubePlayer();
}

/* ==========================================================================
   AI Career Coach Chatbot
   ========================================================================== */
async function initAuraCoach(results) {
    const chatContainer = document.getElementById("chat-messages-container");
    chatContainer.innerHTML = "";

    const primaryRole = results.primaryCareer.name;
    const isGov = results.primaryCareer.domain === "government";
    
    let welcomeMsg = "";
    
    const apiKey = currentUser ? localStorage.getItem(`gemini_api_key_${currentUser}`) : null;
    const avatarData = await loadAssetFromDB(`avatar_${currentUser}`);
    
    if (apiKey && results.initialCoachMessage) {
        welcomeMsg = results.initialCoachMessage;
    } else {
        welcomeMsg = `Hi <strong>${userData.name}</strong>! I'm Aura, your AI Career Counselor. 

I've analyzed your profile and predicted your <strong>Employability Index to be ${results.employabilityScore}%</strong>. Based on your inputs, your top career match is <strong style="color: var(--accent);">${primaryRole}</strong> (${results.primaryCareer.matchScore}% alignment).

I have outlined a personalized roadmap for your career journey. How can I help you prepare? We can discuss exam syllabus, preparation strategies, project portfolios, or recommended books.`;
    }

    appendChatBubble("ai", welcomeMsg);
    
    chatHistory = [
        { role: "model", parts: [{ text: welcomeMsg }] }
    ];

    renderChatSuggestions(primaryRole, isGov);
}

async function appendChatBubble(sender, text) {
    const container = document.getElementById("chat-messages-container");
    if (!container) return;

    const row = document.createElement("div");
    row.className = `chat-message-row ${sender === "ai" ? "chat-message-ai" : "chat-message-user"}`;
    
    let avatarHTML = "";
    if (sender === "ai") {
        avatarHTML = `<div class="chat-message-avatar"><i data-lucide="bot" style="width: 14px; height: 14px;"></i></div>`;
    } else {
        let avatarData = null;
        if (currentUser) {
            avatarData = await loadAssetFromDB(`avatar_${currentUser}`);
        }
        if (avatarData) {
            avatarHTML = `<div class="chat-message-avatar"><img src="${avatarData}" alt="User"></div>`;
        } else {
            avatarHTML = `<div class="chat-message-avatar"><i data-lucide="user" style="width: 14px; height: 14px; color: var(--primary);"></i></div>`;
        }
    }
    
    row.innerHTML = `
        ${avatarHTML}
        <div class="chat-bubble chat-bubble-${sender === "ai" ? "ai" : "user"}">${text.replace(/\n/g, "<br>")}</div>
    `;
    
    container.appendChild(row);
    lucide.createIcons();
    container.scrollTop = container.scrollHeight;
}

function renderChatSuggestions(role, isGov) {
    const container = document.getElementById("chat-suggestions");
    container.innerHTML = "";

    let suggestions = [];
    if (isGov) {
        suggestions = [
            `What is the exam syllabus for ${role}?`,
            `How should I prepare for GK & Aptitude?`,
            `What books are recommended?`
        ];
    } else {
        suggestions = [
            `What projects should I build for ${role}?`,
            `Which certifications should I pursue?`,
            `How can I improve my score of ${predictionResults.employabilityScore}%?`
        ];
    }

    suggestions.forEach(text => {
        const btn = document.createElement("button");
        btn.className = "chat-suggestion-btn";
        btn.textContent = text;
        btn.onclick = () => {
            document.getElementById("chat-user-input").value = text;
            sendChatMessage();
        };
        container.appendChild(btn);
    });
}

async function sendChatMessage() {
    const inputEl = document.getElementById("chat-user-input");
    const text = inputEl.value.trim();
    if (!text) return;

    await appendChatBubble("user", text);
    inputEl.value = "";

    document.getElementById("chat-suggestions").innerHTML = "";

    showTypingIndicator();
    
    chatHistory.push({ role: "user", parts: [{ text: text }] });

    const apiKey = currentUser ? localStorage.getItem(`gemini_api_key_${currentUser}`) : null;

    try {
        if (apiKey) {
            const botResponse = await callGeminiChat(apiKey, chatHistory, userData, predictionResults);
            hideTypingIndicator();
            await appendChatBubble("ai", botResponse);
            chatHistory.push({ role: "model", parts: [{ text: botResponse }] });
        } else {
            await new Promise(resolve => setTimeout(resolve, 1000));
            hideTypingIndicator();
            const botResponse = generateLocalCoachResponse(text);
            await appendChatBubble("ai", botResponse);
            chatHistory.push({ role: "model", parts: [{ text: botResponse }] });
        }
    } catch (error) {
        console.error("Chat API failed:", error);
        hideTypingIndicator();
        await appendChatBubble("ai", `I'm having trouble connecting to my LLM engine right now (${error.message}). Let me reply in offline mode:\n\n` + generateLocalCoachResponse(text));
    }

    renderChatSuggestions(predictionResults.primaryCareer.name, predictionResults.primaryCareer.domain === "government");
}

function showTypingIndicator() {
    const container = document.getElementById("chat-messages-container");
    const indicator = document.createElement("div");
    indicator.className = "chat-bubble chat-bubble-ai";
    indicator.id = "chat-typing-indicator";
    indicator.innerHTML = `<span style="font-style: italic; color: var(--text-secondary);">Aura is thinking...</span>`;
    container.appendChild(indicator);
    container.scrollTop = container.scrollHeight;
}

function hideTypingIndicator() {
    const indicator = document.getElementById("chat-typing-indicator");
    if (indicator) indicator.remove();
}

async function callGeminiChat(apiKey, history, profile, results) {
    const model = (currentUser ? localStorage.getItem(`gemini_api_model_${currentUser}`) : null) || "gemini-2.0-flash";
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
    
    const systemInstruction = `You are Aura, an encouraging and highly knowledgeable AI Career Counselor.
    You have analyzed the student's profile:
    ${JSON.stringify(profile, null, 2)}
    
    And their predicted career guidance results:
    ${JSON.stringify(results, null, 2)}
    
    Answer the student's questions in a friendly, supportive tone. Provide specific, actionable advice. 
    If they are asking about government exams (UPSC, MPSC, Railways, Banking, Teaching), provide details about exam patterns, subject preparation, General Knowledge, and mental health/patience.
    If they ask about private sector, discuss coding projects, GitHub, and resumes.
    Keep answers relatively concise (1-2 paragraphs max) and use bullet points where helpful.`;

    const requestBody = {
        contents: history,
        generationConfig: {
            temperature: 0.7
        },
        systemInstruction: {
            parts: [{ text: systemInstruction }]
        }
    };
    
    const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestBody)
    });
    
    if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error?.message || "Failed to communicate with Gemini API");
    }
    
    const data = await response.json();
    return data.candidates[0].content.parts[0].text;
}

function generateLocalCoachResponse(query) {
    const q = query.toLowerCase();
    const role = predictionResults.primaryCareer.name;
    const isGov = predictionResults.primaryCareer.domain === "government";
    const missing = predictionResults.missingSkills;

    if (q.includes("boost") || q.includes("improve") || q.includes("score")) {
        return `To improve your employability index of <strong>${predictionResults.employabilityScore}%</strong>, I recommend:\n\n` +
            `• <strong>Acquire Missing Core Competencies</strong>: Focus on learning: ${missing.length > 0 ? missing.map(s => s.replace("_", " ")).join(", ") : "None. Your core skills are good!"}.\n` +
            `• <strong>Improve your Aptitude/GK rating</strong>: Practice quantitative aptitude and daily current affairs. This is highly weighted.\n` +
            `• <strong>Certifications & Mock Tests</strong>: Practice regularly. Earning credentials or taking mock tests boosts your profile validation score.`;
    }

    if (isGov) {
        if (q.includes("syllabus") || q.includes("exam") || q.includes("pattern")) {
            if (role.includes("UPSC") || role.includes("MPSC")) {
                return `For <strong>${role}</strong>, the exam consists of three stages:\n\n` +
                    `1. <strong>Prelims</strong>: General Studies (History, Geography, Polity, Economics, Science, Current Affairs) & CSAT (Aptitude).\n` +
                    `2. <strong>Mains</strong>: Descriptive papers on General Studies and your optional subjects.\n` +
                    `3. <strong>Interview</strong>: Personality and administrative aptitude test.\n\n` +
                    `Start by mastering NCERT textbooks (Class 6-12) for core subjects!`;
            } else if (role.includes("Banking")) {
                return `For <strong>Banking Exams (SBI/IBPS PO)</strong>, the pattern includes:\n\n` +
                    `• <strong>Prelims & Mains</strong>: Quantitative Aptitude, Logical Reasoning, English, and Banking/Financial Awareness.\n` +
                    `• <strong>Group Discussion & Interview</strong>: Assessing communication and banking aptitude.\n\n` +
                    `Speed and accuracy are key. Practice sectional mock tests daily!`;
            } else if (role.includes("Railway")) {
                return `For <strong>Railway Exams (RRB)</strong>, the exam is computer-based (CBT) and tests:\n\n` +
                    `• Mathematics/Aptitude, General Intelligence & Reasoning, General Science, and General Awareness.\n\n` +
                    `Focus heavily on basic Science (up to Class 10 CBSE) and speed arithmetic!`;
            } else {
                return `For <strong>Government Teacher</strong>, you need to qualify TET/CTET or UGC NET. The exam tests:\n\n` +
                    `• Child Development & Pedagogy, Teaching Methodology, General English, and your specific Subject Specialization.\n\n` +
                    `Prioritize Child Psychology and teaching pedagogy papers!`;
            }
        }

        if (q.includes("book") || q.includes("source") || q.includes("read")) {
            if (role.includes("UPSC") || role.includes("MPSC")) {
                return `Here are the standard reference books for <strong>${role}</strong>:\n\n` +
                    `• <strong>Polity</strong>: Laxmikanth\n` +
                    `• <strong>History</strong>: Modern India by Spectrum / Bipan Chandra\n` +
                    `• <strong>Geography</strong>: GC Leong and NCERTs\n` +
                    `• <strong>Economics</strong>: Ramesh Singh / Sanjiv Verma\n` +
                    `• <strong>Current Affairs</strong>: Daily newspaper (The Hindu / Indian Express).`;
            }
            return `For this exam, focus on standard aptitude guides (like R.S. Aggarwal for Quantitative Aptitude & Reasoning), Lucent's General Knowledge, and NCERT school textbooks.`;
        }

        if (q.includes("gk") || q.includes("aptitude") || q.includes("prepare")) {
            return `Preparing for General Knowledge and Aptitude requires consistency:\n\n` +
                `• <strong>Aptitude</strong>: Learn shortcut methods for Vedic math, percentages, ratios, and time-work. Practice 20 questions daily.\n` +
                `• <strong>GK & Current Affairs</strong>: Spend 45 minutes reading the newspaper. Maintain a concise notebook for national, international, and state news.`;
        }
    } else {
        if (q.includes("project") || q.includes("build")) {
            return `For a <strong>${role}</strong> path, here are 2 project ideas:\n\n` +
                `• <strong>${predictionResults.primaryCareer.projectSuggestions[0]}</strong>: Excellent for core logic and backend/database design.\n` +
                `• <strong>${predictionResults.primaryCareer.projectSuggestions[1] || "Portfolio Website"}</strong>: Demonstrates hosting, integration, and UI principles.\n\n` +
                `Commit your code to GitHub and add a clean README.`;
        }
        if (q.includes("cert")) {
            return `For <strong>${role}</strong>, the best credentials are:\n\n` +
                `• <strong>${predictionResults.primaryCareer.certRecommendations[0]}</strong>\n` +
                `• <strong>${predictionResults.primaryCareer.certRecommendations[1] || "Google Professional Certificate"}</strong>.`;
        }
    }

    return `That's an excellent question. For your target path in <strong>${role}</strong>, I recommend focusing on the steps in Phase 1 of your roadmap. Would you like me to explain any specific subject, project idea, or exam preparation strategy in detail?`;
}

/* ==========================================================================
   Form Stepper Control
   ========================================================================== */
function nextStep(step) {
    // Validate current step inputs
    const currentStepDiv = document.getElementById(`form-step-${currentStep}`);
    if (currentStepDiv) {
        const inputs = currentStepDiv.querySelectorAll('input[required], select[required], textarea[required]');
        let isValid = true;
        inputs.forEach(input => {
            if (!input.checkValidity()) {
                input.reportValidity();
                isValid = false;
            }
        });
        if (!isValid) return;
    }

    // Deactivate current step UI
    const currentFormStep = document.getElementById(`form-step-${currentStep}`);
    const currentIndicator = document.getElementById(`step-indicator-${currentStep}`);
    if (currentFormStep) currentFormStep.classList.remove("active");
    if (currentIndicator) currentIndicator.classList.remove("active");

    // Toggle completed class for past steps
    for (let i = 1; i < step; i++) {
        const ind = document.getElementById(`step-indicator-${i}`);
        if (ind) ind.classList.add("completed");
    }
    
    // Switch state
    currentStep = step;
    
    // Activate next step UI
    const nextFormStep = document.getElementById(`form-step-${currentStep}`);
    const nextIndicator = document.getElementById(`step-indicator-${currentStep}`);
    if (nextFormStep) nextFormStep.classList.add("active");
    if (nextIndicator) nextIndicator.classList.add("active");
}

function prevStep(step) {
    // Deactivate current step UI
    const currentFormStep = document.getElementById(`form-step-${currentStep}`);
    const currentIndicator = document.getElementById(`step-indicator-${currentStep}`);
    if (currentFormStep) currentFormStep.classList.remove("active");
    if (currentIndicator) currentIndicator.classList.remove("active");

    // Clear completed flags for forward steps
    for (let i = step; i <= 3; i++) {
        const ind = document.getElementById(`step-indicator-${i}`);
        if (ind) {
            ind.classList.remove("completed");
        }
    }
    
    // Switch state
    currentStep = step;
    
    // Activate previous step UI
    const prevFormStep = document.getElementById(`form-step-${currentStep}`);
    const prevIndicator = document.getElementById(`step-indicator-${currentStep}`);
    if (prevFormStep) prevFormStep.classList.add("active");
    if (prevIndicator) prevIndicator.classList.add("active");
}

/* ==========================================================================
   Theme Swapper Controller
   ========================================================================== */
function toggleTheme() {
    const isLight = document.body.classList.toggle("light-theme");
    localStorage.setItem("theme", isLight ? "light" : "dark");
    
    // Toggle Icon in Header & Auth Card
    const headerIcon = document.getElementById("theme-toggle-icon");
    const authIcon = document.querySelector(".auth-theme-icon");
    const iconName = isLight ? "moon" : "sun";
    
    if (headerIcon) headerIcon.setAttribute("data-lucide", iconName);
    if (authIcon) authIcon.setAttribute("data-lucide", iconName);
    
    lucide.createIcons();
    
    // Re-render charts to adjust text and grid colors
    if (radarChartInstance && userData && predictionResults.radarScores) {
        renderRadarChart(predictionResults.radarScores);
    }
    if (companyTargetChartInstance && predictionResults.primaryCareer) {
        renderCompanyTargetChart(predictionResults.primaryCareer.name);
    }
}

/* ==========================================================================
   Real YouTube Video Player Controller
   ========================================================================== */
function playRealYouTubeVideo() {
    const thumbnail = document.getElementById("video-mock-thumbnail");
    const frame = document.getElementById("video-youtube-player-frame");
    
    if (thumbnail && frame) {
        thumbnail.classList.add("hidden");
        frame.classList.remove("hidden");
        frame.innerHTML = `<iframe width="100%" height="100%" src="https://www.youtube.com/embed/XP3yS1A86wE?autoplay=1" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen style="border-radius: 12px 12px 0 0; border: none; display: block;"></iframe>`;
    }
}


function resetYouTubePlayer() {
    const thumbnail = document.getElementById("video-mock-thumbnail");
    const frame = document.getElementById("video-youtube-player-frame");
    if (thumbnail && frame) {
        frame.classList.add("hidden");
        frame.innerHTML = "";
        thumbnail.classList.remove("hidden");
    }
}

/* ==========================================================================
   Gamified Learning & Skill Challenges Engine
   ========================================================================== */
const ACHIEVEMENTS = [
    { id: "first_quiz", name: "First Quiz Completed", icon: "🏅", desc: "Finish your first skill challenge" },
    { id: "explorer", name: "Career Explorer", icon: "⭐", desc: "Unlock predicted career roadmaps" },
    { id: "tech_enthusiast", name: "Tech Enthusiast", icon: "💻", desc: "Correct technical FIFO question" },
    { id: "fast_learner", name: "Fast Learner", icon: "📚", desc: "Finish question with >10s remaining" },
    { id: "career_ready", name: "Career Ready", icon: "🚀", desc: "Employability Index > 80%" },
    { id: "perfect_score", name: "Perfect Score", icon: "🎯", desc: "Answer all 5 questions correctly" },
    { id: "streak_7", name: "7-Day Streak", icon: "🔥", desc: "Maintain daily review habits" },
    { id: "master", name: "Assessment Master", icon: "👑", desc: "Earn 1000+ total XP points" }
];

const LEVEL_QUIZ_QUESTIONS = {
    1: [
        {
            category: "Technical Depth",
            text: "Which data structure operates on a First-In, First-Out (FIFO) basis?",
            options: ["Stack (LIFO)", "Queue (FIFO)", "Binary Search Tree", "Hash Map"],
            correct: 1,
            motivation: "Great developer knowledge! Speed up."
        },
        {
            category: "Aptitude & GK",
            text: "If a project team can complete 3 tasks in 4 hours, how many hours will it take them to complete 9 tasks?",
            options: ["8 Hours", "10 Hours", "12 Hours", "16 Hours"],
            correct: 2,
            motivation: "Excellent problem solving logic!"
        },
        {
            category: "Problem Solving",
            text: "Identify the next logical number in the sequence: 2, 6, 12, 20, 30, ...?",
            options: ["38", "40", "42", "46"],
            correct: 2,
            motivation: "Your analytical speed is top-notch!"
        },
        {
            category: "Communication Skill",
            text: "When handling a critical customer complaint about a system outage, what is the best initial response?",
            options: [
                "Explain it is a server issue and tell them to check back later.",
                "Acknowledge the impact, apologize, and provide a clear remediation update.",
                "Forward it to the developer team without sending any reply.",
                "Offer a refund immediately without investigating."
            ],
            correct: 1,
            motivation: "Superb active empathy score!"
        },
        {
            category: "Leadership & Collaboration",
            text: "Your team member is falling behind on their deliverables due to a lack of experience. What do you do?",
            options: [
                "Report them to the management team immediately.",
                "Take over their tasks and finish it yourself.",
                "Partner them with a senior member for mentorship & pair programming.",
                "Tell them to work overtime until they catch up."
            ],
            correct: 2,
            motivation: "True collaborative leader! You are ready."
        }
    ],
    2: [
        {
            category: "Technical Depth",
            text: "In relational databases, what does the 'ACID' acronym stand for?",
            options: [
                "Algorithms, Code, Integration, Deployment",
                "Atomicity, Consistency, Isolation, Durability",
                "Array, Character, Integer, Double",
                "Access, Control, Index, Database"
            ],
            correct: 1,
            motivation: "Solid database knowledge! Keep pushing."
        },
        {
            category: "Aptitude & GK",
            text: "A car travels at 60 km/h for the first 30 minutes and then at 80 km/h for the next 30 minutes. What is its average speed?",
            options: ["68 km/h", "70 km/h", "72 km/h", "75 km/h"],
            correct: 1,
            motivation: "Perfect calculation of weighted averages!"
        },
        {
            category: "Problem Solving",
            text: "If all Bloops are Razzies and all Razzies are Lizzies, then which of the following statements MUST be true?",
            options: [
                "All Lizzies are Bloops",
                "All Bloops are Lizzies",
                "No Bloops are Lizzies",
                "Some Razzies are not Lizzies"
            ],
            correct: 1,
            motivation: "Exceptional logic flow!"
        },
        {
            category: "Communication Skill",
            text: "You notice a critical miscommunication between the design team and the development team. What is the best action?",
            options: [
                "Wait for the project manager to handle it.",
                "Send an angry email pointing fingers to resolve responsibility.",
                "Schedule a quick sync call with both leads to align requirements.",
                "Change the code silently to match designs."
            ],
            correct: 2,
            motivation: "Active problem solver! Great communication skill."
        },
        {
            category: "Leadership & Collaboration",
            text: "During a sprint planning session, two senior engineers strongly disagree on the database design. How do you resolve it?",
            options: [
                "Vote on it immediately to save project time.",
                "Ask them to document pros/cons and review them objectively against project goals.",
                "Choose the option proposed by the lead engineer without debate.",
                "Delay database work until next sprint."
            ],
            correct: 1,
            motivation: "Masterful conflict resolution methodology!"
        }
    ],
    3: [
        {
            category: "Technical Depth",
            text: "What is the worst-case time complexity of searching for an element in a balanced binary search tree (BST)?",
            options: ["O(1)", "O(log n)", "O(n)", "O(n log n)"],
            correct: 1,
            motivation: "Excellent knowledge of algorithmic analysis!"
        },
        {
            category: "Aptitude & GK",
            text: "A sum of money doubles itself in 5 years at simple interest. In how many years will it become four times itself?",
            options: ["10 Years", "12 Years", "15 Years", "20 Years"],
            correct: 2,
            motivation: "Correct! Simple interest scales linearly."
        },
        {
            category: "Problem Solving",
            text: "Five people sitting in a row. A is next to B, but not C. If C is next to D, and D is not next to E, who sits next to E?",
            options: ["A", "B", "C", "D"],
            correct: 0,
            motivation: "Outstanding logical reasoning!"
        },
        {
            category: "Communication Skill",
            text: "You need to deliver the news of a 2-week launch delay to a high-profile client. How should you approach this?",
            options: [
                "Send a quick email late on Friday evening.",
                "Set up a video call, explain the technical challenges, and present a revised launch plan.",
                "Blame the QA testing team for finding too many bugs.",
                "Wait until the original launch date passes to say anything."
            ],
            correct: 1,
            motivation: "Honest and proactive client management!"
        },
        {
            category: "Leadership & Collaboration",
            text: "A critical production bug is discovered on launch day, causing major customer impact. How do you lead your team?",
            options: [
                "Call an emergency meeting to find who wrote the bug.",
                "Mobilize a hotfix task force to patch the issue while keeping stakeholders updated.",
                "Roll back the server and take the day off to cool down.",
                "Tell the QA lead to fix it alone."
            ],
            correct: 1,
            motivation: "Great situational leadership!"
        }
    ],
    4: [
        {
            category: "Technical Depth",
            text: "Which architectural pattern is best suited for decoupling microservices in a high-volume real-time trading system?",
            options: [
                "Monolithic Architecture",
                "Event-Driven Pub/Sub Pattern",
                "Simple Client-Server Model",
                "Peer-to-Peer file sharing"
            ],
            correct: 1,
            motivation: "Professional systems architect tier!"
        },
        {
            category: "Aptitude & GK",
            text: "Three pipes A, B, and C can fill a tank in 6 hours. After working for 2 hours, C is closed. A and B fill the rest in 8 hours. How long will C take alone?",
            options: ["10 Hours", "12 Hours", "14 Hours", "16 Hours"],
            correct: 2,
            motivation: "Genius! Expert calculations solved."
        },
        {
            category: "Problem Solving",
            text: "In a certain code language, 'COMPUTER' is written as 'RFUVQNPC'. How is 'MEDICINE' written in that code?",
            options: ["EOJDJEFM", "EOJDEJFM", "MFEJDJOE", "MFJEDJOE"],
            correct: 1,
            motivation: "Mind-blowing cryptography speed!"
        },
        {
            category: "Communication Skill",
            text: "An executive stakeholder demands a major out-of-scope feature addition 1 week before release. How do you respond?",
            options: [
                "Refuse the request flat out.",
                "Accept it immediately and force your team to work 18-hour days.",
                "Document the impact on launch timelines and budget, and present trade-off options to the executive.",
                "Add it poorly without testing."
            ],
            correct: 2,
            motivation: "Splendid stakeholder alignment tactics!"
        },
        {
            category: "Leadership & Collaboration",
            text: "Your startup is pivot-testing and needs to change architectures. The team is demotivated about throwing away 3 months of work. Action?",
            options: [
                "Order them to do it because they are paid to code.",
                "Explain the business necessity, acknowledge their efforts, and align the new architecture with future skills development.",
                "Replace the demotivated developers.",
                "Proceed silently without explaining the pivot."
            ],
            correct: 1,
            motivation: "Superlative leadership and empathy! You are a master."
        }
    ]
};

let MOCK_QUIZ_QUESTIONS = [...LEVEL_QUIZ_QUESTIONS[1]];

let currentQuizQuestionIndex = 0;
let selectedAnswers = [null, null, null, null, null];
let quizTimer = null;
let quizTimeLeft = 20;
let quizTimerScore = 0; // Tracks questions finished with > 10s left

function initGamifiedStats() {
    if (!currentUser) return;
    
    // Load or initialize XP
    let xp = parseInt(localStorage.getItem(`gamified_xp_${currentUser}`) || "0");
    let streak = parseInt(localStorage.getItem(`gamified_streak_${currentUser}`) || "1");
    let unlocked = JSON.parse(localStorage.getItem(`gamified_badges_${currentUser}`) || '["explorer"]');
    
    // Calculate level progression (500 XP per level)
    let level = Math.floor(xp / 500) + 1;
    let levelTitle = "Beginner";
    if (level === 2) levelTitle = "Intermediate";
    else if (level === 3) levelTitle = "Advanced";
    else if (level >= 4) levelTitle = "Expert";
    
    let xpToNext = 500 - (xp % 500);
    let progressPercent = ((xp % 500) / 500) * 100;
    
    // Update Stats UI
    const levelEl = document.getElementById("user-gamified-level");
    if (levelEl) levelEl.textContent = `${levelTitle} (Lvl ${level})`;
    
    const xpEl = document.getElementById("user-gamified-xp");
    if (xpEl) xpEl.textContent = `${xp} XP`;
    
    const streakEl = document.getElementById("user-gamified-streak");
    if (streakEl) streakEl.textContent = `${streak} Day${streak > 1 ? 's' : ''}`;
    
    const trackerEl = document.getElementById("user-xp-to-next");
    if (trackerEl) trackerEl.textContent = `${xp % 500} / 500 XP to next level`;
    
    const barEl = document.getElementById("user-level-progress-bar");
    if (barEl) barEl.style.width = `${progressPercent}%`;
    
    renderAchievementsGrid(unlocked);
    renderLeaderboard();
}

function renderAchievementsGrid(unlockedList) {
    const grid = document.getElementById("badges-grid");
    if (!grid) return;
    grid.innerHTML = "";
    
    ACHIEVEMENTS.forEach(badge => {
        const isUnlocked = unlockedList.includes(badge.id);
        const card = document.createElement("div");
        card.className = `badge-item ${isUnlocked ? 'unlocked' : ''}`;
        
        card.innerHTML = `
            <div class="badge-icon-wrapper">${badge.icon}</div>
            <div class="badge-name">${badge.name}</div>
            <div class="badge-desc">${badge.desc}</div>
        `;
        grid.appendChild(card);
    });
}

function renderLeaderboard() {
    const podiumContainer = document.querySelector(".leaderboard-podiums");
    const rowsContainer = document.getElementById("leaderboard-rows-body");
    if (!rowsContainer) return;
    
    // Static top users + logged user
    let topUsers = [
        { name: "Sophia Vance", xp: 1850, readiness: 92, badgeCount: 6, avatar: "👩‍💻" },
        { name: "Liam Miller", xp: 1400, readiness: 88, badgeCount: 5, avatar: "👨‍💻" },
        { name: "Aria Chen", xp: 1200, readiness: 85, badgeCount: 4, avatar: "👩" }
    ];
    
    // Add current user to leaderboard comparison
    let userXp = currentUser ? parseInt(localStorage.getItem(`gamified_xp_${currentUser}`) || "0") : 0;
    let userBadges = currentUser ? JSON.parse(localStorage.getItem(`gamified_badges_${currentUser}`) || '["explorer"]') : ["explorer"];
    
    // Get last prediction score
    let userReady = 0;
    const history = JSON.parse(localStorage.getItem(`history_${currentUser}`) || "[]");
    if (history.length > 0) {
        userReady = parseInt(history[0].score);
    }
    
    let userDisplay = currentUser ? (currentUser.charAt(0).toUpperCase() + currentUser.slice(1)) : "You";
    let userObj = { name: userDisplay, xp: userXp, readiness: userReady, badgeCount: userBadges.length, avatar: "👤", isSelf: true };
    
    let completeList = [...topUsers, userObj].sort((a,b) => b.xp - a.xp);
    
    // Podium rendering (Top 3)
    if (podiumContainer) {
        podiumContainer.innerHTML = "";
        const podiumsOrder = [completeList[1], completeList[0], completeList[2]].filter(x => x);
        podiumsOrder.forEach((user, idx) => {
            if (!user) return;
            const rank = completeList.indexOf(user) + 1;
            let rankClass = "first-place";
            if (rank === 2) rankClass = "second-place";
            if (rank === 3) rankClass = "third-place";
            
            const pCard = document.createElement("div");
            pCard.className = `leaderboard-podium-card ${rankClass}`;
            pCard.innerHTML = `
                <span class="podium-rank-badge">${rank}</span>
                <div class="podium-avatar-wrapper" style="font-size: 1.5rem;">${user.avatar}</div>
                <div style="font-size: 0.8rem; font-weight: 700; color: white;">${user.name}</div>
                <div style="font-size: 0.7rem; color: #fbbf24;">${user.xp} XP</div>
            `;
            podiumContainer.appendChild(pCard);
        });
    }
    
    // Table rows rendering
    rowsContainer.innerHTML = "";
    completeList.forEach((user, idx) => {
        const row = document.createElement("tr");
        if (user.isSelf) {
            row.className = "leaderboard-row-active";
        }
        row.innerHTML = `
            <td style="padding: 8px 12px; font-weight: bold;">#${idx + 1}</td>
            <td style="padding: 8px 12px; display: flex; align-items: center; gap: 6px;">
                <span style="font-size: 1.1rem;">${user.avatar}</span> <span>${user.name}</span>
            </td>
            <td style="padding: 8px 12px; text-align: center; color: #fbbf24; font-weight: 600;">${user.xp}</td>
            <td style="padding: 8px 12px; text-align: center; color: var(--accent);">${user.readiness}%</td>
            <td style="padding: 8px 12px; text-align: center;">🏆 ${user.badgeCount}</td>
        `;
        rowsContainer.appendChild(row);
    });
}

function openQuizSetupModal() {
    const modal = document.getElementById("quiz-setup-modal");
    if (!modal) return;
    modal.classList.remove("hidden");
    
    // Confirm profile name default
    let displayName = currentUser ? (currentUser.charAt(0).toUpperCase() + currentUser.slice(1)) : "";
    const profile = JSON.parse(localStorage.getItem(`profile_data_${currentUser}`) || "{}");
    if (profile.fullName) displayName = profile.fullName;
    
    document.getElementById("quiz-setup-name").value = displayName;
}

function closeQuizSetupModal() {
    const modal = document.getElementById("quiz-setup-modal");
    if (modal) modal.classList.add("hidden");
}

function showManualAssessmentForm() {
    // Hide dashboard, show original form
    const gamifiedDash = document.getElementById("gamified-dashboard");
    if (gamifiedDash) gamifiedDash.classList.add("hidden");
    const assessSection = document.getElementById("assessment-section");
    if (assessSection) assessSection.classList.remove("hidden");
    
    // Reset Stepper form indicators
    currentStep = 1;
    for (let i = 1; i <= 3; i++) {
        const ind = document.getElementById(`step-indicator-${i}`);
        if (ind) {
            ind.classList.remove("completed");
            ind.classList.remove("active");
        }
    }
    const step1Ind = document.getElementById("step-indicator-1");
    if (step1Ind) step1Ind.classList.add("active");
    
    // Toggle active form step
    for (let i = 1; i <= 3; i++) {
        const stepDiv = document.getElementById(`form-step-${i}`);
        if (stepDiv) stepDiv.classList.remove("active");
    }
    const step1Form = document.getElementById("form-step-1");
    if (step1Form) step1Form.classList.add("active");
}

function launchChallengeQuiz(e) {
    if (e) e.preventDefault();
    closeQuizSetupModal();
    
    const name = document.getElementById("quiz-setup-name").value;
    const degree = document.getElementById("quiz-setup-degree").value;
    const major = document.getElementById("quiz-setup-major").value;
    const sector = document.getElementById("quiz-setup-sector").value;
    
    // Pre-populate hidden credentials
    userData = { name, degree, major, domain: sector };
    
    // Toggle panels
    const gamifiedDash = document.getElementById("gamified-dashboard");
    if (gamifiedDash) gamifiedDash.classList.add("hidden");
    const quizSection = document.getElementById("quiz-interface-section");
    if (quizSection) quizSection.classList.remove("hidden");
    
    startChallengeQuiz();
}

function startChallengeQuiz() {
    // Determine user's current level based on XP
    let xp = 0;
    if (currentUser) {
        xp = parseInt(localStorage.getItem(`gamified_xp_${currentUser}`) || "0");
    }
    let level = Math.floor(xp / 500) + 1;
    if (level > 4) level = 4; // Expert tier is the maximum level question pool
    
    MOCK_QUIZ_QUESTIONS = [...(LEVEL_QUIZ_QUESTIONS[level] || LEVEL_QUIZ_QUESTIONS[1])];

    currentQuizQuestionIndex = 0;
    selectedAnswers = [null, null, null, null, null];
    quizTimerScore = 0;
    
    loadQuizQuestion(0);
}

function loadQuizQuestion(index) {
    const qData = MOCK_QUIZ_QUESTIONS[index];
    
    // Counters
    document.getElementById("quiz-question-counter").textContent = `Question ${index + 1} of 5`;
    document.getElementById("quiz-progress-indicator").style.width = `${((index + 1) / 5) * 100}%`;
    document.getElementById("quiz-question-text").textContent = qData.text;
    
    // Render options
    const optContainer = document.getElementById("quiz-options-container");
    optContainer.innerHTML = "";
    
    qData.options.forEach((opt, optIdx) => {
        const letter = String.fromCharCode(65 + optIdx); // A, B, C, D
        const isSelected = selectedAnswers[index] === optIdx;
        
        const card = document.createElement("div");
        card.className = `quiz-option-card ${isSelected ? 'selected' : ''}`;
        card.onclick = () => selectQuizOption(optIdx);
        
        card.innerHTML = `
            <div class="quiz-option-marker">${letter}</div>
            <div class="quiz-option-text">${opt}</div>
        `;
        optContainer.appendChild(card);
    });
    
    // Motivation
    document.getElementById("quiz-motivational-msg").textContent = qData.motivation;
    
    // Buttons state
    document.getElementById("btn-quiz-prev").disabled = (index === 0);
    const nextBtn = document.getElementById("btn-quiz-next");
    nextBtn.innerHTML = (index === 4) ? `Finish Challenge <i data-lucide="check-circle" style="width:12px; height:12px; vertical-align:middle; margin-left:4px;"></i>` : `Next <i data-lucide="arrow-right" style="width:12px; height:12px; vertical-align:middle; margin-left:4px;"></i>`;
    lucide.createIcons();
    
    // Reset timer
    if (quizTimer) clearInterval(quizTimer);
    quizTimeLeft = 20;
    document.getElementById("quiz-countdown").textContent = `${quizTimeLeft}s`;
    
    quizTimer = setInterval(() => {
        quizTimeLeft--;
        document.getElementById("quiz-countdown").textContent = `${quizTimeLeft}s`;
        
        if (quizTimeLeft <= 0) {
            clearInterval(quizTimer);
            // Default selected answer if timeout
            if (selectedAnswers[currentQuizQuestionIndex] === null) {
                selectedAnswers[currentQuizQuestionIndex] = 0; // Choose option A
            }
            nextQuizQuestion();
        }
    }, 1000);
}

function selectQuizOption(optionIdx) {
    selectedAnswers[currentQuizQuestionIndex] = optionIdx;
    
    const cards = document.querySelectorAll(".quiz-option-card");
    cards.forEach((card, idx) => {
        if (idx === optionIdx) card.classList.add("selected");
        else card.classList.remove("selected");
    });
}

function nextQuizQuestion() {
    if (selectedAnswers[currentQuizQuestionIndex] === null) {
        alert("Please select an option to proceed.");
        return;
    }
    
    // If finished under 10 seconds, count as fast answer
    if (quizTimeLeft > 10) quizTimerScore++;
    
    if (currentQuizQuestionIndex < 4) {
        currentQuizQuestionIndex++;
        loadQuizQuestion(currentQuizQuestionIndex);
    } else {
        clearInterval(quizTimer);
        finishChallengeQuiz();
    }
}

function prevQuizQuestion() {
    if (currentQuizQuestionIndex > 0) {
        currentQuizQuestionIndex--;
        loadQuizQuestion(currentQuizQuestionIndex);
    }
}

async function finishChallengeQuiz() {
    // 1. Evaluate answers
    correctAnswersCount = 0;
    selectedAnswers.forEach((ans, idx) => {
        if (ans === MOCK_QUIZ_QUESTIONS[idx].correct) {
            correctAnswersCount++;
        }
    });
    
    const earnedXp = correctAnswersCount * 100;
    
    // Mapped scores values out of 10
    const aptitudeScore = (selectedAnswers[1] === MOCK_QUIZ_QUESTIONS[1].correct) ? 9 : 5;
    const commScore = (selectedAnswers[3] === MOCK_QUIZ_QUESTIONS[3].correct) ? 9 : 5;
    const problemScore = (selectedAnswers[2] === MOCK_QUIZ_QUESTIONS[2].correct) ? 9 : 5;
    const teamworkScore = (selectedAnswers[4] === MOCK_QUIZ_QUESTIONS[4].correct) ? 9 : 6;
    const leadershipScore = (selectedAnswers[4] === MOCK_QUIZ_QUESTIONS[4].correct) ? 9 : 5;
    
    // Mapped technical score
    const techScore = (selectedAnswers[0] === MOCK_QUIZ_QUESTIONS[0].correct) ? 9 : 5;
    
    // 2. Pre-populate and submit manual form fields programmatically
    document.getElementById("input-name").value = userData.name;
    document.getElementById("input-degree").value = userData.degree;
    document.getElementById("input-major").value = userData.major;
    document.getElementById("input-specialization").value = userData.major;
    document.getElementById("input-gpa").value = "3.80";
    document.getElementById("input-sector").value = userData.domain;
    document.getElementById("input-exam-interest").value = (userData.domain === "government") ? "upsc" : "none";
    
    // Load skills
    selectedSkills.clear();
    if (userData.domain === "government") {
        selectedSkills.add("general_studies");
        selectedSkills.add("english_lang");
        selectedSkills.add("quant_apt");
    } else {
        selectedSkills.add("javascript");
        selectedSkills.add("html_css");
        selectedSkills.add("react");
    }
    
    document.getElementById("input-projects").value = Math.floor(correctAnswersCount / 2) + 1;
    document.getElementById("input-internships").value = (correctAnswersCount > 3) ? 1 : 0;
    document.getElementById("input-certs").value = (correctAnswersCount > 3) ? 2 : 1;
    document.getElementById("input-experience").value = 0;
    
    // Sliders population
    document.getElementById("input-aptitude").value = aptitudeScore;
    document.getElementById("input-comm").value = commScore;
    document.getElementById("input-problem").value = problemScore;
    document.getElementById("input-teamwork").value = teamworkScore;
    document.getElementById("input-leadership").value = leadershipScore;
    
    // Sync indicator labels
    document.getElementById("aptitude-val").textContent = `${aptitudeScore}/10`;
    document.getElementById("comm-val").textContent = `${commScore}/10`;
    document.getElementById("problem-val").textContent = `${problemScore}/10`;
    document.getElementById("teamwork-val").textContent = `${teamworkScore}/10`;
    document.getElementById("leadership-val").textContent = `${leadershipScore}/10`;
    
    // 3. Save reward points to LocalStorage
    let xp = parseInt(localStorage.getItem(`gamified_xp_${currentUser}`) || "0") + earnedXp;
    let unlocked = JSON.parse(localStorage.getItem(`gamified_badges_${currentUser}`) || '["explorer"]');
    
    // Achievement unlocking validation
    let newlyUnlocked = [];
    if (!unlocked.includes("first_quiz")) {
        unlocked.push("first_quiz");
        newlyUnlocked.push("first_quiz");
    }
    if (correctAnswersCount === 5 && !unlocked.includes("perfect_score")) {
        unlocked.push("perfect_score");
        newlyUnlocked.push("perfect_score");
    }
    if (techScore === 9 && !unlocked.includes("tech_enthusiast")) {
        unlocked.push("tech_enthusiast");
        newlyUnlocked.push("tech_enthusiast");
    }
    if (quizTimerScore >= 4 && !unlocked.includes("fast_learner")) {
        unlocked.push("fast_learner");
        newlyUnlocked.push("fast_learner");
    }
    if (xp >= 1000 && !unlocked.includes("master")) {
        unlocked.push("master");
        newlyUnlocked.push("master");
    }
    
    localStorage.setItem(`gamified_xp_${currentUser}`, xp);
    localStorage.setItem(`gamified_badges_${currentUser}`, JSON.stringify(unlocked));
    
    // Update streak counter (simulate day advancement or static increment)
    let streak = parseInt(localStorage.getItem(`gamified_streak_${currentUser}`) || "1");
    if (Math.random() > 0.5) {
        streak++;
        localStorage.setItem(`gamified_streak_${currentUser}`, streak);
    }
    
    // 4. Update the Gamified Quiz Summary DOM inside results panel
    const accuracy = Math.round((correctAnswersCount / 5) * 100);
    document.getElementById("quiz-summary-score").textContent = `${correctAnswersCount} / 5`;
    document.getElementById("quiz-summary-accuracy").textContent = `${accuracy}%`;
    document.getElementById("quiz-summary-xp").textContent = `+${earnedXp} XP`;
    document.getElementById("quiz-summary-time").textContent = `${quizTimeLeft}s remaining`;
    
    // Badge unlocking alert box
    const badgeBox = document.getElementById("quiz-summary-unlocked-badge-box");
    if (newlyUnlocked.length > 0) {
        const firstBadge = ACHIEVEMENTS.find(b => b.id === newlyUnlocked[0]);
        if (firstBadge) {
            document.getElementById("quiz-summary-badge-icon").textContent = firstBadge.icon;
            document.getElementById("quiz-summary-badge-name").textContent = firstBadge.name;
            document.getElementById("quiz-summary-badge-desc").textContent = firstBadge.desc;
            badgeBox.classList.remove("hidden");
        }
    } else {
        badgeBox.classList.add("hidden");
    }
    
    document.getElementById("quiz-results-summary-card").classList.remove("hidden");
    
    // Hide quiz screen
    document.getElementById("quiz-interface-section").classList.add("hidden");
    
    // 5. Submit actual assessment and render results
    await submitAssessment();
    
    // Trigger success confetti drops
    triggerConfetti();
    
    // Refresh stats
    initGamifiedStats();
}

function triggerConfetti() {
    const duration = 2500;
    const end = Date.now() + duration;
    
    const colors = ["#8b5cf6", "#6366f1", "#06b6d4", "#10b981", "#fbbf24", "#f43f5e"];
    
    (function frame() {
        if (Date.now() > end) return;
        
        for (let i = 0; i < 6; i++) {
            const conf = document.createElement("div");
            conf.style.position = "fixed";
            conf.style.zIndex = "99999";
            conf.style.width = Math.random() * 8 + 6 + "px";
            conf.style.height = Math.random() * 10 + 6 + "px";
            conf.style.background = colors[Math.floor(Math.random() * colors.length)];
            conf.style.left = Math.random() * 100 + "vw";
            conf.style.top = "-15px";
            conf.style.borderRadius = Math.random() > 0.5 ? "50%" : "2px";
            conf.style.transform = `rotate(${Math.random() * 360}deg)`;
            
            document.body.appendChild(conf);
            
            const speed = Math.random() * 3.5 + 2.5;
            const drift = Math.random() * 2 - 1;
            
            let top = -15;
            let left = parseFloat(conf.style.left);
            
            const interval = setInterval(() => {
                top += speed;
                left += drift;
                conf.style.top = top + "px";
                conf.style.left = left + "vw";
                
                if (top > window.innerHeight) {
                    clearInterval(interval);
                    conf.remove();
                }
            }, 16);
        }
        
        requestAnimationFrame(frame);
    }());
}

/* ==========================================================================
   Contact Us Form Controllers
   ========================================================================== */
function submitContactForm(e) {
    if (e) e.preventDefault();
    
    // Hide form, show success state
    const form = document.getElementById("contact-form");
    const success = document.getElementById("contact-success-state");
    
    if (form && success) {
        form.classList.add("hidden");
        success.classList.remove("hidden");
    }
}

function resetContactForm() {
    const form = document.getElementById("contact-form");
    const success = document.getElementById("contact-success-state");
    
    if (form && success) {
        form.reset();
        success.classList.add("hidden");
        form.classList.remove("hidden");
    }
}
