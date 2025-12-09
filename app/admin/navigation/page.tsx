"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image"; // Import Image
import { ArrowLeft, Trash2, Loader2, Save, Edit, UploadCloud, X } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";

export default function ManageNavigationPage() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Form State
  const [editId, setEditId] = useState<string | null>(null); // Track if editing
  const [type, setType] = useState("device");
  const [title, setTitle] = useState("");
  const [itemsList, setItemsList] = useState("");
  const [image, setImage] = useState(""); // Image State
  const [uploading, setUploading] = useState(false);

  // Fetch Data
  const fetchNav = async () => {
    try {
      const res = await fetch("/api/navigation");
      if (res.ok) setItems(await res.json());
    } catch (error) {
      console.error("Failed to load nav");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNav();
  }, []);

  // Handle Image Upload
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
      toast.success("Icon uploaded!");
    } catch (err) {
      toast.error("Upload failed");
    } finally {
      setUploading(false);
    }
  };

  // Populate Form for Editing
  const handleEdit = (item: any) => {
    setEditId(item._id);
    setType(item.type);
    setTitle(item.title);
    setItemsList(item.items.join(", "));
    setImage(item.image || "");
    window.scrollTo({ top: 0, behavior: 'smooth' }); // Scroll to form
  };

  // Reset Form
  const resetForm = () => {
    setEditId(null);
    setType("device");
    setTitle("");
    setItemsList("");
    setImage("");
  };

  // Submit (Create or Update)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title) return toast.error("Title is required");

    const itemsArray = itemsList.split(",").map(i => i.trim()).filter(i => i !== "");
    const payload = { type, title, items: itemsArray, image };

    try {
      if (editId) {
        // UPDATE MODE
        const res = await fetch(`/api/navigation/${editId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (res.ok) toast.success("Menu Updated!");
      } else {
        // CREATE MODE
        const res = await fetch("/api/navigation", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (res.ok) toast.success("Menu Created!");
      }
      
      resetForm();
      fetchNav();
    } catch (error) {
      toast.error("Operation failed");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this group?")) return;
    await fetch(`/api/navigation/${id}`, { method: "DELETE" });
    fetchNav();
  };

  if (loading) return <div className="h-screen flex items-center justify-center"><Loader2 className="animate-spin text-[#006a55]" /></div>;

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 font-sans">
      <Toaster position="bottom-center" />
      <div className="container mx-auto max-w-5xl">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Manage Navbar Menus</h1>
          <Link href="/admin/orders" className="flex items-center gap-2 text-sm font-bold text-[#006a55] hover:underline">
            <ArrowLeft className="w-4 h-4" /> Dashboard
          </Link>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          
          {/* FORM */}
          <div className="bg-white p-6 rounded-xl border-2 border-gray-100 h-fit shadow-sm">
            <div className="flex justify-between items-center mb-4">
              <h2 className="font-bold text-lg text-gray-900">
                {editId ? "Edit Menu Group" : "Add New Menu Group"}
              </h2>
              {editId && (
                <button onClick={resetForm} className="text-xs text-red-500 hover:underline flex items-center gap-1">
                  <X className="w-3 h-3" /> Cancel Edit
                </button>
              )}
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              
              {/* Image Upload */}
              <div className="flex items-center gap-4">
                <div className="relative w-20 h-20 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center overflow-hidden bg-gray-50">
                  {image ? (
                    <Image src={image} alt="Preview" fill className="object-contain p-2" />
                  ) : (
                    uploading ? <Loader2 className="w-6 h-6 animate-spin text-[#006a55]" /> : <UploadCloud className="w-6 h-6 text-gray-400" />
                  )}
                  <input type="file" accept="image/*" onChange={handleImageUpload} disabled={uploading} className="absolute inset-0 opacity-0 cursor-pointer" />
                </div>
                <div className="text-xs text-gray-500">
                  <p className="font-bold">Menu Icon (Optional)</p>
                  <p>Click box to upload</p>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 mb-1">Menu Type</label>
                <select value={type} onChange={(e) => setType(e.target.value)} className="w-full px-4 py-2 rounded-lg border-2 border-gray-200 outline-none focus:border-[#006a55] text-gray-900 bg-white">
                  <option value="device">Device Menu</option>
                  <option value="category">Category Menu</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 mb-1">Group Title (e.g. Apple)</label>
                <input value={title} onChange={(e) => setTitle(e.target.value)} className="w-full px-4 py-2 rounded-lg border-2 border-gray-200 outline-none focus:border-[#006a55] text-gray-900 bg-white" placeholder="Brand or Category Name" />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 mb-1">Items (Comma Separated)</label>
                <textarea value={itemsList} onChange={(e) => setItemsList(e.target.value)} className="w-full px-4 py-2 rounded-lg border-2 border-gray-200 outline-none focus:border-[#006a55] text-gray-900 bg-white" placeholder="iPhone 15, iPhone 14, iPhone 13" rows={3} />
              </div>

              <button type="submit" disabled={uploading} className="w-full bg-[#006a55] text-white py-3 rounded-lg font-bold hover:bg-[#005544] transition-all flex items-center justify-center gap-2">
                {editId ? <Save className="w-4 h-4" /> : <Save className="w-4 h-4" />}
                {editId ? "Update Menu" : "Save Menu"}
              </button>
            </form>
          </div>

          {/* LIST */}
          <div className="space-y-6">
            {["device", "category"].map((sectionType) => (
              <div key={sectionType}>
                <h3 className="font-bold text-gray-500 uppercase tracking-wider text-sm mb-3">{sectionType} Menu</h3>
                {items.filter(i => i.type === sectionType).length === 0 ? (
                  <p className="text-sm text-gray-400 italic">No items yet.</p>
                ) : (
                  items.filter(i => i.type === sectionType).map(item => (
                    <div key={item._id} className={`bg-white p-4 rounded-lg border-2 mb-2 flex justify-between items-center group transition-all ${editId === item._id ? 'border-[#006a55] ring-1 ring-[#006a55]' : 'border-gray-100 hover:border-[#006a55]/30'}`}>
                      <div className="flex items-center gap-3">
                        {item.image && (
                          <div className="w-10 h-10 relative bg-gray-50 rounded-md shrink-0">
                            <Image src={item.image} alt={item.title} fill className="object-contain p-1" />
                          </div>
                        )}
                        <div>
                          <h4 className="font-bold text-[#006a55] text-base">{item.title}</h4>
                          <p className="text-xs text-gray-600 truncate max-w-[200px]">{item.items.join(", ")}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <button onClick={() => handleEdit(item)} className="p-2 text-blue-500 hover:bg-blue-50 rounded-md transition-colors" title="Edit">
                          <Edit className="w-4 h-4" />
                        </button>
                        <button onClick={() => handleDelete(item._id)} className="p-2 text-red-500 hover:bg-red-50 rounded-md transition-colors" title="Delete">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            ))}
          </div>

        </div>
      </div>
    </div>
  );
}