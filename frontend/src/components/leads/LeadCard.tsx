import {
  Card, Typography, Chip, IconButton,
  Tooltip, Button, Collapse, Divider,
} from '@mui/material';
import {
  Language, Phone, LocationOn, ContentCopy,
  BookmarkAdd, BookmarkAdded, ExpandMore, ExpandLess,
  Search, Map, CheckCircle, Cancel,
} from '@mui/icons-material';
import { useState } from 'react';
import { Lead, Priority } from '../../types';
import { ScoreRing } from './ScoreRing';

interface Props {
  lead: Lead;
  isSaved: boolean;
  onSave: (l: Lead) => void;
  onRemove: (id: string) => void;
}

export function LeadCard({ lead, isSaved, onSave, onRemove }: Props) {
  const [expanded, setExpanded] = useState(false);
  const [copied, setCopied] = useState(false);

  const isHighPriority = lead.score.priority === Priority.HIGH;
  const isMedium = lead.score.priority === Priority.MEDIUM;

  const priorityConfig = {
    [Priority.HIGH]: { color: '#ef4444', bg: 'rgba(239,68,68,0.1)', label: 'HIGH' },
    [Priority.MEDIUM]: { color: '#f59e0b', bg: 'rgba(245,158,11,0.1)', label: 'MED' },
    [Priority.LOW]: { color: '#64748b', bg: 'rgba(100,116,139,0.1)', label: 'LOW' },
  };

  const pc = priorityConfig[lead.score.priority];

  function handleCopy() {
    navigator.clipboard.writeText(lead.outreachMessage);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div style={{
      backgroundColor: '#111827',
      border: `1px solid ${isHighPriority ? 'rgba(239,68,68,0.3)' : isMedium ? 'rgba(245,158,11,0.2)' : '#1f2937'}`,
      borderRadius: 12,
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'column',
      transition: 'transform 0.2s, box-shadow 0.2s',
      position: 'relative',
    }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-2px)';
        (e.currentTarget as HTMLDivElement).style.boxShadow = '0 8px 32px rgba(0,0,0,0.4)';
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLDivElement).style.transform = 'translateY(0)';
        (e.currentTarget as HTMLDivElement).style.boxShadow = 'none';
      }}
    >
      {/* Priority accent line at top */}
      <div style={{ height: 3, backgroundColor: pc.color, width: '100%' }} />

      <div style={{ padding: '16px 20px', flexGrow: 1 }}>

        {/* Header row */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
          <div style={{ flex: 1, marginRight: 12 }}>
            <div style={{ fontSize: 15, fontWeight: 700, color: '#f9fafb', lineHeight: 1.3, marginBottom: 2 }}>
              {lead.name}
            </div>
            <div style={{ fontSize: 11, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              {lead.category}
            </div>
          </div>
          <ScoreRing value={lead.score.value} />
        </div>

        {/* Priority + Maturity badges */}
        <div style={{ display: 'flex', gap: 6, marginBottom: 12, flexWrap: 'wrap' }}>
          <span style={{
            padding: '2px 8px', borderRadius: 4, fontSize: 10, fontWeight: 700,
            backgroundColor: pc.bg, color: pc.color, letterSpacing: '0.08em',
          }}>
            {pc.label} PRIORITY
          </span>
          <span style={{
            padding: '2px 8px', borderRadius: 4, fontSize: 10, fontWeight: 600,
            backgroundColor: '#1f2937', color: '#9ca3af', letterSpacing: '0.05em',
          }}>
            {lead.maturity.toUpperCase()}
          </span>
          <span style={{
            padding: '2px 8px', borderRadius: 4, fontSize: 10,
            backgroundColor: '#1f2937', color: '#6b7280',
          }}>
            {lead.location.city} · {lead.location.tier.replace('tier', 'T')}
          </span>
        </div>

        {/* Address */}
        {lead.address !== 'Address not available' && (
          <div style={{ display: 'flex', gap: 6, marginBottom: 10, alignItems: 'flex-start' }}>
            <LocationOn style={{ fontSize: 13, color: '#4b5563', marginTop: 1 }} />
            <span style={{ fontSize: 12, color: '#6b7280', lineHeight: 1.4 }}>{lead.address}</span>
          </div>
        )}

        {/* Website status — the key intelligence */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10,
          padding: '8px 12px', borderRadius: 8,
          backgroundColor: lead.contact.website ? 'rgba(16,185,129,0.08)' : 'rgba(239,68,68,0.08)',
          border: `1px solid ${lead.contact.website ? 'rgba(16,185,129,0.2)' : 'rgba(239,68,68,0.2)'}`,
        }}>
          {lead.contact.website ? (
            <>
              <CheckCircle style={{ fontSize: 14, color: '#10b981' }} />
              <span style={{ fontSize: 12, color: '#10b981', fontWeight: 600 }}>Has Website</span>
              <a href={lead.contact.website} target="_blank" rel="noreferrer"
                style={{ fontSize: 11, color: '#6b7280', marginLeft: 'auto', textDecoration: 'none' }}>
                {new URL(lead.contact.website).hostname}
              </a>
            </>
          ) : (
            <>
              <Cancel style={{ fontSize: 14, color: '#ef4444' }} />
              <span style={{ fontSize: 12, color: '#ef4444', fontWeight: 600 }}>No Website Found</span>
              <span style={{ fontSize: 11, color: '#6b7280', marginLeft: 'auto' }}>= Opportunity</span>
            </>
          )}
        </div>

        {/* Phone status */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12,
          padding: '8px 12px', borderRadius: 8,
          backgroundColor: lead.contact.phone ? 'rgba(16,185,129,0.08)' : 'rgba(107,114,128,0.08)',
          border: `1px solid ${lead.contact.phone ? 'rgba(16,185,129,0.2)' : '#1f2937'}`,
        }}>
          {lead.contact.phone ? (
            <>
              <CheckCircle style={{ fontSize: 14, color: '#10b981' }} />
              <span style={{ fontSize: 12, color: '#10b981', fontWeight: 600 }}>{lead.contact.phone}</span>
            </>
          ) : (
            <>
              <Cancel style={{ fontSize: 14, color: '#4b5563' }} />
              <span style={{ fontSize: 12, color: '#6b7280' }}>No Phone Listed</span>
            </>
          )}
        </div>

        {/* Quick links */}
        <div style={{ display: 'flex', gap: 6, marginBottom: 14 }}>
          <a href={lead.contact.smartLinks.googleSearchUrl} target="_blank" rel="noreferrer"
            style={{
              display: 'flex', alignItems: 'center', gap: 4, padding: '5px 10px',
              borderRadius: 6, backgroundColor: '#1f2937', color: '#9ca3af',
              fontSize: 11, textDecoration: 'none', fontWeight: 500,
            }}>
            <Search style={{ fontSize: 12 }} /> Google
          </a>
          <a href={lead.contact.smartLinks.googleMapsUrl} target="_blank" rel="noreferrer"
            style={{
              display: 'flex', alignItems: 'center', gap: 4, padding: '5px 10px',
              borderRadius: 6, backgroundColor: '#1f2937', color: '#9ca3af',
              fontSize: 11, textDecoration: 'none', fontWeight: 500,
            }}>
            <Map style={{ fontSize: 12 }} /> Maps
          </a>
        </div>

        {/* Recommendation */}
        <div style={{
          padding: '10px 12px', borderRadius: 8,
          backgroundColor: '#0f172a', border: '1px solid #1e293b', marginBottom: 12,
        }}>
          <div style={{ fontSize: 11, color: '#818cf8', fontWeight: 700, marginBottom: 4, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            {lead.recommendation.service}
          </div>
          <div style={{ fontSize: 12, color: '#6b7280', lineHeight: 1.5, marginBottom: 4 }}>
            {lead.recommendation.reason}
          </div>
          <div style={{ fontSize: 11, color: '#10b981', fontWeight: 600 }}>
            Est. value: {lead.recommendation.potentialValue}
          </div>
        </div>

        {/* Outreach toggle */}
        <button
          onClick={() => setExpanded(!expanded)}
          style={{
            width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '8px 0', background: 'none', border: 'none', cursor: 'pointer',
            color: '#818cf8', fontSize: 12, fontWeight: 600,
          }}
        >
          <span>{expanded ? 'Hide Outreach Message' : 'View Outreach Message'}</span>
          {expanded ? <ExpandLess style={{ fontSize: 16 }} /> : <ExpandMore style={{ fontSize: 16 }} />}
        </button>

        {expanded && (
          <div style={{
            marginTop: 8, padding: 12, borderRadius: 8,
            backgroundColor: '#0f172a', border: '1px solid #1e293b',
          }}>
            <pre style={{
              fontSize: 11, color: '#9ca3af', whiteSpace: 'pre-wrap',
              fontFamily: 'inherit', margin: '0 0 10px 0', lineHeight: 1.6,
            }}>
              {lead.outreachMessage}
            </pre>
            <button onClick={handleCopy} style={{
              display: 'flex', alignItems: 'center', gap: 6,
              padding: '6px 12px', borderRadius: 6, cursor: 'pointer',
              backgroundColor: copied ? 'rgba(16,185,129,0.15)' : '#1f2937',
              border: `1px solid ${copied ? 'rgba(16,185,129,0.4)' : '#374151'}`,
              color: copied ? '#10b981' : '#9ca3af', fontSize: 12, fontWeight: 600,
            }}>
              <ContentCopy style={{ fontSize: 13 }} />
              {copied ? 'Copied!' : 'Copy Message'}
            </button>
          </div>
        )}
      </div>

      {/* Footer */}
      <div style={{ padding: '12px 20px', borderTop: '1px solid #1f2937' }}>
        <button
          onClick={() => isSaved ? onRemove(lead.id) : onSave(lead)}
          style={{
            width: '100%', padding: '8px', borderRadius: 8, cursor: 'pointer',
            backgroundColor: isSaved ? 'rgba(239,68,68,0.1)' : 'rgba(99,102,241,0.15)',
            border: `1px solid ${isSaved ? 'rgba(239,68,68,0.3)' : 'rgba(99,102,241,0.3)'}`,
            color: isSaved ? '#ef4444' : '#818cf8',
            fontSize: 12, fontWeight: 600,
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
          }}
        >
          {isSaved ? <BookmarkAdded style={{ fontSize: 15 }} /> : <BookmarkAdd style={{ fontSize: 15 }} />}
          {isSaved ? 'Remove from Saved' : 'Save Lead'}
        </button>
      </div>
    </div>
  );
}