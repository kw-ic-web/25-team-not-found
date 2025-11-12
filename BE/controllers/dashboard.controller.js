import * as DashboardService from '../services/dashboard.service.js';

export const getDashboardData = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const dashboardData = await DashboardService.getDashboardData(userId);
    res.status(200).json({ success: true, data: dashboardData });
  } catch (error) {
    next(error);
  }
};
