import { Box, Typography, Grid, Paper } from '@mui/material';
import { BookmarkBorder } from '@mui/icons-material';
import { useLeads } from '../hooks/useLeads';
import { Sidebar } from '../components/shared/Sidebar';
import { LeadCard } from '../components/leads/LeadCard';

interface Props { leadsState: ReturnType<typeof useLeads> }
const SW = 240;

export function SavedLeadsPage({ leadsState }: Props) {
  const { savedLeads, saveLead, removeSavedLead } = leadsState;
  const savedIds = new Set(savedLeads.map((l) => l.id));
  return (
    <Box style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#0f172a' }}>
      <Sidebar />
      <Box style={{ flexGrow: 1, marginLeft: SW, padding: 24 }}>
        <Typography variant="h5" style={{ fontWeight: 700, marginBottom: 24 }}>
          Saved Leads ({savedLeads.length})
        </Typography>
        {savedLeads.length === 0
          ? <Paper style={{ padding: 48, textAlign: 'center' }}>
              <BookmarkBorder style={{ fontSize: 48, color: '#94a3b8', marginBottom: 16 }} />
              <Typography variant="h6" style={{ color: '#94a3b8' }}>No saved leads yet</Typography>
              <Typography variant="body2" style={{ color: '#94a3b8' }}>Generate leads and click Save Lead</Typography>
            </Paper>
          : <Grid container spacing={3}>
              {savedLeads.map((lead) => (
                <Grid size={{ xs: 12, sm: 6, lg: 4 }} key={lead.id}>
                  <LeadCard lead={lead} isSaved={savedIds.has(lead.id)} onSave={saveLead} onRemove={removeSavedLead} />
                </Grid>
              ))}
            </Grid>}
      </Box>
    </Box>
  );
}