// app/pharma-company/dashboard/page.tsx
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Building2, Package, Users, ClipboardList } from "lucide-react";

export default function PharmaCompanyDashboard() {
  const [loading, setLoading] = useState(true);
  interface PharmaCompany {
    _id: string;
    companyName: string;
    gstNumber: string;
    address: string;
    contactEmail: string;
    contactPhone: string;
  }

  const [company, setCompany] = useState<PharmaCompany | null>(null);

  useEffect(() => {
    const fetchCompany = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/pharmacompany/get_pharma_company`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            },
          }
        );

        const data = await res.json();
        if (res.ok && data.data) {
          setCompany(data.data); // ✅ store company details
        } else {
          setCompany(null); // No company found
        }
      } catch (err) {
        setCompany(null);
      } finally {
        setLoading(false);
      }
    };

    fetchCompany();
  }, []);

  if (loading) {
    return (
      <div className="p-6 text-center text-gray-600">Loading dashboard...</div>
    );
  }

  const menuItems = [
    {
      title: company ? "Update Company" : "Create Company",
      description: company
        ? "Update your pharma company details"
        : "Register your pharma company details",
      href: company ? "/pharma-company/update" : "/pharma-company/create",
      icon: <Building2 className="w-6 h-6 text-blue-600" />,
    },
    {
      title: "Manage Branches",
      description: "Create and view your branches",
      href: "/pharma-company/branches",
      icon: <Package className="w-6 h-6 text-green-600" />,
    },
    {
      title: "Manage Branch Users",
      description: "Create and assign branch logins",
      href: "/pharma-company/branch-users",
      icon: <Users className="w-6 h-6 text-purple-600" />,
    },
    {
      title: "View Orders",
      description: "See and manage medicine orders from medical stores",
      href: "/pharma-company/orders",
      icon: <ClipboardList className="w-6 h-6 text-orange-600" />,
    },
  ];

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-blue-700 mb-6">
        Pharma Company Dashboard
      </h1>

      {company && (
        <div className="mb-6 p-4 border rounded-xl bg-gray-50">
          <h2 className="text-lg font-semibold text-gray-700">
            Company: {company.companyName}
          </h2>
          <p className="text-sm text-gray-600">
            GST: {company.gstNumber} | Email: {company.contactEmail}
          </p>
        </div>
      )}

      <div className="grid gap-6 md:grid-cols-2">
        {menuItems.map((item) => (
          <div
            key={item.href}
            className="p-4 border border-gray-200 rounded-2xl hover:shadow-lg transition"
          >
            <div className="flex items-center gap-3 mb-2">
              {item.icon}
              <h2 className="text-xl font-semibold">{item.title}</h2>
            </div>
            <p className="text-gray-600 text-sm mb-3">{item.description}</p>
            <Link
              href={item.href}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              Go
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
