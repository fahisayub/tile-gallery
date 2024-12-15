import { Providers } from "@/app/providers";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Providers>
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white">
        <main className="container mx-auto px-4 pt-28 pb-8"> {/* Increased top padding to account for navbar height */}
          <h1 className="text-3xl font-bold mb-8 text-center">Image Upload Dashboard</h1>
          {children}
        </main>
      </div>
    </Providers>
  );
}
