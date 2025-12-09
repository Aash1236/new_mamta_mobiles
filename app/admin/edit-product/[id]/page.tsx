"use client";

import { useState, useEffect, use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Save, Loader2, X, UploadCloud } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import Image from "next/image";

export default function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  
  const [loading, setLoading] = useState(true); // Loading initial data
  const [saving, setSaving] = useState(false); // Saving updates
  const [uploading, setUploading] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    brand: "",
    category: "",
    price: "",
    rating: "",
    reviews: "",
    inStock: true,
    description: "",
  });

  const [images, setImages] = useState<string[]>([]);

  // 1. Fetch Existing Data
  useEffect(() => {
    async function fetchProduct() {
      try {
        const res = await fetch(`/api/products/${id}`);
        if (!res.ok) throw new Error("Product not found");
        const data = await res.json();
        
        setFormData({
          name: data.name,
          brand: data.brand,
          category: data.category,
          price: data.price,
          rating: data.rating,
          reviews: data.reviews,
          inStock: data.inStock,
          description: data.description,
        });
        setImages(data.images || []);
      } catch (error) {
        toast.error("Failed to load product");
        router.push("/admin/products");
      } finally {
        setLoading(false);
      }
    }
    fetchProduct();
  }, [id, router]);

  const handleChange = (e: any) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    setUploading(true);
    const uploadPromises = Array.from(files).map(async (file) => {
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
        return json.secure_url;
      } catch (err) {
        return null;
      }
    });

    const uploadedUrls = await Promise.all(uploadPromises);
    const validUrls = uploadedUrls.filter((url) => url !== null) as string[];
    setImages((prev) => [...prev, ...validUrls]);
    setUploading(false);
  };

  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const res = await fetch(`/api/products/${id}`, {
        method: "PUT", // UPDATE METHOD
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
        toast.success("Product Updated!");
        router.push("/admin/products");
      } else {
        toast.error("Failed to update");
      }
    } catch (error) {
      toast.error("Error updating product");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="h-screen flex items-center justify-center"><Loader2 className="animate-spin text-[#006a55]" /></div>;

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 font-sans">
      <Toaster position="bottom-center" />
      <div className="container mx-auto max-w-2xl">
        <div className="mb-8 flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-900">Edit Product</h1>
          <Link href="/admin/products" className="flex items-center gap-2 text-sm font-bold text-[#006a55] hover:underline">
            <ArrowLeft className="w-4 h-4" /> Cancel
          </Link>
        </div>

        <form onSubmit={handleSubmit} className="bg-white p-8 rounded-xl border-2 border-gray-100 shadow-sm space-y-6">
          
          {/* Images */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Images</label>
            <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 flex flex-col items-center justify-center text-gray-500 hover:border-[#006a55] hover:bg-[#006a55]/5 transition-all cursor-pointer relative">
              <input type="file" multiple accept="image/*" onChange={handleImageUpload} disabled={uploading} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
              {uploading ? <Loader2 className="w-8 h-8 animate-spin text-[#006a55]" /> : <UploadCloud className="w-8 h-8 text-[#006a55]" />}
              <p className="text-xs mt-2 font-bold">{uploading ? "Uploading..." : "Upload New Images"}</p>
            </div>
            <div className="flex gap-4 mt-4 overflow-x-auto pb-2">
              {images.map((img, index) => (
                <div key={index} className="relative w-20 h-20 shrink-0 border-2 border-gray-200 rounded-lg overflow-hidden group">
                  <Image src={img} alt="Preview" fill className="object-cover" />
                  <button type="button" onClick={() => removeImage(index)} className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"><X className="w-3 h-3" /></button>
                </div>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Name</label>
            <input name="name" value={formData.name} onChange={handleChange} className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-[#006a55] outline-none text-gray-900 bg-white" />
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Brand</label>
              <select name="brand" value={formData.brand} onChange={handleChange} className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-[#006a55] outline-none bg-white text-gray-900">
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

          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Price (₹)</label>
              <input type="number" name="price" value={formData.price} onChange={handleChange} className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-[#006a55] outline-none text-gray-900 bg-white" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Description</label>
            <textarea name="description" value={formData.description} onChange={handleChange} rows={4} className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-[#006a55] outline-none resize-none text-gray-900 bg-white" />
          </div>

          <div className="flex items-center gap-3">
            <input type="checkbox" name="inStock" checked={formData.inStock} onChange={handleChange} className="w-5 h-5 accent-[#006a55]" id="stock" />
            <label htmlFor="stock" className="text-sm font-bold text-gray-700 cursor-pointer">Product is In Stock</label>
          </div>

          <button type="submit" disabled={saving || uploading} className="w-full bg-[#006a55] text-white py-4 rounded-xl font-bold text-lg hover:bg-[#005544] transition-all shadow-lg flex items-center justify-center gap-2">
            {saving ? <Loader2 className="animate-spin w-5 h-5" /> : <Save className="w-5 h-5" />}
            {saving ? "Updating..." : "Update Product"}
          </button>

        </form>
      </div>
    </div>
  );
}