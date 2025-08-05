// src/lib/api.ts
const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export async function searchMedicines(query: string, page = 1) {
  const url = `${BASE_URL}/api/brandedmedicine/search?q=${encodeURIComponent(
    query
  )}&page=${page}&limit=5`;
  const res = await fetch(url, {
    next: { revalidate: 0 }, // prevents caching if needed
  });
  if (!res.ok) {
    throw new Error(`Failed to fetch medicines: ${res.statusText}`);
  }
  return res.json();
}

