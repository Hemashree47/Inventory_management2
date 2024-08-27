// Middleware to check if user exists
export const checkUserExists = async (req, res, next) => {
    const user = await User.findById(req.userId);

    if (!user) {
        return res.status(404).json({ error: 'User not found' });
    }

    req.user = user;
    next();
};