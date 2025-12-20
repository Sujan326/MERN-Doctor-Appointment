import validator from "validator";
import bcrypt from "bcrypt";
import { v2 as cloudinary } from "cloudinary";
import { Doctor } from "../models/doctor.models.js";
import jwt from "jsonwebtoken";
import { Appointment } from "../models/appointment.models.js";
import { User } from "../models/user.models.js";

// API for adding doctor
const addDoctor = async (req, res) => {
  try {
    // Get the details from request body.
    const {
      name,
      email,
      password,
      speciality,
      degree,
      experience,
      about,
      fees,
      address,
    } = req.body;
    // Get the image details from multer that is passes as req.file
    const imageFile = req.file;

    // checking for all data to add doctor
    if (
      !name ||
      !email ||
      !password ||
      !speciality ||
      !degree ||
      !experience ||
      !about ||
      !fees ||
      !address
    ) {
      return res.json({ success: false, message: "Missing Details" });
    }

    // validating email format
    if (!validator.isEmail(email)) {
      return res.json({
        success: false,
        message: "Please enter a valid Email",
      });
    }

    // validating strong password
    if (password.length < 8) {
      return res.json({
        success: false,
        message: "Please enter a strong password",
      });
    }

    // hashing doctor password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // upload image to cloudinary
    const imageUpload = await cloudinary.uploader.upload(imageFile.path, {
      resource_type: "image",
    });
    const imageUrl = imageUpload.secure_url;

    // Doctor Data to store in DB.
    const doctorData = {
      name,
      email,
      image: imageUrl,
      password: hashedPassword,
      speciality,
      degree,
      experience,
      about,
      fees,
      address: JSON.parse(address),
      date: Date.now(),
    };

    const newDoctor = new Doctor(doctorData);
    await newDoctor.save();

    res.json({
      success: true,
      message: "Doctor Added Successfully",
    });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// API for admin Login
const loginAdmin = async (req, res) => {
  try {
    // get email and password from body
    const { email, password } = req.body;

    // pass email and password with JWT_SECRET for creating token
    if (
      email === process.env.ADMIN_EMAIL &&
      password === process.env.ADMIN_PASSWORD
    ) {
      const token = jwt.sign({ email, password }, process.env.JWT_SECRET);
      res.json({ success: true, token });
    } else {
      res.json({ success: false, message: "Invalid Credentials" });
    }
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// API for get all doctor list for admin panel
const allDoctors = async (req, res) => {
  try {
    const doctors = await Doctor.find({}).select("-password");
    res.json({ success: true, doctors });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// API to get all appointments list
const appointmentsAdmin = async (req, res) => {
  try {
    const appointments = await Appointment.find({}); // all the appointments
    res.json({ success: true, appointments });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// API to cancel appointment for admin
const appointmentCancelAdmin = async (req, res) => {
  try {
    const { appointmentId } = req.body;

    const appointmentData = await Appointment.findById(appointmentId);

    await Appointment.findByIdAndUpdate(appointmentId, { cancelled: true });

    // releasing doctors slot
    const { docId, slotDate, slotTime } = appointmentData;

    const doctorData = await Doctor.findById(docId);

    let slots_booked = doctorData.slots_booked;

    slots_booked[slotDate] = slots_booked[slotDate].filter(
      (e) => e !== slotTime
    );

    await Doctor.findByIdAndUpdate(docId, { slots_booked });

    res.json({ success: true, message: "Appointment Cancelled Successfully" });
  } catch (error) {
    res.json({ success: false, messsage: error.message });
  }
};

// API to get dashboard data for admin panel
const adminDashboard = async (req, res) => {
  try {
    const doctors = await Doctor.find({}); // get all the doctors
    const users = await User.find({}); // get all the users
    const appointments = await Appointment.find({}); // get all the appointments

    const dashData = {
      doctors: doctors.length,
      appointments: appointments.length,
      patients: users.length,
      lastestAppointments: appointments.reverse().slice(0, 5),
    };

    res.json({ success: true, dashData });
  } catch (error) {
    res.json({ success: false, messsage: error.message });
  }
};

export {
  addDoctor,
  loginAdmin,
  allDoctors,
  appointmentsAdmin,
  appointmentCancelAdmin,
  adminDashboard,
};
