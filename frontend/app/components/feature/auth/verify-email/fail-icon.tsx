import { XCircle } from "lucide-react";

const FailIcon = () => {
  return (
    <div className="relative mx-auto w-24 h-24 mb-6">
      {/* Outer ring animation */}
      <div className="absolute inset-0 rounded-full bg-red-100 animate-ping opacity-75"></div>

      {/* Middle ring */}
      <div className="absolute inset-2 rounded-full bg-red-200 animate-pulse"></div>

      {/* Inner circle with icon */}
      <div className="absolute inset-4 rounded-full bg-red-500 flex items-center justify-center shadow-lg">
        <XCircle className="h-12 w-12 text-white animate-scale-in" />
      </div>
    </div>
  );
};

export default FailIcon;
