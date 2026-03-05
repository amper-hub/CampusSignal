/* ========================================
   CAMPUSSIGNAL FRONTEND - MAIN SCRIPT
   ======================================== */

// ========== API CONFIGURATION ==========
const API_BASE_URL = 'http://localhost:3000';

// ========== STATE MANAGEMENT ==========
let authToken = null;
let currentUser = null;

// ========== INITIALIZATION ==========
document.addEventListener('DOMContentLoaded', () => {
    // Check if user is already logged in
    const savedToken = localStorage.getItem('authToken');
    if (savedToken) {
        authToken = savedToken;
        showDashboard();
        loadIssues();
    }

    // Event listeners for auth forms
    document.getElementById('registerFormElement').addEventListener('submit', handleRegister);
    document.getElementById('loginFormElement').addEventListener('submit', handleLogin);
    document.getElementById('logoutBtn').addEventListener('click', handleLogout);
    document.getElementById('issueFormElement').addEventListener('submit', handleIssueSubmit);
});

// ========== AUTHENTICATION FUNCTIONS ==========

/**
 * Toggle between login and register forms
 */
function toggleAuthForms() {
    const registerForm = document.getElementById('registerForm');
    const loginForm = document.getElementById('loginForm');

    registerForm.classList.toggle('hidden');
    loginForm.classList.toggle('hidden');
    
    // Clear error messages
    document.getElementById('authError').textContent = '';
    document.getElementById('authError').classList.add('hidden');
}

/**
 * Handle user registration
 */
async function handleRegister(e) {
    e.preventDefault();

    const email = document.getElementById('registerEmail').value;
    const password = document.getElementById('registerPassword').value;

    try {
        const response = await fetch(`${API_BASE_URL}/auth/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password }),
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'Registration failed');
        }

        // Show success and toggle to login
        showAuthError('Registration successful! Please login.', true);
        setTimeout(() => {
            document.getElementById('registerFormElement').reset();
            toggleAuthForms();
        }, 1500);
    } catch (error) {
        console.error('Registration error:', error);
        showAuthError(error.message);
    }
}

/**
 * Handle user login
 */
async function handleLogin(e) {
    e.preventDefault();

    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;

    try {
        const response = await fetch(`${API_BASE_URL}/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password }),
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'Login failed');
        }

        // Store JWT token
        authToken = data.access_token;
        localStorage.setItem('authToken', authToken);
        currentUser = data.user || email;

        // Show dashboard
        showDashboard();
        loadIssues();
    } catch (error) {
        console.error('Login error:', error);
        showAuthError(error.message);
    }
}

/**
 * Handle user logout
 */
function handleLogout() {
    authToken = null;
    currentUser = null;
    localStorage.removeItem('authToken');

    // Reset forms
    document.getElementById('registerFormElement').reset();
    document.getElementById('loginFormElement').reset();
    document.getElementById('issueFormElement').reset();

    // Show auth page
    showAuthPage();
}

/**
 * Display auth error message
 */
function showAuthError(message, isSuccess = false) {
    const errorDiv = document.getElementById('authError');
    errorDiv.textContent = message;
    errorDiv.className = isSuccess ? 'success-message' : 'error-message';
}

// ========== UI VISIBILITY FUNCTIONS ==========

/**
 * Show the authentication page
 */
function showAuthPage() {
    document.getElementById('authContainer').classList.remove('hidden');
    document.getElementById('dashboardContainer').classList.add('hidden');
}

/**
 * Show the dashboard
 */
function showDashboard() {
    document.getElementById('authContainer').classList.add('hidden');
    document.getElementById('dashboardContainer').classList.remove('hidden');
}

// ========== ISSUE FUNCTIONS ==========

/**
 * Handle issue form submission
 */
async function handleIssueSubmit(e) {
    e.preventDefault();

    if (!authToken) {
        showIssueError('You must be logged in to submit an issue');
        return;
    }

    const category = document.getElementById('issueCategory').value;
    const building = document.getElementById('issueBuilding').value;
    const room = document.getElementById('issueRoom').value;
    const description = document.getElementById('issueDescription').value;
    const imageFile = document.getElementById('issueImage').files[0];

    try {
        // For now, we'll send the issue without the image (can be added later with multipart/form-data)
        let imageUrl = null;

        // If there's an image file and an upload endpoint exists, upload it
        if (imageFile) {
            imageUrl = await uploadImage(imageFile);
        }

        const issueData = {
            category,
            building,
            room,
            description,
            imageUrl: imageUrl || null,
        };

        const response = await fetch(`${API_BASE_URL}/issues`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authToken}`,
            },
            body: JSON.stringify(issueData),
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'Failed to submit issue');
        }

        // Clear form and show success
        document.getElementById('issueFormElement').reset();
        showIssueSuccess('Issue submitted successfully!');

        // Reload issues list
        setTimeout(() => {
            loadIssues();
            showIssueSuccess('', false);
        }, 1500);
    } catch (error) {
        console.error('Issue submission error:', error);
        showIssueError(error.message);
    }
}

/**
 * Load all issues from the backend
 */
async function loadIssues() {
    if (!authToken) {
        console.error('No auth token available');
        return;
    }

    try {
        const response = await fetch(`${API_BASE_URL}/issues`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${authToken}`,
            },
        });

        if (!response.ok) {
            throw new Error('Failed to load issues');
        }

        const issues = await response.json();
        displayIssues(issues);
    } catch (error) {
        console.error('Failed to load issues:', error);
        document.getElementById('issuesList').innerHTML =
            '<p class="error-message">Failed to load issues. Please try again.</p>';
    }
}

/**
 * Display issues in the UI
 */
function displayIssues(issues) {
    const issuesList = document.getElementById('issuesList');

    if (!issues || issues.length === 0) {
        issuesList.innerHTML = '<p class="loading">No issues reported yet.</p>';
        return;
    }

    issuesList.innerHTML = issues
        .map((issue) => createIssueCard(issue))
        .join('');

    // Add event listeners to cards
    issues.forEach((issue) => {
        const card = document.querySelector(`[data-issue-id="${issue.id}"]`);
        if (card) {
            card.addEventListener('click', (e) => {
                // Don't open modal if voting
                if (!e.target.closest('.btn-vote')) {
                    openIssueModal(issue);
                }
            });

            // Add vote button listeners
            const agreeBtn = card.querySelector('.btn-vote.agree');
            const disagreeBtn = card.querySelector('.btn-vote.disagree');

            if (agreeBtn) {
                agreeBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    submitVote(issue.id, 'AGREE');
                });
            }

            if (disagreeBtn) {
                disagreeBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    submitVote(issue.id, 'DISAGREE');
                });
            }
        }
    });
}

/**
 * Create HTML for an issue card
 */
function createIssueCard(issue) {
    const agreeCount = issue.votes?.filter((v) => v.type === 'AGREE').length || 0;
    const disagreeCount = issue.votes?.filter((v) => v.type === 'DISAGREE').length || 0;
    const suggestionCount = issue.suggestions?.length || 0;

    return `
        <div class="issue-card" data-issue-id="${issue.id}">
            <div class="issue-header">
                <h3 class="issue-title">${parseCategory(issue.category)}</h3>
                <span class="issue-status ${getStatusClass(issue.status)}">
                    ${issue.status || 'OPEN'}
                </span>
            </div>
            
            <div class="issue-meta">
                <span><strong>Location:</strong> ${issue.building} - Room ${issue.room}</span>
                <span><strong>Suggestions:</strong> ${suggestionCount}</span>
            </div>

            <div class="issue-description">
                ${truncateText(issue.description, 100)}
            </div>

            ${
                issue.imageUrl
                    ? `<img src="${issue.imageUrl}" alt="Issue image" class="issue-image-thumb">`
                    : ''
            }

            <div class="issue-actions">
                <button class="btn btn-vote agree btn-small">
                    👍 Agree <span class="vote-count">${agreeCount}</span>
                </button>
                <button class="btn btn-vote disagree btn-small">
                    👎 Disagree <span class="vote-count">${disagreeCount}</span>
                </button>
            </div>
        </div>
    `;
}

/**
 * Open modal with full issue details
 */
function openIssueModal(issue) {
    const modal = document.getElementById('issueModal');
    const modalBody = document.getElementById('issueModalBody');

    const agreeCount = issue.votes?.filter((v) => v.type === 'AGREE').length || 0;
    const disagreeCount = issue.votes?.filter((v) => v.type === 'DISAGREE').length || 0;

    let suggestionsHTML = '';
    if (issue.suggestions && issue.suggestions.length > 0) {
        suggestionsHTML = `
            <div class="suggestions-section">
                <h4>Suggestions & Comments</h4>
                ${issue.suggestions
                    .map(
                        (s) => `
                    <div class="suggestion-item">
                        <strong>${s.user?.email || 'Anonymous'}:</strong> ${s.description}
                    </div>
                `
                    )
                    .join('')}
            </div>
        `;
    } else {
        suggestionsHTML = `
            <div class="suggestions-section">
                <h4>Suggestions & Comments</h4>
                <p class="no-suggestions">No suggestions yet.</p>
            </div>
        `;
    }

    modalBody.innerHTML = `
        <h2>${parseCategory(issue.category)}</h2>
        <p><strong>Status:</strong> <span class="issue-status ${getStatusClass(issue.status)}">${
        issue.status || 'OPEN'
    }</span></p>
        <p><strong>Location:</strong> ${issue.building} - Room ${issue.room}</p>
        <p><strong>Reported by:</strong> ${issue.user?.email || 'Anonymous'}</p>
        <p><strong>Date:</strong> ${new Date(issue.createdAt).toLocaleDateString()}</p>
        
        <div style="margin: 20px 0; padding: 15px; background: #f5f5f5; border-radius: 5px;">
            <p>${issue.description}</p>
        </div>

        ${issue.imageUrl ? `<img src="${issue.imageUrl}" alt="Issue" style="max-width: 100%; border-radius: 5px; margin-bottom: 20px;">` : ''}

        <div style="margin: 20px 0;">
            <p><strong>Votes:</strong> 👍 ${agreeCount} | 👎 ${disagreeCount}</p>
        </div>

        ${suggestionsHTML}
    `;

    modal.classList.remove('hidden');
}

/**
 * Close issue modal
 */
function closeIssueModal() {
    document.getElementById('issueModal').classList.add('hidden');
}

/**
 * Submit a vote on an issue
 */
async function submitVote(issueId, voteType) {
    if (!authToken) {
        alert('You must be logged in to vote');
        return;
    }

    try {
        const response = await fetch(`${API_BASE_URL}/votes`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authToken}`,
            },
            body: JSON.stringify({
                issueId,
                type: voteType,
            }),
        });

        if (!response.ok) {
            throw new Error('Failed to submit vote');
        }

        // Reload issues to update vote counts
        loadIssues();
    } catch (error) {
        console.error('Vote submission error:', error);
        alert('Failed to submit vote: ' + error.message);
    }
}

/**
 * Upload image file (placeholder - extend with actual upload endpoint)
 */
async function uploadImage(file) {
    // This is a placeholder. Implement actual image upload if needed
    // For now, we'll create a data URL for demonstration
    return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            resolve(e.target.result);
        };
        reader.readAsDataURL(file);
    });
}

// ========== UTILITY FUNCTIONS ==========

/**
 * Show issue success message
 */
function showIssueSuccess(message, show = true) {
    const successDiv = document.getElementById('issueSuccess');
    if (show) {
        successDiv.textContent = message;
        successDiv.classList.remove('hidden');
    } else {
        successDiv.classList.add('hidden');
    }
}

/**
 * Show issue error message
 */
function showIssueError(message) {
    const errorDiv = document.getElementById('issueError');
    errorDiv.textContent = message;
    errorDiv.classList.remove('hidden');
    setTimeout(() => {
        errorDiv.classList.add('hidden');
    }, 4000);
}

/**
 * Parse category value to readable text
 */
function parseCategory(category) {
    const categoryMap = {
        maintenance: '🔧 Maintenance',
        facility: '🏢 Facility',
        safety: '⚠️ Safety',
        other: '📝 Other',
    };
    return categoryMap[category] || category;
}

/**
 * Get CSS class for issue status
 */
function getStatusClass(status) {
    const statusMap = {
        OPEN: 'status-open',
        'IN_PROGRESS': 'status-in-progress',
        RESOLVED: 'status-resolved',
    };
    return statusMap[status] || 'status-open';
}

/**
 * Truncate text to specified length
 */
function truncateText(text, maxLength) {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
}

// Close modal when clicking outside of it
window.addEventListener('click', (e) => {
    const modal = document.getElementById('issueModal');
    if (e.target === modal) {
        closeIssueModal();
    }
});
