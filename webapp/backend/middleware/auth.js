const jwt = require('jsonwebtoken')
require('dotenv').config()


module.exports = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(' ')[1]
        const decodedToken = jwt.verify(token, process.env.AUTH_TOKEN_KEY)
        const userId = decodedToken.userId
        if (req.body.userId && req.body.userId !== userId) {
            return res.status(401).json({
                result: "error",
                type: "invalid-token",
                message: "Invalid Token!"
            })
        } else {
            next()
        }
    } catch {
        res.status(401).json({
            result: "error",
            type: "invalid-request",
            message: "Invalid Request!"
        });
    }
};