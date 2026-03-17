/*
  CampusSignal - Vanilla dashboard UI
  Connects to backend via REST endpoints.
*/

const state = {
  token: localStorage.getItem('campusToken') || null,
  user: JSON.parse(localStorage.getItem('campusUser') || 'null'),
  activity: [],
};

const dom = {
  authSignedOut: document.getElementById('authSignedOut'),
  authSignedIn: document.getElementById('authSignedIn'),
  meLabel: document.getElementById('meLabel'),
  loginEmail: document.getElementById('loginEmail'),
  loginPassword: document.getElementById('loginPassword'),
  loginBtn: document.getElementById('loginBtn'),
  registerBtn: document.getElementById('registerBtn'),
  logoutBtn: document.getElementById('logoutBtn'),

  reportForm: document.getElementById('reportForm'),
  issueCategory: document.getElementById('issueCategory'),
  issueBuilding: document.getElementById('issueBuilding'),
  issueRoom: document.getElementById('issueRoom'),
  issueDescription: document.getElementById('issueDescription'),
  issueImage: document.getElementById('issueImage'),
  reportStatus: document.getElementById('reportStatus'),

  suggestionForm: document.getElementById('suggestionForm'),
  suggestionText: document.getElementById('suggestionText'),
  suggestionImage: document.getElementById('suggestionImage'),
  suggestionStatus: document.getElementById('suggestionStatus'),

  issuesList: document.getElementById('issuesList'),
  myReportsList: document.getElementById('myReportsList'),
  activityLog: document.getElementById('activityLog'),
  refreshIssues: document.getElementById('refreshIssues'),
  suggestionsList: document.getElementById('suggestionsList'),
  refreshSuggestions: document.getElementById('refreshSuggestions'),
};

function apiFetch(path, options = {}) {
  const headers = { ...(options.headers || {}) };
  if (state.token) {
    headers.Authorization = `Bearer ${state.token}`;
  }

  // When sending FormData (multipart), let the browser set the Content-Type header
  const isFormData = options.body instanceof FormData;
  if (!isFormData) {
    headers['Content-Type'] = headers['Content-Type'] || 'application/json';
  }

  return fetch(path, { ...options, headers })
    .then(async res => {
      const isJson = res.headers.get('content-type')?.includes('application/json');
      const data = isJson ? await res.json() : null;
      if (!res.ok) {
        throw new Error(data?.message || data?.error || res.statusText);
      }
      return data;
    })
    .catch(err => {
      console.warn('API error', err);
      throw err;
    });
}

function setToken(token, user) {
  state.token = token;
  state.user = user;
  localStorage.setItem('campusToken', token);
  localStorage.setItem('campusUser', JSON.stringify(user));
  renderAuthState();
}

function clearToken() {
  state.token = null;
  state.user = null;
  localStorage.removeItem('campusToken');
  localStorage.removeItem('campusUser');
  renderAuthState();
}

function renderAuthState() {
  const signedIn = !!state.token && !!state.user;
  dom.authSignedOut.classList.toggle('hidden', signedIn);
  dom.authSignedIn.classList.toggle('hidden', !signedIn);
  dom.meLabel.textContent = signedIn ? `Signed in as ${state.user.email}` : '';
}

function logActivity(message) {
  state.activity.unshift({ message, time: new Date() });
  if (state.activity.length > 30) state.activity.length = 30;
  renderActivity();
}

function renderActivity() {
  dom.activityLog.innerHTML = '';
  if (!state.activity.length) {
    dom.activityLog.textContent = 'No activity yet.';
    return;
  }

  for (const item of state.activity) {
    const el = document.createElement('div');
    el.className = 'comment';
    el.innerHTML = `<small>${item.time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</small><div>${item.message}</div>`;
    dom.activityLog.appendChild(el);
  }
}

function showStatus(message, isError, type = 'report') {
  const statusEl = type === 'suggestion' ? dom.suggestionStatus : dom.reportStatus;
  statusEl.textContent = message;
  statusEl.style.color = isError ? 'var(--danger)' : 'var(--success)';
  if (!message) return;
  setTimeout(() => {
    statusEl.textContent = '';
  }, 4000);
}

async function submitReport(event) {
  event.preventDefault();
  if (!state.token) {
    showStatus('Log in first to submit reports', true);
    return;
  }

  const payload = {
    category: dom.issueCategory.value.trim(),
    building: dom.issueBuilding.value.trim(),
    room: dom.issueRoom.value.trim(),
    description: dom.issueDescription.value.trim(),
    imageUrl: '',
  };

  const file = dom.issueImage.files?.[0];
  if (file) {
    try {
      const form = new FormData();
      form.append('file', file);
      const upload = await fetch('/uploads', {
        method: 'POST',
        body: form,
        headers: state.token ? { Authorization: `Bearer ${state.token}` } : {},
      });
      const uploadData = await upload.json();
      payload.imageUrl = uploadData.url || '';
    } catch (err) {
      console.warn('upload failed', err);
    }
  }

  try {
    await apiFetch('/issues', { method: 'POST', body: JSON.stringify(payload) });
    showStatus('Issue submitted!', false);
    logActivity('Submitted a new issue');
    dom.reportForm.reset();
    loadIssues();
  } catch (err) {
    showStatus(err.message || 'Failed to submit issue', true);
  }
}

async function submitSuggestion(event) {
  event.preventDefault();
  if (!state.token) {
    showStatus('Log in first to submit suggestions', true, 'suggestion');
    return;
  }

  const description = dom.suggestionText.value.trim();
  if (!description) {
    showStatus('Suggestion cannot be empty', true, 'suggestion');
    return;
  }

  const form = new FormData();
  form.append('description', description);
  const file = dom.suggestionImage.files?.[0];
  if (file) {
    form.append('image', file);
  }

  try {
    await apiFetch('/suggestions', {
      method: 'POST',
      body: form,
      headers: {
        Authorization: `Bearer ${state.token}`,
      },
    });
    showStatus('Suggestion submitted!', false, 'suggestion');
    logActivity('Submitted a suggestion');
    dom.suggestionForm.reset();
    loadSuggestions();
  } catch (err) {
    showStatus(err.message || 'Failed to submit suggestion', true, 'suggestion');
  }
}

function createIssueCard(issue) {
  const card = document.createElement('div');
  card.className = 'issue-card';

  const header = document.createElement('div');
  header.className = 'issue-meta';
  header.innerHTML = `
    <div><strong>${issue.category ?? 'Issue'}</strong> • ${issue.building || 'N/A'} ${
    issue.room || ''
  }</div>
    <div class="issue-status">${issue.status || 'open'}</div>
  `;

  // Edit/Delete buttons for issue
  if (state.user && (issue.userId === state.user.id || state.user.role === 'admin')) {
    const actions = document.createElement('div');
    actions.className = 'issue-actions';
    actions.innerHTML = `
      <button data-action="edit-issue" data-id="${issue.id}" class="secondary">Edit</button>
      <button data-action="delete-issue" data-id="${issue.id}" class="secondary danger">Delete</button>
    `;
    header.appendChild(actions);
  }

  const desc = document.createElement('div');
  desc.textContent = issue.description || '';

  const counts = document.createElement('div');
  counts.className = 'issue-actions';
  counts.innerHTML = `
    <button data-action="agree" data-id="${issue.id}" class="secondary">👍 ${
    issue.agree ?? 0
  }</button>
    <button data-action="disagree" data-id="${issue.id}" class="secondary">👎 ${
    issue.disagree ?? 0
  }</button>
  `;

  const commentSection = document.createElement('div');
  commentSection.className = 'comment-list';
  commentSection.innerHTML = `<strong>Comments</strong>`;

  const commentForm = document.createElement('div');
  commentForm.className = 'form-row';
  commentForm.innerHTML = `
    <input type="text" placeholder="Add a comment..." data-comment-input="${issue.id}" />
    <label class="file-upload small">
      <input type="file" data-comment-file="${issue.id}" accept="image/*" />
    </label>
    <button data-action="comment" data-id="${issue.id}" class="secondary">Post</button>
  `;

  if (Array.isArray(issue.suggestions) && issue.suggestions.length) {
    issue.suggestions.slice(0, 5).forEach(s => {
      const comment = document.createElement('div');
      comment.className = 'comment';
      comment.innerHTML = `
        <div>${s.description}</div>
        ${s.imageUrl ? `<img src="${s.imageUrl}" alt="Comment image" style="max-width: 200px;" />` : ''}
        <small>by ${s.user?.email ?? 'anonymous'} • ${new Date(s.createdAt).toLocaleString([], { month: 'short', day: 'numeric' })}</small>
      `;
      // Edit/Delete for suggestion
      if (state.user && s.user.id === state.user.id) {
        const sActions = document.createElement('div');
        sActions.innerHTML = `
          <button data-action="edit-suggestion" data-id="${s.id}" class="small">Edit</button>
          <button data-action="delete-suggestion" data-id="${s.id}" class="small danger">Delete</button>
        `;
        comment.appendChild(sActions);
      }
      commentSection.appendChild(comment);
    });
  } else {
    const noComments = document.createElement('div');
    noComments.className = 'comment';
    noComments.textContent = 'No comments yet. Be the first.';
    commentSection.appendChild(noComments);
  }

  card.appendChild(header);
  card.appendChild(desc);
  if (issue.imageUrl) {
    const img = document.createElement('img');
    img.src = issue.imageUrl;
    img.alt = 'Issue image';
    img.style.maxWidth = '300px';
    img.style.marginTop = '10px';
    card.appendChild(img);
  }
  card.appendChild(counts);
  card.appendChild(commentSection);
  card.appendChild(commentForm);

  return card;
}

async function vote(issueId, value) {
  if (!state.token) {
    showStatus('Log in to vote', true);
    return;
  }
  try {
    await apiFetch('/votes', { method: 'POST', body: JSON.stringify({ issueId, value }) });
    logActivity(value === 1 ? 'Agreed with an issue' : 'Disagreed with an issue');
    await loadIssues();
  } catch (err) {
    showStatus(err.message || 'Vote failed', true);
  }
}

async function editIssue(issueId, data) {
  try {
    await apiFetch(`/issues/${issueId}`, { method: 'PATCH', body: JSON.stringify(data) });
    logActivity('Edited an issue');
    loadIssues();
  } catch (err) {
    showStatus(err.message || 'Edit failed', true);
  }
}

async function deleteIssue(issueId) {
  try {
    await apiFetch(`/issues/${issueId}`, { method: 'DELETE' });
    logActivity('Deleted an issue');
    loadIssues();
  } catch (err) {
    showStatus(err.message || 'Delete failed', true);
  }
}

async function editSuggestion(suggestionId, description) {
  try {
    await apiFetch(`/suggestions/${suggestionId}`, { method: 'PATCH', body: JSON.stringify({ description }) });
    logActivity('Edited a suggestion');
    loadIssues();
    loadSuggestions();
  } catch (err) {
    showStatus(err.message || 'Edit failed', true);
  }
}

async function deleteSuggestion(suggestionId) {
  try {
    await apiFetch(`/suggestions/${suggestionId}`, { method: 'DELETE' });
    logActivity('Deleted a suggestion');
    loadIssues();
    loadSuggestions();
  } catch (err) {
    showStatus(err.message || 'Delete failed', true);
  }
}

async function renderIssues(issues) {
  dom.issuesList.innerHTML = '';
  dom.myReportsList.innerHTML = '';

  if (!Array.isArray(issues)) {
    dom.issuesList.textContent = 'No data available.';
    return;
  }

  issues.forEach(issue => {
    const card = createIssueCard(issue);
    dom.issuesList.appendChild(card);

    if (state.user && issue.userId === state.user.id) {
      const clone = card.cloneNode(true);
      dom.myReportsList.appendChild(clone);
    }
  });
}

async function loadIssues() {
  try {
    const issues = await apiFetch('/issues');
    await renderIssues(issues);
  } catch (err) {
    dom.issuesList.textContent = 'Unable to load issues.';
  }
}

async function loadSuggestions() {
  try {
    const suggestions = await apiFetch('/suggestions');
    await renderSuggestions(suggestions);
  } catch (err) {
    dom.suggestionsList.textContent = 'Unable to load suggestions.';
  }
}

function createSuggestionCard(suggestion) {
  const card = document.createElement('div');
  card.className = 'suggestion-card';

  if (suggestion.title) {
    const title = document.createElement('h4');
    title.textContent = suggestion.title;
    title.style.margin = '0 0 8px 0';
    card.appendChild(title);
  }

  const desc = document.createElement('div');
  desc.textContent = suggestion.description || '';

  if (suggestion.imageUrl) {
    const img = document.createElement('img');
    img.src = suggestion.imageUrl;
    img.alt = 'Suggestion image';
    img.style.maxWidth = '200px';
    img.style.marginTop = '10px';
    card.appendChild(img);
  }

  const meta = document.createElement('div');
  meta.className = 'issue-meta';
  meta.innerHTML = `<small>by ${suggestion.user?.email ?? 'anonymous'} • ${new Date(suggestion.createdAt).toLocaleString([], { month: 'short', day: 'numeric' })}</small>`;

  // Edit/Delete for suggestion
  if (state.user && suggestion.user.id === state.user.id) {
    const actions = document.createElement('div');
    actions.className = 'issue-actions';
    actions.innerHTML = `
      <button data-action="edit-suggestion" data-id="${suggestion.id}" class="small">Edit</button>
      <button data-action="delete-suggestion" data-id="${suggestion.id}" class="small danger">Delete</button>
    `;
    card.appendChild(actions);
  }

  card.appendChild(desc);
  card.appendChild(meta);

  return card;
}

async function renderSuggestions(suggestions) {
  dom.suggestionsList.innerHTML = '';

  if (!Array.isArray(suggestions)) {
    dom.suggestionsList.textContent = 'No data available.';
    return;
  }

  suggestions.forEach(suggestion => {
    const card = createSuggestionCard(suggestion);
    dom.suggestionsList.appendChild(card);
  });
}

async function login() {
  const email = dom.loginEmail.value.trim();
  const password = dom.loginPassword.value.trim();
  if (!email || !password) {
    showStatus('Enter email and password to log in', true);
    return;
  }

  try {
    const data = await apiFetch('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    setToken(data.access_token, data.user || { email });
    logActivity('Logged in');
    showStatus('Logged in successfully', false);
  } catch (err) {
    showStatus(err.message || 'Login failed', true);
  }
}

async function register() {
  const email = dom.loginEmail.value.trim();
  const password = dom.loginPassword.value.trim();
  if (!email || !password) {
    showStatus('Enter email and password to register', true);
    return;
  }

  try {
    const data = await apiFetch('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    setToken(data.access_token, data.user || { email });
    logActivity('Registered a new account');
    showStatus('Registered & logged in', false);
  } catch (err) {
    showStatus(err.message || 'Registration failed', true);
  }
}

function bindEvents() {
  dom.loginBtn.addEventListener('click', login);
  dom.registerBtn.addEventListener('click', register);
  dom.logoutBtn.addEventListener('click', () => {
    clearToken();
    logActivity('Logged out');
  });

  dom.reportForm.addEventListener('submit', submitReport);
  dom.refreshIssues.addEventListener('click', loadIssues);
  dom.refreshSuggestions.addEventListener('click', loadSuggestions);
  dom.suggestionForm.addEventListener('submit', submitSuggestion);

  const handleIssueActions = event => {
    const target = event.target;
    if (!(target instanceof HTMLElement)) return;

    const action = target.dataset.action;
    const id = target.dataset.id;

    if (!action || !id) return;

    if (action === 'agree') {
      vote(Number(id), 1);
      return;
    }
    if (action === 'disagree') {
      vote(Number(id), -1);
      return;
    }

    if (action === 'comment') {
      const root = event.currentTarget;
      const input = root.querySelector(`input[data-comment-input="${id}"]`);
      const fileInput = root.querySelector(`input[data-comment-file="${id}"]`);
      const text = input?.value?.trim();
      const file = fileInput?.files?.[0];
      if (!text && !file) return;
      input.value = '';
      fileInput.value = '';
      postComment(Number(id), text, file);
      return;
    }

    if (action === 'edit-issue') {
      // Simple edit: prompt for new description
      const newDesc = prompt('Edit issue description:');
      if (newDesc) {
        editIssue(Number(id), { description: newDesc });
      }
      return;
    }

    if (action === 'delete-issue') {
      if (confirm('Delete this issue?')) {
        deleteIssue(Number(id));
      }
      return;
    }

    if (action === 'edit-suggestion') {
      const newDesc = prompt('Edit comment:');
      if (newDesc) {
        editSuggestion(Number(id), newDesc);
      }
      return;
    }

    if (action === 'delete-suggestion') {
      if (confirm('Delete this comment?')) {
        deleteSuggestion(Number(id));
      }
      return;
    }
  };

  dom.issuesList.addEventListener('click', handleIssueActions);
  dom.myReportsList.addEventListener('click', handleIssueActions);
  dom.suggestionsList.addEventListener('click', handleIssueActions);
}

function init() {
  renderAuthState();
  bindEvents();
  loadIssues();
  loadSuggestions();
}

window.addEventListener('DOMContentLoaded', init);
