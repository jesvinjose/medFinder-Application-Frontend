"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("user");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/auth/login`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, role, password }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Login failed");
      }

      localStorage.setItem("accessToken", data.data.accessToken);
      localStorage.setItem("refreshToken", data.data.refreshToken);

      toast.success("Login successful!");

      // Redirect to role-specific dashboard
      const user = JSON.parse(atob(data.data.accessToken.split(".")[1]));
      switch (user.role) {
        case "medical_store":
          router.push("/medical-store/dashboard");
          break;
        case "doctor":
          router.push("/doctors/dashboard");
          break;
        case "pharma_company":
          router.push("/pharma/dashboard");
          break;
        default:
          router.push("/");
      }
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("An unexpected error occurred");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="max-w-md mx-auto mt-10 bg-white p-8 shadow rounded">
      <h1 className="text-2xl font-bold mb-6 text-center text-blue-600">
        🔐 Login to MedFinder
      </h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="email"
          className="w-full border px-4 py-2 rounded"
          placeholder="Email address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          className="w-full border px-4 py-2 rounded"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <select
          value={role}
          onChange={(e) => setRole(e.target.value)}
          className="w-full border px-4 py-2 rounded"
        >
          <option value="medical_store">Medical Store</option>
          <option value="doctor">Doctor</option>
          <option value="pharma_company">Pharma Company</option>
          <option value="user">User</option>
          <option value="admin">Admin</option>
        </select>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>

      <p className="text-center text-sm mt-4">
        Don’t have an account?{" "}
        <a href="/auth/user" className="text-blue-600 underline">
          Register
        </a>
      </p>
    </main>
  );
}
