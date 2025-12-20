import jwt from "jsonwebtoken";

// doctor authentication middleware
const authDoctor = async (req, res, next) => {
  try {
    const doctorToken = req.headers.doctortoken;
    console.log("Doctor Token", doctorToken);
    if (!doctorToken) {
      return res.json({
        success: false,
        message: "Not Authorized, Login Again",
      });
    }

    // decode doctorToken
    const tokenDecode = jwt.verify(doctorToken, process.env.JWT_SECRET);
    console.log("Decoded doctorToken:", tokenDecode);

    // add the doctor id in the request
    req.doctorId = tokenDecode.id;
    next();
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

export default authDoctor;
