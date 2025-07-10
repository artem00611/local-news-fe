import React, { useState } from 'react';

interface NewsFormProps {
  onSubmitSuccess: () => void;
}

export default function NewsForm({ onSubmitSuccess }: NewsFormProps) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:8080/api/news', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, content }),
      });

      if (response.ok) {
        setTitle('');
        setContent('');
        setError('');
        onSubmitSuccess(); // Close modal + trigger refresh
      } else {
        setError('Failed to submit news');
      }
    } catch {
      setError('Error submitting news');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input
        type="text"
        placeholder="Title"
        className="w-full border px-3 py-2 rounded"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
      />
      <textarea
        placeholder="Content"
        rows={4}
        className="w-full border px-3 py-2 rounded"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        required
      />
      <button
        type="submit"
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Submit
      </button>
      {error && <p className="text-red-500 text-sm">{error}</p>}
    </form>
  );
}
