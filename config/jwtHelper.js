const jwt = require('jsonwebtoken');

module.exports.verifyJwtToken = (req, res, next) => {
    var token;
    if ('authorization' in req.headers) {
        token = req.headers['authorization'].split(' ')[1];
    }


    if (!token)
        return res.status(403).send({ success: false, message: 'No token provided.' });
    else {
        jwt.verify(token, process.env.JWT_SECRET,
            (err, decoded) => {
                if (err)
                    return res.status(401).send({ success: false, message: 'Token authentication failed.' });
                else {
                    req._id = decoded._id;
                    req.firsName = decoded.firstName;
                    req.lastName = decoded.lastName;
                    req.profilePicture = decoded.profilePicture;
                    req.customerId = decoded.customerId;
                    next();

                }
            }
        )
    }
}

module.exports.verifyUserJwtToken = (req, res, next) => {
    var token;
    if ('authorization' in req.headers) {
        token = req.headers['authorization'].split(' ')[1];
    }


    if (!token)
        return res.status(403).send({ success: false, message: 'No token provided.' });
    else {
        jwt.verify(token, process.env.JWT_SECRET,
            (err, decoded) => {
                if (err)
                    return res.status(401).send({ success: false, message: 'Token authentication failed.' });
                else {
                    if (decoded.role != 'user') {
                        return res.status(403).send({ success: false, message: 'You should respect users privacy' });
                    }
                    else {
                        req._id = decoded._id;
                        req.firstName = decoded.firstName;
                        req.lastName = decoded.lastName;
                        req.profilePicture = decoded.profilePicture;
                        req.customerId = decoded.customerId;

                        next();
                    }
                }
            }
        )
    }
}

module.exports.verifyBusinessJwtToken = (req, res, next) => {
    var token;
    if ('authorization' in req.headers) {
        token = req.headers['authorization'].split(' ')[1];
    }


    if (!token)
        return res.status(403).send({ success: false, message: 'No token provided.' });
    else {
        jwt.verify(token, process.env.JWT_SECRET,
            (err, decoded) => {
                if (err)
                    return res.status(401).send({ success: false, message: 'Token authentication failed.' });
                else {
                    if (decoded.role != 'business') {
                        return res.status(403).send({ success: false, message: 'Permission Denied' });
                    }
                    else {
                        req._id = decoded._id;
                        req.firstName = decoded.firstName;
                        req.lastName = decoded.lastName;
                        req.profilePicture = decoded.profilePicture;
                        req.customerId = decoded.customerId;
                        next();
                    }

                }
            }
        )
    }
}