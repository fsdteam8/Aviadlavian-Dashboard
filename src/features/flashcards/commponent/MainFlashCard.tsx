"use client";

import React, { useState } from "react";
import { Heart } from "lucide-react";
import { Accordion } from "@/components/ui/accordion";
import FlashCard from "../common/FlashCard";

type SubspecialtyItem = {
  id: string;
  title: string;
  chapters: number;
  icon?: string;
  chapterTitles?: string[];
};

const kneeChapterTitles = [
  "Suprapatellar Fat Pad Impingment",
  "Patellar Ligament-Lateral Femoral Condyle Friction Syndrome",
  "Infrapatellar Fat Pad Impingment (Hoffa'S Disease)",
  "Meniscal Tears/Perimeniscal Cysts",
  "Discoid Meniscus",
  "Osteoarthritis",
  "Prepatellar Bursitis",
  "Superficial Infrapatellar Bursitis",
  "Deep Infrapatellar Bursitis",
  "Pes Anserine Bursitis",
  "Osteochondritis Dissecans Of The Knee/Patella",
  "Osteonecrosis Of The Knee",
  "Charcot Of The Knee",
  "Chondromalacia Patella",
  "Saphenous Neuropathy",
];

const demoSubspecialties: SubspecialtyItem[] = [
  { id: "1", title: "Knee", chapters: 15, chapterTitles: kneeChapterTitles },
  { id: "2", title: "Shoulder, Scapula and Arm", chapters: 8 },
  { id: "3", title: "Shoulder Osteoarthritis", chapters: 10 },
  { id: "4", title: "Shin, Ankle and Foot", chapters: 6 },
  { id: "5", title: "Anterior Pelvis, Hip and Thigh", chapters: 20 },
  { id: "6", title: "Lumbar Spine, Posterior Pelvis, SIJ", chapters: 12 },
  { id: "7", title: "Wrist, Hand and Finger", chapters: 9 },
  { id: "8", title: "Elbow and Forearm", chapters: 13 },
  { id: "9", title: "Hand and Neck", chapters: 13 },
  { id: "10", title: "Thoracic Spine and Rib Wall", chapters: 15 },
];

const MainFlashCard = () => {
  const [isAnswerRevealed, setIsAnswerRevealed] = useState(false);

  return (
    <div className="w-full">
      <div className="rounded-2xl border border-slate-200/80 bg-white p-6 dark:border-slate-700 dark:bg-slate-900">
        {/* Header */}
        <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">
          Flashcards
        </h1>

        {/* Flashcard of the day */}
        <div className="mt-6 max-w-2xl">
          <h2 className="mb-3 text-base font-semibold text-slate-900 dark:text-slate-100">
            Flashcard of the day
          </h2>

          <div
            onClick={() => setIsAnswerRevealed(!isAnswerRevealed)}
            className="cursor-pointer overflow-hidden rounded-xl border border-orange-300 transition hover:shadow-lg dark:border-orange-900/50"
          >
            {/* Question Section */}
            <div className="bg-orange-50 p-6 dark:bg-orange-950/20">
              <div className="mb-4 flex justify-center">
                <Heart
                  size={48}
                  className="text-orange-600 dark:text-orange-400"
                />
              </div>

              <p className="text-center text-sm leading-relaxed text-orange-900 dark:text-orange-100">
                A 65 years old male presents with sudden onset chest pain
                radiating to his back. What is most likely diagnosis?
              </p>
            </div>

            {/* Answer Section */}
            <div className="bg-blue-50 p-6 dark:bg-blue-950/20">
              {!isAnswerRevealed ? (
                <p className="w-full rounded-lg py-3 text-center font-semibold text-blue-600 transition dark:text-blue-400">
                  Click any card to reveal the answer
                </p>
              ) : (
                <div className="text-center">
                  <p className="text-2xl font-bold text-orange-700 dark:text-orange-400">
                    Pulmonary Embolism
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Choose a subspecialty to study */}
        <div className="mt-8">
          <h2 className="mb-4 text-base font-semibold text-slate-900 dark:text-slate-100">
            Choose a subspecialty to study
          </h2>

          <Accordion type="single" collapsible className="space-y-2">
            {demoSubspecialties.map((item) => (
              <FlashCard
                key={item.id}
                id={item.id}
                title={item.title}
                chapters={item.chapters}
                icon={item.icon}
                chapterTitles={item.chapterTitles}
              />
            ))}
          </Accordion>
        </div>
      </div>
    </div>
  );
};

export default MainFlashCard;
