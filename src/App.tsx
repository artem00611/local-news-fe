import React, { useState } from 'react';
import CitySearch from './components/CitySearch';
import NewsList from './components/NewsList';
import NewsModal from './components/NewsModal';
import NewsForm from './components/NewsForm';

type City = { name: string; stateCode: string };

export default function App() {
  const [selectedCity, setSelectedCity] = useState<City | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const [showModal, setShowModal] = useState(false);

  const handleCitySelect = (city: City) => {
    setSelectedCity(city);
    setRefreshKey((prev) => prev + 1);
  };

  const handleNewsSubmitted = () => {
    setRefreshKey((prev) => prev + 1);
    setShowModal(false);
  };

  /** Helper: decide what the section heading should say */
  const sectionTitle = (() => {
    if (!selectedCity) return 'Global News';                       // no city selected
    if (selectedCity.stateCode === 'GL') return 'Global News';     // “Global” pseudo‑city
    return `Local News in ${selectedCity.name}, ${selectedCity.stateCode}`;
  })();

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <header className="w-full">
        <h1 className="text-4xl font-bold text-center">Local News App</h1>
      </header>

      <CitySearch onCitySelect={handleCitySelect} />

      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">{sectionTitle}</h2>
        <button
          onClick={() => setShowModal(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          + Submit News
        </button>
      </div>

      <NewsList
        key={refreshKey}
        isGlobal={!selectedCity || selectedCity.stateCode === 'GL'}
        cityName={selectedCity?.name || ''}
        stateCode={selectedCity?.stateCode || ''}
      />

      {showModal && (
        <NewsModal onClose={() => setShowModal(false)}>
          <h3 className="text-lg font-bold mb-4">Submit News</h3>
          <NewsForm onSubmitSuccess={handleNewsSubmitted} />
        </NewsModal>
      )}
    </div>
  );
}
