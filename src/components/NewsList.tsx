import React, { useEffect, useState } from 'react';

interface NewsItem {
  id?: string;
  title: string;
  content: string;
}

interface NewsListProps {
  cityName: string;
  stateCode: string;
  isGlobal: boolean;
}

export default function NewsList({ cityName, stateCode, isGlobal }: NewsListProps) {
  const [news, setNews] = useState<NewsItem[]>([]);

  // Base URL from env or default to local dev
const BASE_URL = 'http://application-backend-env.eba-32dddvei.eu-central-1.elasticbeanstalk.com';

  useEffect(() => {
    async function fetchNews() {
      try {
        const url = isGlobal
          ? `${BASE_URL}/api/news/global`
          : `${BASE_URL}/api/news?cityName=${encodeURIComponent(
              cityName
            )}&stateName=${encodeURIComponent(stateCode)}`;

        const response = await fetch(url);
        const data = await response.json();

        if (data && Array.isArray(data.content)) {
          setNews(data.content);
        } else if (Array.isArray(data)) {
          setNews(data);
        } else {
          setNews([]);
        }
      } catch (error) {
        console.error('Failed to fetch news:', error);
        setNews([]);
      }
    }

    fetchNews();
  }, [cityName, stateCode, isGlobal, BASE_URL]);

  return (
    <div>
      {news.length === 0 ? (
        <div className="text-center text-gray-500 mt-4 p-4 border rounded">
          No news available for this location.
        </div>
      ) : (
        <ul className="space-y-3">
          {news.map((item, index) => (
            <li key={item.id ?? index} className="border p-3 rounded shadow">
              <h3 className="font-bold text-lg">{item.title}</h3>
              <p className="text-sm text-gray-600">{item.content}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
