'use client';

import { useEffect, useState } from 'react';
import { api } from '@/lib/api';

interface LeadItem {
  id: string;
  name: string;
  email: string;
  phone?: string;
  message?: string;
  notes?: string;
  metadata: Record<string, any>;
  pageId: string;
  brandId: string;
  createdAt: string;
}

export default function LeadsPage() {
  const [leads, setLeads] = useState<LeadItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedLead, setSelectedLead] = useState<LeadItem | null>(null);

  useEffect(() => {
    loadLeads();
  }, []);

  async function loadLeads() {
    try {
      const data = await api.getLeads();
      setLeads(data);
    } catch (err) {
      console.error('Failed to load leads:', err);
    } finally {
      setLoading(false);
    }
  }

  if (loading) return <p>Loading leads...</p>;

  return (
    <div>
      <h1>Leads</h1>

      <div style={{ display: 'grid', gridTemplateColumns: selectedLead ? '1fr 400px' : '1fr', gap: '24px' }}>
        <div>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #eee', textAlign: 'left' }}>
                <th style={{ padding: '8px' }}>Name</th>
                <th style={{ padding: '8px' }}>Email</th>
                <th style={{ padding: '8px' }}>Notes</th>
                <th style={{ padding: '8px' }}>Date</th>
              </tr>
            </thead>
            <tbody>
              {leads.map((lead) => (
                <tr
                  key={lead.id}
                  onClick={() => setSelectedLead(lead)}
                  style={{
                    borderBottom: '1px solid #eee',
                    cursor: 'pointer',
                    background: selectedLead?.id === lead.id ? '#f0f0ff' : 'transparent',
                  }}
                >
                  <td style={{ padding: '8px', fontWeight: '500' }}>{lead.name}</td>
                  <td style={{ padding: '8px' }}>{lead.email}</td>
                  <td style={{ padding: '8px', color: '#666', maxWidth: '300px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {lead.notes || '—'}
                  </td>
                  <td style={{ padding: '8px', color: '#666' }}>{new Date(lead.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {leads.length === 0 && <p style={{ color: '#666', marginTop: '16px' }}>No leads yet.</p>}
        </div>

        {selectedLead && (
          <div style={{ border: '1px solid #eee', borderRadius: '8px', padding: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ margin: 0 }}>Lead Details</h3>
              <button onClick={() => setSelectedLead(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#666' }}>
                Close
              </button>
            </div>

            <dl style={{ margin: 0 }}>
              <dt style={{ fontWeight: '600', marginTop: '12px' }}>Name</dt>
              <dd style={{ margin: '4px 0 0' }}>{selectedLead.name}</dd>

              <dt style={{ fontWeight: '600', marginTop: '12px' }}>Email</dt>
              <dd style={{ margin: '4px 0 0' }}>{selectedLead.email}</dd>

              {selectedLead.phone && (
                <>
                  <dt style={{ fontWeight: '600', marginTop: '12px' }}>Phone</dt>
                  <dd style={{ margin: '4px 0 0' }}>{selectedLead.phone}</dd>
                </>
              )}

              {selectedLead.message && (
                <>
                  <dt style={{ fontWeight: '600', marginTop: '12px' }}>Message</dt>
                  <dd style={{ margin: '4px 0 0' }}>{selectedLead.message}</dd>
                </>
              )}

              {selectedLead.notes && (
                <>
                  <dt style={{ fontWeight: '600', marginTop: '12px' }}>Notes</dt>
                  <dd style={{ margin: '4px 0 0', padding: '8px', background: '#f8f9fa', borderRadius: '4px', fontSize: '0.9rem' }}>
                    {selectedLead.notes}
                  </dd>
                </>
              )}

              {Object.keys(selectedLead.metadata).length > 0 && (
                <>
                  <dt style={{ fontWeight: '600', marginTop: '12px' }}>Metadata</dt>
                  <dd style={{ margin: '4px 0 0' }}>
                    <pre style={{ padding: '8px', background: '#f8f9fa', borderRadius: '4px', fontSize: '0.85rem', overflow: 'auto' }}>
                      {JSON.stringify(selectedLead.metadata, null, 2)}
                    </pre>
                  </dd>
                </>
              )}
            </dl>

            <p style={{ fontSize: '0.85rem', color: '#666', marginTop: '16px' }}>
              Submitted: {new Date(selectedLead.createdAt).toLocaleString()}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
