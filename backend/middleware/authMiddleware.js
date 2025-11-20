import jwt from "jsonwebtoken";

export const protect = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) return res.status(401).json({ message: "Not authorized" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Keep existing controllers' expectation of req.user._id
    req.user = { _id: decoded.id, email: decoded.email };
    next();
  } catch (err) {
    res.status(401).json({ message: "Invalid token" });
  }
};
