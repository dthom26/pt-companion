import axios from "axios";

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add auth token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Auth endpoints
export const authAPI = {
  loginTrainer: (credentials) =>
    api.post("/auth/login", { ...credentials, role: "trainer" }),
  loginClient: (credentials) =>
    api.post("/auth/login", { ...credentials, role: "client" }),
  registerTrainer: (data) => api.post("/auth/trainer/register", data),
  registerClient: (data) => api.post("/auth/client/register", data),
  getMe: () => api.get("/auth/me"),
  logout: () => api.post("/auth/logout"),
};

// Trainer endpoints
export const trainerAPI = {
  getClients: () => api.get("/trainer/clients"),
  getClient: (clientId) => api.get(`/trainer/clients/${clientId}`),
  updateClient: (clientId, data) =>
    api.put(`/trainer/clients/${clientId}`, data),
  removeClient: (clientId) => api.delete(`/trainer/clients/${clientId}`),
};

// Program endpoints
export const programAPI = {
  create: (data) => api.post("/programs", data),
  getAll: () => api.get("/programs"),
  getById: (id) => api.get(`/programs/${id}`),
  update: (id, data) => api.put(`/programs/${id}`, data),
  delete: (id) => api.delete(`/programs/${id}`),
  getClientPrograms: (clientId) => api.get(`/programs/client/${clientId}`),
  getMyActiveProgram: () => api.get("/programs/my/active"),
};

// Workout endpoints
export const workoutAPI = {
  create: (data) => api.post("/workouts", data),
  getAll: () => api.get("/workouts"),
  getById: (id) => api.get(`/workouts/${id}`),
  update: (id, data) => api.put(`/workouts/${id}`, data),
  delete: (id) => api.delete(`/workouts/${id}`),
};

// Session endpoints
export const sessionAPI = {
  start: (data) => api.post("/sessions", data),
  getMySessions: (params) => api.get("/sessions", { params }),
  getById: (id) => api.get(`/sessions/${id}`),
  updateExercise: (sessionId, exerciseId, data) =>
    api.put(`/sessions/${sessionId}/exercises/${exerciseId}`, data),
  complete: (sessionId, data) =>
    api.put(`/sessions/${sessionId}/complete`, data),
  getClientSessions: (clientId, params) =>
    api.get(`/sessions/client/${clientId}`, { params }),
};

// Message endpoints
export const messageAPI = {
  send: (data) => api.post("/messages", data),
  getConversations: () => api.get("/messages/conversations"),
  getConversation: (userId, params) =>
    api.get(`/messages/conversation/${userId}`, { params }),
  getUnread: () => api.get("/messages/unread"),
  markAsRead: (messageId) => api.put(`/messages/${messageId}/read`),
  markConversationAsRead: (userId) =>
    api.put(`/messages/conversation/${userId}/read`),
};

export default api;
