
import { Card, CardContent } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { HelpCircle } from "lucide-react";
import { useLocation } from "react-router-dom";

interface USDOTData {
  usdotNumber: string;
  operatingStatus: string;
  entityType: string;
  legalName: string;
  physicalAddress: string;
  powerUnits: number;
  drivers: number;
  mcs150LastUpdate: string;
  ein: string;
  mileageYear: string;
}

interface USDOTSummaryProps {
  data: USDOTData;
}

const USDOTSummary = ({ data }: USDOTSummaryProps) => {
  const location = useLocation();
  const isUCRForm = location.pathname === "/ucr";

  return (
    <Card className="bg-white/50 backdrop-blur-sm">
      <CardContent className="p-6">
        <h2 className="text-base font-semibold mb-2">USDOT#: {data.usdotNumber}</h2>
        <hr className="border-t border-gray-300 mb-4" />
        <div className="space-y-2 text-sm">
          <div>
            <span className="font-medium">Operating Status: </span>
            <span className={data.operatingStatus === "NOT AUTHORIZED" ? "text-red-500 font-semibold" : ""}>
              {data.operatingStatus}
            </span>
          </div>
          <div>
            <span className="font-medium">Entity Type: </span>
            {data.entityType}
          </div>
          <div>
            <span className="font-medium">Legal Name: </span>
            {data.legalName}
          </div>
          <div>
            <span className="font-medium">Physical Address: </span>
            {data.physicalAddress}
          </div>
          <div>
            <span className="font-medium">Power Units: </span>
            {data.powerUnits}
          </div>
          <div>
            <span className="font-medium">Drivers: </span>
            {data.drivers}
          </div>
          <div>
            <span className="font-medium">MCS-150 Last Update: </span>
            {data.mcs150LastUpdate}
          </div>
          <div>
            <span className="font-medium">EIN: </span>
            {data.ein}
          </div>
          <div>
            <span className="font-medium">Mileage (Year): </span>
            {data.mileageYear}
          </div>
          {isUCRForm && (
            <div className="flex items-center gap-2 mt-4 pt-4 border-t border-gray-200">
              <a
                href="/mcs150"
                target="_blank"
                rel="noopener noreferrer"
                className="text-accent hover:text-accent/80 hover:underline"
              >
                Update MCS-150
              </a>
              <Tooltip>
                <TooltipTrigger asChild>
                  <HelpCircle className="h-4 w-4 text-gray-500 cursor-help" />
                </TooltipTrigger>
                <TooltipContent className="max-w-[280px] text-sm">
                  The MCS-150 is the form used to apply for United States Department of Transportation (USDOT) Number. If you would like to update any of the information in this section, you must update your MCS-150 Form. You can click Update MCS-150 to be redirected to the update form.
                </TooltipContent>
              </Tooltip>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default USDOTSummary;
