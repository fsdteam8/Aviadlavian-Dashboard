import React, { useState } from "react";
import { X } from "lucide-react";
import { User } from "../types/usermanage.types";

interface UserViewModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: User | null;
}

const UserViewModalContent = ({
  onClose,
  user,
}: {
  onClose: () => void;
  user: User;
}) => {
  const [formData, setFormData] = useState({
    FirstName: user.FirstName || "",
    LastName: user.LastName || "",
    email: user.email || "",
    role: user.role || "user",
    country: user.country || "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    // API not hooked up yet, simulate a save operation
    console.log("Saving user data:", formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm transition-all duration-300">
      <div
        className="bg-white rounded-2xl shadow-xl w-full max-w-xl overflow-hidden animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <h2 className="text-xl font-bold text-slate-800">
            Edit User Details
          </h2>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body: Editable Form */}
        <div className="p-6 space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label
                htmlFor="FirstName"
                className="text-sm font-medium text-slate-700"
              >
                First Name
              </label>
              <input
                id="FirstName"
                name="FirstName"
                value={formData.FirstName}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 transition-shadow bg-slate-50 focus:bg-white"
                placeholder="Enter First Name"
              />
            </div>
            <div className="space-y-2">
              <label
                htmlFor="LastName"
                className="text-sm font-medium text-slate-700"
              >
                Last Name
              </label>
              <input
                id="LastName"
                name="LastName"
                value={formData.LastName}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 transition-shadow bg-slate-50 focus:bg-white"
                placeholder="Enter Last Name"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label
              htmlFor="email"
              className="text-sm font-medium text-slate-700"
            >
              Email Address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 transition-shadow bg-slate-50 focus:bg-white"
              placeholder="Enter Email"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label
                htmlFor="role"
                className="text-sm font-medium text-slate-700"
              >
                Role
              </label>
              <input
                id="role"
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 transition-shadow bg-slate-50 focus:bg-white"
                placeholder="Ex: user, admin"
              />
            </div>
            <div className="space-y-2">
              <label
                htmlFor="country"
                className="text-sm font-medium text-slate-700"
              >
                Country
              </label>
              <input
                id="country"
                name="country"
                value={formData.country}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 transition-shadow bg-slate-50 focus:bg-white"
                placeholder="Enter Country"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Modal Footer */}
      <div className="flex justify-end items-center gap-3 px-6 py-4 border-t border-slate-100 bg-slate-50/50">
        <button
          onClick={onClose}
          className="px-5 py-2 rounded-lg text-slate-600 font-medium hover:bg-slate-200 transition-colors"
        >
          Cancel
        </button>
        <button
          onClick={handleSave}
          className="px-5 py-2 rounded-lg bg-[#24b4a5] hover:bg-[#1f9b8e] text-white font-medium transition-colors shadow-sm"
        >
          Save Changes
        </button>
      </div>
    </div>
  );
};

const UserViewModal = ({ isOpen, onClose, user }: UserViewModalProps) => {
  if (!isOpen || !user) return null;
  return (
    <UserViewModalContent
      onClose={onClose}
      user={user}
      key={user.email || "modal"}
    />
  );
};

export default UserViewModal;
