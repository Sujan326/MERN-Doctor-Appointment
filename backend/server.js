import express from "express";
import cors from "cors";
import "dotenv/config";
import connectDB from "./config/mongodb.js";
import connectCloudinary from "./config/cloudinary.js";
import adminRouter from "./routes/admin.routes.js";
import doctorRouter from "./routes/doctor.routes.js";

// app config
const app = express();
const PORT = process.env.PORT || 3000;
connectDB();
connectCloudinary();

// middlewares
app.use(express.json());
app.use(cors());

// api endpoint
app.use("/api/admin", adminRouter); // localhost:4000/api/admin/add-doctor
app.use("/api/doctor", doctorRouter); // localhost:4000/api/doctor/list

app.get("/", (req, res) => {
  res.send("API WORKING");
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
