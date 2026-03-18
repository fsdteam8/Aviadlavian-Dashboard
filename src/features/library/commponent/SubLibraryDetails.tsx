"use client";

import React from "react";
import { BookOpen, ClipboardList, PencilLine, Edit3 } from "lucide-react";
import Notes from "./Notes";
import NotesPanel from "./common/NotesPanel";
import LearningPlanPanel from "./common/LearningPlanPanel";
import TocPanel from "./common/TocPanel";

type SubLibraryDetailsProps = {
  libraryId: string;
  chapterId: string;
};

type Highlight = {
  id: string;
  text: string;
  color: string;
  createdAt: Date;
};

type Note = {
  id: string;
  content: string;
  section: string;
  createdAt: Date;
};

type TOCChapter = {
  id: string;
  title: string;
  isBookmarked: boolean;
};

// Demo content with HTML
const demoContent = `
<h1>Knee</h1>
<p style="font-size: 12px; color: #666;">Text › Knee › Distal It Band Syndrome</p>

<h2>Distal It Band Syndrome</h2>

<h3>Overview</h3>
<p>Coronaronar as <strong style="background-color: #fef3c7; padding: 2px 4px;">CVD</strong> ns many constricting corony les do CAD discais, rhythro olvendeis subotical oreo laot, valor de sendo dic, and peripheral artery CV msel the leadlip card of death in the United States, however, from 28 to 2016, the egercised death roteif Despite their improvement CHEMOCCRD</p>

<p>CVD was response for early of east in the userener 2016 Gabaly a third of o CHEMOCCRD</p>

<h3>Recently 60% E morbic commy liferme mx for CVD earment according to date from the Promingham Heart Study had more than Yr for 2014 to 2015 was CVD was response for 42 million US Hospital discharges in 2014 approav measy 8850 lion, the progdies total cost of CVD <strong style="background-color: #fef3c7; padding: 2px 4px;">between 2015 and 2005 ss estimated to remain multe for most persns int to increase acacly for about ajnul 15 years or older</strong></h3>

<p>An estimated d 2 wine utlus sorer than 20 years have a diagnosis of heart falus, a thai common porthway for candiovascular corditions. <strong style="background-color: #fef3c7; padding: 2px 4px;">The prevalance of heart failure is projected to incresso by between 2012 and 2030</strong></p>

<h4>Risk Factors for Corolicasider Disease</h4>

<h3>Lifestyle</h3>
<p>The metrics of deal for health ore all jok hond pairs, and get sporgesde energy little physical society and modarace of tubaccii however very few people meet metrics Promotion of a testty lifestyle theughout the remises the most Important way to prevent otheriodericde CVD Related Question</p>

<h2>Extensor Mechanism Injuries</h2>

<h3>Lifestyle</h3>
<p>Coronaronar as <strong style="background-color: #fef3c7; padding: 2px 4px;">CVD</strong> ns many constricting corony les do CAD discais, rhythro olvendeis subotical oreo laot, valor de sendo dic, and peripheral artery CV msel the leadlip card of death in the United States, however, from 28 to 2016, the egercised death roteif Despite their improvement CHEMOCCRD</p>

<p>CVD was response for early of east in the userener 2016 Gabaly a third of o CHEMOCCRD</p>

<p>Recently 60% E morbic commy liferme mx for CVD earment according to date from the Promingham Heart Study had more than Yr for 2014 to 2015 was CVD was response for 42 million US Hospital discharges in 2014 approav measy 8850 lion, the progdies total cost of CVD between 2015 and 2005 ss estimated to remain multe for most persns int to increase acacly for about ajnul 15 years or older</p>

<p>An estimated d 2 wine utlus sorer than 20 years have a diagnosis of heart falus, a thai common porthway for candiovascular corditions. The prevalance of heart failure is projected to incresso by between 2012 and 2030</p>

<h4>Risk Factors for Corolicasider Disease</h4>

<h3>Lifestyle</h3>
<p>The metrics of deal for health ore all jok hond pairs, and get sporgesde energy little physical society and modarace of tubaccii however very few people meet metrics Promotion of a testty lifestyle theughout the remises the most Important way to prevent otheriodericde CVD Related Question</p>

<p>Coronaronar as CVD ns many constricting corony les do CAD discais, rhythro olvendeis subotical oreo laot, valor de sendo dic, and peripheral artery CV msel the leadlip card of death in the United States, however, from 28 to 2016, the egercised death roteif Despite their improvement CHEMOCCRD</p>
`;

const SubLibraryDetails = ({
  libraryId,
  chapterId,
}: SubLibraryDetailsProps) => {
  const [highlights, setHighlights] = React.useState<Highlight[]>([]);
  const [notes, setNotes] = React.useState<Note[]>([]);
  const [newNote, setNewNote] = React.useState("");
  const [selectedSection, setSelectedSection] = React.useState("");
  const [showTOC, setShowTOC] = React.useState(false);
  const [showLearningPlan, setShowLearningPlan] = React.useState(false);
  const [showNotesPanel, setShowNotesPanel] = React.useState(false);
  const [showNotesPage, setShowNotesPage] = React.useState(false);
  const [isRead, setIsRead] = React.useState(false);
  const [chapters, setChapters] = React.useState<TOCChapter[]>([
    { id: "1", title: "Distal It Band Syndrome", isBookmarked: true },
    { id: "2", title: "Patellar Tendinopathy", isBookmarked: false },
    { id: "3", title: "Popliteus Tendinopathy", isBookmarked: false },
    { id: "4", title: "Extensor Mechanism Injuries", isBookmarked: false },
    { id: "5", title: "Quadriceps Tendon Rupture", isBookmarked: false },
    { id: "6", title: "Patellar Sleeve Fracture", isBookmarked: false },
    { id: "7", title: "Epidemiology and Risk Factors", isBookmarked: false },
    { id: "8", title: "Patellar Tendinopathy", isBookmarked: false },
  ]);

  // Keep params for future API integration
  console.log("Current view:", { libraryId, chapterId });

  const contentRef = React.useRef<HTMLDivElement>(null);

  // Simulate API call
  const saveHighlightToBackend = React.useCallback(
    async (highlight: Highlight) => {
      try {
        // Simulate fetch call
        console.log("Saving highlight to backend:", highlight);
      } catch (error) {
        console.error("Failed to save highlight:", error);
      }
    },
    [],
  );

  // Handle text selection and highlight
  const handleTextSelection = React.useCallback(() => {
    const selection = window.getSelection();
    if (!selection || selection.isCollapsed) return;

    const selectedText = selection.toString().trim();
    if (selectedText.length === 0) return;

    // Create new highlight
    const timestamp = Date.now();
    const newHighlight: Highlight = {
      id: `highlight-${timestamp}`,
      text: selectedText,
      color: "#fef3c7",
      createdAt: new Date(),
    };

    setHighlights((prev) => [...prev, newHighlight]);

    // Simulate API call to backend
    saveHighlightToBackend(newHighlight);

    // Clear selection
    selection.removeAllRanges();
  }, [saveHighlightToBackend]);

  // Add note
  const addNote = () => {
    if (!newNote.trim() || !selectedSection) return;

    const note: Note = {
      id: `note-${Date.now()}`,
      content: newNote,
      section: selectedSection,
      createdAt: new Date(),
    };

    setNotes((prev) => [...prev, note]);
    setNewNote("");
    setSelectedSection("");

    // Simulate API call
    console.log("Saving note to backend:", note);
  };

  // Toggle bookmark
  const toggleBookmark = (id: string) => {
    setChapters((prev) =>
      prev.map((ch) =>
        ch.id === id ? { ...ch, isBookmarked: !ch.isBookmarked } : ch,
      ),
    );
  };

  // If notes page is open, show full notes view
  if (showNotesPage) {
    return (
      <Notes
        notes={notes}
        onBack={() => setShowNotesPage(false)}
        title="Knee"
        subtitle="Distal It Band Syndrome"
      />
    );
  }

  return (
    <div className="w-full ">
      {/* Main Content Area */}
      <div className="relative rounded-2xl border border-slate-200/80 bg-white dark:border-slate-700 dark:bg-slate-900">
        {/* Top-Right Action Buttons */}
        <div className="absolute top-4 right-4 z-10 flex gap-2">
          <button
            type="button"
            onClick={() => {
              setShowTOC(false);
              setShowLearningPlan(false);
              setShowNotesPanel(!showNotesPanel);
            }}
            className={`flex h-10 w-10 items-center justify-center rounded-lg border transition ${
              showNotesPanel
                ? "border-emerald-600 bg-emerald-600 text-white shadow-lg"
                : "border-slate-300 bg-white text-slate-700 hover:bg-slate-50 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-200"
            }`}
            title="Notes"
          >
            <Edit3 size={16} />
          </button>

          <button
            type="button"
            onClick={() => {
              setShowTOC(false);
              setShowNotesPanel(false);
              setShowLearningPlan(!showLearningPlan);
            }}
            className={`flex h-10 w-10 items-center justify-center rounded-lg border transition ${
              showLearningPlan
                ? "border-emerald-600 bg-emerald-600 text-white shadow-lg"
                : "border-slate-300 bg-white text-slate-700 hover:bg-slate-50 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-200"
            }`}
            title="Learning Plan"
          >
            <ClipboardList size={16} />
          </button>

          <button
            type="button"
            onClick={() => {
              setShowNotesPanel(false);
              setShowLearningPlan(false);
              setShowTOC(!showTOC);
            }}
            className={`flex h-10 w-10 items-center justify-center rounded-lg border transition ${
              showTOC
                ? "border-emerald-600 bg-emerald-600 text-white shadow-lg"
                : "border-slate-300 bg-white text-slate-700 hover:bg-slate-50 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-200"
            }`}
            title="Table of Contents"
          >
            <BookOpen size={16} />
          </button>
        </div>

        {/* Modal Overlays */}
        {(showTOC || showLearningPlan || showNotesPanel) && (
          <div className="absolute inset-x-4 top-16 z-20 max-h-[500px] overflow-y-auto rounded-xl border border-slate-200 bg-white shadow-2xl dark:border-slate-700 dark:bg-slate-900 sm:inset-x-8">
            {showNotesPanel && (
              <NotesPanel
                newNote={newNote}
                setNewNote={setNewNote}
                selectedSection={selectedSection}
                setSelectedSection={setSelectedSection}
                onSave={addNote}
                onClose={() => setShowNotesPanel(false)}
              />
            )}

            {showLearningPlan && (
              <LearningPlanPanel
                isRead={isRead}
                setIsRead={setIsRead}
                onClose={() => setShowLearningPlan(false)}
              />
            )}

            {showTOC && (
              <TocPanel
                chapters={chapters}
                onToggleBookmark={toggleBookmark}
                onClose={() => setShowTOC(false)}
              />
            )}
          </div>
        )}

        {/* Content with HTML rendering */}
        <div
          ref={contentRef}
          onMouseUp={handleTextSelection}
          className="prose prose-sm max-w-none px-4 pb-6 pt-20 sm:px-6 lg:px-8 dark:prose-invert prose-headings:text-slate-900 prose-p:text-slate-700 dark:prose-headings:text-slate-100 dark:prose-p:text-slate-300"
          dangerouslySetInnerHTML={{ __html: demoContent }}
        />
      </div>

      {/* Bottom Sections: Text Notes and Highlights */}
      <div className="mt-6">
        <h2 className="mb-4 text-lg font-semibold text-slate-900 dark:text-slate-100">
          Text Notes and Highlights:
        </h2>

        <div className="grid gap-4 md:grid-cols-2">
          {/* Notes Card */}
          <div className="rounded-2xl border border-slate-200/80 bg-white p-6 dark:border-slate-700 dark:bg-slate-900">
            <div className="mb-3 flex items-center gap-2">
              <Edit3 size={18} className="text-slate-700 dark:text-slate-300" />
              <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">
                Notes
              </h3>
            </div>

            <p className="mb-4 text-sm text-slate-600 dark:text-slate-400">
              Your notes, organized by content type and subsequently
            </p>

            <button
              type="button"
              onClick={() => setShowNotesPage(true)}
              className="w-full rounded-lg bg-emerald-600 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-700"
            >
              {notes.length} {notes.length === 1 ? "Note" : "Notes"}
            </button>
          </div>

          {/* Highlights Card */}
          <div className="rounded-2xl border border-slate-200/80 bg-white p-6 dark:border-slate-700 dark:bg-slate-900">
            <div className="mb-3 flex items-center gap-2">
              <PencilLine
                size={18}
                className="text-slate-700 dark:text-slate-300"
              />
              <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">
                Highlights
              </h3>
            </div>

            <p className="mb-4 text-sm text-slate-600 dark:text-slate-400">
              Content you&apos;ve highlighted, organized by type and
              subsequently
            </p>

            <button
              type="button"
              className="w-full rounded-lg bg-emerald-600 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-700"
            >
              {highlights.length}{" "}
              {highlights.length === 1 ? "Highlight" : "Highlights"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubLibraryDetails;
