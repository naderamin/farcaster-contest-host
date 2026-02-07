import { NextResponse } from 'next/server';
import { Redis } from '@upstash/redis';

const redis = Redis.fromEnv();
const KEY_PREFIX = 'contest:';

async function getContest(id: string): Promise<Contest | null> {
  const c = await redis.get<Contest>(`${KEY_PREFIX}${id}`);
  return c || null;
}

async function setContest(id: string, contest: Contest) {
  await redis.set(`${KEY_PREFIX}${id}`, contest);
}

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
  await setContest(id, contest);
  return NextResponse.json({ contest });
}

export async function GET(req: Request) {
  const url = new URL(req.url);
  const id = url.searchParams.get('id');
  if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 });
  const c = await getContest(id);
  if (!c) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json({ contest: c });
}

export async function PATCH(req: Request) {
  const url = new URL(req.url);
  const id = url.searchParams.get('id');
  if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 });
  const c = await getContest(id);
  if (!c) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  const body = await req.json();
  const castHash = body?.castHash ? String(body.castHash) : '';
  if (!castHash || !castHash.startsWith('0x') || castHash.length < 10) {
    return NextResponse.json({ error: 'Invalid castHash' }, { status: 400 });
  }

  const updated: Contest = { ...c, castHash };
  await setContest(id, updated);
  return NextResponse.json({ contest: updated });
}
