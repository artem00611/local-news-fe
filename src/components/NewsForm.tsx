import React, { useState } from 'react';

interface NewsFormProps {
  onSubmitSuccess: () => void;
}

export default function NewsForm({ onSubmitSuccess }: NewsFormProps) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Pick the base URL from env or default to localhost
  const BASE_URL = 'http://application-backend-env.eba-32dddvei.eu-central-1.elasticbeanstalk.com';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setLoading(true);
    setError('');

    try {
      const response = await fetch(`${BASE_URL}/api/news`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, content }),
      });

      if (response.ok) {
        setTitle('');
        setContent('');
        onSubmitSuccess(); // close modal + refresh list
      } else {
        setError('Failed to submit news');
      }
    } catch {
      setError('Error submitting news');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>
        {`
          .spinner {
            display: inline-block;
            width: 16px;
            height: 16px;
            border: 2px solid rgba(255, 255, 255, 0.6);
            border-top-color: white;
            border-radius: 50%;
            animation: spin 1s linear infinite;
            margin-left: 8px;
            vertical-align: middle;
          }

          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        `}
      </style>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Title"
          className="w-full border px-3 py-2 rounded"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          disabled={loading}
        />
        <textarea
          placeholder="Content"
          rows={4}
          className="w-full border px-3 py-2 rounded"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
          disabled={loading}
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50 flex items-center justify-center"
          disabled={loading}
        >
          Submit
          {loading && <span className="spinner" />}
        </button>
        {error && <p className="text-red-500 text-sm">{error}</p>}
      </form>
    </>
  );
}
