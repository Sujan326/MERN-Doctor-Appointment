import validator from "validator";
import bcrypt from "bcrypt";
import { User } from "../models/user.models.js";
import jwt from "jsonwebtoken";
import { v2 as cloudinary } from "cloudinary";

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

// API to get user profile data
const getProfile = async (req, res) => {
  try {
    const userId = req.userId;
    const userData = await User.findById(userId).select("-password");

    res.json({ success: true, userData });
  } catch (error) {
    res.json({ success: false, messsage: error.message });
  }
};

// API for updating user profile data
const updateProfile = async (req, res) => {
  try {
    const { name, phone, address, dob, gender } = req.body;
    const userId = req.userId;
    const imageFile = req.file;

    if (!name || !phone || !dob || !gender) {
      return res.json({ success: false, message: "Data Missing" });
    }

    await User.findByIdAndUpdate(userId, {
      name,
      phone,
      address: JSON.parse(address),
      dob,
      gender,    });

    if (imageFile) {
      // upload image to cloudinary
      const imageUpload = await cloudinary.uploader.upload(imageFile.path, {
        resource_type: "image",
      });
      const imageUrl = imageUpload.secure_url;

      await User.findByIdAndUpdate(userId, { image: imageUrl });
    }
    res.json({ success: true, message: "Profile Updated" });
  } catch (error) {
    res.json({ success: false, messsage: error.message });
  }
};
export { registerUser, loginUser, getProfile, updateProfile };
