import { useEffect, useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

import heroes from "./HeroData";

interface DraftPickerV2Props {
  picks: (Hero | null)[];
  bans: (Hero | null)[];
  nicknames: string[];
  teamNames: string[];
  teamLogos: string[];
  winIndicators: boolean[];
  tournamentName: string;
  timer: string;
  phase: string;
}

interface Hero {
  name: string;
  img: string;
}

export default function DraftPickerV2() {
  const [picks, setPicks] = useState<(Hero | null)[]>([]);
  const [bans, setBans] = useState<(Hero | null)[]>([]);
  const [nicknames, setNicknames] = useState<string[]>([]);
  const [teamNames, setTeamNames] = useState<string[]>([]);
  const [teamLogos, setTeamLogos] = useState<string[]>([]);
  const [winIndicators, setWinIndicators] = useState<boolean[]>([]);
  const [tournamentName, setTournamentName] = useState("");
  const [timer, setTimer] = useState("");
  const [phase, setPhase] = useState("");

  useEffect(() => {
    const storedPickNames = JSON.parse(localStorage.getItem("picks") || "[]");
    const restoredPicks = storedPickNames.map((name: string | null) =>
      name ? heroes.find((h) => h.name === name) || null : null
    );
    setPicks(restoredPicks);
    setBans(restoredPicks.slice(10));
    setNicknames(JSON.parse(localStorage.getItem("nicknames") || "[]"));
    setTeamNames(JSON.parse(localStorage.getItem("teamNames") || "[]"));
    setTeamLogos(JSON.parse(localStorage.getItem("teamLogos") || "[]"));
    setWinIndicators(JSON.parse(localStorage.getItem("winIndicators") || "[]"));
    setTournamentName(localStorage.getItem("tournamentName") || "");
    setTimer(localStorage.getItem("timer") || "");
    setPhase(localStorage.getItem("phase") || "");
  }, []);

  return (
    <div className="relative w-full min-h-screen overflow-hidden">
      {/* Overlay gradient */}

      {/* <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-black/50" /> */}

      <video
        autoPlay
        loop
        muted
        className="absolute inset-0 w-full h-full -z-10"
        style={{ objectFit: "cover" }}
      >
        <source src="/Assets/MainBanPickShell.mp4" type="video/mp4" />
      </video>

      {/* Main content */}
      <div className="relative z-10 w-full h-full flex flex-col">
        {/* Header with team names */}
        <div className="flex justify-between items-center px-8 pt-4">
          {/* Team 1 */}
          <div className="flex items-center gap-4">
            <div className="w-24 h-24 relative">
              <div className="absolute inset-0 border-2 border-yellow-400 bg-gradient-to-br from-yellow-400/20 to-yellow-600/20" />
              <Image
                src={teamLogos[0]}
                alt="Team 1 logo"
                width={96}
                height={96}
                className="object-contain"
              />
            </div>
            <div className="relative">
              <div className="absolute -inset-2 bg-gradient-to-r from-red-800 to-red-900 skew-x-12" />
              <div className="relative px-8 py-2 text-4xl font-bold text-yellow-100">
                {teamNames[0]}
              </div>
            </div>
          </div>

          {/* Tournament logo */}
          <div className="relative w-40 h-40">
            <Image
              src="https://www.battleknightesports.com/_next/image?url=%2F200x200b.png&w=640&q=75"
              alt="Tournament logo"
              width={160}
              height={160}
              className="object-contain"
            />
          </div>

          {/* Team 2 */}
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="absolute -inset-2 bg-gradient-to-r from-red-900 to-red-800 -skew-x-12" />
              <div className="relative px-8 py-2 text-4xl font-bold text-yellow-100">
                {teamNames[1]}
              </div>
            </div>
            <div className="w-24 h-24 relative">
              <div className="absolute inset-0 border-2 border-yellow-400 bg-gradient-to-br from-yellow-400/20 to-yellow-600/20" />
              <Image
                src={teamLogos[1]}
                alt="Team 2 logo"
                width={96}
                height={96}
                className="object-contain"
              />
            </div>
          </div>
        </div>

        {/* Picks section */}
        <div className="flex justify-between px-4 mt-8">
          {picks.slice(0, 10).map((hero, i) => (
            <div
              key={i}
              className={cn(
                "w-28 h-44 relative overflow-hidden rounded",
                "bg-gradient-to-b from-zinc-800/90 to-zinc-900/90",
                "border border-zinc-700/50"
              )}
            >
              {hero ? (
                <Image
                  src={hero.img}
                  alt={hero.name}
                  // width={128}
                  height={192}
                  className="object-cover w-[calc(100vh / 10 * 0.7)]"
                />
              ) : (
                <div className="w-full h-full bg-[url('/placeholder.png')] bg-cover" />
              )}
              <div className="absolute bottom-0 left-0 right-0 bg-black/70 text-white text-center py-1">
                {nicknames[i]}
              </div>
            </div>
          ))}
        </div>

        {/* Center timer */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
          <div className="text-6xl font-bold text-white bg-black/50 px-6 py-2 rounded-full border border-yellow-400/50">
            {timer}
          </div>
        </div>

        {/* Bans section */}
        <div className="absolute bottom-24 left-0 right-0">
          <div className="flex justify-between px-8">
            {bans.map((hero, i) => (
              <div
                key={i}
                className={cn(
                  "w-12 h-12 relative overflow-hidden rounded",
                  "bg-gradient-to-b from-zinc-800/90 to-zinc-900/90",
                  "border border-red-900/50"
                )}
              >
                {i < 5 && hero && (
                  <>
                    <Image
                      src={hero.img}
                      alt={hero.name}
                      width={64}
                      height={64}
                      className="object-cover grayscale"
                    />
                    <div className="absolute inset-0 bg-red-900/30" />
                  </>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Status bar */}
        <div className="absolute bottom-0 left-0 right-0">
          <div className="relative h-16">
            {/* Background with clipped corners */}
            <div className="absolute inset-0 " />

            {/* Content */}
            <div className="relative flex items-center justify-between px-8 h-full">
              <div className="text-lg text-yellow-900 font-bold">
                {tournamentName}
              </div>
              <div className="text-2xl font-bold text-white text-center">
                {phase}
              </div>
              <div className="text-lg text-yellow-900 font-bold">
                BRACKET - LAN QUALIFIER ONLINE P1
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .clip-status-bar {
          clip-path: polygon(0 0, 95% 0, 100% 100%, 5% 100%);
        }
      `}</style>
    </div>
  );
}
