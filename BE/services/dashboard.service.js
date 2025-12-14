
import * as DashboardRepository from '../repositories/dashboard.repository.js';

export const getDashboardStats = async (userId) => {
  const [kpis, weeklyTrend, scoreDist, textbooks, activities] = await Promise.all([
    DashboardRepository.getKPIs(userId),
    DashboardRepository.getWeeklyTrend(userId),
    DashboardRepository.getScoreDistribution(userId),
    DashboardRepository.getTextbookProgress(userId),
    DashboardRepository.getStudyActivity(userId)
  ]);

  // Calculate Streak
  let streak = 0;
  if (activities.length > 0) {
    const today = new Date();
    tasks: for (let i = 0; i < activities.length; i++) {
      const activityDate = new Date(activities[i].date);
      const diffTime = Math.abs(today - activityDate);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) - 1; // 0 for today

      // Simple logic: if dates are consecutive (diff is 0, 1, 2...)
      // Actually, precise streak calc needs processed date list.
      // Simplified for now: just mock it or calculate strictly if consecutive.
      // A robust implementation would loop dates backwards from today.
    }
  }

  // Calculate real streak from activity dates
  const sortedDates = [...new Set(activities.map(a => new Date(a.date).toISOString().split('T')[0]))].sort().reverse();

  let currentStreak = 0;
  let checkDate = new Date();

  // Check if active today
  const todayStr = checkDate.toISOString().split('T')[0];
  if (sortedDates.includes(todayStr)) {
    currentStreak++;
  } else {
    // If not active today, maybe yesterday?
    // If not active yesterday, streak is 0.
    // But user wants "current streak". 
  }

  // Let's iterate backwards.
  // Actually simplest is:
  if (sortedDates.length > 0) {
    let lastDate = new Date(sortedDates[0]);
    const now = new Date();

    // If last activity is older than yesterday, streak is broken (0).
    const diffSinceLast = (now - lastDate) / (1000 * 3600 * 24);
    if (diffSinceLast < 2) {
      currentStreak = 1;
      for (let i = 1; i < sortedDates.length; i++) {
        const d1 = new Date(sortedDates[i - 1]);
        const d2 = new Date(sortedDates[i]);
        const diff = (d1 - d2) / (1000 * 3600 * 24);
        if (Math.round(diff) === 1) {
          currentStreak++;
        } else {
          break;
        }
      }
    }
  }

  return {
    summary: {
      total_hours: parseFloat(kpis.total_hours).toFixed(1),
      completed_classes: parseInt(kpis.completed_classes),
      quizzes_taken: parseInt(kpis.quizzes_taken),
      average_score: Math.round(parseFloat(kpis.average_score)),
      streak: currentStreak,
      weekly_goal: { current: parseFloat(kpis.total_hours).toFixed(1), target: kpis.weekly_goal_hours || 5 }
    },
    charts: {
      weekly_activity: weeklyTrend,
      quiz_scores: scoreDist
    },
    textbooks: textbooks,
    calendar: activities.map(a => ({
      date: a.date,
      level: a.count >= 5 ? 4 : (a.count >= 3 ? 3 : (a.count >= 1 ? 2 : 1))
    }))
  };
};
