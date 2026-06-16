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

const sectorIcon: Record<string, string> = {
  cafe: "☕",
  restaurante: "🍽️",
  varejo: "🛍️",
  servicos: "⚙️",
  saude: "🏥",
  outro: "🏢",
};

export default function SwipeCard({ business, fitScore }: { business: Business; fitScore: number }) {
  const { color } = scoreStatus(fitScore);
  const scoreColor =
    color === "green" ? "#10b981" :
    color === "amber" ? "#f59e0b" :
    color === "orange" ? "#f97316" : "#ef4444";

  return (
    <div
      className="w-full max-w-sm rounded-2xl overflow-hidden flex flex-col"
      style={{ background: '#111111', border: '1px solid rgba(255,255,255,0.08)', boxShadow: '0 24px 48px rgba(0,0,0,0.5)' }}
    >
      {/* Photo placeholder */}
      <div
        className="h-52 flex flex-col items-center justify-center gap-2"
        style={{ background: 'linear-gradient(135deg, #181818, #1c1c1c)', borderBottom: '1px solid rgba(255,255,255,0.05)' }}
      >
        <span className="text-4xl">{sectorIcon[business.sector] ?? "🏢"}</span>
        <span className="text-xs text-gray-600">Imagem confidencial</span>
      </div>

      <div className="p-5 flex flex-col gap-4">
        {/* Header */}
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold leading-tight">{business.name}</h2>
            <p className="text-sm mt-0.5" style={{ color: '#6b7280' }}>{sectorLabel[business.sector]}</p>
          </div>
          {/* Fit Score badge */}
          <div
            className="flex-shrink-0 w-12 h-12 rounded-full flex flex-col items-center justify-center"
            style={{ background: `rgba(${scoreColor === '#10b981' ? '16,185,129' : scoreColor === '#f59e0b' ? '245,158,11' : scoreColor === '#f97316' ? '249,115,22' : '239,68,68'},0.12)`, border: `1px solid ${scoreColor}30` }}
          >
            <span className="text-xs font-bold" style={{ color: scoreColor }}>{fitScore}%</span>
            <span className="text-[9px]" style={{ color: scoreColor + 'aa' }}>fit</span>
          </div>
        </div>

        {/* Divider */}
        <div style={{ height: '1px', background: 'rgba(255,255,255,0.05)' }} />

        {/* Details */}
        <div className="grid grid-cols-2 gap-3 text-sm">
          <Detail label="Localização" value={`${business.city}, ${business.canton}`} />
          <Detail label="Distância" value={`${business.distanceKm} km`} />
          <Detail label="Preço mín." value={`CHF ${(business.priceMin / 1000).toFixed(0)}k`} />
          <Detail label="Preço máx." value={`CHF ${(business.priceMax / 1000).toFixed(0)}k`} />
          <Detail label="Fundado em" value={`${business.establishedYear}`} />
          <Detail label="Sector" value={sectorLabel[business.sector]} />
        </div>

        {/* Tags */}
        {business.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {business.tags.map((tag) => (
              <span
                key={tag}
                className="text-xs px-2.5 py-1 rounded-full"
                style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', color: '#6b7280' }}
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs mb-0.5" style={{ color: '#4b5563' }}>{label}</p>
      <p className="font-medium text-sm text-gray-200">{value}</p>
    </div>
  );
}
