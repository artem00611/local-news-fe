// src/components/NewsPage.tsx (or App.tsx)
import React, { useState } from 'react';
import CitySearch from './CitySearch';
import NewsList from './NewsList';
import NewsForm from './NewsForm';
import NewsModal from './NewsModal';

type City = { name: string; stateCode: string };

export default function NewsPage() {
  const [selectedCity, setSelectedCity] = useState<City | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const [showModal, setShowModal] = useState(false);

  const handleCitySelect = (city: City) => {
    setSelectedCity(city);
    setRefreshKey((prev) => prev + 1);
  };

  const handleNewsSubmitted = () => {
    setRefreshKey((prev) => prev + 1);
    setShowModal(false);   // close the modal
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <CitySearch onCitySelect={handleCitySelect} />

      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">
          {selectedCity
            ? `Local News in ${selectedCity.name}, ${selectedCity.stateCode}`
            : 'Global News'}
        </h2>
        <button
          onClick={() => setShowModal(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          + Submit News
        </button>
      </div>

      <NewsList
        key={refreshKey}
        isGlobal={!selectedCity}
        cityName={selectedCity?.name || ''}
        stateCode={selectedCity?.stateCode || ''}
      />

      {showModal && (
        <NewsModal onClose={() => setShowModal(false)}>
          {/* put the form inside the modal */}
          <div className="mb-4 text-lg font-bold">Submit News</div>
          <NewsForm onSubmitSuccess={handleNewsSubmitted} />
        </NewsModal>
      )}
    </div>
  );
}
