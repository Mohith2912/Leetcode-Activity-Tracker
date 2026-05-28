let currentSkills = [];
let activeTab = 'all';
let searchQuery = '';

const topicsGrid = document.getElementById('topics-grid');
const topicsEmpty = document.getElementById('topics-empty');

// Setup skills and sort them
export function setSkills(skillsData) {
  currentSkills = [];
  if (skillsData.fundamental) {
    skillsData.fundamental.forEach(t => currentSkills.push({ ...t, tier: 'fundamental' }));
  }
  if (skillsData.intermediate) {
    skillsData.intermediate.forEach(t => currentSkills.push({ ...t, tier: 'intermediate' }));
  }
  if (skillsData.advanced) {
    skillsData.advanced.forEach(t => currentSkills.push({ ...t, tier: 'advanced' }));
  }

  // Sort topics by solved count descending
  currentSkills.sort((a, b) => b.problemsSolved - a.problemsSolved);
}

// Set filters and trigger rerender
export function setFilters(tab, query) {
  if (tab !== undefined) activeTab = tab;
  if (query !== undefined) searchQuery = query.toLowerCase();
  filterAndRenderTopics();
}

// Render badges
export function filterAndRenderTopics() {
  topicsGrid.innerHTML = '';
  
  const filtered = currentSkills.filter(item => {
    // 1. Filter by category tab
    if (activeTab !== 'all' && item.tier !== activeTab) {
      return false;
    }
    // 2. Filter by search match
    if (searchQuery && !item.tagName.toLowerCase().includes(searchQuery)) {
      return false;
    }
    return true;
  });

  if (filtered.length === 0) {
    topicsEmpty.classList.remove('hidden');
  } else {
    topicsEmpty.classList.add('hidden');
    filtered.forEach(item => {
      const badge = document.createElement('div');
      badge.className = `topic-badge ${item.tier}-tier`;
      badge.innerHTML = `
        <span class="topic-name">${item.tagName}</span>
        <span class="topic-count">${item.problemsSolved}</span>
      `;
      topicsGrid.appendChild(badge);
    });
  }
}
