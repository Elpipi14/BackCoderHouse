export const isAuthenticated = (req, res, next) => {
    if (req.isAuthenticated()) {
        return res.redirect('/profile');
    }
    next();
};