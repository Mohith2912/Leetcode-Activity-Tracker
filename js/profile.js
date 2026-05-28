// ==========================================
// RENDER PROFILE & PROGRESS
// ==========================================
export function renderProfile(profileData) {
  // 1. Profile Panel Values
  document.getElementById('user-avatar').src = profileData.avatar;
  document.getElementById('user-name').textContent = profileData.name;
  document.getElementById('user-username').textContent = `@${profileData.username}`;
  document.getElementById('user-country').textContent = profileData.country;
  document.getElementById('user-school').textContent = profileData.school;
  document.getElementById('user-rank').textContent = profileData.ranking.toLocaleString();
  document.getElementById('user-reputation').textContent = profileData.reputation.toLocaleString();
  document.getElementById('user-streak').textContent = profileData.streak;
  document.getElementById('user-active-days').textContent = profileData.activeDays;

  // Toggle meta labels if empty
  document.getElementById('user-country-tag').style.display = (profileData.country && profileData.country !== "Not specified") ? "flex" : "none";
  document.getElementById('user-school-tag').style.display = (profileData.school && profileData.school !== "Not specified") ? "flex" : "none";

  // 2. Difficulty Progress Gauge Rings & Meters
  const total = profileData.totalSolved;
  document.getElementById('total-solved-num').textContent = total;
  
  // Animate circular ring
  const circleActive = document.getElementById('progress-ring-active');
  const circumference = 364.4; // 2 * PI * 58
  circleActive.style.strokeDasharray = `${circumference}`;
  
  // Total solved percentage (vs estimated platform total)
  const totalQuestions = profileData.totalQuestions || 3944;
  const solvedPercent = Math.min((total / totalQuestions), 1.0);
  const ringOffset = circumference - (circumference * Math.max(solvedPercent, 0.02)); // show tiny sliver if 0
  
  // Set ring offset after browser paint
  setTimeout(() => {
    circleActive.style.strokeDashoffset = ringOffset;
  }, 100);

  // Set Easy, Medium, Hard numbers and fills
  renderMeter('easy', profileData.easySolved, profileData.totalEasy);
  renderMeter('medium', profileData.mediumSolved, profileData.totalMedium);
  renderMeter('hard', profileData.hardSolved, profileData.totalHard);
}

function renderMeter(difficulty, solved, total) {
  const percent = total > 0 ? ((solved / total) * 100).toFixed(1) : 0;
  document.getElementById(`${difficulty}-solved`).textContent = solved;
  document.getElementById(`${difficulty}-total`).textContent = total;
  document.getElementById(`${difficulty}-percent`).textContent = `${percent}%`;
  
  const fillBar = document.getElementById(`${difficulty}-bar`);
  setTimeout(() => {
    fillBar.style.width = `${percent}%`;
  }, 200);
}
