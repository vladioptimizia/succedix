"use client";

import { useState } from "react";
import Button from "@/components/Button";
import ScoreCircle from "@/components/ScoreCircle";
import { calculateSellerReadinessScore } from "@/lib/scoring";
import { SellerReadinessInput } from "@/lib/types";

const STEPS = [
  "Dados Básicos",
  "Financeiro",
  "Motivo da Venda",
  "Operação",
  "Documentação",
  "Descrição",
];

const initialState: SellerReadinessInput = {
  businessName: "",
  sector: "cafe",
  canton: "ZH",
  foundedYear: 2015,
  annualRevenue: 0,
  operatingMargin: 0,
  recurringClients: false,
  saleReason: "aposentadoria",
  timeline: "aberto",
  confidentiality: "normal",
  ownerDependency: 50,
  hasDocumentedProcesses: false,
  teamSize: 0,
  documentsOrganized: false,
  accountingUpToDate: false,
  licensesValid: false,
  description: "",
};

export default function SellerOnboardingPage() {
  const [step, setStep] = useState(0);
  const [data, setData] = useState<SellerReadinessInput>(initialState);
  const [score, setScore] = useState<number | null>(null);

  function update<K extends keyof SellerReadinessInput>(
    key: K,
    value: SellerReadinessInput[K]
  ) {
    setData((prev) => ({ ...prev, [key]: value }));
  }

  function submit() {
    setScore(calculateSellerReadinessScore(data));
  }

  if (score !== null) {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center gap-6 px-6">
        <ScoreCircle score={score} label="Seller Readiness Score" size={160} />
        <p className="text-gray-300 text-center max-w-sm">
          {score >= 60
            ? "Seu negócio está bem preparado para encontrar um sucessor."
            : "Há pontos a melhorar antes de publicar — recomendamos um relatório detalhado."}
        </p>
        <Button variant="primary">Quer um relatório detalhado? CHF 249</Button>
      </main>
    );
  }

  return (
    <main className="min-h-screen px-6 py-12 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-2">Prontidão do Vendedor</h1>
      <p className="text-gray-400 mb-8">
        Passo {step + 1} de {STEPS.length}: {STEPS[step]}
      </p>

      {step === 0 && (
        <div className="space-y-4">
          <Field label="Nome do negócio">
            <input
              className="input"
              value={data.businessName}
              onChange={(e) => update("businessName", e.target.value)}
            />
          </Field>
          <Field label="Sector">
            <select
              className="input"
              value={data.sector}
              onChange={(e) => update("sector", e.target.value as any)}
            >
              <option value="cafe">Café</option>
              <option value="restaurante">Restaurante</option>
              <option value="varejo">Varejo</option>
              <option value="servicos">Serviços</option>
              <option value="saude">Saúde</option>
              <option value="outro">Outro</option>
            </select>
          </Field>
          <Field label="Cantão">
            <select
              className="input"
              value={data.canton}
              onChange={(e) => update("canton", e.target.value as any)}
            >
              {["ZH", "BE", "AG", "ZG", "VD", "GE", "TI", "outro"].map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Ano de fundação">
            <input
              type="number"
              className="input"
              value={data.foundedYear}
              onChange={(e) => update("foundedYear", Number(e.target.value))}
            />
          </Field>
        </div>
      )}

      {step === 1 && (
        <div className="space-y-4">
          <Field label="Faturamento anual (CHF)">
            <input
              type="number"
              className="input"
              value={data.annualRevenue}
              onChange={(e) => update("annualRevenue", Number(e.target.value))}
            />
          </Field>
          <Field label="Margem operacional aproximada (%)">
            <input
              type="number"
              className="input"
              value={data.operatingMargin}
              onChange={(e) =>
                update("operatingMargin", Number(e.target.value))
              }
            />
          </Field>
          <ToggleField
            label="Clientes recorrentes?"
            value={data.recurringClients}
            onChange={(v) => update("recurringClients", v)}
          />
        </div>
      )}

      {step === 2 && (
        <div className="space-y-4">
          <Field label="Razão da venda">
            <select
              className="input"
              value={data.saleReason}
              onChange={(e) => update("saleReason", e.target.value as any)}
            >
              <option value="aposentadoria">Aposentadoria</option>
              <option value="burnout">Burnout</option>
              <option value="mudanca">Mudança</option>
              <option value="outro">Outro</option>
            </select>
          </Field>
          <Field label="Timeline">
            <select
              className="input"
              value={data.timeline}
              onChange={(e) => update("timeline", e.target.value as any)}
            >
              <option value="1_mes">Próximo mês</option>
              <option value="3_6_meses">3-6 meses</option>
              <option value="1_ano">1 ano</option>
              <option value="aberto">Aberto</option>
            </select>
          </Field>
          <Field label="Confidencialidade">
            <select
              className="input"
              value={data.confidentiality}
              onChange={(e) =>
                update("confidentiality", e.target.value as any)
              }
            >
              <option value="muito_sigilo">Muito sigilo</option>
              <option value="normal">Normal</option>
              <option value="posso_contar">Posso contar</option>
            </select>
          </Field>
        </div>
      )}

      {step === 3 && (
        <div className="space-y-4">
          <Field label={`Dependência do dono: ${data.ownerDependency}%`}>
            <input
              type="range"
              min={0}
              max={100}
              step={25}
              className="w-full"
              value={data.ownerDependency}
              onChange={(e) =>
                update("ownerDependency", Number(e.target.value) as any)
              }
            />
          </Field>
          <ToggleField
            label="Há processos documentados?"
            value={data.hasDocumentedProcesses}
            onChange={(v) => update("hasDocumentedProcesses", v)}
          />
          <Field label="Tamanho da equipa">
            <input
              type="number"
              className="input"
              value={data.teamSize}
              onChange={(e) => update("teamSize", Number(e.target.value))}
            />
          </Field>
        </div>
      )}

      {step === 4 && (
        <div className="space-y-4">
          <ToggleField
            label="Documentos organizados?"
            value={data.documentsOrganized}
            onChange={(v) => update("documentsOrganized", v)}
          />
          <ToggleField
            label="Contabilidade em dia?"
            value={data.accountingUpToDate}
            onChange={(v) => update("accountingUpToDate", v)}
          />
          <ToggleField
            label="Licenças/permitidos válidos?"
            value={data.licensesValid}
            onChange={(v) => update("licensesValid", v)}
          />
        </div>
      )}

      {step === 5 && (
        <div className="space-y-4">
          <Field label="Descreva seu negócio em poucas palavras">
            <textarea
              className="input h-32"
              value={data.description}
              onChange={(e) => update("description", e.target.value)}
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
