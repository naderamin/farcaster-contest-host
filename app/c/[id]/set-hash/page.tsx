'use client';

import { useState } from 'react';

export default function SetHash({ params }: { params: { id: string } }) {
  const id = params.id;
  const [castHash, setCastHash] = useState('');
  const [ok, setOk] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);

  async function save() {
    setOk(null);
    setErr(null);
    const res = await fetch(`/api/contest?id=${encodeURIComponent(id)}`, {
      method: 'PATCH',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ castHash }),
    });
    const j = await res.json();
    if (!res.ok) {
      setErr(j.error || 'Failed');
      return;
    }
    setOk('Saved. Go back to leaderboard.');
  }

  return (
    <main style={{ padding: 24, fontFamily: 'system-ui, -apple-system, Segoe UI, Roboto, Arial', maxWidth: 760 }}>
      <h2>Set contest cast hash</h2>
      <p>
        After you post the contest cast on Farcaster, paste its <b>cast hash</b> here (starts with 0x...).
      </p>

      <input
        value={castHash}
        onChange={(e) => setCastHash(e.target.value)}
        placeholder="0x..."
        style={{ width: '100%', padding: 10, margin: '10px 0 14px' }}
      />

      <button onClick={save} style={{ padding: '10px 14px' }}>Save cast hash</button>

      {ok ? <p style={{ color: 'green' }}>{ok}</p> : null}
      {err ? <p style={{ color: 'crimson' }}>{err}</p> : null}

      <p style={{ marginTop: 18 }}>
        Leaderboard: <a href={`/c/${id}`}>/c/{id}</a>
      </p>
    </main>
  );
}
