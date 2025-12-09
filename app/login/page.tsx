"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Mail, Lock, User, ArrowRight, Loader2 } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";

export default function LoginPage() {
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const endpoint = isLogin ? "/api/auth/login" : "/api/auth/register";

    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok) {
        if (!isLogin) {
          // --- REGISTER SUCCESS ---
          toast.success("User created successfully!");
          setIsLogin(true); // Switch to Login mode automatically
        } else {
          // --- LOGIN SUCCESS ---
          toast.success("Welcome back!");
          // Save flag for Navbar to see
          localStorage.setItem("isLoggedIn", "true");
          // Save basic user info for Profile page
          localStorage.setItem("user_info", JSON.stringify(data.user));
          router.push("/"); // Go Home
        }
      } else {
        toast.error(data.error);
      }
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Toaster position="bottom-center" />
      
      <div className="bg-white w-full max-w-md p-8 rounded-2xl shadow-xl border-2 border-gray-100">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-extrabold text-[#006a55] mb-2 font-exo">MAMTA</h1>
          <p className="text-gray-500 text-sm tracking-widest uppercase font-bold">
            {isLogin ? "Welcome Back" : "Create Account"}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          
          {!isLogin && (
            <div className="relative">
              <User className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" />
              <input 
                name="name"
                placeholder="Full Name"
                onChange={handleChange}
                className="w-full pl-12 pr-4 py-3 rounded-xl border-2 border-gray-200 focus:border-[#006a55] outline-none text-gray-900 bg-white transition-colors"
                required={!isLogin}
              />
            </div>
          )}

          <div className="relative">
            <Mail className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" />
            <input 
              name="email"
              type="email"
              placeholder="Email Address"
              onChange={handleChange}
              className="w-full pl-12 pr-4 py-3 rounded-xl border-2 border-gray-200 focus:border-[#006a55] outline-none text-gray-900 bg-white transition-colors"
              required
            />
          </div>

          <div className="relative">
            <Lock className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" />
            <input 
              name="password"
              type="password"
              placeholder="Password"
              onChange={handleChange}
              className="w-full pl-12 pr-4 py-3 rounded-xl border-2 border-gray-200 focus:border-[#006a55] outline-none text-gray-900 bg-white transition-colors"
              required
            />
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-[#006a55] text-white py-3.5 rounded-xl font-bold text-lg hover:bg-[#005544] transition-all shadow-lg shadow-[#006a55]/20 flex items-center justify-center gap-2 disabled:opacity-70"
          >
            {loading ? <Loader2 className="animate-spin w-5 h-5" /> : (isLogin ? "Log In" : "Sign Up")}
            {!loading && <ArrowRight className="w-5 h-5" />}
          </button>

        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-500">
            {isLogin ? "New to Mamta Mobiles?" : "Already have an account?"}
            <button 
              onClick={() => setIsLogin(!isLogin)} 
              className="ml-2 text-[#006a55] font-bold hover:underline"
            >
              {isLogin ? "Sign Up" : "Log In"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}