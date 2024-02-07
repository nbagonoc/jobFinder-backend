const jwt = require('jsonwebtoken')

const User = require('../models/User')
const key = process.env.SECRET_OR_KEY

const isAuth = async (req, res, next) => {
    const { authorization } = req.headers

    if (!authorization) {
        return res.status(401).json({ message: 'Authorization token required' })
    }

    try {
        const token = authorization.split(' ')[1]
        const { _id } = jwt.verify(token, key)

        req.user = await User.findOne({ _id }).select('_id')
        next()
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ message: 'Token has expired: Please login' });
        }
        return res.status(500).json({ message: 'Internal Server Error'});
    }
}

module.exports = isAuth
