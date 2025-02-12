
import { Card, CardContent } from "@/components/ui/card";

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
  return (
    <Card className="bg-white/50 backdrop-blur-sm">
      <CardContent className="p-6">
        <h2 className="text-lg font-semibold mb-4">USDOT#: {data.usdotNumber}</h2>
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
        </div>
      </CardContent>
    </Card>
  );
};

export default USDOTSummary;
