"use client";

import { LayoutGroup } from "framer-motion";

import { DietMomentsFeed } from "@/components/wellness/DietMomentsFeed";

import { MuseumCoreModules } from "./MuseumCoreModules";
import { MuseumDailySeason } from "./MuseumDailySeason";
import { MuseumHero } from "./MuseumHero";
import { MuseumMobileDock } from "./MuseumMobileDock";
import { MuseumNav } from "./MuseumNav";

export function MuseumLanding() {
  return (
    <div className="museum-ambient museum-airy relative min-h-screen text-[#3a4540]">
      <LayoutGroup id="dbcnet-museum-landing">
        <main
          id="museum-home"
          className="relative z-10 mx-auto flex w-full max-w-[min(100%,120rem)] flex-col museum-gutter-x pb-28 [text-rendering:optimizeLegibility] lg:pb-0"
        >
          <MuseumNav />
          <section
            id="hero"
            className="relative min-h-[100dvh] scroll-mt-[max(4.75rem,calc(env(safe-area-inset-top,0px)+3.5rem))] lg:scroll-mt-[max(6.5rem,calc(env(safe-area-inset-top,0px)+5rem))]"
          >
            <MuseumHero />
          </section>
          <MuseumDailySeason />
          <DietMomentsFeed className="pb-20 pt-6 sm:pb-28 sm:pt-10" />
          <MuseumCoreModules />
        </main>
        <MuseumMobileDock />
      </LayoutGroup>
    </div>
  );
}
