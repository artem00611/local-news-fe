import React, { useEffect, useState } from "react";

interface NewsItem {
  id?: string;
  title: string;
  content: string;
}

interface NewsResponse {
  content: NewsItem[];
  totalPages: number;
  number: number; // current page index (0‑based)
}

interface NewsListProps {
  cityName: string;
  stateCode: string;
  isGlobal: boolean;
}

export default function NewsList({ cityName, stateCode, isGlobal }: NewsListProps) {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [page, setPage] = useState(0); // 0‑based page index
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);

  const BASE_URL =
    "http://application-backend-env.eba-32dddvei.eu-central-1.elasticbeanstalk.com";

  async function fetchNews(currentPage: number) {
    setLoading(true);
    try {
      const url = isGlobal
        ? `${BASE_URL}/api/news/global?page=${currentPage}&size=5&sort=id,desc`
        : `${BASE_URL}/api/news?cityName=${encodeURIComponent(
            cityName
          )}&stateName=${encodeURIComponent(stateCode)}&page=${currentPage}&size=5&sort=id,desc`;

      const response = await fetch(url);
      const data: NewsResponse | NewsItem[] = await response.json();

      if (Array.isArray(data)) {
        // Fallback in case backend returns a plain array
        setNews(data);
        setTotalPages(1);
      } else {
        setNews(data.content);
        setTotalPages(data.totalPages);
      }
    } catch (e) {
      console.error("Failed to fetch news", e);
      setNews([]);
    } finally {
      setLoading(false);
    }
  }

  // refetch when props or page change
  useEffect(() => {
    setPage(0); // reset page when context changes
  }, [cityName, stateCode, isGlobal]);

  useEffect(() => {
    fetchNews(page);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, cityName, stateCode, isGlobal]);

  const goToPage = (p: number) => {
    if (p >= 0 && p < totalPages && p !== page) {
      setPage(p);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <div className="flex flex-col gap-4">
      {/* News list */}
      {loading ? (
        <div className="flex justify-center items-center py-10">
          <span className="loading loading-spinner loading-lg" />
        </div>
      ) : news.length === 0 ? (
        <div className="text-center text-gray-500 mt-4 p-4 border rounded">
          No news available for this location.
        </div>
      ) : (
        <ul className="space-y-3">
          {news.map((item, idx) => (
            <li
              key={item.id ?? idx}
              className="border p-4 rounded-xl shadow-sm hover:shadow transition-all">
              <h3 className="font-semibold text-xl mb-1">{item.title}</h3>
              <p className="text-gray-600 text-sm leading-relaxed whitespace-pre-wrap">
                {item.content}
              </p>
            </li>
          ))}
        </ul>
      )}

      {/* Pagination controls */}
      {totalPages > 1 && (
        <nav className="flex justify-center pt-4" aria-label="Pagination">
          <ul className="inline-flex items-center gap-1">
            <li>
              <button
                onClick={() => goToPage(page - 1)}
                disabled={page === 0}
                className="px-3 py-2 rounded-l-lg border bg-white disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:bg-gray-100">
                &laquo;
              </button>
            </li>
            {Array.from({ length: totalPages }).map((_, i) => (
              <li key={i}>
                <button
                  onClick={() => goToPage(i)}
                  className={
                    "px-3 py-2 border shadow-sm " +
                    (i === page
                      ? "bg-blue-600 text-white font-semibold"
                      : "bg-white hover:bg-gray-100")
                  }>
                  {i + 1}
                </button>
              </li>
            ))}
            <li>
              <button
                onClick={() => goToPage(page + 1)}
                disabled={page === totalPages - 1}
                className="px-3 py-2 rounded-r-lg border bg-white disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:bg-gray-100">
                &raquo;
              </button>
            </li>
          </ul>
        </nav>
      )}
    </div>
  );
}
