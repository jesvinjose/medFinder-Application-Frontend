"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import toast from "react-hot-toast";

interface InventoryItem {
  _id: string;
  quantity: number;
  priceToRetailer: number;
  mrp: number;
  lastUpdated: string;
  medicine: {
    _id: string;
    name: string;
    company: string;
  };
  branches: {
    _id: string;
    branchName: string;
    city: string;
  }[];
}

interface Pagination {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export default function CompanyInventoryPage() {
  const [inventories, setInventories] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [pagination, setPagination] = useState<Pagination | null>(null);

  // ✅ Memoized fetch function (Fix 1)
  const fetchInventory = useCallback(
    async (page = 1) => {
      setLoading(true);
      try {
        const token = localStorage.getItem("accessToken");
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/branchinventory/list_inventory`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ page, limit: 10, search }),
          }
        );

        const data = await res.json();
        if (res.ok) {
          setInventories(data.data || []);
          setPagination(data.pagination || null);
        } else {
          toast.error(data.message || "Failed to fetch inventory");
        }
      } catch (error) {
        toast.error(
          error instanceof Error ? error.message : "Something went wrong"
        );
      } finally {
        setLoading(false);
      }
    },
    [search] // 👈 dependency
  );

  // ✅ useEffect depends on memoized fetchInventory
  useEffect(() => {
    fetchInventory(1);
  }, [fetchInventory]);

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-blue-700">Company Inventory</h1>
        <Link
          href="/pharma-company/inventory/add"
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          ➕ Add Inventory
        </Link>
      </div>

      {/* Search Bar */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search by medicine or branch..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full md:w-1/2 px-3 py-2 border rounded-lg"
        />
      </div>

      {loading ? (
        <p>Loading inventory...</p>
      ) : inventories.length === 0 ? (
        <p className="text-gray-600">No inventory found.</p>
      ) : (
        <div className="grid gap-4">
          {inventories.map((inv) => (
            <div
              key={inv._id}
              className="border relative p-4 rounded-lg shadow-sm hover:shadow-md transition"
            >
              <h2 className="text-lg font-semibold">
                {inv.medicine.name} ({inv.medicine.company})
              </h2>
              <p className="text-gray-600">
                💊 Quantity: {inv.quantity} | 💰 MRP: ₹{inv.mrp} | Retailer
                Price: ₹{inv.priceToRetailer}
              </p>
              <p className="text-sm text-gray-500">
                Last Updated: {new Date(inv.lastUpdated).toLocaleDateString()}
              </p>
              <p className="text-sm text-gray-500">
                📍 Branches:{" "}
                {inv.branches
                  .map((b) => `${b.branchName} (${b.city})`)
                  .join(", ")}
              </p>
              <Link
                 href={`/pharma-company/inventory/update/${inv._id}`}
                className="px-3 py-1 absolute bottom-1 right-1 bg-green-600 text-white rounded-lg hover:bg-green-700 ml-2"
              >
                ✏️ Update
              </Link>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {pagination && pagination.totalPages > 1 && (
        <div className="flex justify-center items-center gap-4 mt-6">
          <button
            disabled={pagination.page === 1}
            onClick={() => fetchInventory(pagination.page - 1)}
            className="px-4 py-2 bg-gray-200 rounded-lg disabled:opacity-50"
          >
            Prev
          </button>
          <span>
            Page {pagination.page} of {pagination.totalPages}
          </span>
          <button
            disabled={pagination.page === pagination.totalPages}
            onClick={() => fetchInventory(pagination.page + 1)}
            className="px-4 py-2 bg-gray-200 rounded-lg disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
