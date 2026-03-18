"use client";

import Link from "next/link";
import React from "react";
import { ChevronRight, CirclePlay, PencilLine } from "lucide-react";

type SubLibraryProps = {
  libraryId: string;
};

type DemoChapter = {
  id: string;
  chapter: string;
  title: string;
  isHighlighted?: boolean;
};

const demoSubLibraryData = {
  sectionTitle: "Knee",
  category: "Text",
  topic: "Knee",
  selectedChapterTitle: "Distal It Band Syndrome",
  chapters: [
    {
      id: "chapter-01",
      chapter: "Chapter 01",
      title: "Distal It Band Syndrome",
    },
    {
      id: "chapter-02",
      chapter: "Chapter 02",
      title: "Patellar Tendinopathy",
      isHighlighted: true,
    },
    {
      id: "chapter-03",
      chapter: "Chapter 03",
      title: "Popliteus Tendinopathy",
    },
    {
      id: "chapter-04",
      chapter: "Chapter 04",
      title: "Extensor Mechanism Injuries",
    },
    {
      id: "chapter-05",
      chapter: "Chapter 05",
      title: "Quadriceps Tendon Rupture",
    },
    {
      id: "chapter-06",
      chapter: "Chapter 06",
      title: "Patellar Sleeve Fracture",
    },
    {
      id: "chapter-09",
      chapter: "Chapter 09",
      title: "Patellar Tendon Rupture",
    },
    {
      id: "chapter-10",
      chapter: "Chapter 10",
      title: "Epidemiology and Risk Factors",
    },
    {
      id: "chapter-11",
      chapter: "Chapter 11",
      title: "Epidemiology and Risk Factors",
    },
    {
      id: "chapter-12",
      chapter: "Chapter 12",
      title: "Epidemiology and Risk Factors",
    },
    {
      id: "chapter-13",
      chapter: "Chapter 13",
      title: "Epidemiology and Risk Factors",
    },
  ] as DemoChapter[],
};

const SubLibrary = ({ libraryId }: SubLibraryProps) => {
  const data = demoSubLibraryData;

  const chapterHref = (chapterId: string) =>
    `/library/${libraryId}/${chapterId}`;

  const selectedChapterId = data.chapters[0]?.id;

  return (
    <section className="w-full  rounded-2xl border border-slate-200/80 bg-white p-4 sm:p-5 dark:border-slate-700 dark:bg-slate-900">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="text-3xl font-semibold text-slate-900 dark:text-slate-100">
            {data.sectionTitle}
          </h2>
          <div className="mt-1 text-xs text-slate-600 dark:text-slate-300">
            <span className="text-emerald-700 dark:text-emerald-400">
              {data.category}
            </span>
            <span className="px-1">›</span>
            <span>{data.topic}</span>
            <span className="px-1">›</span>
            <span>{data.selectedChapterTitle}</span>
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 dark:border-slate-700 dark:bg-slate-800/60">
          <div className="flex items-start gap-2.5">
            <CirclePlay size={24} className="mt-0.5 text-blue-700" />
            <div>
              <p className="text-sm font-semibold text-slate-800 dark:text-slate-100">
                Video Tutorial
              </p>
              <p className="text-[11px] text-slate-500 dark:text-slate-300">
                How to study with our website
              </p>
            </div>
          </div>
        </div>
      </div>

      <h3 className="mt-3 text-2xl font-semibold text-slate-900 dark:text-slate-100">
        Table of Contents
      </h3>

      <div className="mt-2 overflow-hidden rounded-xl border border-slate-200 dark:border-slate-700">
        {data.chapters.map((item, index) => {
          const isSelected = item.id === selectedChapterId;

          return (
            <Link
              key={item.id}
              href={chapterHref(item.id)}
              className={`flex items-center justify-between px-3 py-3 transition hover:bg-slate-50 dark:hover:bg-slate-800 ${
                isSelected
                  ? "bg-slate-200/70 dark:bg-slate-800"
                  : "bg-white dark:bg-slate-900"
              } ${
                index !== data.chapters.length - 1
                  ? "border-b border-slate-200 dark:border-slate-700"
                  : ""
              }`}
            >
              <div>
                <p className="text-xs text-slate-700 dark:text-slate-200">
                  {item.chapter}
                </p>
                <p className="text-sm text-slate-900 dark:text-slate-100">
                  {item.title}
                </p>
              </div>

              <div className="ml-2 flex items-center gap-2">
                {item.isHighlighted ? (
                  <span className="inline-flex items-center gap-1 rounded-sm bg-amber-50 px-2 py-1 text-[11px] text-amber-700 dark:bg-amber-500/15 dark:text-amber-300">
                    <PencilLine size={11} />
                    Has Highlight
                  </span>
                ) : null}

                <ChevronRight
                  size={14}
                  className="text-slate-700 dark:text-slate-300"
                />
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
};

export default SubLibrary;
