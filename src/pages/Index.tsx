
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <div className="text-center space-y-6 max-w-2xl">
        <h1 className="text-4xl font-bold text-primary">Welcome to DOT Portal</h1>
        <p className="text-gray-600 text-lg">
          Manage your DOT filings efficiently - Complete your UCR registration and MCS-150 Biennial Update in one place.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button onClick={() => navigate("/ucr")} size="lg">
            UCR Registration
          </Button>
          <Button onClick={() => navigate("/mcs150")} size="lg" variant="outline">
            MCS-150 Update
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Index;
