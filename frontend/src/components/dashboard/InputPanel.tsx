import { Paper, TextField, MenuItem, Select, FormControl, InputLabel, Button, CircularProgress, SelectChangeEvent } from '@mui/material';
import { AutoGraph } from '@mui/icons-material';
import { useState } from 'react';
import { LeadSearchParams, ServiceType } from '../../types';

interface Props { onGenerate: (p: LeadSearchParams) => void; isLoading: boolean }

const INDUSTRIES = [
  'Restaurant', 'Dental', 'Gym', 'Salon', 'Clinic', 'Hotel', 'Cafe',
  'Pharmacy', 'School', 'Real Estate', 'Lawyer', 'Accountant',
  'Plumber', 'Electrician', 'Mechanic', 'Bakery', 'Spa', 'Yoga',
  'Photography', 'Hospital',
];

const SERVICES = Object.values(ServiceType);

export function InputPanel({ onGenerate, isLoading }: Props) {
  const [industry, setIndustry] = useState('');
  const [location, setLocation] = useState('');
  const [service, setService] = useState<ServiceType>(ServiceType.WEB_DEVELOPMENT);
  const [limit, setLimit] = useState(10);
  const [errors, setErrors] = useState<Record<string, string>>({});

  function validate(): boolean {
    const e: Record<string, string> = {};
    if (!industry) e['industry'] = 'Required';
    if (!location.trim()) e['location'] = 'Required';
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function handleSubmit() {
    if (!validate() || isLoading) return;
    onGenerate({ industry: industry.toLowerCase(), location, service, limit });
  }

  return (
    <div style={{
      backgroundColor: '#111827', border: '1px solid #1f2937',
      borderRadius: 12, padding: 24, marginBottom: 24,
    }}>
      <div style={{ fontSize: 13, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600, marginBottom: 16 }}>
        Lead Search Parameters
      </div>

      <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', alignItems: 'flex-end' }}>
        {/* Industry */}
        <div style={{ minWidth: 160 }}>
          <div style={{ fontSize: 11, color: '#6b7280', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Industry</div>
          <select
            value={industry}
            onChange={(e) => setIndustry(e.target.value)}
            style={{
              width: '100%', padding: '10px 12px', borderRadius: 8,
              backgroundColor: '#1f2937', border: `1px solid ${errors['industry'] ? '#ef4444' : '#374151'}`,
              color: industry ? '#f9fafb' : '#6b7280', fontSize: 13, outline: 'none', cursor: 'pointer',
            }}
          >
            <option value="">Select industry</option>
            {INDUSTRIES.map((i) => <option key={i} value={i.toLowerCase()}>{i}</option>)}
          </select>
          {errors['industry'] && <div style={{ fontSize: 11, color: '#ef4444', marginTop: 4 }}>{errors['industry']}</div>}
        </div>

        {/* Location */}
        <div style={{ minWidth: 180 }}>
          <div style={{ fontSize: 11, color: '#6b7280', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.06em' }}>City / Location</div>
          <input
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="Chennai, Mumbai, London..."
            onKeyDown={(e) => { if (e.key === 'Enter') handleSubmit(); }}
            style={{
              width: '100%', padding: '10px 12px', borderRadius: 8,
              backgroundColor: '#1f2937', border: `1px solid ${errors['location'] ? '#ef4444' : '#374151'}`,
              color: '#f9fafb', fontSize: 13, outline: 'none',
              boxSizing: 'border-box',
            }}
          />
          {errors['location'] && <div style={{ fontSize: 11, color: '#ef4444', marginTop: 4 }}>{errors['location']}</div>}
        </div>

        {/* Limit */}
        <div style={{ width: 90 }}>
          <div style={{ fontSize: 11, color: '#6b7280', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Count</div>
          <input
            type="number" value={limit} min={1} max={50}
            onChange={(e) => setLimit(Math.min(50, Math.max(1, Number(e.target.value))))}
            style={{
              width: '100%', padding: '10px 12px', borderRadius: 8,
              backgroundColor: '#1f2937', border: '1px solid #374151',
              color: '#f9fafb', fontSize: 13, outline: 'none', boxSizing: 'border-box',
            }}
          />
        </div>

        {/* Service */}
        <div>
          <div style={{ fontSize: 11, color: '#6b7280', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Service</div>
          <div style={{ display: 'flex', gap: 4 }}>
            {SERVICES.map((s) => (
              <button key={s} onClick={() => setService(s)}
                style={{
                  padding: '10px 14px', borderRadius: 8, cursor: 'pointer', fontSize: 12, fontWeight: 600,
                  backgroundColor: service === s ? '#6366f1' : '#1f2937',
                  border: `1px solid ${service === s ? '#6366f1' : '#374151'}`,
                  color: service === s ? '#fff' : '#9ca3af',
                  transition: 'all 0.15s',
                }}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* Generate button */}
        <button
          onClick={handleSubmit}
          disabled={isLoading}
          style={{
            padding: '10px 24px', borderRadius: 8, cursor: isLoading ? 'not-allowed' : 'pointer',
            backgroundColor: isLoading ? '#374151' : '#6366f1',
            border: 'none', color: '#fff', fontSize: 13, fontWeight: 700,
            display: 'flex', alignItems: 'center', gap: 8,
            opacity: isLoading ? 0.7 : 1, transition: 'all 0.15s',
            minWidth: 180, justifyContent: 'center',
          }}
        >
          {isLoading ? (
            <>
              <div style={{ width: 14, height: 14, border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
              Generating...
            </>
          ) : (
            <>
              <AutoGraph style={{ fontSize: 16 }} />
              Generate Intelligence
            </>
          )}
        </button>
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}