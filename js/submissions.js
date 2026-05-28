// ==========================================
// SUBMISSIONS LIST VIEW RENDERING
// ==========================================
export function renderSubmissions(submissionsArray) {
  const listContainer = document.getElementById('submissions-list');
  listContainer.innerHTML = '';

  const items = submissionsArray || [];

  if (items.length === 0) {
    listContainer.innerHTML = `
      <div class="empty-state">
        <i data-lucide="history"></i>
        <p>No recent submissions found.</p>
      </div>
    `;
    return;
  }

  // Show top 15 entries
  items.slice(0, 15).forEach(sub => {
    const isAccepted = sub.statusDisplay === 'Accepted';
    const relativeTime = getRelativeTime(parseInt(sub.timestamp, 10));

    const item = document.createElement('div');
    item.className = 'sub-item';
    item.innerHTML = `
      <div class="sub-left">
        <span class="sub-title">${sub.title}</span>
        <div class="sub-details">
          <span class="lang-badge">${sub.lang}</span>
          <span class="sub-time">${relativeTime}</span>
        </div>
      </div>
      <div class="sub-right">
        <span class="status-badge ${isAccepted ? 'accepted' : 'failed'}">
          ${sub.statusDisplay}
        </span>
      </div>
    `;
    listContainer.appendChild(item);
  });
}

// Format Unix Timestamp to clean Relative String
function getRelativeTime(unixSecs) {
  const delta = Math.floor(Date.now() / 1000 - unixSecs);
  if (delta < 60) return 'Just now';
  if (delta < 3600) return `${Math.floor(delta / 60)}m ago`;
  if (delta < 86400) return `${Math.floor(delta / 3600)}h ago`;
  return `${Math.floor(delta / 86400)}d ago`;
}
