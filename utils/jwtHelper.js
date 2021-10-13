const jwt = require('jsonwebtoken');

function authenticateToken(req, res, next) {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];
    console.log('token', token);
    if (!token) return res.status(401).json({ error: 'unauthorized request' });

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, data) => {
        if (err) {
            return res.status(403).json({ error: 'token expired/invalid' });
        }
        console.log('data in jwt', data);
        req.user = data.email;
        req.userId = data.userId;
        console.log(req.user, req.userId)
        next();
    });
}

module.exports = authenticateToken