import Link from "next/link";
import {
  ArrowLeft,
  Shield,
  Monitor,
  Container,
  Wifi,
  AlertCircle,
  Home,
} from "lucide-react";

interface SessionPageProps {
  params: Promise<{
    containerId: string;
  }>;
}

async function getSessionInfo(containerId: string) {
  const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

  try {
    const response = await fetch(`${API_BASE}/api/containers/${containerId}`, {
      cache: "no-store",
    });
    if (!response.ok) {
      throw new Error(`Failed to fetch session: ${response.statusText}`);
    }

    const data = await response.json();
    return data.success ? data.data : null;
  } catch (error) {
    console.error("Error fetching session:", error);
    return null;
  }
}

export default async function SessionPage({ params }: SessionPageProps) {
  const { containerId } = await params;
  const session = await getSessionInfo(containerId);

  if (!session) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center p-4">
        <div className="text-center max-w-md mx-auto">
          <div className="relative mb-8">
            <div className="w-16 h-16 sm:w-24 sm:h-24 mx-auto bg-gradient-to-br from-red-500/20 to-rose-600/20 rounded-full flex items-center justify-center border border-red-500/30">
              <AlertCircle className="w-8 h-8 sm:w-12 sm:h-12 text-red-400" />
            </div>
            <div className="absolute inset-0 w-16 h-16 sm:w-24 sm:h-24 mx-auto rounded-full bg-red-500/10 animate-ping"></div>
          </div>

          <h1 className="text-2xl sm:text-3xl font-bold text-white mb-4 bg-gradient-to-r from-white to-gray-300 bg-clip-text">
            Session Not Found
          </h1>
          <p className="text-gray-400 mb-8 leading-relaxed text-sm sm:text-base">
            The session you are looking for does not exist or has expired. This
            could happen if the session was terminated or timed out.
          </p>

          <Link
            href="/"
            className="group inline-flex items-center gap-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-4 py-2 sm:px-6 sm:py-3 rounded-xl font-medium transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:shadow-blue-500/25 text-sm sm:text-base"
          >
            <Home className="w-4 h-4 sm:w-5 sm:h-5 transition-transform duration-300 group-hover:-translate-x-1" />
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      {/* Animated Header */}
      <div className="relative bg-gray-800/80 backdrop-blur-sm border-b border-gray-700/50 shadow-2xl">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-purple-500/5 to-indigo-500/5"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-4 sm:py-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3 sm:gap-6 min-w-0">
              <div className="relative flex-shrink-0">
                <div className="w-4 h-4 sm:w-5 sm:h-5 bg-green-500 rounded-full animate-pulse shadow-lg shadow-green-500/50"></div>
                <div className="absolute inset-0 w-4 h-4 sm:w-5 sm:h-5 bg-green-500 rounded-full animate-ping opacity-30"></div>
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 sm:gap-3 mb-1 sm:mb-2">
                  <Shield className="w-5 h-5 sm:w-6 sm:h-6 text-blue-400 flex-shrink-0" />
                  <h1 className="text-lg sm:text-2xl font-bold text-white truncate">
                    Secure Browser Session
                  </h1>
                </div>
                <div className="flex items-center gap-2 text-gray-300 min-w-0">
                  <Wifi className="w-3 h-3 sm:w-4 sm:h-4 text-green-400 flex-shrink-0" />
                  <p
                    className="font-medium truncate text-sm sm:text-base cursor-help"
                    title={session.url}
                  >
                    {session.url}
                  </p>
                </div>
              </div>
            </div>

            <Link
              href="/"
              className="group flex items-center gap-2 text-gray-400 hover:text-white transition-all duration-300 bg-gray-700/50 hover:bg-gray-600/50 px-3 py-2 sm:px-4 sm:py-2 rounded-lg border border-gray-600/50 hover:border-gray-500/50 text-sm sm:text-base flex-shrink-0"
            >
              <ArrowLeft className="w-3 h-3 sm:w-4 sm:h-4 transition-transform duration-300 group-hover:-translate-x-1" />
              <span className="hidden sm:inline">Back to Home</span>
              <span className="sm:hidden">Back</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto p-3 sm:p-6">
        <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-xl sm:rounded-2xl shadow-2xl overflow-hidden hover:border-gray-600/50 transition-all duration-500">
          {/* VNC Header */}
          <div className="bg-gradient-to-r from-gray-800/80 to-gray-700/80 px-3 py-3 sm:px-6 sm:py-4 border-b border-gray-600/50">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
              <div className="flex items-center gap-2 sm:gap-3">
                <Monitor className="w-4 h-4 sm:w-5 sm:h-5 text-purple-400" />
                <h2 className="font-semibold text-white text-base sm:text-lg">
                  Remote Desktop
                </h2>
              </div>

              <div className="flex flex-wrap items-center gap-2 sm:gap-6 text-xs sm:text-sm">
                <div className="flex items-center gap-1 sm:gap-2 text-gray-300 bg-gray-700/50 px-2 py-1 sm:px-3 sm:py-1.5 rounded-md sm:rounded-lg">
                  <Container className="w-3 h-3 sm:w-4 sm:h-4 text-blue-400" />
                  <span className="font-mono text-xs">
                    {session.containerId.slice(0, 8)}...
                  </span>
                </div>

                <div className="flex items-center gap-1 sm:gap-2 text-gray-300 bg-gray-700/50 px-2 py-1 sm:px-3 sm:py-1.5 rounded-md sm:rounded-lg">
                  <Monitor className="w-3 h-3 sm:w-4 sm:h-4 text-green-400" />
                  <span>Port: {session.vncPort}</span>
                </div>

                <div className="hidden sm:flex items-center gap-2 text-gray-300 bg-gray-700/50 px-3 py-1.5 rounded-lg">
                  <span>1280×720</span>
                </div>
              </div>
            </div>
          </div>

          {/* VNC Viewer */}
          <div className="relative w-full bg-black overflow-hidden">
            <div
              className="w-full"
              style={{ paddingBottom: "56.25%" /* 16:9 aspect ratio */ }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 pointer-events-none"></div>
              <iframe
                src={`${session.vncUrl}?autoconnect=true&resize=scale&quality=6&compression=6`}
                className="absolute top-0 left-0 w-full h-full border-0"
                title="VNC Session"
                style={{
                  minHeight: "300px",
                }}
              />

              {/* Connection Status */}
              <div className="absolute top-2 right-2 sm:top-4 sm:right-4 bg-gray-800/90 backdrop-blur-sm px-2 py-1 sm:px-3 sm:py-2 rounded-md sm:rounded-lg border border-gray-600/50 z-10">
                <div className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm text-gray-300">
                  <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="hidden sm:inline">Connected</span>
                  <span className="sm:hidden">●</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions Panel */}
        <div className="mt-3 sm:mt-6 bg-gray-800/30 backdrop-blur-sm border border-gray-700/30 rounded-lg sm:rounded-xl p-3 sm:p-4">
          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-4 text-xs sm:text-sm text-gray-400">
            <div className="flex items-center gap-1 sm:gap-2">
              <Shield className="w-3 h-3 sm:w-4 sm:h-4 text-blue-400" />
              <span className="hidden sm:inline">Isolated Environment</span>
              <span className="sm:hidden">Isolated</span>
            </div>
            <div className="w-px h-3 sm:h-4 bg-gray-600"></div>
            <div className="flex items-center gap-1 sm:gap-2">
              <Wifi className="w-3 h-3 sm:w-4 sm:h-4 text-green-400" />
              <span className="hidden sm:inline">Secure Connection</span>
              <span className="sm:hidden">Secure</span>
            </div>
            <div className="w-px h-3 sm:h-4 bg-gray-600"></div>
            <div className="flex items-center gap-1 sm:gap-2">
              <Monitor className="w-3 h-3 sm:w-4 sm:h-4 text-purple-400" />
              <span className="hidden sm:inline">Remote Desktop</span>
              <span className="sm:hidden">Remote</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
