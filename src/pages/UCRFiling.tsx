
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";

const UCRFiling = () => {
  const [dotNumber, setDotNumber] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (dotNumber.trim()) {
      navigate("/ucr");
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-16">
        <div className="text-center space-y-8">
          <h1 className="text-4xl font-bold text-[#1A1F2C] mb-8">UCR Registration</h1>
          
          <Card className="max-w-md mx-auto p-8 bg-white shadow-lg border-0">
            <form onSubmit={handleSubmit} className="space-y-6">
              <h2 className="text-xl font-semibold text-center mb-6">Enter DOT Number To Start</h2>
              <Input
                type="text"
                placeholder="Enter USDOT Number here"
                value={dotNumber}
                onChange={(e) => setDotNumber(e.target.value)}
                className="w-full text-lg py-6"
              />
              <div className="flex justify-center">
                <Button type="submit" className="bg-[#517fa4] hover:bg-[#517fa4]/90 text-white py-6 text-lg px-8">
                  GET STARTED
                </Button>
              </div>
            </form>
          </Card>
        </div>

        <section className="space-y-12 bg-[#edf7ff]/50 p-4 sm:p-8 rounded-xl shadow-sm">
          <div>
            <h2 className="text-2xl font-bold text-[#1A1F2C] mb-6">What is UCR?</h2>
            <p className="text-gray-600 leading-relaxed">
              The Unified Carrier Registration (UCR) is a federally mandated program established in 2005 that requires motor carriers and businesses engaged in interstate commerce to register and pay annual fees. This program applies to all companies with an active USDOT number that transport goods across state lines.
            </p>
          </div>

          <Separator className="my-8" />

          <div>
            <h2 className="text-2xl font-bold text-[#1A1F2C] mb-6">Who Needs to Register?</h2>
            <ul className="list-disc pl-5 text-gray-600 space-y-3">
              <li>Operate commercial motor vehicles in interstate commerce</li>
              <li>Are a motor carrier (private, exempt, or for-hire)</li>
              <li>Work as a broker, freight forwarder, or leasing company</li>
              <li>Cross state lines for business, even occasionally</li>
              <li>Operate from a non-participating state but drive into participating states</li>
            </ul>
          </div>

          <Separator className="my-8" />

          <div>
            <h2 className="text-2xl font-bold text-[#1A1F2C] mb-6">Penalties for Non-Compliance:</h2>
            <ul className="list-disc pl-5 text-gray-600 space-y-3">
              <li>Fines ranging from $100 to $5,000</li>
              <li>Vehicle detention or impoundment</li>
              <li>Potential suspension of operating authority</li>
              <li>Removal from road operations</li>
            </ul>
          </div>

          <Separator className="my-8" />

          <div>
            <h2 className="text-2xl font-bold text-[#1A1F2C] mb-6">Fee Structure:</h2>
            <ul className="list-disc pl-5 text-gray-600 space-y-3">
              <li>Based on fleet size</li>
              <li>Fees support:
                <ul className="list-disc pl-5 mt-3 space-y-2">
                  <li>State enforcement programs</li>
                  <li>Road maintenance</li>
                  <li>Highway safety initiatives</li>
                  <li>State motor carrier registration programs</li>
                </ul>
              </li>
            </ul>
          </div>

          <Separator className="my-8" />

          <div>
            <h2 className="text-2xl font-bold text-[#1A1F2C] mb-6">Legal Framework</h2>
            <p className="text-gray-600 mb-4">The UCR program operates under:</p>
            <ul className="list-disc pl-5 text-gray-600 space-y-3">
              <li>Unified Carrier Registration Act of 2005</li>
              <li>Code of Federal Regulations Title 49 Section 367</li>
              <li>Federal Motor Carrier Safety Administration (FMCSA) oversight</li>
            </ul>
          </div>

          <Separator className="my-8" />

          <div>
            <h2 className="text-2xl font-bold text-[#1A1F2C] mb-6">Participating States</h2>
            <p className="text-gray-600 mb-6">Currently, 41 U.S. states participate in the UCR program</p>
            <p className="font-semibold mb-4">Non-participating states:</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-6">
              <div className="space-y-2">
                <p className="text-gray-600">Arizona</p>
                <p className="text-gray-600">District of Columbia</p>
                <p className="text-gray-600">Florida</p>
                <p className="text-gray-600">Hawaii</p>
              </div>
              <div className="space-y-2">
                <p className="text-gray-600">Maryland</p>
                <p className="text-gray-600">New Jersey</p>
                <p className="text-gray-600">Nevada</p>
              </div>
              <div className="space-y-2">
                <p className="text-gray-600">Oregon</p>
                <p className="text-gray-600">Vermont</p>
                <p className="text-gray-600">Wyoming</p>
              </div>
            </div>
            <p className="text-gray-600 italic bg-white p-4 rounded-lg">
              Note: Even if based in a non-participating state, registration is required if operating in participating states.
            </p>
          </div>
        </section>

        {/* Fee Structure Table Section */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-[#1A1F2C] mb-4 px-4 sm:px-8">UCR Filing Fee For 2025</h2>
          <p className="text-gray-600 leading-relaxed px-4 sm:px-8">
            Register for the <span className="font-medium">Unified Carrier Registration Plan</span> based on your fleet size to contribute to funding highway safety initiatives. Annual fees, due by December 31st, support state enforcement, road maintenance, and driving safety. New drivers or companies must pay before their first interstate trip to avoid fines and impoundment. Secure your <span className="italic font-semibold">UCR Registration</span> to travel freely across the United States and beyond!
          </p>
          
          <div className="mt-8 border rounded-lg overflow-hidden w-full sm:w-[50%] mx-auto sm:mx-8">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="bg-gray-50 text-[#1A1F2C] font-semibold">Truck Quantity</TableHead>
                  <TableHead className="bg-gray-50 text-[#1A1F2C] font-semibold">Price</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell className="font-medium">1 – 2 Trucks</TableCell>
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
                  <TableCell>$1449.00</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">100+ Trucks</TableCell>
                  <TableCell>Contact Us</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>

          <div className="text-center mt-16">
            <Button 
              onClick={scrollToTop}
              className="bg-[#517fa4] hover:bg-[#517fa4]/90 text-white py-6 px-8 text-lg"
            >
              File Your UCR
            </Button>
          </div>
        </div>

        {/* UCR Disclaimer */}
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-[#8E9196] text-xs">
            This website is not affiliated with the Unified Carrier Registration Plan. This website is operated by a private company that provides a private registration service for an additional fee. You are not required to use this site to register with the UCR Plan. You may register directly with the UCR Plan at www.ucr.gov.
          </p>
        </div>
      </div>
    </div>
  );
};

export default UCRFiling;
