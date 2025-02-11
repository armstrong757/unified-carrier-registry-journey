
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const MCS150 = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-6 sm:p-8">
          <h1 className="text-3xl font-bold text-primary mb-4 text-center">
            MCS-150 Biennial Update
          </h1>
          <p className="text-gray-600 text-center mb-8">
            Complete your Motor Carrier Identification Report and Biennial Update
          </p>
          <div className="space-y-4">
            <p className="text-gray-600">
              The MCS-150 form must be updated every two years. This filing helps maintain accurate information about your motor carrier operations.
            </p>
            <div className="text-center">
              <Button onClick={() => navigate("/")} variant="outline" className="mr-4">
                Back to Home
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MCS150;
