
import * as DashboardService from '../services/dashboard.service.js';

export const getDashboardData = async (req, res, next) => {
  try {
    const userId = req.user.id; // Assumes authMiddleware populates req.user
    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const data = await DashboardService.getDashboardStats(userId);
    res.json(data);
  } catch (error) {
    next(error);
  }
};
