const jwt = require("jsonwebtoken");



//verifyToken
function verifyToken(req, res, next)  {
    const authToken = req.headers.authorization;

    if (authToken) {
        const token = authToken.split(" ")[1];
        try {
            const decodedPayload = jwt.verify(token, process.env.SECERT_CODE);
            req.user = decodedPayload;
            next();
        } catch (error) {
            return res.status(401).json({ message: "invaild token, access denied" })
        }
    } else {
        return res.status(401).json({ message: "no token provided" })
    }
}

//verifyToken for Admin
function verifyTokenAdmin(req, res, next) {
    verifyToken(req, res, () => {
        if (req.user.isAdmin) {
            next();
        } else {
            return res.status(403).json({ message: "you are not allowed, only admin allowed" });
        }
    });
}

//verifyToken for user himself
function verifyTokenUser(req, res, next) {
    verifyToken(req, res, () => {
        if (req.user.userId === req.params.id) {
            next();
        } else {
            return res.status(403).json({ message: "you are not allowed, only user allowed" });
        }
    });
}


//verifyTokenAuthorization
function verifyTokenAuthorization(req, res, next) {
    verifyToken(req, res, () => {
        if (req.user.userId === req.params.id || req.user.isAdmin) {
            next();
        } else {
            return res.status(403).json({ message: "you are not allowed, only user or admin allowed" });
        }
    });
}


module.exports = { verifyToken, verifyTokenAdmin, verifyTokenUser, verifyTokenAuthorization }