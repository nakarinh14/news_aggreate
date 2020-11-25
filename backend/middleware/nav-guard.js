module.exports = (req, res, next) => {
    if (req.isAuthenticated()) {
        next()
    } else {
        res.status(400).json({message: 'Not authorized'});
    }
}
