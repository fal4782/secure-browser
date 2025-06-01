import { CreateSessionForm } from "@/components/CreateSessionForm";
import { ActiveSessions } from "@/components/ActiveSession";

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-900 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">Secure Browser</h1>
          <p className="text-gray-400 text-lg">
            Browse the web safely in isolated containers
          </p>
        </div>

        <div className="space-y-8">
          {/* Create new session */}
          <div className="bg-gray-800 border border-gray-700 rounded-xl p-8 shadow-2xl">
            <h2 className="text-2xl font-semibold text-white mb-6">
              Create New Session
            </h2>
            <CreateSessionForm />
          </div>

          {/* Active sessions */}
          <div className="bg-gray-800 border border-gray-700 rounded-xl p-8 shadow-2xl">
            <h2 className="text-2xl font-semibold text-white mb-6">
              Active Sessions
            </h2>
            <ActiveSessions />
          </div>
        </div>
      </div>
    </main>
  );
}
