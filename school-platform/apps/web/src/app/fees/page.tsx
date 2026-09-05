'use client';
import { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import { RequireAuth } from '@/components/layout/require-auth';
import { useAuth } from '@/lib/auth';

export default function FeesPage() {
  const { user } = useAuth();
  const isParent = user?.roles.includes('parent');
  const isAdmin = !!user && !isParent && !user.roles.includes('student');

  return (
    <RequireAuth>
      <div style={{ padding: '2rem' }}>
        {isParent ? <ParentFees /> : isAdmin ? <AdminFees /> : (
          <div>
            <h1 style={{ fontSize: 24 }}>Fees</h1>
            <p style={{ color: '#666' }}>Fee payment is available to parents. Use the Parent portal account (parent@demo.com) to see the pay flow.</p>
          </div>
        )}
      </div>
    </RequireAuth>
  );
}

function ParentFees() {
  const [children, setChildren] = useState<any[]>([]);
  const [selected, setSelected] = useState('');
  const [ledger, setLedger] = useState<{ payments: any[]; due: number; paid: number } | null>(null);
  const [paying, setPaying] = useState(false);

  useEffect(() => { api.fees.children().then((c) => { setChildren(c); if (c[0]) setSelected(c[0].studentId); }).catch(console.error); }, []);
  useEffect(() => { if (selected) api.fees.ledger(selected).then(setLedger).catch(console.error); }, [selected]);

  const payAll = async () => {
    if (!ledger) return;
    setPaying(true);
    try {
      const pending = ledger.payments.filter((p: any) => p.status !== 'PAID');
      for (const p of pending) {
        const order = await api.fees.createOrder({ feePaymentId: p.id });
        if (order.mock) {
          await api.fees.verify({ feePaymentId: p.id, razorpayOrderId: 'mock_order', razorpayPaymentId: 'mock_pay', razorpaySignature: 'mock_sig' });
        } else {
          // Real Razorpay checkout integration goes here (load checkout.js, open, then verify)
          alert('Razorpay configured — implement checkout.js flow to complete payment.');
        }
      }
      await api.fees.ledger(selected).then(setLedger);
    } finally {
      setPaying(false);
    }
  };

  return (
    <div>
      <h1 style={{ fontSize: 24, marginBottom: 16 }}>My Children&apos;s Fees</h1>
      <div style={{ marginBottom: 16 }}>
        <select value={selected} onChange={(e) => setSelected(e.target.value)} style={{ padding: 8, borderRadius: 4 }}>
          {children.map((c: any) => <option key={c.studentId} value={c.studentId}>{c.name} ({c.className}-{c.section})</option>)}
        </select>
      </div>
      {ledger && (
        <>
          <div style={{ display: 'flex', gap: 24, marginBottom: 16 }}>
            <div style={{ background: '#ffebee', padding: 16, borderRadius: 8 }}><strong>Due:</strong> ₹{ledger.due.toLocaleString('en-IN')}</div>
            <div style={{ background: '#e8f5e9', padding: 16, borderRadius: 8 }}><strong>Paid:</strong> ₹{ledger.paid.toLocaleString('en-IN')}</div>
          </div>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead><tr style={{ background: '#f5f5f5', textAlign: 'left' }}>
              <th style={{ padding: 12 }}>Fee</th><th style={{ padding: 12 }}>Amount</th><th style={{ padding: 12 }}>Due</th><th style={{ padding: 12 }}>Status</th>
            </tr></thead>
            <tbody>{ledger.payments.map((p: any) => (
              <tr key={p.id}>
                <td style={{ padding: 12, borderBottom: '1px solid #eee' }}>{p.feeStructure.name}</td>
                <td style={{ padding: 12, borderBottom: '1px solid #eee' }}>₹{p.feeStructure.amount}</td>
                <td style={{ padding: 12, borderBottom: '1px solid #eee' }}>{p.feeStructure.dueDate ? new Date(p.feeStructure.dueDate).toLocaleDateString() : '-'}</td>
                <td style={{ padding: 12, borderBottom: '1px solid #eee' }}><span style={{ color: p.status === 'PAID' ? 'green' : 'red' }}>{p.status}</span></td>
              </tr>
            ))}</tbody>
          </table>
          <button onClick={payAll} disabled={paying || ledger.due === 0} style={{ marginTop: 16, padding: '10px 24px', background: '#0070f3', color: '#fff', border: 'none', borderRadius: 6 }}>
            {paying ? 'Processing…' : `Pay ₹${ledger.due.toLocaleString('en-IN')} now`}
          </button>
        </>
      )}
    </div>
  );
}

function AdminFees() {
  const [structures, setStructures] = useState<any[]>([]);
  const [summary, setSummary] = useState<{ expectedTotal: number; collected: number; percentage: number } | null>(null);
  const [pending, setPending] = useState<any[]>([]);
  const [classes, setClasses] = useState<any[]>([]);
  const [assignForm, setAssignForm] = useState({ feeStructureId: '', classId: '' });

  const load = () => {
    api.fees.structures().then(setStructures).catch(console.error);
    api.fees.summary().then(setSummary).catch(console.error);
    api.fees.pendingAll().then(setPending).catch(console.error);
    api.classes.list().then(setClasses).catch(console.error);
  };
  useEffect(() => { load(); }, []);

  const createStructure = async (name: string, amount: number, classId: string) => {
    await api.fees.createStructure({ name, amount, classId: classId || undefined, academicYearId: classes[0]?.sections ? 'placeholder' : undefined });
    load();
  };

  const assign = async () => {
    if (!assignForm.feeStructureId || !assignForm.classId) return;
    await api.fees.assign(assignForm);
    load();
  };

  return (
    <div>
      <h1 style={{ fontSize: 24, marginBottom: 16 }}>Fee Management</h1>
      {summary && (
        <div style={{ display: 'flex', gap: 16, marginBottom: 24 }}>
          <div style={{ background: '#f5f5f5', padding: 16, borderRadius: 8, minWidth: 180 }}><strong>Expected</strong><div style={{ fontSize: 22 }}>₹{summary.expectedTotal.toLocaleString('en-IN')}</div></div>
          <div style={{ background: '#e8f5e9', padding: 16, borderRadius: 8, minWidth: 180 }}><strong>Collected</strong><div style={{ fontSize: 22 }}>₹{summary.collected.toLocaleString('en-IN')}</div></div>
          <div style={{ background: '#e3f2fd', padding: 16, borderRadius: 8, minWidth: 180 }}><strong>Rate</strong><div style={{ fontSize: 22 }}>{summary.percentage}%</div></div>
        </div>
      )}
      <div style={{ display: 'grid', gridTemplateColumns: '360px 1fr', gap: 24 }}>
        <div>
          <h3 style={{ marginBottom: 8 }}>Create Fee Structure</h3>
          <FeeCreateForm classes={classes} onCreate={createStructure} />
          <h3 style={{ margin: '24px 0 8px' }}>Assign to Class</h3>
          <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
            <select value={assignForm.feeStructureId} onChange={(e) => setAssignForm({ ...assignForm, feeStructureId: e.target.value })} style={{ padding: 8, flex: 1 }}>
              <option value="">Fee…</option>
              {structures.map((f: any) => <option key={f.id} value={f.id}>{f.name}</option>)}
            </select>
            <select value={assignForm.classId} onChange={(e) => setAssignForm({ ...assignForm, classId: e.target.value })} style={{ padding: 8, flex: 1 }}>
              <option value="">Class…</option>
              {classes.map((c: any) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
            <button onClick={assign} style={{ padding: '8px 12px', background: '#0070f3', color: '#fff', border: 'none', borderRadius: 4 }}>Assign</button>
          </div>
          <h3 style={{ marginBottom: 8 }}>Structures</h3>
          {structures.map((f: any) => <div key={f.id} style={{ padding: 8, borderBottom: '1px solid #eee' }}>{f.name} — ₹{f.amount}</div>)}
        </div>
        <div>
          <h3 style={{ marginBottom: 8 }}>Pending Collection ({pending.length})</h3>
          {pending.slice(0, 50).map((p: any) => (
            <div key={p.id} style={{ padding: 8, borderBottom: '1px solid #eee', display: 'flex', justifyContent: 'space-between' }}>
              <span>{p.student?.user?.firstName} {p.student?.user?.lastName} · {p.feeStructure?.name}</span>
              <span style={{ color: 'red' }}>₹{p.feeStructure?.amount}</span>
            </div>
          ))}
          {pending.length === 0 && <p style={{ color: '#666' }}>All fees collected 🎉</p>}
        </div>
      </div>
    </div>
  );
}

function FeeCreateForm({ classes, onCreate }: { classes: any[]; onCreate: (name: string, amount: number, classId: string) => void }) {
  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');
  const [classId, setClassId] = useState('');
  return (
    <div style={{ display: 'grid', gap: 8 }}>
      <input placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} style={{ padding: 8 }} />
      <input placeholder="Amount (INR)" type="number" value={amount} onChange={(e) => setAmount(e.target.value)} style={{ padding: 8 }} />
      <select value={classId} onChange={(e) => setClassId(e.target.value)} style={{ padding: 8 }}>
        <option value="">All classes</option>
        {classes.map((c: any) => <option key={c.id} value={c.id}>{c.name}</option>)}
      </select>
      <button onClick={() => { if (name && amount) { onCreate(name, Number(amount), classId); setName(''); setAmount(''); setClassId(''); } }} style={{ padding: 8, background: '#0070f3', color: '#fff', border: 'none', borderRadius: 4 }}>Create</button>
    </div>
  );
}