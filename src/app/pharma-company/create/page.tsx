"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function CreatePharmaCompanyPage() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    companyName: "",
    gstNumber: "",
    contactEmail: "",
    contactPhone: "",
    address: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem("accessToken");
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/pharmacompany/create_pharma_company`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(formData),
        }
      );

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to create company");

      alert("Pharma company created successfully!");
      router.push("/pharma-company/dashboard");
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

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold text-blue-700 mb-4">
        Create Pharma Company
      </h1>

      <form
        onSubmit={handleSubmit}
        className="space-y-4 bg-white p-6 rounded-xl shadow-md"
      >
        <div>
          <label className="block text-sm font-medium">Company Name</label>
          <input
            type="text"
            name="companyName"
            value={formData.companyName}
            onChange={handleChange}
            required
            className="mt-1 w-full p-2 border rounded-lg"
          />
        </div>

        <div>
          <label className="block text-sm font-medium">GST Number</label>
          <input
            type="text"
            name="gstNumber"
            value={formData.gstNumber}
            onChange={handleChange}
            required
            className="mt-1 w-full p-2 border rounded-lg"
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Contact Email</label>
          <input
            type="email"
            name="contactEmail"
            value={formData.contactEmail}
            onChange={handleChange}
            className="mt-1 w-full p-2 border rounded-lg"
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Contact Phone</label>
          <input
            type="text"
            name="contactPhone"
            value={formData.contactPhone}
            onChange={handleChange}
            className="mt-1 w-full p-2 border rounded-lg"
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Address</label>
          <textarea
            name="address"
            value={formData.address}
            onChange={handleChange}
            rows={3}
            className="mt-1 w-full p-2 border rounded-lg"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 disabled:bg-gray-400"
        >
          {loading ? "Creating..." : "Create Company"}
        </button>
      </form>
    </div>
  );
}
