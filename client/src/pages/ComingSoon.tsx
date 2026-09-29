import { useNavigate } from "react-router-dom";
import { ArrowLeft, Construction } from "lucide-react";

interface ComingSoonProps {
  name: string;
}

export default function ComingSoon({ name }: ComingSoonProps) {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center px-6">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-gray-100 rounded-full mb-6">
          <Construction size={40} className="text-gray-400" />
        </div>
        <h1 className="text-3xl font-bold text-gray-800 mb-2">{name}</h1>
        <p className="text-gray-600 mb-8">This module is coming soon. Stay tuned!</p>
        <button
          onClick={() => navigate("/")}
          className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <ArrowLeft size={20} />
          Back to Modules
        </button>
      </div>
    </div>
  );
}
