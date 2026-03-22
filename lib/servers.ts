import { Server, ServerInfo, REGION_FLAGS } from './types';

let cachedServers: Server[] | null = null;

export async function loadServers(): Promise<Server[]> {
  if (cachedServers) return cachedServers;
  const res = await fetch('/data/servers.json');
  cachedServers = (await res.json()) as Server[];
  return cachedServers;
}

export function calculateServerDay(createdAt: string): number {
  const created = new Date(createdAt);
  const now = new Date();
  const diffMs = now.getTime() - created.getTime();
  return Math.floor(diffMs / (1000 * 60 * 60 * 24));
}

export function calculateSeason(day: number): number {
  if (day <= 120) return 1;
  if (day <= 270) return 2;
  if (day <= 450) return 3;
  if (day <= 650) return 4;
  return 5;
}

export function getServerInfo(server: Server): ServerInfo | null {
  if (server.merged || !server.createdAt) return null;
  const day = calculateServerDay(server.createdAt);
  const season = calculateSeason(day);
  return {
    id: server.id,
    createdAt: server.createdAt,
    day,
    season,
    regions: server.regions || [],
    merged: server.merged,
  };
}

export function formatRegions(regions: string[]): string {
  return regions.map((r) => REGION_FLAGS[r] || r).join(' ');
}

export function formatDate(dateStr: string): string {
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}
