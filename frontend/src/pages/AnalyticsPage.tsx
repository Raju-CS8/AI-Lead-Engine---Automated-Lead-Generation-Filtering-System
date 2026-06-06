import { Box, Typography, Paper, Grid } from '@mui/material';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useLeads } from '../hooks/useLeads';
import { Sidebar } from '../components/shared/Sidebar';

interface Props { leadsState: ReturnType<typeof useLeads> }
const SW = 240;
const tt = { contentStyle: { background: '#1e293b', border: '1px solid #334155', borderRadius: 8 } };

export function AnalyticsPage({ leadsState }: Props) {
  const { leads, meta } = leadsState;

  const scoreData = [
    { range: '80-100', count: leads.filter((l) => l.score.value >= 80).length },
    { range: '60-79', count: leads.filter((l) => l.score.value >= 60 && l.score.value < 80).length },
    { range: '40-59', count: leads.filter((l) => l.score.value >= 40 && l.score.value < 60).length },
    { range: '0-39', count: leads.filter((l) => l.score.value < 40).length },
  ];

  const gapData = [
    { gap: 'No Website', count: leads.filter((l) => l.gaps.some((g) => g.type === 'no_website')).length },
    { gap: 'No Phone', count: leads.filter((l) => l.gaps.some((g) => g.type === 'no_phone')).length },
    { gap: 'No Email', count: leads.filter((l) => l.gaps.some((g) => g.type === 'no_email')).length },
    { gap: 'Weak Profile', count: leads.filter((l) => l.gaps.some((g) => g.type === 'no_google_business')).length },
  ];

  const maturityData = [
    { m: 'Low', count: leads.filter((l) => l.maturity === 'low').length },
    { m: 'Partial', count: leads.filter((l) => l.maturity === 'partial').length },
    { m: 'Established', count: leads.filter((l) => l.maturity === 'established').length },
  ];

  return (
    <Box style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#0f172a' }}>
      <Sidebar />
      <Box style={{ flexGrow: 1, marginLeft: SW, padding: 24 }}>
        <Typography variant="h5" style={{ fontWeight: 700, marginBottom: 24 }}>Analytics</Typography>
        {!meta
          ? <Paper style={{ padding: 32, textAlign: 'center' }}>
              <Typography style={{ color: '#94a3b8' }}>Generate leads from Dashboard to see analytics</Typography>
            </Paper>
          : <Grid container spacing={3}>
              {[
                { title: 'Score Distribution', data: scoreData, key: 'range', fill: '#6366f1' },
                { title: 'Gap Analysis', data: gapData, key: 'gap', fill: '#10b981' },
                { title: 'Maturity Breakdown', data: maturityData, key: 'm', fill: '#f59e0b' },
              ].map((chart) => (
                <Grid item xs={12} md={6} key={chart.title}>
                  <Paper style={{ padding: 24 }}>
                    <Typography variant="h6" style={{ fontWeight: 600, marginBottom: 16 }}>{chart.title}</Typography>
                    <ResponsiveContainer width="100%" height={200}>
                      <BarChart data={chart.data}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                        <XAxis dataKey={chart.key} stroke="#94a3b8" tick={{ fontSize: 11 }} />
                        <YAxis stroke="#94a3b8" />
                        <Tooltip {...tt} />
                        <Bar dataKey="count" fill={chart.fill} radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </Paper>
                </Grid>
              ))}
            </Grid>}
      </Box>
    </Box>
  );
}