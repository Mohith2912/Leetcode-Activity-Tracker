import { DEMO_USER_DATA, initIcons } from './config.js';
import { fetchUserData } from './api.js';
import { renderProfile } from './profile.js';
import { setSkills, setFilters } from './topics.js';
import { renderHeatmap } from './heatmap.js';
import { renderSubmissions } from './submissions.js';

// DOM Elements
const loginScreen = document.getElementById('login-screen');
const loadingScreen = document.getElementById('loading-screen');
const dashboardScreen = document.getElementById('dashboard-screen');
const loginForm = document.getElementById('login-form');
const usernameInput = document.getElementById('username-input');
const demoBtn = document.getElementById('demo-btn');
const logoutBtn = document.getElementById('logout-btn');
const loginError = document.getElementById('login-error');
const errorText = document.getElementById('error-text');
const apiStatusIndicator = document.getElementById('api-status-indicator');

// Topics Elements
const topicSearch = document.getElementById('topic-search');
const tabButtons = document.querySelectorAll('.tab-btn');

// Init application
document.addEventListener('DOMContentLoaded', () => {
  initIcons();
  setupEventListeners();
});

function setupEventListeners() {
  // Login Form Submission
  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const username = usernameInput.value.trim();
    if (username) {
      await handleFetchUser(username);
    }
  });

  // Demo Button Action
  demoBtn.addEventListener('click', () => {
    showLoading();
    setTimeout(() => {
      renderDashboard(DEMO_USER_DATA, true);
    }, 1000);
  });

  // Logout / Change User
  logoutBtn.addEventListener('click', () => {
    showScreen(loginScreen);
    usernameInput.value = '';
    loginError.classList.add('hidden');
  });

  // Topic search filter
  topicSearch.addEventListener('input', (e) => {
    const query = e.target.value;
    setFilters(undefined, query);
  });

  // Topic Tab filter buttons
  tabButtons.forEach(button => {
    button.addEventListener('click', (e) => {
      tabButtons.forEach(btn => btn.classList.remove('active'));
      button.classList.add('active');
      const tab = button.getAttribute('data-tab');
      setFilters(tab, undefined);
    });
  });
}

// Toggle screens helper
function showScreen(screenEl) {
  [loginScreen, loadingScreen, dashboardScreen].forEach(el => el.classList.remove('active'));
  screenEl.classList.add('active');
}

function showLoading() {
  showScreen(loadingScreen);
}

// Fetch handler coordinator
async function handleFetchUser(username) {
  showLoading();
  loginError.classList.add('hidden');

  try {
    const userData = await fetchUserData(username);
    renderDashboard(userData, false);
  } catch (err) {
    console.error(err);
    showScreen(loginScreen);
    errorText.textContent = err.message || "Failed to load LeetCode stats. Please verify spelling.";
    loginError.classList.remove('hidden');
  }
}

// Render Dashboard coordinator
function renderDashboard(data, isDemoMode = false) {
  showScreen(dashboardScreen);

  // Set API Status Icon
  if (isDemoMode) {
    apiStatusIndicator.className = 'status-tag demo-status';
    apiStatusIndicator.innerHTML = `
      <span class="status-dot orange"></span>
      <span class="status-text">Demo Sandbox Data</span>
    `;
  } else {
    apiStatusIndicator.className = 'status-tag';
    apiStatusIndicator.innerHTML = `
      <span class="status-dot green"></span>
      <span class="status-text">Live API Data</span>
    `;
  }

  // 1. Profile Panel Values & Progress Rings
  renderProfile(data.profile);

  // 2. Topics / Skills Badges
  setSkills(data.skills);
  
  // Reset topic inputs and state
  topicSearch.value = '';
  tabButtons.forEach(btn => btn.classList.remove('active'));
  const allTabBtn = Array.from(tabButtons).find(btn => btn.getAttribute('data-tab') === 'all');
  if (allTabBtn) allTabBtn.classList.add('active');
  setFilters('all', '');

  // 3. Activity Heatmap Rendering (Last 5 Months)
  renderHeatmap(data.calendar.submissionCalendar);

  // 4. Recent Submissions
  renderSubmissions(data.submissions);

  // Re-initialize any new Lucide icons loaded in dashboard DOM
  initIcons();
}
