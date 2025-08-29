import { Input } from "@/components/ui/input";
import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const Profile = () => {
  const [detail, setDetail] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    gender: "",
    dob: "",
    email: "",
    residentCountry: "",
    memberImage: "",
    residentState: "",
  });

  const [countries, setCountries] = useState<any[]>([]);
  const [states, setStates] = useState<any[]>([]);
  const [selected, setSelected] = useState<Date | undefined>();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type, files } = e.target as any;

    if (type === "file") {
      setDetail((prev) => ({
        ...prev,
        [name]: files[0],
      }));
    } else {
      setDetail((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Submitting profile:", detail);
  };

  const handleDateSelect = (date: Date | null) => {
    setSelected(date ?? undefined);
    setDetail((prev) => ({
      ...prev,
      dob: date ? date.toISOString() : "",
    }));
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <form onSubmit={handleSubmit}>
        <h4 className="text-2xl font-bold text-gray-800 mb-3">Settings</h4>

        <div className="rounded-2xl border border-gray-200 bg-white shadow-sm">
          <div className="px-4 py-3 flex justify-between items-center bg-[#043d73] rounded-t-2xl">
            <div className="text-white font-medium">Profile settings</div>
          </div>

          <div className="p-4 selected-items-container">
            <div className="input-container">
              <label className="block text-sm mb-1">First Name</label>
              <input
                type="text"
                name="firstName"
                value={detail.firstName}
                onChange={handleChange}
                className="w-full border rounded-lg p-2 focus:ring focus:ring-blue-200"
              />
            </div>

            <div className="input-container">
              <label className="block text-sm mb-1">Last Name</label>
              <input
                type="text"
                name="lastName"
                value={detail.lastName}
                onChange={handleChange}
                className="w-full border rounded-lg p-2 focus:ring focus:ring-blue-200"
              />
            </div>

            <div className="input-container">
              <label className="block text-sm mb-1">Email Address</label>
              <input
                type="text"
                name="email"
                value={detail.email}
                onChange={handleChange}
                className="w-full border rounded-lg p-2 focus:ring focus:ring-blue-200"
              />
            </div>

            <div className="input-container">
              <label className="block text-sm mb-1">Phone Number</label>
              <input
                type="text"
                name="phone"
                value={detail.phone}
                onChange={handleChange}
                className="w-full border rounded-lg p-2 focus:ring focus:ring-blue-200"
              />
            </div>

            <div className="input-container">
              <label className="block text-sm mb-1">Date of Birth</label>
              <DatePicker
                selected={detail?.dob ? new Date(detail.dob) : null}
                onChange={handleDateSelect}
                className="w-100"
                dateFormat="dd-MM-yyyy"
                showMonthDropdown
                showYearDropdown
                dropdownMode="select"
              />
              {selected && (
                <p className="text-xs text-gray-600 mt-1">
                  Selected: {selected.toLocaleDateString()}
                </p>
              )}
            </div>

            <div className="input-container">
              <label className="block text-sm mb-1">Gender</label>
              <select
                name="gender"
                onChange={handleChange}
                value={detail.gender}
                className="w-full border rounded-lg p-2 focus:ring focus:ring-blue-200"
              >
                <option value="">--Select--</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
            </div>

            <div className="input-container">
              <label className="block text-sm mb-1">Nationality</label>
              <select
                name="residentCountry"
                onChange={handleChange}
                value={detail.residentCountry}
                className="w-full border rounded-lg p-2 focus:ring focus:ring-blue-200"
              >
                <option value="">Select Country</option>
                {countries.map((country) => (
                  <option value={country.countryCode} key={country.countryCode}>
                    {country.countryName}
                  </option>
                ))}
              </select>
            </div>

            <div className="input-container">
              <label className="block text-sm mb-1">State</label>
              <select
                name="residentState"
                onChange={handleChange}
                value={detail.residentState}
                className="w-full border rounded-lg p-2 focus:ring focus:ring-blue-200"
              >
                <option value="">Select State</option>
                {states.map((state) => (
                  <option value={state.stateCode} key={state.stateCode}>
                    {state.stateName}
                  </option>
                ))}
              </select>
            </div>

            <div className="input-container">
              <label className="block text-sm mb-1">Profile Picture</label>
              <input
                type="file"
                name="memberImage"
                onChange={handleChange}
                className="block w-full text-sm text-gray-600"
              />
              {detail.memberImage && (
                <img
                  alt="member"
                  src={
                    typeof detail.memberImage === "string"
                      ? detail.memberImage
                      : URL.createObjectURL(detail.memberImage)
                  }
                  className="mt-2 w-24 h-24 object-cover rounded-lg border"
                />
              )}
            </div>
          </div>
          <div className="flex justify-end p-5 bg-[#1985B3] rounded-b-[16px]">
            <button className="apply-btn">Save changes</button>
          </div>
        </div>
      </form>

      {/* Security settings form */}
      <form onSubmit={handleSubmit} className="mt-6">
        <div className="rounded-2xl border border-gray-200 bg-white shadow-sm">
          <div className="px-4 py-3 flex justify-between items-center bg-[#043d73] rounded-t-2xl">
            <div className="text-white font-medium">Password settings</div>
          </div>

          <div className="selected-items-container p-4">
            <div className="input-container">
              <label className="block text-sm mb-1">Old Password</label>
              <Input
                type="password"
                name="oldPassword"
                className="w-full border rounded-lg p-2 focus:ring focus:ring-blue-200"
              />
            </div>
            <div className="input-container">
              <label className="block text-sm mb-1">New Password</label>
              <Input
                type="password"
                name="newPassword"
                className="w-full border rounded-lg p-2 focus:ring focus:ring-blue-200"
              />
            </div>
            <div className="input-container">
              <label className="block text-sm mb-1">Confirm New Password</label>
              <Input
                type="password"
                name="confirmPassword"
                className="w-full border rounded-lg p-2 focus:ring focus:ring-blue-200"
              />
            </div>
          </div>
          <div className="flex justify-end rounded-b-[16px] p-5 bg-[#1985B3]">
            <button
              type="submit"
              className="px-4 py-2 bg-[#043d73] text-white text-sm rounded-lg hover:bg-blue-700"
            >
              Change password
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default Profile;
