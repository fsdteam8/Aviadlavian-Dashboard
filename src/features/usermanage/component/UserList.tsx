"use client";
import React, { useState } from "react";
import Image from "next/image";
import {
  Search,
  ChevronLeft,
  ChevronRight,
  Eye,
  Trash2,
  ChevronDown,
} from "lucide-react";
import { useUserList } from "../hooks/useUserList";
import { User, UserProfileImage } from "../types/usermanage.types";
import UserViewModal from "./UserViewModal";

const UserList = () => {
  const { data, isLoading, isError } = useUserList();
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const users = data?.data || [];
  const itemsPerPage = 6;

  // Filter users by name or email
  const filteredUsers = users.filter((user) => {
    const fullName =
      `${user.FirstName || ""} ${user.LastName || ""}`.toLowerCase();
    const email = (user.email || "").toLowerCase();
    const search = searchTerm.toLowerCase();
    return fullName.includes(search) || email.includes(search);
  });

  const totalPages = Math.max(
    1,
    Math.ceil(filteredUsers.length / itemsPerPage),
  );
  const currentUsers = filteredUsers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  // Helper to extract avatar
  const getAvatarUrl = (user: User) => {
    if (user.profileImage && !Array.isArray(user.profileImage)) {
      return (user.profileImage as UserProfileImage).secure_url;
    }
    return null;
  };

  const getFullName = (user: User) => {
    if (user.FirstName || user.LastName) {
      return `${user.FirstName || ""} ${user.LastName || ""}`.trim();
    }
    return "Unknown User";
  };

  const renderTableBody = () => {
    if (isLoading) {
      return (
        <tr>
          <td colSpan={4} className="py-8 text-center text-slate-500">
            Loading users...
          </td>
        </tr>
      );
    }
    if (isError) {
      return (
        <tr>
          <td colSpan={4} className="py-8 text-center text-red-500">
            Error loading users.
          </td>
        </tr>
      );
    }
    if (currentUsers.length === 0) {
      return (
        <tr>
          <td colSpan={4} className="py-8 text-center text-slate-500">
            No users found.
          </td>
        </tr>
      );
    }

    return currentUsers.map((user, index) => {
      const isEven = index % 2 !== 0; // matching alternating pattern
      const avatar = getAvatarUrl(user);

      return (
        <tr
          key={user._id}
          className={`${isEven ? "bg-[#f8f9fa]" : "bg-white"}`}
        >
          <td className="py-4 px-6">
            <div className="flex items-center gap-3">
              {avatar && (
                <Image
                  src={avatar}
                  alt={user.FirstName || "User"}
                  width={40}
                  height={40}
                  className="rounded-full object-cover shadow-sm"
                />
              )}
              {!avatar && (
                <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center text-slate-500 font-bold shadow-sm">
                  {(user.FirstName?.[0] || user.email[0]).toUpperCase()}
                </div>
              )}
              <span className="font-medium text-slate-700">
                {getFullName(user)}
              </span>
            </div>
          </td>
          <td className="py-4 px-6 text-slate-600">{user.email}</td>
          <td className="py-4 px-6 text-center text-slate-600">
            {user.country || "—"}
          </td>
          <td className="py-4 px-6">
            <div className="flex items-center justify-center gap-4">
              <button
                onClick={() => {
                  setSelectedUser(user);
                  setIsViewModalOpen(true);
                }}
                className="text-[#24b4a5] hover:text-[#1f9b8e] transition-colors p-2 hover:bg-teal-50 rounded-full"
              >
                <Eye className="w-5 h-5" />
              </button>
              <button className="text-red-500 hover:text-red-600 transition-colors p-2 hover:bg-red-50 rounded-full">
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          </td>
        </tr>
      );
    });
  };

  return (
    <div className="w-full font-sans max-w-7xl mx-auto px-6 py-8">
      {/* Header Area */}
      <h1 className="text-3xl font-bold text-slate-900 mb-8">Users</h1>

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <h2 className="text-xl font-bold text-slate-800">Users Name</h2>

        <div className="flex items-center gap-4 w-full sm:w-auto">
          {/* Search Box */}
          <div className="relative w-full sm:w-[400px]">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-slate-400" />
            </div>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search here"
              className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-full bg-slate-50 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white transition-colors"
            />
          </div>

          {/* Filter Button */}
          <button className="bg-[#24b4a5] hover:bg-[#1f9b8e] text-white px-6 py-2 rounded-lg flex items-center gap-2 font-medium transition-colors whitespace-nowrap">
            Filter <ChevronDown className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Table Area */}
      <div className="w-full overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[800px]">
          <thead>
            <tr className="border-b border-slate-100">
              <th className="py-4 px-6 font-bold text-slate-800 w-[30%]">
                User Name
              </th>
              <th className="py-4 px-6 font-bold text-slate-800 w-[30%]">
                Email Address
              </th>
              <th className="py-4 px-6 font-bold text-slate-800 text-center w-[20%]">
                Country
              </th>
              <th className="py-4 px-6 font-bold text-slate-800 text-center w-[20%]">
                Action
              </th>
            </tr>
          </thead>
          <tbody>{renderTableBody()}</tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      {!isLoading && !isError && totalPages > 0 && (
        <div className="flex justify-end items-center gap-2 mt-8">
          <button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="w-10 h-10 rounded-full border border-slate-200 flex items-center justify-center text-[#24b4a5] hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          {Array.from({ length: totalPages }).map((_, i) => {
            const page = i + 1;
            // Simplified pagination rendering: Show 1, 2, 3, current, last based on screenshot
            if (page <= 3 || page === totalPages || page === currentPage) {
              return (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`w-10 h-10 rounded-full text-sm font-medium transition-colors flex items-center justify-center
                      ${
                        currentPage === page
                          ? "bg-[#24b4a5] text-white shadow-md shadow-teal-500/20 border-transparent"
                          : "border border-slate-200 text-[#24b4a5] hover:bg-slate-50"
                      }`}
                >
                  {page}
                </button>
              );
            }
            if (page === 4 && totalPages > 5) {
              return (
                <span key="dots" className="text-slate-400 px-1">
                  ...
                </span>
              );
            }
            return null;
          })}

          <button
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="w-10 h-10 rounded-full border border-slate-200 flex items-center justify-center text-[#24b4a5] hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
};

export default UserList;
