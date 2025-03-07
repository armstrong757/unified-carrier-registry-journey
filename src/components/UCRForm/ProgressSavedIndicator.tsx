
import { HelpCircle } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const ProgressSavedIndicator = () => {
  return (
    <div className="mt-4 bg-white/80 rounded-lg border px-6 py-3 flex items-center gap-2 animate-fadeIn will-change-transform">
      <span className="text-[14px] text-gray-600">Your Progress is Saved</span>
      <Tooltip>
        <TooltipTrigger asChild>
          <HelpCircle className="h-4 w-4 text-gray-500 cursor-help" />
        </TooltipTrigger>
        <TooltipContent className="max-w-[280px] text-sm">
          Your progress is automatically saved as you go through the form. If you need to step away, we'll email you a link to continue where you left off.
        </TooltipContent>
      </Tooltip>
    </div>
  );
};

export default ProgressSavedIndicator;
