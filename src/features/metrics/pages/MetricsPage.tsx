import { useMemo, useState } from 'react'
import {
  Trophy,
  Flame,
  CheckCircle2,
  CalendarCheck,
  Target,
  TrendingUp,
  CalendarRange,
  BarChart3,
} from 'lucide-react'
import { useRotinas } from '@/features/rotinas/context/useRotinas'
import ProgressBar from '@/shared/components/ProgressBar'
import StatCard from '../components/StatCard'
import {
  diasPerfeitos,
  melhorSequenciaGeral,
  metasConcluidasHoje,
  sequenciaAtual,
  melhorSequencia,
  diasSucessoAno,
  volumeTotal,
  mediaDiaria,
  taxaMensal,
} from '../services/metricsCalculator'

const GERAL = 'geral'

export default function MetricsPage() {
  const { rotinas, checksPorDia } = useRotinas()
  const [metaId, setMetaId] = useState<string>(GERAL)

  const ano = new Date().getFullYear()

  const geral = useMemo(
    () => ({
      perfeitos: diasPerfeitos(rotinas, checksPorDia),
      melhor: melhorSequenciaGeral(rotinas, checksPorDia),
      hoje: metasConcluidasHoje(rotinas, checksPorDia),
    }),
    [rotinas, checksPorDia]
  )

  const meta = useMemo(() => rotinas.find((r) => r.id === metaId) ?? null, [rotinas, metaId])

  const metaStats = useMemo(() => {
    if (!meta) return null
    return {
      atual: sequenciaAtual(meta, checksPorDia),
      melhor: melhorSequencia(meta, checksPorDia),
      ano: diasSucessoAno(meta, checksPorDia, ano),
      volume: volumeTotal(meta, checksPorDia),
      media: mediaDiaria(meta, checksPorDia),
      taxa: taxaMensal(meta, checksPorDia),
    }
  }, [meta, checksPorDia, ano])

  return (
    <div>
      <div className="flex items-center gap-2 mb-1">
        <BarChart3 size={22} className="text-indigo-600" />
        <h1 className="text-2xl font-bold text-gray-900">Métricas</h1>
      </div>
      <p className="text-gray-500 text-sm mb-5">
        Acompanhe sua consistência geral ou por meta específica.
      </p>

      <div className="flex gap-2 flex-wrap mb-6">
        <button
          onClick={() => setMetaId(GERAL)}
          className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
            metaId === GERAL
              ? 'bg-indigo-600 text-white'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          Geral
        </button>
        {rotinas.map((r) => (
          <button
            key={r.id}
            onClick={() => setMetaId(r.id)}
            className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
              metaId === r.id
                ? 'bg-indigo-600 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {r.titulo}
          </button>
        ))}
      </div>

      {rotinas.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center text-gray-400">
          <BarChart3 size={48} className="mb-3 opacity-40" />
          <p className="text-base font-medium">Sem dados ainda</p>
          <p className="text-sm mt-1">Cadastre rotinas e marque conclusões para ver métricas.</p>
        </div>
      ) : metaId === GERAL ? (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <StatCard
              icon={Trophy}
              label="Dias perfeitos"
              value={geral.perfeitos}
              sub="Todos os hábitos do dia concluídos"
              accent="amber"
            />
            <StatCard
              icon={Flame}
              label="Melhor sequência"
              value={`${geral.melhor} ${geral.melhor === 1 ? 'dia' : 'dias'}`}
              sub="Dias perfeitos consecutivos"
              accent="rose"
            />
          </div>

          <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
            <div className="flex items-center gap-2.5 mb-3">
              <span className="p-2 rounded-lg bg-green-50 text-green-600">
                <CheckCircle2 size={18} />
              </span>
              <div>
                <p className="text-xs font-medium text-gray-500">Metas concluídas hoje</p>
                <p className="text-lg font-bold text-gray-900">
                  {geral.hoje.feitas} / {geral.hoje.total}
                </p>
              </div>
            </div>
            {geral.hoje.total > 0 ? (
              <ProgressBar done={geral.hoje.feitas} total={geral.hoje.total} />
            ) : (
              <p className="text-sm text-gray-400">Nenhuma meta agendada para hoje.</p>
            )}
          </div>
        </div>
      ) : (
        meta &&
        metaStats && (
          <div className="space-y-4">
            <div className="bg-indigo-600 text-white rounded-xl px-4 py-3">
              <p className="text-xs font-medium opacity-75 uppercase tracking-wide">Meta</p>
              <p className="font-semibold">{meta.titulo}</p>
              {meta.descricao && <p className="text-xs opacity-80 mt-0.5">{meta.descricao}</p>}
            </div>

            <div className="grid grid-cols-2 gap-3">
              <StatCard
                icon={Flame}
                label="Sequência atual"
                value={`${metaStats.atual} ${metaStats.atual === 1 ? 'dia' : 'dias'}`}
                accent="rose"
              />
              <StatCard
                icon={Trophy}
                label="Melhor sequência"
                value={`${metaStats.melhor} ${metaStats.melhor === 1 ? 'dia' : 'dias'}`}
                accent="amber"
              />
              <StatCard
                icon={CalendarCheck}
                label={`Dias de sucesso (${ano})`}
                value={metaStats.ano}
                accent="green"
              />
              <StatCard
                icon={Target}
                label="Volume total"
                value={metaStats.volume}
                sub="Conclusões registradas"
                accent="indigo"
              />
              <StatCard
                icon={TrendingUp}
                label="Média diária"
                value={`${metaStats.media}%`}
                sub="Dias agendados cumpridos"
                accent="sky"
              />
              <StatCard
                icon={CalendarRange}
                label="Taxa mensal"
                value={`${metaStats.taxa}%`}
                sub="Mês atual"
                accent="violet"
              />
            </div>
          </div>
        )
      )}
    </div>
  )
}
