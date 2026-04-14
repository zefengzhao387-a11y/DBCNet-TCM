"use client";

import { LayoutGroup } from "framer-motion";
import { useEffect } from "react";

import { Atmosphere } from "@/components/background/Atmosphere";
import { useSeasonTheme } from "@/hooks/useSeasonTheme";

import { MuseumCoreModules } from "./MuseumCoreModules";
import { MuseumDailySeason } from "./MuseumDailySeason";
import { MuseumHero } from "./MuseumHero";
import { MuseumMobileDock } from "./MuseumMobileDock";
import { MuseumNav } from "./MuseumNav";

export function MuseumLanding() {
  const { season } = useSeasonTheme();

  useEffect(() => {
    return () => {
      const root = document.documentElement;
      root.classList.remove(
        "season-spring",
        "season-summer",
        "season-autumn",
        "season-winter",
      );
      delete root.dataset.season;
    };
  }, []);

  return (
    <div className="museum-ambient museum-airy relative min-h-screen text-stone-800">
      <div className="pointer-events-none fixed inset-0 z-0 overflow-x-hidden overflow-y-hidden">
        <Atmosphere season={season} />
      </div>

      <LayoutGroup id="dbcnet-museum-landing">
        <main
          id="museum-home"
          className="relative z-10 mx-auto flex w-full max-w-[min(100dvw,120rem)] flex-col museum-gutter-x pb-28 [text-rendering:optimizeLegibility] lg:pb-0"
        >
          <MuseumNav />
          <section
            id="hero"
            className="relative scroll-mt-[max(4.75rem,calc(env(safe-area-inset-top,0px)+3.5rem))] lg:scroll-mt-[max(6.5rem,calc(env(safe-area-inset-top,0px)+5rem))]"
          >
            <MuseumHero />
          </section>
          <MuseumDailySeason />
          <MuseumCoreModules />
        </main>
        <MuseumMobileDock />
      </LayoutGroup>
    </div>
  );
}
