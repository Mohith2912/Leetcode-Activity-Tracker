// ==========================================
// CONFIGURATION & CONSTANTS
// ==========================================
export const BASE_URL = 'https://alfa-leetcode-api.onrender.com';

// Generate realistic mock submissions spread across the last 5 months
function generateMockCalendarData() {
  const map = {};
  const today = new Date();
  
  // Set random active days over last 150 days
  for (let i = 0; i < 150; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    // 35% chance of making submissions on any given day
    if (Math.random() < 0.35) {
      const submissionCount = Math.floor(Math.random() * 5) + 1; // 1 to 5 submissions
      const unixTime = Math.floor(d.getTime() / 1000);
      map[unixTime] = submissionCount;
    }
  }
  return JSON.stringify(map);
}

export const DEMO_USER_DATA = {
  profile: {
    username: "alfaarghya",
    name: "Arghya Das",
    ranking: 163075,
    reputation: 42,
    country: "India",
    school: "The Neotia University",
    avatar: "https://assets.leetcode.com/users/alfaarghya/avatar_1716008462.png",
    streak: 8,
    activeDays: 31,
    totalSolved: 540,
    totalQuestions: 3944,
    easySolved: 200,
    totalEasy: 946,
    mediumSolved: 288,
    totalMedium: 2218,
    hardSolved: 52,
    totalHard: 780
  },
  solved: {
    solvedProblem: 540,
    easySolved: 200,
    mediumSolved: 288,
    hardSolved: 52
  },
  skills: {
    fundamental: [
      { tagName: "Array", tagSlug: "array", problemsSolved: 274 },
      { tagName: "String", tagSlug: "string", problemsSolved: 113 },
      { tagName: "Matrix", tagSlug: "matrix", problemsSolved: 42 },
      { tagName: "Simulation", tagSlug: "simulation", problemsSolved: 33 },
      { tagName: "Sorting", tagSlug: "sorting", problemsSolved: 112 },
      { tagName: "Hash Table", tagSlug: "hash-table", problemsSolved: 94 },
      { tagName: "Two Pointers", tagSlug: "two-pointers", problemsSolved: 48 }
    ],
    intermediate: [
      { tagName: "Dynamic Programming", tagSlug: "dynamic-programming", problemsSolved: 75 },
      { tagName: "Depth-First Search", tagSlug: "depth-first-search", problemsSolved: 62 },
      { tagName: "Breadth-First Search", tagSlug: "breadth-first-search", problemsSolved: 41 },
      { tagName: "Greedy", tagSlug: "greedy", problemsSolved: 50 },
      { tagName: "Binary Search", tagSlug: "binary-search", problemsSolved: 45 },
      { tagName: "Tree", tagSlug: "tree", problemsSolved: 58 },
      { tagName: "Sliding Window", tagSlug: "sliding-window", problemsSolved: 24 }
    ],
    advanced: [
      { tagName: "Graph", tagSlug: "graph", problemsSolved: 22 },
      { tagName: "Trie", tagSlug: "trie", problemsSolved: 12 },
      { tagName: "Segment Tree", tagSlug: "segment-tree", problemsSolved: 4 },
      { tagName: "Union Find", tagSlug: "union-find", problemsSolved: 15 },
      { tagName: "Design", tagSlug: "design", problemsSolved: 11 }
    ]
  },
  calendar: {
    streak: 8,
    totalActiveDays: 31,
    submissionCalendar: {} // Filled dynamically below
  },
  submissions: [
    { title: "Majority Element II", statusDisplay: "Accepted", lang: "java", timestamp: Date.now() / 1000 - 3600 },
    { title: "Majority Element II", statusDisplay: "Wrong Answer", lang: "java", timestamp: Date.now() / 1000 - 7200 },
    { title: "Majority Element", statusDisplay: "Accepted", lang: "java", timestamp: Date.now() / 1000 - 18000 },
    { title: "Pow(x, n)", statusDisplay: "Accepted", lang: "java", timestamp: Date.now() / 1000 - 86400 },
    { title: "Search a 2D Matrix", statusDisplay: "Accepted", lang: "java", timestamp: Date.now() / 1000 - 172800 },
    { title: "Find the Duplicate Number", statusDisplay: "Accepted", lang: "java", timestamp: Date.now() / 1000 - 259200 },
    { title: "Merge Sorted Array", statusDisplay: "Accepted", lang: "java", timestamp: Date.now() / 1000 - 345600 },
    { title: "Rotate List", statusDisplay: "Accepted", lang: "java", timestamp: Date.now() / 1000 - 432000 },
    { title: "Reverse Linked List", statusDisplay: "Accepted", lang: "java", timestamp: Date.now() / 1000 - 518400 }
  ]
};

DEMO_USER_DATA.calendar.submissionCalendar = generateMockCalendarData();

export function initIcons() {
  if (window.lucide) {
    window.lucide.createIcons();
  }
}
