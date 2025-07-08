"use client"

import { Star, Info } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { useState } from "react"

// Mock data (à remplacer par props ou contexte plus tard)
const mockLoyalty = {
  points: 320,
  nextReward: { label: "-20% sur une réparation", needed: 400, current: 320 },
  rewards: [
    { label: "Bon d'achat 10€", unlocked: true, progress: null, tooltip: "Utilisable sur l'achat d'un appareil reconditionné ou une réparation. Cliquez pour en profiter !" },
    { label: "-20% sur une réparation", unlocked: false, progress: { current: 320, needed: 400 }, tooltip: "Obtenez -20% sur votre prochaine réparation dès 400 points." },
    { label: "-40% sur une réparation (max 1/an)", unlocked: false, progress: { current: 320, needed: 800 }, tooltip: "Obtenez -40% sur une réparation dès 800 points (maximum 1 fois par an)." }
  ],
  history: [
    { label: "Achat appareil", points: 50, date: "2024-05-28" },
    { label: "Réparation", points: 30, date: "2024-05-15" },
    { label: "Don d'appareil", points: 100, date: "2024-05-10" },
    { label: "Parrainage validé", points: 100, date: "2024-05-05" },
    { label: "Avis Google", points: 50, date: "2024-05-01" }
  ]
}
const mockReferral = { code: "PARRAIN1234" }

function ProgressCircle({ value, max }: { value: number, max: number }) {
  const percent = Math.min(100, (value / max) * 100)
  return (
    <svg width="120" height="120" viewBox="0 0 120 120">
      <circle cx="60" cy="60" r="52" fill="#fff" stroke="#facc15" strokeWidth="10" />
      <circle
        cx="60" cy="60" r="52"
        fill="none"
        stroke="#eab308"
        strokeWidth="10"
        strokeDasharray={2 * Math.PI * 52}
        strokeDashoffset={2 * Math.PI * 52 * (1 - percent / 100)}
        strokeLinecap="round"
        style={{ transition: 'stroke-dashoffset 0.5s' }}
      />
      <text x="50%" y="48%" textAnchor="middle" fontSize="2.1em" fontWeight="bold" fill="#eab308">
        {value}
      </text>
      <text x="50%" y="62%" textAnchor="middle" fontSize="1em" fill="#b45309">
        / {max} pts
      </text>
    </svg>
  )
}

function Tooltip({ children, text, onlyIcon = false, tooltipContent }: { children: React.ReactNode, text?: string, onlyIcon?: boolean, tooltipContent?: React.ReactNode }) {
  const [show, setShow] = useState(false)
  let timeout: NodeJS.Timeout

  const handleEnter = () => {
    clearTimeout(timeout)
    setShow(true)
  }
  const handleLeave = () => {
    timeout = setTimeout(() => setShow(false), 100)
  }

  return (
    <span className="relative inline-block">
      {onlyIcon ? (
        <span
          onMouseEnter={handleEnter}
          onMouseLeave={handleLeave}
          className="inline-flex items-center cursor-pointer text-yellow-700"
        >
          {children}
        </span>
      ) : (
        <span className="inline-flex items-center cursor-pointer text-yellow-700">
          {children}
        </span>
      )}
      {show && (
        <span
          className="absolute z-10 left-1/2 -translate-x-1/2 mt-2 w-56 bg-white border border-yellow-300 text-xs text-yellow-900 rounded p-2 shadow-lg"
          onMouseEnter={handleEnter}
          onMouseLeave={handleLeave}
        >
          {tooltipContent ? tooltipContent : text}
        </span>
      )}
    </span>
  )
}

export default function Variant1FidelityBlock() {
  const [showHistory, setShowHistory] = useState(false)
  return (
    <div className="w-full flex flex-col md:grid md:grid-cols-4 bg-white border-2 border-yellow-200 rounded-2xl p-4 md:p-8 gap-6 md:gap-10 mb-8 shadow-lg">
      {/* Colonne 1 : Cercle + prochaine récompense */}
      <div className="flex flex-col items-center justify-center md:col-span-1 mb-4 md:mb-0">
        <div className="flex items-center justify-center">
          <ProgressCircle value={mockLoyalty.points} max={mockLoyalty.nextReward.needed} />
        </div>
        <div className="mt-4 text-yellow-800 font-bold text-center text-base md:text-lg">
          Prochaine récompense :<br />
          <span className="text-yellow-900">{mockLoyalty.nextReward.label}</span>
        </div>
      </div>
      {/* Colonne 2 : Parrainage */}
      <div className="flex flex-col gap-3 items-center md:items-start md:col-span-1">
        <div className="text-xl font-bold text-yellow-700 flex items-center gap-2 mb-2">
          <Star className="h-5 w-5" /> Code de parrainage
        </div>
        <div className="flex items-center gap-2 mb-2 w-full">
          <span className="font-mono text-base bg-primary/10 px-3 py-1 rounded border border-primary">{mockReferral.code}</span>
          <Button size="sm" variant="outline" className="transition hover:bg-yellow-50 rounded-full" onClick={() => {navigator.clipboard.writeText(mockReferral.code)}}>Copier</Button>
        </div>
      </div>
      {/* Colonne 3 : Récompenses */}
      <div className="flex flex-col gap-3 items-center md:items-start md:col-span-1">
        <div className="text-xl font-bold text-yellow-700 flex items-center gap-2 mb-2">
          <Star className="h-5 w-5" /> Récompenses
        </div>
        <ul className="flex flex-col gap-2 w-full">
          {mockLoyalty.rewards.slice(0,1).map((r, i) => (
            <li key={i} className="flex items-center gap-2">
              <span className={r.unlocked ? "bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold" : "bg-gray-100 text-gray-500 px-3 py-1 rounded-full text-xs font-bold"}>
                {r.label}
              </span>
              {r.unlocked ? <span className="text-green-700 font-bold">(débloquée)</span> : r.progress ? <span className="text-yellow-700">(progression : {r.progress.current}/{r.progress.needed})</span> : ""}
            </li>
          ))}
        </ul>
        <span className="inline-flex items-center gap-1 mt-1">
          <span className="text-yellow-700 font-medium">Voir toutes les récompenses</span>
          <Tooltip onlyIcon tooltipContent={
            <ul className="text-left space-y-1">
              {mockLoyalty.rewards.slice(1).map((r, i) => (
                <li key={i} className="flex items-center gap-2">
                  <span className={r.unlocked ? "bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs font-bold" : "bg-gray-100 text-gray-500 px-2 py-1 rounded-full text-xs font-bold"}>
                    {r.label}
                  </span>
                  {r.unlocked ? <span className="text-green-700 font-bold">(débloquée)</span> : r.progress ? <span className="text-yellow-700">(progression : {r.progress.current}/{r.progress.needed})</span> : ""}
                </li>
              ))}
            </ul>
          }>
            <Info className="h-4 w-4 text-yellow-500" />
          </Tooltip>
        </span>
      </div>
      {/* Colonne 4 : Historique (popup) */}
      <div className="flex flex-col items-center md:items-end md:col-span-1 w-full">
        <Dialog open={showHistory} onOpenChange={setShowHistory}>
          <DialogTrigger asChild>
            <Button variant="outline" className="font-bold text-yellow-700 transition hover:bg-yellow-50 rounded-full w-full md:w-auto py-2 px-4 text-base">Voir mon historique</Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Historique de vos points</DialogTitle>
            </DialogHeader>
            <div className="bg-yellow-50 rounded p-2 max-h-72 overflow-y-auto border border-yellow-100">
              <ul className="text-xs space-y-2">
                <li className="flex font-bold text-yellow-700 px-1">
                  <span className="flex-1">Action</span>
                  <span className="w-16 text-center">Points</span>
                  <span className="w-20 text-right">Date</span>
                </li>
                {mockLoyalty.history.map((h, i) => (
                  <li key={i} className="flex items-center px-1">
                    <span className="flex-1 text-gray-700">{h.label}</span>
                    <span className="w-16 text-center font-bold text-yellow-700">+{h.points} pts</span>
                    <span className="w-20 text-right text-gray-400 text-xs whitespace-nowrap">{h.date}</span>
                  </li>
                ))}
              </ul>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
} 