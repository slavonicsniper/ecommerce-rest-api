const checkAuthenticated = (req, res, next) => {
    if(req.isAuthenticated()) {
        return next()
    }
    res.status(401).send()
}

const checkAuthUser = (req, res, next) => {
    if(req.params.id === req.user.id) {
        return next()
    }
    res.status(401).send()
}

module.exports = {
    checkAuthenticated,
    checkAuthUser
}