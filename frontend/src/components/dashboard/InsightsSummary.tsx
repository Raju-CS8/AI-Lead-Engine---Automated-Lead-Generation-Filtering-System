import { Paper, ToggleButtonGroup, ToggleButton } from '@mui/material';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import { ApiMeta, Priority } from '../../types';

interface Props {
  meta: ApiMeta;
  priorityFilter: Priority | 'all';
  onFilterChange: (f: Priority | 'all') => void;
}

export function InsightsSummary({ meta, priorityFilter, onFilterChange }: Props) {
  const chartData = [
    { name: 'High', value: meta.highPriority, color: '#ef4444' },
    { name: 'Medium', value: meta.mediumPriority, color: '#f59e0b' },
    { name: 'Low', value: meta.lowPriority, color: '#374151' },
  ].filter((d) => d.value > 0);

  const stats = [
    { label: 'Total Leads', value: meta.total, color: '#6366f1' },
    { label: 'High Priority', value: meta.highPriority, color: '#ef4444' },
    { label: 'Gaps Found', value: meta.gapsDetected, color: '#f59e0b' },
    { label: 'Avg Score', value: meta.averageScore, color: '#10b981' },
  ];

  return (
    <div style={{
      backgroundColor: '#111827', border: '1px solid #1f2937',
      borderRadius: 12, padding: 24, marginBottom: 24,
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <div>
          <div style={{ fontSize: 16, fontWeight: 700, color: '#f9fafb' }}>Intelligence Report</div>
          <div style={{ fontSize: 12, color: '#6b7280', marginTop: 2 }}>
            {meta.industry} · {meta.location} · {meta.service}
          </div>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          {meta.cached && (
            <span style={{ padding: '3px 8px', borderRadius: 6, fontSize: 10, backgroundColor: '#1f2937', color: '#6b7280', fontWeight: 600 }}>
              CACHED
            </span>
          )}
          <span style={{ padding: '3px 8px', borderRadius: 6, fontSize: 10, backgroundColor: 'rgba(16,185,129,0.1)', color: '#10b981', fontWeight: 600 }}>
            FREE · OSM
          </span>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap', alignItems: 'center' }}>
        {/* Stats */}
        <div style={{ flex: 1, minWidth: 280 }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 20 }}>
            {stats.map((s) => (
              <div key={s.label} style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 32, fontWeight: 800, color: s.color, lineHeight: 1 }}>
                  {s.value}
                </div>
                <div style={{ fontSize: 10, color: '#6b7280', marginTop: 4, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                  {s.label}
                </div>
              </div>
            ))}
          </div>

          <div style={{ borderTop: '1px solid #1f2937', paddingTop: 16 }}>
            <div style={{ fontSize: 11, color: '#6b7280', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              Filter by Priority
            </div>
            <div style={{ display: 'flex', gap: 6 }}>
              {(['all', 'high', 'medium', 'low'] as const).map((p) => (
                <button key={p} onClick={() => onFilterChange(p as Priority | 'all')}
                  style={{
                    padding: '5px 12px', borderRadius: 6, cursor: 'pointer', fontSize: 11, fontWeight: 600,
                    textTransform: 'capitalize',
                    backgroundColor: priorityFilter === p ? '#6366f1' : '#1f2937',
                    color: priorityFilter === p ? '#fff' : '#9ca3af',
                    border: `1px solid ${priorityFilter === p ? '#6366f1' : '#374151'}`,
                  }}>
                  {p}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Chart */}
        <div style={{ width: 160, height: 160 }}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={chartData} cx="50%" cy="50%" innerRadius={45} outerRadius={70} dataKey="value" strokeWidth={0}>
                {chartData.map((e) => <Cell key={e.name} fill={e.color} />)}
              </Pie>
              <Tooltip
                contentStyle={{ background: '#0f172a', border: '1px solid #1f2937', borderRadius: 8, fontSize: 12 }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}