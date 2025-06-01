"use client";

import { stopSession } from "@/actions/sessionActions";
import { Loader2, X } from "lucide-react";
import { useState } from "react";

interface StopSessionButtonProps {
  containerId: string;
}

export function StopSessionButton({ containerId }: StopSessionButtonProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleStop = async () => {
    if (!confirm("Are you sure you want to stop this session?")) {
      return;
    }

    setIsLoading(true);
    try {
      const result = await stopSession(containerId);
      if (!result.success) {
        console.error(
          `Failed to stop session: ${result.error || "Unknown error"}`
        );
      }
    } catch (error) {
      console.error("Error stopping session:", error);
      alert(
        `Failed to stop session: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handleStop}
      disabled={isLoading}
      className="group relative overflow-hidden bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700 text-white px-4 py-2.5 sm:py-2.5 rounded-lg text-sm font-medium transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:shadow-red-500/25 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none text-center flex-1 sm:flex-initial sm:min-w-[120px]"
    >
      <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
      <div className="relative flex items-center justify-center gap-2">
        {isLoading ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            <span className="hidden sm:inline">Stopping...</span>
            <span className="sm:hidden">...</span>
          </>
        ) : (
          <>
            <X className="w-4 h-4" />
            <span className="hidden sm:inline">Stop Session</span>
            <span className="sm:hidden">Stop</span>
          </>
        )}
      </div>
    </button>
  );
}
