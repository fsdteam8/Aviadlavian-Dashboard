"use client";

import React from "react";
import {
  BookText,
  FileText,
  Home,
  Info,
  Library,
  MessageSquare,
  Settings,
  Sparkles,
  SquareKanban,
  X,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useUIStore } from "@/store/ui.store";

type MenuItem = {
  label: string;
  icon: React.ElementType;
  url?: string;
};

const menuItems: MenuItem[] = [
  { label: "Home", icon: Home, url: "/" },
  { label: "Library", icon: Library, url: "/library" },
  { label: "About", icon: Info },
  { label: "Question Bank", icon: SquareKanban },
  { label: "Learning Plan", icon: FileText },
  { label: "Flashcards", icon: Sparkles, url: "/flashcards" },
  { label: "Custom Quizzes", icon: BookText },
  { label: "Settings", icon: Settings },
  { label: "Feedback", icon: MessageSquare },
];

const Sidebar = () => {
  const pathname = usePathname();
  const isSidebarOpen = useUIStore((state) => state.isSidebarOpen);
  const closeSidebar = useUIStore((state) => state.closeSidebar);

  React.useEffect(() => {
    if (isSidebarOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [isSidebarOpen]);

  return (
    <>
      <div
        className={`fixed inset-0 z-40 bg-black/50 transition-opacity duration-300 md:hidden ${
          isSidebarOpen ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        onClick={closeSidebar}
      />

      <aside
        className={`fixed top-0 left-0 z-50 h-screen w-64 border-r border-slate-700/80 bg-[#1f252d] shadow-xl transition-transform duration-300 md:top-16 md:z-20 md:h-[calc(100vh-4rem)] md:translate-x-0 ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex  items-center justify-between border-b border-slate-700/70 px-4 ">
          {/* <div>
            <h2 className="text-base font-semibold text-slate-100">
              Dashboard
            </h2>
            <p className="text-xs text-slate-400">Admin workspace</p>
          </div> */}

          <button
            type="button"
            onClick={closeSidebar}
            className="inline-flex rounded-lg p-2 text-slate-400 transition hover:bg-slate-700/70 hover:text-slate-100 md:hidden"
            aria-label="Close sidebar"
          >
            <X size={18} />
          </button>
        </div>

        <nav className="px-2 py-3">
          <ul className="space-y-1.5">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = item.url ? pathname === item.url : false;

              return (
                <li key={item.label}>
                  {item.url ? (
                    <Link
                      href={item.url}
                      onClick={closeSidebar}
                      className={`flex w-full items-center gap-2.5 rounded-md px-3 py-2.5 text-sm font-medium transition ${
                        isActive
                          ? "bg-[#0b7760] text-white"
                          : "text-slate-100 hover:bg-slate-700/60"
                      }`}
                    >
                      <Icon size={14} />
                      {item.label}
                    </Link>
                  ) : (
                    <button
                      type="button"
                      className="flex w-full items-center gap-2.5 rounded-md px-3 py-2.5 text-sm font-medium text-slate-100 transition hover:bg-slate-700/60"
                    >
                      <Icon size={14} />
                      {item.label}
                    </button>
                  )}
                </li>
              );
            })}
          </ul>
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;
