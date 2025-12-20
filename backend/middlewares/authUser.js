import jwt from "jsonwebtoken";

// user authentication middleware
const authUser = async (req, res, next) => {
  try {
    const token = req.headers.token;
    console.log("Token", token)
    if (!token) {
      return res.json({
        success: false,
        message: "Not Authorized, Login Again",
      });
    }

    // decode token
    const tokenDecode = jwt.verify(token, process.env.JWT_SECRET);
    console.log("Decoded token:", tokenDecode);

    // add the user id in the request
    req.userId = tokenDecode.id;
    next();
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};
    
export default authUser;
