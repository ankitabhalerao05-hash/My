"use client";

import React, { useState, useEffect } from "react";
import { useApp } from "./context/AppContext";
import {
    Sparkles, Activity, FileText, History, UserCog, LogOut, Crown, Award, 
    Flame, Star, ChevronRight, HelpCircle, Mail, ShieldCheck, Scroll, 
    Building, AtSign, Bookmark, Send, CheckCircle, ArrowRight, Check, 
    Compass, FileCheck2, Milestone, Calendar, Plus, PlusCircle, ExternalLink, 
    Settings, RefreshCw, BarChart2, DollarSign, Users, Percent, Upload, 
    Edit, Trash2, ArrowUpRight, Search, Play, Phone, Lock, Moon, Sun, Briefcase
} from "lucide-react";
import {
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, BarChart, Bar
} from "recharts";

import AnalyticsTab from "./components/AnalyticsTab";
import ProfileTab from "./components/ProfileTab";
import VaultTab from "./components/VaultTab";
import SkillsTab from "./components/SkillsTab";
import RoadmapTab from "./components/RoadmapTab";
import SavedTab from "./components/SavedTab";

export default function Home() {
    const {
        currentUser, themeMode, toggleTheme, jobs, bootcamps, mentors, affiliates,
        bookings, scans, institutions, usageLimits, registerUser, loginUser, loginWithGoogle, logoutUser,
        launchStripeCheckout, stripeModalOpen, setStripeModalOpen, activeCheckoutPlan,
        completeMockSubscription, checkUsageLimit, earnXP, createJobListing,
        bookMentorSession, saveResumeScan, updateCurrentUser
    } = useApp();

    // Navigation & Tab state
    const [activeTab, setActiveTab] = useState("analytics"); // analytics, assessment, resume, jobs, bootcamps, affiliates, college, admin, profile, vault, skills, roadmap, saved
    const [authModal, setAuthModal] = useState(false);
    const [authMode, setAuthMode] = useState("login"); // login, register
    const [googleSSOActive, setGoogleSSOActive] = useState(false);
    const [ssoStep, setSsoStep] = useState("email"); // email, password, loading
    const [ssoEmail, setSsoEmail] = useState("");
    const [ssoPassword, setSsoPassword] = useState("");
    const [showSsoPassword, setShowSsoPassword] = useState(false);
    const [logoutConfirmOpen, setLogoutConfirmOpen] = useState(false);
    
    // Form Inputs state
    const [loginEmail, setLoginEmail] = useState("");
    const [loginPassword, setLoginPassword] = useState("");
    const [regName, setRegName] = useState("");
    const [regEmail, setRegEmail] = useState("");
    const [regPassword, setRegPassword] = useState("");
    const [regRole, setRegRole] = useState("CANDIDATE");

    // Recruiter Job Post state
    const [newJobTitle, setNewJobTitle] = useState("");
    const [newJobCompany, setNewJobCompany] = useState("");
    const [newJobCategory, setNewJobCategory] = useState("");
    const [newJobSalary, setNewJobSalary] = useState("");
    const [newJobLocation, setNewJobLocation] = useState("");
    const [newJobUrl, setNewJobUrl] = useState("");
    const [newJobRemote, setNewJobRemote] = useState(false);

    // Active Quiz state
    const [quizModalOpen, setQuizModalOpen] = useState(false);
    const [quizSetupName, setQuizSetupName] = useState("");
    const [quizSetupDegree, setQuizSetupDegree] = useState("B.S.");
    const [quizSetupMajor, setQuizSetupMajor] = useState("Computer Science");
    const [quizSetupSector, setQuizSetupSector] = useState("both");
    
    const [quizActive, setQuizActive] = useState(false);
    const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
    const [quizAnswers, setQuizAnswers] = useState([null, null, null, null, null]);
    const [quizTimer, setQuizTimer] = useState(20);
    const [quizTimerActive, setQuizTimerActive] = useState(false);
    const [quizResult, setQuizResult] = useState(null); // { score, xpEarned, accuracy }
    const [activeQuizQuestions, setActiveQuizQuestions] = useState([]);

    // Resume Scan state
    const [uploadedFile, setUploadedFile] = useState(null);
    const [scanningInProgress, setScanningInProgress] = useState(false);
    const [scanReport, setScanReport] = useState(null);

    // Mentor booking slot selection
    const [selectedMentor, setSelectedMentor] = useState(null);
    const [selectedSlot, setSelectedSlot] = useState("");

    // Contact Form state
    const [contactName, setContactName] = useState("");
    const [contactEmail, setContactEmail] = useState("");
    const [contactSubject, setContactSubject] = useState("");
    const [contactMsg, setContactMsg] = useState("");
    const [contactSuccess, setContactSuccess] = useState(false);

    // Public Portfolio styling state
    const [portfolioColor, setPortfolioColor] = useState("#8b5cf6");

    // Super Admin stats mock
    const [adminGrowthPeriod, setAdminGrowthPeriod] = useState("monthly");

    // Quiz Questions domain track levels data
    const DOMAIN_QUIZ_QUESTIONS = {
        tech: {
            1: [
                {
                    category: "Technical Depth",
                    text: "Which data structure operates on a First-In, First-Out (FIFO) basis?",
                    options: ["Stack (LIFO)", "Queue (FIFO)", "Binary Search Tree", "Hash Map"],
                    correct: 1,
                    motivation: "Foundational developer knowledge! Keep going."
                },
                {
                    category: "Aptitude & GK",
                    text: "If a project team can complete 3 tasks in 4 hours, how many hours will it take to complete 9 tasks?",
                    options: ["8 Hours", "10 Hours", "12 Hours", "16 Hours"],
                    correct: 2,
                    motivation: "Excellent logical scaling!"
                },
                {
                    category: "Problem Solving",
                    text: "Identify the next logical number in the sequence: 2, 6, 12, 20, 30, ...?",
                    options: ["38", "40", "42", "46"],
                    correct: 2,
                    motivation: "Awesome analytical pattern tracking!"
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
                    motivation: "Superb empathy focus!"
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
                    motivation: "True collaborative leadership mindset!"
                },
                {
                    category: "Technical Depth",
                    text: "Which HTML tag is used to define an ordered list?",
                    options: ["<ul>", "<ol>", "<li>", "<list>"],
                    correct: 1,
                    motivation: "Clean markup basics!"
                },
                {
                    category: "Technical Depth",
                    text: "Identify the correct code loop to print values from 1 to 5 in standard programming.",
                    options: [
                        "for (int i = 1; i <= 5; i++)",
                        "while (i == 5)",
                        "for (int i = 0; i < 5; i--)",
                        "loop 5 times"
                    ],
                    correct: 0,
                    motivation: "Fundamental logic control!"
                },
                {
                    category: "Aptitude & GK",
                    text: "A runner completes 100 meters in 10 seconds. What is their average speed in kilometers per hour?",
                    options: ["30 km/h", "36 km/h", "40 km/h", "45 km/h"],
                    correct: 1,
                    motivation: "Excellent dimensional analysis!"
                },
                {
                    category: "Aptitude & GK",
                    text: "What is the primary component of clean, unpolluted atmospheric air?",
                    options: ["Oxygen", "Nitrogen", "Carbon Dioxide", "Hydrogen"],
                    correct: 1,
                    motivation: "Solid general science base!"
                },
                {
                    category: "Communication Skill",
                    text: "What is the most effective protocol after concluding a project alignment meeting?",
                    options: [
                        "Delete draft diagrams immediately.",
                        "Assume everyone understands and do not follow up.",
                        "Circulate meeting minutes detailing clear owners & action items.",
                        "Wait for clients to prompt updates."
                    ],
                    correct: 2,
                    motivation: "Professional coordination!"
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
                    motivation: "Solid database fundamentals!"
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
                    options: ["All Lizzies are Bloops", "All Bloops are Lizzies", "No Bloops are Lizzies", "Some Razzies are not Lizzies"],
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
                },
                {
                    category: "Technical Depth",
                    text: "Which JavaScript array method is used to add new items to the end of an array?",
                    options: ["pop()", "push()", "shift()", "concat()"],
                    correct: 1,
                    motivation: "Correct! Modifies standard arrays."
                },
                {
                    category: "Technical Depth",
                    text: "What does the standard HTTP status code 404 signify?",
                    options: ["Successful response", "Internal server error", "Resource not found", "Bad gateway request"],
                    correct: 2,
                    motivation: "Web client basics!"
                },
                {
                    category: "Problem Solving",
                    text: "A clock strikes 6 times in 5 seconds. How long will it take to strike 12 times?",
                    options: ["10 seconds", "10.5 seconds", "11 seconds", "12 seconds"],
                    correct: 2,
                    motivation: "Masterful mathematical intervals deduction!"
                },
                {
                    category: "Technical Depth",
                    text: "Which model describes CSS Flexbox layout methodology?",
                    options: [
                        "One-dimensional layout layout manager",
                        "Two-dimensional layouts alignment grid",
                        "Absolute coordinates placing index",
                        "Responsive flex tables only"
                    ],
                    correct: 0,
                    motivation: "Sleek presentation developer!"
                },
                {
                    category: "Technical Depth",
                    text: "Which network protocol is primarily used to securely fetch web pages resources?",
                    options: ["FTP", "HTTPS", "SMTP", "SSH"],
                    correct: 1,
                    motivation: "Correct! Encrypted communications."
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
                },
                {
                    category: "Technical Depth",
                    text: "Which REST HTTP verb is structurally intended to submit data and create a resource?",
                    options: ["GET", "POST", "PUT", "DELETE"],
                    correct: 1,
                    motivation: "Perfect RESTful API design!"
                },
                {
                    category: "Technical Depth",
                    text: "Which JavaScript concept handles delayed actions using Promise.then or callbacks?",
                    options: [
                        "Asynchronous programming loop",
                        "Statically compiled closures",
                        "Dynamic variable bindings",
                        "Strict single scoping execution"
                    ],
                    correct: 0,
                    motivation: "Intermediate scripts master!"
                },
                {
                    category: "Aptitude & GK",
                    text: "A bag has 3 red and 5 blue balls. If a single ball is picked at random, what is the probability of selecting a red ball?",
                    options: ["1/3", "3/5", "3/8", "5/8"],
                    correct: 2,
                    motivation: "Accurate probability deduction!"
                },
                {
                    category: "Technical Depth",
                    text: "Which Git command fetches commits from origin without changing the local branch directly?",
                    options: ["git pull", "git fetch", "git merge", "git checkout"],
                    correct: 1,
                    motivation: "Sleek source control flow!"
                },
                {
                    category: "Technical Depth",
                    text: "What is the primary advantage of CDN edge caching systems?",
                    options: [
                        "Decreases user latency by placing static assets closer geographically.",
                        "Compiles JavaScript source bundles directly in browser engines.",
                        "Minimizes the size of backend relational DB tables.",
                        "Protects client devices from cross-site cookies scans."
                    ],
                    correct: 0,
                    motivation: "Professional systems architect tier!"
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
                },
                {
                    category: "Technical Depth",
                    text: "Under the CAP Theorem of distributed databases, what are the three attributes checked?",
                    options: [
                        "Code, Access, Portals",
                        "Consistency, Availability, Partition Tolerance",
                        "Concurrency, Atomicity, Private channels",
                        "Caching, Performance, Compression metrics"
                    ],
                    correct: 1,
                    motivation: "Excellent distributed architecture principles!"
                },
                {
                    category: "Technical Depth",
                    text: "Which SQL indexing format is optimized for searching values ranges in high-volume transaction tables?",
                    options: ["B-Tree Indexes", "Hash Indexes", "Full-Text search indices", "Bitmap clusters"],
                    correct: 0,
                    motivation: "Database tuning master!"
                },
                {
                    category: "Problem Solving",
                    text: "How many unique ways can you arrange 4 distinct letters in a single word representation?",
                    options: ["12 ways", "24 ways", "48 ways", "120 ways"],
                    correct: 1,
                    motivation: "Advanced combinatorics calculations solved!"
                },
                {
                    category: "Technical Depth",
                    text: "In TCP network handshakes, which sequential packets flow establishes a connections link?",
                    options: [
                        "ACK -> SYN -> SYN-ACK",
                        "SYN -> SYN-ACK -> ACK",
                        "SYN -> ACK -> FIN",
                        "CONNECT -> OPEN -> LINK"
                    ],
                    correct: 1,
                    motivation: "Sleek low-level networking basics!"
                },
                {
                    category: "Technical Depth",
                    text: "What does the OAuth 2.0 specifications protocol primarily handle?",
                    options: [
                        "Token-based authorization delegation",
                        "User passwords database hashing",
                        "Distributed files systems encryptions",
                        "DNS mappings replication filters"
                    ],
                    correct: 0,
                    motivation: "Professional security architecture tier!"
                }
            ]
        },
        business: {
            1: [
                {
                    category: "Financial Accounting",
                    text: "What is the primary financial purpose of a corporate Balance Sheet statement?",
                    options: [
                        "To show net revenues over a 1-year period.",
                        "To showcase absolute assets, liabilities, and owner's equity at a point in time.",
                        "To list total employee headcounts and salary bands.",
                        "To calculate public stock price fluctuations."
                    ],
                    correct: 1,
                    motivation: "Superb finance fundamentals!"
                },
                {
                    category: "Marketing Principles",
                    text: "In professional online campaigns, what does the 'SEO' acronym stand for?",
                    options: [
                        "Search Engine Optimization",
                        "Social Media Engagement Outlet",
                        "Sales Enterprise Order",
                        "Site Entry Operations"
                    ],
                    correct: 0,
                    motivation: "Perfect digital marketing basics!"
                },
                {
                    category: "Mathematical Profitability",
                    text: "If a retail store purchases inventory for $80 and retails it for $100, what is the profit margin percentage?",
                    options: ["10%", "20%", "25%", "30%"],
                    correct: 1,
                    motivation: "Correct! Profit margins are Profit divided by Revenue."
                },
                {
                    category: "Business Communication",
                    text: "Which channel is best suited to finalize binding contractual conditions with stakeholders?",
                    options: [
                        "A casual message on internal chat tools (e.g. Slack).",
                        "A verbal alignment over coffee.",
                        "A written, signed formal contract document.",
                        "A social media status post."
                    ],
                    correct: 2,
                    motivation: "Exceptional professional governance!"
                },
                {
                    category: "Corporate Finance",
                    text: "Which balance item represents high liquidity in a company's current assets catalog?",
                    options: ["Real estate commercial property", "Cash & short-term cash equivalents", "Long-term treasury bonds", "Office hardware & servers"],
                    correct: 1,
                    motivation: "Splendid liquidity understanding!"
                }
            ],
            2: [
                {
                    category: "Financial Performance",
                    text: "In business investments evaluations, what does 'ROI' signify?",
                    options: [
                        "Risk of Investment",
                        "Return on Investment",
                        "Rate of Interest",
                        "Revenue of Industry"
                    ],
                    correct: 1,
                    motivation: "Basic metrics unlocked!"
                },
                {
                    category: "Project Management",
                    text: "What is the principal philosophy of the Agile / Scrum methodology in product development?",
                    options: [
                        "Minimizing salary costs of development teams.",
                        "Delivering incremental, functional value in scheduled sprint cycles.",
                        "Automating all written business reports.",
                        "Conducting reviews once a year."
                    ],
                    correct: 1,
                    motivation: "Adept operational delivery!"
                },
                {
                    category: "Marketing Strategy",
                    text: "Which segmentation parameters group audiences by criteria like age, income, gender, and education?",
                    options: ["Psychographic segmentation", "Demographic segmentation", "Geographical distribution", "Behavioral funneling"],
                    correct: 1,
                    motivation: "Great target audience mapping!"
                },
                {
                    category: "Macroeconomics",
                    text: "When domestic inflation rates escalate rapidly, what is the typical Central Bank policy action?",
                    options: [
                        "Lower national interest rates.",
                        "Raise benchmark interest rates to cool the economy.",
                        "Print more physical currency paper notes.",
                        "Remove bank reserves rules."
                    ],
                    correct: 1,
                    motivation: "Adept economics analysis!"
                },
                {
                    category: "Situational Leadership",
                    text: "A key enterprise client is angry about a delayed milestone. How do you lead your account manager?",
                    options: [
                        "Reprimand the account manager instantly.",
                        "Partner with them to diagnose root causes and schedule an alignment call with the client.",
                        "Terminate the client contract without response.",
                        "Delay response hoping they cool down."
                    ],
                    correct: 1,
                    motivation: "Superb collaborative leadership!"
                }
            ],
            3: [
                {
                    category: "Corporate Accounting",
                    text: "Identify the fundamental double-entry balance sheet accounting equation.",
                    options: [
                        "Assets = Liabilities + Equity",
                        "Assets = Liabilities - Equity",
                        "Net Revenue = Cost of Goods Sold",
                        "Equity = Assets + Liabilities"
                    ],
                    correct: 0,
                    motivation: "Perfect double-entry conceptual base!"
                },
                {
                    category: "Managerial Economics",
                    text: "What is the definition of 'Opportunity Cost' in economic decision-making?",
                    options: [
                        "The direct overhead expense of registering a company.",
                        "The loss of potential gain from other alternatives when one alternative is chosen.",
                        "The tax rate imposed on short term investments.",
                        "The budget allocated to product promotions."
                    ],
                    correct: 1,
                    motivation: "Advanced resource allocation theory!"
                },
                {
                    category: "Operations Management",
                    text: "What describes a bottleneck station in an operations assembly sequence?",
                    options: [
                        "The station with the fastest throughput.",
                        "The slowest station that limits total pipeline capacity.",
                        "The raw materials warehouse loading dock.",
                        "The final shipping distribution trucks."
                    ],
                    correct: 1,
                    motivation: "Sleek manufacturing logistics knowledge!"
                },
                {
                    category: "Strategic Planning",
                    text: "What does the business SWOT analysis matrix evaluate?",
                    options: [
                        "Salary, Workflows, Offices, Technology",
                        "Strengths, Weaknesses, Opportunities, Threats",
                        "Systems, Operations, Targets, Margins",
                        "Sales, Wastes, Outputs, Taxes"
                    ],
                    correct: 1,
                    motivation: "Excellent competitive strategist tier!"
                },
                {
                    category: "Internal Communications",
                    text: "Your department must implement a 10% budget cut. What is the most effective internal communication strategy?",
                    options: [
                        "Post a brief memo anonymously on bulletin boards.",
                        "Convene a team meeting, explain the economic rationale, and answer questions transparently.",
                        "Send a brief email notification at 5 PM on a Friday.",
                        "Implement cuts silently without team notice."
                    ],
                    correct: 1,
                    motivation: "High trust leadership communications!"
                }
            ],
            4: [
                {
                    category: "Corporate Finance",
                    text: "What is represented by the 'Weighted Average Cost of Capital' (WACC) metric?",
                    options: [
                        "The average interest rate on corporate bank loans.",
                        "The cost of purchasing physical warehouses.",
                        "The average rate a company expects to pay to finance its assets, weighted by debt and equity.",
                        "The salary overhead of hiring C-level executives."
                    ],
                    correct: 2,
                    motivation: "Professional investment banking metrics!"
                },
                {
                    category: "Mergers & Acquisitions",
                    text: "What does 'Due Diligence' encompass in business acquisitions deals?",
                    options: [
                        "The government stamp duty paid on transactions.",
                        "A comprehensive appraisal of a business's assets and liabilities by a prospective buyer.",
                        "The initial promotional rollout program.",
                        "The procedure of liquidating default inventory."
                    ],
                    correct: 1,
                    motivation: "Elite corporate attorney knowledge!"
                },
                {
                    category: "Competitive Strategy",
                    text: "What is the primary objective of Porter's Five Forces strategic framework?",
                    options: [
                        "To evaluate industry competitiveness and long-term profit attractiveness.",
                        "To calculate retail unit sales velocity.",
                        "To structure executive mentoring cycles.",
                        "To audit payroll distributions schemas."
                    ],
                    correct: 0,
                    motivation: "Distinguished corporate strategist!"
                },
                {
                    category: "Capital Budgeting",
                    text: "If a proposed capital investment returns a Net Present Value (NPV) of $50,000, what is the action?",
                    options: [
                        "Reject the investment immediately.",
                        "Accept the investment as it adds value above hurdle rates.",
                        "Delay decisions hoping interest rates drop.",
                        "Double the discount rate and rerun calculations."
                    ],
                    correct: 1,
                    motivation: "Correct capital allocation!"
                },
                {
                    category: "Corporate Leadership",
                    text: "During post-merger integration, two executive cultures are clashing on workflows. Action?",
                    options: [
                        "Dismiss both division presidents.",
                        "Form a joint integration committee to establish shared values and align processes.",
                        "Order one team to submit to the other's rules immediately.",
                        "Let conflicts run hoping they settle naturally."
                    ],
                    correct: 1,
                    motivation: "Masterful organizational leadership!"
                }
            ]
        },
        arts: {
            1: [
                {
                    category: "World History",
                    text: "Which ancient civilization constructed the famous Colosseum amphitheater in Rome?",
                    options: ["The Ancient Greeks", "The Ancient Romans", "The Egyptians", "The Persians"],
                    correct: 1,
                    motivation: "Basic historical knowledge!"
                },
                {
                    category: "Literature Studies",
                    text: "Who wrote the classic English tragedy play 'Romeo and Juliet'?",
                    options: ["Charles Dickens", "William Shakespeare", "Jane Austen", "Mark Twain"],
                    correct: 1,
                    motivation: "Correct literature baseline!"
                },
                {
                    category: "Philosophy",
                    text: "What is the core focus of Ethics as a branch of philosophy?",
                    options: [
                        "Investigating tectonic plate shifts.",
                        "Evaluating moral values and principles governing right and wrong actions.",
                        "Calculating financial compound interest formulas.",
                        "Analyzing hardware server routes."
                    ],
                    correct: 1,
                    motivation: "Sleek humanities foundation!"
                },
                {
                    category: "General Knowledge",
                    text: "Which organ in the human body is primarily responsible for pumping blood through the circulatory system?",
                    options: ["Lungs", "Heart", "Kidneys", "Liver"],
                    correct: 1,
                    motivation: "Solid biology basics!"
                },
                {
                    category: "Ethical Scenarios",
                    text: "You discover a peer is citing someone else's research work without attribution. Action?",
                    options: [
                        "Publish an anonymous post criticizing them.",
                        "Do nothing to avoid conflict.",
                        "Discuss the citation policy guidelines privately with them or refer to standards.",
                        "File an academic misconduct charge immediately."
                    ],
                    correct: 2,
                    motivation: "Responsible academic integrity!"
                }
            ],
            2: [
                {
                    category: "Historical Methods",
                    text: "What is the scientific study of human history through material remains called?",
                    options: ["Paleontology", "Archaeology", "Anthropology", "Sociology"],
                    correct: 1,
                    motivation: "Excellent research methods!"
                },
                {
                    category: "Literature & Art",
                    text: "Which European era is characterized by the revival of classical art, literature, and learning?",
                    options: ["The Middle Ages", "The Renaissance", "The Industrial Revolution", "Modernism"],
                    correct: 1,
                    motivation: "Correct renaissance history!"
                },
                {
                    category: "Formal Logic",
                    text: "In the syllogism: 'All humans are mortal. Socrates is a human.' What is the logical deduction?",
                    options: ["Socrates is immortal", "Socrates is mortal", "Mortal is Socrates", "All mortals are Socrates"],
                    correct: 1,
                    motivation: "Faultless logical deduction!"
                },
                {
                    category: "Sociology",
                    text: "Which concept refers to the shared beliefs, customs, arts, and values of a group of people?",
                    options: ["Social stratification", "Culture", "Socioeconomic status", "Demographic profiling"],
                    correct: 1,
                    motivation: "Great sociological principles!"
                },
                {
                    category: "Research Ethics",
                    text: "An academic author changes minor data points in a social survey to make their thesis look correct. What is this?",
                    options: [
                        "Creative research editing.",
                        "Scientific misconduct / data fabrication.",
                        "Standard statistics cleaning.",
                        "Productive data refinement."
                    ],
                    correct: 1,
                    motivation: "Correct! Absolute integrity always."
                }
            ],
            3: [
                {
                    category: "Philosophy",
                    text: "Which philosopher coined the famous Latin statement 'Cogito, ergo sum' (I think, therefore I am)?",
                    options: ["Socrates", "René Descartes", "Immanuel Kant", "Friedrich Nietzsche"],
                    correct: 1,
                    motivation: "Perfect philosophical foundations!"
                },
                {
                    category: "Political History",
                    text: "What was the primary constitutional purpose of the Magna Carta signed in 1215?",
                    options: [
                        "To establish an absolute monarchy.",
                        "To limit the powers of the King and protect individual liberties.",
                        "To declare war on surrounding kingdoms.",
                        "To abolish the parliament systems."
                    ],
                    correct: 1,
                    motivation: "Adept constitutional history!"
                },
                {
                    category: "Art History",
                    text: "Which major art movement focuses on capturing light qualities and painting outdoors?",
                    options: ["Surrealism", "Impressionism", "Cubism", "Expressionism"],
                    correct: 1,
                    motivation: "Impressive art history knowledge!"
                },
                {
                    category: "Sociological Theory",
                    text: "What term describes the process through which individuals learn and internalize their society's values?",
                    options: ["Assimilation", "Socialization", "Acculturation", "Globalisation"],
                    correct: 1,
                    motivation: "Correct sociological definitions!"
                },
                {
                    category: "Consensus Leadership",
                    text: "During a public forum on social policy, two citizen groups are in deep conflict. Best leadership strategy?",
                    options: [
                        "Support the most vocal faction to resolve quickly.",
                        "Acknowledge both sides, and guide the groups to find shared values to build consensus.",
                        "Suspend the forum indefinitely.",
                        "Ignore the conflict and proceed alone."
                    ],
                    correct: 1,
                    motivation: "Splendid consensus leadership!"
                }
            ],
            4: [
                {
                    category: "Political Philosophy",
                    text: "Which ethical theory evaluates actions based on achieving 'the greatest good for the greatest number'?",
                    options: ["Deontology", "Utilitarianism", "Virtue Ethics", "Existentialism"],
                    correct: 1,
                    motivation: "Outstanding political theory knowledge!"
                },
                {
                    category: "European History",
                    text: "What was the main geopolitical consequence of the Peace of Westphalia treaties in 1648?",
                    options: [
                        "Concluding the Thirty Years' War and establishing modern state sovereignty.",
                        "Concluding the Napoleonic Wars.",
                        "Initializing the League of Nations.",
                        "De-escalating the Cold War."
                    ],
                    correct: 0,
                    motivation: "Elite geopolitical history tier!"
                },
                {
                    category: "Literary Theory",
                    text: "What narration technique models a character's continuous flow of internal thoughts and feelings?",
                    options: ["Omniscient narration", "Stream of consciousness", "Epistolary narrative", "Allegory"],
                    correct: 1,
                    motivation: "Advanced literary critic skills!"
                },
                {
                    category: "Sociological Analysis",
                    text: "What term defines the institutional barriers that prevent qualified minority candidates from career growth?",
                    options: ["Glass ceiling", "Social mobility barrier", "Status symbol conflict", "Role strain"],
                    correct: 0,
                    motivation: "Accurate structural analysis!"
                },
                {
                    category: "Cultural Ethics",
                    text: "A national museum discovers artifacts in its archive were illegally taken from another country. Ethical consensus?",
                    options: [
                        "Retain them arguing safety in archives.",
                        "Initiate respectful bilateral repatriation agreements based on cultural heritage rights.",
                        "Auction them off to private collectors.",
                        "Ignore requests hoping they stop."
                    ],
                    correct: 1,
                    motivation: "Stellar ethical consensus leadership!"
                }
            ]
        }
    };

    // Quiz Timer effect
    useEffect(() => {
        let interval = null;
        if (quizActive && quizTimerActive) {
            interval = setInterval(() => {
                setQuizTimer((prev) => {
                    if (prev <= 1) {
                        handleNextQuizQuestion();
                        return 20;
                    }
                    return prev - 1;
                });
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [quizActive, quizTimerActive, currentQuestionIdx]);

    // Handle Login Auth
    const onLoginSubmit = (e) => {
        e.preventDefault();
        const success = loginUser(loginEmail, loginPassword);
        if (success) {
            setAuthModal(false);
            setLoginEmail("");
            setLoginPassword("");
        } else {
            alert("Invalid email or password.");
        }
    };

    // Handle Register Auth
    const onRegisterSubmit = (e) => {
        e.preventDefault();
        const success = registerUser(regName, regEmail, regPassword, regRole);
        if (success) {
            setAuthModal(false);
            setRegName("");
            setRegEmail("");
            setRegPassword("");
        }
    };

    // Auto-Log Candidate to show dynamic dashboard
    const loginQuickDemo = (role = "CANDIDATE", plan = "FREE") => {
        const demoEmail = `demo_${role.toLowerCase()}@pathfinder.ai`;
        const nextUsers = { ...localStorage.getItem("pf_users_db") ? JSON.parse(localStorage.getItem("pf_users_db")) : {} };
        
        const demoUser = {
            id: `usr-demo-${Date.now()}`,
            name: `${role.charAt(0) + role.slice(1).toLowerCase()} Member`,
            email: demoEmail,
            password: "password",
            role: role,
            plan: plan,
            xp: plan === "PRO" ? 850 : 250,
            level: plan === "PRO" ? 2 : 1,
            streak: 4,
            badges: JSON.stringify(["explorer", "first_quiz"]),
            referralCode: `REF-DEMO-${role}`,
            referralDaysEarned: 2,
            createdAt: new Date().toLocaleDateString()
        };

        nextUsers[demoEmail] = demoUser;
        localStorage.setItem("pf_users_db", JSON.stringify(nextUsers));
        loginUser(demoEmail, "password");
    };

    // Launch Skill Quiz
    const onLaunchQuiz = (e) => {
        e.preventDefault();
        setQuizModalOpen(false);
        setQuizActive(true);
        setCurrentQuestionIdx(0);
        setQuizAnswers([null, null, null, null, null]);
        
        // Determine domain track based on degree path and field of study major selections
        let track = "tech";
        const majorLower = (quizSetupMajor || "").toLowerCase();
        const degreeLower = (quizSetupDegree || "").toLowerCase();

        if (
            majorLower.includes("business") || 
            majorLower.includes("finance") || 
            majorLower.includes("marketing") ||
            degreeLower.includes("mba") || 
            degreeLower.includes("bba") || 
            degreeLower.includes("b.com") || 
            degreeLower.includes("m.com")
        ) {
            track = "business";
        } else if (
            majorLower.includes("humanities") || 
            majorLower.includes("social") || 
            degreeLower.includes("b.a.") || 
            degreeLower.includes("m.a.")
        ) {
            track = "arts";
        }

        const userLevel = currentUser.level > 4 ? 4 : currentUser.level;
        const trackPool = DOMAIN_QUIZ_QUESTIONS[track] || DOMAIN_QUIZ_QUESTIONS.tech;
        const pool = trackPool[userLevel] || trackPool[1];
        
        const shuffled = [...pool].sort(() => 0.5 - Math.random());
        const selected = shuffled.slice(0, 5);
        setActiveQuizQuestions(selected);

        setQuizTimer(20);
        setQuizTimerActive(true);
    };

    const handleSelectOption = (optIdx) => {
        const updated = [...quizAnswers];
        updated[currentQuestionIdx] = optIdx;
        setQuizAnswers(updated);
    };

    const handleNextQuizQuestion = () => {
        if (currentQuestionIdx < 4) {
            setCurrentQuestionIdx(currentQuestionIdx + 1);
            setQuizTimer(20);
        } else {
            // End of Quiz - Evaluate Results
            setQuizTimerActive(false);
            setQuizActive(false);

            // Calculate correct answers from selected active questions
            let correctCount = 0;
            quizAnswers.forEach((ans, idx) => {
                if (ans === activeQuizQuestions[idx]?.correct) correctCount++;
            });

            const accuracy = (correctCount / 5) * 100;
            const xpEarned = correctCount * 100;

            setQuizResult({
                score: `${correctCount} / 5`,
                xpEarned,
                accuracy: `${accuracy}%`
            });
            earnXP(xpEarned);
        }
    };

    const handlePrevQuizQuestion = () => {
        if (currentQuestionIdx > 0) {
            setCurrentQuestionIdx(currentQuestionIdx - 1);
            setQuizTimer(20);
        }
    };

    // Resume Scan Handler
    const handleDragOver = (e) => {
        e.preventDefault();
    };

    const handleDrop = (e) => {
        e.preventDefault();
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            setUploadedFile(e.dataTransfer.files[0]);
        }
    };

    const triggerResumeScan = () => {
        if (!uploadedFile) return;

        // Check subscription limit (Free user gets 1 scan/month)
        const allowed = checkUsageLimit("scansCount", 1);
        if (!allowed) return;

        setScanningInProgress(true);
        setTimeout(() => {
            setScanningInProgress(false);
            const mockScan = {
                score: Math.floor(65 + Math.random() * 30),
                fileName: uploadedFile.name,
                keywordsMatched: ["React", "JavaScript", "REST APIs", "Node.js", "CSS Grid"],
                keywordsMissing: ["TypeScript", "AWS Cloud", "Docker Containerization", "Unit Testing"],
                suggestions: [
                    "Inject metrics outcomes instead of process lists (e.g. 'Reduced build size by 20%').",
                    "Add AWS practitioner cert in credentials headers.",
                    "Optimize header margins to fit a neat 1-page structure."
                ],
                grammarIssues: ["Capitalization inconsistency in experience headers"],
                roleMatched: "Software Developer"
            };
            setScanReport(mockScan);
            saveResumeScan(mockScan);
        }, 2000);
    };

    // Recruiter Post Listing handler
    const handlePostJob = (e) => {
        e.preventDefault();
        const success = createJobListing({
            title: newJobTitle,
            companyName: newJobCompany,
            category: newJobCategory,
            salaryRange: newJobSalary,
            location: newJobLocation,
            applicationUrl: newJobUrl,
            isRemote: newJobRemote,
            isSponsored: true,
            isFeatured: true,
            recruiterId: currentUser.id
        });

        if (success) {
            alert("Job Posted Successfully as a Sponsored Listing!");
            setNewJobTitle("");
            setNewJobCompany("");
            setNewJobCategory("");
            setNewJobSalary("");
            setNewJobLocation("");
            setNewJobUrl("");
            setNewJobRemote(false);
        }
    };

    // Mentor booking handler
    const confirmBooking = () => {
        if (!selectedSlot) {
            alert("Please choose an available slot.");
            return;
        }
        const success = bookMentorSession(selectedMentor.id, selectedSlot, selectedMentor.hourlyRate);
        if (success) {
            setSelectedMentor(null);
            setSelectedSlot("");
        }
    };

    // Submit Contact Form
    const handleContactSubmit = (e) => {
        e.preventDefault();
        setContactSuccess(true);
        setContactName("");
        setContactEmail("");
        setContactSubject("");
        setContactMsg("");
    };

    // Super Admin mock revenue datasets
    const adminRevenueData = adminGrowthPeriod === "monthly" ? [
        { name: "Jan", MRR: 4500, Affiliates: 1200, Marketplace: 800 },
        { name: "Feb", MRR: 5800, Affiliates: 1400, Marketplace: 950 },
        { name: "Mar", MRR: 7100, Affiliates: 1650, Marketplace: 1100 },
        { name: "Apr", MRR: 8900, Affiliates: 2100, Marketplace: 1300 },
        { name: "May", MRR: 10400, Affiliates: 2400, Marketplace: 1600 },
        { name: "Jun", MRR: 12500, Affiliates: 2900, Marketplace: 2000 }
    ] : [
        { name: "Q1", MRR: 17400, Affiliates: 4250, Marketplace: 2850 },
        { name: "Q2", MRR: 31800, Affiliates: 7400, Marketplace: 4900 }
    ];

    return (
        <div className="flex-1 flex flex-col min-h-screen">
            {/* Top Navigation Header */}
            <header className="glass-panel sticky top-0 z-40 mx-4 mt-4 px-6 py-4 flex items-center justify-between" style={{ borderRadius: '16px' }}>
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-violet-600 to-cyan-500 flex items-center justify-center text-white font-extrabold text-lg shadow-lg">
                        P
                    </div>
                    <div>
                        <h1 className="text-xl font-bold tracking-tight bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">PathFinder AI</h1>
                        <span className="text-[10px] text-violet-400 font-semibold uppercase tracking-wider">Pro Career Suite</span>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    {/* Theme Toggler */}
                    <button onClick={toggleTheme} className="p-2.5 rounded-xl border border-white/5 bg-white/5 hover:bg-white/10 text-slate-300 transition-all">
                        {themeMode === "dark" ? <Sun size={18} /> : <Moon size={18} />}
                    </button>

                    {/* Auth Status / Buttons */}
                    {currentUser ? (
                        <div className="flex items-center gap-4">
                            {currentUser.plan !== "FREE" ? (
                                <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-gradient-to-r from-amber-500/20 to-orange-500/20 border border-amber-500/30 text-amber-300 shadow-glow">
                                    <Crown size={12} /> {currentUser.plan} Active
                                </span>
                            ) : (
                                <button onClick={() => launchStripeCheckout("PRO")} className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-violet-600/20 hover:bg-violet-600/30 border border-violet-500/30 text-violet-300 transition-all">
                                    Upgrade to Pro
                                </button>
                            )}

                            <div className="flex items-center gap-2">
                                <div className="w-8 h-8 rounded-full bg-violet-600/20 border border-violet-500/30 flex items-center justify-center text-sm font-bold text-violet-300">
                                    {currentUser.name.charAt(0)}
                                </div>
                                <span className="hidden md:inline text-sm font-semibold text-slate-200">{currentUser.name}</span>
                            </div>

                            <button onClick={() => setLogoutConfirmOpen(true)} className="p-2.5 rounded-xl border border-white/5 bg-white/5 hover:bg-red-500/10 hover:text-red-400 text-slate-300 transition-all">
                                <LogOut size={16} />
                            </button>
                        </div>
                    ) : (
                        <div className="flex items-center gap-3">
                            <button onClick={() => { setAuthMode("login"); setAuthModal(true); }} className="px-4 py-2 text-sm font-semibold text-slate-300 hover:text-white transition-all">
                                Login
                            </button>
                            <button onClick={() => { setAuthMode("register"); setAuthModal(true); }} className="px-4 py-2 rounded-xl text-sm font-semibold bg-violet-600 text-white hover:bg-violet-700 transition-all shadow-lg shadow-violet-600/20">
                                Get Started
                            </button>
                        </div>
                    )}
                </div>
            </header>

            {/* Main Application Container */}
            <main className="flex-1 flex flex-col md:flex-row gap-6 p-4 max-w-7xl w-full mx-auto">
                {currentUser ? (
                    <>
                        {/* Sidebar Navigation */}
                        <aside className="w-full md:w-64 flex flex-col gap-4">
                            {/* Organization Workspace Dropdown Mock */}
                            <div className="glass-panel p-4 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-sm">🏛️</div>
                                    <div className="text-left">
                                        <h4 className="text-xs font-bold text-slate-200">PathFinder Organization</h4>
                                        <span className="text-[10px] text-slate-400">Personal Workspace</span>
                                    </div>
                                </div>
                            </div>

                            {/* Navigation Items */}
                            <nav className="glass-panel p-3 flex flex-col gap-1.5 text-left">
                                <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wider px-3 mb-1.5">Candidate Tools</span>
                                <button onClick={() => setActiveTab("analytics")} className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${activeTab === "analytics" ? "bg-violet-600/25 border-l-2 border-violet-500 text-white" : "text-slate-400 hover:bg-white/5 hover:text-slate-200"}`}>
                                    <BarChart2 size={16} /> <span>Dashboard Insights</span>
                                </button>
                                <button onClick={() => setActiveTab("profile")} className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${activeTab === "profile" ? "bg-violet-600/25 border-l-2 border-violet-500 text-white" : "text-slate-400 hover:bg-white/5 hover:text-slate-200"}`}>
                                    <UserCog size={16} /> <span>Enhanced Profile</span>
                                </button>
                                <button onClick={() => setActiveTab("vault")} className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${activeTab === "vault" ? "bg-violet-600/25 border-l-2 border-violet-500 text-white" : "text-slate-400 hover:bg-white/5 hover:text-slate-200"}`}>
                                    <Upload size={16} /> <span>Resume Vault</span>
                                </button>
                                <button onClick={() => setActiveTab("skills")} className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${activeTab === "skills" ? "bg-violet-600/25 border-l-2 border-violet-500 text-white" : "text-slate-400 hover:bg-white/5 hover:text-slate-200"}`}>
                                    <Award size={16} /> <span>Skills & Progress</span>
                                </button>
                                <button onClick={() => setActiveTab("roadmap")} className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${activeTab === "roadmap" ? "bg-violet-600/25 border-l-2 border-violet-500 text-white" : "text-slate-400 hover:bg-white/5 hover:text-slate-200"}`}>
                                    <Milestone size={16} /> <span>Interactive Roadmap</span>
                                </button>
                                <button onClick={() => setActiveTab("saved")} className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${activeTab === "saved" ? "bg-violet-600/25 border-l-2 border-violet-500 text-white" : "text-slate-400 hover:bg-white/5 hover:text-slate-200"}`}>
                                    <Bookmark size={16} /> <span>Saved Resources</span>
                                </button>
                                <div className="h-px bg-white/5 my-1 mx-3" />
                                <button onClick={() => setActiveTab("assessment")} className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${activeTab === "assessment" ? "bg-violet-600/25 border-l-2 border-violet-500 text-white" : "text-slate-400 hover:bg-white/5 hover:text-slate-200"}`}>
                                    <Activity size={16} /> <span>Skill Challenge Arena</span>
                                </button>
                                <button onClick={() => setActiveTab("resume")} className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${activeTab === "resume" ? "bg-violet-600/25 border-l-2 border-violet-500 text-white" : "text-slate-400 hover:bg-white/5 hover:text-slate-200"}`}>
                                    <FileText size={16} /> <span>ATS Resume Scanner</span>
                                </button>
                                <button onClick={() => setActiveTab("jobs")} className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${activeTab === "jobs" ? "bg-violet-600/25 border-l-2 border-violet-500 text-white" : "text-slate-400 hover:bg-white/5 hover:text-slate-200"}`}>
                                    <Briefcase size={16} /> <span>Sponsored Vacancies</span>
                                </button>
                                <button onClick={() => setActiveTab("bootcamps")} className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${activeTab === "bootcamps" ? "bg-violet-600/25 border-l-2 border-violet-500 text-white" : "text-slate-400 hover:bg-white/5 hover:text-slate-200"}`}>
                                    <Compass size={16} /> <span>Bootcamp Marketplace</span>
                                </button>
                                <button onClick={() => setActiveTab("affiliates")} className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${activeTab === "affiliates" ? "bg-violet-600/25 border-l-2 border-violet-500 text-white" : "text-slate-400 hover:bg-white/5 hover:text-slate-200"}`}>
                                    <Sparkles size={16} /> <span>Learning Pathways</span>
                                </button>

                                {/* Conditional Role Portals */}
                                {currentUser.role === "COLLEGE_ADMIN" && (
                                    <>
                                        <div className="h-px bg-white/5 my-2 mx-3" />
                                        <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wider px-3 mb-1.5">Institution Portal</span>
                                        <button onClick={() => setActiveTab("college")} className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${activeTab === "college" ? "bg-indigo-600/25 border-l-2 border-indigo-500 text-white" : "text-slate-400 hover:bg-white/5 hover:text-slate-200"}`}>
                                            <Building size={16} /> <span>Campus Analytics</span>
                                        </button>
                                    </>
                                )}

                                {(currentUser.role === "SUPER_ADMIN" || currentUser.role === "COLLEGE_ADMIN") && (
                                    <>
                                        <div className="h-px bg-white/5 my-2 mx-3" />
                                        <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wider px-3 mb-1.5">Administration</span>
                                        <button onClick={() => setActiveTab("admin")} className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${activeTab === "admin" ? "bg-pink-600/25 border-l-2 border-pink-500 text-white" : "text-slate-400 hover:bg-white/5 hover:text-slate-200"}`}>
                                            <BarChart2 size={16} /> <span>Platform Revenue</span>
                                        </button>
                                    </>
                                )}

                                {/* Static Documents Links */}
                                <div className="h-px bg-white/5 my-2 mx-3" />
                                <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wider px-3 mb-1.5">Info & Links</span>
                                <button onClick={() => setActiveTab("about")} className={`w-full flex items-center gap-3 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${activeTab === "about" ? "text-white" : "text-slate-400 hover:text-slate-200"}`}>
                                    <HelpCircle size={12} /> <span>About PathFinder</span>
                                </button>
                                <button onClick={() => setActiveTab("contact")} className={`w-full flex items-center gap-3 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${activeTab === "contact" ? "text-white" : "text-slate-400 hover:text-slate-200"}`}>
                                    <Mail size={12} /> <span>Contact Support</span>
                                </button>
                                <button onClick={() => setActiveTab("privacy")} className={`w-full flex items-center gap-3 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${activeTab === "privacy" ? "text-white" : "text-slate-400 hover:text-slate-200"}`}>
                                    <ShieldCheck size={12} /> <span>Privacy Policy</span>
                                </button>
                                <button onClick={() => setActiveTab("terms")} className={`w-full flex items-center gap-3 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${activeTab === "terms" ? "text-white" : "text-slate-400 hover:text-slate-200"}`}>
                                    <Scroll size={12} /> <span>Terms of Service</span>
                                </button>
                            </nav>
                        </aside>

                        {/* Middle Application Viewports */}
                        <div className="flex-1 flex flex-col gap-6">
                            
                            {/* TAB 1: DASHBOARD INSIGHTS */}
                            {activeTab === "analytics" && (
                                <AnalyticsTab />
                            )}

                            {/* TAB 2: ENHANCED PROFILE */}
                            {activeTab === "profile" && (
                                <ProfileTab />
                            )}

                            {/* TAB 3: RESUME VAULT */}
                            {activeTab === "vault" && (
                                <VaultTab />
                            )}

                            {/* TAB 4: SKILLS & PROGRESS */}
                            {activeTab === "skills" && (
                                <SkillsTab />
                            )}

                            {/* TAB 5: INTERACTIVE ROADMAP */}
                            {activeTab === "roadmap" && (
                                <RoadmapTab />
                            )}

                            {/* TAB 6: SAVED RESOURCES */}
                            {activeTab === "saved" && (
                                <SavedTab />
                            )}

                            {/* TAB 7: SKILL CHALLENGE ARENA */}
                            {activeTab === "assessment" && (
                                <div className="flex flex-col gap-6">
                                    {/* Circular Progress & Level Metrics Row */}
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                        <div className="glass-panel p-6 flex flex-col items-center justify-center text-center">
                                            <div className="w-20 h-20 rounded-full border-4 border-violet-500/20 border-t-violet-500 flex items-center justify-center mb-3">
                                                <i className="not-italic font-bold text-lg text-white">Lvl {currentUser.level}</i>
                                            </div>
                                            <h3 className="font-bold text-slate-100">Circular Level Progress</h3>
                                            <p className="text-xs text-slate-400 mt-1">{currentUser.xp} XP Accumulated</p>
                                        </div>

                                        <div className="glass-panel p-6 flex flex-col items-center justify-center text-center">
                                            <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 mb-3">
                                                <Flame className="pulsing-glow" size={24} />
                                            </div>
                                            <h3 className="font-bold text-slate-100">{currentUser.streak} Day Learning Streak</h3>
                                            <p className="text-xs text-slate-400 mt-1">Consistency earns +50 XP bonus</p>
                                        </div>

                                        <div className="glass-panel p-6 flex flex-col items-center justify-center text-center">
                                            <div className="w-12 h-12 rounded-xl bg-violet-600/10 border border-violet-500/20 flex items-center justify-center text-violet-400 mb-3">
                                                <Award size={24} />
                                            </div>
                                            <h3 className="font-bold text-slate-100">8 glowing Badges</h3>
                                            <p className="text-xs text-slate-400 mt-1">Unlock certificates on level 4</p>
                                        </div>
                                    </div>

                                    {/* Launch Challenge Card */}
                                    <div className="glass-panel p-8 bg-gradient-to-tr from-violet-950/20 to-cyan-950/10 flex flex-col md:flex-row items-center justify-between gap-6">
                                        <div className="text-left">
                                            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-violet-600/20 border border-violet-500/30 text-violet-300">Level-Wise Challenge</span>
                                            <h2 className="text-2xl font-extrabold mt-2 text-white">Interactive Skill Assessment</h2>
                                            <p className="text-sm text-slate-400 mt-1 max-width-lg">Evaluate your technical engineering depth, analytical reasoning, and collaboration skills. Levels update dynamically.</p>
                                        </div>
                                        <button onClick={() => { setQuizSetupName(currentUser.name); setQuizModalOpen(true); }} className="px-6 py-3 rounded-xl font-bold bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white transition-all shadow-lg shadow-violet-600/20">
                                            Launch Skill Quiz
                                        </button>
                                    </div>

                                    {/* Quiz Interface Segment */}
                                    {quizActive && (
                                        <div className="glass-panel p-6 border-violet-500/30 relative overflow-hidden text-left">
                                            <div className="absolute top-0 left-0 h-1 bg-gradient-to-r from-violet-500 to-cyan-400 transition-all" style={{ width: `${((currentQuestionIdx + 1) / 5) * 100}%` }} />
                                            
                                            <div className="flex items-center justify-between mb-4">
                                                <span className="text-xs font-semibold text-slate-400">Question {currentQuestionIdx + 1} of 5</span>
                                                <span className="px-3 py-1 rounded-full text-xs font-bold bg-red-500/10 border border-red-500/20 text-red-400">
                                                    Timer: {quizTimer}s
                                                </span>
                                            </div>

                                            {activeQuizQuestions.length > 0 && (
                                                <>
                                                    <h3 className="text-lg font-bold text-white mb-6">
                                                        {activeQuizQuestions[currentQuestionIdx]?.text}
                                                    </h3>

                                                    <div className="flex flex-col gap-3 mb-6">
                                                        {activeQuizQuestions[currentQuestionIdx]?.options.map((opt, oIdx) => (
                                                            <button
                                                                key={oIdx}
                                                                onClick={() => handleSelectOption(oIdx)}
                                                                className={`w-full p-4 rounded-xl text-left border transition-all ${quizAnswers[currentQuestionIdx] === oIdx ? "bg-violet-600/15 border-violet-500 text-white shadow-glow" : "bg-white/5 border-white/5 text-slate-300 hover:bg-white/10"}`}
                                                            >
                                                                {String.fromCharCode(65 + oIdx)}. {opt}
                                                            </button>
                                                        ))}
                                                    </div>

                                                    <div className="flex justify-between items-center">
                                                        <button onClick={handlePrevQuizQuestion} disabled={currentQuestionIdx === 0} className="px-4 py-2 rounded-xl text-sm font-semibold border border-white/5 hover:bg-white/5 disabled:opacity-30 disabled:hover:bg-transparent transition-all">
                                                            Previous
                                                        </button>
                                                        
                                                        <span className="text-xs italic text-violet-400">
                                                            {activeQuizQuestions[currentQuestionIdx]?.motivation}
                                                        </span>

                                                        <button onClick={handleNextQuizQuestion} className="px-5 py-2 rounded-xl text-sm font-semibold bg-violet-600 hover:bg-violet-700 text-white transition-all">
                                                            {currentQuestionIdx === 4 ? "Submit Quiz" : "Next"}
                                                        </button>
                                                    </div>
                                                </>
                                            )}
                                        </div>
                                    )}

                                    {/* Quiz Results Summary panel */}
                                    {quizResult && (
                                        <div className="glass-panel p-6 border-emerald-500/30 text-left">
                                            <div className="flex items-center gap-3 mb-4 text-emerald-400">
                                                <CheckCircle size={24} />
                                                <h3 className="text-lg font-bold text-white">Challenge Completed Successfully!</h3>
                                            </div>
                                            
                                            <div className="grid grid-cols-3 gap-4 mb-6">
                                                <div className="p-4 rounded-xl bg-white/5 border border-white/5">
                                                    <span className="text-xs text-slate-400">Quiz Score</span>
                                                    <h4 className="text-xl font-bold text-white mt-1">{quizResult.score}</h4>
                                                </div>
                                                <div className="p-4 rounded-xl bg-white/5 border border-white/5">
                                                    <span className="text-xs text-slate-400">Accuracy Rate</span>
                                                    <h4 className="text-xl font-bold text-emerald-400 mt-1">{quizResult.accuracy}</h4>
                                                </div>
                                                <div className="p-4 rounded-xl bg-white/5 border border-white/5">
                                                    <span className="text-xs text-slate-400">XP Points Earned</span>
                                                    <h4 className="text-xl font-bold text-amber-400 mt-1">+{quizResult.xpEarned} XP</h4>
                                                </div>
                                            </div>

                                            <button onClick={() => setQuizResult(null)} className="btn bg-white/5 hover:bg-white/10 border border-white/10 px-4 py-2 rounded-xl text-xs">
                                                Dismiss Result
                                            </button>
                                        </div>
                                    )}

                                    {/* Leaderboards & Badge Podium Row */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
                                        {/* Global Podium */}
                                        <div className="glass-panel p-6">
                                            <h3 className="font-bold text-white mb-4">Global Rank Board</h3>
                                            <div className="flex flex-col gap-3">
                                                <div className="flex items-center justify-between p-3 rounded-xl bg-amber-500/10 border border-amber-500/20">
                                                    <span className="text-sm font-semibold text-slate-200">🥇 1. Alexander Chen</span>
                                                    <span className="text-xs font-bold text-amber-400">12,400 XP</span>
                                                </div>
                                                <div className="flex items-center justify-between p-3 rounded-xl bg-slate-200/10 border border-slate-200/20">
                                                    <span className="text-sm font-semibold text-slate-200">🥈 2. Maria S.</span>
                                                    <span className="text-xs font-bold text-slate-300">9,850 XP</span>
                                                </div>
                                                <div className="flex items-center justify-between p-3 rounded-xl bg-amber-700/10 border border-amber-700/20">
                                                    <span className="text-sm font-semibold text-slate-200">🥉 3. Rohan Gupta</span>
                                                    <span className="text-xs font-bold text-amber-700">7,200 XP</span>
                                                </div>
                                                <div className="flex items-center justify-between p-3 rounded-xl bg-violet-600/10 border border-violet-500/20">
                                                    <span className="text-sm font-semibold text-violet-300">🎯 {currentUser.name} (You)</span>
                                                    <span className="text-xs font-bold text-violet-400">{currentUser.xp} XP</span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Badges Inventory */}
                                        <div className="glass-panel p-6">
                                            <h3 className="font-bold text-white mb-4 font-sans text-sm tracking-tight uppercase text-slate-400">Unlocked Achievement Badges</h3>
                                            <div className="grid grid-cols-4 gap-3 text-center">
                                                {/* Badge 1 */}
                                                <div className="p-3 rounded-xl bg-violet-600/10 border border-violet-500/20 flex flex-col items-center hover:scale-105 transition-all shadow-sm">
                                                    <span className="text-2xl mb-1 filter drop-shadow">🏅</span>
                                                    <span className="text-[10px] text-slate-200 font-bold whitespace-nowrap">First Quiz</span>
                                                </div>
                                                {/* Badge 2 */}
                                                <div className="p-3 rounded-xl bg-violet-600/10 border border-violet-500/20 flex flex-col items-center hover:scale-105 transition-all shadow-sm">
                                                    <span className="text-2xl mb-1 filter drop-shadow">⭐</span>
                                                    <span className="text-[10px] text-slate-200 font-bold whitespace-nowrap">Explorer</span>
                                                </div>
                                                {/* Badge 3 */}
                                                <div className={`p-3 rounded-xl border flex flex-col items-center hover:scale-105 transition-all ${currentUser.level >= 2 ? "bg-violet-600/10 border-violet-500/20 shadow-sm" : "bg-white/1 opacity-30 border-dashed border-white/10"}`}>
                                                    <span className="text-2xl mb-1 filter drop-shadow">💻</span>
                                                    <span className="text-[10px] text-slate-200 font-bold whitespace-nowrap">Tech Dev</span>
                                                </div>
                                                {/* Badge 4 */}
                                                <div className={`p-3 rounded-xl border flex flex-col items-center hover:scale-105 transition-all ${currentUser.level >= 3 ? "bg-violet-600/10 border-violet-500/20 shadow-sm" : "bg-white/1 opacity-30 border-dashed border-white/10"}`}>
                                                    <span className="text-2xl mb-1 filter drop-shadow">📚</span>
                                                    <span className="text-[10px] text-slate-200 font-bold whitespace-nowrap">Fast Learn</span>
                                                </div>
                                                {/* Badge 5 */}
                                                <div className={`p-3 rounded-xl border flex flex-col items-center hover:scale-105 transition-all ${currentUser.level >= 4 ? "bg-violet-600/10 border-violet-500/20 shadow-sm" : "bg-white/1 opacity-30 border-dashed border-white/10"}`}>
                                                    <span className="text-2xl mb-1 filter drop-shadow">🎯</span>
                                                    <span className="text-[10px] text-slate-200 font-bold whitespace-nowrap">Interview Pro</span>
                                                </div>
                                                {/* Badge 6 */}
                                                <div className={`p-3 rounded-xl border flex flex-col items-center hover:scale-105 transition-all ${(currentUser.plan !== "FREE" || scans.length >= 1) ? "bg-violet-600/10 border-violet-500/20 shadow-sm" : "bg-white/1 opacity-30 border-dashed border-white/10"}`}>
                                                    <span className="text-2xl mb-1 filter drop-shadow">📄</span>
                                                    <span className="text-[10px] text-slate-200 font-bold whitespace-nowrap">ATS Auditor</span>
                                                </div>
                                                {/* Badge 7 */}
                                                <div className={`p-3 rounded-xl border flex flex-col items-center hover:scale-105 transition-all ${bookings.length >= 1 ? "bg-violet-600/10 border-violet-500/20 shadow-sm" : "bg-white/1 opacity-30 border-dashed border-white/10"}`}>
                                                    <span className="text-2xl mb-1 filter drop-shadow">🤝</span>
                                                    <span className="text-[10px] text-slate-200 font-bold whitespace-nowrap">Mentor Link</span>
                                                </div>
                                                {/* Badge 8 */}
                                                <div className={`p-3 rounded-xl border flex flex-col items-center hover:scale-105 transition-all ${currentUser.xp >= 500 ? "bg-violet-600/10 border-violet-500/20 shadow-sm" : "bg-white/1 opacity-30 border-dashed border-white/10"}`}>
                                                    <span className="text-2xl mb-1 filter drop-shadow">👑</span>
                                                    <span className="text-[10px] text-slate-200 font-bold whitespace-nowrap">Elite Ranker</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* TAB 2: ATS RESUME SCANNER & PORTFOLIO */}
                            {activeTab === "resume" && (
                                <div className="flex flex-col gap-6 text-left">
                                    <div className="glass-panel p-6">
                                        <h3 className="text-xl font-bold text-white mb-1">ATS Optimization & Analyzer</h3>
                                        <p className="text-xs text-slate-400 mb-6">Upload your resume in PDF/TXT formatting. The parser runs matching evaluations against standard job descriptions.</p>

                                        {/* Drag & Drop Box */}
                                        <div
                                            onDragOver={handleDragOver}
                                            onDrop={handleDrop}
                                            className="border-2 border-dashed border-white/10 rounded-2xl p-8 flex flex-col items-center justify-center text-center cursor-pointer hover:border-violet-500/50 transition-all bg-white/1 mb-6"
                                        >
                                            <Upload className="text-violet-400 mb-3" size={32} />
                                            {uploadedFile ? (
                                                <span className="text-sm font-semibold text-slate-200">{uploadedFile.name}</span>
                                            ) : (
                                                <span className="text-sm text-slate-300">Drag & drop files or click to upload</span>
                                            )}
                                            <span className="text-[10px] text-slate-500 mt-1">PDF or DOCX accepted (Max 4MB)</span>
                                            
                                            {/* File Picker input */}
                                            <input
                                                type="file"
                                                accept=".pdf,.docx,.txt"
                                                onChange={(e) => { if(e.target.files[0]) setUploadedFile(e.target.files[0]); }}
                                                className="hidden"
                                                id="resume-file-picker"
                                            />
                                            <label htmlFor="resume-file-picker" className="mt-4 px-4 py-2 rounded-xl text-xs font-bold border border-white/10 hover:bg-white/5 transition-all">
                                                Select File
                                            </label>
                                        </div>

                                        <button
                                            onClick={triggerResumeScan}
                                            disabled={!uploadedFile || scanningInProgress}
                                            className="w-full py-3 rounded-xl font-bold bg-violet-600 hover:bg-violet-700 text-white transition-all disabled:opacity-40"
                                        >
                                            {scanningInProgress ? "Parsing System Gaps..." : "Audit Resume (Uses 1 scan credit)"}
                                        </button>
                                    </div>

                                    {/* Scan Report Result Summary */}
                                    {scanReport && (
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                            {/* ATS Score */}
                                            <div className="glass-panel p-6 flex flex-col items-center justify-center text-center">
                                                <div className="w-24 h-24 rounded-full border-8 border-violet-500 flex items-center justify-center mb-3">
                                                    <span className="text-2xl font-bold text-white">{scanReport.score}%</span>
                                                </div>
                                                <h4 className="font-bold text-slate-200">ATS Formatting Score</h4>
                                                <span className="text-[10px] text-slate-500 mt-1">Excellent header mapping</span>
                                            </div>

                                            {/* Keywords gaps */}
                                            <div className="glass-panel p-6 md:col-span-2">
                                                <h4 className="font-bold text-white mb-3">Audits & Gaps Analysis</h4>
                                                
                                                <span className="text-xs font-bold text-slate-400 block mb-1">Keywords Matched:</span>
                                                <div className="flex flex-wrap gap-1.5 mb-3">
                                                    {scanReport.keywordsMatched.map((kw, idx) => (
                                                        <span key={idx} className="px-2 py-0.5 rounded text-[10px] bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">{kw}</span>
                                                    ))}
                                                </div>

                                                <span className="text-xs font-bold text-slate-400 block mb-1">Critical Missing Keywords:</span>
                                                <div className="flex flex-wrap gap-1.5 mb-3">
                                                    {scanReport.keywordsMissing.map((kw, idx) => (
                                                        <span key={idx} className="px-2 py-0.5 rounded text-[10px] bg-red-500/10 border border-red-500/20 text-red-400">{kw}</span>
                                                    ))}
                                                </div>

                                                <span className="text-xs font-bold text-slate-400 block mb-1">Action items:</span>
                                                <ul className="list-disc pl-4 text-xs text-slate-300 flex flex-col gap-1">
                                                    {scanReport.suggestions.map((sg, idx) => (
                                                        <li key={idx}>{sg}</li>
                                                    ))}
                                                </ul>
                                            </div>
                                        </div>
                                    )}

                                    {scanReport && (
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                                            {/* Recommended Vacancies */}
                                            <div className="glass-panel p-6">
                                                <h4 className="font-bold text-white mb-4 flex items-center gap-2 text-sm">
                                                    💼 Matched Live Vacancies (Original Openings)
                                                </h4>
                                                <div className="flex flex-col gap-3">
                                                    {jobs.slice(0, 2).map((jb) => (
                                                        <div key={jb.id} className="p-3 rounded-xl bg-white/5 border border-white/5 flex justify-between items-center text-left">
                                                            <div>
                                                                <h5 className="font-bold text-xs text-white">{jb.title}</h5>
                                                                <span className="text-[10px] text-slate-400 block mt-0.5">{jb.companyName} • {jb.location}</span>
                                                                <span className="text-[10px] text-violet-400 font-semibold block mt-0.5">{jb.salaryRange}</span>
                                                            </div>
                                                            <a href={jb.applicationUrl} target="_blank" rel="noopener noreferrer" className="px-3 py-1.5 rounded-lg text-[10px] font-bold bg-violet-600 hover:bg-violet-700 text-white transition-all whitespace-nowrap">
                                                                Apply
                                                            </a>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>

                                            {/* Upskill Pathways */}
                                            <div className="glass-panel p-6">
                                                <h4 className="font-bold text-white mb-4 flex items-center gap-2 text-sm">
                                                    📚 Recommended Upskilling (Original Courses)
                                                </h4>
                                                <div className="flex flex-col gap-3">
                                                    {affiliates.slice(0, 2).map((course) => (
                                                        <div key={course.id} className="p-3 rounded-xl bg-white/5 border border-white/5 flex justify-between items-center text-left">
                                                            <div>
                                                                <h5 className="font-bold text-xs text-white">{course.title}</h5>
                                                                <span className="text-[10px] text-slate-400 block mt-0.5">By {course.provider} • {course.duration}</span>
                                                            </div>
                                                            <a href={course.affiliateUrl} target="_blank" rel="noopener noreferrer" className="px-3 py-1.5 rounded-lg text-[10px] font-bold bg-emerald-600 hover:bg-emerald-700 text-white transition-all whitespace-nowrap">
                                                                Enroll
                                                            </a>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}


                            {/* TAB 4: SPONSORED VACANCIES FEED */}
                            {activeTab === "jobs" && (
                                <div className="flex flex-col gap-6 text-left">
                                    <div className="glass-panel p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                                        <div>
                                            <h3 className="text-xl font-bold text-white mb-1">Sponsored Vacancies Listings</h3>
                                            <p className="text-xs text-slate-400">Recruiters can post featured listings to capture student leads. Sponsored listings always display first.</p>
                                        </div>
                                        {currentUser.role === "RECRUITER" && (
                                            <button onClick={() => alert("Fill the form below to post a vacancy.")} className="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-violet-600 hover:bg-violet-700 text-white transition-all">
                                                Add New Vacancy
                                            </button>
                                        )}
                                    </div>

                                    {/* Recruiter vacancy submission panel */}
                                    {currentUser.role === "RECRUITER" && (
                                        <div className="glass-panel p-6">
                                            <h4 className="font-bold text-white mb-4">Post Sponsored Job</h4>
                                            <form onSubmit={handlePostJob} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div className="form-group text-left">
                                                    <label className="text-xs text-slate-300 block mb-1">Job Title</label>
                                                    <input type="text" placeholder="e.g., Software Dev" value={newJobTitle} onChange={(e)=>setNewJobTitle(e.target.value)} required className="w-full glass-input text-xs" />
                                                </div>
                                                <div className="form-group text-left">
                                                    <label className="text-xs text-slate-300 block mb-1">Company Name</label>
                                                    <input type="text" placeholder="e.g., Vanguard Tech" value={newJobCompany} onChange={(e)=>setNewJobCompany(e.target.value)} required className="w-full glass-input text-xs" />
                                                </div>
                                                <div className="form-group text-left">
                                                    <label className="text-xs text-slate-300 block mb-1">Category</label>
                                                    <input type="text" placeholder="e.g., Engineering" value={newJobCategory} onChange={(e)=>setNewJobCategory(e.target.value)} required className="w-full glass-input text-xs" />
                                                </div>
                                                <div className="form-group text-left">
                                                    <label className="text-xs text-slate-300 block mb-1">Salary Range</label>
                                                    <input type="text" placeholder="e.g., ₹8,00,000 - ₹12,00,000" value={newJobSalary} onChange={(e)=>setNewJobSalary(e.target.value)} required className="w-full glass-input text-xs" />
                                                </div>
                                                <div className="form-group text-left">
                                                    <label className="text-xs text-slate-300 block mb-1">Location</label>
                                                    <input type="text" placeholder="e.g., Bengaluru, KA" value={newJobLocation} onChange={(e)=>setNewJobLocation(e.target.value)} required className="w-full glass-input text-xs" />
                                                </div>
                                                <div className="form-group text-left">
                                                    <label className="text-xs text-slate-300 block mb-1">Application URL</label>
                                                    <input type="url" placeholder="https://..." value={newJobUrl} onChange={(e)=>setNewJobUrl(e.target.value)} required className="w-full glass-input text-xs" />
                                                </div>
                                                <div className="flex items-center gap-2 mt-2">
                                                    <input type="checkbox" id="check-remote" checked={newJobRemote} onChange={(e)=>setNewJobRemote(e.target.checked)} />
                                                    <label htmlFor="check-remote" className="text-xs text-slate-300 cursor-pointer">This is a Remote Position</label>
                                                </div>
                                                <div className="md:col-span-2 mt-2">
                                                    <button type="submit" className="px-5 py-2 rounded-xl text-xs font-bold bg-violet-600 hover:bg-violet-700 text-white transition-all shadow-glow">
                                                        Submit Sponsored Vacancy (₹7,999 billing)
                                                    </button>
                                                </div>
                                            </form>
                                        </div>
                                    )}

                                    {/* Jobs Feed Grid */}
                                    <div className="flex flex-col gap-4">
                                        {jobs.map((jb) => (
                                            <div key={jb.id} className="glass-panel p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-l-4 border-violet-500">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-10 h-10 rounded-xl bg-violet-600/10 border border-violet-500/20 flex items-center justify-center text-lg">
                                                        {jb.companyLogo || "💼"}
                                                    </div>
                                                    <div>
                                                        <div className="flex items-center gap-2">
                                                            <h4 className="font-bold text-white text-base">{jb.title}</h4>
                                                            {jb.isSponsored && (
                                                                <span className="px-2 py-0.5 rounded text-[8px] font-bold bg-amber-500/20 border border-amber-500/30 text-amber-300">SPONSORED</span>
                                                            )}
                                                        </div>
                                                        <span className="text-xs text-slate-400">{jb.companyName} • {jb.location} {jb.isRemote && "(Remote)"}</span>
                                                    </div>
                                                </div>

                                                <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-end border-t md:border-t-0 border-white/5 pt-3 md:pt-0">
                                                    <span className="text-sm font-semibold text-slate-200">{jb.salaryRange}</span>
                                                    <a href={jb.applicationUrl} target="_blank" rel="noopener noreferrer" className="px-4 py-2 rounded-xl text-xs font-bold bg-white/5 hover:bg-white/10 text-white border border-white/10 transition-all flex items-center gap-1.5">
                                                        Apply <ExternalLink size={12} />
                                                    </a>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* TAB 5: SPONSORED BOOTCAMPS */}
                            {activeTab === "bootcamps" && (
                                <div className="flex flex-col gap-6 text-left">
                                    <div className="glass-panel p-6">
                                        <h3 className="text-xl font-bold text-white mb-1">Sponsored Bootcamp Marketplace</h3>
                                        <p className="text-xs text-slate-400">Premium career bootcamps and civil service coaching academies. Find high-performing courses with placement rates.</p>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                        {bootcamps.map((bc) => (
                                            <div key={bc.id} className="glass-panel p-5 flex flex-col justify-between">
                                                <div>
                                                    <div className="flex items-center justify-between mb-3">
                                                        <div className="w-10 h-10 rounded-xl bg-violet-600/10 border border-violet-500/20 flex items-center justify-center text-xl">
                                                            {bc.bannerUrl}
                                                        </div>
                                                        <span className="px-2 py-0.5 rounded text-[8px] font-bold bg-amber-500/20 border border-amber-500/30 text-amber-300">SPONSORED</span>
                                                    </div>

                                                    <h4 className="font-bold text-white text-base">{bc.name}</h4>
                                                    <span className="text-[10px] text-emerald-400 font-bold block mt-0.5">💼 {bc.placementRate}% Placement Guarantee</span>
                                                    
                                                    <p className="text-xs text-slate-300 mt-2">{bc.description}</p>
                                                    
                                                    <div className="mt-4 flex flex-col gap-1 text-[11px] text-slate-400">
                                                        <span>⏱️ Duration: <strong>{bc.duration}</strong></span>
                                                        <span>🎁 Scholarship: <strong>{bc.scholarship}</strong></span>
                                                    </div>
                                                </div>

                                                <div className="mt-6 border-t border-white/5 pt-4">
                                                    <a href={bc.affiliateLink} target="_blank" rel="noopener noreferrer" className="w-full block text-center py-2.5 rounded-xl text-xs font-bold bg-violet-600 hover:bg-violet-700 text-white transition-all shadow-glow">
                                                        Apply Now
                                                    </a>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* TAB 6: AFFILIATE LEARNING MARKETPLACE */}
                            {activeTab === "affiliates" && (
                                <div className="flex flex-col gap-6 text-left">
                                    <div className="glass-panel p-6">
                                        <h3 className="text-xl font-bold text-white mb-1">Learning Pathways & Certifications</h3>
                                        <p className="text-xs text-slate-400">Course recommendations tailored to your predicted career roadmaps. Upgrades earn commission support.</p>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                        {affiliates.map((aff) => (
                                            <div key={aff.id} className="glass-panel p-5 flex flex-col justify-between">
                                                <div>
                                                    <div className="flex items-center justify-between mb-3">
                                                        <span className="text-xs text-slate-500 font-semibold">{aff.provider}</span>
                                                        {aff.discountBadge && (
                                                            <span className="px-2 py-0.5 rounded text-[8px] font-bold bg-emerald-500/20 border border-emerald-500/30 text-emerald-300">{aff.discountBadge}</span>
                                                        )}
                                                    </div>

                                                    <h4 className="font-bold text-white text-base mb-1">{aff.title}</h4>
                                                    <span className="text-[10px] text-amber-400 font-bold block">⭐ {aff.rating} Rating</span>
                                                    
                                                    <p className="text-xs text-slate-300 mt-2 bg-white/5 p-2 rounded-lg border border-white/5 leading-relaxed">{aff.reason}</p>
                                                    
                                                    <div className="mt-4 flex flex-col gap-1 text-[11px] text-slate-400">
                                                        <span>⏱️ Est. Duration: <strong>{aff.duration}</strong></span>
                                                        <span>📊 Difficulty: <strong>{aff.difficulty}</strong></span>
                                                    </div>
                                                </div>

                                                <div className="mt-6 border-t border-white/5 pt-4">
                                                    <a href={aff.affiliateUrl} target="_blank" rel="noopener noreferrer" className="w-full block text-center py-2.5 rounded-xl text-xs font-bold bg-violet-600 hover:bg-violet-700 text-white transition-all shadow-glow">
                                                        Enroll Course
                                                    </a>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* TAB 7: COLLEGE WHITE LABEL PORTAL */}
                            {activeTab === "college" && currentUser.role === "COLLEGE_ADMIN" && (
                                <div className="flex flex-col gap-6 text-left">
                                    <div className="glass-panel p-6">
                                        <h3 className="text-xl font-bold text-white mb-1">Campus Analytics & White-Label</h3>
                                        <p className="text-xs text-slate-400">Manage institution student analytics, customize university logo configurations, and audit department career scores.</p>
                                    </div>

                                    {/* Mock stats widgets */}
                                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                        <div className="p-4 rounded-xl bg-white/5 border border-white/5">
                                            <span className="text-xs text-slate-400">Total Enrolled Students</span>
                                            <h4 className="text-2xl font-bold text-white mt-1">1,240</h4>
                                        </div>
                                        <div className="p-4 rounded-xl bg-white/5 border border-white/5">
                                            <span className="text-xs text-slate-400">Average Resume Score</span>
                                            <h4 className="text-2xl font-bold text-emerald-400 mt-1">74.5%</h4>
                                        </div>
                                        <div className="p-4 rounded-xl bg-white/5 border border-white/5">
                                            <span className="text-xs text-slate-400">Active Skill Quizzes</span>
                                            <h4 className="text-2xl font-bold text-violet-400 mt-1">450</h4>
                                        </div>
                                        <div className="p-4 rounded-xl bg-white/5 border border-white/5">
                                            <span className="text-xs text-slate-400">Placements Index</span>
                                            <h4 className="text-2xl font-bold text-amber-400 mt-1">82.3%</h4>
                                        </div>
                                    </div>

                                    {/* White-Label Customization panel */}
                                    <div className="glass-panel p-6">
                                        <h4 className="font-bold text-white mb-4">Institution Branding Settings</h4>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div>
                                                <label className="text-xs text-slate-300 block mb-1">University Name</label>
                                                <input type="text" readOnly value="Vanguard Institute of Tech" className="w-full glass-input text-xs text-slate-300" />
                                            </div>
                                            <div>
                                                <label className="text-xs text-slate-300 block mb-1">Custom Domain Routing</label>
                                                <input type="text" readOnly value="vanguard.pathfinder.ai" className="w-full glass-input text-xs text-slate-300" />
                                            </div>
                                        </div>
                                        <button onClick={() => alert("Branding configurations saved!")} className="mt-4 px-4 py-2 rounded-xl text-xs font-bold bg-violet-600 hover:bg-violet-700 text-white transition-all">
                                            Apply Changes
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* TAB 8: SUPER ADMIN REVENUE DASHBOARD */}
                            {activeTab === "admin" && (currentUser.role === "SUPER_ADMIN" || currentUser.role === "COLLEGE_ADMIN") && (
                                <div className="flex flex-col gap-6 text-left">
                                    <div className="glass-panel p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                                        <div>
                                            <h3 className="text-xl font-bold text-white mb-1">Platform Revenue & SuperAdmin Dashboard</h3>
                                            <p className="text-xs text-slate-400">Consolidated platform monthly metrics, subscription tiers projections, and affiliate clicks.</p>
                                        </div>
                                        
                                        <div className="flex gap-2">
                                            <button onClick={() => setAdminGrowthPeriod("monthly")} className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${adminGrowthPeriod === "monthly" ? "bg-violet-600 text-white" : "bg-white/5 text-slate-400"}`}>Monthly</button>
                                            <button onClick={() => setAdminGrowthPeriod("quarterly")} className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${adminGrowthPeriod === "quarterly" ? "bg-violet-600 text-white" : "bg-white/5 text-slate-400"}`}>Quarterly</button>
                                        </div>
                                    </div>

                                    {/* Core Revenue Widgets */}
                                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                        <div className="p-4 rounded-xl bg-white/5 border border-white/5">
                                            <span className="text-xs text-slate-400">Monthly Recurring Revenue (MRR)</span>
                                            <h4 className="text-2xl font-bold text-white mt-1">₹10,25,000</h4>
                                        </div>
                                        <div className="p-4 rounded-xl bg-white/5 border border-white/5">
                                            <span className="text-xs text-slate-400">Affiliate Earnings</span>
                                            <h4 className="text-2xl font-bold text-emerald-400 mt-1">₹2,38,000</h4>
                                        </div>
                                        <div className="p-4 rounded-xl bg-white/5 border border-white/5">
                                            <span className="text-xs text-slate-400">Marketplace Commission (20%)</span>
                                            <h4 className="text-2xl font-bold text-violet-400 mt-1">₹1,64,000</h4>
                                        </div>
                                        <div className="p-4 rounded-xl bg-white/5 border border-white/5">
                                            <span className="text-xs text-slate-400">Net Platform Profit</span>
                                            <h4 className="text-2xl font-bold text-amber-400 mt-1">₹14,27,000</h4>
                                        </div>
                                    </div>

                                    {/* Recharts Area Chart */}
                                    <div className="glass-panel p-6 h-80 flex flex-col justify-between">
                                        <h4 className="font-bold text-white mb-4">Revenue Growth Chart</h4>
                                        <div className="flex-1 w-full">
                                            <ResponsiveContainer width="100%" height="100%">
                                                <AreaChart data={adminRevenueData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                                    <defs>
                                                        <linearGradient id="colorMrr" x1="0" y1="0" x2="0" y2="1">
                                                            <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.4}/>
                                                            <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                                                        </linearGradient>
                                                    </defs>
                                                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                                                    <XAxis dataKey="name" stroke="#64748b" fontSize={11} />
                                                    <YAxis stroke="#64748b" fontSize={11} />
                                                    <Tooltip contentStyle={{ backgroundColor: "#1e1b4b", borderColor: "#4c1d95", borderRadius: "12px", color: "white" }} formatter={(value) => ["₹" + value.toLocaleString(), "MRR"]} />
                                                    <Area type="monotone" dataKey="MRR" stroke="#8b5cf6" fillOpacity={1} fill="url(#colorMrr)" />
                                                </AreaChart>
                                            </ResponsiveContainer>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* TAB 9: STATIC ABOUT US VIEW */}
                            {activeTab === "about" && (
                                <div className="glass-panel p-8 text-left">
                                    <div className="flex items-center gap-3 mb-6">
                                        <div className="w-10 h-10 rounded-xl bg-violet-600/10 border border-violet-500/20 flex items-center justify-center text-violet-400"><HelpCircle size={20} /></div>
                                        <h3 className="text-xl font-bold text-white">About PathFinder</h3>
                                    </div>
                                    <p className="text-sm text-slate-300 leading-relaxed mb-4">
                                        PathFinder is a premium SaaS career coaching platform utilizing client-side prediction models and LLM analytics to map student academic credentials to standard technical job listings.
                                    </p>
                                    <h4 className="font-semibold text-white mt-6 mb-2">Our Vision</h4>
                                    <p className="text-sm text-slate-300 leading-relaxed">
                                        We aim to democratize advanced career guidance and resume parsing checks for candidates globally by supplying 24/7 mock interview tools and personalized certification pathways.
                                    </p>
                                </div>
                            )}

                            {/* TAB 10: STATIC CONTACT US VIEW */}
                            {activeTab === "contact" && (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
                                    <div className="glass-panel p-6">
                                        <h3 className="text-lg font-bold text-white mb-2">Contact Support</h3>
                                        <p className="text-xs text-slate-400 mb-6">Have questions or business custom white-label inquiries? Submit a message below.</p>
                                        
                                        {contactSuccess ? (
                                            <div className="p-6 text-center flex flex-col items-center justify-center">
                                                <CheckCircle size={32} className="text-emerald-400 mb-2" />
                                                <h4 className="font-bold text-white">Message Sent Successfully!</h4>
                                                <p className="text-xs text-slate-400 mt-1">We will respond to support@pathfinder.ai in 24 hours.</p>
                                                <button onClick={() => setContactSuccess(false)} className="mt-4 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-xs">Send another</button>
                                            </div>
                                        ) : (
                                            <form onSubmit={handleContactSubmit} className="flex flex-col gap-4">
                                                <div className="form-group">
                                                    <label className="text-xs text-slate-300 block mb-1">Full Name</label>
                                                    <input type="text" placeholder="John Doe" value={contactName} onChange={(e)=>setContactName(e.target.value)} required className="w-full glass-input text-xs" />
                                                </div>
                                                <div className="form-group">
                                                    <label className="text-xs text-slate-300 block mb-1">Email</label>
                                                    <input type="email" placeholder="john@example.com" value={contactEmail} onChange={(e)=>setContactEmail(e.target.value)} required className="w-full glass-input text-xs" />
                                                </div>
                                                <div className="form-group">
                                                    <label className="text-xs text-slate-300 block mb-1">Subject</label>
                                                    <input type="text" placeholder="General Questions" value={contactSubject} onChange={(e)=>setContactSubject(e.target.value)} required className="w-full glass-input text-xs" />
                                                </div>
                                                <div className="form-group">
                                                    <label className="text-xs text-slate-300 block mb-1">Message</label>
                                                    <textarea rows={4} placeholder="Write message..." value={contactMsg} onChange={(e)=>setContactMsg(e.target.value)} required className="w-full glass-input text-xs resize-none" />
                                                </div>
                                                <button type="submit" className="py-2.5 rounded-xl font-bold bg-violet-600 hover:bg-violet-700 text-white transition-all text-xs">
                                                    Send Ticket
                                                </button>
                                            </form>
                                        )}
                                    </div>
                                    
                                    <div className="flex flex-col gap-6">
                                        <div className="glass-panel p-6">
                                            <h4 className="font-bold text-white mb-2">Office Support hours</h4>
                                            <p className="text-xs text-slate-300">Monday - Friday: 9:00 AM - 6:00 PM EST</p>
                                            <span className="text-[10px] text-slate-500 mt-2 block">Support ticketing is processed 24/7.</span>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* TAB 11: STATIC PRIVACY VIEW */}
                            {activeTab === "privacy" && (
                                <div className="glass-panel p-8 text-left max-w-2xl mx-auto">
                                    <h3 className="text-xl font-bold text-white mb-4">Privacy Policy</h3>
                                    <p className="text-xs text-slate-400 mb-6">Last Updated: July 8, 2026</p>
                                    <div className="flex flex-col gap-4 text-xs text-slate-300 leading-relaxed">
                                        <span>1. <strong>Information We Collect:</strong> We collect details you provide during registration including name, email, credentials, and uploaded resume text file formats.</span>
                                        <span>2. <strong>AI processing disclaimer:</strong> Resume uploads and conversational details are processed solely to calculate skill recommendations. No private credential data is retained on outer APIs.</span>
                                        <span>3. <strong>Stripe & Auth:</strong> Financial billing checkout processes are securely hosted on Stripe servers. Google logins are processed via official SSO endpoints.</span>
                                    </div>
                                </div>
                            )}

                            {/* TAB 12: STATIC TERMS VIEW */}
                            {activeTab === "terms" && (
                                <div className="glass-panel p-8 text-left max-w-2xl mx-auto">
                                    <h3 className="text-xl font-bold text-white mb-4">Terms of Service</h3>
                                    <p className="text-xs text-slate-400 mb-6">Last Updated: July 8, 2026</p>
                                    <div className="flex flex-col gap-4 text-xs text-slate-300 leading-relaxed">
                                        <span>1. <strong>Acceptance:</strong> By logging into PathFinder, you agree to comply with our acceptable use rules and local storage database structures.</span>
                                        <span>2. <strong>AI Disclaimer:</strong> AI-generated career guidelines and scores are for informational purposes only. PathFinder does not guarantee job placements or university admissions.</span>
                                        <span>3. <strong>Refund Policy:</strong> Billing tiers (Pro) have a 14-day refund window. Enterprise configurations are governed by institutional SLA contracts.</span>
                                    </div>
                                </div>
                            )}

                        </div>
                    </>
                ) : (
                    /* ---------------------------------------------------- */
                    /* UNAUTHENTICATED LANDING PAGE VIEW */
                    /* ---------------------------------------------------- */
                    <div className="flex-1 flex flex-col gap-12 mt-6">
                        {/* Hero Section */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center text-left">
                            <div>
                                <span className="px-3 py-1 rounded-full text-xs font-bold bg-violet-600/10 border border-violet-500/20 text-violet-400 inline-flex items-center gap-1.5 mb-4">
                                    <Sparkles size={12} /> Next-Gen AI Career Ecosystem
                                </span>
                                <h2 className="text-4xl md:text-5xl font-black tracking-tight leading-tight text-white">
                                    Navigate Your Future With <span className="bg-gradient-to-r from-violet-400 via-indigo-400 to-cyan-400 bg-clip-text text-transparent">Predictive AI</span>
                                </h2>
                                <p className="text-slate-400 mt-4 text-sm md:text-base leading-relaxed max-w-lg">
                                    Evaluate technical depth, audit ATS formatting matches, and book certified industry mentors. Everything you need to go from graduation candidate to premium software professional.
                                </p>
                                <div className="flex flex-wrap gap-4 mt-8">
                                    <button onClick={() => { setRegRole("CANDIDATE"); setAuthMode("register"); setAuthModal(true); }} className="px-6 py-3 rounded-xl font-bold bg-violet-600 hover:bg-violet-700 text-white transition-all shadow-lg shadow-violet-600/20 flex items-center gap-2">
                                        Build Free Account <ArrowRight size={16} />
                                    </button>
                                    <button onClick={() => loginQuickDemo("CANDIDATE", "FREE")} className="px-6 py-3 rounded-xl font-bold border border-white/10 bg-white/5 hover:bg-white/10 text-white transition-all">
                                        Quick Demo Sign In
                                    </button>
                                </div>
                            </div>

                            {/* Floating futuristic Vector illustration mock */}
                            <div className="relative flex justify-center">
                                <div className="w-80 h-80 rounded-full bg-violet-600/10 absolute filter blur-3xl" />
                                <div className="glass-panel p-6 w-full max-w-sm relative floating-illust flex flex-col gap-4 text-left border-violet-500/25">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-xl bg-violet-600/20 flex items-center justify-center text-lg">👩‍💻</div>
                                        <div>
                                            <h4 className="font-bold text-white text-sm">Predictive Career Match</h4>
                                            <span className="text-[10px] text-slate-500">Evaluating CS Major...</span>
                                        </div>
                                    </div>
                                    <div className="p-3.5 rounded-xl bg-white/5 border border-white/5">
                                        <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Top Match Recommendation</span>
                                        <h3 className="font-extrabold text-white text-base mt-1">Cloud Solutions Engineer</h3>
                                        <div className="flex items-center gap-1.5 mt-2">
                                            <span className="px-2 py-0.5 rounded text-[9px] bg-emerald-500/20 text-emerald-400 font-bold">96% Fit Rate</span>
                                            <span className="text-[10px] text-slate-400">Demand: High</span>
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-between text-xs text-slate-400">
                                        <span>Skills Check: <strong>9/10 passed</strong></span>
                                        <span>ATS Score: <strong>89% matched</strong></span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Pricing Grid */}
                        <div className="flex flex-col gap-6 mt-12 text-center">
                            <div className="max-w-md mx-auto">
                                <h3 className="text-2xl font-black text-white">Simple, Premium Pricing</h3>
                                <p className="text-xs text-slate-400 mt-2">Choose the plan that fits your career acceleration scale. Cancel at any time.</p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto w-full text-left">
                                {/* Free plan */}
                                <div className="glass-panel p-6 flex flex-col justify-between">
                                    <div>
                                        <h4 className="text-lg font-bold text-white">Starter Free</h4>
                                        <span className="text-3xl font-extrabold text-white mt-4 block">₹0</span>
                                        <span className="text-xs text-slate-500 block mb-6">No credit card required</span>

                                        <ul className="flex flex-col gap-3 text-xs text-slate-300">
                                            <li className="flex items-center gap-2"><Check size={12} className="text-violet-400" /> Basic 5-Question Quiz</li>
                                            <li className="flex items-center gap-2"><Check size={12} className="text-violet-400" /> 1 ATS Scan / month</li>
                                            <li className="flex items-center gap-2"><Check size={12} className="text-violet-400" /> 5 Aura Coach messages / day</li>
                                            <li className="flex items-center gap-2"><Check size={12} className="text-violet-400" /> 1 Career Roadmap</li>
                                        </ul>
                                    </div>

                                    <button onClick={() => loginQuickDemo("CANDIDATE", "FREE")} className="w-full mt-8 py-2.5 rounded-xl font-bold bg-white/5 border border-white/10 hover:bg-white/10 text-white text-xs transition-all">
                                        Choose Starter
                                    </button>
                                </div>

                                {/* Pro plan */}
                                <div className="glass-panel p-6 border-violet-500 flex flex-col justify-between relative shadow-lg shadow-violet-600/10">
                                    <div className="absolute top-0 right-4 transform -translate-y-1/2 px-2.5 py-0.5 rounded-full text-[9px] font-bold bg-violet-600 text-white">MOST POPULAR</div>
                                    <div>
                                        <h4 className="text-lg font-bold text-white">Career Pro</h4>
                                        <span className="text-3xl font-extrabold text-white mt-4 block">₹1,199<span className="text-sm font-normal text-slate-500">/mo</span></span>
                                        <span className="text-xs text-slate-500 block mb-6">Includes 7-day free trial</span>

                                        <ul className="flex flex-col gap-3 text-xs text-slate-300">
                                            <li className="flex items-center gap-2"><Check size={12} className="text-violet-400" /> Unlimited ATS Resume Audits</li>
                                            <li className="flex items-center gap-2"><Check size={12} className="text-violet-400" /> Unlimited Aura AI Counseling</li>
                                            <li className="flex items-center gap-2"><Check size={12} className="text-violet-400" /> Custom Public Portfolio Host</li>
                                            <li className="flex items-center gap-2"><Check size={12} className="text-violet-400" /> Weekly Career Reports & Salary Insights</li>
                                            <li className="flex items-center gap-2"><Check size={12} className="text-violet-400" /> Google Meet booking integrations</li>
                                        </ul>
                                    </div>

                                    <button onClick={() => {
                                        if (currentUser) {
                                            launchStripeCheckout("PRO");
                                        } else {
                                            setAuthMode("register");
                                            setAuthModal(true);
                                        }
                                    }} className="w-full mt-8 py-2.5 rounded-xl font-bold bg-violet-600 hover:bg-violet-700 text-white text-xs transition-all shadow-glow">
                                        Choose Pro
                                    </button>
                                </div>

                                {/* Enterprise plan */}
                                <div className="glass-panel p-6 flex flex-col justify-between">
                                    <div>
                                        <h4 className="text-lg font-bold text-white">Institution Enterprise</h4>
                                        <span className="text-3xl font-extrabold text-white mt-4 block">Custom</span>
                                        <span className="text-xs text-slate-500 block mb-6">Annual institutional contracts</span>

                                        <ul className="flex flex-col gap-3 text-xs text-slate-300">
                                            <li className="flex items-center gap-2"><Check size={12} className="text-violet-400" /> Unlimited Students accounts</li>
                                            <li className="flex items-center gap-2"><Check size={12} className="text-violet-400" /> Campus analytics placement charts</li>
                                            <li className="flex items-center gap-2"><Check size={12} className="text-violet-400" /> White-label domain and logos</li>
                                            <li className="flex items-center gap-2"><Check size={12} className="text-violet-400" /> Bulk uploader onboarding tools</li>
                                        </ul>
                                    </div>

                                    <button onClick={() => loginQuickDemo("COLLEGE_ADMIN", "ENTERPRISE")} className="w-full mt-8 py-2.5 rounded-xl font-bold bg-white/5 border border-white/10 hover:bg-white/10 text-white text-xs transition-all">
                                        Sign In as College Admin Demo
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </main>

            {/* Platform Footer */}
            <footer className="glass-panel mx-4 my-4 p-6 text-center border-white/5" style={{ borderRadius: '16px' }}>
                <p className="text-xs text-slate-500">&copy; 2026 PathFinder AI. Powered by client-side predictive intelligence. All rights reserved.</p>
            </footer>

            {/* ---------------------------------------------------- */}
            {/* LOGOUT CONFIRMATION MODAL */}
            {/* ---------------------------------------------------- */}
            {logoutConfirmOpen && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="glass-panel modal-panel p-6 w-full max-w-sm text-left">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400">
                                <LogOut size={20} />
                            </div>
                            <h3 className="text-lg font-bold text-white">Confirm Logout</h3>
                        </div>
                        <p className="text-sm text-slate-300 mb-6">
                            Are you sure you want to logout? Your session will be ended and you will be redirected to the home page.
                        </p>
                        <div className="flex gap-3">
                            <button
                                onClick={() => setLogoutConfirmOpen(false)}
                                className="flex-1 py-2.5 rounded-xl font-semibold border border-white/10 bg-white/5 hover:bg-white/10 text-white text-xs transition-all"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => {
                                    logoutUser();
                                    setLogoutConfirmOpen(false);
                                }}
                                className="flex-1 py-2.5 rounded-xl font-semibold bg-red-600 hover:bg-red-700 text-white text-xs transition-all shadow-lg shadow-red-600/20"
                            >
                                Logout
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* ---------------------------------------------------- */}
            {/* AUTH LOGIN/REGISTER MODAL */}
            {/* ---------------------------------------------------- */}
            {authModal && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="glass-panel modal-panel p-6 w-full max-w-sm text-left">
                        <div>
                            <h3 className="text-xl font-bold text-white mb-2">{authMode === "login" ? "Sign In to PathFinder" : "Create Account"}</h3>
                            <p className="text-xs text-slate-400 mb-6">{authMode === "login" ? "Access your predicted roadmaps & statistics." : "Unlock standard and custom portfolio templates."}</p>

                            {authMode === "login" ? (
                                <form onSubmit={onLoginSubmit} className="flex flex-col gap-4">
                                    <div className="form-group">
                                        <label className="text-xs text-slate-300 block mb-1">Email Address</label>
                                        <input type="email" placeholder="john@example.com" value={loginEmail} onChange={(e)=>setLoginEmail(e.target.value)} required className="w-full glass-input text-xs" />
                                    </div>
                                    <div className="form-group">
                                        <label className="text-xs text-slate-300 block mb-1">Password</label>
                                        <input type="password" placeholder="••••••••" value={loginPassword} onChange={(e)=>setLoginPassword(e.target.value)} required className="w-full glass-input text-xs" />
                                    </div>
                                    <button type="submit" className="w-full py-2.5 rounded-xl bg-violet-600 hover:bg-violet-700 text-white font-bold text-xs transition-all shadow-glow mt-2">
                                        Sign In
                                    </button>
                                    
                                    <div className="flex items-center my-2">
                                        <div className="flex-1 h-px bg-white/5" />
                                        <span className="text-[10px] text-slate-500 px-3 uppercase tracking-wider font-bold">Or</span>
                                        <div className="flex-1 h-px bg-white/5" />
                                    </div>
                                    
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setAuthModal(false);
                                            setGoogleSSOActive(true);
                                            setSsoStep("email");
                                            setSsoEmail("");
                                            setSsoPassword("");
                                        }}
                                        className="w-full py-2.5 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-white font-bold text-xs transition-all flex items-center justify-center gap-2"
                                    >
                                        <svg className="w-4 h-4" viewBox="0 0 24 24"><path fill="#EA4335" d="M12 5.04c1.66 0 3.2.57 4.38 1.69l3.27-3.27C17.67 1.54 14.98 1 12 1 7.35 1 3.37 3.67 1.39 7.56l3.87 3C6.18 7.56 8.85 5.04 12 5.04z"/><path fill="#4285F4" d="M23.49 12.27c0-.81-.07-1.59-.2-2.36H12v4.51h6.46c-.29 1.48-1.14 2.73-2.42 3.58v2.98h3.9c2.28-2.1 3.55-5.19 3.55-8.71z"/><path fill="#FBBC05" d="M5.26 14.28c-.24-.72-.38-1.49-.38-2.28s.14-1.56.38-2.28L1.39 6.72C.5 8.51 0 10.5 0 12.6s.5 4.09 1.39 5.88l3.87-3.2z"/><path fill="#34A853" d="M12 23c3.24 0 5.97-1.07 7.96-2.91l-3.9-2.98c-1.08.72-2.48 1.15-4.06 1.15-3.15 0-5.82-2.52-6.77-5.52L1.39 15.74C3.37 19.63 7.35 23 12 23z"/></svg>
                                        Continue with Google
                                    </button>
                                </form>
                            ) : (
                                <form onSubmit={onRegisterSubmit} className="flex flex-col gap-4">
                                    <div className="form-group">
                                        <label className="text-xs text-slate-300 block mb-1">Full Name</label>
                                        <input type="text" placeholder="John Doe" value={regName} onChange={(e)=>setRegName(e.target.value)} required className="w-full glass-input text-xs" />
                                    </div>
                                    <div className="form-group">
                                        <label className="text-xs text-slate-300 block mb-1">Email Address</label>
                                        <input type="email" placeholder="john@example.com" value={regEmail} onChange={(e)=>setRegEmail(e.target.value)} required className="w-full glass-input text-xs" />
                                    </div>
                                    <div className="form-group">
                                        <label className="text-xs text-slate-300 block mb-1">Password</label>
                                        <input type="password" placeholder="••••••••" value={regPassword} onChange={(e)=>setRegPassword(e.target.value)} required className="w-full glass-input text-xs" />
                                    </div>
                                    <div className="form-group">
                                        <label className="text-xs text-slate-300 block mb-1">Account Role</label>
                                        <select value={regRole} onChange={(e)=>setRegRole(e.target.value)} className="w-full glass-input text-xs">
                                            <option value="CANDIDATE">Candidate / Student</option>
                                            <option value="RECRUITER">Recruiter</option>
                                            <option value="COLLEGE_ADMIN">College Administrator</option>
                                            <option value="SUPER_ADMIN">Super Administrator</option>
                                        </select>
                                    </div>
                                    <button type="submit" className="w-full py-2.5 rounded-xl bg-violet-600 hover:bg-violet-700 text-white font-bold text-xs transition-all shadow-glow mt-2">
                                        Register
                                    </button>
                                    
                                    <div className="flex items-center my-2">
                                        <div className="flex-1 h-px bg-white/5" />
                                        <span className="text-[10px] text-slate-500 px-3 uppercase tracking-wider font-bold">Or</span>
                                        <div className="flex-1 h-px bg-white/5" />
                                    </div>
                                    
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setAuthModal(false);
                                            setGoogleSSOActive(true);
                                            setSsoStep("email");
                                            setSsoEmail("");
                                            setSsoPassword("");
                                        }}
                                        className="w-full py-2.5 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-white font-bold text-xs transition-all flex items-center justify-center gap-2"
                                    >
                                        <svg className="w-4 h-4" viewBox="0 0 24 24"><path fill="#EA4335" d="M12 5.04c1.66 0 3.2.57 4.38 1.69l3.27-3.27C17.67 1.54 14.98 1 12 1 7.35 1 3.37 3.67 1.39 7.56l3.87 3C6.18 7.56 8.85 5.04 12 5.04z"/><path fill="#4285F4" d="M23.49 12.27c0-.81-.07-1.59-.2-2.36H12v4.51h6.46c-.29 1.48-1.14 2.73-2.42 3.58v2.98h3.9c2.28-2.1 3.55-5.19 3.55-8.71z"/><path fill="#FBBC05" d="M5.26 14.28c-.24-.72-.38-1.49-.38-2.28s.14-1.56.38-2.28L1.39 6.72C.5 8.51 0 10.5 0 12.6s.5 4.09 1.39 5.88l3.87-3.2z"/><path fill="#34A853" d="M12 23c3.24 0 5.97-1.07 7.96-2.91l-3.9-2.98c-1.08.72-2.48 1.15-4.06 1.15-3.15 0-5.82-2.52-6.77-5.52L1.39 15.74C3.37 19.63 7.35 23 12 23z"/></svg>
                                        Continue with Google
                                    </button>
                                </form>
                            )}
                        </div>

                        <div className="mt-4 text-center border-t border-white/5 pt-4">
                            <span onClick={() => setAuthMode(authMode === "login" ? "register" : "login")} className="text-xs text-violet-400 hover:underline cursor-pointer">
                                {authMode === "login" ? "Don't have an account? Sign up" : "Already registered? Sign in"}
                            </span>
                        </div>
                        
                        <button onClick={() => setAuthModal(false)} className="w-full mt-2 py-1.5 rounded-xl text-xs border border-white/5 hover:bg-white/5 transition-all text-slate-400">
                            Close
                        </button>
                    </div>
                </div>
            )}

            {/* ---------------------------------------------------- */}
            {/* GOOGLE SIGN IN OAUTH SCREEN OVERLAY */}
            {/* ---------------------------------------------------- */}
            {googleSSOActive && (
                <div className="fixed inset-0 bg-[#f0f4f9] dark:bg-[#0b0f19] text-[#202124] dark:text-slate-200 z-50 flex items-center justify-center font-sans">
                    <div className="w-full max-w-[450px] bg-white dark:bg-[#161f30] border border-[#dadce0] dark:border-white/5 rounded-lg p-10 shadow-sm flex flex-col justify-between min-h-[500px]">
                        
                        {/* Google Logo */}
                        <div className="flex justify-center mb-6">
                            <svg className="w-16 h-8" viewBox="0 0 24 24">
                                <g transform="translate(0, 0)">
                                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l3.66-2.85z"/>
                                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.85c.87-2.6 3.3-4.53 6.16-4.53z"/>
                                </g>
                            </svg>
                        </div>

                        {ssoStep === "email" && (
                            <div className="flex-1 flex flex-col justify-between">
                                <div>
                                    <h2 className="text-2xl font-normal text-center text-[#202124] dark:text-white mb-1">Sign in</h2>
                                    <p className="text-sm text-center text-[#202124] dark:text-slate-400 mb-8">
                                        to continue to <span className="font-semibold text-violet-600 dark:text-violet-400">PathFinder</span>
                                    </p>

                                    <div className="relative w-full mb-6">
                                        <input
                                            type="email"
                                            value={ssoEmail}
                                            onChange={(e) => setSsoEmail(e.target.value)}
                                            placeholder=" "
                                            className="w-full px-4 py-3.5 border border-[#dadce0] dark:border-slate-700 rounded-md focus:border-2 focus:border-[#1a73e8] focus:px-[15px] focus:py-[13px] outline-none text-base text-[#202124] dark:text-white bg-white dark:bg-[#161f30] transition-all peer"
                                            required
                                        />
                                        <label className="absolute left-4 top-1/2 -translate-y-1/2 bg-white dark:bg-[#161f30] px-1 text-slate-500 text-base pointer-events-none transition-all peer-focus:top-0 peer-focus:text-xs peer-focus:text-[#1a73e8] peer-[:not(:placeholder-shown)]:top-0 peer-[:not(:placeholder-shown)]:text-xs">
                                            Email or phone
                                        </label>
                                    </div>

                                    <button 
                                        type="button"
                                        onClick={() => alert("Demo Mode: Type your Gmail address to sign in.")}
                                        className="text-xs font-semibold text-[#1a73e8] hover:underline mb-6 block text-left"
                                    >
                                        Forgot email?
                                    </button>

                                    <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mb-6">
                                        Not your computer? Use Guest mode to sign in privately. <span className="text-[#1a73e8] hover:underline cursor-pointer">Learn more</span>
                                    </p>
                                </div>

                                <div className="flex justify-between items-center mt-6">
                                    <button 
                                        onClick={() => {
                                            setGoogleSSOActive(false);
                                            setAuthModal(true);
                                        }}
                                        className="px-4 py-2 text-xs font-semibold text-[#1a73e8] hover:bg-blue-500/5 dark:hover:bg-blue-500/10 rounded transition-all"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={() => {
                                            if (!ssoEmail) {
                                                alert("Please enter your email.");
                                                return;
                                            }
                                            if (!ssoEmail.endsWith("@gmail.com")) {
                                                alert("Please enter a valid Gmail address (ending in @gmail.com).");
                                                return;
                                            }
                                            setSsoStep("password");
                                        }}
                                        className="px-6 py-2.5 text-xs font-semibold text-white bg-[#1a73e8] hover:bg-[#1557b0] rounded transition-all shadow-sm"
                                    >
                                        Next
                                    </button>
                                </div>
                            </div>
                        )}

                        {ssoStep === "password" && (
                            <div className="flex-1 flex flex-col justify-between">
                                <div>
                                    <h2 className="text-2xl font-normal text-center text-[#202124] dark:text-white mb-2">Welcome</h2>
                                    
                                    <div className="flex items-center gap-2 px-3 py-1.5 border border-[#dadce0] dark:border-slate-700 rounded-full w-fit mx-auto mb-8 text-xs text-[#3c4043] dark:text-slate-300">
                                        <div className="w-5 h-5 rounded-full bg-[#1a73e8] flex items-center justify-center text-[10px] text-white font-bold">
                                            {ssoEmail.charAt(0).toUpperCase()}
                                        </div>
                                        <span>{ssoEmail}</span>
                                    </div>

                                    <div className="relative w-full mb-4">
                                        <input
                                            type={showSsoPassword ? "text" : "password"}
                                            value={ssoPassword}
                                            onChange={(e) => setSsoPassword(e.target.value)}
                                            placeholder=" "
                                            className="w-full px-4 py-3.5 border border-[#dadce0] dark:border-slate-700 rounded-md focus:border-2 focus:border-[#1a73e8] focus:px-[15px] focus:py-[13px] outline-none text-base text-[#202124] dark:text-white bg-white dark:bg-[#161f30] transition-all peer"
                                            required
                                        />
                                        <label className="absolute left-4 top-1/2 -translate-y-1/2 bg-white dark:bg-[#161f30] px-1 text-slate-500 text-base pointer-events-none transition-all peer-focus:top-0 peer-focus:text-xs peer-focus:text-[#1a73e8] peer-[:not(:placeholder-shown)]:top-0 peer-[:not(:placeholder-shown)]:text-xs">
                                            Enter your password
                                        </label>
                                    </div>

                                    <div className="flex items-center gap-2 mb-8">
                                        <input
                                            type="checkbox"
                                            id="sso-show-pass"
                                            checked={showSsoPassword}
                                            onChange={(e) => setShowSsoPassword(e.target.checked)}
                                            className="cursor-pointer rounded border-[#dadce0]"
                                        />
                                        <label htmlFor="sso-show-pass" className="text-xs text-slate-600 dark:text-slate-400 cursor-pointer">
                                            Show password
                                        </label>
                                    </div>
                                </div>

                                <div className="flex justify-between items-center mt-6">
                                    <button 
                                        onClick={() => setSsoStep("email")}
                                        className="px-4 py-2 text-xs font-semibold text-[#1a73e8] hover:bg-blue-500/5 dark:hover:bg-blue-500/10 rounded transition-all"
                                    >
                                        Back
                                    </button>
                                    <button
                                        onClick={() => {
                                            if (!ssoPassword) {
                                                alert("Please enter your password.");
                                                return;
                                            }
                                            setSsoStep("loading");
                                            setTimeout(() => {
                                                const fallbackName = ssoEmail.split("@")[0].split(/[._-]/).map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
                                                loginWithGoogle(fallbackName, ssoEmail);
                                                setGoogleSSOActive(false);
                                                setAuthModal(false);
                                            }, 1500);
                                        }}
                                        className="px-6 py-2.5 text-xs font-semibold text-white bg-[#1a73e8] hover:bg-[#1557b0] rounded transition-all shadow-sm"
                                    >
                                        Next
                                    </button>
                                </div>
                            </div>
                        )}

                        {ssoStep === "loading" && (
                            <div className="flex-grow flex flex-col items-center justify-center gap-4">
                                <div className="w-10 h-10 border-4 border-[#1a73e8]/25 border-t-[#1a73e8] rounded-full animate-spin" />
                                <span className="text-xs text-slate-500 dark:text-slate-400">One moment please...</span>
                            </div>
                        )}

                    </div>
                </div>
            )}

            {/* ---------------------------------------------------- */}
            {/* STRIPE CHECKOUT MODAL OVERLAY */}
            {/* ---------------------------------------------------- */}
            {stripeModalOpen && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="glass-panel modal-panel p-6 w-full max-w-sm text-left">
                        <div className="flex items-center gap-2 mb-3">
                            <DollarSign className="text-emerald-400" size={24} />
                            <h3 className="text-lg font-bold text-white">Stripe Mock Billing Gateway</h3>
                        </div>
                        <p className="text-xs text-slate-400 mb-6">Upgrade to **{activeCheckoutPlan}** Pricing Plan. Stripe billing session initialized in sandbox test-mode.</p>

                        <div className="flex flex-col gap-4 mb-6">
                            <div className="p-3.5 rounded-xl bg-white/5 border border-white/5">
                                <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Product Tier</span>
                                <h4 className="font-extrabold text-white text-base mt-0.5">{activeCheckoutPlan === "PRO" ? "Career Pro Subscription" : "Enterprise Annual License"}</h4>
                                <span className="text-xs text-violet-400 font-bold block mt-1">{activeCheckoutPlan === "PRO" ? "₹1,199 / month" : "Custom Institutional Quote"}</span>
                            </div>
                            
                            <div className="form-group">
                                <label className="text-xs text-slate-300 block mb-1">Card Credentials</label>
                                <input type="text" readOnly value="4242  4242  4242  4242" className="w-full glass-input text-xs text-slate-400" />
                            </div>
                        </div>

                        <div className="flex gap-3">
                            <button onClick={() => setStripeModalOpen(false)} className="flex-1 py-2 rounded-xl text-xs font-bold border border-white/10 hover:bg-white/5 transition-all text-slate-300">
                                Cancel
                            </button>
                            <button onClick={completeMockSubscription} className="flex-1 py-2 rounded-xl text-xs font-bold bg-violet-600 hover:bg-violet-700 text-white transition-all shadow-glow">
                                Pay & Activate
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* ---------------------------------------------------- */}
            {/* QUIZ SETUP CONFIRM MODAL */}
            {/* ---------------------------------------------------- */}
            {quizModalOpen && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="glass-panel modal-panel p-6 w-full max-w-sm text-left">
                        <h3 className="text-lg font-bold text-white mb-2">Launch Skill Challenge</h3>
                        <p className="text-xs text-slate-400 mb-6">Configure your details to load level-appropriate questions pool.</p>

                        <form onSubmit={onLaunchQuiz} className="flex flex-col gap-4">
                            <div className="form-group">
                                <label className="text-xs text-slate-300 block mb-1">Full Name</label>
                                <input type="text" placeholder="John Doe" value={quizSetupName} onChange={(e)=>setQuizSetupName(e.target.value)} required className="w-full glass-input text-xs" />
                            </div>
                            <div className="form-group">
                                <label className="text-xs font-semibold text-slate-200 block mb-1">Degree Path</label>
                                <select value={quizSetupDegree} onChange={(e)=>setQuizSetupDegree(e.target.value)} className="w-full glass-input text-xs">
                                    <option value="B.S.">Bachelor of Science (B.S. / B.Tech)</option>
                                    <option value="M.S.">Master of Science (M.S. / M.Tech)</option>
                                    <option value="B.A.">Bachelor of Arts (B.A.)</option>
                                    <option value="M.A.">Master of Arts (M.A.)</option>
                                    <option value="MBA">Master of Business Admin (MBA)</option>
                                    <option value="BBA">Bachelor of Business Admin (BBA)</option>
                                    <option value="B.Com">Bachelor of Commerce (B.Com)</option>
                                    <option value="M.Com">Master of Commerce (M.Com)</option>
                                    <option value="Ph.D.">Doctor of Philosophy (Ph.D.)</option>
                                    <option value="Diploma">Technical Diploma</option>
                                </select>
                            </div>
                            <div className="form-group">
                                <label className="text-xs font-semibold text-slate-200 block mb-1">Field of Study / Major</label>
                                <select value={quizSetupMajor} onChange={(e)=>setQuizSetupMajor(e.target.value)} className="w-full glass-input text-xs">
                                    <option value="Computer Science">Computer Science / IT / Software Eng</option>
                                    <option value="Data Science & AI">Data Science / Artificial Intelligence</option>
                                    <option value="Electrical & ECE">Electrical / Electronics (ECE) Eng</option>
                                    <option value="Mechanical Eng">Mechanical Engineering</option>
                                    <option value="Civil Eng">Civil Engineering</option>
                                    <option value="Biotech">Biotech / Bioinformatics</option>
                                    <option value="Business Admin">Business Admin / Finance / Marketing</option>
                                    <option value="Humanities">Humanities / Social Sciences</option>
                                    <option value="Natural Sciences">Physics / Chemistry / Mathematics</option>
                                </select>
                            </div>
                            <div className="form-group">
                                <label className="text-xs text-slate-300 block mb-1">Preferred Sector</label>
                                <select value={quizSetupSector} onChange={(e)=>setQuizSetupSector(e.target.value)} className="w-full glass-input text-xs">
                                    <option value="both">Both (Private & Government)</option>
                                    <option value="private">Private Sector Corporate</option>
                                    <option value="government">Government Exams (UPSC, Civil Services)</option>
                                </select>
                            </div>

                            <div className="flex gap-3 mt-4">
                                <button type="button" onClick={() => setQuizModalOpen(false)} className="flex-1 py-2.5 rounded-xl text-xs font-bold border border-white/10 hover:bg-white/5 transition-all text-slate-300">
                                    Cancel
                                </button>
                                <button type="submit" className="flex-1 py-2.5 rounded-xl text-xs font-bold bg-violet-600 hover:bg-violet-700 text-white transition-all shadow-glow">
                                    Start Quiz
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
