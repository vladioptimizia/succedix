import { Business } from "@/lib/types";
import { scoreStatus } from "@/lib/scoring";

const sectorLabel: Record<string, string> = {
  cafe: "Café",
  restaurante: "Restaurante",
  varejo: "Varejo",
  servicos: "Serviços",
  saude: "Saúde",
  outro: "Outro",
};

export default function SwipeCard({
  business,
  fitScore,
}: {
  business: Business;
  fitScore: number;
}) {
  const { color } = scoreStatus(fitScore);
  const dotColor =
    color === "green"
      ? "bg-success"
      : color === "amber"
      ? "bg-warning"
      : color === "orange"
      ? "bg-orange-500"
      : "bg-danger";

  return (
    <div className="w-full max-w-sm rounded-2xl overflow-hidden bg-gray-900 border border-gray-800 shadow-xl">
      <div className="h-56 bg-gray-700 flex items-center justify-center text-gray-500 text-sm">
        Foto do negócio
      </div>
      <div className="p-5 space-y-3">
        <div>
          <h2 className="text-xl font-bold">{business.name}</h2>
          <p className="text-gray-400 text-sm">{sectorLabel[business.sector]}</p>
        </div>
        <div className="flex items-center justify-between text-sm text-gray-300">
          <span>
            📍 {business.city}, {business.canton} ({business.distanceKm} km)
          </span>
        </div>
        <p className="font-semibold">
          💰 CHF {(business.priceMin / 1000).toFixed(0)}k - {(business.priceMax / 1000).toFixed(0)}k
        </p>
        <div className="flex items-center gap-2">
          <span className={`w-2.5 h-2.5 rounded-full ${dotColor}`} />
          <span className="text-sm font-medium">Fit Score: {fitScore}%</span>
        </div>
        <p className="text-sm text-gray-400">
          🏢 Estabelecido em {business.establishedYear}
        </p>
        <div className="flex flex-wrap gap-2">
          {business.tags.map((tag) => (
            <span
              key={tag}
              className="text-xs px-2 py-1 rounded-full bg-gray-800 text-gray-300"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
