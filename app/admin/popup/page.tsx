"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Save, Eye, EyeOff, Upload, X, Image as ImageIcon } from "lucide-react";
import toast from "react-hot-toast";

export default function ManagePopupPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  const [formData, setFormData] = useState({
    title: "",
    subtitle: "",
    image: "", // Will store the Base64 string
    link: "",
    isActive: false
  });

  // Fetch Current Settings
  useEffect(() => {
    async function fetchPopup() {
      try {
        const res = await fetch("/api/popup");
        if (res.ok) {
          const data = await res.json();
          setFormData({
            title: data.title || "",
            subtitle: data.subtitle || "",
            image: data.image || "",
            link: data.link || "",
            isActive: data.isActive || false
          });
        }
      } catch (error) {
        console.error("Failed to load popup settings");
      } finally {
        setLoading(false);
      }
    }
    fetchPopup();
  }, []);

  // ✅ NEW: Handle Image File Upload (Convert to Base64)
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) { // Limit to 2MB
        return toast.error("File is too large. Max 2MB allowed.");
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, image: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setFormData({ ...formData, image: "" });
  };

  // Handle Save
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch("/api/popup", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        toast.success("Popup Updated Successfully!");
      } else {
        toast.error("Failed to update");
      }
    } catch (e) {
      toast.error("Network Error");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="h-screen flex items-center justify-center text-[#006a55] font-bold">Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-50 p-8 font-sans">
      <div className="max-w-3xl mx-auto">
        
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link href="/admin" className="p-2 bg-white rounded-full border border-gray-200 hover:bg-gray-100">
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </Link>
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900">Sale Popup</h1>
            <p className="text-gray-500 text-sm">Manage the promotional popup shown to visitors.</p>
          </div>
        </div>

        {/* Form */}
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Toggle Active Status */}
            <div className={`p-4 rounded-xl border flex justify-between items-center ${formData.isActive ? "bg-green-50 border-green-200" : "bg-gray-50 border-gray-200"}`}>
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-full ${formData.isActive ? "bg-green-100 text-green-700" : "bg-gray-200 text-gray-500"}`}>
                  {formData.isActive ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
                </div>
                <div>
                  <p className="font-bold text-gray-900">Popup Status</p>
                  <p className="text-xs text-gray-500">{formData.isActive ? "Visible to visitors" : "Hidden from website"}</p>
                </div>
              </div>
              <button 
                type="button"
                onClick={() => setFormData({ ...formData, isActive: !formData.isActive })}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${formData.isActive ? "bg-[#006a55]" : "bg-gray-300"}`}
              >
                <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${formData.isActive ? "translate-x-6" : "translate-x-1"}`} />
              </button>
            </div>

            {/* Content Fields */}
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Headline Title</label>
              <input 
                required 
                value={formData.title} 
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#006a55] outline-none" 
                placeholder="e.g. Diwali Sale Live!"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Subtitle / Description</label>
              <textarea 
                required 
                rows={3}
                value={formData.subtitle} 
                onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#006a55] outline-none resize-none" 
                placeholder="e.g. Get 50% off on all items..."
              />
            </div>

            {/* ✅ NEW: Image Upload Section */}
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Popup Banner Image</label>
              
              {!formData.image ? (
                // Upload State
                <div className="relative border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:bg-gray-50 transition-colors group">
                  <input 
                    type="file" 
                    accept="image/*"
                    onChange={handleImageChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  <div className="flex flex-col items-center justify-center text-gray-400 group-hover:text-[#006a55]">
                    <Upload className="w-10 h-10 mb-2" />
                    <p className="text-sm font-bold">Click to Upload Image</p>
                    <p className="text-xs mt-1">PNG, JPG up to 2MB</p>
                  </div>
                </div>
              ) : (
                // Preview State
                <div className="relative w-full h-48 bg-gray-100 rounded-xl overflow-hidden border border-gray-200 group">
                  <Image 
                    src={formData.image} 
                    alt="Preview" 
                    fill 
                    className="object-cover" 
                    unoptimized 
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <button 
                      type="button" 
                      onClick={removeImage}
                      className="bg-red-500 text-white p-3 rounded-full hover:bg-red-600 transition-transform hover:scale-110"
                    >
                      <Trash2Icon />
                    </button>
                  </div>
                </div>
              )}
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Button Link</label>
              <input 
                value={formData.link} 
                onChange={(e) => setFormData({ ...formData, link: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#006a55] outline-none" 
                placeholder="/shop/all"
              />
            </div>

            {/* Save Button */}
            <div className="pt-4 border-t border-gray-100 flex justify-end">
              <button 
                type="submit" 
                disabled={saving}
                className="bg-[#006a55] text-white px-8 py-3 rounded-xl font-bold hover:bg-[#005544] transition-all flex items-center gap-2 disabled:opacity-70"
              >
                <Save className="w-5 h-5" /> {saving ? "Saving..." : "Save Changes"}
              </button>
            </div>

          </form>
        </div>
      </div>
    </div>
  );
}

// Helper Icon
function Trash2Icon() {
  return <X className="w-5 h-5" />;
}