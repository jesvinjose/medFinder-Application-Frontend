"use client";

import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

interface Branch {
  _id: string;
  branchName: string;
  city: string;
}

interface Medicine {
  _id: string;
  name: string;
  company: string;
}

export default function AddInventoryPage() {
  const router = useRouter();
  const [branches, setBranches] = useState<Branch[]>([]);
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [form, setForm] = useState({
    brandedMedicineId: "",
    branchIds: [] as string[],
    quantity: 0,
    mrp: 0,
    priceToRetailer: 0,
  });
  const [loading, setLoading] = useState(false);

  // ✅ Fetch branches and medicines
  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("accessToken");

        // ✅ fetch branches (POST)
        const branchRes = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/pharmacompany/list_company_branches`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({}), // empty body works if no filters
          }
        );
        const branchData = await branchRes.json();
        
        if (branchRes.ok) {
          setBranches(branchData.data || []);
        }

        // fetch branded medicines
        const medRes = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/brandedmedicine`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const medData = await medRes.json();
        if (medRes.ok) {
          setMedicines(medData.data || []);
        }
      } catch (err) {
        // toast.error("Failed to fetch branches/medicines");
        if (err instanceof Error) {
        toast.error(err.message);
      } else {
        toast.error("Something went wrong");
      }
      }
    };

    fetchData();
  }, []);

  // ✅ Handle input changes
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]:
        name === "quantity" || name === "mrp" || name === "priceToRetailer"
          ? Number(value)
          : value,
    }));
  };

  // ✅ Handle branch checkbox toggle
  const handleBranchToggle = (branchId: string) => {
    setForm((prev) => {
      const alreadySelected = prev.branchIds.includes(branchId);
      return {
        ...prev,
        branchIds: alreadySelected
          ? prev.branchIds.filter((id) => id !== branchId) // remove
          : [...prev.branchIds, branchId], // add
      };
    });
  };

  // ✅ Submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const token = localStorage.getItem("accessToken");
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/branchinventory/add_shared_inventory`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(form),
        }
      );

      const data = await res.json();
      if (res.ok) {
        toast.success("Inventory added/updated successfully");
        router.push("/pharma-company/inventory");
      } else {
        toast.error(data.message || "Failed to save inventory");
      }
    } catch (err) {
      // toast.error("Something went wrong");
      if (err instanceof Error) {
        toast.error(err.message);
      } else {
        toast.error("Something went wrong");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold text-blue-700 mb-6">
        ➕ Add Inventory
      </h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Medicine select */}
        <div>
          <label className="block font-medium mb-1">Medicine</label>
          <select
            name="brandedMedicineId"
            value={form.brandedMedicineId}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border rounded-lg"
          >
            <option value="">-- Select Medicine --</option>
            {medicines.map((med) => (
              <option key={med._id} value={med._id}>
                {med.name} ({med.company})
              </option>
            ))}
          </select>
        </div>

        {/* Branch checkboxes */}
        <div>
          <label className="block font-medium mb-1">Branches</label>
          <div className="space-y-2">
            {branches.map((b) => (
              <label
                key={b._id}
                className="flex items-center space-x-2 border p-2 rounded-lg"
              >
                <input
                  type="checkbox"
                  value={b._id}
                  checked={form.branchIds.includes(b._id)}
                  onChange={() => handleBranchToggle(b._id)}
                />
                <span>
                  {b.branchName} ({b.city})
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Quantity */}
        <div>
          <label className="block font-medium mb-1">Quantity</label>
          <input
            type="number"
            name="quantity"
            value={form.quantity}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-lg"
            required
            min={0}
          />
        </div>

        {/* MRP */}
        <div>
          <label className="block font-medium mb-1">MRP</label>
          <input
            type="number"
            name="mrp"
            value={form.mrp}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-lg"
            required
            min={0}
          />
        </div>

        {/* Price to Retailer */}
        <div>
          <label className="block font-medium mb-1">Price to Retailer</label>
          <input
            type="number"
            name="priceToRetailer"
            value={form.priceToRetailer}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-lg"
            required
            min={0}
          />
        </div>

        {/* Submit button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? "Saving..." : "Save Inventory"}
        </button>
      </form>
    </div>
  );
}
