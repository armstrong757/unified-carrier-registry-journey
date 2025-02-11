
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <div className="text-center space-y-6 max-w-2xl">
        <h1 className="text-4xl font-bold text-primary">Welcome to UCR Portal</h1>
        <p className="text-gray-600 text-lg">
          Register your commercial vehicles and manage your Unified Carrier Registration easily and efficiently.
        </p>
        <Button onClick={() => navigate("/ucr")} size="lg">
          Start Registration
        </Button>
      </div>
    </div>
  );
};

export default Index;
