"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Save, Loader2, X, UploadCloud } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import Image from "next/image";

export default function AddProductPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    brand: "",
    category: "mobiles",
    price: "",
    rating: "4.5",
    reviews: "0",
    inStock: true,
    description: "",
  });

  const [images, setImages] = useState<string[]>([]);

  const handleChange = (e: any) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  // --- CLOUDINARY UPLOAD LOGIC ---
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    if (images.length + files.length > 5) {
      toast.error("Max 5 images allowed");
      return;
    }

    setUploading(true);
    const uploadPromises = Array.from(files).map(async (file) => {
      const data = new FormData();
      data.append("file", file);
      data.append("upload_preset", "ml_default"); // Must match your Cloudinary settings
      data.append("cloud_name", process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME!);

      try {
        const res = await fetch(
          `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
          { method: "POST", body: data }
        );
        const json = await res.json();
        return json.secure_url; // Returns a short URL (small data)
      } catch (err) {
        console.error("Upload failed", err);
        return null;
      }
    });

    const uploadedUrls = await Promise.all(uploadPromises);
    const validUrls = uploadedUrls.filter((url) => url !== null) as string[];
    
    setImages((prev) => [...prev, ...validUrls]);
    setUploading(false);
    toast.success("Images uploaded!");
  };

  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (images.length === 0) {
      toast.error("Please upload at least 1 image");
      return;
    }
    setLoading(true);

    try {
      const res = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          price: Number(formData.price),
          rating: Number(formData.rating),
          reviews: Number(formData.reviews),
          images: images,
        }),
      });

      if (res.ok) {
        toast.success("Product Added Successfully!");
        router.push("/admin/orders");
      } else {
        toast.error("Failed to add product");
      }
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 font-sans">
      <Toaster position="bottom-center" />
      <div className="container mx-auto max-w-2xl">
        <div className="mb-8 flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-900">Add New Product</h1>
          <Link href="/admin/orders" className="flex items-center gap-2 text-sm font-bold text-[#006a55] hover:underline">
            <ArrowLeft className="w-4 h-4" /> Back to Dashboard
          </Link>
        </div>

        <form onSubmit={handleSubmit} className="bg-white p-8 rounded-xl border-2 border-gray-100 shadow-sm space-y-6">
          {/* Image Upload */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Product Images (Max 5)</label>
            <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 flex flex-col items-center justify-center text-gray-500 hover:border-[#006a55] hover:bg-[#006a55]/5 transition-all cursor-pointer relative">
              <input 
                type="file" 
                multiple 
                accept="image/*"
                onChange={handleImageUpload}
                disabled={uploading}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
              />
              {uploading ? (
                <Loader2 className="w-10 h-10 mb-2 text-[#006a55] animate-spin" />
              ) : (
                <UploadCloud className="w-10 h-10 mb-2 text-[#006a55]" />
              )}
              <p className="text-sm font-bold">{uploading ? "Uploading..." : "Click to upload images"}</p>
            </div>
            {/* Previews */}
            {images.length > 0 && (
              <div className="flex gap-4 mt-4 overflow-x-auto pb-2">
                {images.map((img, index) => (
                  <div key={index} className="relative w-20 h-20 shrink-0 border-2 border-gray-200 rounded-lg overflow-hidden group">
                    <Image src={img} alt="Preview" fill className="object-cover" />
                    <button type="button" onClick={() => removeImage(index)} className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"><X className="w-3 h-3" /></button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Form Inputs (with text-gray-900 fix) */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Product Name</label>
            <input required name="name" value={formData.name} onChange={handleChange} placeholder="e.g. iPhone 15" className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-[#006a55] outline-none text-gray-900" />
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Brand</label>
              <select name="brand" value={formData.brand} onChange={handleChange} className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-[#006a55] outline-none bg-white text-gray-900">
                <option value="">Select Brand</option>
                <option value="Apple">Apple</option>
                <option value="Samsung">Samsung</option>
                <option value="OnePlus">OnePlus</option>
                <option value="Xiaomi">Xiaomi</option>
                <option value="Realme">Realme</option>
                <option value="Google">Google</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Category</label>
              <select name="category" value={formData.category} onChange={handleChange} className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-[#006a55] outline-none bg-white text-gray-900">
                <option value="mobiles">Mobiles</option>
                <option value="cases">Cases</option>
                <option value="screen-guards">Screen Guards</option>
                <option value="chargers">Chargers</option>
                <option value="accessories">Accessories</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Price (₹)</label>
            <input required type="number" name="price" value={formData.price} onChange={handleChange} className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-[#006a55] outline-none text-gray-900" />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Description</label>
            <textarea required name="description" value={formData.description} onChange={handleChange} rows={4} className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-[#006a55] outline-none resize-none text-gray-900" />
          </div>

          <button type="submit" disabled={loading || uploading} className="w-full bg-[#006a55] text-white py-4 rounded-xl font-bold text-lg hover:bg-[#005544] transition-all shadow-lg shadow-[#006a55]/20 disabled:opacity-70 flex items-center justify-center gap-2">
            {loading ? <Loader2 className="animate-spin w-5 h-5" /> : <Save className="w-5 h-5" />}
            {loading ? "Saving..." : "Save Product"}
          </button>
        </form>
      </div>
    </div>
  );
}