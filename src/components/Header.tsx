"use client";
import Link from "next/link";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { useUser } from "@/context/UserContext";
import { useRouter } from "next/navigation";

const Header = () => {
  const [open, setOpen] = useState(false);
  const { user, logout } = useUser();
  const router = useRouter();

  const navItems = [
    { label: "Doctors", href: "/doctors/dashboard" },
    { label: "Consultation", href: "/consult" },
    { label: "Pharma Company", href: "/pharma-company/dashboard" },
    { label: "Pharma Branch", href: "/pharma-branch/dashboard" },
    { label: "Delivery Partner", href: "/delivery-partner/dashboard" },
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

        {/* Mobile toggle button */}
        <button
          className="md:hidden text-gray-700"
          onClick={() => setOpen(!open)}
        >
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-6">
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
                href="/auth/user"
                className="text-gray-700 hover:text-blue-600 font-medium"
              >
                Register
              </Link>
            </>
          ) : (
            <button
              onClick={handleLogout}
              className="text-red-600 hover:underline text-sm"
            >
              👋 Logout
            </button>
          )}
        </nav>
      </div>

      {/* Mobile dropdown menu */}
      {open && (
        <div className="md:hidden bg-white border-t shadow-lg px-4 py-3 space-y-3">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="block text-gray-700 hover:text-blue-600 font-medium"
              onClick={() => setOpen(false)} // close menu after click
            >
              {item.label}
            </Link>
          ))}

          {!user ? (
            <>
              <Link
                href="/auth/login"
                className="block text-gray-700 hover:text-blue-600 font-medium"
                onClick={() => setOpen(false)}
              >
                Login
              </Link>
              <Link
                href="/auth/user"
                className="block text-gray-700 hover:text-blue-600 font-medium"
                onClick={() => setOpen(false)}
              >
                Register
              </Link>
            </>
          ) : (
            <button
              onClick={async () => {
                await handleLogout();
                setOpen(false);
              }}
              className="block text-red-600 hover:underline text-sm"
            >
              👋 Logout
            </button>
          )}
        </div>
      )}
    </header>
  );
};

export default Header;
