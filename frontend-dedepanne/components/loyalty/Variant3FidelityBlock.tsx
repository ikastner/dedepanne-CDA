"use client"

import { Star } from "lucide-react"
import { Button } from "@/components/ui/button"

const mockLoyalty = {
  points: 320,
  nextReward: { label: "-20% sur une réparation", needed: 500, current: 320 },
  rewards: [
    { label: "Bon d'achat 10€", unlocked: true, progress: null },
    { label: "-20% sur une réparation", unlocked: false, progress: { current: 320, needed: 500 } },
    { label: "-40% sur une réparation (max 1/an)", unlocked: false, progress: { current: 320, needed: 1000 } }
  ],
  history: [
    { label: "Achat appareil", points: 50, date: "2024-05-28" },
    { label: "Réparation", points: 30, date: "2024-05-15" },
    { label: "Don d'appareil", points: 50, date: "2024-05-10" },
    { label: "Parrainage validé", points: 100, date: "2024-05-05" },
    { label: "Avis Google", points: 50, date: "2024-05-01" }
  ]
}
const mockReferral = { code: "PARRAIN1234" }
const programmeExplication = `1€ dépensé = 10 pts\nParrainage validé = 100 pts\nDon d'appareil = 50 pts\nAvis Google = 50 pts (1x/an)\nRécompenses : 200 pts = 10€, 500 pts = -20%, 1000 pts = -40% (max 1/an)`

export default function Variant3FidelityBlock() {
  return (
    <div className="w-full flex flex-col md:flex-row gap-8 mb-8">
      {/* Colonne 1 : Points & progression */}
      <div className="flex-1 flex flex-col items-center md:items-start">
        <div className="font-bold text-yellow-700 flex items-center gap-2 mb-2">
          <Star className="h-4 w-4" /> Points & progression
        </div>
        <div className="flex items-center gap-2 mb-2">
          <span className="font-bold text-xl text-yellow-700">{mockLoyalty.points} pts</span>
          <span className="text-xs text-gray-500">(1€ = 10 pts)</span>
        </div>
        <div className="w-full bg-yellow-100 rounded h-2 my-2">
          <div className="bg-yellow-400 h-2 rounded" style={{width: `${(mockLoyalty.nextReward.current/mockLoyalty.nextReward.needed)*100}%`}}></div>
        </div>
        <div className="text-xs text-yellow-700 font-bold">Prochaine récompense : {mockLoyalty.nextReward.label}</div>
        <div className="font-bold text-yellow-700 mt-2">Récompenses :</div>
        <ul className="text-xs space-y-1 mb-2">
          {mockLoyalty.rewards.map((r, i) => (
            <li key={i} className={r.unlocked ? "text-green-700" : "text-gray-400"}>
              {r.label} {r.unlocked ? "(débloquée)" : r.progress ? `(progression : ${r.progress.current}/${r.progress.needed})` : ""}
            </li>
          ))}
        </ul>
      </div>
      {/* Colonne 2 : Historique & parrainage */}
      <div className="flex-1 flex flex-col items-center md:items-start border-t md:border-t-0 md:border-l border-yellow-100 pt-4 md:pt-0 md:pl-4">
        <div className="font-bold text-yellow-700 flex items-center gap-2 mb-1">
          <Star className="h-4 w-4" /> Historique
        </div>
        <ul className="text-xs space-y-1 mb-2">
          {mockLoyalty.history.map((h, i) => (
            <li key={i} className="flex justify-between">
              <span>{h.label}</span>
              <span className="font-bold">+{h.points} pts</span>
              <span className="text-gray-400">{h.date}</span>
            </li>
          ))}
        </ul>
        <div className="font-bold text-yellow-700 flex items-center gap-2 mt-2">
          <Star className="h-4 w-4" /> Code de parrainage
        </div>
        <div className="flex items-center gap-2 mb-2">
          <span className="font-mono text-base bg-primary/10 px-2 py-1 rounded border border-primary">{mockReferral.code}</span>
          <Button size="sm" variant="outline" onClick={() => {navigator.clipboard.writeText(mockReferral.code)}}>Copier</Button>
        </div>
        <p className="text-xs text-gray-600 mb-2">Partagez ce code à vos amis pour gagner des points de fidélité dès qu'ils deviennent clients !</p>
      </div>
      {/* Colonne 3 : Explication */}
      <div className="flex-1 flex flex-col items-center md:items-start border-t md:border-t-0 md:border-l border-yellow-100 pt-4 md:pt-0 md:pl-4">
        <div className="font-bold text-yellow-700 flex items-center gap-2 mb-1">
          <Star className="h-4 w-4" /> Comment ça marche ?
        </div>
        <pre className="text-xs text-gray-600 bg-yellow-50 rounded p-2 whitespace-pre-wrap">{programmeExplication}</pre>
      </div>
    </div>
  )
} 