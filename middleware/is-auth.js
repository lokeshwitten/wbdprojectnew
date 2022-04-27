const { decode } = require('jsonwebtoken');
const jwt = require('jsonwebtoken');

exports.isAuth = (req, res, next) => {
    const authHeader = req.get('Authorization');
    if (!authHeader || authHeader === '') {
        res.status(403).json({ message: "The Authorization header is not set" })
    }

    const token = authHeader.split(' ')[1]
    try {
        const decodedToken = jwt.verify(token, 'happykumarjayswal')

    } catch (err) {
        console.log('Authentication Error')
        res.status(401).json("The token is Expired or not valid")
    }




    next();
};