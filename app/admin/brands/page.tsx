"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, UploadCloud, Trash2, Loader2, Save } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import Image from "next/image";

export default function ManageBrandsPage() {
  const [brands, setBrands] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Form State
  const [name, setName] = useState("");
  const [logo, setLogo] = useState("");
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);

  // 1. Fetch Brands
  const fetchBrands = async () => {
    try {
      const res = await fetch("/api/brands");
      if (res.ok) {
        setBrands(await res.json());
      }
    } catch (error) {
      console.error("Failed to load brands");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBrands();
  }, []);

  // 2. Handle Image Upload (Same Cloudinary logic as Products)
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const data = new FormData();
    data.append("file", file);
    data.append("upload_preset", process.env.NEXT_PUBLIC_CLOUDINARY_PRESET || "ml_default");
    data.append("cloud_name", process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME!);

    try {
      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
        { method: "POST", body: data }
      );
      const json = await res.json();
      setLogo(json.secure_url); // Save the Cloudinary URL
      toast.success("Logo uploaded!");
    } catch (err) {
      toast.error("Upload failed");
    } finally {
      setUploading(false);
    }
  };

  // 3. Save Brand
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !logo) {
      toast.error("Please provide name and logo");
      return;
    }
    setSaving(true);

    try {
      const res = await fetch("/api/brands", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, logo }),
      });

      if (res.ok) {
        toast.success("Brand added!");
        setName("");
        setLogo("");
        fetchBrands(); // Refresh list
      }
    } catch (error) {
      toast.error("Failed to add brand");
    } finally {
      setSaving(false);
    }
  };

  // 4. Delete Brand
  const handleDelete = async (id: string) => {
    if (!confirm("Delete this brand?")) return;
    try {
      await fetch(`/api/brands/${id}`, { method: "DELETE" });
      toast.success("Brand deleted");
      fetchBrands();
    } catch (error) {
      toast.error("Delete failed");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 font-sans">
      <Toaster position="bottom-center" />
      <div className="container mx-auto max-w-4xl">
        
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Manage Brands</h1>
          <Link href="/admin/orders" className="flex items-center gap-2 text-sm font-bold text-[#006a55] hover:underline">
            <ArrowLeft className="w-4 h-4" /> Dashboard
          </Link>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          
          {/* LEFT: Add New Brand Form */}
          <div className="bg-white p-6 rounded-xl border-2 border-gray-100 shadow-sm h-fit">
            <h2 className="font-bold text-lg mb-4 text-gray-800">Add New Brand</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              
              {/* Logo Upload */}
              <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 flex flex-col items-center justify-center text-gray-500 hover:border-[#006a55] hover:bg-[#006a55]/5 transition-all cursor-pointer relative h-32">
                <input 
                  type="file" 
                  accept="image/*"
                  onChange={handleImageUpload}
                  disabled={uploading}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                {logo ? (
                  <Image src={logo} alt="Preview" fill className="object-contain p-2" />
                ) : (
                  <>
                    {uploading ? <Loader2 className="animate-spin text-[#006a55]" /> : <UploadCloud className="text-[#006a55]" />}
                    <span className="text-xs mt-2 font-bold">{uploading ? "Uploading..." : "Upload Logo"}</span>
                  </>
                )}
              </div>

              {/* Name Input */}
              <input 
                placeholder="Brand Name (e.g. Apple)" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border-2 border-gray-200 focus:border-[#006a55] outline-none text-gray-900"
              />

              <button 
                type="submit" 
                disabled={saving || uploading}
                className="w-full bg-[#006a55] text-white py-3 rounded-xl font-bold hover:bg-[#005544] transition-all flex items-center justify-center gap-2"
              >
                {saving ? <Loader2 className="animate-spin w-4 h-4" /> : <Save className="w-4 h-4" />}
                Save Brand
              </button>
            </form>
          </div>

          {/* RIGHT: Existing Brands List */}
          <div className="bg-white p-6 rounded-xl border-2 border-gray-100 shadow-sm">
            <h2 className="font-bold text-lg mb-4 text-gray-800">Existing Brands</h2>
            {loading ? (
              <Loader2 className="animate-spin text-[#006a55] mx-auto" />
            ) : brands.length === 0 ? (
              <p className="text-gray-500 text-sm text-center">No brands yet.</p>
            ) : (
              <div className="space-y-3 max-h-[500px] overflow-y-auto">
                {brands.map((brand) => (
                  <div key={brand._id} className="flex items-center justify-between p-3 border border-gray-100 rounded-lg hover:border-[#006a55]/30 bg-gray-50">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-white rounded-md border border-gray-200 relative shrink-0">
                        <Image src={brand.logo} alt={brand.name} fill className="object-contain p-2" />
                      </div>
                      <span className="font-bold text-gray-700">{brand.name}</span>
                    </div>
                    <button 
                      onClick={() => handleDelete(brand._id)}
                      className="text-red-500 hover:bg-red-50 p-2 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}