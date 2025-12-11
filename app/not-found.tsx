import Link from "next/link";
import { Home, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4 bg-gray-50">
      {/* Big 404 Text */}
      <h1 className="text-9xl font-black text-gray-200 select-none">404</h1>
      
      <div className="absolute flex flex-col items-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-3">Page Not Found</h2>
        <p className="text-gray-500 mb-8 max-w-md">
          Oops! The page you are looking for might have been moved, deleted, or possibly never existed.
        </p>
        
        <div className="flex gap-4">
          <Link href="/">
            <button className="bg-[#006a55] text-white px-8 py-3 rounded-xl font-bold hover:bg-[#005544] transition-all flex items-center gap-2 shadow-lg shadow-[#006a55]/20 active:scale-95">
              <Home className="w-4 h-4" /> Go Home
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}