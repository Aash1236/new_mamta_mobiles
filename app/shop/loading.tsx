export default function Loading() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="container mx-auto">
        {/* Title Skeleton */}
        <div className="h-10 w-48 bg-gray-200 rounded-lg mb-8 animate-pulse"></div>

        {/* Product Grid Skeleton */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <div key={i} className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm animate-pulse">
              {/* Image */}
              <div className="bg-gray-200 h-48 w-full rounded-lg mb-4"></div>
              {/* Text Lines */}
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
              {/* Button */}
              <div className="h-10 bg-gray-200 rounded-lg w-full"></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}