"use client";

import React, { useMemo, useState } from "react";
import {
  User,
  MessageSquare,
  FileText,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  useTopPerformingStudents,
  useOverviewProgress,
} from "./hooks/useTopPerformingStudents";

const OverView = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const limit = 8;

  const { data: progressData, isLoading: progressLoading } =
    useOverviewProgress();
  const { data, isLoading, isError, isFetching } = useTopPerformingStudents(
    currentPage,
    limit,
  );

  const statCards = [
    {
      title: "Total Users",
      value: progressData?.data?.totalUsers?.toString() ?? "0",
      icon: User,
      bgColor: "bg-blue-50",
      iconBgColor: "bg-blue-500",
      textColor: "text-blue-600",
      isLoading: progressLoading,
    },
    {
      title: "Questions & Answers",
      value: progressData?.data?.totalQuestions?.toString() ?? "0",
      icon: MessageSquare,
      bgColor: "bg-green-50",
      iconBgColor: "bg-green-500",
      textColor: "text-green-600",
      isLoading: progressLoading,
    },
    {
      title: "Total Articles",
      value: progressData?.data?.totalArticles?.toString() ?? "0",
      icon: FileText,
      bgColor: "bg-red-50",
      iconBgColor: "bg-red-400",
      textColor: "text-red-500",
      isLoading: progressLoading,
    },
  ];

  const totalPages = Math.max(data?.data?.meta?.totalPage ?? 1, 1);

  const currentStudents = useMemo(() => {
    return (data?.data?.data ?? []).map((student) => {
      return {
        id: student._id,
        name: student.name,
        avatar: student.profileImage,
        lessons: student.totalQuestions,
        quizzes: student.totalQuizzes,
        progress: student.performance,
      };
    });
  }, [data]);
  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const renderPageNumbers = () => {
    const pages: Array<number | string> = [];

    pages.push(1);

    if (currentPage > 3) {
      pages.push("...");
    }

    for (
      let i = Math.max(2, currentPage - 1);
      i <= Math.min(totalPages - 1, currentPage + 1);
      i++
    ) {
      if (i !== 1 && i !== totalPages) {
        pages.push(i);
      }
    }

    if (currentPage < totalPages - 2) {
      pages.push("...");
    }

    if (totalPages > 1) {
      pages.push(totalPages);
    }

    return pages;
  };

  return (
    <section className="w-full p-6 transition-colors dark:text-slate-100">
      <div className="mx-auto space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
            Dashboard
          </h1>
        </div>

        {/* Stat Cards */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {statCards.map((stat) => {
            const Icon = stat.icon;
            return (
              <div
                key={stat.title}
                className={`rounded-2xl ${stat.bgColor} p-6 shadow-sm`}
              >
                <div className="flex items-center gap-4">
                  <div
                    className={`flex h-16 w-16 items-center justify-center rounded-xl ${stat.iconBgColor}`}
                  >
                    <Icon className="h-8 w-8 text-white" />
                  </div>
                  <div>
                    <p className={`text-sm font-medium ${stat.textColor}`}>
                      {stat.title}
                    </p>
                    {stat.isLoading ? (
                      <Skeleton className="h-9 w-20 mt-1" />
                    ) : (
                      <p className={`text-3xl font-bold ${stat.textColor}`}>
                        {stat.value}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Top Performing Students */}
        <div className="rounded-2xl bg-white p-6 shadow-sm dark:bg-slate-900">
          <h2 className="mb-6 text-xl font-semibold text-slate-900 dark:text-slate-100">
            Top Performing Students
          </h2>

          {/* Students List */}
          <div className="space-y-4">
            {isLoading ? (
              Array.from({ length: limit }).map((_, index) => (
                <div
                  key={`student-skeleton-${index}`}
                  className="flex items-center justify-between border-b border-slate-100 pb-4 last:border-b-0 dark:border-slate-800"
                >
                  <div className="flex items-center gap-3">
                    <Skeleton className="h-10 w-10 rounded-full" />
                    <Skeleton className="h-4 w-36" />
                  </div>
                  <div className="flex items-center gap-8">
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-4 w-20" />
                    <div className="flex items-center gap-3">
                      <Skeleton className="h-2 w-32 rounded-full" />
                      <Skeleton className="h-4 w-10" />
                    </div>
                  </div>
                </div>
              ))
            ) : isError ? (
              <div className="py-6 text-center text-sm text-red-500">
                Failed to load top performing students.
              </div>
            ) : currentStudents.length === 0 ? (
              <div className="py-6 text-center text-sm text-slate-500 dark:text-slate-400">
                No top performing students found.
              </div>
            ) : (
              currentStudents.map((student) => {
                const clampedProgress = Math.min(
                  Math.max(student.progress, 0),
                  100,
                );

                return (
                  <div
                    key={student.id}
                    className="flex items-center justify-between border-b border-slate-100 pb-4 last:border-b-0 dark:border-slate-800"
                  >
                    {/* Student Info */}
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={student.avatar} alt={student.name} />
                        <AvatarFallback>SN</AvatarFallback>
                      </Avatar>
                      <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                        {student.name}
                      </span>
                    </div>

                    {/* Stats */}
                    <div className="flex items-center gap-8">
                      <span className="text-sm text-slate-600 dark:text-slate-400">
                        {student.lessons} Questions
                      </span>
                      <span className="text-sm text-slate-600 dark:text-slate-400">
                        {student.quizzes} quizzes
                      </span>

                      {/* Progress Bar */}
                      <div className="flex items-center gap-3">
                        <div className="h-2 w-32 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700">
                          <div
                            className="h-full bg-teal-500"
                            style={{ width: `${clampedProgress}%` }}
                          />
                        </div>
                        <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                          {clampedProgress}%
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Pagination */}
          <div className="mt-6 flex items-center justify-end gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1 || isLoading || isFetching}
              className="h-10 w-10 rounded-full"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>

            {renderPageNumbers().map((page, index) => (
              <React.Fragment key={index}>
                {page === "..." ? (
                  <span className="px-2 text-slate-400">...</span>
                ) : (
                  <Button
                    variant={currentPage === page ? "default" : "ghost"}
                    size="icon"
                    onClick={() => handlePageChange(page as number)}
                    disabled={isLoading || isFetching}
                    className={`h-10 w-10 rounded-full ${
                      currentPage === page
                        ? "bg-teal-500 text-white hover:bg-teal-600"
                        : ""
                    }`}
                  >
                    {page}
                  </Button>
                )}
              </React.Fragment>
            ))}

            <Button
              variant="ghost"
              size="icon"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={
                currentPage === totalPages ||
                isLoading ||
                isFetching ||
                currentStudents.length === 0
              }
              className="h-10 w-10 rounded-full"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default OverView;
