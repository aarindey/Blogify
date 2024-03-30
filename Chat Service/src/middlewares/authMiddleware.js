import jwt from "jsonwebtoken";

const authMiddleware = (req, res, next) => {
  const token = req.cookies.token;
  if (!token) {
    return res.status(403).json({ success: false, message: "Token absent" });
  }

  try {
    let decodedJWT = jwt.verify(token, process.env.JWT_SECRET);
    req.userid = decodedJWT.userid;

    next();
  } catch (err) {
    res.status(403).json({ success: false, error: err, message: "JWT error" });
  }
};

export default authMiddleware;
