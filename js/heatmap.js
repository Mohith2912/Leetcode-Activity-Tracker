// ==========================================
// DYNAMIC HEATMAP GENERATION (LAST 5 MONTHS)
// ==========================================
export function renderHeatmap(calendarString) {
  const cellsGrid = document.getElementById('heatmap-cells-grid');
  const monthLabelsContainer = document.getElementById('heatmap-months-labels');
  
  cellsGrid.innerHTML = '';
  monthLabelsContainer.innerHTML = '';

  // Parse submission calendar JSON
  let calendarData = {};
  try {
    if (typeof calendarString === 'string') {
      calendarData = JSON.parse(calendarString || '{}');
    } else if (typeof calendarString === 'object') {
      calendarData = calendarString || {};
    }
  } catch (err) {
    console.error("Failed to parse submissionCalendar JSON:", err);
  }

  // Map unix timestamps to YYYY-MM-DD local strings
  const submissionCountsMap = new Map();
  for (const [timestampStr, count] of Object.entries(calendarData)) {
    const timestampMs = parseInt(timestampStr, 10) * 1000;
    const dateObj = new Date(timestampMs);
    const dateStr = formatDateKey(dateObj);
    submissionCountsMap.set(dateStr, (submissionCountsMap.get(dateStr) || 0) + count);
  }

  // Calculate Date Boundaries: Last 5 months up to today
  const endDate = new Date();
  const startDate = new Date();
  startDate.setMonth(endDate.getMonth() - 5);

  // Align start date to the preceding Monday to balance grid rows (Mon-Sun layout)
  // getDay(): 0 = Sun, 1 = Mon, ..., 6 = Sat
  const currentDayVal = startDate.getDay();
  const offsetToMonday = currentDayVal === 0 ? 6 : currentDayVal - 1;
  startDate.setDate(startDate.getDate() - offsetToMonday);

  // Generate date array
  const datesArray = [];
  const curr = new Date(startDate);
  
  // Cap at today
  while (curr <= endDate) {
    datesArray.push(new Date(curr));
    curr.setDate(curr.getDate() + 1);
  }

  // Calculate metrics for summary
  let totalSubmissionsInPeriod = 0;

  // Track month headers alignment
  const addedMonths = new Set();

  // Draw Heatmap Cells
  datesArray.forEach((date, index) => {
    const dateStr = formatDateKey(date);
    const count = submissionCountsMap.get(dateStr) || 0;
    totalSubmissionsInPeriod += count;

    // Define cell element
    const cell = document.createElement('div');
    cell.className = 'heatmap-cell';
    
    // Set density levels
    let level = 0;
    if (count > 0) {
      if (count <= 1) level = 1;
      else if (count <= 2) level = 2;
      else if (count <= 4) level = 3;
      else level = 4;
    }
    cell.classList.add(`level-${level}`);
    
    // Accessibility & Meta properties
    cell.setAttribute('data-date', dateStr);
    cell.setAttribute('data-count', count);

    // Event listener for tooltip interactions
    cell.addEventListener('mouseenter', (e) => showTooltip(e, date, count));
    cell.addEventListener('mousemove', moveTooltip);
    cell.addEventListener('mouseleave', hideTooltip);

    cellsGrid.appendChild(cell);

    // Render Month name labels above column starts
    // Weeks correspond to intervals of 7 days
    if (index % 7 === 0) {
      const colIndex = Math.floor(index / 7);
      const monthName = date.toLocaleString('default', { month: 'short' });
      const yearSuffix = date.getFullYear();
      const monthKey = `${monthName}-${yearSuffix}`;

      // Show month name if we hit a new month block
      if (!addedMonths.has(monthKey)) {
        addedMonths.add(monthKey);
        
        const label = document.createElement('span');
        label.className = 'month-label';
        label.textContent = monthName;
        // Week columns take 12px + 3px gap = 15px width
        label.style.left = `${colIndex * 15}px`;
        monthLabelsContainer.appendChild(label);
      }
    }
  });

  // Update period submissions count banner
  document.getElementById('heatmap-total-solved').textContent = totalSubmissionsInPeriod;
}

// Helper formats date as local YYYY-MM-DD key
function formatDateKey(date) {
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const dd = String(date.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
}

// Tooltip events
function showTooltip(event, date, count) {
  const tooltip = document.getElementById('heatmap-tooltip');
  const formattedDate = date.toLocaleDateString('default', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
  
  const countText = count === 1 ? '1 submission' : `${count} submissions`;
  
  tooltip.querySelector('.tooltip-date').textContent = formattedDate;
  tooltip.querySelector('.tooltip-value').textContent = countText;
  tooltip.classList.remove('hidden');
  
  moveTooltip(event);
}

function moveTooltip(event) {
  const tooltip = document.getElementById('heatmap-tooltip');
  // Offset tooltip above mouse point
  tooltip.style.left = `${event.pageX}px`;
  tooltip.style.top = `${event.pageY}px`;
}

function hideTooltip() {
  const tooltip = document.getElementById('heatmap-tooltip');
  tooltip.classList.add('hidden');
}
