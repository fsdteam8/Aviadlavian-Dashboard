"use client";

import React, { useState, useMemo } from "react";
import {
  Eye,
  Pencil,
  Search,
  Trash2,
  X,
  ChevronDown,
  Plus,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import AddArticleModal from "../common/AddArticleModal";
import ViewArticleModal from "../common/ViewArticleModal";
import EditArticleModal from "../common/EditArticleModal";
import { useArticles } from "../hooks/useArticles";
import { useDeleteArticle } from "../hooks/useDeleteArticle";
import { useDebounce } from "@/hooks/use-debounce";
import { LibraryTopic } from "../api/article.api";
import { toast } from "sonner";

/**
 * Utility to parse and clean values from data (handles arrays, comma-separated strings, etc.)
 */
const parseValues = (val: string | string[] | undefined): string[] => {
  if (!val) return [];
  if (Array.isArray(val)) {
    return val.flatMap((v) => parseValues(v));
  }
  if (typeof val === "string") {
    return val
      .split(/[,/]/)
      .map((s) => s.trim())
      .filter(Boolean);
  }
  return [String(val)];
};

const AllArticles = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState("");
  const [activeFilters, setActiveFilters] = useState<Record<string, string[]>>(
    {},
  );

  const debouncedSearch = useDebounce(search, 500);
  const limit = 8;

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedArticleId, setSelectedArticleId] = useState<string | null>(
    null,
  );
  const [articleToDeleteId, setArticleToDeleteId] = useState<string | null>(
    null,
  );

  // Fetch articles
  const { data, isLoading, refetch } = useArticles(
    currentPage,
    limit,
    debouncedSearch,
  );
  const deleteArticleMutation = useDeleteArticle();

  const articlesRaw = useMemo(() => data?.data ?? [], [data?.data]);
  const totalPages = data?.meta?.pages || 1;
  const total = data?.meta?.total || 0;

  /**
   * 1. Detect dynamic filterable fields and their unique values from current data
   */
  const dynamicFilters = useMemo(() => {
    if (!articlesRaw.length) return [];

    const fieldMap: Record<string, Set<string>> = {
      Speciality: new Set(),
      "Body Area": new Set(),
      Acuity: new Set(),
      Importance: new Set(),
      "Age Group": new Set(),
      "Tissue Type": new Set(),
      "Common Sports": new Set(),
    };

    articlesRaw.forEach((article) => {
      article.topicIds?.forEach((topic: LibraryTopic) => {
        if (topic.Name) fieldMap["Speciality"].add(topic.Name);
        parseValues(topic.Primary_Body_Region).forEach((v) =>
          fieldMap["Body Area"].add(v),
        );
        parseValues(topic.Secondary_Body_Region).forEach((v) =>
          fieldMap["Body Area"].add(v),
        );
        if (topic.Acuity)
          parseValues(topic.Acuity).forEach((v) => fieldMap["Acuity"].add(v));
        if (topic.Importance_Level)
          parseValues(topic.Importance_Level).forEach((v) =>
            fieldMap["Importance"].add(v),
          );
        if (topic.Age_Group)
          parseValues(topic.Age_Group).forEach((v) =>
            fieldMap["Age Group"].add(v),
          );
        if (topic.Tissue_Type)
          parseValues(topic.Tissue_Type).forEach((v) =>
            fieldMap["Tissue Type"].add(v),
          );
        if (topic.Common_Sports)
          parseValues(topic.Common_Sports).forEach((v) =>
            fieldMap["Common Sports"].add(v),
          );
      });
    });

    return Object.entries(fieldMap)
      .map(([name, values]) => ({
        name,
        options: Array.from(values).sort(),
      }))
      .filter((f) => f.options.length > 0);
  }, [articlesRaw]);

  /**
   * 2. Apply dynamic filtering on client side
   */
  const filteredArticles = useMemo(() => {
    return articlesRaw.filter((article) => {
      for (const [filterName, selectedValues] of Object.entries(
        activeFilters,
      )) {
        if (selectedValues.length === 0) continue;

        const articleValues =
          article.topicIds?.flatMap((topic) => {
            switch (filterName) {
              case "Speciality":
                return [topic.Name];
              case "Body Area":
                return [
                  ...parseValues(topic.Primary_Body_Region),
                  ...parseValues(topic.Secondary_Body_Region),
                ];
              case "Acuity":
                return parseValues(topic.Acuity);
              case "Importance":
                return parseValues(topic.Importance_Level);
              case "Age Group":
                return parseValues(topic.Age_Group);
              case "Tissue Type":
                return parseValues(topic.Tissue_Type);
              case "Common Sports":
                return parseValues(topic.Common_Sports);
              default:
                return [];
            }
          }) || [];

        const hasMatch = selectedValues.some((val) =>
          articleValues.includes(val),
        );
        if (!hasMatch) return false;
      }
      return true;
    });
  }, [articlesRaw, activeFilters]);

  const toggleFilter = (name: string, value: string) => {
    setActiveFilters((prev) => {
      const current = prev[name] ?? [];
      const updated = current.includes(value)
        ? current.filter((v) => v !== value)
        : [...current, value];

      const newFilters = { ...prev, [name]: updated };
      if (updated.length === 0) delete newFilters[name];
      return newFilters;
    });
    setCurrentPage(1);
  };

  const clearFilters = () => {
    setActiveFilters({});
    setSearch("");
    setCurrentPage(1);
  };

  const handleDeleteClick = (id: string) => {
    setArticleToDeleteId(id);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (!articleToDeleteId) return;

    deleteArticleMutation.mutate(articleToDeleteId, {
      onSuccess: () => {
        toast.success("Article deleted successfully!");
        setIsDeleteModalOpen(false);
        setArticleToDeleteId(null);
      },
      onError: (error: Error) => {
        toast.error(error.message || "Failed to delete article");
      },
    });
  };

  const handleView = (articleId: string) => {
    setSelectedArticleId(articleId);
    setIsViewModalOpen(true);
  };

  const handleEdit = (articleId: string) => {
    setSelectedArticleId(articleId);
    setIsEditModalOpen(true);
  };

  return (
    <div className="w-full">
      <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm dark:bg-slate-900 dark:border-slate-800">
        <div className="flex justify-between items-center mb-5">
          <h2 className="text-xl font-bold text-gray-800 dark:text-slate-100">
            Articles
          </h2>
          <Button
            onClick={() => setIsAddModalOpen(true)}
            className="bg-[#2EB8A3] hover:bg-[#26a591] text-white flex items-center gap-2 px-6 py-2 rounded-lg"
          >
            <Plus size={18} /> Add New
          </Button>
        </div>

        {/* Filter bar */}
        <div className="mb-6 space-y-4">
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative flex-1 max-w-sm">
              <Search
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
              />
              <Input
                placeholder="Search articles…"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setCurrentPage(1);
                }}
                className="pl-9 border-gray-200 focus-visible:ring-[#2EB8A3] dark:border-slate-800 dark:bg-slate-950"
              />
              {search && (
                <button
                  onClick={clearFilters}
                  className="absolute cursor-pointer right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <X size={14} />
                </button>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-3">
              {dynamicFilters.map((filter) => (
                <DropdownMenu key={filter.name}>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="outline"
                      className="h-10 border-gray-200 focus:ring-[#2EB8A3] dark:border-slate-800 dark:bg-slate-950 font-normal"
                    >
                      {activeFilters[filter.name]?.length > 0
                        ? `${filter.name} (${activeFilters[filter.name].length})`
                        : filter.name}
                      <ChevronDown className="ml-2 h-4 w-4 opacity-50" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="max-h-[300px] w-56 overflow-y-auto rounded-xl">
                    <DropdownMenuLabel>
                      Filter by {filter.name}
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    {filter.options.map((opt) => (
                      <DropdownMenuCheckboxItem
                        key={opt}
                        checked={activeFilters[filter.name]?.includes(opt)}
                        onCheckedChange={() => toggleFilter(filter.name, opt)}
                        onSelect={(e) => e.preventDefault()}
                      >
                        {opt}
                      </DropdownMenuCheckboxItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              ))}

              {(Object.keys(activeFilters).length > 0 || search) && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearFilters}
                  className="text-gray-500 hover:text-red-500 gap-1.5"
                >
                  <X size={14} /> Clear filters
                </Button>
              )}
            </div>
          </div>

          {/* Active Badges */}
          {Object.keys(activeFilters).length > 0 && (
            <div className="flex flex-wrap gap-2 pt-1">
              {Object.entries(activeFilters).map(([name, values]) =>
                values.map((val) => (
                  <Badge
                    key={`${name}-${val}`}
                    variant="secondary"
                    className="bg-teal-50 text-teal-700 dark:bg-teal-900/30 dark:text-teal-400 border-teal-100 dark:border-teal-800/50 flex items-center gap-1.5 py-1 px-2.5"
                  >
                    <span className="opacity-60 text-[10px] uppercase font-bold mr-1">
                      {name}:
                    </span>
                    {val}
                    <button
                      onClick={() => toggleFilter(name, val)}
                      className="hover:text-teal-900 dark:hover:text-teal-200 transition-colors"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                )),
              )}
            </div>
          )}
        </div>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="text-left border-b border-gray-100 dark:border-slate-800">
                <th className="pb-4 font-semibold text-gray-600 dark:text-slate-400 px-4">
                  Article Name
                </th>
                <th className="pb-4 font-semibold text-gray-600 dark:text-slate-400 text-center">
                  Article ID
                </th>
                <th className="pb-4 font-semibold text-gray-600 dark:text-slate-400 text-center">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 dark:divide-slate-800">
              {isLoading
                ? Array.from({ length: 5 }).map((_, idx) => (
                    <tr key={`skeleton-${idx}`}>
                      <td className="py-4 px-4">
                        <Skeleton className="h-5 w-3/4" />
                      </td>
                      <td className="py-4">
                        <Skeleton className="h-5 w-24 mx-auto" />
                      </td>
                      <td className="py-4">
                        <div className="flex justify-center items-center gap-3">
                          <Skeleton className="h-8 w-8 rounded-md" />
                          <Skeleton className="h-8 w-8 rounded-md" />
                          <Skeleton className="h-8 w-8 rounded-md" />
                        </div>
                      </td>
                    </tr>
                  ))
                : filteredArticles.map((article) => (
                    <tr
                      key={article._id}
                      className="hover:bg-gray-50/50 dark:hover:bg-slate-800/50 transition-colors"
                    >
                      <td className="py-4 px-4 text-gray-700 dark:text-slate-300">
                        <div
                          className="line-clamp-2 max-w-md prose prose-sm dark:prose-invert"
                          dangerouslySetInnerHTML={{
                            __html: article?.name || "",
                          }}
                        />
                      </td>
                      <td className="py-4 text-center text-gray-600 dark:text-slate-400 font-mono text-xs uppercase">
                        {article?.topicIds?.[0]?.Id || article._id.slice(-8)}
                      </td>
                      <td className="py-4">
                        <div className="flex justify-center items-center gap-3">
                          <button
                            onClick={() => handleView(article._id)}
                            className="text-teal-500 hover:text-teal-600 transition-colors"
                            title="View"
                          >
                            <Eye className="h-5 w-5" />
                          </button>
                          <button
                            onClick={() => handleEdit(article._id)}
                            className="text-teal-500 hover:text-teal-600 transition-colors"
                            title="Edit"
                          >
                            <Pencil className="h-5 w-5" />
                          </button>
                          <button
                            onClick={() => handleDeleteClick(article._id)}
                            disabled={deleteArticleMutation.isPending}
                            className="text-red-500 hover:text-red-600 transition-colors"
                            title="Delete"
                          >
                            <Trash2 className="h-5 w-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {data?.meta && data.meta.pages > 1 && (
          <div className="flex flex-col sm:flex-row justify-between items-center mt-8 pt-6 border-t border-gray-100 dark:border-slate-800 gap-4">
            <span className="text-sm text-gray-500 dark:text-slate-400">
              Showing {(currentPage - 1) * limit + 1} to{" "}
              {Math.min(currentPage * limit, total)} of {total} results
            </span>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="border-gray-200 text-gray-600 dark:border-slate-800 dark:text-slate-400 disabled:opacity-50"
              >
                <ChevronLeft size={16} className="mr-1" /> Previous
              </Button>
              <div className="flex items-center gap-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (p) => (
                    <button
                      key={p}
                      onClick={() => setCurrentPage(p)}
                      className={`w-8 h-8 rounded-md text-sm transition-colors ${
                        currentPage === p
                          ? "bg-[#2EB8A3] text-white"
                          : "text-gray-600 dark:text-slate-400 hover:bg-gray-100 dark:hover:bg-slate-800"
                      }`}
                    >
                      {p}
                    </button>
                  ),
                )}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  setCurrentPage((p) => Math.min(totalPages, p + 1))
                }
                disabled={currentPage === totalPages}
                className="border-gray-200 text-gray-600 dark:border-slate-800 dark:text-slate-400 disabled:opacity-50"
              >
                Next <ChevronRight size={16} className="ml-1" />
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Modals */}
      <AddArticleModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSuccess={() => refetch()}
      />

      <ViewArticleModal
        isOpen={isViewModalOpen}
        onClose={() => {
          setIsViewModalOpen(false);
          setSelectedArticleId(null);
        }}
        articleId={selectedArticleId}
      />

      <EditArticleModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedArticleId(null);
        }}
        articleId={selectedArticleId}
      />

      <Dialog
        open={isDeleteModalOpen}
        onOpenChange={(open) => {
          if (deleteArticleMutation.isPending) return;
          setIsDeleteModalOpen(open);
          if (!open) setArticleToDeleteId(null);
        }}
      >
        <DialogContent
          className="sm:max-w-md rounded-2xl"
          showCloseButton={false}
        >
          <DialogHeader>
            <DialogTitle>Delete Article</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this article? This action cannot
              be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsDeleteModalOpen(false);
                setArticleToDeleteId(null);
              }}
              disabled={deleteArticleMutation.isPending}
              className="rounded-lg"
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleConfirmDelete}
              disabled={deleteArticleMutation.isPending || !articleToDeleteId}
              className="rounded-lg"
            >
              {deleteArticleMutation.isPending ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AllArticles;
