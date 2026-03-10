import React, { useState, useRef } from "react";
import Image from "next/image";
import { X, Loader2, Pencil, Camera } from "lucide-react";
import { useSingleUser } from "../hooks/useSingleUser";
import { useUpdateUser } from "../hooks/useUpdateUser";
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
  const { mutate: updateUser, isPending: isSaving } = useUpdateUser(userId);
  const user = data?.data;

  const [isEditing, setIsEditing] = useState(false);
  const [editFirstName, setEditFirstName] = useState("");
  const [editLastName, setEditLastName] = useState("");
  const [editCountry, setEditCountry] = useState("");
  const [editStatus, setEditStatus] = useState("");
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleEnterEdit = () => {
    if (user) {
      setEditFirstName(user.FirstName || user.firstName || "");
      setEditLastName(user.LastName || user.lastName || "");
      setEditCountry(user.country || "");
      setEditStatus(user.status || "active");
      setSelectedImage(null);
      setImagePreview(null);
    }
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setSelectedImage(null);
    setImagePreview(null);
  };

  const handleSave = () => {
    updateUser(
      {
        FirstName: editFirstName || undefined,
        LastName: editLastName || undefined,
        country: editCountry || undefined,
        status: editStatus || undefined,
        image: selectedImage || undefined,
      },
      {
        onSuccess: () => {
          setIsEditing(false);
          setSelectedImage(null);
          setImagePreview(null);
        },
      },
    );
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

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
    const currentImageUrl = hasImage
      ? (user.profileImage as UserProfileImage).secure_url
      : null;
    const displayImageUrl = imagePreview || currentImageUrl;
    const initials =
      `${(isEditing ? editFirstName : firstName).charAt(0)}${(isEditing ? editLastName : lastName).charAt(0)}`.toUpperCase() ||
      "??";

    const readOnlyFields = [
      { label: "Email Address", value: user.email },
      { label: "Role", value: user.role },
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
      <div className="p-6 space-y-5 max-h-[70vh] overflow-y-auto">
        {/* Avatar */}
        <div className="flex justify-center">
          <div className="relative group">
            {displayImageUrl ? (
              <Image
                src={displayImageUrl}
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
            {isEditing && (
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
              >
                <Camera className="w-6 h-6 text-white" />
              </button>
            )}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImageSelect}
            />
          </div>
        </div>

        {/* Editable Fields */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {/* First Name */}
          <div className="space-y-1">
            <label className="text-sm font-medium text-slate-500">
              First Name
            </label>
            {isEditing ? (
              <input
                type="text"
                value={editFirstName}
                onChange={(e) => setEditFirstName(e.target.value)}
                className="w-full px-4 py-2 bg-white border border-slate-300 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#24b4a5] focus:border-transparent"
              />
            ) : (
              <p className="px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 min-h-[40px] flex items-center">
                {firstName || "—"}
              </p>
            )}
          </div>

          {/* Last Name */}
          <div className="space-y-1">
            <label className="text-sm font-medium text-slate-500">
              Last Name
            </label>
            {isEditing ? (
              <input
                type="text"
                value={editLastName}
                onChange={(e) => setEditLastName(e.target.value)}
                className="w-full px-4 py-2 bg-white border border-slate-300 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#24b4a5] focus:border-transparent"
              />
            ) : (
              <p className="px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 min-h-[40px] flex items-center">
                {lastName || "—"}
              </p>
            )}
          </div>

          {/* Country */}
          <div className="space-y-1">
            <label className="text-sm font-medium text-slate-500">
              Country
            </label>
            {isEditing ? (
              <input
                type="text"
                value={editCountry}
                onChange={(e) => setEditCountry(e.target.value)}
                className="w-full px-4 py-2 bg-white border border-slate-300 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#24b4a5] focus:border-transparent"
              />
            ) : (
              <p className="px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 min-h-[40px] flex items-center">
                {user.country || "—"}
              </p>
            )}
          </div>

          {/* Status */}
          <div className="space-y-1">
            <label className="text-sm font-medium text-slate-500">Status</label>
            {isEditing ? (
              <select
                value={editStatus}
                onChange={(e) => setEditStatus(e.target.value)}
                className="w-full px-4 py-2 bg-white border border-slate-300 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#24b4a5] focus:border-transparent"
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="blocked">Blocked</option>
              </select>
            ) : (
              <p className="px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 min-h-[40px] flex items-center">
                {user.status || "—"}
              </p>
            )}
          </div>
        </div>

        {/* Read-Only Fields */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {readOnlyFields.map((field) => (
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
          <h2 className="text-xl font-bold text-slate-800">
            {isEditing ? "Edit User" : "User Details"}
          </h2>
          <button
            onClick={onClose}
            disabled={isSaving}
            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors disabled:opacity-50"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        {renderContent()}

        {/* Modal Footer */}
        <div className="flex justify-end items-center gap-3 px-6 py-4 border-t border-slate-100 bg-slate-50/50">
          {isEditing ? (
            <>
              <button
                onClick={handleCancelEdit}
                disabled={isSaving}
                className="px-5 py-2 rounded-lg text-slate-600 font-medium hover:bg-slate-200 transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="px-5 py-2 rounded-lg bg-[#24b4a5] text-white font-medium hover:bg-[#1e9e91] transition-colors flex items-center gap-2 disabled:opacity-50"
              >
                {isSaving && <Loader2 className="w-4 h-4 animate-spin" />}
                {isSaving ? "Saving..." : "Save Changes"}
              </button>
            </>
          ) : (
            <>
              <button
                onClick={onClose}
                className="px-5 py-2 rounded-lg text-slate-600 font-medium hover:bg-slate-200 transition-colors"
              >
                Close
              </button>
              {!isLoading && !isError && user && (
                <button
                  onClick={handleEnterEdit}
                  className="px-5 py-2 rounded-lg bg-[#24b4a5] text-white font-medium hover:bg-[#1e9e91] transition-colors flex items-center gap-2"
                >
                  <Pencil className="w-4 h-4" />
                  Edit
                </button>
              )}
            </>
          )}
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
