import Link from 'next/link';

export default function Home() {
  return (
    <main style={{ padding: 24, fontFamily: 'system-ui, -apple-system, Segoe UI, Roboto, Arial' }}>
      <h1>Farcaster Contest Host (MVP)</h1>
      <p>
        Create a contest, ask people to reply to your cast, then show a leaderboard.
      </p>
      <ul>
        <li>
          <Link href="/create">Create contest</Link>
        </li>
      </ul>
    </main>
  );
}
