import { Box, Alert, Typography, Button } from '@mui/material';
import { Download } from '@mui/icons-material';
import { useState } from 'react';
import { Priority } from '../types';
import { useLeads } from '../hooks/useLeads';
import { Sidebar } from '../components/shared/Sidebar';
import { InputPanel } from '../components/dashboard/InputPanel';
import { InsightsSummary } from '../components/dashboard/InsightsSummary';
import { LeadGrid } from '../components/leads/LeadGrid';
import { ErrorBoundary } from '../components/shared/ErrorBoundary';
import { downloadAsCSV, downloadAsJSON } from '../utils/download';

interface Props { leadsState: ReturnType<typeof useLeads> }
const SW = 240;

export function DashboardPage({ leadsState }: Props) {
  const { leads, meta, isLoading, error, hasSearched, fetchLeads, savedLeads, saveLead, removeSavedLead } = leadsState;
  const [priorityFilter, setPriorityFilter] = useState<Priority | 'all'>('all');
  const savedIds = new Set(savedLeads.map((l) => l.id));

  return (
    <Box style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#0f172a' }}>
      <Sidebar />
      <Box style={{ flexGrow: 1, marginLeft: SW, padding: 24 }}>
        <Box style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
          <Typography variant="h5" style={{ fontWeight: 700 }}>Lead Intelligence Dashboard</Typography>
          {leads.length > 0 && (
            <Box style={{ display: 'flex', gap: 8 }}>
              <Button size="small" variant="outlined" startIcon={<Download />}
                onClick={() => downloadAsCSV(leads, `leads-${meta?.industry ?? 'export'}`)}>CSV</Button>
              <Button size="small" variant="outlined" startIcon={<Download />}
                onClick={() => downloadAsJSON(leads, `leads-${meta?.industry ?? 'export'}`)}>JSON</Button>
            </Box>
          )}
        </Box>
        <ErrorBoundary>
          <InputPanel onGenerate={fetchLeads} isLoading={isLoading} />
          {error && <Alert severity="error" style={{ marginBottom: 24 }}>{error}</Alert>}
          {meta && <InsightsSummary meta={meta} priorityFilter={priorityFilter} onFilterChange={setPriorityFilter} />}
          <LeadGrid leads={leads} isLoading={isLoading} hasSearched={hasSearched}
            savedIds={savedIds} onSave={saveLead} onRemove={removeSavedLead} priorityFilter={priorityFilter} />
        </ErrorBoundary>
      </Box>
    </Box>
  );
}