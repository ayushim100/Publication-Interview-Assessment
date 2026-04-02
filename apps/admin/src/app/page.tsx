'use client';

import { useEffect, useState } from 'react';
import { api } from '@/lib/api';

export default function Dashboard() {
  const [stats, setStats] = useState({ pages: 0, leads: 0, brands: 0 });
  const [recentLeads, setRecentLeads] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboard();
  }, []);

  async function loadDashboard() {
    try {
      const [pages, leads, brands] = await Promise.all([
        api.getPages(),
        api.getLeads(),
        api.getBrands(),
      ]);
      setStats({
        pages: pages.length,
        leads: leads.length,
        brands: brands.length,
      });
      setRecentLeads(leads.slice(0, 5));
    } catch (err) {
      console.error('Failed to load dashboard:', err);
    } finally {
      setLoading(false);
    }
  }

  if (loading) return <p>Loading dashboard...</p>;

  return (
    <div>
      <h1>Dashboard</h1>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '32px' }}>
        <StatCard label="Pages" value={stats.pages} href="/pages" />
        <StatCard label="Leads" value={stats.leads} href="/leads" />
        <StatCard label="Brands" value={stats.brands} />
      </div>

      <h2>Recent Leads</h2>
      {recentLeads.length > 0 ? (
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid #eee', textAlign: 'left' }}>
              <th style={{ padding: '8px' }}>Name</th>
              <th style={{ padding: '8px' }}>Email</th>
              <th style={{ padding: '8px' }}>Date</th>
            </tr>
          </thead>
          <tbody>
            {recentLeads.map((lead) => (
              <tr key={lead.id} style={{ borderBottom: '1px solid #eee' }}>
                <td style={{ padding: '8px' }}>{lead.name}</td>
                <td style={{ padding: '8px' }}>{lead.email}</td>
                <td style={{ padding: '8px', color: '#666' }}>{new Date(lead.createdAt).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p style={{ color: '#666' }}>No leads yet.</p>
      )}
    </div>
  );
}

function StatCard({ label, value, href }: { label: string; value: number; href?: string }) {
  const content = (
    <div style={{ padding: '24px', background: '#f8f9fa', borderRadius: '8px', textAlign: 'center' }}>
      <p style={{ margin: '0 0 4px', fontSize: '2rem', fontWeight: '700' }}>{value}</p>
      <p style={{ margin: 0, color: '#666' }}>{label}</p>
    </div>
  );

  if (href) {
    return <a href={href} style={{ textDecoration: 'none', color: 'inherit' }}>{content}</a>;
  }
  return content;
}
