import * as DashboardRepository from '../repositories/dashboard.repository.js';

export const getDashboardData = async (userId) => {
  // The user prompt implies these repositories exist.
  // I will use DashboardRepository for all for now as the others were not in the file list.
  const [enrollments, feedback, stats] = await Promise.all([
    DashboardRepository.findEnrollmentsByUserId(userId),
    DashboardRepository.findRecentFeedbackByUserId(userId),
    DashboardRepository.findStatsByUserId(userId),
  ]);

  return { enrollments, feedback, stats };
};
