import React from "react";
import Image from "next/image";
import { X, Loader2 } from "lucide-react";
import { useSingleUser } from "../hooks/useSingleUser";
import { UserProfileImage } from "../types/usermanage.types";

interface UserViewModalProps {
  isOpen: boolean;
  onClose: () => void;
  userId: string | null;
}

const UserViewModalContent = ({
  onClose,
  userId,
}: {
  onClose: () => void;
  userId: string;
}) => {
  const { data, isLoading, isError } = useSingleUser(userId);
  const user = data?.data;

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="w-8 h-8 text-[#24b4a5] animate-spin" />
          <span className="ml-3 text-slate-500">Loading user details...</span>
        </div>
      );
    }

    if (isError || !user) {
      return (
        <div className="flex items-center justify-center py-16">
          <span className="text-red-500">Failed to load user details.</span>
        </div>
      );
    }

    const firstName = user.FirstName || user.firstName || "";
    const lastName = user.LastName || user.lastName || "";

    const hasImage =
      user.profileImage &&
      !Array.isArray(user.profileImage) &&
      (user.profileImage as UserProfileImage).secure_url;
    const imageUrl = hasImage
      ? (user.profileImage as UserProfileImage).secure_url
      : null;
    const initials =
      `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase() || "??";

    const fields = [
      { label: "First Name", value: firstName },
      { label: "Last Name", value: lastName },
      { label: "Email Address", value: user.email },
      { label: "Role", value: user.role },
      { label: "Country", value: user.country },
      { label: "Status", value: user.status },
      { label: "Address", value: user.address },
      { label: "Institute Name", value: user.instituteName },
      { label: "ID Number", value: user.idNumber },
      { label: "Registration Number", value: user.registrationNumber },
      {
        label: "Date of Birth",
        value: user.dateOfBirth
          ? new Date(user.dateOfBirth).toLocaleDateString()
          : undefined,
      },
      {
        label: "Verified",
        value:
          user.isVerified !== undefined
            ? user.isVerified
              ? "Yes"
              : "No"
            : undefined,
      },
    ];

    return (
      <div className="p-6 space-y-5">
        {/* Avatar */}
        <div className="flex justify-center">
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={`${firstName} ${lastName}`}
              width={96}
              height={96}
              className="w-24 h-24 rounded-full object-cover shadow-md border-2 border-slate-100"
            />
          ) : (
            <div className="w-24 h-24 rounded-full bg-[#24b4a5] flex items-center justify-center text-white text-2xl font-bold shadow-md">
              {initials}
            </div>
          )}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {fields.map((field) => (
            <div key={field.label} className="space-y-1">
              <label className="text-sm font-medium text-slate-500">
                {field.label}
              </label>
              <p className="px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 min-h-[40px] flex items-center">
                {field.value || "—"}
              </p>
            </div>
          ))}
        </div>
      </div>
    );
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
          <h2 className="text-xl font-bold text-slate-800">User Details</h2>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        {renderContent()}

        {/* Modal Footer */}
        <div className="flex justify-end items-center gap-3 px-6 py-4 border-t border-slate-100 bg-slate-50/50">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-lg text-slate-600 font-medium hover:bg-slate-200 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

const UserViewModal = ({ isOpen, onClose, userId }: UserViewModalProps) => {
  if (!isOpen || !userId) return null;
  return (
    <UserViewModalContent onClose={onClose} userId={userId} key={userId} />
  );
};

export default UserViewModal;
