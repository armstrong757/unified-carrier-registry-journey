
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Globe, FileText } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center px-4 py-12 sm:py-16">
      <div className="w-full max-w-7xl mx-auto">
        <h1 className="text-3xl sm:text-4xl font-bold text-center text-[#6E59A5] mb-16">
          We Keep Your Business On The Road
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
          {/* UCR Card */}
          <div className="bg-white rounded-lg shadow-md p-6 border border-gray-100 flex flex-col items-center text-center">
            <div className="w-16 h-16 bg-[#9b87f5] rounded-lg flex items-center justify-center mb-4">
              <Globe className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-xl font-semibold text-[#6E59A5] mb-2">UCR</h2>
            <p className="text-gray-600 mb-6">
              Verify your current status with Unified Carrier Registration.
            </p>
            <Button 
              onClick={() => navigate("/ucr")}
              className="bg-[#7E69AB] hover:bg-[#6E59A5] text-white"
            >
              View Details
            </Button>
          </div>

          {/* MCS-150 Card */}
          <div className="bg-white rounded-lg shadow-md p-6 border border-gray-100 flex flex-col items-center text-center">
            <div className="w-16 h-16 bg-[#9b87f5] rounded-lg flex items-center justify-center mb-4">
              <FileText className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-xl font-semibold text-[#6E59A5] mb-2">
              MCS-150 BIENNIAL UPDATE
            </h2>
            <p className="text-gray-600 mb-6">
              Update your USDOT and operating authority records with FMCSA.
            </p>
            <Button 
              onClick={() => navigate("/mcs150")}
              className="bg-[#7E69AB] hover:bg-[#6E59A5] text-white"
            >
              View Details
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
