import React from "react";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "../routes";

export default function Assets() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-slate-900 text-gray-300 p-8">
      <button
        className="mb-6 text-sm text-blue-400 underline"
        onClick={() => navigate(ROUTES.liveMap)}
      >
        Back to Map
      </button>
      <h1 className="text-3xl font-black text-white mb-4">Assets</h1>
      <p className="text-sm text-gray-400">
        Assets listing and links placeholder.
      </p>
    </div>
  );
}
