import React, { useEffect, useState } from 'react';

interface NewsItem {
  id: string;
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

  useEffect(() => {
    async function fetchNews() {
      try {
        let url = isGlobal
          ? 'http://localhost:8080/api/news/global'
          : `http://localhost:8080/api/news?cityName=${encodeURIComponent(
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
  }, [cityName, stateCode, isGlobal]);

  return (
    <ul className="space-y-3">
      {news.map((item) => (
        <li key={item.id} className="border p-3 rounded shadow">
          <h3 className="font-bold text-lg">{item.title}</h3>
          <p className="text-sm text-gray-600">{item.content}</p>
        </li>
      ))}
    </ul>
  );
}
