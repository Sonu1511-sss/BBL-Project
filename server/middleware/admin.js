// Admin middleware - checks if user is admin
export const adminOnly = (req, res, next) => {
  // Check if user is admin
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({ error: 'Access denied. Admin privileges required.' });
  }
};

