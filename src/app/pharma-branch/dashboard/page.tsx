"use client";

import Link from "next/link";
import { Package, ClipboardList } from "lucide-react";

export default function PharmaBranchDashboard() {
  const menuItems = [
    {
      title: "View Inventory",
      description: "See your allocated branch inventory",
      href: "/pharma-branch/inventory",
      icon: <Package className="w-6 h-6 text-green-600" />,
    },
    {
      title: "View Orders",
      description: "Manage and track orders placed by your branch",
      href: "/pharma-branch/orders",
      icon: <ClipboardList className="w-6 h-6 text-orange-600" />,
    },
  ];

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-blue-700 mb-6">
        Pharma Branch Dashboard
      </h1>

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
