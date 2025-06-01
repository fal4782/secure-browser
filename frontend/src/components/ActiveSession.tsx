import { getActiveSessions } from "@/actions/sessionActions";
import { StopSessionButton } from "./StopSessionButton";
import { Monitor, Container, Clock, Eye, Wifi } from "lucide-react";

export async function ActiveSessions() {
  const sessions = await getActiveSessions();

  if (sessions.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="relative mb-6">
          <div className="w-24 h-24 mx-auto bg-gradient-to-br from-gray-700 to-gray-800 rounded-full flex items-center justify-center">
            <Monitor className="w-12 h-12 text-gray-400" />
          </div>
          <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
            <Wifi className="w-4 h-4 text-white animate-pulse" />
          </div>
        </div>
        <h3 className="text-xl font-semibold text-gray-300 mb-2">
          No Active Sessions
        </h3>
        <p className="text-gray-500 mb-4">
          Your secure browsing sessions will appear here
        </p>
        <div className="inline-flex items-center gap-2 text-sm text-gray-400 bg-gray-800/50 px-4 py-2 rounded-full">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          Ready to create your first session
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
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
            className="group relative bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-sm border border-gray-600/30 rounded-2xl p-6 hover:border-blue-500/30 transition-all duration-500 transform hover:scale-[1.01] hover:shadow-xl hover:shadow-blue-500/10"
            style={{
              animationDelay: `${index * 100}ms`,
              animation: "fadeInUp 0.6s ease-out forwards",
            }}
          >
            {/* Animated background gradient */}
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-purple-500/5 to-indigo-500/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

            <div className="relative flex flex-col lg:flex-row lg:items-center gap-6">
              <div className="flex-1 space-y-4">
                {/* Header with status */}
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <div className="w-4 h-4 bg-green-500 rounded-full animate-pulse shadow-lg shadow-green-500/50"></div>
                    <div className="absolute inset-0 w-4 h-4 bg-green-500 rounded-full animate-ping opacity-30"></div>
                  </div>
                  <div className="flex-1 ">
                    <p
                      className="font-semibold text-white text-lg group-hover:text-blue-300 transition-colors duration-300 truncate cursor-help max-w-[300px] sm:max-w-[400px] lg:max-w-[500px]"
                      title={session.url}
                    >
                      {session.url}
                    </p>

                    <p className="text-sm text-gray-400 flex items-center gap-2 mt-1">
                      <Wifi className="w-3 h-3 flex-shrink-0" />
                      Secure Connection Active
                    </p>
                  </div>
                </div>

                {/* Session details grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-gray-800/50 rounded-lg p-3 border border-gray-700/50 hover:border-gray-600/50 transition-colors duration-300">
                    <div className="flex items-center gap-2 mb-1">
                      <Container className="w-4 h-4 text-blue-400" />
                      <span className="text-xs font-medium text-gray-400">
                        Container ID
                      </span>
                    </div>
                    <p className="text-sm text-gray-200 font-mono bg-gray-900/50 px-2 py-1 rounded">
                      {session.containerId.slice(0, 12)}...
                    </p>
                  </div>

                  <div className="bg-gray-800/50 rounded-lg p-3 border border-gray-700/50 hover:border-gray-600/50 transition-colors duration-300">
                    <div className="flex items-center gap-2 mb-1">
                      <Monitor className="w-4 h-4 text-purple-400" />
                      <span className="text-xs font-medium text-gray-400">
                        VNC Port
                      </span>
                    </div>
                    <p className="text-sm text-gray-200 font-mono bg-gray-900/50 px-2 py-1 rounded">
                      {session.vncPort}
                    </p>
                  </div>

                  <div className="bg-gray-800/50 rounded-lg p-3 border border-gray-700/50 hover:border-gray-600/50 transition-colors duration-300">
                    <div className="flex items-center gap-2 mb-1">
                      <Clock className="w-4 h-4 text-green-400" />
                      <span className="text-xs font-medium text-gray-400">
                        Created
                      </span>
                    </div>
                    <p className="text-sm text-gray-200">
                      {new Date(session.createdAt).toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex flex-col sm:flex-row lg:flex-col gap-3 lg:min-w-[140px]">
                {/* View Session button */}
                <a
                  href={`/session/${session.containerId}`}
                  className="group/btn relative overflow-hidden bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:shadow-green-500/25 text-center"
                >
                  <div className="absolute inset-0 bg-white/20 translate-y-full group-hover/btn:translate-y-0 transition-transform duration-300"></div>
                  <div className="relative flex items-center justify-center gap-2">
                    <Eye className="w-4 h-4" />
                    View Session
                  </div>
                </a>
                {/* Stop Session button */}
                <StopSessionButton containerId={session.containerId} />
              </div>
            </div>
          </div>
        )
      )}
    </div>
  );
}
