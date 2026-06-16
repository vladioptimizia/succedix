"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Button from "@/components/Button";
import ScoreCircle from "@/components/ScoreCircle";
import { calculateBuyerReadinessScore } from "@/lib/scoring";
import { BuyerReadinessInput, Sector } from "@/lib/types";

const STEPS = [
  "Capital",
  "Sector de Interesse",
  "Localização",
  "Envolvimento",
  "Experiência",
  "Prazo & Idiomas",
];

const SECTORS: { value: Sector; label: string }[] = [
  { value: "cafe", label: "Café" },
  { value: "restaurante", label: "Restaurante" },
  { value: "varejo", label: "Varejo" },
  { value: "servicos", label: "Serviços" },
  { value: "saude", label: "Saúde" },
  { value: "outro", label: "Outro" },
];

const initialState: BuyerReadinessInput = {
  capitalMin: 0,
  capitalMax: 0,
  capitalSource: "proprio",
  sectorsInterested: [],
  openToOtherSectors: false,
  regionMain: "ZH",
  radiusKm: 20,
  exploreOtherRegions: false,
  involvementType: "unknown",
  hoursAvailablePerWeek: 0,
  experienceBackground: "",
  timelineMonths: 6,
  languages: [],
};

export default function BuyerOnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [data, setData] = useState<BuyerReadinessInput>(initialState);
  const [score, setScore] = useState<number | null>(null);

  function update<K extends keyof BuyerReadinessInput>(
    key: K,
    value: BuyerReadinessInput[K]
  ) {
    setData((prev) => ({ ...prev, [key]: value }));
  }

  function toggleSector(sector: Sector) {
    setData((prev) => ({
      ...prev,
      sectorsInterested: prev.sectorsInterested.includes(sector)
        ? prev.sectorsInterested.filter((s) => s !== sector)
        : [...prev.sectorsInterested, sector],
    }));
  }

  function submit() {
    setScore(calculateBuyerReadinessScore(data));
    if (typeof window !== "undefined") {
      window.localStorage.setItem("succedix_buyer_profile", JSON.stringify(data));
    }
  }

  if (score !== null) {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center gap-6 px-6">
        <ScoreCircle score={score} label="Buyer Readiness Score" size={160} />
        <p className="text-gray-300 text-center max-w-sm">
          {score >= 60
            ? "Seu perfil está pronto para explorar oportunidades."
            : "Recomendamos refinar seu perfil para encontrar melhores matches."}
        </p>
        <Button variant="primary" onClick={() => router.push("/discover")}>
          Comece a explorar (5 swipes/dia grátis)
        </Button>
      </main>
    );
  }

  return (
    <main className="min-h-screen px-6 py-12 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-2">Prontidão do Comprador</h1>
      <p className="text-gray-400 mb-8">
        Passo {step + 1} de {STEPS.length}: {STEPS[step]}
      </p>

      {step === 0 && (
        <div className="space-y-4">
          <Field label="Capital mínimo (CHF)">
            <input
              type="number"
              className="input"
              value={data.capitalMin}
              onChange={(e) => update("capitalMin", Number(e.target.value))}
            />
          </Field>
          <Field label="Capital máximo (CHF)">
            <input
              type="number"
              className="input"
              value={data.capitalMax}
              onChange={(e) => update("capitalMax", Number(e.target.value))}
            />
          </Field>
          <Field label="Fonte do capital">
            <select
              className="input"
              value={data.capitalSource}
              onChange={(e) => update("capitalSource", e.target.value as any)}
            >
              <option value="proprio">Capital próprio</option>
              <option value="credito">Crédito</option>
              <option value="combinado">Combinado</option>
              <option value="investor">Investidor</option>
            </select>
          </Field>
        </div>
      )}

      {step === 1 && (
        <div className="space-y-4">
          <span className="block text-sm text-gray-300 mb-1">
            Setores de interesse
          </span>
          <div className="flex flex-wrap gap-2">
            {SECTORS.map((s) => (
              <button
                key={s.value}
                onClick={() => toggleSector(s.value)}
                className={`px-4 h-9 rounded-full border text-sm ${
                  data.sectorsInterested.includes(s.value)
                    ? "bg-success border-success"
                    : "border-gray-600 text-gray-300"
                }`}
              >
                {s.label}
              </button>
            ))}
          </div>
          <ToggleField
            label="Aberto a outros setores?"
            value={data.openToOtherSectors}
            onChange={(v) => update("openToOtherSectors", v)}
          />
        </div>
      )}

      {step === 2 && (
        <div className="space-y-4">
          <Field label="Cantão principal">
            <select
              className="input"
              value={data.regionMain}
              onChange={(e) => update("regionMain", e.target.value as any)}
            >
              {["ZH", "BE", "AG", "ZG", "VD", "GE", "TI", "outro"].map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </Field>
          <Field label={`Raio máximo: ${data.radiusKm} km`}>
            <input
              type="range"
              min={10}
              max={100}
              step={10}
              className="w-full"
              value={data.radiusKm}
              onChange={(e) => update("radiusKm", Number(e.target.value))}
            />
          </Field>
          <ToggleField
            label="Explorar outras regiões?"
            value={data.exploreOtherRegions}
            onChange={(v) => update("exploreOtherRegions", v)}
          />
        </div>
      )}

      {step === 3 && (
        <div className="space-y-4">
          <Field label="Tipo de envolvimento desejado">
            <select
              className="input"
              value={data.involvementType}
              onChange={(e) => update("involvementType", e.target.value as any)}
            >
              <option value="operator">Operar ativamente</option>
              <option value="investor">Investidor passivo</option>
              <option value="unknown">Não sei</option>
            </select>
          </Field>
          <Field label="Horas disponíveis por semana">
            <input
              type="number"
              className="input"
              value={data.hoursAvailablePerWeek}
              onChange={(e) =>
                update("hoursAvailablePerWeek", Number(e.target.value))
              }
            />
          </Field>
        </div>
      )}

      {step === 4 && (
        <div className="space-y-4">
          <Field label="Background de experiência">
            <input
              className="input"
              value={data.experienceBackground}
              onChange={(e) =>
                update("experienceBackground", e.target.value)
              }
              placeholder="Ex: Gestão bancária, 15 anos"
            />
          </Field>
        </div>
      )}

      {step === 5 && (
        <div className="space-y-4">
          <Field label="Quando deseja comprar? (meses)">
            <input
              type="number"
              className="input"
              value={data.timelineMonths}
              onChange={(e) =>
                update("timelineMonths", Number(e.target.value))
              }
            />
          </Field>
          <Field label="Idiomas (separados por vírgula)">
            <input
              className="input"
              value={data.languages.join(", ")}
              onChange={(e) =>
                update(
                  "languages",
                  e.target.value.split(",").map((l) => l.trim()).filter(Boolean)
                )
              }
              placeholder="Português, Inglês, Alemão"
            />
          </Field>
        </div>
      )}

      <div className="flex justify-between mt-10">
        <Button
          variant="secondary"
          disabled={step === 0}
          onClick={() => setStep((s) => Math.max(0, s - 1))}
        >
          Voltar
        </Button>
        {step < STEPS.length - 1 ? (
          <Button variant="primary" onClick={() => setStep((s) => s + 1)}>
            Continuar
          </Button>
        ) : (
          <Button variant="primary" onClick={submit}>
            Ver meu score
          </Button>
        )}
      </div>
    </main>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="block text-sm text-gray-300 mb-1">{label}</span>
      {children}
    </label>
  );
}

function ToggleField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-sm text-gray-300">{label}</span>
      <div className="flex gap-2">
        <Button
          variant={value ? "primary" : "ghost"}
          className="h-9 px-4"
          onClick={() => onChange(true)}
        >
          Sim
        </Button>
        <Button
          variant={!value ? "primary" : "ghost"}
          className="h-9 px-4"
          onClick={() => onChange(false)}
        >
          Não
        </Button>
      </div>
    </div>
  );
}
