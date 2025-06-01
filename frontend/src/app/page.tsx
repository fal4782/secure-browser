import { CreateSessionForm } from "@/components/CreateSessionForm";
import { ActiveSessions } from "@/components/ActiveSession";
import { Shield, Zap, Lock, Globe } from "lucide-react";

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      {/* Animated background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500/10 rounded-full animate-pulse"></div>
        <div
          className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500/10 rounded-full animate-pulse"
          style={{ animationDelay: "1s" }}
        ></div>
        <div
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-500/5 rounded-full animate-pulse"
          style={{ animationDelay: "2s" }}
        ></div>
      </div>

      <div className="relative max-w-5xl mx-auto px-4 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="relative inline-block mb-6">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full blur-xl opacity-30 animate-pulse"></div>
            <div className="relative w-20 h-20 mx-auto bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center shadow-2xl">
              <Shield className="w-10 h-10 text-white" />
            </div>
          </div>

          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            <span className="bg-gradient-to-r from-white via-blue-100 to-purple-100 bg-clip-text text-transparent">
              Secure Browser
            </span>
          </h1>

          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto leading-relaxed">
            Browse the web safely in isolated containers with enterprise-grade
            security
          </p>

          {/* Feature highlights */}
          <div className="flex flex-wrap justify-center gap-4 mb-8">
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
                className="flex items-center gap-2 bg-gray-800/50 backdrop-blur-sm px-4 py-2 rounded-full border border-gray-700/50 hover:border-gray-600/50 transition-all duration-300"
                style={{
                  animationDelay: `${index * 200}ms`,
                  animation: "fadeInUp 0.6s ease-out forwards",
                }}
              >
                <feature.icon className={`w-4 h-4 ${feature.color}`} />
                <span className="text-sm text-gray-300">{feature.text}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-8">
          {/* Create new session */}
          <div
            className="relative group"
            style={{
              animation: "fadeInUp 0.8s ease-out forwards",
              animationDelay: "0.2s",
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-indigo-500/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="relative bg-gray-800/60 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-8 shadow-2xl hover:border-gray-600/50 transition-all duration-500">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                  <Zap className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-white">
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
            <div className="absolute inset-0 bg-gradient-to-r from-green-500/20 via-blue-500/20 to-purple-500/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="relative bg-gray-800/60 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-8 shadow-2xl hover:border-gray-600/50 transition-all duration-500">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-blue-500 rounded-lg flex items-center justify-center">
                  <Globe className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-white">
                  Active Sessions
                </h2>
              </div>
              <ActiveSessions />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-16 pt-8 border-t border-gray-800/50">
          <p className="text-gray-500 text-sm flex items-center justify-center gap-2">
            <Shield className="w-4 h-4" />
            Your browsing sessions are protected by enterprise-grade isolation
          </p>
        </div>
      </div>
    </main>
  );
}
