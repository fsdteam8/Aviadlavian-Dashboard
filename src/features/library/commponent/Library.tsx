"use client";

import React from "react";
import Link from "next/link";
import {
  Brain,
  ChevronRight,
  Circle,
  Dumbbell,
  Footprints,
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
      <section className="w-full  rounded-2xl border border-slate-200/80 bg-white px-4 py-5 sm:px-6 dark:border-slate-700 dark:bg-slate-900">
        <p className="text-sm text-slate-600 dark:text-slate-300">
          Loading library...
        </p>
      </section>
    );
  }

  if (isError) {
    return (
      <section className="w-full  rounded-2xl border border-red-200 bg-red-50 px-4 py-5 sm:px-6 dark:border-red-900 dark:bg-red-950/40">
        <p className="text-sm text-red-700 dark:text-red-300">
          Failed to load articles:{" "}
          {error instanceof Error ? error.message : "Unknown error"}
        </p>
      </section>
    );
  }

  return (
    <section className="w-full  rounded-2xl border border-slate-200/80 bg-white px-4 py-5 sm:px-6 dark:border-slate-700 dark:bg-slate-900">
      <h2 className="text-3xl font-semibold text-slate-900 dark:text-slate-100">
        Text
      </h2>
      <p className="mt-8 text-lg text-slate-700 dark:text-slate-300">
        Choose a body region to study
      </p>

      <div className="mt-4 space-y-5">
        {REGION_ORDER.map((region) => {
          const articles = grouped[region];
          if (!articles.length) return null;

          const RegionIcon = REGION_META[region].icon;

          return (
            <div key={region}>
              <div className="mb-2 flex items-center gap-1.5 text-xs font-semibold tracking-wide text-slate-700 dark:text-slate-300">
                <RegionIcon
                  size={13}
                  className={REGION_META[region].iconClassName}
                />
                {region}
              </div>

              <div className="overflow-hidden rounded-xl border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-900">
                {articles.map((article, index) => (
                  <Link
                    key={article._id}
                    href={`/library/${article._id}`}
                    className={`flex items-center justify-between px-3 py-2.5 transition hover:bg-slate-50 dark:hover:bg-slate-800 ${
                      index !== articles.length - 1
                        ? "border-b border-slate-200 dark:border-slate-700"
                        : ""
                    }`}
                  >
                    <div className="flex min-w-0 items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center overflow-hidden rounded-full border border-slate-200 bg-slate-50 dark:border-slate-700 dark:bg-slate-800">
                        {article.image?.secure_url ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={article.image.secure_url}
                            alt={article.name}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <Circle size={14} className="text-slate-500" />
                        )}
                      </div>

                      <div className="min-w-0">
                        <h3 className="truncate text-xs font-medium text-slate-900 dark:text-slate-100">
                          {article.name}
                        </h3>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400">
                          {getTopicCount(article)} Chapters
                        </p>
                      </div>
                    </div>

                    <ChevronRight
                      size={14}
                      className="text-slate-500 dark:text-slate-300"
                    />
                  </Link>
                ))}
              </div>
            </div>
          );
        })}

        {!Object.values(grouped).some((items) => items.length > 0) && (
          <div className="rounded-xl border border-slate-200 bg-white px-4 py-6 text-sm text-slate-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300">
            No sections available.
          </div>
        )}
      </div>
    </section>
  );
};

export default Library;
