const API_BASE = '';

const API = {
  async request(method, endpoint, body = null, isFormData = false) {
    const token = localStorage.getItem('token');
    const headers = {};

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const options = {
      method,
      headers: isFormData ? {} : { 'Content-Type': 'application/json', ...headers },
    };

    if (isFormData) {
      options.headers = headers;
      options.body = body;
    } else if (body) {
      options.body = JSON.stringify(body);
    }

    const response = await fetch(`${API_BASE}${endpoint}`, options);

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.message || `HTTP ${response.status}`);
    }

    if (response.status === 204) {
      return null;
    }

    return response.json();
  },

  /**
   * Authentication endpoints
   */
  auth: {
    async register(email, password) {
      return API.request('POST', '/auth/register', { email, password });
    },

    async login(email, password) {
      return API.request('POST', '/auth/login', { email, password });
    },
  },

  /**
   * Issues endpoints
   */
  issues: {
    async list() {
      return API.request('GET', '/issues');
    },

    async create(formData) {
      return API.request('POST', '/issues', formData, true);
    },

    async getById(id) {
      return API.request('GET', `/issues/${id}`);
    },

    async update(id, data) {
      return API.request('PATCH', `/issues/${id}`, data);
    },

    async delete(id) {
      return API.request('DELETE', `/issues/${id}`);
    },
  },

  /**
   * Suggestions endpoints
   */
  suggestions: {
    async list() {
      return API.request('GET', '/suggestions');
    },

    async create(formData) {
      return API.request('POST', '/suggestions', formData, true);
    },

    async getById(id) {
      return API.request('GET', `/suggestions/${id}`);
    },

    async update(id, data) {
      return API.request('PATCH', `/suggestions/${id}`, data);
    },

    async delete(id) {
      return API.request('DELETE', `/suggestions/${id}`);
    },
  },

  /**
   * Comments endpoints
   */
  comments: {
    async listByIssue(issueId) {
      return API.request('GET', `/comments?issueId=${issueId}`);
    },

    async listBySuggestion(suggestionId) {
      return API.request('GET', `/comments?suggestionId=${suggestionId}`);
    },

    async create(content, issueId, suggestionId) {
      return API.request('POST', '/comments', {
        content,
        issueId,
        suggestionId,
      });
    },

    async delete(id) {
      return API.request('DELETE', `/comments/${id}`);
    },
  },

  /**
   * Users endpoints
   */
  users: {
    async getProfile() {
      return API.request('GET', '/users/profile');
    },

    async getReports(userId) {
      return API.request('GET', `/users/${userId}/reports`);
    },
  },

  /**
   * Uploads endpoints
   */
  uploads: {
    async upload(file) {
      const formData = new FormData();
      formData.append('file', file);
      return API.request('POST', '/uploads', formData, true);
    },
  },

  /**
   * Admin endpoints
   */
  admin: {
    async getAllIssues() {
      return API.request('GET', '/admin/issues');
    },

    async getAllSuggestions() {
      return API.request('GET', '/admin/suggestions');
    },

    async provideFeedbackOnIssue(issueId, data) {
      return API.request('PATCH', `/admin/issues/${issueId}/feedback`, data);
    },

    async provideFeedbackOnSuggestion(suggestionId, data) {
      return API.request(
        'PATCH',
        `/admin/suggestions/${suggestionId}/feedback`,
        data,
      );
    },

    async getReportSummary() {
      return API.request('GET', '/admin/reports/summary');
    },

    async deleteIssue(issueId) {
      return API.request('DELETE', `/admin/issues/${issueId}`);
    },

    async deleteSuggestion(suggestionId) {
      return API.request('DELETE', `/admin/suggestions/${suggestionId}`);
    },
  },
};
