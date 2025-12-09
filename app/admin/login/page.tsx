"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Lock, ArrowRight } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";

export default function AdminLogin() {
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      if (res.ok) {
        toast.success("Welcome back, Admin!");
        router.push("/admin/orders"); // Redirect to Dashboard
      } else {
        toast.error("Invalid Password");
        setLoading(false);
      }
    } catch (error) {
      toast.error("Login failed");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 font-sans">
      <Toaster position="bottom-center" />
      <div className="bg-white p-8 rounded-2xl shadow-xl border-2 border-gray-100 w-full max-w-md">
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 bg-[#006a55]/10 rounded-full flex items-center justify-center">
            <Lock className="w-8 h-8 text-[#006a55]" />
          </div>
        </div>
        
        <h1 className="text-2xl font-bold text-center text-gray-800 mb-2">Admin Login</h1>
        <p className="text-center text-gray-500 mb-8 text-sm">Enter your secure key to access the dashboard.</p>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <input
              type="password"
              placeholder="Enter Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-[#006a55] outline-none transition-colors"
              required
            />
          </div>
          
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#006a55] text-white py-3 rounded-xl font-bold hover:bg-[#005544] transition-all flex items-center justify-center gap-2 disabled:opacity-70"
          >
            {loading ? "Verifying..." : "Access Dashboard"}
            {!loading && <ArrowRight className="w-4 h-4" />}
          </button>
        </form>
      </div>
    </div>
  );
}