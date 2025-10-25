import { auth, signOut } from "@/auth";
import { redirect } from "next/navigation";

export default async function Dashboard() {
  const session = await auth();

  if (!session?.user) {
    redirect("/auth/signin");
  }

  return (
    <div className="min-h-screen bg-black">
      {/* Header */}
      <header className="border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-white">Elite Listing AI</h1>
            <div className="flex items-center gap-4">
              <span className="text-gray-400">
                {session.user.email}
              </span>
              <form
                action={async () => {
                  "use server";
                  await signOut({ redirectTo: "/" });
                }}
              >
                <button
                  type="submit"
                  className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition-colors"
                >
                  Sign Out
                </button>
              </form>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-white mb-2">
            Welcome back, {session.user.name || session.user.email}!
          </h2>
          <p className="text-gray-400">
            Your listing optimization dashboard
          </p>
        </div>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Connected Shops Card */}
          <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
            <h3 className="text-xl font-semibold text-white mb-2">
              Connected Shops
            </h3>
            <p className="text-gray-400 mb-4">
              No shops connected yet
            </p>
            <button className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors">
              Connect Shop
            </button>
          </div>

          {/* Listings Card */}
          <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
            <h3 className="text-xl font-semibold text-white mb-2">
              Listings
            </h3>
            <p className="text-gray-400 mb-4">
              0 listings to optimize
            </p>
            <button className="w-full py-2 px-4 bg-gray-700 text-gray-400 font-semibold rounded-lg cursor-not-allowed">
              View Listings
            </button>
          </div>

          {/* Optimizations Card */}
          <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
            <h3 className="text-xl font-semibold text-white mb-2">
              Optimizations
            </h3>
            <p className="text-gray-400 mb-4">
              0 completed
            </p>
            <button className="w-full py-2 px-4 bg-gray-700 text-gray-400 font-semibold rounded-lg cursor-not-allowed">
              View History
            </button>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8 bg-gray-900 border border-gray-800 rounded-lg p-6">
          <h3 className="text-xl font-semibold text-white mb-4">
            Quick Actions
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="border border-gray-700 rounded-lg p-4">
              <h4 className="font-semibold text-white mb-2">
                📸 Image Analysis
              </h4>
              <p className="text-gray-400 text-sm mb-3">
                Analyze your product photos with AI
              </p>
              <button className="text-blue-500 hover:text-blue-400 text-sm font-medium">
                Coming Soon →
              </button>
            </div>
            <div className="border border-gray-700 rounded-lg p-4">
              <h4 className="font-semibold text-white mb-2">
                ✍️ Text Optimization
              </h4>
              <p className="text-gray-400 text-sm mb-3">
                Optimize titles and descriptions
              </p>
              <button className="text-blue-500 hover:text-blue-400 text-sm font-medium">
                Coming Soon →
              </button>
            </div>
          </div>
        </div>

        {/* Status Banner */}
        <div className="mt-8 bg-blue-900/20 border border-blue-800 rounded-lg p-6">
          <div className="flex items-start gap-3">
            <div className="text-2xl">🚀</div>
            <div>
              <h4 className="font-semibold text-white mb-1">
                Phase 1: Foundation Complete!
              </h4>
              <p className="text-gray-300 text-sm">
                Authentication is working. Next up: Building the image analysis feature.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

