
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useBotProtection } from "@/hooks/use-bot-protection";
import { useDOTLookup } from "@/hooks/use-dot-lookup";

export const UCRDOTInput = () => {
  const [dotNumber, setDotNumber] = useState("");
  const navigate = useNavigate();
  const { honeypot, setHoneypot, checkBotAttempt } = useBotProtection();
  const { lookupDOT, isLoading } = useDOTLookup('ucr');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (checkBotAttempt()) return;

    const result = await lookupDOT(dotNumber);
    if (result) {
      navigate("/ucr", {
        state: {
          usdotData: result.usdotData,
          resumedFiling: result.resumedFiling
        }
      });
    }
  };

  return (
    <Card className="max-w-md mx-auto p-8 bg-white shadow-lg border-0">
      <form onSubmit={handleSubmit} className="space-y-6">
        <h2 className="text-xl font-semibold text-center mb-6">Enter DOT Number To Start</h2>
        <Input 
          type="text" 
          placeholder="Enter USDOT Number here" 
          value={dotNumber} 
          onChange={e => setDotNumber(e.target.value)} 
          className="w-full text-lg py-6" 
          disabled={isLoading} 
        />
        <Input
          type="text"
          name="username"
          value={honeypot}
          onChange={(e) => setHoneypot(e.target.value)}
          autoComplete="off"
          tabIndex={-1}
          aria-hidden="true"
          style={{ display: 'none' }}
        />
        <div className="flex justify-center">
          <Button 
            type="submit" 
            className="bg-[#517fa4] hover:bg-[#517fa4]/90 text-white py-6 text-lg px-8" 
            disabled={isLoading || !dotNumber.trim()}
          >
            {isLoading ? "LOADING..." : "GET STARTED"}
          </Button>
        </div>
      </form>
    </Card>
  );
};
