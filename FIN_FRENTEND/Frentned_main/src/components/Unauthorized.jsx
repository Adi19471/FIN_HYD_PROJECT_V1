import React from "react";
import { Link } from "react-router-dom";

export default function Unauthorized() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="p-8 bg-white rounded shadow text-center max-w-md">
        <h2 className="text-2xl font-bold mb-2">Unauthorized</h2>
        <p className="mb-4">You do not have permission to access this page.</p>
        <div className="flex justify-center gap-2">
          <Link to="/" className="btn bg-gray-900 text-white">
            Go Home
          </Link>
          <Link to="/login" className="btn bg-blue-600 text-white">
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
}
