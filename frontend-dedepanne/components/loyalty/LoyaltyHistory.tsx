import { Star, Gift, ShoppingCart, UserCheck, MessageCircle, Wrench } from "lucide-react"

interface HistoryItem {
  label: string
  points: number
  date: string
}

const iconMap: Record<string, JSX.Element> = {
  "Achat appareil": <ShoppingCart className="h-4 w-4 text-blue-500" />,
  "Réparation": <Wrench className="h-4 w-4 text-orange-500" />,
  "Don d'appareil": <Gift className="h-4 w-4 text-green-600" />,
  "Parrainage validé": <UserCheck className="h-4 w-4 text-yellow-600" />,
  "Avis Google": <MessageCircle className="h-4 w-4 text-pink-500" />
}

function getIcon(label: string) {
  return iconMap[label] || <Star className="h-4 w-4 text-gray-400" />
}

export default function LoyaltyHistory({ history }: { history: HistoryItem[] }) {
  return (
    <div className="w-full bg-white border-2 border-yellow-100 rounded-xl p-4 mb-8">
      <div className="font-bold text-yellow-700 flex items-center gap-2 mb-2">
        <Star className="h-4 w-4" /> Historique de vos points
      </div>
      <ol className="relative border-l-2 border-yellow-200 ml-2">
        {history.map((item, i) => (
          <li key={i} className="mb-6 ml-4 flex items-start gap-3">
            <span className="absolute -left-2.5 flex items-center justify-center w-5 h-5 bg-yellow-100 rounded-full border border-yellow-300">
              {getIcon(item.label)}
            </span>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-semibold text-gray-800">{item.label}</span>
                <span className="text-xs text-gray-400">{item.date}</span>
              </div>
              <span className="text-sm font-bold text-yellow-700">+{item.points} pts</span>
            </div>
          </li>
        ))}
      </ol>
    </div>
  )
} 