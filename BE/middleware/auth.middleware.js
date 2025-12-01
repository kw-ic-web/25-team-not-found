import jwt from 'jsonwebtoken';

const authMiddleware = (req, res, next) => {
  // 1. Extract token from header
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      success: false,
      error: {
        code: 'UNAUTHENTICATED',
        message: 'Authentication token is required.',
      },
    });
  }

  const token = authHeader.split(' ')[1];

  try {
    // 2. Verify token
    const payload = jwt.verify(token, process.env.JWT_SECRET);

    // 3. Attach user to request object
    req.user = {
      id: payload.user_id,
      role: payload.role,
    };

    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      error: {
        code: 'INVALID_TOKEN',
        message: 'Token is invalid or has expired.',
      },
    });
  }
};

export default authMiddleware;
