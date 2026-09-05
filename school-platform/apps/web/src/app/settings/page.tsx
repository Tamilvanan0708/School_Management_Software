'use client';
import { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import { RequireAuth } from '@/components/layout/require-auth';
import { useAuth } from '@/lib/auth';

type Tab = 'school' | 'years' | 'roles' | 'users';

export default function SettingsPage() {
  const { user, hasPermission } = useAuth();
  const canSettings = user?.roles.includes('owner') || hasPermission('settings', 'edit') || hasPermission('role', 'edit') || hasPermission('user', 'view');
  const [tab, setTab] = useState<Tab>('years');

  if (!canSettings) return <RequireAuth><div style={{ padding: '2rem' }}>Access restricted to school staff.</div></RequireAuth>;

  const tabs = [
    { key: 'school', label: 'School Profile' },
    { key: 'years', label: 'Academic Years' },
    { key: 'roles', label: 'Roles & Permissions' },
    { key: 'users', label: 'Users' },
  ].filter((t) => (t.key === 'roles' ? hasPermission('role', 'view') : t.key === 'users' ? hasPermission('user', 'view') : true) || (user?.roles.includes('owner')));

  return (
    <RequireAuth>
      <div style={{ padding: '2rem', maxWidth: 1000, margin: '0 auto' }}>
        <h1 style={{ fontSize: 24, marginBottom: 20 }}>Settings</h1>
        <div style={{ display: 'flex', gap: 6, marginBottom: 24, flexWrap: 'wrap' }}>
          {tabs.map((t) => (
            <button key={t.key} onClick={() => setTab(t.key as Tab)} style={{ padding: '8px 16px', borderRadius: 20, border: '1px solid #ddd', background: tab === t.key ? '#0070f3' : '#fff', color: tab === t.key ? '#fff' : '#333', cursor: 'pointer' }}>
              {t.label}
            </button>
          ))}
        </div>
        {tab === 'school' && <SchoolProfile />}
        {tab === 'years' && <AcademicYears />}
        {tab === 'roles' && <RolesPermissions />}
        {tab === 'users' && <UserDirectory />}
      </div>
    </RequireAuth>
  );
}

function SchoolProfile() {
  const [school, setSchool] = useState<any>(null);
  const [form, setForm] = useState({ name: '', phone: '', email: '', address: '' });
  useEffect(() => { api.school.get().then((s) => { setSchool(s); setForm({ name: s.name, phone: s.phone || '', email: s.email || '', address: s.address || '' }); }); }, []);
  const save = async () => { await api.school.update(form); alert('Saved'); };
  if (!school) return <p>Loading…</p>;
  return (
    <div style={{ display: 'grid', gap: 10, maxWidth: 460 }}>
      {(['name', 'phone', 'email', 'address'] as const).map((f) => (
        <div key={f}><label style={{ fontSize: 12, color: '#666', textTransform: 'capitalize' }}>{f}</label>
          <input value={(form as any)[f]} onChange={(e) => setForm({ ...form, [f]: e.target.value })} style={{ width: '100%', padding: 8 }} />
        </div>
      ))}
      <button onClick={save} style={{ padding: 10, background: '#0070f3', color: '#fff', border: 'none', borderRadius: 4, cursor: 'pointer' }}>Save Profile</button>
    </div>
  );
}

function AcademicYears() {
  const [years, setYears] = useState<any[]>([]);
  const [form, setForm] = useState({ name: '', startDate: '', endDate: '' });
  const load = () => api.school.academicYears().then(setYears);
  useEffect(() => { load(); }, []);
  const create = async () => { if (form.name && form.startDate) { await api.school.createYear({ ...form, isCurrent: false }); setForm({ name: '', startDate: '', endDate: '' }); load(); } };
  const makeCurrent = async (id: string) => { await api.school.setCurrentYear(id); load(); };
  return (
    <div>
      <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
        <input placeholder="e.g. 2026-2027" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} style={{ padding: 8 }} />
        <input type="date" value={form.startDate} onChange={(e) => setForm({ ...form, startDate: e.target.value })} style={{ padding: 8 }} />
        <input type="date" value={form.endDate} onChange={(e) => setForm({ ...form, endDate: e.target.value })} style={{ padding: 8 }} />
        <button onClick={create} style={{ padding: '8px 16px', background: '#0070f3', color: '#fff', border: 'none', borderRadius: 4, cursor: 'pointer' }}>Add</button>
      </div>
      {years.map((y) => (
        <div key={y.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: '1px solid #eee' }}>
          <div>{y.name}{y.isCurrent && <span style={{ color: 'green', marginLeft: 8, fontSize: 12 }}>● current</span>}</div>
          {!y.isCurrent && <button onClick={() => makeCurrent(y.id)} style={{ fontSize: 12, color: '#0070f3', background: 'none', border: 'none', cursor: 'pointer' }}>Set current</button>}
        </div>
      ))}
    </div>
  );
}

function RolesPermissions() {
  const [roles, setRoles] = useState<any[]>([]);
  const [perms, setPerms] = useState<any[]>([]);
  const [selected, setSelected] = useState('');

  useEffect(() => {
    Promise.all([api.roles.list(), api.roles.permissions()]).then(([r, p]) => { setRoles(r); setPerms(p); setSelected(r[0]?.id || ''); });
  }, []);

  const role = roles.find((r) => r.id === selected);
  const has = (pid: string) => (role?.permissions || []).some((rp: any) => rp.permissionId === pid);

  const toggle = async (pid: string) => {
    const list: string[] = ((role?.permissions || []) as any[]).map((rp) => rp.permissionId);
    const current: string[] = list.includes(pid) ? list.filter((x) => x !== pid) : [...list, pid];
    await api.roles.setPermissions(selected, current);
    setRoles(await api.roles.list());
  };

  const byResource: Record<string, any[]> = {};
  perms.forEach((p) => { (byResource[p.resource] ??= []).push(p); });

  if (!role) return <p>Loading…</p>;
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '220px 1fr', gap: 20 }}>
      <div>
        {roles.map((r) => (
          <div key={r.id} onClick={() => setSelected(r.id)} style={{ padding: '8px 12px', cursor: 'pointer', borderRadius: 8, background: selected === r.id ? '#e6f0ff' : 'transparent', fontWeight: selected === r.id ? 600 : 400 }}>
            {r.name} <span style={{ float: 'right', color: '#888', fontSize: 12 }}>{r._count?.userRoles ?? 0}</span>
          </div>
        ))}
      </div>
      <div style={{ maxHeight: '60vh', overflowY: 'auto' }}>
        {Object.entries(byResource).map(([res, list]) => (
          <div key={res} style={{ marginBottom: 10 }}>
            <div style={{ fontWeight: 600, textTransform: 'capitalize', fontSize: 13, marginBottom: 4 }}>{res}</div>
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
              {list.map((p: any) => (
                <label key={p.id} style={{ fontSize: 12, padding: '3px 10px', borderRadius: 14, border: `1px solid ${has(p.id) ? '#0070f3' : '#ddd'}`, background: has(p.id) ? '#e6f0ff' : '#fff', cursor: 'pointer' }}>
                  <input type="checkbox" checked={has(p.id)} onChange={() => toggle(p.id)} style={{ display: 'none' }} /> {p.action}
                </label>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function UserDirectory() {
  const [users, setUsers] = useState<any[]>([]);
  const [role, setRole] = useState('');
  useEffect(() => { api.school.users(role || undefined).then(setUsers).catch(console.error); }, [role]);
  return (
    <div>
      <select value={role} onChange={(e) => setRole(e.target.value)} style={{ padding: 8, marginBottom: 16 }}>
        <option value="">All roles</option>
        <option value="owner">Owner</option><option value="principal">Principal</option><option value="admin">Admin</option>
        <option value="coordinator">Coordinator</option><option value="teacher">Teacher</option><option value="student">Student</option><option value="parent">Parent</option>
      </select>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead><tr style={{ background: '#f5f5f5', textAlign: 'left' }}>
          <th style={{ padding: 10 }}>Name</th><th style={{ padding: 10 }}>Email</th><th style={{ padding: 10 }}>Roles</th><th style={{ padding: 10 }}>Status</th>
        </tr></thead>
        <tbody>{users.map((u) => (
          <tr key={u.id}>
            <td style={{ padding: 10, borderBottom: '1px solid #eee' }}>{u.firstName} {u.lastName}</td>
            <td style={{ padding: 10, borderBottom: '1px solid #eee' }}>{u.email}</td>
            <td style={{ padding: 10, borderBottom: '1px solid #eee' }}>{u.roles?.map((r: any) => r.role.name).join(', ')}</td>
            <td style={{ padding: 10, borderBottom: '1px solid #eee', color: u.isActive ? 'green' : 'red' }}>{u.isActive ? 'Active' : 'Disabled'}</td>
          </tr>
        ))}</tbody>
      </table>
    </div>
  );
}