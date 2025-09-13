"use client";

import { useEffect, useState, useCallback } from "react";
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

export default function BranchInventoryPage() {
  const [inventories, setInventories] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [pagination, setPagination] = useState<Pagination | null>(null);

  // ✅ Memoized fetch function
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
        toast.error(error instanceof Error ? error.message : "Something went wrong");
      } finally {
        setLoading(false);
      }
    },
    [search]
  );

  useEffect(() => {
    fetchInventory(1);
  }, [fetchInventory]);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-green-700 mb-6">My Branch Inventory</h1>

      {/* Search Bar */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search by medicine..."
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
              className="border p-4 rounded-lg shadow-sm hover:shadow-md transition"
            >
              <h2 className="text-lg font-semibold">
                {inv.medicine.name} ({inv.medicine.company})
              </h2>
              <p className="text-gray-600">
                💊 Quantity: {inv.quantity} | 💰 MRP: ₹{inv.mrp} | Retailer Price: ₹
                {inv.priceToRetailer}
              </p>
              <p className="text-sm text-gray-500">
                Last Updated: {new Date(inv.lastUpdated).toLocaleDateString()}
              </p>
              {/* ✅ Show only the current branch (already filtered by backend) */}
              {inv.branches.length > 0 && (
                <p className="text-sm text-gray-500">
                  📍 Branch: {inv.branches[0].branchName} ({inv.branches[0].city})
                </p>
              )}
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
