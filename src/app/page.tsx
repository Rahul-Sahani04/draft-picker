"use client"

import { useState, useEffect, SetStateAction } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Image from "next/image"

import heroes from "./HeroData"


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


export default function Component() {
  const [currentStep, setCurrentStep] = useState(0)
  const [selections, setSelections] = useState(Array(actionOrder.length).fill(null))
  const [tempSelection, setTempSelection] = useState<number | null>(null) // Temporary selection before confirmation
  const [secondTempSelection, setSecondTempSelection] = useState<number | null>(null) // Temporary selection before confirmation


  const [team1Picks, setTeam1Picks] = useState(Array(5).fill(null))
  const [team2Picks, setTeam2Picks] = useState(Array(5).fill(null))


  const [team1Bans, setTeam1Bans] = useState(Array(5).fill(null))
  const [team2Bans, setTeam2Bans] = useState(Array(5).fill(null))


  const [teamNames, setTeamNames] = useState(["Team 1", "Team 2"])
  const [teamLogos, setTeamLogos] = useState(["/placeholder.svg?height=80&width=80", "/placeholder.svg?height=80&width=80"])


  const [tournamentName, setTournamentName] = useState("")


  const [nicknames, setNicknames] = useState(Array(10).fill(""))

  const [timer, setTimer] = useState("00:00")
  const [phase, setPhase] = useState("BANNING")

  
  const [team1Wins, setTeam1Wins] = useState([false, false, false])
  const [team2Wins, setTeam2Wins] = useState([false, false, false])

  const [SecondInput, setSecondInput] = useState(false)

  useEffect(() => {
    const storedData = localStorage.getItem("draftPickerData")
    if (storedData) {
      const parsedData = JSON.parse(storedData)
      setSelections(parsedData.selections)
      setTeam1Picks(parsedData.team1Picks)
      setTeam2Picks(parsedData.team2Picks)
      setTeam1Bans(parsedData.team1Bans)
      setTeam2Bans(parsedData.team2Bans)
      setTeamNames(parsedData.teamNames)
      setTeamLogos(parsedData.teamLogos)
      setTournamentName(parsedData.tournamentName)
      setNicknames(parsedData.nicknames)
      setTimer(parsedData.timer)
      setPhase(parsedData.phase)
      setCurrentStep(parsedData.currentStep)
      setTeam1Wins(parsedData.team1Wins)
      setTeam2Wins(parsedData.team2Wins)
    }
  }, [])

  useEffect(() => {
    const data = {
      selections,
      team1Picks,
      team2Picks,
      team1Bans,
      team2Bans,
      teamNames,
      teamLogos,
      tournamentName,
      nicknames,
      timer,
      phase,
      currentStep,
      team1Wins,
      team2Wins
    };
    localStorage.setItem("draftPickerData", JSON.stringify(data));
  }, [selections, team1Picks, team2Picks, team1Bans, team2Bans, teamNames, teamLogos, tournamentName, nicknames, timer, phase, currentStep, team1Wins, team2Wins]);

  
  const handleSelection = (heroId: number) => {
    setTempSelection(heroId) // Store selected hero temporarily
  }

  const handleSelectionSecond = (heroId: number) => {
    setSecondTempSelection(heroId) // Store selected hero temporarily
  }


  const confirmSelection = () => {
    const newSelections = [...selections]
    // const simultaneousActions = Array.isArray(actionOrder[currentStep]) ? actionOrder[currentStep] : [actionOrder[currentStep]]

    const newTeam1Picks = [...team1Picks];
    const newTeam2Picks = [...team2Picks];
    const newTeam1Bans = [...team1Bans];
    const newTeam2Bans = [...team2Bans];
    const currentAction = Array.isArray(actionOrder[currentStep]) 
      ? actionOrder[currentStep][0] 
      : actionOrder[currentStep];
    
    // Get the index of the action in the actionOrder array
    const currentIndex = Array.isArray(actionOrder[currentStep]) 
      ? actionOrder[currentStep][0].index 
      : currentAction.index;
    
  //   // Find all actions that correspond to the current index (even if multiple players are involved)
    const simultaneousActions = actionOrder.filter(action => 
      Array.isArray(action) ? action.some(a => a.index === currentIndex) : action.index === currentIndex
    );


    const heroId = tempSelection;
    
    // Apply the confirmed selection for all players in this step if they are picking simultaneously
    // simultaneousActions.forEach(action => {
    //   const stepIndex = actionOrder.findIndex(
    //     a => Array.isArray(a) ? a.some(sa => sa.player === action.player && sa.index === action.index) : a.player === action.player && a.index === action.index
    //   )
    //   newSelections[stepIndex] = tempSelection
    // })


       simultaneousActions.forEach(action => {
      if (Array.isArray(action)) {
        console.log("Action is an array")

        const bothPicks = [tempSelection, secondTempSelection]

        action.forEach((subAction, index) => {
          const stepIndex = actionOrder.findIndex(a => 
            Array.isArray(a) ? a.some(sa => sa.player === subAction.player && sa.index === subAction.index)
                              : a.player === subAction.player && a.index === subAction.index
          );
          newSelections[stepIndex] = heroId; // Update selection for the correct player
          if (subAction.actionType === "pick") {
            if (subAction.player <= 5) {
              console.log(subAction.player - 1)
            console.log(heroId)
            console.log("newTeam1Picks: ", newTeam1Picks)
              // newTeam1Picks[subAction.player - 1] = heroId;
              newTeam1Picks[subAction.player - 1] = bothPicks[index];
            } else {
              // newTeam2Picks[subAction.player - 6] = heroId;
              newTeam2Picks[subAction.player - 6] = bothPicks[index];
            }
          } else {
            if (subAction.player <= 5) {
              newTeam1Bans[subAction.index % 5] = heroId;
            } else {
              newTeam2Bans[subAction.index % 5] = heroId;
            }
          }
        });
        setSecondInput(false)
      } else {
        setSecondInput(false)
        const stepIndex = actionOrder.findIndex(a => 
          Array.isArray(a) ? a.some(sa => sa.player === action.player && sa.index === action.index)
                            : a.player === action.player && a.index === action.index
        );
        newSelections[stepIndex] = heroId; // Update selection for the correct player
        if (action.actionType === "pick") {
          if (action.player <= 5) {
            console.log("Pickdd player index: ", (action.player % 5 ) - 1)
            newTeam1Picks[action.player  - 1] = heroId;
            console.log("newTeam1Picks: ", newTeam1Picks)
          } else {
            console.log("Pickdd player index: ", (action.player % 5 ) - 1)
            newTeam2Picks[action.player - 6] = heroId;
            console.log("newTeam2Picks: ", newTeam2Picks)
          }
        } else {
          if (action.player <= 5) {
            // console.log("Location: ", (action.player % 5 ) - 1)
            // console.log(heroId)
            newTeam1Bans[action.player - 1] = heroId;
            // console.log("newTeam1Picks: ", newTeam1Bans)
          } else {
            // console.log("Location: ", (action.player % 5 ) - 1)
            // console.log(heroId)
            newTeam2Bans[action.player - 6] = heroId;
            // console.log("newTeam2Picks: ", newTeam2Bans)
          }
        }
      }
    });

    setSelections(newSelections)
    setTempSelection(null) // Clear temporary selection
    setCurrentStep(prevStep => prevStep + simultaneousActions.length)

    setTeam1Picks(newTeam1Picks);
    setTeam2Picks(newTeam2Picks);
    setTeam1Bans(newTeam1Bans);
    setTeam2Bans(newTeam2Bans);
  }

    // Check if the current step is a simultaneous pick
    const isSimultaneousPick = () => {
      const currentAction = Array.isArray(actionOrder[currentStep ])
      console.log("Current Action: ", currentAction)
      return currentAction
    }

  useEffect(() => {
    console.log("Current Step: ", currentStep)
    if (currentStep < actionOrder.length) {
      if (isSimultaneousPick()) {
        console.log("Simultaneous Pick")
        setSecondInput(true)
      }
    }
  }, [currentStep])

  const handleTeamNameChange = (index: number, name: string) => {
    const newTeamNames = [...teamNames]
    newTeamNames[index] = name
    setTeamNames(newTeamNames)
  }

  const handleTeamLogoChange = (index: number, event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        const newTeamLogos = [...teamLogos]
        newTeamLogos[index] = e.target?.result as string
        setTeamLogos(newTeamLogos)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleNicknameChange = (index: number, name: string) => {
    const newNicknames = [...nicknames]
    newNicknames[index] = name
    setNicknames(newNicknames)
  }

  const resetPicks = () => {
    setSelections(Array(actionOrder.length).fill(null))
    setTeam1Picks(Array(5).fill(null))
    setTeam2Picks(Array(5).fill(null))
  }
  const resetBans = () => {
    setTeam1Bans(Array(5).fill(null))
    setTeam2Bans(Array(5).fill(null))
  }
  const resetNicknames = () => setNicknames(Array(10).fill(""))
  const switchNicknames = () => setNicknames([...nicknames.slice(5), ...nicknames.slice(0, 5)])
  const switchTeams = () => {
    setTeamNames([teamNames[1], teamNames[0]])
    setTeamLogos([teamLogos[1], teamLogos[0]])
    setNicknames([...nicknames.slice(5), ...nicknames.slice(0, 5)])
  }
  const resetAll = () => {
    setSelections(Array(actionOrder.length).fill(null))
    setTeam1Picks(Array(5).fill(null))
    setTeam2Picks(Array(5).fill(null))
    setTeam1Bans(Array(5).fill(null))
    setTeam2Bans(Array(5).fill(null))
    setTeamNames(["Team 1", "Team 2"])
    setTeamLogos(["/placeholder.svg?height=80&width=80", "/placeholder.svg?height=80&width=80"])
    setTournamentName("")
    setNicknames(Array(10).fill(""))
    setTimer("00:00")
    setPhase("BANNING")
    setCurrentStep(0)
    setTeam1Wins([false, false, false])
    setTeam2Wins([false, false, false])
  }

  const toggleWin = (team: number, game: number) => {
    if (team === 1) {
      const newWins = [...team1Wins]
      newWins[game] = !newWins[game]
      setTeam1Wins(newWins)
    } else {
      const newWins = [...team2Wins]
      newWins[game] = !newWins[game]
      setTeam2Wins(newWins)
    }
  }

  const getHeroNameById = (id: number) => {
    const hero = heroes.find(hero => hero.id === id);
    return hero ? hero.name : "Unknown Hero";
  }

  return (
    <div className="p-4 space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Tournament Settings</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <Label htmlFor="tournamentName">Tournament Name</Label>
              <Input
                id="tournamentName"
                value={tournamentName}
                onChange={(e) => setTournamentName(e.target.value)}
                placeholder="Enter tournament name"
              />
            </div>
            {[0, 1].map((index) => (
              <div key={index} className="space-y-2">
                <Label htmlFor={`team${index + 1}Name`}>Team {index + 1} Name</Label>
                <Input
                  id={`team${index + 1}Name`}
                  value={teamNames[index]}
                  onChange={(e) => handleTeamNameChange(index, e.target.value)}
                  placeholder={`Enter Team ${index + 1} name`}
                />
                <Label htmlFor={`team${index + 1}Logo`}>Team {index + 1} Logo</Label>
                <Input
                  id={`team${index + 1}Logo`}
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleTeamLogoChange(index, e as React.ChangeEvent<HTMLInputElement>)}
                />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Draft Picker</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>Current Step: {currentStep + 1}</div>
            <div>Action: Player {Array.isArray(actionOrder[currentStep]) ? actionOrder[currentStep].map(a => a.player).join(", ") : actionOrder[currentStep]?.player} - {Array.isArray(actionOrder[currentStep]) ? actionOrder[currentStep].map(a => a.actionType).join(", ") : actionOrder[currentStep]?.actionType}</div>
            <div>Current Phase: {phase}</div>
            <div>
              <Label htmlFor="timer">Timer</Label>
              <Input
                id="timer"
                value={timer}
                onChange={(e) => setTimer(e.target.value)}
                placeholder="00:00"
              />
            </div>
            
            <div className="space-y-4">
            <Select onValueChange={(value) => handleSelection(Number(value))}>
              <SelectTrigger>
                <SelectValue placeholder="Select a hero" />
              </SelectTrigger>
              <SelectContent>
                {heroes.map((hero) => (
                  <SelectItem key={hero.id} value={hero.id.toString()}>
                    {hero.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {SecondInput && (
              <Select onValueChange={(value) => handleSelectionSecond(Number(value))}>
              <SelectTrigger>
                <SelectValue placeholder="Select 2nd hero" />
              </SelectTrigger>
              <SelectContent>
                {heroes.map((hero) => (
                  <SelectItem key={hero.id} value={hero.id.toString()}>
                    {hero.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
              )}
              <Button disabled={!tempSelection} onClick={confirmSelection} className="mt-2">Confirm Selection</Button>
          </div>

            <div className="flex flex-wrap gap-2">
              <Button onClick={resetPicks}>Reset Picks</Button>
              <Button onClick={resetBans}>Reset Bans</Button>
              <Button onClick={resetNicknames}>Reset Nicknames</Button>
              <Button onClick={switchNicknames}>Switch Nicknames</Button>
              <Button onClick={switchTeams}>Switch Teams</Button>
              <Button onClick={resetAll}>Reset All</Button>
            </div>
          </div>
          <div className="grid grid-cols-4 gap-4 mt-4">
            {actionOrder.flat().map((action, index) => (
              <div key={index} className="p-2 border rounded">
                <div>{action.actionType.toUpperCase()} - Player {action.player}</div>
                <div>
                  {selections[index] !== null ? (
                    <div>{getHeroNameById(selections[index])}</div>
                  ) : (
                    <div>Empty</div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Win Tracker</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between">
            <div>
              <h3>{teamNames[0]}</h3>
              <div className="flex gap-2 mt-2">
                {team1Wins?.map((win, index) => (
                  <Button
                    key={index}
                    variant={win ? "default" : "outline"}
                    onClick={() => toggleWin(1, index)}
                  >
                    Game {index + 1}
                  </Button>
                ))}
              </div>
            </div>
            <div>
              <h3>{teamNames[1]}</h3>
              <div className="flex gap-2 mt-2">
                {team2Wins.map((win, index) => (
                  <Button
                    key={index}
                    variant={win ? "default" : "outline"}
                    onClick={() => toggleWin(2, index)}
                  >
                    Game {index + 1}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Player Nicknames</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3>{teamNames[0]}</h3>
              {nicknames.slice(0, 5).map((nickname, index) => (
                <Input
                  key={index}
                  value={nickname}
                  onChange={(e) => handleNicknameChange(index, e.target.value)}
                  placeholder={`Player ${index + 1} Nickname`}
                  className="mt-1"
                />
              ))}
            </div>
            <div>
              <h3>{teamNames[1]}</h3>
              {nicknames.slice(5).map((nickname, index) => (
                <Input
                  key={index + 5}
                  value={nickname}
                  onChange={(e) => handleNicknameChange(index + 5, e.target.value)}
                  placeholder={`Player ${index + 6} Nickname`}
                  className="mt-1"
                />
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}