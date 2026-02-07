import { fetchCastReplies } from '../../../lib/neynar';

function scoreFor(item: { reactions?: { likes_count?: number; recasts_count?: number; likes?: number; recasts?: number } }) {
  const likes = item?.reactions?.likes_count ?? item?.reactions?.likes ?? 0;
  const recasts = item?.reactions?.recasts_count ?? item?.reactions?.recasts ?? 0;
  return likes + 2 * recasts;
}

export default async function ContestPage({ params }: { params: { id: string } }) {
  const id = params.id;
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || '';

  // fetch contest data
  const contestRes = await fetch(`${baseUrl}/api/contest?id=${encodeURIComponent(id)}`, { cache: 'no-store' });
  const contestJson = await contestRes.json();
  const contest = contestJson?.contest;

  const apiKey = process.env.NEYNAR_API_KEY;

  let replies: Array<{ text: string; author?: { username?: string }; reactions?: { likes_count?: number; recasts_count?: number } }> = [];
  let err: string | null = null;

  if (!contest) {
    err = 'Contest not found';
  } else if (!contest.castHash) {
    err = 'Contest castHash not set yet. Post the cast, then set castHash in the contest store (MVP limitation).';
  } else if (!apiKey) {
    err = 'Server missing NEYNAR_API_KEY.';
  } else {
    try {
      const r = await fetchCastReplies(contest.castHash, apiKey);
      replies = r?.result?.casts || r?.casts || [];
    } catch (e: unknown) {
      err = e instanceof Error ? e.message : String(e);
    }
  }

  const ranked = [...replies]
    .map((c) => ({ cast: c, score: scoreFor(c) }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 10);

  return (
    <main style={{ padding: 24, fontFamily: 'system-ui, -apple-system, Segoe UI, Roboto, Arial', maxWidth: 900 }}>
      <h2>Contest Leaderboard</h2>
      {contest ? (
        <>
          <p><b>{contest.title}</b></p>
          <p style={{ whiteSpace: 'pre-wrap' }}>{contest.prompt}</p>
          <p><b>Ends:</b> {contest.endsAt}</p>
          <p><b>Scoring:</b> likes + 2×recasts</p>
        </>
      ) : null}

      {err ? (
        <p style={{ color: 'crimson' }}>{err}</p>
      ) : (
        <ol>
          {ranked.map((r, idx) => (
            <li key={idx} style={{ marginBottom: 14 }}>
              <div><b>@{r.cast?.author?.username || 'unknown'}</b> — score {r.score}</div>
              <div style={{ whiteSpace: 'pre-wrap' }}>{r.cast?.text}</div>
            </li>
          ))}
        </ol>
      )}

      <p style={{ marginTop: 30, opacity: 0.7 }}>
        MVP note: after you post the contest cast, we need to store its cast hash in the contest object.
      </p>
    </main>
  );
}
