import React from "react";
import {
  BookText,
  FileText,
  Grid2x2,
  NotebookPen,
  Settings,
  Zap,
  Clock3,
  CircleDashed,
  Microscope,
  Coffee,
  PencilLine,
  Highlighter,
} from "lucide-react";

const topCards = [
  {
    title: "Text",
    subtitle: "Cardiovascular Medicine > Epidemiology and Risk Factors",
    icon: NotebookPen,
    active: false,
  },
  {
    title: "Question Bank",
    subtitle: "MSKAP Questions > Endocrinology & Metabolism > Question 5",
    icon: Grid2x2,
    active: false,
  },
  {
    title: "Learning Plan",
    subtitle: "Pulmonary & Critical Care Medicine > Pulmonary Diagnostic Tests",
    icon: FileText,
    active: true,
  },
  {
    title: "Flashcard",
    subtitle: "Cardiovascular Medicine",
    icon: Zap,
    active: false,
  },
  {
    title: "Custom Quizzes",
    subtitle: "Custom Quizzes > 8/5/2026",
    icon: PencilLine,
    active: false,
  },
  {
    title: "Settings",
    subtitle: "Make the Setup",
    icon: Settings,
    active: false,
  },
];

const progressCards = [
  {
    label: "Study Sessions",
    value: "42",
    icon: Clock3,
    color: "text-orange-500",
    bg: "bg-orange-50",
    border: "border-orange-200",
  },
  {
    label: "Total Questions",
    value: "2,457",
    icon: CircleDashed,
    color: "text-blue-500",
    bg: "bg-blue-50",
    border: "border-blue-200",
  },
  {
    label: "Pathology Conditions",
    value: "278",
    icon: Microscope,
    color: "text-emerald-500",
    bg: "bg-emerald-50",
    border: "border-emerald-200",
  },
  {
    label: "Flashcards",
    value: "1351",
    icon: Coffee,
    color: "text-violet-500",
    bg: "bg-violet-50",
    border: "border-violet-200",
  },
];

const OverView = () => {
  return (
    <section className="w-full transition-colors dark:text-slate-100">
      <div className="mx-auto space-y-6">
        <div>
          <h2 className="text-4xl font-semibold tracking-tight text-slate-900 dark:text-slate-100">
            Home
          </h2>
          {/* <p className="mt-2 text-2xl text-slate-800">
            Pick up where you left off
          </p> */}
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {topCards.map((card) => {
            const Icon = card.icon;

            return (
              <article
                key={card.title}
                className={`rounded-2xl border p-6 text-center shadow-sm transition hover:-translate-y-0.5 hover:shadow-md ${
                  card.active
                    ? "border-blue-900 bg-[#0f3b97] text-white"
                    : "border-slate-200 bg-white text-slate-900 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
                }`}
              >
                <Icon
                  size={38}
                  className={`mx-auto ${card.active ? "text-white" : "text-[#0f3b97]"}`}
                />
                <h3 className="mt-4 text-4xl font-semibold">{card.title}</h3>
                <p
                  className={`mt-3 text-sm ${card.active ? "text-blue-100" : "text-slate-600 dark:text-slate-400"}`}
                >
                  {card.subtitle}
                </p>
              </article>
            );
          })}
        </div>

        <div>
          <h3 className="text-3xl font-semibold text-slate-900 dark:text-slate-100">
            See Your Progress
          </h3>
          <div className="mt-3 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
            {progressCards.map((item) => {
              const Icon = item.icon;

              return (
                <article
                  key={item.label}
                  className={`rounded-2xl border px-5 py-4 ${item.bg} ${item.border} dark:border-slate-700 dark:bg-slate-900`}
                >
                  <div className="flex items-center gap-4">
                    <div
                      className={`flex h-14 w-14 items-center justify-center rounded-full border-2 border-current/30 ${item.color}`}
                    >
                      <Icon size={28} />
                    </div>

                    <div>
                      <p className="text-xs text-slate-600 dark:text-slate-400">
                        {item.label}
                      </p>
                      <p className="text-4xl font-semibold text-slate-900 dark:text-slate-100">
                        {item.value}
                      </p>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </div>

        <div>
          <h3 className="text-3xl font-semibold text-slate-900 dark:text-slate-100">
            Notes &amp; Highlights
          </h3>
          <div className="mt-3 grid grid-cols-1 gap-4 xl:grid-cols-2">
            <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-900">
              <div className="flex items-center gap-3 text-slate-900 dark:text-slate-100">
                <BookText size={24} />
                <h4 className="text-3xl font-semibold">Notes</h4>
              </div>
              <p className="mt-4 text-sm text-slate-600 dark:text-slate-400">
                Your notes, organized by content type and subspecialty
              </p>
              <div className="mt-4 rounded-lg bg-[#0f3b97] px-4 py-1 text-center text-lg font-semibold text-white">
                3 Notes
              </div>
            </article>

            <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-900">
              <div className="flex items-center gap-3 text-slate-900 dark:text-slate-100">
                <Highlighter size={24} />
                <h4 className="text-3xl font-semibold">Highlights</h4>
              </div>
              <p className="mt-4 text-sm text-slate-600 dark:text-slate-400">
                Content you&apos;ve highlighted, organized by type and
                subspecialty
              </p>
              <div className="mt-4 rounded-lg bg-[#0f3b97] px-4 py-1 text-center text-lg font-semibold text-white">
                162 Highlights
              </div>
            </article>
          </div>
        </div>

        {/* <div className="grid grid-cols-1 gap-6 pt-2 text-slate-900 md:grid-cols-3 dark:text-slate-100">
          <div>
            <h5 className="text-3xl font-semibold">AviadLavian</h5>
            <ul className="mt-2 space-y-1.5 text-xl text-slate-700 dark:text-slate-400">
              <li>Setting Started</li>
              <li>Answering Questions</li>
              <li>Submitting for CME/MOC/CPO</li>
              <li>Errata and Revisions</li>
              <li>Contact Us</li>
            </ul>
          </div>

          <div>
            <h5 className="text-3xl font-semibold">MSK Nexus Resources</h5>
            <ul className="mt-2 space-y-1.5 text-xl text-slate-700 dark:text-slate-400">
              <li>High Value Care Recommendations</li>
              <li>MSK Nexus</li>
              <li>Download the App</li>
              <li>MSK Nexus Resource Site</li>
            </ul>
          </div>

          <div>
            <h5 className="text-3xl font-semibold">About MSK Nexus</h5>
            <ul className="mt-2 space-y-1.5 text-xl text-slate-700 dark:text-slate-400">
              <li>About MSK Nexus</li>
              <li>Letter from the Editor</li>
              <li>Contributors/Disclosures</li>
              <li>License Agreement</li>
              <li>CME Information &amp; Disclosures</li>
            </ul>
          </div>
        </div> */}
      </div>
    </section>
  );
};

export default OverView;
