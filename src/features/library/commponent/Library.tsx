"use client";

import React from "react";
import Link from "next/link";
import {
  Brain,
  ChevronRight,
  Circle,
  Dumbbell,
  Footprints,
  Loader2,
} from "lucide-react";
import { useLibrary } from "../hooks/uselibrary";
import { LibraryArticle, LibraryRegion } from "../type/library";

const getTopicCount = (article: LibraryArticle) => {
  if (!article.topicIds?.length) return 0;

  return article.topicIds.reduce((count, item) => {
    const pieces = item
      .split(",")
      .map((text) => text.trim())
      .filter(Boolean);

    return count + (pieces.length || 1);
  }, 0);
};

const detectRegion = (article: LibraryArticle): LibraryRegion => {
  const content = `${article.name} ${article.topicIds.join(" ")}`.toLowerCase();

  if (
    content.includes("shoulder") ||
    content.includes("elbow") ||
    content.includes("wrist") ||
    content.includes("hand") ||
    content.includes("arm")
  ) {
    return "UPPER LIMB";
  }

  if (
    content.includes("pelvis") ||
    content.includes("hip") ||
    content.includes("thigh") ||
    content.includes("knee") ||
    content.includes("shin") ||
    content.includes("foot") ||
    content.includes("ankle") ||
    content.includes("leg")
  ) {
    return "LOWER LIMB";
  }

  if (
    content.includes("lumbar") ||
    content.includes("head") ||
    content.includes("neck") ||
    content.includes("thoracic") ||
    content.includes("spine") ||
    content.includes("rib")
  ) {
    return "AXIAL SKELETON";
  }

  return "OTHER";
};

const REGION_ORDER: LibraryRegion[] = [
  "AXIAL SKELETON",
  "UPPER LIMB",
  "LOWER LIMB",
  "OTHER",
];

const REGION_META: Record<
  LibraryRegion,
  {
    icon: React.ComponentType<{ size?: number; className?: string }>;
    iconClassName: string;
  }
> = {
  "AXIAL SKELETON": {
    icon: Brain,
    iconClassName: "text-rose-500",
  },
  "UPPER LIMB": {
    icon: Dumbbell,
    iconClassName: "text-amber-500",
  },
  "LOWER LIMB": {
    icon: Footprints,
    iconClassName: "text-yellow-600",
  },
  OTHER: {
    icon: Circle,
    iconClassName: "text-slate-500",
  },
};

import { motion } from "framer-motion";

const Library = () => {
  const { data, isLoading, isError, error } = useLibrary({
    page: 1,
    limit: 50,
  });

  const grouped = React.useMemo(() => {
    const source = data?.data ?? [];

    return source.reduce<Record<LibraryRegion, LibraryArticle[]>>(
      (acc, item) => {
        const region = detectRegion(item);
        acc[region].push(item);
        return acc;
      },
      {
        "AXIAL SKELETON": [],
        "UPPER LIMB": [],
        "LOWER LIMB": [],
        OTHER: [],
      },
    );
  }, [data?.data]);

  if (isLoading) {
    return (
      <section className="w-full rounded-3xl border border-slate-200/80 bg-white/50 backdrop-blur-xl px-4 py-12 sm:px-6 dark:border-slate-800 dark:bg-slate-900/50 flex flex-col items-center justify-center min-h-[400px]">
        <Loader2 className="h-10 w-10 animate-spin text-teal-500 mb-4" />
        <p className="text-lg font-medium text-slate-600 dark:text-slate-300 animate-pulse">
          Accessing knowledge neural network...
        </p>
      </section>
    );
  }

  if (isError) {
    return (
      <section className="w-full rounded-3xl border border-red-200 bg-red-50/50 backdrop-blur-xl px-4 py-12 sm:px-6 dark:border-red-900/30 dark:bg-red-950/20 flex flex-col items-center justify-center min-h-[400px]">
        <div className="bg-red-100 dark:bg-red-900/50 p-4 rounded-full mb-4">
          <Circle className="text-red-600 dark:text-red-400 h-8 w-8" />
        </div>
        <p className="text-lg font-semibold text-red-700 dark:text-red-300">
          Uplink Failure
        </p>
        <p className="text-sm text-red-600/80 dark:text-red-400/80 mt-2">
          {error instanceof Error ? error.message : "Unknown error"}
        </p>
      </section>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      {/* Hero Section */}
      <section className="relative w-full overflow-hidden rounded-[2.5rem] border border-slate-200/60 bg-white dark:border-slate-800 dark:bg-slate-950">
        <div className="absolute inset-0 bg-gradient-to-br from-teal-500/10 via-transparent to-blue-500/5 dark:from-teal-500/5 dark:to-blue-500/5" />
        <div className="absolute -top-24 -right-24 h-96 w-96 rounded-full bg-teal-400/10 blur-[100px] dark:bg-teal-500/5" />
        <div className="absolute -bottom-24 -left-24 h-96 w-96 rounded-full bg-blue-400/10 blur-[100px] dark:bg-blue-500/5" />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-8 items-center px-8 py-12 lg:py-16">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-teal-200 bg-teal-50 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-teal-700 dark:border-teal-900/50 dark:bg-teal-950/50 dark:text-teal-400">
              <Brain size={12} /> Medical Repository
            </div>
            <h1 className="text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              Analytical <span className="text-teal-500">Knowledge</span>{" "}
              Library
            </h1>
            <p className="max-w-md text-lg text-slate-600 dark:text-slate-400 leading-relaxed">
              Explore our comprehensive database of medical regions, anatomical
              structures, and clinical insights.
            </p>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="relative hidden lg:block"
          >
            <div className="relative z-20 overflow-hidden rounded-3xl border border-white/20 shadow-2xl shadow-teal-500/10">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/images/library-hero.png"
                alt="Medical Library"
                className="w-full object-cover transition-transform duration-700 hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/50 to-transparent" />
            </div>
            {/* Decorative elements */}
            <div className="absolute -top-4 -right-4 h-12 w-12 rounded-xl bg-teal-500 p-2 shadow-lg shadow-teal-500/40 animate-bounce delay-700">
              <Dumbbell className="h-full w-full text-white" />
            </div>
            <div className="absolute -bottom-4 -left-4 h-12 w-12 rounded-xl bg-blue-500 p-2 shadow-lg shadow-blue-500/40 animate-pulse">
              <Footprints className="h-full w-full text-white" />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Regions Grid */}
      <section className="w-full rounded-[2.5rem] border border-slate-200/80 bg-white/60 backdrop-blur-xl px-6 py-10 dark:border-slate-800 dark:bg-slate-950/40 shadow-sm">
        <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
              Anatomical Regions
            </h2>
            <p className="mt-1 text-slate-500 dark:text-slate-400">
              Select a physiological domain to begin your research
            </p>
          </div>
          <div className="flex gap-2">
            <div className="h-2 w-12 rounded-full bg-teal-500" />
            <div className="h-2 w-4 rounded-full bg-slate-200 dark:bg-slate-800" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {REGION_ORDER.map((region) => {
            const articles = grouped[region];
            if (!articles.length) return null;

            const RegionIcon = REGION_META[region].icon;

            return (
              <div key={region} className="group flex flex-col">
                <div className="mb-4 flex items-center gap-2">
                  <div
                    className={`flex h-8 w-8 items-center justify-center rounded-lg ${REGION_META[region].iconClassName} bg-opacity-10`}
                  >
                    <RegionIcon size={18} />
                  </div>
                  <h3 className="text-sm font-bold tracking-wider text-slate-800 dark:text-slate-200 uppercase">
                    {region}
                  </h3>
                  <div className="ml-auto h-px flex-1 bg-slate-100 dark:bg-slate-800 mx-4" />
                  <span className="text-[10px] font-medium text-slate-400">
                    {articles.length} UNITS
                  </span>
                </div>

                <div className="overflow-hidden rounded-2xl border border-slate-100 bg-white/50 dark:border-slate-800 dark:bg-slate-900/30 transition-all duration-300 hover:shadow-xl hover:shadow-teal-500/5">
                  {articles.map((article, index) => (
                    <Link
                      key={article._id}
                      href={`/library/${article._id}`}
                      className={`group/item flex items-center justify-between px-4 py-4 transition-all duration-300 hover:bg-teal-50 dark:hover:bg-teal-900/10 ${
                        index !== articles.length - 1
                          ? "border-b border-slate-100 dark:border-slate-800"
                          : ""
                      }`}
                    >
                      <div className="flex min-w-0 items-center gap-4">
                        <div className="relative flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-slate-100 bg-slate-50 dark:border-slate-800 dark:bg-slate-900 group-hover/item:scale-110 transition-transform duration-300 shadow-sm">
                          {article.image?.secure_url ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={article.image.secure_url}
                              alt={article.name}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <Circle size={18} className="text-slate-300" />
                          )}
                          <div className="absolute inset-0 ring-1 ring-inset ring-black/5 rounded-xl" />
                        </div>

                        <div className="min-w-0">
                          <h4 className="truncate text-sm font-semibold text-slate-800 dark:text-slate-100 group-hover/item:text-teal-600 dark:group-hover/item:text-teal-400 transition-colors">
                            {article.name}
                          </h4>
                          <div className="flex items-center gap-2 mt-0.5">
                            <p className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
                              {getTopicCount(article)} Chapters
                            </p>
                            <span className="h-1 w-1 rounded-full bg-slate-300 dark:bg-slate-700" />
                            <p className="text-[10px] text-slate-400 dark:text-slate-500">
                              View Modules
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-50 dark:bg-slate-800 group-hover/item:bg-teal-500 transition-all duration-300 translate-x-1 group-hover/item:translate-x-0">
                        <ChevronRight
                          size={16}
                          className="text-slate-400 group-hover/item:text-white transition-colors"
                        />
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            );
          })}

          {!Object.values(grouped).some((items) => items.length > 0) && (
            <div className="col-span-full rounded-2xl border border-dashed border-slate-300 bg-slate-50/50 px-4 py-20 text-center dark:border-slate-700 dark:bg-slate-900/50">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800 mb-4">
                <Circle className="h-8 w-8 text-slate-400" />
              </div>
              <h3 className="text-lg font-medium text-slate-900 dark:text-white">
                No Modules Found
              </h3>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                The library repository is currently empty for this sector.
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Library;
