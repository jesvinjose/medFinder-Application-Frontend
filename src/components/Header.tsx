// src/components/Header.tsx
"use client";
import Link from "next/link";
import { useState } from "react";
import { Menu, X } from "lucide-react"; // Optional: for mobile menu toggle
import { useUser } from "@/context/UserContext";
import { useRouter } from "next/navigation";

const Header = () => {
  const [open, setOpen] = useState(false);
  const { user, logout } = useUser();
  const router = useRouter();
  const navItems = [
    { label: "Home", href: "/" },
    { label: "Search Medicines", href: "/search" },
    { label: "Doctors", href: "/doctors" },
    { label: "Consultation", href: "/consult" },
    { label: "Pharma Companies", href: "/pharma" },
    { label: "Medical Stores", href: "/medical-store/dashboard" },
  ];

  const handleLogout = async () => {
    await logout();
    router.push("/auth/login");
  };

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link href="/" className="text-2xl font-bold text-blue-600">
          💊 MedFinder
        </Link>
        <button className="md:hidden" onClick={() => setOpen(!open)}>
          {open ? <X /> : <Menu />}
        </button>
        <nav
          className={`md:flex items-center gap-6 ${
            open ? "block" : "hidden"
          } md:block`}
        >
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-gray-700 hover:text-blue-600 transition font-medium"
            >
              {item.label}
            </Link>
          ))}

          {!user ? (
            <>
              <Link
                href="/auth/login"
                className="text-gray-700 hover:text-blue-600 font-medium"
              >
                Login
              </Link>
              <Link
                href="/auth/register"
                className="text-gray-700 hover:text-blue-600 font-medium"
              >
                Register
              </Link>
            </>
          ) : (
            <>
              <button
                onClick={handleLogout}
                className="text-red-600 hover:underline text-sm"
              >
                👋 Logout
              </button>
            </>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;
