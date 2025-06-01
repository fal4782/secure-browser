import Link from "next/link";

interface SessionPageProps {
  params: {
    containerId: string;
  };
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
  const session = await getSessionInfo(params.containerId);  

  if (!session) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-6">❌</div>
          <h1 className="text-3xl font-bold text-white mb-4">
            Session Not Found
          </h1>
          <p className="text-gray-400 mb-6">
            The session you are looking for does not exist or has expired.
          </p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors"
          >
            ← Back to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Header */}
      <div className="bg-gray-800 border-b border-gray-700 shadow-lg">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
              <div>
                <h1 className="text-xl font-semibold text-white">
                  Secure Browser Session
                </h1>
                <p className="text-sm text-gray-400">{session.url}</p>
              </div>
            </div>
            <Link
              href="/"
              className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
            >
              ← Back to Home
            </Link>
          </div>
        </div>
      </div>

      {/* VNC Container */}
      <div className="max-w-6xl mx-auto p-6">
        <div className="bg-gray-800 border border-gray-700 rounded-xl shadow-2xl overflow-hidden">
          <div className="bg-gray-750 px-6 py-4 border-b border-gray-600">
            <div className="flex items-center justify-between">
              <h2 className="font-medium text-white">Remote Desktop</h2>
              <div className="flex items-center gap-4 text-sm text-gray-400">
                <span>Container: {session.containerId.slice(0, 12)}...</span>
                <span>Port: {session.vncPort}</span>
              </div>
            </div>
          </div>

          <div className="aspect-video bg-black">
            <iframe
              src={session.vncUrl}
              className="w-full h-full border-0"
              title="VNC Session"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
