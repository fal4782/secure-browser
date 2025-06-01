import { getActiveSessions } from "@/actions/sessionActions";
import { StopSessionButton } from "./StopSessionButton";
import { Monitor, Container, Clock, Eye, Wifi } from "lucide-react";

export async function ActiveSessions() {
  const sessions = await getActiveSessions();

  if (sessions.length === 0) {
    return (
      <div className="text-center py-8 sm:py-16">
        <div className="relative mb-4 sm:mb-6">
          <div className="w-16 h-16 sm:w-24 sm:h-24 mx-auto bg-gradient-to-br from-gray-700 to-gray-800 rounded-full flex items-center justify-center">
            <Monitor className="w-8 h-8 sm:w-12 sm:h-12 text-gray-400" />
          </div>
          <div className="absolute -top-1 -right-1 sm:-top-2 sm:-right-2 w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
            <Wifi className="w-3 h-3 sm:w-4 sm:h-4 text-white animate-pulse" />
          </div>
        </div>
        <h3 className="text-lg sm:text-xl font-semibold text-gray-300 mb-2">
          No Active Sessions
        </h3>
        <p className="text-gray-500 mb-4 text-sm sm:text-base px-4">
          Your secure browsing sessions will appear here
        </p>
        <div className="inline-flex items-center gap-2 text-xs sm:text-sm text-gray-400 bg-gray-800/50 px-3 py-2 sm:px-4 sm:py-2 rounded-full">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          Ready to create your first session
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      {sessions.map(
        (
          session: {
            containerId: string;
            url: string;
            vncPort: number;
            createdAt: string;
          },
          index: number
        ) => (
          <div
            key={session.containerId}
            className="group relative bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-sm border border-gray-600/30 rounded-xl sm:rounded-2xl p-4 sm:p-6 hover:border-blue-500/30 transition-all duration-500 transform hover:scale-[1.01] hover:shadow-xl hover:shadow-blue-500/10"
            style={{
              animationDelay: `${index * 100}ms`,
              animation: "fadeInUp 0.6s ease-out forwards",
            }}
          >
            {/* Animated background gradient */}
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-purple-500/5 to-indigo-500/5 rounded-xl sm:rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

            <div className="relative flex flex-col gap-4 sm:gap-6 overflow-hidden">
              <div className="flex-1 space-y-3 sm:space-y-4 min-w-0 overflow-hidden">
                {/* Header with status */}
                <div className="flex items-start gap-3 sm:gap-4 min-w-0 overflow-hidden">
                  <div className="relative flex-shrink-0 mt-1">
                    <div className="w-3 h-3 sm:w-4 sm:h-4 bg-green-500 rounded-full animate-pulse shadow-lg shadow-green-500/50"></div>
                    <div className="absolute inset-0 w-3 h-3 sm:w-4 sm:h-4 bg-green-500 rounded-full animate-ping opacity-30"></div>
                  </div>
                  <div className="flex-1 min-w-0 overflow-hidden">
                    <p
                      className="font-semibold text-white text-base sm:text-lg group-hover:text-blue-300 transition-colors duration-300 truncate cursor-help"
                      title={session.url}
                    >
                      {session.url}
                    </p>
                    <p className="text-xs sm:text-sm text-gray-400 flex items-center gap-2 mt-1">
                      <Wifi className="w-3 h-3 flex-shrink-0" />
                      <span>Secure Connection Active</span>
                    </p>
                  </div>
                </div>

                {/* Session details grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                  <div className="bg-gray-800/50 rounded-lg p-3 border border-gray-700/50 hover:border-gray-600/50 transition-colors duration-300">
                    <div className="flex items-center gap-2 mb-1">
                      <Container className="w-3 h-3 sm:w-4 sm:h-4 text-blue-400 flex-shrink-0" />
                      <span className="text-xs font-medium text-gray-400">
                        Container ID
                      </span>
                    </div>
                    <p className="text-xs sm:text-sm text-gray-200 font-mono bg-gray-900/50 px-2 py-1 rounded truncate">
                      {session.containerId.slice(0, 8)}...
                    </p>
                  </div>

                  <div className="bg-gray-800/50 rounded-lg p-3 border border-gray-700/50 hover:border-gray-600/50 transition-colors duration-300">
                    <div className="flex items-center gap-2 mb-1">
                      <Monitor className="w-3 h-3 sm:w-4 sm:h-4 text-purple-400 flex-shrink-0" />
                      <span className="text-xs font-medium text-gray-400">
                        VNC Port
                      </span>
                    </div>
                    <p className="text-xs sm:text-sm text-gray-200 font-mono bg-gray-900/50 px-2 py-1 rounded">
                      {session.vncPort}
                    </p>
                  </div>

                  <div className="bg-gray-800/50 rounded-lg p-3 border border-gray-700/50 hover:border-gray-600/50 transition-colors duration-300 sm:col-span-2 lg:col-span-1">
                    <div className="flex items-center gap-2 mb-1">
                      <Clock className="w-3 h-3 sm:w-4 sm:h-4 text-green-400 flex-shrink-0" />
                      <span className="text-xs font-medium text-gray-400">
                        Created
                      </span>
                    </div>
                    <p className="text-xs sm:text-sm text-gray-200">
                      {new Date(session.createdAt).toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex flex-col sm:flex-row-reverse gap-3 sm:gap-3">
                <a
                  href={`/session/${session.containerId}`}
                  className="group/btn relative overflow-hidden bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white px-4 py-2.5 sm:py-2.5 rounded-lg text-sm font-medium transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:shadow-green-500/25 text-center flex-1 sm:flex-initial"
                >
                  <div className="absolute inset-0 bg-white/20 translate-y-full group-hover/btn:translate-y-0 transition-transform duration-300"></div>
                  <div className="relative flex items-center justify-center gap-2">
                    <Eye className="w-4 h-4" />
                    View Session
                  </div>
                </a>
                <StopSessionButton containerId={session.containerId} />
              </div>
            </div>
          </div>
        )
      )}
    </div>
  );
}
