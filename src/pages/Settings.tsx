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
      <h4 className="text-3xl font-bold text-foreground">Settings</h4>
      {/* Security settings form */}
      <form onSubmit={handleSubmit} className="mt-6">
        <div className="rounded-2xl border border-gray-200 bg-white shadow-sm">
          <div className="px-4 py-3 flex justify-between items-center bg-[#043d73] rounded-t-2xl">
            <div className="text-white font-medium">Password reset</div>
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
