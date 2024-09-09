// middleware/auth.js
const auth = require('basic-auth');

const credentials = { name: 'admin', pass: 'password' };  // Replace with your desired username and password

const basicAuth = (req, res, next) => {
    const user = auth(req);

    if (user && user.name === credentials.name && user.pass === credentials.pass) {
        return next();
    } else {
        res.setHeader('WWW-Authenticate', 'Basic realm="example"');
        res.status(401).json({ message: 'Authentication required' });
    }
};

module.exports = basicAuth;
