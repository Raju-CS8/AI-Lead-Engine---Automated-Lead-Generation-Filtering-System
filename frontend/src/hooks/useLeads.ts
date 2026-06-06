import { useState, useCallback } from 'react';
import { Lead, ApiMeta, LeadSearchParams, Priority } from '../types';
import { generateLeads } from '../services/api.service';

interface LeadsState {
  leads: Lead[];
  meta: ApiMeta | null;
  isLoading: boolean;
  error: string | null;
  hasSearched: boolean;
}

const SAVED_KEY = 'ai_lead_saved';

function loadSaved(): Lead[] {
  try {
    const r = localStorage.getItem(SAVED_KEY);
    return r ? (JSON.parse(r) as Lead[]) : [];
  } catch { return []; }
}

function persistSaved(leads: Lead[]) {
  localStorage.setItem(SAVED_KEY, JSON.stringify(leads));
}

export function useLeads() {
  const [state, setState] = useState<LeadsState>({
    leads: [],
    meta: null,
    isLoading: false,
    error: null,
    hasSearched: false,
  });

  const [savedLeads, setSavedLeads] = useState<Lead[]>(loadSaved);

  const fetchLeads = useCallback(async (params: LeadSearchParams) => {
    console.log('[useLeads] fetchLeads called', params);

    setState({
      leads: [],
      meta: null,
      isLoading: true,
      error: null,
      hasSearched: true,
    });

    try {
      const response = await generateLeads(params);
      console.log('[useLeads] response', response);
      console.log('[useLeads] leads count', response.data?.length);

      setState({
        leads: response.data ?? [],
        meta: response.meta ?? null,
        isLoading: false,
        error: null,
        hasSearched: true,
      });
    } catch (err) {
      console.error('[useLeads] error', err);
      setState({
        leads: [],
        meta: null,
        isLoading: false,
        error: err instanceof Error ? err.message : 'Failed to generate leads',
        hasSearched: true,
      });
    }
  }, []);

  const filterByPriority = useCallback(
    (priority: Priority | 'all') =>
      priority === 'all' ? state.leads : state.leads.filter((l) => l.score.priority === priority),
    [state.leads]
  );

  const clearLeads = useCallback(() => {
    setState({ leads: [], meta: null, isLoading: false, error: null, hasSearched: false });
  }, []);

  const saveLead = useCallback((lead: Lead) => {
    setSavedLeads((prev) => {
      if (prev.find((l) => l.id === lead.id)) return prev;
      const updated = [...prev, lead];
      persistSaved(updated);
      return updated;
    });
  }, []);

  const removeSavedLead = useCallback((id: string) => {
    setSavedLeads((prev) => {
      const updated = prev.filter((l) => l.id !== id);
      persistSaved(updated);
      return updated;
    });
  }, []);

  return {
    ...state,
    fetchLeads,
    filterByPriority,
    clearLeads,
    savedLeads,
    saveLead,
    removeSavedLead,
  };
}