import { useNavigate } from "react-router-dom";
import { ArrowLeft, Construction } from "lucide-react";

interface ComingSoonProps {
  name: string;
}

export default function ComingSoon({ name }: ComingSoonProps) {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="text-center px-2 sm:px-6">
        <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 bg-gray-100 rounded-full mb-4 sm:mb-6">
          <Construction className="w-8 h-8 sm:w-10 sm:h-10 text-gray-400" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">{name}</h1>
        <p className="text-sm sm:text-base text-gray-600 mb-6 sm:mb-8">This module is coming soon. Stay tuned!</p>
        <button
          onClick={() => navigate("/")}
          className="inline-flex items-center gap-2 px-5 py-2.5 sm:px-6 sm:py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm sm:text-base"
        >
          <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
          Back to Modules
        </button>
      </div>
    </div>
  );
}
