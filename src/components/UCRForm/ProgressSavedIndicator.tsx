
import { Info } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const ProgressSavedIndicator = () => {
  return (
    <div className="mt-4 bg-white/50 backdrop-blur-sm rounded-lg border p-4 flex items-center justify-center gap-2">
      <span className="text-gray-600">Your Progress is Saved</span>
      <Tooltip>
        <TooltipTrigger asChild>
          <Info className="h-4 w-4 text-gray-500 cursor-help" />
        </TooltipTrigger>
        <TooltipContent className="max-w-[280px] text-sm">
          Your progress is automatically saved as you go through the form. If you need to step away, we'll email you a link to continue where you left off.
        </TooltipContent>
      </Tooltip>
    </div>
  );
};

export default ProgressSavedIndicator;
