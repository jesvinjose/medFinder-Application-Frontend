"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import type { LeafletMouseEvent } from "leaflet";
import { useMapEvents } from "react-leaflet";
import toast from "react-hot-toast";

// ✅ Dynamically import components
const MapContainer = dynamic(
  () => import("react-leaflet").then((mod) => mod.MapContainer),
  { ssr: false }
);
const TileLayer = dynamic(
  () => import("react-leaflet").then((mod) => mod.TileLayer),
  { ssr: false }
);
const Marker = dynamic(
  () => import("react-leaflet").then((mod) => mod.Marker),
  { ssr: false }
);

export default function CreateBranchPage() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    branchName: "",
    address: "",
    city: "",
    pincode: "",
    contactPhone: "",
    coordinates: [77.5946, 12.9716] as [number, number], // Default Bengaluru
  });

  const [loading, setLoading] = useState(false);
  const [L, setLeaflet] = useState<typeof import("leaflet") | null>(null);

  useEffect(() => {
    (async () => {
      const leaflet = await import("leaflet"); // import only in browser
      setLeaflet(leaflet);

      // ✅ fix default icon issue
      leaflet.Marker.prototype.options.icon = leaflet.icon({
        iconUrl: "/marker-icon.png",
        shadowUrl: "/marker-shadow.png",
        iconSize: [25, 41],
        iconAnchor: [12, 41],
      });
    })();
  }, []);

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
        `${process.env.NEXT_PUBLIC_API_URL}/api/pharmacompany/create_pharma_branch`,
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
      if (!res.ok) throw new Error(data.message || "Failed to create branch");

      alert("Branch created successfully!");
      router.push("/pharma-company/branches");
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

  // ✅ Component to handle clicks and update coordinates
  function LocationMarker() {
    useMapEvents({
      click(e: LeafletMouseEvent) {
        setFormData((prev) => ({
          ...prev,
          coordinates: [e.latlng.lng, e.latlng.lat],
        }));
      },
    });

    return L ? (
      <Marker
        position={[formData.coordinates[1], formData.coordinates[0]]}
        icon={L.Marker.prototype.options.icon}
      />
    ) : null;
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold text-blue-700 mb-4">Create Branch</h1>

      <form
        onSubmit={handleSubmit}
        className="space-y-4 bg-white p-6 rounded-xl shadow-md"
      >
        {/* Inputs */}
        <div>
          <label className="block text-sm font-medium">Branch Name</label>
          <input
            type="text"
            name="branchName"
            value={formData.branchName}
            onChange={handleChange}
            required
            className="mt-1 w-full p-2 border rounded-lg"
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Address</label>
          <textarea
            name="address"
            value={formData.address}
            onChange={handleChange}
            rows={2}
            required
            className="mt-1 w-full p-2 border rounded-lg"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium">City</label>
            <input
              type="text"
              name="city"
              value={formData.city}
              onChange={handleChange}
              required
              className="mt-1 w-full p-2 border rounded-lg"
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Pincode</label>
            <input
              type="text"
              name="pincode"
              value={formData.pincode}
              onChange={handleChange}
              required
              className="mt-1 w-full p-2 border rounded-lg"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium">Contact Phone</label>
          <input
            type="text"
            name="contactPhone"
            value={formData.contactPhone}
            onChange={handleChange}
            required
            className="mt-1 w-full p-2 border rounded-lg"
          />
        </div>

        {/* Map Picker */}
        <div>
          <label className="block text-sm font-medium mb-2">
            Select Location on Map
          </label>
          <MapContainer
            center={[12.9716, 77.5946]}
            zoom={13}
            style={{ height: "300px", width: "100%" }}
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution="&copy; OpenStreetMap contributors"
            />
            <LocationMarker />
          </MapContainer>
          <p className="mt-2 text-sm text-gray-600">
            Selected: {formData.coordinates[1]}, {formData.coordinates[0]}
          </p>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 disabled:bg-gray-400"
        >
          {loading ? "Creating..." : "Create Branch"}
        </button>
      </form>
    </div>
  );
}
