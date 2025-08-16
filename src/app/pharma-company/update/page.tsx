// app/pharma-company/update/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function UpdatePharmaCompanyPage() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    companyName: "",
    gstNumber: "",
    contactEmail: "",
    contactPhone: "",
    address: "",
  });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // 🔹 Fetch existing company details
  useEffect(() => {
    const fetchCompany = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/pharmacompany/get_pharma_company`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await res.json();
        if (res.ok && data.data) {
          setFormData({
            companyName: data.data.companyName || "",
            gstNumber: data.data.gstNumber || "",
            contactEmail: data.data.contactEmail || "",
            contactPhone: data.data.contactPhone || "",
            address: data.data.address || "",
          });
        } else {
          alert(data.message || "No company found. Please create one first.");
          router.push("/pharma-company/create");
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

    fetchCompany();
  }, [router]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // 🔹 Submit updated data
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const token = localStorage.getItem("accessToken");
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/pharmacompany/update_pharma_company`,
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
      if (!res.ok) throw new Error(data.message || "Failed to update company");

      alert("Pharma company updated successfully!");
      router.push("/pharma-company/dashboard");
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("Something went wrong");
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div className="text-center p-6">Loading company details...</div>;
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold text-blue-700 mb-4">
        Update Pharma Company
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
          disabled={submitting}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 disabled:bg-gray-400"
        >
          {submitting ? "Updating..." : "Update Company"}
        </button>
      </form>
    </div>
  );
}
