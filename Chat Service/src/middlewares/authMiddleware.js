import jwt from "jsonwebtoken";

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    res.status(403).json({
      message: "JWT absent",
    });
  }

  const token = authHeader.split(" ")[1];
  if (!token) {
    return res.status(403).json({ message: "Token absent" });
  }

  try {
    let decodedJWT = jwt.verify(token, process.env.JWT_SECRET);
    req.userid = decodedJWT.userid;

    next();
  } catch (err) {
    res.status(403).json({ error: err, message: "JWT error" });
  }
};

export default authMiddleware;
