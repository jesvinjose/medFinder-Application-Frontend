"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import toast from "react-hot-toast";

interface Branch {
  _id: string;
  branchName: string;
  address: string;
  city: string;
  pincode: string;
  contactPhone: string;
}

export default function BranchesPage() {
  const [branches, setBranches] = useState<Branch[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBranches = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/pharmacompany/list_company_branches`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await res.json();
        if (res.ok) {
          setBranches(data.data || []);
        } else {
          alert(data.message || "Failed to fetch branches");
        }
      } catch (error) {
        if (error instanceof Error) {
          toast.error(error.message);
        } else {
          toast.error("Something went wrong");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchBranches();
  }, []);

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-blue-700">My Branches</h1>
        <Link
          href="/pharma-company/branches/create"
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          ➕ Add Branch
        </Link>
      </div>

      {loading ? (
        <p>Loading branches...</p>
      ) : branches.length === 0 ? (
        <p className="text-gray-600">No branches found. Please add one.</p>
      ) : (
        <div className="grid gap-4">
          {branches.map((branch) => (
            <div
              key={branch._id}
              className="border p-4 rounded-lg shadow-sm hover:shadow-md transition"
            >
              <h2 className="text-lg font-semibold">{branch.branchName}</h2>
              <p className="text-gray-600">{branch.address}</p>
              <p className="text-sm text-gray-500">
                {branch.city} - {branch.pincode}
              </p>
              <p className="text-sm text-gray-500">
                📞 {branch.contactPhone}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
