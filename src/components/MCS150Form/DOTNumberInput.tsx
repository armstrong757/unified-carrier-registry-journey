
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useBotProtection } from "@/hooks/use-bot-protection";
import { useNavigate } from "react-router-dom";
import { useDOTLookup } from "@/hooks/use-dot-lookup";

export const DOTNumberInput = () => {
  const [dotNumber, setDotNumber] = useState("");
  const navigate = useNavigate();
  const { honeypot, setHoneypot, checkBotAttempt } = useBotProtection();
  const { lookupDOT, isLoading } = useDOTLookup('mcs150');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // Ensure this is called immediately
    
    if (checkBotAttempt()) return;

    try {
      const result = await lookupDOT(dotNumber);
      if (result?.usdotData) {
        const usdotDataString = JSON.stringify(result.usdotData);
        sessionStorage.setItem('usdotData', usdotDataString);
        
        navigate("/mcs150", {
          state: {
            usdotData: result.usdotData,
            resumedFiling: result.resumedFiling
          },
          replace: true
        });
      }
    } catch (error) {
      console.error('Error in DOT lookup:', error);
    }
  };

  return (
    <Card className="max-w-md mx-auto p-8 bg-white shadow-lg border-0">
      <form onSubmit={handleSubmit} className="space-y-6" noValidate>
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
            {isLoading ? "Loading..." : "GET STARTED"}
          </Button>
        </div>
      </form>
    </Card>
  );
};
