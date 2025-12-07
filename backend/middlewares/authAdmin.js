import jwt from "jsonwebtoken";

// admin authentication middleware
const authAdmin = async (req, res, next) => {
  try {
    const adminToken = req.headers.admintoken;
    if (!adminToken) {
      return res.json({
        success: false,
        message: "Not Authorized, Login Again",
      });
    }

    // decode token
    const tokenDecode = jwt.verify(adminToken, process.env.JWT_SECRET);
    console.log("Decoded token:", tokenDecode);
    console.log(
      "Env values:",
      process.env.ADMIN_EMAIL,
      process.env.ADMIN_PASSWORD
    );

    // check the token is valid
    if (
      tokenDecode.email !== process.env.ADMIN_EMAIL ||
      tokenDecode.password !== process.env.ADMIN_PASSWORD
    ) {
      return res.json({
        success: false,
        message: "Not Authorized, Login Again",
      });
    }
    next();
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

export default authAdmin;
