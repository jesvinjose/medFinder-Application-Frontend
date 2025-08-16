"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import toast from "react-hot-toast";

interface BranchUser {
  _id: string;
  name: string;
  email: string;
  role: string;
  branchId?: {
    _id: string;
    branchName: string;
    city?: string;
    pincode?: string;
  };
}

export default function BranchUsersPage() {
  const [users, setUsers] = useState<BranchUser[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBranchUsers = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/pharmacompany/list_branch_users`,
          {
            method: "POST", // since you use POST in your backend
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await res.json();
        if (res.ok) {
          setUsers(data.users || []);
        } else {
          alert(data.message || "Failed to fetch branch users");
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

    fetchBranchUsers();
  }, []);

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-blue-700">Branch Users</h1>
        <Link
          href="/pharma-company/branch-users/create"
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          ➕ Add Branch User
        </Link>
      </div>

      {loading ? (
        <p>Loading branch users...</p>
      ) : users.length === 0 ? (
        <p className="text-gray-600">No branch users found. Please add one.</p>
      ) : (
        <div className="grid gap-4">
          {users.map((user) => (
            <div
              key={user._id}
              className="border p-4 rounded-lg shadow-sm hover:shadow-md transition"
            >
              <h2 className="text-lg font-semibold">{user.name}</h2>
              <p className="text-gray-600">📧 {user.email}</p>
              <p className="text-sm text-gray-500">Role: {user.role}</p>
              {user.branchId && (
                <p className="text-sm text-gray-500">
                  🏬 {user.branchId.branchName} ({user.branchId.city} -{" "}
                  {user.branchId.pincode})
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
