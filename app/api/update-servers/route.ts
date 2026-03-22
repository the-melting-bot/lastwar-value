import { NextResponse } from 'next/server';
import { Server } from '@/lib/types';
import fs from 'fs';
import path from 'path';

export async function GET() {
  try {
    // Fetch latest server data from cpt-hedge.com
    const res = await fetch('https://cpt-hedge.com/servers', {
      headers: { 'User-Agent': 'LastWarValue/1.0' },
    });

    if (!res.ok) {
      return NextResponse.json(
        { error: 'Failed to fetch server data', status: res.status },
        { status: 502 }
      );
    }

    const html = await res.text();

    // Look for server data embedded in Next.js bundle
    // The data is typically in a __NEXT_DATA__ script tag or inline JS
    const jsonMatch = html.match(
      /\[{"id":\d+.*?"merged":\s*(true|false).*?\}(?:,\s*\{.*?\})*\]/
    );

    let newServers: Server[] = [];
    if (jsonMatch) {
      try {
        newServers = JSON.parse(jsonMatch[0]);
      } catch {
        return NextResponse.json(
          { error: 'Failed to parse server data from HTML' },
          { status: 500 }
        );
      }
    } else {
      return NextResponse.json(
        { error: 'Could not find server data in response' },
        { status: 404 }
      );
    }

    // Read existing servers.json for comparison
    const filePath = path.join(process.cwd(), 'public', 'data', 'servers.json');
    let existingServers: Server[] = [];
    try {
      const fileContent = fs.readFileSync(filePath, 'utf-8');
      existingServers = JSON.parse(fileContent);
    } catch {
      // File doesn't exist or can't be read
    }

    const existingIds = new Set(existingServers.map((s) => s.id));
    const newServerIds = newServers
      .filter((s) => !existingIds.has(s.id))
      .map((s) => s.id);

    return NextResponse.json({
      message: 'Server data check complete',
      totalFetched: newServers.length,
      totalExisting: existingServers.length,
      newServers: newServerIds.length,
      newServerIds: newServerIds.slice(0, 50),
      note: 'Static servers.json is the primary data source. Redeploy to update.',
    });
  } catch (error) {
    return NextResponse.json(
      {
        error: 'Internal error',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
