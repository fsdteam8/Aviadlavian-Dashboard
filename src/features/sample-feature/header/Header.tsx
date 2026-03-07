"use client";

import React, { useState } from "react";
import {
  BookMarked,
  EllipsisVertical,
  FilePenLine,
  Menu,
  NotebookText,
  Search,
  Settings,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import DisplaySetting from "@/features/sample-feature/header/DisplaySetting";
import { useUIStore } from "@/store/ui.store";

const Header = () => {
  const [isDisplaySettingsOpen, setIsDisplaySettingsOpen] = useState(false);
  const openSidebar = useUIStore((state) => state.openSidebar);

  return (
    <>
      <header className="fixed top-0 right-0 left-0 z-30 h-16 border-b border-blue-950/40 bg-black shadow-md">
        <button
          type="button"
          onClick={openSidebar}
          className="absolute top-3 left-5 z-40 inline-flex items-center justify-center rounded-lg border border-white/25 bg-[#0f3b97] p-2 text-white transition hover:bg-white/15 md:hidden"
          aria-label="Open sidebar"
        >
          <Menu size={20} />
        </button>

        <div className="flex h-full items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 min-w-0 ml-15 md:ml-0">
            <h1 className="text-xl font-bold tracking-wide text-white">LOGO</h1>
          </div>

          <div className="mx-4 hidden max-w-md flex-1 md:block">
            <div className="relative">
              <Search
                className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-white/90"
                size={15}
              />
              <input
                type="text"
                placeholder="Search here"
                className="h-9 w-full rounded-full border border-white/55 bg-transparent pr-4 pl-9 text-sm text-white placeholder:text-white/80 outline-none transition focus:border-white"
              />
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <button
              type="button"
              className="inline-flex items-center justify-center rounded-md p-2 text-white transition hover:bg-white/15"
              aria-label="More"
            >
              <EllipsisVertical size={18} />
            </button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  type="button"
                  className="flex items-center gap-2 rounded-lg px-1.5 py-1 text-white transition hover:bg-white/15"
                  aria-label="Open profile menu"
                >
                  <span className="hidden text-xl font-medium text-white sm:inline">
                    Aviad Lavian
                  </span>
                  <Avatar className="h-9 w-9 border-2 border-white/70">
                    <AvatarFallback className="bg-slate-200 text-xs font-semibold text-slate-700">
                      AL
                    </AvatarFallback>
                  </Avatar>
                </button>
              </DropdownMenuTrigger>

              <DropdownMenuContent
                align="end"
                className="mt-2 w-60 rounded-xl border border-slate-200 bg-white p-1.5 text-slate-800 shadow-xl"
              >
                <DropdownMenuItem className="gap-2.5 rounded-md px-3 py-2">
                  <FilePenLine size={16} />
                  Table of Contents
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="gap-2.5 rounded-md px-3 py-2">
                  <BookMarked size={16} />
                  Learning Plan
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="gap-2.5 rounded-md px-3 py-2">
                  <NotebookText size={16} />
                  Notes
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="gap-2.5 rounded-md px-3 py-2"
                  onSelect={() => setIsDisplaySettingsOpen(true)}
                >
                  <Settings size={16} />
                  Display Settings
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      <Dialog
        open={isDisplaySettingsOpen}
        onOpenChange={setIsDisplaySettingsOpen}
      >
        <DialogContent
          showCloseButton={false}
          className="max-w-xl overflow-hidden rounded-xl border border-slate-200 p-0"
        >
          <div className="h-1 w-full bg-[#0f3b97]" />
          <DisplaySetting />
        </DialogContent>
      </Dialog>
    </>
  );
};

export default Header;
