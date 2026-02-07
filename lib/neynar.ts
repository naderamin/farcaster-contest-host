export type NeynarCast = {
  hash: string;
  text: string;
  author: { username: string; fid: number; pfp_url?: string };
  reactions?: { likes_count?: number; recasts_count?: number };
};

const NEYNAR_BASE = 'https://api.neynar.com/v2/farcaster';

export async function neynarFetch<T>(path: string, apiKey: string): Promise<T> {
  const url = `${NEYNAR_BASE}${path}`;
  const res = await fetch(url, {
    headers: {
      accept: 'application/json',
      api_key: apiKey,
    },
    cache: 'no-store',
  });
  if (!res.ok) {
    const txt = await res.text().catch(() => '');
    throw new Error(`Neynar ${res.status}: ${txt.slice(0, 500)}`);
  }
  return res.json() as Promise<T>;
}

export type NeynarRepliesResponse = {
  result?: { casts?: NeynarCast[] };
  casts?: NeynarCast[];
};

export async function fetchCastReplies(castHash: string, apiKey: string): Promise<NeynarRepliesResponse> {
  // Endpoint names may differ; surface errors clearly.
  return neynarFetch<NeynarRepliesResponse>(
    `/cast/replies?cast_hash=${encodeURIComponent(castHash)}&limit=50`,
    apiKey
  );
}
