import React, { useState, useEffect, useRef } from 'react';

type City = {
  id: number;
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

  // Click outside handler
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Fetch cities based on query (or all if empty)
  const fetchCities = async (q: string) => {
    setLoading(true);
    try {
      const url =
        q.trim().length === 0
          ? 'http://localhost:8080/api/city/search/count'
          : `http://localhost:8080/api/city/search?query=${encodeURIComponent(q)}`;
      const res = await fetch(url);
      const data: CityResponse = await res.json();
      const sorted = [...data.content].sort((a, b) => b.newsCount - a.newsCount);
      setResults(sorted);
    } catch {
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  // Fetch on query change
  useEffect(() => {
    fetchCities(query);
  }, [query]);

  return (
    <div ref={containerRef} className="relative w-full max-w-md mx-auto">
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onFocus={() => {
          setShowDropdown(true);
          // Fetch all if query empty
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
                key={city.id}
                onClick={() => {
                  onCitySelect({ name: city.name, stateCode: city.stateCode });
                  setQuery('');
                  setShowDropdown(false);
                }}
                className="flex justify-between items-center px-4 py-2 cursor-pointer hover:bg-blue-50 transition-colors"
              >
                <div>
                  <span className="font-medium text-gray-700">{city.name}</span>
                  <span className="text-sm text-gray-500">, {city.stateCode}</span>
                </div>
                <span className="text-xs text-gray-500">{city.newsCount} news</span>
              </li>
            ))
          )}
        </ul>
      )}
    </div>
  );
}
