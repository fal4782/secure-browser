import { CreateSessionForm } from "@/components/CreateSessionForm";
import { ActiveSessions } from "@/components/ActiveSession";
import { Shield, Zap, Lock, Globe } from "lucide-react";

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      {/* Animated background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-20 -right-20 sm:-top-40 sm:-right-40 w-40 h-40 sm:w-80 sm:h-80 bg-blue-500/10 rounded-full animate-pulse"></div>
        <div
          className="absolute -bottom-20 -left-20 sm:-bottom-40 sm:-left-40 w-40 h-40 sm:w-80 sm:h-80 bg-purple-500/10 rounded-full animate-pulse"
          style={{ animationDelay: "1s" }}
        ></div>
        <div
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-48 h-48 sm:w-96 sm:h-96 bg-indigo-500/5 rounded-full animate-pulse"
          style={{ animationDelay: "2s" }}
        ></div>
      </div>

      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        {/* Hero Section */}
        <div className="text-center mb-12 sm:mb-16">
          <div className="relative inline-block mb-4 sm:mb-6">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full blur-xl opacity-30 animate-pulse"></div>
            <div className="relative w-16 h-16 sm:w-20 sm:h-20 mx-auto bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center shadow-2xl">
              <Shield className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
            </div>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-4 sm:mb-6">
            <span className="bg-gradient-to-r from-white via-blue-100 to-purple-100 bg-clip-text text-transparent">
              Secure Browser
            </span>
          </h1>

          <p className="text-lg sm:text-xl text-gray-300 mb-6 sm:mb-8 max-w-2xl mx-auto leading-relaxed px-4">
            Browse the web safely in isolated containers with enterprise-grade
            security
          </p>

          {/* Feature highlights */}
          <div className="flex flex-wrap justify-center gap-2 sm:gap-4 mb-6 sm:mb-8 px-4">
            {[
              {
                icon: Lock,
                text: "Isolated Environment",
                color: "text-blue-400",
              },
              { icon: Zap, text: "Lightning Fast", color: "text-yellow-400" },
              { icon: Globe, text: "Any Website", color: "text-green-400" },
            ].map((feature, index) => (
              <div
                key={index}
                className="flex items-center gap-1.5 sm:gap-2 bg-gray-800/50 backdrop-blur-sm px-3 py-1.5 sm:px-4 sm:py-2 rounded-full border border-gray-700/50 hover:border-gray-600/50 transition-all duration-300"
                style={{
                  animationDelay: `${index * 200}ms`,
                  animation: "fadeInUp 0.6s ease-out forwards",
                }}
              >
                <feature.icon
                  className={`w-3 h-3 sm:w-4 sm:h-4 ${feature.color}`}
                />
                <span className="text-xs sm:text-sm text-gray-300">
                  {feature.text}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-6 sm:space-y-8">
          {/* Create new session */}
          <div
            className="relative group"
            style={{
              animation: "fadeInUp 0.8s ease-out forwards",
              animationDelay: "0.2s",
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-indigo-500/20 rounded-xl sm:rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="relative bg-gray-800/60 backdrop-blur-sm border border-gray-700/50 rounded-xl sm:rounded-2xl p-6 sm:p-8 shadow-2xl hover:border-gray-600/50 transition-all duration-500">
              <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                  <Zap className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                </div>
                <h2 className="text-xl sm:text-2xl font-bold text-white">
                  Create New Session
                </h2>
              </div>
              <CreateSessionForm />
            </div>
          </div>

          {/* Active sessions */}
          <div
            className="relative group"
            style={{
              animation: "fadeInUp 0.8s ease-out forwards",
              animationDelay: "0.4s",
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-green-500/20 via-blue-500/20 to-purple-500/20 rounded-xl sm:rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="relative bg-gray-800/60 backdrop-blur-sm border border-gray-700/50 rounded-xl sm:rounded-2xl p-6 sm:p-8 shadow-2xl hover:border-gray-600/50 transition-all duration-500">
              <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-green-500 to-blue-500 rounded-lg flex items-center justify-center">
                  <Globe className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                </div>
                <h2 className="text-xl sm:text-2xl font-bold text-white">
                  Active Sessions
                </h2>
              </div>
              <ActiveSessions />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-12 sm:mt-16 pt-6 sm:pt-8 border-t border-gray-800/50">
          <p className="text-gray-500 text-xs sm:text-sm flex items-center justify-center gap-2 px-4">
            <Shield className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
            <span className="text-center">
              Your browsing sessions are protected by enterprise-grade isolation
            </span>
          </p>
        </div>
      </div>
    </main>
  );
}
