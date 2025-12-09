"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, UploadCloud, Trash2, Loader2, Save, Image as ImageIcon, Edit, X } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import Image from "next/image";

export default function ManageBannersPage() {
  const [banners, setBanners] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Form State
  const [editId, setEditId] = useState<string | null>(null); // Track editing
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
      toast.success("Image uploaded!");
    } catch (err) {
      toast.error("Upload failed");
    } finally {
      setUploading(false);
    }
  };

  // 3. Populate Form for Edit
  const handleEdit = (banner: any) => {
    setEditId(banner._id);
    setFormData({
      title: banner.title,
      subtitle: banner.subtitle,
      link: banner.link
    });
    setImage(banner.image);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // 4. Reset Form
  const resetForm = () => {
    setEditId(null);
    setFormData({ title: "", subtitle: "", link: "/shop" });
    setImage("");
  };

  // 5. Submit (Create or Update)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !image) {
      toast.error("Title and Image are required");
      return;
    }
    setSaving(true);

    try {
      const payload = { ...formData, image };
      
      let res;
      if (editId) {
        // UPDATE MODE
        res = await fetch(`/api/banners/${editId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      } else {
        // CREATE MODE
        res = await fetch("/api/banners", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      }

      if (res.ok) {
        toast.success(editId ? "Banner Updated!" : "Banner Created!");
        resetForm();
        fetchBanners();
      } else {
        toast.error("Operation failed");
      }
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setSaving(false);
    }
  };

  // 6. Delete Banner
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
            <div className="flex justify-between items-center mb-4">
              <h2 className="font-bold text-lg text-gray-900">
                {editId ? "Edit Banner" : "Add New Banner"}
              </h2>
              {editId && (
                <button onClick={resetForm} className="text-xs text-red-500 hover:underline flex items-center gap-1">
                  <X className="w-3 h-3" /> Cancel Edit
                </button>
              )}
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              
              {/* Image Upload */}
              <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 flex flex-col items-center justify-center text-gray-500 hover:border-[#006a55] hover:bg-[#006a55]/5 transition-all cursor-pointer relative h-40 bg-gray-50">
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

              <div>
                <label className="block text-xs font-bold text-gray-500 mb-1">Title</label>
                <input 
                  placeholder="e.g. OnePlus 12" 
                  value={formData.title} 
                  onChange={(e) => setFormData({...formData, title: e.target.value})} 
                  className="w-full px-4 py-2 rounded-lg border-2 border-gray-200 outline-none focus:border-[#006a55] text-gray-900" 
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 mb-1">Subtitle</label>
                <input 
                  placeholder="e.g. Smooth beyond belief" 
                  value={formData.subtitle} 
                  onChange={(e) => setFormData({...formData, subtitle: e.target.value})} 
                  className="w-full px-4 py-2 rounded-lg border-2 border-gray-200 outline-none focus:border-[#006a55] text-gray-900" 
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 mb-1">Link URL</label>
                <input 
                  placeholder="e.g. /shop/oneplus" 
                  value={formData.link} 
                  onChange={(e) => setFormData({...formData, link: e.target.value})} 
                  className="w-full px-4 py-2 rounded-lg border-2 border-gray-200 outline-none focus:border-[#006a55] text-gray-900" 
                />
              </div>

              <button type="submit" disabled={saving || uploading} className="w-full bg-[#006a55] text-white py-3 rounded-xl font-bold hover:bg-[#005544] transition-all flex items-center justify-center gap-2">
                {saving ? <Loader2 className="animate-spin w-4 h-4" /> : <Save className="w-4 h-4" />} 
                {editId ? "Update Banner" : "Save Banner"}
              </button>
            </form>
          </div>

          {/* List */}
          <div className="space-y-4">
            {loading ? <Loader2 className="animate-spin text-[#006a55] mx-auto" /> : banners.map((banner) => (
              <div key={banner._id} className={`relative group bg-white rounded-xl overflow-hidden border-2 shadow-sm transition-all ${editId === banner._id ? 'border-[#006a55] ring-2 ring-[#006a55]/20' : 'border-gray-100'}`}>
                <div className="h-32 relative">
                  <Image src={banner.image} alt={banner.title} fill className="object-cover" />
                  <div className="absolute inset-0 bg-black/40 flex flex-col justify-center px-6 transition-opacity">
                    <h3 className="text-white font-bold text-lg">{banner.title}</h3>
                    <p className="text-gray-200 text-xs">{banner.subtitle}</p>
                  </div>
                </div>
                
                {/* Action Buttons */}
                <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button 
                    onClick={() => handleEdit(banner)} 
                    className="bg-white text-blue-600 p-2 rounded-full hover:bg-blue-50 shadow-sm" 
                    title="Edit"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => handleDelete(banner._id)} 
                    className="bg-white text-red-500 p-2 rounded-full hover:bg-red-50 shadow-sm" 
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}