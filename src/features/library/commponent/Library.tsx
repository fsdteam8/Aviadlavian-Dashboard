"use client";

import React, { useState, useMemo } from "react";
import {
  Brain,
  ChevronRight,
  Circle,
  Dumbbell,
  Footprints,
  Loader2,
  Search,
  X,
  Filter,
  ChevronDown,
} from "lucide-react";
import Link from "next/link";
import { useLibrary } from "../hooks/uselibrary";
import { LibraryArticle, LibraryRegion } from "../type/library";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { motion, AnimatePresence } from "framer-motion";

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

const getTopicCount = (article: LibraryArticle) => {
  if (!article.topicIds?.length) return 0;
  return article.topicIds.length;
};

const detectRegion = (article: LibraryArticle): LibraryRegion => {
  const content = `${article.name} ${article.description}`.toLowerCase();
  const regions = article.topicIds
    .flatMap((t) => [
      ...(t.Primary_Body_Region ? parseValues(t.Primary_Body_Region) : []),
      ...(t.Secondary_Body_Region ? parseValues(t.Secondary_Body_Region) : []),
    ])
    .join(" ")
    .toLowerCase();

  const combined = `${content} ${regions}`;

  if (
    combined.includes("shoulder") ||
    combined.includes("elbow") ||
    combined.includes("wrist") ||
    combined.includes("hand") ||
    combined.includes("arm")
  ) {
    return "UPPER LIMB";
  }

  if (
    combined.includes("pelvis") ||
    combined.includes("hip") ||
    combined.includes("thigh") ||
    combined.includes("knee") ||
    combined.includes("shin") ||
    combined.includes("foot") ||
    combined.includes("ankle") ||
    combined.includes("leg")
  ) {
    return "LOWER LIMB";
  }

  if (
    combined.includes("lumbar") ||
    combined.includes("head") ||
    combined.includes("neck") ||
    combined.includes("thoracic") ||
    combined.includes("spine") ||
    combined.includes("rib")
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
  const [search, setSearch] = useState("");
  const [activeFilters, setActiveFilters] = useState<Record<string, string[]>>(
    {},
  );

  const { data, isLoading, isError, error } = useLibrary({
    page: 1,
    limit: 50, // Fetch more for client-side filtering
  });

  const articlesRaw = useMemo(() => data?.data ?? [], [data?.data]);

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
    };

    articlesRaw.forEach((article) => {
      article.topicIds?.forEach((topic) => {
        if (topic.Name) fieldMap["Speciality"].add(topic.Name);
        if (topic.Primary_Body_Region)
          parseValues(topic.Primary_Body_Region).forEach((v) =>
            fieldMap["Body Area"].add(v),
          );
        if (topic.Secondary_Body_Region)
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
   * 2. Apply filtering
   */
  const filteredArticles = useMemo(() => {
    return articlesRaw.filter((article) => {
      // Search filter
      if (
        search &&
        !article.name.toLowerCase().includes(search.toLowerCase()) &&
        !article.description.toLowerCase().includes(search.toLowerCase())
      ) {
        return false;
      }

      // Dynamic filters
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
  }, [articlesRaw, search, activeFilters]);

  const grouped = useMemo(() => {
    return filteredArticles.reduce<Record<LibraryRegion, LibraryArticle[]>>(
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
  }, [filteredArticles]);

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
  };

  const clearFilters = () => {
    setActiveFilters({});
    setSearch("");
  };

  if (isLoading) {
    return (
      <section className="w-full rounded-2xl border border-slate-200/80 bg-white/50 backdrop-blur-xl px-4 py-12 dark:border-slate-800 dark:bg-slate-900/50 flex flex-col items-center justify-center min-h-[400px]">
        <Loader2 className="h-10 w-10 animate-spin text-teal-500 mb-4" />
        <p className="text-lg font-medium text-slate-600 dark:text-slate-300 animate-pulse">
          Accessing knowledge neural network...
        </p>
      </section>
    );
  }

  if (isError) {
    return (
      <section className="w-full rounded-2xl border border-red-200 bg-red-50/50 backdrop-blur-xl px-4 py-12 dark:border-red-900/30 dark:bg-red-950/20 flex flex-col items-center justify-center min-h-[400px]">
        <X className="text-red-600 dark:text-red-400 h-12 w-12 mb-4" />
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
      {/* Search & Filter Bar */}
      <div className="sticky top-20 z-30 w-full mb-8">
        <div className="bg-white/80 dark:bg-slate-950/80 backdrop-blur-md rounded-2xl border border-slate-200 dark:border-slate-800 p-4 shadow-lg shadow-teal-500/5">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                placeholder="Search resources..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10 h-11 bg-slate-50 dark:bg-slate-900 border-none focus-visible:ring-teal-500"
              />
              {search && (
                <button
                  onClick={() => setSearch("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-full transition-colors"
                >
                  <X size={14} className="text-slate-500" />
                </button>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {dynamicFilters.map((filter) => (
                <DropdownMenu key={filter.name}>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="outline"
                      className="h-11 border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950"
                    >
                      <Filter className="mr-2 h-4 w-4 opacity-50" />
                      {activeFilters[filter.name]?.length > 0
                        ? `${filter.name} (${activeFilters[filter.name].length})`
                        : filter.name}
                      <ChevronDown className="ml-2 h-4 w-4 opacity-50" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="max-h-[300px] w-56 overflow-y-auto">
                    <DropdownMenuLabel>By {filter.name}</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    {filter.options.map((opt) => (
                      <DropdownMenuCheckboxItem
                        key={opt}
                        checked={activeFilters[filter.name]?.includes(opt)}
                        onCheckedChange={() => toggleFilter(filter.name, opt)}
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
                  onClick={clearFilters}
                  className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20"
                >
                  <X className="mr-2 h-4 w-4" /> Reset
                </Button>
              )}
            </div>
          </div>

          <AnimatePresence>
            {Object.keys(activeFilters).length > 0 && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-slate-100 dark:border-slate-800"
              >
                {Object.entries(activeFilters).map(([name, values]) =>
                  values.map((val) => (
                    <Badge
                      key={`${name}-${val}`}
                      variant="secondary"
                      className="bg-teal-50 text-teal-700 dark:bg-teal-900/30 dark:text-teal-400 border-teal-100 dark:border-teal-800/50 flex items-center gap-1.5 py-1"
                    >
                      <span className="opacity-60 text-[10px] uppercase font-bold">
                        {name}:
                      </span>
                      {val}
                      <button
                        onClick={() => toggleFilter(name, val)}
                        className="hover:text-teal-900 dark:hover:text-teal-200"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  )),
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Regions Grid */}
      <section className="w-full">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {REGION_ORDER.map((region) => {
            const articles = grouped[region];
            if (!articles.length) return null;
            const RegionMeta = REGION_META[region];

            return (
              <div key={region} className="group flex flex-col">
                <div className="mb-4 flex items-center gap-2">
                  <div
                    className={`flex h-8 w-8 items-center justify-center rounded-lg ${RegionMeta.iconClassName} bg-current bg-opacity-10`}
                  >
                    <RegionMeta.icon size={18} />
                  </div>
                  <h3 className="text-sm font-bold tracking-wider text-slate-800 dark:text-slate-200 uppercase">
                    {region}
                  </h3>
                  <div className="ml-auto h-px flex-1 bg-slate-100 dark:bg-slate-800 mx-4" />
                  <span className="text-[10px] font-medium text-slate-400">
                    {articles.length} UNITS
                  </span>
                </div>

                <div className="grid grid-cols-1 gap-3">
                  {articles.map((article) => (
                    <Link
                      key={article._id}
                      href={`/library/${article._id}`}
                      className="group/item flex items-center justify-between p-4 bg-white dark:bg-slate-900/50 rounded-2xl border border-slate-100 dark:border-slate-800 transition-all duration-300 hover:shadow-lg hover:shadow-teal-500/5 hover:border-teal-200 dark:hover:border-teal-900/50"
                    >
                      <div className="flex items-center gap-4 min-w-0">
                        <div className="relative h-14 w-14 rounded-xl overflow-hidden bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 flex-shrink-0">
                          {article.image?.secure_url ? (
                            <img
                              src={article.image.secure_url}
                              alt={article.name}
                              className="h-full w-full object-cover group-hover/item:scale-110 transition-transform duration-500"
                            />
                          ) : (
                            <div className="h-full w-full flex items-center justify-center text-slate-200 dark:text-slate-700">
                              <Circle size={24} />
                            </div>
                          )}
                        </div>
                        <div className="min-w-0">
                          <h4 className="font-bold text-slate-900 dark:text-white truncate group-hover/item:text-teal-600 dark:group-hover/item:text-teal-400">
                            {article.name}
                          </h4>
                          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                            {getTopicCount(article)} Research Modules
                          </p>
                        </div>
                      </div>
                      <div className="h-8 w-8 rounded-full bg-slate-50 dark:bg-slate-800 flex items-center justify-center group-hover/item:bg-teal-500 group-hover/item:text-white transition-all duration-300">
                        <ChevronRight size={16} />
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {filteredArticles.length === 0 && (
          <div className="py-20 text-center bg-slate-50/50 dark:bg-slate-900/20 rounded-[2rem] border border-dashed border-slate-200 dark:border-slate-800">
            <div className="h-16 w-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="h-8 w-8 text-slate-300" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">
              No Result Found
            </h3>
            <p className="text-slate-500 mt-2">
              Try adjusting your filters or search terms.
            </p>
            <Button
              variant="outline"
              onClick={clearFilters}
              className="mt-6 rounded-xl"
            >
              Clear All Filters
            </Button>
          </div>
        )}
      </section>
    </div>
  );
};

export default Library;
