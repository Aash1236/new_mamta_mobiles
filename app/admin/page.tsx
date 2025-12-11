"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  LayoutDashboard,
  ShoppingBag,
  Package,
  Users,
  Image as ImageIcon,
  PlusCircle,
  ArrowRight,
  DollarSign,
  Tag,
  Menu,
} from "lucide-react";
import { LayoutTemplate } from "lucide-react";

export default function AdminDashboard() {
  const router = useRouter();
  const [stats, setStats] = useState({
    revenue: 0,
    orders: 0,
    products: 0,
    users: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem("user_info");
    if (!storedUser) {
      router.push("/admin/login");
      return;
    }
    const user = JSON.parse(storedUser);
    if (user.role !== "admin") {
      router.push("/");
      return;
    }

    async function fetchStats() {
      try {
        const [ordersRes, productsRes] = await Promise.all([
          fetch("/api/orders"),
          fetch("/api/products"),
        ]);
        const orders = await ordersRes.json();
        const products = await productsRes.json();
        const totalRevenue = orders.reduce(
          (acc: number, order: any) =>
            order.status !== "Cancelled" ? acc + (order.totalAmount || 0) : acc,
          0
        );
        setStats({
          revenue: totalRevenue,
          orders: orders.length,
          products: products.length,
          users: 0,
        });
      } catch (error) {
        console.error("Failed to load admin stats");
      } finally {
        setLoading(false);
      }
    }
    fetchStats();
  }, [router]);

  if (loading)
    return (
      <div className="h-screen flex items-center justify-center text-[#006a55] font-bold">
        Loading...
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <div className="bg-white border-b border-gray-200 px-8 py-4 flex justify-between items-center sticky top-0 z-10">
        <h1 className="text-2xl font-extrabold text-[#006a55] flex items-center gap-2">
          <LayoutDashboard className="w-6 h-6" /> Admin Dashboard
        </h1>
        <Link href="/">
          <button className="px-4 py-2 text-gray-600 hover:text-[#006a55] font-bold text-sm">
            View Website
          </button>
        </Link>
      </div>

      <div className="max-w-7xl mx-auto p-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
          <StatCard
            title="Total Revenue"
            value={`₹${stats.revenue.toLocaleString()}`}
            icon={<DollarSign className="w-6 h-6 text-white" />}
            color="bg-green-500"
          />
          <StatCard
            title="Total Orders"
            value={stats.orders}
            icon={<ShoppingBag className="w-6 h-6 text-white" />}
            color="bg-blue-500"
          />
          <StatCard
            title="Products"
            value={stats.products}
            icon={<Package className="w-6 h-6 text-white" />}
            color="bg-purple-500"
          />
          <StatCard
            title="Customers"
            value={stats.users || "N/A"}
            icon={<Users className="w-6 h-6 text-white" />}
            color="bg-orange-500"
          />
        </div>

        <h2 className="text-xl font-bold text-gray-800 mb-6">Manage Store</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <DashboardLink
            href="/admin/orders"
            title="Orders"
            subtitle="Track and fulfill orders"
            icon={<ShoppingBag className="w-8 h-8" />}
            color="bg-blue-50 text-blue-600 group-hover:bg-blue-600"
          />
          <DashboardLink
            href="/admin/products"
            title="Products"
            subtitle="Manage inventory"
            icon={<Package className="w-8 h-8" />}
            color="bg-purple-50 text-purple-600 group-hover:bg-purple-600"
          />
          <DashboardLink
            href="/admin/add-product"
            title="Add Product"
            subtitle="Upload new items"
            icon={<PlusCircle className="w-8 h-8" />}
            color="bg-green-50 text-green-600 group-hover:bg-green-600"
          />

          {/* ✅ Added Missing Links */}
          <DashboardLink
            href="/admin/brands"
            title="Brands"
            subtitle="Manage brands logos"
            icon={<Tag className="w-8 h-8" />}
            color="bg-pink-50 text-pink-600 group-hover:bg-pink-600"
          />
          <DashboardLink
            href="/admin/banners"
            title="Banners"
            subtitle="Update homepage sliders"
            icon={<ImageIcon className="w-8 h-8" />}
            color="bg-yellow-50 text-yellow-600 group-hover:bg-yellow-600"
          />
          <DashboardLink
            href="/admin/navigation"
            title="Navigation"
            subtitle="Edit menu categories"
            icon={<Menu className="w-8 h-8" />}
            color="bg-indigo-50 text-indigo-600 group-hover:bg-indigo-600"
          />

          <DashboardLink
            href="/admin/users"
            title="Customers"
            subtitle="View registered users"
            icon={<Users className="w-8 h-8" />}
            color="bg-orange-50 text-orange-600 group-hover:bg-orange-600"
          />
          <DashboardLink
            href="/admin/popup"
            title="Sale Popup"
            subtitle="Manage promotional popup"
            icon={<LayoutTemplate className="w-8 h-8" />}
            color="bg-teal-50 text-teal-600 group-hover:bg-teal-600"
          />
        </div>
      </div>
    </div>
  );
}

function DashboardLink({ href, title, subtitle, icon, color }: any) {
  return (
    <Link href={href} className="group">
      <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all h-full flex flex-col justify-between">
        <div className="flex items-start justify-between mb-4">
          <div
            className={`p-3 rounded-xl group-hover:text-white transition-colors ${color}`}
          >
            {icon}
          </div>
          <ArrowRight className="w-5 h-5 text-gray-300 group-hover:text-gray-600 transition-colors" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-gray-900">{title}</h3>
          <p className="text-sm text-gray-500 mt-1">{subtitle}</p>
        </div>
      </div>
    </Link>
  );
}

function StatCard({ title, value, icon, color }: any) {
  return (
    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
      <div
        className={`w-12 h-12 rounded-full flex items-center justify-center shadow-md ${color}`}
      >
        {icon}
      </div>
      <div>
        <p className="text-gray-400 text-xs font-bold uppercase tracking-wider">
          {title}
        </p>
        <p className="text-2xl font-extrabold text-gray-900">{value}</p>
      </div>
    </div>
  );
}
