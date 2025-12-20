import { Doctor } from "../models/doctor.models.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { Appointment } from "../models/appointment.models.js";

// API for changing availablity of Doctor
const changeAvailablity = async (req, res) => {
  try {
    const { doctorId } = req.body;
    const doctorData = await Doctor.findById(doctorId);

    await Doctor.findByIdAndUpdate(doctorId, {
      available: !doctorData.available,
    });
    res.json({ success: true, message: "Availablity Changed" });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// API for getting the Doctor List
const doctorList = async (req, res) => {
  try {
    const doctors = await Doctor.find({}).select(["-password", "-email"]);
    res.json({ success: true, doctors });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// API for doctor login
const loginDoctor = async (req, res) => {
  try {
    const { email, password } = req.body;
    const doctor = await Doctor.findOne({ email });

    if (!doctor) {
      return res.json({ success: false, message: "Invalid Credentials" });
    }

    const isMatch = await bcrypt.compare(password, doctor.password);

    if (isMatch) {
      const doctorToken = jwt.sign({ id: doctor._id }, process.env.JWT_SECRET);

      res.json({ success: true, doctorToken });
    } else {
      return res.json({ success: false, message: "Invalid Credentials" });
    }
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// API for getting appointments for doctor panel
const appointmentsDoctor = async (req, res) => {
  try {
    const doctorId = req.doctorId;
    const appointments = await Appointment.find({ docId: doctorId });

    res.json({ success: true, appointments });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// API to mark appointment completed for doctor panel
const appointmentComplete = async (req, res) => {
  try {
    const doctorId = req.doctorId;
    const { appointmentId } = req.body;

    const appointmentData = await Appointment.findById(appointmentId);

    if (appointmentData && appointmentData.docId === doctorId) {
      await Appointment.findByIdAndUpdate(appointmentId, { isCompleted: true });
      return res.json({ success: true, message: "Appointment Completed" });
    } else {
      return res.json({ success: false, message: "Mark Failed" });
    }
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// API to cancel appointment for doctor panel
const appointmentCancel = async (req, res) => {
  try {
    const doctorId = req.doctorId;
    const { appointmentId } = req.body;

    const appointmentData = await Appointment.findById(appointmentId);

    if (appointmentData && appointmentData.docId === doctorId) {
      await Appointment.findByIdAndUpdate(appointmentId, { cancelled: true });
      return res.json({ success: true, message: "Appointment Cancelled" });
    } else {
      return res.json({ success: false, message: "Cancellation Failed" });
    }
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

export {
  changeAvailablity,
  doctorList,
  loginDoctor,
  appointmentsDoctor,
  appointmentComplete,
  appointmentCancel,
};
