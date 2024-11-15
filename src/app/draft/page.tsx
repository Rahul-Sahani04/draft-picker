"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import heroes from "../HeroData";
import { motion, AnimatePresence } from "framer-motion";
import { Rnd } from "react-rnd";
import { Check, CrossIcon } from "lucide-react";

import { HeroCard } from "./components/HeroImage";
import { a } from "framer-motion/client";

interface Hero {
  name: string;
  img: string;
}

interface ComponentPosition {
  x: number;
  y: number;
  width: number | string;
  height: number | string;
}

interface ComponentData {
  id: string;
  type: string;
  defaultPosition: ComponentPosition;
}

const actionOrder = [
  { player: 1, actionType: "ban", index: 0 },
  { player: 6, actionType: "ban", index: 1 },
  { player: 2, actionType: "ban", index: 2 },
  { player: 7, actionType: "ban", index: 3 },
  { player: 3, actionType: "ban", index: 4 },
  { player: 8, actionType: "ban", index: 5 },
  { player: 1, actionType: "pick", index: 6 },
  [{ player: 6, actionType: "pick", index: 7 }, { player: 7, actionType: "pick", index: 7 }],
  [{ player: 2, actionType: "pick", index: 8 }, { player: 3, actionType: "pick", index: 8 }],
  { player: 8, actionType: "pick", index: 9 },
  { player: 9, actionType: "ban", index: 10 },
  { player: 4, actionType: "ban", index: 11 },
  { player: 10, actionType: "ban", index: 12 },
  { player: 5, actionType: "ban", index: 13 },
  { player: 9, actionType: "pick", index: 14 },
  [{ player: 4, actionType: "pick", index: 15 }, { player: 5, actionType: "pick", index: 15 }],
  { player: 10, actionType: "pick", index: 16 }
]

export default function DraftPickerV3() {
  const [picks, setPicks] = useState<(Hero | null)[]>(Array(10).fill(null));
  const [bans, setBans] = useState<(Hero | null)[]>(Array(10).fill(null));
  const [team1Bans, setTeam1Bans] = useState<(Hero | null)[]>(
    Array(5).fill(null)
  );
  const [team2Bans, setTeam2Bans] = useState<(Hero | null)[]>(
    Array(5).fill(null)
  );

  const [team1Picks, setTeam1Picks] = useState<(Hero | null)[]>(
    Array(5).fill(null)
  );
  const [team2Picks, setTeam2Picks] = useState<(Hero | null)[]>(
    Array(5).fill(null)
  );

  const [nicknames, setNicknames] = useState<string[]>(Array(10).fill(""));
  const [teamNames, setTeamNames] = useState<string[]>(["Team 1", "Team 2"]);
  const [teamLogos, setTeamLogos] = useState<string[]>([
    "/placeholder.svg",
    "/placeholder.svg",
  ]);
  const [tournamentName, setTournamentName] = useState("");
  const [timer, setTimer] = useState("");
  const [phase, setPhase] = useState("");
  const [componentPositions, setComponentPositions] = useState<{
    [key: string]: ComponentPosition;
  }>({});
  const [isEditorMode, setIsEditorMode] = useState(true);
  const [closeSidebar, setCloseSidebar] = useState(false);
  const [components, setComponents] = useState<ComponentData[]>([]);
  const [currentAction, setCurrentAction] = useState(actionOrder[0]);
  const [team1Wins, setTeam1Wins] = useState([false, false, false]);
  const [team2Wins, setTeam2Wins] = useState([false, false, false]);

  const [team1ScorePosition, setTeam1ScorePosition] = useState({
    x: 400,
    y: 50,
    width: 100,
    height: 100,
  });

  const [team2ScorePosition, setTeam2ScorePosition] = useState({
    x: 500,
    y: 50,
    width: 100,
    height: 100,
  });

  const [team1ScoreSize, setTeam1ScoreSize] = useState({
    width: 100,
    height: 100,
  });

  const [team2ScoreSize, setTeam2ScoreSize] = useState({
    width: 100,
    height: 100,
  });

  const videoRef = useRef<HTMLVideoElement>(null);

  const getHeroImageByID = (id: number) => {
    const hero = heroes.find((h) => h.id === id);
    return hero ? hero.img : "/placeholder.svg";
  };

  useEffect(() => {
    const handleStorageChange = () => {
      const storedData = JSON.parse(
        localStorage.getItem("draftPickerData") || "{}"
      );

      // Handle picks
      const pickSelections =
        storedData.selections?.filter(
          (_: any, index: number) => Array.isArray(actionOrder[index]) ? actionOrder[index].some(action => action.actionType === "pick") : actionOrder[index].actionType === "pick"
        ) || [];
      const updatedPicks = pickSelections.map((heroId: number) => {
        const hero = heroes.find((h) => h.id === heroId);
        return hero ? { name: hero.name, img: hero.img } : null;
      });
      setPicks(updatedPicks.length ? updatedPicks : Array(10).fill(null));

      // Handle bans
      // const banSelections =
      //   storedData.selections?.filter(
      //     (_: any, index: number) => actionOrder[index].actionType === "ban"
      //   ) || [];
      // const updatedBans = banSelections.map((heroId: number) => {
      //   const hero = heroes.find((h) => h.id === heroId);
      //   return hero ? { name: hero.name, img: hero.img } : null;
      // });
      // setBans(updatedBans.length ? updatedBans : Array(14).fill(null));

      // Divide bans into two teams
      // const team1Bans = updatedBans.slice(0, 5);
      // const team2Bans = updatedBans.slice(5, 10);

      // Find and update team1Bans and team2Bans only where there is a change 

      // if teams ban contains id of hero, then replace with hero object
      const team1Bans = storedData.team1Bans.map((heroId: number) => {
        const hero = heroes.find((h) => h.id === heroId);
        return hero ? { name: hero.name, img: hero.img } : null;
      });

      const team2Bans = storedData.team2Bans.map((heroId: number) => {
        const hero = heroes.find((h) => h.id === heroId);
        return hero ? { name: hero.name, img: hero.img } : null;
      });

      setTeam1Bans(team1Bans.length ? team1Bans : Array(5).fill(null));
      setTeam2Bans(team2Bans.length ? team2Bans : Array(5).fill(null));

      const team1Picks = storedData.team1Picks.map((heroId: number) => {
        const hero = heroes.find((h) => h.id === heroId);
        return hero ? { name: hero.name, img: hero.img } : null;
      });

      const team2Picks = storedData.team2Picks.map((heroId: number) => {
        const hero = heroes.find((h) => h.id === heroId);
        return hero ? { name: hero.name, img: hero.img } : null;
      });

      console.log("team1Bans", team1Bans);
      console.log("team2Bans", team2Bans);

      console.log("team1Picks", team1Picks);
      console.log("team2Picks", team2Picks);

      setTeam1Picks(team1Picks.length ? team1Picks : Array(5).fill(null));
      setTeam2Picks(team2Picks.length ? team2Picks : Array(5).fill(null));

      // setTeam1Bans(team1Bans.length ? storedData.team1Bans : Array(5).fill(null));
      // setTeam2Bans(team2Bans.length ? storedData.team2Bans : Array(5).fill(null));

      setNicknames(storedData.nicknames || Array(10).fill(""));
      setTeamNames(storedData.teamNames || ["Team 1", "Team 2"]);
      setTeamLogos(
        storedData.teamLogos || ["/placeholder.svg", "/placeholder.svg"]
      );
      setTournamentName(storedData.tournamentName || "");
      setTimer(storedData.timer || "");
      setPhase(storedData.phase || "");
      setTeam1Wins(storedData.team1Wins || [false, false, false]);
      setTeam2Wins(storedData.team2Wins || [false, false, false]);
      setCurrentAction(actionOrder[storedData.currentStep || 0]);
    };

    window.addEventListener("storage", handleStorageChange);
    handleStorageChange(); // Initial load

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  const updateComponentPosition = (
    key: string,
    position: ComponentPosition
  ) => {
    setComponentPositions((prev) => ({ ...prev, [key]: position }));
  };

  const resetPositions = () => {
    setComponentPositions({});
    setComponents([]);
  };

  const addComponent = (type: string) => {
    const id = `${type}-${Date.now()}`;
    const defaultPosition = { x: 400, y: 120, width: 600, height: 250 };

    const componentCount = components.filter(
      (component) => component.type === type
    ).length;

    if (
      (type === "picks" && componentCount >= 1) ||
      (type === "picks2" && componentCount >= 1) ||
      (type === "bans1" && componentCount >= 1) ||
      (type === "bans2" && componentCount >= 1) ||
      (type === "team1Name" && componentCount >= 1) ||
      (type === "team1Logo" && componentCount >= 1) ||
      (type === "team2Name" && componentCount >= 1) ||
      (type === "team2Logo" && componentCount >= 1) ||
      (type === "tournamentLogo" && componentCount >= 1) ||
      (type === "timer" && componentCount >= 1) ||
      (type === "footer" && componentCount >= 1)
    ) {
      alert(`You reached the limit for ${type} component.`);
      return;
    }

    setComponents((prev) => [...prev, { id, type, defaultPosition }]);
  };

  const RndWrapper = ({
    children,
    defaultPosition,
    id,
  }: {
    children: React.ReactNode;
    defaultPosition: ComponentPosition;
    id: string;
  }) => (
    <Rnd
      size={{
        width: componentPositions[id]?.width || defaultPosition.width,
        height: componentPositions[id]?.height || defaultPosition.height,
      }}
      position={{
        x: componentPositions[id]?.x || defaultPosition.x,
        y: componentPositions[id]?.y || defaultPosition.y,
      }}
      onDragStop={(e, d) => {
        updateComponentPosition(id, {
          x: d.x,
          y: d.y,
          width: componentPositions[id]?.width || defaultPosition.width,
          height: componentPositions[id]?.height || defaultPosition.height,
        });
      }}
      onResizeStop={(e, direction, ref, delta, position) =>
        updateComponentPosition(id, {
          width: ref.offsetWidth,
          height: ref.offsetHeight,
          x: position.x,
          y: position.y,
        })
      }
      enableUserSelectHack={true}
      enableResizing={isEditorMode}
      dragHandleClassName="drag-handle"
      dragAxis="both"
      disableDragging={!isEditorMode}
      className="z-50"
    >
      {children}
    </Rnd>
  );

  const renderComponent = (component: ComponentData) => {
    switch (component.type) {
      case "team1Name":
        return (
          <RndWrapper
            key={component.id}
            id={component.id}
            defaultPosition={component.defaultPosition}
          >
            <div className="relative px-8 py-2 text-4xl font-bold text-yellow-100 h-full flex items-center drag-handle">
              {teamNames[0]}
            </div>
          </RndWrapper>
        );
      case "team1Logo":
        return (
          <RndWrapper
            key={component.id}
            id={component.id}
            defaultPosition={component.defaultPosition}
          >
            <div className="relative w-full h-full drag-handle">
              <div className="absolute inset-0 border-2 border-yellow-400 bg-gradient-to-br from-yellow-400/20 to-yellow-600/20" />
              <Image
                src={teamLogos[0] || "/placeholder.svg"}
                alt="Team 1 logo"
                layout="fill"
                objectFit="contain"
                draggable={false}
              />
            </div>
          </RndWrapper>
        );
      case "team2Name":
        return (
          <RndWrapper
            key={component.id}
            id={component.id}
            defaultPosition={component.defaultPosition}
          >
            <div className="relative px-8 py-2 text-4xl font-bold text-yellow-100 h-full flex items-center drag-handle">
              {teamNames[1]}
            </div>
          </RndWrapper>
        );
      case "team2Logo":
        return (
          <RndWrapper
            key={component.id}
            id={component.id}
            defaultPosition={component.defaultPosition}
          >
            <div className="relative w-full h-full drag-handle">
              <div className="absolute inset-0 border-2 border-yellow-400 bg-gradient-to-br from-yellow-400/20 to-yellow-600/20" />
              <Image
                src={teamLogos[1] || "/placeholder.svg"}
                alt="Team 2 logo"
                layout="fill"
                objectFit="contain"
                draggable={false}
              />
            </div>
          </RndWrapper>
        );
      case "tournamentLogo":
        return (
          <RndWrapper
            key={component.id}
            id={component.id}
            defaultPosition={component.defaultPosition}
          >
            <div className="w-full h-full drag-handle">
              <Image
                src="/placeholder.svg"
                alt="Tournament logo"
                layout="fill"
                objectFit="contain"
                draggable={false}
              />
            </div>
          </RndWrapper>
        );
      case "picks":
        return (
          <RndWrapper
            key={component.id}
            id={component.id}
            defaultPosition={component.defaultPosition}
          >
            <div className="flex space-x-[0.3vw] h-full drag-handle transition-all duration-300 ">
              {team1Picks.slice(0, 5).map((hero, index) => (
                <motion.div
                  key={index}
                  initial={{ scale: 1 }}
                  transition={{ duration: 0.3 }}
                  className="w-full h-full relative flex-grow"
                >
                  <HeroCard
                    hero={hero}
                    index={index}
                    animate={
                      isActiveAction(index, "pick", true)
                    }
                  />

                  {/* Selected Players nickname */}
                  <div className="absolute bottom-0 left-0 px-1 opacity-70 w-full bg-black/70 text-white text-center z-50">
                    {nicknames[index]}
                  </div>
                </motion.div>
              ))}
            </div>
          </RndWrapper>
        );
      case "picks2":
        return (
          <RndWrapper
            key={component.id}
            id={component.id}
            defaultPosition={component.defaultPosition}
          >
            <div className="flex space-x-[0.3vw] h-full drag-handle transition-all duration-300 ">
              {team2Picks.slice(0, 5).map((hero, index) => (
                <motion.div
                  key={index}
                  initial={{ scale: 1 }}
                  transition={{ duration: 0.3 }}
                  className="w-full h-full relative flex-grow"
                >
                  <HeroCard
                    hero={hero}
                    index={index}
                    animate={
                      isActiveAction(index, "pick", false)
                    }
                  />

                  {/* Selected Players nickname */}
                  <div className="absolute bottom-0 left-0 px-1 opacity-70 w-full bg-black/70 text-white text-center z-50">
                    {nicknames[index]}
                  </div>
                </motion.div>
              ))}
            </div>
          </RndWrapper>
        );
      case "timer":
        return (
          <RndWrapper
            key={component.id}
            id={component.id}
            defaultPosition={component.defaultPosition}
          >
            <div className="w-full h-full flex items-center justify-center text-3xl font-bold text-white bg-black/50 rounded-full border border-yellow-400/50 drag-handle">
              {timer}
            </div>
          </RndWrapper>
        );
        case "bans1":
          return (
            <RndWrapper
              key={component.id}
              id={component.id}
              defaultPosition={component.defaultPosition}
            >
              <div className="flex justify-between space-x-[0.52vw] h-full drag-handle">
                {team1Bans.map((hero, index) => (
                  <motion.div
                    key={index}
                    className={cn(
                      "relative overflow-hidden rounded flex-grow",
                      "bg-gradient-to-b from-zinc-800/90 to-zinc-900/90",
                      "border border-red-900/50"
                    )}
                    transition={{ duration: 2 }}
                  >

                    {!hero && isActiveAction(index, "ban", true) && (
                      <Image
                        src="/Ban__Animation_VP9.gif"
                        alt="Ban Animation"
                        id="Animation"
                        layout="fill"
                        objectFit="cover"
                        draggable={false}
                        className="z-10"
                      />
                    )}
                  <AnimatePresence>
                    {hero && (
                                          <motion.div
                                          key={hero.name}
                                          initial={{ opacity: 0, y: 20 }}
                                          animate={{ opacity: 1, y: 0 }}
                                          exit={{ opacity: 0, y: 20 }}
                                          transition={{ duration: 0.5 }}
                                          className="w-full h-full relative"
                                        >
                      <Image
                        key={hero.name}
                        src={hero.img}
                        alt={hero.name}
                        layout="fill"
                        objectFit="cover"
                        className={`grayscale z-10`}

                        draggable={false}
                      />
                      </motion.div>
                    )}
                    </AnimatePresence>
                    <div className="absolute inset-0 bg-red-900/30" />
                  </motion.div>
                ))}
              </div>
            </RndWrapper>
          );
        case "bans2":
          return (
            <RndWrapper
              key={component.id}
              id={component.id}
              defaultPosition={component.defaultPosition}
            >
              <div className="flex justify-between space-x-[0.52vw] h-full drag-handle">
                {team2Bans.map((hero, index) => (
                  <motion.div
                    key={index}
                    className={cn(
                      "relative overflow-hidden rounded flex-grow",
                      "bg-gradient-to-b from-zinc-800/90 to-zinc-900/90",
                      "border border-red-900/50"
                    )}
                    // initial={{ scale: 1 }}
                    // animate={{
                    //   scale: isActiveAction(index + 7, "ban", false) ? 1.1 : 1,
                    //   boxShadow: isActiveAction(index + 7, "ban", false)
                    //     ? "0 0 20px rgba(255,0,0,0.5)"
                    //     : "none",
                    // }}
                    transition={{ duration: 0.3 }}
                  >
                    {!hero && isActiveAction(index , "ban", false) ? (
                      <Image
                        src="/Ban__Animation_VP9.gif"
                        alt="Ban Animation"
                        id="Animation"
                        layout="fill"
                        objectFit="cover"
                        draggable={false}
                        className="z-10"
                      />
                    ) : (
                      <></>
                    )}
  
                    {hero && (
                      <Image
                        src={hero.img}
                        alt={hero.name}
                        layout="fill"
                        objectFit="cover"
                        className="grayscale z-10"
                        draggable={false}
                      />
                    )}
                    <div className="absolute inset-0 bg-red-900/30" />
                  </motion.div>
                ))}
              </div>
            </RndWrapper>
          );
      case "footer":
        return (
          <RndWrapper
            key={component.id}
            id={component.id}
            defaultPosition={component.defaultPosition}
          >
            <div className="relative h-full drag-handle">
              <div className="absolute inset-0" />
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
          </RndWrapper>
        );
      default:
        return null;
    }
  };

  const isActiveAction = (index: number, type: string, isTeam1: boolean) => {
    if (Array.isArray(currentAction)) {
      const result = currentAction.some(
        (action) =>
          action.actionType === type &&
          ((isTeam1 && action.player <= 5) ||
            (!isTeam1 && action.player > 5)) &&
          (type === "pick"
            ? isTeam1
              ? action.player - 1
              : action.player - 6
            : isTeam1
            ? action.player - 1
            : action.player - 6) === index
      );

      console.log(result);
      return result;
    } else {
      const result = (
        currentAction.actionType === type &&
        ((isTeam1 && currentAction.player <= 5) ||
          (!isTeam1 && currentAction.player > 5)) &&
        (type === "pick"
          ? isTeam1
            ? currentAction.player - 1
            : currentAction.player - 6
          : isTeam1
          ? currentAction.player - 1
          : currentAction.player - 6) === index
      );

      console.log(result);
      return result;
    }
  };

  // Animate only a single card ban or pick at a time based on action. Only and only animate two cards when two picks are happening at the same time.
  // const animateCard = (index: number, type: string, isTeam1: boolean) => {


  const Sidebar = () => (
    <div
      className={`fixed top-0 left-0 w-64 ${
        closeSidebar ? "h-12" : "h-full"
      }  bg-gray-800 text-white p-4 z-30 transition-all duration-200`}
    >
      <CrossIcon
        className="absolute top-4 right-4 cursor-pointer"
        onClick={() => setCloseSidebar(!closeSidebar)}
      />
      <h2 className="text-xl font-bold mb-4">Sidebar</h2>

      {!closeSidebar && (
        <>
          <div className="space-y-4">
            <button
              onClick={() => addComponent("team1Name")}
              className="w-full bg-blue-500 py-2 rounded"
            >
              Add Team 1 Name
            </button>
            <button
              onClick={() => addComponent("team1Logo")}
              className="w-full bg-blue-500 py-2 rounded"
            >
              Add Team 1 Logo
            </button>
            <button
              onClick={() => addComponent("team2Name")}
              className="w-full bg-blue-500 py-2 rounded"
            >
              Add Team 2 Name
            </button>
            <button
              onClick={() => addComponent("team2Logo")}
              className="w-full bg-blue-500 py-2 rounded"
            >
              Add Team 2 Logo
            </button>
            <button
              onClick={() => addComponent("tournamentLogo")}
              className="w-full bg-blue-500 py-2 rounded"
            >
              Add Tournament Logo
            </button>
            <button
              onClick={() => addComponent("picks")}
              className="w-full bg-blue-500 py-2 rounded"
            >
              Add Picks
            </button>
            <button
              onClick={() => addComponent("picks2")}
              className="w-full bg-blue-500 py-2 rounded"
            >
              Add Picks 2
            </button>
            <button
              onClick={() => addComponent("timer")}
              className="w-full bg-blue-500 py-2 rounded"
            >
              Add Timer
            </button>
            <button
              onClick={() => addComponent("bans1")}
              className="w-full bg-blue-500 py-2 rounded"
            >
              Add Team 1 Bans
            </button>
            <button
              onClick={() => addComponent("bans2")}
              className="w-full bg-blue-500 py-2 rounded"
            >
              Add Team 2 Bans
            </button>
            <button
              onClick={() => addComponent("footer")}
              className="w-full bg-blue-500 py-2 rounded"
            >
              Add Footer
            </button>
          </div>
        </>
      )}
    </div>
  );

  const WinChecker = () => {
    return (
      <div className={`w-full  h-full flex gap-8 z-30 rounded-lg`}>
        <Rnd
          key={"team1Wins"}
          default={team1ScorePosition}
          onDragStop={(e, d) => {
            setTeam1ScorePosition({
              x: d.x,
              y: d.y,
              width: team1ScorePosition.width,
              height: team1ScorePosition.height,
            });
          }}
          onResizeStop={(e, direction, ref, delta, position) => {
            setTeam1ScorePosition({
              width: ref.offsetWidth,
              height: ref.offsetHeight,
              x: position.x,
              y: position.y,
            });
          }}
          // bounds="parent"
          enableResizing={isEditorMode}
          dragHandleClassName="drag-handle"
          dragAxis="both"
          dragGrid={[10, 10]}
          disableDragging={!isEditorMode}
          className="z-50 w-full h-full"
        >
          <div className="w-full h-full flex flex-col items-center drag-handle">
            {/* <h3 className="text-white mb-2">{teamNames[0]}</h3> */}
            <div className="w-full h-full flex gap-2 relative">
              {team1Wins.map((win, index) => (
                <div
                  key={index}
                  className={cn(
                    "w-1/3 h-full rounded flex items-center justify-center",
                    win ? "bg-green-500" : "bg-gray-700"
                  )}
                >
                  {/* {win && <Check className="text-white" size={16} />} */}
                </div>
              ))}
            </div>
          </div>
        </Rnd>
        <Rnd
          key={"team2Wins"}
          default={team2ScorePosition}
          onDragStop={(e, d) => {
            setTeam2ScorePosition({
              x: d.x,
              y: d.y,
              width: team1ScorePosition.width,
              height: team1ScorePosition.height,
            });
          }}
          onResizeStop={(e, direction, ref, delta, position) => {
            setTeam2ScorePosition({
              width: ref.offsetWidth,
              height: ref.offsetHeight,
              x: position.x,
              y: position.y,
            });
          }}
          dragGrid={[10, 10]}
          // bounds="parent"
          enableResizing={isEditorMode}
          dragHandleClassName="drag-handle"
          dragAxis="both"
          disableDragging={!isEditorMode}
          className="z-50"
        >
          <div className="w-full h-full flex flex-col items-center drag-handle">
            {/* <h3 className="text-white mb-2">{teamNames[1]}</h3> */}
            <div className="w-full h-full flex gap-2 relative">
              {team2Wins.map((win, index) => (
                <div
                  key={index}
                  className={cn(
                    "w-full  h-full rounded flex items-center justify-center",
                    win ? "bg-green-500" : "bg-gray-700"
                  )}
                >
                  {/* {win && <Check className="text-white" size={16} />} */}
                </div>
              ))}
            </div>
          </div>
        </Rnd>
      </div>
    );
  };

  return (
    <div className="relative w-full min-h-screen overflow-hidden">
      <div className="absolute bg-green-500 w-screen h-screen -z-20" />
      {isEditorMode && <Sidebar />}
      <WinChecker />

      <video
        autoPlay
        loop
        muted
        className="absolute inset-0 object-cover w-full h-full -z-10"
      >
        <source src="/Assets/Main Ban Pick Shell_VP9.webm" type="video/webm" />
      </video>

      <video
        autoPlay
        loop
        muted
        className="absolute inset-0 object-cover w-full h-full z-10"
        ref={videoRef}
      >
        <source src="/Assets/Swiss Bracket Lower_VP9.webm" type="video/webm" />
      </video>

      <div className="relative z-20 w-full h-full flex flex-col">
        {components.map(renderComponent)}
      </div>

      <div className="fixed bottom-4 right-4 flex gap-2 z-30">
        <button
          onClick={resetPositions}
          className="bg-blue-500 text-white px-4 py-2 rounded-md"
        >
          Reset Positions
        </button>
        <button
          onClick={() => setIsEditorMode(!isEditorMode)}
          className="bg-green-500 text-white px-4 py-2 rounded-md"
        >
          {isEditorMode ? "Switch to Preview Mode" : "Switch to Editor Mode"}
        </button>
      </div>
    </div>
  );
}
