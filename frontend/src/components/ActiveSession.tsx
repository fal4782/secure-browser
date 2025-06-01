import { getActiveSessions } from "@/actions/sessionActions";
import { StopSessionButton } from "./StopSessionButton";

export async function ActiveSessions() {
  const sessions = await getActiveSessions();

  if (sessions.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-500 text-6xl mb-4">🌐</div>
        <p className="text-gray-400 text-lg">No active sessions</p>
        <p className="text-gray-500 text-sm mt-2">
          Create a new session to get started
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {sessions.map(
        (session: {
          containerId: string;
          url: string;
          vncPort: number;
          createdAt: string;
        }) => (
          <div
            key={session.containerId}
            className="bg-gray-700 border border-gray-600 rounded-lg p-6 hover:bg-gray-650 transition-colors"
          >
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                  <p className="font-medium text-white text-lg">
                    {session.url}
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <span className="text-gray-400">Container ID:</span>
                    <p className="text-gray-300 font-mono">
                      {session.containerId.slice(0, 12)}...
                    </p>
                  </div>
                  <div>
                    <span className="text-gray-400">VNC Port:</span>
                    <p className="text-gray-300 font-mono">{session.vncPort}</p>
                  </div>
                  <div>
                    <span className="text-gray-400">Created:</span>
                    <p className="text-gray-300">
                      {new Date(session.createdAt).toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex space-x-3 ml-6">
                <a
                  href={`/session/${session.containerId}`}
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                >
                  View Session
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
