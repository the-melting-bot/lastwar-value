'use client';

import { useState, useEffect, useRef } from 'react';
import { Server, ServerInfo } from '@/lib/types';
import { loadServers, getServerInfo, formatRegions, formatDate } from '@/lib/servers';

interface ServerSearchProps {
  selectedServerId: number | null;
  onSelect: (info: ServerInfo) => void;
}

export default function ServerSearch({ selectedServerId, onSelect }: ServerSearchProps) {
  const [servers, setServers] = useState<Server[]>([]);
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [selectedInfo, setSelectedInfo] = useState<ServerInfo | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadServers().then(setServers);
  }, []);

  useEffect(() => {
    if (selectedServerId && servers.length > 0) {
      const server = servers.find((s) => s.id === selectedServerId);
      if (server) {
        const info = getServerInfo(server);
        if (info) {
          setSelectedInfo(info);
          setQuery(`Server #${server.id}`);
        }
      }
    }
  }, [selectedServerId, servers]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filtered = servers
    .filter((s) => !s.merged && s.createdAt)
    .filter((s) => {
      if (!query) return true;
      return s.id.toString().includes(query.replace(/[^0-9]/g, ''));
    })
    .slice(0, 50);

  function handleSelect(server: Server) {
    const info = getServerInfo(server);
    if (info) {
      setSelectedInfo(info);
      setQuery(`Server #${server.id}`);
      onSelect(info);
      setIsOpen(false);
    }
  }

  return (
    <div ref={dropdownRef} className="relative">
      <label className="block text-sm font-medium text-gray-300 mb-1">
        Server Number
      </label>
      <input
        type="text"
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          setIsOpen(true);
        }}
        onFocus={() => setIsOpen(true)}
        placeholder="Search server number..."
        className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
      />

      {isOpen && filtered.length > 0 && (
        <div className="absolute z-50 w-full mt-1 bg-gray-800 border border-gray-600 rounded-lg shadow-xl max-h-60 overflow-y-auto">
          {filtered.map((server) => (
            <button
              key={server.id}
              type="button"
              onClick={() => handleSelect(server)}
              className="w-full px-4 py-2 text-left text-sm text-gray-200 hover:bg-gray-700 hover:text-orange-400 transition-colors"
            >
              Server #{server.id}{' '}
              <span className="text-gray-500">— {server.createdAt}</span>
            </button>
          ))}
        </div>
      )}

      {selectedInfo && (
        <div className="mt-3 p-3 bg-gray-800/50 border border-gray-700 rounded-lg text-sm">
          <span className="text-green-400">✓</span>{' '}
          <span className="text-white font-medium">
            Server #{selectedInfo.id}
          </span>{' '}
          — Created {formatDate(selectedInfo.createdAt)} — Day{' '}
          {selectedInfo.day} — Season {selectedInfo.season}{' '}
          {selectedInfo.regions.length > 0 && (
            <span>— {formatRegions(selectedInfo.regions)}</span>
          )}
        </div>
      )}
    </div>
  );
}
