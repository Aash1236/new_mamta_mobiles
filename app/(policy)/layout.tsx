export default function PolicyLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-16 max-w-3xl">
        <div className="prose prose-green max-w-none text-gray-700 leading-relaxed font-sans">
          {children}
        </div>
      </div>
    </div>
  );
}