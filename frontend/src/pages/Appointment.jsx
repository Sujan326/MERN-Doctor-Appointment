import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import { assets } from "../assets/assets_frontend/assets";
import RelatedDoctors from "../components/Doctor/RelatedDoctors";

function Appointment() {
  const { doctor_id } = useParams();
  const { doctors, currencySymbol } = useContext(AppContext);
  const daysOfWeek = ["SUN", "MON", "TUE", "WED", "THRU", "FRI", "SAT"];

  const [doctorInfo, setDoctorInfo] = useState(null);
  const [doctorSlots, setDoctorSlots] = useState([]);
  const [slotIndex, setSlotIndex] = useState(0);
  const [slotTime, setSlotTime] = useState("");

  const fetchDoctorInfo = async () => {
    const doctorInfo = await doctors.find((doc) => doc._id === doctor_id);
    setDoctorInfo(doctorInfo);
  };

  const getAvailableSlots = async () => {
    setDoctorSlots([]);

    // getting current date
    let today = new Date();

    for (let i = 0; i < 7; i++) {
      // getting date with index
      let currentDate = new Date(today);
      currentDate.setDate(today.getDate() + i);

      // Setting end time of the date with index
      let endTime = new Date();
      endTime.setDate(today.getDate() + i);
      endTime.setHours(21, 0, 0, 0);

      // Setting Hours
      if (today.getDate() === currentDate.getDate()) {
        currentDate.setHours(
          currentDate.getHours() > 10 ? currentDate.getHours() + 1 : 10
        );
        currentDate.setMinutes(currentDate.getMinutes() > 30 ? 30 : 0);
      } else {
        currentDate.setHours(10);
        currentDate.setMinutes(0);
      }

      let timeSlots = [];

      while (currentDate < endTime) {
        let formattedTime = currentDate.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        });

        // adding slot to array
        timeSlots.push({
          datetime: new Date(currentDate),
          time: formattedTime,
        });

        // increment current time by 30 minutes
        currentDate.setMinutes(currentDate.getMinutes() + 30);
      }

      setDoctorSlots((prev) => [
        ...prev,
        {
          date: new Date(currentDate), // always store the date
          slots: timeSlots, // may be empty
        },
      ]);
    }
  };

  useEffect(() => {
    fetchDoctorInfo();
  }, [doctors, doctor_id]);

  useEffect(() => {
    getAvailableSlots();
  }, [doctorInfo]);

  useEffect(() => {
    console.log(doctorSlots);
  }, [doctorSlots]);

  return (
    doctorInfo && (
      <div>
        {/* Doctor Details */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div>
            <img
              className="bg-primary w-full sm:max-w-72 rounded-lg"
              src={doctorInfo.image}
              alt=""
            />
          </div>

          <div className="flex-1 border border-gray-400 rounded-lg p-8 py-7 bg-white mx-2 sm:mx-0 mt-[-80px] sm:mt-0">
            {/* Doctor Infor: name, degree, experience */}
            <p className="flex items-center gap-2 text-2xl font-medium text-gray-900">
              {doctorInfo.name}{" "}
              <img
                className="w-5"
                src={assets.verified_icon}
                alt=""
                title="Verified"
              />
            </p>
            <div className="flex items-center gap-2 text-sm mt-1 text-gray-600">
              <p>
                {doctorInfo.degree} - {doctorInfo.speciality}
              </p>
              <button className="py-0.5 px-2 border text-xs rounded-full">
                {doctorInfo.experience}
              </button>
            </div>

            {/* Doctor About */}
            <div>
              <p className="flex items-center gap-1 text-sm font-medium text-gray-900 mt-3">
                About <img src={assets.info_icon} alt="" />
              </p>
              <p className="text-sm text-gray-500 max-w-[700px] mt-1">
                {doctorInfo.about}
              </p>
            </div>
            <p className="text-gray-500 font-medium mt-4">
              Appointment Fee:{" "}
              <span className="text-gray-600">
                {currencySymbol}
                {doctorInfo.fees}
              </span>
            </p>
          </div>
        </div>

        {/* Booking Slots */}
        <div className="sm:ml-72 sm:pl-4 mt-4 font-medium text-gray-700">
          <p>Booking slots</p>
          <div className="flex gap-3 items-center w-full overflow-x-scroll mt-4">
            {doctorSlots.length &&
              doctorSlots.map((item, index) => (
                <div
                  onClick={() => setSlotIndex(index)}
                  key={index}
                  className={`text-center py-6 min-w-16 rounded-full cursor-pointer ${
                    slotIndex === index
                      ? "bg-primary text-white"
                      : "border border-gray-400"
                  }`}
                >
                  <p>{daysOfWeek[item.date.getDay()]}</p>
                  <p>{item.date.getDate()}</p>
                </div>
              ))}
          </div>

          <div className="flex items-center gap-3 w-full overflow-x-scroll mt-4">
            {doctorSlots.length && doctorSlots[slotIndex].slots.length > 0 ? (
              doctorSlots[slotIndex].slots.map((item, index) => (
                <p
                  onClick={() => setSlotTime(item.time)}
                  className={`text-sm font-light flex-shrink-0 px-5 py-2 rounded-full cursor-pointer ${
                    item.time === slotTime
                      ? "bg-primary text-white"
                      : "text-gray-400 border border-gray-300"
                  }`}
                  key={index}
                >
                  {item.time.toLowerCase()}
                </p>
              ))
            ) : (
              <p className="text-sm text-gray-500 py-2">No slots available</p>
            )}
          </div>

          <button className="bg-primary text-white text-sm font-light px-14 py-3 rounded-full my-6">
            Book an Appointment
          </button>
        </div>

        {/* Listing Related Doctors */}
        <RelatedDoctors
          doctor_id={doctor_id}
          speciality={doctorInfo.speciality}
        />
      </div>
    )
  );
}

export default Appointment;
