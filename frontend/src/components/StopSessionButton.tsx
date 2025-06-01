"use client";

import { stopSession } from "@/actions/sessionActions";

interface StopSessionButtonProps {
  containerId: string;
}

export function StopSessionButton({ containerId }: StopSessionButtonProps) {
  const handleStop = async () => {
    if (confirm("Are you sure you want to stop this session?")) {
      try {
        await stopSession(containerId);
      } catch {
        alert("Failed to stop session");
      }
    }
  };

  return (
    <button
      onClick={handleStop}
      className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
    >
      Stop Session
    </button>
  );
}
