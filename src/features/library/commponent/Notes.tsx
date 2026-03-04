"use client";

import React from "react";
import { ChevronLeft } from "lucide-react";

type Note = {
  id: string;
  content: string;
  section: string;
  createdAt: Date;
};

type NotesProps = {
  notes: Note[];
  onBack: () => void;
  title?: string;
  subtitle?: string;
};

const Notes = ({
  notes,
  onBack,
  title = "Knee",
  subtitle = "Distal It Band Syndrome",
}: NotesProps) => {
  return (
    <section className="w-full">
      <div className="rounded-2xl border border-slate-200/80 bg-white dark:border-slate-700 dark:bg-slate-900">
        {/* Header */}
        <div className="border-b border-slate-200 px-4 py-4 dark:border-slate-700 sm:px-6">
          <button
            type="button"
            onClick={onBack}
            className="mb-4 flex items-center gap-2 text-slate-700 transition hover:text-slate-900 dark:text-slate-300 dark:hover:text-slate-100"
          >
            <ChevronLeft size={20} />
            <span className="text-lg font-semibold">Notes</span>
          </button>

          <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
            {title}
          </h2>
          <h3 className="mt-1 text-xl font-semibold text-slate-800 dark:text-slate-200">
            {subtitle}
          </h3>
        </div>

        {/* Notes Content */}
        <div className="px-4 py-6 sm:px-6">
          {notes.length === 0 ? (
            <div className="py-12 text-center">
              <p className="text-sm text-slate-600 dark:text-slate-400">
                No notes yet. Add your first note using the Notes button above.
              </p>
            </div>
          ) : (
            <div className="space-y-8">
              {notes.map((note, index) => (
                <div key={note.id} className="space-y-3">
                  <h4 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                    Note {String(index + 1).padStart(2, "0")}
                  </h4>

                  <div className="space-y-4">
                    <div>
                      <h5 className="mb-2 font-semibold text-slate-900 dark:text-slate-100">
                        Details
                      </h5>
                      <p className="mb-1 text-sm font-medium text-slate-700 dark:text-slate-300">
                        Note {String(index + 1).padStart(2, "0")}
                      </p>
                      <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300">
                        {note.content}
                      </p>
                    </div>

                    {note.section && (
                      <div>
                        <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                          {note.section}
                        </p>
                      </div>
                    )}
                  </div>

                  {index < notes.length - 1 && (
                    <div className="mt-6 border-t border-slate-200 dark:border-slate-700" />
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default Notes;
