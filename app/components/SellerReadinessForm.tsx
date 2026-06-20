'use client';

import { useState } from 'react';
import { SECTOR_VALUES, SECTOR_LABELS_PT } from '@/lib/taxonomy';

export function SellerReadinessForm({ userId }: { userId: string }) {
  const [formData, setFormData] = useState({
    businessName: '',
    sector: '',
    city: '',
    annualRevenue: 0,
    establishedYear: new Date().getFullYear() - 5,
    ownerDependency: 50,
    documentationComplete: false,
    recurringCustomers: false,
  });

  const [score, setScore] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/forms/seller-readiness', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-user-id': userId,
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (!response.ok) {
        setError(result.error || 'Erro ao calcular score');
        return;
      }

      setScore(result.score);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-gray-950 p-8 rounded-lg border border-gray-800">
      <h1 className="text-3xl font-bold text-white mb-8">Avalie seu Negócio</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-white mb-2">Nome do Negócio</label>
          <input
            type="text"
            value={formData.businessName}
            onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
            required
            className="w-full bg-gray-900 border border-gray-700 text-white p-3 rounded-lg focus:outline-none focus:border-green-500"
          />
        </div>

        <div>
          <label className="block text-white mb-2">Setor</label>
          <select
            value={formData.sector}
            onChange={(e) => setFormData({ ...formData, sector: e.target.value })}
            required
            className="w-full bg-gray-900 border border-gray-700 text-white p-3 rounded-lg focus:outline-none focus:border-green-500"
          >
            <option value="">-- Seleccione --</option>
            {SECTOR_VALUES.map((val) => (
              <option key={val} value={val}>{SECTOR_LABELS_PT[val]}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-white mb-2">Ano de Fundação</label>
          <input
            type="number"
            value={formData.establishedYear}
            onChange={(e) => setFormData({ ...formData, establishedYear: parseInt(e.target.value) })}
            required
            min={1900}
            max={new Date().getFullYear()}
            className="w-full bg-gray-900 border border-gray-700 text-white p-3 rounded-lg focus:outline-none focus:border-green-500"
          />
        </div>

        <div>
          <label className="block text-white mb-2">Faturamento Anual (CHF)</label>
          <input
            type="number"
            value={formData.annualRevenue}
            onChange={(e) => setFormData({ ...formData, annualRevenue: parseInt(e.target.value) })}
            required
            className="w-full bg-gray-900 border border-gray-700 text-white p-3 rounded-lg focus:outline-none focus:border-green-500"
          />
        </div>

        <div>
          <label className="block text-white mb-2">
            Dependência do dono: {formData.ownerDependency}%
          </label>
          <input
            type="range"
            min={0}
            max={100}
            step={10}
            value={formData.ownerDependency}
            onChange={(e) => setFormData({ ...formData, ownerDependency: parseInt(e.target.value) })}
            className="w-full"
          />
        </div>

        <div className="flex gap-6">
          <label className="flex items-center text-white gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.documentationComplete}
              onChange={(e) => setFormData({ ...formData, documentationComplete: e.target.checked })}
              className="w-4 h-4"
            />
            Documentação em dia
          </label>
          <label className="flex items-center text-white gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.recurringCustomers}
              onChange={(e) => setFormData({ ...formData, recurringCustomers: e.target.checked })}
              className="w-4 h-4"
            />
            Clientes recorrentes
          </label>
        </div>

        {error && (
          <p className="text-red-400 text-sm">{error}</p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-lg disabled:opacity-50"
        >
          {loading ? 'Calculando...' : 'Avaliar Negócio'}
        </button>
      </form>

      {score !== null && (
        <div className="mt-8 bg-gray-900 p-6 rounded-lg border border-green-600">
          <h2 className="text-2xl font-bold text-white mb-4">Seu Score</h2>
          <div className="text-6xl font-bold text-green-400 mb-4">{score}/100</div>
          <p className="text-gray-300">
            {score >= 70
              ? '✅ Bom — Pronto para publicar'
              : '⚠️ Precisa melhorias antes de publicar'}
          </p>
        </div>
      )}
    </div>
  );
}
