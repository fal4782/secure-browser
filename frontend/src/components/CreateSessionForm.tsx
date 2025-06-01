import { createSession } from "@/actions/sessionActions";

export function CreateSessionForm() {
  return (
    <form action={createSession} className="space-y-6">
      <div>
        <label
          htmlFor="url"
          className="block text-sm font-medium text-gray-300 mb-3"
        >
          Website URL
        </label>
        <input
          type="url"
          id="url"
          name="url"
          required
          placeholder="https://example.com"
          className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
        />
      </div>

      <button
        type="submit"
        className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-6 rounded-lg hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 font-medium"
      >
        Create Secure Session
      </button>
    </form>
  );
}
