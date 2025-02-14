import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Globe, FileText } from "lucide-react";
const Index = () => {
  const navigate = useNavigate();
  return <div className="min-h-screen bg-gray-50 flex flex-col items-center px-4 py-12 sm:py-16">
      <div className="w-full max-w-7xl mx-auto">
        <h1 className="text-3xl sm:text-4xl font-bold text-center text-[#517fa4] mb-16">
          We Keep Your Business On The Road
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-[720px] mx-auto">
          {/* UCR Card */}
          <div className="bg-white rounded-lg shadow-md p-6 border border-gray-100 flex flex-col items-center text-center w-full md:max-w-[350px]">
            <div className="w-16 h-16 bg-[#edf7ff]/50 rounded-lg flex items-center justify-center mb-4">
              <Globe className="w-8 h-8 text-[#517fa4]" />
            </div>
            <h2 className="text-xl font-semibold mb-2 text-zinc-950">UCR</h2>
            <p className="text-gray-600 mb-6">
              Verify your current status with Unified Carrier Registration.
            </p>
            <Button onClick={() => navigate("/ucr-filing")} className="bg-white border-2 border-[#517fa4] text-[#517fa4] hover:bg-[#517fa4] hover:text-white transition-colors">
              View Details
            </Button>
          </div>

          {/* MCS-150 Card */}
          <div className="bg-white rounded-lg shadow-md p-6 border border-gray-100 flex flex-col items-center text-center w-full md:max-w-[350px]">
            <div className="w-16 h-16 bg-[#edf7ff]/50 rounded-lg flex items-center justify-center mb-4">
              <FileText className="w-8 h-8 text-[#517fa4]" />
            </div>
            <h2 className="text-xl font-semibold mb-2 text-zinc-950">MCS-150 </h2>
            <p className="text-gray-600 mb-6">Update your USDOT and Biennial Update  with FMCSA.</p>
            <Button onClick={() => navigate("/mcs-150-filing")} className="bg-white border-2 border-[#517fa4] text-[#517fa4] hover:bg-[#517fa4] hover:text-white transition-colors">
              View Details
            </Button>
          </div>
        </div>
      </div>
    </div>;
};
export default Index;