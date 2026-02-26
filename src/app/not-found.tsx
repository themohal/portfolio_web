import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gray-950 flex flex-col items-center justify-center px-4 text-center">
      {/* Glowing 404 */}
      <div className="relative mb-8">
        <p className="text-[10rem] md:text-[14rem] font-bold leading-none select-none bg-gradient-to-b from-white/20 to-white/5 bg-clip-text text-transparent">
          404
        </p>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-48 h-48 rounded-full bg-blue-600/10 blur-3xl" />
        </div>
      </div>

      <h1 className="text-2xl md:text-3xl font-bold text-white mb-3">
        Page not found
      </h1>
      <p className="text-gray-400 max-w-md mb-10 leading-relaxed">
        The page you&apos;re looking for doesn&apos;t exist or has been moved.
      </p>

      <div className="flex flex-col sm:flex-row gap-3">
        <Link
          href="/"
          className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-all shadow-lg shadow-blue-600/25 text-sm"
        >
          Go home
        </Link>
        <Link
          href="/blog"
          className="px-6 py-2.5 bg-white/10 hover:bg-white/20 text-white font-medium rounded-lg border border-white/10 transition-all text-sm"
        >
          Read the blog
        </Link>
      </div>

      {/* Subtle grid background */}
      <div className="fixed inset-0 -z-10 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: "linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)",
          backgroundSize: "64px 64px",
        }}
      />
    </div>
  );
}
