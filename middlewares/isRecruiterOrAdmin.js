const jwt = require('jsonwebtoken')

const User = require('../models/User')
const key = require('../configs/dbSecretKeys')

const isRecruiterOrAdmin = async (req, res, next) => {
    const { authorization } = req.headers

    if (!authorization) {
        return res.status(401).json({ message: 'Authorization token required' })
    }

    try {
        const token = authorization.split(' ')[1]
        const { _id, role } = jwt.verify(token, key.secretOrKey)
        
        if (!(role == 'recruiter' || role == 'admin')) {
            return res.status(401).json({ message: 'Request is not authorized' })
        }

        req.user = await User.findOne({ _id }).select('_id')
        next()
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ message: 'Token has expired' });
        }
        return res.status(500).json({ message: 'Internal Server Error' });
    }
}

module.exports = isRecruiterOrAdmin