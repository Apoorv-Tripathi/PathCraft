const API_BASE_URL = (
  import.meta.env.VITE_API_URL || 
  import.meta.env.VITE_API_BASE_URL || 
  'https://pathcraft-pxfb.onrender.com/api'
).replace(/\/$/, '');



/**
 * Standard API request handler with JWT token support and error propagation
 */
export async function apiRequest(endpoint, { method = 'GET', body, token, headers = {} } = {}) {
  const authToken = token || localStorage.getItem('pathcraft_token');
  
  const requestHeaders = {
    'Content-Type': 'application/json',
    ...headers,
  };

  if (authToken) {
    requestHeaders['Authorization'] = `Bearer ${authToken}`;
  }

  const config = {
    method,
    headers: requestHeaders,
    body: body ? JSON.stringify(body) : undefined,
  };

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
    const data = await response.json();

    if (!response.ok) {
      const error = new Error(data.message || 'Network request failed');
      error.status = response.status;
      error.data = data;
      throw error;
    }

    return data;
  } catch (err) {
    // Only log if not a standard validation or auth error
    if (err.status !== 400 && err.status !== 401) {
      console.warn(`[PathCraft API] ${method} ${endpoint}:`, err.message);
    }
    throw err;
  }
}

// ── Auth APIs (Phase 2) ──────────────────────────
export const authApi = {
  register: (name, email, password) => 
    apiRequest('/auth/register', { method: 'POST', body: { name, email, password } }),
  login: (email, password) => 
    apiRequest('/auth/login', { method: 'POST', body: { email, password } }),
  getMe: () => 
    apiRequest('/auth/me'),
};

// ── Profile APIs (Phase 3) ───────────────────────
export const profileApi = {
  getProfile: () => 
    apiRequest('/profile'),
  updateProfile: (profileData) => 
    apiRequest('/profile', { method: 'PUT', body: profileData }),
};

// ── Skills & Goals APIs (Phase 4) ─────────────────
export const metaApi = {
  getSkills: () => 
    apiRequest('/skills'),
  getCareerGoals: () => 
    apiRequest('/career-goals'),
  getCareerGoalById: (id) => 
    apiRequest(`/career-goals/${id}`),
};

// ── Assessment APIs (Phase 5) ─────────────────────
export const assessmentApi = {
  getAssessments: (skillId) => 
    apiRequest(skillId ? `/assessment?skill=${skillId}` : '/assessment'),
  getAssessmentById: (id) => 
    apiRequest(`/assessment/${id}`),
  submitAssessment: (id, answers) => 
    apiRequest(`/assessment/${id}/submit`, { method: 'POST', body: { answers } }),
  getMyResults: () => 
    apiRequest('/assessment/results/me'),
};

// ── Skill Gap APIs (Phase 6) ──────────────────────
export const skillGapApi = {
  getMySkillGap: () => 
    apiRequest('/skill-gap'),
  getSkillGapForGoal: (goalId) => 
    apiRequest(`/skill-gap/${goalId}`),
};

// ── Learning Path & Progress APIs (Phases 7, 8, 9, 10) ──
export const learningPathApi = {
  getMyPath: () => 
    apiRequest('/learning-path'),
  getRecommendation: () => 
    apiRequest('/learning-path/recommendation'),
  regenerate: (careerGoalId, forceAdaptive = false) => 
    apiRequest('/learning-path/generate', { method: 'POST', body: { careerGoalId, forceAdaptive } }),
  updateProgress: (moduleId, { progress, status, quizScore }) => 
    apiRequest(`/learning-path/modules/${moduleId}/progress`, { method: 'PUT', body: { progress, status, quizScore } }),
};

// ── AI Coach APIs (Phase 11) ───────────────────────
export const aiApi = {
  askCoach: (message) => 
    apiRequest('/ai/coach', { method: 'POST', body: { message } }),
};
