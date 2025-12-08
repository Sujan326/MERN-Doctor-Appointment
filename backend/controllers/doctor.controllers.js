import { Doctor } from "../models/doctor.models.js";

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
    res.json({success: true, doctors})
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

export { changeAvailablity, doctorList };
