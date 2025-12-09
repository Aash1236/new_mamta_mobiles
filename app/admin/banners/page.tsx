"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, UploadCloud, Trash2, Loader2, Save, Image as ImageIcon } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import Image from "next/image";

export default function ManageBannersPage() {
  const [banners, setBanners] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Form State
  const [formData, setFormData] = useState({
    title: "",
    subtitle: "",
    link: "/shop",
  });
  const [image, setImage] = useState("");
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);

  // 1. Fetch Banners
  const fetchBanners = async () => {
    try {
      const res = await fetch("/api/banners");
      if (res.ok) setBanners(await res.json());
    } catch (error) {
      console.error("Failed to load banners");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBanners();
  }, []);

  // 2. Upload Image
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
      setImage(json.secure_url);
      toast.success("Banner uploaded!");
    } catch (err) {
      toast.error("Upload failed");
    } finally {
      setUploading(false);
    }
  };

  // 3. Save Banner
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !image) {
      toast.error("Title and Image are required");
      return;
    }
    setSaving(true);

    try {
      const res = await fetch("/api/banners", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, image }),
      });

      if (res.ok) {
        toast.success("Banner Added!");
        setFormData({ title: "", subtitle: "", link: "/shop" });
        setImage("");
        fetchBanners();
      }
    } catch (error) {
      toast.error("Failed to add banner");
    } finally {
      setSaving(false);
    }
  };

  // 4. Delete Banner
  const handleDelete = async (id: string) => {
    if (!confirm("Delete this banner?")) return;
    await fetch(`/api/banners/${id}`, { method: "DELETE" });
    toast.success("Banner deleted");
    fetchBanners();
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 font-sans">
      <Toaster position="bottom-center" />
      <div className="container mx-auto max-w-5xl">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Manage Banners</h1>
          <Link href="/admin/orders" className="flex items-center gap-2 text-sm font-bold text-[#006a55] hover:underline">
            <ArrowLeft className="w-4 h-4" /> Dashboard
          </Link>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Form */}
          <div className="bg-white p-6 rounded-xl border-2 border-gray-100 shadow-sm h-fit">
            <h2 className="font-bold text-lg mb-4 text-gray-800">Add New Banner</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              
              {/* Image Upload */}
              <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 flex flex-col items-center justify-center text-white hover:border-[#006a55] hover:bg-[#006a55]/5 transition-all cursor-pointer relative h-40">
                <input type="file" accept="image/*" onChange={handleImageUpload} disabled={uploading} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                {image ? (
                  <Image src={image} alt="Preview" fill className="object-cover rounded-lg" />
                ) : (
                  <>
                    {uploading ? <Loader2 className="animate-spin text-[#006a55]" /> : <UploadCloud className="text-[#006a55]" />}
                    <span className="text-xs mt-2 font-bold">{uploading ? "Uploading..." : "Upload Landscape Image"}</span>
                  </>
                )}
              </div>

              <input placeholder="Title (e.g. OnePlus 12)" value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} className="w-full px-4 py-2 rounded-lg border-2 border-gray-200 outline-none text-black" />
              <input placeholder="Subtitle (e.g. Smooth beyond belief)" value={formData.subtitle} onChange={(e) => setFormData({...formData, subtitle: e.target.value})} className="w-full px-4 py-2 rounded-lg border-2 border-gray-200 outline-none text-black" />
              <input placeholder="Link (e.g. /shop/oneplus)" value={formData.link} onChange={(e) => setFormData({...formData, link: e.target.value})} className="w-full px-4 py-2 rounded-lg border-2 border-gray-200 outline-none text-black" />

              <button type="submit" disabled={saving || uploading} className="w-full bg-[#006a55] text-white py-3 rounded-xl font-bold hover:bg-[#005544] transition-all flex items-center justify-center gap-2">
                {saving ? <Loader2 className="animate-spin w-4 h-4" /> : <Save className="w-4 h-4" />} Save Banner
              </button>
            </form>
          </div>

          {/* List */}
          <div className="space-y-4">
            {loading ? <Loader2 className="animate-spin text-[#006a55] mx-auto" /> : banners.map((banner) => (
              <div key={banner._id} className="relative group bg-white rounded-xl overflow-hidden border-2 border-gray-100 shadow-sm">
                <div className="h-32 relative">
                  <Image src={banner.image} alt={banner.title} fill className="object-cover" />
                  <div className="absolute inset-0 bg-black/40 flex flex-col justify-center px-6">
                    <h3 className="text-white font-bold text-lg">{banner.title}</h3>
                    <p className="text-gray-200 text-xs">{banner.subtitle}</p>
                  </div>
                </div>
                <button onClick={() => handleDelete(banner._id)} className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}