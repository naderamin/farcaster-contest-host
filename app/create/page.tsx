'use client';

import { useState } from 'react';

export default function Create() {
  const [title, setTitle] = useState('');
  const [prompt, setPrompt] = useState('');
  const [hours, setHours] = useState(24);
  const [created, setCreated] = useState<{ id: string; title: string; prompt: string } | null>(null);
  const [err, setErr] = useState<string | null>(null);

  async function submit() {
    setErr(null);
    const endsAt = new Date(Date.now() + hours * 60 * 60 * 1000).toISOString();
    const res = await fetch('/api/contest', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ title, prompt, endsAt, scoring: 'likes_plus_2recasts' }),
    });
    const j = await res.json();
    if (!res.ok) {
      setErr(j.error || 'Failed');
      return;
    }
    setCreated(j.contest);
  }

  const appUrl = process.env.NEXT_PUBLIC_APP_URL || '';

  return (
    <main style={{ padding: 24, fontFamily: 'system-ui, -apple-system, Segoe UI, Roboto, Arial', maxWidth: 760 }}>
      <h2>Create contest</h2>

      <label>Title</label>
      <input value={title} onChange={(e) => setTitle(e.target.value)} style={{ width: '100%', padding: 10, margin: '6px 0 14px' }} />

      <label>Prompt</label>
      <textarea value={prompt} onChange={(e) => setPrompt(e.target.value)} style={{ width: '100%', padding: 10, margin: '6px 0 14px', minHeight: 120 }} />

      <label>Duration (hours)</label>
      <input type="number" value={hours} onChange={(e) => setHours(parseInt(e.target.value || '24', 10))} style={{ width: 120, padding: 10, margin: '6px 0 14px' }} />

      <button onClick={submit} style={{ padding: '10px 14px' }}>Create</button>

      {err ? <p style={{ color: 'crimson' }}>{err}</p> : null}

      {created ? (
        <div style={{ marginTop: 18 }}>
          <h3>Contest created</h3>
          <p><b>ID:</b> {created.id}</p>
          <p>
            Leaderboard URL: <a href={`${appUrl}/c/${created.id}`} target="_blank">{appUrl}/c/{created.id}</a>
          </p>
          <p>
            Cast text to post:
          </p>
          <pre style={{ background: '#111', color: '#eee', padding: 12, whiteSpace: 'pre-wrap' }}>
{`🧩 Contest: ${created.title}\n\n${created.prompt}\n\nReply to this cast with your entry. Winner in ${hours}h.\nLeaderboard: ${appUrl}/c/${created.id}`}
          </pre>
        </div>
      ) : null}
    </main>
  );
}
