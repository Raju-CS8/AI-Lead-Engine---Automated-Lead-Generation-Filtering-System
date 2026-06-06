import { Box, Typography, Paper, Skeleton } from '@mui/material';
import { SearchOff } from '@mui/icons-material';
import { Lead, Priority } from '../../types';
import { LeadCard } from './LeadCard';

interface Props {
  leads: Lead[];
  isLoading: boolean;
  hasSearched: boolean;
  savedIds: Set<string>;
  onSave: (l: Lead) => void;
  onRemove: (id: string) => void;
  priorityFilter: Priority | 'all';
}

function SkeletonCard() {
  return (
    <div style={{ padding: 16, border: '1px solid #334155', borderRadius: 12 }}>
      <Skeleton variant="text" width="60%" height={24} />
      <Skeleton variant="text" width="40%" height={18} style={{ marginBottom: 8 }} />
      <Skeleton variant="rectangular" height={80} style={{ borderRadius: 8, marginBottom: 8 }} />
      <Skeleton variant="rectangular" height={36} style={{ borderRadius: 8 }} />
    </div>
  );
}

export function LeadGrid({ leads, isLoading, hasSearched, savedIds, onSave, onRemove, priorityFilter }: Props) {
  const filtered = priorityFilter === 'all'
    ? leads
    : leads.filter((l) => l.score.priority === priorityFilter);

  if (isLoading) {
    return (
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: 20 }}>
        {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
      </div>
    );
  }

  if (!hasSearched) {
    return (
      <Paper style={{ padding: 48, textAlign: 'center', border: '1px dashed #334155' }}>
        <Typography variant="h6" style={{ color: '#94a3b8', marginBottom: 8 }}>
          Ready to find leads
        </Typography>
        <Typography variant="body2" style={{ color: '#94a3b8' }}>
          Fill in the form above and click Generate Intelligence
        </Typography>
      </Paper>
    );
  }

  if (!filtered.length) {
    return (
      <Paper style={{ padding: 48, textAlign: 'center' }}>
        <SearchOff style={{ fontSize: 48, color: '#94a3b8', marginBottom: 16 }} />
        <Typography variant="h6" style={{ color: '#94a3b8' }}>No businesses found</Typography>
        <Typography variant="body2" style={{ color: '#94a3b8' }}>
          Try: Restaurant + Chennai, Cafe + Bangalore, Gym + Mumbai
        </Typography>
      </Paper>
    );
  }

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: 20 }}>
      {filtered.map((lead) => (
        <LeadCard
          key={lead.id}
          lead={lead}
          isSaved={savedIds.has(lead.id)}
          onSave={onSave}
          onRemove={onRemove}
        />
      ))}
    </div>
  );
}