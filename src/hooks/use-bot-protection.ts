
import { useState } from 'react';
import { useToast } from "@/components/ui/use-toast";

export const useBotProtection = () => {
  const [formLoadTime] = useState(Date.now());
  const [honeypot, setHoneypot] = useState("");
  const { toast } = useToast();

  const checkBotAttempt = () => {
    const submissionTime = Date.now();
    const timeElapsed = submissionTime - formLoadTime;

    // Check if submission is too fast (less than 1 second)
    if (timeElapsed < 1000) {
      console.log("Bot detection: Submission too fast");
      toast({
        title: "Error",
        description: "Unable to process request at this time",
        variant: "destructive"
      });
      return true;
    }

    // Check honeypot field
    if (honeypot) {
      console.log("Bot detection: Honeypot field filled");
      toast({
        title: "Error",
        description: "Unable to process request at this time",
        variant: "destructive"
      });
      return true;
    }

    return false;
  };

  return {
    honeypot,
    setHoneypot,
    checkBotAttempt
  };
};
