"use client";
import React, { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import {
  Search,
  ChevronLeft,
  ChevronRight,
  Eye,
  Trash2,
  ChevronDown,
  Loader2,
  AlertTriangle,
} from "lucide-react";
import { useUserList } from "../hooks/useUserList";
import { useDeleteUser } from "../hooks/useDeleteUser";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  createColumnHelper,
} from "@tanstack/react-table";
import { User, UserProfileImage } from "../types/usermanage.types";
import UserViewModal from "./UserViewModal";

const FILTER_OPTIONS = [
  { label: "All", value: "" },
  { label: "Active", value: "active" },
  { label: "Deactive", value: "deactive" },
  { label: "Blocked", value: "blocked" },
];

const ITEMS_PER_PAGE = 6;

const columnHelper = createColumnHelper<User>();

// Helper to extract avatar
const getAvatarUrl = (user: User) => {
  if (user.profileImage && !Array.isArray(user.profileImage)) {
    return (user.profileImage as UserProfileImage).secure_url;
  }
  return null;
};

const getFullName = (user: User) => {
  const first = user.FirstName || user.firstName || "";
  const last = user.LastName || user.lastName || "";
  const full = `${first} ${last}`.trim();
  return full || "Unknown User";
};

const UserList = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [filter, setFilter] = useState("");
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);

  // Delete confirmation state
  const [deleteTarget, setDeleteTarget] = useState<User | null>(null);
  const { mutate: deleteUserMutate, isPending: isDeleting } = useDeleteUser();

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
      setCurrentPage(1); // Reset to page 1 on search change
    }, 300);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Reset to page 1 on filter change
  const handleFilterChange = useCallback((value: string) => {
    setFilter(value);
    setCurrentPage(1);
    setIsFilterOpen(false);
  }, []);

  const { data, isLoading, isError } = useUserList({
    page: currentPage,
    limit: ITEMS_PER_PAGE,
    search: debouncedSearch,
    filter,
  });

  const users = data?.data || [];
  const meta = data?.meta;
  const totalPages = meta?.totalPages || 1;

  const columns = React.useMemo(
    () => [
      columnHelper.accessor((row) => row, {
        id: "userName",
        header: "User Name",
        cell: (info) => {
          const user = info.getValue();
          const avatar = getAvatarUrl(user);
          return (
            <div className="flex items-center gap-3">
              {avatar && (
                <Image
                  src={avatar}
                  alt={user.FirstName || user.firstName || "User"}
                  width={40}
                  height={40}
                  className="rounded-full object-cover shadow-sm"
                />
              )}
              {!avatar && (
                <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center text-slate-500 font-bold shadow-sm">
                  {(
                    user.FirstName?.[0] ||
                    user.firstName?.[0] ||
                    user.email[0]
                  ).toUpperCase()}
                </div>
              )}
              <span className="font-medium text-slate-700">
                {getFullName(user)}
              </span>
            </div>
          );
        },
        meta: { width: "30%" },
      }),
      columnHelper.accessor("email", {
        header: "Email Address",
        cell: (info) => (
          <span className="text-slate-600">{info.getValue()}</span>
        ),
        meta: { width: "30%" },
      }),
      columnHelper.accessor("country", {
        header: "Country",
        cell: (info) => (
          <span className="text-slate-600">{info.getValue() || "—"}</span>
        ),
        meta: { width: "20%", align: "center" },
      }),
      columnHelper.accessor((row) => row, {
        id: "actions",
        header: "Action",
        cell: (info) => {
          const user = info.getValue();
          return (
            <div className="flex items-center justify-center gap-4">
              <button
                onClick={() => {
                  setSelectedUserId(user._id);
                  setIsViewModalOpen(true);
                }}
                className="text-[#24b4a5] hover:text-[#1f9b8e] transition-colors p-2 hover:bg-teal-50 rounded-full"
              >
                <Eye className="w-5 h-5" />
              </button>
              <button
                onClick={() => setDeleteTarget(user)}
                className="text-red-500 hover:text-red-600 transition-colors p-2 hover:bg-red-50 rounded-full"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          );
        },
        meta: { width: "20%", align: "center" },
      }),
    ],
    [],
  );

  const table = useReactTable({
    data: users,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  const activeFilterLabel =
    FILTER_OPTIONS.find((f) => f.value === filter)?.label || "Filter";

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

          {/* Filter Dropdown */}
          <div className="relative">
            <button
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className="bg-[#24b4a5] hover:bg-[#1f9b8e] text-white px-6 py-2 rounded-lg flex items-center gap-2 font-medium transition-colors whitespace-nowrap"
            >
              {activeFilterLabel} <ChevronDown className="w-4 h-4" />
            </button>
            {isFilterOpen && (
              <div className="absolute right-0 mt-2 w-40 bg-white rounded-lg shadow-lg border border-slate-200 z-10 overflow-hidden">
                {FILTER_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => handleFilterChange(opt.value)}
                    className={`w-full px-4 py-2 text-left text-sm hover:bg-slate-50 transition-colors ${
                      filter === opt.value
                        ? "bg-teal-50 text-[#24b4a5] font-medium"
                        : "text-slate-700"
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Table Area */}
      <div className="w-full overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[800px]">
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id} className="border-b border-slate-100">
                {headerGroup.headers.map((header) => {
                  const meta = header.column.columnDef.meta as
                    | { width?: string; align?: "left" | "center" | "right" }
                    | undefined;
                  return (
                    <th
                      key={header.id}
                      className="py-4 px-6 font-bold text-slate-800"
                      style={{
                        width: meta?.width,
                        textAlign: meta?.align || "left",
                      }}
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                    </th>
                  );
                })}
              </tr>
            ))}
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={4} className="py-8 text-center text-slate-500">
                  Loading users...
                </td>
              </tr>
            ) : isError ? (
              <tr>
                <td colSpan={4} className="py-8 text-center text-red-500">
                  Error loading users.
                </td>
              </tr>
            ) : users.length === 0 ? (
              <tr>
                <td colSpan={4} className="py-8 text-center text-slate-500">
                  No users found.
                </td>
              </tr>
            ) : (
              table.getRowModel().rows.map((row) => (
                <tr
                  key={row.id}
                  className={`${
                    row.index % 2 !== 0 ? "bg-[#f8f9fa]" : "bg-white"
                  }`}
                >
                  {row.getVisibleCells().map((cell) => {
                    const meta = cell.column.columnDef.meta as
                      | { width?: string; align?: "left" | "center" | "right" }
                      | undefined;
                    return (
                      <td
                        key={cell.id}
                        className="py-4 px-6"
                        style={{ textAlign: meta?.align || "left" }}
                      >
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext(),
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))
            )}
          </tbody>
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

      {/* User View Modal */}
      <UserViewModal
        isOpen={isViewModalOpen}
        onClose={() => {
          setIsViewModalOpen(false);
          setSelectedUserId(null);
        }}
        userId={selectedUserId}
      />

      {/* Delete Confirmation Modal */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div
            className="bg-white rounded-2xl shadow-xl w-full max-w-sm overflow-hidden animate-in fade-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6 text-center space-y-4">
              <div className="mx-auto w-14 h-14 rounded-full bg-red-50 flex items-center justify-center">
                <AlertTriangle className="w-7 h-7 text-red-500" />
              </div>
              <h3 className="text-lg font-bold text-slate-800">Delete User?</h3>
              <p className="text-sm text-slate-500">
                Are you sure you want to delete{" "}
                <span className="font-semibold text-slate-700">
                  {getFullName(deleteTarget)}
                </span>
                ? This action cannot be undone.
              </p>
            </div>
            <div className="flex border-t border-slate-100">
              <button
                onClick={() => setDeleteTarget(null)}
                disabled={isDeleting}
                className="flex-1 px-4 py-3 text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={() =>
                  deleteUserMutate(deleteTarget._id, {
                    onSuccess: () => setDeleteTarget(null),
                  })
                }
                disabled={isDeleting}
                className="flex-1 px-4 py-3 text-sm font-medium text-white bg-red-500 hover:bg-red-600 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isDeleting && <Loader2 className="w-4 h-4 animate-spin" />}
                {isDeleting ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserList;
