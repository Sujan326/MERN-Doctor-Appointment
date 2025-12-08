import validator from "validator";
import bcrypt from "bcrypt";
import { User } from "../models/user.models.js";
import jwt from "jsonwebtoken";

// API to register user
const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // checking missing details
    if (!name || !email || !password) {
      return res.json({ success: false, message: "Missing Details" });
    }

    // VALIDATE PASSWORD FIRST
    if (!password || password.length < 8) {
      return res.json({
        success: false,
        message: "Enter a strong password (min 8 characters)",
      });
    }

    // validating email format
    if (!validator.isEmail(email)) {
      return res.json({ success: false, message: "Enter a valid email" });
    }

    // hashing user password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // save in db
    const userData = {
      name,
      email,
      password: hashedPassword,
    };

    const newUser = new User(userData);
    const user = await newUser.save();

    // create token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);

    res.json({ success: true, token });
  } catch (error) {
    res.json({ success: false, messsage: error.message });
  }
};

// API for user login
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.json({ success: false, message: "User does not exist" });
    }

    const isPasswordMatched = await bcrypt.compare(password, user.password);

    if (isPasswordMatched) {
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
      res.json({ success: true, token });
    } else {
      res.json({ success: false, message: "Incorrect Password" });
    }
  } catch (error) {
    res.json({ success: false, messsage: error.message });
  }
};
export { registerUser, loginUser };
