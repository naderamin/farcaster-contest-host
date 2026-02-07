import { NextResponse } from 'next/server';

// Minimal in-memory store (MVP). For production, move to KV/DB.
// contestId -> contest data
type ContestStore = Map<string, Contest>;
const g = globalThis as unknown as { __contests?: ContestStore };
const contests: ContestStore = g.__contests || new Map();
g.__contests = contests;

export type Contest = {
  id: string;
  title: string;
  prompt: string;
  createdAt: string;
  endsAt: string;
  castHash?: string;
  scoring: 'likes_plus_2recasts' | 'likes' | 'recasts';
};

export async function POST(req: Request) {
  const body = await req.json();
  const { title, prompt, endsAt, scoring } = body || {};
  if (!title || !prompt || !endsAt) {
    return NextResponse.json({ error: 'Missing title/prompt/endsAt' }, { status: 400 });
  }
  const id = crypto.randomUUID();
  const contest: Contest = {
    id,
    title: String(title).slice(0, 120),
    prompt: String(prompt).slice(0, 2000),
    createdAt: new Date().toISOString(),
    endsAt: new Date(endsAt).toISOString(),
    scoring: scoring || 'likes_plus_2recasts',
  };
  contests.set(id, contest);
  return NextResponse.json({ contest });
}

export async function GET(req: Request) {
  const url = new URL(req.url);
  const id = url.searchParams.get('id');
  if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 });
  const c = contests.get(id);
  if (!c) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json({ contest: c });
}
