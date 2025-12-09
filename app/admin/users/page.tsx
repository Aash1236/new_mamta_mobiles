"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Loader2, ArrowLeft, Shield, User as UserIcon, Lock } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";

export default function UserManagementPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentUserEmail, setCurrentUserEmail] = useState("");

  // IMPORTANT: Replace this with the exact email you put in your .env.local
  const SUPER_ADMIN_EMAIL = "ashutoshfase1028@gmail.com"; 

  // Fetch Users & Current Admin Info
  const fetchUsers = async () => {
    try {
      const res = await fetch("/api/admin/users");
      if (res.ok) {
        const data = await res.json();
        setUsers(data);
      }
      
      // Get current logged-in admin email from local storage
      const userData = localStorage.getItem("user_info");
      if (userData) {
        setCurrentUserEmail(JSON.parse(userData).email);
      }
    } catch (error) {
      console.error("Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const toggleRole = async (userId: string, currentRole: string) => {
    const newRole = currentRole === "admin" ? "user" : "admin";
    
    // Optimistic Update
    setUsers(users.map(u => u._id === userId ? { ...u, role: newRole } : u));

    try {
      const res = await fetch(`/api/admin/users/${userId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role: newRole }),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success(`User is now an ${newRole}`);
      } else {
        toast.error(data.error || "Failed to update role");
        fetchUsers(); // Revert on failure
      }
    } catch (error) {
      toast.error("Something went wrong");
      fetchUsers();
    }
  };

  if (loading) {
    return <div className="h-screen flex items-center justify-center"><Loader2 className="animate-spin w-10 h-10 text-[#006a55]" /></div>;
  }

  // Check if the viewer is the Super Admin
  const isViewerSuperAdmin = currentUserEmail === SUPER_ADMIN_EMAIL;

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 font-sans">
      <Toaster position="bottom-center" />
      <div className="container mx-auto max-w-6xl">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">User Management</h1>
            <p className="text-gray-500">
              {isViewerSuperAdmin 
                ? "You have full control to promote/demote users." 
                : "View user list. (Only Super Admin can change roles)"}
            </p>
          </div>
          <Link 
            href="/admin/orders" 
            className="flex items-center gap-2 text-sm font-bold text-[#006a55] hover:bg-[#006a55]/5 border-2 border-[#006a55] px-5 py-2.5 rounded-xl transition-all active:scale-95"
          >
            <ArrowLeft className="w-4 h-4" /> Dashboard
          </Link>
        </div>

        {/* Users Table */}
        <div className="bg-white rounded-xl border-2 border-gray-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-[#006a55] text-white">
                <tr>
                  <th className="p-4 text-sm font-bold uppercase tracking-wider">Name</th>
                  <th className="p-4 text-sm font-bold uppercase tracking-wider">Email</th>
                  <th className="p-4 text-sm font-bold uppercase tracking-wider">Role</th>
                  <th className="p-4 text-sm font-bold uppercase tracking-wider text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {users.map((user) => {
                  const isTargetSuperAdmin = user.email === SUPER_ADMIN_EMAIL;

                  return (
                    <tr key={user._id} className={`hover:bg-gray-50 transition-colors ${isTargetSuperAdmin ? "bg-yellow-50/50" : ""}`}>
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                            isTargetSuperAdmin ? 'bg-yellow-100 text-yellow-600' :
                            user.role === 'admin' ? 'bg-[#006a55]/10 text-[#006a55]' : 
                            'bg-gray-100 text-gray-500'
                          }`}>
                            {isTargetSuperAdmin ? <Shield className="w-4 h-4 fill-current" /> : 
                             user.role === 'admin' ? <Shield className="w-4 h-4" /> : 
                             <UserIcon className="w-4 h-4" />}
                          </div>
                          <div>
                            <span className="font-bold text-gray-900 block">{user.name}</span>
                            {isTargetSuperAdmin && <span className="text-[10px] font-bold text-yellow-600 uppercase tracking-wider">Super Admin</span>}
                          </div>
                        </div>
                      </td>
                      <td className="p-4 text-sm text-gray-600">{user.email}</td>
                      <td className="p-4">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold border ${
                          isTargetSuperAdmin ? 'bg-yellow-100 text-yellow-700 border-yellow-200' :
                          user.role === 'admin' ? 'bg-[#006a55] text-white border-[#006a55]' : 
                          'bg-gray-100 text-gray-600 border-gray-200'
                        }`}>
                          {isTargetSuperAdmin ? "SUPER ADMIN" : user.role.toUpperCase()}
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        {/* Only show button if: 
                            1. Viewer IS Super Admin
                            2. Target IS NOT Super Admin 
                        */}
                        {isViewerSuperAdmin && !isTargetSuperAdmin ? (
                          <button 
                            onClick={() => toggleRole(user._id, user.role)}
                            className="text-xs font-bold text-[#006a55] hover:underline"
                          >
                            {user.role === 'admin' ? "Demote to User" : "Promote to Admin"}
                          </button>
                        ) : (
                          <span className="text-xs text-gray-400 flex items-center justify-end gap-1">
                            <Lock className="w-3 h-3" /> {isTargetSuperAdmin ? "Protected" : "Read Only"}
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}