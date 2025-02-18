
import { Card, CardContent } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { HelpCircle } from "lucide-react";
import { useLocation, Link } from "react-router-dom";
import { USDOTData } from "@/types/filing";

interface USDOTSummaryProps {
  data: USDOTData;
}

const USDOTSummary = ({ data }: USDOTSummaryProps) => {
  const location = useLocation();
  const isUCRForm = location.pathname === "/ucr";

  // Helper function to format large numbers with commas
  const formatNumber = (num: number) => {
    if (!num) return '0';
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  // Format the mileage year string
  const getMileageYear = () => {
    const hasMileage = Boolean(data.mcs150Mileage);
    const hasYear = Boolean(data.mcs150Year);

    if (hasMileage && hasYear) {
      return `${formatNumber(data.mcs150Mileage)} (${data.mcs150Year})`;
    }
    if (hasMileage) {
      return formatNumber(data.mcs150Mileage);
    }
    if (hasYear) {
      return `0 (${data.mcs150Year})`;
    }
    return 'Not Available';
  };

  return (
    <Card className="bg-white/80 animate-fadeIn will-change-transform">
      <CardContent className="p-6">
        <h2 className="text-base font-semibold mb-4">USDOT#: {data.usdotNumber}</h2>
        <hr className="border-t border-gray-300 my-4" />
        <div className="space-y-2 text-sm">
          <div>
            <span className="font-medium">Entity Type: </span>
            {data.entityType || 'Not Available'}
          </div>
          <div>
            <span className="font-medium">Legal Name: </span>
            {data.legalName || 'Not Available'}
          </div>
          {data.dbaName && (
            <div>
              <span className="font-medium">DBA Name: </span>
              {data.dbaName}
            </div>
          )}
          <div>
            <span className="font-medium">Physical Address: </span>
            {data.physicalAddress || 'Not Available'}
          </div>
          <div>
            <span className="font-medium">Power Units: </span>
            {typeof data.powerUnits === 'number' ? data.powerUnits : 'Not Available'}
          </div>
          <div>
            <span className="font-medium">Drivers: </span>
            {typeof data.drivers === 'number' ? data.drivers : 'Not Available'}
          </div>
          {data.busCount > 0 && (
            <div>
              <span className="font-medium">Buses: </span>
              {data.busCount}
            </div>
          )}
          {data.limoCount > 0 && (
            <div>
              <span className="font-medium">Limousines: </span>
              {data.limoCount}
            </div>
          )}
          {data.minibusCount > 0 && (
            <div>
              <span className="font-medium">Mini Buses: </span>
              {data.minibusCount}
            </div>
          )}
          {data.motorcoachCount > 0 && (
            <div>
              <span className="font-medium">Motor Coaches: </span>
              {data.motorcoachCount}
            </div>
          )}
          {data.vanCount > 0 && (
            <div>
              <span className="font-medium">Vans: </span>
              {data.vanCount}
            </div>
          )}
          {data.complaintCount > 0 && (
            <div>
              <span className="font-medium">Complaints: </span>
              <span className="text-amber-600">{data.complaintCount}</span>
            </div>
          )}
          {data.outOfService && (
            <div className="text-red-500">
              <span className="font-medium">Out of Service</span>
              {data.outOfServiceDate && ` since ${data.outOfServiceDate}`}
            </div>
          )}
          {data.mcNumber && (
            <div>
              <span className="font-medium">MC Number: </span>
              {data.mcNumber}
            </div>
          )}
          <div>
            <span className="font-medium">MCS-150 Last Update: </span>
            {data.mcs150Date ? data.mcs150Date : 'Not Available'}
          </div>
          <div>
            <span className="font-medium">Mileage (Year): </span>
            {getMileageYear()}
          </div>

          {isUCRForm && (
            <div className="border-t border-gray-200 mt-8 pt-4">
              <div className="flex items-center gap-2">
                <Link
                  to="/mcs150"
                  state={{ usdotData: data, from: 'ucr' }}
                  className="text-accent hover:text-accent/80 hover:underline"
                >
                  Update MCS-150
                </Link>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <HelpCircle className="h-4 w-4 text-gray-500 cursor-help" />
                  </TooltipTrigger>
                  <TooltipContent className="max-w-[280px] text-sm">
                    The MCS-150 is the form used to apply for United States Department of Transportation (USDOT) Number. If you would like to update any of the information in this section, you must update your MCS-150 Form. You can click Update MCS-150 to be redirected to the update form.
                  </TooltipContent>
                </Tooltip>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default USDOTSummary;
