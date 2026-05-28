import { BASE_URL } from './config.js';

// Safe API fetching with individual try-catches
async function fetchWithErrorFallback(url, fallback) {
  try {
    const res = await fetch(url);
    if (!res.ok) {
      console.warn(`Fetch to ${url} failed with status: ${res.status}`);
      return fallback;
    }
    return await res.json();
  } catch (err) {
    console.error(`Network error requesting ${url}:`, err);
    return fallback;
  }
}

// Fetch complete profile metrics from LeetCode endpoints
export async function fetchUserData(username) {
  // 1. Fetch basic profile details (Mandatory)
  const profileRes = await fetch(`${BASE_URL}/${username}`);
  if (profileRes.status === 404) {
    throw new Error(`LeetCode user "${username}" was not found.`);
  }
  if (!profileRes.ok) {
    throw new Error('API server returned an error. Please try again later.');
  }
  const profileData = await profileRes.json();

  // 2. Fetch solved stats, calendar, and skill topics in parallel with fallbacks
  const [solvedData, calendarData, skillData] = await Promise.all([
    fetchWithErrorFallback(`${BASE_URL}/${username}/solved`, { solvedProblem: 0, easySolved: 0, mediumSolved: 0, hardSolved: 0 }),
    fetchWithErrorFallback(`${BASE_URL}/${username}/calendar`, { streak: 0, totalActiveDays: 0, submissionCalendar: "{}" }),
    fetchWithErrorFallback(`${BASE_URL}/${username}/skill`, { fundamental: [], intermediate: [], advanced: [] })
  ]);

  // 3. Gather recent submissions from profileData if present, or fetch from submission endpoint
  let submissionsData = [];
  try {
    const subRes = await fetch(`${BASE_URL}/${username}/submission`);
    if (subRes.ok) {
      const subResult = await subRes.json();
      submissionsData = subResult.submission || [];
    }
  } catch (err) {
    console.warn("Failed to fetch submissions list, fallback to profile sub-records", err);
  }

  // Compose cohesive dataset
  return {
    profile: {
      username: profileData.username,
      name: profileData.name || profileData.username,
      avatar: profileData.avatar || "https://assets.leetcode.com/users/default_avatar.png",
      ranking: profileData.ranking || 0,
      reputation: profileData.reputation || 0,
      country: profileData.country || "Not specified",
      school: profileData.school || "Not specified",
      streak: calendarData.streak || 0,
      activeDays: calendarData.totalActiveDays || 0,
      // Difficulty numbers
      totalSolved: solvedData.solvedProblem || 0,
      totalQuestions: 3944, // rough platform total estimate
      easySolved: solvedData.easySolved || 0,
      totalEasy: 946,
      mediumSolved: solvedData.mediumSolved || 0,
      totalMedium: 2218,
      hardSolved: solvedData.hardSolved || 0,
      totalHard: 780
    },
    solved: solvedData,
    calendar: calendarData,
    skills: skillData,
    submissions: submissionsData
  };
}
