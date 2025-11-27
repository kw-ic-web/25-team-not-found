import * as DashboardRepository from '../repositories/dashboard.repository.js';

export const getDashboardData = async (userId) => {
  const [enrollments, feedback, stats, teacher_textbooks] = await Promise.all([
    DashboardRepository.findEnrollmentsByUserId(userId),
    DashboardRepository.findRecentFeedbackByUserId(userId),
    DashboardRepository.findStatsByUserId(userId),
    DashboardRepository.findTeacherTextbooks(userId),
  ]);

  return { enrollments, feedback, stats, teacher_textbooks };
};
