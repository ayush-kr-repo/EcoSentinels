import React from "react";

interface RealisticEarthProps {
  onClick?: () => void;
}

export default function RealisticEarth({ onClick }: RealisticEarthProps) {
  return (
    <div
      className="relative w-full aspect-square max-w-md mx-auto cursor-pointer"
      onClick={onClick}
    >
      {/* Earth base with real image */}
      <div
        className="absolute inset-0 rounded-full overflow-hidden"
        style={{
          backgroundImage:
            "url('https://upload.wikimedia.org/wikipedia/commons/9/97/The_Earth_seen_from_Apollo_17.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          borderRadius: "50%",
          boxShadow:
            "inset -30px -30px 60px rgba(0,0,0,0.8), inset 20px 20px 40px rgba(100,200,255,0.1), 0 0 40px rgba(0,240,255,0.4)",
          animation: "spin 60s linear infinite",
        }}
      />

      {/* Hotspot 1 */}
      <div
        className="absolute rounded-full"
        style={{
          left: "65%",
          top: "35%",
          width: "40px",
          height: "40px",
          background: "rgba(255,0,0,0.6)",
          filter: "blur(10px)",
          animation: "pulse 2s infinite",
        }}
      />

      {/* Hotspot 2 */}
      <div
        className="absolute rounded-full"
        style={{
          left: "25%",
          top: "55%",
          width: "30px",
          height: "30px",
          background: "rgba(255,165,0,0.5)",
          filter: "blur(8px)",
          animation: "pulse 3s infinite",
        }}
      />

      {/* CSS animations */}
      <style>
        {`
          @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
          @keyframes pulse {
            0% { transform: scale(1); opacity: 0.5; }
            50% { transform: scale(1.4); opacity: 0.8; }
            100% { transform: scale(1); opacity: 0.5; }
          }
        `}
      </style>
    </div>
  );
}
