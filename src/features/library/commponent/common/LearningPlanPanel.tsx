"use client";

import React from "react";
import { X, Check } from "lucide-react";

type LearningPlanPanelProps = {
  isRead: boolean;
  setIsRead: (value: boolean) => void;
  onClose: () => void;
};

const LearningPlanPanel = ({
  isRead,
  setIsRead,
  onClose,
}: LearningPlanPanelProps) => {
  return (
    <div className="p-6">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
          Learning Plan
        </h3>
        <button
          type="button"
          onClick={onClose}
          className="text-slate-500 hover:text-slate-700"
        >
          <X size={18} />
        </button>
      </div>

      <div className="space-y-4">
        <p className="text-sm text-slate-700 dark:text-slate-300">
          Mark this chapter &quot;READ&quot; for tracking your reading progress.
        </p>

        <button
          type="button"
          onClick={() => setIsRead(!isRead)}
          className={`flex w-full items-center justify-center gap-2 rounded-lg py-2.5 text-sm font-semibold transition ${
            isRead
              ? "bg-emerald-600 text-white hover:bg-emerald-700"
              : "bg-emerald-600 text-white hover:bg-emerald-700"
          }`}
        >
          {isRead && <Check size={16} />}
          {isRead ? "Marked as Read" : "Read"}
        </button>

        <p className="text-sm text-slate-600 dark:text-slate-400">
          If you want to revisit this chapter for revision, press the button.
        </p>

        <button
          type="button"
          className="w-full rounded-lg bg-emerald-600 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-700"
        >
          Add to learning plan
        </button>
      </div>
    </div>
  );
};

export default LearningPlanPanel;
