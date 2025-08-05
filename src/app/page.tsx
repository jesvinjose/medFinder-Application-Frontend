"use client";

import { useState } from "react";
import { searchMedicines } from "@/lib/api";

type GenericMedicine = {
  _id: string;
  name: string;
  group_name: string;
  mrp: number;
  source: string;
};

type BrandedMedicine = {
  _id: string;
  name: string;
  company: string;
  mrp: number;
};

type SearchResult = {
  generic: GenericMedicine;
  branded_medicines: BrandedMedicine[];
  total: number;
  page: number;
  pages: number;
};

export default function HomePage() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);

  const handleSearch = async (newPage = 1) => {
    setLoading(true);
    setError("");
    try {
      const data = await searchMedicines(query, newPage);
      setResults(data.data);
      setPage(newPage);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Something went wrong");
      }
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (newPage: number) => {
    if (
      results &&
      typeof results.pages === "number" &&
      newPage !== page &&
      newPage >= 1 &&
      newPage <= results.pages
    ) {
      handleSearch(newPage);
    }
  };

  return (
    <main className="max-w-3xl mx-auto p-6">
      <h1 className="text-4xl font-bold mb-6 text-center text-blue-700">
        💊 Generic Medicine Finder
      </h1>
      <div className="flex gap-2 mb-6">
        <input
          className="flex-1 border border-gray-300 rounded px-4 py-2"
          placeholder="Enter medicine name..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button
          onClick={() => handleSearch(1)}
          className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
        >
          Search
        </button>
      </div>

      {loading && <p>Loading...</p>}
      {error && <p className="text-red-600">{error}</p>}

      {results && (
        <>
          {/* Generic Info Block */}
          <div className="bg-white rounded shadow p-4 mb-6">
            <h2 className="text-xl font-bold text-green-700">
              Medicine: {results.generic.name}
            </h2>
            <p className="text-gray-600">{results.generic.group_name}</p>
            <p className="text-gray-600">MRP: {results.generic.mrp} Rs.</p>
            <p className="text-gray-600">Source: {results.generic.source} </p>
          </div>

          {/* Branded Medicines */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {results.branded_medicines.map((medicine) => (
              <div key={medicine._id} className="bg-white p-4 rounded shadow">
                <h3 className="text-lg font-semibold text-blue-700">
                  {medicine.name}
                </h3>
                <p className="text-gray-700">Company: {medicine.company}</p>
                <p className="text-gray-600">MRP: ₹{medicine.mrp}</p>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {results.pages >= 1 && (
            <div className="mt-6 flex justify-center gap-2">
              {Array.from({ length: results.pages }, (_, i) => (
                <button
                  key={i}
                  onClick={() => handlePageChange(i + 1)}
                  className={`px-4 py-2 rounded ${
                    results.page === i + 1
                      ? "bg-blue-500 text-white"
                      : "bg-gray-200"
                  }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
          )}
        </>
      )}
    </main>
  );
}
