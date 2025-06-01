"use client";

import { createSession } from "@/actions/sessionActions";
import { Globe, Sparkles, Loader2 } from "lucide-react";
import { useFormStatus } from "react-dom";

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="group relative w-full overflow-hidden bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 text-white py-3 px-4 sm:py-4 sm:px-6 rounded-xl font-semibold text-base sm:text-lg transition-all duration-300 transform hover:scale-[1.02] hover:shadow-xl hover:shadow-blue-500/25 focus:outline-none focus:ring-2 focus:ring-blue-500/50 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none"
    >
      <div className="relative flex items-center justify-center gap-2 sm:gap-3">
        {pending ? (
          <>
            <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 animate-spin" />
            <span className="hidden sm:inline">Creating Session...</span>
            <span className="sm:hidden">Creating...</span>
          </>
        ) : (
          <>
            <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 animate-pulse" />
            <span className="hidden sm:inline">Create Secure Session</span>
            <span className="sm:hidden">Create Session</span>
            <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 animate-pulse" />
          </>
        )}
      </div>
    </button>
  );
}

export function CreateSessionForm() {
  return (
    <form action={createSession} className="space-y-4 sm:space-y-6">
      <div className="relative">
        <label
          htmlFor="url"
          className="text-sm font-semibold text-gray-200 mb-2 sm:mb-3 flex items-center gap-2"
        >
          <Globe className="w-3 h-3 sm:w-4 sm:h-4 text-blue-400" />
          Website URL
        </label>
        <div className="relative group">
          <input
            type="url"
            id="url"
            name="url"
            required
            placeholder="https://example.com"
            className="w-full px-3 py-3 sm:px-4 sm:py-4 bg-gray-800/50 backdrop-blur-sm border border-gray-600/50 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-300 hover:border-gray-500/50 hover:bg-gray-700/50 text-sm sm:text-base"
          />
          <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-500/10 to-purple-500/10 opacity-0 group-focus-within:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
        </div>
      </div>

      <SubmitButton />
    </form>
  );
}
