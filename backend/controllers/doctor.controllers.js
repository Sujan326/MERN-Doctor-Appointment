import { Doctor } from "../models/doctor.models.js";

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

export { changeAvailablity };
