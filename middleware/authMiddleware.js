const jwt = require("jsonwebtoken")

const authMiddleware = (req,res,next) => {
    const authHeader = req.headers["authorization"]

    if(!authHeader || !authHeader.startsWith("Bearer")){
        return res.status(401).json({ error: "No token provided, authorization denied" });
    }

     const token = authHeader.split(" ")[1]; 

       try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
     console.log("Decoded JWT payload:", decoded);
    req.user = decoded; // Attach decoded payload (id, email) to request
    next();
  } catch (err) {
    return res.status(401).json({ error: "Token is not valid" });
  };
}

module.exports = authMiddleware;