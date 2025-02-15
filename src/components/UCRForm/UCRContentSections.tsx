import { Button } from "@/components/ui/button";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";

interface UCRContentSectionsProps {
  onScrollToTop: () => void;
}

export const UCRContentSections = ({ onScrollToTop }: UCRContentSectionsProps) => {
  return (
    <div className="space-y-8">
      <section id="what-is-ucr" className="bg-[#edf7ff]/50 p-8 rounded-xl shadow-sm">
        <h2 className="text-2xl text-gray-600 mb-6 font-semibold">What is UCR?</h2>
        <p className="text-gray-600 leading-relaxed">
          The Unified Carrier Registration (UCR) is a federally mandated program established in 2005 that requires motor carriers and businesses engaged in interstate commerce to register and pay annual fees. This program applies to all companies with an active USDOT number that transport goods across state lines.
        </p>
      </section>

      <section id="who-needs" className="bg-[#edf7ff]/50 p-8 rounded-xl shadow-sm">
        <h2 className="text-2xl text-gray-600 mb-6 font-semibold">Who Needs to Register?</h2>
        <ul className="list-disc pl-5 text-gray-600 space-y-3">
          <li>Operate commercial motor vehicles in interstate commerce</li>
          <li>Are a motor carrier (private, exempt, or for-hire)</li>
          <li>Work as a broker, freight forwarder, or leasing company</li>
          <li>Cross state lines for business, even occasionally</li>
          <li>Operate from a non-participating state but drive into participating states</li>
        </ul>
      </section>

      <section id="penalties" className="bg-[#edf7ff]/50 p-8 rounded-xl shadow-sm">
        <h2 className="text-2xl text-gray-600 mb-6 font-semibold">Non-Compliance Penalties</h2>
        <ul className="list-disc pl-5 text-gray-600 space-y-3">
          <li>Fines ranging from $100 to $5,000</li>
          <li>Vehicle detention or impoundment</li>
          <li>Potential suspension of operating authority</li>
          <li>Removal from road operations</li>
        </ul>
      </section>

      <section id="participating-states" className="bg-[#edf7ff]/50 p-8 rounded-xl shadow-sm">
        <h2 className="text-2xl text-gray-600 mb-6 font-semibold">Participating States</h2>
        <p className="text-gray-600 mb-4">Currently, 41 U.S. states participate in the UCR program</p>
        
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-3 text-gray-600">Non-participating states:</h3>
          <ul className="list-disc pl-5 text-gray-600 space-y-2">
            <li>Arizona</li>
            <li>District of Columbia</li>
            <li>Florida</li>
            <li>Hawaii</li>
            <li>Maryland</li>
            <li>New Jersey</li>
            <li>Nevada</li>
            <li>Oregon</li>
            <li>Vermont</li>
            <li>Wyoming</li>
          </ul>
        </div>

        <p className="text-gray-600 italic mb-6">
          Note: Even if based in a non-participating state, registration is required if operating in participating states.
        </p>

        <div>
          <h3 className="text-lg font-semibold mb-3 text-gray-600">Base State Selection:</h3>
          <ul className="list-disc pl-5 text-gray-600 space-y-2">
            <li>Register in your home state if it participates in UCR</li>
            <li>If your state doesn't participate, select the nearest participating state</li>
            <li>Canadian-based businesses must also comply when operating in participating states</li>
            <li>Must be completed before any interstate operations</li>
          </ul>
        </div>
      </section>

      <section id="fee-structure" className="bg-[#edf7ff]/50 p-8 rounded-xl shadow-sm">
        <h2 className="text-2xl text-gray-600 mb-6 font-semibold">Fee Structure</h2>
        <div className="space-y-6">
          <div>
            <h3 className="text-xl font-semibold mb-4 text-gray-600">UCR Filing Fee For 2025</h3>
            <div className="mt-8 border rounded-lg overflow-hidden bg-white sm:w-[53%]">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="bg-gray-50 text-[#1A1F2C] font-semibold">Truck Quantity</TableHead>
                    <TableHead className="bg-gray-50 text-[#1A1F2C] font-semibold">Price</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium">0 – 2 Trucks</TableCell>
                    <TableCell>$176.00</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">3 – 5 Trucks</TableCell>
                    <TableCell>$388.00</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">6 – 20 Trucks</TableCell>
                    <TableCell>$609.00</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">21 – 100 Trucks</TableCell>
                    <TableCell>$1,449.00</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">101 – 1,000 Trucks</TableCell>
                    <TableCell>$6,816.00</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">1,001 or more Trucks</TableCell>
                    <TableCell>Contact Us</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          </div>
        </div>
      </section>

      <div className="text-center mt-20">
        <div className="mb-[150px]">
          <Button onClick={onScrollToTop} className="bg-[#517fa4] hover:bg-[#517fa4]/90 text-white py-6 px-8 text-lg">
            File Your UCR
          </Button>
        </div>
      </div>

      <div className="max-w-4xl mx-auto text-center mb-[150px]">
        <p className="text-[#8E9196] text-xs">
          This website is not affiliated with the Unified Carrier Registration Plan. This website is operated by a private company that provides a registration service for an additional fee. You are not required to use this site to register with the UCR Plan. You may register directly with the UCR Plan at www.ucr.gov.
        </p>
      </div>
    </div>
  );
};
