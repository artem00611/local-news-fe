import React, { useState, useEffect, useRef } from 'react';

type City = {
  id?: number;            // API sometimes omits id
  name: string;
  stateCode: string;
  newsCount: number;
};

type CityResponse = {
  content: City[];
};

type CitySearchProps = {
  onCitySelect: (city: { name: string; stateCode: string }) => void;
};

export default function CitySearch({ onCitySelect }: CitySearchProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<City[]>([]);
  const [loading, setLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  /* ───────── close dropdown on outside click ───────── */
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  /* ───────── fetch helper ───────── */
  const fetchCities = async (q: string) => {
    setLoading(true);
    try {
      const url =
        q.trim().length === 0
          ? 'http://localhost:8080/api/city/search/count'
          : `http://localhost:8080/api/city/search?query=${encodeURIComponent(q)}`;

      const res = await fetch(url);
      const data: CityResponse = await res.json();

      /* 1️⃣ de‑duplicate by (stateCode + name) */
      const unique = new Map<string, City>();
      for (const c of data.content) {
        unique.set(`${c.stateCode}-${c.name}`, c);
      }

      /* 2️⃣ make sure we have exactly one “Global” row */
      const alreadyHasGlobal = [...unique.values()].some((c) => c.stateCode === 'GL');
      if (!alreadyHasGlobal) {
        const totalNews = [...unique.values()].reduce((sum, c) => sum + c.newsCount, 0);
        unique.set('GL-Global', { name: 'Global', stateCode: 'GL', newsCount: totalNews });
      }

      /* 3️⃣ sort by newsCount DESC (Global will find its natural place) */
      const sorted = [...unique.values()].sort((a, b) => b.newsCount - a.newsCount);

      setResults(sorted);
    } catch {
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCities(query);
  }, [query]);

  /* ───────── utility: unique React key ───────── */
  const cityKey = (c: City) =>
    c.id !== undefined ? `${c.stateCode}-${c.id}` : `${c.stateCode}-${c.name}`;

  return (
    <div ref={containerRef} className="relative w-full max-w-md mx-auto">
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onFocus={() => {
          setShowDropdown(true);
          if (query.trim().length === 0) fetchCities('');
        }}
        placeholder="Search city..."
        className="w-full px-4 py-2 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      {showDropdown && (
        <ul className="absolute z-10 w-full mt-2 bg-white border border-gray-200 rounded-xl shadow-lg max-h-60 overflow-y-auto">
          {loading ? (
            <li className="px-4 py-3 text-sm text-gray-500 text-center animate-pulse">Loading...</li>
          ) : results.length === 0 ? (
            <li className="px-4 py-3 text-sm text-gray-500 text-center">No results found.</li>
          ) : (
            results.map((city) => (
              <li
                key={cityKey(city)}
                onClick={() => {
                  onCitySelect({ name: city.name, stateCode: city.stateCode });
                  setQuery('');
                  setShowDropdown(false);
                }}
                className="flex justify-between items-center px-4 py-2 cursor-pointer hover:bg-blue-50 transition-colors"
              >
                <span className="font-medium text-gray-700">
                  {city.stateCode === 'GL' ? 'Global News' : `${city.name}, ${city.stateCode}`}
                </span>
                <span className="text-xs text-gray-500 whitespace-nowrap">
                  {city.newsCount} news
                </span>
              </li>
            ))
          )}
        </ul>
      )}
    </div>
  );
}
