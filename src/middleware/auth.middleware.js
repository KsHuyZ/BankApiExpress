const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
    try {
        const authorization = req.headers.authorization;
        if (!authorization) return res.status(403).send("Access Denied");
        const accessToken = authorization.split(" ")[1];
        const decoded = decodeTokenWithExp(accessToken);
        if (!decoded)
        return res.status(401).json({ success: false, message: "Invalid Token" });
        req.user = decoded;
        next();
    } catch (error) {
        res.status(400).send("Invalid token");
    }
};