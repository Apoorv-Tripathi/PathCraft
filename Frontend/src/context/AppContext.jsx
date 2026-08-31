import React, { createContext, useContext, useState, useEffect } from 'react';
import { authApi, profileApi, learningPathApi } from '../api/client';

const AppContext = createContext();

const initialRoadmap = [
  {
    id: 'js-basics',
    title: 'JavaScript Fundamentals & Async Execution',
    category: 'Core Language',
    status: 'completed',
    estimatedHours: 20,
    completedDate: 'Aug 10',
    description: 'ES6+ specifications, scope & lexical closures, execution contexts, and call stack fundamentals.',
    prerequisites: ['Basic Programming Logic'],
    topics: ['Prototypes & Inheritance', 'Closures & Scope Chain', 'Event Loop Intro', 'ES6 Module System'],
    quizScore: 92
  },
  {
    id: 'nodejs-core',
    title: 'Node.js Core Architecture & Streams',
    category: 'Runtime Environment',
    status: 'completed',
    estimatedHours: 25,
    completedDate: 'Aug 15',
    description: 'Libuv event loop, non-blocking I/O, Buffer manipulation, Stream pipelines, and event emitters.',
    prerequisites: ['JavaScript Fundamentals'],
    topics: ['Libuv Threadpool', 'Readable/Writable Streams', 'File System Operations', 'Cluster & Child Process'],
    quizScore: 84
  },
  {
    id: 'rest-apis',
    title: 'Production REST API Architecture',
    category: 'Web Services',
    status: 'current',
    estimatedHours: 35,
    progress: 45,
    description: 'HTTP/1.1 & HTTP/2 standards, Express framework, middleware pipelines, idempotent routing, and validation.',
    prerequisites: ['Node.js Core Architecture'],
    topics: ['RESTful Resource Design', 'Middleware Error Handlers', 'Zod/Joi Request Validation', 'Rate Limiting & CORS'],
    whyRecommended: 'Core foundation for backend microservices and API gateways.'
  },
  {
    id: 'authentication',
    title: 'Backend Authentication & Security',
    category: 'Security & Auth',
    status: 'upcoming',
    estimatedHours: 30,
    description: 'Stateless JWT issuance, OAuth 2.0 / OIDC protocols, Bcrypt password hashing, session store caching, and RBAC.',
    prerequisites: ['REST API Architecture'],
    topics: ['JWT Token Rotation & Refresh', 'OAuth 2.0 Grant Flows', 'CSRF & XSS Defenses', 'Role-Based Access Control'],
    whyRecommended: 'Essential for securing enterprise endpoints and user accounts.'
  },
  {
    id: 'docker',
    title: 'Containerization & Microservices with Docker',
    category: 'DevOps & Deployment',
    status: 'upcoming',
    estimatedHours: 25,
    description: 'Container lifecycles, multi-stage Dockerfiles, Docker Compose networking, persistent volume mounts, and health checks.',
    prerequisites: ['REST API Architecture'],
    topics: ['Multi-stage Builds', 'Docker Compose Orchestration', 'Environment Isolation', 'Container Security'],
    whyRecommended: 'Industry standard for modern containerized cloud deployments.'
  },
  {
    id: 'capstone-project',
    title: 'Production Backend Capstone: Distributed Microservice',
    category: 'Real-world Project',
    status: 'locked',
    estimatedHours: 50,
    description: 'Architect, test, and deploy a high-concurrency microservice with Redis caching, PostgreSQL clustering, and Docker CI/CD.',
    prerequisites: ['Authentication', 'Docker', 'REST API Architecture'],
    topics: ['Database Indexing & Pooling', 'Redis Pub/Sub & Caching', 'Automated Integration Testing', 'CI/CD GitHub Actions'],
    whyRecommended: 'The ultimate portfolio piece demonstrating senior-level backend readiness.'
  }
];

const adaptiveRoadmap = [
  {
    id: 'js-basics',
    title: 'JavaScript Fundamentals & Async Execution',
    category: 'Core Language',
    status: 'completed',
    estimatedHours: 20,
    completedDate: 'Aug 10',
    description: 'ES6+ specifications, scope & lexical closures, execution contexts, and call stack fundamentals.',
    topics: ['Prototypes & Inheritance', 'Closures & Scope Chain', 'Event Loop Intro'],
    quizScore: 92
  },
  {
    id: 'nodejs-core',
    title: 'Node.js Core Architecture & Streams',
    category: 'Runtime Environment',
    status: 'completed',
    estimatedHours: 25,
    completedDate: 'Aug 15',
    description: 'Libuv event loop, non-blocking I/O, Buffer manipulation, Stream pipelines, and event emitters.',
    topics: ['Libuv Threadpool', 'Readable/Writable Streams', 'File System Operations'],
    quizScore: 84
  },
  {
    id: 'async-js-remedial',
    title: 'Async JavaScript Deep Dive (Remediation)',
    category: 'Diagnostic Remediation',
    status: 'current',
    isRemedial: true,
    estimatedHours: 10,
    progress: 25,
    description: 'Deep dive into Promise lifecycle, microtask vs macrotask execution order, unhandled rejections, and async/await concurrency patterns.',
    prerequisites: ['Diagnostic Assessment Gap #3'],
    topics: ['Microtask vs Macrotask Queue', 'Promise.all vs Promise.allSettled', 'Async Error Bubbling', 'Event Loop Starvation'],
    whyRecommended: 'Auto-injected because diagnostic assessment identified a 35% gap in Promise error handling and Event Loop scheduling.'
  },
  {
    id: 'async-practice',
    title: 'Hands-on Concurrency & Promises Lab',
    category: 'Remedial Practice Session',
    status: 'upcoming',
    isRemedial: true,
    estimatedHours: 8,
    description: 'Refactor blocking legacy callback code into robust, concurrency-safe Promise chains with structured try/catch fallbacks.',
    topics: ['Callback Hell Refactoring', 'Custom Retry Middleware', 'Rate-limited Batching Lab'],
    whyRecommended: 'Practical reinforcement required before unblocking REST API development.'
  },
  {
    id: 'async-retest',
    title: 'Async Mastery Verification Quiz',
    category: 'Remedial Verification',
    status: 'upcoming',
    isRemedial: true,
    estimatedHours: 2,
    description: 'Targeted 5-question verification exam to validate conceptual mastery before resuming the standard curriculum.',
    topics: ['5 Multi-choice Questions', 'Senior-level Event Loop Scenarios'],
    whyRecommended: 'Required milestone gate to advance to REST API Development.'
  },
  {
    id: 'rest-apis',
    title: 'Production REST API Architecture',
    category: 'Web Services',
    status: 'upcoming',
    estimatedHours: 35,
    description: 'HTTP/1.1 & HTTP/2 standards, Express framework, middleware pipelines, idempotent routing, and validation.',
    topics: ['RESTful Resource Design', 'Middleware Error Handlers', 'Zod/Joi Request Validation'],
    whyRecommended: 'Resumes automatically once Async Mastery Verification is passed.'
  },
  {
    id: 'authentication',
    title: 'Backend Authentication & Security',
    category: 'Security & Auth',
    status: 'upcoming',
    estimatedHours: 30,
    description: 'Stateless JWT issuance, OAuth 2.0 / OIDC protocols, Bcrypt password hashing, session store caching, and RBAC.',
    topics: ['JWT Token Rotation & Refresh', 'OAuth 2.0 Grant Flows', 'CSRF & XSS Defenses'],
    whyRecommended: 'Essential for securing enterprise endpoints and user accounts.'
  },
  {
    id: 'docker',
    title: 'Containerization & Microservices with Docker',
    category: 'DevOps & Deployment',
    status: 'upcoming',
    estimatedHours: 25,
    description: 'Container lifecycles, multi-stage Dockerfiles, Docker Compose networking, persistent volume mounts, and health checks.',
    topics: ['Multi-stage Builds', 'Docker Compose Orchestration', 'Environment Isolation'],
    whyRecommended: 'Industry standard for modern containerized cloud deployments.'
  },
  {
    id: 'capstone-project',
    title: 'Production Backend Capstone: Distributed Microservice',
    category: 'Real-world Project',
    status: 'locked',
    estimatedHours: 50,
    description: 'Architect, test, and deploy a high-concurrency microservice with Redis caching, PostgreSQL clustering, and Docker CI/CD.',
    topics: ['Database Indexing & Pooling', 'Redis Pub/Sub & Caching', 'Automated Integration Testing'],
    whyRecommended: 'The ultimate portfolio piece demonstrating senior-level backend readiness.'
  }
];

export const AppProvider = ({ children }) => {
  const [user, setUser] = useState({
    name: '',
    email: '',
    goal: 'Backend Developer',
    timeline: '4 months',
    availableHours: 12,
    weeklyLoggedHours: 8.5,
    learningStyle: 'Project-based with diagnostic quizzes',
    readiness: 68,
    isLoggedIn: false
  });

  const [authLoading, setAuthLoading] = useState(true);
  const [skills, setSkills] = useState([
    { name: 'JavaScript Core', proficiency: 90, targetBenchmark: 85, status: 'Mastered', domain: 'Language' },
    { name: 'Node.js Architecture', proficiency: 60, targetBenchmark: 80, status: 'In Progress', domain: 'Runtime' },
    { name: 'Async JavaScript & Event Loop', proficiency: 35, targetBenchmark: 85, status: 'Critical Gap', domain: 'Concurrency' },
    { name: 'REST APIs & Middleware', proficiency: 40, targetBenchmark: 80, status: 'In Progress', domain: 'Web Services' },
    { name: 'Docker & Containers', proficiency: 15, targetBenchmark: 70, status: 'Upcoming', domain: 'DevOps' }
  ]);

  const [isAdaptiveMode, setIsAdaptiveMode] = useState(false);
  const [currentRoadmap, setCurrentRoadmap] = useState(initialRoadmap);
  const [assessmentResult, setAssessmentResult] = useState(null);
  const [backendConnected, setBackendConnected] = useState(false);

  // Check and hydrate from Backend on mount
  useEffect(() => {
    async function hydrateUser() {
      const token = localStorage.getItem('pathcraft_token');
      if (!token) {
        setAuthLoading(false);
        return;
      }

      try {
        const meRes = await authApi.getMe();
        if (meRes?.success && meRes?.data) {
          const u = meRes.data;
          setUser(prev => ({
            ...prev,
            name: u.name,
            email: u.email,
            isLoggedIn: true,
          }));
          setBackendConnected(true);

          // Fetch profile
          try {
            const profRes = await profileApi.getProfile();
            if (profRes?.data) {
              const p = profRes.data;
              setUser(prev => ({
                ...prev,
                goal: p.careerGoal?.title || prev.goal,
                timeline: p.timeline || prev.timeline,
                availableHours: p.weeklyHoursCommitment || prev.availableHours,
                learningStyle: p.learningStyle || prev.learningStyle,
              }));
            }
          } catch (e) {
            // Profile pending setup
          }

          // Fetch learning path
          try {
            const pathRes = await learningPathApi.getMyPath();
            if (pathRes?.data?.modules?.length > 0) {
              const formatted = pathRes.data.modules.map(m => ({
                id: m._id,
                title: m.title,
                category: m.category,
                status: m.status,
                estimatedHours: m.estimatedHours,
                progress: m.progress,
                quizScore: m.quizScore,
                completedDate: m.completedDate,
                description: m.description,
                topics: m.topics,
                prerequisites: m.prerequisites,
                whyRecommended: m.whyRecommended,
                isRemedial: m.isRemedial,
              }));
              setCurrentRoadmap(formatted);
              setIsAdaptiveMode(pathRes.data.isAdaptive || false);
              if (pathRes.data.readinessScore) {
                setUser(prev => ({ ...prev, readiness: pathRes.data.readinessScore }));
              }
            }
          } catch (e) {
            // Path pending
          }
        }
      } catch (err) {
        localStorage.removeItem('pathcraft_token');
        setUser(prev => ({ ...prev, isLoggedIn: false }));
        setBackendConnected(false);
      } finally {
        setAuthLoading(false);
      }
    }
    hydrateUser();
  }, []);

  const logout = () => {
    localStorage.removeItem('pathcraft_token');
    setUser({
      name: '',
      email: '',
      goal: 'Backend Developer',
      timeline: '4 months',
      availableHours: 12,
      weeklyLoggedHours: 8.5,
      learningStyle: 'Project-based with diagnostic quizzes',
      readiness: 0,
      isLoggedIn: false
    });
    setBackendConnected(false);
  };

  const toggleAdaptiveRoadmap = async (enable = null) => {
    const newState = enable !== null ? enable : !isAdaptiveMode;
    setIsAdaptiveMode(newState);

    if (backendConnected && localStorage.getItem('pathcraft_token')) {
      try {
        const pathRes = await learningPathApi.regenerate(null, newState);
        if (pathRes?.data?.modules?.length > 0) {
          const formatted = pathRes.data.modules.map(m => ({
            id: m._id,
            title: m.title,
            category: m.category,
            status: m.status,
            estimatedHours: m.estimatedHours,
            progress: m.progress,
            quizScore: m.quizScore,
            completedDate: m.completedDate,
            description: m.description,
            topics: m.topics,
            prerequisites: m.prerequisites,
            whyRecommended: m.whyRecommended,
            isRemedial: m.isRemedial,
          }));
          setCurrentRoadmap(formatted);
          return;
        }
      } catch (e) {
        // Local fallback
      }
    }

    if (newState) {
      setCurrentRoadmap(adaptiveRoadmap);
    } else {
      setCurrentRoadmap(initialRoadmap);
    }
  };

  const updateProfile = async (updatedData) => {
    setUser((prev) => ({ ...prev, ...updatedData }));
    try {
      if (localStorage.getItem('pathcraft_token')) {
        await profileApi.updateProfile({
          timeline: updatedData.timeline,
          weeklyHoursCommitment: updatedData.availableHours,
          learningStyle: updatedData.learningStyle,
        });
      }
    } catch (err) {
      console.info('Profile updated locally');
    }
  };

  return (
    <AppContext.Provider
      value={{
        user,
        setUser,
        authLoading,
        logout,
        skills,
        setSkills,
        isAdaptiveMode,
        toggleAdaptiveRoadmap,
        currentRoadmap,
        assessmentResult,
        setAssessmentResult,
        updateProfile,
        backendConnected
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);
