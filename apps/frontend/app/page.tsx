"use client";
import Image from "next/image";
import { useState } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";

// Add custom CSS animations
const customStyles = `
  @keyframes blob {
    0% { transform: translate(0px, 0px) scale(1); }
    33% { transform: translate(30px, -50px) scale(1.1); }
    66% { transform: translate(-20px, 20px) scale(0.9); }
    100% { transform: translate(0px, 0px) scale(1); }
  }
  
  @keyframes fadeInUp {
    from { opacity: 0; transform: translateY(30px); }
    to { opacity: 1; transform: translateY(0); }
  }
  
  @keyframes slideInLeft {
    from { opacity: 0; transform: translateX(-30px); }
    to { opacity: 1; transform: translateX(0); }
  }
  
  @keyframes slideInRight {
    from { opacity: 0; transform: translateX(30px); }
    to { opacity: 1; transform: translateX(0); }
  }
  
  @keyframes float {
    0%, 100% { transform: translateY(0px); }
    50% { transform: translateY(-10px); }
  }
  
  .animate-blob { animation: blob 7s infinite; }
  .animate-fadeInUp { animation: fadeInUp 1s ease-out; }
  .animate-slideInLeft { animation: slideInLeft 1s ease-out; }
  .animate-slideInRight { animation: slideInRight 1s ease-out; }
  .animate-float { animation: float 3s ease-in-out infinite; }
  
  .animation-delay-200 { animation-delay: 0.2s; }
  .animation-delay-400 { animation-delay: 0.4s; }
  .animation-delay-600 { animation-delay: 0.6s; }
  .animation-delay-800 { animation-delay: 0.8s; }
  .animation-delay-2000 { animation-delay: 2s; }
  .animation-delay-4000 { animation-delay: 4s; }
`;

// Inject styles
if (typeof document !== "undefined") {
  const styleSheet = document.createElement("style");
  styleSheet.type = "text/css";
  styleSheet.innerText = customStyles;
  document.head.appendChild(styleSheet);
}

export default function Home() {
  const [activeTab, setActiveTab] = useState("vyapaar");

  return (
    <div className="min-h-screen bg-white py-2">
      {/* Hero Section - India's Leading Game of Skill */}
      <section className="mt-6 bg-gradient-to-br from-orange-50 via-blue-50 to-purple-50 py-12 sm:py-16 lg:py-20 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            <div className="animate-fadeInUp">
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-4 sm:mb-6 leading-tight animate-slideInLeft">
                <span className="inline-block hover:scale-105 transition-transform duration-300">
                  India's
                </span>{" "}
                <span className="inline-block hover:scale-105 transition-transform duration-300">
                  Leading
                </span>
                <br />
                <span className="text-gray-700 inline-block hover:scale-105 transition-transform duration-300">
                  Game
                </span>{" "}
                <span className="text-gray-700 inline-block hover:scale-105 transition-transform duration-300">
                  of
                </span>{" "}
                <span className="text-gray-700 inline-block hover:scale-105 transition-transform duration-300">
                  Skill
                </span>
              </h1>
              <p className="text-lg sm:text-xl text-gray-600 mb-6 sm:mb-8 animate-slideInLeft animation-delay-200">
                Sports, Entertainment, Economy or Finance.
              </p>
              <div className="flex items-center space-x-4 mb-6 animate-slideInLeft animation-delay-400">
                <button className="bg-black text-white px-6 sm:px-8 py-3 sm:py-4 rounded-lg font-semibold hover:bg-gray-800 hover:scale-105 hover:shadow-xl transition-all duration-300 text-sm sm:text-base transform active:scale-95 group">
                  <span className="group-hover:animate-pulse">
                    Download App
                  </span>
                  <span className="ml-2 group-hover:translate-x-1 transition-transform duration-200">
                    📱
                  </span>
                </button>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-500 mb-2 animate-slideInLeft animation-delay-600">
                <input
                  type="checkbox"
                  className="rounded hover:scale-110 transition-transform duration-200"
                />
                <span className="hover:text-gray-700 transition-colors duration-200">
                  For 18 years and above only
                </span>
              </div>
              <p className="text-xs text-gray-400 animate-slideInLeft animation-delay-800 hover:text-gray-600 transition-colors duration-200">
                We are currently unavailable in Andhra Pradesh, Assam,
                Chhattisgarh, Haryana, Nagaland, Sikkim, Tamil Nadu, and
                Telangana.
              </p>
            </div>
            <div className="relative mt-8 lg:mt-0 animate-fadeInRight">
              {/* Prediction Cards */}
              <div className="space-y-3 sm:space-y-4">
                <div className="bg-white rounded-xl p-3 sm:p-4 shadow-lg transform rotate-2 hover:rotate-0 hover:scale-105 transition-all duration-300 hover:shadow-2xl animate-slideInRight animation-delay-200">
                  <p className="text-xs sm:text-sm font-medium mb-2 sm:mb-3 hover:text-blue-600 transition-colors duration-200">
                    Virat Kohli to score 5 centuries in 2025?
                  </p>
                  <div className="flex space-x-2">
                    <button className="bg-blue-500 text-white px-3 sm:px-6 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm hover:bg-blue-600 hover:scale-105 transition-all duration-200 active:scale-95">
                      Yes
                    </button>
                    <button className="bg-red-500 text-white px-3 sm:px-6 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm hover:bg-red-600 hover:scale-105 transition-all duration-200 active:scale-95">
                      No
                    </button>
                  </div>
                </div>
                <div className="bg-white rounded-xl p-3 sm:p-4 shadow-lg transform -rotate-1 hover:rotate-0 hover:scale-105 transition-all duration-300 hover:shadow-2xl animate-slideInRight animation-delay-400">
                  <p className="text-xs sm:text-sm font-medium mb-2 sm:mb-3 hover:text-blue-600 transition-colors duration-200">
                    Bengaluru to win the Indian T20 League?
                  </p>
                  <div className="flex space-x-2">
                    <button className="bg-blue-500 text-white px-3 sm:px-6 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm hover:bg-blue-600 hover:scale-105 transition-all duration-200 active:scale-95">
                      Yes
                    </button>
                    <button className="bg-red-500 text-white px-3 sm:px-6 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm hover:bg-red-600 hover:scale-105 transition-all duration-200 active:scale-95">
                      No
                    </button>
                  </div>
                </div>
                <div className="bg-white rounded-xl p-3 sm:p-4 shadow-lg transform rotate-1 hover:rotate-0 hover:scale-105 transition-all duration-300 hover:shadow-2xl animate-slideInRight animation-delay-600">
                  <p className="text-xs sm:text-sm font-medium mb-2 sm:mb-3 hover:text-blue-600 transition-colors duration-200">
                    France to win the Football World Championship 2026
                  </p>
                  <div className="flex space-x-2">
                    <button className="bg-blue-500 text-white px-3 sm:px-6 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm hover:bg-blue-600 hover:scale-105 transition-all duration-200 active:scale-95">
                      Yes
                    </button>
                    <button className="bg-red-500 text-white px-3 sm:px-6 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm hover:bg-red-600 hover:scale-105 transition-all duration-200 active:scale-95">
                      No
                    </button>
                  </div>
                </div>
              </div>

              {/* Floating decorative elements */}
              <div className="absolute -top-4 -right-4 w-8 h-8 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full animate-bounce opacity-80"></div>
              <div className="absolute -bottom-2 -left-2 w-6 h-6 bg-gradient-to-r from-green-400 to-yellow-400 rounded-full animate-pulse"></div>
              <div className="absolute top-1/2 -right-8 w-4 h-4 bg-pink-400 rounded-full animate-ping"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Samachar Vichaar Vyapaar Section */}
      <section className="bg-gray-900 text-white py-12 sm:py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            <div>
              {/* Interactive Tabs */}
              <div className="flex flex-wrap gap-2 sm:gap-4 mb-6 sm:mb-8">
                <button
                  className="group relative px-3 sm:px-6 py-2 sm:py-3 text-lg sm:text-xl font-semibold transition-colors duration-500 cursor-pointer z-10"
                  onClick={(e) => {
                    e.preventDefault();
                    setActiveTab("samachar");
                  }}>
                  <span
                    className={`relative z-20 ${activeTab === "samachar" ? "text-blue-400" : "text-gray-400"} transition-colors duration-500 pointer-events-none`}>
                    Samachar
                  </span>
                  <div
                    className={`absolute bottom-0 left-0 h-0.5 bg-blue-400 transition-all duration-500 ${activeTab === "samachar" ? "w-full" : "w-0 group-hover:w-full"}`}></div>
                  <div className="absolute inset-0 bg-blue-400/10 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  {activeTab === "samachar" && (
                    <div className="absolute -top-1 -right-1 w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                  )}
                </button>

                <button
                  className="group relative px-3 sm:px-6 py-2 sm:py-3 text-lg sm:text-xl font-semibold transition-colors duration-500 cursor-pointer z-10"
                  onClick={(e) => {
                    e.preventDefault();
                    setActiveTab("vichaar");
                  }}>
                  <span
                    className={`relative z-20 ${activeTab === "vichaar" ? "text-purple-400" : "text-gray-400"} transition-colors duration-500 pointer-events-none`}>
                    Vichaar
                  </span>
                  <div
                    className={`absolute bottom-0 left-0 h-0.5 bg-purple-400 transition-all duration-500 ${activeTab === "vichaar" ? "w-full" : "w-0 group-hover:w-full"}`}></div>
                  <div className="absolute inset-0 bg-purple-400/10 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  {activeTab === "vichaar" && (
                    <div className="absolute -top-1 -right-1 w-2 h-2 bg-purple-400 rounded-full animate-pulse"></div>
                  )}
                </button>

                <button
                  className="group relative px-3 sm:px-6 py-2 sm:py-3 text-lg sm:text-xl font-semibold transition-colors duration-500 cursor-pointer z-10"
                  onClick={(e) => {
                    e.preventDefault();
                    setActiveTab("vyapaar");
                  }}>
                  <span
                    className={`relative z-20 ${activeTab === "vyapaar" ? "text-green-400" : "text-gray-400"} transition-colors duration-500 pointer-events-none`}>
                    Vyapaar
                  </span>
                  <div
                    className={`absolute bottom-0 left-0 h-0.5 bg-green-400 transition-all duration-500 ${activeTab === "vyapaar" ? "w-full" : "w-0 group-hover:w-full"}`}></div>
                  <div className="absolute inset-0 bg-green-400/10 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  {activeTab === "vyapaar" && (
                    <div className="absolute -top-1 -right-1 w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  )}
                </button>
              </div>

              {/* Dynamic Content */}
              <div className="min-h-[150px] sm:min-h-[200px]">
                {activeTab === "samachar" && (
                  <div className="transition-all duration-500 ease-in-out">
                    <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-4 sm:mb-6 text-blue-400">
                      Stay Informed
                    </h2>
                    <p className="text-base sm:text-lg lg:text-xl text-gray-300 leading-relaxed mb-4">
                      Get real-time news and updates from trusted sources. Stay
                      ahead with the latest developments in politics, sports,
                      entertainment, and more.
                    </p>
                    <div className="flex flex-wrap items-center gap-4 mt-4 sm:mt-6">
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 bg-blue-400 rounded-full animate-pulse"></div>
                        <span className="text-xs sm:text-sm text-gray-400">
                          Live Updates
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                        <span className="text-xs sm:text-sm text-gray-400">
                          Verified Sources
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === "vichaar" && (
                  <div className="transition-all duration-500 ease-in-out">
                    <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-4 sm:mb-6 text-purple-400">
                      Form Opinions
                    </h2>
                    <p className="text-base sm:text-lg lg:text-xl text-gray-300 leading-relaxed mb-4">
                      Analyze information, engage in discussions, and develop
                      well-informed perspectives on current events and future
                      outcomes.
                    </p>
                    <div className="flex flex-wrap items-center gap-4 mt-4 sm:mt-6">
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 bg-purple-400 rounded-full animate-pulse"></div>
                        <span className="text-xs sm:text-sm text-gray-400">
                          Expert Analysis
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                        <span className="text-xs sm:text-sm text-gray-400">
                          Community Insights
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === "vyapaar" && (
                  <div className="transition-all duration-500 ease-in-out">
                    <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-4 sm:mb-6 text-green-400">
                      Trade & Profit
                    </h2>
                    <p className="text-base sm:text-lg lg:text-xl text-gray-300 leading-relaxed mb-4">
                      Apply your knowledge to real-world events and make
                      informed trading decisions to enhance your experience and
                      earn rewards.
                    </p>
                    <div className="flex flex-wrap items-center gap-4 mt-4 sm:mt-6">
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                        <span className="text-xs sm:text-sm text-gray-400">
                          Real-time Trading
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 bg-orange-400 rounded-full"></div>
                        <span className="text-xs sm:text-sm text-gray-400">
                          Instant Rewards
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="flex justify-center mt-8 lg:mt-0">
              {/* Authentic Mobile Mockup */}
              <div className="relative group cursor-pointer">
                {/* Phone Container */}
                <div className="bg-black rounded-[2.5rem] p-2 w-80 h-[42rem] shadow-2xl transition-all duration-700 ease-out group-hover:shadow-3xl group-hover:-translate-y-2">
                  {/* Screen */}
                  <div className="bg-white rounded-[2rem] h-full relative overflow-hidden">
                    {/* Status Bar */}
                    <div className="flex items-center justify-between px-6 py-3 bg-white">
                      <div className="flex items-center space-x-4">
                        <span className="text-gray-800 text-lg">←</span>
                        <span className="text-gray-600 text-sm font-medium">
                          {activeTab === "samachar"
                            ? "News"
                            : activeTab === "vichaar"
                              ? "Opinions"
                              : "Trading"}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-gray-800 text-lg">🔍</span>
                        <span className="text-gray-800 text-lg">↗</span>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="px-6 pb-6 h-full flex flex-col">
                      {/* Brand Logo */}
                      <div className="text-center mb-4 transform transition-all duration-500 group-hover:scale-105">
                        <div className="inline-flex items-center bg-gray-900 text-white px-3 py-1 rounded-full text-sm font-medium group-hover:bg-gray-800">
                          <span className="mr-2">🐅</span>
                          <span>THE BULL</span>
                        </div>
                      </div>

                      {/* Question */}
                      <div className="text-center mb-4 transform transition-all duration-500 group-hover:scale-105">
                        <h3 className="text-base font-semibold text-gray-900 mb-2 leading-tight group-hover:text-gray-800">
                          {activeTab === "samachar"
                            ? "Will the next election results surprise everyone?"
                            : activeTab === "vichaar"
                              ? "What do you think about the new policy changes?"
                              : "Will Indian startups raise more funding in 2024 as compared to 2023?"}
                        </h3>
                        <div className="flex items-center justify-center text-xs text-gray-500 mb-1 group-hover:text-gray-600 transition-colors duration-300">
                          <span className="w-2 h-2 bg-orange-400 rounded-full mr-2 group-hover:animate-pulse"></span>
                          <span>
                            {activeTab === "samachar"
                              ? "Breaking news updated 2 minutes ago"
                              : activeTab === "vichaar"
                                ? "Join the discussion with 1.2K participants"
                                : "Indian startups raised a funding of around $11.3 B"}
                          </span>
                        </div>
                      </div>

                      {/* Market Prediction */}
                      <div className="text-center mb-4 transform transition-all duration-500 group-hover:scale-110">
                        <p className="text-xs text-gray-500 uppercase tracking-wide mb-1 group-hover:text-gray-600 transition-colors duration-300">
                          THE MARKET PREDICTS
                        </p>
                        <p
                          className={`text-2xl font-bold transition-all duration-500 group-hover:drop-shadow-md ${
                            activeTab === "samachar"
                              ? "text-blue-600 group-hover:text-blue-700"
                              : activeTab === "vichaar"
                                ? "text-purple-600 group-hover:text-purple-700"
                                : "text-green-600 group-hover:text-green-700"
                          }`}>
                          {activeTab === "samachar"
                            ? "45% probability"
                            : activeTab === "vichaar"
                              ? "78% probability"
                              : "60% probability of yes"}
                        </p>
                      </div>

                      {/* Chart */}
                      <div className=" h-fit mb-6">
                        <div className="h-40 bg-gray-50 rounded-xl p-3 relative transform transition-all duration-500 group-hover:bg-gray-100 group-hover:shadow-md">
                          {/* Y-axis labels */}
                          <div className="absolute left-2 top-4 bottom-4 flex flex-col justify-between text-xs text-gray-400">
                            <span>70</span>
                            <span>60</span>
                            <span>50</span>
                            <span>40</span>
                            <span>30</span>
                            <span>20</span>
                            <span>10</span>
                          </div>

                          {/* Chart Area */}
                          <div className="ml-8 mr-4 h-full relative">
                            <svg
                              className="w-full h-full"
                              viewBox="0 0 300 160"
                              preserveAspectRatio="none">
                              <defs>
                                <linearGradient
                                  id="chartGradient"
                                  x1="0%"
                                  y1="0%"
                                  x2="0%"
                                  y2="100%">
                                  <stop
                                    offset="0%"
                                    stopColor={
                                      activeTab === "samachar"
                                        ? "#3b82f6"
                                        : activeTab === "vichaar"
                                          ? "#8b5cf6"
                                          : "#10b981"
                                    }
                                    stopOpacity="0.3"
                                  />
                                  <stop
                                    offset="100%"
                                    stopColor={
                                      activeTab === "samachar"
                                        ? "#3b82f6"
                                        : activeTab === "vichaar"
                                          ? "#8b5cf6"
                                          : "#10b981"
                                    }
                                    stopOpacity="0"
                                  />
                                </linearGradient>
                              </defs>

                              {/* Chart line */}
                              <path
                                d="M0,120 Q50,100 100,80 T200,60 Q250,50 300,45"
                                stroke={
                                  activeTab === "samachar"
                                    ? "#3b82f6"
                                    : activeTab === "vichaar"
                                      ? "#8b5cf6"
                                      : "#10b981"
                                }
                                strokeWidth="3"
                                fill="none"
                                className="transition-all duration-500"
                              />

                              {/* Fill area */}
                              <path
                                d="M0,120 Q50,100 100,80 T200,60 Q250,50 300,45 L300,160 L0,160 Z"
                                fill="url(#chartGradient)"
                                className="transition-all duration-500"
                              />
                            </svg>
                          </div>

                          {/* X-axis labels */}
                          <div className="absolute bottom-2 left-8 right-4 flex justify-between text-xs text-gray-400">
                            <span>9:25 pm</span>
                            <span>10:30 pm</span>
                            <span>8:27 pm</span>
                          </div>
                        </div>
                      </div>

                      {/* Time Intervals */}
                      <div className="flex items-center justify-between mb-4 bg-gray-100 rounded-lg p-1 transform transition-all duration-300 group-hover:bg-gray-200">
                        <button className="px-3 py-2 text-xs font-medium bg-gray-900 text-white rounded-md">
                          5 m
                        </button>
                        <button className="px-3 py-2 text-xs font-medium text-gray-600">
                          15 m
                        </button>
                        <button className="px-3 py-2 text-xs font-medium text-gray-600">
                          30 m
                        </button>
                        <button className="px-3 py-2 text-xs font-medium text-gray-600">
                          1 hr
                        </button>
                        <button className="px-3 py-2 text-xs font-medium text-gray-600">
                          All
                        </button>
                        <button className="px-3 py-2 text-xs font-medium text-gray-600">
                          📈
                        </button>
                      </div>

                      {/* Trading Buttons */}
                      <div className="flex space-x-3 px-2 mt-4">
                        <button className="flex-1 bg-blue-500 text-white py-3 px-4 rounded-xl font-semibold text-sm hover:bg-blue-600 transform transition-all duration-300 hover:scale-105 active:scale-95 group-hover:shadow-lg">
                          Yes ₹
                          {activeTab === "samachar"
                            ? "6"
                            : activeTab === "vichaar"
                              ? "8"
                              : "6"}
                        </button>
                        <button className="flex-1 bg-red-500 text-white py-3 px-4 rounded-xl font-semibold text-sm hover:bg-red-600 transform transition-all duration-300 hover:scale-105 active:scale-95 group-hover:shadow-lg">
                          No ₹
                          {activeTab === "samachar"
                            ? "4"
                            : activeTab === "vichaar"
                              ? "2"
                              : "4"}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Floating Decorative Elements */}
                <div className="absolute -top-3 -right-3 w-8 h-8 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full opacity-80 animate-float"></div>
                <div className="absolute -bottom-2 -left-2 w-6 h-6 bg-gradient-to-r from-green-400 to-yellow-400 rounded-full opacity-70 animate-pulse"></div>

                {/* Subtle Glow Effect */}
                <div className="absolute inset-0 rounded-[2.5rem] opacity-0 group-hover:opacity-20 transition-opacity duration-700 bg-gradient-to-r from-blue-400/20 via-purple-400/20 to-green-400/20 blur-xl -z-10"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stay in Control Section */}
      <section className="py-12 sm:py-16 lg:py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            <div>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-6 sm:mb-8 leading-tight">
                Stay in control —<br />
                <span className="text-gray-700">
                  play what you like,
                  <br />
                  when you like.
                </span>
              </h2>
            </div>
            <div className="space-y-4">
              {/* Trading Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white rounded-xl p-4 shadow-lg hover:shadow-2xl hover:scale-105 transition-all duration-300 group animate-slideInRight animation-delay-200">
                  <div className="flex items-center mb-2">
                    <div className="w-8 h-8 bg-orange-100 rounded-full mr-2 group-hover:scale-110 transition-transform duration-200 flex items-center justify-center">
                      <span className="group-hover:animate-bounce">🇮🇳</span>
                    </div>
                    <span className="text-xs text-gray-500 group-hover:text-gray-700 transition-colors duration-200">
                      <span className="animate-pulse">●</span> 1600 traders
                    </span>
                  </div>
                  <p className="text-sm font-medium mb-3 group-hover:text-blue-600 transition-colors duration-200">
                    Will India's GDP growth rate be 6.5% or more in FY25-26?
                  </p>
                  <div className="flex space-x-2">
                    <button className="bg-blue-500 text-white px-3 py-1 rounded text-xs hover:bg-blue-600 hover:scale-105 transition-all duration-200 active:scale-95">
                      Yes ₹7
                    </button>
                    <button className="bg-red-500 text-white px-3 py-1 rounded text-xs hover:bg-red-600 hover:scale-105 transition-all duration-200 active:scale-95">
                      No ₹3
                    </button>
                  </div>
                </div>
                <div className="bg-white rounded-xl p-4 shadow-lg hover:shadow-2xl hover:scale-105 transition-all duration-300 group animate-slideInRight animation-delay-400">
                  <div className="flex items-center mb-2">
                    <div className="w-8 h-8 bg-blue-100 rounded-full mr-2 group-hover:scale-110 transition-transform duration-200 flex items-center justify-center">
                      <span className="group-hover:animate-bounce">🇺🇸</span>
                    </div>
                    <span className="text-xs text-gray-500 group-hover:text-gray-700 transition-colors duration-200">
                      <span className="animate-pulse">●</span> 1289 traders
                    </span>
                  </div>
                  <p className="text-sm font-medium mb-3 group-hover:text-blue-600 transition-colors duration-200">
                    Will USA enter into recession by the end of July 2025?
                  </p>
                  <div className="flex space-x-2">
                    <button className="bg-blue-500 text-white px-3 py-1 rounded text-xs hover:bg-blue-600 hover:scale-105 transition-all duration-200 active:scale-95">
                      Yes ₹1
                    </button>
                    <button className="bg-red-500 text-white px-3 py-1 rounded text-xs hover:bg-red-600 hover:scale-105 transition-all duration-200 active:scale-95">
                      No ₹9
                    </button>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-xl p-4 shadow-lg hover:shadow-2xl hover:scale-105 transition-all duration-300 group animate-slideInRight animation-delay-600">
                <div className="flex items-center mb-2">
                  <div className="w-8 h-8 bg-green-100 rounded-full mr-2 group-hover:scale-110 transition-transform duration-200 flex items-center justify-center">
                    <span className="group-hover:animate-bounce">👨</span>
                  </div>
                  <span className="text-xs text-gray-500 group-hover:text-gray-700 transition-colors duration-200">
                    <span className="animate-pulse">●</span> 3083 traders
                  </span>
                </div>
                <p className="text-sm font-medium mb-3 group-hover:text-blue-600 transition-colors duration-200">
                  Will Virat Kohli surpass Sachin Tendulkar's International
                  Cricket centuries by the end of 2027?
                </p>
                <div className="flex space-x-2">
                  <button className="bg-blue-500 text-white px-3 py-1 rounded text-xs hover:bg-blue-600 hover:scale-105 transition-all duration-200 active:scale-95">
                    Yes ₹1
                  </button>
                  <button className="bg-red-500 text-white px-3 py-1 rounded text-xs hover:bg-red-600 hover:scale-105 transition-all duration-200 active:scale-95">
                    No ₹9
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Bento Grid Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-6 lg:grid-cols-12 gap-6">
            {/* What's new card - Small */}
            <div className="md:col-span-2 lg:col-span-3 bg-white rounded-3xl p-8 shadow-sm hover:shadow-xl hover:scale-105 transition-all duration-300 group cursor-pointer animate-fadeInUp animation-delay-200">
              <h3 className="text-2xl font-bold text-gray-900 mb-8 leading-tight group-hover:text-purple-600 transition-colors duration-300">
                What's new in opTrade?
              </h3>
              <div className="flex justify-end">
                <div className="text-gray-800 text-6xl transform -rotate-12 group-hover:rotate-0 group-hover:scale-110 group-hover:text-purple-600 transition-all duration-300 animate-float">
                  →
                </div>
              </div>
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-blue-500/10 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </div>

            {/* Trust & Safety card - Medium */}
            <div className="md:col-span-4 lg:col-span-5 bg-gray-900 rounded-3xl p-8 text-white relative overflow-hidden hover:scale-105 transition-all duration-300 group cursor-pointer animate-fadeInUp animation-delay-400">
              <h3 className="text-2xl font-bold mb-4 group-hover:text-blue-400 transition-colors duration-300">
                opTrade Trust & Safety
              </h3>
              <p className="text-gray-300 mb-6 leading-relaxed text-sm group-hover:text-gray-200 transition-colors duration-300">
                Be it loss protection or data security, opTrade is user first
                always. Check out the latest on responsible trading.
              </p>
              <button className="text-white text-sm hover:underline flex items-center group mb-4 hover:text-blue-400 transition-colors duration-300">
                Read more
                <span className="ml-2 transition-transform group-hover:translate-x-2 group-hover:animate-bounce">
                  →
                </span>
              </button>
              {/* Family illustration placeholder */}
              <div className="absolute bottom-0 right-0 w-32 h-32 bg-gray-800 rounded-tl-3xl flex items-center justify-center group-hover:bg-gray-700 transition-colors duration-300">
                <div className="text-4xl group-hover:scale-110 group-hover:animate-bounce transition-transform duration-300">
                  👨‍👩‍👧‍👦
                </div>
              </div>
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </div>

            {/* Exiting trades card - Medium */}
            <div className="md:col-span-3 lg:col-span-4 bg-gray-900 rounded-3xl p-8 text-white relative overflow-hidden hover:scale-105 transition-all duration-300 group cursor-pointer animate-fadeInUp animation-delay-600">
              <h3 className="text-2xl font-bold mb-4 group-hover:text-red-400 transition-colors duration-300">
                Exiting trades is your choice
              </h3>
              <p className="text-gray-300 mb-6 leading-relaxed text-sm group-hover:text-gray-200 transition-colors duration-300">
                The 'Exit' feature gives the user an opportunity to exit from
                the current trade and helps in controlling your losses and
                maximising the profit.
              </p>
              <button className="text-white text-sm hover:underline flex items-center group mb-4 hover:text-red-400 transition-colors duration-300">
                Read more
                <span className="ml-2 transition-transform group-hover:translate-x-2 group-hover:animate-bounce">
                  →
                </span>
              </button>
              {/* Trading visualization */}
              <div className="absolute bottom-4 right-4 flex space-x-2 group-hover:scale-110 transition-transform duration-300">
                <div className="w-8 h-16 bg-red-500 rounded-sm group-hover:animate-pulse"></div>
                <div className="w-8 h-12 bg-blue-500 rounded-sm group-hover:animate-pulse animation-delay-200"></div>
                <div className="w-8 h-20 bg-red-400 rounded-sm group-hover:animate-pulse animation-delay-400"></div>
                <div className="w-4 h-4 bg-yellow-500 rounded-full mt-8 group-hover:animate-bounce"></div>
                <div className="text-orange-400 text-2xl group-hover:animate-bounce animation-delay-200">
                  📊
                </div>
              </div>
              <div className="absolute inset-0 bg-gradient-to-r from-red-500/10 to-orange-500/10 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </div>

            {/* Market Orders card - Large */}
            <div className="md:col-span-6 lg:col-span-8 bg-gray-900 rounded-3xl p-8 text-white relative overflow-hidden hover:scale-105 transition-all duration-300 group cursor-pointer animate-fadeInUp animation-delay-800">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-3xl font-bold mb-6 group-hover:text-green-400 transition-colors duration-300">
                    Market Orders and Instant Exit
                  </h3>
                  <p className="text-gray-300 mb-6 leading-relaxed group-hover:text-gray-200 transition-colors duration-300">
                    Market orders are a fast and reliable method to buy or exit
                    a trade in a fast-moving market. With market orders,
                    quantities are matched almost instantly after placing an
                    order at the best available price. Come test drive.
                  </p>
                  <button className="text-white text-sm hover:underline flex items-center group hover:text-green-400 transition-colors duration-300">
                    Read more
                    <span className="ml-2 transition-transform group-hover:translate-x-2 group-hover:animate-bounce">
                      →
                    </span>
                  </button>
                </div>
                <div className="hidden lg:flex justify-center items-center relative">
                  {/* 3D Trading visualization */}
                  <div className="relative group-hover:scale-110 transition-transform duration-300">
                    {/* Monitor/Screen */}
                    <div className="w-32 h-24 bg-gray-800 rounded-lg border-4 border-gray-700 relative group-hover:border-green-500 transition-colors duration-300">
                      <div className="w-full h-full bg-green-900 rounded flex items-center justify-center group-hover:bg-green-800 transition-colors duration-300">
                        <div className="text-green-400 text-xs group-hover:animate-pulse">
                          📈
                        </div>
                      </div>
                    </div>
                    {/* Floating elements */}
                    <div className="absolute -top-4 -left-8 w-12 h-12 bg-pink-500 rounded-lg transform rotate-12 group-hover:rotate-45 group-hover:animate-bounce transition-all duration-300"></div>
                    <div className="absolute -top-2 right-8 w-8 h-12 bg-yellow-500 rounded-full group-hover:animate-pulse"></div>
                    <div className="absolute bottom-8 -right-4 w-6 h-6 bg-green-500 rounded-full group-hover:animate-ping"></div>
                    <div className="absolute bottom-4 left-8 text-blue-400 text-xl group-hover:animate-bounce">
                      💰
                    </div>
                  </div>
                </div>
              </div>
              <div className="absolute inset-0 bg-gradient-to-r from-green-500/10 to-blue-500/10 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </div>

            {/* Power of Prediction card - Large */}
            <div className="md:col-span-4 lg:col-span-4 bg-gray-900 rounded-3xl p-8 text-white relative overflow-hidden hover:scale-105 transition-all duration-300 group cursor-pointer animate-fadeInUp animation-delay-1000">
              <h3 className="text-2xl font-bold mb-4 group-hover:text-yellow-400 transition-colors duration-300">
                The Power of Prediction Markets
              </h3>
              <p className="text-gray-300 mb-6 leading-relaxed text-sm group-hover:text-gray-200 transition-colors duration-300">
                Check out case studies, research articles and the utility of
                opTrade events
              </p>
              <button className="text-white text-sm hover:underline flex items-center group mb-4 hover:text-yellow-400 transition-colors duration-300">
                Read more
                <span className="ml-2 transition-transform group-hover:translate-x-2 group-hover:animate-bounce">
                  →
                </span>
              </button>
              {/* Person illustration placeholder */}
              <div className="absolute bottom-0 right-0 w-24 h-32 bg-gray-800 rounded-tl-3xl flex items-end justify-center group-hover:bg-gray-700 transition-colors duration-300">
                <div className="text-3xl mb-2 group-hover:scale-110 group-hover:animate-bounce transition-transform duration-300">
                  👩‍💼
                </div>
              </div>
              <div className="absolute inset-0 bg-gradient-to-r from-yellow-500/10 to-orange-500/10 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Smart Choices Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold text-gray-900 mb-8">
              Smart choices, responsible play.
              <br />
              opTrade puts you first.
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <div className="w-8 h-8 bg-purple-600 rounded-full"></div>
              </div>
              <h3 className="text-xl font-semibold mb-4">
                Fastest news feed in the game
              </h3>
              <p className="text-gray-600 text-sm">
                opTrade is all about understanding the world around us and bene
                fitting from our knowledge. Everything on opTrade is based on
                real events that you can learn about, verify and follow
                yourself.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <div
                  className="w-8 h-8 bg-purple-600 rounded-full"
                  style={{
                    clipPath: "polygon(50% 0%, 0% 100%, 100% 100%)",
                  }}></div>
              </div>
              <h3 className="text-xl font-semibold mb-4">
                All the news without the noise
              </h3>
              <p className="text-gray-600 text-sm">
                Our experts go through tons of information to get to the very
                core of a world event. They help you form well-informed
                perspectives about events but also a better understanding of the
                world around us.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <div className="w-8 h-8 bg-purple-600 rounded-full"></div>
              </div>
              <h3 className="text-xl font-semibold mb-4">
                The power to exit, anytime
              </h3>
              <p className="text-gray-600 text-sm">
                opTrade is a skill-based gaming platform that gives you full
                control over your choices. Just like in any strategy or game,
                opTrade allows you to exit an event if it's not aligning with
                your expectations, helping you make smarter decisions.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <div className="text-2xl">18+</div>
              </div>
              <h3 className="text-xl font-semibold mb-4">
                The pulse of society is on opTrade
              </h3>
              <p className="text-gray-600 text-sm">
                Beyond sharpening your decision-making skills, opTrade helps you
                tap into collective market sentiment. Gain insights into what
                people are thinking, analyze trends, and engage with events in a
                responsible way.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* News Section */}
      <section className="py-12 sm:py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 sm:mb-6 leading-tight">
              <span className="text-3xl sm:text-4xl md:text-6xl lg:text-8xl text-purple-400 font-normal">
                ❝❝
              </span>
              <span className="block mt-2 sm:mt-4">
                News that creates trading
              </span>
              <span className="block">opportunity, everyday</span>
              <span className="text-3xl sm:text-4xl md:text-6xl lg:text-8xl text-purple-400 font-normal ml-2 sm:ml-4">
                ❞❞
              </span>
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {/* Nazar */}
            <div className="group text-center cursor-pointer transform transition-all duration-500 hover:scale-105">
              <div className="relative mb-4">
                <div className="w-32 h-32 sm:w-40 sm:h-40 mx-auto relative">
                  {/* Purple background circle */}
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-300 to-purple-400 rounded-full transform transition-all duration-500 group-hover:scale-110 group-hover:rotate-6"></div>
                  {/* Person image placeholder */}
                  <div className="absolute inset-3 sm:inset-4 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full overflow-hidden shadow-xl">
                    <div className="w-full h-full flex items-center justify-center relative">
                      {/* News/Eye icon background */}
                      <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-blue-600 opacity-20"></div>
                      <div className="relative z-10 flex flex-col items-center">
                        <div className="text-2xl sm:text-3xl mb-1 sm:mb-2">
                          📺
                        </div>
                        <div className="text-xs text-blue-800 font-semibold">
                          NEWS
                        </div>
                      </div>
                      {/* Decorative elements */}
                      <div className="absolute top-3 sm:top-4 right-3 sm:right-4 w-2 h-2 sm:w-3 sm:h-3 bg-red-400 rounded-full animate-pulse"></div>
                      <div className="absolute bottom-4 sm:bottom-6 left-4 sm:left-6 w-1.5 h-1.5 sm:w-2 sm:h-2 bg-blue-600 rounded-full"></div>
                    </div>
                  </div>
                  {/* Floating elements */}
                  <div className="absolute -top-2 -right-2 w-6 h-6 sm:w-8 sm:h-8 bg-orange-400 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-500 transform group-hover:animate-bounce">
                    <div className="w-full h-full flex items-center justify-center text-white text-xs sm:text-sm">
                      📰
                    </div>
                  </div>
                </div>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4 text-gray-900 group-hover:text-purple-600 transition-colors duration-300">
                Nazar
              </h3>
              <p className="text-sm sm:text-base text-gray-600 leading-relaxed group-hover:text-gray-800 transition-colors duration-300 px-2">
                Keep an eye on the happenings around you. Be it Politics,
                Sports, Entertainment and more.
              </p>
              <div className="mt-3 sm:mt-4 opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-2 group-hover:translate-y-0">
                <span className="inline-block px-3 sm:px-4 py-1.5 sm:py-2 bg-purple-100 text-purple-700 rounded-full text-xs sm:text-sm font-medium">
                  देखो और जानो
                </span>
              </div>
            </div>

            {/* Khabar */}
            <div className="group text-center cursor-pointer transform transition-all duration-500 hover:scale-105">
              <div className="relative mb-4">
                <div className="w-32 h-32 sm:w-40 sm:h-40 mx-auto relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-300 to-purple-400 rounded-full transform transition-all duration-500 group-hover:scale-110 group-hover:rotate-6"></div>
                  <div className="absolute inset-3 sm:inset-4 bg-gradient-to-br from-green-100 to-green-200 rounded-full overflow-hidden shadow-xl">
                    <div className="w-full h-full flex items-center justify-center relative">
                      {/* Analysis/Chart background */}
                      <div className="absolute inset-0 bg-gradient-to-br from-green-400 to-green-600 opacity-20"></div>
                      <div className="relative z-10 flex flex-col items-center">
                        <div className="text-2xl sm:text-3xl mb-1 sm:mb-2">
                          📊
                        </div>
                        <div className="text-xs text-green-800 font-semibold">
                          ANALYZE
                        </div>
                      </div>
                      {/* Chart lines */}
                      <div className="absolute bottom-3 sm:bottom-4 left-3 sm:left-4 right-3 sm:right-4 flex items-end space-x-1">
                        <div className="w-1 h-3 sm:h-4 bg-green-500 rounded-t"></div>
                        <div className="w-1 h-4 sm:h-6 bg-green-600 rounded-t"></div>
                        <div className="w-1 h-2 sm:h-3 bg-green-500 rounded-t"></div>
                        <div className="w-1 h-3 sm:h-5 bg-green-600 rounded-t"></div>
                      </div>
                    </div>
                  </div>
                  <div className="absolute -top-2 -left-2 w-6 h-6 sm:w-8 sm:h-8 bg-blue-400 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-500 transform group-hover:animate-bounce">
                    <div className="w-full h-full flex items-center justify-center text-white text-xs sm:text-sm">
                      📊
                    </div>
                  </div>
                </div>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4 text-gray-900 group-hover:text-purple-600 transition-colors duration-300">
                Khabar
              </h3>
              <p className="text-sm sm:text-base text-gray-600 leading-relaxed group-hover:text-gray-800 transition-colors duration-300 px-2">
                Understand the news without the noise. Get to the crux of every
                matter and develop an opinion.
              </p>
              <div className="mt-3 sm:mt-4 opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-2 group-hover:translate-y-0">
                <span className="inline-block px-3 sm:px-4 py-1.5 sm:py-2 bg-blue-100 text-blue-700 rounded-full text-xs sm:text-sm font-medium">
                  समझो और विश्लेषण करो
                </span>
              </div>
            </div>

            {/* Jigar */}
            <div className="group text-center cursor-pointer transform transition-all duration-500 hover:scale-105">
              <div className="relative mb-4">
                <div className="w-40 h-40 mx-auto relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-300 to-purple-400 rounded-full transform transition-all duration-500 group-hover:scale-110 group-hover:rotate-6"></div>
                  <div className="absolute inset-4 bg-gradient-to-br from-orange-100 to-orange-200 rounded-full overflow-hidden shadow-xl">
                    <div className="w-full h-full flex items-center justify-center relative">
                      {/* Courage/Investment background */}
                      <div className="absolute inset-0 bg-gradient-to-br from-orange-400 to-red-500 opacity-20"></div>
                      <div className="relative z-10 flex flex-col items-center">
                        <div className="text-3xl mb-2">💪</div>
                        <div className="text-xs text-orange-800 font-semibold">
                          INVEST
                        </div>
                      </div>
                      {/* Bull market trend */}
                      <div className="absolute bottom-4 left-4 right-4">
                        <svg className="w-full h-6" viewBox="0 0 60 20">
                          <path
                            d="M0,15 Q15,10 30,8 T60,5"
                            stroke="#f97316"
                            strokeWidth="2"
                            fill="none"
                            className="animate-pulse"
                          />
                        </svg>
                      </div>
                      {/* Coins */}
                      <div className="absolute top-3 right-3 w-4 h-4 bg-yellow-400 rounded-full flex items-center justify-center">
                        <div className="text-xs">₹</div>
                      </div>
                    </div>
                  </div>
                  <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-green-400 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-500 transform group-hover:animate-bounce">
                    <div className="w-full h-full flex items-center justify-center text-white text-sm">
                      💪
                    </div>
                  </div>
                </div>
              </div>
              <h3 className="text-2xl font-bold mb-4 text-gray-900 group-hover:text-purple-600 transition-colors duration-300">
                Jigar
              </h3>
              <p className="text-gray-600 leading-relaxed group-hover:text-gray-800 transition-colors duration-300">
                Have the courage to stand by your opinions about upcoming world
                events by investing in them.
              </p>
              <div className="mt-4 opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-2 group-hover:translate-y-0">
                <span className="inline-block px-4 py-2 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                  हिम्मत करो और निवेश करो
                </span>
              </div>
            </div>

            {/* Sabar */}
            <div className="group text-center cursor-pointer transform transition-all duration-500 hover:scale-105">
              <div className="relative mb-4">
                <div className="w-40 h-40 mx-auto relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-300 to-purple-400 rounded-full transform transition-all duration-500 group-hover:scale-110 group-hover:rotate-6"></div>
                  <div className="absolute inset-4 bg-gradient-to-br from-indigo-100 to-indigo-200 rounded-full overflow-hidden shadow-xl">
                    <div className="w-full h-full flex items-center justify-center relative">
                      {/* Patience/Time background */}
                      <div className="absolute inset-0 bg-gradient-to-br from-indigo-400 to-purple-500 opacity-20"></div>
                      <div className="relative z-10 flex flex-col items-center">
                        <div className="text-3xl mb-2">⏳</div>
                        <div className="text-xs text-indigo-800 font-semibold">
                          WAIT
                        </div>
                      </div>
                      {/* Clock face */}
                      <div className="absolute top-4 right-4 w-8 h-8 border-2 border-indigo-400 rounded-full flex items-center justify-center">
                        <div className="w-1 h-3 bg-indigo-600 rounded-full transform rotate-45 absolute"></div>
                        <div className="w-1 h-2 bg-indigo-800 rounded-full absolute"></div>
                      </div>
                      {/* Meditation lines */}
                      <div className="absolute bottom-6 left-6 right-6 space-y-1">
                        <div className="w-full h-0.5 bg-indigo-300 rounded opacity-60"></div>
                        <div className="w-3/4 h-0.5 bg-indigo-400 rounded opacity-80"></div>
                        <div className="w-1/2 h-0.5 bg-indigo-500 rounded"></div>
                      </div>
                    </div>
                  </div>
                  <div className="absolute -bottom-2 -left-2 w-8 h-8 bg-yellow-400 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-500 transform group-hover:animate-bounce">
                    <div className="w-full h-full flex items-center justify-center text-white text-sm">
                      ⏰
                    </div>
                  </div>
                </div>
              </div>
              <h3 className="text-2xl font-bold mb-4 text-gray-900 group-hover:text-purple-600 transition-colors duration-300">
                Sabar
              </h3>
              <p className="text-gray-600 leading-relaxed group-hover:text-gray-800 transition-colors duration-300">
                Have the patience to negotiate market ups and downs, and take a
                decision as events unfold.
              </p>
              <div className="mt-4 opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-2 group-hover:translate-y-0">
                <span className="inline-block px-4 py-2 bg-yellow-100 text-yellow-700 rounded-full text-sm font-medium">
                  धैर्य रखो और सफल हो
                </span>
              </div>
            </div>
          </div>

          {/* Interactive bottom section */}
          <div className="mt-12 text-center">
            <div className="inline-flex items-center space-x-4 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full px-8 py-4 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
              <div className="flex space-x-2">
                <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                <div
                  className="w-2 h-2 bg-white rounded-full animate-pulse"
                  style={{ animationDelay: "0.5s" }}></div>
                <div
                  className="w-2 h-2 bg-white rounded-full animate-pulse"
                  style={{ animationDelay: "1s" }}></div>
              </div>
              <span className="font-semibold">
                हर दिन नए अवसर • Every day, new opportunities
              </span>
              <div className="text-2xl">🚀</div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="bg-gray-900 text-white py-12 sm:py-16 lg:py-20 relative overflow-hidden">
        {/* Animated background */}
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-purple-600/20 rounded-full filter blur-3xl animate-blob"></div>
          <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-blue-600/20 rounded-full filter blur-3xl animate-blob animation-delay-2000"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-8 sm:mb-12 leading-tight animate-fadeInUp">
            <span className="inline-block hover:scale-105 transition-transform duration-300">
              What
            </span>{" "}
            <span className="inline-block hover:scale-105 transition-transform duration-300">
              will
            </span>{" "}
            <span className="inline-block hover:scale-105 transition-transform duration-300">
              be
            </span>{" "}
            <span className="inline-block hover:scale-105 transition-transform duration-300">
              the
            </span>{" "}
            <span className="inline-block hover:scale-105 transition-transform duration-300 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400">
              return
            </span>
            <br />
            <span className="inline-block hover:scale-105 transition-transform duration-300">
              on
            </span>{" "}
            <span className="inline-block hover:scale-105 transition-transform duration-300">
              your
            </span>{" "}
            <span className="inline-block hover:scale-105 transition-transform duration-300 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-green-400">
              opinions
            </span>
            ?
          </h2>
          <button className="bg-transparent border-2 border-white text-white px-6 sm:px-8 py-3 sm:py-4 rounded-full text-base sm:text-lg font-semibold hover:bg-white hover:text-gray-900 hover:scale-110 hover:shadow-2xl transition-all duration-300 transform active:scale-95 group animate-fadeInUp animation-delay-400 relative overflow-hidden">
            <span className="relative z-10 group-hover:animate-pulse">
              Download App
            </span>
            <span className="ml-2 relative z-10 group-hover:translate-x-2 transition-transform duration-300">
              →
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-blue-500 opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
            <div className="absolute -top-2 -right-2 w-4 h-4 bg-green-400 rounded-full opacity-0 group-hover:opacity-100 group-hover:animate-ping transition-all duration-300"></div>
          </button>

          {/* Floating elements */}
          <div className="absolute top-1/4 left-1/4 w-6 h-6 bg-purple-400 rounded-full animate-float opacity-60"></div>
          <div className="absolute bottom-1/3 right-1/3 w-4 h-4 bg-blue-400 rounded-full animate-ping opacity-40"></div>
          <div className="absolute top-1/3 right-1/4 w-8 h-8 bg-green-400 rounded-full animate-bounce opacity-30"></div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h4 className="text-xl font-bold mb-4">Company</h4>
              <ul className="space-y-2">
                <li>
                  <Link href="#" className="hover:text-purple-400">
                    About Us
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-purple-400">
                    Culture
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-xl font-bold mb-4">Resources</h4>
              <ul className="space-y-2">
                <li>
                  <Link href="#" className="hover:text-purple-400">
                    Help Centre
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-purple-400">
                    Contact Support
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-purple-400">
                    What's New
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-xl font-bold mb-4">Careers</h4>
              <ul className="space-y-2">
                <li>
                  <Link href="#" className="hover:text-purple-400">
                    Open Roles
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-xl font-bold mb-4">Contact Us</h4>
              <p className="text-sm text-gray-400 mb-2">help@optrade.in</p>
              <p className="text-sm text-gray-400">communication@optrade.in</p>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="text-sm text-gray-400 mb-4 md:mb-0">
                © copyright 2025 by opTrade Media Technologies Pvt. Ltd.
              </div>
              <div className="flex space-x-6 text-sm">
                <Link href="#" className="text-gray-400 hover:text-white">
                  Terms and Conditions
                </Link>
                <Link href="#" className="text-gray-400 hover:text-white">
                  Privacy Policy
                </Link>
                <Link href="#" className="text-gray-400 hover:text-white">
                  Legality
                </Link>
              </div>
            </div>
            <div className="text-center mt-6">
              <p className="text-sm text-gray-400">
                <strong>Disclaimer:</strong> This game may be habit forming or
                financially risky. Play responsibly. 18+ only.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
